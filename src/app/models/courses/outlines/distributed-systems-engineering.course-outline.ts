import type { CourseOutline } from '../../course-outline';

export const DISTRIBUTED_SYSTEMS_ENGINEERING_OUTLINE: CourseOutline = {
  "id": "4",
  "slug": "distributed-systems-engineering",
  "title": "Distributed Systems Engineering: Building Scalable, Reliable & Secure Systems",
  "subtitle": "A production-grade, beginner-friendly but deeply practical course on how real distributed systems actually work - from foundations through Kubernetes, observability, Zero Trust, and real-world failure recovery.",
  "excerpt": "Learn how production distributed systems actually work. CAP, consensus (Raft/Paxos), distributed data, scalability, reliability, Zero Trust, observability, Kubernetes-native architecture, and real failure scenarios - taught from operational reality, not textbooks. 12 modules, hands-on labs, completely free.",
  "description": "The most practical distributed systems course you can take for free. Twelve modules walk you from foundations (CAP, latency, fault tolerance) through networking (gRPC, retries, load balancing), event-driven systems (Kafka, NATS), distributed data (replication, sharding, quorums), consensus (Raft, etcd, leader election), scalability (autoscaling, caching, rate limiting), reliability engineering (circuit breakers, chaos), Zero Trust (SPIFFE/SPIRE, mTLS, OPA), observability (OpenTelemetry, tracing), Kubernetes cloud-native architecture, real failure scenarios (split brain, retry storms, cache stampede), and production system design. Architecture-first. Diagram-heavy. Hands-on labs every module. Built for engineers who operate real systems.",
  "totalDuration": "50+ hours",
  "level": "Beginner to Advanced",
  "category": "backend",
  "tags": [
    "Distributed Systems",
    "Cloud Native",
    "Kubernetes",
    "Architecture",
    "Scalability",
    "Reliability",
    "Zero Trust",
    "SPIFFE",
    "SPIRE",
    "mTLS",
    "Observability",
    "OpenTelemetry",
    "Raft",
    "Consensus",
    "Kafka",
    "Service Mesh",
    "Production Engineering",
    "SRE",
    "Platform Engineering"
  ],
  "targetAudience": [
    "Backend Engineers stepping into distributed systems work",
    "Platform Engineers building internal developer platforms",
    "DevOps Engineers operating distributed infrastructure",
    "SREs responsible for production reliability",
    "Software architects designing scalable systems",
    "Engineers preparing for senior/staff-level system design",
    "Beginners who want a structured foundation in modern distributed systems"
  ],
  "instructor": {
    "name": "Vishal Anand",
    "title": "Senior Product Engineer & Tech Lead",
    "bio": "Senior Product Engineer and Tech Lead with hands-on experience building production distributed systems at scale. Creator of DRF API Logger (1.6M+ downloads) and the Mastering SPIFFE & SPIRE course. Teaches engineering from operational reality - no theory without code, no concepts without labs.",
    "github": "https://github.com/vishalanandl177",
    "achievements": [
      "Creator of DRF API Logger - 1.6M+ downloads",
      "Author of Mastering SPIFFE & SPIRE - comprehensive workload identity course",
      "Author of Cloud Native Security Engineering - 16-module free course",
      "Builds and operates production distributed systems"
    ]
  },
  "seoPages": [
    {
      "slug": "distributed-systems-engineering-explained",
      "title": "Distributed Systems Engineering: A Practical Walkthrough",
      "description": "A production-engineering walkthrough of distributed systems: CAP, consensus, replication, scalability, observability, and Zero Trust. Free 12-module course.",
      "ctaModule": 1,
      "content": "<h1>Distributed Systems Engineering: A Practical Walkthrough</h1><p>Distributed systems engineering is the discipline of building software that survives partial failure, scales horizontally, and stays observable across many machines. This is the field most modern infrastructure runs on - Kubernetes, Kafka, Cassandra, Spanner, every cloud platform.</p><p>The free <a href=\"/courses/distributed-systems-engineering\">Distributed Systems Engineering course</a> walks you through 12 modules covering everything from CAP and latency to consensus, observability, Zero Trust, Kubernetes-native architecture, and real failure scenarios.</p>"
    },
    {
      "slug": "how-distributed-systems-work",
      "title": "How Distributed Systems Actually Work in Production",
      "description": "A clear, practical explanation of how distributed systems work: replication, consensus, partitioning, observability, failure recovery - taught from real production engineering, not textbooks.",
      "ctaModule": 1,
      "content": "<h1>How Distributed Systems Actually Work</h1><p>Real production distributed systems are built on a small set of foundational ideas: state replication for durability, consensus for agreement, partitioning for scale, observability for debugging, and intentional failure handling for reliability.</p><p>The free <a href=\"/courses/distributed-systems-engineering\">Distributed Systems Engineering course</a> teaches all of these from operational reality - with hands-on labs every module.</p>"
    }
  ],
  "faqs": [
    {
      "question": "Is this course beginner-friendly?",
      "answer": "Yes. Module 1 builds the mental model from scratch, and every subsequent module begins with foundational concepts before going production-deep. You should be comfortable with basic programming and Linux command line; everything distributed-systems-specific is taught in the course."
    },
    {
      "question": "How is this different from Designing Data-Intensive Applications?",
      "answer": "DDIA is the canonical book on distributed-systems theory and the algorithms layer. This course focuses on the operational and production-engineering layer: how Kubernetes changes the game, how Zero Trust integrates, how to run real systems with observability, how failure scenarios actually unfold. Read DDIA alongside this course; the two complement each other."
    },
    {
      "question": "Does the course require Kubernetes experience?",
      "answer": "No. Modules 1&ndash;9 are platform-agnostic. Module 10 introduces Kubernetes from the ground up, and Modules 11&ndash;12 use Kubernetes as the deployment substrate. If you already operate Kubernetes, you can skim Module 10."
    },
    {
      "question": "Is the course free?",
      "answer": "Yes. Every module, every lab, and every diagram is 100% free and ad-free. No paywall, no signup wall."
    },
    {
      "question": "How do the labs work?",
      "answer": "Each lab includes a self-contained scenario you can reproduce on a laptop with Docker or kind (Kubernetes in Docker). Lab repos are linked from each module. Labs are 30&ndash;90 minutes each and produce concrete operational outputs you can show in interviews."
    },
    {
      "question": "How does this course relate to the Mastering SPIFFE & SPIRE course?",
      "answer": "They are complementary. Mastering SPIFFE & SPIRE goes deep on workload identity. Module 8 of this course introduces SPIFFE/SPIRE and Zero Trust at the level you need to design distributed-systems security. Take the SPIFFE & SPIRE course after Module 8 if you want the full identity-system depth."
    }
  ],
  "modules": [
    {
      "number": 1,
      "title": "Foundations of Distributed Systems",
      "slug": "foundations-distributed-systems",
      "subtitle": "What a distributed system actually is, why we build them, and the trade-offs that define every design decision after this point.",
      "duration": "3 hours",
      "objectives": [
        "Define a distributed system from a production-engineering perspective",
        "Understand why distributed systems replace monoliths and what it costs you",
        "Internalise CAP and PACELC as decision frameworks, not academic theorems",
        "Reason about latency, availability, fault tolerance, and consistency as a coupled system",
        "Build the mental model that every later module depends on"
      ],
      "labs": [
        {
          "title": "Lab 1.1 - Latency Simulation Across Service Boundaries"
        },
        {
          "title": "Lab 1.2 - Failure Isolation Test"
        },
        {
          "title": "Lab 1.3 - Availability Math"
        }
      ]
    },
    {
      "number": 2,
      "title": "Networking & Distributed Communication",
      "slug": "networking-distributed-communication",
      "subtitle": "How services actually talk: TCP, HTTP/2, gRPC, service discovery, load balancing, retries, and the timeout discipline that keeps systems from melting.",
      "duration": "4 hours",
      "objectives": [
        "Read a TCP/IP packet flow and explain what each layer does in production",
        "Compare HTTP/1.1, HTTP/2, and gRPC and pick the right one per workload",
        "Implement service discovery without inventing a worse DNS",
        "Design retry, timeout, and load-balancing policies that survive load",
        "Diagnose and prevent retry storms before they cause outages"
      ],
      "labs": [
        {
          "title": "Lab 2.1 - gRPC vs REST Latency Bake-off"
        },
        {
          "title": "Lab 2.2 - Retry Storm Reproduction and Defence"
        },
        {
          "title": "Lab 2.3 - DNS-Caused Outage Triage"
        }
      ]
    },
    {
      "number": 3,
      "title": "Event-Driven & Asynchronous Systems",
      "slug": "event-driven-asynchronous-systems",
      "subtitle": "How Kafka, RabbitMQ, NATS, and pub/sub patterns let services decouple in time and scale - and the failure modes that come with them.",
      "duration": "4 hours",
      "objectives": [
        "Choose between message queues, pub/sub, and event streaming for a given workload",
        "Reason about partitioning, ordering, and consumer groups in Kafka",
        "Implement backpressure correctly so producers do not melt consumers",
        "Design exactly-once semantics where you actually need them - and at-least-once where you do not",
        "Diagnose the canonical event-pipeline outages: lag spikes, rebalances, and stuck consumers"
      ],
      "labs": [
        {
          "title": "Lab 3.1 - Kafka Event Pipeline End-to-End"
        },
        {
          "title": "Lab 3.2 - Backpressure in a Reactive Pipeline"
        },
        {
          "title": "Lab 3.3 - Idempotent Consumer with Dedup"
        }
      ]
    },
    {
      "number": 4,
      "title": "Distributed Data Management",
      "slug": "distributed-data-management",
      "subtitle": "How modern systems split, replicate, and reconcile data across many machines - replication, sharding, quorums, consistency models, and the distributed databases that implement them.",
      "duration": "5 hours",
      "objectives": [
        "Pick between hash and range partitioning based on access patterns",
        "Design replication strategies (single-leader, multi-leader, leaderless) and their failover behaviour",
        "Apply quorum math (W + R > N) to choose consistency levels",
        "Read a Cassandra / DynamoDB / PostgreSQL replication topology and predict its failure modes",
        "Avoid the classic distributed-data anti-patterns: hot partitions, replication lag, write conflicts"
      ],
      "labs": [
        {
          "title": "Lab 4.1 - Postgres Streaming Replication + Failover"
        },
        {
          "title": "Lab 4.2 - Cassandra Quorum Behaviour"
        },
        {
          "title": "Lab 4.3 - Hot Partition Reproduction"
        }
      ]
    },
    {
      "number": 5,
      "title": "Consensus & Coordination",
      "slug": "consensus-coordination",
      "subtitle": "How distributed nodes agree - Raft, Paxos, leader election, distributed locking, and the etcd / ZooKeeper / Consul systems that production runs on.",
      "duration": "5 hours",
      "objectives": [
        "Explain consensus as a problem and why it is fundamental to CP systems",
        "Walk through Raft leader election, log replication, and safety in detail",
        "Compare Raft and Paxos and pick between them in practice",
        "Implement distributed locking correctly (with fencing tokens, not just SETNX)",
        "Operate etcd, ZooKeeper, or Consul without taking down your cluster"
      ],
      "labs": [
        {
          "title": "Lab 5.1 - etcd Cluster Bootstrap and Failover"
        },
        {
          "title": "Lab 5.2 - Distributed Lock with Fencing Token"
        },
        {
          "title": "Lab 5.3 - Leader Election in Application Code"
        }
      ]
    },
    {
      "number": 6,
      "title": "Scalability Engineering",
      "slug": "scalability-engineering",
      "subtitle": "Horizontal scaling, autoscaling, caching, CDNs, rate limiting - how production systems handle 10x and 100x traffic without 10x and 100x cost.",
      "duration": "4 hours",
      "objectives": [
        "Design stateless services that scale horizontally without coordination",
        "Pick the right caching strategy (cache-aside, write-through, write-back) for the workload",
        "Configure Kubernetes HPA, VPA, and Cluster Autoscaler so they actually work",
        "Implement distributed rate limiting that survives multi-region",
        "Identify the scalability bottleneck before it becomes the outage"
      ],
      "labs": [
        {
          "title": "Lab 6.1 - HPA on Custom Metrics"
        },
        {
          "title": "Lab 6.2 - Cache-Aside with Stampede Protection"
        },
        {
          "title": "Lab 6.3 - Distributed Rate Limiter (Redis Lua)"
        }
      ]
    },
    {
      "number": 7,
      "title": "Reliability & Failure Engineering",
      "slug": "reliability-failure-engineering",
      "subtitle": "Circuit breakers, bulkheads, graceful degradation, and chaos engineering - how reliability is engineered, not hoped for.",
      "duration": "4 hours",
      "objectives": [
        "Design retry policies that survive a downstream brownout",
        "Implement circuit breakers and understand the half-open state",
        "Apply bulkhead isolation to prevent noisy neighbours",
        "Build graceful degradation paths that turn outages into reduced functionality",
        "Run chaos experiments without breaking production"
      ],
      "labs": [
        {
          "title": "Lab 7.1 - Circuit Breaker in Action"
        },
        {
          "title": "Lab 7.2 - Chaos Mesh on Kubernetes"
        },
        {
          "title": "Lab 7.3 - Graceful Degradation Architecture"
        }
      ]
    },
    {
      "number": 8,
      "title": "Distributed Security & Zero Trust",
      "slug": "distributed-security-zero-trust",
      "subtitle": "How modern distributed systems authenticate workload-to-workload - mTLS, SPIFFE/SPIRE, OPA, and the Zero Trust patterns that replace network-perimeter security.",
      "duration": "5 hours",
      "objectives": [
        "Explain Zero Trust as an architectural principle, not a product",
        "Bootstrap mTLS between services with short-lived, automatically-rotated credentials",
        "Use SPIFFE/SPIRE to issue cryptographic workload identity at scale",
        "Enforce authorization with OPA / Rego at admission and at request time",
        "Federate trust across clusters and clouds without leaking secrets"
      ],
      "labs": [
        {
          "title": "Lab 8.1 - mTLS Between Two Services with SPIFFE"
        },
        {
          "title": "Lab 8.2 - OPA Authorization at Envoy"
        },
        {
          "title": "Lab 8.3 - SPIFFE Federation Across Two Clusters"
        }
      ]
    },
    {
      "number": 9,
      "title": "Observability & Debugging",
      "slug": "observability-debugging",
      "subtitle": "Distributed tracing, metrics, structured logging, correlation IDs, and the OpenTelemetry / Prometheus / Grafana / Jaeger stack that lets you debug systems you cannot SSH into.",
      "duration": "4 hours",
      "objectives": [
        "Instrument a service with OpenTelemetry traces, metrics, and logs",
        "Correlate a single request across many services via trace IDs",
        "Build the four golden signals (latency, traffic, errors, saturation) in Prometheus",
        "Read a distributed trace and identify where latency accrues",
        "Build the runbook a 3am on-call engineer actually uses"
      ],
      "labs": [
        {
          "title": "Lab 9.1 - Trace a Request End-to-End"
        },
        {
          "title": "Lab 9.2 - Build the Four Golden Signals"
        },
        {
          "title": "Lab 9.3 - Incident Triage from Telemetry"
        }
      ]
    },
    {
      "number": 10,
      "title": "Kubernetes & Cloud Native Distributed Systems",
      "slug": "kubernetes-cloud-native-distributed-systems",
      "subtitle": "How Kubernetes changes distributed-systems design - cluster architecture, service mesh, ingress, autoscaling, and the operational primitives that everything else now sits on top of.",
      "duration": "5 hours",
      "objectives": [
        "Read a Kubernetes cluster architecture (control plane, kubelet, kube-proxy, etcd, CNI)",
        "Use Services, Ingress, and Gateway API correctly for distributed workloads",
        "Compare service meshes (Istio, Linkerd, Cilium) and pick one with eyes open",
        "Run StatefulSets, PVCs, and storage classes for stateful workloads",
        "Operate workloads with HPA, VPA, Karpenter, and PodDisruptionBudgets in production"
      ],
      "labs": [
        {
          "title": "Lab 10.1 - Kind Cluster from Scratch"
        },
        {
          "title": "Lab 10.2 - Linkerd Service Mesh"
        },
        {
          "title": "Lab 10.3 - StatefulSet for a Database"
        }
      ]
    },
    {
      "number": 11,
      "title": "Real-World Failure Scenarios",
      "slug": "real-world-failure-scenarios",
      "subtitle": "Retry storms, cache stampedes, split brain, hot partitions, queue overload, DNS outages, service-discovery failures, cascading failures - the incidents that actually happen, and how to engineer them away.",
      "duration": "5 hours",
      "objectives": [
        "Recognise the canonical distributed-systems failure modes by their telemetry signatures",
        "Reproduce each failure in a controlled lab so the pattern is in your hands",
        "Apply the architectural defences that make each failure hard or impossible",
        "Write incident runbooks that an on-call engineer can actually use at 3am",
        "Run a post-incident review that produces lasting improvements"
      ],
      "labs": [
        {
          "title": "Lab 11.1 - Reproduce a Retry Storm"
        },
        {
          "title": "Lab 11.2 - Cache Stampede on Expiry"
        },
        {
          "title": "Lab 11.3 - Post-Incident Review"
        }
      ]
    },
    {
      "number": 12,
      "title": "Production System Design & Capstone",
      "slug": "production-system-design-capstone",
      "subtitle": "Multi-region architecture, disaster recovery, capacity planning, real production tradeoffs - and a capstone that integrates every module into one system.",
      "duration": "6 hours",
      "objectives": [
        "Design a multi-region architecture and reason about its failure modes",
        "Plan disaster recovery: RPO, RTO, runbooks, tested restoration",
        "Design for cost - capacity reservations, autoscaling, regional placement",
        "Read production architecture diagrams (Kafka, Kubernetes, Netflix, Uber, Google) and identify the trade-offs",
        "Design a complete production system as the capstone and defend the choices"
      ],
      "labs": [
        {
          "title": "Lab 12.1 - Multi-Region Active-Active Demo"
        },
        {
          "title": "Lab 12.2 - DR Drill"
        },
        {
          "title": "Lab 12.3 - Capstone Architecture Document"
        }
      ]
    }
  ]
};
