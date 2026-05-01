export const CONTENT = `
      <p>OKRs &mdash; <strong>Objectives and Key Results</strong> &mdash; are the goal-setting framework used by Google, Intel, Spotify, LinkedIn, and thousands of startups. The idea is simple: decide <strong>what you want to achieve</strong> (the Objective) and <strong>how you will measure progress</strong> (the Key Results).</p>

      <p>But most OKR guides drown you in theory. This one is different. We will cover the framework in 5 minutes, then spend the rest on <strong>real examples you can copy and adapt</strong> for your own team.</p>

      <h2>The Framework in 60 Seconds</h2>

      <div class="flow-diagram">
        <div class="flow-diagram-title">OKR Structure</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#a855f7">
            <div class="vs-card-header" style="background:#a855f7">Objective</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span><strong>What</strong> you want to achieve</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4AC;</span>Qualitative, inspiring, time-bound</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Example: "Make our API rock-solid reliable"</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">Key Results (2-5 per Objective)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CF;</span><strong>How</strong> you measure progress</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F522;</span>Quantitative, specific, measurable</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Example: "Reduce p99 latency from 800ms to 200ms"</div>
            </div>
          </div>
        </div>
      </div>

      <p><strong>That is it.</strong> An Objective tells the team <em>where to go</em>. Key Results tell you <em>whether you got there</em>. If you cannot measure it, it is not a Key Result &mdash; it is a wish.</p>

      <h2>Good OKRs vs Bad OKRs</h2>

      <p>The difference between OKRs that drive real change and OKRs that become shelfware comes down to specificity.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Good vs Bad OKRs</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">Bad OKR</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x274C;</span><strong>O:</strong> Improve engineering quality</div>
              <div class="vs-row"><span class="vs-row-icon">&#x274C;</span><strong>KR1:</strong> Write more tests</div>
              <div class="vs-row"><span class="vs-row-icon">&#x274C;</span><strong>KR2:</strong> Reduce bugs</div>
              <div class="vs-row"><span class="vs-row-icon">&#x274C;</span><strong>KR3:</strong> Do more code reviews</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">Good OKR</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span><strong>O:</strong> Ship code with confidence</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span><strong>KR1:</strong> Increase test coverage from 45% to 80%</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span><strong>KR2:</strong> Reduce production incidents from 12/month to 3/month</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span><strong>KR3:</strong> 100% of PRs reviewed within 4 hours</div>
            </div>
          </div>
        </div>
      </div>

      <p>The bad version uses vague words: "improve", "more", "reduce". The good version uses <strong>specific numbers with a starting point and a target</strong>. You know exactly where you are, where you want to be, and whether you got there.</p>

      <h2>The Rules</h2>

      <ul>
        <li><strong>3-5 Objectives per quarter</strong> &mdash; more than 5 means you have no priorities</li>
        <li><strong>2-5 Key Results per Objective</strong> &mdash; more than 5 means the Objective is too broad</li>
        <li><strong>Key Results are outcomes, not tasks</strong> &mdash; "Deploy monitoring" is a task. "Reduce mean-time-to-detect from 30 min to 5 min" is a Key Result</li>
        <li><strong>Aim for 70% achievement</strong> &mdash; if you consistently hit 100%, your OKRs are too easy. OKRs should stretch you</li>
        <li><strong>OKRs are not performance reviews</strong> &mdash; they are learning tools. Missing a stretch goal is fine; not trying is not</li>
        <li><strong>Review weekly, score quarterly</strong> &mdash; check in every week. Score 0.0 to 1.0 at the end of the quarter</li>
      </ul>

      <h2>Real-World Example 1: Backend Engineering Team</h2>

      <p><strong>Context:</strong> A 6-person backend team at a B2B SaaS company. Their API has reliability problems &mdash; customers are complaining about downtime and slow responses.</p>

      <pre><code>OBJECTIVE: Make our API rock-solid reliable

KR1: Increase API uptime from 99.2% to 99.95% (measured by external monitoring)
KR2: Reduce p99 API latency from 800ms to 200ms
KR3: Reduce production incidents (Sev1 + Sev2) from 12/month to 3/month
KR4: Achieve mean-time-to-recovery (MTTR) under 15 minutes for all Sev1 incidents</code></pre>

      <p><strong>Why this works:</strong> Every Key Result is a measurable outcome tied to customer pain. The team can pursue any strategy &mdash; better monitoring, database optimization, circuit breakers, chaos engineering &mdash; as long as the numbers move.</p>

      <h2>Real-World Example 2: Frontend Team</h2>

      <p><strong>Context:</strong> The web app feels sluggish. Users drop off during onboarding. The team wants to fix performance and improve the first-time user experience.</p>

      <pre><code>OBJECTIVE: Deliver a fast, delightful user experience

KR1: Improve Largest Contentful Paint (LCP) from 4.2s to under 1.5s
KR2: Increase onboarding completion rate from 34% to 65%
KR3: Reduce JavaScript bundle size from 2.1MB to under 500KB
KR4: Achieve a Core Web Vitals "Good" rating on 90%+ of pages</code></pre>

      <p><strong>Why this works:</strong> Mixes technical metrics (LCP, bundle size) with business outcomes (onboarding completion). The team cannot just optimize code &mdash; they also need to think about UX flow.</p>

      <h2>Real-World Example 3: DevOps / Platform Team</h2>

      <p><strong>Context:</strong> Developers complain the CI/CD pipeline is slow. Deployments are risky and manual. The platform team wants to make shipping safe and fast.</p>

      <pre><code>OBJECTIVE: Make deploying to production boring (in a good way)

KR1: Reduce CI pipeline time from 25 minutes to under 8 minutes
KR2: Increase deployment frequency from 2/week to 3/day
KR3: Achieve zero-downtime deployments for 100% of services
KR4: Reduce rollback rate from 15% to under 3%</code></pre>

      <p><strong>Why this works:</strong> The Objective is memorable ("make deploying boring"). The Key Results cover speed (CI time), frequency (deploys/day), safety (zero-downtime), and quality (rollback rate). If all four hit, developers will genuinely trust the pipeline.</p>

      <h2>Real-World Example 4: Early-Stage Startup</h2>

      <p><strong>Context:</strong> A 4-person startup that just launched. They need to find product-market fit before the runway runs out.</p>

      <pre><code>OBJECTIVE: Find 100 users who love us

KR1: Reach 100 weekly active users (up from 12)
KR2: Achieve Net Promoter Score (NPS) of 50+ from user surveys
KR3: Get 10 users to voluntarily refer a friend (organic, not incentivized)
KR4: Reduce churn rate from 40%/month to under 10%/month</code></pre>

      <p><strong>Why this works:</strong> For a startup, "100 users who love us" is worth more than "10,000 users who signed up and never came back." Every Key Result measures love, not vanity.</p>

      <h2>Real-World Example 5: Security Team</h2>

      <p><strong>Context:</strong> The company just passed a SOC2 audit but the security posture is reactive. They want to shift left and build security into the development process.</p>

      <pre><code>OBJECTIVE: Shift security left — catch vulnerabilities before production

KR1: 100% of repos have automated SAST scanning in CI pipeline
KR2: Reduce average vulnerability remediation time from 45 days to 7 days
KR3: Zero critical/high CVEs in production dependencies (currently 23)
KR4: 80% of engineers complete secure coding training (currently 15%)</code></pre>

      <h2>Real-World Example 6: Data / ML Team</h2>

      <p><strong>Context:</strong> The recommendation engine is underperforming. Click-through rates are low and the model pipeline is fragile.</p>

      <pre><code>OBJECTIVE: Build a recommendation engine users actually trust

KR1: Increase recommendation click-through rate from 2.1% to 8%
KR2: Reduce model training pipeline failures from 30% to under 5%
KR3: Achieve model freshness — retrain and deploy within 4 hours of new data
KR4: Reduce cold-start problem: new users get personalized recs within 3 interactions</code></pre>

      <h2>How to Write Your First OKR in 10 Minutes</h2>

      <p>Follow this template:</p>

      <pre><code>Step 1: What is the biggest problem your team faces this quarter?
        → Write it as a short, inspiring sentence. This is your Objective.

Step 2: How would you know the problem is solved?
        → List 2-5 measurable indicators. These are your Key Results.

Step 3: For each Key Result, add "from X to Y"
        → X = where you are now. Y = where you want to be.

Step 4: Sanity check
        → Can I measure this weekly?
        → Is achieving 70% still meaningful?
        → Would a stranger understand what success looks like?
        → Am I measuring outcomes, not tasks?</code></pre>

      <h2>OKR vs KPI: What is the Difference?</h2>

      <div class="flow-diagram">
        <div class="flow-diagram-title">OKR vs KPI</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#a855f7">
            <div class="vs-card-header" style="background:#a855f7">OKR</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F680;</span>Drives <strong>change</strong> — where do we want to go?</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F3;</span>Time-bound (quarterly)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Ambitious, stretch targets (aim for 70%)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Changes every quarter</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">KPI</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Tracks <strong>health</strong> — are we on track?</div>
              <div class="vs-row"><span class="vs-row-icon">&#x267E;</span>Ongoing (always measured)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Realistic, must-hit thresholds</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C8;</span>Stays relatively stable</div>
            </div>
          </div>
        </div>
      </div>

      <p><strong>Use both together:</strong> KPIs are the dashboard you always monitor (uptime, revenue, churn). OKRs are the quarterly bets you make to move specific KPIs in a meaningful direction.</p>

      <h2>Common Mistakes</h2>

      <ul>
        <li><strong>Too many OKRs</strong> &mdash; if everything is a priority, nothing is. Stick to 3-5 Objectives per quarter.</li>
        <li><strong>Key Results that are tasks</strong> &mdash; "Launch feature X" is a task. "Increase metric Y from A to B" is a Key Result. Measure outcomes, not output.</li>
        <li><strong>Sandbagging</strong> &mdash; setting easy targets so you always hit 100%. OKRs should be uncomfortable. 70% achievement on a stretch goal beats 100% on a safe one.</li>
        <li><strong>Set-and-forget</strong> &mdash; writing OKRs in January and reviewing in March. Check in weekly. Adjust if the world changes.</li>
        <li><strong>Tying OKRs to bonuses</strong> &mdash; the moment OKRs affect compensation, people sandbag. Google explicitly decouples OKRs from performance reviews.</li>
        <li><strong>No baseline</strong> &mdash; "Improve latency to 200ms" means nothing without knowing the starting point. Always write "from X to Y."</li>
      </ul>

      <h2>Summary</h2>

      <ul>
        <li><strong>Objective</strong> = what you want to achieve (qualitative, inspiring, time-bound)</li>
        <li><strong>Key Results</strong> = how you measure it (quantitative, specific, "from X to Y")</li>
        <li>Write <strong>3-5 Objectives</strong> per quarter with <strong>2-5 Key Results</strong> each</li>
        <li>Measure <strong>outcomes, not tasks</strong></li>
        <li>Aim for <strong>70% achievement</strong> &mdash; if you hit 100%, you aimed too low</li>
        <li>Review <strong>weekly</strong>, score <strong>quarterly</strong></li>
        <li>OKRs drive change; KPIs track health &mdash; <strong>use both</strong></li>
      </ul>
    `;
