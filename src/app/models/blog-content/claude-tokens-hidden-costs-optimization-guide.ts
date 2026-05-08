export const CONTENT = `
      <p><strong>Short answer:</strong> Claude token cost is not just the message you type. In the raw Claude API, you pay for input tokens, output tokens, tool definitions, tool results, cache writes, cache reads, and thinking tokens when thinking is enabled. In Claude Code, there is extra project context on top: conversation history, CLAUDE.md, skills, tools, MCP context, file reads, and command output.</p>

      <p>This guide separates <strong>Claude API</strong>, <strong>Claude Code</strong>, and <strong>claude.ai</strong> so you can estimate cost correctly instead of blaming one mysterious "hidden prompt" for everything.</p>

      <img src="/images/blog/claude-token-cost-stack.svg" alt="Diagram showing Claude token cost layers across input context, tools, thinking tokens, and output tokens" loading="lazy" decoding="async" />

      <h2>Quick Takeaways</h2>

      <ul>
        <li><strong>API calls are stateless:</strong> your application sends the prompt, tools, and conversation history that you want Claude to see.</li>
        <li><strong>Claude Code is heavier than a simple API call:</strong> it carries coding context, project instructions, tool output, and session history.</li>
        <li><strong>Prompt caching saves money, not context:</strong> cached tokens still occupy the context window.</li>
        <li><strong>Thinking tokens are billed as output:</strong> Opus and Sonnet reasoning can be useful, but it is not free.</li>
        <li><strong>MCP behavior has changed:</strong> Claude Code now defers MCP tool definitions by default, so unused servers are still worth disabling, but the old "all schemas always load" claim is too broad.</li>
      </ul>

      <h2>What Is a Token?</h2>

      <p>A token is the unit of text a model processes. It is usually a word fragment, not a full word. Anthropic's pricing docs use the rough rule that 1 token is about 4 characters or 0.75 English words, but exact counts vary by model and content.</p>

      <pre><code># Approximate token counts
Hello                 ~1 token
Hello, world!         ~4 tokens
authentication        ~3 tokens
1 paragraph           ~50-100 tokens
1 page of prose       ~400-500 tokens
1,000 lines of code   ~3,000-5,000 tokens</code></pre>

      <p><strong>Opus 4.7 note:</strong> Anthropic says Claude Opus 4.7 uses a new tokenizer that may use up to about <strong>35% more tokens</strong> for the same fixed text compared with previous models. If you move a workflow from Opus 4.6 to Opus 4.7, re-run token counts before assuming the old budget still holds.</p>

      <h2>API vs Claude Code vs claude.ai</h2>

      <p>The biggest source of confusion is treating every Claude product as if it bills and behaves the same way. They do not.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Where Token Cost Comes From</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">Claude API</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">1</span>You control the request payload</div>
              <div class="vs-row"><span class="vs-row-icon">2</span>Tools and schemas count when sent</div>
              <div class="vs-row"><span class="vs-row-icon">3</span>Usage object shows token buckets</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#a855f7">
            <div class="vs-card-header" style="background:#a855f7">Claude Code</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">1</span>Loads coding session context</div>
              <div class="vs-row"><span class="vs-row-icon">2</span>CLAUDE.md and tool output add up</div>
              <div class="vs-row"><span class="vs-row-icon">3</span>/usage and /context reveal spend</div>
            </div>
          </div>
        </div>
      </div>

      <p><strong>claude.ai is different again:</strong> Free, Pro, Max, Team, and Enterprise plans are usage-plan products. They may expose usage limits, but the everyday consumer plan experience is not the same as directly paying the API invoice per million tokens. Keep API pricing examples separate from subscription-plan expectations.</p>

      <h2>The Claude Token Cost Formula</h2>

      <p>For API workloads, the simplest mental model is:</p>

      <pre><code>total_cost =
  uncached_input_tokens * input_price
+ cache_write_tokens    * cache_write_price
+ cache_read_tokens     * cache_read_price
+ output_tokens         * output_price
+ server_tool_charges   * tool_price</code></pre>

      <p>For Claude Code, add another layer: session context. File reads, command output, prior turns, subagent summaries, and project instructions can stay in the conversation and increase the size of later turns.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">A Request Grows Before Claude Answers</div>
        <div class="pipeline">
          <div class="pipeline-step" style="--i:0;background:#f97316">System / app instructions<span class="pipeline-step-sub">input</span></div>
          <div class="pipeline-arrow">-&gt;</div>
          <div class="pipeline-step" style="--i:1;background:#a855f7">Tools and MCP context<span class="pipeline-step-sub">input</span></div>
          <div class="pipeline-arrow">-&gt;</div>
          <div class="pipeline-step" style="--i:2;background:#ec4899">Conversation history<span class="pipeline-step-sub">input</span></div>
          <div class="pipeline-arrow">-&gt;</div>
          <div class="pipeline-step" style="--i:3;background:#3b82f6">Your latest message<span class="pipeline-step-sub">input</span></div>
          <div class="pipeline-arrow">-&gt;</div>
          <div class="pipeline-step" style="--i:4;background:#ef4444">Thinking + answer<span class="pipeline-step-sub">output</span></div>
        </div>
      </div>

      <h3>Three beginner-friendly cost examples</h3>

      <pre><code># 1) Typical Sonnet API call
Input:  12,000 tokens * $3  / 1,000,000 = $0.036
Output:    800 tokens * $15 / 1,000,000 = $0.012
Total: roughly $0.048

# 2) Cheap Haiku extraction job
Input:  100,000 tokens * $1 / 1,000,000 = $0.10
Output:   2,000 tokens * $5 / 1,000,000 = $0.01
Total: roughly $0.11

# 3) Opus reasoning request
Input:   80,000 tokens * $5  / 1,000,000 = $0.40
Output:  8,000 tokens * $25 / 1,000,000 = $0.20
Total: roughly $0.60</code></pre>

      <p>These examples are intentionally small and round. The point is to learn the shape: large input makes retrieval and coding sessions expensive, while long answers and thinking make output cost jump quickly.</p>

      <h2>Current Claude API Pricing</h2>

      <p><strong>Last reviewed: May 8, 2026.</strong> The official Claude API pricing page lists these headline rates. Always re-check the source before publishing a pricing-sensitive article because model pricing changes quickly.</p>

      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Input / MTok</th>
            <th>Output / MTok</th>
            <th>Context notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Claude Haiku 4.5</td>
            <td>$1.00</td>
            <td>$5.00</td>
            <td>Fast, cost-efficient workloads and smaller automations</td>
          </tr>
          <tr>
            <td>Claude Sonnet 4.6</td>
            <td>$3.00</td>
            <td>$15.00</td>
            <td>Strong default; includes 1M context at standard pricing</td>
          </tr>
          <tr>
            <td>Claude Opus 4.7</td>
            <td>$5.00</td>
            <td>$25.00</td>
            <td>Hard reasoning; includes 1M context at standard pricing</td>
          </tr>
        </tbody>
      </table>

      <pre><code># Prompt caching multipliers
5-minute cache write  = 1.25x base input price
1-hour cache write    = 2.00x base input price
Cache read            = 0.10x base input price

# Batch API
50% discount on input and output tokens for asynchronous bulk work</code></pre>

      <h3>Pricing modifiers beginners miss</h3>

      <ul>
        <li><strong>1M context:</strong> Claude Opus 4.7, Opus 4.6, and Sonnet 4.6 include the full 1M-token context window at standard pricing. A 900k-token request still costs far more than a 9k-token request because it contains more tokens, but it does not trigger a separate long-context premium for those models.</li>
        <li><strong>Data residency:</strong> on the first-party Claude API, US-only inference through <code>inference_geo</code> adds a 1.1x multiplier for Claude Opus 4.7, Opus 4.6, and newer models.</li>
        <li><strong>Third-party platforms:</strong> AWS Bedrock and Google Vertex AI regional or multi-region endpoint choices can add a 10% premium for newer Claude models. Do not copy first-party API pricing directly into a Bedrock or Vertex AI budget.</li>
        <li><strong>Fast mode:</strong> Opus 4.6 fast mode is a beta feature with 6x standard token pricing and is not available with the Batch API.</li>
      </ul>

      <p>Sources: <a href="https://platform.claude.com/docs/en/about-claude/pricing" target="_blank" rel="noopener">Claude API pricing</a>, <a href="https://platform.claude.com/docs/en/build-with-claude/context-windows" target="_blank" rel="noopener">context windows</a>, <a href="https://platform.claude.com/docs/en/build-with-claude/extended-thinking" target="_blank" rel="noopener">extended thinking</a>, <a href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching" target="_blank" rel="noopener">prompt caching</a>, <a href="https://code.claude.com/docs/en/costs" target="_blank" rel="noopener">Claude Code costs</a>, and <a href="https://platform.claude.com/docs/en/manage-claude/usage-cost-api" target="_blank" rel="noopener">Usage and Cost API</a>.</p>

      <h2>Hidden Cost 1: System and App Instructions</h2>

      <p>Every application has instructions that shape model behavior. In a raw API call, this is the system prompt and any messages you send. In Claude Code, the product also manages a coding-oriented environment and session state around your work.</p>

      <p>A precise number like <strong>14,328 tokens</strong> can be useful as a snapshot from one Claude Code session, but it should not be presented as a universal cost for every Claude API request. The right recommendation is: measure your actual session with <code>/context</code> or inspect your API usage fields.</p>

      <h2>Hidden Cost 2: CLAUDE.md, Skills, and Project Memory</h2>

      <p>Claude Code can load project instructions such as <code>CLAUDE.md</code>. That is helpful, but a long file becomes a repeated cost. Anthropic's current guidance is to keep the base file focused and move specialized workflow instructions into skills so they load on demand.</p>

      <pre><code># Better CLAUDE.md pattern
- Keep repo-wide rules only
- Link to docs instead of pasting long docs
- Move PR review, deployment, or database workflows into skills
- Keep examples short and delete stale notes

# Check impact
/context
/usage</code></pre>

      <h2>Hidden Cost 3: MCP and Tool Context</h2>

      <p>Old advice often says every MCP server injects every full schema into every request. That is no longer accurate enough. Current Claude Code docs say MCP tool definitions are <strong>deferred by default</strong>, meaning only tool names enter context until Claude uses a specific tool.</p>

      <p>The practical advice is still similar: disable unused MCP servers, prefer direct CLI tools such as <code>gh</code>, <code>aws</code>, or <code>gcloud</code> when they are more context-efficient, and run <code>/context</code> to see what is actually consuming space.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">MCP Context: Old Mental Model vs Current Guidance</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">Too Broad</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">x</span>All MCP schemas always load</div>
              <div class="vs-row"><span class="vs-row-icon">x</span>Every unused server has full cost</div>
              <div class="vs-row"><span class="vs-row-icon">x</span>One fixed token number fits all</div>
            </div>
          </div>
          <div class="vs-badge">NOW</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">Better Guidance</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">1</span>Definitions are deferred by default</div>
              <div class="vs-row"><span class="vs-row-icon">2</span>Tool calls and results still add context</div>
              <div class="vs-row"><span class="vs-row-icon">3</span>Measure with /context before optimizing</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Hidden Cost 4: Conversation History</h2>

      <p>LLM APIs are stateless at the request boundary. Your app or client sends the relevant conversation history again so Claude can continue. That means long sessions get more expensive because later turns include more accumulated context.</p>

      <ul>
        <li><strong>Turn 1:</strong> system instructions + user message + first answer.</li>
        <li><strong>Turn 15:</strong> all useful prior context plus the new message.</li>
        <li><strong>Long coding session:</strong> file reads, test output, error logs, and tool results can remain in the context until compacted or cleared.</li>
      </ul>

      <p>Use <code>/compact</code> after a meaningful milestone and <code>/clear</code> when switching to an unrelated task. Do not carry yesterday's debugging context into today's documentation task.</p>

      <h2>Hidden Cost 5: Thinking Tokens</h2>

      <p>With extended or adaptive thinking, Claude can spend tokens reasoning before producing the visible answer. Anthropic documents that those thinking tokens are billed as output tokens. On Opus 4.7, adaptive thinking is the supported thinking mode; manual fixed thinking budgets are no longer accepted for Opus 4.7.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Visible Output Is Not Always Billed Output</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">Direct Response</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">I</span>Input: 10,000 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">O</span>Visible output: 800 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">$</span>Billed output: 800 tokens</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">Adaptive Thinking</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">I</span>Input: 10,000 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">T</span>Thinking: 6,000 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">O</span>Visible output: 800 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">$</span>Billed output: 6,800 tokens</div>
            </div>
          </div>
        </div>
      </div>

      <p>If reasoning is not needed, lower the effort level or disable thinking for simple transformations, formatting tasks, or small edits. If reasoning quality matters, keep it on and budget for it explicitly.</p>

      <h2>Hidden Cost 6: Tool Results</h2>

      <p>Tool calls are not just "actions." They create text that may enter the conversation. A 400-line stack trace, a full file read, or a large web fetch can add thousands of input tokens to later turns.</p>

      <ul>
        <li>Read exact file ranges instead of whole files.</li>
        <li>Filter logs before returning them to Claude.</li>
        <li>Use grep-like commands to locate relevant lines before reading full context.</li>
        <li>Summarize long command output before continuing a session.</li>
      </ul>

      <h2>Hidden Cost 7: API Tool Use and Server Tools</h2>

      <p>In the Claude API, tools are part of the request. Tool names, descriptions, JSON schemas, <code>tool_use</code> blocks, and <code>tool_result</code> blocks can all add input tokens. Anthropic also includes a small tool-use system prompt when tools are enabled. For Claude 4.x models, the pricing docs list a few hundred extra tool-use system prompt tokens depending on tool choice, before counting your own tool schemas and results.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Tool Use Adds More Than the User Prompt</div>
        <div class="pipeline">
          <div class="pipeline-step" style="--i:0;background:#3b82f6">Tool schema<span class="pipeline-step-sub">input</span></div>
          <div class="pipeline-arrow">-&gt;</div>
          <div class="pipeline-step" style="--i:1;background:#a855f7">Tool-use prompt<span class="pipeline-step-sub">input</span></div>
          <div class="pipeline-arrow">-&gt;</div>
          <div class="pipeline-step" style="--i:2;background:#f97316">Tool result<span class="pipeline-step-sub">future input</span></div>
          <div class="pipeline-arrow">-&gt;</div>
          <div class="pipeline-step" style="--i:3;background:#ef4444">Server tool fee<span class="pipeline-step-sub">extra cost</span></div>
        </div>
      </div>

      <ul>
        <li><strong>Client-side tools:</strong> usually cost normal input and output tokens, including schemas and tool results.</li>
        <li><strong>Server-side tools:</strong> can add usage-based charges on top of tokens, such as web search requests or code execution time.</li>
        <li><strong>Bash and editor tools:</strong> can add fixed input-token overhead plus command output, errors, and file contents.</li>
        <li><strong>Beginner rule:</strong> do not send a giant universal tool list to every request. Send the smallest useful tool set for that workflow.</li>
      </ul>

      <h2>Hidden Cost 8: Claude Code Background Work and Subagents</h2>

      <p>Claude Code is not just a single chat request. It can use background tokens for features such as summaries and model-assisted session management. If you use subagents or agent teams, each agent may have its own context window. That can be excellent for parallel work, but it also means token usage scales with the number of active agents and the amount of context each one loads.</p>

      <ul>
        <li><strong>Subagents are useful:</strong> delegate verbose searches, test runs, and log analysis so only a summary comes back to your main context.</li>
        <li><strong>Subagents are not free:</strong> they still spend tokens in their own context window.</li>
        <li><strong>Agent teams need budget discipline:</strong> keep team size small, keep prompts focused, and stop agents when the work is done.</li>
        <li><strong>Auto-compaction helps:</strong> it can summarize long conversations when context gets large, but you should still use <code>/compact</code> and <code>/clear</code> intentionally.</li>
      </ul>

      <h2>Prompt Caching Break-Even</h2>

      <p>Prompt caching is usually the highest-leverage API optimization when your prompt has a repeated prefix: tool definitions, system instructions, large documents, or a stable conversation prefix.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Prompt Caching Cost Shape</div>
        <div class="bar-chart">
          <div class="bar-chart-item">
            <div class="bar-chart-bar bar-red bar-h-90" data-value="100%"></div>
            <div class="bar-chart-label">No cache</div>
          </div>
          <div class="bar-chart-item">
            <div class="bar-chart-bar bar-orange bar-h-75" data-value="125%"></div>
            <div class="bar-chart-label">Write once</div>
          </div>
          <div class="bar-chart-item">
            <div class="bar-chart-bar bar-green bar-h-10" data-value="10%"></div>
            <div class="bar-chart-label">Cache read</div>
          </div>
          <div class="bar-chart-item">
            <div class="bar-chart-bar bar-blue bar-h-35" data-value="50%"></div>
            <div class="bar-chart-label">Batch</div>
          </div>
        </div>
      </div>

      <pre><code># Example: 100,000-token reusable prefix on Opus 4.7
Normal input cost:       100,000 * $5 / 1,000,000 = $0.50
5-minute cache write:    100,000 * $6.25 / 1,000,000 = $0.625
Cache read after write:  100,000 * $0.50 / 1,000,000 = $0.05

# Break-even
One cache hit after a 5-minute write is usually enough to beat paying full price twice.</code></pre>

      <p><strong>Important:</strong> cached tokens still count toward the context window. Caching reduces price and latency; it does not make the prompt smaller.</p>

      <h2>How to Reduce Claude Token Spend</h2>

      <h3>1. Use the right model</h3>

      <ul>
        <li><strong>Haiku:</strong> extraction, classification, routing, simple rewriting, structured transformations.</li>
        <li><strong>Sonnet:</strong> most coding, analysis, planning, documentation, and agentic workflows.</li>
        <li><strong>Opus:</strong> high-stakes reasoning, hard architecture decisions, difficult debugging, long-horizon agent work.</li>
      </ul>

      <h3>2. Keep Claude Code context clean</h3>

      <ul>
        <li>Use <code>/usage</code> to see session token and cost estimates.</li>
        <li>Use <code>/context</code> to inspect what is consuming the context window.</li>
        <li>Use <code>/compact</code> after finishing a subtask.</li>
        <li>Use <code>/clear</code> before switching to unrelated work.</li>
      </ul>

      <h3>3. Reduce MCP and tool overhead</h3>

      <ul>
        <li>Disable MCP servers you are not actively using.</li>
        <li>Prefer CLI tools when they return a smaller answer than an MCP integration.</li>
        <li>Keep tool output focused: file ranges, filtered logs, and summarized results.</li>
      </ul>

      <h3>4. Cache repeated API prefixes</h3>

      <pre><code>response = client.messages.create(
    model="claude-opus-4-7",
    system=[{
        "type": "text",
        "text": stable_system_prompt,
        "cache_control": {"type": "ephemeral"}
    }],
    messages=messages
)</code></pre>

      <h3>5. Use batch processing for non-urgent bulk work</h3>

      <p>If the workload can wait, such as summarizing thousands of tickets, generating descriptions, or processing a large dataset, the Batch API can reduce both input and output token cost by 50%.</p>

      <h2>Real Cost Example</h2>

      <p>Here is a simplified 30-turn Claude Code-style session using Opus 4.7. Exact numbers vary, but the shape is what matters.</p>

      <pre><code># Unoptimized 30-turn coding session
Project/context input:      400,000 tokens
Conversation history:     1,300,000 tokens
Tool results:               250,000 tokens
Fresh user messages:         30,000 tokens
Thinking tokens:             60,000 output tokens
Visible answer output:       30,000 output tokens

Input cost:  1,980,000 * $5  / 1,000,000 = $9.90
Output cost:    90,000 * $25 / 1,000,000 = $2.25
Total: roughly $12.15

# Optimized shape
- repeated context mostly cache reads
- shorter CLAUDE.md
- fewer broad file reads
- disabled unused MCP servers
- compacted after milestones

Typical result: 40-70% lower spend for the same work.</code></pre>

      <h2>Monitoring Token Usage</h2>

      <p>Cost control only works when you measure at the right level. For one API request, use the response <code>usage</code> object. Before sending a large request, use the Token Counting API. For teams, use the Admin Usage and Cost APIs so you can group spend by model, workspace, API key, service tier, data residency, fast mode, and server-side tool usage.</p>

      <p>Inside Claude Code, <code>/usage</code> is useful for the current session, but the dollar figure is an estimate computed from token counts. For authoritative API billing, use the Claude Console. For subscription users, plan usage bars are more relevant than raw API invoice math.</p>

      <pre><code># Claude Code
/usage     # current session usage and estimated cost
/context   # context window breakdown
/compact   # summarize and shrink session history
/clear     # start fresh for unrelated work

# Count before sending a big API request
client.messages.count_tokens(
  model="claude-opus-4-7",
  messages=[{"role": "user", "content": long_prompt}]
)

# API response usage object
{
  "usage": {
    "input_tokens": 15234,
    "output_tokens": 892,
    "cache_creation_input_tokens": 14328,
    "cache_read_input_tokens": 42000
  }
}</code></pre>

      <h3>What to monitor on a real product</h3>

      <ul>
        <li><strong>Cost per feature:</strong> chat, summarization, code generation, support bot, document analysis.</li>
        <li><strong>Cost per customer or workspace:</strong> find out who drives spend before adding global limits.</li>
        <li><strong>Cache hit ratio:</strong> high repeated prefixes should produce cache reads, not full input charges every time.</li>
        <li><strong>Model mix:</strong> track when Opus is used, and confirm it is reserved for work that needs it.</li>
        <li><strong>Tool and server-tool usage:</strong> web search, code execution, large file reads, and big tool results can hide inside aggregate spend.</li>
      </ul>

      <h2>FAQ</h2>

      <h3>Are Claude thinking tokens billed?</h3>
      <p>Yes. Anthropic documents that thinking tokens are billed as output tokens. If thinking is summarized or omitted from the visible response, the full thinking process can still be billed.</p>

      <h3>Does prompt caching reduce context size?</h3>
      <p>No. Prompt caching reduces price and latency for repeated prompt prefixes. Cached tokens still count toward the context window.</p>

      <h3>Why does Claude Code use more tokens than a simple API call?</h3>
      <p>Claude Code is an agentic coding environment. It may include project instructions, conversation history, tool results, file reads, command output, skills, and MCP/tool context. A tiny user message can ride on top of a much larger coding session context.</p>

      <h3>Do MCP servers always load every full schema?</h3>
      <p>Not in current Claude Code guidance. MCP tool definitions are deferred by default, but tool names, selected tools, tool calls, and tool results can still affect context. Disable unused servers and measure with <code>/context</code>.</p>

      <h3>Does 1M context always mean premium long-context pricing?</h3>
      <p>No. Current Claude API pricing says Claude Opus 4.7, Opus 4.6, and Sonnet 4.6 include the full 1M-token context window at standard pricing. You still pay for every token, so a huge request is expensive, but these models do not add a separate long-context premium for using the 1M window.</p>

      <h3>Is the Claude Code <code>/usage</code> dollar amount my final bill?</h3>
      <p>Not necessarily. Claude Code reports useful session token and estimated cost information, but the dollar figure is computed locally and may differ from your actual bill. For API billing, use the Claude Console. For Pro or Max subscription users, included plan usage is not the same as a per-token API invoice.</p>

      <h3>Can data residency, fast mode, or server tools change the price?</h3>
      <p>Yes. US-only inference can add a 1.1x token multiplier for supported models, Opus 4.6 fast mode is priced at 6x standard token rates, and server-side tools such as web search or code execution can add usage-based charges beyond normal token cost.</p>

      <h3>What is the fastest way to cut Claude token cost?</h3>
      <p>Use Sonnet for default coding work, cache repeated API prefixes, compact long Claude Code sessions, trim CLAUDE.md, disable unused MCP servers, monitor tool usage, and avoid dumping full files or full logs into context.</p>

      <h2>Final Checklist</h2>

      <ul>
        <li>Separate API pricing from Claude Code and claude.ai subscription behavior.</li>
        <li>Use current model pricing and add a "last reviewed" note near pricing tables.</li>
        <li>Measure with <code>/usage</code>, <code>/context</code>, and API usage fields.</li>
        <li>Use the Token Counting API before sending large prompts or documents.</li>
        <li>Use the Admin Usage and Cost APIs when you need team-level cost attribution.</li>
        <li>Use prompt caching for stable prefixes, but remember it does not reduce context size.</li>
        <li>Account for data residency, regional endpoints, fast mode, Batch API, and server-side tool charges.</li>
        <li>Move specialized CLAUDE.md instructions into skills.</li>
        <li>Prefer focused tool output over broad file reads and unfiltered logs.</li>
        <li>Use adaptive thinking only when the task needs deeper reasoning.</li>
        <li>Use Batch API for non-urgent bulk processing.</li>
      </ul>
    `;
