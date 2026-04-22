import { Component, inject } from '@angular/core';
import { SlidePlayerComponent, SlideData } from '../../components/slide-player/slide-player';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-drf-api-logger-slides',
  standalone: true,
  imports: [SlidePlayerComponent],
  template: `
    <app-slide-player [slides]="slides" deckTitle="DRF API Logger" backUrl="/blog/drf-api-logger-django-rest-framework" />
  `,
})
export class DrfApiLoggerSlidesComponent {
  private seo = inject(SeoService);

  slides: SlideData[] = [
    // Slide 1
    {
      type: 'title',
      title: 'DRF API Logger',
      subtitle: 'A hands-on tutorial for Django developers who want to see every request their API serves.',
      tags: ['~12 MIN', 'BEGINNER FRIENDLY', 'DJANGO · DRF'],
      narration: "Hey there, and welcome! In this tutorial, we're going to look at DRF API Logger — a package that lets your Django REST Framework project automatically capture every single API request and response, with basically zero effort.",
    },
    // Slide 2
    {
      type: 'content',
      eyebrow: '01 · Introduction',
      title: 'What is DRF API Logger?',
      body: 'A pip-installable Django middleware that automatically captures every API request and response your DRF project handles.',
      bullets: [
        'Request: URL, method, headers, body, IP',
        'Response: status code, body, execution time',
        'Zero perf impact: background, non-blocking workers',
      ],
      narration: "So what is DRF API Logger? It's a Django middleware you install with pip. Once it's wired up, it silently captures every API call.",
    },
    // Slide 3
    {
      type: 'grid',
      eyebrow: '01 · Introduction',
      title: 'Why log your APIs?',
      items: [
        { title: 'Debug production', desc: 'See exactly what the client sent when something fails at 3am' },
        { title: 'Audit everything', desc: 'Compliance, security reviews, user-activity trails' },
        { title: 'Find slow endpoints', desc: 'Built-in execution_time for spotting bottlenecks' },
        { title: 'Understand usage', desc: 'Which endpoints get hammered? Which nobody touches?' },
      ],
      narration: "Why would you want this? Four big reasons. First, production debugging. Second, auditing and compliance. Third, finding your slow endpoints. And fourth, understanding how your API actually gets used.",
    },
    // Slide 4
    {
      type: 'content',
      eyebrow: '01 · Introduction',
      title: "What you'll learn today",
      bullets: [
        'How it works under the hood',
        'Install & configure in four steps',
        'Database vs signal logging modes',
        'Admin dashboard walkthrough',
        'Filter, skip, and mask sensitive data',
        'Performance tuning for production',
        'Request tracing across services',
        'Querying logs programmatically',
      ],
      narration: "Here's what we're covering. We'll start with how it works under the hood, then walk through the four-step installation.",
    },
    // Slide 5
    {
      type: 'content',
      eyebrow: '01 · Introduction',
      title: 'How it works',
      body: 'A request comes in, the middleware grabs a snapshot on the way in and another on the way out. That snapshot goes into an in-memory queue — not to the database. Then a background worker thread flushes the queue to the database every 10 seconds, or whenever it hits 50 buffered items.',
      bullets: [
        'Middleware reads request, view runs, response serialized',
        'Snapshot pushed to in-memory queue',
        'Worker thread flushes to DB every 10s or 50 items',
      ],
      narration: "The flow is simple. A request comes in, the middleware grabs a snapshot. That snapshot goes into an in-memory queue. Then a background worker thread flushes the queue to the database.",
    },
    // Slide 6
    {
      type: 'content',
      eyebrow: '02 · Setup',
      title: 'Prerequisites',
      bullets: [
        'Python 3.6+',
        'Django 3.2+',
        'DRF 3.12+',
        'A project that already uses DRF',
      ],
      body: "This is a middleware, so it works with any view — function-based, class-based, or ViewSets. You don't touch your view code at all.",
      narration: "Before we install, quick prerequisites. Python three point six or newer, Django three point two or newer, and DRF three point twelve or newer.",
    },
    // Slide 7
    {
      type: 'code',
      eyebrow: '02 · Setup · Step 1 of 4',
      title: 'Install the package',
      body: 'Standard pip install — no system dependencies, no native extensions.',
      code: '$ pip install drf-api-logger\n\nCollecting drf-api-logger\n  Downloading drf_api_logger-1.1.21-py3-none-any.whl\nInstalling collected packages: drf-api-logger\nSuccessfully installed drf-api-logger-1.1.21',
      lang: 'terminal',
      narration: "Step one: install the package. It's a standard pip install — one line and you're ready.",
    },
    // Slide 8
    {
      type: 'code',
      eyebrow: '02 · Setup · Step 2 of 4',
      title: 'Register the app',
      body: 'Add drf_api_logger to INSTALLED_APPS so Django sees its models and admin.',
      code: "INSTALLED_APPS = [\n    'django.contrib.admin',\n    'django.contrib.auth',\n    'rest_framework',\n    # ... your other apps\n    'drf_api_logger',  # add this\n]",
      lang: 'settings.py',
      narration: "Step two: add it to your INSTALLED_APPS in settings dot py.",
    },
    // Slide 9
    {
      type: 'code',
      eyebrow: '02 · Setup · Step 3 of 4',
      title: 'Add the middleware',
      body: 'This is the piece that actually intercepts requests and responses. Add it toward the bottom of your MIDDLEWARE list.',
      code: "MIDDLEWARE = [\n    'django.middleware.security.SecurityMiddleware',\n    'django.contrib.sessions.middleware.SessionMiddleware',\n    # ... other middleware\n    'drf_api_logger.middleware.api_logger_middleware.APILoggerMiddleware',\n]",
      lang: 'settings.py',
      narration: "Step three: add the middleware. This is the important one.",
    },
    // Slide 10
    {
      type: 'code',
      eyebrow: '02 · Setup · Step 4 of 4',
      title: 'Run migrations',
      body: 'Create the logs table with a standard Django migrate command.',
      code: '$ python manage.py migrate\n\nOperations to perform:\n  Apply all migrations: drf_api_logger\nRunning migrations:\n  Applying drf_api_logger.0001_initial... OK',
      lang: 'terminal',
      narration: "Step four: run migrations. Standard Django migrate command, one operation, done.",
    },
    // Slide 11
    {
      type: 'grid',
      eyebrow: '03 · Logging modes',
      title: 'Two ways to consume logs',
      body: 'You can use one, the other, or both at once.',
      items: [
        { title: 'Mode A: Database', desc: 'Logs persist to your DB. Browse them in Django admin with charts, search, and filters. Set DRF_API_LOGGER_DATABASE = True' },
        { title: 'Mode B: Signal', desc: 'A Python signal fires on every request. Forward logs anywhere: ELK, Datadog, Kafka, a flat file. Set DRF_API_LOGGER_SIGNAL = True' },
      ],
      narration: "There are two ways to consume these logs. Mode A stores them in your database. Mode B fires a Python signal on every request.",
    },
    // Slide 12
    {
      type: 'code',
      eyebrow: '03 · Logging modes · Mode A',
      title: 'Database logging',
      body: 'One setting turns on the whole admin experience.',
      code: "# enable DB storage\nDRF_API_LOGGER_DATABASE = True\n\n# optional: send to a dedicated logs DB\nDRF_API_LOGGER_DEFAULT_DATABASE = 'logs_db'\n\n# optional: mark anything >200ms as slow\nDRF_API_LOGGER_SLOW_API_ABOVE = 200",
      lang: 'settings.py',
      narration: "Let's look at Mode A — database logging. One setting turns on the whole admin experience.",
    },
    // Slide 13
    {
      type: 'image',
      eyebrow: '03 · Admin dashboard',
      title: 'Analytics overview',
      caption: 'The admin homepage shows request volume over time — spot trends, traffic spikes, and failure patterns at a glance.',
      src: '/images/slides/drf-api-logger/graph.png',
      narration: "Here's the admin dashboard. This is the overview page — request volume over time.",
    },
    // Slide 14
    {
      type: 'image',
      eyebrow: '03 · Admin dashboard',
      title: 'Log list view',
      caption: 'Every row is one API call. Filter by date, status code, method, or search across body, headers, and URL.',
      src: '/images/slides/drf-api-logger/lists.png',
      narration: "This is the log list view. Every row is one API call.",
    },
    // Slide 15
    {
      type: 'image',
      eyebrow: '03 · Admin dashboard',
      title: 'Log detail view',
      caption: 'Full request detail — headers, body, response, client IP, and execution time.',
      src: '/images/slides/drf-api-logger/details.png',
      narration: "Click into any row and you get the full detail view.",
    },
    // Slide 16
    {
      type: 'code',
      eyebrow: '03 · Logging modes · Mode B',
      title: 'Signal-based logging',
      body: 'Subscribe a function, get every API call pushed to it. Perfect for shipping logs off-site.',
      code: "from drf_api_logger import API_LOGGER_SIGNAL\n\ndef ship_to_elk(**kwargs):\n    elk.send({\n        'url': kwargs['api'],\n        'method': kwargs['method'],\n        'status': kwargs['status_code'],\n        'took_ms': kwargs['execution_time'],\n    })\n\nAPI_LOGGER_SIGNAL.listen += ship_to_elk",
      lang: 'signals.py',
      narration: "Now Mode B — signal-based logging. You define a function and subscribe it.",
    },
    // Slide 17
    {
      type: 'code',
      eyebrow: '04 · Configuration',
      title: 'Filtering and skip rules',
      body: 'You almost never want to log literally everything. Drop noise before it hits your database.',
      code: "# skip entire Django apps\nDRF_API_LOGGER_SKIP_NAMESPACE = ['admin', 'internal']\n\n# skip specific URL names\nDRF_API_LOGGER_SKIP_URL_NAME = ['health-check', 'metrics']\n\n# only these HTTP methods\nDRF_API_LOGGER_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']\n\n# only these status codes\nDRF_API_LOGGER_STATUS_CODES = [400, 401, 403, 404, 500]",
      lang: 'settings.py',
      narration: "You almost never want to log literally everything. These four settings let you filter before logs hit your database.",
    },
    // Slide 18
    {
      type: 'code',
      eyebrow: '05 · Security',
      title: 'Masking sensitive data',
      body: 'The logger scrubs common auth fields by default. Extend the list for your own sensitive data.',
      code: "DRF_API_LOGGER_EXCLUDE_KEYS = [\n    'password', 'token', 'secret',\n    'api_key', 'ssn', 'card_number',\n]\n\n# Result: {\"password\": \"***FILTERED***\"}",
      lang: 'settings.py',
      narration: "Security matters. By default, the logger scrubs common auth fields. But extend the list for your own sensitive data.",
    },
    // Slide 19
    {
      type: 'code',
      eyebrow: '06 · Production',
      title: 'Performance tuning',
      body: 'Four knobs for production: queue size, interval, body caps, and dedicated database.',
      code: "# bigger batches for high-traffic apps\nDRF_LOGGER_QUEUE_MAX_SIZE = 100\n\n# flush every 5 seconds\nDRF_LOGGER_INTERVAL = 5\n\n# cap log row size\nDRF_API_LOGGER_MAX_REQUEST_BODY_SIZE = 1024\nDRF_API_LOGGER_MAX_RESPONSE_BODY_SIZE = 2048\n\n# isolate writes on a dedicated DB\nDRF_API_LOGGER_DEFAULT_DATABASE = 'logs_db'",
      lang: 'settings.py',
      narration: "Performance tuning for production. Four knobs. Queue size, interval, body size caps, and dedicated database.",
    },
    // Slide 20
    {
      type: 'code',
      eyebrow: '07 · Advanced',
      title: 'Request tracing',
      body: 'Stamp every request with a UUID — follow it through microservices, background jobs, and log aggregators.',
      code: "# in settings.py\nDRF_API_LOGGER_ENABLE_TRACING = True\nDRF_API_LOGGER_TRACING_ID_HEADER_NAME = 'X-Trace-ID'\n\n# in your view\ndef my_view(request):\n    if hasattr(request, 'tracing_id'):\n        logger.info(f\"processing {request.tracing_id}\")\n    return Response({'ok': True})",
      lang: 'python',
      narration: "When you enable tracing, every request gets stamped with a UUID that you can propagate through microservices.",
    },
    // Slide 21
    {
      type: 'code',
      eyebrow: '07 · Advanced',
      title: 'Querying logs in code',
      body: 'Logs are a Django model. Any ORM query works — stats dashboards, Slack alerts, scheduled reports.',
      code: "from drf_api_logger.models import APILogsModel\n\n# slowest APIs in the last hour\nslow = APILogsModel.objects.filter(\n    execution_time__gt=1.0,\n    added_on__gte=timezone.now() - timedelta(hours=1)\n).order_by('-execution_time')\n\n# most-hit endpoints\npopular = APILogsModel.objects.values('api').annotate(\n    count=Count('id')\n).order_by('-count')[:10]",
      lang: 'python',
      narration: "Because logs are just a Django model, you can query them with the ORM.",
    },
    // Slide 22
    {
      type: 'grid',
      eyebrow: '06 · Production',
      title: 'Production checklist',
      items: [
        { title: 'Dedicated DB', desc: 'Keep log writes off your main database.' },
        { title: 'Index added_on', desc: 'Every query filters by time. Make it cheap.' },
        { title: 'Archive old data', desc: 'Delete or move logs older than 30–90 days.' },
        { title: 'Cap body sizes', desc: 'Stop one giant upload from filling your disk.' },
        { title: 'Mask sensitive data', desc: "Auth, PII, card numbers — don't log what you can't store." },
        { title: 'Tune the queue', desc: 'Higher queue size + interval for less DB pressure.' },
      ],
      narration: "Before we wrap up — a production checklist.",
    },
    // Slide 23
    {
      type: 'grid',
      eyebrow: 'Recap',
      title: 'What we covered',
      items: [
        { title: 'Setup', desc: 'pip install, INSTALLED_APPS, middleware, migrate' },
        { title: 'Modes', desc: 'DB for admin UI, Signal for anywhere, both simultaneously' },
        { title: 'Config', desc: 'Skip rules, data masking, queue tuning, tracing' },
      ],
      body: 'The whole thing boils down to one pip install + one middleware line. Everything else is configuration you add as you need it.',
      narration: "Quick recap. Setup was four steps. You have two logging modes. And a full toolbox of configuration.",
    },
    // Slide 24
    {
      type: 'end',
      title: 'Go log some APIs.',
      subtitle: 'Thanks for watching. The package is on GitHub — star the repo if it helped.',
      links: [
        { label: 'GITHUB', value: 'github.com/vishalanandl177/DRF-API-Logger' },
        { label: 'INSTALL', value: '$ pip install drf-api-logger' },
      ],
      narration: "That's it! The package is on GitHub. Thanks for watching — now go log some APIs.",
    },
  ];

  constructor() {
    this.seo.update({
      title: 'DRF API Logger Tutorial — Interactive Slides with Narration',
      description: 'Learn DRF API Logger through 24 interactive slides with voice narration. Covers installation, database logging, signal mode, admin dashboard, filtering, security masking, and production tuning.',
      url: '/slides/drf-api-logger',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'DRF API Logger', url: '/blog/drf-api-logger-django-rest-framework' },
        { name: 'Slides', url: '/slides/drf-api-logger' },
      ],
    });
  }
}
