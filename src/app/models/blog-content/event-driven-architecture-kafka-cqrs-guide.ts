export const CONTENT = `
      <p>In a traditional architecture, Service A calls Service B synchronously. If B is down, A fails too. If B is slow, A is slow too. Event-driven architecture breaks this coupling: Service A publishes an event, and any interested service processes it independently, at its own pace, on its own schedule.</p>

      <h2>Synchronous vs Event-Driven</h2>

      <pre><code># Synchronous: tight coupling
def create_order(data):
    order = save_order(data)
    payment_service.charge(order)        # Blocks. What if payment is down?
    inventory_service.reserve(order)      # Blocks. What if inventory is slow?
    email_service.send_confirmation(order) # Blocks. Email server timeout?
    return order  # Total time: sum of all calls

# Event-driven: loose coupling
def create_order(data):
    order = save_order(data)
    publish_event("order.created", order)  # Instant. Fire and forget.
    return order  # Total time: just the database write

# Consumers process independently:
# PaymentService listens for "order.created" -> charges customer
# InventoryService listens for "order.created" -> reserves items
# EmailService listens for "order.created" -> sends confirmation</code></pre>

      <h2>Core Concepts</h2>

      <ul>
        <li><strong>Event:</strong> An immutable fact that something happened (&ldquo;OrderCreated&rdquo;, &ldquo;PaymentProcessed&rdquo;, &ldquo;UserRegistered&rdquo;)</li>
        <li><strong>Producer:</strong> The service that publishes events</li>
        <li><strong>Consumer:</strong> A service that subscribes to and processes events</li>
        <li><strong>Broker:</strong> The infrastructure that routes events (Kafka, RabbitMQ, SNS/SQS)</li>
        <li><strong>Topic/Queue:</strong> A named channel where events are published</li>
      </ul>

      <h2>Kafka vs RabbitMQ</h2>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Apache Kafka</th>
            <th>RabbitMQ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Model</td>
            <td>Distributed log (append-only)</td>
            <td>Message queue (consume and delete)</td>
          </tr>
          <tr>
            <td>Retention</td>
            <td>Configurable (days/weeks/forever)</td>
            <td>Until consumed (or TTL)</td>
          </tr>
          <tr>
            <td>Replay</td>
            <td>Yes (re-read from any offset)</td>
            <td>No (once consumed, gone)</td>
          </tr>
          <tr>
            <td>Throughput</td>
            <td>Millions of events/sec</td>
            <td>Tens of thousands/sec</td>
          </tr>
          <tr>
            <td>Ordering</td>
            <td>Guaranteed per partition</td>
            <td>Per queue (with single consumer)</td>
          </tr>
          <tr>
            <td>Complexity</td>
            <td>High (ZooKeeper/KRaft, partitions)</td>
            <td>Low (simple to operate)</td>
          </tr>
          <tr>
            <td>Best For</td>
            <td>Event streaming, audit logs, high throughput</td>
            <td>Task queues, RPC, simple pub/sub</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Rule of thumb:</strong> Use RabbitMQ for task queues and simple messaging. Use Kafka when you need event replay, high throughput, or event sourcing.</p>

      <h2>Event Design</h2>

      <pre><code># Good event: self-contained, immutable, past tense
{
    "event_type": "order.created",
    "event_id": "evt_abc123",
    "timestamp": "2026-04-28T10:30:00Z",
    "version": 1,
    "data": {
        "order_id": "ord_456",
        "customer_id": "cust_789",
        "items": [
            {"product_id": "prod_1", "quantity": 2, "price": 29.99}
        ],
        "total": 59.98,
        "currency": "USD"
    },
    "metadata": {
        "source": "order-service",
        "correlation_id": "req_xyz"
    }
}

# Event naming conventions:
# entity.action (past tense): order.created, payment.processed, user.registered
# Include enough data that consumers do not need to call back to the producer</code></pre>

      <h2>Event Sourcing</h2>

      <p>Instead of storing the current state, store every event that led to it. The current state is derived by replaying all events. Think of it as a Git log for your data.</p>

      <pre><code># Traditional: store current state
# UPDATE accounts SET balance = 150 WHERE id = 1

# Event sourcing: store events
events = [
    {"type": "account.opened",    "data": {"balance": 0}},
    {"type": "money.deposited",   "data": {"amount": 200}},
    {"type": "money.withdrawn",   "data": {"amount": 50}},
    # Current balance: replay events -> 0 + 200 - 50 = 150
]

# Benefits:
# - Complete audit trail (when did balance change and why?)
# - Replay events to rebuild state or create new projections
# - Time travel: what was the balance on March 15?
# - Debug: replay events to reproduce any bug

# Drawbacks:
# - More complex queries (need projections for reads)
# - Event schema evolution is tricky
# - Storage grows over time (use snapshots)</code></pre>

      <h2>CQRS: Command Query Responsibility Segregation</h2>

      <p>Separate the write model (commands) from the read model (queries). Write side handles business logic and publishes events. Read side creates optimized views for queries.</p>

      <pre><code># Write side: handles commands, enforces business rules
class OrderCommandHandler:
    def handle_create_order(self, command):
        # Validate business rules
        if not inventory.has_stock(command.items):
            raise OutOfStockError()

        # Save to event store
        event = OrderCreatedEvent(
            order_id=generate_id(),
            items=command.items,
            total=calculate_total(command.items),
        )
        event_store.append(event)
        publish(event)

# Read side: optimized projections for queries
class OrderProjection:
    def on_order_created(self, event):
        # Update a denormalized read model
        db.execute("""
            INSERT INTO order_summaries (id, customer, total, status, created_at)
            VALUES (%s, %s, %s, 'pending', %s)
        """, [event.order_id, event.customer_id, event.total, event.timestamp])

    def on_payment_processed(self, event):
        db.execute("""
            UPDATE order_summaries SET status = 'paid' WHERE id = %s
        """, [event.order_id])

# Query side: fast reads from denormalized tables
def get_order_summary(order_id):
    return db.query("SELECT * FROM order_summaries WHERE id = %s", [order_id])</code></pre>

      <h2>Dead Letter Queues</h2>

      <p>When a consumer fails to process a message after multiple retries, send it to a Dead Letter Queue (DLQ) instead of losing it or blocking the queue.</p>

      <pre><code># Kafka: configure DLQ with error handling
from confluent_kafka import Consumer, Producer

dlq_producer = Producer({'bootstrap.servers': 'kafka:9092'})

def process_with_dlq(message, max_retries=3):
    for attempt in range(max_retries):
        try:
            process_event(message.value())
            return  # Success
        except TemporaryError:
            time.sleep(2 ** attempt)  # Exponential backoff
        except PermanentError as e:
            break  # Skip retries for permanent failures

    # All retries failed: send to DLQ
    dlq_producer.produce(
        'order-events.dlq',
        key=message.key(),
        value=message.value(),
        headers={
            'original-topic': message.topic(),
            'error': str(e),
            'retry-count': str(max_retries),
        }
    )

# Monitor DLQ: alert when messages appear
# Process DLQ: fix the issue, then replay messages</code></pre>

      <h2>Idempotency: Processing Events Safely</h2>

      <p>Events can be delivered more than once (network retries, consumer restarts). Your consumers <strong>must</strong> be idempotent &mdash; processing the same event twice should produce the same result.</p>

      <pre><code># Idempotent consumer using event_id deduplication
class IdempotentConsumer:
    def process(self, event):
        event_id = event['event_id']

        # Check if already processed
        if db.exists("SELECT 1 FROM processed_events WHERE event_id = %s", [event_id]):
            return  # Already processed, skip

        # Process the event
        handle_order_created(event['data'])

        # Mark as processed (in the same transaction!)
        db.execute(
            "INSERT INTO processed_events (event_id, processed_at) VALUES (%s, NOW())",
            [event_id]
        )
        db.commit()

# Alternative: use database constraints
# INSERT INTO payments (order_id, amount) VALUES (%s, %s)
# ON CONFLICT (order_id) DO NOTHING;
# The unique constraint on order_id prevents duplicate payments</code></pre>

      <h2>Migrating from Monolith to Event-Driven</h2>

      <ol>
        <li><strong>Start with domain events inside the monolith:</strong> Emit events from your existing code without changing architecture</li>
        <li><strong>Add an event bus (even in-process):</strong> Replace direct function calls with event publishing</li>
        <li><strong>Extract one consumer at a time:</strong> Move email sending to a separate service that consumes events</li>
        <li><strong>Introduce a broker (Kafka/RabbitMQ):</strong> Replace the in-process event bus with external messaging</li>
        <li><strong>Extract more services gradually:</strong> Each extraction is independent and reversible</li>
      </ol>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Events decouple services in time and availability</strong> &mdash; producers and consumers do not need to be online simultaneously</li>
        <li><strong>Use Kafka for event streaming, RabbitMQ for task queues</strong> &mdash; Kafka retains events, RabbitMQ deletes after consumption</li>
        <li><strong>Events should be self-contained</strong> &mdash; include enough data that consumers never need to call back to the producer</li>
        <li><strong>Dead letter queues prevent data loss</strong> &mdash; failed messages go to DLQ for later investigation, not the void</li>
        <li><strong>Consumers must be idempotent</strong> &mdash; use event_id deduplication or database constraints</li>
        <li><strong>Event sourcing gives you a complete audit trail</strong> &mdash; but adds complexity, so use it where the audit trail justifies the cost</li>
        <li><strong>Migrate incrementally</strong> &mdash; start with events inside your monolith before splitting services</li>
      </ul>

      <p>Event-driven architecture is not about technology &mdash; it is about designing systems where services communicate through facts rather than commands. When Service A says &ldquo;an order was created&rdquo; instead of &ldquo;charge this customer,&rdquo; you get a system that is more resilient, more scalable, and easier to evolve. Start with the events. The architecture follows.</p>
    `;
