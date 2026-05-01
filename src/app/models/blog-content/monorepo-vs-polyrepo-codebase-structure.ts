export const CONTENT = `
      <p>The monorepo vs polyrepo debate is one of the longest-running arguments in software engineering. Monorepo advocates point to Google, Meta, and Microsoft. Polyrepo advocates point to Netflix, Amazon, and Spotify. The truth is that both approaches work &mdash; for different organizational structures and different trade-offs.</p>

      <h2>What Is a Monorepo?</h2>

      <p>A monorepo stores all projects, services, and libraries in a <strong>single Git repository</strong>. This does not mean a monolith &mdash; the code is still modular, but lives in one repository with shared tooling.</p>

      <pre><code># Monorepo structure
mycompany/
  apps/
    web/              # Frontend application
    api/              # Backend API
    mobile/           # Mobile app
    admin/            # Admin dashboard
  packages/
    ui-components/    # Shared design system
    auth/             # Shared authentication library
    utils/            # Common utilities
    api-client/       # Generated API client
  tools/
    eslint-config/    # Shared ESLint config
    tsconfig/         # Shared TypeScript config
  package.json        # Root workspace config
  nx.json             # Nx configuration
  turbo.json          # Or Turborepo configuration</code></pre>

      <h2>What Is a Polyrepo?</h2>

      <p>Each project, service, or library gets its own Git repository. Teams have full autonomy over their repository, tooling, and deployment.</p>

      <pre><code># Polyrepo structure (each is a separate Git repo)
mycompany/web          # Frontend app repo
mycompany/api          # Backend API repo
mycompany/mobile       # Mobile app repo
mycompany/ui-lib       # Design system repo (published to npm)
mycompany/auth-lib     # Auth library repo (published to npm)
mycompany/infra        # Infrastructure repo</code></pre>

      <h2>Trade-offs Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Monorepo</th>
            <th>Polyrepo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Code sharing</td>
            <td>Easy (import directly)</td>
            <td>Hard (publish packages, manage versions)</td>
          </tr>
          <tr>
            <td>Atomic changes</td>
            <td>One PR changes API + frontend</td>
            <td>Separate PRs, coordinate releases</td>
          </tr>
          <tr>
            <td>CI/CD speed</td>
            <td>Slow without smart caching</td>
            <td>Fast (only builds one project)</td>
          </tr>
          <tr>
            <td>Team autonomy</td>
            <td>Lower (shared config, shared CI)</td>
            <td>Higher (own tools, own processes)</td>
          </tr>
          <tr>
            <td>Dependency management</td>
            <td>Single version per dependency</td>
            <td>Each repo can use different versions</td>
          </tr>
          <tr>
            <td>Onboarding</td>
            <td>Clone once, see everything</td>
            <td>Must find and clone multiple repos</td>
          </tr>
          <tr>
            <td>Git performance</td>
            <td>Degrades with size (millions of files)</td>
            <td>Always fast (small repos)</td>
          </tr>
          <tr>
            <td>Code visibility</td>
            <td>Everyone sees everything</td>
            <td>Scoped to team repos</td>
          </tr>
        </tbody>
      </table>

      <h2>Monorepo Tooling: Nx</h2>

      <pre><code># Initialize an Nx workspace
npx create-nx-workspace@latest mycompany --preset=ts

# Project structure with Nx
# Nx provides:
# - Dependency graph (knows which projects depend on which)
# - Affected commands (only test/build what changed)
# - Computation caching (never rebuild the same code twice)
# - Task orchestration (parallel builds respecting dependencies)

# Only build projects affected by your changes
nx affected --target=build

# Only test what changed (not everything)
nx affected --target=test

# View the dependency graph
nx graph
# Opens a visual graph showing project dependencies

# Cache: if the inputs haven't changed, return cached output
nx build web
# First run: 45 seconds
# Second run: 0.1 seconds (cache hit!)

# Remote caching: share cache across team and CI
# nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud",
      "options": {
        "accessToken": "your-nx-cloud-token"
      }
    }
  }
}</code></pre>

      <h2>Monorepo Tooling: Turborepo</h2>

      <pre><code># turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],     // Build dependencies first
      "outputs": ["dist/**"]        // Cache these outputs
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint"],
      "outputs": []
    }
  }
}

# Run builds in parallel, respecting dependency order
turbo run build

# Only run affected tasks
turbo run build --filter=...[origin/main]

# Remote caching with Vercel
turbo run build --remote-only</code></pre>

      <h2>Managing Dependencies</h2>

      <pre><code># npm/pnpm workspaces: shared dependencies at root
# package.json (root)
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}

# pnpm-workspace.yaml (pnpm - recommended for monorepos)
packages:
  - 'apps/*'
  - 'packages/*'

# Internal packages: reference directly
# apps/web/package.json
{
  "dependencies": {
    "@mycompany/ui-components": "workspace:*",
    "@mycompany/auth": "workspace:*"
  }
}

# No publishing needed! pnpm resolves workspace: to local paths
# Changes to ui-components are immediately available in web</code></pre>

      <h2>CI/CD for Monorepos</h2>

      <pre><code># .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0    # Full history for affected detection

      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      # Only lint, test, build what changed
      - run: npx nx affected --target=lint --base=origin/main
      - run: npx nx affected --target=test --base=origin/main
      - run: npx nx affected --target=build --base=origin/main

# Key: fetch-depth: 0 lets Nx compare against main
# to determine which projects are affected by your changes</code></pre>

      <h2>When to Choose Monorepo</h2>

      <ul>
        <li><strong>Shared code between projects:</strong> Design system, utilities, API clients used by multiple apps</li>
        <li><strong>Atomic cross-project changes:</strong> API change + frontend update in one PR</li>
        <li><strong>Consistent tooling:</strong> Same linting, testing, and build configuration everywhere</li>
        <li><strong>Small to medium team (2-30 devs):</strong> Everyone works on related code</li>
        <li><strong>Full-stack features:</strong> One developer changes frontend + backend together</li>
      </ul>

      <h2>When to Choose Polyrepo</h2>

      <ul>
        <li><strong>Autonomous teams:</strong> Each team owns their deployment pipeline end-to-end</li>
        <li><strong>Different tech stacks:</strong> One team uses Python, another Go, another Java</li>
        <li><strong>Strong service boundaries:</strong> Services interact only through APIs, no shared code</li>
        <li><strong>Large organization (100+ devs):</strong> Too many people for effective shared tooling</li>
        <li><strong>Open source project:</strong> External contributors should not see internal services</li>
      </ul>

      <h2>Migration Strategy: Polyrepo to Monorepo</h2>

      <ol>
        <li><strong>Start with shared libraries:</strong> Move ui-components and utils into a monorepo first</li>
        <li><strong>Add one app at a time:</strong> Move the frontend, verify CI works, then move the backend</li>
        <li><strong>Preserve Git history:</strong> Use <code>git subtree</code> or tools like tomono to merge repos with history</li>
        <li><strong>Set up affected commands early:</strong> Without Nx/Turborepo, CI will be painfully slow</li>
        <li><strong>Keep deployment independent:</strong> Moving code to a monorepo does not mean coupling deployments</li>
      </ol>

      <pre><code># Merge a repo into monorepo preserving history
# In the monorepo:
git remote add web-repo https://github.com/mycompany/web.git
git fetch web-repo
git merge web-repo/main --allow-unrelated-histories
# Move files to the right directory
git mv src/ apps/web/src/
git mv package.json apps/web/package.json
git commit -m "chore: migrate web app into monorepo"</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Monorepo is not a monolith</strong> &mdash; code is modular, but lives in one repository</li>
        <li><strong>Smart caching makes monorepos fast</strong> &mdash; without Nx or Turborepo, CI crawls at scale</li>
        <li><strong>Polyrepo gives team autonomy</strong> at the cost of harder code sharing and cross-project changes</li>
        <li><strong>Monorepo gives consistency</strong> at the cost of shared tooling complexity and Git performance</li>
        <li><strong>Use pnpm workspaces</strong> for dependency management in JavaScript/TypeScript monorepos</li>
        <li><strong>affected commands are essential</strong> &mdash; only build and test what changed, not everything</li>
        <li><strong>Match the structure to your organization:</strong> one team = monorepo; many autonomous teams = polyrepo</li>
        <li><strong>You can start monorepo and split later</strong> (or vice versa) &mdash; neither choice is permanent</li>
      </ul>

      <p>The monorepo vs polyrepo decision is fundamentally about your organization, not your code. If your teams share code and coordinate releases, a monorepo reduces friction. If your teams are autonomous and deploy independently, polyrepo gives them freedom. Choose the structure that matches how your teams actually work, not how you wish they worked.</p>
    `;
