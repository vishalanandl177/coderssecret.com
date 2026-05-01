export const CONTENT = `
      <p>Your Django view takes 30 seconds because it sends emails, generates PDFs, and calls three external APIs. Your users are staring at a loading spinner. The fix is not faster code &mdash; it is moving slow work to a background task queue.</p>

      <p>Celery is the standard solution for Python. This guide takes you from basic tasks to production-grade workflows with retries, chains, monitoring, and the gotchas that bite every team.</p>

      <div class="pipeline-diagram">
        <div class="pipeline-title">Celery Task Queue Architecture</div>
        <div class="pipeline-steps">
          <div class="pipeline-step" style="border-color:#3b82f6">Django View<br><strong>Producer</strong><br>task.delay()</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#ef4444">Redis<br><strong>Broker</strong><br>message queue</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#22c55e">Celery Worker<br><strong>Consumer</strong><br>executes task</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#a855f7">Result<br><strong>Backend</strong><br>Redis / DB</div>
        </div>
      </div>

      <h2>Setup: Django + Celery + Redis</h2>

      <pre><code># Install
pip install celery[redis] django-celery-beat django-celery-results

# project/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

app = Celery('project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()  # Auto-find tasks.py in each app

# project/__init__.py
from .celery import app as celery_app
__all__ = ('celery_app',)

# settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'</code></pre>

      <h2>Basic Tasks</h2>

      <pre><code># orders/tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_order_confirmation(order_id: int):
    """Send order confirmation email in the background."""
    order = Order.objects.select_related('customer').get(id=order_id)
    send_mail(
        subject=f'Order #{order.id} Confirmed',
        message=f'Thank you for your order of {order.total}.',
        from_email='noreply@example.com',
        recipient_list=[order.customer.email],
    )
    return f"Email sent for order {order_id}"

@shared_task
def generate_invoice_pdf(order_id: int):
    """Generate PDF invoice and upload to S3."""
    order = Order.objects.get(id=order_id)
    pdf = render_invoice(order)
    url = upload_to_s3(pdf, f"invoices/order-{order_id}.pdf")
    order.invoice_url = url
    order.save(update_fields=['invoice_url'])
    return url

# Call from your view:
def create_order(request):
    order = Order.objects.create(...)

    # Fire and forget - returns immediately
    send_order_confirmation.delay(order.id)
    generate_invoice_pdf.delay(order.id)

    return JsonResponse({"order_id": order.id})  # Responds instantly!</code></pre>

      <h2>Task Retries: Handling Failures Gracefully</h2>

      <pre><code>@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # 60 seconds between retries
)
def call_payment_api(self, order_id: int):
    """Process payment with automatic retries."""
    order = Order.objects.get(id=order_id)

    try:
        result = payment_gateway.charge(
            amount=order.total,
            token=order.payment_token,
        )
        order.payment_status = 'completed'
        order.save(update_fields=['payment_status'])
        return result

    except payment_gateway.TemporaryError as exc:
        # Retry with exponential backoff
        raise self.retry(
            exc=exc,
            countdown=60 * (2 ** self.request.retries),  # 60s, 120s, 240s
        )

    except payment_gateway.PermanentError as exc:
        # Do not retry permanent failures
        order.payment_status = 'failed'
        order.save(update_fields=['payment_status'])
        raise  # Let it fail</code></pre>

      <h2>Task Chains: Sequential Workflows</h2>

      <pre><code>from celery import chain

# Execute tasks in sequence, passing results forward
workflow = chain(
    validate_order.s(order_id),      # Step 1: validate
    process_payment.s(),              # Step 2: charge (receives validation result)
    send_confirmation.s(),            # Step 3: email (receives payment result)
    generate_invoice.s(),             # Step 4: PDF
)

# Execute the chain
workflow.delay()

# Each task receives the return value of the previous task
@shared_task
def validate_order(order_id):
    order = Order.objects.get(id=order_id)
    if order.total <= 0:
        raise ValueError("Invalid order total")
    return {"order_id": order_id, "total": float(order.total)}

@shared_task
def process_payment(validation_result):
    order_id = validation_result["order_id"]
    # ... process payment
    return {"order_id": order_id, "payment_id": "pay_123"}</code></pre>

      <h2>Task Groups and Chords: Parallel Execution</h2>

      <pre><code>from celery import group, chord

# Group: run tasks in parallel (fan-out)
batch = group(
    send_notification.s(user_id) for user_id in user_ids
)
batch.delay()  # All notifications sent in parallel

# Chord: parallel tasks + callback when ALL complete (fan-out, fan-in)
workflow = chord(
    [
        fetch_price.s('AAPL'),
        fetch_price.s('GOOGL'),
        fetch_price.s('MSFT'),
    ],
    compile_report.s()  # Called with list of all results
)
workflow.delay()

@shared_task
def fetch_price(symbol):
    price = stock_api.get_price(symbol)
    return {"symbol": symbol, "price": price}

@shared_task
def compile_report(prices):
    # prices = [{"symbol": "AAPL", "price": 150}, ...]
    report = generate_market_report(prices)
    return report</code></pre>

      <h2>Rate Limiting</h2>

      <pre><code># Limit to 10 calls per minute (external API rate limit)
@shared_task(rate_limit='10/m')
def call_external_api(item_id):
    return api_client.process(item_id)

# Per-worker rate limit
@shared_task(rate_limit='100/h')
def send_sms(phone, message):
    sms_gateway.send(phone, message)

# Rate limiting in settings (global)
CELERY_TASK_DEFAULT_RATE_LIMIT = '100/m'</code></pre>

      <h2>Periodic Tasks with Celery Beat</h2>

      <pre><code># settings.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'cleanup-expired-sessions': {
        'task': 'accounts.tasks.cleanup_sessions',
        'schedule': crontab(hour=3, minute=0),  # Daily at 3 AM
    },
    'send-daily-digest': {
        'task': 'notifications.tasks.send_daily_digest',
        'schedule': crontab(hour=8, minute=0, day_of_week='1-5'),  # Weekdays 8 AM
    },
    'sync-inventory': {
        'task': 'inventory.tasks.sync_from_warehouse',
        'schedule': 300.0,  # Every 5 minutes
    },
}

# Run the beat scheduler:
# celery -A project beat --loglevel=info</code></pre>

      <h2>Monitoring with Flower</h2>

      <pre><code># Install and run
pip install flower
celery -A project flower --port=5555

# Flower dashboard shows:
# - Active/completed/failed task counts
# - Worker status and resource usage
# - Task execution time histograms
# - Real-time task queue depth
# - Individual task details and tracebacks

# Access at http://localhost:5555</code></pre>

      <h2>Production Configuration</h2>

      <pre><code># settings.py - Production-ready config
CELERY_BROKER_URL = 'redis://redis:6379/0'
CELERY_RESULT_BACKEND = 'redis://redis:6379/1'

# Reliability
CELERY_TASK_ACKS_LATE = True             # Acknowledge after execution (not before)
CELERY_WORKER_PREFETCH_MULTIPLIER = 1    # Fetch one task at a time
CELERY_TASK_REJECT_ON_WORKER_LOST = True # Requeue if worker crashes

# Performance
CELERY_WORKER_CONCURRENCY = 4           # Workers per process
CELERY_TASK_COMPRESSION = 'gzip'        # Compress large payloads
CELERY_RESULT_EXPIRES = 3600            # Clean up results after 1 hour

# Safety
CELERY_TASK_TIME_LIMIT = 300            # Hard kill after 5 minutes
CELERY_TASK_SOFT_TIME_LIMIT = 240       # Raise SoftTimeLimitExceeded at 4 min
CELERY_TASK_ALWAYS_EAGER = False        # Never True in production!</code></pre>

      <h2>Common Pitfalls</h2>

      <ul>
        <li><strong>Passing ORM objects to tasks:</strong> Always pass IDs, not model instances. Objects cannot be serialized to JSON, and even if pickled, the data may be stale by the time the task runs.</li>
        <li><strong>TASK_ALWAYS_EAGER in production:</strong> This runs tasks synchronously (no queue). Great for testing, disastrous in production.</li>
        <li><strong>No time limits:</strong> A hung HTTP call inside a task blocks the worker forever. Always set TASK_TIME_LIMIT.</li>
        <li><strong>Ignoring task results:</strong> If you never read results, set <code>ignore_result=True</code> to avoid filling up Redis.</li>
        <li><strong>Database connections exhaustion:</strong> Each worker opens its own DB connection. With 20 workers, that is 20 connections. Use connection pooling (pgbouncer).</li>
        <li><strong>Not handling idempotency:</strong> Tasks can be retried or delivered twice. Design tasks so running them twice produces the same result (use database constraints, check before insert).</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Move anything over 500ms to a background task</strong> &mdash; emails, PDFs, API calls, data processing</li>
        <li><strong>Always pass IDs, not objects</strong> to Celery tasks &mdash; re-fetch from the database inside the task</li>
        <li><strong>Use retries with exponential backoff</strong> for external API calls &mdash; temporary failures are normal</li>
        <li><strong>Chains for sequential workflows, chords for fan-out/fan-in</strong> &mdash; compose complex pipelines from simple tasks</li>
        <li><strong>Set time limits on every task</strong> &mdash; a hung worker is worse than a failed task</li>
        <li><strong>Monitor with Flower</strong> &mdash; you cannot fix what you cannot see</li>
        <li><strong>Design tasks to be idempotent</strong> &mdash; they will be retried, and that must be safe</li>
      </ul>

      <p>Celery transforms your Django app from a synchronous request-response system into an asynchronous workflow engine. The key is starting simple &mdash; one task, one worker, one queue &mdash; and adding complexity (chains, chords, multiple queues) only when your workload demands it.</p>
    `;
