export const CONTENT = `
      <p>You've installed Ollama and Gemma 4 from our <a href="/blog/run-gemma-4-locally-windows-macos-linux">previous guide</a>. Now what? A chatbot is fun for 5 minutes, but real AI applications need <strong>access to your data</strong> (RAG), <strong>ability to call tools</strong> (function calling), and <strong>autonomous reasoning</strong> (agents). This guide shows you how to build all three — entirely offline, no cloud APIs, no data leaving your machine.</p>

      <h2>What We're Building</h2>

      <!-- Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Local AI Application Stack</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">Your Application (Python / TypeScript)<span class="layer-item-sub">The app your users interact with — CLI, web UI, API, or IDE extension</span></div>
          <div class="layer-item" style="background:#f97316">Agent Framework (LangChain / LlamaIndex / CrewAI)<span class="layer-item-sub">Orchestrates LLM calls, tool use, retrieval, and multi-step reasoning</span></div>
          <div class="layer-item" style="background:#7c3aed">RAG Pipeline (ChromaDB / FAISS + Embeddings)<span class="layer-item-sub">Retrieves relevant context from your documents before asking the LLM</span></div>
          <div class="layer-item" style="background:#3b82f6">Local LLM (Ollama / llama.cpp)<span class="layer-item-sub">Gemma 4, Llama 3, Mistral — runs on your GPU, no internet needed</span></div>
          <div class="layer-item" style="background:#22c55e">Your Data (PDFs, code, databases, Slack exports)<span class="layer-item-sub">Stays on your machine. Never sent to any cloud. Complete privacy.</span></div>
        </div>
      </div>

      <h2>Part 1: RAG (Retrieval-Augmented Generation)</h2>
      <p><strong>Problem:</strong> LLMs only know what they were trained on. They don't know your company docs, your codebase, or your private data.</p>
      <p><strong>Solution:</strong> RAG retrieves relevant documents from your data, adds them to the LLM's prompt as context, and the LLM answers based on <em>your</em> data — not just its training data.</p>

      <!-- RAG Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How RAG Works</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">User<span class="seq-actor-sub">(Question)</span></div>
            <div class="seq-actor idp">RAG Pipeline<span class="seq-actor-sub">(Retrieve)</span></div>
            <div class="seq-actor sp">Local LLM<span class="seq-actor-sub">(Generate)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> "What was Q3 revenue?"</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Embed question &#x2192; search vector DB &#x2192; find relevant docs</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#f97316"><span class="seq-num orange">2</span> Question + retrieved context &#x2192; LLM prompt</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div></div>
              <div class="seq-action" style="border-color:#22c55e;color:#4ade80">LLM reads context, generates answer</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> "Q3 revenue was \\$4.2M, up 23% YoY" &#x2705;</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Build a Complete RAG System</h2>
      <pre><code># pip install langchain langchain-community chromadb ollama sentence-transformers

# ── Step 1: Load your documents ────────────────
from langchain_community.document_loaders import (
    DirectoryLoader, PyPDFLoader, TextLoader, CSVLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load PDFs from a directory
loader = DirectoryLoader(
    "./company-docs/",
    glob="**/*.pdf",
    loader_cls=PyPDFLoader,
)
documents = loader.load()
print(f"Loaded {len(documents)} pages from PDFs")

# Also load text files, markdown, CSV, etc.
# loader = TextLoader("./notes.md")
# loader = CSVLoader("./data.csv")

# ── Step 2: Split into chunks ─────────────────
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # Characters per chunk
    chunk_overlap=200,     # Overlap between chunks (for context continuity)
    separators=["\\n\\n", "\\n", ". ", " ", ""],
)
chunks = splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunks")

# ── Step 3: Create embeddings + vector store ──
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma

# Use Ollama for embeddings too (all local!)
embeddings = OllamaEmbeddings(model="nomic-embed-text")
# Or: model="gemma4:12b" (uses the LLM for embeddings)

# Store in ChromaDB (local vector database)
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db",  # Persists to disk
)
print(f"Vector store created with {vectorstore._collection.count()} vectors")

# ── Step 4: Create the RAG chain ──────────────
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

llm = Ollama(model="gemma4:12b", temperature=0.3)

prompt = PromptTemplate.from_template("""
Use the following context to answer the question. If the answer is not
in the context, say "I don't have enough information to answer that."

Context:
{context}

Question: {question}

Answer:""")

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 4}),
    chain_type_kwargs={"prompt": prompt},
    return_source_documents=True,
)

# ── Step 5: Ask questions! ────────────────────
result = qa_chain.invoke({"query": "What was our Q3 revenue?"})
print(f"Answer: {result['result']}")
print(f"Sources: {[doc.metadata['source'] for doc in result['source_documents']]}")

# All running locally — PDFs never leave your machine!</code></pre>

      <h2>Part 2: Function Calling (Tool Use)</h2>
      <p><strong>Problem:</strong> LLMs can only generate text. They can't check the weather, query a database, or send emails.</p>
      <p><strong>Solution:</strong> Function calling lets the LLM decide <em>which tool to use</em> and <em>what arguments to pass</em>. Your code executes the tool and returns the result to the LLM.</p>

      <!-- Function Calling Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Function Calling: LLM + Tools</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F464;</span>User<span class="pipeline-step-sub">"How many users signed up today?"</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F9E0;</span>LLM<span class="pipeline-step-sub">Decides: call query_db()</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x1F4BE;</span>Tool<span class="pipeline-step-sub">Runs SQL query</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x1F4AC;</span>Answer<span class="pipeline-step-sub">"47 users signed up today"</span></div>
        </div>
      </div>

      <pre><code># Function calling with Ollama + LangChain
from langchain_community.llms import Ollama
from langchain.agents import tool, AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
import sqlite3
import datetime

# ── Define tools ───────────────────────────────
@tool
def query_database(sql: str) -> str:
    """Execute a read-only SQL query against the app database.
    Only SELECT queries are allowed."""
    if not sql.strip().upper().startswith("SELECT"):
        return "Error: Only SELECT queries allowed"
    conn = sqlite3.connect("app.db")
    try:
        result = conn.execute(sql).fetchall()
        return str(result)
    except Exception as e:
        return f"SQL Error: {e}"
    finally:
        conn.close()

@tool
def get_current_time() -> str:
    """Returns the current date and time."""
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@tool
def search_files(query: str) -> str:
    """Search for files containing a keyword in the project directory."""
    import subprocess
    result = subprocess.run(
        ["grep", "-rl", query, "./src/"],
        capture_output=True, text=True, timeout=10
    )
    return result.stdout or "No files found"

# ── Create the agent ───────────────────────────
llm = Ollama(model="gemma4:12b", temperature=0)
tools = [query_database, get_current_time, search_files]

prompt = PromptTemplate.from_template("""
You are a helpful assistant with access to tools.
Available tools: {tools}
Tool names: {tool_names}

Use the following format:
Question: the input question
Thought: think about what to do
Action: the tool to use
Action Input: input for the tool
Observation: the tool result
... (repeat if needed)
Thought: I now know the answer
Final Answer: the final answer

Question: {input}
{agent_scratchpad}""")

agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# ── Run it ─────────────────────────────────────
result = executor.invoke({
    "input": "How many users signed up today?"
})
# Agent thinks: "I need to query the database"
# Action: query_database
# Action Input: SELECT COUNT(*) FROM users WHERE DATE(created_at) = DATE('now')
# Observation: [(47,)]
# Final Answer: 47 users signed up today.</code></pre>

      <h2>Part 3: Autonomous Agents</h2>
      <p>An agent is an LLM that can <strong>reason, plan, and use tools autonomously</strong> to complete complex, multi-step tasks.</p>

      <pre><code># Multi-agent system with CrewAI (all local)
# pip install crewai crewai-tools

from crewai import Agent, Task, Crew
from langchain_community.llms import Ollama

llm = Ollama(model="gemma4:12b")

# ── Define specialized agents ──────────────────
researcher = Agent(
    role="Research Analyst",
    goal="Find and analyze relevant information",
    backstory="Expert at researching topics and summarizing findings",
    llm=llm,
    verbose=True,
)

writer = Agent(
    role="Technical Writer",
    goal="Write clear, engaging technical content",
    backstory="Expert at turning research into readable articles",
    llm=llm,
    verbose=True,
)

reviewer = Agent(
    role="Editor",
    goal="Review content for accuracy and clarity",
    backstory="Experienced editor with attention to detail",
    llm=llm,
    verbose=True,
)

# ── Define tasks ───────────────────────────────
research_task = Task(
    description="Research the key differences between gRPC and REST APIs. Include performance data.",
    expected_output="A structured research document with key findings",
    agent=researcher,
)

writing_task = Task(
    description="Write a 500-word blog post based on the research. Make it beginner-friendly.",
    expected_output="A polished blog post in markdown format",
    agent=writer,
    context=[research_task],  # Uses research output as input
)

review_task = Task(
    description="Review the blog post for technical accuracy and clarity. Suggest improvements.",
    expected_output="Reviewed blog post with corrections applied",
    agent=reviewer,
    context=[writing_task],
)

# ── Run the crew ───────────────────────────────
crew = Crew(
    agents=[researcher, writer, reviewer],
    tasks=[research_task, writing_task, review_task],
    verbose=True,
)

result = crew.kickoff()
print(result)
# Three AI agents collaborate to research, write, and review a blog post
# All running locally on your machine!</code></pre>

      <h2>Privacy &amp; Security Benefits</h2>

      <!-- Privacy Benefits -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Why Run AI Locally?</div>
        <div class="vs-cards" style="grid-template-columns:1fr 1fr">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x2601; Cloud AI APIs</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B8;</span>Pay per token (costs add up fast)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Data sent to third-party servers</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Network latency (100-500ms)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>Rate limits and downtime</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Compliance concerns (HIPAA, GDPR)</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F4BB; Local AI</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Free after hardware investment</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Data never leaves your machine</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A1;</span>Zero latency (GPU-speed inference)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>No rate limits, always available</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E1;</span>HIPAA/GDPR compliant by default</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Performance Tips</h2>
      <pre><code># 1. Use a dedicated embedding model (smaller, faster)
ollama pull nomic-embed-text  # 274 MB, very fast embeddings
# Don't use gemma4:12b for embeddings — it's overkill

# 2. Persist your vector store
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
# Second run loads instantly — no re-embedding

# 3. Tune chunk size for your data type
# Code: chunk_size=500, overlap=50 (functions are short)
# Legal docs: chunk_size=2000, overlap=400 (context matters)
# Chat logs: chunk_size=300, overlap=0 (each message is independent)

# 4. Use GPU for both embedding and generation
OLLAMA_NUM_GPU=99 ollama serve  # Max GPU layers

# 5. Cache LLM responses for repeated queries
from langchain.cache import SQLiteCache
from langchain.globals import set_llm_cache
set_llm_cache(SQLiteCache(database_path=".langchain.db"))</code></pre>

      <p>Local AI isn't just for chatbots anymore. With RAG, your LLM answers questions about <em>your</em> data. With function calling, it takes actions in the real world. With agents, it plans and executes multi-step workflows autonomously. All of this runs on your laptop, costs nothing after setup, and keeps your data completely private. The local AI stack is production-ready — start building.</p>
    `;
