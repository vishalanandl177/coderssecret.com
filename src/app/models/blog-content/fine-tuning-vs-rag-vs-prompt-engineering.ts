export const CONTENT = `
      <p>You want an AI system that knows about your company&rsquo;s products, follows your coding standards, or answers questions from your internal documentation. The model does not know any of this out of the box. You have three options to add domain knowledge, and picking the wrong one wastes months and thousands of dollars.</p>

      <h2>The Three Approaches</h2>

      <ul>
        <li><strong>Prompt Engineering:</strong> Craft instructions and examples in the prompt itself. No model changes, no infrastructure.</li>
        <li><strong>RAG (Retrieval-Augmented Generation):</strong> Retrieve relevant documents at query time and inject them into the prompt. The model reads your data on the fly.</li>
        <li><strong>Fine-Tuning:</strong> Train the model on your data to permanently alter its behavior and knowledge. Requires compute, data preparation, and ongoing maintenance.</li>
      </ul>

      <h2>Decision Matrix</h2>

      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Prompt Engineering</th>
            <th>RAG</th>
            <th>Fine-Tuning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Setup Cost</td>
            <td>Zero</td>
            <td>Medium (vector DB, embedding pipeline)</td>
            <td>High (compute, data prep, evaluation)</td>
          </tr>
          <tr>
            <td>Per-Query Cost</td>
            <td>Low-Medium (longer prompts)</td>
            <td>Medium (retrieval + generation)</td>
            <td>Low (no retrieval step)</td>
          </tr>
          <tr>
            <td>Accuracy</td>
            <td>Good for simple tasks</td>
            <td>High (grounded in real documents)</td>
            <td>Highest (internalized knowledge)</td>
          </tr>
          <tr>
            <td>Hallucination Risk</td>
            <td>Medium-High</td>
            <td>Low (cites sources)</td>
            <td>Medium (can still hallucinate)</td>
          </tr>
          <tr>
            <td>Data Freshness</td>
            <td>Static (in the prompt)</td>
            <td>Real-time (retrieves latest docs)</td>
            <td>Stale (frozen at training time)</td>
          </tr>
          <tr>
            <td>Maintenance</td>
            <td>Update prompts manually</td>
            <td>Keep document index updated</td>
            <td>Re-train periodically</td>
          </tr>
          <tr>
            <td>Latency</td>
            <td>Lowest</td>
            <td>Medium (retrieval adds 100-500ms)</td>
            <td>Lowest</td>
          </tr>
          <tr>
            <td>Knowledge Volume</td>
            <td>Small (fits in context window)</td>
            <td>Unlimited (retrieve as needed)</td>
            <td>Large (trained into weights)</td>
          </tr>
        </tbody>
      </table>

      <h2>When to Use Prompt Engineering</h2>

      <ul>
        <li>Your domain knowledge fits in the system prompt (under 5,000 tokens)</li>
        <li>You need to change behavior, not add knowledge (tone, format, constraints)</li>
        <li>You are prototyping and need results today</li>
        <li>Your data changes frequently and is small enough to include directly</li>
      </ul>

      <pre><code># Prompt engineering: all knowledge in the system prompt
system_prompt = """You are a customer support agent for AcmeCorp.

Product Information:
- Basic Plan: $9/month, 10 projects, 5GB storage
- Pro Plan: $29/month, unlimited projects, 50GB storage
- Enterprise: Custom pricing, SSO, dedicated support

Policies:
- Refunds: Full refund within 14 days, pro-rated after
- Downgrade: Takes effect at end of billing cycle
- Data export: Available in Settings > Export > Download All

Always be helpful and concise. If unsure, say you'll escalate
to a human agent."""

response = client.messages.create(
    model="claude-sonnet-4-6",
    system=system_prompt,
    messages=[{"role": "user", "content": "Can I get a refund?"}],
)</code></pre>

      <h2>When to Use RAG</h2>

      <ul>
        <li>You have large amounts of domain data (docs, knowledge base, code repos)</li>
        <li>Data changes frequently and must always be current</li>
        <li>You need the model to cite sources and ground responses in facts</li>
        <li>Hallucination is unacceptable (medical, legal, financial use cases)</li>
      </ul>

      <pre><code># RAG pipeline: retrieve relevant docs, then generate
from sentence_transformers import SentenceTransformer
import chromadb

# Step 1: Index your documents (one-time setup)
embedder = SentenceTransformer('all-MiniLM-L6-v2')
db = chromadb.PersistentClient(path="./vectordb")
collection = db.get_or_create_collection("docs")

def index_documents(documents: list[dict]):
    for doc in documents:
        embedding = embedder.encode(doc["content"]).tolist()
        collection.add(
            ids=[doc["id"]],
            embeddings=[embedding],
            documents=[doc["content"]],
            metadatas=[{"source": doc["source"], "title": doc["title"]}],
        )

# Step 2: Retrieve relevant documents at query time
def retrieve(query: str, top_k: int = 5) -> list[str]:
    query_embedding = embedder.encode(query).tolist()
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )
    return results["documents"][0]

# Step 3: Generate with retrieved context
def rag_answer(question: str) -> str:
    relevant_docs = retrieve(question)
    context = "\\n\\n---\\n\\n".join(relevant_docs)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""Answer using ONLY the provided documentation.
If the docs don't contain the answer, say so. Cite the relevant section.""",
        messages=[{
            "role": "user",
            "content": f"Documentation:\\n{context}\\n\\nQuestion: {question}"
        }],
    )
    return response.content[0].text</code></pre>

      <h2>When to Use Fine-Tuning</h2>

      <ul>
        <li>You need the model to adopt a specific style, format, or personality consistently</li>
        <li>You have thousands of high-quality input-output examples</li>
        <li>Latency is critical and you cannot afford retrieval overhead</li>
        <li>The knowledge is stable and does not change frequently</li>
        <li>Prompt engineering cannot reliably achieve the quality you need</li>
      </ul>

      <pre><code># Fine-tuning: prepare training data in JSONL format
# training_data.jsonl
{"messages": [
  {"role": "system", "content": "You generate SQL from natural language."},
  {"role": "user", "content": "Show me all orders from last month over $100"},
  {"role": "assistant", "content": "SELECT * FROM orders WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < DATE_TRUNC('month', CURRENT_DATE) AND total_amount > 100 ORDER BY created_at DESC;"}
]}
{"messages": [
  {"role": "system", "content": "You generate SQL from natural language."},
  {"role": "user", "content": "Count users by country"},
  {"role": "assistant", "content": "SELECT country, COUNT(*) as user_count FROM users GROUP BY country ORDER BY user_count DESC;"}
]}

# You need 100-1000+ high-quality examples
# Quality matters more than quantity
# Include edge cases and error handling examples</code></pre>

      <h2>The Hybrid Approach: Best of All Worlds</h2>

      <p>In practice, most production systems combine multiple approaches:</p>

      <pre><code># Hybrid: Fine-tuned model + RAG + Prompt Engineering
# 1. Fine-tune for consistent output format and domain vocabulary
# 2. RAG for real-time data retrieval
# 3. Prompt engineering for behavioral constraints

def hybrid_pipeline(question: str) -> str:
    # RAG: retrieve relevant context
    context = retrieve_documents(question)

    # Prompt engineering: behavioral instructions
    system = """You are a technical support specialist.
Format responses as:
1. Diagnosis (one sentence)
2. Solution (step-by-step)
3. Prevention (one tip)
Always cite the documentation section you referenced."""

    # Fine-tuned model: trained on your support ticket history
    response = client.messages.create(
        model="ft:claude-sonnet-4-6:acmecorp:support-v3",
        system=system,
        messages=[{
            "role": "user",
            "content": f"Context:\\n{context}\\n\\nQuestion: {question}"
        }],
    )
    return response.content[0].text</code></pre>

      <h2>Decision Flowchart</h2>

      <ol>
        <li><strong>Can you fit all necessary context in the prompt?</strong> &rarr; Start with prompt engineering</li>
        <li><strong>Do you need access to large or changing data?</strong> &rarr; Add RAG</li>
        <li><strong>Is the model not following your format/style consistently?</strong> &rarr; Consider fine-tuning</li>
        <li><strong>Is latency critical and retrieval adds too much overhead?</strong> &rarr; Fine-tune the knowledge in</li>
        <li><strong>Do you need all three?</strong> &rarr; Fine-tuned model with RAG is the production standard for complex systems</li>
      </ol>

      <h2>Cost Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Prompt Engineering</th>
            <th>RAG</th>
            <th>Fine-Tuning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Setup</td>
            <td>$0</td>
            <td>$100-500 (vector DB, embeddings)</td>
            <td>$500-5,000 (compute, data prep)</td>
          </tr>
          <tr>
            <td>Monthly (1M queries)</td>
            <td>$200-500</td>
            <td>$300-800</td>
            <td>$150-400 + hosting</td>
          </tr>
          <tr>
            <td>Time to first result</td>
            <td>Hours</td>
            <td>Days</td>
            <td>Weeks</td>
          </tr>
          <tr>
            <td>Iteration speed</td>
            <td>Minutes</td>
            <td>Hours</td>
            <td>Days-Weeks</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Always start with prompt engineering</strong> &mdash; it is free, fast, and often sufficient</li>
        <li><strong>Add RAG when you need large or dynamic knowledge</strong> &mdash; documents, knowledge bases, code repos</li>
        <li><strong>Fine-tune when you need consistent style or format</strong> &mdash; not for adding factual knowledge (use RAG for that)</li>
        <li><strong>RAG reduces hallucination better than fine-tuning</strong> &mdash; the model cites retrieved documents, not memorized patterns</li>
        <li><strong>Fine-tuning freezes knowledge at training time</strong> &mdash; your data from January is stale by March</li>
        <li><strong>The hybrid approach wins in production</strong> &mdash; fine-tuned format + RAG for facts + prompt guardrails</li>
        <li><strong>Measure before you optimize</strong> &mdash; if prompt engineering gives 95% accuracy, the extra 3% from fine-tuning may not justify the cost</li>
      </ul>

      <p>The biggest mistake in AI engineering is reaching for fine-tuning first. It is the most expensive, slowest to iterate, and hardest to maintain approach. Start with prompts, add RAG when you outgrow the context window, and fine-tune only when you have proven that the other approaches cannot achieve the quality you need. Most production systems never need fine-tuning at all.</p>
    `;
