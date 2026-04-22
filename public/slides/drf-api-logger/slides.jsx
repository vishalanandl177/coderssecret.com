/* global React */
const { useState, useEffect, useRef } = React;

// ==========================================================================
// Design tokens — dark IDE/terminal aesthetic
// ==========================================================================
const TYPE_SCALE = { display: 120, title: 64, subtitle: 44, body: 34, small: 28, mono: 26 };
const SPACING = { paddingTop: 100, paddingBottom: 80, paddingX: 100, titleGap: 52, itemGap: 28 };

const C = {
  bg: '#0a0a0a',
  bgAlt: '#111111',
  panel: '#151515',
  panelBorder: '#262626',
  fg: '#fafafa',
  muted: '#a3a3a3',
  dim: '#525252',
  line: '#262626',
  accent: '#7dd3fc',       // sky-300
  accentDim: 'rgba(125, 211, 252, 0.12)',
  green: '#86efac',        // green-300
  amber: '#fcd34d',        // amber-300
  red: '#fca5a5',          // red-300
  magenta: '#f0abfc',      // fuchsia-300
};

const FONT_SANS = "'Inter Tight', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, 'SF Mono', Menlo, monospace";

// ==========================================================================
// Reusable primitives
// ==========================================================================

const Slide = ({ children, bg = C.bg, style = {} }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: bg,
    color: C.fg,
    fontFamily: FONT_SANS,
    display: 'flex', flexDirection: 'column',
    padding: `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px`,
    boxSizing: 'border-box',
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

const Eyebrow = ({ children, color = C.accent }) => (
  <div style={{
    fontFamily: FONT_MONO,
    fontSize: TYPE_SCALE.small,
    color,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: 32,
    display: 'flex', alignItems: 'center', gap: 16,
  }}>
    <span style={{ display: 'inline-block', width: 12, height: 12, background: color, borderRadius: 2 }} />
    {children}
  </div>
);

const Title = ({ children, size = TYPE_SCALE.title, style = {} }) => (
  <h1 style={{
    fontFamily: FONT_SANS,
    fontSize: size,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.05,
    margin: 0,
    color: C.fg,
    textWrap: 'pretty',
    ...style,
  }}>{children}</h1>
);

const Subtitle = ({ children, style = {} }) => (
  <div style={{
    fontSize: TYPE_SCALE.subtitle,
    fontWeight: 400,
    lineHeight: 1.3,
    color: C.muted,
    textWrap: 'pretty',
    ...style,
  }}>{children}</div>
);

const Body = ({ children, style = {} }) => (
  <div style={{
    fontSize: TYPE_SCALE.body,
    fontWeight: 400,
    lineHeight: 1.45,
    color: C.fg,
    textWrap: 'pretty',
    ...style,
  }}>{children}</div>
);

// Terminal-styled code block with traffic-light chrome
const Code = ({ title, lang = 'python', children, style = {} }) => (
  <div style={{
    background: '#0d1117',
    border: `1px solid ${C.panelBorder}`,
    borderRadius: 10,
    overflow: 'hidden',
    fontFamily: FONT_MONO,
    ...style,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '16px 22px',
      background: '#161b22',
      borderBottom: `1px solid ${C.panelBorder}`,
    }}>
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f57' }} />
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#febc2e' }} />
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#28c840' }} />
      <div style={{ flex: 1 }} />
      <span style={{ color: C.dim, fontSize: 20, letterSpacing: '0.08em' }}>{title || lang}</span>
    </div>
    <pre style={{
      margin: 0,
      padding: '28px 32px',
      fontSize: TYPE_SCALE.mono,
      lineHeight: 1.55,
      color: C.fg,
      whiteSpace: 'pre',
      overflow: 'hidden',
    }}>{children}</pre>
  </div>
);

// Simple syntax tokens
const K = ({ children }) => <span style={{ color: '#f0abfc' }}>{children}</span>;       // keyword
const S = ({ children }) => <span style={{ color: '#86efac' }}>{children}</span>;       // string
const N = ({ children }) => <span style={{ color: '#fcd34d' }}>{children}</span>;       // number/constant
const Cm = ({ children }) => <span style={{ color: C.dim, fontStyle: 'italic' }}>{children}</span>; // comment
const Fn = ({ children }) => <span style={{ color: '#7dd3fc' }}>{children}</span>;      // function
const V = ({ children }) => <span style={{ color: '#fda4af' }}>{children}</span>;       // variable

const Pill = ({ children, color = C.accent, style = {} }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '8px 16px',
    border: `1px solid ${color}`,
    color,
    borderRadius: 999,
    fontFamily: FONT_MONO,
    fontSize: 22,
    letterSpacing: '0.04em',
    ...style,
  }}>{children}</span>
);

