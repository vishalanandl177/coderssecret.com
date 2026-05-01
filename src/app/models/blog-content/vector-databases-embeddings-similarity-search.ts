export const CONTENT = `
      <p>Traditional databases find exact matches: &ldquo;find all users where email = alice@example.com.&rdquo; Vector databases find <strong>similar</strong> matches: &ldquo;find documents most similar to this question.&rdquo; This capability powers every RAG pipeline, semantic search engine, recommendation system, and image similarity feature built with AI.</p>

      <h2>What Are Embeddings?</h2>

      <p>An embedding is a list of numbers (a vector) that represents the <strong>meaning</strong> of text, images, or any data. Similar meanings produce similar vectors. The magic is that &ldquo;How do I reset my password?&rdquo; and &ldquo;I forgot my login credentials&rdquo; produce nearby vectors, even though they share no words.</p>

      <pre><code># Generate embeddings with OpenAI or sentence-transformers
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

texts = [
    "How do I reset my password?",
    "I forgot my login credentials",
    "What is the weather today?",
]

embeddings = model.encode(texts)
# embeddings[0].shape = (384,)  # 384-dimensional vector

# Similarity between password questions: ~0.85 (very similar)
# Similarity between password and weather: ~0.12 (very different)

from sklearn.metrics.pairwise import cosine_similarity
print(cosine_similarity([embeddings[0]], [embeddings[1]]))  # ~0.85
print(cosine_similarity([embeddings[0]], [embeddings[2]]))  # ~0.12</code></pre>

      <h2>How Similarity Search Works</h2>

      <p>Given a query vector, find the K nearest vectors in a database of millions. The naive approach (compare against every vector) is O(n) and too slow. Vector databases use approximate nearest neighbor (ANN) algorithms.</p>

      <h3>HNSW: The Algorithm Behind Most Vector DBs</h3>

      <p>HNSW (Hierarchical Navigable Small World) builds a multi-layer graph where each layer is progressively sparser. Search starts at the top layer (coarse navigation) and descends to lower layers (fine-grained search).</p>

      <pre><code># Conceptual HNSW structure:
# Layer 2 (sparse):   A ---- D ---- G
# Layer 1 (medium):   A -- B -- D -- F -- G
# Layer 0 (dense):    A-B-C-D-E-F-G-H-I-J

# Search for a vector near E:
# 1. Start at layer 2: jump to closest node (D)
# 2. Drop to layer 1: navigate D -> F or D -> B
# 3. Drop to layer 0: navigate to E (found!)

# Time complexity: O(log n) instead of O(n)
# Accuracy: 95-99% recall (misses ~1-5% of true nearest neighbors)
# Trade-off: more memory for higher recall</code></pre>

      <h2>Vector Database Options</h2>

      <table>
        <thead>
          <tr>
            <th>Database</th>
            <th>Type</th>
            <th>Best For</th>
            <th>Pricing</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>pgvector</strong></td>
            <td>PostgreSQL extension</td>
            <td>Small-medium datasets, existing PG users</td>
            <td>Free (self-hosted)</td>
          </tr>
          <tr>
            <td><strong>ChromaDB</strong></td>
            <td>Embedded / client-server</td>
            <td>Prototyping, small RAG apps</td>
            <td>Free (open source)</td>
          </tr>
          <tr>
            <td><strong>Pinecone</strong></td>
            <td>Managed cloud</td>
            <td>Production at scale, zero ops</td>
            <td>Pay per use</td>
          </tr>
          <tr>
            <td><strong>Weaviate</strong></td>
            <td>Self-hosted / cloud</td>
            <td>Multi-modal (text + images)</td>
            <td>Free (self-hosted) / paid cloud</td>
          </tr>
          <tr>
            <td><strong>Qdrant</strong></td>
            <td>Self-hosted / cloud</td>
            <td>High performance, filtering</td>
            <td>Free (self-hosted) / paid cloud</td>
          </tr>
          <tr>
            <td><strong>Milvus</strong></td>
            <td>Self-hosted / cloud</td>
            <td>Billion-scale datasets</td>
            <td>Free (self-hosted) / paid cloud</td>
          </tr>
        </tbody>
      </table>

      <h2>pgvector: Start Here</h2>

      <pre><code># Install pgvector extension
CREATE EXTENSION vector;

# Create a table with a vector column
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    embedding vector(384)   -- 384 dimensions
);

# Insert a document with its embedding
INSERT INTO documents (title, content, embedding)
VALUES ('Password Reset', 'How to reset your password...',
        '[0.1, -0.3, 0.5, ...]');  -- 384 floats

# Find the 5 most similar documents
SELECT id, title, embedding &lt;=&gt; '[0.2, -0.1, 0.4, ...]' AS distance
FROM documents
ORDER BY embedding &lt;=&gt; '[0.2, -0.1, 0.4, ...]'  -- cosine distance
LIMIT 5;

# Create an HNSW index for fast search
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

# With index: searches 1M vectors in ~5ms
# Without index: searches 1M vectors in ~500ms</code></pre>

      <h2>Chunking Strategies for RAG</h2>

      <p>Documents must be split into chunks before embedding. Chunk size dramatically affects retrieval quality.</p>

      <pre><code># Strategy 1: Fixed-size chunks (simple, often good enough)
def chunk_by_size(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap  # Overlap prevents splitting mid-sentence
    return chunks

# Strategy 2: Semantic chunking (split on headings/paragraphs)
def chunk_by_structure(text: str) -> list[str]:
    # Split on markdown headers or double newlines
    import re
    sections = re.split(r'\\n#{1,3} |\\n\\n', text)
    return [s.strip() for s in sections if len(s.strip()) > 50]

# Strategy 3: Recursive chunking (LangChain approach)
# Split on paragraphs first, then sentences, then words
# Keep chunks under max_size while preserving semantic boundaries

# Chunk size guidelines:
# Too small (< 100 tokens): loses context, retrieval misses meaning
# Too large (> 1000 tokens): dilutes relevance, wastes context window
# Sweet spot: 200-500 tokens with 10-20% overlap</code></pre>

      <h2>Complete RAG Pipeline</h2>

      <pre><code>import chromadb
from sentence_transformers import SentenceTransformer

# Setup
embedder = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.PersistentClient(path="./vectordb")
collection = client.get_or_create_collection(
    "docs",
    metadata={"hnsw:space": "cosine"}
)

# Index documents
def index_documents(docs: list[dict]):
    for doc in docs:
        chunks = chunk_by_size(doc["content"])
        embeddings = embedder.encode(chunks).tolist()
        collection.add(
            ids=[f"{doc['id']}_chunk_{i}" for i in range(len(chunks))],
            embeddings=embeddings,
            documents=chunks,
            metadatas=[{"source": doc["title"], "chunk": i} for i in range(len(chunks))],
        )

# Query: find relevant chunks
def search(query: str, top_k: int = 5) -> list[str]:
    query_embedding = embedder.encode(query).tolist()
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )
    return results["documents"][0]

# Generate answer with context
def rag_answer(question: str) -> str:
    context_chunks = search(question, top_k=5)
    context = "\\n\\n".join(context_chunks)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        system="Answer using ONLY the provided context. Cite sources.",
        messages=[{
            "role": "user",
            "content": f"Context:\\n{context}\\n\\nQuestion: {question}"
        }],
    )
    return response.content[0].text</code></pre>

      <h2>When You Need a Vector Database</h2>

      <ul>
        <li><strong>RAG pipeline:</strong> Retrieve relevant documents to ground LLM responses</li>
        <li><strong>Semantic search:</strong> Search by meaning, not just keywords</li>
        <li><strong>Recommendation engine:</strong> Find similar products, articles, or users</li>
        <li><strong>Image similarity:</strong> Reverse image search, duplicate detection</li>
        <li><strong>Anomaly detection:</strong> Find data points that are far from any cluster</li>
      </ul>

      <h2>When You Do NOT Need One</h2>

      <ul>
        <li><strong>Less than 10,000 documents:</strong> Brute-force cosine similarity in NumPy is fast enough</li>
        <li><strong>Keyword search is sufficient:</strong> Elasticsearch with BM25 handles keyword queries well</li>
        <li><strong>Exact match only:</strong> Regular database with full-text search</li>
        <li><strong>Already using PostgreSQL:</strong> pgvector extension avoids adding a new database</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Embeddings convert meaning to numbers</strong> &mdash; similar meanings produce nearby vectors</li>
        <li><strong>HNSW is the dominant algorithm</strong> for approximate nearest neighbor search &mdash; O(log n) with 95-99% recall</li>
        <li><strong>Start with pgvector</strong> if you already use PostgreSQL &mdash; it handles millions of vectors well</li>
        <li><strong>Chunk size matters for RAG:</strong> 200-500 tokens with overlap is the sweet spot</li>
        <li><strong>Use managed services (Pinecone) for production at scale</strong> &mdash; self-hosting vector databases requires tuning</li>
        <li><strong>You might not need a vector database</strong> &mdash; for small datasets, NumPy cosine similarity works fine</li>
        <li><strong>Combine vector search with keyword search</strong> (hybrid search) for best results</li>
      </ul>

      <p>Vector databases are infrastructure, not magic. They store numbers and find nearest neighbors efficiently. The magic is in the embeddings &mdash; how you convert your data into meaningful vectors. Get the embeddings and chunking right, and any vector database will serve you well. Get them wrong, and the fanciest database cannot save your search quality.</p>
    `;
