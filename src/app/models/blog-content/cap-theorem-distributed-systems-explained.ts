export const CONTENT = `
      <p>If you build anything that runs on more than one server, you will eventually hit the <strong>CAP theorem</strong>. It is the single most important constraint in distributed systems design, and every database, message queue, and microservice architecture is shaped by it &mdash; whether the engineers who built it know it or not.</p>

      <p>The CAP theorem says: <strong>a distributed system can deliver at most two of three guarantees &mdash; Consistency, Availability, and Partition Tolerance</strong>. You cannot have all three at the same time. This is not an opinion or a best practice. It was proven mathematically by Seth Gilbert and Nancy Lynch at MIT in 2002, based on a conjecture by Eric Brewer in 2000.</p>

      <h2>The Three Guarantees</h2>

      <p>Before we talk about trade-offs, let us define each guarantee precisely. These definitions are more nuanced than most tutorials admit.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">The CAP Triangle</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">C &mdash; Consistency</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F50D;</span>Every read returns the most recent write</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F465;</span>All nodes see the same data at the same time</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Not the same as ACID consistency</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">A &mdash; Availability</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Every request gets a response (not an error)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>No guarantee the response has the latest data</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4AA;</span>System never refuses a read or write</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">P &mdash; Partition Tolerance</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4A5;</span>System works even if network splits nodes apart</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Messages between nodes can be lost or delayed</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E1;</span>Non-negotiable in any real distributed system</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Why You Cannot Have All Three</h2>

      <p>Here is the thought experiment that makes the trade-off intuitive. Imagine two database nodes, A and B, that replicate data between each other. A client writes <code>balance = 100</code> to Node A. Before Node A can replicate this to Node B, the network between them goes down. This is a <strong>partition</strong>.</p>

      <p>Now a second client reads from Node B. You have two choices:</p>

      <ul>
        <li><strong>Return the old value</strong> (say <code>balance = 0</code>). You preserved <strong>availability</strong> (the request got a response) but sacrificed <strong>consistency</strong> (the client got stale data).</li>
        <li><strong>Refuse the request</strong> until the partition heals. You preserved <strong>consistency</strong> (every read returns the latest write) but sacrificed <strong>availability</strong> (the client got an error or timeout).</li>
      </ul>

      <p>There is no third option. During a partition, you <strong>must</strong> choose between C and A. This is the core of the CAP theorem.</p>

      <div class="pipeline-diagram">
        <div class="pipeline-title">What Happens During a Network Partition</div>
        <div class="pipeline-steps">
          <div class="pipeline-step">Client writes<br><strong>balance = 100</strong><br>to Node A</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#ef4444">Network partition<br><strong>A cannot reach B</strong><br>Messages lost</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step">Client reads<br>from <strong>Node B</strong><br>What do you return?</div>
        </div>
      </div>

      <h2>CP Systems: Consistency + Partition Tolerance</h2>

      <p>A <strong>CP system</strong> chooses consistency when a partition occurs. If a node cannot confirm it has the latest data, it refuses to serve reads. The system stays correct but becomes temporarily unavailable to some clients.</p>

      <p><strong>Real-world CP systems:</strong></p>

      <ul>
        <li><strong>MongoDB</strong> (with majority read/write concern) &mdash; if the primary node is unreachable, writes are rejected until a new primary is elected.</li>
        <li><strong>Apache ZooKeeper</strong> &mdash; used for distributed coordination (leader election, config management). A ZooKeeper cluster that loses quorum stops accepting writes.</li>
        <li><strong>etcd</strong> &mdash; the key-value store behind Kubernetes. Uses Raft consensus; a minority partition cannot serve reads or writes.</li>
        <li><strong>Google Spanner</strong> &mdash; globally distributed SQL database that uses TrueTime (GPS + atomic clocks) to maintain strong consistency across continents.</li>
      </ul>

      <p><strong>When to choose CP:</strong> Financial transactions, inventory systems, leader election, configuration stores &mdash; anywhere stale data leads to incorrect decisions.</p>

      <h2>AP Systems: Availability + Partition Tolerance</h2>

      <p>An <strong>AP system</strong> chooses availability when a partition occurs. Every node keeps serving requests, even if it might return stale data. When the partition heals, nodes reconcile their differences.</p>

      <p><strong>Real-world AP systems:</strong></p>

      <ul>
        <li><strong>Apache Cassandra</strong> &mdash; every node can serve reads and writes independently. Uses tunable consistency levels (ONE, QUORUM, ALL) to slide between AP and CP behavior.</li>
        <li><strong>Amazon DynamoDB</strong> &mdash; designed for "always on" availability. Uses eventual consistency by default; optional strong consistency available per-read.</li>
        <li><strong>CouchDB</strong> &mdash; multi-master replication with conflict resolution. Designed for offline-first applications that sync later.</li>
        <li><strong>DNS</strong> &mdash; the internet's naming system is a massively distributed AP system. DNS records propagate eventually; stale records are normal and expected.</li>
      </ul>

      <p><strong>When to choose AP:</strong> Shopping carts, social media feeds, analytics dashboards, caching layers, DNS &mdash; anywhere a slightly stale response is better than no response.</p>

      <h2>What About CA? (Consistency + Availability)</h2>

      <p>In theory, a <strong>CA system</strong> provides both consistency and availability &mdash; but gives up partition tolerance. In practice, <strong>CA systems do not exist in distributed environments</strong> because network partitions are inevitable. You cannot choose to ignore them.</p>

      <p>A single-node PostgreSQL or MySQL database is effectively a CA system: it is always consistent, always available, and never has to worry about network partitions because there is only one node. The moment you add replication, you enter CAP territory and must choose between C and A during failures.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">CAP Classification of Popular Databases</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">CP Systems</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>MongoDB (majority concern)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>etcd / ZooKeeper</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>Google Spanner</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>CockroachDB</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">AP Systems</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>Cassandra</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>DynamoDB (default)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>CouchDB</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>Riak / Voldemort</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Eventual Consistency: The AP Compromise</h2>

      <p>Most AP systems use <strong>eventual consistency</strong>: if no new writes arrive, all replicas will <em>eventually</em> converge to the same value. The key question is <strong>how long is "eventually"?</strong></p>

      <ul>
        <li><strong>DynamoDB:</strong> typically converges within milliseconds (cross-region can take seconds).</li>
        <li><strong>DNS:</strong> TTL-based; can take minutes to hours depending on cache settings.</li>
        <li><strong>Cassandra:</strong> configurable via consistency levels. <code>QUORUM</code> reads/writes give you strong consistency within the AP model.</li>
      </ul>

      <p>Eventual consistency is not "broken" consistency. It is a <strong>deliberate trade-off</strong> that lets the system stay responsive during network issues, at the cost of temporarily serving slightly outdated data.</p>

      <h2>Tunable Consistency: The Modern Approach</h2>

      <p>Modern databases do not force you into a hard CP-or-AP choice. Many offer <strong>tunable consistency</strong> that lets you pick your trade-off per operation.</p>

      <pre><code># Cassandra: tunable consistency per query
# Strong consistency (CP behavior):
SELECT * FROM users WHERE id = 123
  USING CONSISTENCY QUORUM;

# Eventual consistency (AP behavior):
SELECT * FROM users WHERE id = 123
  USING CONSISTENCY ONE;

# Rule of thumb: if R + W > N, you get strong consistency
# R = read replicas, W = write replicas, N = total replicas
# QUORUM = ceil((N+1)/2), so QUORUM + QUORUM > N</code></pre>

      <p><strong>DynamoDB</strong> supports this too: every read can opt into <code>ConsistentRead: true</code> for strong consistency (at the cost of higher latency and no read from replicas).</p>

      <h2>PACELC: The Extension You Should Know</h2>

      <p>The CAP theorem only talks about what happens <strong>during a partition</strong>. But what about normal operation? The <strong>PACELC theorem</strong> extends CAP to cover both cases:</p>

      <ul>
        <li><strong>PAC:</strong> During a <strong>P</strong>artition, choose between <strong>A</strong>vailability and <strong>C</strong>onsistency (this is CAP).</li>
        <li><strong>ELC:</strong> <strong>E</strong>lse (no partition), choose between <strong>L</strong>atency and <strong>C</strong>onsistency.</li>
      </ul>

      <p>Even when the network is healthy, maintaining strong consistency requires coordination between nodes (consensus protocols, synchronous replication) &mdash; which adds <strong>latency</strong>. Systems that optimize for consistency pay a latency tax. Systems that optimize for latency accept weaker consistency.</p>

      <div class="pipeline-diagram">
        <div class="pipeline-title">PACELC Extended Model</div>
        <div class="pipeline-steps">
          <div class="pipeline-step" style="border-color:#ef4444">Network<br><strong>Partition?</strong></div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#f97316">YES &rarr; Choose<br><strong>A or C</strong><br>(CAP theorem)</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#22c55e">NO &rarr; Choose<br><strong>L or C</strong><br>(Latency vs Consistency)</div>
        </div>
      </div>

      <h2>Common Misconceptions</h2>

      <ul>
        <li><strong>"CAP means pick 2 out of 3"</strong> &mdash; Misleading. Partition tolerance is not optional in any real distributed system. The real choice is between C and A <em>during a partition</em>.</li>
        <li><strong>"MongoDB is CP, so it is always consistent"</strong> &mdash; Only if you use majority read/write concern. With default settings, MongoDB can return stale reads from secondaries.</li>
        <li><strong>"Eventual consistency means data is wrong"</strong> &mdash; No. It means data might be temporarily stale. In practice, convergence is often sub-second.</li>
        <li><strong>"CAP applies all the time"</strong> &mdash; The theorem only constrains behavior <em>during partitions</em>. When the network is healthy, most systems provide both C and A.</li>
        <li><strong>"Single-node databases are immune to CAP"</strong> &mdash; True, but they have a single point of failure. The moment you replicate for high availability, CAP applies.</li>
      </ul>

      <h2>How to Choose: A Decision Framework</h2>

      <p>When designing a distributed system, ask these questions in order:</p>

      <ul>
        <li><strong>Can I afford to show stale data?</strong> If a user sees a balance from 2 seconds ago, is that dangerous or just mildly annoying?</li>
        <li><strong>Can I afford downtime during a network partition?</strong> If a data center goes offline, can users wait, or must the system keep serving?</li>
        <li><strong>How long do partitions last in my infrastructure?</strong> Cloud providers have very brief partitions (seconds). Cross-region or edge deployments may have longer ones.</li>
        <li><strong>Can different parts of my system make different choices?</strong> The payment service needs CP. The product recommendation feed needs AP. Design per-service, not per-system.</li>
      </ul>

      <h2>CAP in Practice: System Design Interview Patterns</h2>

      <p>In system design interviews, CAP shows up constantly. Here are the patterns:</p>

      <ul>
        <li><strong>Banking/payments:</strong> CP (strong consistency). Use PostgreSQL with synchronous replication, or CockroachDB. Accept brief unavailability during failures.</li>
        <li><strong>Social media feed:</strong> AP (eventual consistency). Use Cassandra or DynamoDB. A slightly stale feed is fine; a broken feed is not.</li>
        <li><strong>Shopping cart:</strong> AP with conflict resolution. Amazon famously chose AP for its shopping cart (the paper that inspired DynamoDB). Merge conflicts &mdash; add both items, let the user resolve.</li>
        <li><strong>Chat/messaging:</strong> CP for message ordering (you need causal consistency). AP for presence/typing indicators (stale is fine).</li>
        <li><strong>Configuration store:</strong> CP (etcd, ZooKeeper). Wrong config is worse than temporary unavailability.</li>
      </ul>

      <h2>Summary</h2>

      <ul>
        <li>The CAP theorem is a <strong>proven mathematical constraint</strong>, not a guideline.</li>
        <li>During a network partition, you <strong>must choose</strong> between consistency and availability.</li>
        <li>Partition tolerance is <strong>not optional</strong> in real distributed systems.</li>
        <li>Most modern databases offer <strong>tunable consistency</strong> &mdash; you choose per query.</li>
        <li>The <strong>PACELC extension</strong> adds the latency-vs-consistency trade-off during normal operation.</li>
        <li>Different parts of your system can (and should) make <strong>different CAP choices</strong>.</li>
      </ul>
    `;
