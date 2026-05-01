export const CONTENT = `
      <p>On April 17, 2026, Anthropic launched <strong>Claude Design</strong> — an AI-powered design tool that lets you create interactive prototypes, pitch decks, landing pages, and more by simply describing what you want. It is part of <strong>Anthropic Labs</strong>, Anthropic's experimental product line, and runs on <strong>Claude Opus 4.7</strong>, their most capable vision model.</p>

      <p>Claude Design isn't a traditional graphic editor. There are no toolbars, no layer panels, no drag-and-drop. You <strong>talk to Claude</strong>, and it builds your design live. Need a pricing page? Describe it. Want a dashboard mockup? Ask for it. Claude writes the HTML, CSS, and JavaScript behind the scenes and renders it in a live preview panel right next to the chat.</p>

      <h2>Why Does Claude Design Exist?</h2>

      <p>Most design tools have a steep learning curve. Figma is powerful but requires design expertise. Canva is approachable but limited to templates. Claude Design fills the gap: <strong>anyone who can describe what they want can create polished visual work</strong> — no design skills required.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">The Design Tool Spectrum</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#7c3aed">
            <div class="vs-card-header" style="background:#7c3aed">Claude Design</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4AC;</span>Conversation-driven — describe, refine, ship</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A1;</span>Fastest for first drafts and exploration</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Direct handoff to Claude Code</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: engineers, PMs, founders, anyone with an idea</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#0acf83">
            <div class="vs-card-header" style="background:#0acf83">Figma</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F58C;</span>Pixel-perfect graphic editor with components</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F465;</span>Real-time multiplayer collaboration</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F9E9;</span>Plugin ecosystem and design systems</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: professional designers, large teams</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#00c4cc">
            <div class="vs-card-header" style="background:#00c4cc">Canva</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4DD;</span>Template-based drag-and-drop editor</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Zero learning curve</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3A8;</span>Great for marketing and social media</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: marketers, non-designers</div>
            </div>
          </div>
        </div>
      </div>

      <p>The real insight behind Claude Design: <strong>most visual work starts with an idea, not a blank canvas</strong>. If you can articulate what you need — "a pricing page with three tiers, a dark theme, and a toggle for monthly/annual billing" — Claude can produce it in seconds, not hours.</p>

      <h2>How Claude Design Works</h2>

      <p>The interface has two areas: a <strong>chat panel</strong> on the left and a <strong>live canvas</strong> on the right. You describe what you want in the chat, and Claude generates a working design on the canvas. From there, you refine iteratively.</p>

      <h3>Four Ways to Start a Project</h3>

      <div class="pipeline">
        <div class="pipeline-step"><span class="pipeline-label">Text Prompt</span><span class="pipeline-desc">Describe what you want in plain language</span></div>
        <div class="pipeline-arrow">&#x2192;</div>
        <div class="pipeline-step"><span class="pipeline-label">Upload Images</span><span class="pipeline-desc">Reference images, screenshots, or hand-drawn sketches</span></div>
        <div class="pipeline-arrow">&#x2192;</div>
        <div class="pipeline-step"><span class="pipeline-label">Upload Documents</span><span class="pipeline-desc">DOCX, PPTX, or XLSX — Claude transforms them into visuals</span></div>
        <div class="pipeline-arrow">&#x2192;</div>
        <div class="pipeline-step"><span class="pipeline-label">Web Capture</span><span class="pipeline-desc">Grab elements from a live website to match your product</span></div>
      </div>

      <h3>Four Ways to Refine</h3>

      <p>Once Claude generates the first version, you iterate using any combination of:</p>

      <ul>
        <li><strong>Chat:</strong> Ask Claude to change colours, add sections, restructure the layout</li>
        <li><strong>Inline comments:</strong> Click on any element and leave a comment — Claude reads them and applies changes</li>
        <li><strong>Direct edits:</strong> Edit text, move elements, change content directly on the canvas</li>
        <li><strong>Custom sliders:</strong> Claude creates interactive sliders for your design — adjust spacing, colour intensity, border radius, and more in real time without writing a prompt</li>
      </ul>

      <h2>What Can You Build?</h2>

      <p>Claude Design handles a wide range of visual work:</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Claude Design Use Cases</div>
        <div class="layer-diagram">
          <div class="layer" style="border-color:#7c3aed; background:rgba(124,58,237,0.05)">
            <div class="layer-header" style="background:#7c3aed">App Prototypes</div>
            <div class="layer-body">Interactive UI mockups with navigation, forms, modals — clickable and testable</div>
          </div>
          <div class="layer" style="border-color:#3b82f6; background:rgba(59,130,246,0.05)">
            <div class="layer-header" style="background:#3b82f6">Pitch Decks &amp; Presentations</div>
            <div class="layer-body">Multi-slide decks with data visualisations, charts, and speaker notes</div>
          </div>
          <div class="layer" style="border-color:#22c55e; background:rgba(34,197,94,0.05)">
            <div class="layer-header" style="background:#22c55e">Landing Pages &amp; Marketing</div>
            <div class="layer-body">Hero sections, pricing pages, feature tours — ready to export as HTML</div>
          </div>
          <div class="layer" style="border-color:#f97316; background:rgba(249,115,22,0.05)">
            <div class="layer-header" style="background:#f97316">Social Media Assets</div>
            <div class="layer-body">Banners, OG images, Instagram stories — sized correctly for each platform</div>
          </div>
          <div class="layer" style="border-color:#ec4899; background:rgba(236,72,153,0.05)">
            <div class="layer-header" style="background:#ec4899">Frontier Design</div>
            <div class="layer-body">Code-powered experiences with voice, video, 3D visuals, and special effects</div>
          </div>
        </div>
      </div>

      <h2>Design System Integration</h2>

      <p>For teams, Claude Design can apply your <strong>design system</strong> to every project automatically. Upload your brand guidelines — colours, typography, spacing, component styles — and Claude ensures consistency across all output. This means your prototypes already look like your production product, not a generic wireframe.</p>

      <h2>Export and Handoff</h2>

      <p>Getting your work out of Claude Design is straightforward:</p>

      <div class="pipeline">
        <div class="pipeline-step"><span class="pipeline-label">Claude Code</span><span class="pipeline-desc">Handoff bundle — Claude Code converts to production-ready code</span></div>
        <div class="pipeline-arrow">&#x2192;</div>
        <div class="pipeline-step"><span class="pipeline-label">Canva</span><span class="pipeline-desc">Fully editable design in Canva's Visual Suite</span></div>
        <div class="pipeline-arrow">&#x2192;</div>
        <div class="pipeline-step"><span class="pipeline-label">HTML / PDF / PPTX</span><span class="pipeline-desc">Standalone files for sharing or presenting</span></div>
        <div class="pipeline-arrow">&#x2192;</div>
        <div class="pipeline-step"><span class="pipeline-label">Shareable URL</span><span class="pipeline-desc">Internal link for team review</span></div>
      </div>

      <p>The <strong>Claude Code handoff</strong> is the standout feature. When your design is ready to build, Claude packages everything — layout, components, interactions, assets — into a handoff bundle. Pass it to Claude Code with a single instruction and it converts the design into production-ready code. This is the most integrated <strong>AI-to-AI design-to-code pipeline</strong> available today.</p>

      <p>The <strong>Canva integration</strong> is equally notable. Anthropic partnered with Canva to allow direct export. Your Claude Design output becomes a fully editable Canva design — collaborative, with access to Canva's asset library, templates, and sharing features.</p>

      <h2>Pricing and Availability</h2>

      <p>Claude Design is included at <strong>no extra cost</strong> with paid Claude plans:</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Who Gets Access</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">Included</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Claude Pro — \$20/month</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Claude Max — \$100–\$200/month</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Claude Team — \$25–\$30/seat/month</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Claude Enterprise — custom pricing</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">Not Included</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x274C;</span>Claude Free plan — no access to Anthropic Labs tools</div>
            </div>
          </div>
        </div>
      </div>

      <p>Claude Design is currently in <strong>research preview</strong>, meaning features may change and there are usage limits based on your plan tier.</p>

      <h2>Limitations to Know</h2>

      <p>Claude Design is impressive but not a replacement for every design tool:</p>

      <ul>
        <li><strong>No brand kit management:</strong> Unlike Canva, it doesn't maintain a persistent brand kit across sessions (though design system upload helps)</li>
        <li><strong>Single-user experience:</strong> No real-time multiplayer editing like Figma — collaboration is conversation-based (colleagues join a group chat)</li>
        <li><strong>Token-hungry:</strong> Complex designs consume significant tokens, and usage limits apply per plan tier</li>
        <li><strong>No image generation:</strong> Claude Design generates code-rendered visuals (HTML/CSS/JS), not raster images — it's not Midjourney</li>
        <li><strong>Research preview:</strong> Features are still evolving, some outputs may need manual refinement</li>
      </ul>

      <h2>Claude Design vs Figma vs Canva: When to Use What</h2>

      <p>These tools serve different workflows. Here's when each one makes sense:</p>

      <ul>
        <li><strong>Claude Design:</strong> You have an idea and want to see it realised in minutes. Best for engineers, PMs, founders, and anyone exploring concepts before involving a design team. The Claude Code handoff makes it ideal for rapid prototyping.</li>
        <li><strong>Figma:</strong> You need pixel-perfect production designs with a design system, component libraries, and real-time team collaboration. Best for professional designers and established design teams.</li>
        <li><strong>Canva:</strong> You need marketing materials, social media assets, or presentation decks using polished templates. Best for marketers and non-technical teams.</li>
      </ul>

      <p>Many teams will use all three: <strong>Claude Design for exploration</strong>, <strong>Figma for production design</strong>, and <strong>Canva for marketing output</strong>. The Canva export integration already bridges two of these.</p>

      <h2>Getting Started</h2>

      <p>If you have a Claude Pro, Max, Team, or Enterprise subscription:</p>

      <ol>
        <li>Go to <strong>claude.ai</strong> and look for the <strong>Design</strong> option in the product menu</li>
        <li>Start a new project with a text prompt, image upload, document upload, or web capture</li>
        <li>Iterate using chat, inline comments, direct edits, or custom sliders</li>
        <li>Export to Claude Code, Canva, HTML, PDF, PPTX, or shareable URL</li>
      </ol>

      <p>The learning curve is essentially zero — if you can describe what you want, you can use Claude Design. The hard part isn't the tool, it's knowing what you want to build.</p>

      <h2>Bottom Line</h2>

      <p>Claude Design represents a fundamental shift in how visual work gets created. Instead of learning a complex tool, you <strong>describe your intent</strong> and get a working result. It's not going to replace Figma for professional design teams anytime soon, but it makes prototyping, pitch decks, and landing pages accessible to anyone with a Claude subscription.</p>

      <p>The Claude Code handoff is the killer feature — going from idea to interactive prototype to production code without ever opening a traditional design tool. For engineers and product teams, that is genuinely transformative.</p>
    `;
