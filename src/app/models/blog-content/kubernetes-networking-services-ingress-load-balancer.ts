export const CONTENT = `
      <p>Kubernetes networking is the #1 thing that confuses beginners. You deploy your app, but how do users actually reach it? You hear terms like "ClusterIP," "NodePort," "LoadBalancer," "Ingress," and "ALB Controller" — and they all seem to do similar things. This guide explains each one using <strong>simple analogies</strong>, shows you <strong>when to use what</strong>, and gives you copy-paste YAML for every scenario.</p>

      <h2>The Big Picture: How Traffic Reaches Your App</h2>
      <p>Think of Kubernetes like a large office building. Your application pods are employees working in rooms. The question is: how does someone from outside the building find and talk to the right employee?</p>

      <!-- The Analogy -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Kubernetes Networking: The Office Building Analogy</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">Internet (The Street)<span class="layer-item-sub">Users, browsers, mobile apps — the outside world trying to reach your app</span></div>
          <div class="layer-item" style="background:#f97316">Load Balancer (The Main Entrance)<span class="layer-item-sub">One public IP address — the front door of your building. Routes traffic inside.</span></div>
          <div class="layer-item" style="background:#7c3aed">Ingress (The Receptionist)<span class="layer-item-sub">Reads the request and routes to the right department: api.example.com goes to API team, app.example.com goes to Frontend team</span></div>
          <div class="layer-item" style="background:#3b82f6">Service (The Department Phone Extension)<span class="layer-item-sub">A stable "phone number" for a group of pods. Even if employees (pods) change desks, the extension stays the same.</span></div>
          <div class="layer-item" style="background:#22c55e">Pod (The Employee)<span class="layer-item-sub">The actual running instance of your application. Pods come and go — they're ephemeral.</span></div>
        </div>
      </div>

      <h2>Kubernetes Services: The Foundation</h2>
      <p>A <strong>Service</strong> is the most fundamental networking concept in Kubernetes. Pods are temporary — they get created, destroyed, and rescheduled constantly. A Service gives you a <strong>stable address</strong> that always points to the right pods, no matter how many there are or where they're running.</p>

      <h2>ClusterIP: Internal Communication Only</h2>
      <p><strong>Analogy:</strong> An internal phone extension. Only people inside the building can call it. Outsiders can't.</p>
      <p><strong>Use when:</strong> Service A needs to talk to Service B <em>inside</em> the cluster. Your API calling your database. Your backend calling a cache service.</p>

      <!-- ClusterIP Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">ClusterIP: Internal Cluster Communication</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Frontend Pod<span class="seq-actor-sub">(Inside cluster)</span></div>
            <div class="seq-actor idp">ClusterIP Service<span class="seq-actor-sub">(Stable internal IP)</span></div>
            <div class="seq-actor sp">Backend Pods<span class="seq-actor-sub">(Multiple replicas)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> http://backend-service:8080/api</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Load balance across pods (round-robin)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right-23" style="--arrow-color:#22c55e"><span class="seq-num green">2</span> Forward to healthy pod (10.244.1.15:8080)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> Response &#x2705;</div>
            </div>
          </div>
        </div>
      </div>

      <pre><code># ClusterIP Service — the DEFAULT type
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP          # This is the default, you can omit this line
  selector:
    app: backend            # Find pods with label app=backend
  ports:
    - port: 8080            # Port the service listens on
      targetPort: 8080      # Port the pod listens on
      protocol: TCP

# Now any pod in the cluster can reach the backend at:
#   http://backend-service:8080          (same namespace)
#   http://backend-service.default:8080  (from another namespace)
#   http://backend-service.default.svc.cluster.local:8080  (fully qualified)

# Kubernetes DNS automatically creates these names!

# You can also use it for your database:
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432

# Now your app connects to: postgres://postgres:5432/mydb
# No IP addresses needed — just the service name!</code></pre>

      <h2>NodePort: Quick External Access (Development Only)</h2>
      <p><strong>Analogy:</strong> Punching a hole in the building wall. Anyone who knows the building's address and the hole number can reach in directly.</p>
      <p><strong>Use when:</strong> You need quick external access for testing/development. <strong>Never in production</strong> — it's insecure and limited.</p>

      <pre><code># NodePort Service — opens a port on EVERY node
apiVersion: v1
kind: Service
metadata:
  name: my-app-nodeport
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080    # Port opened on every node (range: 30000-32767)

# Access your app at:
#   http://&lt;ANY-NODE-IP&gt;:30080
#   e.g., http://10.0.1.5:30080 or http://10.0.1.6:30080

# Problems with NodePort:
# 1. Ugly ports (30000-32767 range only)
# 2. Users need to know a node IP
# 3. If a node dies, that IP stops working
# 4. No SSL termination
# 5. No path-based routing
# Verdict: Fine for dev/testing, never for production</code></pre>

      <h2>LoadBalancer: Cloud-Native External Access</h2>
      <p><strong>Analogy:</strong> Hiring a professional doorman who stands at the main entrance. They have a public address that never changes, and they route visitors to the right place.</p>
      <p><strong>Use when:</strong> You need to expose ONE service to the internet with a stable public IP. Works on AWS (NLB/CLB), GCP, Azure.</p>

      <!-- LoadBalancer Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">LoadBalancer Service: One Public IP Per Service</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#ef4444;--i:0"><span class="pipeline-step-icon">&#x1F310;</span>Internet<span class="pipeline-step-sub">Users</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:1"><span class="pipeline-step-icon">&#x1F3E2;</span>Cloud LB<span class="pipeline-step-sub">Public IP</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:2"><span class="pipeline-step-icon">&#x1F504;</span>Service<span class="pipeline-step-sub">LoadBalancer</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x1F4E6;</span>Pod 1<span class="pipeline-step-sub">Replica</span></div>
          <div class="pipeline-step" style="background:#22c55e;--i:4"><span class="pipeline-step-icon">&#x1F4E6;</span>Pod 2<span class="pipeline-step-sub">Replica</span></div>
        </div>
      </div>

      <pre><code># LoadBalancer Service — creates a cloud load balancer
apiVersion: v1
kind: Service
metadata:
  name: my-app-lb
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080

# On AWS, this creates a Classic Load Balancer (CLB) automatically
# kubectl get svc my-app-lb
# NAME        TYPE           EXTERNAL-IP                              PORT(S)
# my-app-lb   LoadBalancer   a1b2c3d4.us-east-1.elb.amazonaws.com    80:31234/TCP

# Point your DNS to the EXTERNAL-IP and you're live!

# Problem: Each LoadBalancer service creates a NEW cloud LB
# 10 services = 10 load balancers = 10x the cost!
# That's why we use Ingress...</code></pre>

      <h2>Ingress: The Smart Router (Production Standard)</h2>
      <p><strong>Analogy:</strong> A receptionist at the front desk. <em>One</em> entrance (one load balancer), but the receptionist reads the visitor's request and routes them to the right department:</p>
      <ul>
        <li>"I'm here for the API" &#x2192; Route to API service</li>
        <li>"I'm here for the website" &#x2192; Route to frontend service</li>
        <li>"I'm here for the admin panel" &#x2192; Route to admin service</li>
      </ul>

      <!-- Ingress Routing Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Ingress: One Load Balancer, Multiple Services</div>
        <div class="hub-diagram">
          <div class="hub-center" style="background:#7c3aed;box-shadow:0 0 30px rgba(124,58,237,0.3)">
            Ingress Controller
            <span class="hub-center-sub">One LB, smart routing by host/path</span>
          </div>
          <div class="hub-arrow-label"><span class="arrow-animated">&#x2B07;</span> Routes based on hostname and URL path</div>
          <div class="hub-apps">
            <div class="hub-app"><span class="hub-app-icon">&#x1F310;</span>api.example.com<span class="hub-app-sub">API Service</span></div>
            <div class="hub-app" style="background:#f97316"><span class="hub-app-icon">&#x1F5A5;</span>app.example.com<span class="hub-app-sub">Frontend Service</span></div>
            <div class="hub-app" style="background:#a855f7"><span class="hub-app-icon">&#x1F512;</span>admin.example.com<span class="hub-app-sub">Admin Service</span></div>
            <div class="hub-app" style="background:#ef4444"><span class="hub-app-icon">&#x1F4CA;</span>grafana.example.com<span class="hub-app-sub">Monitoring Service</span></div>
          </div>
        </div>
      </div>

      <pre><code># Step 1: Install an Ingress Controller (runs once per cluster)
# The controller IS the actual reverse proxy (nginx, traefik, etc.)

# Option A: nginx Ingress Controller
helm upgrade --install ingress-nginx ingress-nginx \\
  --repo https://kubernetes.github.io/ingress-nginx \\
  --namespace ingress-nginx --create-namespace

# Option B: AWS ALB Controller (see next section)

# Step 2: Create Ingress rules
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt    # Auto TLS certs!
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.example.com
        - app.example.com
      secretName: my-tls-cert
  rules:
    # Route by hostname
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80

    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80

    # Route by path (same hostname, different paths)
    - host: example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /admin
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80</code></pre>

      <h2>AWS ALB Controller: The AWS-Native Ingress</h2>
      <p>The <strong>AWS Load Balancer Controller</strong> (formerly ALB Ingress Controller) creates AWS Application Load Balancers directly from your Ingress resources. Instead of running nginx inside the cluster, it uses AWS-managed ALBs — which means AWS handles scaling, health checks, and SSL termination for you.</p>

      <!-- ALB Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">AWS ALB Controller Architecture</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#f97316">Internet &#x2192; Route53 (DNS)<span class="layer-item-sub">api.example.com &#x2192; ALB public endpoint</span></div>
          <div class="layer-item" style="background:#3b82f6">AWS ALB (Application Load Balancer)<span class="layer-item-sub">Managed by AWS — auto-scaling, WAF integration, SSL termination, access logs</span></div>
          <div class="layer-item" style="background:#7c3aed">Target Groups<span class="layer-item-sub">ALB routes to pods directly (IP mode) or via NodePort — bypasses kube-proxy</span></div>
          <div class="layer-item" style="background:#22c55e">Pods<span class="layer-item-sub">Your application containers receive traffic directly from the ALB</span></div>
        </div>
      </div>

      <pre><code># Install AWS Load Balancer Controller on EKS
# Prerequisites: EKS cluster with IRSA (IAM Roles for Service Accounts)

# 1. Create IAM policy
curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
aws iam create-policy \\
  --policy-name AWSLoadBalancerControllerIAMPolicy \\
  --policy-document file://iam-policy.json

# 2. Create service account with IAM role
eksctl create iamserviceaccount \\
  --cluster=my-cluster \\
  --namespace=kube-system \\
  --name=aws-load-balancer-controller \\
  --attach-policy-arn=arn:aws:iam::ACCOUNT:policy/AWSLoadBalancerControllerIAMPolicy \\
  --approve

# 3. Install via Helm
helm install aws-load-balancer-controller \\
  eks/aws-load-balancer-controller \\
  -n kube-system \\
  --set clusterName=my-cluster \\
  --set serviceAccount.create=false \\
  --set serviceAccount.name=aws-load-balancer-controller

# 4. Create Ingress with ALB annotations
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-alb-ingress
  annotations:
    # Tell K8s to use the ALB controller (not nginx)
    kubernetes.io/ingress.class: alb

    # Internet-facing (vs internal for private APIs)
    alb.ingress.kubernetes.io/scheme: internet-facing

    # Route directly to pod IPs (faster than NodePort)
    alb.ingress.kubernetes.io/target-type: ip

    # SSL: use ACM certificate
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:ACCOUNT:certificate/xxx

    # Redirect HTTP to HTTPS
    alb.ingress.kubernetes.io/ssl-redirect: "443"

    # Health check path
    alb.ingress.kubernetes.io/healthcheck-path: /health

    # Enable WAF (Web Application Firewall)
    # alb.ingress.kubernetes.io/waf-acl-id: your-waf-id

    # Access logs to S3
    # alb.ingress.kubernetes.io/load-balancer-attributes: access_logs.s3.enabled=true,access_logs.s3.bucket=my-logs

spec:
  ingressClassName: alb
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80</code></pre>

      <h2>nginx Ingress vs ALB Controller: When to Use Which</h2>

      <!-- nginx vs ALB -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">nginx Ingress Controller vs AWS ALB Controller</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">nginx Ingress Controller</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Runs inside cluster (as pods)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2601;</span>Cloud-agnostic (AWS, GCP, Azure, bare metal)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Full nginx config control (custom headers, rewrites)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>One NLB for all Ingress rules (cheaper)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: multi-cloud, custom routing, rate limiting</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">AWS ALB Controller</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Runs in AWS (managed ALB, not in cluster)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2601;</span>AWS-only (EKS)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Deep AWS integration (WAF, Cognito, ACM, Shield)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>One ALB per Ingress by default (can be grouped)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: AWS-native, WAF, Cognito auth, access logs</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Network Policies: Firewall Rules for Pods</h2>
      <p>By default, <strong>every pod can talk to every other pod</strong> in the cluster. That's dangerous. Network Policies are Kubernetes's firewall — they control which pods can communicate with which.</p>
      <pre><code># Default deny all ingress (lock down first, then whitelist)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {}    # Apply to ALL pods in this namespace
  policyTypes:
    - Ingress
  # No ingress rules = deny everything!

---
# Allow frontend to talk to backend (and nothing else)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend       # Apply to backend pods
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend   # Only frontend pods can connect
      ports:
        - port: 8080
          protocol: TCP

---
# Allow backend to talk to database
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-backend-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: postgres
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend
      ports:
        - port: 5432</code></pre>

      <h2>The Complete Decision Guide</h2>

      <!-- Decision Guide -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">When to Use What: The Complete Guide</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">I Want To...</th>
                <th style="text-align:left;padding:0.6rem;background:#3b82f6;color:#fff">Use This</th>
                <th style="text-align:left;padding:0.6rem;background:#3b82f6;color:#fff;border-radius:0 0.4rem 0 0">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Connect microservices internally</td><td style="padding:0.5rem;color:#3b82f6;font-weight:700">ClusterIP Service</td><td style="padding:0.5rem">Stable DNS name, internal only, free</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Quick test access from my laptop</td><td style="padding:0.5rem;color:#f97316;font-weight:700">NodePort or kubectl port-forward</td><td style="padding:0.5rem">Fast, no cloud resources needed</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Expose ONE service to internet</td><td style="padding:0.5rem;color:#7c3aed;font-weight:700">LoadBalancer Service</td><td style="padding:0.5rem">Gets a public IP, simple setup</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Expose MANY services on one IP</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">Ingress (nginx or ALB)</td><td style="padding:0.5rem">Host/path routing, SSL, one LB cost</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Use AWS WAF, Cognito, ACM</td><td style="padding:0.5rem;color:#f97316;font-weight:700">AWS ALB Controller</td><td style="padding:0.5rem">Deep AWS integration</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Run on any cloud or bare metal</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">nginx Ingress Controller</td><td style="padding:0.5rem">Cloud-agnostic, full control</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Restrict which pods can communicate</td><td style="padding:0.5rem;color:#ef4444;font-weight:700">NetworkPolicy</td><td style="padding:0.5rem">Pod-level firewall rules</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">gRPC, mTLS, traffic splitting</td><td style="padding:0.5rem;color:#ec4899;font-weight:700">Service Mesh (Istio/Linkerd)</td><td style="padding:0.5rem">Advanced L7 features, observability</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Expose a TCP/UDP service (not HTTP)</td><td style="padding:0.5rem;color:#7c3aed;font-weight:700">LoadBalancer (NLB on AWS)</td><td style="padding:0.5rem">Ingress is HTTP-only, NLB handles TCP/UDP</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Common Beginner Mistakes</h2>
      <ul>
        <li><strong>"My pod has an IP, why do I need a Service?"</strong> &#x2014; Pod IPs change every time a pod restarts or moves to another node. Services give you a stable address. Never hardcode pod IPs.</li>
        <li><strong>"I created a LoadBalancer for every service"</strong> &#x2014; Each LoadBalancer creates a new cloud LB ($$). Use one Ingress to route to many services behind a single LB.</li>
        <li><strong>"I'm using NodePort in production"</strong> &#x2014; NodePort exposes a random high port on every node. No SSL, no path routing, ugly URLs. Use Ingress instead.</li>
        <li><strong>"My Ingress isn't working"</strong> &#x2014; Most likely you forgot to install an Ingress Controller. Ingress resources are just rules — you need a controller (nginx, traefik, ALB) to actually execute them.</li>
        <li><strong>"I can't connect from one namespace to another"</strong> &#x2014; Use the full DNS name: <code>service-name.namespace.svc.cluster.local</code>. Or check if a NetworkPolicy is blocking it.</li>
      </ul>

      <h2>Debugging Kubernetes Networking</h2>
      <pre><code># 1. Is my pod running and healthy?
kubectl get pods -o wide
kubectl logs my-pod
kubectl describe pod my-pod

# 2. Does my Service have endpoints?
kubectl get endpoints my-service
# If ENDPOINTS is empty: your selector labels don't match any pods!

# 3. Can I reach the service from inside the cluster?
kubectl run debug --image=nicolaka/netshoot -it --rm -- bash
curl http://my-service:8080/health     # By service name
nslookup my-service                     # DNS resolution

# 4. Is the Ingress controller running?
kubectl get pods -n ingress-nginx
kubectl get ingress                     # Check ADDRESS column

# 5. What does the ALB look like?
kubectl describe ingress my-ingress
# Look for Events: "Successfully reconciled" = ALB created
# Check the ADDRESS field for the ALB URL

# 6. Network Policy blocking traffic?
kubectl get networkpolicy -A
kubectl describe networkpolicy deny-all</code></pre>

      <p>Kubernetes networking follows a simple progression: <strong>ClusterIP</strong> for internal communication, <strong>Ingress</strong> for external HTTP traffic (with nginx or ALB Controller), <strong>LoadBalancer</strong> for non-HTTP services, and <strong>NetworkPolicy</strong> for security. Start with ClusterIP + Ingress — that covers 90% of use cases. Add complexity only when you need it.</p>
    `;
