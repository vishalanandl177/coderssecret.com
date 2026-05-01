export const CONTENT = `
      <p>Kubernetes has become the de facto standard for container orchestration, but managing complex stateful applications on Kubernetes often requires more than just Deployments and Services. That's where <strong>Kubernetes Operators</strong> come in — they encode human operational knowledge into software that extends the Kubernetes API itself.</p>

      <h2>What is a Kubernetes Operator?</h2>
      <p>A Kubernetes Operator is a method of packaging, deploying, and managing a Kubernetes application using <strong>custom resources</strong> (CRs) and <strong>custom controllers</strong>. Think of it as a robot SRE that watches your cluster and takes actions to reconcile the actual state with the desired state you've declared.</p>
      <p>The Operator pattern was introduced by CoreOS in 2016 and has since become the standard way to manage complex workloads. Popular operators include the Prometheus Operator, Cert-Manager, and the PostgreSQL Operator.</p>

      <!-- Operator Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Kubernetes Operator Architecture</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Kubernetes API Server<span class="layer-item-sub">Receives CRD definitions and custom resources</span></div>
          <div class="layer-item" style="background:#7c3aed">Custom Resource Definition (CRD)<span class="layer-item-sub">Extends the API with your own resource types</span></div>
          <div class="layer-item" style="background:#ec4899">Controller / Reconciler<span class="layer-item-sub">Watches for changes, reconciles desired vs actual state</span></div>
          <div class="layer-item" style="background:#f97316">Managed Resources<span class="layer-item-sub">Deployments, Services, ConfigMaps created by the operator</span></div>
          <div class="layer-item" style="background:#22c55e">Running Workloads<span class="layer-item-sub">Pods, containers, your actual application</span></div>
        </div>
      </div>

      <h2>Core Concepts</h2>
      <p>Before building an operator, you need to understand these key concepts:</p>
      <ul>
        <li><strong>Custom Resource Definition (CRD):</strong> Extends the Kubernetes API with your own resource types. For example, you might define a <code>Database</code> resource with fields like <code>engine</code>, <code>version</code>, and <code>replicas</code>.</li>
        <li><strong>Controller:</strong> A loop that watches for changes to resources and takes action to move the current state toward the desired state. This is the brain of your operator.</li>
        <li><strong>Reconciliation Loop:</strong> The core logic of a controller. Every time a resource changes, the reconciler is called to ensure reality matches the spec.</li>
        <li><strong>Finalizers:</strong> Special metadata that prevent a resource from being deleted until cleanup logic has completed.</li>
      </ul>

      <h2>Setting Up Your Environment</h2>
      <p>To build an operator in Go, you'll use the <strong>Operator SDK</strong>, which provides scaffolding, code generation, and testing utilities.</p>
      <pre><code># Install the Operator SDK CLI
brew install operator-sdk

# Or download the binary directly
export ARCH=\$(case \$(uname -m) in x86_64) echo -n amd64 ;; aarch64) echo -n arm64 ;; esac)
export OS=\$(uname | awk '{print tolower(\$0)}')
curl -LO https://github.com/operator-framework/operator-sdk/releases/latest/download/operator-sdk_\${OS}_\${ARCH}
chmod +x operator-sdk_\${OS}_\${ARCH}
sudo mv operator-sdk_\${OS}_\${ARCH} /usr/local/bin/operator-sdk

# Verify installation
operator-sdk version</code></pre>

      <p>You'll also need Go 1.21+, Docker, kubectl, and access to a Kubernetes cluster (minikube or kind works great for development).</p>

      <h2>Scaffolding Your Operator Project</h2>
      <p>Let's build an operator that manages a custom <code>AppService</code> resource — a simplified application deployment manager.</p>
      <pre><code># Create a new project
mkdir appservice-operator && cd appservice-operator
operator-sdk init --domain example.com --repo github.com/yourname/appservice-operator

# Create an API (CRD + Controller)
operator-sdk create api --group apps --version v1alpha1 --kind AppService --resource --controller</code></pre>
      <p>This generates the project structure with boilerplate code, including the CRD types, controller skeleton, and Makefile targets.</p>

      <h2>Defining Your Custom Resource</h2>
      <p>Edit the generated types file at <code>api/v1alpha1/appservice_types.go</code>:</p>
      <pre><code>type AppServiceSpec struct {
    // Size is the number of replicas for the deployment
    Size int32 &#96;json:"size"&#96;

    // Image is the container image to deploy
    Image string &#96;json:"image"&#96;

    // Port is the port the application listens on
    Port int32 &#96;json:"port,omitempty"&#96;
}

type AppServiceStatus struct {
    // Conditions represent the latest available observations
    Conditions []metav1.Condition &#96;json:"conditions,omitempty"&#96;

    // AvailableReplicas is the number of pods ready
    AvailableReplicas int32 &#96;json:"availableReplicas,omitempty"&#96;
}</code></pre>
      <p>After modifying the types, regenerate the manifests:</p>
      <pre><code>make generate
make manifests</code></pre>

      <!-- Reconciliation Loop -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The Reconciliation Loop</div>
        <div class="cycle-diagram">
          <div class="cycle-ring">
            <div class="cycle-node" style="background:#3b82f6"><span class="cycle-node-icon">&#x1F440;</span>Watch</div>
            <div class="cycle-node" style="background:#7c3aed"><span class="cycle-node-icon">&#x1F4E9;</span>Event</div>
            <div class="cycle-node" style="background:#f97316"><span class="cycle-node-icon">&#x2699;</span>Reconcile</div>
            <div class="cycle-node" style="background:#ec4899"><span class="cycle-node-icon">&#x1F50D;</span>Compare</div>
            <div class="cycle-center">&#x267B; Loop</div>
            <div class="cycle-node" style="background:#22c55e"><span class="cycle-node-icon">&#x2705;</span>Converge</div>
          </div>
        </div>
      </div>

      <h2>Implementing the Reconciliation Loop</h2>
      <p>The reconciler is where all the magic happens. Edit <code>internal/controller/appservice_controller.go</code>:</p>
      <pre><code>func (r *AppServiceReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    log := log.FromContext(ctx)

    // 1. Fetch the AppService instance
    appService := &appsv1alpha1.AppService{}
    if err := r.Get(ctx, req.NamespacedName, appService); err != nil {
        if apierrors.IsNotFound(err) {
            log.Info("AppService resource not found — probably deleted")
            return ctrl.Result{}, nil
        }
        return ctrl.Result{}, err
    }

    // 2. Check if the Deployment already exists, create if not
    deployment := &appsv1.Deployment{}
    err := r.Get(ctx, types.NamespacedName{
        Name:      appService.Name,
        Namespace: appService.Namespace,
    }, deployment)

    if err != nil && apierrors.IsNotFound(err) {
        dep := r.createDeployment(appService)
        log.Info("Creating a new Deployment", "Name", dep.Name)
        if err = r.Create(ctx, dep); err != nil {
            return ctrl.Result{}, err
        }
        return ctrl.Result{Requeue: true}, nil
    }

    // 3. Ensure the replica count matches the spec
    if *deployment.Spec.Replicas != appService.Spec.Size {
        deployment.Spec.Replicas = &appService.Spec.Size
        if err = r.Update(ctx, deployment); err != nil {
            return ctrl.Result{}, err
        }
    }

    // 4. Update status
    appService.Status.AvailableReplicas = deployment.Status.AvailableReplicas
    if err := r.Status().Update(ctx, appService); err != nil {
        return ctrl.Result{}, err
    }

    return ctrl.Result{}, nil
}</code></pre>

      <h2>Testing Your Operator</h2>
      <p>The Operator SDK generates test scaffolding using Ginkgo and envtest:</p>
      <pre><code># Run unit tests
make test

# Run the operator locally against your cluster
make install  # Install CRDs
make run      # Run the controller locally

# In another terminal, create a sample resource
kubectl apply -f config/samples/apps_v1alpha1_appservice.yaml

# Watch it work
kubectl get appservice
kubectl get deployments
kubectl get pods</code></pre>

      <!-- Build Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Operator Development Pipeline</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#7c3aed;--i:0"><span class="pipeline-step-icon">&#x1F4DD;</span>Define CRD<span class="pipeline-step-sub">types.go</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:1"><span class="pipeline-step-icon">&#x2699;</span>Generate<span class="pipeline-step-sub">make manifests</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ec4899;--i:2"><span class="pipeline-step-icon">&#x1F4BB;</span>Implement<span class="pipeline-step-sub">controller.go</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x1F9EA;</span>Test<span class="pipeline-step-sub">make test</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:4"><span class="pipeline-step-icon">&#x1F680;</span>Deploy<span class="pipeline-step-sub">make deploy</span></div>
        </div>
      </div>

      <h2>Deploying to Production</h2>
      <p>When you're ready to deploy the operator to a real cluster:</p>
      <pre><code># Build and push the operator image
make docker-build docker-push IMG=yourregistry/appservice-operator:v0.1.0

# Deploy to the cluster
make deploy IMG=yourregistry/appservice-operator:v0.1.0

# Verify it's running
kubectl get pods -n appservice-operator-system</code></pre>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Idempotency:</strong> Your reconciler will be called multiple times. Every operation must be safe to repeat without side effects.</li>
        <li><strong>Status Subresource:</strong> Always update status via the status subresource, not the main resource. This avoids conflicts and follows Kubernetes conventions.</li>
        <li><strong>Owner References:</strong> Set owner references on child resources so they're automatically garbage collected when the parent is deleted.</li>
        <li><strong>RBAC:</strong> Follow the principle of least privilege. Only request the permissions your operator actually needs.</li>
        <li><strong>Error Handling:</strong> Return errors from the reconciler to trigger automatic requeue with exponential backoff.</li>
        <li><strong>Finalizers:</strong> Use finalizers for cleanup logic that must run before deletion (e.g., deleting external cloud resources).</li>
        <li><strong>Observability:</strong> Add metrics, structured logging, and events to make your operator debuggable in production.</li>
      </ul>

      <p>Kubernetes Operators are one of the most powerful patterns in the cloud-native ecosystem. They let you automate complex operational tasks, enforce best practices, and build self-healing infrastructure. With Go and the Operator SDK, you have everything you need to start building production-grade operators today.</p>
    `;
