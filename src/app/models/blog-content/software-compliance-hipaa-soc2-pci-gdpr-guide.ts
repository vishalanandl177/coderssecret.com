export const CONTENT = `
      <p>You've built a great product. Then legal says "we need SOC 2 before we can close this enterprise deal" or "HIPAA compliance is required to handle patient data." Suddenly you're reading 300-page PDFs full of legalese. This guide cuts through the noise — here's what each compliance framework <strong>actually requires from your engineering team</strong>, with practical implementation details.</p>

      <h2>Why Compliance Matters for Developers</h2>
      <p>Compliance isn't just a checkbox for sales. It's a structured way to prove your software is <strong>secure, reliable, and trustworthy</strong>. Every framework boils down to the same core questions:</p>
      <ul>
        <li>Who can access what data?</li>
        <li>How is data protected at rest and in transit?</li>
        <li>What happens when something goes wrong?</li>
        <li>Can you prove all of the above with evidence?</li>
      </ul>

      <!-- Compliance Overview -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The 5 Major Compliance Frameworks</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F3E5;</span>HIPAA<span class="pipeline-step-sub">Healthcare</span></div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F6E1;</span>SOC 2<span class="pipeline-step-sub">SaaS / B2B</span></div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x1F4B3;</span>PCI-DSS<span class="pipeline-step-sub">Payments</span></div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x1F1EA;&#x1F1FA;</span>GDPR<span class="pipeline-step-sub">EU Privacy</span></div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x1F4CB;</span>ISO 27001<span class="pipeline-step-sub">Global InfoSec</span></div>
        </div>
      </div>

      <h2>Quick Reference: Which One Do You Need?</h2>

      <!-- Decision Guide -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Which Compliance Framework Do You Need?</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">If You...</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">HIPAA</th>
                <th style="text-align:center;padding:0.6rem;background:#7c3aed;color:#fff">SOC 2</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">PCI-DSS</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff">GDPR</th>
                <th style="text-align:center;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0 0.4rem 0 0">ISO 27001</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground)">Handle patient health data (US)</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Required</td><td style="padding:0.5rem;text-align:center">Recommended</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">Recommended</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground)">Sell SaaS to enterprises (B2B)</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Required</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">If EU users</td><td style="padding:0.5rem;text-align:center">Bonus</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground)">Process credit card payments</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">Recommended</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Required</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">-</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground)">Have users in the EU</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Required</td><td style="padding:0.5rem;text-align:center">Helps</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground)">Sell globally, need trust signal</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">Common</td><td style="padding:0.5rem;text-align:center">-</td><td style="padding:0.5rem;text-align:center">If EU</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Gold standard</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>HIPAA — Healthcare Data Protection</h2>
      <p><strong>HIPAA</strong> (Health Insurance Portability and Accountability Act) protects <strong>Protected Health Information (PHI)</strong> — any data that can identify a patient and relates to their health, treatment, or payment. If your software touches patient data in the US, you must comply.</p>

      <h2>What Engineering Must Implement for HIPAA</h2>
      <pre><code># HIPAA Technical Safeguards — What your code must do:

# 1. Encryption at Rest
# All PHI stored in databases must be encrypted
# AWS: Enable RDS encryption, S3 SSE-KMS, EBS encryption
aws rds modify-db-instance --db-instance-identifier mydb \\
  --storage-encrypted --kms-key-id alias/hipaa-key

# 2. Encryption in Transit
# All PHI transmitted must use TLS 1.2+
# Enforce HTTPS on all endpoints, use mTLS between internal services

# 3. Access Controls
# Role-based access — minimum necessary access to PHI
# Example: Django middleware that logs all PHI access
class PHIAccessMiddleware:
    def process_view(self, request, view_func, *args, **kwargs):
        if hasattr(view_func, 'phi_access'):
            AuditLog.objects.create(
                user=request.user,
                action=f"Accessed PHI: {view_func.__name__}",
                ip_address=request.META['REMOTE_ADDR'],
                timestamp=timezone.now(),
            )

# 4. Audit Logging (REQUIRED — most missed requirement!)
# Log: WHO accessed WHAT data, WHEN, from WHERE
# Retain audit logs for 6 years (HIPAA requirement)
# Use: AWS CloudTrail, Datadog, Splunk

# 5. Automatic Session Timeout
# Inactive sessions must auto-expire (typically 15 min)
SESSION_COOKIE_AGE = 900  # 15 minutes
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# 6. Unique User IDs
# Every user must have a unique identifier — no shared accounts
# No generic "admin" or "support" accounts allowed

# 7. Emergency Access Procedure
# Break-glass mechanism to access PHI in emergencies
# Must be logged and reviewed</code></pre>

      <!-- HIPAA Checklist -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">HIPAA Engineering Checklist</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">Encrypt all PHI at rest (AES-256, KMS-managed keys)</div><div class="timeline-item-desc">Database, file storage, backups, logs containing PHI</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Encrypt all PHI in transit (TLS 1.2+)</div><div class="timeline-item-desc">HTTPS everywhere, mTLS for internal services</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Audit logging with 6-year retention</div><div class="timeline-item-desc">Log every access to PHI: who, what, when, where</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">Role-based access control (RBAC)</div><div class="timeline-item-desc">Minimum necessary access — doctors see patients, billing sees invoices</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">BAA with all vendors</div><div class="timeline-item-desc">Business Associate Agreement with AWS, Stripe, Twilio — anyone touching PHI</div></div>
        </div>
      </div>

      <h2>SOC 2 — SaaS Security Standard</h2>
      <p><strong>SOC 2</strong> (Service Organization Control 2) is the most common compliance requirement for B2B SaaS companies. It's based on 5 <strong>Trust Service Criteria</strong>:</p>

      <!-- SOC 2 Trust Criteria -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">SOC 2 Trust Service Criteria</div>
        <div class="hub-apps" style="max-width:600px;margin:0 auto">
          <div class="hub-app" style="animation-delay:0.1s"><span class="hub-app-icon">&#x1F6E1;</span>Security<span class="hub-app-sub">Always required</span></div>
          <div class="hub-app" style="background:#f97316;animation-delay:0.25s"><span class="hub-app-icon">&#x2705;</span>Availability<span class="hub-app-sub">Uptime SLAs</span></div>
          <div class="hub-app" style="background:#a855f7;animation-delay:0.4s"><span class="hub-app-icon">&#x2699;</span>Processing<span class="hub-app-sub">Data accuracy</span></div>
          <div class="hub-app" style="background:#ef4444;animation-delay:0.55s"><span class="hub-app-icon">&#x1F512;</span>Confidentiality<span class="hub-app-sub">Data protection</span></div>
          <div class="hub-app" style="animation-delay:0.7s"><span class="hub-app-icon">&#x1F464;</span>Privacy<span class="hub-app-sub">PII handling</span></div>
        </div>
      </div>

      <pre><code># SOC 2 Security Controls — What auditors check:

# 1. Infrastructure as Code (auditors LOVE this)
# All infra defined in Terraform/Pulumi — changes are tracked in git
# No manual console clicks — everything is reproducible and auditable

# 2. CI/CD Pipeline Security
# - Code reviews required (branch protection rules)
# - Automated tests in CI
# - Dependency vulnerability scanning (Snyk, Dependabot)
# - No direct pushes to main/production

# 3. Monitoring & Alerting
# - Uptime monitoring (PagerDuty, Datadog, CloudWatch)
# - Error tracking (Sentry)
# - Infrastructure monitoring (CPU, memory, disk alerts)
# - Security event alerting (failed logins, permission changes)

# 4. Incident Response Plan (must be documented)
# - How incidents are detected
# - Severity classification (P1/P2/P3)
# - Communication plan (who gets paged, stakeholder updates)
# - Post-mortem process (blameless, with action items)

# 5. Access Reviews (quarterly)
# - List all users with access to production
# - Verify each one still needs it
# - Remove access for departed employees within 24 hours
# - Document the review with screenshots/exports

# 6. Change Management
# - All production changes go through PRs
# - PRs require approval from someone other than the author
# - Deployments are logged with who, what, when
# - Rollback plan documented for each deploy</code></pre>

      <h2>PCI-DSS — Payment Card Security</h2>
      <p><strong>PCI-DSS</strong> (Payment Card Industry Data Security Standard) applies if your system processes, stores, or transmits credit card numbers. The simplest way to achieve PCI compliance: <strong>don't handle card data yourself</strong>.</p>

      <!-- PCI Strategy -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">PCI-DSS Strategy: Minimize Your Scope</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x1F6AB; Don't Do This</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>Store card numbers in your database</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4DD;</span>Log card data anywhere</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Pass card numbers through your API</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Full PCI audit needed (300+ requirements)</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2705; Do This Instead</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B3;</span>Use Stripe/Braintree tokenization</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Stripe.js collects card client-side</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F511;</span>Your server only sees tokens (tok_xxx)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CB;</span>SAQ-A: only 22 requirements!</div>
            </div>
          </div>
        </div>
      </div>

      <pre><code># PCI-Compliant payment flow using Stripe:

# Frontend (React/Angular) — card data NEVER touches your server
# &lt;script src="https://js.stripe.com/v3/"&gt;&lt;/script&gt;
# const stripe = Stripe('pk_live_xxx');
# const {token} = await stripe.createToken(cardElement);
# // Send token.id to your server (NOT card numbers!)

# Backend (Python) — only handles tokens
import stripe
stripe.api_key = "sk_live_xxx"  # Store in environment variable!

def create_charge(token_id, amount):
    """Charge a card using a Stripe token — PCI compliant."""
    charge = stripe.PaymentIntent.create(
        amount=amount,
        currency="usd",
        payment_method=token_id,
        confirm=True,
    )
    # You NEVER see the card number. Stripe handles everything.
    return charge

# What you MUST still do for PCI (even with Stripe):
# 1. Use HTTPS on all pages (especially payment pages)
# 2. Don't log any card-related data
# 3. Keep Stripe.js loaded from stripe.com (not self-hosted)
# 4. Complete SAQ-A questionnaire annually
# 5. Quarterly network vulnerability scan (ASV scan)</code></pre>

      <h2>GDPR — EU Data Privacy</h2>
      <p><strong>GDPR</strong> (General Data Protection Regulation) applies to ANY company processing data of EU residents — even if you're based in the US. It gives users rights over their personal data and imposes strict requirements on how you handle it.</p>

      <h2>GDPR User Rights (You Must Implement These)</h2>

      <!-- GDPR Rights -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">GDPR User Rights Your App Must Support</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#22c55e;color:#fff;border-radius:0.4rem 0 0 0">Right</th>
                <th style="text-align:left;padding:0.6rem;background:#22c55e;color:#fff">What It Means</th>
                <th style="text-align:left;padding:0.6rem;background:#22c55e;color:#fff;border-radius:0 0.4rem 0 0">Implementation</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Right to Access</td><td style="padding:0.5rem">User can request all their data</td><td style="padding:0.5rem;color:#3b82f6">API: GET /api/me/data-export</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Right to Deletion</td><td style="padding:0.5rem">User can request account deletion</td><td style="padding:0.5rem;color:#3b82f6">API: DELETE /api/me (+ cascade)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Right to Rectification</td><td style="padding:0.5rem">User can correct their data</td><td style="padding:0.5rem;color:#3b82f6">API: PATCH /api/me/profile</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Right to Portability</td><td style="padding:0.5rem">User can download in machine-readable format</td><td style="padding:0.5rem;color:#3b82f6">JSON/CSV export endpoint</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Right to Object</td><td style="padding:0.5rem">User can opt out of processing</td><td style="padding:0.5rem;color:#3b82f6">Marketing consent toggle</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Right to be Forgotten</td><td style="padding:0.5rem">Delete from ALL systems including backups</td><td style="padding:0.5rem;color:#ef4444;font-weight:700">Hardest to implement</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <pre><code># GDPR Implementation Examples:

# 1. Data Export (Right to Access / Portability)
@app.route("/api/me/data-export")
@login_required
def export_my_data():
    user = current_user
    data = {
        "profile": {
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at.isoformat(),
        },
        "orders": [
            {"id": o.id, "total": o.total, "date": o.date.isoformat()}
            for o in user.orders
        ],
        "activity_log": [
            {"action": l.action, "timestamp": l.timestamp.isoformat()}
            for l in user.activity_logs
        ],
    }
    return jsonify(data)
    # Must respond within 30 days (GDPR requirement)

# 2. Account Deletion (Right to Deletion / Right to be Forgotten)
@app.route("/api/me", methods=["DELETE"])
@login_required
def delete_my_account():
    user = current_user

    # Anonymize data we must keep (for legal/tax reasons)
    for order in user.orders:
        order.customer_name = "DELETED"
        order.customer_email = "deleted@anonymized.local"

    # Delete everything else
    ActivityLog.query.filter_by(user_id=user.id).delete()
    UserPreference.query.filter_by(user_id=user.id).delete()

    # Delete the user account
    db.session.delete(user)
    db.session.commit()

    # Also: remove from email lists, analytics, backups (schedule)
    remove_from_mailchimp(user.email)
    schedule_backup_purge(user.id)  # Remove from next backup cycle

    return jsonify({"message": "Account deleted"}), 200

# 3. Consent Management
# GDPR requires EXPLICIT consent for data processing
# Pre-checked checkboxes are NOT valid consent!
class ConsentRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    consent_type = db.Column(db.String)  # "marketing", "analytics", "cookies"
    granted = db.Column(db.Boolean)
    timestamp = db.Column(db.DateTime)
    ip_address = db.Column(db.String)
    # Store the EXACT text the user agreed to
    consent_text = db.Column(db.Text)

# 4. Cookie Banner (Required for EU users)
# Must offer: Accept All / Reject All / Customize
# Must NOT track anything before consent is given
# Google Analytics should NOT fire until user clicks "Accept"</code></pre>

      <h2>ISO 27001 — Information Security Management</h2>
      <p><strong>ISO 27001</strong> is the international gold standard for information security. It's a <strong>management system</strong> — less about specific technical controls and more about having a structured process for identifying and managing security risks.</p>

      <pre><code># ISO 27001 requires an ISMS (Information Security Management System):

# 1. Risk Assessment (the core of ISO 27001)
#    - Identify all information assets (databases, servers, code repos)
#    - Identify threats to each asset (hack, outage, insider threat)
#    - Rate: likelihood x impact = risk score
#    - Decide: mitigate, accept, transfer (insurance), or avoid

# 2. Statement of Applicability (SoA)
#    - List all 93 controls from Annex A
#    - For each: applicable? implemented? how?
#    - Example controls:
#      A.8.2  Privileged access rights (who has admin?)
#      A.8.9  Configuration management (is infra versioned?)
#      A.8.15 Logging (are actions logged?)
#      A.8.24 Use of cryptography (is data encrypted?)

# 3. Policies You'll Need to Write:
#    - Information Security Policy (umbrella document)
#    - Access Control Policy
#    - Acceptable Use Policy
#    - Incident Response Policy
#    - Business Continuity / Disaster Recovery Plan
#    - Data Classification Policy (public, internal, confidential, restricted)
#    - Vendor/Supplier Security Policy

# 4. Evidence Collection
#    - Screenshot of branch protection rules
#    - Export of access review spreadsheet
#    - Incident response test results
#    - Penetration test report
#    - Vulnerability scan results
#    - Employee security training completion records</code></pre>

      <h2>The Common Technical Controls (Shared Across All Frameworks)</h2>
      <p>Here's the good news: there's massive overlap between frameworks. Implement these once, satisfy all five:</p>

      <!-- Shared Controls -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Universal Technical Controls</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">Encryption: TLS 1.2+ in transit, AES-256 at rest, KMS for key management<span class="layer-item-sub">Required by: HIPAA, SOC 2, PCI-DSS, GDPR, ISO 27001</span></div>
          <div class="layer-item" style="background:#f97316">Access Control: SSO, MFA, RBAC, least privilege, quarterly access reviews<span class="layer-item-sub">Required by: HIPAA, SOC 2, PCI-DSS, GDPR, ISO 27001</span></div>
          <div class="layer-item" style="background:#3b82f6">Audit Logging: Centralized logs, tamper-proof, 1-6 year retention<span class="layer-item-sub">Required by: HIPAA (6yr), SOC 2, PCI-DSS (1yr), GDPR, ISO 27001</span></div>
          <div class="layer-item" style="background:#7c3aed">Incident Response: Documented plan, tested annually, 72hr breach notification<span class="layer-item-sub">Required by: HIPAA (60 days), SOC 2, PCI-DSS, GDPR (72 hours!), ISO 27001</span></div>
          <div class="layer-item" style="background:#22c55e">Vulnerability Management: Dependency scanning, pen testing, patching SLA<span class="layer-item-sub">Required by: SOC 2, PCI-DSS (quarterly ASV scan), ISO 27001</span></div>
          <div class="layer-item" style="background:#ec4899">Backup &amp; Recovery: Automated backups, tested restores, RTO/RPO defined<span class="layer-item-sub">Required by: HIPAA, SOC 2, PCI-DSS, ISO 27001</span></div>
        </div>
      </div>

      <h2>Compliance-as-Code: Automate Everything</h2>
      <pre><code># Modern compliance is automated, not manual. Key tools:

# 1. Infrastructure as Code (Terraform)
# Every server, database, and network rule is version-controlled
# Auditors can see: who changed what, when, and why (via git history)

# 2. Policy as Code (Open Policy Agent / Sentinel)
# Automatically reject non-compliant deployments
# Example: OPA policy that blocks unencrypted S3 buckets
package aws.s3
deny[msg] {
    input.resource.aws_s3_bucket[name].server_side_encryption_configuration == null
    msg := sprintf("S3 bucket '%v' must have encryption enabled", [name])
}

# 3. Automated Evidence Collection
# Tools: Vanta, Drata, Secureframe
# They continuously pull evidence from AWS, GitHub, Okta, Jira
# and map it to SOC 2 / ISO 27001 / HIPAA controls automatically

# 4. Security Scanning in CI/CD
# - SAST: Semgrep, CodeQL (find vulnerabilities in your code)
# - SCA: Snyk, Dependabot (find vulnerable dependencies)
# - DAST: OWASP ZAP (find runtime vulnerabilities)
# - Secret scanning: GitLeaks, TruffleHog (find leaked credentials)

# 5. Continuous Monitoring
# - AWS Config Rules (detect non-compliant resources)
# - GuardDuty (threat detection)
# - CloudTrail (API audit logging)
# - SecurityHub (compliance dashboard)</code></pre>

      <h2>Compliance Penalties</h2>

      <!-- Penalties Table -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Non-Compliance Penalties</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:450px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0.4rem 0 0 0">Framework</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff">Max Penalty</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0 0.4rem 0 0">Notable Fine</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#3b82f6;font-weight:700">HIPAA</td><td style="padding:0.5rem;color:var(--foreground)">Up to \\$1.9M per violation category/year</td><td style="padding:0.5rem;color:var(--foreground)">Anthem: \\$16M (2018)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#7c3aed;font-weight:700">SOC 2</td><td style="padding:0.5rem;color:var(--foreground)">No direct fine — but lose enterprise deals</td><td style="padding:0.5rem;color:var(--foreground)">Revenue loss from failed audits</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#f97316;font-weight:700">PCI-DSS</td><td style="padding:0.5rem;color:var(--foreground)">\\$5K-\\$100K/month until compliant</td><td style="padding:0.5rem;color:var(--foreground)">Target: \\$162M (2013 breach)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#22c55e;font-weight:700">GDPR</td><td style="padding:0.5rem;color:var(--foreground);font-weight:700">4% of global revenue or EUR 20M</td><td style="padding:0.5rem;color:var(--foreground)">Meta: EUR 1.2B (2023)</td></tr>
              <tr><td style="padding:0.5rem;color:#ef4444;font-weight:700">ISO 27001</td><td style="padding:0.5rem;color:var(--foreground)">No direct fine — certification revoked</td><td style="padding:0.5rem;color:var(--foreground)">Lost contracts, trust damage</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Getting Started: Practical Roadmap</h2>

      <!-- Compliance Roadmap -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Your Compliance Implementation Roadmap</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F50D;</span>Assess<span class="pipeline-step-sub">Gap analysis</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F4DD;</span>Policies<span class="pipeline-step-sub">Write documents</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x1F528;</span>Implement<span class="pipeline-step-sub">Technical controls</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x1F4CB;</span>Evidence<span class="pipeline-step-sub">Collect proof</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x2705;</span>Audit<span class="pipeline-step-sub">Pass certification</span></div>
        </div>
      </div>

      <p>Compliance is not a one-time project — it's a continuous process. The best engineering teams build compliance into their development workflow: infrastructure as code, automated evidence collection, security scanning in CI/CD, and regular access reviews. Start with the framework your customers require, implement the universal controls first, and expand from there. The overlap between frameworks means your second certification is always easier than your first.</p>
    `;
