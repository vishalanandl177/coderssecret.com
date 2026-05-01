export const CONTENT = `
      <p>Most developers learn just enough Flexbox to center a div and just enough Grid to feel confused. Then they reach for a CSS framework. But Flexbox and Grid together handle every layout you will ever need &mdash; sidebars, card grids, holy grail layouts, responsive navigation &mdash; without a single framework dependency.</p>

      <h2>The One Rule: Grid for Layout, Flexbox for Alignment</h2>

      <ul>
        <li><strong>CSS Grid:</strong> Two-dimensional (rows AND columns). Use for page-level layout and component structure.</li>
        <li><strong>Flexbox:</strong> One-dimensional (row OR column). Use for aligning items within a container.</li>
      </ul>

      <p>They are not competitors. Use Grid for the overall page structure, then Flexbox inside each Grid cell for alignment.</p>

      <h2>Flexbox Essentials</h2>

      <pre><code>/* The container controls how children behave */
.flex-container {
  display: flex;
  flex-direction: row;        /* row | column | row-reverse | column-reverse */
  justify-content: center;    /* Main axis: start | center | end | space-between | space-around | space-evenly */
  align-items: center;        /* Cross axis: start | center | end | stretch | baseline */
  gap: 1rem;                  /* Spacing between items */
  flex-wrap: wrap;            /* Allow wrapping to next line */
}

/* Children control their own sizing */
.flex-item {
  flex: 1;                    /* Grow to fill available space */
  /* flex: 1 is shorthand for: flex-grow: 1; flex-shrink: 1; flex-basis: 0; */
}</code></pre>

      <h3>Common Flexbox Patterns</h3>

      <pre><code>/* 1. Center anything (the classic) */
.center-everything {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* 2. Navigation bar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}
.navbar-links {
  display: flex;
  gap: 1.5rem;
}

/* 3. Card footer pushed to bottom */
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-body {
  flex: 1;   /* Takes all available space, pushes footer down */
}
.card-footer {
  margin-top: auto;  /* Alternative: push to bottom */
}

/* 4. Input with button */
.search-bar {
  display: flex;
}
.search-bar input {
  flex: 1;           /* Input takes remaining space */
}
.search-bar button {
  flex-shrink: 0;    /* Button never shrinks */
}</code></pre>

      <h2>CSS Grid Essentials</h2>

      <pre><code>/* Define rows and columns */
.grid-container {
  display: grid;
  grid-template-columns: 250px 1fr 250px;  /* sidebar | main | sidebar */
  grid-template-rows: auto 1fr auto;        /* header | content | footer */
  gap: 1rem;
  min-height: 100vh;
}

/* Place items by name (much clearer than line numbers) */
.grid-container {
  grid-template-areas:
    "header  header  header"
    "left    main    right"
    "footer  footer  footer";
}

.header { grid-area: header; }
.sidebar-left { grid-area: left; }
.main-content { grid-area: main; }
.sidebar-right { grid-area: right; }
.footer { grid-area: footer; }</code></pre>

      <h3>Responsive Grid Without Media Queries</h3>

      <pre><code>/* Auto-fit: cards that wrap and fill available space */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
/* On wide screen: 3-4 columns
   On tablet: 2 columns
   On mobile: 1 column
   ZERO media queries! */

/* Auto-fill vs auto-fit:
   auto-fill: creates empty columns even with few items
   auto-fit: collapses empty columns so items stretch */

/* Fixed minimum, flexible maximum */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}</code></pre>

      <h3>Common Grid Patterns</h3>

      <pre><code>/* 1. Holy grail layout */
.page {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  min-height: 100vh;
}

/* Make it responsive with one media query */
@media (max-width: 768px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
  }
}

/* 2. Dashboard layout */
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
}
.widget-large {
  grid-column: span 2;
  grid-row: span 2;
}
.widget-wide {
  grid-column: span 2;
}

/* 3. Masonry-like layout (with Grid) */
.masonry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 10px;  /* Small base row */
  gap: 1rem;
}
.masonry-item-small { grid-row: span 20; }
.masonry-item-medium { grid-row: span 30; }
.masonry-item-large { grid-row: span 40; }</code></pre>

      <h2>Grid + Flexbox Together</h2>

      <pre><code>/* Grid for page layout, Flexbox inside each cell */
.app {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
}

/* Header uses Flexbox for alignment */
.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

/* Main content uses Grid for card layout */
.main {
  grid-area: main;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  overflow-y: auto;
}

/* Each card uses Flexbox for internal layout */
.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}
.card-content { flex: 1; padding: 1rem; }
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
}</code></pre>

      <h2>Subgrid: Aligning Nested Grids</h2>

      <pre><code>/* Parent grid */
.card-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Child uses parent's grid lines for consistent alignment */
.card {
  display: grid;
  grid-template-rows: subgrid;   /* Inherit parent's row tracks */
  grid-row: span 3;              /* Card occupies 3 rows */
}
/* Now all card titles, bodies, and footers align across cards
   even when content lengths differ */</code></pre>

      <h2>Decision Guide</h2>

      <table>
        <thead>
          <tr>
            <th>Use Case</th>
            <th>Use</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Page layout (header/sidebar/main)</td>
            <td>Grid</td>
            <td>Two-dimensional, named areas</td>
          </tr>
          <tr>
            <td>Card grid</td>
            <td>Grid</td>
            <td>auto-fit/minmax for responsive wrapping</td>
          </tr>
          <tr>
            <td>Navigation links</td>
            <td>Flexbox</td>
            <td>One row of items with spacing</td>
          </tr>
          <tr>
            <td>Center content</td>
            <td>Flexbox</td>
            <td>justify-content + align-items</td>
          </tr>
          <tr>
            <td>Form layout</td>
            <td>Grid</td>
            <td>Label/input pairs in columns</td>
          </tr>
          <tr>
            <td>Toolbar buttons</td>
            <td>Flexbox</td>
            <td>Single row, variable spacing</td>
          </tr>
          <tr>
            <td>Dashboard widgets</td>
            <td>Grid</td>
            <td>Spanning rows/columns</td>
          </tr>
          <tr>
            <td>Sticky footer</td>
            <td>Flexbox or Grid</td>
            <td>Both work well</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Grid for two dimensions, Flexbox for one</strong> &mdash; this rule alone solves 90% of layout decisions</li>
        <li><strong>Use grid-template-areas</strong> for readable, maintainable page layouts</li>
        <li><strong>repeat(auto-fit, minmax(300px, 1fr))</strong> creates responsive grids without media queries</li>
        <li><strong>Combine Grid and Flexbox:</strong> Grid for structure, Flexbox for alignment within cells</li>
        <li><strong>flex: 1 on a child</strong> makes it grow to fill available space &mdash; perfect for push-to-bottom patterns</li>
        <li><strong>gap works in both Grid and Flexbox</strong> &mdash; no more margin hacks</li>
        <li><strong>Subgrid aligns nested content</strong> across sibling elements &mdash; use it for card lists</li>
        <li><strong>You probably do not need a CSS framework</strong> &mdash; Grid + Flexbox + custom properties handle everything</li>
      </ul>

      <p>The secret to CSS layout is not memorizing properties &mdash; it is understanding the mental model. Grid thinks in tracks (rows and columns). Flexbox thinks in flow (main axis and cross axis). Once you internalize these two mental models, layout stops being a guessing game and becomes intentional design.</p>
    `;
