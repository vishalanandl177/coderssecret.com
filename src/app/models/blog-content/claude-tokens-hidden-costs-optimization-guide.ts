export const CONTENT = `
      <p>Every time you send a message to Claude &mdash; whether through the API, Claude Code, or claude.ai &mdash; you are paying for more tokens than you think. The message you type might be 50 tokens, but the actual API call can be <strong>14,000+ tokens</strong> before your words even reach the model.</p>

      <p>This guide pulls back the curtain on <strong>every hidden token cost</strong>, explains how the billing actually works, and gives you concrete techniques to cut your spend by 50-90%.</p>

      <h2>What Is a Token?</h2>

      <p>A token is the smallest unit of text that Claude processes. It is <strong>not</strong> a word &mdash; it is a subword fragment, typically 3-4 characters of English text.</p>

      <pre><code># Approximate token counts:
"Hello"              = 1 token
"Hello, world!"      = 4 tokens
"authentication"     = 3 tokens
1 paragraph          = ~50-100 tokens
1 page of text       = ~400-500 tokens
1,000 lines of code  = ~3,000-5,000 tokens</code></pre>

      <p><strong>Important:</strong> Claude Opus 4.7 ships with a <strong>new tokenizer</strong> that can produce up to <strong>35% more tokens</strong> for the same input text compared to older models. So switching to Opus 4.7 from 4.6 can increase your token count even if your text is identical.</p>

      <h2>The Hidden Costs: What You Don't See</h2>

      <p>Here is the part most developers miss. When you send a message, here is what <strong>actually</strong> gets sent to the model:</p>

      <div class="pipeline-diagram">
        <div class="pipeline-title">Anatomy of a Single API Call</div>
        <div class="pipeline-steps">
          <div class="pipeline-step" style="border-color:#ef4444">System Prompt<br><strong>~14,000 tokens</strong><br>Always present</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#f97316">Tool Definitions<br><strong>~2,000-8,000</strong><br>Per MCP server</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#a855f7">Conversation<br><strong>Variable</strong><br>Grows each turn</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#3b82f6">Your Message<br><strong>~50-500</strong><br>What you typed</div>
        </div>
      </div>

      <h2>1. System Prompt (~14,328 tokens)</h2>

      <p>Every single API call includes a system prompt that contains Claude's internal instructions, safety guidelines, behavioral rules, and capability definitions. In Claude Code, this is approximately <strong>14,328 tokens</strong> &mdash; sent on <strong>every single turn</strong>.</p>

      <p>This means ~16.5% of your 200K context window is consumed before you even type anything. Out of 200K tokens, only <strong>~186K is available</strong> for your actual conversation.</p>

      <h2>2. CLAUDE.md and Memory Files (~1,000-5,000+ tokens)</h2>

      <p>If you use Claude Code, your <code>CLAUDE.md</code> file is loaded into <strong>every API call</strong>. A large CLAUDE.md with project conventions, architecture notes, and custom instructions can easily consume 2,000-5,000 tokens &mdash; on every single message.</p>

      <pre><code># Check your CLAUDE.md token impact:
# In Claude Code, run:
/context

# This shows exactly how many tokens each component consumes:
# System prompt:  14,328 tokens
# CLAUDE.md:       2,847 tokens
# Memory files:    1,203 tokens
# MCP tools:       4,521 tokens
# Conversation:   23,456 tokens
# Total:          46,355 tokens</code></pre>

      <h2>3. Tool Definitions (~2,000-8,000+ tokens per MCP server)</h2>

      <p>Every connected MCP server registers its <strong>full tool definitions and JSON schemas</strong> into the context window &mdash; on <strong>every request</strong>, even when the tools are not being used.</p>

      <ul>
        <li>A GitHub MCP server: ~3,000-4,000 tokens of tool definitions</li>
        <li>A database MCP server: ~2,000-3,000 tokens</li>
        <li>Multiple MCP servers stacked: can consume <strong>10,000-15,000+ tokens</strong></li>
      </ul>

      <p>These load whether you use them or not. Two Chrome MCP servers can consume <strong>31,700 tokens</strong> just from their definitions.</p>

      <h2>4. Conversation History (grows every turn)</h2>

      <p>Claude sends the <strong>entire conversation history</strong> on every API call. It does not just send your latest message &mdash; it sends everything:</p>

      <ul>
        <li><strong>Turn 1:</strong> ~15K tokens (system + your message)</li>
        <li><strong>Turn 15:</strong> ~100K tokens (system + 15 turns of back-and-forth)</li>
        <li><strong>Turn 30:</strong> ~167K tokens (approaching the limit)</li>
        <li><strong>Turn 35+:</strong> Compaction fires &mdash; conversation is summarized to free space</li>
      </ul>

      <p>Every message you send, every response Claude gives, every tool result &mdash; it all accumulates and gets resent on the next call.</p>

      <h2>5. Thinking Tokens (billed as output)</h2>

      <p>When extended thinking is enabled, Claude generates internal reasoning before its visible response. These <strong>thinking tokens are billed as output tokens</strong> at the output token rate &mdash; which is typically 3-5x more expensive than input tokens.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Thinking Token Impact on Cost</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">Without Extended Thinking</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4AC;</span>Input: 1,000 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4DD;</span>Output: 500 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Total output billed: 500</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">With Extended Thinking</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4AC;</span>Input: 1,000 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F9E0;</span>Thinking: 3,000 tokens (hidden)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4DD;</span>Output: 500 tokens</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Total output billed: 3,500</div>
            </div>
          </div>
        </div>
      </div>

      <p>You may see a 500-token response but get billed for 3,500 output tokens because 3,000 went to internal reasoning you never see.</p>

      <h2>6. Tool Use Overhead</h2>

      <p>When Claude calls tools (file reads, web searches, bash commands), each tool call and result adds to the conversation:</p>

      <ul>
        <li><strong>Tool call tokens:</strong> The JSON structure of the function call (~50-200 tokens per call)</li>
        <li><strong>Tool result tokens:</strong> The full output returned &mdash; a file read can be thousands of tokens</li>
        <li><strong>All tool results persist</strong> in conversation history and get resent on every subsequent turn</li>
      </ul>

      <p>Reading 10 files early in a session can add 30,000+ tokens to every subsequent API call.</p>

      <h2>Current Pricing (April 2026)</h2>

      <pre><code># Per 1 million tokens:
                    Input     Output    Context Window
Claude Haiku 4.5    $1.00     $5.00     200K tokens
Claude Sonnet 4.6   $3.00    $15.00     1M tokens
Claude Opus 4.7     $5.00    $25.00     1M tokens

# Prompt Caching discounts:
Cache Write (5-min):    1.25x base input price
Cache Write (1-hour):   2.00x base input price
Cache Read:             0.10x base input price (90% savings!)

# Batch API: 50% discount on both input and output
# Extended thinking: billed at standard output rate</code></pre>

      <h2>How to Minimize Token Usage</h2>

      <h2>1. Use Prompt Caching (saves 90% on repeated input)</h2>

      <p>The system prompt, tool definitions, and the first part of your conversation are the same on every call. With prompt caching, Claude stores these and charges only <strong>10% of the input price</strong> on subsequent reads.</p>

      <pre><code># Without caching: 100-turn Opus session = $50-100 in input tokens
# With caching:    same session = $10-19

# Enable in API:
response = client.messages.create(
    model="claude-opus-4-7",
    system=[{
        "type": "text",
        "text": your_system_prompt,
        "cache_control": {"type": "ephemeral"}  # Cache this!
    }],
    messages=messages
)</code></pre>

      <p><strong>Key insight:</strong> Cached tokens still count toward your context window limit. Caching saves money, not space.</p>

      <h2>2. Trim Your CLAUDE.md</h2>

      <p>Your CLAUDE.md loads on <strong>every single message</strong>. Every extra line costs tokens on every turn.</p>

      <ul>
        <li>Move task-specific instructions to <strong>Skills</strong> (load on-demand, not every message)</li>
        <li>Remove examples, changelogs, and verbose explanations</li>
        <li>Keep it under 500 tokens if possible</li>
        <li>Use the <code>/context</code> command to see your CLAUDE.md's actual token cost</li>
      </ul>

      <h2>3. Disconnect Unused MCP Servers</h2>

      <p>Every MCP server loads its full tool schemas on every request. If you are not using a server, disconnect it.</p>

      <pre><code># Check MCP token impact:
/context

# If you see:
# MCP tools: 12,847 tokens
# ...and you're only using 1 of 4 connected servers,
# disconnect the other 3 to recover ~9,000 tokens per call.

# Experimental flag to reduce MCP overhead:
ENABLE_EXPERIMENTAL_MCP_CLI=true
# This loads MCP tools via CLI wrapper instead of full schemas
# Can recover 32% of context window</code></pre>

      <h2>4. Use /compact Proactively</h2>

      <p>Do not wait for automatic compaction at 167K tokens. Use <code>/compact</code> manually when the conversation starts feeling bloated.</p>

      <ul>
        <li>After completing a sub-task, run <code>/compact</code> to summarize and free space</li>
        <li>Start new sessions for unrelated tasks instead of continuing long conversations</li>
        <li>Long sessions are exponentially more expensive because the full history is resent every turn</li>
      </ul>

      <h2>5. Choose the Right Model</h2>

      <ul>
        <li><strong>Use Haiku ($1/$5)</strong> for: classification, extraction, routing, simple Q&A, formatting</li>
        <li><strong>Use Sonnet ($3/$15)</strong> for: most coding tasks, writing, analysis, standard workflows</li>
        <li><strong>Use Opus ($5/$25)</strong> for: complex multi-step reasoning, architecture decisions, hard bugs</li>
      </ul>

      <p>Most developers default to Opus for everything. In reality, <strong>80% of tasks work fine with Sonnet</strong> at 40% of the cost.</p>

      <h2>6. Use the Batch API for Bulk Work</h2>

      <p>If you are processing many items (code review across PRs, content generation, data extraction), the Batch API gives a <strong>50% discount</strong> on both input and output tokens. Results return within 24 hours.</p>

      <h2>7. Minimize Tool Results in Context</h2>

      <ul>
        <li>Read specific file ranges (<code>lines 1-50</code>) instead of entire files</li>
        <li>Use <code>grep</code> to find what you need instead of reading multiple files</li>
        <li>Avoid reading large files early in a session &mdash; their content persists in every subsequent call</li>
        <li>Prefer targeted searches over broad exploration</li>
      </ul>

      <h2>8. Disable Extended Thinking When Not Needed</h2>

      <p>Extended thinking adds thousands of output tokens (billed at the expensive output rate) to every response. Only enable it for tasks that genuinely need deep reasoning:</p>

      <ul>
        <li><strong>Keep thinking on:</strong> complex debugging, architecture decisions, math, multi-step planning</li>
        <li><strong>Turn thinking off:</strong> simple edits, formatting, Q&A, file generation, boilerplate code</li>
      </ul>

      <h2>The Real Cost of a Claude Code Session</h2>

      <p>Here is a realistic breakdown of a 30-turn Claude Code session using Opus:</p>

      <pre><code># Without optimization:
System prompt:       14,328 tokens x 30 turns = 429,840 input tokens
CLAUDE.md:            3,000 tokens x 30 turns =  90,000 input tokens
MCP definitions:      6,000 tokens x 30 turns = 180,000 input tokens
Conversation history: avg 50,000 x 30 turns  = 1,500,000 input tokens
Tool results:         avg 5,000 x 30 turns    = 150,000 input tokens
Thinking tokens:      avg 2,000 x 30 turns    = 60,000 OUTPUT tokens
Visible output:       avg 1,000 x 30 turns    = 30,000 OUTPUT tokens
─────────────────────────────────────────────
Total input:  ~2,350,000 tokens x $5/1M  = $11.75
Total output:    ~90,000 tokens x $25/1M =  $2.25
TOTAL: ~$14.00 for 30 turns

# With optimization (caching + trimmed CLAUDE.md + fewer MCP):
Cached input (90% discount): ~$1.50
Fresh input:                 ~$2.00
Output:                      ~$2.25
TOTAL: ~$5.75 for 30 turns (59% savings)</code></pre>

      <h2>Monitoring Your Token Usage</h2>

      <pre><code># In Claude Code:
/context              # See current token breakdown
/cost                 # See session cost so far

# In API responses, check the usage object:
{
  "usage": {
    "input_tokens": 15234,
    "output_tokens": 892,
    "cache_creation_input_tokens": 14328,
    "cache_read_input_tokens": 0
  }
}

# cache_creation_input_tokens: tokens used to CREATE a cache entry (1.25x cost)
# cache_read_input_tokens: tokens READ from cache (0.1x cost - the savings!)</code></pre>

      <h2>Summary: The Complete Token Transparency Checklist</h2>

      <ul>
        <li><strong>System prompt:</strong> ~14,328 tokens on every call (invisible, unavoidable)</li>
        <li><strong>CLAUDE.md:</strong> Loaded every call &mdash; keep it short, move details to Skills</li>
        <li><strong>MCP tool schemas:</strong> Every connected server loads full definitions every call &mdash; disconnect unused ones</li>
        <li><strong>Conversation history:</strong> Entire history resent every turn &mdash; use /compact, start new sessions</li>
        <li><strong>Tool results:</strong> File reads, search results persist forever &mdash; read selectively</li>
        <li><strong>Thinking tokens:</strong> Billed as output (3-5x more expensive) &mdash; disable when not needed</li>
        <li><strong>Opus 4.7 tokenizer:</strong> Produces up to 35% more tokens for same text vs older models</li>
        <li><strong>Caching:</strong> Saves 90% on repeated input but does NOT free context window space</li>
        <li><strong>Batch API:</strong> 50% discount for non-urgent bulk processing</li>
        <li><strong>Model selection:</strong> 80% of tasks work fine with Sonnet at 40% the cost of Opus</li>
      </ul>
    `;
