export const CONTENT = `
      <p>You can get Claude to write a poem in the playground. But building a production system that reliably classifies support tickets, generates structured JSON, or orchestrates tool calls? That requires <strong>engineering</strong>, not just prompting.</p>

      <p>This guide covers 8 patterns that separate playground experiments from production AI systems. Every pattern includes real Python code using the Anthropic SDK that you can copy and adapt.</p>

      <h2>Pattern 1: Chain-of-Thought Reasoning</h2>

      <p>Large language models produce better answers when forced to <strong>reason step by step</strong> before giving a final answer. Without this, the model jumps to conclusions &mdash; especially on multi-step problems.</p>

      <h3>Without Chain-of-Thought</h3>

      <pre><code># Prompt: "Is this SQL injection vulnerable? SELECT * FROM users WHERE id = " + user_input
# Model response: "Yes, it's vulnerable."
# Problem: No explanation, no confidence, no actionable detail</code></pre>

      <h3>With Chain-of-Thought</h3>

      <pre><code>import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": """Analyze this code for SQL injection vulnerabilities.
Think through each step:
1. Identify where user input enters the query
2. Check if the input is parameterized or sanitized
3. Determine the attack vector if vulnerable
4. Provide the fix

Code:
query = "SELECT * FROM users WHERE id = " + request.args.get("id")
cursor.execute(query)"""
    }]
)</code></pre>

      <p>The structured reasoning prompt forces the model to examine the code methodically rather than pattern-matching to a quick answer. This dramatically improves accuracy on security analysis, debugging, and code review tasks.</p>

      <h2>Pattern 2: Few-Shot with Structured Examples</h2>

      <p>Few-shot prompting provides input-output examples that teach the model your exact format and decision criteria. This is the most reliable way to get consistent output without fine-tuning.</p>

      <pre><code>response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=256,
    system="""You classify customer support tickets into categories.
Respond with ONLY the category name, nothing else.""",
    messages=[{
        "role": "user",
        "content": """Examples:

Input: "I can't log into my account, password reset isn't working"
Category: authentication

Input: "Your monthly plan is too expensive, I want a refund"
Category: billing

Input: "The export to PDF button gives a 500 error"
Category: bug-report

Input: "Can you add dark mode to the dashboard?"
Category: feature-request

Input: "I was charged twice for my subscription this month"
Category: billing

Now classify this ticket:
Input: "The app crashes every time I try to upload a file larger than 10MB"
Category:"""
    }]
)</code></pre>

      <p>Five examples are usually sufficient. Include edge cases and examples near decision boundaries (a billing complaint vs. a bug report about billing). The model learns your classification logic from the pattern, not from a lengthy explanation.</p>

      <h2>Pattern 3: System Prompt Architecture</h2>

      <p>The system prompt is your most powerful tool for controlling model behavior. A well-structured system prompt defines the role, constraints, output format, and guardrails in a single place.</p>

      <pre><code>SYSTEM_PROMPT = """You are a senior code reviewer for a Python/Django codebase.

ROLE:
- Review code changes for bugs, security issues, and performance problems
- You are direct and specific. No pleasantries.

CONSTRAINTS:
- Only comment on actual issues, not style preferences
- Never suggest adding comments to code
- Focus on: security vulnerabilities, logic errors, N+1 queries, race conditions
- Ignore: naming conventions, import ordering, type hints

OUTPUT FORMAT:
For each issue found, respond in this exact format:
FILE: [filename]
LINE: [line number or range]
SEVERITY: [critical | warning | info]
ISSUE: [one-sentence description]
FIX: [concrete code fix or suggestion]

If no issues found, respond with: LGTM - no issues found.

EXAMPLES:
FILE: views.py
LINE: 45-48
SEVERITY: critical
ISSUE: Raw SQL query with string interpolation allows SQL injection
FIX: Use parameterized query: cursor.execute("SELECT * FROM users WHERE id = %s", [user_id])"""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    system=SYSTEM_PROMPT,
    messages=[{"role": "user", "content": diff_content}]
)</code></pre>

      <h2>Pattern 4: Structured Output with Tool Use</h2>

      <p>Asking a model to &ldquo;respond in JSON&rdquo; works sometimes. For production systems, use <strong>tool use (function calling)</strong> to guarantee structured output. The model must conform to your schema.</p>

      <pre><code>response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[{
        "name": "classify_ticket",
        "description": "Classify a support ticket and extract metadata",
        "input_schema": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "enum": ["bug-report", "feature-request",
                             "billing", "authentication", "general"]
                },
                "priority": {
                    "type": "string",
                    "enum": ["critical", "high", "medium", "low"]
                },
                "summary": {
                    "type": "string",
                    "description": "One-sentence summary of the issue"
                },
                "affected_feature": {
                    "type": "string",
                    "description": "The product feature affected"
                }
            },
            "required": ["category", "priority", "summary"]
        }
    }],
    tool_choice={"type": "tool", "name": "classify_ticket"},
    messages=[{
        "role": "user",
        "content": "Ticket: The checkout page freezes after I add a promo code. "
                   "Happens on Chrome and Firefox. Started yesterday."
    }]
)

# Extract the structured result
tool_result = response.content[0].input
# {"category": "bug-report", "priority": "high",
#  "summary": "Checkout page freezes when applying promo code",
#  "affected_feature": "checkout"}</code></pre>

      <p>By setting <code>tool_choice</code> to force a specific tool, you guarantee the response matches your schema. No regex parsing, no JSON extraction, no &ldquo;sometimes it adds a preamble&rdquo; headaches.</p>

      <h2>Pattern 5: Guardrails and Validation Pipeline</h2>

      <p>Production AI needs input validation, output validation, and fallback strategies. Never trust raw model output without verification.</p>

      <pre><code>import json
from dataclasses import dataclass

@dataclass
class AIResponse:
    content: str
    is_valid: bool
    error: str | None = None

def validate_input(user_input: str) -> str | None:
    """Return error message if input is invalid, None if OK."""
    if len(user_input) > 10000:
        return "Input too long (max 10,000 characters)"
    if len(user_input.strip()) == 0:
        return "Input cannot be empty"
    return None

def validate_output(response_text: str, expected_format: str) -> bool:
    """Validate model output matches expected format."""
    if expected_format == "json":
        try:
            json.loads(response_text)
            return True
        except json.JSONDecodeError:
            return False
    return True

def ai_pipeline(user_input: str) -> AIResponse:
    # Step 1: Validate input
    input_error = validate_input(user_input)
    if input_error:
        return AIResponse(content="", is_valid=False, error=input_error)

    # Step 2: Call the model
    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            messages=[{"role": "user", "content": user_input}]
        )
        content = response.content[0].text
    except anthropic.APIError as e:
        return AIResponse(content="", is_valid=False, error=str(e))

    # Step 3: Validate output
    if not validate_output(content, "json"):
        # Retry once with explicit format instruction
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system="You MUST respond with valid JSON only. No text before or after.",
            messages=[{"role": "user", "content": user_input}]
        )
        content = response.content[0].text

        if not validate_output(content, "json"):
            return AIResponse(content="", is_valid=False,
                            error="Failed to get valid JSON after retry")

    return AIResponse(content=content, is_valid=True)</code></pre>

      <h2>Pattern 6: Retrieval-Augmented Generation (RAG)</h2>

      <p>Instead of hoping the model knows about your internal APIs, <strong>retrieve relevant context</strong> and inject it into the prompt. This eliminates hallucination for domain-specific questions.</p>

      <pre><code>def answer_with_context(question: str, docs: list[str]) -> str:
    """Answer a question using retrieved documentation."""
    context = "\\n\\n---\\n\\n".join(docs)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""Answer the question using ONLY the provided documentation.
If the documentation does not contain the answer, say
"I don't have enough information to answer this."
Never make up information not present in the docs.
Cite the relevant section when answering.""",
        messages=[{
            "role": "user",
            "content": f"""Documentation:
{context}

Question: {question}"""
        }]
    )
    return response.content[0].text

# Usage with your vector store:
query = "How do I configure rate limiting?"
relevant_docs = vector_store.search(query, top_k=5)
answer = answer_with_context(query, relevant_docs)</code></pre>

      <p>The key instruction is &ldquo;ONLY the provided documentation&rdquo; with an explicit fallback (&ldquo;I don&rsquo;t have enough information&rdquo;). Without this, the model will happily hallucinate plausible-sounding but incorrect API configurations.</p>

      <h2>Pattern 7: Conversation Context Management</h2>

      <p>Long conversations eat tokens fast. At 200K context, a 50-turn conversation with code snippets can cost dollars per message. Manage context aggressively.</p>

      <pre><code>def manage_conversation(messages: list, max_tokens: int = 50000) -> list:
    """Keep conversation within token budget using sliding window."""
    # Always keep: system context + first message + last N messages
    if estimate_tokens(messages) <= max_tokens:
        return messages

    # Keep first message (establishes context) and trim middle
    first = messages[:1]
    recent = messages[-10:]  # Keep last 10 messages

    # Summarize the trimmed middle section
    middle = messages[1:-10]
    summary = summarize_messages(middle)

    return first + [{"role": "user",
                     "content": f"[Previous conversation summary: {summary}]"},
                    {"role": "assistant",
                     "content": "Understood, I have the context."}] + recent</code></pre>

      <h2>Pattern 8: Tool Use and Function Calling</h2>

      <p>Give the model <strong>tools</strong> (functions it can call) to interact with external systems. This transforms a text generator into an agent that can query databases, call APIs, and take actions.</p>

      <pre><code>tools = [
    {
        "name": "get_order_status",
        "description": "Look up the current status of a customer order by order ID",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The order ID (e.g., ORD-12345)"
                }
            },
            "required": ["order_id"]
        }
    },
    {
        "name": "create_support_ticket",
        "description": "Create a new support ticket in the system",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject": {"type": "string"},
                "description": {"type": "string"},
                "priority": {"type": "string", "enum": ["low", "medium", "high"]}
            },
            "required": ["subject", "description", "priority"]
        }
    }
]

# The agentic loop: call model, execute tools, feed results back
messages = [{"role": "user", "content": "What's the status of order ORD-78901?"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )

    # Check if the model wants to use a tool
    if response.stop_reason == "tool_use":
        tool_block = next(b for b in response.content if b.type == "tool_use")

        # Execute the actual function
        result = execute_tool(tool_block.name, tool_block.input)

        # Feed the result back to the model
        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": tool_block.id,
                "content": json.dumps(result)
            }]
        })
    else:
        # Model gave a final text response
        print(response.content[0].text)
        break</code></pre>

      <h2>Anti-Patterns to Avoid</h2>

      <ul>
        <li><strong>No output validation:</strong> Never trust raw model output for structured data. Always validate against a schema.</li>
        <li><strong>Prompt injection blindness:</strong> If user input goes into your prompt, malicious users can override your instructions. Always separate system instructions from user content using the system parameter.</li>
        <li><strong>Unbounded context:</strong> Stuffing entire codebases into the prompt. Retrieve only relevant sections using embeddings or keyword search.</li>
        <li><strong>Hardcoded prompts:</strong> Prompts evolve. Store them in versioned configuration, not inline strings. A/B test prompt changes like you test code changes.</li>
        <li><strong>Ignoring caching:</strong> The Anthropic API supports prompt caching. If your system prompt is 5,000 tokens and identical across requests, enable caching to cut costs by 90% on cache hits.</li>
      </ul>

      <h2>Decision Matrix</h2>

      <table>
        <thead>
          <tr>
            <th>Use Case</th>
            <th>Primary Pattern</th>
            <th>Secondary Pattern</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Text classification</td>
            <td>Few-shot examples</td>
            <td>Structured output</td>
          </tr>
          <tr>
            <td>Code review</td>
            <td>System prompt architecture</td>
            <td>Chain-of-thought</td>
          </tr>
          <tr>
            <td>Customer support bot</td>
            <td>Tool use</td>
            <td>RAG + Guardrails</td>
          </tr>
          <tr>
            <td>Data extraction</td>
            <td>Structured output (tool use)</td>
            <td>Few-shot</td>
          </tr>
          <tr>
            <td>Q&amp;A over documentation</td>
            <td>RAG</td>
            <td>Context management</td>
          </tr>
          <tr>
            <td>Complex reasoning tasks</td>
            <td>Chain-of-thought</td>
            <td>Guardrails</td>
          </tr>
          <tr>
            <td>Multi-step workflows</td>
            <td>Tool use (agentic loop)</td>
            <td>Context management</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Chain-of-thought</strong> improves accuracy on any multi-step reasoning task &mdash; always use it for complex analysis</li>
        <li><strong>Few-shot examples</strong> are the most reliable way to get consistent formatting without fine-tuning</li>
        <li><strong>Tool use guarantees structured output</strong> &mdash; never parse free-text JSON in production</li>
        <li><strong>RAG eliminates hallucination</strong> for domain-specific questions &mdash; always retrieve before generating</li>
        <li><strong>Guardrails are not optional</strong> &mdash; validate inputs and outputs in every production pipeline</li>
        <li><strong>Manage conversation context aggressively</strong> &mdash; summarize old messages to stay within token budgets</li>
        <li><strong>Version your prompts</strong> like you version code &mdash; they are as critical as any other system configuration</li>
      </ul>

      <p>Prompt engineering is software engineering. Treat prompts as code: version them, test them, validate their output, and iterate based on production data. The patterns in this guide are not theoretical &mdash; they are the same techniques used in production AI systems handling millions of requests per day.</p>
    `;