const Footer = ({ idx, total }) => {
  if (window.__TWEAKS && window.__TWEAKS.hideFooter) return null;
  return (
    <div style={{
      position: 'absolute',
      left: SPACING.paddingX, right: SPACING.paddingX, bottom: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: FONT_MONO, fontSize: 20, color: C.dim, letterSpacing: '0.08em',
    }}>
      <span>DRF-API-LOGGER · TUTORIAL</span>
      {!window.__TWEAKS?.hidePageNumber && (
        <span>{String(idx).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      )}
    </div>
  );
};

// ==========================================================================
// Slides
// ==========================================================================

const S01_Title = () => (
  <Slide bg={C.bg}>
    <div style={{ position: 'absolute', inset: 0, background:
      'radial-gradient(circle at 30% 40%, rgba(125,211,252,0.12) 0%, transparent 50%)' }} />
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: TYPE_SCALE.small, color: C.accent, letterSpacing: '0.3em', marginBottom: 40 }}>
        $ ./tutorial --start
      </div>
      <Title size={TYPE_SCALE.display} style={{ marginBottom: 32 }}>
        DRF API Logger
      </Title>
      <div style={{ fontSize: TYPE_SCALE.subtitle, color: C.muted, maxWidth: 1300 }}>
        A hands-on tutorial for Django developers who want to see every request their API serves.
      </div>
      <div style={{ marginTop: 80, display: 'flex', gap: 20 }}>
        <Pill color={C.accent}>~12 MIN</Pill>
        <Pill color={C.green}>BEGINNER FRIENDLY</Pill>
        <Pill color={C.amber}>DJANGO · DRF</Pill>
      </div>
    </div>
    <Footer idx={1} total={24} />
  </Slide>
);

const S02_WhatIs = () => (
  <Slide>
    <Eyebrow>01 · Introduction</Eyebrow>
    <Title>What is DRF API Logger?</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
      <div>
        <Subtitle style={{ marginBottom: 32 }}>
          A pip-installable Django middleware that automatically captures every API request and response your DRF project handles.
        </Subtitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.itemGap }}>
          {[
            ['Request', 'URL · method · headers · body · IP'],
            ['Response', 'status code · body · execution time'],
            ['Zero perf impact', 'background, non-blocking workers'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: TYPE_SCALE.small, color: C.accent, width: 260 }}>{k}</div>
              <div style={{ fontSize: TYPE_SCALE.body, color: C.fg }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <Code title="terminal">
<Cm>{`# it's this easy`}</Cm>{'\n'}<span style={{ color: C.accent }}>$</span> pip install drf-api-logger{'\n\n'}<Cm>{`# then flip a setting:`}</Cm>{'\n'}<V>DRF_API_LOGGER_DATABASE</V> = <K>True</K>{'\n\n'}<Cm>{`# every API call is now logged.`}</Cm>
      </Code>
    </div>
    <Footer idx={2} total={24} />
  </Slide>
);

const S03_Why = () => (
  <Slide>
    <Eyebrow>01 · Introduction</Eyebrow>
    <Title>Why log your APIs?</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}>
      {[
        { n: '01', t: 'Debug production', d: "Someone's request failed at 3am. Now you can see exactly what they sent and what you returned." },
        { n: '02', t: 'Audit everything', d: 'Compliance, security reviews, user-activity trails — all answered by "show me the logs."' },
        { n: '03', t: 'Find slow endpoints', d: 'Built-in execution_time lets you spot bottlenecks without a separate APM tool.' },
        { n: '04', t: 'Understand usage', d: 'Which endpoints get hammered? Which ones nobody touches? The data is right there.' },
      ].map(({ n, t, d }) => (
        <div key={n} style={{ padding: 36, background: C.bgAlt, border: `1px solid ${C.panelBorder}`, borderRadius: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: C.accent, marginBottom: 16 }}>{n}</div>
          <div style={{ fontSize: 36, fontWeight: 600, marginBottom: 12, color: C.fg }}>{t}</div>
          <div style={{ fontSize: 26, color: C.muted, lineHeight: 1.45 }}>{d}</div>
        </div>
      ))}
    </div>
    <Footer idx={3} total={24} />
  </Slide>
);

