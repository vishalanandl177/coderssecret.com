export const CONTENT = `
      <p>If you've ever waited 5-10 minutes for Kubernetes Cluster Autoscaler to spin up new nodes while your pods sat in <code>Pending</code> state, you know the pain. <strong>Karpenter</strong> is AWS's open-source node provisioner that replaces Cluster Autoscaler with something dramatically faster and smarter. It provisions the <em>right</em> nodes in <strong>under 60 seconds</strong>, handles spot interruptions automatically, and can cut your compute costs by 40-60%.</p>

      <h2>What is Karpenter?</h2>
      <p>Karpenter is an open-source, high-performance Kubernetes node lifecycle manager. Unlike Cluster Autoscaler (which works with pre-defined node groups), Karpenter directly provisions compute capacity from the cloud provider based on the actual requirements of your pending pods.</p>

      <!-- Karpenter vs Cluster Autoscaler -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Karpenter vs Cluster Autoscaler</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x26A1; Karpenter</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Provisioning<span class="vs-row-value" style="color:#22c55e">&lt; 60 seconds</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Instance selection<span class="vs-row-value" style="color:#22c55e">Best-fit per pod</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Spot support<span class="vs-row-value" style="color:#22c55e">Native + consolidation</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Node groups<span class="vs-row-value" style="color:#22c55e">Not needed</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Bin packing<span class="vs-row-value" style="color:#22c55e">Automatic</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E1;</span>Spot interruption<span class="vs-row-value" style="color:#22c55e">Auto-replacement</span></div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">&#x23F3; Cluster Autoscaler</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Provisioning<span class="vs-row-value" style="color:#f97316">5-10 minutes</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Instance selection<span class="vs-row-value" style="color:#f97316">Pre-defined groups</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Spot support<span class="vs-row-value" style="color:#f97316">Limited</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Node groups<span class="vs-row-value" style="color:#ef4444">Required (ASGs)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Bin packing<span class="vs-row-value" style="color:#ef4444">Poor</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E1;</span>Spot interruption<span class="vs-row-value" style="color:#ef4444">Manual handling</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>How Karpenter Works</h2>

      <!-- Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Karpenter Provisioning Flow</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Kubernetes<span class="seq-actor-sub">(Scheduler)</span></div>
            <div class="seq-actor idp">Karpenter<span class="seq-actor-sub">(Controller)</span></div>
            <div class="seq-actor sp">AWS EC2<span class="seq-actor-sub">(Cloud Provider)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> Pod enters Pending (unschedulable)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Analyze pod requirements (CPU, memory, GPU, topology)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right-23" style="--arrow-color:#7c3aed"><span class="seq-num purple">2</span> Select optimal instance type + launch</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left-23" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> EC2 instance ready (&lt; 60s)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#22c55e;color:#4ade80">Node joins cluster, pod scheduled</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">4</span> Pod running &#x2705;</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Installation</h2>
      <p>Karpenter runs as a Helm chart inside your EKS cluster. Here's the production-ready setup:</p>
      <pre><code># Prerequisites:
# - EKS cluster (1.25+)
# - IAM roles for service accounts (IRSA) configured
# - aws CLI, kubectl, helm installed

# Set your cluster variables
export CLUSTER_NAME="my-production-cluster"
export AWS_REGION="us-east-1"
export KARPENTER_VERSION="1.1.0"
export AWS_ACCOUNT_ID="\$(aws sts get-caller-identity --query Account --output text)"

# Create the IAM roles for Karpenter
# (Karpenter needs permission to create/terminate EC2 instances)
aws cloudformation deploy \\
  --stack-name "Karpenter-\${CLUSTER_NAME}" \\
  --template-file karpenter-cloudformation.yaml \\
  --capabilities CAPABILITY_NAMED_IAM \\
  --parameter-overrides "ClusterName=\${CLUSTER_NAME}"

# Install Karpenter via Helm
helm upgrade --install karpenter oci://public.ecr.aws/karpenter/karpenter \\
  --version "\${KARPENTER_VERSION}" \\
  --namespace kube-system \\
  --set "settings.clusterName=\${CLUSTER_NAME}" \\
  --set "settings.interruptionQueue=\${CLUSTER_NAME}" \\
  --set controller.resources.requests.cpu=1 \\
  --set controller.resources.requests.memory=1Gi \\
  --set controller.resources.limits.cpu=1 \\
  --set controller.resources.limits.memory=1Gi \\
  --wait

# Verify Karpenter is running
kubectl get pods -n kube-system -l app.kubernetes.io/name=karpenter
# NAME                         READY   STATUS    RESTARTS   AGE
# karpenter-5f4b8c8d9f-xxxxx   1/1     Running   0          2m</code></pre>

      <h2>Core Concepts</h2>

      <!-- Concepts Layer Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Karpenter Resource Hierarchy</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#7c3aed">NodePool<span class="layer-item-sub">Defines WHAT to provision — instance types, zones, capacity type (spot/on-demand), limits</span></div>
          <div class="layer-item" style="background:#3b82f6">EC2NodeClass<span class="layer-item-sub">Defines HOW to provision — AMI, subnets, security groups, user data, block devices</span></div>
          <div class="layer-item" style="background:#f97316">NodeClaim<span class="layer-item-sub">Auto-created by Karpenter — represents a single provisioned node (like a Pod for nodes)</span></div>
          <div class="layer-item" style="background:#22c55e">EC2 Instance + Node<span class="layer-item-sub">The actual cloud instance that joins the cluster and runs your pods</span></div>
        </div>
      </div>

      <h2>NodePool: Define What to Provision</h2>
      <p>A <strong>NodePool</strong> tells Karpenter what kind of nodes it can create. Think of it as a set of constraints and preferences:</p>
      <pre><code># nodepool.yaml — Production-ready NodePool
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: default
spec:
  # Template for nodes created by this pool
  template:
    metadata:
      labels:
        environment: production
        team: platform
    spec:
      # Which EC2NodeClass to use for AWS-specific config
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: default

      # Instance type requirements
      requirements:
        # Architecture: amd64 or arm64 (Graviton)
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64", "arm64"]

        # Capacity type: spot first, on-demand as fallback
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]

        # Instance categories: general purpose + compute optimized
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["c", "m", "r"]

        # Instance sizes: medium to 8xlarge
        - key: karpenter.k8s.aws/instance-size
          operator: In
          values: ["medium", "large", "xlarge", "2xlarge", "4xlarge", "8xlarge"]

        # Availability zones
        - key: topology.kubernetes.io/zone
          operator: In
          values: ["us-east-1a", "us-east-1b", "us-east-1c"]

      # Taints (optional — restrict what can run on these nodes)
      # taints:
      #   - key: workload-type
      #     value: compute-heavy
      #     effect: NoSchedule

  # Resource limits — cap total provisioned capacity
  limits:
    cpu: "1000"        # Max 1000 vCPUs across all nodes
    memory: "2000Gi"   # Max 2TB RAM

  # Disruption policy — how Karpenter consolidates/replaces nodes
  disruption:
    # Consolidation: merge underutilized nodes to save money
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 30s

    # Budget: max nodes that can be disrupted simultaneously
    budgets:
      - nodes: "10%"    # Disrupt at most 10% of nodes at once

  # How long before an idle node is terminated
  weight: 10  # Priority (higher = preferred over other NodePools)</code></pre>

      <h2>EC2NodeClass: Define How to Provision</h2>
      <pre><code># ec2nodeclass.yaml — AWS-specific configuration
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: default
spec:
  # IAM role for the nodes
  role: "KarpenterNodeRole-my-production-cluster"

  # AMI selection — use the latest EKS-optimized AMI
  amiSelectorTerms:
    - alias: al2023@latest   # Amazon Linux 2023 (recommended)

  # Subnet discovery — find subnets by tag
  subnetSelectorTerms:
    - tags:
        karpenter.sh/discovery: "my-production-cluster"

  # Security group discovery
  securityGroupSelectorTerms:
    - tags:
        karpenter.sh/discovery: "my-production-cluster"

  # Block device mappings (root volume)
  blockDeviceMappings:
    - deviceName: /dev/xvda
      ebs:
        volumeSize: 100Gi
        volumeType: gp3
        iops: 3000
        throughput: 125
        encrypted: true
        deleteOnTermination: true

  # Tags applied to all EC2 instances
  tags:
    Environment: production
    ManagedBy: karpenter
    Team: platform

  # User data (optional — bootstrap scripts)
  # userData: |
  #   #!/bin/bash
  #   echo "Custom bootstrap logic here"

  # Metadata options (IMDSv2 required for security)
  metadataOptions:
    httpEndpoint: enabled
    httpProtocolIPv6: disabled
    httpPutResponseHopLimit: 2
    httpTokens: required  # Enforce IMDSv2</code></pre>

      <h2>Spot Instance Optimization</h2>
      <p>Karpenter's spot handling is one of its killer features. It automatically diversifies across instance types and handles interruptions gracefully:</p>

      <!-- Spot Strategy -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Karpenter Spot Instance Strategy</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#22c55e;--i:0"><span class="pipeline-step-icon">&#x1F4B0;</span>Spot First<span class="pipeline-step-sub">60-90% savings</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:1"><span class="pipeline-step-icon">&#x1F504;</span>Diversify<span class="pipeline-step-sub">15+ instance types</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x26A0;</span>Interruption<span class="pipeline-step-sub">2-min warning</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:3"><span class="pipeline-step-icon">&#x1F504;</span>Replace<span class="pipeline-step-sub">Auto-provision new</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x1F6E1;</span>Fallback<span class="pipeline-step-sub">On-demand if needed</span></div>
        </div>
      </div>

      <pre><code># Spot-optimized NodePool — maximize savings
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: spot-compute
spec:
  template:
    spec:
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: default
      requirements:
        # SPOT ONLY for this pool
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot"]

        # Wide instance diversity = fewer interruptions
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["c", "m", "r", "c5", "m5", "r5", "c6i", "m6i", "r6i"]

        - key: karpenter.k8s.aws/instance-size
          operator: In
          values: ["large", "xlarge", "2xlarge", "4xlarge"]

        # Use Graviton (arm64) for 20% better price-performance
        - key: kubernetes.io/arch
          operator: In
          values: ["arm64"]

  # Disruption: enable consolidation for further savings
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 30s

---
# On-demand fallback pool (lower priority)
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: on-demand-fallback
spec:
  template:
    spec:
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: default
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["on-demand"]
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["m", "c"]
  weight: 1  # Lower priority than spot pool (weight: 10)</code></pre>

      <h2>Consolidation: Automatic Cost Optimization</h2>
      <p>Karpenter continuously watches for underutilized nodes and consolidates workloads to fewer, better-fitting instances. This happens automatically — no cron jobs, no manual intervention.</p>

      <!-- Consolidation Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How Consolidation Works</div>
        <div class="cycle-diagram">
          <div class="cycle-ring">
            <div class="cycle-node" style="background:#3b82f6"><span class="cycle-node-icon">&#x1F440;</span>Monitor</div>
            <div class="cycle-node" style="background:#f97316"><span class="cycle-node-icon">&#x1F4CA;</span>Detect</div>
            <div class="cycle-node" style="background:#ef4444"><span class="cycle-node-icon">&#x1F4B8;</span>Waste</div>
            <div class="cycle-node" style="background:#7c3aed"><span class="cycle-node-icon">&#x1F4E6;</span>Repack</div>
            <div class="cycle-center">&#x267B; Auto</div>
            <div class="cycle-node" style="background:#22c55e"><span class="cycle-node-icon">&#x1F4B0;</span>Save</div>
          </div>
        </div>
      </div>

      <pre><code># Example: Consolidation in action
# Before consolidation:
#   Node 1 (m5.2xlarge — 8 vCPU, 32GB): using 2 vCPU, 4GB (25% utilized)
#   Node 2 (m5.2xlarge — 8 vCPU, 32GB): using 3 vCPU, 8GB (37% utilized)
#   Total cost: 2x m5.2xlarge = ~\$0.384/hr * 2 = \$0.768/hr

# After consolidation (Karpenter automatically):
#   1. Launches m5.xlarge (4 vCPU, 16GB) — fits both workloads
#   2. Cordons Node 1 and Node 2
#   3. Drains pods (respecting PDBs)
#   4. Terminates old nodes
#   Result: 1x m5.xlarge = \$0.192/hr (75% savings!)

# Monitor consolidation events
kubectl get events --field-selector reason=DisruptionInitiated -n kube-system</code></pre>

      <h2>GPU Workloads</h2>
      <p>Karpenter can provision GPU instances for ML/AI workloads just as easily:</p>
      <pre><code># GPU NodePool for ML training
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: gpu-training
spec:
  template:
    metadata:
      labels:
        workload-type: gpu
    spec:
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: gpu-class
      requirements:
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["g", "p"]  # GPU instance families
        - key: karpenter.k8s.aws/instance-gpu-count
          operator: Gt
          values: ["0"]
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]
      taints:
        - key: nvidia.com/gpu
          value: "true"
          effect: NoSchedule
  limits:
    cpu: "200"
    memory: "800Gi"
    nvidia.com/gpu: "16"  # Max 16 GPUs across all nodes

---
# Pod requesting a GPU
apiVersion: v1
kind: Pod
metadata:
  name: ml-training-job
spec:
  tolerations:
    - key: nvidia.com/gpu
      operator: Exists
  containers:
    - name: trainer
      image: my-registry/ml-trainer:latest
      resources:
        requests:
          nvidia.com/gpu: 1
          memory: 16Gi
          cpu: 4
        limits:
          nvidia.com/gpu: 1
          memory: 32Gi
# Karpenter sees this pod Pending, provisions a g5.xlarge (1 GPU),
# and the pod starts in under 90 seconds</code></pre>

      <h2>Multi-Architecture (ARM64 / Graviton)</h2>
      <p>AWS Graviton processors offer 20% better price-performance than x86. Karpenter makes it easy to use both:</p>
      <pre><code># NodePool allowing both architectures
requirements:
  - key: kubernetes.io/arch
    operator: In
    values: ["amd64", "arm64"]  # Karpenter picks the cheapest

# Your pods need multi-arch images:
# docker buildx build --platform linux/amd64,linux/arm64 -t my-app:latest .

# Karpenter's decision process:
# 1. Pod requests 2 vCPU, 4GB memory
# 2. Karpenter evaluates: m6i.large (amd64) = \$0.096/hr
#                          m6g.large (arm64) = \$0.077/hr
# 3. Picks m6g.large (arm64) — 20% cheaper, same performance
# 4. Only if your image doesn't support arm64, falls back to amd64</code></pre>

      <h2>Monitoring &amp; Observability</h2>
      <pre><code># Karpenter exposes Prometheus metrics out of the box

# Key metrics to monitor:
# karpenter_nodes_total              — Current node count by pool
# karpenter_nodeclaims_terminated    — Node terminations (consolidation, expiry)
# karpenter_pods_startup_duration    — Time from Pending to Running
# karpenter_provisioner_scheduling   — Scheduling decisions per second
# karpenter_interruption_received    — Spot interruption events

# Grafana dashboard (community):
# https://github.com/aws/karpenter/tree/main/charts/karpenter/dashboards

# Useful kubectl commands:
# See all NodeClaims (Karpenter-managed nodes)
kubectl get nodeclaims
# NAME              TYPE          ZONE         NODE              READY   AGE
# default-abc123    m6g.xlarge    us-east-1a   ip-10-0-1-45      True    2h
# spot-xyz789       c6g.2xlarge   us-east-1b   ip-10-0-2-78      True    45m

# See NodePool status (capacity used vs limits)
kubectl get nodepool
# NAME       NODECLASS   NODES   READY   AGE
# default    default     12      12      30d
# spot       default     8       8       30d

# Describe a NodeClaim for details
kubectl describe nodeclaim default-abc123
# Shows: instance type, zone, capacity type, allocatable resources, pods running

# Check for disruption events
kubectl get events -A --field-selector reason=DisruptionInitiated

# Logs
kubectl logs -n kube-system -l app.kubernetes.io/name=karpenter -f</code></pre>

      <h2>Production Best Practices</h2>

      <!-- Best Practices Timeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Karpenter Production Checklist</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">Set resource limits on NodePools</div><div class="timeline-item-desc">Prevent runaway scaling — cap CPU and memory per pool</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Use Pod Disruption Budgets (PDBs)</div><div class="timeline-item-desc">Protect availability during consolidation — at least 1 replica always running</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">Diversify instance types widely</div><div class="timeline-item-desc">Allow 15+ instance types for spot — reduces interruption probability by 90%</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Set pod resource requests accurately</div><div class="timeline-item-desc">Karpenter uses requests (not limits) to bin-pack — wrong requests = wasted capacity</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">Enable SQS interruption queue</div><div class="timeline-item-desc">Graceful handling of spot interruptions, maintenance events, and rebalance recommendations</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">Use multiple NodePools</div><div class="timeline-item-desc">Separate pools for: general workloads, GPU, spot-only, on-demand critical — different rules for each</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">Monitor consolidation aggressiveness</div><div class="timeline-item-desc">Start with consolidateAfter: 60s, tune based on workload stability</div></div>
        </div>
      </div>

      <h2>Migrating from Cluster Autoscaler</h2>
      <pre><code># Migration strategy — run both side-by-side, then decommission CA

# Step 1: Install Karpenter alongside Cluster Autoscaler
# (They can coexist — Karpenter handles new provisioning,
# CA manages existing node groups)

# Step 2: Create NodePool + EC2NodeClass
kubectl apply -f nodepool.yaml
kubectl apply -f ec2nodeclass.yaml

# Step 3: Taint existing CA-managed node groups
# This prevents new pods from scheduling on CA nodes
kubectl taint nodes -l eks.amazonaws.com/nodegroup=old-ng \\
  legacy=cluster-autoscaler:PreferNoSchedule

# Step 4: Gradually drain CA node groups
# Karpenter will provision replacement capacity automatically
kubectl cordon <ca-node>
kubectl drain <ca-node> --ignore-daemonsets --delete-emptydir-data

# Step 5: Once all workloads are on Karpenter nodes:
# - Scale CA node groups to 0
# - Uninstall Cluster Autoscaler
# - Delete old ASGs/node groups

# Step 6: Celebrate your 40-60% cost reduction &#x1F389;</code></pre>

      <h2>Cost Comparison</h2>

      <!-- Cost Savings -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Typical Monthly Cost Savings (100-node cluster)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-red" data-value="~\\$45,000"></div><div class="bar-chart-label">On-Demand (no autoscaling)</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-70 bar-orange" data-value="~\\$35,000"></div><div class="bar-chart-label">Cluster Autoscaler</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-40 bar-blue" data-value="~\\$20,000"></div><div class="bar-chart-label">Karpenter (spot + consolidation)</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-30 bar-green" data-value="~\\$15,000"></div><div class="bar-chart-label">Karpenter + Graviton</div></div>
        </div>
      </div>

      <p>Karpenter is the most impactful cost optimization tool in the Kubernetes ecosystem. It's faster than Cluster Autoscaler, smarter about instance selection, and aggressively consolidates underutilized capacity. If you're running EKS in production, migrating to Karpenter is one of the highest-ROI infrastructure changes you can make.</p>
    `;
