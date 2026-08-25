import type { Course } from './course.model';

export interface CourseCatalogEntry {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  totalDuration: string;
  level: string;
  tags: readonly string[];
  category: string;
  moduleCount: number;
  labCount: number;
  labDelivery: 'github' | 'inline';
  instructor: { name: string };
  seoPageSlugs: readonly string[];
}

export function toCourseCatalogEntry(course: Course): CourseCatalogEntry {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    subtitle: course.subtitle,
    excerpt: course.excerpt,
    totalDuration: course.totalDuration,
    level: course.level,
    tags: course.tags,
    category: course.category,
    moduleCount: course.modules.length,
    labCount: course.modules.reduce((total, module) => total + module.labs.length, 0),
    labDelivery: course.labDelivery ?? 'github',
    instructor: { name: course.instructor.name },
    seoPageSlugs: course.seoPages.map(page => page.slug),
  };
}

export const COURSE_CATALOG: readonly CourseCatalogEntry[] = [
  {
    id: 'course-1',
    title: 'Mastering SPIFFE & SPIRE: Zero Trust for Cloud Native Systems',
    slug: 'mastering-spiffe-spire',
    subtitle: 'Learn modern cloud-native identity security and become the engineer who secures production Kubernetes clusters - for free.',
    excerpt: 'Go from "what is workload identity?" to deploying production-grade SPIRE on Kubernetes with mTLS, OPA policy enforcement, and multi-cluster federation. 13 modules, 30 labs, completely free.',
    totalDuration: '40+ hours',
    level: 'Intermediate to Advanced',
    tags: ['SPIFFE', 'SPIRE', 'Zero Trust', 'Kubernetes', 'mTLS', 'PKI', 'Service Mesh', 'OPA', 'Cloud Native', 'CNCF', 'Workload Identity', 'Security'],
    category: 'devops',
    moduleCount: 13,
    labCount: 30,
    labDelivery: 'github',
    instructor: { name: 'Vishal Anand' },
    seoPageSlugs: ['spiffe-spire', 'what-is-spire', 'workload-identity', 'zero-trust-kubernetes', 'spire-kubernetes-tutorial', 'spiffe-mtls-service-mesh', 'machine-identity-management'],
  },
  {
    id: 'cloud-native-security',
    title: 'Cloud Native Security Engineering: Securing Kubernetes, Workloads, APIs & Zero Trust Systems',
    slug: 'cloud-native-security-engineering',
    subtitle: 'From passwords and perimeter trust to workload identity, Zero Trust, runtime protection, and production cloud-native security architecture',
    excerpt: 'Secure Kubernetes from attack to defense. Learn workload identity (SPIFFE/SPIRE), Zero Trust (mTLS), policy-as-code (OPA/Kyverno), runtime protection (Falco/eBPF), and supply chain security (Sigstore/SLSA). 16 modules, 32 labs, completely free.',
    totalDuration: '50+ hours',
    level: 'Beginner to Advanced',
    tags: ['Cloud Native Security', 'Kubernetes Security', 'Zero Trust', 'Workload Identity', 'SPIFFE', 'SPIRE', 'OPA', 'Falco', 'eBPF', 'Sigstore', 'Supply Chain Security', 'Service Mesh', 'Istio', 'Envoy', 'Vault', 'Runtime Security', 'Policy-as-Code', 'Platform Security', 'Machine Identity', 'AI Infrastructure Security', 'CNCF', 'mTLS', 'Container Security', 'CI/CD Security'],
    category: 'devops',
    moduleCount: 16,
    labCount: 32,
    labDelivery: 'github',
    instructor: { name: 'Vishal Anand' },
    seoPageSlugs: ['cloud-native-security-explained', 'kubernetes-runtime-security', 'kubernetes-supply-chain-security', 'secure-service-to-service-communication'],
  },
  {
    id: 'production-rag',
    title: 'Production-Grade RAG Systems Engineering',
    slug: 'production-rag-systems-engineering',
    subtitle: 'Build scalable, reliable, observable, and secure Retrieval-Augmented Generation systems - not another chatbot tutorial',
    excerpt: 'Go beyond toy demos. Learn how production RAG systems are architected: embeddings, vector databases, hybrid retrieval, reranking, AI agents, evaluation, observability, security, and Kubernetes deployment. 16 modules, 31 labs, free.',
    totalDuration: '50+ hours',
    level: 'Beginner to Advanced',
    tags: ['RAG', 'LLM', 'Vector Database', 'Embeddings', 'Semantic Search', 'AI Agents', 'LangChain', 'LangGraph', 'Qdrant', 'pgvector', 'FastAPI', 'Python', 'AI Observability', 'Prompt Injection', 'Kubernetes', 'AI Security', 'Hybrid Search', 'Reranking', 'Graph RAG', 'MCP', 'Production AI', 'OpenTelemetry'],
    category: 'ai',
    moduleCount: 16,
    labCount: 31,
    labDelivery: 'github',
    instructor: { name: 'Vishal Anand' },
    seoPageSlugs: ['what-is-rag', 'vector-database-comparison', 'hybrid-search-explained', 'ai-agents-explained'],
  },
  {
    id: '4',
    title: 'Distributed Systems Engineering: Building Scalable, Reliable & Secure Systems',
    slug: 'distributed-systems-engineering',
    subtitle: 'A production-grade, beginner-friendly but deeply practical course on how real distributed systems actually work - from foundations through Kubernetes, observability, Zero Trust, and real-world failure recovery.',
    excerpt: 'Learn how production distributed systems actually work. CAP, consensus (Raft/Paxos), distributed data, scalability, reliability, Zero Trust, observability, Kubernetes-native architecture, and real failure scenarios - taught from operational reality, not textbooks. 12 modules, hands-on labs, completely free.',
    totalDuration: '50+ hours',
    level: 'Beginner to Advanced',
    tags: ['Distributed Systems', 'Cloud Native', 'Kubernetes', 'Architecture', 'Scalability', 'Reliability', 'Zero Trust', 'SPIFFE', 'SPIRE', 'mTLS', 'Observability', 'OpenTelemetry', 'Raft', 'Consensus', 'Kafka', 'Service Mesh', 'Production Engineering', 'SRE', 'Platform Engineering'],
    category: 'backend',
    moduleCount: 12,
    labCount: 36,
    labDelivery: 'github',
    instructor: { name: 'Vishal Anand' },
    seoPageSlugs: ['distributed-systems-engineering-explained', 'how-distributed-systems-work'],
  },
  {
    id: 'course-6',
    title: 'Centralized Authentication and Authorization with Envoy',
    slug: 'centralized-authentication-authorization-envoy',
    subtitle: 'Build a Google-style one-login platform for Kubernetes products using plain Envoy, JWT/JWKS, external authorization, SSO, service tokens, and federated credentials.',
    excerpt: 'Learn centralized authentication and authorization from beginner basics to production design. Use plain Envoy as the enforcement point for Kubernetes products, validate JWTs with JWKS, delegate SSO and policy through ext_authz, and design secure token, header, audit, and scaling patterns.',
    totalDuration: '12+ hours',
    level: 'Beginner to Production Grade',
    tags: ['Envoy', 'Authentication', 'Authorization', 'SSO', 'OIDC', 'SAML', 'JWT', 'JWKS', 'OAuth 2.0', 'Kubernetes', 'API Gateway', 'Access Tokens', 'Service Tokens', 'Federated Credentials', 'Zero Trust', 'Platform Engineering', 'Security'],
    category: 'security',
    moduleCount: 8,
    labCount: 8,
    labDelivery: 'inline',
    instructor: { name: 'Vishal Anand' },
    seoPageSlugs: ['centralized-authentication-envoy-course', 'envoy-jwt-jwks-course', 'sso-envoy-kubernetes-course', 'kubernetes-product-auth-architecture'],
  },
  {
    id: '5',
    title: 'Production Analytics Engineering with dbt: Metrics, Semantic Layers & Lineage',
    slug: 'production-analytics-engineering-dbt',
    subtitle: 'From raw tables to trusted business metrics, step by step. Beginner-friendly, interactive, and built for freshers learning production data work.',
    excerpt: 'Learn analytics engineering from scratch: dbt models, table grain, staging, marts, tests, freshness, metrics, semantic layers, MetricFlow, lineage, CI/CD, and data incident debugging. 16 modules, inline labs, no repository required.',
    totalDuration: 'About 28 hours',
    level: 'Beginner to Intermediate',
    tags: ['Analytics Engineering', 'dbt', 'Semantic Layer', 'MetricFlow', 'Metrics Layer', 'Data Lineage', 'Data Quality', 'Data Modeling', 'SQL', 'Data Engineering', 'Data Contracts', 'Data Observability', 'CI/CD', 'AI Analytics', 'Business Intelligence'],
    category: 'data-engineering',
    moduleCount: 16,
    labCount: 16,
    labDelivery: 'inline',
    instructor: { name: 'Vishal Anand' },
    seoPageSlugs: ['analytics-engineering-course', 'dbt-course-beginner', 'semantic-layer-course', 'metrics-layer-course', 'data-lineage-dbt-course', 'dbt-data-quality-testing-course'],
  },
  {
    id: 'course-7',
    title: 'Malware Analysis and Defense for Developers',
    slug: 'malware-analysis-defense',
    subtitle: 'Analyze evidence safely, engineer useful detections, contain incidents, and build software that is harder to compromise.',
    excerpt: 'A defense-first malware analysis course for developers covering safe triage, behavior evidence, YARA, Sigma, incident response, and secure software delivery.',
    totalDuration: '120 hours',
    level: 'Beginner bridge to intermediate',
    tags: ['Malware analysis', 'Detection engineering', 'YARA', 'Sigma', 'Incident response', 'Secure development', 'Supply chain security'],
    category: 'Security Engineering',
    moduleCount: 17,
    labCount: 17,
    labDelivery: 'inline',
    instructor: { name: 'Vishal Anand' },
    seoPageSlugs: ['malware-analysis-for-developers', 'malware-detection-engineering', 'building-malware-resistant-software'],
  },
];

export function findCourseCatalogEntry(slug: string): CourseCatalogEntry | undefined {
  return COURSE_CATALOG.find(course => course.slug === slug);
}

export function findCourseCatalogEntryBySeoSlug(seoSlug: string): CourseCatalogEntry | undefined {
  return COURSE_CATALOG.find(course => course.seoPageSlugs.includes(seoSlug));
}