const S04_Agenda = () => (
  <Slide>
    <Eyebrow>01 · Introduction</Eyebrow>
    <Title>What you'll learn today</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 80px' }}>
      {[
        'How it works under the hood',
        'Install & configure in four steps',
        'Database vs signal logging modes',
        'Admin dashboard walkthrough',
        'Filter, skip, and mask sensitive data',
        'Performance tuning for production',
        'Request tracing across services',
        'Querying logs programmatically',
      ].map((t, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '20px 0', borderBottom: `1px solid ${C.line}` }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 28, color: C.accent, width: 60 }}>0{i + 1}</div>
          <div style={{ fontSize: TYPE_SCALE.body, color: C.fg }}>{t}</div>
        </div>
      ))}
    </div>
    <Footer idx={4} total={24} />
  </Slide>
);

const S05_HowItWorks = () => (
  <Slide>
    <Eyebrow>01 · Introduction</Eyebrow>
    <Title>How it works</Title>
    <div style={{ marginTop: SPACING.titleGap + 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
      {[
        { t: 'Client', d: 'HTTP request', c: C.muted },
        { t: 'Middleware', d: 'Captures in/out', c: C.accent, highlight: true },
        { t: 'View', d: 'Your DRF code', c: C.muted },
        { t: 'Queue', d: 'In-memory buffer', c: C.accent, highlight: true },
        { t: 'Database', d: 'Bulk insert', c: C.green },
      ].map((s, i, arr) => (
        <React.Fragment key={i}>
          <div style={{
            flex: 1,
            padding: '36px 24px',
            textAlign: 'center',
            background: s.highlight ? C.accentDim : C.bgAlt,
            border: `1px solid ${s.highlight ? C.accent : C.panelBorder}`,
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 32, fontWeight: 600, color: s.c, marginBottom: 8 }}>{s.t}</div>
            <div style={{ fontSize: 22, color: C.muted, fontFamily: FONT_MONO }}>{s.d}</div>
          </div>
          {i < arr.length - 1 && (
            <div style={{ fontSize: 40, color: C.dim, flexShrink: 0 }}>→</div>
          )}
        </React.Fragment>
      ))}
    </div>
    <div style={{ marginTop: 80, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      <div style={{ padding: 32, background: C.bgAlt, borderRadius: 12, border: `1px solid ${C.panelBorder}` }}>
        <div style={{ color: C.accent, fontFamily: FONT_MONO, fontSize: 22, marginBottom: 12 }}>WHAT HAPPENS INLINE</div>
        <div style={{ fontSize: 28, color: C.fg, lineHeight: 1.4 }}>
          Middleware reads request, your view runs, response is serialized. A snapshot is pushed to an in-memory queue.
        </div>
      </div>
      <div style={{ padding: 32, background: C.bgAlt, borderRadius: 12, border: `1px solid ${C.panelBorder}` }}>
        <div style={{ color: C.green, fontFamily: FONT_MONO, fontSize: 22, marginBottom: 12 }}>WHAT HAPPENS IN BACKGROUND</div>
        <div style={{ fontSize: 28, color: C.fg, lineHeight: 1.4 }}>
          A worker thread flushes the queue to the database every 10 seconds — or when it hits 50 items.
        </div>
      </div>
    </div>
    <Footer idx={5} total={24} />
  </Slide>
);

const S06_Prereq = () => (
  <Slide>
    <Eyebrow>02 · Setup</Eyebrow>
    <Title>Prerequisites</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          ['Python', '3.6+', C.accent],
          ['Django', '3.2+', C.green],
          ['DRF', '3.12+', C.amber],
          ['A project', 'that already uses DRF', C.magenta],
        ].map(([k, v, c]) => (
          <div key={k} style={{
            display: 'flex', alignItems: 'baseline', gap: 32,
            padding: '24px 32px',
            background: C.bgAlt,
            border: `1px solid ${C.panelBorder}`,
            borderLeft: `3px solid ${c}`,
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 36, fontWeight: 600, color: C.fg, width: 220 }}>{k}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 28, color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: C.dim, marginBottom: 20, letterSpacing: '0.1em' }}>A NOTE BEFORE WE START</div>
        <Body style={{ color: C.muted, fontSize: 32 }}>
          This package is a <span style={{ color: C.accent }}>middleware</span>, so it works on <em>any</em> view — function-based, class-based, or DRF ViewSets. You don't need to touch your views at all.
        </Body>
      </div>
    </div>
    <Footer idx={6} total={24} />
  </Slide>
);

const S07_Install = () => (
  <Slide>
    <Eyebrow>02 · Setup · Step 1 of 4</Eyebrow>
    <Title>Install the package</Title>
    <div style={{ marginTop: SPACING.titleGap + 20, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }}>
      <Subtitle>
        Standard pip install — no system dependencies, no native extensions, nothing weird.
      </Subtitle>
      <Code title="terminal">
<span style={{ color: C.accent }}>$</span> pip install drf-api-logger{'\n\n'}<Cm>Collecting drf-api-logger</Cm>{'\n'}<Cm>  Downloading drf_api_logger-1.1.21-py3-none-any.whl</Cm>{'\n'}<Cm>Installing collected packages: drf-api-logger</Cm>{'\n'}<span style={{ color: C.green }}>Successfully installed drf-api-logger-1.1.21</span>
      </Code>
    </div>
    <Footer idx={7} total={24} />
  </Slide>
);

const S08_AddApp = () => (
  <Slide>
    <Eyebrow>02 · Setup · Step 2 of 4</Eyebrow>
    <Title>Register the app</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 60, alignItems: 'center' }}>
      <Subtitle>
        Add <code style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 36 }}>drf_api_logger</code> to <code style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 36 }}>INSTALLED_APPS</code> so Django sees its models and admin.
      </Subtitle>
      <Code title="settings.py">
