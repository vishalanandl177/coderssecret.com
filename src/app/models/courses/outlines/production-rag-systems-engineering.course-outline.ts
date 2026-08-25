import type { CourseOutline } from '../../course-outline';

export const PRODUCTION_RAG_SYSTEMS_ENGINEERING_OUTLINE: CourseOutline = {
  "id": "production-rag",
  "title": "Production-Grade RAG Systems Engineering",
  "slug": "production-rag-systems-engineering",
  "subtitle": "Build scalable, reliable, observable, and secure Retrieval-Augmented Generation systems - not another chatbot tutorial",
  "excerpt": "Go beyond toy demos. Learn how production RAG systems are architected: embeddings, vector databases, hybrid retrieval, reranking, AI agents, evaluation, observability, security, and Kubernetes deployment. 16 modules, 31 labs, free.",
  "description": "The most practical production-focused RAG engineering course available. Not another chatbot demo - this is how real-world scalable, reliable, observable, secure RAG systems are designed and operated. 16 modules covering embeddings, vector databases (Qdrant, pgvector), hybrid retrieval, reranking, AI agents (LangGraph), evaluation, observability, prompt injection defense, and Kubernetes deployment. 31 hands-on labs, completely free.",
  "totalDuration": "50+ hours",
  "level": "Beginner to Advanced",
  "category": "ai",
  "tags": [
    "RAG",
    "LLM",
    "Vector Database",
    "Embeddings",
    "Semantic Search",
    "AI Agents",
    "LangChain",
    "LangGraph",
    "Qdrant",
    "pgvector",
    "FastAPI",
    "Python",
    "AI Observability",
    "Prompt Injection",
    "Kubernetes",
    "AI Security",
    "Hybrid Search",
    "Reranking",
    "Graph RAG",
    "MCP",
    "Production AI",
    "OpenTelemetry"
  ],
  "targetAudience": [
    "Backend engineers building AI-powered applications",
    "Python developers entering AI systems engineering",
    "AI engineers moving from prototypes to production",
    "DevOps engineers deploying AI infrastructure",
    "Platform engineers building AI-ready platforms",
    "Software architects designing retrieval systems",
    "Developers who are tired of shallow chatbot tutorials"
  ],
  "outcomes": [
    "A production-ready RAG architecture with ingestion, chunking, embedding, retrieval, reranking, and answer generation",
    "A vector-search backend using Qdrant or pgvector with filtering, metadata, and hybrid retrieval",
    "Evaluation workflows for retrieval quality, groundedness, hallucination checks, and regression testing",
    "Observability for prompts, retrieval latency, context quality, token cost, and user-facing failures",
    "Security controls for prompt injection, tenant isolation, data leakage, and tool permissions",
    "A deployable FastAPI RAG service with caching, streaming, CI/CD checks, Docker, and Kubernetes deployment notes"
  ],
  "instructor": {
    "name": "Vishal Anand",
    "title": "Senior Product Engineer & Tech Lead",
    "bio": "Creator of DRF API Logger (1.6M+ PyPI downloads), educator at CodersSecret, and author of the Mastering SPIFFE & SPIRE and Cloud Native Security Engineering courses. Builds production AI and infrastructure systems.",
    "github": "https://github.com/vishalanandl177",
    "achievements": [
      "Creator of DRF API Logger - 1.6M+ downloads, enterprise-grade API observability",
      "Author of 2 production-focused free courses (SPIFFE/SPIRE + Cloud Native Security)",
      "80+ production-grade engineering tutorials at CodersSecret",
      "Production experience building AI retrieval systems at scale"
    ]
  },
  "faqs": [
    {
      "question": "What is RAG?",
      "answer": "RAG (Retrieval-Augmented Generation) is an AI architecture that retrieves relevant documents from a knowledge base and injects them into the LLM prompt. This grounds the model response in real data, dramatically reducing hallucinations and enabling domain-specific AI applications."
    },
    {
      "question": "Is this course free?",
      "answer": "Yes, 100% free. 16 modules, 31 hands-on labs, all content and companion GitHub repository are completely free with no paywalls."
    },
    {
      "question": "How is this different from LangChain tutorials?",
      "answer": "Most RAG tutorials show you how to chain API calls. This course teaches production architecture: scalable retrieval, evaluation, observability, security, multi-tenancy, caching, and Kubernetes deployment. Framework-agnostic engineering, not framework-specific demos."
    },
    {
      "question": "Do I need ML experience?",
      "answer": "No. The course starts with LLM fundamentals and search basics, then progressively builds to advanced retrieval, agents, and production deployment. Python experience is sufficient."
    },
    {
      "question": "What vector database does this course use?",
      "answer": "Primarily Qdrant (open source, production-grade) and pgvector (PostgreSQL extension). The concepts apply to any vector database - Pinecone, Weaviate, Milvus, ChromaDB."
    },
    {
      "question": "Will I build something real?",
      "answer": "Yes. The capstone project is a production-grade enterprise RAG platform with document ingestion, hybrid retrieval, reranking, AI agents, observability, security, and Kubernetes deployment."
    },
    {
      "question": "What is hybrid search?",
      "answer": "Hybrid search combines keyword search (BM25) with semantic search (vector embeddings) for better retrieval quality. Keywords catch exact matches that semantic search misses, and semantic search catches meaning that keywords miss."
    },
    {
      "question": "What about hallucinations?",
      "answer": "Module 10 covers hallucination detection, groundedness evaluation, retrieval quality metrics, and techniques to minimize hallucinations through better retrieval, context management, and prompt design."
    }
  ],
  "seoPages": [
    {
      "slug": "what-is-rag",
      "title": "What is RAG? Retrieval-Augmented Generation Explained",
      "description": "RAG retrieves relevant documents and injects them into LLM prompts, reducing hallucinations and enabling domain-specific AI. Learn how production RAG systems work.",
      "ctaModule": 1,
      "content": "\n          <h1>What is RAG? Retrieval-Augmented Generation Explained</h1>\n          <p><strong>Retrieval-Augmented Generation (RAG)</strong> is an AI architecture pattern that enhances Large Language Model responses by retrieving relevant information from a knowledge base before generating an answer.</p>\n          <p>Instead of relying solely on the model's training data (which can be outdated or incomplete), RAG injects real, current, domain-specific documents into the prompt. This dramatically reduces hallucinations and enables AI applications that answer questions about YOUR data - company docs, product manuals, legal contracts, medical records.</p>\n          <h2>How RAG Works</h2>\n          <ol>\n            <li><strong>Index:</strong> Documents are chunked, embedded into vectors, and stored in a vector database</li>\n            <li><strong>Retrieve:</strong> When a user asks a question, the query is embedded and the most similar document chunks are retrieved</li>\n            <li><strong>Augment:</strong> Retrieved chunks are injected into the LLM prompt as context</li>\n            <li><strong>Generate:</strong> The LLM generates an answer grounded in the retrieved documents</li>\n          </ol>\n          <h2>Learn RAG Engineering - Free</h2>\n          <p>Our free <a href=\"/courses/production-rag-systems-engineering\">Production-Grade RAG Systems Engineering</a> course teaches you to build scalable, reliable RAG systems - not toy demos. 16 modules, 31 labs.</p>\n        "
    },
    {
      "slug": "vector-database-comparison",
      "title": "Vector Database Comparison: Qdrant vs Pinecone vs pgvector vs Weaviate",
      "description": "Compare the top vector databases for RAG systems: Qdrant, Pinecone, pgvector, Weaviate, Milvus, and ChromaDB. Performance, features, pricing, and when to use each.",
      "ctaModule": 4,
      "content": "\n          <h1>Vector Database Comparison: Which One Should You Use?</h1>\n          <p>Vector databases store and search high-dimensional embeddings for semantic similarity. Choosing the right one depends on your scale, deployment model, and feature requirements.</p>\n          <h2>Quick Comparison</h2>\n          <table><thead><tr><th>Database</th><th>Type</th><th>Best For</th><th>Open Source</th></tr></thead><tbody>\n            <tr><td>Qdrant</td><td>Dedicated vector DB</td><td>Production, high performance, filtering</td><td>Yes</td></tr>\n            <tr><td>pgvector</td><td>PostgreSQL extension</td><td>Existing PG users, small-medium scale</td><td>Yes</td></tr>\n            <tr><td>Pinecone</td><td>Managed cloud</td><td>Zero-ops, fast start</td><td>No</td></tr>\n            <tr><td>Weaviate</td><td>Multi-modal</td><td>Text + images, GraphQL API</td><td>Yes</td></tr>\n            <tr><td>Milvus</td><td>Distributed</td><td>Billion-scale datasets</td><td>Yes</td></tr>\n            <tr><td>ChromaDB</td><td>Embedded</td><td>Prototyping, local dev</td><td>Yes</td></tr>\n          </tbody></table>\n          <h2>Learn Vector Database Engineering</h2>\n          <p><a href=\"/courses/production-rag-systems-engineering/vector-databases-engineering\">Module 4</a> covers vector database internals, indexing algorithms, and production deployment.</p>\n        "
    },
    {
      "slug": "hybrid-search-explained",
      "title": "Hybrid Search Explained: Combining Keyword and Semantic Search for Better RAG",
      "description": "Hybrid search combines BM25 keyword search with vector semantic search. Learn why single-mode search fails and how hybrid retrieval improves RAG quality.",
      "ctaModule": 7,
      "content": "\n          <h1>Hybrid Search: Why Single-Mode Search Fails in RAG</h1>\n          <p><strong>Keyword search</strong> (BM25) finds exact term matches but misses synonyms and meaning. <strong>Semantic search</strong> (vectors) understands meaning but misses exact terms, acronyms, and proper nouns. <strong>Hybrid search</strong> combines both for dramatically better retrieval quality.</p>\n          <h2>How Hybrid Search Works</h2>\n          <ol>\n            <li>Query runs through both BM25 keyword index and vector similarity search</li>\n            <li>Results from both are merged using Reciprocal Rank Fusion (RRF) or weighted scoring</li>\n            <li>A reranker (cross-encoder model) reorders the combined results by relevance</li>\n            <li>Top results are passed to the LLM as context</li>\n          </ol>\n          <h2>Learn Hybrid Retrieval</h2>\n          <p><a href=\"/courses/production-rag-systems-engineering/advanced-retrieval-engineering\">Module 7</a> covers hybrid search, reranking, query expansion, and Graph RAG.</p>\n        "
    },
    {
      "slug": "ai-agents-explained",
      "title": "AI Agents Explained: From Simple RAG to Agentic AI Systems",
      "description": "AI agents go beyond basic RAG by reasoning, using tools, and executing multi-step plans. Learn agentic RAG, tool calling, memory systems, and LangGraph orchestration.",
      "ctaModule": 8,
      "content": "\n          <h1>AI Agents: Beyond Simple RAG</h1>\n          <p>Basic RAG retrieves documents and generates answers. <strong>Agentic RAG</strong> goes further - the AI decides WHAT to retrieve, WHEN to use tools, and HOW to break complex questions into steps.</p>\n          <h2>Agent Capabilities</h2>\n          <ul>\n            <li><strong>Tool calling:</strong> Agents can query databases, call APIs, run code, search the web</li>\n            <li><strong>Multi-step reasoning:</strong> Break complex questions into sub-tasks</li>\n            <li><strong>Memory:</strong> Remember context across conversations</li>\n            <li><strong>Multi-agent:</strong> Specialized agents collaborating on complex tasks</li>\n          </ul>\n          <h2>Learn AI Agent Engineering</h2>\n          <p><a href=\"/courses/production-rag-systems-engineering/ai-agents-agentic-rag\">Module 8</a> covers agent architectures, LangGraph, tool calling, and multi-agent orchestration.</p>\n        "
    }
  ],
  "modules": [
    {
      "number": 1,
      "title": "Introduction to AI & RAG Systems",
      "slug": "introduction-ai-rag-systems",
      "subtitle": "LLM fundamentals, hallucinations, and why retrieval-augmented generation changes everything",
      "duration": "3 hours",
      "objectives": [
        "Understand how LLMs work at a high level",
        "Learn about tokens, context windows, and their limitations",
        "Understand why LLMs hallucinate and how RAG solves it",
        "Compare vanilla LLM vs RAG responses"
      ],
      "labs": [
        {
          "title": "Run Your First LLM Application"
        },
        {
          "title": "Compare Vanilla LLM vs RAG"
        }
      ]
    },
    {
      "number": 2,
      "title": "Foundations of Search & Retrieval",
      "slug": "foundations-search-retrieval",
      "subtitle": "BM25, TF-IDF, vector search fundamentals, and similarity metrics",
      "duration": "3 hours",
      "objectives": [
        "Understand information retrieval fundamentals",
        "Implement keyword search with BM25 and TF-IDF",
        "Understand vector search and similarity metrics",
        "Compare keyword vs semantic search tradeoffs"
      ],
      "labs": [
        {
          "title": "Implement Keyword Search with BM25"
        },
        {
          "title": "Implement Semantic Search"
        }
      ]
    },
    {
      "number": 3,
      "title": "Embeddings Deep Dive",
      "slug": "embeddings-deep-dive",
      "subtitle": "Embedding models, optimization strategies, and choosing the right model for your use case",
      "duration": "3 hours",
      "objectives": [
        "Understand how text embedding models work",
        "Compare embedding models and their tradeoffs",
        "Optimize embeddings for production performance",
        "Choose the right embedding strategy for your data"
      ],
      "labs": [
        {
          "title": "Generate and Compare Embeddings"
        },
        {
          "title": "Embedding Model Selection"
        }
      ]
    },
    {
      "number": 4,
      "title": "Vector Databases Engineering",
      "slug": "vector-databases-engineering",
      "subtitle": "ANN algorithms, indexing, metadata filtering, and production deployment with Qdrant and pgvector",
      "duration": "4 hours",
      "objectives": [
        "Understand ANN algorithms (HNSW, IVF) and their tradeoffs",
        "Deploy and operate Qdrant for production vector search",
        "Use pgvector for PostgreSQL-integrated vector search",
        "Design metadata filtering and multi-tenancy strategies"
      ],
      "labs": [
        {
          "title": "Setup Qdrant and Build Semantic Search"
        },
        {
          "title": "Build Search APIs with pgvector"
        }
      ]
    },
    {
      "number": 5,
      "title": "Document Processing & Chunking",
      "slug": "document-processing-chunking",
      "subtitle": "Chunking strategies, data cleaning, metadata enrichment, and building ingestion pipelines",
      "duration": "3.5 hours",
      "objectives": [
        "Design chunking strategies for different document types",
        "Build robust document ingestion pipelines",
        "Implement metadata enrichment for better retrieval",
        "Handle PDFs, HTML, Markdown, and structured data"
      ],
      "labs": [
        {
          "title": "Build a Document Ingestion Pipeline"
        },
        {
          "title": "Compare Chunking Strategies"
        }
      ]
    },
    {
      "number": 6,
      "title": "Building Basic RAG Systems",
      "slug": "building-basic-rag-systems",
      "subtitle": "The complete retrieve-augment-generate pipeline with source attribution and citations",
      "duration": "3.5 hours",
      "objectives": [
        "Build a complete RAG pipeline from scratch",
        "Implement context injection and prompt augmentation",
        "Add source attribution and citations",
        "Handle edge cases: no results, conflicting sources, long context"
      ],
      "labs": [
        {
          "title": "Build a Complete RAG Chatbot"
        },
        {
          "title": "Add Citations and Source Attribution"
        }
      ]
    },
    {
      "number": 7,
      "title": "Advanced Retrieval Engineering",
      "slug": "advanced-retrieval-engineering",
      "subtitle": "Hybrid search, reranking, query expansion, and Graph RAG for production-quality retrieval",
      "duration": "4 hours",
      "objectives": [
        "Implement hybrid search (BM25 + vector)",
        "Add reranking with cross-encoder models",
        "Design query expansion and transformation strategies",
        "Understand Graph RAG for relationship-aware retrieval"
      ],
      "labs": [
        {
          "title": "Implement Hybrid Retrieval"
        },
        {
          "title": "Add Cross-Encoder Reranking"
        }
      ]
    },
    {
      "number": 8,
      "title": "AI Agents & Agentic RAG",
      "slug": "ai-agents-agentic-rag",
      "subtitle": "Tool calling, memory systems, multi-agent architectures, and LangGraph orchestration",
      "duration": "4 hours",
      "objectives": [
        "Build AI agents that reason and use tools",
        "Implement agentic RAG with dynamic retrieval",
        "Design multi-agent systems for complex tasks",
        "Use LangGraph for agent orchestration"
      ],
      "labs": [
        {
          "title": "Build a Multi-Tool Agent"
        },
        {
          "title": "Multi-Agent Orchestration with LangGraph"
        }
      ]
    },
    {
      "number": 9,
      "title": "Production RAG Architecture",
      "slug": "production-rag-architecture",
      "subtitle": "Scaling, multi-tenancy, caching, API gateways, and high-availability RAG deployments",
      "duration": "4 hours",
      "objectives": [
        "Design scalable RAG architectures for production traffic",
        "Implement multi-tenant retrieval with data isolation",
        "Add caching layers for cost and latency optimization",
        "Build production RAG APIs with FastAPI"
      ],
      "labs": [
        {
          "title": "Deploy Scalable RAG API"
        },
        {
          "title": "Implement Multi-Tenant RAG"
        }
      ]
    },
    {
      "number": 10,
      "title": "RAG Evaluation & Quality Engineering",
      "slug": "rag-evaluation-quality-engineering",
      "subtitle": "Hallucination detection, retrieval metrics, groundedness scoring, and evaluation frameworks",
      "duration": "3.5 hours",
      "objectives": [
        "Measure retrieval quality with precision and recall",
        "Detect and score hallucinations in generated answers",
        "Build automated evaluation pipelines",
        "Design continuous quality monitoring for production RAG"
      ],
      "labs": [
        {
          "title": "Evaluate Retrieval Quality"
        },
        {
          "title": "Build a Hallucination Detection Pipeline"
        }
      ]
    },
    {
      "number": 11,
      "title": "AI Observability Engineering",
      "slug": "ai-observability-engineering",
      "subtitle": "LLM tracing, token monitoring, cost tracking, and production AI telemetry",
      "duration": "3 hours",
      "objectives": [
        "Instrument RAG systems with OpenTelemetry",
        "Trace requests through the full RAG pipeline",
        "Monitor token usage and LLM costs",
        "Build AI-specific observability dashboards"
      ],
      "labs": [
        {
          "title": "Add Tracing to Your RAG Pipeline"
        },
        {
          "title": "Build Cost and Quality Dashboards"
        }
      ]
    },
    {
      "number": 12,
      "title": "Security for RAG Systems",
      "slug": "security-rag-systems",
      "subtitle": "Prompt injection defense, data leakage prevention, vector DB security, and AI access control",
      "duration": "3.5 hours",
      "objectives": [
        "Defend against prompt injection attacks",
        "Prevent data leakage across tenants",
        "Secure vector database access with authentication",
        "Implement AI-specific access control policies"
      ],
      "labs": [
        {
          "title": "Prompt Injection Defense"
        },
        {
          "title": "Secure Multi-Tenant Vector APIs"
        }
      ]
    },
    {
      "number": 13,
      "title": "Deploying RAG Systems",
      "slug": "deploying-rag-systems",
      "subtitle": "Dockerizing AI systems, Kubernetes for AI, GPU infrastructure, and CI/CD for AI applications",
      "duration": "3.5 hours",
      "objectives": [
        "Containerize RAG systems with Docker",
        "Deploy on Kubernetes with proper resource management",
        "Configure GPU inference for embedding models",
        "Build CI/CD pipelines for AI applications"
      ],
      "labs": [
        {
          "title": "Deploy RAG on Kubernetes"
        },
        {
          "title": "CI/CD with Quality Gates"
        }
      ]
    },
    {
      "number": 14,
      "title": "Advanced RAG Architectures",
      "slug": "advanced-rag-architectures",
      "subtitle": "Multimodal RAG, federated retrieval, personalized retrieval, and graph-based architectures",
      "duration": "3.5 hours",
      "objectives": [
        "Build multimodal RAG with text + images",
        "Design federated retrieval across multiple sources",
        "Implement personalized retrieval based on user context",
        "Architect graph-based retrieval for relational data"
      ],
      "labs": [
        {
          "title": "Build a Multimodal Retrieval Pipeline"
        },
        {
          "title": "Graph-Based Retrieval"
        }
      ]
    },
    {
      "number": 15,
      "title": "AI Infrastructure & Future Systems",
      "slug": "ai-infrastructure-future-systems",
      "subtitle": "MCP architecture, AI runtime systems, agent platforms, and workload identity for AI",
      "duration": "3 hours",
      "objectives": [
        "Understand MCP (Model Context Protocol) architecture",
        "Design AI runtime systems for production",
        "Secure AI agents with workload identity (SPIFFE)",
        "Build future-proof AI infrastructure"
      ],
      "labs": [
        {
          "title": "MCP Server Integration"
        },
        {
          "title": "Secure AI Agents with Identity"
        }
      ]
    },
    {
      "number": 16,
      "title": "Production Capstone Project",
      "slug": "production-capstone-project",
      "subtitle": "Build a production-grade enterprise RAG platform with all components end-to-end",
      "duration": "5 hours",
      "objectives": [
        "Build a complete enterprise RAG platform",
        "Integrate all components: ingestion, retrieval, generation, security, observability",
        "Deploy on Kubernetes with full production architecture",
        "Test with realistic enterprise scenarios"
      ],
      "labs": [
        {
          "title": "Capstone: Production RAG Platform"
        }
      ]
    }
  ]
};
