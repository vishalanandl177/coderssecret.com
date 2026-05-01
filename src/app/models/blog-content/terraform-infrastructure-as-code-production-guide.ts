export const CONTENT = `
      <p>Every time you click &ldquo;Create Instance&rdquo; in the AWS console, you are creating infrastructure that cannot be reproduced, reviewed, or rolled back. Terraform replaces console clicking with code &mdash; declarative configuration files that describe your entire infrastructure and can be version-controlled, peer-reviewed, and applied automatically.</p>

      <div class="pipeline-diagram">
        <div class="pipeline-title">Terraform Workflow: Code &rarr; Plan &rarr; Apply</div>
        <div class="pipeline-steps">
          <div class="pipeline-step" style="border-color:#3b82f6">Write<br><strong>.tf files</strong><br>HCL config</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#a855f7">Init<br><strong>Providers</strong><br>download plugins</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#eab308">Plan<br><strong>Preview</strong><br>safe, read-only</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#22c55e">Apply<br><strong>Create</strong><br>real infra changes</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#ef4444">State<br><strong>Track</strong><br>source of truth</div>
        </div>
      </div>

      <h2>Core Concepts in 5 Minutes</h2>

      <ul>
        <li><strong>Provider:</strong> A plugin that talks to a cloud API (AWS, GCP, Azure, Kubernetes)</li>
        <li><strong>Resource:</strong> A single piece of infrastructure (EC2 instance, S3 bucket, DNS record)</li>
        <li><strong>State:</strong> A JSON file tracking what Terraform has created (the source of truth)</li>
        <li><strong>Plan:</strong> A preview of what Terraform will create, modify, or destroy</li>
        <li><strong>Apply:</strong> Execute the plan and make real infrastructure changes</li>
      </ul>

      <h2>Your First Terraform Configuration</h2>

      <pre><code># main.tf
terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Create a VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name        = "production-vpc"
    Environment = "production"
  }
}

# Create a public subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id    # Reference another resource
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1a"
  }
}</code></pre>

      <pre><code># The Terraform workflow:
terraform init      # Download providers
terraform plan      # Preview changes (safe, read-only)
terraform apply     # Create/modify infrastructure
terraform destroy   # Tear everything down</code></pre>

      <h2>Variables and Outputs</h2>

      <pre><code># variables.tf
variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "staging"
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be staging or production."
  }
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true    # Never shown in plan output or logs
}

# outputs.tf
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "The ID of the public subnet"
  value       = aws_subnet.public.id
}

# Use variables:
# terraform apply -var="environment=production" -var="instance_type=t3.large"
# Or create terraform.tfvars:
# environment   = "production"
# instance_type = "t3.large"</code></pre>

      <h2>Modules: Reusable Infrastructure Components</h2>

      <pre><code># modules/web-server/main.tf
variable "name" { type = string }
variable "instance_type" { type = string }
variable "subnet_id" { type = string }
variable "vpc_id" { type = string }

resource "aws_security_group" "web" {
  name_prefix = "\${var.name}-web-"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [aws_security_group.web.id]

  tags = {
    Name = var.name
  }
}

output "public_ip" {
  value = aws_instance.web.public_ip
}

# Use the module in your main config:
# main.tf
module "api_server" {
  source        = "./modules/web-server"
  name          = "api-server"
  instance_type = "t3.medium"
  subnet_id     = aws_subnet.public.id
  vpc_id        = aws_vpc.main.id
}

module "admin_server" {
  source        = "./modules/web-server"
  name          = "admin-server"
  instance_type = "t3.small"
  subnet_id     = aws_subnet.public.id
  vpc_id        = aws_vpc.main.id
}</code></pre>

      <h2>State Management</h2>

      <p>The state file is Terraform&rsquo;s memory of what exists. By default it is stored locally (<code>terraform.tfstate</code>), but in production you <strong>must</strong> use remote state with locking.</p>

      <pre><code># Remote state with S3 + DynamoDB locking
terraform {
  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "production/infrastructure.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"    # Prevents concurrent modifications
  }
}

# State locking prevents two people from running terraform apply
# simultaneously and corrupting the state file.</code></pre>

      <h3>State Commands</h3>

      <pre><code># List all resources in state
terraform state list

# Show details of a specific resource
terraform state show aws_instance.web

# Move a resource (rename without destroying)
terraform state mv aws_instance.old aws_instance.new

# Remove from state (resource still exists in cloud)
terraform state rm aws_instance.temporary

# Import existing infrastructure into state
terraform import aws_instance.existing i-1234567890abcdef0</code></pre>

      <h2>Workspaces: Multiple Environments</h2>

      <pre><code># Create separate environments from the same code
terraform workspace new staging
terraform workspace new production

# Switch between them
terraform workspace select staging
terraform apply    # Changes only staging infrastructure

terraform workspace select production
terraform apply    # Changes only production infrastructure

# Use workspace name in configuration
resource "aws_instance" "web" {
  instance_type = terraform.workspace == "production" ? "t3.large" : "t3.micro"

  tags = {
    Environment = terraform.workspace
  }
}</code></pre>

      <h2>CI/CD Pipeline</h2>

      <pre><code># .github/workflows/terraform.yml
name: Terraform

on:
  pull_request:
    paths: ['terraform/**']
  push:
    branches: [main]
    paths: ['terraform/**']

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.7.0

      - name: Terraform Init
        run: terraform init
        working-directory: terraform/

      - name: Terraform Validate
        run: terraform validate
        working-directory: terraform/

      - name: Terraform Plan
        run: terraform plan -out=tfplan -no-color
        working-directory: terraform/

      - name: Comment Plan on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const plan = require('fs').readFileSync('terraform/tfplan.txt', 'utf8');
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: '## Terraform Plan\n\`\`\`\n' + plan + '\n\`\`\`'
            });

  apply:
    needs: plan
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production    # Requires manual approval
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init && terraform apply -auto-approve
        working-directory: terraform/</code></pre>

      <h2>Common Mistakes</h2>

      <ul>
        <li><strong>Storing state locally:</strong> Local state files get lost, cannot be shared, and have no locking. Always use remote state.</li>
        <li><strong>Committing .tfstate to git:</strong> State files contain secrets (database passwords, API keys). Never commit them. Use .gitignore.</li>
        <li><strong>Not using -out with plan:</strong> Without <code>-out=tfplan</code>, the apply might execute a different plan than what you reviewed.</li>
        <li><strong>Manual changes after Terraform apply:</strong> Changing resources in the console creates drift. Terraform will try to revert your manual changes on the next apply.</li>
        <li><strong>Monolithic state file:</strong> One state file for everything means one mistake affects everything. Split by environment and service.</li>
        <li><strong>Ignoring terraform plan output:</strong> Always review the plan. &ldquo;1 to destroy&rdquo; might be your production database.</li>
      </ul>

      <h2>Project Structure for Large Teams</h2>

      <pre><code>infrastructure/
  modules/                    # Reusable modules
    networking/
    compute/
    database/
    monitoring/
  environments/
    staging/
      main.tf                 # Uses modules with staging values
      terraform.tfvars
      backend.tf              # Staging state location
    production/
      main.tf                 # Uses modules with production values
      terraform.tfvars
      backend.tf              # Production state location
  global/                     # Shared resources (IAM, DNS)
    main.tf
    backend.tf</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Infrastructure as Code is not optional</strong> &mdash; if it is not in code, it is not reproducible</li>
        <li><strong>Always use remote state with locking</strong> &mdash; local state is a disaster waiting to happen</li>
        <li><strong>Review terraform plan like you review code</strong> &mdash; a careless apply can destroy production</li>
        <li><strong>Use modules for reusable components</strong> &mdash; same pattern as functions in application code</li>
        <li><strong>Split state by environment and service</strong> &mdash; blast radius reduction</li>
        <li><strong>CI/CD should run plan on PRs, apply on merge</strong> &mdash; with mandatory approval for production</li>
        <li><strong>Never make manual changes</strong> to Terraform-managed resources &mdash; drift is the enemy</li>
        <li><strong>Mark sensitive variables</strong> to prevent secrets from appearing in plan output</li>
      </ul>

      <p>Terraform gives you a superpower: the ability to create, modify, and destroy entire cloud environments with a single command. But with great power comes great responsibility. Always plan before you apply, always use remote state, and always review what Terraform intends to do before you let it do it.</p>
    `;