<V>INSTALLED_APPS</V> = [{'\n'}    <S>'django.contrib.admin'</S>,{'\n'}    <S>'django.contrib.auth'</S>,{'\n'}    <S>'rest_framework'</S>,{'\n'}    <Cm># ... your other apps</Cm>{'\n'}    <span style={{ background: C.accentDim, padding: '2px 6px', borderRadius: 3 }}><S>'drf_api_logger'</S></span>,  <Cm># 👈 add this</Cm>{'\n'}]
      </Code>
    </div>
    <Footer idx={8} total={24} />
  </Slide>
);

const S09_Middleware = () => (
  <Slide>
    <Eyebrow>02 · Setup · Step 3 of 4</Eyebrow>
    <Title>Add the middleware</Title>
    <Subtitle style={{ marginTop: 24, marginBottom: 36, maxWidth: 1500 }}>
      This is the piece that actually intercepts requests and responses. Add it to the bottom of your middleware stack.
    </Subtitle>
    <Code title="settings.py">
<V>MIDDLEWARE</V> = [{'\n'}    <S>'django.middleware.security.SecurityMiddleware'</S>,{'\n'}    <S>'django.contrib.sessions.middleware.SessionMiddleware'</S>,{'\n'}    <Cm># ... other middleware</Cm>{'\n'}    <span style={{ background: C.accentDim, padding: '2px 6px', borderRadius: 3 }}><S>'drf_api_logger.middleware.api_logger_middleware.APILoggerMiddleware'</S></span>,{'\n'}]
    </Code>
    <Footer idx={9} total={24} />
  </Slide>
);

const S10_Migrate = () => (
  <Slide>
    <Eyebrow>02 · Setup · Step 4 of 4</Eyebrow>
    <Title>Run migrations</Title>
    <div style={{ marginTop: SPACING.titleGap + 20, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }}>
      <Subtitle>
        If you plan to store logs in your database, create the table with a standard migrate.
      </Subtitle>
      <Code title="terminal">
<span style={{ color: C.accent }}>$</span> python manage.py migrate{'\n\n'}<Cm>Operations to perform:</Cm>{'\n'}<Cm>  Apply all migrations: drf_api_logger</Cm>{'\n'}<Cm>Running migrations:</Cm>{'\n'}<span style={{ color: C.green }}>  Applying drf_api_logger.0001_initial... OK</span>
      </Code>
    </div>
    <Footer idx={10} total={24} />
  </Slide>
);

const S11_TwoModes = () => (
  <Slide>
    <Eyebrow>03 · Logging modes</Eyebrow>
    <Title>Two ways to consume logs</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      <div style={{ padding: 48, background: C.bgAlt, borderRadius: 16, border: `1px solid ${C.accent}` }}>
        <div style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 26, marginBottom: 20 }}>MODE A</div>
        <div style={{ fontSize: 52, fontWeight: 600, marginBottom: 24, color: C.fg }}>Database</div>
        <div style={{ fontSize: 28, color: C.muted, lineHeight: 1.5, marginBottom: 32 }}>
          Logs persist to your DB. Browse them in the Django admin with charts, search, and filters.
        </div>
        <Pill color={C.accent}>DRF_API_LOGGER_DATABASE = True</Pill>
      </div>
      <div style={{ padding: 48, background: C.bgAlt, borderRadius: 16, border: `1px solid ${C.magenta}` }}>
        <div style={{ fontFamily: FONT_MONO, color: C.magenta, fontSize: 26, marginBottom: 20 }}>MODE B</div>
        <div style={{ fontSize: 52, fontWeight: 600, marginBottom: 24, color: C.fg }}>Signal</div>
        <div style={{ fontSize: 28, color: C.muted, lineHeight: 1.5, marginBottom: 32 }}>
          A Python signal fires on every request. Forward logs anywhere: ELK, Datadog, Kafka, a flat file.
        </div>
        <Pill color={C.magenta}>DRF_API_LOGGER_SIGNAL = True</Pill>
      </div>
    </div>
    <div style={{ marginTop: 48, textAlign: 'center', color: C.muted, fontSize: 28 }}>
      You can use one, the other, or <span style={{ color: C.fg }}>both at once</span>.
    </div>
    <Footer idx={11} total={24} />
  </Slide>
);

