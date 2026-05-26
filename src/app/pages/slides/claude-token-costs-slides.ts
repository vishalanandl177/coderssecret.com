import { Component, inject } from '@angular/core';
import { SlidePlayerComponent, SlideData } from '../../components/slide-player/slide-player';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-claude-token-costs-slides',
  standalone: true,
  imports: [SlidePlayerComponent],
  template: `
    <app-slide-player
      [slides]="slides"
      deckTitle="Claude Token Costs"
      backUrl="/blog/claude-tokens-hidden-costs-optimization-guide" />
  `,
})
export class ClaudeTokenCostsSlidesComponent {
  private seo = inject(SeoService);

  slides: SlideData[] = [
    {
      type: 'title',
      title: 'Claude Token Costs Explained',
      subtitle: 'Pricing, prompt caching, Claude Code context, MCP overhead, thinking tokens, and practical cost control.',
      tags: ['Claude API', 'Claude Code', 'Prompt Caching', 'MCP'],
      narration:
        'Welcome. In this slide walkthrough, we are going to make Claude token cost feel concrete. Not mystical, not hidden behind vague billing language, but something you can actually estimate and optimize. We will separate the raw Claude API from Claude Code and claude.ai, then walk through pricing, context growth, prompt caching, MCP, thinking tokens, and the habits that keep cost under control.',
    },
    {
      type: 'content',
      eyebrow: '01 / Mental model',
      title: 'Your message is only one layer',
      body: 'A 50-token prompt can ride on top of a much larger request context.',
      bullets: [
        'Input tokens: instructions, tools, history, files, and your prompt',
        'Output tokens: visible answer plus thinking tokens when enabled',
        'Cache writes and cache reads have separate prices',
        'Server-side tools can add usage-based charges',
      ],
      narration:
        'The first mental model is simple: your message is only one layer. When you send a request, the model may also receive system instructions, tool schemas, prior conversation, selected files, command output, and other context. Then on the way out, you pay for generated output. If thinking is enabled, the thinking process is billed as output as well.',
    },
    {
      type: 'grid',
      eyebrow: '02 / Product split',
      title: 'Do not mix these three products',
      body: 'Claude API, Claude Code, and claude.ai feel related, but the cost story is different.',
      items: [
        { title: 'Claude API', desc: 'You build the request payload and pay by token usage plus tool charges.' },
        { title: 'Claude Code', desc: 'A coding agent session adds project context, tool output, CLAUDE.md, skills, and history.' },
        { title: 'claude.ai', desc: 'A subscription product with plan limits. Do not explain it as a raw API invoice.' },
        { title: 'The mistake', desc: 'Claiming one Claude Code token snapshot applies to every Claude API call.' },
      ],
      narration:
        'The biggest accuracy trap is mixing product surfaces. The raw API is your request payload. Claude Code is an agentic coding environment with much more session context. And claude.ai is a subscription product with usage limits. If you say every API call always has a giant Claude Code system prompt, readers who know the API will immediately lose trust.',
    },
    {
      type: 'code',
      eyebrow: '03 / Formula',
      title: 'The cost formula',
      body: 'Most API bills reduce to five buckets.',
      code: `total_cost =
  uncached_input_tokens * input_price
+ cache_write_tokens    * cache_write_price
+ cache_read_tokens     * cache_read_price
+ output_tokens         * output_price
+ server_tool_charges   * tool_price`,
      lang: 'formula',
      narration:
        'For API workloads, this formula gets you most of the way there. Uncached input is the normal prompt cost. Cache writes are slightly more expensive than normal input because you are storing the reusable prefix. Cache reads are much cheaper. Output tokens use the output rate. And server-side tools, such as web search, can add their own usage charge.',
    },
    {
      type: 'grid',
      eyebrow: '04 / Pricing',
      title: 'Current headline pricing',
      body: 'Use this as the April 2026 snapshot, and re-check official pricing before publishing.',
      items: [
        { title: 'Haiku 4.5', desc: '$1 input / $5 output per million tokens. Great for routing, extraction, and simple work.' },
        { title: 'Sonnet 4.6', desc: '$3 input / $15 output per million tokens. Strong default for most coding and analysis.' },
        { title: 'Opus 4.7', desc: '$5 input / $25 output per million tokens. Reserve for complex reasoning and hard problems.' },
        { title: 'Batch API', desc: '50 percent discount on input and output for asynchronous bulk workloads.' },
      ],
      narration:
        'Here is the pricing snapshot to remember. Haiku is the cheapest current choice for simple tasks. Sonnet is the workhorse. Opus is still expensive enough that you should use it intentionally. Batch processing matters when the job can wait, because it can cut both input and output token cost in half.',
    },
    {
      type: 'content',
      eyebrow: '05 / Opus 4.7',
      title: 'Tokenizer changes can move your budget',
      body: 'Opus 4.7 may use up to about 35 percent more tokens for the same fixed text than previous models.',
      bullets: [
        'Do not reuse old token budgets blindly',
        'Run token counting on real prompts after migration',
        'Leave headroom for compaction and max output',
        'Measure by workload, not by vibes',
      ],
      narration:
        'Opus four point seven has a new tokenizer. Anthropic documents that the same fixed text may use up to about thirty five percent more tokens than previous models. This does not mean every prompt costs thirty five percent more, but it does mean migrations need measurement. Recount real prompts and leave room for edge cases.',
    },
    {
      type: 'image',
      eyebrow: '06 / Visual stack',
      title: 'The request has layers',
      caption: 'Claude cost is a stack: input context, tools, session history, thinking, and visible output.',
      src: '/images/blog/claude-token-cost-stack.svg',
      narration:
        'This picture is the whole article in one frame. Input context builds up from instructions, tools, session history, files, and your latest prompt. Then output cost comes from the answer and, when enabled, thinking. Prompt caching can make repeated input cheaper, but it does not remove those tokens from the context window.',
    },
    {
      type: 'content',
      eyebrow: '07 / Claude Code',
      title: 'Claude Code context is where surprises happen',
      body: 'Claude Code is not a tiny one-message API call. It is a running coding session.',
      bullets: [
        'CLAUDE.md can load project-wide instructions',
        'Tool output can stay in the conversation',
        'File reads and logs can enlarge future turns',
        'Use /usage and /context before guessing',
      ],
      narration:
        'Claude Code feels like chatting, but underneath it is a coding session with tools and context. Project instructions, command output, file reads, tool results, and conversation history can all affect later turns. That is why a tiny follow-up like fix it can still be expensive in a long session.',
    },
    {
      type: 'content',
      eyebrow: '08 / CLAUDE.md',
      title: 'Keep base instructions small',
      body: 'Every persistent instruction should earn its place.',
      bullets: [
        'Keep repo-wide rules in CLAUDE.md',
        'Move workflow-specific guidance into skills',
        'Link to long docs instead of pasting them',
        'Delete stale examples and duplicate conventions',
      ],
      narration:
        'CLAUDE dot md is useful, but it is easy to turn it into a junk drawer. Keep durable repo-wide rules there. Move specialized guidance, such as release playbooks or PR review rules, into skills or linked docs. The goal is not to starve Claude of context. The goal is to load the right context at the right time.',
    },
    {
      type: 'grid',
      eyebrow: '09 / MCP',
      title: 'MCP guidance changed',
      body: 'The old blanket statement that every schema always loads is too broad now.',
      items: [
        { title: 'Current default', desc: 'Claude Code defers MCP tool definitions by default.' },
        { title: 'Still matters', desc: 'Tool names, selected tools, calls, and results can still consume context.' },
        { title: 'Measure first', desc: 'Use /context to inspect what is actually loaded.' },
        { title: 'Optimize calmly', desc: 'Disable unused servers and prefer CLI tools when they are lighter.' },
      ],
      narration:
        'MCP is a good example of why technical articles need revision. Old advice said every connected MCP server always injected every full schema. Current Claude Code guidance says definitions are deferred by default. That does not make MCP free. It means the advice should be more precise: measure, disable unused servers, and keep tool results focused.',
    },
    {
      type: 'content',
      eyebrow: '10 / History',
      title: 'Long sessions compound',
      body: 'Later turns can include more history than earlier turns.',
      bullets: [
        'Conversation history is resent so the model can continue',
        'Tool results can become repeated input',
        'Old debugging context can pollute unrelated tasks',
        'Compact after milestones; clear between unrelated work',
      ],
      narration:
        'Long sessions become expensive because history accumulates. This is not mysterious; it is how context-based models continue a conversation. But in coding sessions, history includes more than normal chat. It can include files, logs, stack traces, diffs, and tool output. Compact after milestones and clear when switching topics.',
    },
    {
      type: 'content',
      eyebrow: '11 / Thinking',
      title: 'Thinking tokens are output tokens',
      body: 'Thinking can improve reasoning, but it is not free.',
      bullets: [
        'Adaptive thinking is the Opus 4.7 path',
        'Thinking may be summarized or omitted visually',
        'The full thinking process can still be billed',
        'Lower effort or disable thinking for simple work',
      ],
      narration:
        'Thinking is a quality and cost trade-off. It can help with architecture, debugging, planning, math, and multi-step reasoning. But the tokens used for thinking are billed as output. On Opus four point seven, adaptive thinking is the path to use. For simple tasks, lower effort or disable thinking so you are not paying for reasoning you do not need.',
    },
    {
      type: 'code',
      eyebrow: '12 / Prompt caching',
      title: 'Caching saves price, not space',
      body: 'A cache read is cheap, but cached tokens still count toward context.',
      code: `# 100k-token reusable prefix on Opus 4.7
Normal input:
100,000 * $5.00 / 1,000,000 = $0.50

5-minute cache write:
100,000 * $6.25 / 1,000,000 = $0.625

Cache read:
100,000 * $0.50 / 1,000,000 = $0.05`,
      lang: 'cost example',
      narration:
        'Prompt caching is one of the strongest optimizations for repeated prefixes. You pay a little more to write the cache, then much less to read it. But be careful with the mental model. Caching reduces price and often latency. It does not make the prompt smaller. The cached tokens still count toward the context window.',
    },
    {
      type: 'code',
      eyebrow: '13 / API monitoring',
      title: 'Read the usage object',
      body: 'The API tells you which token buckets were used.',
      code: `{
  "usage": {
    "input_tokens": 15234,
    "output_tokens": 892,
    "cache_creation_input_tokens": 14328,
    "cache_read_input_tokens": 42000
  }
}`,
      lang: 'json',
      narration:
        'When you build with the API, the usage object is your friend. It separates normal input, output, cache creation, and cache reads. If you are serious about cost control, log these fields per feature, per customer, or per job type. Aggregates hide the actual problem.',
    },
    {
      type: 'code',
      eyebrow: '14 / Claude Code monitoring',
      title: 'Use the built-in commands',
      body: 'Do not optimize blindly inside Claude Code.',
      code: `/usage     # session usage and estimated cost
/context   # context window breakdown
/compact   # summarize and shrink history
/clear     # start fresh for unrelated work
/model     # switch model when needed`,
      lang: 'Claude Code',
      narration:
        'Inside Claude Code, do not guess. Use slash usage to inspect session usage and estimated cost. Use slash context to see what is taking space. Compact when a task reaches a natural checkpoint. Clear when the next task is unrelated. And switch models instead of staying on the most expensive model by habit.',
    },
    {
      type: 'grid',
      eyebrow: '15 / Playbook',
      title: 'The cost-control playbook',
      body: 'These are the moves that usually matter most.',
      items: [
        { title: 'Route by model', desc: 'Haiku for simple work, Sonnet by default, Opus for hard reasoning.' },
        { title: 'Cache stable prefixes', desc: 'System prompts, examples, long docs, and repeated context.' },
        { title: 'Keep context focused', desc: 'Read file ranges, filter logs, and summarize noisy outputs.' },
        { title: 'Clean Claude Code sessions', desc: 'Compact after milestones and clear between unrelated tasks.' },
      ],
      narration:
        'The playbook is not complicated. Use the cheapest model that can reliably do the job. Cache repeated input. Keep context focused. Avoid dumping full files or massive logs into a conversation. And keep Claude Code sessions clean. These habits usually matter more than clever prompt wording.',
    },
    {
      type: 'content',
      eyebrow: '16 / Rule of thumb',
      title: 'Spend tokens where they buy quality',
      body: 'The goal is not minimum tokens. The goal is useful tokens.',
      bullets: [
        'Use more context when accuracy depends on it',
        'Use thinking when reasoning changes the result',
        'Use Opus when failure is more expensive than tokens',
        'Remove context that is stale, noisy, or unrelated',
      ],
      narration:
        'The goal is not to use the fewest possible tokens. The goal is to spend tokens where they buy quality. More context can be worth it. Thinking can be worth it. Opus can absolutely be worth it. The waste is stale, noisy, unrelated context that gets carried forward only because nobody cleared it.',
    },
    {
      type: 'end',
      title: 'You can now explain the bill.',
      subtitle: 'Token cost is a stack: model choice, input context, cache behavior, tool output, thinking, and visible output.',
      links: [
        { label: 'Full article', value: '/blog/claude-tokens-hidden-costs-optimization-guide' },
        { label: 'Key commands', value: '/usage, /context, /compact, /clear, /model' },
      ],
      narration:
        'That is the complete mental model. Claude token cost is a stack. Model choice sets the rates. Input context sets the base size. Prompt caching changes repeated input price. Tools and MCP can add context. Thinking adds output tokens. And clean session habits keep the whole system from drifting. Head back to the full article for sources, diagrams, and exact examples.',
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Claude Token Costs Explained - Interactive Slides',
      description: 'Watch a narrated slide walkthrough of Claude token costs, Opus 4.7 pricing, prompt caching, Claude Code context, MCP overhead, and thinking tokens.',
      url: '/slides/claude-tokens-hidden-costs-optimization-guide',
      image: 'https://coderssecret.com/images/blog/claude-token-cost-stack.svg',
      robots: 'noindex,follow',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Claude Token Costs Explained', url: '/blog/claude-tokens-hidden-costs-optimization-guide' },
        { name: 'Slides', url: '/slides/claude-tokens-hidden-costs-optimization-guide' },
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        'name': 'Claude Token Costs Explained - Interactive Slides',
        'description': 'Narrated slide walkthrough covering Claude token pricing, prompt caching, Claude Code context, MCP overhead, and thinking tokens.',
        'url': 'https://coderssecret.com/slides/claude-tokens-hidden-costs-optimization-guide',
        'image': 'https://coderssecret.com/images/blog/claude-token-cost-stack.svg',
        'isAccessibleForFree': true,
        'inLanguage': 'en',
        'learningResourceType': 'Slide deck',
        'about': ['Claude API', 'Claude Code', 'Prompt Caching', 'MCP', 'Token Costs'],
      },
    });
  }
}
