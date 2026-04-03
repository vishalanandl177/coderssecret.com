export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '4',
    title: 'DRF API Logger: Effortless API Logging for Django REST Framework',
    slug: 'drf-api-logger-django-rest-framework',
    excerpt: 'Discover how DRF API Logger makes it dead simple to capture, monitor, and analyze every API call in your Django REST Framework application — with zero impact on response times.',
    content: `
      <p>If you've ever found yourself digging through server logs trying to figure out why an API call failed, or wishing you had a dashboard showing your API's health at a glance, <strong>DRF API Logger</strong> is the tool you've been looking for. It's an open-source Django package that automatically logs every API request and response in your Django REST Framework project — with minimal setup and zero performance overhead.</p>

      <h2>What is DRF API Logger?</h2>
      <p>DRF API Logger is a middleware-based logging solution for Django REST Framework. Once installed, it silently captures detailed information about every API call — the URL, HTTP method, request headers, request body, response status code, response body, execution time, and client IP address. All of this happens in the background using a non-blocking queue, so your API response times remain completely unaffected.</p>
      <p>The project has earned <strong>335+ stars</strong> on GitHub and is actively maintained under the <strong>Apache 2.0 license</strong>. It supports Python 3.6+, Django 3.2+, and DRF 3.12+.</p>

      <h2>Getting Started in 3 Steps</h2>
      <p>Setting up DRF API Logger couldn't be simpler:</p>
      <p><strong>Step 1:</strong> Install the package:</p>
      <pre><code>pip install drf-api-logger</code></pre>

      <p><strong>Step 2:</strong> Add it to your Django settings:</p>
      <pre><code>INSTALLED_APPS = [
    ...
    'drf_api_logger',
]

MIDDLEWARE = [
    ...
    'drf_api_logger.middleware.api_logger_middleware.APILoggerMiddleware',
]</code></pre>

      <p><strong>Step 3:</strong> Enable database logging and run migrations:</p>
      <pre><code>DRF_API_LOGGER_DATABASE = True</code></pre>
      <pre><code>python manage.py migrate</code></pre>
      <p>That's it. Every API call is now being logged automatically.</p>

      <h2>Two Ways to Log: Database &amp; Signals</h2>
      <p>DRF API Logger gives you two powerful logging mechanisms that can be used independently or together:</p>
      <p><strong>Database Logging</strong> stores every API call in your Django database. It comes with a beautiful admin dashboard featuring charts, analytics, advanced search across request/response data, and filtering by date, status code, HTTP method, and performance metrics. This is perfect for debugging, auditing, and monitoring.</p>
      <p><strong>Signal-Based Logging</strong> fires a custom Django signal for every API call, letting you build custom handlers. Want to send logs to Elasticsearch? Push slow API alerts to Slack? Write to a custom file format? Signals make it possible without touching the core library.</p>

      <h2>Powerful Configuration Options</h2>
      <p>DRF API Logger is highly configurable. Here are some of the most useful settings:</p>
      <ul>
        <li><strong>Sensitive Data Masking:</strong> Automatically masks fields like passwords, tokens, and secrets in your logs — no sensitive data leaks.</li>
        <li><strong>Selective Logging:</strong> Filter which APIs get logged by namespace, URL name, HTTP method, or response status code.</li>
        <li><strong>Slow API Detection:</strong> Set a threshold (e.g., 200ms) and the logger will flag any API call that exceeds it — great for performance monitoring.</li>
        <li><strong>Request Tracing:</strong> Automatically generates or extracts trace UUIDs for distributed tracing across microservices.</li>
        <li><strong>Response Size Limits:</strong> Cap the size of logged response bodies to keep your database lean.</li>
        <li><strong>Queue Tuning:</strong> Configure the background queue size and flush interval to match your traffic patterns.</li>
      </ul>

      <h2>Querying Logs Programmatically</h2>
      <p>When database logging is enabled, you can query your API logs using Django's ORM just like any other model:</p>
      <pre><code>from drf_api_logger.models import APILogsModel

# Find all failed API calls in the last 24 hours
from django.utils import timezone
from datetime import timedelta

recent_errors = APILogsModel.objects.filter(
    status_code__gte=400,
    added_on__gte=timezone.now() - timedelta(hours=24)
)

# Find the slowest endpoints
slow_apis = APILogsModel.objects.filter(
    execution_time__gte=200
).order_by('-execution_time')[:10]

# Count calls by HTTP method
from django.db.models import Count
method_stats = APILogsModel.objects.values('method').annotate(
    count=Count('id')
)</code></pre>

      <h2>Production Best Practices</h2>
      <p>For high-traffic production environments, the DRF API Logger documentation recommends several optimizations:</p>
      <ul>
        <li><strong>Dedicated Logging Database:</strong> Route API logs to a separate database to avoid impacting your main application's performance.</li>
        <li><strong>Database Indexes:</strong> Add indexes on frequently queried fields like <code>status_code</code>, <code>method</code>, and <code>added_on</code>.</li>
        <li><strong>Data Archival:</strong> Implement a strategy to archive or purge old logs — your database will thank you.</li>
        <li><strong>Queue Optimization:</strong> Tune the queue size and interval based on your traffic volume to balance memory usage and write frequency.</li>
      </ul>

      <h2>Why You Should Use It</h2>
      <p>Whether you're debugging a tricky API issue in development, monitoring production health, or building an audit trail for compliance, DRF API Logger has you covered. It's lightweight, non-intrusive, and incredibly easy to set up. The combination of database logging with a built-in admin dashboard and signal-based extensibility makes it one of the most complete API logging solutions in the Django ecosystem.</p>
      <p>Check out the project on <a href="https://github.com/vishalanandl177/DRF-API-Logger" target="_blank" rel="noopener noreferrer">GitHub</a> and give it a star if you find it useful!</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-03',
    readTime: '8 min read',
    tags: ['Django', 'Python', 'DRF', 'API Logging', 'Open Source'],
    coverImage: '',
  },
  {
    id: '1',
    title: 'Getting Started with Angular and Spartan UI',
    slug: 'getting-started-angular-spartan-ui',
    excerpt: 'Learn how to set up a modern Angular project with Spartan UI, the shadcn/ui-inspired component library for Angular.',
    content: `
      <p>Spartan UI brings the popular shadcn/ui approach to Angular. Instead of installing a traditional component library, you get unstyled, accessible primitives that you style with Tailwind CSS.</p>
      <h2>Why Spartan UI?</h2>
      <p>Traditional component libraries come with opinionated styles that are hard to customize. Spartan UI takes a different approach — it provides headless components (called "brain") that handle all the accessibility and behavior, while you control the styling through Tailwind CSS classes (called "helm").</p>
      <h2>Setting Up</h2>
      <p>First, create a new Angular project and install the required packages. You'll need <code>@spartan-ng/brain</code> for the headless primitives and Tailwind CSS for styling.</p>
      <p>The beauty of this approach is that every component is fully customizable. You own the code, you own the styles, and you can modify anything without fighting against a library's design decisions.</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-01',
    readTime: '5 min read',
    tags: ['Angular', 'Spartan UI', 'Tutorial'],
    coverImage: '',
  },
  {
    id: '2',
    title: 'Tailwind CSS v4: What\'s New for Angular Developers',
    slug: 'tailwind-css-v4-angular',
    excerpt: 'Explore the latest features in Tailwind CSS v4 and how they improve the Angular development experience.',
    content: `
      <p>Tailwind CSS v4 introduces a brand-new engine built from the ground up with performance and developer experience in mind.</p>
      <h2>CSS-First Configuration</h2>
      <p>Gone is the <code>tailwind.config.js</code> file. In v4, everything is configured directly in CSS using <code>@theme</code> directives. This means faster builds and a more intuitive setup.</p>
      <h2>Automatic Content Detection</h2>
      <p>Tailwind v4 automatically detects your content files — no more configuring content paths manually. It just works.</p>
      <h2>New @theme Directive</h2>
      <p>The new <code>@theme</code> directive replaces the old config file approach, allowing you to define your design tokens right in CSS where they belong.</p>
    `,
    author: 'Coder Secret',
    date: '2026-03-28',
    readTime: '4 min read',
    tags: ['Tailwind CSS', 'Angular', 'CSS'],
    coverImage: '',
  },
  {
    id: '3',
    title: 'Building Accessible Components in Angular',
    slug: 'accessible-components-angular',
    excerpt: 'A deep dive into creating fully accessible UI components using Angular and the WAI-ARIA specification.',
    content: `
      <p>Web accessibility is not optional — it's a fundamental requirement for building inclusive web applications. In this post, we'll explore how to build accessible components in Angular.</p>
      <h2>Understanding ARIA</h2>
      <p>WAI-ARIA (Web Accessibility Initiative – Accessible Rich Internet Applications) provides attributes that define ways to make web content more accessible to people with disabilities.</p>
      <h2>Keyboard Navigation</h2>
      <p>Every interactive element must be keyboard accessible. This means proper focus management, keyboard shortcuts, and logical tab order throughout your application.</p>
      <h2>Using Spartan Brain</h2>
      <p>Spartan UI's brain primitives handle accessibility out of the box. They manage ARIA attributes, keyboard interactions, and focus trapping so you don't have to implement these patterns manually.</p>
    `,
    author: 'Coder Secret',
    date: '2026-03-25',
    readTime: '6 min read',
    tags: ['Accessibility', 'Angular', 'Best Practices'],
    coverImage: '',
  },
];
