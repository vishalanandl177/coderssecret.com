// Narration scripts for DRF API Logger tutorial — one entry per slide.
// These power both the in-deck SpeechSynthesis voice-over and the speaker-notes panel.
window.NARRATION = [
  // 01 Title
  "Hey there, and welcome! In this tutorial, we're going to look at DRF API Logger — a package that lets your Django REST Framework project automatically capture every single API request and response, with basically zero effort. This is about twelve minutes, and by the end, you'll have it running in your own project.",

  // 02 What is it
  "So what is DRF API Logger? It's a Django middleware you install with pip. Once it's wired up, it silently captures every API call: the URL, the method, the headers, the body, the response, the status code, even the execution time. And because it runs in the background, it adds zero latency to your actual API responses.",

  // 03 Why
  "Why would you want this? Four big reasons. First, production debugging — when something breaks at three in the morning, you can see exactly what the client sent. Second, auditing and compliance. Third, finding your slow endpoints, because execution time is captured for free. And fourth, just understanding how your API actually gets used.",

  // 04 Agenda
  "Here's what we're covering. We'll start with how it works under the hood, then walk through the four-step installation. After that: the two logging modes, the admin dashboard, filtering rules, data masking, performance tuning, request tracing, and finally querying logs programmatically. Let's get into it.",

  // 05 How it works
  "The flow is simple. A request comes in, the middleware grabs a snapshot on the way in and another on the way out. That snapshot goes into an in-memory queue — not to the database, the queue. Then a background worker thread flushes the queue to the database every ten seconds, or whenever it hits fifty buffered items. That batching is why your API response times don't suffer.",

  // 06 Prereq
  "Before we install, quick prerequisites. Python three point six or newer, Django three point two or newer, and DRF three point twelve or newer. And of course, a project that's already using DRF. Since this is a middleware, it works with every kind of view — function-based, class-based, or ViewSets. You don't touch your view code at all.",

  // 07 Install
  "Step one: install the package. It's a standard pip install — no native extensions, no system dependencies, nothing weird. One line and you're ready for the next step.",

  // 08 Add app
  "Step two: add it to your INSTALLED_APPS in settings dot py. This lets Django discover the models and register the admin views. Just drop the string 'drf_api_logger' into the list, wherever your apps live.",

  // 09 Middleware
  "Step three, and this is the important one: add the middleware. This is the piece that actually intercepts requests and responses. Add it toward the bottom of your MIDDLEWARE list. That's the full dotted path you see on screen.",

  // 10 Migrate
  "Step four: run migrations. If you're going to store logs in the database — and most people do — you need to create the logs table. Standard Django migrate command, one operation, done.",

  // 11 Two modes
  "Now, there are two ways to actually consume these logs. Mode A stores them in your database, where you browse them through the Django admin. Mode B fires a Python signal on every request, so you can forward the data to Elasticsearch, Datadog, a Kafka topic, wherever. And these aren't exclusive — you can run both at the same time.",

  // 12 DB mode
  "Let's look at Mode A — database logging. One setting turns on the whole admin experience: a searchable log list, date and status filters, performance charts, and detailed per-request views. You can optionally point logs at a separate database, and mark anything slower than, say, two hundred milliseconds as a slow API.",

  // 13 Dashboard
  "Here's the admin dashboard. This is the overview page — request volume over time. It's useful for spotting traffic spikes, failure spikes, or just seeing how your API gets used during the day.",

  // 14 List
  "This is the log list view. Every row is one API call. You can filter by date, by status code, by HTTP method, or search across the request body, response body, headers, and URL. This is usually the first thing you open when something goes wrong.",

  // 15 Detail
  "Click into any row and you get this — the full detail view. Request headers, request body, response body, client IP, and execution time. This is where the real debugging happens. Anything the API saw, you can see.",

  // 16 Signal
  "Now Mode B — signal-based logging. You define a function, subscribe it to the API_LOGGER_SIGNAL, and it gets called with the log data on every request. This is how you ship logs to Elasticsearch, Datadog, Kafka, S3, a Slack webhook for errors — anywhere that isn't your local database.",

  // 17 Filters
  "You almost never want to log literally everything. These four settings let you filter before logs hit your database. Skip entire Django apps by namespace, skip specific URL names like health checks, only log certain HTTP methods, or only log certain status codes — for example, only errors.",

  // 18 Security
  "Security matters. By default, the logger scrubs common auth fields — password, token, access, refresh, and secret — replacing them with the string 'filtered'. But you should extend this list for your own sensitive data: API keys, social security numbers, card numbers, anything regulatory. If you can't safely store it, mask it.",

  // 19 Performance
  "Performance tuning for production. Four knobs. Queue size controls how many logs buffer before a flush — bigger batches mean fewer database writes. Interval is how often the flush runs. Body size caps truncate enormous payloads so one bad upload doesn't bloat your logs table. And sending logs to a dedicated database keeps write pressure off your main app DB.",

  // 20 Tracing
  "Request tracing. When you enable this, every request gets stamped with a UUID that you can propagate through microservices, background jobs, and external log systems. You can also point it at an existing header — say, X-Trace-ID from your API gateway. Inside your view, the tracing ID is attached to the request object.",

  // 21 Query
  "Because logs are just a Django model, you can query them with the ORM. Want the slowest APIs in the last hour? One filter. Want the most-hit endpoints? Values plus annotate plus count. This is great for building stats dashboards, scheduled reports, or alerting when error rates spike.",

  // 22 Prod
  "Before we wrap up — a production checklist. Use a dedicated database for logs. Make sure added_on is indexed. Archive or delete old logs periodically. Cap request and response body sizes. Mask anything sensitive. And tune the queue for your traffic profile. Do these six things and this package will scale to a surprising amount of traffic.",

  // 23 Recap
  "Quick recap. Setup was four steps: pip install, add to INSTALLED_APPS, add the middleware, migrate. You have two logging modes — database for the admin UI, signal for everywhere else — and you can run both. And you have a full toolbox of configuration: skip rules, data masking, queue tuning, and tracing. The whole thing really does come down to one pip install and one middleware line.",

  // 24 End
  "That's it! The package is on GitHub under vishalanandl177 slash DRF dash API dash Logger, and you can install it right now with pip install drf-api-logger. If this was useful, star the repo. Thanks for watching — now go log some APIs.",
];
