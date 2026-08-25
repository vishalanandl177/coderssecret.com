import type { Course } from '../course.model';

export const DISTRIBUTED_SYSTEMS_ENGINEERING_COURSE: Course = {
    id: '4',
    slug: 'distributed-systems-engineering',
    title: 'Distributed Systems Engineering: Building Scalable, Reliable & Secure Systems',
    subtitle: 'A production-grade, beginner-friendly but deeply practical course on how real distributed systems actually work - from foundations through Kubernetes, observability, Zero Trust, and real-world failure recovery.',
    excerpt: 'Learn how production distributed systems actually work. CAP, consensus (Raft/Paxos), distributed data, scalability, reliability, Zero Trust, observability, Kubernetes-native architecture, and real failure scenarios - taught from operational reality, not textbooks. 12 modules, hands-on labs, completely free.',
    description: 'The most practical distributed systems course you can take for free. Twelve modules walk you from foundations (CAP, latency, fault tolerance) through networking (gRPC, retries, load balancing), event-driven systems (Kafka, NATS), distributed data (replication, sharding, quorums), consensus (Raft, etcd, leader election), scalability (autoscaling, caching, rate limiting), reliability engineering (circuit breakers, chaos), Zero Trust (SPIFFE/SPIRE, mTLS, OPA), observability (OpenTelemetry, tracing), Kubernetes cloud-native architecture, real failure scenarios (split brain, retry storms, cache stampede), and production system design. Architecture-first. Diagram-heavy. Hands-on labs every module. Built for engineers who operate real systems.',
    totalDuration: '50+ hours',
    level: 'Beginner to Advanced',
    category: 'backend',
    tags: ['Distributed Systems', 'Cloud Native', 'Kubernetes', 'Architecture', 'Scalability', 'Reliability', 'Zero Trust', 'SPIFFE', 'SPIRE', 'mTLS', 'Observability', 'OpenTelemetry', 'Raft', 'Consensus', 'Kafka', 'Service Mesh', 'Production Engineering', 'SRE', 'Platform Engineering'],
    targetAudience: [
      'Backend Engineers stepping into distributed systems work',
      'Platform Engineers building internal developer platforms',
      'DevOps Engineers operating distributed infrastructure',
      'SREs responsible for production reliability',
      'Software architects designing scalable systems',
      'Engineers preparing for senior/staff-level system design',
      'Beginners who want a structured foundation in modern distributed systems',
    ],
    instructor: {
      name: 'Vishal Anand',
      title: 'Senior Product Engineer & Tech Lead',
      bio: 'Senior Product Engineer and Tech Lead with hands-on experience building production distributed systems at scale. Creator and maintainer of DRF API Logger, an Apache-2.0 package listed in Django REST Framework\'s third-party packages documentation, and author of the Mastering SPIFFE & SPIRE course. Teaches engineering from operational reality - no theory without code, no concepts without labs.',
      github: 'https://github.com/vishalanandl177',
      achievements: [
        'Maintainer of DRF API Logger - production API logging and profiling',
        'Author of Mastering SPIFFE & SPIRE - comprehensive workload identity course',
        'Author of Cloud Native Security Engineering - 16-module free course',
        'Builds and operates production distributed systems',
      ],
    },
    modules: [
      {
        number: 1,
        title: 'Foundations of Distributed Systems',
        slug: 'foundations-distributed-systems',
        subtitle: 'What a distributed system actually is, why we build them, and the trade-offs that define every design decision after this point.',
        duration: '3 hours',
        objectives: [
          'Define a distributed system from a production-engineering perspective',
          'Understand why distributed systems replace monoliths and what it costs you',
          'Internalise CAP and PACELC as decision frameworks, not academic theorems',
          'Reason about latency, availability, fault tolerance, and consistency as a coupled system',
          'Build the mental model that every later module depends on',
        ],
        svgDiagram: '<svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="420" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">MONOLITH vs DISTRIBUTED</text><rect x="40" y="60" width="320" height="320" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="200" y="86" text-anchor="middle" fill="#60a5fa" font-size="12" font-weight="bold">MONOLITH</text><rect x="80" y="110" width="240" height="240" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6"/><text x="200" y="138" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Single Process</text><text x="200" y="170" text-anchor="middle" fill="#94a3b8" font-size="9">Auth · Orders · Payments</text><text x="200" y="186" text-anchor="middle" fill="#94a3b8" font-size="9">Search · Email · Reports</text><text x="200" y="220" text-anchor="middle" fill="#bfdbfe" font-size="10">In-process calls (~ns)</text><text x="200" y="240" text-anchor="middle" fill="#bfdbfe" font-size="10">One database</text><text x="200" y="260" text-anchor="middle" fill="#bfdbfe" font-size="10">Atomic transactions</text><text x="200" y="290" text-anchor="middle" fill="#fca5a5" font-size="10">Single point of failure</text><text x="200" y="306" text-anchor="middle" fill="#fca5a5" font-size="10">Scales vertically only</text><text x="200" y="322" text-anchor="middle" fill="#fca5a5" font-size="10">Deploy = full restart</text><rect x="440" y="60" width="320" height="320" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="600" y="86" text-anchor="middle" fill="#86efac" font-size="12" font-weight="bold">DISTRIBUTED</text><circle cx="510" cy="150" r="22" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e"/><text x="510" y="154" text-anchor="middle" fill="#bbf7d0" font-size="9" font-weight="bold">Auth</text><circle cx="600" cy="130" r="22" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e"/><text x="600" y="134" text-anchor="middle" fill="#bbf7d0" font-size="9" font-weight="bold">Orders</text><circle cx="690" cy="150" r="22" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e"/><text x="690" y="154" text-anchor="middle" fill="#bbf7d0" font-size="9" font-weight="bold">Pay</text><circle cx="510" cy="230" r="22" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e"/><text x="510" y="234" text-anchor="middle" fill="#bbf7d0" font-size="9" font-weight="bold">Search</text><circle cx="690" cy="230" r="22" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e"/><text x="690" y="234" text-anchor="middle" fill="#bbf7d0" font-size="9" font-weight="bold">Email</text><line x1="532" y1="150" x2="578" y2="135" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/><line x1="622" y1="135" x2="668" y2="150" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/><line x1="510" y1="172" x2="510" y2="208" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/><line x1="690" y1="172" x2="690" y2="208" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/><text x="600" y="290" text-anchor="middle" fill="#bbf7d0" font-size="10">Network calls (~ms)</text><text x="600" y="306" text-anchor="middle" fill="#bbf7d0" font-size="10">Many databases</text><text x="600" y="322" text-anchor="middle" fill="#bbf7d0" font-size="10">Independent deploys</text><text x="600" y="346" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold">Scales horizontally</text><text x="400" y="402" text-anchor="middle" fill="#94a3b8" font-size="10">Choose distributed when failure isolation, independent scaling, or team autonomy outweighs the operational cost.</text></svg>',
        content: `
          <p>A distributed system is not <em>multiple servers</em>. A distributed system is what you get when failure of one component should not equal failure of the whole, when independent teams need to ship without coordinating every release, and when one machine is no longer enough to handle the load. Everything else - the consensus protocols, the service meshes, the observability pipelines - is mechanical detail that exists because we made the foundational choice to spread state and computation across many machines.</p>

          <p>This module sets the mental model that every later module depends on. By the end you should be able to read a system architecture and name the trade-offs the designer made, predict the failure modes from the topology alone, and decide for any given service whether distribution is the right call or premature complexity.</p>

          <h2>Why Distribute? The Real Reasons</h2>

          <p>The standard answer is &ldquo;scale&rdquo;. The honest answer is more nuanced. Real production teams move from monolith to distributed for one or more of:</p>
          <ul>
            <li><strong>Failure isolation</strong> - if the recommendation service crashes, the checkout flow should still work. A monolith dies as one process; distributed services degrade independently.</li>
            <li><strong>Independent deploys</strong> - a 200-engineer org cannot rally around a single deploy train. Microservices let teams ship without lockstep coordination.</li>
            <li><strong>Independent scaling</strong> - the search service may need 10x compute while the user-profile service needs 1x. A monolith forces them to scale together.</li>
            <li><strong>Geographic distribution</strong> - users in Singapore expect low latency from Singapore. A single-region monolith cannot serve global traffic well.</li>
            <li><strong>Heterogeneous storage</strong> - one service needs Postgres, another needs Redis, a third needs S3. Distribution lets each pick its store.</li>
          </ul>

          <p>The cost ledger is real too. Every distributed boundary introduces latency, partial failure, network unreliability, debugging complexity, deployment coordination, and observability work that did not exist in the monolith. <strong>Distribute when one of the reasons above outweighs the operational tax</strong> - and not before.</p>

          <h2>The CAP Theorem - A Decision Tool, Not a Theorem</h2>

          <p>Eric Brewer&apos;s CAP theorem (formalised by Gilbert &amp; Lynch in 2002) says: in a system with replication, you can have at most two of <strong>Consistency</strong> (every read sees the latest write), <strong>Availability</strong> (every request gets a non-error response), and <strong>Partition tolerance</strong> (the system continues operating across network partitions).</p>

          <p>Network partitions are inevitable in real production environments - cables get cut, NICs fail, packet loss spikes during deploys. So you do not get to opt out of P. The actual question CAP forces is: <strong>during a partition, would you rather refuse writes (preserve consistency) or accept potentially stale data (preserve availability)?</strong></p>

          <ul>
            <li><strong>CP</strong> systems (etcd, ZooKeeper, Spanner): refuse writes during a partition rather than diverge. Used for control-plane state, leader election, configuration.</li>
            <li><strong>AP</strong> systems (Cassandra, DynamoDB default, Riak): keep accepting reads/writes; reconcile divergent replicas later. Used for high-availability data planes.</li>
          </ul>

          <p>The <strong>PACELC extension</strong> (Daniel Abadi, 2010) sharpens the picture: <em>even when there is no Partition</em>, you trade off between <strong>Latency and Consistency</strong>. Spanner is CP/EC (strict consistency at the cost of cross-region latency). DynamoDB is AP/EL by default (low latency at the cost of eventual consistency). The honest decision framework is PACELC, not just CAP.</p>

          <h2>Latency - The Tax You Pay</h2>

          <p>The numbers every distributed-systems engineer should know:</p>
          <ul>
            <li>L1 cache reference: ~0.5ns</li>
            <li>Main memory reference: ~100ns (200x slower than L1)</li>
            <li>SSD random read: ~150&micro;s</li>
            <li>Network round-trip same-DC: ~0.5ms</li>
            <li>Network round-trip same-region: ~1&ndash;5ms</li>
            <li>Network round-trip cross-continent: ~80&ndash;200ms</li>
          </ul>

          <p>Every microservice boundary you cross is at least 0.5ms in the same DC. Every cross-region call is 100ms. A user-facing request that passes through 8 services, hits a cross-region database, and waits on a cache miss can easily reach 500ms even if every service is healthy. The architecture determines the latency floor; you cannot tune your way out of bad topology.</p>

          <h2>Availability and the &ldquo;Nines&rdquo;</h2>

          <p>Availability is typically expressed as a percentage of uptime over a window. The famous &ldquo;nines&rdquo; ladder:</p>
          <ul>
            <li>99% (two nines) &rArr; 3.65 days of downtime per year</li>
            <li>99.9% (three nines) &rArr; 8.76 hours per year</li>
            <li>99.99% (four nines) &rArr; ~52 minutes per year</li>
            <li>99.999% (five nines) &rArr; ~5.26 minutes per year</li>
          </ul>

          <p>Two practical realities. First, claimed availability rarely matches measured availability - cloud providers exclude maintenance windows, regional issues, and certain failure modes. Second, the dependency math is brutal: a service that depends on five 99.9% services has availability of <code>0.999^5 = 99.5%</code>. Independent dependencies multiply, and your effective SLO is bounded by your weakest critical path.</p>

          <h2>Fault Tolerance - Designing for &ldquo;When&rdquo;, Not &ldquo;If&rdquo;</h2>

          <p>Fault tolerance is the property that the system continues to operate (perhaps at reduced capacity) even when some components fail. The standard tools:</p>
          <ul>
            <li><strong>Redundancy</strong> - multiple replicas behind a load balancer; if one dies, others take over.</li>
            <li><strong>Timeouts</strong> - do not wait forever for a dead dependency. Always set a timeout and have a fallback.</li>
            <li><strong>Retries with exponential backoff and jitter</strong> - a failed call is retried, but with increasing delay (and randomness) so you do not hammer a recovering service.</li>
            <li><strong>Circuit breakers</strong> - after N consecutive failures, stop calling the failing dependency for a window so it can recover.</li>
            <li><strong>Bulkheads</strong> - isolate workloads so noisy neighbours cannot starve critical paths.</li>
            <li><strong>Graceful degradation</strong> - when a non-critical dependency fails, return reduced functionality rather than full error.</li>
          </ul>

          <p>Modules 6 and 7 cover these patterns in depth. For now, the key idea: <strong>plan for partial failure as a normal mode of operation, not an emergency</strong>.</p>

          <h2>Consistency Models - What You Promise</h2>

          <p>From strongest to weakest:</p>
          <ul>
            <li><strong>Linearizable</strong> - every operation appears to happen at a single instant; reads see the latest write globally. Spanner, etcd Raft.</li>
            <li><strong>Sequential consistency</strong> - all clients see the same order of operations, not necessarily wall-clock order. Single-leader DBs.</li>
            <li><strong>Causal consistency</strong> - causally related operations are seen in causal order; concurrent operations may reorder. Common in collaborative editing.</li>
            <li><strong>Read-your-writes</strong> - a client sees its own writes; other clients may lag.</li>
            <li><strong>Eventual consistency</strong> - replicas converge if writes stop. The weakest useful guarantee. DynamoDB default.</li>
          </ul>

          <p>The right consistency depends on the operation: a balance check needs strong consistency; a &ldquo;number of likes&rdquo; can tolerate eventual. Many systems offer <em>tunable</em> consistency at query time (Cassandra <code>CL=QUORUM</code> vs <code>CL=ONE</code>; MongoDB <code>readConcern</code>; DynamoDB <code>ConsistentRead</code>).</p>

          <h2>How This Course Is Structured</h2>

          <p>The next 11 modules walk you through every layer of a real distributed system:</p>
          <ul>
            <li>Modules 2&ndash;3: how services talk (networking, gRPC, events, Kafka).</li>
            <li>Modules 4&ndash;5: how data is split, replicated, and agreed upon (replication, sharding, consensus).</li>
            <li>Modules 6&ndash;7: how systems handle scale and failure (autoscaling, circuit breakers, chaos).</li>
            <li>Module 8: the security primitives that hold modern distributed systems together (Zero Trust, mTLS, SPIFFE).</li>
            <li>Module 9: how you observe and debug distributed systems (tracing, metrics, logs).</li>
            <li>Module 10: how Kubernetes changes everything.</li>
            <li>Module 11: real failure scenarios you will see in production.</li>
            <li>Module 12: how to design end-to-end production systems.</li>
          </ul>

          <p>For deeper foundational reading, the <a href="/blog/distributed-systems-algorithms-production-guide" class="text-primary underline">Distributed Systems Algorithms guide</a> goes into Raft/Paxos, quorum math, vector clocks, and CRDTs at the algorithm level. For hands-on practice, the <a href="/games/kubernetes-security-simulator" class="text-primary underline">Kubernetes Security Simulator</a> exercises the operational decisions that matter from Module 8 onwards. Reach for the <a href="/cheatsheets/kubernetes" class="text-primary underline">Kubernetes cheatsheet</a> when you need a fast operational reference.</p>

          <h2>The CAP Triangle Visualised</h2>
          <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="320" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">CAP DURING A PARTITION - PICK TWO</text><circle cx="270" cy="180" r="100" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="2"/><text x="270" y="100" text-anchor="middle" fill="#60a5fa" font-size="13" font-weight="bold">Consistency</text><circle cx="430" cy="180" r="100" fill="#22c55e" fill-opacity="0.15" stroke="#22c55e" stroke-width="2"/><text x="430" y="100" text-anchor="middle" fill="#4ade80" font-size="13" font-weight="bold">Availability</text><circle cx="350" cy="250" r="100" fill="#ec4899" fill-opacity="0.15" stroke="#ec4899" stroke-width="2"/><text x="350" y="305" text-anchor="middle" fill="#f472b6" font-size="13" font-weight="bold">Partition Tolerance</text><text x="200" y="220" text-anchor="middle" fill="#cbd5e1" font-size="11" font-weight="600">CP</text><text x="200" y="234" text-anchor="middle" fill="#94a3b8" font-size="9">etcd, Spanner</text><text x="500" y="220" text-anchor="middle" fill="#cbd5e1" font-size="11" font-weight="600">AP</text><text x="500" y="234" text-anchor="middle" fill="#94a3b8" font-size="9">Cassandra, DynamoDB</text></svg>

          <h2>Latency Propagation Across Service Boundaries</h2>
          <svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="240" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">LATENCY PROPAGATION (chain of 5 services)</text><rect x="40" y="80" width="100" height="40" rx="6" fill="#3b82f6" fill-opacity="0.3" stroke="#3b82f6"/><text x="90" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">A</text><text x="90" y="140" text-anchor="middle" fill="#94a3b8" font-size="9">5ms</text><rect x="180" y="80" width="100" height="40" rx="6" fill="#3b82f6" fill-opacity="0.3" stroke="#3b82f6"/><text x="230" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">B</text><text x="230" y="140" text-anchor="middle" fill="#94a3b8" font-size="9">+5ms = 10ms</text><rect x="320" y="80" width="100" height="40" rx="6" fill="#3b82f6" fill-opacity="0.3" stroke="#3b82f6"/><text x="370" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">C</text><text x="370" y="140" text-anchor="middle" fill="#94a3b8" font-size="9">+5ms = 15ms</text><rect x="460" y="80" width="100" height="40" rx="6" fill="#3b82f6" fill-opacity="0.3" stroke="#3b82f6"/><text x="510" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">D</text><text x="510" y="140" text-anchor="middle" fill="#94a3b8" font-size="9">+5ms = 20ms</text><rect x="600" y="80" width="100" height="40" rx="6" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e"/><text x="650" y="104" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">E</text><text x="650" y="140" text-anchor="middle" fill="#94a3b8" font-size="9">+5ms = 25ms total</text><line x1="140" y1="100" x2="180" y2="100" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#al1)"/><line x1="280" y1="100" x2="320" y2="100" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#al1)"/><line x1="420" y1="100" x2="460" y2="100" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#al1)"/><line x1="560" y1="100" x2="600" y2="100" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#al1)"/><text x="400" y="190" text-anchor="middle" fill="#cbd5e1" font-size="11">Each hop adds 5ms in same DC. Chain of 5 hops = 25ms minimum, before any work.</text><text x="400" y="210" text-anchor="middle" fill="#94a3b8" font-size="10">Cross-region adds 50–200ms per hop. Architecture sets the latency floor.</text><defs><marker id="al1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>You operate a payment system with 5 microservices on the critical path, each at 99.95% availability. What is your effective availability?</strong> (Answer: 0.9995^5 ≈ 99.75%, or ~22 hours of downtime per year. The math always points at one or two services as your investment.)</li>
            <li><strong>During a network partition, your CP database refuses writes. The product team asks if you can &quot;just keep accepting writes and reconcile later.&quot; How do you frame the trade-off?</strong> (Answer: that is exactly the AP choice; it requires designed conflict resolution - LWW, CRDTs, or human reconciliation. CP and AP are not interchangeable mid-flight.)</li>
            <li><strong>A user complains that the recommendation panel sometimes shows stale recommendations after they update preferences. What are your three options?</strong> (Answer: linearizable reads from the leader; read-your-writes via session affinity; cache invalidation on update with a short TTL fallback.)</li>
            <li><strong>Why is &ldquo;just add more servers&rdquo; the wrong first move when a service is slow?</strong> (Answer: scaling pushes the bottleneck downstream; if the database connection pool is exhausted, more replicas just exhaust it faster. Identify the bottleneck before scaling.)</li>
          </ol>
        `,
        labs: [
          { title: 'Lab 1.1 - Latency Simulation Across Service Boundaries', objective: 'Measure how cross-service network hops accumulate latency in a real microservice topology.', repoPath: 'module-1/lab-latency-simulation', steps: ['Spin up 5 small services (Go or Python) on docker-compose', 'Wire them in a chain: A → B → C → D → E', 'Add 5ms artificial latency per hop', 'Send 1000 requests through the chain and record p50/p95/p99', 'Compare to a single-monolith implementation', 'Plot the cumulative latency'], duration: '45 minutes', difficulty: 'Beginner', expectedOutput: 'Clear visualisation showing the 5x latency multiplier of the chain topology vs the monolith.' },
          { title: 'Lab 1.2 - Failure Isolation Test', objective: 'Demonstrate failure isolation: kill one microservice and observe how the system degrades vs how a monolith fails.', repoPath: 'module-1/lab-failure-isolation', steps: ['Use the same 5-service chain from Lab 1.1', 'Add graceful degradation in service A: if D fails, return cached or partial response', 'Send traffic, kill service D mid-flight', 'Observe error rate, response codes, response shape', 'Repeat with the monolithic implementation'], duration: '45 minutes', difficulty: 'Beginner', expectedOutput: 'Distributed version returns degraded but valid responses; monolith returns 5xx errors.' },
          { title: 'Lab 1.3 - Availability Math', objective: 'Calculate end-to-end availability for a real architecture and identify the weakest link.', repoPath: 'module-1/lab-availability-math', steps: ['Document a real microservice architecture you operate (or a fictional one with 6 services)', 'Assign each service its measured or claimed availability', 'Compute end-to-end availability for the critical path', 'Identify the single change that would most improve overall SLO', 'Document the find-and-fix recommendation'], duration: '30 minutes', difficulty: 'Beginner' },
        ],
        keyTakeaways: [
          'A distributed system exists for failure isolation, independent scaling, and team autonomy - not just &ldquo;scale&rdquo;',
          'CAP/PACELC frame the trade-offs you must make consciously; pretending otherwise leads to surprise outages',
          'Latency is set by topology before it is set by code - bad architecture cannot be tuned',
          'Effective availability is the product of dependency availabilities - mind your critical path',
          'Plan for partial failure as a normal operating mode, not an emergency',
        ],
        whyThisMatters: 'Every senior engineer who works on production systems eventually owns or designs a distributed component. The engineers who succeed are the ones who internalise these foundations early - CAP, latency math, availability math, partial-failure thinking - and use them as a decision framework. The engineers who skip the foundations end up reinventing distributed databases badly and debugging the same outage classes for years. This module is the lens you carry into every later module.',
        productionNotes: [
          'Track a critical-path availability dashboard (multiply each dependency&apos;s SLO) so the org sees the math, not the wishful thinking.',
          'Every cross-service call gets a timeout. Default: <em>do not let your services have unbounded patience</em>. Specific timeouts are part of every service contract.',
          'When you run the availability math, the answer always points at one or two services. That is your investment list, not a hypothetical.',
        ],
        commonMistakes: [
          'Adopting microservices because &ldquo;everyone else does&rdquo; before measuring whether failure isolation, independent scaling, or team autonomy actually justify the operational tax.',
          'Treating CAP as a textbook quiz question rather than a runtime decision - the question is &ldquo;during a real partition, what should this service do?&rdquo;',
          'Assuming dependencies have advertised availability when measured availability is materially different.',
        ],
        glossary: [
          { term: 'CAP Theorem', definition: 'In a distributed system, you can have at most two of Consistency, Availability, and Partition tolerance simultaneously.' },
          { term: 'PACELC', definition: 'Extension of CAP: even without partition, trade off Latency vs Consistency.' },
          { term: 'Availability', definition: 'Percentage of time the system serves successful responses; often expressed as nines (99.9%, 99.99%, ...).' },
          { term: 'Fault tolerance', definition: 'The system continues to operate in some form when components fail.' },
          { term: 'Linearizability', definition: 'The strongest consistency model: every operation appears to happen at a single instant.' },
        ],
        operationalStory: 'A growing fintech moved from monolith to microservices on the assumption it would &ldquo;scale better&rdquo;. Six months later they were paying 3x the cloud bill for the same throughput, debugging a 7-service request chain over Slack at 3am, and shipping slower because every change required cross-team coordination on shared infra. The retro found that two services genuinely needed independent scaling (search, recommendations); the other five were team-org artifacts. They consolidated back to a 3-service core with two specialised satellites and recovered both cost and velocity. The lesson: distribution is a tax you pay for benefits; if the benefits are not real, the tax is just a tax.',
        designTradeoffs: [
          { option: 'Distributed (microservices)', pros: ['Failure isolation', 'Independent deploys', 'Independent scaling per service', 'Team autonomy at scale'], cons: ['Network latency on every boundary', 'Operational complexity (observability, deployment, security)', 'Distributed-systems failure modes (split brain, partial failure)', 'Higher cloud cost'] },
          { option: 'Monolith', pros: ['In-process calls (~ns latency)', 'Simple operational model', 'Atomic transactions across the entire app', 'Lower compute cost'], cons: ['Single failure domain', 'Lockstep deploys', 'Vertical scaling only', 'Coordination tax across teams'] },
          { option: 'Modular monolith', pros: ['Most monolith benefits + clean module boundaries', 'Refactor-able into microservices later', 'Lowest operational cost for early-stage products'], cons: ['Module boundaries enforced by discipline, not infrastructure', 'Still a single deploy unit'] },
        ],
        realWorldUseCases: [
          'Stripe runs critical payment paths as a monolith with microservice satellites - chose simplicity for the money path, distribution for the periphery.',
          'Shopify operates a Rails &ldquo;majestic monolith&rdquo; for the storefront with carved-out services for checkout and search; the architecture is a deliberate trade-off, not the result of an accident.',
          'Amazon&apos;s famous &ldquo;two-pizza team&rdquo; rule was as much about deployment isolation (each team owns its services end-to-end) as about scaling.',
          'Segment publicly migrated FROM microservices BACK to a monolith for parts of their stack when the operational complexity outweighed the benefits.',
        ],
        careerRelevance: 'Senior and staff engineers are evaluated on system-design judgment as much as code. The engineers who can explain WHY their architecture is distributed (and what they get for the tax) get trusted with bigger architectural calls. The engineers who default to microservices because &ldquo;that&apos;s what production looks like&rdquo; tend to ship slowly and burn budget. This module is the lens those judgments depend on.',
        thinkLikeAnEngineer: [
          'Before adopting microservices, calculate the latency floor your topology imposes. If your SLO is p99 &lt; 200ms and your chain has 8 hops &times; 5ms each, you are out of budget before any work happens.',
          'Run the availability math on your critical path quarterly. If your effective availability is 99.5% and you committed 99.9%, the math points at one or two services as the investment list.',
          'Treat every cross-service call as a contract: timeout, retry policy, error semantics, and observability are all part of the contract. Without them, the network has won.',
        ],
        securityRisks: [
          'Every distributed boundary is a new attack surface. Service-to-service calls without authn become trust-by-network-position, the model that Zero Trust replaces.',
          'Distributed deployments multiply credential management cost. Long-lived shared secrets in env vars across services become impossible to rotate.',
          'Failure-isolation only works if security is also isolated. A compromised auth service in a 5-service architecture must not give the attacker the keys to all five.',
        ],
        beforeAfter: {
          before: [
            'Microservices because &ldquo;everyone else does it&rdquo;',
            'No timeout discipline; retries everywhere with no budget',
            'No availability math on the critical path',
            'Distributed system that performs worse than the monolith it replaced',
          ],
          after: [
            'Distribution as a deliberate choice with concrete benefits identified upfront',
            'Every cross-service call has timeout + retry policy + error semantics documented',
            'Quarterly availability math review; investment list from the math',
            'CAP/PACELC-aware design; conscious choice of consistency vs availability per service',
          ],
        },
        productionAlternatives: [
          { name: 'Modular monolith', description: 'Single deploy unit with strict module boundaries. Best for early-stage products before team scale forces distribution.' },
          { name: 'Microservices on Kubernetes', description: 'Industry default once 50+ engineers; pays the operational tax for team-autonomy benefits.' },
          { name: 'Service-Oriented Architecture (SOA)', description: 'Older sibling of microservices; coarser-grained services. Still relevant when integrating heterogeneous legacy systems.' },
          { name: 'Serverless / FaaS', description: 'Distribution without operating servers; trade-offs around cold-start latency, vendor lock-in, and observability.' },
        ],
      },
      {
        number: 2,
        title: 'Networking & Distributed Communication',
        slug: 'networking-distributed-communication',
        subtitle: 'How services actually talk: TCP, HTTP/2, gRPC, service discovery, load balancing, retries, and the timeout discipline that keeps systems from melting.',
        duration: '4 hours',
        objectives: [
          'Read a TCP/IP packet flow and explain what each layer does in production',
          'Compare HTTP/1.1, HTTP/2, and gRPC and pick the right one per workload',
          'Implement service discovery without inventing a worse DNS',
          'Design retry, timeout, and load-balancing policies that survive load',
          'Diagnose and prevent retry storms before they cause outages',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">DISTRIBUTED COMMUNICATION STACK</text><rect x="60" y="60" width="680" height="40" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="80" y="84" fill="#bfdbfe" font-size="11" font-weight="bold">L7 application</text><text x="720" y="84" text-anchor="end" fill="#94a3b8" font-size="10">gRPC, HTTP/2, REST, GraphQL</text><rect x="60" y="105" width="680" height="40" rx="6" fill="#a855f7" fill-opacity="0.2" stroke="#a855f7"/><text x="80" y="129" fill="#ddd6fe" font-size="11" font-weight="bold">L7 service mesh</text><text x="720" y="129" text-anchor="end" fill="#94a3b8" font-size="10">Envoy, Istio, Linkerd, retries, mTLS</text><rect x="60" y="150" width="680" height="40" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="80" y="174" fill="#86efac" font-size="11" font-weight="bold">L4 transport</text><text x="720" y="174" text-anchor="end" fill="#94a3b8" font-size="10">TCP / TLS / QUIC, connection pool</text><rect x="60" y="195" width="680" height="40" rx="6" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24"/><text x="80" y="219" fill="#fcd34d" font-size="11" font-weight="bold">Discovery</text><text x="720" y="219" text-anchor="end" fill="#94a3b8" font-size="10">DNS, service registry, K8s Services, Consul</text><rect x="60" y="240" width="680" height="40" rx="6" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899"/><text x="80" y="264" fill="#fbcfe8" font-size="11" font-weight="bold">Load balancing</text><text x="720" y="264" text-anchor="end" fill="#94a3b8" font-size="10">L4 / L7, EWMA, least-request, ring hash</text><rect x="60" y="285" width="680" height="40" rx="6" fill="#94a3b8" fill-opacity="0.2" stroke="#94a3b8"/><text x="80" y="309" fill="#cbd5e1" font-size="11" font-weight="bold">Resilience</text><text x="720" y="309" text-anchor="end" fill="#94a3b8" font-size="10">Timeout, retry budget, circuit breaker, bulkhead</text><text x="400" y="356" text-anchor="middle" fill="#94a3b8" font-size="10">Each layer adds latency, mode of failure, and operational lever. Owning the stack means knowing which lever fits which incident.</text></svg>',
        content: `
          <p>Two services talking is not one network call. It is, on a typical Kubernetes cluster, a TLS handshake, a DNS lookup, a service-mesh sidecar interception, an L4 load-balancer pick, an L7 retry policy, an actual HTTP/2 stream, deserialization on the receiver, and an audit log on the way back. Most distributed-systems incidents are not algorithm bugs - they are <em>network bugs that look like algorithm bugs</em>.</p>

          <p>This module unpacks the stack so the next time your p99 latency doubles you know which layer to suspect.</p>

          <h2>TCP/IP - What Lives Underneath</h2>

          <p>The two-line summary every backend engineer needs: <strong>TCP gives you reliability</strong> (ordered delivery, retransmission, flow control) <strong>and connection state</strong> (the three-way handshake takes 1 RTT before the first byte of payload). <strong>IP gives you routing</strong> (each packet finds its way through a graph of routers without the endpoints knowing the path).</p>

          <p>The TCP three-way handshake (<code>SYN → SYN/ACK → ACK</code>) is the per-connection latency floor. TLS adds another 1&ndash;2 RTTs for the handshake. So the first request on a fresh connection costs you 2&ndash;3 RTTs of pure overhead before anything useful happens. That is why <strong>connection pooling</strong> matters: amortise the handshake cost across many requests on the same connection.</p>

          <h2>HTTP/1.1 vs HTTP/2 vs gRPC - What Each Buys You</h2>

          <ul>
            <li><strong>HTTP/1.1</strong>: text-based request/response, head-of-line blocking on a single connection. Workaround: clients open many connections in parallel. Still the right answer for cacheable static content and many web APIs.</li>
            <li><strong>HTTP/2</strong>: binary framing, multiplexed streams over a single connection (no head-of-line blocking at HTTP level), header compression (HPACK). Same one-connection-many-requests philosophy. Required by gRPC.</li>
            <li><strong>gRPC</strong>: an RPC framework on top of HTTP/2 with Protocol Buffers (Protobuf) serialization. Strongly-typed interfaces, code generation in many languages, streaming RPCs, deadlines built into the protocol. The de-facto choice for service-to-service communication in modern infrastructure.</li>
          </ul>

          <p>The practical guidance: use <strong>gRPC for service-to-service</strong> calls in your own infra (typed contracts, low overhead, streaming when you need it). Use <strong>HTTP/JSON</strong> for external APIs (browser-callable, tool-friendly, debuggable with curl). Avoid HTTP/1.1 for internal traffic unless you have a specific reason.</p>

          <h2>Service Discovery - How Services Find Each Other</h2>

          <p>Static IP addresses do not work in a world where pods restart, scale up, or move between nodes every few minutes. Service discovery is the indirection: clients ask &ldquo;where is the orders service?&rdquo; and get back the current set of healthy endpoints.</p>

          <p>The mainstream patterns:</p>
          <ul>
            <li><strong>DNS-based</strong> - Kubernetes Services give every service a DNS name (<code>orders.payments.svc.cluster.local</code>) that resolves to the current Pod IPs. Simple, integrates with everything, but DNS TTL caching can lag.</li>
            <li><strong>Service registry</strong> - Consul, etcd, ZooKeeper. Services register on startup; clients query the registry. Fast updates; richer metadata (datacentre, health, weights).</li>
            <li><strong>Service mesh</strong> - the sidecar (Envoy) handles discovery via xDS protocol from a control plane (Istio, Linkerd). Clients call <code>orders</code> as if it were local; the sidecar resolves the actual endpoints.</li>
          </ul>

          <h2>Load Balancing</h2>

          <p>Load balancers turn a list of endpoints into a single virtual endpoint with traffic distribution. Two layers, distinct trade-offs:</p>
          <ul>
            <li><strong>L4 load balancers</strong> (AWS NLB, kube-proxy iptables/IPVS) operate at the TCP layer. Cheap, fast, opaque to the application. Best for raw connection distribution; cannot do per-request routing.</li>
            <li><strong>L7 load balancers</strong> (Envoy, NGINX, AWS ALB) understand HTTP. Can do header-based routing, path matching, retries, weighted shifting, mTLS termination, observability. Add latency (~1&ndash;5ms) but unlock the production-engineering toolbox.</li>
          </ul>

          <p>Algorithm choice matters. <strong>Round robin</strong> is fine for uniform endpoints; <strong>least-request</strong> handles variable backend speed (Envoy default); <strong>EWMA</strong> tracks a smoothed latency estimate and prefers fast endpoints; <strong>ring hash / consistent hash</strong> sticks the same key to the same backend (useful for cache locality).</p>

          <h2>Retries, Timeouts, and the Storm</h2>

          <p>Two rules that, applied with discipline, prevent most outages:</p>
          <ol>
            <li><strong>Every call has a timeout</strong>. Default is &ldquo;wait forever&rdquo; in most languages. Override it. The timeout should be shorter than your caller&apos;s timeout (so retries can fire within the deadline budget).</li>
            <li><strong>Every retry has exponential backoff with jitter</strong>. Wait 1s, then 2s, then 4s - with random jitter to avoid synchronising retries. AWS&apos;s &ldquo;Decorrelated Jitter&rdquo; algorithm is the standard.</li>
          </ol>

          <p>The <strong>retry storm</strong> is the canonical anti-pattern: a backend brownout causes timeouts; clients retry; their retries push more load onto the backend; the backend cannot recover; clients keep retrying. The defence is the <strong>retry budget</strong>: cap retries at a percentage of total RPS (e.g. retries cannot exceed 10% of in-flight requests). Envoy and gRPC client libraries support this directly.</p>

          <p>The <a href="/blog/rate-limiting-algorithms-production-guide" class="text-primary underline">Rate Limiting Algorithms guide</a> covers the related primitive of <em>capping arrival rate</em>; combined with retry budgets, it is the front-of-house resilience kit.</p>

          <h2>Connection Pooling</h2>

          <p>HTTP/2 lets one TCP connection carry many requests. For high-throughput service-to-service calls, every client should hold an open pool of connections to each upstream and reuse them. Pool sizing rules of thumb:</p>
          <ul>
            <li>Min pool: <code>p99_concurrency × 1.2</code> (avoid head-of-line blocking on the bottom).</li>
            <li>Max pool: large enough to avoid queueing under burst, small enough to not exhaust the upstream&apos;s file descriptors.</li>
            <li>Idle timeout: 30&ndash;60s. Short enough to recover from broken connections; long enough to amortise handshake.</li>
          </ul>

          <h2>DNS as Distributed-Systems Risk</h2>

          <p>DNS is the cause of more &ldquo;unexplained&rdquo; outages than any other piece of distributed-systems infrastructure. Common failure modes:</p>
          <ul>
            <li>Resolver caches a stale entry; service is moved; clients call dead endpoints for the TTL window.</li>
            <li>Coredns / kube-dns hits a query-rate limit; lookups time out; entire mesh stalls.</li>
            <li>External resolver (8.8.8.8) is unreachable; in-cluster lookups slow because of fallback chains.</li>
          </ul>

          <p>Mitigations: short TTLs for in-cluster names (5&ndash;30s), use <code>NodeLocal DNSCache</code> on Kubernetes, monitor DNS error rate as a first-class metric, prefer service-mesh discovery (sidecar handles endpoint changes via xDS, no DNS in the data path). For Kubernetes-specific networking patterns reach for the <a href="/cheatsheets/kubernetes" class="text-primary underline">Kubernetes cheatsheet</a>; for service-mesh pattern reference the <a href="/cheatsheets/service-mesh" class="text-primary underline">Service Mesh cheatsheet</a>; for API gateway / external API security the <a href="/cheatsheets/api-security" class="text-primary underline">API Security cheatsheet</a>.</p>

          <h2>TLS Handshake Sequence</h2>
          <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="320" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">TLS 1.3 HANDSHAKE - 1 RTT</text><line x1="200" y1="60" x2="200" y2="290" stroke="#475569" stroke-width="1"/><line x1="600" y1="60" x2="600" y2="290" stroke="#475569" stroke-width="1"/><text x="200" y="76" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Client</text><text x="600" y="76" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Server</text><line x1="200" y1="110" x2="600" y2="110" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#tlsa)"/><text x="400" y="104" text-anchor="middle" fill="#94a3b8" font-size="10">ClientHello + key share + ALPN + SNI</text><line x1="600" y1="155" x2="200" y2="155" stroke="#22c55e" stroke-width="1.5" marker-end="url(#tlsa)"/><text x="400" y="149" text-anchor="middle" fill="#94a3b8" font-size="10">ServerHello + key share + cert + Finished</text><line x1="200" y1="200" x2="600" y2="200" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#tlsa)"/><text x="400" y="194" text-anchor="middle" fill="#94a3b8" font-size="10">Finished (encrypted) + first request</text><line x1="600" y1="245" x2="200" y2="245" stroke="#22c55e" stroke-width="1.5" marker-end="url(#tlsa)"/><text x="400" y="239" text-anchor="middle" fill="#94a3b8" font-size="10">Response (encrypted)</text><text x="400" y="290" text-anchor="middle" fill="#cbd5e1" font-size="10">TLS 1.3 cuts handshake to 1 RTT (vs 2 in 1.2). Connection pooling amortises this across many requests.</text><defs><marker id="tlsa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>DNS Resolution Flow on Kubernetes</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">KUBERNETES DNS RESOLUTION</text><rect x="40" y="80" width="120" height="50" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="100" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">Pod resolver</text><text x="100" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">/etc/resolv.conf</text><line x1="160" y1="105" x2="220" y2="105" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#dnsa)"/><rect x="220" y="80" width="160" height="50" rx="6" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24"/><text x="300" y="104" text-anchor="middle" fill="#fcd34d" font-size="10" font-weight="700">NodeLocal DNSCache</text><text x="300" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">per-node, cached</text><line x1="380" y1="105" x2="440" y2="105" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#dnsa)"/><rect x="440" y="80" width="120" height="50" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="500" y="104" text-anchor="middle" fill="#86efac" font-size="10" font-weight="700">CoreDNS</text><text x="500" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">cluster service</text><line x1="560" y1="105" x2="620" y2="105" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#dnsa)"/><rect x="620" y="80" width="140" height="50" rx="6" fill="#a855f7" fill-opacity="0.2" stroke="#a855f7"/><text x="690" y="104" text-anchor="middle" fill="#ddd6fe" font-size="10" font-weight="700">External resolver</text><text x="690" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">8.8.8.8 / VPC</text><text x="400" y="180" text-anchor="middle" fill="#cbd5e1" font-size="11" font-weight="700">Most lookups stop at NodeLocal DNSCache (sub-ms)</text><text x="400" y="200" text-anchor="middle" fill="#94a3b8" font-size="10">External lookups can be 50ms+ - and the canonical cause of cluster-wide stalls.</text><text x="400" y="232" text-anchor="middle" fill="#fbbf24" font-size="10">Without NodeLocal DNSCache, every Pod hits CoreDNS for every lookup.</text><defs><marker id="dnsa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Load Balancer Architecture</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">L4 vs L7 LOAD BALANCING</text><rect x="40" y="70" width="200" height="180" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="140" y="92" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="bold">L4 (TCP)</text><text x="140" y="118" text-anchor="middle" fill="#94a3b8" font-size="10">NLB / kube-proxy</text><text x="140" y="148" text-anchor="middle" fill="#bfdbfe" font-size="9">+ Fast (sub-ms)</text><text x="140" y="164" text-anchor="middle" fill="#bfdbfe" font-size="9">+ Connection-aware</text><text x="140" y="180" text-anchor="middle" fill="#bfdbfe" font-size="9">+ Cheap</text><text x="140" y="206" text-anchor="middle" fill="#fca5a5" font-size="9">– No HTTP routing</text><text x="140" y="222" text-anchor="middle" fill="#fca5a5" font-size="9">– No retries / circuit breaker</text><rect x="280" y="70" width="200" height="180" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="380" y="92" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">L7 (HTTP)</text><text x="380" y="118" text-anchor="middle" fill="#94a3b8" font-size="10">Envoy / NGINX / ALB</text><text x="380" y="148" text-anchor="middle" fill="#bbf7d0" font-size="9">+ Header-based routing</text><text x="380" y="164" text-anchor="middle" fill="#bbf7d0" font-size="9">+ Retries, timeouts, breakers</text><text x="380" y="180" text-anchor="middle" fill="#bbf7d0" font-size="9">+ mTLS termination</text><text x="380" y="206" text-anchor="middle" fill="#fca5a5" font-size="9">– 1–5ms added latency</text><text x="380" y="222" text-anchor="middle" fill="#fca5a5" font-size="9">– More to operate</text><rect x="520" y="70" width="240" height="180" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/><text x="640" y="92" text-anchor="middle" fill="#c4b5fd" font-size="11" font-weight="bold">Algorithms</text><text x="540" y="118" fill="#ddd6fe" font-size="9">• round robin - uniform endpoints</text><text x="540" y="138" fill="#ddd6fe" font-size="9">• least-request - variable speed</text><text x="540" y="158" fill="#ddd6fe" font-size="9">• EWMA - latency-weighted</text><text x="540" y="178" fill="#ddd6fe" font-size="9">• ring/consistent hash - sticky</text><text x="540" y="198" fill="#ddd6fe" font-size="9">• random - surprisingly competitive</text><text x="540" y="222" fill="#94a3b8" font-size="9">Envoy default: least-request</text></svg>

          <h2>Retry Storm Propagation</h2>
          <svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="240" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">RETRY STORM - WITH vs WITHOUT BUDGET</text><text x="200" y="68" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="700">NO BUDGET - amplification</text><rect x="60" y="80" width="50" height="50" rx="4" fill="#1e293b" stroke="#fca5a5"/><text x="85" y="110" text-anchor="middle" fill="#fca5a5" font-size="9">1k</text><line x1="110" y1="105" x2="150" y2="105" stroke="#fca5a5" stroke-width="1.5" marker-end="url(#rsa)"/><rect x="150" y="80" width="50" height="50" rx="4" fill="#1e293b" stroke="#fca5a5"/><text x="175" y="110" text-anchor="middle" fill="#fca5a5" font-size="9">3k</text><line x1="200" y1="105" x2="240" y2="105" stroke="#fca5a5" stroke-width="2" marker-end="url(#rsa)"/><rect x="240" y="80" width="60" height="50" rx="4" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444"/><text x="270" y="110" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="bold">DB melts</text><text x="200" y="160" text-anchor="middle" fill="#fca5a5" font-size="9">3x amplification on DB</text><text x="600" y="68" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">WITH BUDGET - capped</text><rect x="460" y="80" width="50" height="50" rx="4" fill="#1e293b" stroke="#86efac"/><text x="485" y="110" text-anchor="middle" fill="#86efac" font-size="9">1k</text><line x1="510" y1="105" x2="550" y2="105" stroke="#86efac" stroke-width="1.5" marker-end="url(#rsa)"/><rect x="550" y="80" width="50" height="50" rx="4" fill="#1e293b" stroke="#86efac"/><text x="575" y="110" text-anchor="middle" fill="#86efac" font-size="9">1.1k</text><line x1="600" y1="105" x2="640" y2="105" stroke="#86efac" stroke-width="1.5" marker-end="url(#rsa)"/><rect x="640" y="80" width="60" height="50" rx="4" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="670" y="110" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold">DB OK</text><text x="600" y="160" text-anchor="middle" fill="#86efac" font-size="9">10% retry budget; recovery possible</text><text x="400" y="216" text-anchor="middle" fill="#cbd5e1" font-size="11">Each layer multiplies retries unless capped. Budget = retries / total RPS &lt; 10%.</text><defs><marker id="rsa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>Why does HTTP/1.1 lead to many TCP connections per browser tab while HTTP/2 needs only one?</strong> (Answer: HTTP/1.1 has head-of-line blocking on a single connection; clients open multiple connections to parallelise. HTTP/2 multiplexes streams over one connection.)</li>
            <li><strong>You set <code>retries: 3</code> on every internal call. A downstream brownout begins. What happens?</strong> (Answer: a retry storm; total RPS to the failing service is 4x normal, preventing recovery. Need a retry budget capping retries at, say, 10% of RPS.)</li>
            <li><strong>What is the right service-discovery pattern for a 50-service Kubernetes cluster?</strong> (Answer: Kubernetes Services for in-cluster DNS by default; service mesh sidecar via xDS for richer mesh-aware discovery if you already run a mesh.)</li>
            <li><strong>Your p99 latency tripled overnight. The application code did not change. Where do you look first?</strong> (Answer: DNS error rate, recent CoreDNS changes, NodeLocal DNSCache health. DNS is the biggest source of unexplained latency anomalies in Kubernetes.)</li>
            <li><strong>When should you choose gRPC over HTTP/JSON?</strong> (Answer: service-to-service inside your infra where you control both sides and want strongly-typed contracts; not for browser-callable APIs where HTTP/JSON wins on tooling.)</li>
          </ol>
        `,
        labs: [
          { title: 'Lab 2.1 - gRPC vs REST Latency Bake-off', objective: 'Measure real latency and throughput of gRPC vs HTTP/JSON for the same logical workload.', repoPath: 'module-2/lab-grpc-vs-rest', steps: ['Implement the same service interface as gRPC and HTTP/JSON', 'Generate identical client and server code', 'Run a 5-minute load test at 100 / 1000 / 5000 RPS', 'Capture p50/p95/p99 latency, throughput, CPU usage', 'Compare wire size for a representative request'], duration: '60 minutes', difficulty: 'Beginner', expectedOutput: 'gRPC shows 2&ndash;5x lower wire bytes and 30&ndash;50% lower latency at high RPS.' },
          { title: 'Lab 2.2 - Retry Storm Reproduction and Defence', objective: 'Cause and contain a retry storm in a controlled environment.', repoPath: 'module-2/lab-retry-storm', steps: ['Stand up a 3-service chain', 'Inject a 50% error rate at the bottom service', 'Configure callers with naive retries (no backoff, no budget)', 'Observe the QPS amplification', 'Add exponential backoff with jitter; observe', 'Add a retry budget; observe full recovery'], duration: '90 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 2.3 - DNS-Caused Outage Triage', objective: 'Reproduce a stale-DNS outage and walk through the triage flow.', repoPath: 'module-2/lab-dns-outage', steps: ['Deploy a service with DNS TTL 300s', 'Move the service to a new IP', 'Watch existing clients fail until cache expires', 'Reproduce with TTL 5s and observe smooth handoff', 'Document the runbook'], duration: '45 minutes', difficulty: 'Intermediate' },
        ],
        keyTakeaways: [
          'Most distributed-systems incidents are network incidents that look like application bugs',
          'Use gRPC for service-to-service, HTTP/JSON for external; avoid HTTP/1.1 internally',
          'Every call has a timeout. Every retry has exponential backoff with jitter. Every retry policy has a budget',
          'Service discovery is mandatory infrastructure - pick DNS, registry, or mesh deliberately',
          'DNS is the cause of more unexplained outages than any other layer',
        ],
        whyThisMatters: 'The patterns in this module are the difference between a service that survives a bad day and one that cascades into a multi-team incident. Engineers who internalise timeouts, retries with budgets, and connection pooling can read an incident timeline and immediately see where the design failed. Engineers who skip them tend to debug the same outage repeatedly.',
        commonMistakes: [
          'Setting infinite retries on a non-idempotent endpoint - one downstream blip becomes duplicate side effects everywhere.',
          'Not setting per-call timeouts; the system inherits the default of &ldquo;wait forever&rdquo;.',
          'Using HTTP/1.1 for high-throughput internal communication; you pay for handshakes you do not need.',
        ],
        glossary: [
          { term: 'gRPC', definition: 'Open-source RPC framework using HTTP/2 + Protocol Buffers; standard for service-to-service in modern infra.' },
          { term: 'Connection pooling', definition: 'Reusing TCP/HTTP connections across requests to amortise handshake cost.' },
          { term: 'Retry storm', definition: 'Failure mode where retries amplify load on an already-struggling backend, preventing recovery.' },
          { term: 'Retry budget', definition: 'Cap on total retries as a percentage of RPS; prevents retry storms.' },
          { term: 'Service discovery', definition: 'Mechanism by which clients find healthy endpoints for a service (DNS, registry, mesh).' },
        ],
        productionNotes: [
          'Set per-call timeouts at every layer. Default of &ldquo;wait forever&rdquo; in standard libraries is the source of half of all production stalls.',
          'Run NodeLocal DNSCache on every Kubernetes cluster. The cost is one DaemonSet; the benefit is dropping DNS off the data path.',
          'Treat retry policies as part of the service contract; document them and review at deployment.',
        ],
        operationalStory: 'A consumer-facing API team enabled aggressive client-side retries (3 attempts, no backoff) after seeing transient 503s in CI. Two weeks later their payments backend went into brownout. Within minutes the retry logic amplified normal traffic 4x; the backend could not recover; the entire mobile app was down for 22 minutes. Post-mortem: add retry budget (cap retries at 10% of RPS), exponential backoff with jitter, and circuit breaker on the client side. The fix was 50 lines of code and a config change.',
        designTradeoffs: [
          { option: 'gRPC for service-to-service', pros: ['Strong typing via Protobuf', '2-5x lower wire size than JSON', 'Streaming RPCs', 'Built-in deadlines'], cons: ['Harder to debug than HTTP/JSON', 'Browser support requires gRPC-Web', 'Smaller ecosystem than REST'] },
          { option: 'HTTP/JSON for service-to-service', pros: ['Universal tooling (curl, Postman)', 'Browser-callable', 'Easy to log/debug'], cons: ['Verbose wire format', 'No built-in deadlines', 'Weak typing'] },
          { option: 'Service mesh (Envoy/Istio)', pros: ['mTLS / retries / circuit breakers free', 'Centralised policy', 'Rich observability'], cons: ['Sidecar latency tax (~1-3ms/hop)', 'Operational complexity', 'Learning curve'] },
        ],
        realWorldUseCases: [
          'Google uses gRPC internally for nearly all service-to-service traffic (it was open-sourced from their internal Stubby framework).',
          'Cloudflare reduced internal latency by ~30% by moving from HTTP/1.1 to HTTP/2 with connection pooling.',
          'Netflix&apos;s Hystrix circuit-breaker library (now retired in favour of Resilience4j) was created after a single dependency outage cascaded the entire viewing platform.',
          'AWS published the &ldquo;decorrelated jitter&rdquo; backoff algorithm after measuring how poorly synchronised retries handled their load.',
        ],
        thinkLikeAnEngineer: [
          'Before debating gRPC vs REST, ask: who calls this API? If browsers, REST. If your own services, gRPC unless there is a reason against.',
          'Every retry policy is a load multiplier. Calculate the worst-case load on the downstream when every caller hits its retry cap simultaneously.',
          'DNS is in the data path on every request. Treat its latency and error rate as first-class metrics, not infrastructure noise.',
        ],
        securityRisks: [
          'Plaintext HTTP between services exposes payloads to passive network attackers. Default to mTLS for any internal call carrying sensitive data.',
          'Trusting X-Forwarded-For from untrusted upstream is a rate-limit / IP-allowlist bypass vector.',
          'Service discovery without authentication lets a compromised pod register fake endpoints and intercept traffic.',
          'gRPC reflection enabled in production exposes internal API schema to anyone who can hit the endpoint.',
        ],
        beforeAfter: {
          before: [
            'No timeouts on outbound calls; one slow downstream stalls the entire service',
            'Naive retry policies that amplify failures during brownouts',
            'DNS caching tuned by accident; outages from stale entries',
            'Long-running HTTP/1.1 connections; handshake overhead on every cold call',
          ],
          after: [
            'Per-call timeouts at every layer, shorter than caller&apos;s deadline',
            'Retries with exponential backoff + jitter + budget; no amplification',
            'NodeLocal DNSCache + short TTLs + DNS error rate alerted',
            'gRPC over HTTP/2 with connection pooling; handshake cost amortised',
          ],
        },
        productionAlternatives: [
          { name: 'gRPC', description: 'Strongly-typed RPC over HTTP/2; standard for service-to-service in modern infra.' },
          { name: 'Connect / Twirp', description: 'Lighter alternatives to gRPC with simpler tooling; trade ecosystem maturity for ergonomics.' },
          { name: 'GraphQL Federation', description: 'For client-facing APIs that need composition across many backend services.' },
          { name: 'NATS / message-based RPC', description: 'When you need request-response without TCP connection overhead; useful for IoT/edge.' },
        ],
      },
      {
        number: 3,
        title: 'Event-Driven & Asynchronous Systems',
        slug: 'event-driven-asynchronous-systems',
        subtitle: 'How Kafka, RabbitMQ, NATS, and pub/sub patterns let services decouple in time and scale - and the failure modes that come with them.',
        duration: '4 hours',
        objectives: [
          'Choose between message queues, pub/sub, and event streaming for a given workload',
          'Reason about partitioning, ordering, and consumer groups in Kafka',
          'Implement backpressure correctly so producers do not melt consumers',
          'Design exactly-once semantics where you actually need them - and at-least-once where you do not',
          'Diagnose the canonical event-pipeline outages: lag spikes, rebalances, and stuck consumers',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">KAFKA EVENT PIPELINE</text><rect x="40" y="70" width="120" height="60" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="100" y="98" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Producer</text><text x="100" y="116" text-anchor="middle" fill="#94a3b8" font-size="9">orders-service</text><line x1="160" y1="100" x2="220" y2="100" stroke="#94a3b8" marker-end="url(#a3)"/><rect x="220" y="60" width="220" height="240" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/><text x="330" y="86" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="bold">Topic: orders</text><rect x="240" y="100" width="180" height="36" rx="3" fill="#fbbf24" fill-opacity="0.2"/><text x="330" y="123" text-anchor="middle" fill="#fcd34d" font-size="9">partition 0  |  offsets 0..N</text><rect x="240" y="142" width="180" height="36" rx="3" fill="#fbbf24" fill-opacity="0.2"/><text x="330" y="165" text-anchor="middle" fill="#fcd34d" font-size="9">partition 1  |  offsets 0..N</text><rect x="240" y="184" width="180" height="36" rx="3" fill="#fbbf24" fill-opacity="0.2"/><text x="330" y="207" text-anchor="middle" fill="#fcd34d" font-size="9">partition 2  |  offsets 0..N</text><rect x="240" y="226" width="180" height="36" rx="3" fill="#fbbf24" fill-opacity="0.2"/><text x="330" y="249" text-anchor="middle" fill="#fcd34d" font-size="9">partition 3  |  offsets 0..N</text><text x="330" y="285" text-anchor="middle" fill="#94a3b8" font-size="9">key-hash partitions; durable log</text><line x1="440" y1="120" x2="500" y2="100" stroke="#22c55e" marker-end="url(#a3)"/><line x1="440" y1="160" x2="500" y2="160" stroke="#22c55e" marker-end="url(#a3)"/><line x1="440" y1="200" x2="500" y2="220" stroke="#22c55e" marker-end="url(#a3)"/><rect x="500" y="80" width="120" height="40" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="560" y="104" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Consumer A1</text><rect x="500" y="140" width="120" height="40" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="560" y="164" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Consumer A2</text><rect x="500" y="200" width="120" height="40" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="560" y="224" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Consumer A3</text><rect x="640" y="80" width="120" height="160" rx="6" fill="#a855f7" fill-opacity="0.1" stroke="#a855f7"/><text x="700" y="104" text-anchor="middle" fill="#ddd6fe" font-size="11" font-weight="bold">Consumer Group B</text><text x="700" y="160" text-anchor="middle" fill="#94a3b8" font-size="9">independent</text><text x="700" y="174" text-anchor="middle" fill="#94a3b8" font-size="9">offset cursor</text><text x="400" y="335" text-anchor="middle" fill="#94a3b8" font-size="10">Each consumer in a group owns a subset of partitions; ordering is per-partition; multiple groups read independently.</text><defs><marker id="a3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
        content: `
          <p>Synchronous communication couples services in time. Asynchronous communication couples them only in <em>contract</em>. The producer publishes an event; the consumer reads it whenever it is ready, retries if it fails, and runs at a different rate than the producer. That decoupling is what lets event-driven systems scale to billions of events per day - and what creates the operational failure modes you have to learn to recognise.</p>

          <h2>Queue vs Pub/Sub vs Event Streaming - Pick One Deliberately</h2>

          <ul>
            <li><strong>Message queue (RabbitMQ, SQS)</strong>: each message is delivered to one consumer. Used for work distribution: a queue of jobs, workers pull and process. Messages disappear after ack.</li>
            <li><strong>Pub/sub (Redis Pub/Sub, NATS, Google Pub/Sub)</strong>: each message is delivered to all subscribers. Used for fan-out notifications. Often ephemeral - missed messages are missed.</li>
            <li><strong>Event streaming (Kafka, Kinesis, Pulsar)</strong>: messages are appended to a durable log; consumers read at their own pace, can replay history, can have many independent groups. The dominant pattern for high-throughput data pipelines.</li>
          </ul>

          <h2>Kafka in Production</h2>

          <p>Kafka&apos;s mental model: a <strong>topic</strong> is a named, durable, append-only log split into <strong>partitions</strong>. Each partition is replicated across brokers (typically 3x). A <strong>producer</strong> writes records, optionally with a key; the key&apos;s hash determines the partition. A <strong>consumer group</strong> reads the topic; Kafka assigns each partition to one consumer in the group, so partition count caps consumer parallelism.</p>

          <p>Three properties to internalise:</p>
          <ol>
            <li><strong>Ordering is per-partition</strong>. Records with the same key land in the same partition and are read in order. Across partitions, ordering is undefined. Choose your key to align with the units you need ordered (e.g. user_id for per-user event ordering).</li>
            <li><strong>Consumer groups are independent</strong>. Two consumer groups reading the same topic do not affect each other - each tracks its own offset. This is the foundation of event-driven architectures: the orders topic feeds a billing pipeline AND a search-indexer AND an audit log, all reading the same stream independently.</li>
            <li><strong>Replication is for durability, not for read scale</strong>. Reads always go to the partition leader. Replicas exist so you can survive broker loss; they do not load-balance reads.</li>
          </ol>

          <h2>Delivery Guarantees - What Exactly-Once Actually Means</h2>

          <p>Three levels:</p>
          <ul>
            <li><strong>At-most-once</strong> - fire and forget; on failure the message is lost. Acceptable for telemetry where loss is fine.</li>
            <li><strong>At-least-once</strong> - the message will be delivered; possibly more than once. The default in most systems. Requires consumer-side <strong>idempotency</strong> (deduplication via idempotency keys).</li>
            <li><strong>Exactly-once</strong> - the message is processed exactly once, end-to-end. Kafka&apos;s exactly-once semantics work between Kafka topics; once a message leaves Kafka and writes to an external system, you are back to &ldquo;at-least-once + idempotency&rdquo;.</li>
          </ul>

          <p>Practical guidance: <strong>design for at-least-once with consumer-side idempotency</strong> as the default. Reach for exactly-once only when you genuinely cannot make consumers idempotent, and accept the operational cost.</p>

          <h2>Backpressure</h2>

          <p>Backpressure is the signal flowing upstream from a saturated consumer to a producer: &ldquo;slow down, I cannot keep up&rdquo;. Without it, producers happily fill queues until memory or disk runs out. Mechanisms:</p>
          <ul>
            <li>Bounded queues with blocking enqueue; the producer blocks when the queue is full.</li>
            <li>Reactive streams (Project Reactor, RxJava) with explicit demand signals.</li>
            <li>HTTP/2 flow control built into the protocol.</li>
            <li>Consumer-lag-driven producer throttling: if Kafka consumer lag exceeds a threshold, the producer service intentionally slows.</li>
          </ul>

          <p>The opposite anti-pattern: an unbounded in-memory queue that quietly grows until the JVM OOMs. Always bound your queues.</p>

          <h2>Common Production Failures</h2>

          <ul>
            <li><strong>Consumer lag spike</strong>: the canonical Kafka alert. A consumer group falls behind the head of the log. Causes: consumer slowed down, partition imbalance, downstream dependency degraded. The metric to watch: <code>kafka_consumer_lag_max</code> per group.</li>
            <li><strong>Rebalance storm</strong>: every time a consumer joins or leaves the group, all partition assignments are recomputed and consumers pause. Frequent rebalances kill throughput. Causes: aggressive session timeouts, slow processing exceeding heartbeat, scaling churn. Mitigation: tune <code>session.timeout.ms</code>, <code>heartbeat.interval.ms</code>, and use cooperative rebalance.</li>
            <li><strong>Hot partition</strong>: a partition key with skewed traffic (e.g. one big tenant) overloads one broker while others sit idle. Mitigation: salt the key, increase partition count, or use a different partitioning scheme.</li>
            <li><strong>Stuck consumer</strong>: a consumer hangs on one bad message and stops making progress. Mitigation: per-message timeouts, dead-letter queue, observability on per-message processing time.</li>
          </ul>

          <h2>Backpressure Propagation</h2>
          <svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="240" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">BACKPRESSURE - SIGNAL FLOWING UPSTREAM</text><rect x="40" y="80" width="120" height="50" rx="6" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e"/><text x="100" y="104" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">Producer</text><text x="100" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">5k req/s</text><line x1="160" y1="100" x2="220" y2="100" stroke="#22c55e" stroke-width="1.5" marker-end="url(#bpa)"/><rect x="220" y="80" width="120" height="50" rx="6" fill="#fbbf24" fill-opacity="0.3" stroke="#fbbf24"/><text x="280" y="104" text-anchor="middle" fill="#fcd34d" font-size="10" font-weight="700">Bounded queue</text><text x="280" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">cap 1000</text><line x1="340" y1="100" x2="400" y2="100" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#bpa)"/><rect x="400" y="80" width="120" height="50" rx="6" fill="#a855f7" fill-opacity="0.3" stroke="#a855f7"/><text x="460" y="104" text-anchor="middle" fill="#ddd6fe" font-size="10" font-weight="700">Consumer</text><text x="460" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">2k req/s</text><line x1="340" y1="135" x2="180" y2="135" stroke="#fca5a5" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#bpa)"/><text x="260" y="155" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="700">queue full → block producer</text><text x="400" y="200" text-anchor="middle" fill="#cbd5e1" font-size="11">Bounded queue + blocking enqueue = automatic backpressure. Producer slows to consumer rate.</text><text x="400" y="220" text-anchor="middle" fill="#94a3b8" font-size="10">Unbounded queue = silent OOM later. Always bound.</text><defs><marker id="bpa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>You have a Kafka topic with 4 partitions and a consumer group of 6 consumers. What happens?</strong> (Answer: 4 consumers each own one partition; 2 are idle. Partition count caps consumer parallelism in a group.)</li>
            <li><strong>Your team wants exactly-once delivery for a billing pipeline. What should you actually build?</strong> (Answer: at-least-once + consumer-side idempotency via idempotency keys. Kafka exactly-once works topic-to-topic but not topic-to-database.)</li>
            <li><strong>Consumer lag is climbing for one group, while another group reading the same topic is fine. What do you check?</strong> (Answer: the lagging group&apos;s downstream dependency or processing logic. Same topic + different lags = consumer-side issue, not Kafka.)</li>
            <li><strong>Why is partitioning by random key dangerous for an event stream where order matters per user?</strong> (Answer: messages for the same user end up on different partitions; per-user ordering is lost. Key by user_id.)</li>
          </ol>
        `,
        labs: [
          { title: 'Lab 3.1 - Kafka Event Pipeline End-to-End', objective: 'Build a producer/consumer pipeline with proper key-based partitioning and consumer groups.', repoPath: 'module-3/lab-kafka-pipeline', steps: ['Spin up Kafka via docker-compose', 'Write a producer that emits orders keyed by user_id', 'Write two consumer groups (billing, audit) reading the same topic', 'Verify per-key ordering on each partition', 'Kill a broker and verify durability'], duration: '90 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 3.2 - Backpressure in a Reactive Pipeline', objective: 'Reproduce a runaway producer; introduce bounded queues; observe stable throughput.', repoPath: 'module-3/lab-backpressure', steps: ['Implement an unbounded in-memory queue between producer and consumer', 'Run with producer at 10x consumer rate; watch memory grow', 'Replace with a bounded queue', 'Observe blocking on the producer; system stabilises'], duration: '60 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 3.3 - Idempotent Consumer with Dedup', objective: 'Design a consumer that processes at-least-once messages exactly once via idempotency keys.', repoPath: 'module-3/lab-idempotent-consumer', steps: ['Use a Postgres table with unique constraint on idempotency_key', 'Process orders; on duplicate, ignore', 'Inject duplicate messages; verify only one effect per key'], duration: '60 minutes', difficulty: 'Intermediate' },
        ],
        keyTakeaways: [
          'Async decouples in time, not in contract - the contract still has to be designed carefully',
          'Pick queue / pub-sub / event-streaming based on whether you need work-distribution, fan-out, or replayable log',
          'Default to at-least-once + consumer-side idempotency; reach for exactly-once only with reason',
          'Always bound your queues; unbounded is a delayed OOM',
          'Watch consumer lag as a first-class metric; it is the early warning of every event-pipeline incident',
        ],
        commonMistakes: [
          'Choosing exactly-once because it sounds safer; ignoring the operational cost and accepting the false sense of security.',
          'Single-partition topics for &ldquo;simplicity&rdquo;; they cap consumer parallelism at 1 and become bottlenecks.',
          'Ignoring partition keys; uniform random keys feel safe but break per-entity ordering.',
        ],
        glossary: [
          { term: 'Topic', definition: 'A named, durable, append-only log in Kafka, split into partitions for parallelism.' },
          { term: 'Consumer group', definition: 'A set of consumers that share partition assignments; each partition is read by exactly one consumer in the group.' },
          { term: 'Idempotency', definition: 'Property where applying the same operation multiple times produces the same effect as applying it once.' },
          { term: 'Backpressure', definition: 'Signal flowing upstream telling producers to slow down because consumers cannot keep up.' },
          { term: 'Consumer lag', definition: 'How far behind the head of the log a consumer group is; the canonical Kafka health metric.' },
        ],
        whyThisMatters: 'Async event pipelines are how every modern company scales beyond the synchronous-RPC limits of microservices. The teams that get event streams right ship features 3x faster (independent producers and consumers, no tight coupling) and survive failures better (decoupled in time means downstream slow does not block upstream fast). The teams that get them wrong end up with stuck consumers, lost messages, exactly-once theatre, and data loss they only discover during a regulatory audit.',
        productionNotes: [
          'Always bound queues. Unbounded in-memory queues are delayed OOMs.',
          'Default to at-least-once + consumer-side idempotency. Reach for exactly-once only when you genuinely cannot make consumers idempotent.',
          'Watch consumer lag as a first-class metric. Lag spikes precede every event-pipeline incident.',
          'Tune Kafka session timeouts and heartbeat intervals carefully - too aggressive triggers rebalance storms.',
        ],
        operationalStory: 'A logistics startup chose &ldquo;exactly-once&rdquo; for their order-tracking event stream because it sounded safer. Six months later a region-level Kafka outage exposed how brittle the exactly-once semantics were under partial failure: messages stuck in transactional limbo, consumer offsets out of sync with downstream state, and no one on the team understood the recovery flow well enough to act in under an hour. They eventually rewrote the consumer to be idempotent (UNIQUE constraint on order_id + version) and downgraded to at-least-once delivery. Recovery time went from hours to minutes.',
        designTradeoffs: [
          { option: 'Kafka', pros: ['Durable replayable log', 'Multiple independent consumer groups', 'Massive throughput', 'Mature ecosystem'], cons: ['Operational complexity (ZooKeeper/KRaft, brokers)', 'Heavy for small workloads', 'Topic / partition design is permanent'] },
          { option: 'RabbitMQ', pros: ['Flexible routing', 'Lower operational footprint', 'Simpler conceptually'], cons: ['Lower max throughput', 'No replay (messages disappear after ack)', 'Per-queue scalability limits'] },
          { option: 'NATS / Redis Streams', pros: ['Lightweight', 'Easy to operate', 'Low latency'], cons: ['Less durable than Kafka', 'Smaller ecosystem', 'Not suited for huge volumes'] },
        ],
        realWorldUseCases: [
          'LinkedIn (Kafka&apos;s birthplace) processes trillions of events per day across thousands of topics.',
          'Slack uses Kafka to fan out every message event to many internal consumers (search indexing, push notifications, analytics).',
          'Uber processes ride events through Kafka with strict per-rider ordering via partition keying.',
          'Netflix uses Kafka for the event bus underlying their playback telemetry, which feeds recommendations, observability, and billing.',
        ],
        securityRisks: [
          'Topics with PII data and no ACLs let any service in the cluster read sensitive events. Default-deny + per-consumer-group ACLs.',
          'Producer credentials in env vars can be exfiltrated; rotate via secret managers, not by redeploy.',
          'Consumer offset tampering can replay or skip messages; secure the offset commit path.',
          'mTLS between Kafka clients and brokers is mandatory for any production deployment over an untrusted network.',
        ],
        thinkLikeAnEngineer: [
          'Before designing topics, sketch the consumer graph. Each consumer group reads independently - what happens if one falls behind?',
          'Choose partition keys around the unit of ordering you actually need (per-user, per-order, per-tenant). The wrong key destroys ordering guarantees you needed.',
          'Treat the dead-letter queue depth as a SEV indicator. A growing DLQ means production data is silently being skipped.',
        ],
        beforeAfter: {
          before: [
            'Synchronous RPC between services; one slow service blocks the chain',
            'Tight coupling: producer changes require consumer changes',
            'No replay capability; lost messages are lost forever',
            'Manual exactly-once theatre with brittle distributed transactions',
          ],
          after: [
            'Decoupled in time via durable event log; producers and consumers scale independently',
            'New consumer groups added without producer changes',
            'Replay history for backfills, debugging, new use cases',
            'At-least-once + idempotency at the consumer; pragmatic, robust, simple',
          ],
        },
        productionAlternatives: [
          { name: 'Apache Kafka', description: 'Industry standard for high-throughput event streaming; partitioned, replayable, durable.' },
          { name: 'AWS Kinesis', description: 'Managed Kafka-equivalent on AWS; tighter integration with AWS services, less ecosystem flexibility.' },
          { name: 'Apache Pulsar', description: 'Tiered storage by default, multi-tenancy, geo-replication built in. Strong fit for multi-region from day one.' },
          { name: 'NATS JetStream', description: 'Lightweight alternative for lower-volume event streaming; simpler to operate.' },
          { name: 'Redis Streams', description: 'Best fit when you already run Redis and event volume is low; not a replacement for Kafka at scale.' },
        ],
      },
      {
        number: 4,
        title: 'Distributed Data Management',
        slug: 'distributed-data-management',
        subtitle: 'How modern systems split, replicate, and reconcile data across many machines - replication, sharding, quorums, consistency models, and the distributed databases that implement them.',
        duration: '5 hours',
        objectives: [
          'Pick between hash and range partitioning based on access patterns',
          'Design replication strategies (single-leader, multi-leader, leaderless) and their failover behaviour',
          'Apply quorum math (W + R > N) to choose consistency levels',
          'Read a Cassandra / DynamoDB / PostgreSQL replication topology and predict its failure modes',
          'Avoid the classic distributed-data anti-patterns: hot partitions, replication lag, write conflicts',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SHARDING + REPLICATION TOPOLOGY</text><text x="200" y="68" text-anchor="middle" fill="#3b82f6" font-size="11" font-weight="bold">Shard A (keys 0..k1)</text><circle cx="120" cy="120" r="20" fill="#3b82f6" fill-opacity="0.4" stroke="#3b82f6"/><text x="120" y="124" text-anchor="middle" fill="#bfdbfe" font-size="9" font-weight="bold">leader</text><circle cx="200" cy="120" r="18" fill="#1e293b" stroke="#3b82f6" stroke-dasharray="3 2"/><text x="200" y="124" text-anchor="middle" fill="#bfdbfe" font-size="8">replica</text><circle cx="280" cy="120" r="18" fill="#1e293b" stroke="#3b82f6" stroke-dasharray="3 2"/><text x="280" y="124" text-anchor="middle" fill="#bfdbfe" font-size="8">replica</text><line x1="140" y1="120" x2="180" y2="120" stroke="#3b82f6" stroke-dasharray="3 2"/><line x1="220" y1="120" x2="260" y2="120" stroke="#3b82f6" stroke-dasharray="3 2"/><text x="600" y="68" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="bold">Shard B (keys k1..k2)</text><circle cx="520" cy="120" r="20" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="520" y="124" text-anchor="middle" fill="#bbf7d0" font-size="9" font-weight="bold">leader</text><circle cx="600" cy="120" r="18" fill="#1e293b" stroke="#22c55e" stroke-dasharray="3 2"/><text x="600" y="124" text-anchor="middle" fill="#bbf7d0" font-size="8">replica</text><circle cx="680" cy="120" r="18" fill="#1e293b" stroke="#22c55e" stroke-dasharray="3 2"/><text x="680" y="124" text-anchor="middle" fill="#bbf7d0" font-size="8">replica</text><line x1="540" y1="120" x2="580" y2="120" stroke="#22c55e" stroke-dasharray="3 2"/><line x1="620" y1="120" x2="660" y2="120" stroke="#22c55e" stroke-dasharray="3 2"/><text x="200" y="200" text-anchor="middle" fill="#a855f7" font-size="11" font-weight="bold">Shard C (keys k2..k3)</text><circle cx="120" cy="252" r="20" fill="#a855f7" fill-opacity="0.4" stroke="#a855f7"/><text x="120" y="256" text-anchor="middle" fill="#ddd6fe" font-size="9" font-weight="bold">leader</text><circle cx="200" cy="252" r="18" fill="#1e293b" stroke="#a855f7" stroke-dasharray="3 2"/><text x="200" y="256" text-anchor="middle" fill="#ddd6fe" font-size="8">replica</text><circle cx="280" cy="252" r="18" fill="#1e293b" stroke="#a855f7" stroke-dasharray="3 2"/><text x="280" y="256" text-anchor="middle" fill="#ddd6fe" font-size="8">replica</text><text x="600" y="200" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="bold">Shard D (keys k3..)</text><circle cx="520" cy="252" r="20" fill="#fbbf24" fill-opacity="0.4" stroke="#fbbf24"/><text x="520" y="256" text-anchor="middle" fill="#fef3c7" font-size="9" font-weight="bold">leader</text><circle cx="600" cy="252" r="18" fill="#1e293b" stroke="#fbbf24" stroke-dasharray="3 2"/><text x="600" y="256" text-anchor="middle" fill="#fef3c7" font-size="8">replica</text><circle cx="680" cy="252" r="18" fill="#1e293b" stroke="#fbbf24" stroke-dasharray="3 2"/><text x="680" y="256" text-anchor="middle" fill="#fef3c7" font-size="8">replica</text><text x="400" y="320" text-anchor="middle" fill="#cbd5e1" font-size="11" font-weight="bold">Sharding splits the keyspace; replication protects each shard.</text><text x="400" y="340" text-anchor="middle" fill="#94a3b8" font-size="10">Per-shard quorum: W=2 R=2 N=3. Cross-shard transactions are expensive - design to avoid them.</text></svg>',
        content: `
          <p>One machine cannot hold all your data and one machine cannot survive forever. Distributed data management is the discipline of splitting state across many machines (sharding) and keeping multiple copies of each piece (replication) so that the system stays available, durable, and fast enough - while exposing a coherent enough story to applications that they can be written without thinking about every node.</p>

          <h2>Replication Strategies</h2>

          <p>Three classic models, each a different trade-off:</p>
          <ul>
            <li><strong>Single-leader</strong> (PostgreSQL streaming, MySQL, MongoDB primary): all writes go through one leader. Followers replicate the leader&apos;s log. Simple to reason about, but the leader is a bottleneck and a SPOF (mitigated by automatic failover).</li>
            <li><strong>Multi-leader</strong> (multi-region MySQL with bidirectional replication, CRDT-backed systems): writes accepted at multiple nodes; conflicts resolved by merge rules. Harder; useful for geo-distributed systems where local writes matter.</li>
            <li><strong>Leaderless</strong> (Cassandra, DynamoDB, Riak): writes are sent to multiple replicas in parallel; reads are reconciled via quorum. No single &ldquo;leader&rdquo; per partition.</li>
          </ul>

          <p>Synchronous vs asynchronous replication is orthogonal:</p>
          <ul>
            <li><strong>Synchronous</strong>: write is acknowledged after at least one replica confirms. Higher latency, no data loss on leader crash.</li>
            <li><strong>Asynchronous</strong>: write is acknowledged on leader commit; replicas catch up later. Lower latency; potential data loss window.</li>
            <li><strong>Semi-synchronous</strong>: hybrid; ack after any one replica confirms.</li>
          </ul>

          <h2>Sharding Strategies</h2>

          <p><strong>Hash partitioning</strong>: <code>partition = hash(key) % N</code>. Excellent load distribution; range queries are expensive (every shard touched). Used by Cassandra, DynamoDB, Redis Cluster.</p>

          <p><strong>Range partitioning</strong>: each shard owns a contiguous key range. Range queries are efficient; hot spots are easy to create (a key prefix that is heavily written becomes a single-shard bottleneck). Used by HBase, BigTable, CockroachDB, MongoDB sharded clusters.</p>

          <p><strong>Consistent hashing</strong>: solves the &ldquo;adding a node forces all keys to move&rdquo; problem of naive hash partitioning. Each node is hashed onto a ring; each key belongs to the next node clockwise. Adding a node only moves <code>1/N</code> of keys. Combined with virtual nodes (256 vnodes per physical node in Cassandra) for smoother rebalancing.</p>

          <p>The <a href="/blog/distributed-systems-algorithms-production-guide" class="text-primary underline">Distributed Systems Algorithms guide</a> goes deeper on consistent hashing math.</p>

          <h2>Quorum Math</h2>

          <p>With <code>N</code> replicas, write quorum <code>W</code>, and read quorum <code>R</code>, you achieve strong consistency when <code>W + R &gt; N</code>. The intuition: any read overlaps any write by at least one node, so the latest write is visible.</p>

          <ul>
            <li>N=3, W=2, R=2: tolerates 1 failure for both reads and writes; strong consistency. Standard Cassandra production.</li>
            <li>N=3, W=3, R=1: every write hits all replicas; reads are fast and consistent; one failure blocks writes. Read-heavy workloads.</li>
            <li>N=3, W=1, R=1: maximum availability and lowest latency; eventual consistency only. DynamoDB default.</li>
            <li>N=5, W=3, R=3: tolerates 2 simultaneous failures; strong consistency. Mission-critical Cassandra clusters.</li>
          </ul>

          <p>Cassandra exposes this as consistency levels (<code>ONE</code>, <code>QUORUM</code>, <code>LOCAL_QUORUM</code>, <code>EACH_QUORUM</code>, <code>ALL</code>). For multi-region deployments <code>LOCAL_QUORUM</code> is critical - it requires a quorum within the local datacentre but does not wait for cross-region acks.</p>

          <h2>Consistency Models in Practice</h2>

          <p>The same hierarchy you saw in Module 1 (Linearizable → Sequential → Causal → Read-your-writes → Eventual) shows up in every real database, often as <em>tunable</em> guarantees:</p>
          <ul>
            <li>Cassandra: per-query consistency level.</li>
            <li>MongoDB: <code>readConcern</code> (local, majority, linearizable) + <code>writeConcern</code>.</li>
            <li>DynamoDB: per-call <code>ConsistentRead</code> flag.</li>
            <li>Spanner / CockroachDB: linearizable by default, with explicit follower-read modes.</li>
          </ul>

          <h2>Distributed Database Choices</h2>

          <ul>
            <li><strong>Postgres / MySQL</strong>: single-leader replication; horizontal scale via read replicas or external sharding (Citus, Vitess). Strong consistency on the leader; read lag on replicas.</li>
            <li><strong>Cassandra</strong>: leaderless, hash-partitioned, AP-leaning. High write throughput, tunable consistency. Great for write-heavy time-series; less great for low-latency reads of small data.</li>
            <li><strong>DynamoDB</strong>: managed, hash-partitioned, AP-leaning. Eventual or strong consistency per call. Excellent if you stay within its access patterns; expensive if you fight them.</li>
            <li><strong>CockroachDB</strong>: distributed SQL with per-range Raft consensus. Linearizable by default; horizontal scale; SQL surface. The heaviest of the modern options.</li>
            <li><strong>Spanner / TiDB</strong>: globally-distributed SQL with linearizable transactions backed by TrueTime / TSO. Premium pricing for premium consistency.</li>
            <li><strong>Redis Cluster</strong>: in-memory, hash-slot partitioned, asynchronous replication. Great cache or session store; not your primary database.</li>
          </ul>

          <h2>Common Pitfalls</h2>

          <ul>
            <li><strong>Read-your-writes anomaly</strong>: writing to leader, reading from a replica, getting your own old value. Fix: stickify reads to leader for a short window after a write.</li>
            <li><strong>Hot partition</strong>: a partition key with skewed traffic (one tenant, one celebrity user) overloads one node. Fix: salted keys, increased shard count, multi-tenant isolation.</li>
            <li><strong>Cross-shard transactions</strong>: expensive (2PC, distributed locking). Design data models to keep related data in the same shard wherever possible.</li>
            <li><strong>Replication lag spikes</strong>: replicas fall behind during bulk writes; reads served from lagging replicas return stale data. Monitor lag in seconds or bytes; fail reads to leader past a threshold.</li>
          </ul>

          <h2>Quorum Write Flow</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">QUORUM WRITE: N=3, W=2 (Cassandra-style)</text><rect x="40" y="80" width="120" height="50" rx="6" fill="#3b82f6" fill-opacity="0.3" stroke="#3b82f6"/><text x="100" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">Coordinator</text><text x="100" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">picks any node</text><line x1="160" y1="100" x2="280" y2="100" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#qa)"/><line x1="160" y1="100" x2="280" y2="160" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#qa)"/><line x1="160" y1="100" x2="280" y2="220" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#qa)"/><circle cx="320" cy="100" r="22" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="320" y="104" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">R1</text><text x="320" y="138" text-anchor="middle" fill="#86efac" font-size="9">ack</text><circle cx="320" cy="160" r="22" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="320" y="164" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">R2</text><text x="320" y="198" text-anchor="middle" fill="#86efac" font-size="9">ack</text><circle cx="320" cy="220" r="22" fill="#94a3b8" fill-opacity="0.3" stroke="#94a3b8" stroke-dasharray="3 2"/><text x="320" y="224" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">R3</text><text x="320" y="258" text-anchor="middle" fill="#94a3b8" font-size="9">slow / down</text><line x1="342" y1="100" x2="420" y2="100" stroke="#22c55e" stroke-width="1.5" marker-end="url(#qa)"/><line x1="342" y1="160" x2="420" y2="160" stroke="#22c55e" stroke-width="1.5" marker-end="url(#qa)"/><rect x="420" y="120" width="200" height="40" rx="6" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e"/><text x="520" y="144" text-anchor="middle" fill="#bbf7d0" font-size="11" font-weight="700">2 acks ≥ W=2 ✓ commit</text><text x="640" y="100" fill="#94a3b8" font-size="10">Hinted handoff</text><text x="640" y="116" fill="#94a3b8" font-size="10">repairs R3 later</text><text x="400" y="296" text-anchor="middle" fill="#94a3b8" font-size="10">W+R&gt;N (e.g. W=2, R=2 with N=3) gives strong consistency under any single failure.</text><defs><marker id="qa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>N=5 Cassandra cluster. You write with CL=QUORUM, then immediately read with CL=ONE. Can you see your write?</strong> (Answer: not guaranteed. CL=ONE returns the first replica response, which may be a stale one. For strong consistency, you need W+R&gt;N - e.g. CL=QUORUM on both.)</li>
            <li><strong>Your single celebrity user generates 90% of writes for one shard. What is happening, and what is the fix?</strong> (Answer: hot partition. Fix: split the key with salting (user_id:0..N) and aggregate at read time, or scale out and use a different partitioning key.)</li>
            <li><strong>Why does range-partitioned MongoDB sometimes accidentally create hot shards while hash-partitioned Cassandra rarely does?</strong> (Answer: range partitioning concentrates time-prefix or sequential keys on one shard; hash partitioning randomises. Choose the partition strategy based on access pattern.)</li>
            <li><strong>You see replication lag of 30 seconds on a Postgres read replica. What three actions matter most?</strong> (Answer: alert if it exceeds threshold; route latency-sensitive reads to leader; investigate root cause - bulk writes, slow disk, or vacuum.)</li>
          </ol>

          <p>For the algorithm-level treatment of consistent hashing, vector clocks, CRDTs, and quorum proofs, read the <a href="/blog/distributed-systems-algorithms-production-guide" class="text-primary underline">Distributed Systems Algorithms guide</a>. For Kubernetes-specific operational patterns the <a href="/cheatsheets/kubernetes" class="text-primary underline">Kubernetes cheatsheet</a> is the fast reference.</p>
        `,
        labs: [
          { title: 'Lab 4.1 - Postgres Streaming Replication + Failover', objective: 'Set up Postgres primary + replica, force failover, observe data loss window with sync vs async replication.', repoPath: 'module-4/lab-postgres-replication', steps: ['Spin up primary + replica with docker-compose', 'Run async replication; cause primary crash mid-write; measure data loss', 'Switch to synchronous_commit=on; rerun; verify zero data loss'], duration: '60 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 4.2 - Cassandra Quorum Behaviour', objective: 'Run a 3-node Cassandra cluster, vary consistency levels, observe behaviour during node failure.', repoPath: 'module-4/lab-cassandra-quorum', steps: ['Spin up Cassandra cluster (3 nodes)', 'Write with CL=QUORUM; verify reads see latest', 'Kill one node; verify QUORUM still works', 'Kill two nodes; verify QUORUM fails; ONE still works (eventual)'], duration: '90 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 4.3 - Hot Partition Reproduction', objective: 'Cause and mitigate a hot partition in Redis Cluster.', repoPath: 'module-4/lab-hot-partition', steps: ['Send 90% of traffic to one key', 'Observe per-node QPS; identify the hot node', 'Apply key salting (key:0..key:9); redistribute', 'Confirm load balances'], duration: '45 minutes', difficulty: 'Intermediate' },
        ],
        keyTakeaways: [
          'Replication is for durability and availability; sharding is for scale - you need both at scale',
          'Quorum math (W + R > N) is the rule for strong consistency in leaderless systems',
          'Hot partitions are the #1 distributed-data scalability bug; design key spaces deliberately',
          'Cross-shard transactions are expensive; data models should make them rare',
          'Replication lag is a first-class metric to alert on, not an implementation detail',
        ],
        commonMistakes: [
          'Choosing eventual consistency without thinking through the read-your-writes anomaly.',
          'Single-region Cassandra with consistency level QUORUM - works fine until you go multi-region and discover the cross-region quorum cost.',
          'Treating replicas as a read-scale solution when replication lag means stale reads.',
        ],
        glossary: [
          { term: 'Sharding', definition: 'Splitting data across multiple machines by partitioning the key space.' },
          { term: 'Quorum', definition: 'Minimum number of nodes that must respond for an operation to be considered successful.' },
          { term: 'Replication lag', definition: 'How far behind the leader a replica is; the staleness window for reads from that replica.' },
          { term: 'Hot partition', definition: 'A partition with disproportionately high traffic, overloading one node.' },
          { term: 'Eventual consistency', definition: 'Replicas converge to the same state if writes stop; the weakest useful guarantee.' },
        ],
        whyThisMatters: 'Distributed data is the hardest part of distributed systems - once data is split across machines, every read and write has to navigate replication lag, partition imbalance, and consistency trade-offs. Engineers who internalise the W+R&gt;N rule, hot-partition mitigations, and the difference between sync and async replication design data layers that hold up. Engineers who skip the foundations end up reinventing distributed databases badly and debugging the same outages for years.',
        productionNotes: [
          'Replication lag is a first-class metric to alert on. Past a threshold, fail reads back to the leader rather than serve stale data.',
          'Hot partitions are the #1 distributed-data scalability bug. Detect via per-shard QPS dashboards; mitigate via key salting or tenant-aware shard routing.',
          'Cross-shard transactions are expensive (2PC, distributed locking). Design data models to keep related data co-located in the same shard.',
        ],
        operationalStory: 'A SaaS platform launched a feature where one enterprise customer suddenly generated 90% of writes to a single shard. Cassandra p99 went from 10ms to 600ms within a day. The team scaled out vertically, then horizontally, neither helped - only one node was hot. The fix was salting the customer&apos;s key (customer_id:0..15) and aggregating reads across the salted partitions. p99 dropped back below 20ms. The lesson: skewed traffic is the rule, not the exception, for any multi-tenant system.',
        designTradeoffs: [
          { option: 'Single-leader (Postgres, MySQL)', pros: ['Strong consistency on the leader', 'Simple to reason about', 'Atomic transactions'], cons: ['Leader is a write bottleneck', 'Failover is the SPOF reconciliation problem', 'Read replicas have lag'] },
          { option: 'Leaderless (Cassandra, DynamoDB)', pros: ['No single bottleneck', 'High write throughput', 'Tunable consistency'], cons: ['Complex consistency story', 'No cross-key transactions', 'Operational complexity'] },
          { option: 'Multi-leader (CRDT-backed, multi-region MySQL)', pros: ['Local writes in every region', 'No coordination latency'], cons: ['Conflict resolution required', 'Hard to reason about'] },
        ],
        realWorldUseCases: [
          'Cassandra at Netflix replicates user data across multiple regions with LOCAL_QUORUM for low-latency reads.',
          'DynamoDB Global Tables provide multi-region active-active with last-writer-wins by default.',
          'CockroachDB uses per-range Raft groups to provide globally-consistent SQL with horizontal scale.',
          'Discord migrated from MongoDB to Cassandra (then to ScyllaDB) for their messages workload due to Cassandra&apos;s leaderless write throughput.',
        ],
        securityRisks: [
          'Multi-tenant sharded systems leak data when the application forgets to scope queries by tenant_id; design tenant scoping into the storage layer, not the app.',
          'Read replicas with different RBAC than the primary expose data the security team thought was protected.',
          'Backups of distributed databases multiply the data-leak surface; encrypt at rest with KMS, audit access.',
          'Cross-region replication over public internet must use TLS; a leaked snapshot in transit is a leaked database.',
        ],
        thinkLikeAnEngineer: [
          'Choose partition keys based on the access pattern, not the storage convenience. Keys that are easy to write but hard to query become technical debt.',
          'For multi-tenant systems, design for the worst tenant. The 90th-percentile customer is your bottleneck before it&apos;s your average.',
          'Consistency level is per query, not per database. Force engineers to make the choice deliberately for each operation.',
        ],
        beforeAfter: {
          before: [
            'Single Postgres primary; vertical scaling until the box maxes out',
            'Hot keys cause unexplained latency; team scales the cluster, no improvement',
            'Multi-region by accident; cross-region writes drag p99 beyond the SLO',
            'Stale reads from replicas confuse users; no consistency model documented',
          ],
          after: [
            'Sharded data layer chosen for the access pattern; horizontal scale as a normal mode',
            'Per-shard QPS dashboards; hot keys detected before users are affected',
            'Multi-region with LOCAL_QUORUM (Cassandra) or sharded ownership (CockroachDB)',
            'Consistency level per query; engineers make the choice with eyes open',
          ],
        },
        productionAlternatives: [
          { name: 'Sharded Postgres (Citus, Vitess)', description: 'Postgres with horizontal sharding; keep SQL surface, add scale.' },
          { name: 'Apache Cassandra / ScyllaDB', description: 'Leaderless, hash-partitioned, AP-leaning; best for high write throughput.' },
          { name: 'CockroachDB / TiDB / YugabyteDB', description: 'Distributed SQL with per-range consensus; SQL surface + horizontal scale.' },
          { name: 'Spanner / AlloyDB', description: 'Globally-consistent SQL; premium pricing for premium consistency.' },
          { name: 'DynamoDB', description: 'Managed, hash-partitioned; great if you stay within its access patterns, painful if you fight them.' },
        ],
      },
      {
        number: 5,
        title: 'Consensus & Coordination',
        slug: 'consensus-coordination',
        subtitle: 'How distributed nodes agree - Raft, Paxos, leader election, distributed locking, and the etcd / ZooKeeper / Consul systems that production runs on.',
        duration: '5 hours',
        objectives: [
          'Explain consensus as a problem and why it is fundamental to CP systems',
          'Walk through Raft leader election, log replication, and safety in detail',
          'Compare Raft and Paxos and pick between them in practice',
          'Implement distributed locking correctly (with fencing tokens, not just SETNX)',
          'Operate etcd, ZooKeeper, or Consul without taking down your cluster',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">RAFT CONSENSUS - LOG REPLICATION</text><circle cx="120" cy="120" r="32" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e" stroke-width="2"/><text x="120" y="124" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">LEADER</text><text x="120" y="170" text-anchor="middle" fill="#94a3b8" font-size="9">term=7</text><circle cx="320" cy="80" r="28" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="320" y="84" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="bold">FOLLOWER</text><text x="320" y="124" text-anchor="middle" fill="#94a3b8" font-size="9">term=7</text><circle cx="320" cy="200" r="28" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="320" y="204" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="bold">FOLLOWER</text><text x="320" y="244" text-anchor="middle" fill="#94a3b8" font-size="9">term=7</text><circle cx="520" cy="80" r="28" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="520" y="84" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="bold">FOLLOWER</text><circle cx="520" cy="200" r="28" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="520" y="204" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="bold">FOLLOWER</text><line x1="150" y1="115" x2="290" y2="90" stroke="#22c55e" stroke-width="1.5" marker-end="url(#a5)"/><line x1="150" y1="135" x2="290" y2="195" stroke="#22c55e" stroke-width="1.5" marker-end="url(#a5)"/><line x1="350" y1="80" x2="490" y2="80" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/><line x1="350" y1="200" x2="490" y2="200" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/><text x="220" y="80" text-anchor="middle" fill="#86efac" font-size="9">AppendEntries</text><rect x="120" y="280" width="560" height="60" rx="8" fill="#1e293b" stroke="#475569"/><text x="400" y="302" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="bold">Log replication: leader appends client cmd, replicates to majority, then commits.</text><text x="400" y="322" text-anchor="middle" fill="#94a3b8" font-size="10">3-node cluster: tolerates 1 failure. 5-node: tolerates 2. Always odd.</text><defs><marker id="a5" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
        content: `
          <p>Consensus is the hardest problem in distributed systems. It is also the most under-appreciated, because by the time you are using it - via Kubernetes etcd, Consul, HashiCorp Vault HA storage, CockroachDB ranges - someone else has implemented it correctly and you mostly do not notice it&apos;s there. Until you do.</p>

          <h2>What Consensus Is</h2>

          <p>The problem: a group of nodes must agree on a single value, even when some of them fail or messages are dropped. If they agree on a value, all surviving nodes must agree on the same value. The agreement must be safe under any failure pattern that does not partition more than half the nodes (the FLP impossibility result, 1985).</p>

          <p>Consensus is the basis of every CP system. To have a single leader, you need consensus on who the leader is. To have replicated state, you need consensus on what the next state should be. To do distributed locking correctly, you need consensus on who holds the lock.</p>

          <h2>Raft - Consensus for Humans</h2>

          <p>Raft (Ongaro &amp; Ousterhout, 2014) was designed to be understandable. It decomposes consensus into three subproblems - leader election, log replication, and safety - and provides the same correctness guarantees as Paxos with a much simpler mental model.</p>

          <p><strong>Leader election</strong>: every node is in one of three states (follower, candidate, leader). Followers expect heartbeats from the leader; if they do not arrive within a randomised election timeout (150&ndash;300ms), the follower transitions to candidate, increments the term number, and requests votes from peers. A candidate that gathers a majority becomes leader for that term. Term numbers are monotonic; older terms are rejected.</p>

          <p><strong>Log replication</strong>: clients send commands to the leader. The leader appends to its log, sends <code>AppendEntries</code> to followers, and commits the entry once a majority have acknowledged. Followers apply committed entries to their state machines in order.</p>

          <p><strong>Safety</strong>: election rules ensure a candidate can only win if its log is at least as up-to-date as a majority of followers. This guarantees committed entries are never lost.</p>

          <h2>Paxos and Why You Probably Don&apos;t Implement It</h2>

          <p>Paxos (Lamport, 1989) was the first practical consensus algorithm and is still mathematically influential. In production it has been largely displaced by Raft for new systems because Raft is meaningfully easier to implement correctly. Google&apos;s Chubby and Spanner use Paxos variants; etcd, Consul, CockroachDB, HashiCorp Vault, and most modern distributed systems use Raft.</p>

          <h2>Cluster Sizing</h2>

          <p>The fundamental rule: a Raft (or Paxos) cluster of <code>2N+1</code> nodes tolerates <code>N</code> simultaneous failures. So:</p>
          <ul>
            <li>3 nodes &rArr; tolerates 1 failure.</li>
            <li>5 nodes &rArr; tolerates 2 failures.</li>
            <li>7 nodes &rArr; tolerates 3 failures (rarely used; commit latency suffers).</li>
          </ul>

          <p>Always use odd numbers. A 4-node cluster requires 3 to commit; same fault tolerance as 3 nodes, more network traffic. A 6-node cluster requires 4 to commit; same fault tolerance as 5.</p>

          <h2>Distributed Locking</h2>

          <p>The naive Redis lock (<code>SET lock value NX EX 30</code>) famously fails under network partition: a client believes it holds the lock; the network blips; the lock TTL expires; another client acquires the lock; the original client wakes up and acts as if it still holds the lock; you have two writers.</p>

          <p>The robust pattern: <strong>fencing tokens</strong>. The lock service issues a monotonically increasing token with each acquisition. The lock holder includes the token in every operation; the resource (database, file system) rejects operations from older tokens. Even if two clients believe they hold the lock, only the higher-token operation succeeds. etcd, ZooKeeper, and Consul all support this pattern; Redis does not natively.</p>

          <h2>etcd, ZooKeeper, Consul - The Production Trio</h2>

          <ul>
            <li><strong>etcd</strong>: Raft-based KV store; the substrate of Kubernetes; used by Vault HA, Rook. Optimised for correctness and Kubernetes integration.</li>
            <li><strong>ZooKeeper</strong>: ZAB-based (similar to Raft) coordination service; older, mature, used by HBase, Kafka (legacy), Solr.</li>
            <li><strong>Consul</strong>: Raft-based service registry + KV + health checks + service mesh; HashiCorp&apos;s integrated approach.</li>
          </ul>

          <p>For new infrastructure, etcd is the default. For ZooKeeper-backed legacy systems (HBase, older Kafka), running ZooKeeper is the path of least resistance. Consul shines when you want the service-registry features alongside the coordination primitives.</p>

          <h2>Operational Hazards</h2>

          <ul>
            <li><strong>Stuck quorum</strong>: 3-node etcd loses 2 nodes; remaining node cannot make progress. Recovery: single-node restoration from snapshot, then re-add members. Practice this drill.</li>
            <li><strong>Slow disk</strong>: Raft commit requires fsync; a slow disk slows every write across the cluster. Use SSDs; alert on fsync latency.</li>
            <li><strong>Network partition</strong>: minority side cannot elect a leader and refuses writes; majority side keeps working. Verify clients fail-fast on the minority side rather than hanging.</li>
            <li><strong>Cluster too large</strong>: more than 7 voters and commit latency suffers; consider learner nodes for scale-out.</li>
          </ul>

          <h2>Distributed Lock with Fencing Token</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">DISTRIBUTED LOCK + FENCING TOKEN</text><line x1="120" y1="60" x2="120" y2="260" stroke="#475569" stroke-width="1"/><line x1="400" y1="60" x2="400" y2="260" stroke="#475569" stroke-width="1"/><line x1="680" y1="60" x2="680" y2="260" stroke="#475569" stroke-width="1"/><text x="120" y="78" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Client A</text><text x="400" y="78" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">etcd lease</text><text x="680" y="78" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="bold">Resource</text><line x1="120" y1="100" x2="400" y2="100" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#lka)"/><text x="260" y="94" text-anchor="middle" fill="#94a3b8" font-size="10">acquire lock</text><line x1="400" y1="125" x2="120" y2="125" stroke="#22c55e" stroke-width="1.5" marker-end="url(#lka)"/><text x="260" y="119" text-anchor="middle" fill="#86efac" font-size="10">token = 33</text><line x1="120" y1="160" x2="680" y2="160" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#lka)"/><text x="400" y="154" text-anchor="middle" fill="#94a3b8" font-size="10">write with token=33</text><text x="700" y="180" fill="#86efac" font-size="10" font-weight="700">stored: max_seen = 33</text><line x1="120" y1="210" x2="680" y2="210" stroke="#fca5a5" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#lka)"/><text x="400" y="204" text-anchor="middle" fill="#fca5a5" font-size="10">stale Client A retries with token=33</text><text x="700" y="228" fill="#fca5a5" font-size="10" font-weight="700">reject: token &lt; 34</text><text x="400" y="270" text-anchor="middle" fill="#cbd5e1" font-size="10">Resource enforces monotonic token. Stale lock holders cannot corrupt state.</text><defs><marker id="lka" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>You have a 4-node Raft cluster. How many failures can it tolerate?</strong> (Answer: still only 1. 2N+1 with N=1 (so 3 nodes) and N=2 (so 5 nodes); 4 nodes need 3 to commit, same as 3-node cluster but with more network traffic. Always odd.)</li>
            <li><strong>Why does the naive Redis SETNX lock fail under network partition?</strong> (Answer: TTL expires while client thinks it holds the lock; another client acquires; original client wakes up and acts as if it still has the lock. Need fencing tokens.)</li>
            <li><strong>etcd commit latency suddenly tripled. What is the most likely cause?</strong> (Answer: slow disk fsync. Raft commit requires fsync on the leader and majority followers. SSDs and disk-latency monitoring matter.)</li>
            <li><strong>Your 3-node etcd cluster lost 2 nodes. What is the recovery path?</strong> (Answer: do NOT add nodes to a stuck cluster. Snapshot from the surviving node, single-node restoration, then add members one at a time. Test this drill quarterly.)</li>
          </ol>

          <p>For deeper coverage of how <a href="/glossary/spire" class="text-primary underline">SPIRE</a> Server uses Raft for HA, see the <a href="/courses/mastering-spiffe-spire/spire-architecture-components" class="text-primary underline">SPIRE Architecture &amp; Components module</a>. The <a href="/cheatsheets/spiffe-spire" class="text-primary underline">SPIFFE/SPIRE cheatsheet</a> is the fast operational reference once you start running etcd-backed identity systems. The underlying identity primitive (<a href="/glossary/spiffe" class="text-primary underline">SPIFFE</a>) is the standard the rest of the modern stack converges on.</p>
        `,
        labs: [
          { title: 'Lab 5.1 - etcd Cluster Bootstrap and Failover', objective: 'Run a 3-node etcd cluster, write data, kill one node, verify availability; kill two, observe stuck quorum.', repoPath: 'module-5/lab-etcd-cluster', steps: ['Bootstrap 3-node etcd via docker-compose', 'Write keys, observe replication', 'Kill one node; verify writes still succeed', 'Kill two nodes; verify writes block', 'Restore from snapshot; re-add members'], duration: '90 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 5.2 - Distributed Lock with Fencing Token', objective: 'Implement a correct distributed lock using etcd Lease + fencing token; demonstrate why naive locks fail.', repoPath: 'module-5/lab-distributed-lock', steps: ['Implement naive Redis SETNX lock; reproduce partition failure mode', 'Implement etcd-based lock with fencing token', 'Resource (Postgres) rejects operations from old tokens', 'Demonstrate two-client race; only one operation succeeds'], duration: '90 minutes', difficulty: 'Advanced' },
          { title: 'Lab 5.3 - Leader Election in Application Code', objective: 'Build a singleton-task pattern: many replicas, only one runs the periodic job at a time.', repoPath: 'module-5/lab-leader-election', steps: ['Use Kubernetes Lease object as election primitive', 'Run 3 replicas; only the leader executes the cron logic', 'Kill the leader; verify another replica takes over within seconds'], duration: '60 minutes', difficulty: 'Intermediate' },
        ],
        keyTakeaways: [
          'Consensus is the substrate of every CP system; Kubernetes, Vault, and most modern infra rely on Raft etcd',
          'Use Raft for new systems; Paxos is the older, harder alternative',
          'Cluster size: 2N+1 tolerates N failures; always odd; 3 or 5 for nearly all real workloads',
          'Distributed locking requires consensus + fencing tokens, not naive SETNX',
          'A stuck quorum is recoverable but only if you have a tested runbook; never improvise',
        ],
        whyThisMatters: 'Engineers who understand consensus stop being scared of etcd. They can read a Raft log replay, recover a stuck cluster, and design a system around the trade-offs of CP versus AP rather than tripping over them. This is the module that separates engineers who treat distributed coordination as &ldquo;magic&rdquo; from engineers who treat it as load-bearing infrastructure they own.',
        glossary: [
          { term: 'Consensus', definition: 'The problem of getting a group of distributed nodes to agree on a single value, even with failures.' },
          { term: 'Raft', definition: 'A consensus algorithm designed to be understandable; used by etcd, Consul, CockroachDB.' },
          { term: 'Quorum', definition: 'Majority of nodes; required for any progress in Raft / Paxos.' },
          { term: 'Fencing token', definition: 'Monotonic token issued by a lock service; prevents stale lock holders from corrupting state.' },
          { term: 'Leader election', definition: 'Process by which a single node is chosen to coordinate; foundational to Raft and many distributed systems.' },
        ],
        productionNotes: [
          'Always use odd-number Raft clusters: 3 for most workloads, 5 for high availability. Never even.',
          'Practice etcd snapshot recovery quarterly. The runbook for recovering a stuck quorum is the difference between minutes and hours of cluster downtime.',
          'Run etcd on dedicated SSDs with low fsync latency. Slow disks slow every write across the cluster.',
        ],
        commonMistakes: [
          'Inventing your own &ldquo;HA&rdquo; with naive locks (Redis SETNX) instead of using consensus primitives. Always fails under partition.',
          'Adding a node to a stuck Raft cluster instead of restoring from snapshot. New nodes need a quorum to join.',
          'Running consensus on shared infrastructure (etcd on the same disk as your database). Slow neighbour = stuck quorum.',
        ],
        operationalStory: 'A 3-node etcd cluster on AWS lost two nodes during an AZ event. The remaining node could not reach quorum and refused all writes. The Kubernetes API froze. The on-call team panicked and tried to add new nodes, which made things worse - new members cannot join a cluster without quorum. Recovery required restoring from snapshot to a single node, then re-adding members one at a time. Total outage: 2 hours. Lesson: 5-node etcd across 3 AZs from the start, plus a tested runbook the team has actually executed in a drill.',
        designTradeoffs: [
          { option: 'Raft', pros: ['Designed for understandability', 'Stable, well-implemented in many libraries', 'Standard for new systems'], cons: ['Newer than Paxos', 'Performance very slightly behind multi-Paxos in some workloads'] },
          { option: 'Paxos / Multi-Paxos', pros: ['Mathematically influential', 'Battle-tested in Google Spanner / Chubby'], cons: ['Notoriously hard to implement correctly', 'Many subtle production bugs'] },
          { option: '3-node Raft cluster', pros: ['Tolerates 1 failure', 'Lowest commit latency', 'Cheapest infra'], cons: ['Loss of 2 nodes = stuck quorum'] },
          { option: '5-node Raft cluster', pros: ['Tolerates 2 failures', 'Survives multi-AZ outages'], cons: ['Higher commit latency', 'More infra cost'] },
        ],
        realWorldUseCases: [
          'etcd backs every Kubernetes cluster ever deployed; Raft is in your production stack whether you knew it or not.',
          'CockroachDB runs thousands of Raft groups per cluster, one per data range.',
          'HashiCorp Vault HA storage uses Raft for replicated secret state.',
          'Consul uses Raft for the catalogue and KV store; Serf for the gossip layer.',
        ],
        thinkLikeAnEngineer: [
          'Before you reach for a distributed lock, ask: do I need lock semantics, or do I need leader-elected singleton execution? They are different problems with different primitives.',
          'When you see &ldquo;HA via two replicas&rdquo; in a design doc, ask: what happens during a partition? If the answer is fuzzy, you do not have HA - you have two SPOFs.',
        ],
        securityRisks: [
          'etcd unencrypted at rest exposes every Kubernetes secret in the snapshot. Always enable KMS-backed encryption.',
          'etcd peer / client TLS is not on by default in some installers; verify before going to production.',
          'A compromised etcd member can poison cluster state. Audit etcd member additions and rotate certs regularly.',
          'Distributed locks without fencing tokens silently allow stale lock holders to corrupt resources.',
        ],
        beforeAfter: {
          before: [
            'Naive Redis SETNX locks; silent corruption under partition',
            'Single etcd node &ldquo;for simplicity&rdquo;; one disk failure = entire cluster unrecoverable',
            'No documented runbook for stuck quorum; outages last hours',
            'ZooKeeper running on shared infrastructure; noisy neighbour starves consensus',
          ],
          after: [
            'Distributed locks via etcd Lease + fencing token; resource rejects stale tokens',
            '5-node etcd across 3 AZs; tested snapshot restore runbook',
            'Quorum loss recovery practiced quarterly; outages bounded to minutes',
            'Dedicated etcd nodes with SSD; fsync latency monitored as first-class metric',
          ],
        },
        productionAlternatives: [
          { name: 'etcd', description: 'Raft-based KV; substrate of Kubernetes; default for new infra.' },
          { name: 'ZooKeeper', description: 'ZAB-based; mature, used by HBase / older Kafka / Solr.' },
          { name: 'Consul', description: 'Raft + service registry + KV + health checks; HashiCorp&apos;s integrated approach.' },
          { name: 'Apache Bookkeeper', description: 'Used as the backing store for Pulsar; consensus + ledger storage.' },
          { name: 'Hazelcast / Apache Ignite', description: 'In-memory data grids with consensus-backed coordination; fits when latency &lt; 1ms required.' },
        ],
      },
      {
        number: 6,
        title: 'Scalability Engineering',
        slug: 'scalability-engineering',
        subtitle: 'Horizontal scaling, autoscaling, caching, CDNs, rate limiting - how production systems handle 10x and 100x traffic without 10x and 100x cost.',
        duration: '4 hours',
        objectives: [
          'Design stateless services that scale horizontally without coordination',
          'Pick the right caching strategy (cache-aside, write-through, write-back) for the workload',
          'Configure Kubernetes HPA, VPA, and Cluster Autoscaler so they actually work',
          'Implement distributed rate limiting that survives multi-region',
          'Identify the scalability bottleneck before it becomes the outage',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SCALABILITY STACK</text><rect x="60" y="60" width="680" height="40" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="80" y="84" fill="#86efac" font-size="11" font-weight="bold">CDN edge</text><text x="720" y="84" text-anchor="end" fill="#94a3b8" font-size="10">cached static + dynamic, geo-distributed</text><rect x="60" y="105" width="680" height="40" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="80" y="129" fill="#bfdbfe" font-size="11" font-weight="bold">Load balancer + WAF</text><text x="720" y="129" text-anchor="end" fill="#94a3b8" font-size="10">L7 routing, rate-limit, edge auth</text><rect x="60" y="150" width="680" height="40" rx="6" fill="#a855f7" fill-opacity="0.2" stroke="#a855f7"/><text x="80" y="174" fill="#ddd6fe" font-size="11" font-weight="bold">Stateless service tier</text><text x="720" y="174" text-anchor="end" fill="#94a3b8" font-size="10">HPA scales pods on CPU / RPS / latency</text><rect x="60" y="195" width="680" height="40" rx="6" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24"/><text x="80" y="219" fill="#fcd34d" font-size="11" font-weight="bold">Distributed cache</text><text x="720" y="219" text-anchor="end" fill="#94a3b8" font-size="10">Redis Cluster, Memcached</text><rect x="60" y="240" width="680" height="40" rx="6" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899"/><text x="80" y="264" fill="#fbcfe8" font-size="11" font-weight="bold">Async work queue</text><text x="720" y="264" text-anchor="end" fill="#94a3b8" font-size="10">Kafka / SQS / RabbitMQ</text><rect x="60" y="285" width="680" height="40" rx="6" fill="#94a3b8" fill-opacity="0.2" stroke="#94a3b8"/><text x="80" y="309" fill="#cbd5e1" font-size="11" font-weight="bold">Sharded data store</text><text x="720" y="309" text-anchor="end" fill="#94a3b8" font-size="10">Cassandra, Dynamo, sharded Postgres</text><text x="400" y="356" text-anchor="middle" fill="#94a3b8" font-size="10">Each layer absorbs a different class of load. Understanding which layer breaks first is the engineering skill.</text></svg>',
        content: `
          <p>Scalability is not adding more machines. Scalability is removing the contention points that prevent more machines from helping. Every system has a bottleneck; the question is whether the next 10x of load hits a bottleneck you have already moved or one that is still in the way.</p>

          <h2>Horizontal vs Vertical Scaling</h2>

          <p>Vertical scaling (bigger machines) hits hard limits and risks single points of failure. Horizontal scaling (more machines) is the path to real scale, but only works if your service is stateless or partitions correctly.</p>

          <p><strong>Stateless services</strong> are the foundation. Stateless means: any replica can serve any request. If you can swap one pod for another at any time without state migration, you can scale linearly. Common state-leaking patterns to avoid:</p>
          <ul>
            <li>Local file caches that differ across replicas (move to Redis or shared filesystem).</li>
            <li>Sticky sessions on the load balancer (use a session store like Redis instead).</li>
            <li>In-process queues that hold work (move to Kafka/SQS).</li>
            <li>Per-replica scheduled jobs (use a leader-elected singleton or distributed cron).</li>
          </ul>

          <h2>Caching as a Scaling Lever</h2>

          <p>Caching multiplies effective capacity. The <a href="/blog/caching-strategies-production-guide" class="text-primary underline">Caching Strategies guide</a> covers this in depth. The summary:</p>
          <ul>
            <li><strong>Cache-aside</strong>: app checks cache, falls back to DB, populates cache. The default for read-heavy workloads.</li>
            <li><strong>Write-through</strong>: writes go to cache + DB synchronously. The cache is always fresh; writes are slower.</li>
            <li><strong>Write-back</strong>: writes go to cache; cache flushes to DB asynchronously. Fast writes; data loss window.</li>
            <li><strong>Read-through</strong>: cache itself loads from DB on miss. Simpler app code; coupled cache and DB.</li>
          </ul>

          <p>Multi-layer caching is the production reality: browser → CDN → L7 cache → in-process → Redis. Each layer has different invalidation cost and different blast radius.</p>

          <h2>CDN - Caching at the Edge</h2>

          <p>CDNs (Cloudflare, Fastly, Akamai, CloudFront) cache content at hundreds of edge POPs close to users. The contract between origin and edge is the <code>Cache-Control</code> header. <code>public, max-age=3600, stale-while-revalidate=86400</code> tells the CDN: serve from cache for an hour, serve stale for a day while refreshing in the background.</p>

          <p>Modern CDNs are also where you put: WAF, edge auth, geo routing, A/B test branching, and increasingly compute (Cloudflare Workers, Lambda@Edge). The edge is where the cheapest scaling lives.</p>

          <h2>Autoscaling on Kubernetes</h2>

          <p>Three layers of autoscaling, each independent:</p>
          <ul>
            <li><strong>HPA</strong> (Horizontal Pod Autoscaler): scale pod replicas based on CPU, memory, or custom metrics (RPS, latency, queue depth). Default scale-up is fast, scale-down conservative to avoid flapping.</li>
            <li><strong>VPA</strong> (Vertical Pod Autoscaler): rightsize resource requests over time. Useful for batch and unpredictable workloads; clashes with HPA on the same metrics.</li>
            <li><strong>Cluster Autoscaler / Karpenter</strong>: add nodes when pods cannot schedule due to resource shortage; remove underutilised nodes. Karpenter is the modern AWS-native replacement, faster and more flexible than Cluster Autoscaler.</li>
          </ul>

          <p>The classic mistake: HPA on CPU when the bottleneck is connection pool, database, or downstream RPC. Always scale on the metric closest to user latency - often p99 latency or RPS, not CPU.</p>

          <h2>Distributed Rate Limiting</h2>

          <p>The <a href="/blog/rate-limiting-algorithms-production-guide" class="text-primary underline">Rate Limiting Algorithms guide</a> covers token bucket, sliding window, distributed Redis-Lua patterns, and adaptive rate limiting. Three production rules:</p>
          <ol>
            <li>Layer rate limits: CDN volumetric, gateway per-API-key, application per-user-action.</li>
            <li>Choose fail-open or fail-closed deliberately when the rate-limit service is unavailable.</li>
            <li>Authentication endpoints get stricter limits than read endpoints.</li>
          </ol>

          <h2>Identifying the Bottleneck</h2>

          <p>Every system has a current bottleneck. The skill is identifying it before the user does. Common bottlenecks in order of frequency:</p>
          <ul>
            <li>Database connection pool exhaustion (because pool size &lt; concurrent demand).</li>
            <li>Single-shard hot key in Redis or Cassandra.</li>
            <li>Synchronous external API call with no caching.</li>
            <li>Disk I/O on a single node (Raft fsync, database writes).</li>
            <li>Single-threaded code path in an otherwise concurrent service.</li>
          </ul>

          <p>The diagnostic flow: load test until something gives. Where is CPU? Where is memory? Where is the queue depth growing? Where is latency climbing first? The answer points at the bottleneck.</p>

          <h2>Cache Hierarchy in Practice</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">CACHE HIERARCHY</text><rect x="60" y="60" width="680" height="32" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="80" y="80" fill="#86efac" font-size="11" font-weight="bold">Browser</text><text x="720" y="80" text-anchor="end" fill="#94a3b8" font-size="10">~ns · Cache-Control headers</text><rect x="60" y="100" width="680" height="32" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="80" y="120" fill="#bfdbfe" font-size="11" font-weight="bold">CDN edge</text><text x="720" y="120" text-anchor="end" fill="#94a3b8" font-size="10">~10ms · Cloudflare/Fastly</text><rect x="60" y="140" width="680" height="32" rx="6" fill="#a855f7" fill-opacity="0.2" stroke="#a855f7"/><text x="80" y="160" fill="#ddd6fe" font-size="11" font-weight="bold">Reverse proxy</text><text x="720" y="160" text-anchor="end" fill="#94a3b8" font-size="10">~5ms · Varnish/NGINX</text><rect x="60" y="180" width="680" height="32" rx="6" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899"/><text x="80" y="200" fill="#fbcfe8" font-size="11" font-weight="bold">In-process</text><text x="720" y="200" text-anchor="end" fill="#94a3b8" font-size="10">~µs · Caffeine/lru_cache</text><rect x="60" y="220" width="680" height="32" rx="6" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24"/><text x="80" y="240" fill="#fcd34d" font-size="11" font-weight="bold">Distributed cache</text><text x="720" y="240" text-anchor="end" fill="#94a3b8" font-size="10">~1–3ms · Redis/Memcached</text></svg>

          <h2>Distributed Rate Limiter Architecture</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">DISTRIBUTED RATE LIMITER (Redis Lua atomic)</text><rect x="40" y="80" width="100" height="120" rx="6" fill="#1e293b" stroke="#3b82f6"/><text x="90" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="bold">Gateway 1</text><rect x="40" y="120" width="100" height="20" rx="3" fill="#3b82f6" fill-opacity="0.2"/><text x="90" y="135" text-anchor="middle" fill="#bfdbfe" font-size="9">EVAL Lua</text><rect x="40" y="150" width="100" height="20" rx="3" fill="#3b82f6" fill-opacity="0.2"/><text x="90" y="165" text-anchor="middle" fill="#bfdbfe" font-size="9">EVAL Lua</text><rect x="160" y="80" width="100" height="120" rx="6" fill="#1e293b" stroke="#3b82f6"/><text x="210" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="bold">Gateway 2</text><rect x="160" y="120" width="100" height="20" rx="3" fill="#3b82f6" fill-opacity="0.2"/><text x="210" y="135" text-anchor="middle" fill="#bfdbfe" font-size="9">EVAL Lua</text><rect x="280" y="80" width="100" height="120" rx="6" fill="#1e293b" stroke="#3b82f6"/><text x="330" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="bold">Gateway N</text><rect x="280" y="120" width="100" height="20" rx="3" fill="#3b82f6" fill-opacity="0.2"/><text x="330" y="135" text-anchor="middle" fill="#bfdbfe" font-size="9">EVAL Lua</text><line x1="140" y1="135" x2="440" y2="135" stroke="#94a3b8" stroke-width="1" marker-end="url(#rla)"/><line x1="260" y1="135" x2="440" y2="155" stroke="#94a3b8" stroke-width="1" marker-end="url(#rla)"/><line x1="380" y1="135" x2="440" y2="175" stroke="#94a3b8" stroke-width="1" marker-end="url(#rla)"/><rect x="440" y="100" width="200" height="100" rx="8" fill="#fbbf24" fill-opacity="0.15" stroke="#fbbf24"/><text x="540" y="124" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="bold">Redis Cluster</text><text x="540" y="146" text-anchor="middle" fill="#94a3b8" font-size="9">key &rarr; slot &rarr; node</text><text x="540" y="166" text-anchor="middle" fill="#94a3b8" font-size="9">atomic Lua = no race</text><text x="540" y="186" text-anchor="middle" fill="#94a3b8" font-size="9">~1-2ms p99 / call</text><rect x="660" y="80" width="100" height="120" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="710" y="104" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold">Origin</text><text x="710" y="142" text-anchor="middle" fill="#94a3b8" font-size="9">protected from</text><text x="710" y="158" text-anchor="middle" fill="#94a3b8" font-size="9">client abuse</text><line x1="640" y1="150" x2="660" y2="150" stroke="#22c55e" stroke-width="1.5" marker-end="url(#rla)"/><text x="400" y="240" text-anchor="middle" fill="#cbd5e1" font-size="10">Per-customer / per-API-key counters in Redis. Atomic Lua prevents race conditions across gateways.</text><text x="400" y="260" text-anchor="middle" fill="#94a3b8" font-size="10">Centralised counter trades ~1ms latency for global enforcement.</text><defs><marker id="rla" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>HPA scales on CPU. Your CPU is at 30%. Your service is throttled. What gives?</strong> (Answer: HPA is scaling on the wrong metric. Real bottleneck is probably connection pool, downstream RPC, or DB. Scale on the metric closest to user latency - RPS or p99 latency.)</li>
            <li><strong>Cache hit rate dropped from 95% to 60% overnight. What three things do you check?</strong> (Answer: recent deploy that changed key shape; eviction rate spike from memory pressure; downstream errors causing skipped writes.)</li>
            <li><strong>You add a CDN to a site already using Redis caching. Where do invalidations get hardest?</strong> (Answer: between layers. CDN may serve stale even after Redis is invalidated. Use surrogate keys or short TTLs at the CDN.)</li>
            <li><strong>Karpenter aggressively scales nodes down at night. The next morning, traffic spikes and pods take 3 minutes to schedule. What do you change?</strong> (Answer: warm pool / over-provisioning, or scale-down deferral. Karpenter is fast at scale-up but cold-start latency on a fresh node still bites.)</li>
          </ol>

          <p>For deeper caching patterns including invalidation flows and multi-region cache architecture, read the <a href="/blog/caching-strategies-production-guide" class="text-primary underline">Caching Strategies guide</a>. For rate-limiter implementation specifics see the <a href="/blog/rate-limiting-algorithms-production-guide" class="text-primary underline">Rate Limiting Algorithms guide</a>. The <a href="/cheatsheets/kubernetes" class="text-primary underline">Kubernetes cheatsheet</a> covers HPA/VPA/Karpenter operational patterns.</p>
        `,
        labs: [
          { title: 'Lab 6.1 - HPA on Custom Metrics', objective: 'Configure HPA based on RPS or queue depth via Prometheus Adapter; observe scale-up under load.', repoPath: 'module-6/lab-hpa-custom', steps: ['Deploy app + Prometheus + Prometheus Adapter', 'Define HPA on RPS metric', 'Generate load; watch replicas scale up', 'Cool down; watch scale down'], duration: '90 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 6.2 - Cache-Aside with Stampede Protection', objective: 'Implement cache-aside with per-key locking to prevent thundering herd.', repoPath: 'module-6/lab-cache-stampede', steps: ['Implement naive cache-aside', 'Reproduce stampede on cache expiry', 'Add per-key Redis lock for recompute', 'Verify single recompute under load'], duration: '60 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 6.3 - Distributed Rate Limiter (Redis Lua)', objective: 'Implement an atomic token-bucket rate limiter as a Redis Lua script; load test it.', repoPath: 'module-6/lab-distributed-rate-limit', steps: ['Write Lua script for atomic token bucket update', 'Hit it from many concurrent clients', 'Verify the rate is enforced globally'], duration: '60 minutes', difficulty: 'Advanced' },
        ],
        keyTakeaways: [
          'Stateless services are the foundation of horizontal scale - remove state-leaking patterns first',
          'Multi-layer caching multiplies capacity; pick a strategy per layer deliberately',
          'Scale on the metric closest to user latency, not on CPU when CPU is not the bottleneck',
          'Distributed rate limiting requires consensus or aggregation - pick the trade-off',
          'Every system has a bottleneck; the engineering work is moving it before it bites',
        ],
        commonMistakes: [
          'Setting HPA on CPU when the database connection pool is the actual bottleneck.',
          'Caching everything by default; sometimes the database is fast enough and the cache is just extra failure surface.',
          'Cluster Autoscaler with no Pod Disruption Budgets; nodes scale down and take working pods with them.',
        ],
        glossary: [
          { term: 'Stateless service', definition: 'A service where any replica can serve any request without local state; foundation of horizontal scaling.' },
          { term: 'HPA', definition: 'Kubernetes Horizontal Pod Autoscaler; scales replicas based on metrics.' },
          { term: 'Cluster Autoscaler / Karpenter', definition: 'Kubernetes node autoscalers; add/remove nodes based on pending pods.' },
          { term: 'Thundering herd', definition: 'Failure mode when many concurrent requests miss the cache and overwhelm the origin.' },
          { term: 'Cache stampede', definition: 'Same as thundering herd; many concurrent recomputes of the same expired cache key.' },
        ],
        whyThisMatters: 'Scalability engineering separates the engineers who can ship a system that works at 1k RPS from the ones who can ship a system that works at 1M RPS. Most architectures hit a single bottleneck early; the engineering skill is identifying that bottleneck before it bites and moving it before users feel it. Once you internalise the &ldquo;every system has a bottleneck&rdquo; mindset, you stop being surprised when the database connection pool exhausts under load you thought was easy.',
        productionNotes: [
          'Profile workloads BEFORE setting resource requests. Most workloads request 2-3x what they use; right-sizing is direct cost savings.',
          'Scale on the metric closest to user latency, not CPU. CPU at 30% with throttled latency means CPU is not your bottleneck.',
          'For Karpenter on AWS, set node consolidation to be aggressive but combined with PodDisruptionBudgets so the consolidation does not cause outages.',
        ],
        operationalStory: 'A consumer team kept scaling their service horizontally as traffic grew. At 50 replicas, p99 latency suddenly spiked to 5 seconds and would not come down. Investigation showed the bottleneck was a 100-connection PostgreSQL pool shared across all 50 replicas; each replica fought for connections. The fix was a connection-pooler (PgBouncer) and per-replica pool limits aligned to the global ceiling. Latency returned to 30ms p99. The lesson: scaling pushes the bottleneck downstream; identify the bottleneck before scaling.',
        designTradeoffs: [
          { option: 'HPA on CPU', pros: ['Simple, default', 'Works well for CPU-bound workloads'], cons: ['Wrong signal for I/O-bound workloads', 'Lag between CPU spike and request latency'] },
          { option: 'HPA on RPS / queue depth (custom metrics)', pros: ['Scales on the actual load signal', 'Faster reaction'], cons: ['Requires Prometheus Adapter', 'More tuning'] },
          { option: 'KEDA event-driven scaling', pros: ['Scales on Kafka lag, queue depth, etc.', 'Scale to zero when idle'], cons: ['Extra component to operate', 'Cold-start tax on scale-up'] },
        ],
        realWorldUseCases: [
          'AWS DynamoDB&apos;s burst capacity is a literal token-bucket implementation visible to users.',
          'Cloudflare absorbs trillions of requests per day at the edge with a layered cache that serves most reads before any origin is involved.',
          'Stripe enforces per-API-key rate limits with token-bucket counters in Redis Lua scripts.',
          'Netflix uses adaptive concurrency limits (open-source library) to dynamically size connection pools based on observed latency.',
        ],
        securityRisks: [
          'Cache poisoning via unkeyed headers (Host, Vary mishandling) lets one attacker affect many users.',
          'Multi-tenant cache without tenant_id in the key leaks data between customers; a known SOC2 incident class.',
          'Rate-limit bypass via X-Forwarded-For spoofing when the origin trusts the wrong header.',
          'CDN-cached responses that should never be cached (auth-bearing, per-user) are a recurring breach pattern (web-cache deception).',
        ],
        thinkLikeAnEngineer: [
          'Identify your bottleneck before scaling. Throwing replicas at a connection-pool problem makes it worse, not better.',
          'For every cache, define the freshness contract upfront. &ldquo;5 minutes stale is fine&rdquo; vs &ldquo;must reflect the latest write&rdquo; drives the entire invalidation strategy.',
          'Capacity planning is not a one-time exercise. Workload behaviour drifts; review monthly.',
        ],
        beforeAfter: {
          before: [
            'Vertical scaling until the box maxes out; no headroom for growth',
            'In-memory state on every replica; no horizontal scaling possible',
            'Caches added reactively after the first outage; no invalidation strategy',
            'HPA on CPU when bottleneck is connection pool; scaling helps until it doesn&apos;t',
          ],
          after: [
            'Stateless services with shared distributed cache + database; linear horizontal scale',
            'Multi-layer cache hierarchy (CDN, in-process, distributed); each layer absorbs different load',
            'Cache invalidation via CDC events; cache and database stay coherent',
            'HPA on the metric closest to user latency; scaling responds to actual demand',
          ],
        },
        productionAlternatives: [
          { name: 'Kubernetes HPA + Karpenter', description: 'Cloud-native autoscaling stack; the default on AWS.' },
          { name: 'KEDA event-driven autoscaling', description: 'Scale on Kafka lag, queue depth, custom metrics; can scale to zero.' },
          { name: 'Cluster Autoscaler', description: 'Pre-Karpenter node autoscaler; still useful on GCP/Azure.' },
          { name: 'Redis Cluster + Cluster Mode Enabled', description: 'Standard distributed cache; sharded by hash slot.' },
          { name: 'CDN-first architecture (Cloudflare Workers, Lambda@Edge)', description: 'Move logic to the edge; lowest latency, lowest cost at scale.' },
        ],
      },
      {
        number: 7,
        title: 'Reliability & Failure Engineering',
        slug: 'reliability-failure-engineering',
        subtitle: 'Circuit breakers, bulkheads, graceful degradation, and chaos engineering - how reliability is engineered, not hoped for.',
        duration: '4 hours',
        objectives: [
          'Design retry policies that survive a downstream brownout',
          'Implement circuit breakers and understand the half-open state',
          'Apply bulkhead isolation to prevent noisy neighbours',
          'Build graceful degradation paths that turn outages into reduced functionality',
          'Run chaos experiments without breaking production',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">CIRCUIT BREAKER STATE MACHINE</text><circle cx="160" cy="190" r="60" fill="#22c55e" fill-opacity="0.25" stroke="#22c55e" stroke-width="2"/><text x="160" y="186" text-anchor="middle" fill="#86efac" font-size="13" font-weight="bold">CLOSED</text><text x="160" y="206" text-anchor="middle" fill="#94a3b8" font-size="9">requests pass</text><circle cx="640" cy="190" r="60" fill="#ef4444" fill-opacity="0.25" stroke="#ef4444" stroke-width="2"/><text x="640" y="186" text-anchor="middle" fill="#fca5a5" font-size="13" font-weight="bold">OPEN</text><text x="640" y="206" text-anchor="middle" fill="#94a3b8" font-size="9">requests fail-fast</text><circle cx="400" cy="80" r="55" fill="#fbbf24" fill-opacity="0.25" stroke="#fbbf24" stroke-width="2"/><text x="400" y="78" text-anchor="middle" fill="#fcd34d" font-size="13" font-weight="bold">HALF-OPEN</text><text x="400" y="96" text-anchor="middle" fill="#94a3b8" font-size="9">trial requests</text><line x1="220" y1="190" x2="580" y2="190" stroke="#fca5a5" stroke-width="1.5" marker-end="url(#a7)"/><text x="400" y="180" text-anchor="middle" fill="#fca5a5" font-size="10">N consecutive failures</text><line x1="610" y1="135" x2="450" y2="105" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#a7)"/><text x="540" y="115" text-anchor="middle" fill="#fcd34d" font-size="10">timeout elapsed</text><line x1="350" y1="105" x2="200" y2="160" stroke="#86efac" stroke-width="1.5" marker-end="url(#a7)"/><text x="270" y="120" text-anchor="middle" fill="#86efac" font-size="10">trial succeeds</text><line x1="450" y1="105" x2="600" y2="160" stroke="#fca5a5" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#a7)"/><text x="540" y="148" text-anchor="middle" fill="#fca5a5" font-size="10">trial fails</text><text x="400" y="320" text-anchor="middle" fill="#cbd5e1" font-size="11">CLOSED &rarr; OPEN on N failures. OPEN &rarr; HALF-OPEN after timeout. HALF-OPEN &rarr; CLOSED on success or back to OPEN on failure.</text><defs><marker id="a7" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
        content: `
          <p>Reliability is not the absence of failure. It is the system continuing to do something useful when failure inevitably arrives. Every production engineer eventually learns that the question is not <em>will this fail</em> but <em>how quickly will it recover, and will the failure be contained or amplified by the system around it</em>.</p>

          <h2>The Resilience Toolkit</h2>

          <p>Five patterns, each addressing a different failure class:</p>
          <ul>
            <li><strong>Timeouts</strong>: never wait forever. Every external call has a deadline; the deadline is tighter than your caller&apos;s deadline so you can retry within budget.</li>
            <li><strong>Retries with exponential backoff and jitter</strong>: transient failures should be retried, with delay between attempts and randomness to avoid synchronisation.</li>
            <li><strong>Circuit breakers</strong>: when a dependency is clearly down, stop calling it for a window so it can recover.</li>
            <li><strong>Bulkheads</strong>: isolate workload pools so a noisy or failing tenant cannot starve the others.</li>
            <li><strong>Graceful degradation</strong>: when a non-critical dependency fails, return reduced functionality rather than a full error.</li>
          </ul>

          <h2>Circuit Breakers in Detail</h2>

          <p>A circuit breaker is a state machine with three states - CLOSED, OPEN, HALF-OPEN. In CLOSED state, requests flow normally. After N consecutive failures (or a failure rate above threshold over a window), the breaker trips to OPEN, and subsequent requests fail-fast without hitting the dependency. After a timeout (typically 5&ndash;30s), the breaker transitions to HALF-OPEN and allows a small number of trial requests; if they succeed, the breaker returns to CLOSED. If they fail, it goes back to OPEN.</p>

          <p>The key behaviour: <strong>fail-fast in OPEN state</strong>. The breaker prevents the calling service from queuing up requests against a dead dependency, which would otherwise consume thread pool capacity and cascade the failure to the caller.</p>

          <p>Production implementations: Hystrix (legacy, retired), Resilience4j (Java), Polly (.NET), Envoy circuit breaking, gRPC client interceptors, Istio destination rules with outlier detection. Service meshes do most of this for you.</p>

          <h2>Bulkheads</h2>

          <p>The bulkhead pattern (named for ship compartments) isolates resources so failure in one section cannot sink the ship. Two common forms:</p>
          <ul>
            <li><strong>Thread pool bulkheads</strong>: separate thread pools per dependency or per tenant. A slow upstream cannot exhaust the global thread pool.</li>
            <li><strong>Connection pool bulkheads</strong>: separate connection pools to different downstreams. The pool to a slow database does not starve calls to a fast one.</li>
          </ul>

          <p>In Kubernetes, a stronger form: separate node pools or namespaces per tenant or per workload class. A misbehaving batch job in its own pool cannot impact the latency-sensitive tier.</p>

          <h2>Graceful Degradation</h2>

          <p>Real systems have many dependencies, only some of which are critical. Graceful degradation means: when a non-critical dependency fails, the system returns a useful but reduced response rather than an error.</p>

          <p>Examples:</p>
          <ul>
            <li>Recommendations service is down; product page returns without recommendations.</li>
            <li>Sentiment analysis fails; review still posts, sentiment computed later.</li>
            <li>Personalisation service is slow; anonymous experience served as fallback.</li>
            <li>Cache is unreachable; fall through to database with a circuit breaker so DB is not overwhelmed.</li>
          </ul>

          <p>The architectural insight: <strong>not all dependencies are equal</strong>. Identify the &ldquo;critical path&rdquo; (the dependencies whose failure must fail the request) and the &ldquo;enriching path&rdquo; (everything else). Treat them differently in your code - critical paths use timeouts and proper error propagation; enriching paths swallow errors with logging.</p>

          <h2>Chaos Engineering</h2>

          <p>Chaos engineering, popularised by Netflix, is the practice of intentionally injecting failures into production-like systems to validate that resilience patterns actually work. The principle: if you do not test failure handling, you do not know if it works.</p>

          <p>Chaos experiments graduate in scope:</p>
          <ol>
            <li>Local: kill a process; restart; verify it recovers.</li>
            <li>Staging: kill a pod; verify HPA + traffic shift recover service.</li>
            <li>Production (off-peak): kill a node; verify cluster autoscaler + pod rescheduling work.</li>
            <li>Production (peak): planned game day; multi-team participation; document outcomes.</li>
          </ol>

          <p>Tools: Chaos Mesh (Kubernetes-native), Gremlin (commercial), LitmusChaos, Toxiproxy (network-level), Pumba (container-level). Start small, build a chaos culture incrementally.</p>

          <h2>Cascading Failures</h2>

          <p>The most painful production outages are cascading: a small failure in one service causes load on dependencies, which cause load on their dependencies, which exhaust resources, which cause more failures. The cycle continues until the system stops.</p>

          <p>Defences against cascading failure:</p>
          <ul>
            <li>Per-dependency circuit breakers to break the chain.</li>
            <li>Retry budgets to cap retry amplification (Module 2).</li>
            <li>Rate limits on internal RPCs to enforce backpressure.</li>
            <li>Graceful degradation paths that do not depend on the failing service.</li>
            <li>Load shedding: when a service is overloaded, return 503 to a percentage of requests rather than degrading all of them.</li>
          </ul>

          <h2>Retry Amplification Visualised</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">RETRY AMPLIFICATION (3 retries, no budget)</text><rect x="40" y="80" width="120" height="40" rx="6" fill="#3b82f6" fill-opacity="0.3" stroke="#3b82f6"/><text x="100" y="104" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">Client (1k RPS)</text><line x1="160" y1="100" x2="220" y2="100" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#raa)"/><rect x="220" y="80" width="120" height="40" rx="6" fill="#fbbf24" fill-opacity="0.3" stroke="#fbbf24"/><text x="280" y="104" text-anchor="middle" fill="#fcd34d" font-size="10" font-weight="700">Service A</text><text x="280" y="140" text-anchor="middle" fill="#fcd34d" font-size="9">retries 3x</text><line x1="340" y1="100" x2="400" y2="100" stroke="#fbbf24" stroke-width="2" marker-end="url(#raa)"/><text x="370" y="94" text-anchor="middle" fill="#fcd34d" font-size="9">3k RPS</text><rect x="400" y="80" width="120" height="40" rx="6" fill="#ef4444" fill-opacity="0.3" stroke="#ef4444"/><text x="460" y="104" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="700">Service B</text><text x="460" y="140" text-anchor="middle" fill="#fca5a5" font-size="9">retries 3x</text><line x1="520" y1="100" x2="580" y2="100" stroke="#ef4444" stroke-width="3" marker-end="url(#raa)"/><text x="550" y="94" text-anchor="middle" fill="#fca5a5" font-size="9">9k RPS</text><rect x="580" y="80" width="180" height="40" rx="6" fill="#ef4444" fill-opacity="0.5" stroke="#ef4444"/><text x="670" y="104" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="700">DB melts</text><text x="670" y="140" text-anchor="middle" fill="#fca5a5" font-size="9">9x amplification</text><text x="400" y="200" text-anchor="middle" fill="#cbd5e1" font-size="11">Each layer multiplies retries. 3 layers × 3 retries = 27x amplification.</text><text x="400" y="220" text-anchor="middle" fill="#86efac" font-size="11">Defence: retry budget caps total retries at, say, 10% of RPS regardless of layer count.</text><text x="400" y="240" text-anchor="middle" fill="#94a3b8" font-size="10">Combine with circuit breakers and exponential backoff for full protection.</text><defs><marker id="raa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>Your circuit breaker is set to trip after 5 consecutive failures. Under normal load, you see brief 503 spikes that should not trip. What do you change?</strong> (Answer: switch from consecutive-failure to error-rate-over-window (e.g. 50% errors in last 30s). Consecutive failures are noisy.)</li>
            <li><strong>You have separate thread pools per dependency (bulkheads). One pool exhausts. What is the rest of your service doing?</strong> (Answer: still serving traffic to other dependencies. That is the whole point of the bulkhead - isolate failure.)</li>
            <li><strong>Why is graceful degradation hard to retrofit?</strong> (Answer: it requires identifying critical-path vs enriching dependencies and writing fallback paths. Adding it after the first incident means rewriting code under pressure.)</li>
            <li><strong>You start a chaos experiment in production. Within 5 seconds you have a real outage. What did you skip?</strong> (Answer: practice in staging first; start small (one pod, off-peak); have an explicit abort procedure; involve on-call.)</li>
          </ol>

          <p>For runtime-detection patterns that pair with these resilience controls, see the <a href="/cheatsheets/runtime-security" class="text-primary underline">Runtime Security cheatsheet</a> and the <a href="/glossary/falco" class="text-primary underline">Falco</a> glossary entry. The <a href="/games/incident-response-simulator" class="text-primary underline">Incident Response Simulator</a> exercises chaos and triage scenarios.</p>
        `,
        labs: [
          { title: 'Lab 7.1 - Circuit Breaker in Action', objective: 'Implement a circuit breaker (Resilience4j or hand-rolled), trigger failure modes, validate state transitions.', repoPath: 'module-7/lab-circuit-breaker', steps: ['Wrap a flaky downstream call with a circuit breaker', 'Inject 50% error rate; observe breaker trip to OPEN', 'Wait for timeout; observe HALF-OPEN; success returns to CLOSED', 'Compare with no breaker: caller threads exhaust'], duration: '60 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 7.2 - Chaos Mesh on Kubernetes', objective: 'Run chaos experiments on a kind cluster and observe how the application reacts.', repoPath: 'module-7/lab-chaos-mesh', steps: ['Install Chaos Mesh on a kind cluster', 'Inject pod-kill, network-loss, CPU stress experiments', 'Verify HPA, retry policies, circuit breakers all work', 'Document a chaos game-day runbook'], duration: '120 minutes', difficulty: 'Advanced' },
          { title: 'Lab 7.3 - Graceful Degradation Architecture', objective: 'Refactor a service with multiple dependencies to degrade gracefully under partial failure.', repoPath: 'module-7/lab-graceful-degradation', steps: ['Identify critical vs enriching dependencies', 'Add fallback responses for enriching dependencies', 'Inject failures and verify reduced-but-valid responses', 'Compare to baseline (full error on any dependency failure)'], duration: '60 minutes', difficulty: 'Intermediate' },
        ],
        keyTakeaways: [
          'Reliability is engineered with timeouts, retries, circuit breakers, bulkheads, and graceful degradation - not hoped for',
          'Service meshes (Envoy / Istio) implement most of these patterns for free; use them',
          'Identify critical-path vs enriching dependencies and treat them differently in code',
          'Chaos engineering is the only way to know your resilience patterns actually work',
          'Cascading failures kill systems; break the chain with circuit breakers and retry budgets',
        ],
        glossary: [
          { term: 'Circuit breaker', definition: 'State machine that stops calling a failing dependency to prevent cascading failure.' },
          { term: 'Bulkhead', definition: 'Resource isolation pattern; separate pools per dependency to contain failure.' },
          { term: 'Graceful degradation', definition: 'Returning reduced functionality when a non-critical dependency fails.' },
          { term: 'Chaos engineering', definition: 'Discipline of injecting failures into production-like systems to validate resilience.' },
          { term: 'Retry budget', definition: 'Cap on retry traffic as a fraction of total RPS; prevents retry storms.' },
        ],
        whyThisMatters: 'Reliability is what separates engineers who get woken up at 3am from engineers whose systems quietly do the right thing during partial failure. The patterns in this module - circuit breakers, bulkheads, graceful degradation, chaos - turn outages into reduced functionality. The teams that adopt them ship faster (because they can deploy with confidence) and sleep better (because partial failure is contained, not amplified).',
        productionNotes: [
          'Use error-rate-over-window for circuit-breaker tripping, not consecutive-failure count. Consecutive counts trigger on noise.',
          'Service meshes (Envoy/Istio/Linkerd) implement most resilience patterns at the data plane - do not rebuild them in application code if you have a mesh.',
          'Identify critical-path vs enriching dependencies; treat them differently in code (critical = propagate errors, enriching = swallow with logging).',
          'Run quarterly chaos game days. Untested resilience is hopeful resilience.',
        ],
        commonMistakes: [
          'Setting infinite retries on non-idempotent calls. One downstream blip becomes duplicate side effects everywhere.',
          'Cascading retries without budgets. A 3-hop chain with 3 retries each = 27x amplification on the failing service.',
          'No fallback for &ldquo;enriching&rdquo; calls (recommendations, sentiment, personalisation). Their failure should NOT fail the request.',
          'Chaos in production without practice in staging. The first real chaos experiment must not be your first chaos experiment.',
        ],
        operationalStory: 'A streaming video platform&apos;s user-profile service had a rare 30-second slow-response window. Their product service called it on every page load with no timeout. During the slow window, every request to the product page hung for 30 seconds; users hit refresh, multiplying load 5x; the product service exhausted its thread pool; the entire site went down. Root cause: missing timeout. Fix: add 200ms timeout + fallback to cached profile. The fix was 5 lines of code; the outage was 47 minutes.',
        designTradeoffs: [
          { option: 'Application-level resilience (Resilience4j, Polly)', pros: ['Tight integration with code', 'Per-call control'], cons: ['Per-language implementation', 'Hard to enforce consistently across teams'] },
          { option: 'Service-mesh resilience (Envoy/Istio)', pros: ['Centralised, language-agnostic', 'Operator-controlled, no app changes'], cons: ['Sidecar latency tax', 'Operational complexity'] },
          { option: 'Hybrid (mesh + app-level)', pros: ['Right tool per scenario'], cons: ['Two layers to reason about'] },
        ],
        realWorldUseCases: [
          'Netflix&apos;s Hystrix (now retired) shaped the industry&apos;s circuit-breaker pattern; Resilience4j is the modern Java implementation.',
          'AWS uses bulkhead isolation extensively in their internal services to contain noisy-neighbour problems.',
          'Cloudflare&apos;s graceful-degradation patterns let them serve cached responses during origin outages.',
          'Netflix&apos;s Chaos Monkey (now Chaos Engineering) is the canonical example of running fault-injection in production deliberately.',
        ],
        thinkLikeAnEngineer: [
          'For every external call ask: what is the failure mode if this call hangs? If the answer is &ldquo;our entire service hangs too&rdquo;, you need a timeout AND a fallback.',
          'Rank your dependencies by criticality once a quarter. Move enriching calls to non-blocking; tighten circuit breakers on critical ones.',
          'Run a chaos drill before every major launch. The bug it finds is almost always something nobody predicted.',
        ],
        securityRisks: [
          'Circuit breakers that fail-open during a partial outage may bypass authn / authz checks. Decide failure mode deliberately.',
          'Chaos engineering in production without explicit access-control review can give attackers a roadmap of failure modes.',
          'Graceful degradation paths often skip security checks (e.g. cache fallback returns data without re-checking permissions). Audit fallback paths.',
        ],
        beforeAfter: {
          before: [
            'No timeouts; one slow downstream stalls everything',
            'Naive retries amplify load during brownouts',
            'Single thread pool shared across all dependencies; one slow upstream exhausts it',
            'Failure recovery never tested; first chaos experiment is the real outage',
          ],
          after: [
            'Per-call timeouts shorter than caller&apos;s deadline; deadline propagation across services',
            'Retry budget caps amplification regardless of layer count',
            'Bulkheads (separate pools per dependency); failure contained',
            'Quarterly chaos drills; resilience patterns proven before they&apos;re needed',
          ],
        },
        productionAlternatives: [
          { name: 'Resilience4j (Java)', description: 'Modern circuit breaker / retry / bulkhead library; Hystrix successor.' },
          { name: 'Polly (.NET)', description: 'Equivalent for .NET; mature, well-documented.' },
          { name: 'Service mesh resilience (Envoy/Istio/Linkerd)', description: 'Centralised at the data plane; no app code changes.' },
          { name: 'Chaos Mesh', description: 'Kubernetes-native chaos platform; CRD-driven experiments.' },
          { name: 'Gremlin', description: 'Commercial chaos platform; broader cloud + non-K8s coverage.' },
          { name: 'LitmusChaos', description: 'Open-source chaos for Kubernetes; CNCF incubating.' },
        ],
      },
      {
        number: 8,
        title: 'Distributed Security & Zero Trust',
        slug: 'distributed-security-zero-trust',
        subtitle: 'How modern distributed systems authenticate workload-to-workload - mTLS, SPIFFE/SPIRE, OPA, and the Zero Trust patterns that replace network-perimeter security.',
        duration: '5 hours',
        objectives: [
          'Explain Zero Trust as an architectural principle, not a product',
          'Bootstrap mTLS between services with short-lived, automatically-rotated credentials',
          'Use SPIFFE/SPIRE to issue cryptographic workload identity at scale',
          'Enforce authorization with OPA / Rego at admission and at request time',
          'Federate trust across clusters and clouds without leaking secrets',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIFFE WORKLOAD IDENTITY FLOW</text><circle cx="120" cy="180" r="40" fill="#22c55e" fill-opacity="0.25" stroke="#22c55e" stroke-width="2"/><text x="120" y="184" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Workload</text><text x="120" y="232" text-anchor="middle" fill="#94a3b8" font-size="9">orders-api</text><circle cx="400" cy="180" r="40" fill="#3b82f6" fill-opacity="0.25" stroke="#3b82f6" stroke-width="2"/><text x="400" y="180" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">SPIRE</text><text x="400" y="194" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Agent</text><text x="400" y="232" text-anchor="middle" fill="#94a3b8" font-size="9">node-local</text><circle cx="680" cy="180" r="40" fill="#a855f7" fill-opacity="0.25" stroke="#a855f7" stroke-width="2"/><text x="680" y="180" text-anchor="middle" fill="#ddd6fe" font-size="11" font-weight="bold">SPIRE</text><text x="680" y="194" text-anchor="middle" fill="#ddd6fe" font-size="11" font-weight="bold">Server</text><text x="680" y="232" text-anchor="middle" fill="#94a3b8" font-size="9">control plane</text><line x1="160" y1="180" x2="360" y2="180" stroke="#22c55e" stroke-width="1.5" marker-end="url(#a8)"/><line x1="440" y1="180" x2="640" y2="180" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#a8)"/><line x1="640" y1="195" x2="440" y2="195" stroke="#a855f7" stroke-width="1.5" marker-end="url(#a8)"/><line x1="360" y1="195" x2="160" y2="195" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#a8)"/><text x="260" y="170" text-anchor="middle" fill="#86efac" font-size="9">attest</text><text x="540" y="170" text-anchor="middle" fill="#bfdbfe" font-size="9">forward</text><text x="540" y="208" text-anchor="middle" fill="#ddd6fe" font-size="9">SVID</text><text x="260" y="208" text-anchor="middle" fill="#bfdbfe" font-size="9">SVID</text><text x="400" y="290" text-anchor="middle" fill="#cbd5e1" font-size="11">Workload connects to local agent over Unix socket. Agent attests workload via Kubernetes selectors.</text><text x="400" y="306" text-anchor="middle" fill="#cbd5e1" font-size="11">SPIRE Server issues a short-lived SVID. Agent forwards to workload. Auto-rotated.</text><text x="400" y="338" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">No shared secrets, no long-lived keys, identity travels with the workload.</text><defs><marker id="a8" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
        content: `
          <p>The classical security model assumed a trusted internal network behind a firewall. That assumption broke the moment one application talked to another over the internet, and it broke entirely with cloud-native architectures where workloads spin up and down across clusters, regions, and clouds in seconds. Zero Trust is the response: <strong>do not trust any caller based on network position; verify identity, posture, and policy on every request</strong>.</p>

          <p>This module is the load-bearing security wall of distributed-systems engineering. After this you should be able to design how every internal API call authenticates, authorises, and audits itself, even across cluster and cloud boundaries.</p>

          <h2>Zero Trust in One Sentence</h2>

          <p>&ldquo;Never trust, always verify, assume breach.&rdquo; That is the operational summary. The architectural translation: every caller has a cryptographically verifiable identity; every authorization decision uses that identity plus context; every channel is encrypted; every action is logged; and the system is designed so a compromised component does not give the attacker the keys to the kingdom.</p>

          <h2>mTLS - The Secure Channel</h2>

          <p>Mutual TLS is the foundation: both client and server present certificates and verify each other&apos;s identity. Unlike server-side TLS (where only the server is identified), mTLS gives you bidirectional cryptographic identity on every connection.</p>

          <p>The catch: mTLS is hard at scale because of credential management. Long-lived certificates leak, get committed to git, and never rotate. Short-lived certificates require an identity issuance system. That system is what SPIFFE/SPIRE provides.</p>

          <h2>SPIFFE / SPIRE</h2>

          <p>SPIFFE (Secure Production Identity Framework For Everyone) is a CNCF specification defining a universal format for workload identity:</p>
          <ul>
            <li><strong>SPIFFE ID</strong>: a URI like <code>spiffe://example.com/ns/orders/sa/orders-api</code> that uniquely names a workload.</li>
            <li><strong>SVID (SPIFFE Verifiable Identity Document)</strong>: a cryptographic document (X.509 certificate or JWT) that proves the holder owns the SPIFFE ID. Short-lived (minutes to an hour) and auto-rotated.</li>
            <li><strong>Workload API</strong>: a Unix-socket API workloads use to fetch their current SVID. No application code touches secrets directly.</li>
          </ul>

          <p>SPIRE is the reference implementation: a SPIRE Server issues SVIDs after a SPIRE Agent attests the workload via selectors (Kubernetes namespace, ServiceAccount, container image hash, etc.). The result: every workload has a unique cryptographic identity, automatically issued and rotated, with no shared secrets.</p>

          <p>The free <a href="/courses/mastering-spiffe-spire" class="text-primary underline">Mastering SPIFFE &amp; SPIRE course</a> goes 13 modules deep on this topic. This module gives you the architectural picture; that course gives you the deployment.</p>

          <h2>Authorization with OPA</h2>

          <p>Authentication answers &ldquo;who is calling?&rdquo;; authorization answers &ldquo;is this caller allowed to do this?&rdquo;. OPA (Open Policy Agent) is the CNCF-graduated policy engine that lets you express authz rules as code (in the Rego language), evaluate them at admission time (Kubernetes admission webhook, Kyverno) or at request time (Envoy ext_authz, application middleware).</p>

          <p>Sample Rego rule: &ldquo;a workload from <code>spiffe://example.com/ns/billing/sa/charger</code> may call <code>POST /charges</code> if its tenant_id matches the charge&apos;s tenant_id&rdquo;. The rule lives in version control, runs in CI, ships independently of application code.</p>

          <h2>API Security</h2>

          <p>For external API security - user authentication, token formats, OAuth, JWT - the patterns are different. Module 9 of the <a href="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering</a> course covers these. The <a href="/games/api-attack-defense" class="text-primary underline">API Attack &amp; Defense Simulator</a> is the hands-on exercise.</p>

          <p>For service-to-service inside your infrastructure: <strong>SPIFFE workload identity + mTLS + OPA authz</strong> is the production architecture. For human-to-API: OAuth + JWT + scope-based policy. The two patterns coexist; do not blur them.</p>

          <h2>Federation Across Trust Domains</h2>

          <p>Multi-cluster and multi-cloud distributed systems need workloads in one cluster to authenticate workloads in another. SPIFFE federation is the mechanism: each trust domain (cluster) exposes its trust bundle via a bundle endpoint; federated peers fetch and trust each other&apos;s bundles. SVIDs issued in one cluster are verifiable in another.</p>

          <p>This is how you build cross-cluster service-to-service security without VPNs, shared secrets, or per-cluster identity sprawl. The <a href="/games/zero-trust-network-builder" class="text-primary underline">Zero Trust Network Builder</a> simulator walks through SPIFFE federation scenarios in production form.</p>

          <h2>Operational Practice</h2>

          <ul>
            <li>Issue SVIDs valid for 1 hour or less; rotate automatically; never let credentials accumulate validity beyond what an attacker could exploit.</li>
            <li>Authorization decisions log every allow/deny with the principal&apos;s SPIFFE ID; this is your audit trail.</li>
            <li>Default-deny at the policy layer; explicit allow rules for known patterns; everything else rejected.</li>
            <li>Treat the workload identity provider (SPIRE) as a tier-0 dependency; HA cluster, backups, tested restoration.</li>
          </ul>

          <h2>mTLS Handshake Sequence</h2>
          <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="320" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">mTLS HANDSHAKE - BIDIRECTIONAL CERT VERIFY</text><line x1="200" y1="60" x2="200" y2="290" stroke="#475569" stroke-width="1"/><line x1="600" y1="60" x2="600" y2="290" stroke="#475569" stroke-width="1"/><text x="200" y="76" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Client (workload A)</text><text x="600" y="76" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Server (workload B)</text><line x1="200" y1="105" x2="600" y2="105" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#mta)"/><text x="400" y="99" text-anchor="middle" fill="#94a3b8" font-size="10">ClientHello + cert request</text><line x1="600" y1="140" x2="200" y2="140" stroke="#22c55e" stroke-width="1.5" marker-end="url(#mta)"/><text x="400" y="134" text-anchor="middle" fill="#94a3b8" font-size="10">ServerHello + server SVID + cert request</text><text x="400" y="160" text-anchor="middle" fill="#86efac" font-size="9">client validates server SPIFFE ID</text><line x1="200" y1="190" x2="600" y2="190" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#mta)"/><text x="400" y="184" text-anchor="middle" fill="#94a3b8" font-size="10">client SVID + Finished</text><text x="400" y="210" text-anchor="middle" fill="#86efac" font-size="9">server validates client SPIFFE ID</text><line x1="600" y1="240" x2="200" y2="240" stroke="#22c55e" stroke-width="1.5" marker-end="url(#mta)"/><text x="400" y="234" text-anchor="middle" fill="#94a3b8" font-size="10">Finished + first encrypted request</text><text x="400" y="280" text-anchor="middle" fill="#cbd5e1" font-size="10">Both sides verify each other&apos;s SPIFFE ID against trust bundle. Either side can reject.</text><defs><marker id="mta" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>You issue SVIDs valid for 24 hours. The security team objects. Why?</strong> (Answer: the longer the validity, the larger the blast radius if a credential leaks. Industry default for SPIFFE SVIDs is 1 hour with 30-min rotation. Short-lived = self-healing.)</li>
            <li><strong>Your OPA policy denies a request. The application returns 500. What is wrong?</strong> (Answer: should return 403. 500 is &ldquo;something broke&rdquo;; 403 is &ldquo;policy denied&rdquo;. The distinction matters for triage.)</li>
            <li><strong>How do you authorise &ldquo;only orders-service can call payments-service&rdquo; in OPA?</strong> (Answer: <code>input.peer.spiffe_id == &quot;spiffe://example.com/ns/orders/sa/orders-svc&quot;</code> - or use a path-prefix match for groups of allowed callers.)</li>
            <li><strong>SPIFFE federation between two clusters fails 24 hours after rotation. What happened?</strong> (Answer: stale trust bundle. The federation peer needs to refresh from the bundle endpoint regularly. Static bundle copies always fail this way.)</li>
            <li><strong>Your service mesh (Istio) provides automatic mTLS. Do you still need SPIFFE?</strong> (Answer: Istio uses SPIFFE-style identity internally; explicit SPIFFE/SPIRE is needed for non-mesh workloads, federation across clusters, or richer authz.)</li>
          </ol>

          <p>For implementation depth, take the free <a href="/courses/mastering-spiffe-spire" class="text-primary underline">Mastering SPIFFE &amp; SPIRE course</a>. Reference the glossary on key primitives: <a href="/glossary/spiffe" class="text-primary underline">SPIFFE</a>, <a href="/glossary/spire" class="text-primary underline">SPIRE</a>, <a href="/glossary/svid" class="text-primary underline">SVID</a>, <a href="/glossary/mtls" class="text-primary underline">mTLS</a>, <a href="/glossary/workload-identity" class="text-primary underline">workload identity</a>, <a href="/glossary/zero-trust" class="text-primary underline">Zero Trust</a>, <a href="/glossary/opa" class="text-primary underline">OPA</a>, and <a href="/glossary/service-mesh" class="text-primary underline">service mesh</a>. The <a href="/cheatsheets/spiffe-spire" class="text-primary underline">SPIFFE/SPIRE cheatsheet</a>, <a href="/cheatsheets/opa-rego" class="text-primary underline">OPA / Rego cheatsheet</a>, and <a href="/cheatsheets/api-security" class="text-primary underline">API Security cheatsheet</a> are the operational quick references. Practice with the <a href="/games/zero-trust-network-builder" class="text-primary underline">Zero Trust Network Builder</a>.</p>
        `,
        labs: [
          { title: 'Lab 8.1 - mTLS Between Two Services with SPIFFE', objective: 'Deploy two services on Kubernetes; bootstrap mTLS using SPIRE-issued SVIDs.', repoPath: 'module-8/lab-spiffe-mtls', steps: ['Install SPIRE on kind cluster', 'Register workloads with SPIRE selectors', 'Implement mTLS server using go-spiffe', 'Verify peer identity on every connection'], duration: '120 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 8.2 - OPA Authorization at Envoy', objective: 'Add OPA ext_authz to Envoy; enforce SPIFFE-ID-based access policy.', repoPath: 'module-8/lab-opa-envoy', steps: ['Deploy Envoy + OPA sidecar pattern', 'Write Rego policy: only orders-api can call payments-api', 'Send authorized and unauthorized calls; verify deny path'], duration: '90 minutes', difficulty: 'Advanced' },
          { title: 'Lab 8.3 - SPIFFE Federation Across Two Clusters', objective: 'Stand up two kind clusters; federate trust; have a workload in cluster A authenticate to a workload in cluster B.', repoPath: 'module-8/lab-spiffe-federation', steps: ['Stand up two kind clusters', 'Install SPIRE in each with distinct trust domains', 'Configure bundle endpoint exchange', 'Cross-cluster mTLS verified by SPIFFE ID'], duration: '120 minutes', difficulty: 'Advanced' },
        ],
        keyTakeaways: [
          'Zero Trust is an architectural principle: never trust caller location, always verify identity',
          'mTLS gives bidirectional cryptographic identity; SPIFFE/SPIRE makes it scalable',
          'Workload identity replaces shared secrets and long-lived credentials',
          'OPA / Rego puts authorization policy into version control and CI',
          'Federation extends Zero Trust across clusters and clouds without identity sprawl',
        ],
        whyThisMatters: 'This is the differentiator module of this course. Most distributed-systems training treats security as a separate topic added at the end. In real production engineering, security is woven into every architectural decision - the choice between shared secrets and SPIFFE workload identity is the same scale of architectural choice as the choice between monolith and microservices. Engineers who internalise this model design systems that scale and stay secure together. Engineers who do not end up retrofitting security after the first incident.',
        glossary: [
          { term: 'Zero Trust', definition: 'Security model that drops the assumption of a trusted internal network; verifies every request.' },
          { term: 'mTLS', definition: 'Mutual TLS; both client and server authenticate via certificates.' },
          { term: 'SPIFFE', definition: 'CNCF spec defining a universal workload identity format (SPIFFE ID + SVID).' },
          { term: 'SPIRE', definition: 'CNCF reference implementation of SPIFFE; issues SVIDs after attesting workloads.' },
          { term: 'OPA', definition: 'Open Policy Agent; CNCF policy engine for declarative authorization in Rego.' },
        ],
        productionNotes: [
          'Issue SVIDs valid for 1 hour or less; rotate automatically. Long-lived credentials are accumulated risk.',
          'Default-deny at the policy layer; explicit allow rules; everything else rejected.',
          'Treat SPIRE Server as tier-0: HA, KMS-backed encryption at rest, tested restoration runbook.',
          'Log every authz decision with the principal&apos;s SPIFFE ID. That log is your audit trail.',
        ],
        commonMistakes: [
          'Long-lived (24h+) certificates as a &ldquo;safety margin&rdquo;. The opposite is true - longer = larger blast radius if leaked.',
          'OPA policies returning HTTP 500 on deny instead of 403. Triage gets confused; production stays on fire.',
          'Substring matching on SPIFFE IDs (<code>strings.Contains(id, &quot;orders&quot;)</code>) instead of structured comparison. Trivial to bypass.',
          'Static trust-bundle copies for federation. Become stale at the next CA rotation.',
        ],
        operationalStory: 'A platform team rolled out service-to-service mTLS using a corporate CA, certificates valid for 1 year, mounted as Kubernetes Secrets. A leaked etcd backup six months later contained every cert + private key. Rotation across 200 services took 3 weeks of coordinated change windows. The team migrated to SPIFFE/SPIRE with 1-hour SVIDs; the next leak (a compromised CI runner) had a 1-hour exposure window instead of months.',
        securityRisks: [
          'Long-lived shared secrets are accumulating risk. Every leak compounds.',
          'OPA policies are code - they need code review, CI, version control. Untested Rego is worse than no policy.',
          'SPIFFE federation across mutually-untrusted clusters requires careful trust-bundle handling. Static copies leak credentials slowly.',
          'Workload identity provider becomes the most-attacked component. Treat its operational hardening like the database tier.',
        ],
        designTradeoffs: [
          { option: 'Service-mesh-managed mTLS (Istio, Linkerd)', pros: ['Zero application changes', 'Automatic rotation', 'Policy via mesh CRDs'], cons: ['Sidecar latency', 'Mesh operational complexity'] },
          { option: 'SPIFFE/SPIRE direct integration', pros: ['Works for non-mesh workloads', 'Cross-cluster federation', 'Richer authz options'], cons: ['Application code changes', 'Operate SPIRE'] },
          { option: 'Long-lived secrets + manual rotation', pros: ['No new infra'], cons: ['Accumulating risk', 'Manual rotation always lags', 'Wide blast radius on leak'] },
        ],
        realWorldUseCases: [
          'Bloomberg, Pinterest, Anthem, and Yahoo all run SPIRE in production for service identity at scale.',
          'Netflix uses an internal SPIFFE-style identity system across thousands of services.',
          'Most service meshes (Istio, Linkerd) implement SPIFFE-style identity internally even when not labelled as such.',
          'Open Policy Agent powers Kubernetes admission control for thousands of organisations via Kyverno or Gatekeeper.',
        ],
        thinkLikeAnEngineer: [
          'Treat workload identity as your most-attacked component. Operate it with the rigor you give the database tier.',
          'For every service-to-service call ask: who is calling, with what identity, against what policy, and where is the audit log?',
          'Authorization rules in version-controlled code (Rego) beats authorization rules in service code; CI catches regressions.',
        ],
        careerRelevance: 'Workload identity and Zero Trust are the most leveraged security skills in cloud-native engineering. Engineers fluent in SPIFFE/SPIRE, mTLS, and OPA get pulled into platform-engineering and security-engineering roles. Companies hiring senior platform engineers test these specifically.',
        beforeAfter: {
          before: [
            'Long-lived shared secrets in env vars; rotation is manual and slow',
            'Trust based on network location (&ldquo;it&apos;s inside the VPC, so it&apos;s safe&rdquo;)',
            'Authorization rules scattered in service code; impossible to audit',
            'No federation across clusters; either VPN tunnels or shared global secret manager',
          ],
          after: [
            'Short-lived SVIDs auto-rotated by SPIRE; leak window measured in minutes',
            'Authentication based on cryptographic identity, not network position',
            'Centralised authorization as Rego policy in version control + CI',
            'SPIFFE federation via bundle endpoints; cross-cluster identity flows automatically',
          ],
        },
        productionAlternatives: [
          { name: 'SPIFFE / SPIRE (vendor-neutral)', description: 'CNCF spec + reference implementation; works for non-mesh workloads, federations, K8s-or-not.' },
          { name: 'Istio mesh-managed identity', description: 'SPIFFE-style identity hidden inside Istio; simpler if you already run Istio.' },
          { name: 'Linkerd identity', description: 'Built-in mTLS using Linkerd&apos;s identity service; simplest mesh option.' },
          { name: 'AWS IAM Roles Anywhere / GCP Workload Identity Federation', description: 'Cloud-native identity for workloads outside Kubernetes; less portable.' },
          { name: 'Vault PKI engine', description: 'HashiCorp Vault as a CA for short-lived certs; works without SPIFFE conventions.' },
        ],
      },
      {
        number: 9,
        title: 'Observability & Debugging',
        slug: 'observability-debugging',
        subtitle: 'Distributed tracing, metrics, structured logging, correlation IDs, and the OpenTelemetry / Prometheus / Grafana / Jaeger stack that lets you debug systems you cannot SSH into.',
        duration: '4 hours',
        objectives: [
          'Instrument a service with OpenTelemetry traces, metrics, and logs',
          'Correlate a single request across many services via trace IDs',
          'Build the four golden signals (latency, traffic, errors, saturation) in Prometheus',
          'Read a distributed trace and identify where latency accrues',
          'Build the runbook a 3am on-call engineer actually uses',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">DISTRIBUTED TRACING PIPELINE</text><rect x="40" y="80" width="120" height="50" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="100" y="104" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Service A</text><text x="100" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">OTel SDK</text><line x1="160" y1="105" x2="220" y2="105" stroke="#94a3b8" marker-end="url(#a9)"/><rect x="220" y="80" width="120" height="50" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="280" y="104" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Service B</text><text x="280" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">OTel SDK</text><line x1="340" y1="105" x2="400" y2="105" stroke="#94a3b8" marker-end="url(#a9)"/><rect x="400" y="80" width="120" height="50" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="460" y="104" text-anchor="middle" fill="#bfdbfe" font-size="11" font-weight="bold">Service C</text><text x="460" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">OTel SDK</text><line x1="100" y1="130" x2="100" y2="170" stroke="#94a3b8" stroke-dasharray="3 2" marker-end="url(#a9)"/><line x1="280" y1="130" x2="280" y2="170" stroke="#94a3b8" stroke-dasharray="3 2" marker-end="url(#a9)"/><line x1="460" y1="130" x2="460" y2="170" stroke="#94a3b8" stroke-dasharray="3 2" marker-end="url(#a9)"/><rect x="40" y="170" width="600" height="50" rx="6" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24"/><text x="340" y="194" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="bold">OTel Collector</text><text x="340" y="210" text-anchor="middle" fill="#94a3b8" font-size="9">batches, samples, fans out to backends</text><line x1="200" y1="220" x2="160" y2="270" stroke="#94a3b8" marker-end="url(#a9)"/><line x1="340" y1="220" x2="340" y2="270" stroke="#94a3b8" marker-end="url(#a9)"/><line x1="480" y1="220" x2="520" y2="270" stroke="#94a3b8" marker-end="url(#a9)"/><rect x="100" y="270" width="120" height="50" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="160" y="294" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Jaeger / Tempo</text><text x="160" y="310" text-anchor="middle" fill="#94a3b8" font-size="9">traces</text><rect x="280" y="270" width="120" height="50" rx="6" fill="#a855f7" fill-opacity="0.2" stroke="#a855f7"/><text x="340" y="294" text-anchor="middle" fill="#ddd6fe" font-size="11" font-weight="bold">Prometheus</text><text x="340" y="310" text-anchor="middle" fill="#94a3b8" font-size="9">metrics</text><rect x="460" y="270" width="120" height="50" rx="6" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899"/><text x="520" y="294" text-anchor="middle" fill="#fbcfe8" font-size="11" font-weight="bold">Loki / ES</text><text x="520" y="310" text-anchor="middle" fill="#94a3b8" font-size="9">logs</text><text x="660" y="294" fill="#cbd5e1" font-size="11" font-weight="bold">Grafana</text><text x="660" y="310" fill="#94a3b8" font-size="9">unified UI</text><line x1="220" y1="295" x2="240" y2="295" stroke="#94a3b8" stroke-width="0.8"/><line x1="400" y1="295" x2="420" y2="295" stroke="#94a3b8" stroke-width="0.8"/><defs><marker id="a9" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
        content: `
          <p>Observability is what separates a system you can debug from one you cannot. In a monolith, debugging means reading a stack trace. In a distributed system, debugging means reconstructing a request across many services from telemetry alone. If your observability is poor, your incidents are unrecoverable. If it is good, the system tells you where it broke.</p>

          <h2>The Three Pillars (and the Fourth)</h2>

          <ul>
            <li><strong>Metrics</strong>: numeric time-series. Cheap to store, cheap to query, great for alerting and dashboards. Prometheus is the open-source standard.</li>
            <li><strong>Logs</strong>: discrete events with timestamps and structure. Expensive to store at scale; great for debugging known issues.</li>
            <li><strong>Traces</strong>: per-request causality across services. Heavy to capture and store; essential for debugging latency.</li>
            <li><strong>Profiles</strong> (the modern fourth): CPU and allocation samples per service over time (Pyroscope, Parca). Catches what metrics aggregate away.</li>
          </ul>

          <h2>OpenTelemetry - The Standard</h2>

          <p>OpenTelemetry (OTel) is the CNCF project that unifies instrumentation. One SDK in your application emits all three signals; an OTel Collector batches, samples, and ships them to whichever backends you choose. The vendor lock-in problem of older instrumentation libraries is solved.</p>

          <p>Production pattern: every service uses the OTel SDK; an OTel Collector runs as a DaemonSet on Kubernetes; the Collector forwards traces to Jaeger/Tempo, metrics to Prometheus, logs to Loki or Elasticsearch. Grafana is the unified UI on top.</p>

          <h2>Distributed Tracing</h2>

          <p>A trace is a tree of spans, where each span represents a unit of work (an HTTP call, a database query, a message handler). The root span is the user request; child spans are everything it triggered. Spans carry a trace ID (propagated across service boundaries via the W3C Trace Context header) and a span ID (parent reference).</p>

          <p>Tracing answers questions metrics cannot: <em>why is p99 of request type X high?</em> A trace shows you exactly which downstream service contributed the latency. <em>Why does this rare error happen?</em> The trace shows the full causal chain. <em>Where is this request actually going?</em> The trace reveals architectural surprises (services calling services you forgot existed).</p>

          <h2>Sampling</h2>

          <p>Tracing every request is expensive at scale. Sampling reduces volume:</p>
          <ul>
            <li><strong>Head-based sampling</strong>: decide at the start of the trace whether to keep it (e.g. 1% of all requests). Simple; misses error traces.</li>
            <li><strong>Tail-based sampling</strong>: collect everything, decide after the trace completes (e.g. keep all error traces and a sample of success traces). Better visibility; harder to operate.</li>
            <li><strong>Adaptive / hybrid</strong>: head-sample at modest rate; force-sample known interesting paths (errors, slow requests, specific endpoints).</li>
          </ul>

          <h2>The Four Golden Signals</h2>

          <p>From the Google SRE book, the four metrics every service should emit:</p>
          <ol>
            <li><strong>Latency</strong>: time to serve a request. Track p50, p95, p99; alert on p99.</li>
            <li><strong>Traffic</strong>: requests per second. Sudden change is a signal even if everything else looks fine.</li>
            <li><strong>Errors</strong>: failed requests. Express as a rate (errors per second) or a ratio (error rate over total RPS).</li>
            <li><strong>Saturation</strong>: how full the system is. CPU, memory, queue depth, connection pool utilisation. Saturation precedes other failures.</li>
          </ol>

          <p>Every dashboard, every alert, every SLO connects back to these four. If you only emit four metrics per service, emit these.</p>

          <h2>Structured Logging and Correlation IDs</h2>

          <p>Logs are useful when they are queryable. That means structured (JSON or key=value) and correlated. Every log line should include the trace ID so you can filter by request and the user/tenant ID so you can debug per-user issues.</p>

          <p>In Django REST Framework services, the <a href="/blog/drf-api-logger-django-rest-framework" class="text-primary underline">DRF API Logger production guide</a> shows how to capture masked request context, propagate correlation metadata, and sample API profiling. Use it as a bounded application evidence source, not as a substitute for OpenTelemetry traces, metrics, or centralized log storage.</p>

          <p>The minimum log line for a service: <code>timestamp, level, service, trace_id, span_id, user_id, message, ...fields</code>. Anything less and your logs are unsearchable at scale.</p>

          <h2>SLO and Error Budget</h2>

          <p>Service Level Objectives (SLOs) translate the four golden signals into commitments. &ldquo;p99 latency &lt; 300ms over 30 days&rdquo; or &ldquo;99.9% of requests return 2xx/3xx over 30 days&rdquo;. The error budget is the difference between 100% and the SLO - the amount of failure you have permission to spend on risky changes, deploys, or experiments.</p>

          <p>Operating with explicit SLOs and error budgets is the discipline of the modern SRE function. The pattern: when error budget is healthy, you ship features fast; when it is exhausted, you stop shipping and stabilise.</p>

          <h2>Debugging Distributed Systems</h2>

          <p>The flow that works in practice:</p>
          <ol>
            <li>Alert fires &rArr; identify the affected service from dashboard.</li>
            <li>Check the four golden signals for that service.</li>
            <li>Pick a representative failed trace; walk it span by span; identify where latency or error appears.</li>
            <li>If it is a downstream service, recurse: open that service&apos;s dashboard, repeat.</li>
            <li>If it is in the service itself, jump to logs filtered by that trace ID.</li>
            <li>If logs do not show the cause, jump to profiles.</li>
          </ol>

          <p>That&apos;s the loop. Every minute saved in this loop is a minute off MTTR.</p>

          <h2>Distributed Request Trace Timeline</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">DISTRIBUTED TRACE - SPAN TIMELINE</text><line x1="60" y1="260" x2="740" y2="260" stroke="#475569" stroke-width="1"/><text x="60" y="280" fill="#94a3b8" font-size="9">0ms</text><text x="740" y="280" text-anchor="end" fill="#94a3b8" font-size="9">200ms</text><rect x="60" y="70" width="660" height="20" rx="3" fill="#3b82f6" fill-opacity="0.4" stroke="#3b82f6"/><text x="68" y="84" fill="#bfdbfe" font-size="10" font-weight="700">root: GET /api/checkout (200ms)</text><rect x="80" y="100" width="80" height="20" rx="3" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="88" y="114" fill="#bbf7d0" font-size="9">auth (25ms)</text><rect x="170" y="130" width="200" height="20" rx="3" fill="#fbbf24" fill-opacity="0.4" stroke="#fbbf24"/><text x="178" y="144" fill="#fcd34d" font-size="9">cart-service (60ms)</text><rect x="180" y="160" width="120" height="20" rx="3" fill="#a855f7" fill-opacity="0.4" stroke="#a855f7"/><text x="188" y="174" fill="#ddd6fe" font-size="9">db.query (35ms)</text><rect x="380" y="130" width="280" height="20" rx="3" fill="#ec4899" fill-opacity="0.4" stroke="#ec4899"/><text x="388" y="144" fill="#fbcfe8" font-size="9">payment-svc (85ms) ← slowest</text><rect x="390" y="160" width="220" height="20" rx="3" fill="#f97316" fill-opacity="0.4" stroke="#f97316"/><text x="398" y="174" fill="#fed7aa" font-size="9">stripe-api (70ms)</text><rect x="670" y="100" width="60" height="20" rx="3" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="678" y="114" fill="#bbf7d0" font-size="9">log (12ms)</text><text x="400" y="220" text-anchor="middle" fill="#cbd5e1" font-size="10">payment-svc → stripe-api dominates p99 latency. Optimisation target identified at a glance.</text></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>Why are metrics, logs, and traces complementary rather than redundant?</strong> (Answer: metrics tell you something is wrong; traces tell you which service; logs tell you why. Each answers a different question at a different cost.)</li>
            <li><strong>You have head-based sampling at 1%. Errors get under-represented. What is the fix?</strong> (Answer: tail-based sampling - sample after the trace completes, force-include error traces. Or hybrid head+force-on-error.)</li>
            <li><strong>Your dashboard shows error rate at 0.1% - within SLO. Customer support says many users complain. What is happening?</strong> (Answer: averages hide tail. Your 0.1% may be concentrated on one tenant or one feature. Slice metrics by user/tenant/feature, not just service-level.)</li>
            <li><strong>What are the four golden signals and why does saturation matter?</strong> (Answer: latency, traffic, errors, saturation. Saturation precedes the other three failing - the queue fills before latency climbs before errors fire.)</li>
          </ol>

          <p>For runtime-detection observability the <a href="/cheatsheets/runtime-security" class="text-primary underline">Runtime Security cheatsheet</a> covers Falco/Tetragon eBPF telemetry alongside the application-layer signals.</p>
        `,
        labs: [
          { title: 'Lab 9.1 - Trace a Request End-to-End', objective: 'Instrument a 3-service chain with OTel; trace a request across all three; visualise in Jaeger.', repoPath: 'module-9/lab-end-to-end-tracing', steps: ['Add OTel SDK to each service', 'Propagate W3C Trace Context across HTTP/gRPC calls', 'Send a request; find the trace in Jaeger', 'Identify the slowest span'], duration: '60 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 9.2 - Build the Four Golden Signals', objective: 'Add Prometheus instrumentation for latency, traffic, errors, saturation; build a Grafana dashboard.', repoPath: 'module-9/lab-golden-signals', steps: ['Instrument requests with histogram + counter', 'Track connection pool saturation', 'Build a Grafana dashboard with all four signals', 'Define an SLO and visualise the burn rate'], duration: '90 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 9.3 - Incident Triage from Telemetry', objective: 'Inject a partial failure; use only the dashboards and traces to identify root cause.', repoPath: 'module-9/lab-incident-triage', steps: ['Inject a 30% error rate at one downstream service', 'Use only Grafana + Jaeger to identify which service', 'Identify which user-facing endpoint is most affected', 'Document the runbook'], duration: '60 minutes', difficulty: 'Intermediate' },
        ],
        keyTakeaways: [
          'Observability has three pillars (metrics, logs, traces) plus a fourth (profiles); use them together',
          'OpenTelemetry is the standard; one SDK, many backends',
          'Distributed tracing answers latency questions metrics cannot - instrument every service',
          'The four golden signals (latency, traffic, errors, saturation) are the minimum metric set per service',
          'SLOs and error budgets convert observability into engineering discipline',
        ],
        glossary: [
          { term: 'OpenTelemetry', definition: 'CNCF project unifying metrics, logs, and traces under one vendor-neutral SDK.' },
          { term: 'Trace', definition: 'Tree of spans representing a single request across services.' },
          { term: 'Span', definition: 'Single unit of work in a trace (one HTTP call, one query, one handler).' },
          { term: 'SLO', definition: 'Service Level Objective; a measurable commitment about latency, availability, etc.' },
          { term: 'Error budget', definition: '100% minus SLO; the failure allowance you can spend on risk.' },
        ],
        whyThisMatters: 'Observability is the difference between debuggable and undebuggable systems. A distributed system you cannot trace is a distributed system you cannot operate at scale. Engineers who build observability in from the start have meaningfully shorter MTTR; engineers who bolt it on after the first incident spend years catching up. SLOs and error budgets convert observability into engineering discipline that aligns product velocity with reliability.',
        productionNotes: [
          'Use OpenTelemetry; one SDK, many backends. Vendor-specific SDKs are a future migration cost.',
          'Sample tail-based, not head-based, for error visibility. Or use head-based at modest rate plus force-sample on errors.',
          'Define SLOs that map to user experience, not system health. p99 latency on the checkout flow matters; p99 on the health-check endpoint does not.',
          'Tag every log with trace_id and user_id. Without correlation, logs at scale are unsearchable.',
        ],
        commonMistakes: [
          'Tracing the easy services first. The services without tracing become invisible - usually the legacy ones causing the incidents.',
          'Alert on anything that wiggles. Alert fatigue is a category of incident on its own.',
          'Track averages instead of percentiles. Means hide tail behaviour; p99 is the truth.',
          'Burn through error budget without slowing down. The whole point is to slow shipping when the budget is exhausted.',
        ],
        operationalStory: 'A team operated a 12-service architecture for two years without distributed tracing. Every incident took hours of cross-team Slack to root-cause: &ldquo;Did A call B? Did B call C? Where did the latency happen?&rdquo;. After OpenTelemetry rollout, MTTR dropped from 90 minutes to 12 minutes. The next major incident was triaged in 8 minutes because the engineer could see exactly which downstream service contributed the latency. The investment was 2 weeks of platform work; the payback was permanent.',
        designTradeoffs: [
          { option: 'OpenTelemetry + vendor backends', pros: ['Vendor-neutral', 'Active CNCF project', 'Wide language support'], cons: ['Newer than Jaeger/Zipkin native SDKs', 'Some maturity gaps'] },
          { option: 'Vendor SDK (Datadog, New Relic)', pros: ['Tightest integration with their UI', 'Quickest to ship'], cons: ['Lock-in', 'Per-language coverage varies'] },
          { option: 'Push (agent sends) vs pull (Prometheus scrapes) metrics', pros: ['Push handles short-lived workloads', 'Pull works well for stable services'], cons: ['Push needs aggregation; pull needs service discovery'] },
        ],
        realWorldUseCases: [
          'Netflix runs distributed tracing across thousands of services with sampled tail-based collection.',
          'Google&apos;s Dapper paper (2010) is the foundation of modern distributed tracing.',
          'Cloudflare uses Honeycomb (event-driven observability) for high-cardinality investigation.',
          'Uber built Jaeger (now CNCF) to handle their tracing volume; donated it to the community.',
        ],
        securityRisks: [
          'Logs containing tokens, passwords, or PII become a parallel data-exfiltration target. Apply structured-log scrubbing at the collector.',
          'OpenTelemetry collectors with default settings expose internal trace data via debug endpoints. Lock them down.',
          'Trace context (W3C Trace Context header) propagates across trust boundaries; sanitise before forwarding to third parties.',
        ],
        thinkLikeAnEngineer: [
          'Build observability before the first incident, not after. Retrofit costs are 10x.',
          'For every alert, ask: what action does this trigger? If the answer is &ldquo;none&rdquo;, delete the alert.',
          'SLO error-budget burn-rate alerts beat single-threshold alerts. Burn rate tells you how urgently to respond.',
        ],
        beforeAfter: {
          before: [
            'Print-statement debugging across distributed services; root-cause takes hours',
            'Per-service dashboards in different tools; correlation is manual',
            'Alert fatigue from threshold-based alerts that fire on noise',
            'No SLOs; everyone has different definitions of &ldquo;working&rdquo;',
          ],
          after: [
            'Distributed traces correlate the full request across services',
            'Unified Grafana on top of Prometheus + Tempo + Loki; single pane of glass',
            'SLO + error-budget burn-rate alerts; signal over noise',
            'Documented SLOs aligned to user experience; product decisions tied to error budget',
          ],
        },
        productionAlternatives: [
          { name: 'OpenTelemetry + Grafana stack', description: 'Vendor-neutral; OSS; the modern default.' },
          { name: 'Datadog APM', description: 'Tightly integrated commercial stack; fastest to ship; vendor lock-in.' },
          { name: 'New Relic / Honeycomb', description: 'Honeycomb is the leader in event-driven, high-cardinality observability.' },
          { name: 'AWS X-Ray + CloudWatch', description: 'Native AWS choice; deep integration with AWS services.' },
          { name: 'ELK / EFK stack for logs', description: 'Elasticsearch-based; mature; operationally heavy at scale.' },
        ],
      },
      {
        number: 10,
        title: 'Kubernetes & Cloud Native Distributed Systems',
        slug: 'kubernetes-cloud-native-distributed-systems',
        subtitle: 'How Kubernetes changes distributed-systems design - cluster architecture, service mesh, ingress, autoscaling, and the operational primitives that everything else now sits on top of.',
        duration: '5 hours',
        objectives: [
          'Read a Kubernetes cluster architecture (control plane, kubelet, kube-proxy, etcd, CNI)',
          'Use Services, Ingress, and Gateway API correctly for distributed workloads',
          'Compare service meshes (Istio, Linkerd, Cilium) and pick one with eyes open',
          'Run StatefulSets, PVCs, and storage classes for stateful workloads',
          'Operate workloads with HPA, VPA, Karpenter, and PodDisruptionBudgets in production',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">KUBERNETES CLUSTER ARCHITECTURE</text><rect x="40" y="60" width="720" height="100" rx="8" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6"/><text x="400" y="84" text-anchor="middle" fill="#60a5fa" font-size="12" font-weight="bold">CONTROL PLANE</text><rect x="60" y="100" width="120" height="40" rx="4" fill="#3b82f6" fill-opacity="0.3"/><text x="120" y="124" text-anchor="middle" fill="#bfdbfe" font-size="10">apiserver</text><rect x="200" y="100" width="120" height="40" rx="4" fill="#3b82f6" fill-opacity="0.3"/><text x="260" y="124" text-anchor="middle" fill="#bfdbfe" font-size="10">scheduler</text><rect x="340" y="100" width="120" height="40" rx="4" fill="#3b82f6" fill-opacity="0.3"/><text x="400" y="124" text-anchor="middle" fill="#bfdbfe" font-size="10">ctrl-mgr</text><rect x="480" y="100" width="120" height="40" rx="4" fill="#3b82f6" fill-opacity="0.3"/><text x="540" y="124" text-anchor="middle" fill="#bfdbfe" font-size="10">cloud-ctrl</text><rect x="620" y="100" width="120" height="40" rx="4" fill="#22c55e" fill-opacity="0.3"/><text x="680" y="124" text-anchor="middle" fill="#86efac" font-size="10">etcd (Raft)</text><rect x="40" y="190" width="220" height="170" rx="8" fill="#a855f7" fill-opacity="0.15" stroke="#a855f7"/><text x="150" y="214" text-anchor="middle" fill="#c4b5fd" font-size="11" font-weight="bold">Node 1</text><rect x="60" y="226" width="180" height="22" rx="3" fill="#a855f7" fill-opacity="0.3"/><text x="150" y="241" text-anchor="middle" fill="#ddd6fe" font-size="9">kubelet</text><rect x="60" y="252" width="180" height="22" rx="3" fill="#a855f7" fill-opacity="0.3"/><text x="150" y="267" text-anchor="middle" fill="#ddd6fe" font-size="9">kube-proxy / CNI</text><rect x="60" y="282" width="180" height="22" rx="3" fill="#22c55e" fill-opacity="0.4"/><text x="150" y="297" text-anchor="middle" fill="#bbf7d0" font-size="9">pod: app-A</text><rect x="60" y="308" width="180" height="22" rx="3" fill="#22c55e" fill-opacity="0.4"/><text x="150" y="323" text-anchor="middle" fill="#bbf7d0" font-size="9">pod: app-B</text><rect x="280" y="190" width="220" height="170" rx="8" fill="#a855f7" fill-opacity="0.15" stroke="#a855f7"/><text x="390" y="214" text-anchor="middle" fill="#c4b5fd" font-size="11" font-weight="bold">Node 2</text><rect x="300" y="226" width="180" height="22" rx="3" fill="#a855f7" fill-opacity="0.3"/><text x="390" y="241" text-anchor="middle" fill="#ddd6fe" font-size="9">kubelet</text><rect x="300" y="252" width="180" height="22" rx="3" fill="#a855f7" fill-opacity="0.3"/><text x="390" y="267" text-anchor="middle" fill="#ddd6fe" font-size="9">kube-proxy / CNI</text><rect x="300" y="282" width="180" height="22" rx="3" fill="#22c55e" fill-opacity="0.4"/><text x="390" y="297" text-anchor="middle" fill="#bbf7d0" font-size="9">pod: app-A</text><rect x="300" y="308" width="180" height="22" rx="3" fill="#22c55e" fill-opacity="0.4"/><text x="390" y="323" text-anchor="middle" fill="#bbf7d0" font-size="9">pod: app-C</text><rect x="520" y="190" width="220" height="170" rx="8" fill="#a855f7" fill-opacity="0.15" stroke="#a855f7"/><text x="630" y="214" text-anchor="middle" fill="#c4b5fd" font-size="11" font-weight="bold">Node 3</text><rect x="540" y="226" width="180" height="22" rx="3" fill="#a855f7" fill-opacity="0.3"/><text x="630" y="241" text-anchor="middle" fill="#ddd6fe" font-size="9">kubelet</text><rect x="540" y="252" width="180" height="22" rx="3" fill="#a855f7" fill-opacity="0.3"/><text x="630" y="267" text-anchor="middle" fill="#ddd6fe" font-size="9">kube-proxy / CNI</text><rect x="540" y="282" width="180" height="22" rx="3" fill="#22c55e" fill-opacity="0.4"/><text x="630" y="297" text-anchor="middle" fill="#bbf7d0" font-size="9">pod: app-B</text><rect x="540" y="308" width="180" height="22" rx="3" fill="#22c55e" fill-opacity="0.4"/><text x="630" y="323" text-anchor="middle" fill="#bbf7d0" font-size="9">pod: app-C</text></svg>',
        content: `
          <p>Kubernetes is the substrate that runs most modern distributed systems. It is, itself, a distributed system - with consensus (etcd / Raft), partitioning (resources scheduled across nodes), replication (pods), and observability built in. Understanding how Kubernetes is constructed is now part of distributed-systems literacy.</p>

          <h2>Cluster Architecture</h2>

          <p>The control plane consists of:</p>
          <ul>
            <li><strong>kube-apiserver</strong>: the only component that writes to etcd; every other component talks to apiserver. Stateless; horizontally scalable.</li>
            <li><strong>etcd</strong>: the source of truth for cluster state; Raft-replicated; 3 or 5 nodes.</li>
            <li><strong>kube-scheduler</strong>: assigns pending pods to nodes based on resource fit, affinity, and topology.</li>
            <li><strong>kube-controller-manager</strong>: runs reconciliation loops (Deployment, ReplicaSet, Node, Endpoints, etc.). Each controller leader-elects via etcd.</li>
            <li><strong>cloud-controller-manager</strong>: runs cloud-specific controllers (load balancers, persistent volumes, node lifecycle).</li>
          </ul>

          <p>Each node runs:</p>
          <ul>
            <li><strong>kubelet</strong>: the node agent; pulls container images, runs containers via the container runtime, reports node and pod status to apiserver.</li>
            <li><strong>kube-proxy</strong>: implements Service abstraction via iptables / IPVS rules. (Modern alternative: Cilium with no kube-proxy.)</li>
            <li><strong>CNI plugin</strong>: pod networking (Cilium, Calico, AWS VPC CNI, etc.). Provides pod IPs, NetworkPolicy enforcement, often eBPF observability.</li>
            <li><strong>Container runtime</strong>: containerd or CRI-O; runs the containers.</li>
          </ul>

          <h2>Service, Ingress, Gateway API</h2>

          <ul>
            <li><strong>Service</strong>: stable virtual IP for a set of pods; load-balances internal traffic; ClusterIP for in-cluster, LoadBalancer for cloud LB, NodePort for external on a port.</li>
            <li><strong>Ingress</strong>: L7 routing for HTTP/HTTPS; needs an Ingress Controller (nginx-ingress, AWS ALB, Envoy-based, etc.). Older API; many extensions baked into annotations.</li>
            <li><strong>Gateway API</strong>: the modern replacement for Ingress; richer, role-separated (Gateway/HTTPRoute/etc.), portable across implementations. The right choice for new infra.</li>
          </ul>

          <h2>Service Mesh</h2>

          <p>A service mesh adds a sidecar proxy (Envoy) to every pod to handle service-to-service: mTLS, retries, circuit breaking, observability, traffic shifting, authorization. Three major options:</p>
          <ul>
            <li><strong>Istio</strong>: most feature-rich; substantial complexity. Best when you need the full toolkit.</li>
            <li><strong>Linkerd</strong>: simpler, performance-focused; written in Rust; zero-config mTLS. Best for &ldquo;mesh basics, fast&rdquo;.</li>
            <li><strong>Cilium service mesh</strong>: eBPF-based, no sidecar, integrated with the Cilium CNI. Best when you want one tool for networking + mesh.</li>
          </ul>

          <p>Service meshes implement most of the resilience patterns from Module 7 (timeouts, retries, circuit breakers) for free at the data plane. The cost is operational complexity and the latency tax of every request going through a sidecar.</p>

          <h2>Stateful Workloads</h2>

          <p>StatefulSets give pods stable identities (predictable name, predictable network address) and stable storage (PersistentVolumeClaims that follow the pod). The right pattern for databases, message queues, and any workload where pod identity matters.</p>

          <p>StorageClasses define dynamic provisioning of PersistentVolumes from cloud-provider disks (EBS, PD, Azure Disk) or storage operators (Rook/Ceph, Longhorn). Choose access mode (ReadWriteOnce / ReadWriteMany), reclaim policy (Delete / Retain), and binding mode (Immediate / WaitForFirstConsumer) deliberately.</p>

          <h2>Autoscaling, PDBs, and Operational Sanity</h2>

          <ul>
            <li><strong>HPA</strong>: scale pods on metrics. Always set <code>minReplicas &gt;= 2</code> for HA.</li>
            <li><strong>VPA</strong>: rightsize resource requests; clashes with HPA on the same metric.</li>
            <li><strong>Cluster Autoscaler / Karpenter</strong>: scale nodes. Karpenter is the modern default on AWS.</li>
            <li><strong>PodDisruptionBudget</strong>: cap the number of unavailable pods during voluntary disruption (drain, scale-down, eviction). Without PDBs, the autoscaler will happily evict every replica simultaneously.</li>
          </ul>

          <h2>Operational Practice</h2>

          <p>The Kubernetes operational discipline:</p>
          <ul>
            <li>Always run multi-AZ for production. Use <code>topologySpreadConstraints</code> to enforce it.</li>
            <li>etcd: 5 nodes across 3 AZs, KMS-backed encryption at rest, tested backup/restore.</li>
            <li>RBAC: deny by default; explicit allow per ServiceAccount; treat <code>cluster-admin</code> as root.</li>
            <li>NetworkPolicy: default-deny per namespace; explicit allow rules.</li>
            <li>PodSecurity admission: <em>restricted</em> profile by default, exceptions audited.</li>
          </ul>

          <p>Module 8 of the <a href="/courses/cloud-native-security-engineering/kubernetes-foundations-security" class="text-primary underline">Cloud Native Security Engineering course</a> covers Kubernetes hardening in depth. The <a href="/games/kubernetes-security-simulator" class="text-primary underline">Kubernetes Security Simulator</a> exercises the misconfigurations that cause real outages.</p>

          <h2>Service Mesh Traffic Flow</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">SERVICE MESH TRAFFIC FLOW (sidecar-based)</text><rect x="40" y="80" width="280" height="160" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="180" y="104" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="bold">Pod A</text><rect x="60" y="118" width="120" height="40" rx="4" fill="#3b82f6" fill-opacity="0.3"/><text x="120" y="142" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">app-A</text><rect x="190" y="118" width="120" height="40" rx="4" fill="#fbbf24" fill-opacity="0.3"/><text x="250" y="142" text-anchor="middle" fill="#fcd34d" font-size="10" font-weight="700">Envoy sidecar</text><line x1="180" y1="138" x2="190" y2="138" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#sma)"/><text x="180" y="180" text-anchor="middle" fill="#94a3b8" font-size="9">localhost</text><rect x="480" y="80" width="280" height="160" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="620" y="104" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Pod B</text><rect x="490" y="118" width="120" height="40" rx="4" fill="#fbbf24" fill-opacity="0.3"/><text x="550" y="142" text-anchor="middle" fill="#fcd34d" font-size="10" font-weight="700">Envoy sidecar</text><rect x="620" y="118" width="120" height="40" rx="4" fill="#22c55e" fill-opacity="0.3"/><text x="680" y="142" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">app-B</text><line x1="610" y1="138" x2="620" y2="138" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#sma)"/><line x1="310" y1="138" x2="490" y2="138" stroke="#a855f7" stroke-width="2" marker-end="url(#sma)"/><text x="400" y="124" text-anchor="middle" fill="#ddd6fe" font-size="10" font-weight="700">mTLS + retries + telemetry</text><text x="400" y="180" text-anchor="middle" fill="#ddd6fe" font-size="9">handled in sidecar, not app code</text><text x="400" y="260" text-anchor="middle" fill="#cbd5e1" font-size="10">Application code stays simple. The sidecar handles mTLS, retries, circuit breaking, observability.</text><defs><marker id="sma" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>You have a Deployment with 3 replicas. The cluster autoscaler scales down a node. All 3 pods on that node get evicted. Why?</strong> (Answer: no PodDisruptionBudget. Define <code>maxUnavailable: 1</code> so only one replica goes down at a time.)</li>
            <li><strong>Postgres in a Deployment vs StatefulSet - what changes?</strong> (Answer: StatefulSet gives stable pod identity (postgres-0, postgres-1) and stable PVCs that follow each pod. Required for any stateful workload.)</li>
            <li><strong>Service mesh adds 1ms latency per hop. Across 5 hops you pay 5ms. When is it worth it?</strong> (Answer: when the mesh-provided features (mTLS, retries, observability, traffic shifting) are worth more than 5ms. For mature production systems, almost always.)</li>
            <li><strong>You enable Istio mesh-wide STRICT mTLS on day one of rollout. What happens?</strong> (Answer: external load balancer health probes fail; non-meshed services can no longer talk to meshed services; outage. Phase: PERMISSIVE first, observe, promote namespace by namespace.)</li>
          </ol>

          <p>For Kubernetes hardening, the <a href="/cheatsheets/kubernetes-security" class="text-primary underline">Kubernetes Security cheatsheet</a> is the operational reference. For service-mesh patterns the <a href="/cheatsheets/service-mesh" class="text-primary underline">Service Mesh cheatsheet</a> covers Istio/Linkerd/Cilium patterns - see the <a href="/glossary/service-mesh" class="text-primary underline">service mesh</a> glossary entry for the conceptual definition. The <a href="/cheatsheets/kubernetes" class="text-primary underline">Kubernetes cheatsheet</a> is the day-to-day reference for kubectl operational patterns. Practice with the <a href="/games/kubernetes-security-simulator" class="text-primary underline">Kubernetes Security Simulator</a>.</p>
        `,
        labs: [
          { title: 'Lab 10.1 - Kind Cluster from Scratch', objective: 'Stand up a multi-node kind cluster, deploy a 3-tier app, expose via Ingress.', repoPath: 'module-10/lab-kind-cluster', steps: ['Create kind cluster with 3 worker nodes', 'Install nginx-ingress', 'Deploy frontend / API / DB', 'Verify external access via Ingress'], duration: '90 minutes', difficulty: 'Beginner' },
          { title: 'Lab 10.2 - Linkerd Service Mesh', objective: 'Install Linkerd; observe automatic mTLS; verify mesh observability.', repoPath: 'module-10/lab-linkerd', steps: ['Install Linkerd CLI and control plane', 'Inject sidecars into namespace', 'Verify mTLS via Linkerd Viz', 'Inject failure with Toxiproxy; observe retry behaviour'], duration: '90 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 10.3 - StatefulSet for a Database', objective: 'Deploy Postgres as a StatefulSet with persistent storage; verify pod identity stability.', repoPath: 'module-10/lab-statefulset-postgres', steps: ['Define StatefulSet with PVC template', 'Deploy 3 replicas', 'Kill a pod; verify PVC reattaches to the same logical pod', 'Demonstrate stable network identity'], duration: '60 minutes', difficulty: 'Intermediate' },
        ],
        keyTakeaways: [
          'Kubernetes is itself a distributed system; understanding its components is now part of distributed-systems literacy',
          'Service / Ingress / Gateway API: pick Gateway API for new infra',
          'Service mesh is optional but powerful; pick Istio for full features, Linkerd for simplicity, Cilium for unified networking',
          'StatefulSets + PVCs handle stateful workloads correctly; do not run databases as Deployments',
          'PDBs, multi-AZ topology spread, and tested etcd backups are the operational must-haves',
        ],
        glossary: [
          { term: 'Kubernetes Service', definition: 'Stable virtual IP and DNS name for a set of pods; load-balances internal traffic.' },
          { term: 'Service mesh', definition: 'Sidecar-based infrastructure for mTLS, retries, observability between services.' },
          { term: 'StatefulSet', definition: 'Workload controller for pods that need stable identity and storage.' },
          { term: 'PodDisruptionBudget', definition: 'Cap on simultaneous voluntary disruptions to a workload; prevents accidental full-replica eviction.' },
          { term: 'Karpenter', definition: 'Modern Kubernetes node autoscaler on AWS; replaces Cluster Autoscaler with faster, more flexible provisioning.' },
        ],
        whyThisMatters: 'Kubernetes is now the default substrate for modern infrastructure; understanding its components is part of distributed-systems literacy. Engineers who can read a cluster architecture, reason about Service / Ingress / Gateway API, pick the right service mesh, and operate StatefulSets correctly are the engineers who get trusted with platform-engineering roles. The ones who treat Kubernetes as &ldquo;just docker but bigger&rdquo; eventually pay for it during the first multi-AZ incident.',
        productionNotes: [
          'Always run multi-AZ. Use topologySpreadConstraints to enforce it; do not rely on luck.',
          'PodDisruptionBudgets are mandatory for production workloads. Without them, autoscalers will happily evict every replica.',
          'etcd: 5 nodes across 3 AZs, KMS-backed encryption at rest, tested backup/restore.',
          'Resource requests at p95 of actual usage; do not let dev defaults of &ldquo;500m CPU&rdquo; ship to prod.',
        ],
        commonMistakes: [
          'Running stateful workloads as Deployments. Use StatefulSet so PVCs follow the pod identity.',
          'PodSecurity admission set to &ldquo;privileged&rdquo; in production namespaces. Use restricted with audited exceptions.',
          'Ingress per service in a flat namespace. Use Gateway API with role-separated Gateway/Route for new infra.',
          'Setting CPU limits = requests. CPU CFS throttling kicks in even when other cores are free; latency suffers.',
        ],
        operationalStory: 'A team migrated to Kubernetes and immediately deployed their stateful Postgres as a Deployment with a single replica, no PVC, &ldquo;just to get something running&rdquo;. Three weeks later a node was reaped during cluster upgrade; the pod was rescheduled; Postgres started fresh on a new node with empty disk. They lost a week of customer data. The runbook never changed: stateful workloads use StatefulSet from day one, with PVCs, with backups verified weekly.',
        designTradeoffs: [
          { option: 'Service mesh: Istio', pros: ['Most feature-rich', 'Strong community', 'Rich traffic management'], cons: ['Heavy operationally', 'Steeper learning curve'] },
          { option: 'Service mesh: Linkerd', pros: ['Simpler', 'Faster (Rust)', 'Zero-config mTLS'], cons: ['Fewer advanced features'] },
          { option: 'Service mesh: Cilium (eBPF)', pros: ['Sidecar-free', 'Integrated with CNI', 'Lower latency tax'], cons: ['Newer; ecosystem still maturing'] },
          { option: 'No mesh; just K8s primitives', pros: ['Less operational complexity', 'Lower latency'], cons: ['No automatic mTLS', 'Resilience patterns in app code'] },
        ],
        realWorldUseCases: [
          'Spotify runs over 1500 microservices on Kubernetes with a custom service mesh (Backstage / Apollo).',
          'Pinterest migrated their entire fleet to Kubernetes over 3 years; the migration was as much a culture shift as a technology one.',
          'Reddit runs everything on Kubernetes after a multi-year migration from EC2.',
          'Google&apos;s GKE Autopilot is essentially Kubernetes with the operational complexity hidden - for teams that want the API but not the infrastructure overhead.',
        ],
        securityRisks: [
          'Default-permissive RBAC and PodSecurity; restricted profile must be explicit per-namespace.',
          'Service mesh sidecars run as elevated workloads; an unverified mesh component is a cluster-wide attack vector.',
          'Public LoadBalancer Services bypass NetworkPolicy; verify origin restrictions are enforced at the LB.',
          'Container image pulls without signature verification accept anything from the registry. Use cosign + admission policy.',
        ],
        thinkLikeAnEngineer: [
          'Read every Kubernetes manifest as a contract with the scheduler. Resource requests, anti-affinity, and PDBs are the operational levers.',
          'Treat Kubernetes upgrades like deployment changes - staged across canary clusters before prod.',
          'For every workload class (web, batch, ML), define which features (HPA, PDB, topology spread) it must use as a baseline.',
        ],
        beforeAfter: {
          before: [
            'Pets-not-cattle; long-lived nodes that can&apos;t be replaced',
            'Shell scripts deploying directly to VMs; no declarative state',
            'No autoscaling; capacity provisioned for peak, idle most of the time',
            'Stateful workloads as single VMs; failure = data loss',
          ],
          after: [
            'Cattle-not-pets; nodes are interchangeable and routinely cycled',
            'GitOps with Argo CD or Flux; declarative state, audited changes',
            'HPA + Karpenter; capacity scales with demand within minutes',
            'StatefulSets + PVCs + tested backups; node failure = pod reschedule, not data loss',
          ],
        },
        productionAlternatives: [
          { name: 'Self-managed Kubernetes (kubeadm, RKE2, k0s)', description: 'Full control; full operational responsibility.' },
          { name: 'EKS / GKE / AKS', description: 'Managed control plane; you operate the workloads.' },
          { name: 'GKE Autopilot / EKS Auto Mode', description: 'Managed control plane AND nodes; closest to &ldquo;just deploy a Pod&rdquo;.' },
          { name: 'HashiCorp Nomad', description: 'Lighter alternative; works for non-container workloads.' },
          { name: 'Cloud-specific PaaS (Cloud Run, App Runner, Container Apps)', description: 'Skip Kubernetes entirely for stateless web workloads.' },
        ],
      },
      {
        number: 11,
        title: 'Real-World Failure Scenarios',
        slug: 'real-world-failure-scenarios',
        subtitle: 'Retry storms, cache stampedes, split brain, hot partitions, queue overload, DNS outages, service-discovery failures, cascading failures - the incidents that actually happen, and how to engineer them away.',
        duration: '5 hours',
        objectives: [
          'Recognise the canonical distributed-systems failure modes by their telemetry signatures',
          'Reproduce each failure in a controlled lab so the pattern is in your hands',
          'Apply the architectural defences that make each failure hard or impossible',
          'Write incident runbooks that an on-call engineer can actually use at 3am',
          'Run a post-incident review that produces lasting improvements',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">CASCADING FAILURE PROPAGATION</text><circle cx="120" cy="190" r="32" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="2"/><text x="120" y="194" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="bold">DB slow</text><line x1="152" y1="190" x2="218" y2="190" stroke="#ef4444" stroke-width="2" marker-end="url(#a11)"/><circle cx="260" cy="190" r="32" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="2"/><text x="260" y="186" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="bold">Service B</text><text x="260" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">timeout</text><line x1="292" y1="190" x2="358" y2="190" stroke="#ef4444" stroke-width="2" marker-end="url(#a11)"/><circle cx="400" cy="190" r="32" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="2"/><text x="400" y="186" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="bold">Service A</text><text x="400" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">retries</text><line x1="432" y1="190" x2="498" y2="190" stroke="#ef4444" stroke-width="2.5" marker-end="url(#a11)"/><circle cx="540" cy="190" r="32" fill="#ef4444" fill-opacity="0.5" stroke="#ef4444" stroke-width="2"/><text x="540" y="186" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="bold">Gateway</text><text x="540" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">queue full</text><line x1="572" y1="190" x2="638" y2="190" stroke="#ef4444" stroke-width="3" marker-end="url(#a11)"/><circle cx="680" cy="190" r="32" fill="#ef4444" fill-opacity="0.6" stroke="#ef4444" stroke-width="2"/><text x="680" y="186" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="bold">Users</text><text x="680" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">retry</text><line x1="680" y1="222" x2="540" y2="222" stroke="#ef4444" stroke-width="3" stroke-dasharray="4 3" marker-end="url(#a11)"/><line x1="540" y1="222" x2="400" y2="222" stroke="#ef4444" stroke-width="3" stroke-dasharray="4 3"/><text x="400" y="244" fill="#fca5a5" font-size="10" font-weight="bold">amplification - retries pile on the failing service</text><text x="400" y="290" text-anchor="middle" fill="#cbd5e1" font-size="11">Each retry adds to the failing service&apos;s load. Without circuit breakers + retry budgets, the system cannot recover.</text><text x="400" y="320" text-anchor="middle" fill="#86efac" font-size="11">Defences: circuit breakers, retry budgets, load shedding, graceful degradation.</text><defs><marker id="a11" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#fca5a5"/></marker></defs></svg>',
        content: `
          <p>Every distributed system fails the same way the others do. The taxonomy is small and the failure modes are well-documented, which means the patterns that defend against them are equally well-understood. The engineers who experience these incidents and build the defences are the ones the rest of the org calls when something is on fire.</p>

          <p>This module walks the canonical incidents one at a time: what they look like, what causes them, how to defend.</p>

          <h2>Retry Storms</h2>

          <p><strong>Symptom</strong>: a downstream service has a brownout. Errors trigger client retries. Retries multiply load on the failing service. The service cannot recover. p99 latency stays high; error rate stays high; you cannot get out of it without a deploy or restart.</p>

          <p><strong>Defence</strong>: every retry policy has a budget (cap retries at, say, 10% of total RPS). Exponential backoff with jitter. Circuit breakers stop calling the dead service so it can recover.</p>

          <h2>Cache Stampedes</h2>

          <p><strong>Symptom</strong>: a hot cache key expires under load. Hundreds of concurrent requests miss the cache and hit the origin. Origin overloads. Stays overloaded until the cache is repopulated.</p>

          <p><strong>Defence</strong>: per-key locking on cache misses (only one recompute at a time). Probabilistic early expiration. Stale-while-revalidate semantics. The <a href="/blog/caching-strategies-production-guide" class="text-primary underline">Caching Strategies guide</a> covers all three patterns.</p>

          <h2>Split Brain</h2>

          <p><strong>Symptom</strong>: a network partition isolates two halves of a CP cluster. Both elect leaders independently. Both accept writes. When the partition heals, you have divergent state.</p>

          <p><strong>Defence</strong>: real consensus algorithms (Raft, Paxos) require a majority quorum, so only one side can elect a leader; the other side cannot make progress. The lesson: do not invent your own &ldquo;HA&rdquo; without consensus underneath.</p>

          <h2>Hot Partitions</h2>

          <p><strong>Symptom</strong>: one shard / partition / Redis slot receives 10x the traffic of the others. That node saturates while others sit idle. p99 latency on the hot key climbs; the rest of the system looks fine.</p>

          <p><strong>Defence</strong>: detect via per-partition QPS metrics. Mitigate by salting keys, splitting the hot key into N keys, or fronting with a per-pod local cache so the hot key never reaches the distributed cache.</p>

          <h2>Queue Overload</h2>

          <p><strong>Symptom</strong>: producers outpace consumers. Queue depth grows. Eventually the queue runs out of memory or disk; messages start failing or get dropped.</p>

          <p><strong>Defence</strong>: backpressure. Bounded queues. Producer throttling on consumer-lag signals. Auto-scale consumers on lag.</p>

          <h2>DNS Outages</h2>

          <p><strong>Symptom</strong>: DNS resolver is slow or unreachable. Every service-to-service call stalls on lookup. The cluster appears to be hanging without errors.</p>

          <p><strong>Defence</strong>: NodeLocal DNSCache to keep DNS off the critical path. Short TTLs combined with negative-caching tuning. Service-mesh-based discovery (sidecar handles endpoint changes via xDS, no DNS in the data path).</p>

          <h2>Service Discovery Failures</h2>

          <p><strong>Symptom</strong>: discovery system (Consul, etcd, kube-apiserver) is unhealthy. Services cannot find each other. Existing connections work; new connections fail.</p>

          <p><strong>Defence</strong>: clients cache the last-known-good endpoint set with a generous TTL. The system tolerates a degraded discovery system if existing connections can survive the window.</p>

          <h2>Cascading Failures</h2>

          <p>The mother of all distributed-systems incidents. A small failure becomes a cluster-wide outage because every layer amplifies the load. The diagram above shows the basic shape: DB slows, Service B times out, Service A retries, the gateway queues up requests, users retry, the gateway saturates, more services fail.</p>

          <p><strong>Defences</strong>: circuit breakers per dependency. Retry budgets capping amplification. Load shedding (return 503 to a percentage of requests when saturated). Graceful degradation paths so a non-critical failure doesn&apos;t block critical paths. The <a href="/games/incident-response-simulator" class="text-primary underline">Incident Response Simulator</a> walks through real scenarios.</p>

          <h2>The Post-Incident Review</h2>

          <p>The blameless post-mortem is the discipline that turns incidents into learning. The structure that works:</p>
          <ol>
            <li><strong>Timeline</strong>: minute-by-minute account of what happened. No interpretation; just facts.</li>
            <li><strong>Impact</strong>: who was affected, for how long, in what way.</li>
            <li><strong>Root cause</strong>: what enabled the incident. Often multiple contributing factors.</li>
            <li><strong>Detection</strong>: how was the incident discovered? Could it have been earlier?</li>
            <li><strong>Mitigation</strong>: what stopped the incident? Was it the right action?</li>
            <li><strong>Action items</strong>: each one assigned, deadlined, tracked. Without these the document is theatre.</li>
          </ol>

          <h2>Cache Stampede Visualised</h2>
          <svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="240" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">CACHE STAMPEDE - UNPROTECTED vs PROTECTED</text><circle cx="80" cy="100" r="6" fill="#fca5a5"/><circle cx="80" cy="120" r="6" fill="#fca5a5"/><circle cx="80" cy="140" r="6" fill="#fca5a5"/><circle cx="80" cy="160" r="6" fill="#fca5a5"/><circle cx="80" cy="180" r="6" fill="#fca5a5"/><text x="80" y="210" text-anchor="middle" fill="#fca5a5" font-size="9">N requests</text><line x1="92" y1="120" x2="160" y2="140" stroke="#fca5a5" stroke-width="1" marker-end="url(#csa)"/><line x1="92" y1="140" x2="160" y2="140" stroke="#fca5a5" stroke-width="1" marker-end="url(#csa)"/><line x1="92" y1="160" x2="160" y2="140" stroke="#fca5a5" stroke-width="1" marker-end="url(#csa)"/><rect x="160" y="120" width="60" height="40" rx="3" fill="#1e293b" stroke="#fbbf24"/><text x="190" y="145" text-anchor="middle" fill="#fcd34d" font-size="9">expired</text><line x1="220" y1="140" x2="280" y2="140" stroke="#fca5a5" stroke-width="2" marker-end="url(#csa)"/><text x="250" y="130" text-anchor="middle" fill="#fca5a5" font-size="9">N qps</text><rect x="280" y="120" width="80" height="40" rx="3" fill="#1e293b" stroke="#fca5a5"/><text x="320" y="145" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="700">DB melts</text><circle cx="480" cy="120" r="6" fill="#86efac"/><circle cx="480" cy="140" r="6" fill="#86efac"/><circle cx="480" cy="160" r="6" fill="#86efac"/><line x1="492" y1="140" x2="560" y2="140" stroke="#86efac" stroke-width="1.5" marker-end="url(#csa)"/><text x="525" y="130" text-anchor="middle" fill="#94a3b8" font-size="8">SETNX lock</text><rect x="560" y="120" width="80" height="40" rx="3" fill="#1e293b" stroke="#86efac"/><text x="600" y="140" text-anchor="middle" fill="#86efac" font-size="9">cache</text><text x="600" y="155" text-anchor="middle" fill="#86efac" font-size="9">+ lock</text><line x1="640" y1="140" x2="700" y2="140" stroke="#86efac" stroke-width="1.5" marker-end="url(#csa)"/><text x="670" y="130" text-anchor="middle" fill="#94a3b8" font-size="8">1 query</text><rect x="700" y="120" width="60" height="40" rx="3" fill="#1e293b" stroke="#86efac"/><text x="730" y="145" text-anchor="middle" fill="#86efac" font-size="10" font-weight="700">DB OK</text><text x="200" y="200" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="700">UNPROTECTED</text><text x="600" y="200" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">PROTECTED (lock + recompute)</text><defs><marker id="csa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Split Brain Architecture</h2>
          <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="320" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">SPLIT BRAIN - WHAT REAL CONSENSUS PREVENTS</text><text x="200" y="68" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="700">NAIVE HA - both elect leader</text><circle cx="120" cy="130" r="22" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444"/><text x="120" y="134" text-anchor="middle" fill="#fca5a5" font-size="9" font-weight="700">L1</text><circle cx="180" cy="130" r="22" fill="#1e293b" stroke="#fca5a5"/><text x="180" y="134" text-anchor="middle" fill="#fca5a5" font-size="9">F</text><circle cx="240" cy="130" r="22" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444"/><text x="240" y="134" text-anchor="middle" fill="#fca5a5" font-size="9" font-weight="700">L2</text><line x1="170" y1="130" x2="190" y2="130" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3"/><text x="180" y="100" text-anchor="middle" fill="#fca5a5" font-size="9">⚡ partition</text><text x="120" y="172" text-anchor="middle" fill="#fca5a5" font-size="9">accepts writes</text><text x="240" y="172" text-anchor="middle" fill="#fca5a5" font-size="9">accepts writes</text><text x="180" y="200" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="700">divergent state</text><text x="600" y="68" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">RAFT QUORUM - only majority wins</text><circle cx="500" cy="130" r="22" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="500" y="134" text-anchor="middle" fill="#86efac" font-size="9" font-weight="700">L</text><circle cx="560" cy="130" r="22" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="560" y="134" text-anchor="middle" fill="#86efac" font-size="9">F</text><line x1="580" y1="130" x2="630" y2="130" stroke="#fca5a5" stroke-width="2" stroke-dasharray="3 3"/><text x="605" y="100" text-anchor="middle" fill="#fca5a5" font-size="9">⚡ partition</text><circle cx="650" cy="130" r="22" fill="#94a3b8" fill-opacity="0.2" stroke="#94a3b8"/><text x="650" y="134" text-anchor="middle" fill="#cbd5e1" font-size="9">F</text><circle cx="710" cy="130" r="22" fill="#94a3b8" fill-opacity="0.2" stroke="#94a3b8"/><text x="710" y="134" text-anchor="middle" fill="#cbd5e1" font-size="9">F</text><text x="530" y="172" text-anchor="middle" fill="#86efac" font-size="9">2 of 5 = no quorum</text><text x="680" y="172" text-anchor="middle" fill="#cbd5e1" font-size="9">3 of 5 = quorum ✓</text><text x="530" y="190" text-anchor="middle" fill="#86efac" font-size="9">refuses writes</text><text x="680" y="190" text-anchor="middle" fill="#86efac" font-size="9">elects new leader</text><text x="600" y="216" text-anchor="middle" fill="#86efac" font-size="10" font-weight="700">single source of truth</text><text x="400" y="280" text-anchor="middle" fill="#cbd5e1" font-size="11">Real consensus (Raft, Paxos) prevents split brain by requiring majority quorum.</text><text x="400" y="300" text-anchor="middle" fill="#94a3b8" font-size="10">DIY HA without quorum math = silent corruption under partition.</text></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>A retry storm is happening. You add exponential backoff. Symptoms partially improve. What did you miss?</strong> (Answer: backoff alone helps but does not cap total RPS to the failing service. Need a retry budget too.)</li>
            <li><strong>Your cache stampedes every 5 minutes for 2 seconds. The TTL is 5 minutes. What is the simplest fix?</strong> (Answer: probabilistic early expiration - a small chance to recompute before TTL - distributes load over time without coordination.)</li>
            <li><strong>You operate two regions in active-active. Both elect leaders during a partition. Why is this catastrophic for payments?</strong> (Answer: split brain. Both sides accept conflicting writes. Without consensus, reconciliation requires manual resolution. Active-active works for read-heavy data, not writes-with-consequence.)</li>
            <li><strong>Post-mortem action items consistently slip. What changes the dynamic?</strong> (Answer: assigned owner, deadline, tracked alongside feature work, reviewed in next post-mortem. Without follow-up the document is theatre.)</li>
          </ol>

          <p>The <a href="/cheatsheets/runtime-security" class="text-primary underline">Runtime Security cheatsheet</a> covers detection patterns for the failure scenarios above. Practice with the <a href="/games/incident-response-simulator" class="text-primary underline">Incident Response Simulator</a>.</p>
        `,
        labs: [
          { title: 'Lab 11.1 - Reproduce a Retry Storm', objective: 'Configure naive retries; cause an outage; add backoff + budget; observe recovery.', repoPath: 'module-11/lab-retry-storm', steps: ['Set up 3-service chain with naive retries', 'Inject 50% errors on bottom service; observe storm', 'Add exponential backoff + budget; observe recovery'], duration: '90 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 11.2 - Cache Stampede on Expiry', objective: 'Cause a stampede when a hot key expires; add per-key locking; verify fix.', repoPath: 'module-11/lab-cache-stampede', steps: ['Identify a hot key with TTL 30s', 'Send 1000 concurrent requests at expiry; observe origin meltdown', 'Add per-key Redis lock for recompute', 'Repeat; verify single recompute'], duration: '60 minutes', difficulty: 'Intermediate' },
          { title: 'Lab 11.3 - Post-Incident Review', objective: 'Write a complete post-mortem for one of the simulated incidents above.', repoPath: 'module-11/lab-post-incident', steps: ['Pick the retry-storm or cache-stampede incident', 'Reconstruct the timeline from logs/metrics', 'Document root cause, detection, mitigation', 'Define 3 concrete action items'], duration: '60 minutes', difficulty: 'Intermediate' },
        ],
        keyTakeaways: [
          'Retry storms are caused by naive retries without budgets; cap them',
          'Cache stampedes need per-key locking, probabilistic expiration, or stale-while-revalidate',
          'Split brain is prevented by real consensus - do not invent HA without quorum math',
          'Cascading failures need defences at every layer: circuit breakers, budgets, load shedding, degradation',
          'Post-incident reviews convert incidents into engineering wins - without action items they are theatre',
        ],
        glossary: [
          { term: 'Retry storm', definition: 'Failure mode where retries amplify load on a struggling backend.' },
          { term: 'Cache stampede', definition: 'Many concurrent requests hit the origin when a hot cache key expires.' },
          { term: 'Split brain', definition: 'A network partition causes two halves of a system to operate independently with divergent state.' },
          { term: 'Hot partition', definition: 'A shard receiving disproportionately high traffic, overloading one node.' },
          { term: 'Post-mortem', definition: 'Blameless review of an incident that produces tracked action items.' },
        ],
        whyThisMatters: 'Real production engineers are recognised by the incidents they have absorbed and the runbooks they own. The patterns in this module - retry storms, stampedes, split brain, hot partitions, queue overload, DNS outages, cascading failure - are the same outage taxonomy across every company at every scale. Engineers who internalise them respond in minutes; engineers who do not spend hours reconstructing what should have been recognised in the first thirty seconds.',
        productionNotes: [
          'Build a per-failure-mode runbook library. Each runbook has detection signals, immediate-action checklist, recovery steps, and post-incident actions.',
          'Test runbooks in staging and chaos drills. Untested runbooks slow incident response, not speed it up.',
          'Capture every incident as a learning artefact even if there was &ldquo;no real impact&rdquo;. Near-misses are the cheapest training data.',
        ],
        commonMistakes: [
          'Skipping post-incident reviews on small incidents. The next bigger incident usually has the same root cause.',
          'Action items without owners or deadlines. The post-mortem becomes theatre.',
          'Treating retries as a fix instead of a load multiplier. Retries are a tool; budgets are the discipline.',
          'Single-cause root-cause analysis. Real incidents have multiple contributing factors; the post-mortem should surface all of them.',
        ],
        operationalStory: 'A retail platform&apos;s peak-Sunday traffic caused a Redis hot-partition incident on the cart-service. p99 spiked; users hit refresh; refresh multiplied load; circuit breakers in the gateway tripped; the gateway returned 503 for everything. The on-call engineer recognised the pattern within 90 seconds (cart latency in dashboard + Redis per-partition QPS imbalance), salted the cart-key (cart:user_id:0..9), and the system recovered. The runbook had been written 6 months earlier from a similar incident at a different company. The lesson: lessons travel; runbooks are the medium.',
        securityRisks: [
          'Cascading failures often expose security gaps too - rate-limit bypasses, circuit-breaker fail-open behaviour, fallback paths that skip authz.',
          'Incident response is when an attacker is most likely to slip in - on-call engineers are distracted; emergency commits skip review.',
          'Post-mortems should include a security review: did this incident reveal a hardening gap? Add the hardening as an action item.',
        ],
        designTradeoffs: [
          { option: 'Manual incident response', pros: ['Engineer judgment in the loop', 'Catches novel failures'], cons: ['Slow', 'Error-prone under pressure'] },
          { option: 'Automated runbooks (PagerDuty, Rundeck)', pros: ['Consistent execution', 'Fast'], cons: ['Only handles known patterns', 'Bad automation can amplify incidents'] },
          { option: 'Hybrid (auto-mitigate, human-confirm)', pros: ['Speed + judgment', 'Best of both'], cons: ['Tooling investment'] },
        ],
        thinkLikeAnEngineer: [
          'After every incident, ask: what would have prevented this entirely? Often the fix is upstream of the immediate cause.',
          'Build a catalogue of failure modes. New incidents either match one (resolve fast) or are novel (capture and add to catalogue).',
          'When designing a system, walk through the failure-mode catalogue mentally. Which of these can hit my system? What is my defence?',
        ],
        beforeAfter: {
          before: [
            'Outages debugged from cold; 90 minutes of cross-team Slack',
            'Same outage class repeats every quarter; no learning loop',
            'Post-mortems become theatre; action items slip indefinitely',
            'On-call dreaded; new engineers take months to be effective',
          ],
          after: [
            'Per-failure-mode runbook library; triaged in minutes',
            'Each incident strengthens the runbook; same class never repeats',
            'Action items tracked alongside feature work; reviewed in next post-mortem',
            'On-call is a known load; new engineers shadow then lead within weeks',
          ],
        },
        productionAlternatives: [
          { name: 'PagerDuty + automated runbooks', description: 'Industry standard incident management; ties detection to action.' },
          { name: 'Rundeck / Ansible AWX', description: 'Self-hosted runbook automation; tighter integration with infra.' },
          { name: 'AWS Incident Manager / GCP Cloud Operations', description: 'Cloud-native incident response; tighter integration with cloud telemetry.' },
          { name: 'FireHydrant / incident.io', description: 'Modern incident-management platforms with built-in post-mortem workflows.' },
        ],
      },
      {
        number: 12,
        title: 'Production System Design & Capstone',
        slug: 'production-system-design-capstone',
        subtitle: 'Multi-region architecture, disaster recovery, capacity planning, real production tradeoffs - and a capstone that integrates every module into one system.',
        duration: '6 hours',
        objectives: [
          'Design a multi-region architecture and reason about its failure modes',
          'Plan disaster recovery: RPO, RTO, runbooks, tested restoration',
          'Design for cost - capacity reservations, autoscaling, regional placement',
          'Read production architecture diagrams (Kafka, Kubernetes, Netflix, Uber, Google) and identify the trade-offs',
          'Design a complete production system as the capstone and defend the choices',
        ],
        svgDiagram: '<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="380" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">MULTI-REGION ACTIVE-ACTIVE</text><circle cx="160" cy="180" r="80" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 3"/><text x="160" y="106" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="bold">us-east-1</text><circle cx="160" cy="160" r="14" fill="#3b82f6" fill-opacity="0.4" stroke="#3b82f6"/><text x="160" y="164" text-anchor="middle" fill="#bfdbfe" font-size="9" font-weight="bold">app</text><circle cx="120" cy="200" r="12" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="120" y="204" text-anchor="middle" fill="#bbf7d0" font-size="8">db</text><circle cx="200" cy="200" r="12" fill="#fbbf24" fill-opacity="0.4" stroke="#fbbf24"/><text x="200" y="204" text-anchor="middle" fill="#fcd34d" font-size="8">cache</text><circle cx="640" cy="180" r="80" fill="#a855f7" fill-opacity="0.1" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="4 3"/><text x="640" y="106" text-anchor="middle" fill="#c4b5fd" font-size="11" font-weight="bold">eu-west-1</text><circle cx="640" cy="160" r="14" fill="#a855f7" fill-opacity="0.4" stroke="#a855f7"/><text x="640" y="164" text-anchor="middle" fill="#ddd6fe" font-size="9" font-weight="bold">app</text><circle cx="600" cy="200" r="12" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="600" y="204" text-anchor="middle" fill="#bbf7d0" font-size="8">db</text><circle cx="680" cy="200" r="12" fill="#fbbf24" fill-opacity="0.4" stroke="#fbbf24"/><text x="680" y="204" text-anchor="middle" fill="#fcd34d" font-size="8">cache</text><line x1="240" y1="180" x2="560" y2="180" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#a12)"/><line x1="560" y1="195" x2="240" y2="195" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#a12)"/><text x="400" y="170" text-anchor="middle" fill="#fcd34d" font-size="10">cross-region replication</text><text x="400" y="210" text-anchor="middle" fill="#fcd34d" font-size="10">CDC for invalidation</text><rect x="280" y="50" width="240" height="40" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="400" y="74" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Global LB (Route 53 / GCLB)</text><line x1="400" y1="90" x2="200" y2="120" stroke="#22c55e" stroke-width="1" stroke-dasharray="3 2"/><line x1="400" y1="90" x2="600" y2="120" stroke="#22c55e" stroke-width="1" stroke-dasharray="3 2"/><text x="400" y="320" text-anchor="middle" fill="#cbd5e1" font-size="11">Each region serves local traffic. Async cross-region replication for shared state.</text><text x="400" y="340" text-anchor="middle" fill="#94a3b8" font-size="10">Failover via DNS. RPO bounded by replication lag. RTO bounded by health-check + DNS TTL.</text><defs><marker id="a12" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#fcd34d"/></marker></defs></svg>',
        content: `
          <p>The capstone module ties every prior topic together. Production system design is the test of whether you can make CAP, replication, scaling, reliability, security, and observability cohere as a single coherent architecture. Most engineers can name the components; few can defend the choices.</p>

          <h2>Multi-Region Architecture</h2>

          <p>Three patterns:</p>
          <ul>
            <li><strong>Active-Passive</strong>: writes go to one region; standby region is a hot replica. Simple consistency story; failover is a deliberate, observable operation. RPO bounded by replication lag.</li>
            <li><strong>Active-Active sharded</strong>: each region owns a shard of the keyspace. Reads and writes local to that region. Cross-region traffic only for cross-shard operations. The right pattern for most globally-distributed systems.</li>
            <li><strong>Active-Active replicated</strong>: same data in every region; conflict resolution required. Useful for read-heavy global content (CDN-cached pages, profile reads). Dangerous for writes-with-consequence (payments) without globally-consistent storage like Spanner.</li>
          </ul>

          <h2>Disaster Recovery</h2>

          <p>Two metrics that drive every DR design:</p>
          <ul>
            <li><strong>RPO (Recovery Point Objective)</strong>: how much data you can afford to lose. Driven by replication lag and backup cadence. RPO=0 requires synchronous cross-region replication (cost). RPO=1 hour means hourly backups suffice.</li>
            <li><strong>RTO (Recovery Time Objective)</strong>: how long the recovery can take. Driven by failover automation, DNS TTL, warm-standby vs cold-restoration. RTO of minutes requires hot standbys; RTO of hours allows for backup-restore.</li>
          </ul>

          <p>The DR test discipline: <strong>untested DR is theater</strong>. Run a quarterly DR drill: simulate a regional outage, fail over, measure actual RTO, restore, document gaps.</p>

          <h2>Capacity Planning</h2>

          <p>Capacity engineering is forecasting load and provisioning to meet it without over-spending. The discipline:</p>
          <ul>
            <li>Track per-service RPS, p99 latency, resource utilisation over time.</li>
            <li>Project growth from product roadmap and historic curves.</li>
            <li>Identify bottleneck per service (CPU, RAM, connection pool, disk IOPS, downstream RPC).</li>
            <li>Reserve capacity for traffic peaks (Black Friday, marketing events).</li>
            <li>Set autoscaling boundaries that avoid surprises (HPA max not too low, not infinite).</li>
            <li>Review monthly; update quarterly.</li>
          </ul>

          <h2>Cost Engineering</h2>

          <p>At scale, cloud spend becomes architectural. Three high-leverage levers:</p>
          <ul>
            <li><strong>Right-sizing</strong>: VPA recommendations or manual analysis. Most workloads request 2&ndash;3x what they use; cutting that is direct savings.</li>
            <li><strong>Spot / preemptible instances</strong>: 60&ndash;90% cheaper than on-demand. Use for batch, async, stateless web. Karpenter handles the eviction churn.</li>
            <li><strong>Reserved capacity / savings plans</strong>: 30&ndash;60% cheaper for committed baseline. Buy enough to cover the steady-state, on-demand for the rest.</li>
          </ul>

          <h2>Production Architecture Case Studies</h2>

          <p>Read three real production architectures and identify how they made every decision in this course:</p>
          <ul>
            <li><strong>Kafka at LinkedIn</strong>: trillions of events per day; partitioning by key, ZooKeeper (now KRaft) for metadata, MirrorMaker for cross-region.</li>
            <li><strong>Cassandra at Netflix</strong>: leaderless replication, multi-region with LOCAL_QUORUM, custom backup tooling, the original Chaos Monkey.</li>
            <li><strong>Uber&apos;s ringpop</strong>: SWIM gossip + consistent hashing for service partitioning.</li>
            <li><strong>Spanner at Google</strong>: globally-consistent SQL via TrueTime; the gold standard for multi-region strong consistency.</li>
          </ul>

          <h2>Capstone Project</h2>

          <p>Design and document a complete production distributed system. Your capstone should include:</p>
          <ol>
            <li>An architecture diagram showing every service, datastore, and external dependency.</li>
            <li>The communication choice per boundary (sync HTTP, async Kafka, mTLS, etc.).</li>
            <li>The data model and partitioning strategy per datastore.</li>
            <li>The replication strategy and consistency guarantees.</li>
            <li>The autoscaling and capacity plan.</li>
            <li>The reliability patterns (circuit breakers, timeouts, retries, degradation).</li>
            <li>The security architecture (workload identity, mTLS, authz).</li>
            <li>The observability stack (traces, metrics, logs, SLOs).</li>
            <li>The deployment architecture (CI/CD, regions, rollback strategy).</li>
            <li>The DR plan with RPO/RTO targets.</li>
          </ol>

          <p>Defending the choices is the test. For each component you must be able to explain: <em>why this and not the alternative</em>. The answer is rarely the same for two systems - that is the discipline of system design.</p>

          <h2>Disaster Recovery Topology</h2>
          <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">DR TOPOLOGY - ACTIVE-PASSIVE WITH BACKUP</text><rect x="40" y="80" width="220" height="180" rx="10" fill="#22c55e" fill-opacity="0.15" stroke="#22c55e" stroke-width="2"/><text x="150" y="106" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Primary region</text><rect x="60" y="120" width="180" height="32" rx="4" fill="#22c55e" fill-opacity="0.3"/><text x="150" y="140" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">App tier (active)</text><rect x="60" y="160" width="180" height="32" rx="4" fill="#22c55e" fill-opacity="0.3"/><text x="150" y="180" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">DB primary</text><rect x="60" y="200" width="180" height="32" rx="4" fill="#22c55e" fill-opacity="0.3"/><text x="150" y="220" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">Backup snapshot</text><rect x="540" y="80" width="220" height="180" rx="10" fill="#94a3b8" fill-opacity="0.15" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/><text x="650" y="106" text-anchor="middle" fill="#cbd5e1" font-size="11" font-weight="bold">Secondary region (passive)</text><rect x="560" y="120" width="180" height="32" rx="4" fill="#94a3b8" fill-opacity="0.2"/><text x="650" y="140" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">App tier (warm standby)</text><rect x="560" y="160" width="180" height="32" rx="4" fill="#94a3b8" fill-opacity="0.2"/><text x="650" y="180" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">DB read replica</text><rect x="560" y="200" width="180" height="32" rx="4" fill="#94a3b8" fill-opacity="0.2"/><text x="650" y="220" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">Restored from snapshot</text><line x1="260" y1="170" x2="540" y2="170" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#dra)"/><text x="400" y="160" text-anchor="middle" fill="#fcd34d" font-size="10">async replication (RPO bound)</text><line x1="260" y1="216" x2="540" y2="216" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#dra)"/><text x="400" y="206" text-anchor="middle" fill="#ddd6fe" font-size="10">snapshot copy (hourly)</text><text x="400" y="280" text-anchor="middle" fill="#cbd5e1" font-size="10">Failover: DNS / global LB redirects to secondary. RTO ≈ minutes. RPO ≈ replication lag.</text><defs><marker id="dra" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Global Traffic Routing</h2>
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="13" font-weight="bold">GLOBAL TRAFFIC ROUTING (latency / geo-based)</text><circle cx="120" cy="100" r="14" fill="#3b82f6" fill-opacity="0.4" stroke="#3b82f6"/><text x="120" y="80" text-anchor="middle" fill="#bfdbfe" font-size="9">user-EU</text><circle cx="120" cy="180" r="14" fill="#22c55e" fill-opacity="0.4" stroke="#22c55e"/><text x="120" y="200" text-anchor="middle" fill="#bbf7d0" font-size="9">user-US</text><circle cx="120" cy="240" r="14" fill="#fbbf24" fill-opacity="0.4" stroke="#fbbf24"/><text x="120" y="260" text-anchor="middle" fill="#fcd34d" font-size="9">user-APAC</text><line x1="134" y1="100" x2="280" y2="120" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#gtra)"/><line x1="134" y1="180" x2="280" y2="140" stroke="#22c55e" stroke-width="1.5" marker-end="url(#gtra)"/><line x1="134" y1="240" x2="280" y2="160" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#gtra)"/><rect x="280" y="100" width="160" height="80" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/><text x="360" y="124" text-anchor="middle" fill="#c4b5fd" font-size="11" font-weight="bold">Global LB</text><text x="360" y="142" text-anchor="middle" fill="#94a3b8" font-size="9">Route 53 / GCLB / Anycast</text><text x="360" y="162" text-anchor="middle" fill="#94a3b8" font-size="9">latency-based routing</text><line x1="440" y1="120" x2="540" y2="80" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#gtra)"/><line x1="440" y1="140" x2="540" y2="140" stroke="#22c55e" stroke-width="1.5" marker-end="url(#gtra)"/><line x1="440" y1="160" x2="540" y2="200" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#gtra)"/><rect x="540" y="60" width="200" height="40" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/><text x="640" y="84" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="700">eu-west-1 region</text><rect x="540" y="120" width="200" height="40" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/><text x="640" y="144" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="700">us-east-1 region</text><rect x="540" y="180" width="200" height="40" rx="6" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24"/><text x="640" y="204" text-anchor="middle" fill="#fcd34d" font-size="10" font-weight="700">ap-southeast-1 region</text><text x="400" y="260" text-anchor="middle" fill="#cbd5e1" font-size="10">Health-check failover routes around dead regions; latency-based routing keeps users on the closest healthy region.</text><defs><marker id="gtra" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/></marker></defs></svg>

          <h2>Self-Check Quiz</h2>
          <ol>
            <li><strong>Your business says &ldquo;RPO=0, RTO=5 minutes&rdquo; for the database. What does this require?</strong> (Answer: synchronous cross-region replication (or globally-consistent storage like Spanner) and automated failover. Both are expensive. Understand the cost before committing.)</li>
            <li><strong>You design active-active across two regions for a payment system. Why is that risky?</strong> (Answer: split-brain on writes during partition. Active-active for payments needs sharded ownership (each shard active in one region) or globally-consistent storage.)</li>
            <li><strong>Your DR drill takes 3 hours instead of the planned 30 minutes. What were the gaps?</strong> (Answer: typically - secrets restoration, DNS propagation, dependency-order startup, missing runbook for one component. Drills find these. Untested DR is theater.)</li>
            <li><strong>Your monthly cloud bill grows 30% in a quarter. Two engineers spend a week analysing. What three levers usually pay back?</strong> (Answer: right-sizing requests, spot/preemptible for batch, reserved/savings plans for baseline. Each is 30-90% savings on the relevant bucket.)</li>
            <li><strong>Why is the capstone exercise more valuable than another module of content?</strong> (Answer: production system design is a synthesis skill that transfers only with practice. The capstone forces you to apply every prior module&apos;s trade-offs to a single coherent architecture.)</li>
          </ol>

          <h2>Where to Go Next - Future Advanced Courses</h2>
          <p>This course gives you the foundations and operational fluency. Three directions for deeper specialisation, each available free on CodersSecret:</p>
          <ul>
            <li><a href="/courses/mastering-spiffe-spire" class="text-primary underline">Mastering SPIFFE &amp; SPIRE</a> - 13 modules going deep on workload identity. The right next course after Module 8 (Distributed Security &amp; Zero Trust) of this course.</li>
            <li><a href="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering</a> - 16 modules on Kubernetes-native security. The right next course after Modules 8 and 10 of this course.</li>
            <li><a href="/courses/production-rag-systems-engineering" class="text-primary underline">Production RAG Systems Engineering</a> - 16 modules on AI-infrastructure-specific distributed systems patterns. The right next course if your distributed systems work is in AI/ML production.</li>
          </ul>
          <p>For ongoing operational reference, the cheatsheets that align with this course: <a href="/cheatsheets/kubernetes" class="text-primary underline">Kubernetes</a>, <a href="/cheatsheets/kubernetes-security" class="text-primary underline">Kubernetes Security</a>, <a href="/cheatsheets/spiffe-spire" class="text-primary underline">SPIFFE/SPIRE</a>, <a href="/cheatsheets/opa-rego" class="text-primary underline">OPA/Rego</a>, <a href="/cheatsheets/api-security" class="text-primary underline">API Security</a>, <a href="/cheatsheets/runtime-security" class="text-primary underline">Runtime Security</a>, <a href="/cheatsheets/service-mesh" class="text-primary underline">Service Mesh</a>, <a href="/cheatsheets/devsecops" class="text-primary underline">DevSecOps</a>.</p>
        `,
        labs: [
          { title: 'Lab 12.1 - Multi-Region Active-Active Demo', objective: 'Stand up a small active-active app across two regions; observe failover.', repoPath: 'module-12/lab-multi-region', steps: ['Deploy app + DB in two simulated regions (kind clusters)', 'Configure CRDT-style or LWW conflict resolution', 'Simulate partition; observe behaviour', 'Heal partition; verify convergence'], duration: '120 minutes', difficulty: 'Advanced' },
          { title: 'Lab 12.2 - DR Drill', objective: 'Practice a full disaster recovery drill from backup.', repoPath: 'module-12/lab-dr-drill', steps: ['Take a snapshot of a stateful service', 'Destroy the cluster', 'Restore from snapshot to a fresh cluster', 'Measure actual RTO; identify gaps'], duration: '120 minutes', difficulty: 'Advanced' },
          { title: 'Lab 12.3 - Capstone Architecture Document', objective: 'Produce a complete production architecture for a distributed system of your choosing.', repoPath: 'module-12/lab-capstone', steps: ['Pick a domain (e-commerce, payments, analytics, social)', 'Document architecture per the 10-point list above', 'Defend each choice with an alternative + the trade-off you made', 'Submit to peer review'], duration: '4 hours', difficulty: 'Advanced' },
        ],
        keyTakeaways: [
          'Multi-region is hard - pick active-passive or active-active sharded for most workloads',
          'RPO and RTO drive every DR decision; untested DR is theater',
          'Capacity planning is forecasting + bottleneck analysis + autoscaling discipline',
          'Cost engineering is architectural at scale; right-size, spot, reserved capacity',
          'The capstone is the test: can you defend every architectural choice with the trade-off?',
        ],
        whyThisMatters: 'This is the module that proves you can do system design at the senior / staff level. Anyone can list components; the engineer who can <em>defend</em> the choices - explain why this database and not that one, this consistency model and not the next, this region pattern and not the alternative - is the engineer who gets trusted with the architecture role. The capstone is your portfolio.',
        glossary: [
          { term: 'RPO', definition: 'Recovery Point Objective; how much data you can afford to lose in a disaster.' },
          { term: 'RTO', definition: 'Recovery Time Objective; how long recovery can take.' },
          { term: 'Active-Active', definition: 'Multiple regions accept reads and writes simultaneously.' },
          { term: 'Active-Passive', definition: 'One region is primary; others are standby replicas activated only on failover.' },
          { term: 'Capacity planning', definition: 'Discipline of forecasting load and provisioning to meet it efficiently.' },
        ],
        productionNotes: [
          'Practice DR drills quarterly. Untested DR is theatre. Measure actual RTO; gap-fill before the real outage.',
          'Capacity reviews monthly; full re-projection quarterly. Growth surprises do not have to be surprises.',
          'Tag every cloud resource with cost-centre + service. Cost engineering needs attribution.',
          'Buy reserved capacity for the steady-state baseline; on-demand for the burst; spot for batch.',
        ],
        commonMistakes: [
          'Designing for &ldquo;active-active multi-region&rdquo; for write-heavy workloads without globally-consistent storage. Split brain on payments is catastrophic.',
          'Confusing RPO and RTO. RPO is data loss tolerance; RTO is recovery time tolerance. Both need explicit SLOs.',
          'Right-sizing once and forgetting. Workload behaviour drifts; right-sizing is a quarterly discipline.',
          'No DR runbook for the dependency graph. Bringing services back in random order risks cascading retries on cold backends.',
        ],
        operationalStory: 'A team operated active-active across two regions for &ldquo;HA&rdquo; on their payments platform. A 4-minute partition between regions caused both sides to accept conflicting writes (same user charged twice from two regions). Reconciliation took 3 weeks of manual work. The redesign moved to active-passive with explicit failover and tested RTO &lt; 5 minutes. The engineering lesson: active-active for writes-with-consequence requires globally-consistent storage (Spanner/CockroachDB) or sharded ownership; never &ldquo;the same database in two regions&rdquo; with async replication.',
        designTradeoffs: [
          { option: 'Active-Passive multi-region', pros: ['Simple consistency story', 'Bounded cost', 'Tested failover path'], cons: ['Standby capacity is &ldquo;wasted&rdquo;', 'Failover is an operation'] },
          { option: 'Active-Active sharded', pros: ['Each region serves local traffic', 'Clear ownership boundary'], cons: ['Cross-shard ops are expensive', 'Complex routing'] },
          { option: 'Active-Active replicated (full data in every region)', pros: ['Read locality everywhere'], cons: ['Conflict resolution required', 'Dangerous for writes-with-consequence without consistent storage'] },
          { option: 'Globally-consistent (Spanner / CockroachDB)', pros: ['Linearizable globally', 'Writes anywhere'], cons: ['Premium cost', 'Cross-region commit latency'] },
        ],
        realWorldUseCases: [
          'Stripe runs active-passive multi-region for payment processing with sub-minute failover.',
          'Google Spanner is the canonical example of globally-consistent SQL with TrueTime-bounded uncertainty.',
          'Netflix runs active-active across AWS regions for the streaming control plane (read-heavy, eventually consistent).',
          'AWS DynamoDB Global Tables provide multi-region active-active with last-writer-wins; useful for read-heavy global content.',
        ],
        careerRelevance: 'The capstone of this course aligns with the senior-to-staff engineering interview at most large companies: design a real production system, identify trade-offs, defend choices. Engineers who can produce a coherent, defensible architecture document and walk through it under questioning are the engineers who get trusted with the architecture role. The capstone exercise is your portfolio piece.',
        thinkLikeAnEngineer: [
          'Architecture is the discipline of saying no. Every &ldquo;yes&rdquo; to a feature locks in trade-offs that constrain the next year of decisions.',
          'For every architectural choice, write down the alternative. If you cannot articulate the alternative, you do not understand your own choice.',
          'When defending an architecture, frame it as &ldquo;I chose X because the trade-off was Y vs Z; here is which I optimised for and why&rdquo;. That framing is the difference between &ldquo;senior&rdquo; and &ldquo;staff&rdquo;.',
        ],
        securityRisks: [
          'Multi-region implies cross-region replication; the wire is a new attack surface. Always TLS, ideally mTLS via SPIFFE federation.',
          'DR backups in cold storage are still customer data; encrypt at rest with KMS, audit access.',
          'Failover automation that bypasses change control becomes the attacker&apos;s lever (&ldquo;simulate failure to force failover&rdquo;).',
          'Active-active with shared global IAM means one region&apos;s compromise = global compromise. Region-scoped credentials are safer.',
        ],
        beforeAfter: {
          before: [
            'DR documented but never tested; first real failover is the test',
            'Single region; an AZ failure becomes a customer-impacting outage',
            'Cost grows linearly with users; no architectural levers pulled',
            'Capstone-level system design treated as senior interview hazing, not real skill',
          ],
          after: [
            'DR drilled quarterly; actual RTO measured and improved',
            'Multi-region with explicit pattern (active-passive or sharded active-active)',
            'Cost engineering as ongoing discipline: right-sizing, spot, reservations',
            'Production architecture documented with defended trade-offs; portfolio-quality artefact',
          ],
        },
        productionAlternatives: [
          { name: 'Active-Passive multi-region', description: 'Simplest, bounded RTO/RPO; standby capacity costs.' },
          { name: 'Active-Active sharded', description: 'Each region owns a shard; standard pattern for global SaaS.' },
          { name: 'Active-Active replicated', description: 'Same data in every region; only safe with globally-consistent storage.' },
          { name: 'Edge-first (Cloudflare Workers, Lambda@Edge)', description: 'Compute at the edge; lowest latency for global users.' },
          { name: 'Multi-cloud (avoid vendor lock-in)', description: 'Highest operational cost; pays back if vendor risk is real.' },
        ],
      },
    ],
    seoPages: [
      { slug: 'distributed-systems-engineering-explained', title: 'Distributed Systems Engineering: A Practical Walkthrough', description: 'A production-engineering walkthrough of distributed systems: CAP, consensus, replication, scalability, observability, and Zero Trust. Free 12-module course.', ctaModule: 1, content: '<h1>Distributed Systems Engineering: A Practical Walkthrough</h1><p>Distributed systems engineering is the discipline of building software that survives partial failure, scales horizontally, and stays observable across many machines. This is the field most modern infrastructure runs on - Kubernetes, Kafka, Cassandra, Spanner, every cloud platform.</p><p>The free <a href="/courses/distributed-systems-engineering">Distributed Systems Engineering course</a> walks you through 12 modules covering everything from CAP and latency to consensus, observability, Zero Trust, Kubernetes-native architecture, and real failure scenarios.</p>' },
      { slug: 'how-distributed-systems-work', title: 'How Distributed Systems Actually Work in Production', description: 'A clear, practical explanation of how distributed systems work: replication, consensus, partitioning, observability, failure recovery - taught from real production engineering, not textbooks.', ctaModule: 1, content: '<h1>How Distributed Systems Actually Work</h1><p>Real production distributed systems are built on a small set of foundational ideas: state replication for durability, consensus for agreement, partitioning for scale, observability for debugging, and intentional failure handling for reliability.</p><p>The free <a href="/courses/distributed-systems-engineering">Distributed Systems Engineering course</a> teaches all of these from operational reality - with hands-on labs every module.</p>' },
    ],
    faqs: [
      { question: 'Is this course beginner-friendly?', answer: 'Yes. Module 1 builds the mental model from scratch, and every subsequent module begins with foundational concepts before going production-deep. You should be comfortable with basic programming and Linux command line; everything distributed-systems-specific is taught in the course.' },
      { question: 'How is this different from Designing Data-Intensive Applications?', answer: 'DDIA is the canonical book on distributed-systems theory and the algorithms layer. This course focuses on the operational and production-engineering layer: how Kubernetes changes the game, how Zero Trust integrates, how to run real systems with observability, how failure scenarios actually unfold. Read DDIA alongside this course; the two complement each other.' },
      { question: 'Does the course require Kubernetes experience?', answer: 'No. Modules 1&ndash;9 are platform-agnostic. Module 10 introduces Kubernetes from the ground up, and Modules 11&ndash;12 use Kubernetes as the deployment substrate. If you already operate Kubernetes, you can skim Module 10.' },
      { question: 'Is the course free?', answer: 'Yes. Every module, every lab, and every diagram is 100% free and ad-free. No paywall, no signup wall.' },
      { question: 'How do the labs work?', answer: 'Each lab includes a self-contained scenario you can reproduce on a laptop with Docker or kind (Kubernetes in Docker). Lab repos are linked from each module. Labs are 30&ndash;90 minutes each and produce concrete operational outputs you can show in interviews.' },
      { question: 'How does this course relate to the Mastering SPIFFE & SPIRE course?', answer: 'They are complementary. Mastering SPIFFE & SPIRE goes deep on workload identity. Module 8 of this course introduces SPIFFE/SPIRE and Zero Trust at the level you need to design distributed-systems security. Take the SPIFFE & SPIRE course after Module 8 if you want the full identity-system depth.' },
    ],
  };
