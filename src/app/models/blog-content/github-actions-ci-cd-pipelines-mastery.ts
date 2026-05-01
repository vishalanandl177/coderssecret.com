export const CONTENT = `
      <p>GitHub Actions is the most popular CI/CD platform for open source and increasingly for enterprise. But most teams use it like a simple script runner &mdash; one workflow, no caching, no parallelism, 20-minute builds. This guide shows you the patterns that make CI/CD fast, reliable, and maintainable.</p>

      <div class="pipeline-diagram">
        <div class="pipeline-title">Optimized CI/CD Pipeline Architecture</div>
        <div class="pipeline-steps">
          <div class="pipeline-step" style="border-color:#3b82f6">Push<br><strong>Trigger</strong><br>concurrency group</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#a855f7">Lint<br><strong>Fast Fail</strong><br>cached deps</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#f97316">Test<br><strong>Matrix</strong><br>parallel versions</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#22c55e">Build<br><strong>Cache Hit</strong><br>incremental</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#06b6d4">Deploy<br><strong>OIDC Auth</strong><br>zero secrets</div>
        </div>
      </div>

      <h2>Workflow Fundamentals Done Right</h2>

      <pre><code># .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Cancel in-progress runs on the same branch
concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'       # Built-in npm cache!
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint              # Only test if lint passes
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/</code></pre>

      <h2>Matrix Builds: Test Across Versions</h2>

      <pre><code>  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
      fail-fast: false    # Do not cancel other matrix jobs on failure
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
      - run: npm ci
      - run: npm test

# This creates 6 parallel jobs:
# node 18 + ubuntu, node 18 + windows
# node 20 + ubuntu, node 20 + windows
# node 22 + ubuntu, node 22 + windows</code></pre>

      <h2>Aggressive Caching</h2>

      <pre><code>  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Cache node_modules (faster than npm ci every time)
      - uses: actions/cache@v4
        id: npm-cache
        with:
          path: node_modules
          key: node-modules-\${{ hashFiles('package-lock.json') }}

      - if: steps.npm-cache.outputs.cache-hit != 'true'
        run: npm ci

      # Cache Next.js / Angular build cache
      - uses: actions/cache@v4
        with:
          path: .next/cache    # or .angular/cache
          key: build-cache-\${{ hashFiles('src/**') }}
          restore-keys: build-cache-

      - run: npm run build

# Cache hit rate matters:
# No cache:     npm ci takes 45 seconds every run
# With cache:   npm ci skipped, build uses incremental cache
# Total savings: 60-80% of build time</code></pre>

      <h2>Reusable Workflows</h2>

      <pre><code># .github/workflows/reusable-deploy.yml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      app-name:
        required: true
        type: string
    secrets:
      AWS_ACCESS_KEY_ID:
        required: true
      AWS_SECRET_ACCESS_KEY:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: \${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync dist/ s3://\${{ inputs.app-name }}-\${{ inputs.environment }}/

# Caller workflow:
# .github/workflows/deploy-staging.yml
name: Deploy Staging
on:
  push:
    branches: [main]
jobs:
  build:
    uses: ./.github/workflows/ci.yml
  deploy:
    needs: build
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      app-name: myapp
    secrets: inherit</code></pre>

      <h2>Secrets Management</h2>

      <pre><code># Secrets are encrypted and masked in logs
# Access via: \${{ secrets.SECRET_NAME }}

# Best practices:
# 1. Use environment-scoped secrets (not repo-level) for production
# 2. Use OIDC for cloud providers (no long-lived credentials)
# 3. Rotate secrets regularly
# 4. Never echo secrets in run commands

# OIDC authentication (no AWS keys needed!):
  deploy:
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions
          aws-region: us-east-1
          # No access keys! Uses temporary OIDC tokens</code></pre>

      <h2>Monorepo Strategies</h2>

      <pre><code># Only run jobs when relevant files change
  backend:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'backend/') || github.event_name == 'workflow_dispatch'
    steps:
      - uses: actions/checkout@v4
      - run: cd backend && npm test

# Better approach: path filters with dorny/paths-filter
  changes:
    runs-on: ubuntu-latest
    outputs:
      backend: \${{ steps.filter.outputs.backend }}
      frontend: \${{ steps.filter.outputs.frontend }}
      infra: \${{ steps.filter.outputs.infra }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            backend:
              - 'backend/**'
            frontend:
              - 'frontend/**'
            infra:
              - 'terraform/**'

  test-backend:
    needs: changes
    if: needs.changes.outputs.backend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd backend && npm test

  test-frontend:
    needs: changes
    if: needs.changes.outputs.frontend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd frontend && npm test</code></pre>

      <h2>Service Containers for Integration Tests</h2>

      <pre><code>  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379</code></pre>

      <h2>Common Mistakes</h2>

      <ul>
        <li><strong>No concurrency control:</strong> Multiple runs on the same branch waste resources. Use <code>concurrency</code> to cancel outdated runs.</li>
        <li><strong>Installing dependencies in every job:</strong> Cache node_modules/pip packages. A cache hit saves 30-60 seconds per job.</li>
        <li><strong>Running all tests on every change:</strong> In monorepos, use path filters to only test what changed.</li>
        <li><strong>Long-lived cloud credentials:</strong> Use OIDC instead of static access keys. Temporary tokens cannot be leaked.</li>
        <li><strong>No fail-fast: false in matrix:</strong> One failing version cancels all other jobs by default. Set <code>fail-fast: false</code> to see all results.</li>
        <li><strong>Not using artifacts:</strong> Build once, deploy many times. Upload build output as an artifact instead of rebuilding for each environment.</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Use concurrency groups</strong> to cancel outdated CI runs and save compute</li>
        <li><strong>Cache aggressively:</strong> node_modules, build caches, Docker layers &mdash; cache everything that does not change often</li>
        <li><strong>Matrix builds test across versions in parallel</strong> &mdash; catch compatibility issues early</li>
        <li><strong>Reusable workflows eliminate duplication</strong> &mdash; define once, call from multiple workflows</li>
        <li><strong>Use OIDC for cloud authentication</strong> &mdash; no static credentials to rotate or leak</li>
        <li><strong>Path filters in monorepos</strong> save massive CI time &mdash; only test what changed</li>
        <li><strong>Build once, deploy many:</strong> upload artifacts from build, download in deploy jobs</li>
      </ul>

      <p>Fast CI/CD is a competitive advantage. A 3-minute pipeline means developers merge multiple times per day. A 20-minute pipeline means they batch changes and merge once. The patterns in this guide &mdash; caching, parallelism, path filters, reusable workflows &mdash; can cut your build time by 80% with a few hours of investment.</p>
    `;
