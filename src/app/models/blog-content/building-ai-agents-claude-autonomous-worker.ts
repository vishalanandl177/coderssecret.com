export const CONTENT = `
      <p>A chatbot answers questions. An agent <strong>takes actions</strong>. It reads databases, calls APIs, writes files, makes decisions, and executes multi-step plans &mdash; all autonomously. The difference is not the model. It is the architecture around it.</p>

      <p>This guide builds an AI agent from scratch using Claude, starting with a simple tool-calling loop and progressively adding memory, error recovery, and multi-step orchestration.</p>

      <h2>The Agent Loop: Core Architecture</h2>

      <p>Every AI agent follows the same fundamental loop:</p>

      <ol>
        <li>Receive a task from the user</li>
        <li>Think about what to do next</li>
        <li>Call a tool (or respond to the user)</li>
        <li>Observe the tool result</li>
        <li>Repeat from step 2 until the task is complete</li>
      </ol>

      <pre><code>import anthropic
import json

client = anthropic.Anthropic()

def agent_loop(user_message: str, tools: list, system: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=system,
            tools=tools,
            messages=messages,
        )

        # If the model wants to use a tool
        if response.stop_reason == "tool_use":
            # Add assistant response to conversation
            messages.append({"role": "assistant", "content": response.content})

            # Execute each tool call
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    })

            messages.append({"role": "user", "content": tool_results})

        else:
            # Model gave a final text response
            return response.content[0].text</code></pre>

      <h2>Defining Tools</h2>

      <p>Tools are functions the agent can call. Define them with clear descriptions &mdash; the model uses these descriptions to decide when and how to call each tool.</p>

      <pre><code>tools = [
    {
        "name": "read_file",
        "description": "Read the contents of a file at the given path",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Absolute or relative file path"
                }
            },
            "required": ["path"]
        }
    },
    {
        "name": "run_sql_query",
        "description": "Execute a read-only SQL query against the database. "
                       "Only SELECT queries are allowed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "SQL SELECT query to execute"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "create_github_issue",
        "description": "Create a new issue in a GitHub repository",
        "input_schema": {
            "type": "object",
            "properties": {
                "repo": {"type": "string", "description": "owner/repo format"},
                "title": {"type": "string"},
                "body": {"type": "string"},
                "labels": {
                    "type": "array",
                    "items": {"type": "string"}
                }
            },
            "required": ["repo", "title", "body"]
        }
    }
]

def execute_tool(name: str, inputs: dict) -> dict:
    if name == "read_file":
        try:
            with open(inputs["path"]) as f:
                return {"content": f.read()}
        except FileNotFoundError:
            return {"error": f"File not found: {inputs['path']}"}

    elif name == "run_sql_query":
        query = inputs["query"].strip().upper()
        if not query.startswith("SELECT"):
            return {"error": "Only SELECT queries are allowed"}
        rows = db.execute(inputs["query"])
        return {"rows": rows, "count": len(rows)}

    elif name == "create_github_issue":
        issue = github.create_issue(**inputs)
        return {"issue_url": issue.html_url, "number": issue.number}

    return {"error": f"Unknown tool: {name}"}</code></pre>

      <h2>Adding Memory: Conversation Persistence</h2>

      <p>A stateless agent forgets everything between sessions. Add a memory layer so the agent retains context across conversations.</p>

      <pre><code>import sqlite3
from datetime import datetime

class AgentMemory:
    def __init__(self, db_path: str = "agent_memory.db"):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id INTEGER PRIMARY KEY,
                session_id TEXT,
                role TEXT,
                content TEXT,
                created_at TEXT
            )
        """)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS facts (
                id INTEGER PRIMARY KEY,
                key TEXT UNIQUE,
                value TEXT,
                updated_at TEXT
            )
        """)

    def save_message(self, session_id: str, role: str, content: str):
        self.conn.execute(
            "INSERT INTO memories (session_id, role, content, created_at) VALUES (?, ?, ?, ?)",
            (session_id, role, content, datetime.now().isoformat())
        )
        self.conn.commit()

    def get_session(self, session_id: str, limit: int = 50) -> list:
        rows = self.conn.execute(
            "SELECT role, content FROM memories WHERE session_id = ? ORDER BY id DESC LIMIT ?",
            (session_id, limit)
        ).fetchall()
        return [{"role": r[0], "content": r[1]} for r in reversed(rows)]

    def remember(self, key: str, value: str):
        self.conn.execute(
            "INSERT OR REPLACE INTO facts (key, value, updated_at) VALUES (?, ?, ?)",
            (key, value, datetime.now().isoformat())
        )
        self.conn.commit()

    def recall(self, key: str) -> str | None:
        row = self.conn.execute(
            "SELECT value FROM facts WHERE key = ?", (key,)
        ).fetchone()
        return row[0] if row else None</code></pre>

      <h2>Error Recovery: Making Agents Robust</h2>

      <p>Production agents must handle failures gracefully &mdash; tool errors, API timeouts, unexpected model responses, and infinite loops.</p>

      <pre><code>def robust_agent_loop(user_message: str, tools: list, system: str,
                       max_iterations: int = 20) -> str:
    messages = [{"role": "user", "content": user_message}]
    iterations = 0

    while iterations < max_iterations:
        iterations += 1

        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=4096,
                system=system,
                tools=tools,
                messages=messages,
            )
        except anthropic.RateLimitError:
            time.sleep(5)
            continue
        except anthropic.APIError as e:
            return f"API error: {e}. Please try again."

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})

            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    try:
                        result = execute_tool(block.name, block.input)
                    except Exception as e:
                        result = {"error": str(e)}

                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                        "is_error": "error" in result,
                    })

            messages.append({"role": "user", "content": tool_results})
        else:
            return response.content[0].text

    return "Agent reached maximum iterations without completing the task."</code></pre>

      <h2>Multi-Step Task Orchestration</h2>

      <p>For complex tasks, give the agent a planning tool so it can break work into steps, track progress, and adapt when things go wrong.</p>

      <pre><code>ORCHESTRATOR_SYSTEM = """You are an autonomous task agent. For complex requests:
1. Break the task into numbered steps using the plan_task tool
2. Execute each step using available tools
3. After each step, evaluate progress and adapt the plan if needed
4. Report the final result when all steps are complete

If a step fails, try an alternative approach before giving up.
Never repeat the same failed action more than twice."""

plan_tool = {
    "name": "plan_task",
    "description": "Create or update a step-by-step plan for the current task. "
                   "Call this at the start to plan, and again if the plan needs to change.",
    "input_schema": {
        "type": "object",
        "properties": {
            "steps": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "step_number": {"type": "integer"},
                        "description": {"type": "string"},
                        "status": {
                            "type": "string",
                            "enum": ["pending", "in_progress", "done", "failed"]
                        }
                    }
                }
            },
            "reasoning": {
                "type": "string",
                "description": "Why this plan makes sense for the task"
            }
        },
        "required": ["steps", "reasoning"]
    }
}</code></pre>

      <h2>Guardrails: Keeping Agents Safe</h2>

      <pre><code>class AgentGuardrails:
    def __init__(self):
        self.allowed_paths = ["/app/data/", "/tmp/"]
        self.blocked_sql = ["DROP", "DELETE", "INSERT", "UPDATE", "ALTER"]
        self.max_tool_calls = 50
        self.tool_call_count = 0

    def validate_tool_call(self, name: str, inputs: dict) -> str | None:
        """Return error message if tool call is not allowed, None if OK."""
        self.tool_call_count += 1
        if self.tool_call_count > self.max_tool_calls:
            return "Maximum tool calls exceeded. Aborting."

        if name == "read_file":
            path = inputs.get("path", "")
            if not any(path.startswith(p) for p in self.allowed_paths):
                return f"Access denied: {path} is outside allowed directories"

        if name == "run_sql_query":
            query_upper = inputs.get("query", "").upper()
            for keyword in self.blocked_sql:
                if keyword in query_upper:
                    return f"Blocked: {keyword} queries are not allowed"

        return None</code></pre>

      <h2>Real-World Agent: Repository Analyzer</h2>

      <pre><code>REPO_ANALYZER_SYSTEM = """You are a code repository analyzer agent.
When given a repository path, you:
1. Read the project structure
2. Identify the tech stack (languages, frameworks, package managers)
3. Check for common issues (missing tests, no CI config, security concerns)
4. Generate a summary report

Use the available tools to explore the codebase. Be thorough but efficient.
Do not read every file - focus on configuration files, package manifests,
and directory structure to infer the tech stack."""

# Run the analyzer
result = robust_agent_loop(
    user_message="Analyze the repository at /app/my-project and generate a report",
    tools=[read_file_tool, list_directory_tool, run_command_tool, plan_tool],
    system=REPO_ANALYZER_SYSTEM,
    max_iterations=30,
)
print(result)</code></pre>

      <h2>Agent Patterns Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Pattern</th>
            <th>Best For</th>
            <th>Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Simple Tool Loop</td>
            <td>Single-step tasks, Q&amp;A with data lookup</td>
            <td>Low</td>
          </tr>
          <tr>
            <td>Plan-and-Execute</td>
            <td>Multi-step tasks with clear stages</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>ReAct (Reason + Act)</td>
            <td>Tasks requiring reasoning about observations</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>Multi-Agent</td>
            <td>Complex workflows with specialized sub-agents</td>
            <td>High</td>
          </tr>
          <tr>
            <td>Human-in-the-Loop</td>
            <td>High-stakes decisions, approval workflows</td>
            <td>Medium</td>
          </tr>
        </tbody>
      </table>

      <h2>Production Checklist</h2>

      <ul>
        <li><strong>Rate limiting:</strong> Cap API calls per user and per session</li>
        <li><strong>Cost controls:</strong> Set max_tokens and iteration limits to prevent runaway costs</li>
        <li><strong>Logging:</strong> Log every tool call, model response, and error for debugging</li>
        <li><strong>Timeouts:</strong> Set hard timeouts on tool execution (a stuck API call should not block the agent)</li>
        <li><strong>Sandboxing:</strong> Run file and command tools in isolated environments</li>
        <li><strong>Human escalation:</strong> Agent should know when to stop and ask for help</li>
        <li><strong>Testing:</strong> Create test scenarios that cover tool errors, edge cases, and multi-step workflows</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>The agent loop is simple:</strong> think &rarr; act &rarr; observe &rarr; repeat. Everything else is refinement.</li>
        <li><strong>Tool descriptions matter more than tool code</strong> &mdash; the model decides when and how to use tools based on descriptions alone</li>
        <li><strong>Always add iteration limits</strong> &mdash; agents without guardrails can loop forever and cost hundreds of dollars</li>
        <li><strong>Return errors as tool results, not exceptions</strong> &mdash; let the model decide how to recover</li>
        <li><strong>Memory turns a chatbot into a colleague</strong> &mdash; it remembers preferences, past decisions, and project context</li>
        <li><strong>Start with a simple tool loop</strong>, add planning only when tasks genuinely require multi-step orchestration</li>
        <li><strong>Guardrails are not optional</strong> &mdash; file access controls, SQL query filtering, and cost limits are day-one requirements</li>
      </ul>

      <p>AI agents are not magic &mdash; they are well-structured programs with an LLM as the decision engine. The architecture matters more than the model. A well-designed agent with Claude Sonnet will outperform a poorly designed agent with Opus every time. Start simple, add complexity only when needed, and always, always add guardrails.</p>
    `;
