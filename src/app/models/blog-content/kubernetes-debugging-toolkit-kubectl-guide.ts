export const CONTENT = `
      <p>Kubernetes does not tell you what is wrong &mdash; it tells you what <em>state</em> things are in. Your job is to interpret the state, trace the root cause, and fix it. This guide covers the debugging commands and patterns that platform engineers use daily, organized by the problems you actually encounter.</p>

      <h2>Essential Debugging Commands</h2>

      <p>Before diving into specific problems, master these five commands. They solve 80% of issues:</p>

      <pre><code># 1. What is happening right now?
kubectl get pods -n my-namespace -o wide

# 2. Why is this pod unhappy?
kubectl describe pod my-pod-abc123 -n my-namespace

# 3. What is the application saying?
kubectl logs my-pod-abc123 -n my-namespace --tail=100

# 4. What happened recently?
kubectl get events -n my-namespace --sort-by='.lastTimestamp'

# 5. Get inside and look around
kubectl exec -it my-pod-abc123 -n my-namespace -- /bin/sh</code></pre>

      <h2>Problem: Pod Stuck in CrashLoopBackOff</h2>

      <p>The pod starts, crashes, Kubernetes restarts it, it crashes again. The backoff delay grows exponentially (10s, 20s, 40s, up to 5 minutes).</p>

      <pre><code># Step 1: Check why it crashed
kubectl logs my-pod --previous  # Logs from the LAST crashed container

# Step 2: Check the exit code
kubectl describe pod my-pod | grep -A 5 "Last State"
#   Last State:  Terminated
#     Reason:    Error
#     Exit Code: 137    &larr; OOMKilled (out of memory)
#     Exit Code: 1      &larr; Application error
#     Exit Code: 143    &larr; SIGTERM (graceful shutdown)

# Step 3: If OOMKilled (exit code 137), increase memory limits
# Check current usage:
kubectl top pod my-pod

# Fix: increase memory in deployment spec
# resources:
#   requests:
#     memory: "256Mi"
#   limits:
#     memory: "512Mi"     &larr; increase this

# Step 4: If exit code 1, check application logs
kubectl logs my-pod --previous | tail -50
# Common causes: missing env var, wrong DB connection string,
# missing config file, permission denied</code></pre>

      <h2>Problem: Pod Stuck in Pending</h2>

      <p>The pod is created but never gets scheduled to a node.</p>

      <pre><code># Step 1: Check events
kubectl describe pod my-pod | grep -A 10 "Events"
# Common messages:
#   "0/3 nodes are available: 3 Insufficient cpu"
#   "0/3 nodes are available: 3 Insufficient memory"
#   "no nodes match pod topology spread constraints"
#   "0/3 nodes are available: 3 node(s) had taint"

# Step 2: Check node capacity
kubectl describe nodes | grep -A 5 "Allocated resources"

# Step 3: Check if requests are too high
kubectl get pod my-pod -o yaml | grep -A 4 "resources"

# Fix for insufficient resources:
# - Reduce resource requests
# - Add more nodes (cluster autoscaler)
# - Evict low-priority pods

# Fix for taints:
kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints
# Add toleration to pod spec or remove taint from node</code></pre>

      <h2>Problem: Service Not Routing Traffic</h2>

      <pre><code># Step 1: Verify the service exists and has endpoints
kubectl get svc my-service -n my-namespace
kubectl get endpoints my-service -n my-namespace
# If ENDPOINTS is empty (&lt;none&gt;), no pods match the selector!

# Step 2: Check service selector matches pod labels
kubectl get svc my-service -o yaml | grep -A 5 "selector"
#   selector:
#     app: my-app          &larr; Service looks for this label

kubectl get pods --show-labels | grep my-app
#   my-pod   1/1   Running   app=myapp    &larr; Notice: "myapp" not "my-app"!
# Label mismatch! Fix the selector or the pod labels.

# Step 3: Test connectivity from inside the cluster
kubectl run debug --rm -it --image=busybox -- /bin/sh
# Inside the debug pod:
wget -qO- http://my-service.my-namespace.svc.cluster.local:8080/health
nslookup my-service.my-namespace.svc.cluster.local

# Step 4: Check if the pod is listening on the right port
kubectl exec my-pod -- netstat -tlnp
# Verify the application listens on the port the service targets</code></pre>

      <h2>Problem: Ingress Not Working</h2>

      <pre><code># Step 1: Check ingress resource
kubectl get ingress -n my-namespace
kubectl describe ingress my-ingress -n my-namespace

# Step 2: Check ingress controller logs
kubectl logs -n ingress-nginx deploy/ingress-nginx-controller --tail=50

# Step 3: Check if the backend service is healthy
kubectl get endpoints my-service
# Must have at least one endpoint IP

# Step 4: Check TLS certificate
kubectl describe ingress my-ingress | grep -A 3 "TLS"
kubectl get secret my-tls-secret -o yaml

# Step 5: Test from outside
curl -v -H "Host: my-app.example.com" http://INGRESS_IP/
# The -v flag shows headers, redirects, and SSL handshake details</code></pre>

      <h2>Problem: Node Issues</h2>

      <pre><code># Check node status and conditions
kubectl get nodes
kubectl describe node worker-2 | grep -A 10 "Conditions"
#   MemoryPressure   True    &larr; Node is running low on memory
#   DiskPressure     True    &larr; Disk space critical
#   PIDPressure      True    &larr; Too many processes
#   Ready            False   &larr; Node is NOT accepting pods

# Check resource usage across all nodes
kubectl top nodes

# Find pods consuming the most resources on a node
kubectl get pods --all-namespaces -o wide --field-selector spec.nodeName=worker-2
kubectl top pods --all-namespaces --sort-by=memory | head -20

# Drain a problematic node (move all pods to other nodes)
kubectl drain worker-2 --ignore-daemonsets --delete-emptydir-data

# Cordon a node (prevent new pods, keep existing)
kubectl cordon worker-2</code></pre>

      <h2>Problem: ConfigMap/Secret Not Loading</h2>

      <pre><code># Verify the ConfigMap exists
kubectl get configmap my-config -n my-namespace -o yaml

# Check if the pod mounts it correctly
kubectl describe pod my-pod | grep -A 10 "Mounts"
kubectl describe pod my-pod | grep -A 10 "Volumes"

# Common issue: pod was created BEFORE the ConfigMap
# ConfigMaps are loaded at pod start, not dynamically
# Fix: restart the deployment
kubectl rollout restart deployment my-app

# Check environment variables inside the pod
kubectl exec my-pod -- env | grep MY_VAR

# For mounted files:
kubectl exec my-pod -- cat /etc/config/my-setting</code></pre>

      <h2>Problem: Persistent Volume Issues</h2>

      <pre><code># Check PV and PVC status
kubectl get pv
kubectl get pvc -n my-namespace

# PVC stuck in Pending:
kubectl describe pvc my-claim -n my-namespace
# Common causes:
#   "no persistent volumes available for this claim"
#   "storageclass not found"
#   "waiting for first consumer to be created"

# Check storage classes
kubectl get storageclass
kubectl describe storageclass standard

# Multi-attach error (ReadWriteOnce volume on multiple nodes):
# Pod cannot start because the PV is attached to another node
# Fix: ensure pods using RWO volumes are on the same node
# Or use ReadWriteMany (RWX) volumes (requires NFS or similar)</code></pre>

      <h2>Advanced Debugging Tools</h2>

      <h3>Ephemeral Debug Containers</h3>

      <pre><code># Attach a debug container to a running pod (without restarting it)
kubectl debug my-pod -it --image=busybox --target=my-container

# Debug a node directly
kubectl debug node/worker-2 -it --image=ubuntu

# Create a copy of a crashing pod with a different command
kubectl debug my-pod -it --copy-to=debug-pod --container=app -- /bin/sh</code></pre>

      <h3>Network Debugging</h3>

      <pre><code># DNS resolution
kubectl run dns-test --rm -it --image=busybox -- nslookup kubernetes.default

# Check network policies blocking traffic
kubectl get networkpolicies -n my-namespace
kubectl describe networkpolicy my-policy -n my-namespace

# Port-forward for local testing
kubectl port-forward svc/my-service 8080:80 -n my-namespace
# Now access http://localhost:8080</code></pre>

      <h2>Debugging Cheat Sheet</h2>

      <table>
        <thead>
          <tr>
            <th>Symptom</th>
            <th>First Command</th>
            <th>Likely Cause</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CrashLoopBackOff</td>
            <td>kubectl logs --previous</td>
            <td>App error, OOM, missing config</td>
          </tr>
          <tr>
            <td>Pending pod</td>
            <td>kubectl describe pod</td>
            <td>Insufficient resources, taints</td>
          </tr>
          <tr>
            <td>Service no endpoints</td>
            <td>kubectl get endpoints</td>
            <td>Label selector mismatch</td>
          </tr>
          <tr>
            <td>ImagePullBackOff</td>
            <td>kubectl describe pod</td>
            <td>Wrong image name, missing pull secret</td>
          </tr>
          <tr>
            <td>Node NotReady</td>
            <td>kubectl describe node</td>
            <td>Kubelet down, resource pressure</td>
          </tr>
          <tr>
            <td>Permission denied</td>
            <td>kubectl auth can-i</td>
            <td>RBAC misconfiguration</td>
          </tr>
          <tr>
            <td>DNS not resolving</td>
            <td>kubectl logs -n kube-system coredns</td>
            <td>CoreDNS crash, network policy</td>
          </tr>
          <tr>
            <td>OOMKilled (137)</td>
            <td>kubectl top pod</td>
            <td>Memory limit too low</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>describe, logs, events</strong> &mdash; these three commands solve 80% of Kubernetes problems</li>
        <li><strong>Always check logs from the previous container</strong> with <code>--previous</code> for CrashLoopBackOff</li>
        <li><strong>Exit code 137 means OOMKilled</strong> &mdash; increase memory limits, not requests</li>
        <li><strong>Empty endpoints means label mismatch</strong> &mdash; the most common service routing issue</li>
        <li><strong>Use ephemeral debug containers</strong> to debug pods without restarting them</li>
        <li><strong>kubectl top</strong> shows real-time resource usage &mdash; compare against requests and limits</li>
        <li><strong>Port-forward is your friend</strong> for testing services locally without ingress</li>
      </ul>

      <p>Kubernetes debugging is pattern recognition. Once you have seen CrashLoopBackOff with exit code 137 a few times, you instantly know it is an OOM kill. Build your mental library of symptoms-to-causes, and every production incident becomes a 5-minute fix instead of a 2-hour investigation.</p>
    `;