const S12_DBMode = () => (
  <Slide>
    <Eyebrow>03 · Logging modes · Mode A</Eyebrow>
    <Title>Database logging</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 60, alignItems: 'center' }}>
      <div>
        <Subtitle style={{ marginBottom: 32 }}>
          One line of settings turns on the whole admin experience — listing, search, charts, detail views.
        </Subtitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {['Searchable across body, headers, URL', 'Filter by date · status · method', 'Performance analytics built-in', 'Bulk-insert writes (not one-per-request)'].map(t => (
            <div key={t} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ color: C.green, fontFamily: FONT_MONO, fontSize: 28 }}>✓</span>
              <span style={{ fontSize: 26, color: C.fg }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <Code title="settings.py">
<Cm># enable DB storage</Cm>{'\n'}<V>DRF_API_LOGGER_DATABASE</V> = <K>True</K>{'\n\n'}<Cm># optional: send to a dedicated logs DB</Cm>{'\n'}<V>DRF_API_LOGGER_DEFAULT_DATABASE</V> = <S>'logs_db'</S>{'\n\n'}<Cm># optional: mark anything &gt;200ms as slow</Cm>{'\n'}<V>DRF_API_LOGGER_SLOW_API_ABOVE</V> = <N>200</N>
      </Code>
    </div>
    <Footer idx={12} total={24} />
  </Slide>
);

const ScreenshotSlide = ({ idx, eyebrow, title, caption, src }) => (
  <Slide>
    <Eyebrow>{eyebrow}</Eyebrow>
    <Title>{title}</Title>
    <div style={{ marginTop: 40, flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ color: C.muted, fontSize: TYPE_SCALE.body, maxWidth: 1400 }}>{caption}</div>
      <div style={{
        flex: 1,
        background: '#ffffff',
        border: `1px solid ${C.panelBorder}`,
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        minHeight: 0,
      }}>
        <img src={src} alt={title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
    </div>
    <Footer idx={idx} total={24} />
  </Slide>
);

const S13_Dashboard = () => (
  <ScreenshotSlide
    idx={13}
    eyebrow="03 · Admin dashboard"
    title="Analytics overview"
    caption="The admin homepage shows request volume over time — so you can spot trends, traffic spikes, and failure patterns at a glance."
    src="/images/slides/drf-api-logger/graph.png"
  />
);

const S14_List = () => (
  <ScreenshotSlide
    idx={14}
    eyebrow="03 · Admin dashboard"
    title="Log list view"
    caption="Every request, one row at a time. Filter by date, status code, or method. The search bar queries request body, response body, headers, and URL."
    src="/images/slides/drf-api-logger/lists.png"
  />
);

const S15_Detail = () => (
  <ScreenshotSlide
    idx={15}
    eyebrow="03 · Admin dashboard"
    title="Log detail view"
    caption="Click any row to see the full picture — headers, request body, response body, client IP, and execution time. This is where debugging lives."
    src="/images/slides/drf-api-logger/details.png"
  />
);

const S16_Signal = () => (
  <Slide>
    <Eyebrow>03 · Logging modes · Mode B</Eyebrow>
    <Title>Signal-based logging</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 60, alignItems: 'center' }}>
      <div>
        <Subtitle style={{ marginBottom: 32 }}>
          Subscribe a function, get every API call pushed to it. Perfect for shipping logs off-site.
        </Subtitle>
        <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: C.dim, marginBottom: 16, letterSpacing: '0.1em' }}>USE IT FOR</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {['Elasticsearch', 'Datadog', 'Kafka', 'S3 archives', 'Slack alerts', 'Custom analytics'].map(t => (
            <Pill key={t} color={C.magenta} style={{ fontSize: 20 }}>{t}</Pill>
          ))}
        </div>
      </div>
      <Code title="signals.py">
