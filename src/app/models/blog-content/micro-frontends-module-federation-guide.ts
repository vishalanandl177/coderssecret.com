export const CONTENT = `
      <p>Your frontend started as a small React or Angular app. Now it has 200+ components, multiple teams working on different features, and a single deployment pipeline that bottlenecks everyone. Micro-frontends solve this by splitting the UI into independently deployable pieces, each owned by a different team.</p>

      <p>But micro-frontends add real complexity. This guide covers the architecture patterns, Module Federation implementation, and the honest tradeoffs so you can decide if the complexity is worth it for your team.</p>

      <h2>What Are Micro-Frontends?</h2>

      <p>Micro-frontends apply microservice principles to the frontend: each feature area is an independent application that can be developed, tested, and deployed separately.</p>

      <ul>
        <li><strong>Shell/Host:</strong> The container app that provides navigation, authentication, and shared layout</li>
        <li><strong>Remotes/Micro-apps:</strong> Independent applications loaded into the shell at runtime</li>
        <li><strong>Shared dependencies:</strong> Libraries loaded once and shared across micro-apps (React, Angular, design system)</li>
      </ul>

      <h2>Integration Approaches</h2>

      <table>
        <thead>
          <tr>
            <th>Approach</th>
            <th>How It Works</th>
            <th>Pros</th>
            <th>Cons</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Module Federation</td>
            <td>Webpack/Vite loads remote bundles at runtime</td>
            <td>Shared deps, typed contracts, HMR</td>
            <td>Build tool lock-in</td>
          </tr>
          <tr>
            <td>iframes</td>
            <td>Each micro-app in an iframe</td>
            <td>Complete isolation</td>
            <td>Poor UX, no shared state</td>
          </tr>
          <tr>
            <td>Web Components</td>
            <td>Custom elements wrapping each app</td>
            <td>Framework agnostic</td>
            <td>Shadow DOM quirks, SSR challenges</td>
          </tr>
          <tr>
            <td>Build-time integration</td>
            <td>NPM packages composed at build</td>
            <td>Simple, typed</td>
            <td>Not independently deployable</td>
          </tr>
        </tbody>
      </table>

      <h2>Module Federation: The Modern Standard</h2>

      <p>Webpack 5 Module Federation lets multiple independent builds share code at runtime. One application can dynamically load modules from another deployed application.</p>

      <h3>Shell Application (Host)</h3>

      <pre><code>// webpack.config.js (Shell)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        // Load micro-apps from their deployed URLs
        dashboard: 'dashboard@https://dashboard.example.com/remoteEntry.js',
        settings: 'settings@https://settings.example.com/remoteEntry.js',
        billing: 'billing@https://billing.example.com/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        '@company/design-system': { singleton: true },
      },
    }),
  ],
};</code></pre>

      <h3>Remote Application (Micro-App)</h3>

      <pre><code>// webpack.config.js (Dashboard micro-app)
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      filename: 'remoteEntry.js',     // Entry point for the shell to load
      exposes: {
        './DashboardApp': './src/DashboardApp',   // Exposed component
        './DashboardWidget': './src/widgets/Summary',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        '@company/design-system': { singleton: true },
      },
    }),
  ],
};</code></pre>

      <h3>Loading Remote Components</h3>

      <pre><code>// Shell routing with lazy-loaded micro-apps
import { lazy, Suspense } from 'react';

// Dynamic imports from remote applications
const DashboardApp = lazy(() => import('dashboard/DashboardApp'));
const SettingsApp = lazy(() => import('settings/SettingsApp'));
const BillingApp = lazy(() => import('billing/BillingApp'));

function App() {
  return (
    &lt;Shell&gt;
      &lt;Navigation /&gt;
      &lt;Suspense fallback={&lt;LoadingSpinner /&gt;}&gt;
        &lt;Routes&gt;
          &lt;Route path="/dashboard/*" element={&lt;DashboardApp /&gt;} /&gt;
          &lt;Route path="/settings/*" element={&lt;SettingsApp /&gt;} /&gt;
          &lt;Route path="/billing/*" element={&lt;BillingApp /&gt;} /&gt;
        &lt;/Routes&gt;
      &lt;/Suspense&gt;
    &lt;/Shell&gt;
  );
}</code></pre>

      <h2>Shared State and Communication</h2>

      <pre><code>// Option 1: Custom Events (loosely coupled)
// Micro-app dispatches:
window.dispatchEvent(new CustomEvent('user:updated', {
  detail: { userId: 123, name: 'Alice' }
}));

// Shell or another micro-app listens:
window.addEventListener('user:updated', (event) => {
  updateUserContext(event.detail);
});

// Option 2: Shared state store (via Module Federation shared module)
// shared-store.ts (exposed by shell, consumed by remotes)
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}));

// Any micro-app can import and use:
import { useAppStore } from 'shell/SharedStore';
const user = useAppStore((state) => state.user);</code></pre>

      <h2>Shared Design System</h2>

      <pre><code>// Publish your design system as a shared singleton
// All micro-apps use the SAME instance loaded once

// webpack.config.js (every app)
shared: {
  '@company/design-system': {
    singleton: true,         // Only load ONE instance
    eager: false,            // Lazy load
    requiredVersion: '^3.0.0',
  },
}

// This ensures:
// 1. Consistent look across all micro-apps
// 2. One CSS bundle for the design system (not duplicated)
// 3. Version compatibility enforcement</code></pre>

      <h2>Independent Deployment Pipeline</h2>

      <pre><code># .github/workflows/deploy-dashboard.yml
name: Deploy Dashboard Micro-App

on:
  push:
    paths:
      - 'apps/dashboard/**'     # Only trigger for dashboard changes

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm test

      # Deploy to CDN independently
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: us-east-1
      - run: |
          aws s3 sync dist/ s3://micro-frontends/dashboard/ --delete
          aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/dashboard/*"

# Each micro-app has its own pipeline
# Dashboard team deploys without waiting for billing team
# Shell only redeploys when shell code changes</code></pre>

      <h2>When NOT to Use Micro-Frontends</h2>

      <ul>
        <li><strong>Small team (less than 3-4 frontend developers):</strong> The coordination overhead exceeds the benefit</li>
        <li><strong>Simple application:</strong> If one team can manage the entire frontend, a monolith is simpler</li>
        <li><strong>Strong coupling between features:</strong> If features share lots of state and UI, splitting them creates more problems</li>
        <li><strong>No independent deployment need:</strong> If you deploy everything together anyway, micro-frontends add complexity for no gain</li>
        <li><strong>Performance-critical apps:</strong> Multiple bundles, runtime loading, and shared dependency negotiation add latency</li>
      </ul>

      <h2>Challenges and Mitigations</h2>

      <table>
        <thead>
          <tr>
            <th>Challenge</th>
            <th>Mitigation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Inconsistent UI</td>
            <td>Shared design system as singleton dependency</td>
          </tr>
          <tr>
            <td>Shared state complexity</td>
            <td>Custom events for loose coupling, shared store for tight coupling</td>
          </tr>
          <tr>
            <td>Version conflicts</td>
            <td>Singleton shared dependencies with version ranges</td>
          </tr>
          <tr>
            <td>Performance overhead</td>
            <td>Preload critical remotes, share common chunks</td>
          </tr>
          <tr>
            <td>Local development</td>
            <td>Run shell + one remote locally, mock others</td>
          </tr>
          <tr>
            <td>Testing across boundaries</td>
            <td>Contract tests + integration tests in staging</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Micro-frontends solve organizational problems, not technical ones</strong> &mdash; use them when multiple teams need to deploy independently</li>
        <li><strong>Module Federation is the current standard</strong> &mdash; runtime integration with shared dependencies</li>
        <li><strong>Shared singletons prevent bundle duplication</strong> &mdash; React, design system, and state libraries should load once</li>
        <li><strong>Communication via custom events keeps coupling low</strong> &mdash; micro-apps should not import from each other directly</li>
        <li><strong>Each micro-app gets its own CI/CD pipeline</strong> &mdash; that is the whole point</li>
        <li><strong>Do not split too early</strong> &mdash; start with a well-structured monolith and split only when team autonomy demands it</li>
        <li><strong>The complexity cost is real</strong> &mdash; only worth it with 4+ teams working on the same frontend</li>
      </ul>

      <p>Micro-frontends are a scaling strategy for organizations, not a technical improvement for applications. If you have one team, a monolith with good module boundaries is strictly better. If you have five teams stepping on each other during deployments, micro-frontends give each team their own lane. Match the architecture to the organization, not the other way around.</p>
    `;
