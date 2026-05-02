export const CONTENT = `
      <p>Scheduling systems decide what runs where, when, and with what resources. Get scheduling right and your nodes are evenly utilised, your jobs survive failures, and your noisy neighbours stay quiet. Get it wrong and you end up with thrashing pods, starved background workers, and a Kubernetes cluster that runs at 30% utilisation while telling you it has no room.</p>

      <p>This guide is the practitioner&apos;s walk through the scheduling algorithms and systems that matter in production: the Kubernetes scheduler internals, distributed cron, queue-based job orchestration with Airflow and Nomad, the bin-packing and fairness algorithms underneath, and the failure modes that determine whether your workloads survive node failure. Examples are grounded in real Kubernetes scheduler code paths, Airflow DAG semantics, and the operational lessons that come from running these systems at scale.</p>

      <h2>The Scheduling Problem</h2>

      <p>Every scheduler is solving the same shape of problem: <em>given a set of pending tasks and a set of available resources, decide which task runs on which resource, in what order, with what priority</em>. The variations are in what counts as a &quot;task&quot; (a Kubernetes pod, an Airflow operator, a Spark stage), what counts as a &quot;resource&quot; (a node, a worker pool, an executor slot), and what counts as &quot;optimal&quot; (lowest latency, highest packing, fairest distribution).</p>

      <p>Scheduling is hard because the problem is inherently combinatorial &mdash; bin packing is NP-hard &mdash; and because the inputs change continuously. New work arrives, nodes fail, priorities shift, resource limits get hit. Real schedulers make local greedy decisions that approximate the global optimum and re-evaluate continuously.</p>

      <h2>The Kubernetes Scheduler in Depth</h2>

      <p>The Kubernetes scheduler (kube-scheduler) is the most studied production scheduler in modern infrastructure. Every pod creation triggers a scheduling cycle that follows a strict two-phase shape: <strong>filter</strong> the nodes that can run the pod, then <strong>score</strong> the surviving nodes to pick the best.</p>

      <h3>Filter Plugins (Predicates)</h3>

      <p>Filter plugins reject nodes that cannot run the pod. The defaults include:</p>
      <ul>
        <li><strong>NodeResourcesFit</strong>: does the node have enough CPU, memory, ephemeral storage, and pod count?</li>
        <li><strong>NodeUnschedulable</strong>: is the node cordoned?</li>
        <li><strong>NodeAffinity</strong>: does the pod&apos;s nodeSelector and nodeAffinity match the node&apos;s labels?</li>
        <li><strong>TaintToleration</strong>: does the pod tolerate any NoSchedule taints on the node?</li>
        <li><strong>VolumeBinding</strong>: are the requested PVCs bindable to volumes on this node?</li>
        <li><strong>PodTopologySpread</strong>: would scheduling here violate spread constraints (e.g. across AZs)?</li>
        <li><strong>InterPodAffinity</strong>: does the node satisfy the pod&apos;s required pod (anti-)affinity?</li>
      </ul>

      <h3>Score Plugins (Priorities)</h3>

      <p>For nodes that pass all filters, score plugins rank them. Each plugin returns a score 0&ndash;100; the plugin&apos;s weight determines how much its score contributes to the total. Defaults include:</p>
      <ul>
        <li><strong>NodeResourcesFit (score)</strong>: prefers nodes with the right balance of utilization. Two strategies: <em>LeastAllocated</em> (spread) and <em>MostAllocated</em> (pack). The default is a balanced score that prefers nodes where CPU and memory utilisation are similar.</li>
        <li><strong>InterPodAffinity</strong>: prefers nodes that satisfy preferred pod affinity (vs required, which is a filter).</li>
        <li><strong>NodeAffinity</strong>: prefers nodes matching preferredDuringScheduling node affinity.</li>
        <li><strong>ImageLocality</strong>: prefers nodes that already have the container image cached &mdash; saves pull time.</li>
        <li><strong>PodTopologySpread</strong>: prefers nodes that spread pods across topology domains (zones, hosts).</li>
        <li><strong>TaintToleration (score)</strong>: prefers nodes with fewer PreferNoSchedule taints that the pod tolerates.</li>
      </ul>

      <p>The winning node is the one with the highest weighted score. Ties are broken randomly.</p>

      <svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kubernetes scheduler flow showing pending pod, filter and score phases, and binding to a node">
        <rect width="800" height="380" fill="#0f172a" rx="12"/>
        <text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="700">KUBERNETES SCHEDULER FLOW</text>
        <rect x="40" y="60" width="120" height="50" rx="6" fill="#1e293b" stroke="#3b82f6"/>
        <text x="100" y="80" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="700">Pending Pod</text>
        <text x="100" y="98" text-anchor="middle" fill="#94a3b8" font-size="9">in scheduling queue</text>
        <line x1="160" y1="85" x2="200" y2="85" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#schArr)"/>
        <rect x="200" y="60" width="160" height="50" rx="6" fill="#fbbf24" fill-opacity="0.15" stroke="#fbbf24"/>
        <text x="280" y="80" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="700">FILTER (predicates)</text>
        <text x="280" y="98" text-anchor="middle" fill="#94a3b8" font-size="9">resource fit, affinity, taints</text>
        <line x1="360" y1="85" x2="400" y2="85" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#schArr)"/>
        <rect x="400" y="60" width="160" height="50" rx="6" fill="#22c55e" fill-opacity="0.15" stroke="#22c55e"/>
        <text x="480" y="80" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">SCORE (priorities)</text>
        <text x="480" y="98" text-anchor="middle" fill="#94a3b8" font-size="9">image locality, balance, spread</text>
        <line x1="560" y1="85" x2="600" y2="85" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#schArr)"/>
        <rect x="600" y="60" width="160" height="50" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6"/>
        <text x="680" y="80" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="700">BIND</text>
        <text x="680" y="98" text-anchor="middle" fill="#94a3b8" font-size="9">write Pod.spec.nodeName</text>
        <text x="400" y="160" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="700">CLUSTER NODES</text>
        <rect x="80" y="180" width="100" height="80" rx="6" fill="#1e293b" stroke="#94a3b8"/>
        <text x="130" y="202" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">Node A</text>
        <text x="130" y="220" text-anchor="middle" fill="#fca5a5" font-size="9">FAIL: CPU full</text>
        <rect x="200" y="180" width="100" height="80" rx="6" fill="#1e293b" stroke="#94a3b8"/>
        <text x="250" y="202" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">Node B</text>
        <text x="250" y="220" text-anchor="middle" fill="#fca5a5" font-size="9">FAIL: taint</text>
        <rect x="320" y="180" width="100" height="80" rx="6" fill="#1e293b" stroke="#22c55e"/>
        <text x="370" y="202" text-anchor="middle" fill="#86efac" font-size="10" font-weight="700">Node C</text>
        <text x="370" y="220" text-anchor="middle" fill="#86efac" font-size="9">PASS</text>
        <text x="370" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">score 78</text>
        <rect x="440" y="180" width="100" height="80" rx="6" fill="#1e293b" stroke="#22c55e"/>
        <text x="490" y="202" text-anchor="middle" fill="#86efac" font-size="10" font-weight="700">Node D</text>
        <text x="490" y="220" text-anchor="middle" fill="#86efac" font-size="9">PASS</text>
        <text x="490" y="240" text-anchor="middle" fill="#86efac" font-size="9" font-weight="700">score 92 &check;</text>
        <rect x="560" y="180" width="100" height="80" rx="6" fill="#1e293b" stroke="#22c55e"/>
        <text x="610" y="202" text-anchor="middle" fill="#86efac" font-size="10" font-weight="700">Node E</text>
        <text x="610" y="220" text-anchor="middle" fill="#86efac" font-size="9">PASS</text>
        <text x="610" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">score 81</text>
        <rect x="680" y="180" width="100" height="80" rx="6" fill="#1e293b" stroke="#94a3b8"/>
        <text x="730" y="202" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">Node F</text>
        <text x="730" y="220" text-anchor="middle" fill="#fca5a5" font-size="9">FAIL: affinity</text>
        <line x1="490" y1="260" x2="490" y2="295" stroke="#22c55e" stroke-width="2" marker-end="url(#schArr)"/>
        <rect x="350" y="295" width="280" height="50" rx="6" fill="#22c55e" fill-opacity="0.15" stroke="#22c55e"/>
        <text x="490" y="316" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">Pod scheduled to Node D</text>
        <text x="490" y="334" text-anchor="middle" fill="#94a3b8" font-size="9">kubelet pulls image, starts container</text>
        <defs>
          <marker id="schArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/>
          </marker>
        </defs>
      </svg>

      <h3>Preemption</h3>

      <p>If no node fits the pod after filtering, the scheduler may <strong>preempt</strong> lower-priority pods to make room. Each pod can have a <code>priorityClassName</code> referencing a PriorityClass with an integer priority. When scheduling fails, the scheduler considers evicting lower-priority pods on candidate nodes such that the new pod fits.</p>

      <p>Preemption is gated by PodDisruptionBudgets (the scheduler tries to respect them but may violate them as a last resort), graceful termination periods, and explicit non-preempting policies. Critical system pods (kube-system) typically use the <code>system-cluster-critical</code> and <code>system-node-critical</code> PriorityClasses with very high priorities &mdash; they almost never get preempted.</p>

      <h3>Pod Topology Spread</h3>

      <p>One of the most consequential scheduler features for production reliability. Topology spread constraints tell the scheduler to distribute pods evenly across topology domains (typically AZs). Without it, the scheduler might pack three replicas of a critical service onto one zone &mdash; an AZ outage takes them all down.</p>

      <pre><code>spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels: { app: payments-api }</code></pre>

      <p><code>maxSkew: 1</code> means the difference between the most-loaded and least-loaded zone for this label cannot exceed 1. <code>whenUnsatisfiable: ScheduleAnyway</code> is a soft constraint (preferred but not required); use <code>DoNotSchedule</code> for hard. Most production deployments use spread on both zone (HA) and node (anti-affinity).</p>

      <h3>Custom Schedulers and Scheduling Frameworks</h3>

      <p>The Kubernetes Scheduling Framework (KEP-624, GA in 1.19) lets you write plugins that hook into specific extension points (PreFilter, Filter, PostFilter, PreScore, Score, PreBind, Bind) without forking the scheduler. Used for: GPU-aware scheduling, gang scheduling for ML workloads, custom anti-affinity logic, cost-aware scheduling.</p>

      <p>Real custom schedulers in production: Volcano (gang scheduling for batch ML), Yunikorn (Apache, multi-tenant resource fairness), Karmada (cross-cluster scheduling), and the GCP / Azure cost-optimised schedulers. Most teams stick with the default scheduler and tune via priorities, affinities, and taints &mdash; custom schedulers carry significant operational cost.</p>

      <h2>Bin Packing and Resource Allocation</h2>

      <p>The fundamental scheduling sub-problem is bin packing: given items of various sizes, pack them into bins (nodes) of fixed capacity. NP-hard in general; real schedulers use heuristics that approximate the optimum:</p>

      <ul>
        <li><strong>First-fit</strong>: place each item in the first bin it fits. Fast, decent packing.</li>
        <li><strong>Best-fit</strong>: place each item in the bin with the least remaining capacity that still fits. Better packing, more compute.</li>
        <li><strong>First-fit decreasing</strong>: sort items by size descending, then first-fit. Within ~22% of optimal in the worst case &mdash; the standard production heuristic.</li>
        <li><strong>Worst-fit</strong>: place each item in the bin with the most remaining capacity. Spreads load; useful when you want utilisation balance over packing density.</li>
      </ul>

      <p>Kubernetes&apos; default <code>NodeResourcesFit</code> score is balanced &mdash; it prefers nodes where CPU and memory utilisation are similar (balanced allocation) but does not aggressively pack. The opt-in <code>MostAllocated</code> strategy approximates first-fit-decreasing, packing pods onto nodes to leave others empty for autoscaler scale-down.</p>

      <p>Real production lesson: pure bin packing fights against resilience. Tightly packed nodes have no headroom for the next pod or for memory spikes. Spread-out nodes are robust but waste money. The right answer depends on whether your cluster autoscaler is aggressive enough to recover the &quot;waste&quot; nodes &mdash; if it is, packing wins; if it is not, spreading wins.</p>

      <h2>Distributed Cron and Periodic Jobs</h2>

      <p>Scheduling jobs that should run periodically (every minute, hourly, nightly) is harder than it looks at scale. Single-node cron is reliable on one machine but does not survive that machine going down. Running cron on every node duplicates work. Running it on a designated leader node creates a single point of failure.</p>

      <p>The robust pattern: <strong>distributed coordination via lease</strong>. The job framework runs on multiple nodes; each iteration starts with a lease acquisition (etcd, Zookeeper, Redis with proper fencing) for the (job, scheduled-time) tuple. Whoever wins the lease runs that iteration; everyone else does nothing. The lease has a TTL so a crashed leader does not starve the schedule.</p>

      <p>Kubernetes implements this as <strong>CronJob</strong> resources. The CronJob controller (running with leader election in kube-controller-manager) creates a Job for each scheduled iteration. The Job controller in turn ensures one Pod completes successfully. Failed Pods are retried (subject to <code>backoffLimit</code>); the next scheduled iteration creates a new Job.</p>

      <pre><code>apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-billing-rollup
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  startingDeadlineSeconds: 600
  jobTemplate:
    spec:
      backoffLimit: 4
      activeDeadlineSeconds: 7200
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: rollup
            image: registry/billing-rollup:1.42</code></pre>

      <p>The non-obvious settings:</p>
      <ul>
        <li><code>concurrencyPolicy: Forbid</code> ensures only one iteration runs at a time. The alternative <code>Allow</code> can stack iterations if jobs run longer than the schedule interval.</li>
        <li><code>startingDeadlineSeconds</code> bounds how late a missed iteration can be started. Without it, if the controller is down for an hour, all missed iterations fire when it returns.</li>
        <li><code>activeDeadlineSeconds</code> bounds total runtime per iteration. Critical for jobs that can hang.</li>
      </ul>

      <h2>Queue-Based Job Orchestration</h2>

      <p>For jobs with dependencies, fan-out, or DAG structure, plain CronJobs are not enough. The orchestration layer needs to model task graphs, retry semantics, partial failures, and observability. The dominant tools:</p>

      <h3>Apache Airflow</h3>

      <p>Airflow models workflows as <strong>Directed Acyclic Graphs</strong> (DAGs) of <strong>tasks</strong>. The scheduler parses DAGs, schedules tasks on workers, and tracks state in a database (Postgres or MySQL). Workers can be local processes (LocalExecutor), distributed Celery workers (CeleryExecutor), or Kubernetes pods (KubernetesExecutor).</p>

      <pre><code>from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

with DAG(
    dag_id="daily_etl",
    start_date=datetime(2026, 1, 1),
    schedule="0 3 * * *",
    catchup=False,
    max_active_runs=1,
    default_args={
        "retries": 3,
        "retry_delay": timedelta(minutes=5),
    },
) as dag:
    extract  = PythonOperator(task_id="extract",  python_callable=extract_data)
    validate = PythonOperator(task_id="validate", python_callable=validate_extract)
    load     = PythonOperator(task_id="load",     python_callable=load_to_warehouse)
    notify   = PythonOperator(task_id="notify",   python_callable=send_summary)

    extract &gt;&gt; validate &gt;&gt; load &gt;&gt; notify</code></pre>

      <p>Airflow excels at: complex dependencies (fan-out, fan-in, dynamic tasks), backfills (retry past dates), and observability (the UI is one of the best in the space). It struggles with: low-latency triggering (Airflow is designed for batch, not sub-second scheduling), and operational complexity at large DAG counts (the metadata database and scheduler can become bottlenecks at thousands of DAGs).</p>

      <h3>HashiCorp Nomad</h3>

      <p>Nomad is a generalist scheduler &mdash; it schedules anything, not just containers. Batch jobs, system services, periodic tasks, parameterized jobs, and dispatched jobs (one-off invocations of a job template). The scheduler uses bin-packing with anti-affinity and constraint solving.</p>

      <p>Nomad&apos;s differentiator from Kubernetes: simpler operational model, a single binary, multi-region native (federated clusters out of the box), and it can run in environments where Kubernetes is overkill (edge, IoT, simple batch farms).</p>

      <h3>Apache Mesos</h3>

      <p>Historically significant (Twitter, Apple, eBay all ran Mesos at huge scale), now in decline relative to Kubernetes. Mesos&apos; model was a two-level scheduler: a master scheduler offered resources to <strong>frameworks</strong> (Marathon, Spark, Aurora), which made their own placement decisions. Powerful but complex; Kubernetes&apos; integrated approach won the operational simplicity battle.</p>

      <h3>Custom Job Queues (Sidekiq, Celery, RQ, BullMQ)</h3>

      <p>For application-level background jobs (send an email, regenerate a thumbnail, run an import), full orchestration is overkill. Per-language job queue libraries provide: priority queues, retries with exponential backoff, dead-letter queues, scheduled jobs, and worker pools. Built on Redis (Sidekiq, RQ, BullMQ) or a dedicated broker (Celery + RabbitMQ).</p>

      <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Distributed job queue architecture showing producers, broker, workers, and dead letter queue">
        <rect width="800" height="360" fill="#0f172a" rx="12"/>
        <text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="700">DISTRIBUTED JOB QUEUE</text>
        <rect x="40" y="70" width="120" height="40" rx="6" fill="#1e293b" stroke="#3b82f6"/>
        <text x="100" y="94" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="700">Producer A</text>
        <rect x="40" y="120" width="120" height="40" rx="6" fill="#1e293b" stroke="#3b82f6"/>
        <text x="100" y="144" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="700">Producer B</text>
        <rect x="40" y="170" width="120" height="40" rx="6" fill="#1e293b" stroke="#3b82f6"/>
        <text x="100" y="194" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="700">Producer C</text>
        <line x1="160" y1="90" x2="240" y2="160" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#qArr)"/>
        <line x1="160" y1="140" x2="240" y2="170" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#qArr)"/>
        <line x1="160" y1="190" x2="240" y2="180" stroke="#3b82f6" stroke-width="1.2" marker-end="url(#qArr)"/>
        <rect x="240" y="80" width="170" height="220" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="325" y="106" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="700">Broker</text>
        <text x="325" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">(Redis / RabbitMQ)</text>
        <rect x="260" y="135" width="130" height="22" rx="3" fill="#fbbf24" fill-opacity="0.2"/>
        <text x="325" y="150" text-anchor="middle" fill="#fcd34d" font-size="9">priority queue</text>
        <rect x="260" y="160" width="130" height="22" rx="3" fill="#fbbf24" fill-opacity="0.2"/>
        <text x="325" y="175" text-anchor="middle" fill="#fcd34d" font-size="9">scheduled / delayed</text>
        <rect x="260" y="185" width="130" height="22" rx="3" fill="#fbbf24" fill-opacity="0.2"/>
        <text x="325" y="200" text-anchor="middle" fill="#fcd34d" font-size="9">retry queue (backoff)</text>
        <rect x="260" y="210" width="130" height="22" rx="3" fill="#fca5a5" fill-opacity="0.2"/>
        <text x="325" y="225" text-anchor="middle" fill="#fca5a5" font-size="9">dead letter queue</text>
        <text x="325" y="252" text-anchor="middle" fill="#94a3b8" font-size="9">visibility timeout,</text>
        <text x="325" y="266" text-anchor="middle" fill="#94a3b8" font-size="9">acks, retry budgets</text>
        <line x1="410" y1="170" x2="490" y2="100" stroke="#22c55e" stroke-width="1.2" marker-end="url(#qArr)"/>
        <line x1="410" y1="180" x2="490" y2="170" stroke="#22c55e" stroke-width="1.2" marker-end="url(#qArr)"/>
        <line x1="410" y1="190" x2="490" y2="240" stroke="#22c55e" stroke-width="1.2" marker-end="url(#qArr)"/>
        <rect x="490" y="80" width="170" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/>
        <text x="575" y="104" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">Worker 1 (busy)</text>
        <rect x="490" y="150" width="170" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/>
        <text x="575" y="174" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">Worker 2 (busy)</text>
        <rect x="490" y="220" width="170" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/>
        <text x="575" y="244" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">Worker N (idle)</text>
        <rect x="680" y="150" width="100" height="40" rx="6" fill="#1e293b" stroke="#94a3b8"/>
        <text x="730" y="174" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">DB / S3</text>
        <line x1="660" y1="170" x2="680" y2="170" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#qArr)"/>
        <text x="400" y="320" text-anchor="middle" fill="#94a3b8" font-size="10">Workers pull from broker, ack on success, NACK + retry on failure, move to DLQ on max-retry exceeded.</text>
        <defs>
          <marker id="qArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/>
          </marker>
        </defs>
      </svg>

      <h2>Fairness, Priority, and Quotas</h2>

      <p>Multi-tenant schedulers need to prevent one tenant from starving others. The core algorithms:</p>

      <h3>Dominant Resource Fairness (DRF)</h3>

      <p>The standard fairness algorithm for schedulers that allocate multiple resource types (CPU, memory, GPU). DRF (Ghodsi et al., 2011) computes each tenant&apos;s &quot;dominant share&quot; &mdash; the largest share they hold across all resources &mdash; and equalizes those dominant shares.</p>

      <p>Concretely: if tenant A is using 50% of CPU and 20% of memory, A&apos;s dominant share is 50%. If tenant B is using 30% of CPU and 60% of memory, B&apos;s dominant share is 60%. DRF would prefer to allocate the next slot to A. Used by Mesos, Yunikorn, and Yarn capacity scheduler.</p>

      <h3>Priority Classes</h3>

      <p>Kubernetes supports priority via PriorityClass resources. Higher-priority pods preempt lower-priority pods when needed. A common production setup has three or four classes:</p>
      <ul>
        <li><strong>system-critical</strong>: kube-system pods, never preempted.</li>
        <li><strong>production</strong>: latency-sensitive user-facing services.</li>
        <li><strong>best-effort-batch</strong>: background processing, low priority.</li>
        <li><strong>opportunistic</strong>: spot-instance batch, preemptible at any time.</li>
      </ul>

      <h3>Resource Quotas and LimitRanges</h3>

      <p>ResourceQuota caps the aggregate resource consumption per namespace (e.g. payments-team can use at most 100 CPU and 200Gi memory). LimitRange sets per-pod defaults and bounds within a namespace. These are not technically scheduling features &mdash; they are admission-time validations &mdash; but they shape the inputs to scheduling.</p>

      <h2>Failure Recovery and Retries</h2>

      <p>Every scheduler needs to handle: jobs that fail, workers that crash, jobs that get stuck, and the bookkeeping problem of &quot;was this job already done?&quot; The standard tools:</p>

      <h3>Exponential Backoff with Jitter</h3>

      <p>The default retry pattern. Wait 1s, then 2s, then 4s, then 8s &mdash; with random jitter to avoid synchronizing retries from many workers. Kubernetes job <code>backoffLimit</code>, Sidekiq retries, AWS SDK&apos;s default retry policy all use this. Without jitter, a downstream brownout can be amplified by retry storms.</p>

      <h3>Idempotency Keys</h3>

      <p>If a job retries, it should not double-charge the customer or send two emails. Idempotency keys (a unique string per logical job invocation) let the receiver detect and reject duplicate executions. The job framework typically generates the key (often a hash of the job&apos;s inputs) and the receiving service stores it for the deduplication window.</p>

      <h3>Dead Letter Queues</h3>

      <p>After N retries, the job moves to a dead letter queue (DLQ) where humans (or another job) can inspect it. The DLQ exists because the alternative &mdash; infinite retries &mdash; is worse. Production runbooks should monitor DLQ depth as a first-class metric; a growing DLQ is a real incident signal.</p>

      <h3>Visibility Timeouts</h3>

      <p>When a worker pulls a job, the job is invisible to other workers for the visibility timeout (typically 30s&ndash;5min). If the worker completes and acknowledges, the job is deleted. If the timeout elapses without ack, the job becomes visible again and another worker picks it up. This is how SQS, Kafka with rebalances, and most queue systems handle worker failure.</p>

      <h3>Stuck Job Detection</h3>

      <p>A job that runs for hours instead of minutes is probably stuck (deadlock, network partition, infinite loop). Set <code>activeDeadlineSeconds</code> on Jobs and CronJobs; alert on jobs that exceed their typical p99 runtime; require all workers to emit periodic heartbeats so a hung worker is detectable.</p>

      <h2>Resource-Aware and GPU Scheduling</h2>

      <p>GPU workloads break naive scheduling. A GPU is a discrete, indivisible resource &mdash; you cannot split a GPU between two pods (until recently; nvidia&apos;s MIG support changes this). The scheduler needs to know about GPU types (H100 vs A100 vs T4), GPU counts per node, and topology (NVLink groups for multi-GPU jobs).</p>

      <p>Kubernetes models this through device plugins: nvidia&apos;s plugin advertises <code>nvidia.com/gpu</code> as a schedulable resource, and pods request it via <code>resources.limits</code>. For more sophisticated patterns (gang scheduling N pods together for distributed training, topology-aware placement, fractional GPU), custom schedulers like Volcano, KAI Scheduler, or Run:AI take over.</p>

      <p>Specifically for AI inference workloads, the cost-control pattern is critical: <strong>schedule inference replicas on GPU nodes with low utilisation, use the remaining capacity for preemptible batch training</strong>. This dual-tenancy is hard to do well without a custom scheduler that understands both workload classes.</p>

      <h2>Workload Placement Across Clusters and Clouds</h2>

      <p>Single-cluster scheduling is solved. Multi-cluster scheduling &mdash; deciding which cluster a workload runs on across many regions or cloud providers &mdash; is open territory. Approaches:</p>

      <ul>
        <li><strong>Karmada</strong>: open-source Kubernetes-native multi-cluster scheduler. Workloads are submitted to a host cluster; Karmada propagates them to member clusters based on policy.</li>
        <li><strong>Cluster API + custom controllers</strong>: each business workload has a controller that watches across clusters and reconciles placement.</li>
        <li><strong>External orchestrator</strong> (Spinnaker, Argo CD with multi-cluster, Crossplane): orchestrate deployments across clusters from a central control plane.</li>
        <li><strong>Cell-based architecture</strong>: pre-partition tenants across clusters; each tenant lives in a single cell. No cross-cluster scheduling needed at runtime &mdash; the placement is decided at tenant-onboarding time.</li>
      </ul>

      <p>The cross-cluster identity layer matters for security: a workload that can move between clusters needs an identity that travels with it. <a href="/glossary/spiffe" class="text-primary underline">SPIFFE</a> workload identity solves this &mdash; the same SPIFFE ID is valid across federated clusters, so cross-cluster scheduling does not require credential re-issuance. See the <a href="/courses/mastering-spiffe-spire/spiffe-spire-deep-dive" class="text-primary underline">SPIFFE/SPIRE Deep Dive module</a> in the Cloud Native Security Engineering course for the full pattern.</p>

      <h2>Common Pitfalls</h2>

      <h3>1. Setting Resource Requests Too High</h3>

      <p>If pods request more resources than they actually use, the scheduler reserves that capacity even though it sits idle. Cluster utilisation drops; the autoscaler adds nodes that are mostly empty. The fix: profile your workloads, set requests at the p95 of actual usage, and set limits at p99. Tools like <a href="https://github.com/robusta-dev/krr">Robusta KRR</a> and the Vertical Pod Autoscaler analyser can recommend per-workload values.</p>

      <h3>2. Forgetting PodDisruptionBudgets</h3>

      <p>The scheduler will happily evict and reschedule pods during node maintenance, autoscaler scale-down, or preemption. Without PDBs, the entire replica set can be terminated simultaneously &mdash; causing a brief outage. Always declare a PDB with <code>minAvailable</code> or <code>maxUnavailable</code> for production deployments.</p>

      <h3>3. Topology Spread Without Resilience Goals</h3>

      <p>A common misuse: setting <code>topologySpreadConstraints</code> with <code>maxSkew: 1</code> on a 3-replica deployment in a 3-zone cluster. The scheduler now refuses to schedule a 4th replica because that would violate the constraint &mdash; even though there is plenty of capacity. Use <code>ScheduleAnyway</code> for soft constraints and reason about what spread you actually need.</p>

      <h3>4. Cron Schedule Drift</h3>

      <p>Long-running jobs that take longer than the schedule interval will overlap (with <code>concurrencyPolicy: Allow</code>) or skip iterations (with <code>Forbid</code>). Always measure job runtime, set <code>activeDeadlineSeconds</code> as a safety net, and set the schedule generously.</p>

      <h3>5. Trusting Visibility Timeout for Long Jobs</h3>

      <p>If a worker takes longer than the visibility timeout to process a message, the message becomes visible again and another worker picks it up &mdash; double processing. Workers for long jobs should periodically extend the visibility timeout (heartbeat) or split the job into smaller chunks.</p>

      <h2>Observability</h2>

      <p>Production schedulers need:</p>
      <ul>
        <li><strong>Pending-pod time histogram</strong>: how long pods wait between creation and scheduling. p99 should be sub-second; multi-minute waits indicate scheduler bottleneck or capacity issues.</li>
        <li><strong>Scheduler errors per reason</strong>: insufficient CPU, insufficient memory, node selector mismatch, taint, etc. Tells you whether to grow the cluster, fix node labels, or tune affinities.</li>
        <li><strong>Node utilisation distribution</strong>: per-node CPU/memory utilisation as a histogram. Wide variance suggests packing problems or hot spots.</li>
        <li><strong>Job latency p50/p99</strong> for batch jobs, broken down by job type and tenant. Drift in p99 is an early signal of scheduler or worker degradation.</li>
        <li><strong>DLQ depth and time-in-DLQ</strong>: zero is the only acceptable steady state.</li>
        <li><strong>Preemption events</strong>: which pods got evicted by which higher-priority pods. Helps diagnose &quot;my pod keeps getting killed&quot; reports.</li>
      </ul>

      <h2>Security Considerations</h2>

      <p>Schedulers operate with cluster-wide privilege and decide where workloads run. Three security failure modes specific to scheduling:</p>

      <ol>
        <li><strong>Hostile pod placement</strong>: an attacker who can schedule a pod (via a compromised SA, an exploited admission gap) can target specific nodes via node affinity. The mitigation is admission policy: PodSecurity restricted, image-signing enforcement, NetworkPolicy default-deny per namespace. Walk the <a href="/games/kubernetes-security-simulator" class="text-primary underline">Kubernetes Security Simulator</a> for hands-on practice on these defences.</li>
        <li><strong>Cross-tenant noisy neighbours</strong>: a CPU- or I/O-hungry pod on a shared node degrades co-tenant performance. CPU and memory limits, plus dedicated node pools for sensitive workloads, are the common defenses.</li>
        <li><strong>Privileged scheduler plugins</strong>: a custom scheduler plugin runs in the cluster with cluster-scope read access. Vet plugins like you vet admission webhooks &mdash; signed images, audited code, monitored behaviour.</li>
      </ol>

      <h2>Frequently Asked Questions</h2>

      <h3>How does the Kubernetes scheduler scale to thousands of nodes?</h3>
      <p>The default scheduler can comfortably handle ~5,000 nodes and ~150,000 pods. Beyond that you tune: enable percentage-of-nodes-to-score (don&apos;t score every node, just a representative sample), shard the scheduler into multiple instances by workload class, or run custom schedulers per namespace. The CNCF KEP-3094 (multiple schedulers running concurrently) is the upstream pattern.</p>

      <h3>When should I use a custom scheduler vs tuning the default scheduler?</h3>
      <p>The default scheduler with affinities, taints, priorities, and topology spread covers ~95% of use cases. Reach for a custom scheduler when you need: gang scheduling (N pods together or none), GPU topology awareness, budget-aware placement (cost optimisation across cloud regions), or cross-cluster scheduling. The operational cost is significant; exhaust the defaults first.</p>

      <h3>Should batch jobs run in the same cluster as production services?</h3>
      <p>Two patterns. <strong>Shared cluster</strong>: separate node pools, priority classes, and resource quotas isolate batch from prod. Cheaper, more flexible. <strong>Dedicated batch cluster</strong>: lower blast radius (a batch outage cannot affect prod), simpler operational model. Most teams start shared and graduate to dedicated when batch scale or sensitivity demands it.</p>

      <h3>How do I know if my cluster is under-utilised or over-utilised?</h3>
      <p>The right metric is <strong>request utilisation</strong> (CPU/memory requested / available), not <strong>actual usage</strong> (CPU/memory used / available). The scheduler cares about requests; nodes appear &quot;full&quot; at request utilisation even if actual usage is 30%. If request utilisation is high but actual usage is low, your requests are oversized &mdash; tune them down.</p>

      <h3>Should I use Airflow, Argo Workflows, Dagster, or Prefect?</h3>
      <p>Airflow is the incumbent &mdash; mature, huge ecosystem, hard to operate at scale. Argo Workflows is Kubernetes-native &mdash; great if you already run Kubernetes and want simple infra. Dagster has the best modern developer experience and asset-based modelling. Prefect is the cleanest Pythonic API. For new projects, evaluate Argo + Dagster first; pick Airflow only if you need its specific operators or community.</p>

      <h3>What is &quot;gang scheduling&quot; and when do I need it?</h3>
      <p>Gang scheduling guarantees that a set of related pods all start together, or none of them start. Required for distributed ML training (rank 0 cannot do useful work without rank 1...N), Spark jobs (the driver needs all executors), and MPI workloads. The default Kubernetes scheduler does not support it; Volcano, Yunikorn, and KubeFlow&apos;s training-operator add it.</p>

      <h2>Where to Go Next</h2>

      <ul>
        <li>Read the <a href="/blog/distributed-systems-algorithms-production-guide" class="text-primary underline">Distributed Systems Algorithms guide</a> for the consensus and leader-election primitives that underpin every distributed scheduler.</li>
        <li>Walk through the <a href="/blog/rate-limiting-algorithms-production-guide" class="text-primary underline">Rate Limiting Algorithms guide</a> to see how rate limiting and scheduling interact when load exceeds capacity.</li>
        <li>Read the <a href="/blog/caching-strategies-production-guide" class="text-primary underline">Caching Strategies guide</a> to round out the performance-engineering picture.</li>
        <li>Try the <a href="/games/kubernetes-security-simulator" class="text-primary underline">Kubernetes Security Simulator</a> and the <a href="/games/secure-architecture-builder" class="text-primary underline">Secure Architecture Builder</a> for hands-on practice on the architectural decisions that surround scheduling.</li>
        <li>Take the free <a href="/courses/cloud-native-security-engineering/kubernetes-foundations-security" class="text-primary underline">Kubernetes Foundations &amp; Security module</a> for the broader picture of how scheduling fits with the rest of the cluster control plane.</li>
      </ul>
    `;
