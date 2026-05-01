export const CONTENT = `
      <p>Here's a confession: the first time I switched from AWS to GCP, I spent two hours looking for "IAM Roles" in the GCP console. I found them — but they meant something completely different from what AWS calls a "Role." Same word, different concept entirely. If you've ever felt this confusion, you're not alone. Every cloud uses slightly different terminology for the same fundamental concepts.</p>

      <p>This guide does three things: (1) explains IAM from the ground up, (2) maps the terminology across all three major clouds, and (3) gives you production-ready examples for each. Whether you're on AWS, GCP, Azure, or all three — you'll walk away knowing exactly what to do.</p>

      <h2>What is IAM, Really?</h2>

      <p>Every single API call to any cloud service starts with two questions:</p>
      <ul>
        <li><strong>Authentication:</strong> "Who are you?" — prove your identity (certificate, password, token)</li>
        <li><strong>Authorization:</strong> "What can you do?" — check your permissions against a policy</li>
      </ul>

      <p>IAM (Identity and Access Management) is the system that answers both. It's the bouncer at the door of every cloud resource.</p>

      <!-- IAM Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How Every Cloud API Call Works</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F464;</span>Identity<span class="pipeline-step-sub">Who are you?</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F4CB;</span>Policy<span class="pipeline-step-sub">What can you do?</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x2699;</span>Evaluate<span class="pipeline-step-sub">Allow or deny?</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x2705;</span>Access<span class="pipeline-step-sub">Perform action</span></div>
        </div>
      </div>

      <h2>The Rosetta Stone: Terminology Mapping</h2>

      <p>This is the most valuable table in this article. Bookmark it. Print it. Tattoo it. Every time you switch between clouds, come back here.</p>

      <!-- Terminology Table -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">IAM Terminology: AWS vs GCP vs Azure</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.75rem;min-width:600px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Concept</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">AWS</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">GCP</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff;border-radius:0 0.4rem 0 0">Azure</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Human user</td><td style="padding:0.5rem;text-align:center">IAM User</td><td style="padding:0.5rem;text-align:center">Google Account</td><td style="padding:0.5rem;text-align:center">Entra ID User</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Machine identity</td><td style="padding:0.5rem;text-align:center;color:#f97316;font-weight:700">IAM Role</td><td style="padding:0.5rem;text-align:center;color:#3b82f6;font-weight:700">Service Account</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Managed Identity</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Permission bundle</td><td style="padding:0.5rem;text-align:center">IAM Policy (JSON)</td><td style="padding:0.5rem;text-align:center">IAM Role (predefined)</td><td style="padding:0.5rem;text-align:center">Role Definition</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Attach permissions to identity</td><td style="padding:0.5rem;text-align:center">Attach Policy to Role/User</td><td style="padding:0.5rem;text-align:center">Grant Role to Member</td><td style="padding:0.5rem;text-align:center">Role Assignment</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Group</td><td style="padding:0.5rem;text-align:center">IAM Group</td><td style="padding:0.5rem;text-align:center">Google Group</td><td style="padding:0.5rem;text-align:center">Entra ID Group</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Temp credentials</td><td style="padding:0.5rem;text-align:center">STS AssumeRole</td><td style="padding:0.5rem;text-align:center">Workload Identity</td><td style="padding:0.5rem;text-align:center">Managed Identity Token</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Resource boundary</td><td style="padding:0.5rem;text-align:center">Account</td><td style="padding:0.5rem;text-align:center">Project</td><td style="padding:0.5rem;text-align:center">Subscription</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Org-level guardrail</td><td style="padding:0.5rem;text-align:center">SCP</td><td style="padding:0.5rem;text-align:center">Organization Policy</td><td style="padding:0.5rem;text-align:center">Azure Policy</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Audit trail</td><td style="padding:0.5rem;text-align:center">CloudTrail</td><td style="padding:0.5rem;text-align:center">Cloud Audit Logs</td><td style="padding:0.5rem;text-align:center">Activity Log</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Secret store</td><td style="padding:0.5rem;text-align:center">Secrets Manager</td><td style="padding:0.5rem;text-align:center">Secret Manager</td><td style="padding:0.5rem;text-align:center">Key Vault</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <p><strong>The biggest confusion:</strong> In AWS, a "Role" is a <em>machine identity</em> (what a Lambda or EC2 instance assumes). In GCP, a "Role" is a <em>set of permissions</em> (like <code>roles/storage.objectViewer</code>). Completely different concepts, same word. Keep this in mind — it will save you hours of confusion.</p>

      <h2>AWS IAM — The Deepest, Most Granular</h2>

      <p>AWS has the most powerful (and most complex) IAM system. You can control permissions at a ridiculously fine level — down to "this Lambda can only read this specific S3 prefix between 9 AM and 5 PM on weekdays."</p>

      <h2>AWS Policy Anatomy</h2>

      <pre><code>// AWS IAM Policy — the fundamental building block
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnly",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-app-data",
        "arn:aws:s3:::my-app-data/*"
      ],
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "10.0.0.0/16"
        }
      }
    },
    {
      "Sid": "DenyDeleteEverything",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "*"
    }
  ]
}

// Key concepts:
// Effect: Allow or Deny (Deny always wins)
// Action: What API calls are permitted
// Resource: Which specific resources (ARN = Amazon Resource Name)
// Condition: Extra constraints (IP, time, MFA, tags, etc.)</code></pre>

      <h2>AWS: The Right Way (Roles, Not Keys)</h2>

      <pre><code># &#x274C; WRONG: Hardcoded credentials (will get leaked)
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=wJa...
# These end up in git, CI logs, and eventually on HaveIBeenPwned

# &#x2705; RIGHT: Use IAM Roles (no credentials to manage!)

# For EC2: Attach an Instance Profile
aws ec2 run-instances \\
  --instance-type t3.micro \\
  --iam-instance-profile Name=my-app-role \\
  --image-id ami-xxx
# The EC2 instance automatically gets temp credentials via metadata service
# No keys. No rotation. No leaks.

# For Lambda: Attach an Execution Role
aws lambda create-function \\
  --function-name process-orders \\
  --role arn:aws:iam::123456789:role/lambda-order-processor \\
  --runtime python3.12 \\
  --handler app.handler
# Lambda gets temporary credentials automatically

# For EKS pods: Use IRSA (IAM Roles for Service Accounts)
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-app
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789:role/my-app-role
# Each pod gets its own IAM role via projected service account tokens

# For cross-account: AssumeRole
aws sts assume-role \\
  --role-arn arn:aws:iam::OTHER_ACCOUNT:role/cross-account-reader \\
  --role-session-name my-session
# Returns temporary credentials for the other account</code></pre>

      <pre><code># Terraform: Create an IAM Role for a Lambda function
resource "aws_iam_role" "lambda_role" {
  name = "order-processor-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "lambda_s3_access" {
  name = "s3-read-access"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:ListBucket"]
      Resource = ["arn:aws:s3:::orders-bucket", "arn:aws:s3:::orders-bucket/*"]
    }]
  })
}</code></pre>

      <h2>GCP IAM — Clean, Project-Centric</h2>

      <p>GCP takes a different approach. Instead of writing JSON policies from scratch, you pick from hundreds of <strong>predefined roles</strong> and grant them to identities at specific resource levels. Much simpler to get started, but less granular than AWS.</p>

      <!-- GCP Model -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">GCP IAM Model</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Organization (mycompany.com)<span class="layer-item-sub">Top-level container. Organization policies set guardrails for all projects.</span></div>
          <div class="layer-item" style="background:#7c3aed">Folder (Engineering / Finance / Staging)<span class="layer-item-sub">Groups related projects. Permissions inherited downward.</span></div>
          <div class="layer-item" style="background:#f97316">Project (my-app-prod)<span class="layer-item-sub">The resource boundary. Each project has its own IAM bindings.</span></div>
          <div class="layer-item" style="background:#22c55e">Resources (GCS bucket, Cloud SQL, GKE cluster)<span class="layer-item-sub">Individual resources can have their own IAM bindings too.</span></div>
        </div>
      </div>

      <pre><code># GCP IAM: Grant a role to a service account at project level
gcloud projects add-iam-policy-binding my-app-prod \\
  --member="serviceAccount:order-processor@my-app-prod.iam.gserviceaccount.com" \\
  --role="roles/storage.objectViewer"

# Key GCP roles you'll use most:
# roles/viewer                     — Read everything in the project
# roles/editor                     — Read + write (DANGEROUS — avoid!)
# roles/owner                      — Full control (only for admins)
# roles/storage.objectViewer       — Read GCS objects
# roles/cloudsql.client            — Connect to Cloud SQL
# roles/container.developer        — Deploy to GKE
# roles/iam.serviceAccountUser     — Impersonate service accounts

# &#x274C; WRONG: Download a JSON key file
gcloud iam service-accounts keys create key.json \\
  --iam-account=my-sa@project.iam.gserviceaccount.com
# This key NEVER expires and will eventually leak. Don't do this.

# &#x2705; RIGHT: Use Workload Identity (no key files!)
# For GKE pods:
gcloud iam service-accounts add-iam-policy-binding \\
  order-processor@my-app-prod.iam.gserviceaccount.com \\
  --role="roles/iam.workloadIdentityUser" \\
  --member="serviceAccount:my-app-prod.svc.id.goog[production/order-processor]"

# Kubernetes ServiceAccount annotation:
apiVersion: v1
kind: ServiceAccount
metadata:
  name: order-processor
  namespace: production
  annotations:
    iam.gke.io/gcp-service-account: order-processor@my-app-prod.iam.gserviceaccount.com
# Pods using this SA automatically get GCP credentials. No JSON keys!

# For external workloads (GitHub Actions, other clouds):
# Use Workload Identity Federation — exchange an OIDC token for GCP credentials
gcloud iam workload-identity-pools create github-pool \\
  --location="global" \\
  --display-name="GitHub Actions"

# Your GitHub workflow uses: google-github-actions/auth@v2
# No service account key stored in GitHub secrets!</code></pre>

      <pre><code># Terraform: GCP IAM for a Cloud Run service
resource "google_service_account" "order_processor" {
  account_id   = "order-processor"
  display_name = "Order Processor Service"
  project      = "my-app-prod"
}

resource "google_project_iam_member" "storage_access" {
  project = "my-app-prod"
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:order-processor@my-app-prod.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "sql_access" {
  project = "my-app-prod"
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:order-processor@my-app-prod.iam.gserviceaccount.com"
}

# Custom role (when predefined roles give too much access)
resource "google_project_iam_custom_role" "minimal_storage" {
  role_id     = "minimalStorageReader"
  title       = "Minimal Storage Reader"
  project     = "my-app-prod"
  permissions = [
    "storage.objects.get",
    "storage.objects.list",
  ]
}</code></pre>

      <h2>Azure IAM — RBAC with Scope Hierarchy</h2>

      <p>Azure uses <strong>Role-Based Access Control (RBAC)</strong> with a clear scope hierarchy. Permissions flow down from Management Group → Subscription → Resource Group → Resource. The key concept is <strong>Managed Identities</strong> — Azure's equivalent of AWS Roles and GCP Service Accounts.</p>

      <!-- Azure Model -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Azure RBAC Scope Hierarchy</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Management Group<span class="layer-item-sub">Groups multiple subscriptions. Enterprise-level governance.</span></div>
          <div class="layer-item" style="background:#7c3aed">Subscription (Pay-As-You-Go, Enterprise)<span class="layer-item-sub">Billing boundary. Like AWS Account or GCP Project.</span></div>
          <div class="layer-item" style="background:#f97316">Resource Group (rg-orders-prod)<span class="layer-item-sub">Logical container for related resources. Primary RBAC scope.</span></div>
          <div class="layer-item" style="background:#22c55e">Resource (Storage Account, SQL Database, AKS)<span class="layer-item-sub">Individual resource. Finest RBAC scope.</span></div>
        </div>
      </div>

      <pre><code># Azure: Assign a role to a Managed Identity
# Create a user-assigned managed identity
az identity create \\
  --name order-processor-identity \\
  --resource-group rg-orders-prod

# Assign "Storage Blob Data Reader" role scoped to a storage account
az role assignment create \\
  --assignee order-processor-identity \\
  --role "Storage Blob Data Reader" \\
  --scope "/subscriptions/SUB_ID/resourceGroups/rg-orders-prod/providers/Microsoft.Storage/storageAccounts/ordersdata"

# Key Azure built-in roles:
# Reader                          — Read everything
# Contributor                     — Read + write (no IAM changes)
# Owner                           — Full control including IAM
# Storage Blob Data Reader        — Read blobs
# Storage Blob Data Contributor   — Read + write blobs
# SQL DB Contributor               — Manage SQL databases
# AcrPull                          — Pull container images from ACR

# &#x274C; WRONG: Service Principal with client secret
az ad sp create-for-rbac --name my-app
# Creates a client ID + client secret that you have to rotate manually

# &#x2705; RIGHT: Managed Identity (no secrets to manage!)
# System-assigned: tied to one resource, deleted with it
az vm identity assign --name my-vm --resource-group rg-orders-prod

# User-assigned: reusable across multiple resources
az webapp identity assign \\
  --name my-web-app \\
  --resource-group rg-orders-prod \\
  --identities order-processor-identity

# For AKS pods: Use Azure Workload Identity
# (Azure's equivalent of IRSA on AWS and Workload Identity on GCP)
az aks update --name my-cluster --resource-group rg-orders-prod \\
  --enable-oidc-issuer --enable-workload-identity</code></pre>

      <pre><code># Terraform: Azure RBAC for an App Service
resource "azurerm_user_assigned_identity" "order_processor" {
  name                = "order-processor-identity"
  resource_group_name = azurerm_resource_group.orders.name
  location            = azurerm_resource_group.orders.location
}

resource "azurerm_role_assignment" "storage_read" {
  scope                = azurerm_storage_account.orders.id
  role_definition_name = "Storage Blob Data Reader"
  principal_id         = azurerm_user_assigned_identity.order_processor.principal_id
}

resource "azurerm_role_assignment" "sql_access" {
  scope                = azurerm_mssql_server.orders.id
  role_definition_name = "SQL DB Contributor"
  principal_id         = azurerm_user_assigned_identity.order_processor.principal_id
}</code></pre>

      <h2>Machine Identity: The Most Important Concept</h2>

      <p>If there's ONE thing you take from this article, let it be this: <strong>never give your applications long-lived credentials</strong>. Every cloud has a way to give workloads temporary, auto-rotated identity without you managing any secrets.</p>

      <!-- Machine Identity Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Machine Identity: The Right Way on Each Cloud</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Workload</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">AWS</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">GCP</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff;border-radius:0 0.4rem 0 0">Azure</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">VM / Compute</td><td style="padding:0.5rem;text-align:center">Instance Profile</td><td style="padding:0.5rem;text-align:center">Attached SA</td><td style="padding:0.5rem;text-align:center">Managed Identity</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Serverless</td><td style="padding:0.5rem;text-align:center">Lambda Execution Role</td><td style="padding:0.5rem;text-align:center">Cloud Function SA</td><td style="padding:0.5rem;text-align:center">Function Managed ID</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Kubernetes Pod</td><td style="padding:0.5rem;text-align:center">IRSA</td><td style="padding:0.5rem;text-align:center">Workload Identity</td><td style="padding:0.5rem;text-align:center">Workload Identity</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">CI/CD</td><td style="padding:0.5rem;text-align:center">OIDC Provider</td><td style="padding:0.5rem;text-align:center">Workload Identity Fed.</td><td style="padding:0.5rem;text-align:center">Federated Credential</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Cross-cloud</td><td style="padding:0.5rem;text-align:center">STS AssumeRole w/ OIDC</td><td style="padding:0.5rem;text-align:center">Workload Identity Fed.</td><td style="padding:0.5rem;text-align:center">Federated Identity</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Universal Best Practices (All Clouds)</h2>

      <!-- Best Practices -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">IAM Best Practices — Follow These or Get Hacked</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">1. Never use long-lived credentials</div><div class="timeline-item-desc">No access keys, no JSON key files, no client secrets stored in env vars. Use Roles (AWS), Service Accounts with Workload Identity (GCP), or Managed Identities (Azure).</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">2. Least privilege — always</div><div class="timeline-item-desc">If a service only reads from S3, don't give it s3:*. Give it s3:GetObject on the specific bucket. Review quarterly. Remove what's not used.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">3. Separate environments with boundaries</div><div class="timeline-item-desc">Production in a separate AWS Account / GCP Project / Azure Subscription. Cross-environment access requires explicit trust — not just IAM policies.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">4. MFA for all human users — no exceptions</div><div class="timeline-item-desc">Every human console login must require MFA. AWS: virtual MFA or hardware key. GCP: Google 2-Step. Azure: Entra Conditional Access with MFA.</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">5. Use Infrastructure as Code for IAM</div><div class="timeline-item-desc">Terraform or Pulumi for all IAM resources. Never click in the console to create roles. IaC = auditable, reviewable, rollbackable.</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">6. Monitor and alert on IAM changes</div><div class="timeline-item-desc">Alert on: new admin role grants, policy changes, root/owner usage, unusual API calls. AWS CloudTrail + GuardDuty, GCP Audit Logs + SCC, Azure Activity Log + Defender.</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">7. Lock the root/owner account</div><div class="timeline-item-desc">AWS Root Account: enable MFA, delete access keys, never use for daily work. GCP: Super Admin should be break-glass only. Azure: Global Admin same.</div></div>
        </div>
      </div>

      <h2>Common IAM Mistakes (Real Horror Stories)</h2>

      <pre><code># Mistake 1: The "I'll fix permissions later" policy
# Developer creates this during debugging... and forgets to remove it
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}
# Congratulations, your Lambda can now delete your production database,
# send emails as you, and mine Bitcoin on your EC2 instances.

# Mistake 2: Committing AWS credentials to GitHub
# In 2023, GitGuardian detected 12.8 MILLION leaked secrets on GitHub.
# AWS bots scan GitHub and will disable your keys within minutes,
# but attackers scan faster. Don't be this person.

# Mistake 3: One Service Account for everything
# "Let's create one SA with admin access and share it across 15 services"
# If ANY of those 15 services gets compromised, the attacker has ADMIN
# access to your entire cloud. Blast radius = everything.

# Mistake 4: Not rotating credentials
# GCP service account key created 3 years ago, used by 7 services,
# copied to 4 laptops, stored in 2 Slack channels. Good luck.

# Mistake 5: Forgetting to revoke access when someone leaves
# Former employee still has admin access 6 months after leaving.
# Automate offboarding: SCIM provisioning, regular access reviews.</code></pre>

      <h2>Production IAM Architecture</h2>

      <!-- Org Structure -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Recommended Cloud Organization Structure</div>
        <div class="hub-diagram">
          <div class="hub-center" style="background:#7c3aed;box-shadow:0 0 30px rgba(124,58,237,0.3)">
            Organization Root
            <span class="hub-center-sub">Management account / Org admin</span>
          </div>
          <div class="hub-arrow-label"><span class="arrow-animated">&#x2B07;</span> Separate accounts/projects per environment</div>
          <div class="hub-apps">
            <div class="hub-app"><span class="hub-app-icon">&#x1F512;</span>Security<span class="hub-app-sub">Audit logs, SIEM</span></div>
            <div class="hub-app" style="background:#f97316"><span class="hub-app-icon">&#x1F6E0;</span>Development<span class="hub-app-sub">Dev environments</span></div>
            <div class="hub-app" style="background:#a855f7"><span class="hub-app-icon">&#x1F9EA;</span>Staging<span class="hub-app-sub">Pre-prod testing</span></div>
            <div class="hub-app" style="background:#ef4444"><span class="hub-app-icon">&#x1F680;</span>Production<span class="hub-app-sub">Live workloads</span></div>
          </div>
        </div>
      </div>

      <h2>Which Cloud Has the Best IAM?</h2>

      <!-- Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">IAM Strengths by Cloud</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Criteria</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">AWS</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">GCP</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff;border-radius:0 0.4rem 0 0">Azure</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Granularity</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Most granular</td><td style="padding:0.5rem;text-align:center">Good (predefined)</td><td style="padding:0.5rem;text-align:center">Good (scope-based)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Ease of use</td><td style="padding:0.5rem;text-align:center;color:#f97316">Complex</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Simplest</td><td style="padding:0.5rem;text-align:center">Medium</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Enterprise SSO</td><td style="padding:0.5rem;text-align:center">SSO via IAM Identity Center</td><td style="padding:0.5rem;text-align:center">Google Workspace</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Entra ID (best)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">K8s integration</td><td style="padding:0.5rem;text-align:center">IRSA (good)</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Workload Identity (best)</td><td style="padding:0.5rem;text-align:center">Workload Identity (good)</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Condition-based</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Most powerful</td><td style="padding:0.5rem;text-align:center">Limited</td><td style="padding:0.5rem;text-align:center">Conditional Access (Entra)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <p><strong>My honest recommendation:</strong></p>
      <ul>
        <li>If you need maximum control over fine-grained permissions — <strong>AWS</strong></li>
        <li>If you want the simplest setup with good defaults — <strong>GCP</strong></li>
        <li>If your company is already on Microsoft 365 / Active Directory — <strong>Azure</strong> (Entra ID integration is unbeatable)</li>
        <li>If you're multi-cloud — learn the terminology table at the top and apply the same principles everywhere</li>
      </ul>

      <p>The cloud doesn't matter as much as the practices. Least privilege, machine identities, no long-lived credentials, MFA everywhere, IaC for policies, regular access reviews. Follow these on any cloud and you'll be more secure than 90% of organisations out there. The remaining 10% is about catching the edge cases — and that comes with experience.</p>
    `;
