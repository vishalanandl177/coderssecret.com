export const CONTENT = `
      <p>I built this entire blog — 35+ articles, 6 interactive games, 5 cheat sheets, SEO optimization, GitHub Pages deployment, Giscus comments — using Claude Code in a single session. Not by luck. By learning how to prompt it properly. The difference between a vague prompt and a precise one is the difference between "it kind of works" and "ship it to production."</p>

      <p>This tutorial teaches you the prompting patterns that actually work, with real examples from building real software. No theory — just what works.</p>

      <h2>The Fundamental Rule</h2>

      <p>Before we get into techniques, understand this one thing:</p>

      <p><strong>Claude Code is not a search engine. It's a junior developer who is incredibly fast, never gets tired, and has read every programming book ever written — but needs clear direction.</strong></p>

      <p>You wouldn't tell a junior dev "make the app better." You'd say "add a loading spinner to the submit button that appears when the form is submitting and disappears when the response arrives." That's the level of specificity Claude Code needs.</p>

      <!-- Good vs Bad Prompts -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The Prompt Quality Spectrum</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x274C; Vague Prompts</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F44E;</span>"Fix the bug"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F44E;</span>"Make it look better"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F44E;</span>"Add SEO"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F44E;</span>"Write tests"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F44E;</span>"Optimize the code"</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2705; Precise Prompts</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F44D;</span>"The TOC links redirect to home instead of scrolling — use scrollIntoView"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F44D;</span>"Move TOC to a sticky sidebar on desktop like Android docs"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F44D;</span>"Add OG tags, JSON-LD BlogPosting schema, and canonical URLs per page"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F44D;</span>"Write pytest tests for the auth service — cover login, expired tokens, rate limiting"</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F44D;</span>"The bar chart bars are empty because Angular sanitizes inline styles — use CSS classes instead"</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Pattern 1: The Context-First Prompt</h2>

      <p>Always start with context. Claude Code doesn't know your project's history, your tech stack, or your business requirements unless you tell it. Front-load the important stuff.</p>

      <pre><code># &#x274C; BAD: No context
"Add a comments section"

# &#x2705; GOOD: Context-first
"Add Giscus comments to the blog post page. Use this script:
&lt;script src='https://giscus.app/client.js'
  data-repo='myuser/myrepo'
  data-repo-id='R_xxx'
  data-category='General'
  data-category-id='DIC_xxx'
  data-mapping='title'
  data-theme='preferred_color_scheme'
  data-loading='lazy'
  async&gt;&lt;/script&gt;

Load the script dynamically in ngAfterViewChecked. Reload when
navigating between blog posts so each post gets its own discussion."</code></pre>

      <p>Notice the difference: the good prompt tells Claude <em>what</em> (Giscus), <em>how</em> (dynamic script loading), <em>when</em> (ngAfterViewChecked), and <em>edge case</em> (reload on navigation). Claude doesn't have to guess anything.</p>

      <h2>Pattern 2: The Screenshot Prompt</h2>

      <p>When something looks wrong visually, <strong>show it</strong>. Claude Code can read screenshots. Instead of trying to describe a layout issue in words, paste a screenshot and say "this card is misaligned — the left column is too narrow and text is wrapping."</p>

      <pre><code># &#x274C; BAD: Vague visual description
"The auth quick reference section looks weird on the page"

# &#x2705; GOOD: Screenshot + specific problem
[paste screenshot]
"Auth Quick Reference: Which Auth for Which Scenario UI having
issues. It's not properly aligned — the left card is too narrow
and text is clipping. The VS cards layout doesn't work for this
content."

# Claude can see the screenshot and understands exactly what
# needs fixing. In this case, it replaced VS cards with a
# proper 3-column table that works at all widths.</code></pre>

      <h2>Pattern 3: The Reference Prompt</h2>

      <p>Instead of describing what you want from scratch, point to an existing example. This is incredibly powerful.</p>

      <pre><code># &#x274C; BAD: Abstract description
"Add a table of contents that's always visible"

# &#x2705; GOOD: Reference + what to copy
[paste screenshot of Android Developers docs]
"Move the Table of Contents to the right side of the page in
expanded mode, like how Google also does it on their Android
developer docs. Sticky, always visible, with section titles
that scroll with the page."

# Claude immediately understands the exact pattern you want
# because it can see the reference implementation.</code></pre>

      <h2>Pattern 4: The Multi-Task Prompt</h2>

      <p>When you need multiple things done, list them explicitly. Claude Code handles numbered lists beautifully — it tracks each item and doesn't skip any.</p>

      <pre><code># &#x274C; BAD: Run-on paragraph
"Add some blog posts about security and also maybe fix the SEO
and add dark mode support"

# &#x2705; GOOD: Numbered list with specifics
"Three things:
1. Add a blog on ethical hacking — make it beginner-friendly,
   include real tool examples, safe lab setup guide
2. Add a blog on M2M authentication — cover OAuth Client
   Credentials, mTLS, API keys, JWT validation
3. Add a blog on SSO (SAML & OIDC) — compare both protocols,
   include sequence diagrams, Python implementation"

# Claude will create all three posts, each complete and
# properly structured, without forgetting any.</code></pre>

      <h2>Pattern 5: The Constraint Prompt</h2>

      <p>Tell Claude what NOT to do. Constraints are as important as requirements.</p>

      <pre><code># &#x274C; BAD: Open-ended
"Add games to the site"

# &#x2705; GOOD: Requirements + constraints
"Add 6 developer games to the site:
1. Guess the Output
2. Spot the Bug
3. DevOps Scenario Simulator
4. Typing Speed Test
5. Salary Calculator
6. Linux Command Challenge

Constraints:
- All routes MUST be lazy-loaded to avoid page speed delay
- Games content should relate to existing blog topics
- Each game needs proper SEO (title, meta, breadcrumbs)
- Pre-render all game pages for Google indexing"</code></pre>

      <h2>Pattern 6: The Iterative Refinement Prompt</h2>

      <p>Don't try to get everything perfect in one prompt. Build iteratively — the same way you'd code. Ship a v1, test it, then refine.</p>

      <pre><code># Round 1: Get the foundation
"Add interactive diagrams to the SSO blog post — sequence
diagrams for SAML and OIDC flows"

# Round 2: After seeing the result
"These SVGs are static. I want interactive HTML/CSS diagrams
with animations, hover effects, and step-by-step highlights
instead"

# Round 3: After testing in browser
"The sequence diagrams look great but the SAML vs OIDC
comparison cards don't render properly on mobile — the
VS badge should stack above on small screens"

# Each round gets you closer to exactly what you want.
# Don't try to specify everything upfront — iterate.</code></pre>

      <h2>Pattern 7: The Debug Prompt</h2>

      <p>When something is broken, give Claude the error message, the context, and what you expected. The more diagnostic information, the faster the fix.</p>

      <pre><code># &#x274C; BAD: "It's broken"
"The build is failing"

# &#x2705; GOOD: Error + context + expectation
"The Angular build fails with:
  TS2349: This expression is not callable
  TS2304: Cannot find name 'Execute'
  Expected '}' but found 'C:\\Python312\\python.exe'

This started after I added the Cron Jobs blog post. The issue
is likely backticks or dollar signs in PowerShell code examples
inside the template literal — they're being interpreted as
JavaScript template expressions."

# Claude immediately knows:
# 1. It's a template literal escaping issue
# 2. It's in the blog-post.model.ts file
# 3. PowerShell backticks and $ signs need escaping
# Fix takes 30 seconds instead of 10 minutes of guessing.</code></pre>

      <h2>Pattern 8: The "Teach Me Then Build" Prompt</h2>

      <p>When you're unsure about the right approach, ask Claude to explain options first, then pick one.</p>

      <pre><code># &#x274C; BAD: Jump to implementation without understanding
"Add Firebase to the site for storing blog data"

# &#x2705; GOOD: Ask for analysis first
"Can I use Firebase Realtime Database to store this site's
blog info? What are the pros and cons?"

# Claude explains: "Technically yes, but practically it's a
# bad idea for YOUR specific site because..."
# - Breaks SEO (content fetched client-side)
# - Costs money when free GitHub Pages works fine
# - Adds complexity for no benefit
#
# Now you make an informed decision BEFORE writing code.
# You saved yourself a week of wasted work.</code></pre>

      <h2>Pattern 9: The Quality Bar Prompt</h2>

      <p>Tell Claude the quality level you expect. "Make it detailed" vs "make it production-grade" produce very different outputs.</p>

      <pre><code># Levels of quality you can request:

# Quick/rough:
"Add a basic 404 page"

# Thorough:
"Add a 404 page with the same styling as the rest of the site,
breadcrumbs, links to home and blog"

# Production-grade:
"Add a proper 404 page:
- Matches site design (header, footer, theme)
- SEO: noindex meta tag, proper title
- Helpful: links to home, blog, search
- The 404.html for GitHub Pages should serve the full Angular
  app (not redirect) so Google doesn't see redirect errors
- Pre-render with meaningful content for crawlers"

# The third prompt produces something you can actually ship.</code></pre>

      <h2>Pattern 10: The "Do What I Mean" Prompt</h2>

      <p>Sometimes you know the problem but not the solution. That's fine — describe the problem, let Claude figure out the implementation.</p>

      <pre><code># Problem-first (you don't need to know the solution):
"Google says our pages have a 'Soft 404' error. The pages load
with 200 OK but Google sees empty content because it's a SPA.
How do we fix this so Google can actually index our blog posts?"

# Claude figures out the solution:
# 1. Generate static HTML for every route at build time
# 2. Inject route-specific title, description, OG tags
# 3. Put real content inside <app-root> for each page
# 4. Update the CI pipeline to run the generation script
# 5. Add the script to pre-commit validation

# You described the PROBLEM ("Google says Soft 404").
# Claude provided the SOLUTION (pre-rendering with content).
# You didn't need to know about pre-rendering beforehand.</code></pre>

      <h2>Pro Tips from Building This Blog</h2>

      <!-- Pro Tips -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Advanced Claude Code Prompting Tips</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">Always ask to commit and push</div><div class="timeline-item-desc">End prompts with "commit and push to main" so you don't lose work. Claude tracks git state and writes good commit messages.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Request the build check</div><div class="timeline-item-desc">"Build and verify" at the end catches compile errors immediately. Claude fixes them in the same turn.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">Paste error messages directly</div><div class="timeline-item-desc">Don't summarise errors. Copy-paste the exact terminal output. Claude parses error messages faster than you do.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Ask "what else should I do?"</div><div class="timeline-item-desc">After completing a feature, ask Claude to audit it. "Analyse what's missing from this blog site" — it catches things you didn't think of.</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">Be honest about what you don't know</div><div class="timeline-item-desc">"I don't understand why the bar chart bars are empty" is better than pretending you know. Claude explains the root cause (Angular innerHTML sanitizer) and the fix.</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">Challenge recommendations</div><div class="timeline-item-desc">"Is Firebase really the right choice here?" led to Claude honestly explaining why it's a bad fit for a static blog. Don't accept the first suggestion blindly.</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">Use "make it feel human"</div><div class="timeline-item-desc">For content, add tone instructions: "write in Indian English," "make it conversational," "should feel like written by a human." Claude adjusts its writing style dramatically.</div></div>
        </div>
      </div>

      <h2>The Prompt Template I Use Most</h2>

      <pre><code># My go-to structure for complex tasks:

"[WHAT]: Add/Fix/Create [specific thing]

[CONTEXT]: This is a [tech stack] project.
Currently [current state]. The problem is [problem].

[REQUIREMENTS]:
1. [Specific requirement 1]
2. [Specific requirement 2]
3. [Specific requirement 3]

[CONSTRAINTS]:
- Must be [performance/security/accessibility constraint]
- Don't [thing to avoid]
- Make sure [quality bar]

[REFERENCES]: Similar to [reference implementation/screenshot]

Build, commit, and push when done."</code></pre>

      <h2>What Claude Code Can't Do Well (Be Realistic)</h2>

      <ul>
        <li><strong>Visual design decisions:</strong> Claude can implement any design you describe, but it can't tell you if purple looks better than blue for your brand. You're the designer.</li>
        <li><strong>Business strategy:</strong> "Should I add a paywall?" is a business question, not a technical one. Claude can build a paywall, but can't tell you if your audience will pay.</li>
        <li><strong>Real user testing:</strong> Claude can't click through your UI in a browser. Always test the output yourself, especially for visual/interactive features.</li>
        <li><strong>Domain expertise you haven't shared:</strong> If your API has a specific naming convention or your company has a style guide, tell Claude. It doesn't know your internal standards unless you provide them.</li>
      </ul>

      <h2>Real Session Stats (This Blog)</h2>

      <p>To give you a sense of what's possible with good prompting, here's what was built in a single Claude Code session:</p>

      <!-- Stats -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">What Was Built in One Session</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:400px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Feature</th>
                <th style="text-align:center;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Blog posts (2000-4000 words each)</td><td style="padding:0.5rem;text-align:center;font-weight:700">35+</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Interactive diagrams</td><td style="padding:0.5rem;text-align:center;font-weight:700">100+</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Games (full interactive)</td><td style="padding:0.5rem;text-align:center;font-weight:700">6</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Cheat sheets (with advanced sections)</td><td style="padding:0.5rem;text-align:center;font-weight:700">5</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">SEO fixes (meta, schema, pre-rendering)</td><td style="padding:0.5rem;text-align:center;font-weight:700">20+</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Bug fixes</td><td style="padding:0.5rem;text-align:center;font-weight:700">15+</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Features (TOC, search, comments, etc.)</td><td style="padding:0.5rem;text-align:center;font-weight:700">25+</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Commits pushed to GitHub</td><td style="padding:0.5rem;text-align:center;font-weight:700">80+</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <p>All of this in one session. Not because Claude Code is magic — because the prompts were specific, contextual, and iterative. The tool does exactly what you tell it. The skill is in the telling.</p>

      <p>Start with the Context-First pattern. Master it. Then add constraints and references. Within a week, you'll be shipping features 10x faster than you ever thought possible. The bottleneck is no longer coding speed — it's how clearly you can think about what you want.</p>
    `;