<K>from</K> drf_api_logger <K>import</K> API_LOGGER_SIGNAL{'\n\n'}<K>def</K> <Fn>ship_to_elk</Fn>(**kwargs):{'\n'}    elk.<Fn>send</Fn>({'{'}{'\n'}        <S>'url'</S>: kwargs[<S>'api'</S>],{'\n'}        <S>'method'</S>: kwargs[<S>'method'</S>],{'\n'}        <S>'status'</S>: kwargs[<S>'status_code'</S>],{'\n'}        <S>'took_ms'</S>: kwargs[<S>'execution_time'</S>],{'\n'}    {'}'}){'\n\n'}<Cm># subscribe</Cm>{'\n'}API_LOGGER_SIGNAL.listen += ship_to_elk
      </Code>
    </div>
    <Footer idx={16} total={24} />
  </Slide>
);

const S17_Filters = () => (
  <Slide>
    <Eyebrow>04 · Configuration</Eyebrow>
    <Title>Filtering and skip rules</Title>
    <Subtitle style={{ marginTop: 20, marginBottom: 40 }}>
      You don't want to log everything. Drop noise before it hits your database.
    </Subtitle>
    <Code title="settings.py" style={{ flex: 1 }}>
<Cm># skip entire Django apps</Cm>{'\n'}<V>DRF_API_LOGGER_SKIP_NAMESPACE</V> = [<S>'admin'</S>, <S>'internal'</S>]{'\n\n'}<Cm># skip specific URL names</Cm>{'\n'}<V>DRF_API_LOGGER_SKIP_URL_NAME</V> = [<S>'health-check'</S>, <S>'metrics'</S>]{'\n\n'}<Cm># only these HTTP methods</Cm>{'\n'}<V>DRF_API_LOGGER_METHODS</V> = [<S>'POST'</S>, <S>'PUT'</S>, <S>'PATCH'</S>, <S>'DELETE'</S>]{'\n\n'}<Cm># only these status codes</Cm>{'\n'}<V>DRF_API_LOGGER_STATUS_CODES</V> = [<N>400</N>, <N>401</N>, <N>403</N>, <N>404</N>, <N>500</N>]
    </Code>
    <Footer idx={17} total={24} />
  </Slide>
);

const S18_Security = () => (
  <Slide>
    <Eyebrow>05 · Security</Eyebrow>
    <Title>Masking sensitive data</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }}>
      <div>
        <Subtitle style={{ marginBottom: 32 }}>
          The logger scrubs common auth fields by default. Extend the list for anything else you consider sensitive.
        </Subtitle>
        <div style={{ padding: 28, background: C.bgAlt, border: `1px solid ${C.red}`, borderRadius: 10 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: C.red, marginBottom: 12, letterSpacing: '0.1em' }}>⚠ IMPORTANT</div>
          <div style={{ fontSize: 26, color: C.fg, lineHeight: 1.4 }}>
            Defaults cover password, token, access, refresh, secret. Add your own — SSN, card numbers, API keys.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Code title="settings.py">
<V>DRF_API_LOGGER_EXCLUDE_KEYS</V> = [{'\n'}    <S>'password'</S>, <S>'token'</S>, <S>'secret'</S>,{'\n'}    <S>'api_key'</S>, <S>'ssn'</S>, <S>'card_number'</S>,{'\n'}]
        </Code>
        <Code title="what gets stored">
{'{'}{'\n'}  <S>"username"</S>: <S>"jane"</S>,{'\n'}  <S>"password"</S>: <span style={{ color: C.red }}>"***FILTERED***"</span>,{'\n'}  <S>"email"</S>: <S>"jane@example.com"</S>{'\n'}{'}'}
        </Code>
      </div>
    </div>
    <Footer idx={18} total={24} />
  </Slide>
);

