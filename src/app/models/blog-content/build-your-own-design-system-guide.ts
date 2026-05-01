export const CONTENT = `
      <p>I've seen it happen three times now. A company decides they need a design system. Someone creates a Figma file with 47 colour swatches and names it "Design System v1." Six months later, nobody uses it, the buttons still look different on every page, and the developers are back to copying CSS from Stack Overflow. The design system is declared dead before it ever lived.</p>

      <p>Here's the thing nobody tells you upfront: a design system is not a Figma file. It's not a component library either. It's a <strong>living product</strong> — with users (your own teams), documentation, versioning, and maintenance. And like any product, it fails when you don't treat it like one.</p>

      <p>This guide walks you through building a design system that actually gets adopted. Not a theoretical framework — a practical, opinionated guide based on what works in production. Let's get into it.</p>

      <h2>What a Design System Actually Is</h2>

      <p>Let me clear up the confusion first, because people mix these terms up constantly:</p>

      <!-- Design System Layers -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The Layers of a Design System</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#7c3aed">Design Principles<span class="layer-item-sub">The "why" — clarity over cleverness, consistency over novelty, accessibility by default</span></div>
          <div class="layer-item" style="background:#3b82f6">Design Tokens<span class="layer-item-sub">The building blocks — colours, spacing, typography, shadows, border radius, breakpoints</span></div>
          <div class="layer-item" style="background:#22c55e">Component Library<span class="layer-item-sub">The reusable UI pieces — Button, Input, Modal, Card, Toast, Table, etc.</span></div>
          <div class="layer-item" style="background:#f97316">Patterns & Templates<span class="layer-item-sub">How components compose — form layouts, dashboard patterns, navigation structures</span></div>
          <div class="layer-item" style="background:#ef4444">Documentation & Guidelines<span class="layer-item-sub">The rulebook — when to use what, do's and don'ts, contribution guide</span></div>
        </div>
      </div>

      <p>Most people skip straight to building components. That's like building a house by starting with the furniture. You need foundations first.</p>

      <h2>Step 1: Define Your Design Principles</h2>

      <p>Before you touch a single pixel or write a line of CSS, answer these questions with your team. Write the answers down. These become your design principles — the north star for every decision:</p>

      <ul>
        <li><strong>Who are your users?</strong> Internal tools for developers? Consumer-facing app for non-tech people? Both?</li>
        <li><strong>What's your brand personality?</strong> Playful and colourful (like Notion)? Professional and restrained (like Linear)? Bold and opinionated (like Vercel)?</li>
        <li><strong>What are your constraints?</strong> Must support dark mode? Must work on mobile? Must be accessible (WCAG AA)?</li>
        <li><strong>What's your tech stack?</strong> React? Angular? Vue? Web Components? All of them?</li>
      </ul>

      <p>Here's an example of good design principles (inspired by real systems):</p>

      <!-- Example Principles -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Example Design Principles</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">1. Clarity over cleverness</div><div class="timeline-item-desc">Every element should be immediately understood. No mystery icons, no ambiguous labels, no "you'll figure it out" patterns.</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">2. Consistent, not uniform</div><div class="timeline-item-desc">Similar things should look similar. But don't force the same pattern where a different one makes more sense. Consistency serves users, not designers.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">3. Accessible by default</div><div class="timeline-item-desc">Every component ships with proper ARIA roles, keyboard navigation, and colour contrast. Accessibility is not an add-on — it's built in from day one.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">4. Composable, not prescriptive</div><div class="timeline-item-desc">Components should be building blocks, not final answers. Teams should be able to compose them into patterns we haven't imagined yet.</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">5. Documentation is the product</div><div class="timeline-item-desc">An undocumented component doesn't exist. If someone has to read the source code to use it, we've failed.</div></div>
        </div>
      </div>

      <h2>Step 2: Design Tokens — Your Single Source of Truth</h2>

      <p>Design tokens are the atomic values that define your visual language. Think of them as <strong>CSS variables on steroids</strong>. They're the reason you can change your brand colour in one place and have it update across 200 components instantly.</p>

      <pre><code>/* tokens.css — Your design token foundation */

:root {
  /* ── Colours ─────────────────────────────── */
  /* Primitive colours (raw palette — don't use directly in components) */
  --color-blue-50: #eff6ff;
  --color-blue-100: #dbeafe;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-blue-700: #1d4ed8;
  --color-blue-900: #1e3a5f;

  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  --color-red-500: #ef4444;
  --color-green-500: #22c55e;
  --color-yellow-500: #eab308;

  /* Semantic colours (USE THESE in components) */
  --color-primary: var(--color-blue-600);
  --color-primary-hover: var(--color-blue-700);
  --color-primary-light: var(--color-blue-50);

  --color-background: #ffffff;
  --color-surface: var(--color-gray-50);
  --color-border: var(--color-gray-200);
  --color-text: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  --color-text-inverse: #ffffff;

  --color-success: var(--color-green-500);
  --color-error: var(--color-red-500);
  --color-warning: var(--color-yellow-500);

  /* ── Typography ──────────────────────────── */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* ── Spacing (8px base grid) ─────────────── */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */

  /* ── Border Radius ───────────────────────── */
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;  /* Pill shape */

  /* ── Shadows ─────────────────────────────── */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);

  /* ── Breakpoints (use in media queries) ──── */
  /* --bp-sm: 640px;  --bp-md: 768px;  --bp-lg: 1024px;  --bp-xl: 1280px; */

  /* ── Transitions ─────────────────────────── */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;

  /* ── Z-Index Scale ───────────────────────── */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}

/* ── Dark Mode ─────────────────────────────── */
.dark {
  --color-primary: var(--color-blue-500);
  --color-primary-hover: var(--color-blue-600);
  --color-primary-light: rgba(59, 130, 246, 0.1);

  --color-background: #0a0a0a;
  --color-surface: #1a1a1a;
  --color-border: #2a2a2a;
  --color-text: #fafafa;
  --color-text-secondary: #a1a1aa;
}</code></pre>

      <p><strong>The golden rule:</strong> Components should NEVER use raw colour values like <code>#3b82f6</code>. They should ALWAYS reference semantic tokens like <code>var(--color-primary)</code>. This is what makes dark mode, theming, and brand updates possible without touching component code.</p>

      <!-- Token Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Design Token Architecture</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#7c3aed;--i:0"><span class="pipeline-step-icon">&#x1F3A8;</span>Primitive<span class="pipeline-step-sub">blue-500, gray-100</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:1"><span class="pipeline-step-icon">&#x1F3AF;</span>Semantic<span class="pipeline-step-sub">color-primary, color-error</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x1F4E6;</span>Component<span class="pipeline-step-sub">button-bg, card-border</span></div>
        </div>
      </div>

      <h2>Step 3: Component Architecture</h2>

      <p>Right, now we're into the fun part. Let me show you how to build components that are genuinely reusable — not the "reusable in theory but customised differently on every page" kind.</p>

      <p>A well-architected component follows what I call the <strong>three-layer pattern</strong>:</p>

      <!-- Component Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Component Architecture: Three Layers</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">API Layer (Props / Inputs)<span class="layer-item-sub">What the consumer controls: variant, size, disabled, loading, onClick. Strict typed, well-documented.</span></div>
          <div class="layer-item" style="background:#7c3aed">Behaviour Layer (Logic)<span class="layer-item-sub">Internal state management, keyboard handling, ARIA attributes, focus management. Hidden from consumer.</span></div>
          <div class="layer-item" style="background:#22c55e">Presentation Layer (Styles)<span class="layer-item-sub">Visual rendering using design tokens. Responsive, theme-aware, animation. No hardcoded values.</span></div>
        </div>
      </div>

      <p>Here's a real example — a production-grade Button component:</p>

      <pre><code>/* Button.tsx — A proper design system button */

interface ButtonProps {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner and disable interactions */
  loading?: boolean;
  /** Full width of parent container */
  fullWidth?: boolean;
  /** Icon to show before the label */
  icon?: React.ReactNode;
  /** Render as a different HTML element (e.g., 'a' for links) */
  as?: React.ElementType;
  /** All native button attributes are forwarded */
  [key: string]: any;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  as: Component = 'button',
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    &lt;Component
      className={cn(
        // Base styles (shared across all variants)
        'inline-flex items-center justify-center gap-2',
        'font-semibold rounded-lg transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        // Size variants
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'lg' && 'h-12 px-6 text-base',
        // Visual variants
        variant === 'primary' && 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm',
        variant === 'secondary' && 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)]',
        variant === 'ghost' && 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]',
        variant === 'destructive' && 'bg-[var(--color-error)] text-white hover:opacity-90',
        // Modifiers
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    &gt;
      {loading ? &lt;Spinner size={size} /&gt; : icon}
      {children}
    &lt;/Component&gt;
  );
}

/* Usage examples:
  &lt;Button&gt;Save Changes&lt;/Button&gt;
  &lt;Button variant="secondary" size="sm"&gt;Cancel&lt;/Button&gt;
  &lt;Button variant="destructive" loading&gt;Deleting...&lt;/Button&gt;
  &lt;Button variant="ghost" icon={&lt;PlusIcon /&gt;}&gt;Add Item&lt;/Button&gt;
  &lt;Button as="a" href="/login"&gt;Sign In&lt;/Button&gt;
*/</code></pre>

      <h2>Step 4: The Component Checklist</h2>

      <p>Before any component ships to the design system, it must pass this checklist. I'm serious — tape this to your monitor:</p>

      <!-- Component Checklist -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Component Shipping Checklist</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">1. Uses design tokens (no hardcoded colours/spacing)</div><div class="timeline-item-desc">grep for hex codes and pixel values. If you find any, replace with tokens. Zero exceptions.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">2. Keyboard accessible</div><div class="timeline-item-desc">Can you use it without a mouse? Tab to focus, Enter/Space to activate, Escape to dismiss. Test it.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">3. ARIA roles and attributes</div><div class="timeline-item-desc">role="button", aria-expanded, aria-label where needed. Run axe DevTools — zero violations.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">4. Responsive</div><div class="timeline-item-desc">Works on 320px (old iPhone SE) through 2560px (ultra-wide). Test, don't assume.</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">5. Dark mode support</div><div class="timeline-item-desc">Looks correct in both light and dark themes via semantic tokens. Not "we'll add it later."</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">6. TypeScript props are documented</div><div class="timeline-item-desc">Every prop has a JSDoc comment explaining what it does. IntelliSense should be self-explanatory.</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">7. Storybook stories exist</div><div class="timeline-item-desc">Default state, all variants, all sizes, loading, disabled, error. Interactive controls to play with.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">8. Unit tests cover edge cases</div><div class="timeline-item-desc">Renders correctly, handles click events, disabled state, loading state, keyboard events.</div></div>
        </div>
      </div>

      <h2>Step 5: Spacing and Layout System</h2>

      <p>Inconsistent spacing is the number one reason UIs look "off" even when the colours and fonts are right. Humans are weirdly good at detecting 12px of padding on one side and 14px on the other. Your brain screams "something is wrong" even if you can't articulate what.</p>

      <p>The fix: use an <strong>8px base grid</strong>. All spacing values are multiples of 8px (with 4px allowed for tight spaces). This creates a visual rhythm that feels intentional and harmonious.</p>

      <pre><code>/* Spacing scale (8px base grid) */
--space-1: 4px;     /* Tight: icon-to-label gap */
--space-2: 8px;     /* Default: between related items */
--space-3: 12px;    /* Medium: section padding */
--space-4: 16px;    /* Regular: card padding, input padding */
--space-6: 24px;    /* Generous: between sections */
--space-8: 32px;    /* Spacious: section margins */
--space-12: 48px;   /* Page sections */
--space-16: 64px;   /* Major sections */

/* Usage in components: */
.card {
  padding: var(--space-4);              /* 16px all around */
  gap: var(--space-3);                  /* 12px between card children */
  border-radius: var(--radius-xl);      /* 12px corners */
  box-shadow: var(--shadow-sm);
}

.card-header {
  margin-bottom: var(--space-3);        /* 12px below header */
}

.card-actions {
  margin-top: var(--space-4);           /* 16px above actions */
  gap: var(--space-2);                  /* 8px between buttons */
}</code></pre>

      <h2>Step 6: Typography System</h2>

      <p>Don't overthink this. You need exactly <strong>6-8 text styles</strong>. Not 15. Not 20. Six to eight. Here's a battle-tested scale:</p>

      <pre><code>/* Typography presets — the only text styles you need */

.text-display {
  font-size: var(--text-4xl);         /* 36px — Hero headings only */
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.text-heading-1 {
  font-size: var(--text-2xl);         /* 24px — Page titles */
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.text-heading-2 {
  font-size: var(--text-xl);          /* 20px — Section headers */
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.text-heading-3 {
  font-size: var(--text-lg);          /* 18px — Card titles */
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}

.text-body {
  font-size: var(--text-base);        /* 16px — Default body */
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
}

.text-body-sm {
  font-size: var(--text-sm);          /* 14px — Secondary text */
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.text-caption {
  font-size: var(--text-xs);          /* 12px — Labels, metadata */
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  letter-spacing: 0.02em;
}

.text-code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--line-height-normal);
}</code></pre>

      <h2>Step 7: Documentation — The Make-or-Break</h2>

      <p>I cannot stress this enough: <strong>the documentation IS the design system</strong>. Not the Figma file. Not the code. The docs. Because if a developer can't figure out how to use your Button component in under 30 seconds, they'll write their own. And now you have two buttons.</p>

      <p>Every component page in your docs should have exactly these sections:</p>

      <!-- Documentation Structure -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Component Documentation Structure</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">1. Live Preview<span class="layer-item-sub">Interactive example with controls to change props. "Show, don't tell."</span></div>
          <div class="layer-item" style="background:#7c3aed">2. Quick Start Code<span class="layer-item-sub">Copy-pasteable example that works immediately. No setup, no explanation needed.</span></div>
          <div class="layer-item" style="background:#22c55e">3. Props / API Table<span class="layer-item-sub">Every prop with type, default, and description. Generated from TypeScript types.</span></div>
          <div class="layer-item" style="background:#f97316">4. Variants Gallery<span class="layer-item-sub">Visual showcase of every variant, size, and state combination.</span></div>
          <div class="layer-item" style="background:#ef4444">5. Usage Guidelines<span class="layer-item-sub">When to use this component vs alternatives. Do's and Don'ts with visual examples.</span></div>
          <div class="layer-item" style="background:#ec4899">6. Accessibility Notes<span class="layer-item-sub">Keyboard shortcuts, ARIA attributes, screen reader behaviour.</span></div>
        </div>
      </div>

      <h2>Step 8: Versioning and Distribution</h2>

      <p>Your design system is a product. Products have versions. Here's how to handle this without making everyone's life miserable:</p>

      <pre><code># Package structure for a design system
my-design-system/
  packages/
    tokens/               # Design tokens (CSS, JSON, JS exports)
      package.json        # @myds/tokens
      src/
        colors.ts
        spacing.ts
        typography.ts
    core/                 # Core components (Button, Input, Modal, etc.)
      package.json        # @myds/core
      src/
        Button/
          Button.tsx
          Button.test.tsx
          Button.stories.tsx
          index.ts
        Input/
        Modal/
    icons/                # Icon library
      package.json        # @myds/icons
  docs/                   # Documentation site (Storybook or custom)
  .changeset/             # Changesets for versioning

# Install in a consuming project:
npm install @myds/core @myds/tokens

# Use:
import { Button, Input, Modal } from '@myds/core';
import '@myds/tokens/css';  # Import design tokens</code></pre>

      <pre><code># Versioning with Changesets (recommended)
# https://github.com/changesets/changesets

npx changeset init          # One-time setup
npx changeset               # Create a changeset (describe your change)
npx changeset version       # Bump versions based on changesets
npx changeset publish       # Publish to npm

# Semantic versioning rules:
# PATCH (1.0.1): Bug fix, no API change
# MINOR (1.1.0): New component, new prop, backwards compatible
# MAJOR (2.0.0): Breaking change (renamed prop, removed component)

# Golden rule: NEVER ship a breaking change without a migration guide.
# If you rename a prop, provide a codemod or deprecation warning first.</code></pre>

      <h2>Step 9: The Mistakes That Kill Design Systems</h2>

      <p>I've watched enough design systems fail to know the patterns. Here are the big ones — learn from other people's pain:</p>

      <!-- Common Mistakes -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Design System Killers (Avoid These)</div>
        <div class="vs-cards" style="grid-template-columns:1fr 1fr">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x1F6AB; What Kills Design Systems</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>Building everything before getting adoption</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>"Just use it" mandate without training</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>Designers and developers work in silos</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>No dedicated team — "everyone maintains it"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>Over-engineering: 47 button variants</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>Breaking changes without migration path</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2705; What Makes Them Succeed</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Start with 5 components, grow from demand</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Pair programming sessions to onboard teams</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Designers + devs build components together</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>At least 1-2 dedicated maintainers</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>3-4 variants max, compose for the rest</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Deprecation warnings + codemods</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Step 10: Measuring Success</h2>

      <p>How do you know if your design system is working? Not by counting components — by measuring adoption:</p>

      <pre><code># Metrics that actually matter:

# 1. Adoption rate
#    How many pages use design system components vs custom ones?
#    Target: > 80% of UI elements from the system

# 2. Time to first component
#    How long from "npm install" to rendering a Button?
#    Target: < 5 minutes (including reading docs)

# 3. Contribution rate
#    Are teams outside the DS team contributing components?
#    A healthy system gets PRs from consuming teams

# 4. Bug reports
#    Track bugs filed against DS components vs custom components
#    DS components should have fewer bugs (they're tested once, used everywhere)

# 5. Developer satisfaction (survey quarterly)
#    "On a scale of 1-5, how easy is it to build a new page?"
#    Before DS: typically 2-3
#    After DS:  should be 4-5</code></pre>

      <h2>The Starter Kit: What to Build First</h2>

      <p>Don't try to build everything. Here's the order that gives maximum value with minimum effort:</p>

      <!-- Build Order -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Recommended Build Order</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#ef4444;--i:0"><span class="pipeline-step-icon">1</span>Tokens<span class="pipeline-step-sub">Week 1</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:1"><span class="pipeline-step-icon">2</span>Button<span class="pipeline-step-sub">Week 1-2</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">3</span>Input<span class="pipeline-step-sub">Week 2</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:3"><span class="pipeline-step-icon">4</span>Modal<span class="pipeline-step-sub">Week 3</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:4"><span class="pipeline-step-icon">5</span>Table<span class="pipeline-step-sub">Week 3-4</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ec4899;--i:5"><span class="pipeline-step-icon">&#x267B;</span>Iterate<span class="pipeline-step-sub">Ongoing</span></div>
        </div>
      </div>

      <p>That's it — tokens + 4 components. Ship those, get teams using them, collect feedback, then build the next batch based on what teams actually need (not what you think they need).</p>

      <h2>Real Design Systems to Study</h2>

      <p>Don't build yours in a vacuum. Study these — they're all open source:</p>

      <ul>
        <li><strong>Radix UI</strong> (radix-ui.com) — Headless primitives, best accessibility. React.</li>
        <li><strong>shadcn/ui</strong> (ui.shadcn.com) — Copy-paste components, Tailwind CSS. The "anti-library" approach.</li>
        <li><strong>Spartan UI</strong> (spartan.ng) — shadcn/ui philosophy for Angular. Headless brain + styled helm.</li>
        <li><strong>Chakra UI</strong> (chakra-ui.com) — Accessible, composable, theme-able. React.</li>
        <li><strong>Material Design</strong> (m3.material.io) — Google's system. Very thorough documentation and guidelines.</li>
        <li><strong>Primer</strong> (primer.style) — GitHub's design system. Production-proven at massive scale.</li>
        <li><strong>Carbon</strong> (carbondesignsystem.com) — IBM's system. Enterprise-grade, highly structured.</li>
      </ul>

      <h2>Final Thought</h2>

      <p>Here's the honest truth: building a design system is not hard. Getting people to use it is. The technical part — tokens, components, docs — is maybe 30% of the work. The other 70% is people work: building trust with product teams, listening to feedback, making adoption effortless, being responsive to bug reports, and resisting the urge to make it "perfect" before anyone uses it.</p>

      <p>Ship small. Ship often. Listen more than you prescribe. A design system that 80% of your teams use happily is worth infinitely more than a "complete" system that sits in a repo with 3 stars and zero consumers.</p>

      <p>Now go build something. Start with the tokens. I'll be here if you get stuck.</p>
    `;