const S19_Perf = () => (
  <Slide>
    <Eyebrow>06 · Production</Eyebrow>
    <Title>Performance tuning</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      <Code title="settings.py">
<Cm># bigger batches for high-traffic apps</Cm>{'\n'}<V>DRF_LOGGER_QUEUE_MAX_SIZE</V> = <N>100</N>{'\n\n'}<Cm># flush every 5 seconds</Cm>{'\n'}<V>DRF_LOGGER_INTERVAL</V> = <N>5</N>{'\n\n'}<Cm># cap log row size</Cm>{'\n'}<V>DRF_API_LOGGER_MAX_REQUEST_BODY_SIZE</V> = <N>1024</N>{'\n'}<V>DRF_API_LOGGER_MAX_RESPONSE_BODY_SIZE</V> = <N>2048</N>{'\n\n'}<Cm># isolate writes on a dedicated DB</Cm>{'\n'}<V>DRF_API_LOGGER_DEFAULT_DATABASE</V> = <S>'logs_db'</S>
      </Code>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { t: 'Queue size', d: 'How many logs buffer in memory before a flush. Bigger = fewer writes, more memory.' },
          { t: 'Interval', d: 'Seconds between flushes. Shorter = fresher logs, more DB load.' },
          { t: 'Body caps', d: 'Truncate giant request/response bodies so one bad upload doesn\'t bloat your logs table.' },
          { t: 'Separate DB', d: 'Point logs at a replica or a dedicated database so they never contend with your app.' },
        ].map(({ t, d }) => (
          <div key={t} style={{ padding: 24, background: C.bgAlt, border: `1px solid ${C.panelBorder}`, borderRadius: 10 }}>
            <div style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 22, marginBottom: 8 }}>{t}</div>
            <div style={{ fontSize: 24, color: C.fg, lineHeight: 1.4 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    <Footer idx={19} total={24} />
  </Slide>
);

const S20_Tracing = () => (
  <Slide>
    <Eyebrow>07 · Advanced</Eyebrow>
    <Title>Request tracing</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 60, alignItems: 'center' }}>
      <div>
        <Subtitle style={{ marginBottom: 32 }}>
          Stamp every request with a UUID — then follow it through microservices, background jobs, and log aggregators.
        </Subtitle>
        <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: C.muted, lineHeight: 1.5 }}>
          <div>client ──▶ api ──▶ worker ──▶ db</div>
          <div style={{ color: C.accent, marginTop: 8 }}>trace_id: a1b2c3d4-…</div>
        </div>
      </div>
      <Code title="settings.py + views.py">
<Cm># in settings.py</Cm>{'\n'}<V>DRF_API_LOGGER_ENABLE_TRACING</V> = <K>True</K>{'\n'}<V>DRF_API_LOGGER_TRACING_ID_HEADER_NAME</V> = <S>'X-Trace-ID'</S>{'\n\n'}<Cm># in your view</Cm>{'\n'}<K>def</K> <Fn>my_view</Fn>(request):{'\n'}    <K>if</K> <Fn>hasattr</Fn>(request, <S>'tracing_id'</S>):{'\n'}        logger.<Fn>info</Fn>(<S>f"processing &#123;request.tracing_id&#125;"</S>){'\n'}    <K>return</K> <Fn>Response</Fn>({'{'}<S>'ok'</S>: <K>True</K>{'}'})
      </Code>
    </div>
    <Footer idx={20} total={24} />
  </Slide>
);

const S21_Query = () => (
  <Slide>
    <Eyebrow>07 · Advanced</Eyebrow>
    <Title>Querying logs in code</Title>
    <Subtitle style={{ marginTop: 20, marginBottom: 40 }}>
      Logs are a Django model. Any ORM query works — stats dashboards, Slack alerts, scheduled reports.
    </Subtitle>
    <Code title="analytics.py" style={{ flex: 1 }}>
<K>from</K> drf_api_logger.models <K>import</K> APILogsModel{'\n\n'}<Cm># slowest APIs in the last hour</Cm>{'\n'}slow = APILogsModel.objects.<Fn>filter</Fn>({'\n'}    execution_time__gt=<N>1.0</N>,{'\n'}    added_on__gte=timezone.<Fn>now</Fn>() - timedelta(hours=<N>1</N>){'\n'}).<Fn>order_by</Fn>(<S>'-execution_time'</S>){'\n\n'}<Cm># most-hit endpoints</Cm>{'\n'}popular = APILogsModel.objects.<Fn>values</Fn>(<S>'api'</S>).<Fn>annotate</Fn>({'\n'}    count=<Fn>Count</Fn>(<S>'id'</S>){'\n'}).<Fn>order_by</Fn>(<S>'-count'</S>)[:<N>10</N>]
    </Code>
    <Footer idx={21} total={24} />
  </Slide>
);

const S22_Prod = () => (
  <Slide>
    <Eyebrow>06 · Production</Eyebrow>
    <Title>Production checklist</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 60px' }}>
      {[
        ['Dedicated DB', 'Keep log writes off your main database.'],
        ['Index added_on', 'Every query filters by time. Make it cheap.'],
        ['Archive old data', 'Delete or move logs older than 30–90 days.'],
        ['Cap body sizes', 'Stop one giant upload from filling your disk.'],
        ['Mask everything sensitive', "Auth, PII, card numbers — don't log what you can't store."],
        ['Tune the queue', 'Higher queue size + interval for less DB pressure.'],
      ].map(([t, d], i) => (
        <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', paddingBottom: 20, borderBottom: `1px solid ${C.line}` }}>
          <div style={{ fontFamily: FONT_MONO, color: C.green, fontSize: 28, width: 60, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 600, color: C.fg, marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 24, color: C.muted, lineHeight: 1.4 }}>{d}</div>
          </div>
        </div>
      ))}
    </div>
    <Footer idx={22} total={24} />
  </Slide>
);

const S23_Recap = () => (
  <Slide>
    <Eyebrow>Recap</Eyebrow>
    <Title>What we covered</Title>
    <div style={{ marginTop: SPACING.titleGap, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
      {[
        { h: 'Setup', items: ['pip install', 'INSTALLED_APPS', 'middleware', 'migrate'] },
        { h: 'Modes', items: ['DB → admin UI', 'Signal → anywhere', 'Both simultaneously'] },
        { h: 'Config', items: ['Skip rules', 'Data masking', 'Queue tuning', 'Tracing'] },
      ].map(({ h, items }) => (
        <div key={h} style={{ padding: 32, background: C.bgAlt, border: `1px solid ${C.panelBorder}`, borderRadius: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: C.accent, marginBottom: 20, letterSpacing: '0.1em' }}>{h.toUpperCase()}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map(t => (
              <div key={t} style={{ fontSize: 26, color: C.fg, display: 'flex', gap: 12 }}>
                <span style={{ color: C.green }}>›</span>{t}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 60, padding: 32, background: C.bgAlt, border: `1px solid ${C.accent}`, borderLeft: `4px solid ${C.accent}`, borderRadius: 8 }}>
      <div style={{ fontSize: 28, color: C.fg, lineHeight: 1.4 }}>
        The whole thing boils down to <span style={{ color: C.accent }}>one pip install + one middleware line</span>. Everything else is configuration you add as you need it.
      </div>
    </div>
    <Footer idx={23} total={24} />
  </Slide>
);

const S24_End = () => (
  <Slide bg={C.bg}>
    <div style={{ position: 'absolute', inset: 0, background:
      'radial-gradient(circle at 70% 60%, rgba(134,239,172,0.1) 0%, transparent 50%)' }} />
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: TYPE_SCALE.small, color: C.green, letterSpacing: '0.3em', marginBottom: 32 }}>
        $ ./tutorial --end
      </div>
      <Title size={96} style={{ marginBottom: 40 }}>
        Go log some APIs.
      </Title>
      <div style={{ fontSize: TYPE_SCALE.subtitle, color: C.muted, marginBottom: 80, maxWidth: 1200 }}>
        Thanks for watching. Everything in this tutorial is in the README — star the repo if it helped.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1400 }}>
        <div style={{ padding: 32, background: C.bgAlt, border: `1px solid ${C.accent}`, borderRadius: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: C.accent, marginBottom: 12, letterSpacing: '0.1em' }}>GITHUB</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 26, color: C.fg, wordBreak: 'break-all' }}>
            github.com/vishalanandl177/DRF-API-Logger
          </div>
        </div>
        <div style={{ padding: 32, background: C.bgAlt, border: `1px solid ${C.green}`, borderRadius: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: C.green, marginBottom: 12, letterSpacing: '0.1em' }}>INSTALL</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 26, color: C.fg }}>
            $ pip install drf-api-logger
          </div>
        </div>
      </div>
    </div>
    <Footer idx={24} total={24} />
  </Slide>
);

// ==========================================================================
// Export
// ==========================================================================
const SLIDES = [
  S01_Title, S02_WhatIs, S03_Why, S04_Agenda, S05_HowItWorks,
  S06_Prereq, S07_Install, S08_AddApp, S09_Middleware, S10_Migrate,
  S11_TwoModes, S12_DBMode, S13_Dashboard, S14_List, S15_Detail,
  S16_Signal, S17_Filters, S18_Security, S19_Perf, S20_Tracing,
  S21_Query, S22_Prod, S23_Recap, S24_End,
];

const SLIDE_LABELS = [
  '01 Title', '02 What is it', '03 Why log APIs', '04 Agenda', '05 How it works',
  '06 Prerequisites', '07 Install', '08 Add app', '09 Middleware', '10 Migrate',
  '11 Two modes', '12 DB mode', '13 Dashboard', '14 Log list', '15 Log detail',
  '16 Signal mode', '17 Filters', '18 Security', '19 Performance', '20 Tracing',
  '21 Querying', '22 Production', '23 Recap', '24 End',
];

Object.assign(window, { SLIDES, SLIDE_LABELS });
