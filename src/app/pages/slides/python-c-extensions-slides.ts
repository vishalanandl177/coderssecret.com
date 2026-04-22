import { Component, inject } from '@angular/core';
import { SlidePlayerComponent, SlideData } from '../../components/slide-player/slide-player';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-python-c-ext-slides',
  imports: [SlidePlayerComponent],
  template: `
    <app-slide-player [slides]="slides" deckTitle="Python C Extensions" backUrl="/blog/python-c-extensions-workshop" />
  `,
})
export class PythonCExtSlidesComponent {
  private seo = inject(SeoService);

  slides: SlideData[] = [
    {
      type: 'title',
      title: 'Python C Extensions — a workshop',
      subtitle:
        'How to make Python 50x faster without leaving Python. A hands-on tour, from the first hotspot to a shipped module.',
      tags: ['python 3.12+', 'cpython c api', 'setuptools', 'beginners & intermediate'],
      narration:
        "Welcome everyone. Today we're going to take a hands-on journey into one of Python's most powerful but least-understood superpowers — C extensions.",
    },
    {
      type: 'content',
      eyebrow: '01 · The Problem',
      title: 'When Python hits the wall.',
      body: "You've written a beautiful Python service. It reads data, crunches numbers, returns results. Life is good — until production traffic hits, and suddenly a single request takes two seconds instead of twenty milliseconds.",
      bullets: [
        'Profile shows one tight loop eating 90% of CPU',
        "You rewrite, tune, cache — but Python just won't go faster",
        "That's the wall we're going to tear down today",
      ],
      narration:
        "Let's start with a story. You've written a beautiful Python service. Life is good — until production traffic hits, and suddenly a single request takes two seconds.",
    },
    {
      type: 'content',
      eyebrow: '02 · Why',
      title: 'Why Python is slow in tight loops',
      body: 'Python is interpreted — every line gets translated on the fly. Every integer, every list access, every addition carries overhead.',
      bullets: [
        'Interpreter constantly checks types',
        'Reference counting on every operation',
        'Dictionary lookups for attribute access',
        'For millions of small operations, overhead adds up fast',
      ],
      narration:
        "So why does Python hit that wall? Python is interpreted, which means every line gets translated on the fly. Every integer, every addition carries overhead.",
    },
    {
      type: 'content',
      eyebrow: '03 · The Idea',
      title: 'Drop down to C, come right back up.',
      body: "What if, just for the hot parts, we could drop down a level — into C — and then come right back up to Python for the rest? That's exactly what a C extension is.",
      bullets: [
        'Write the performance-critical function in C',
        'Python calls it like any other function',
        'Near-native speed where it matters',
        'Best of both worlds: Python on top, C underneath',
      ],
      narration:
        "Here's the idea. What if, just for the hot parts, we could drop down into C and then come right back up to Python? That's exactly what a C extension is.",
    },
    {
      type: 'content',
      eyebrow: '04 · Mental Model',
      title: 'The two-floor building.',
      body: 'Picture two floors. The top floor is your Python code — comfortable, dynamic, expressive. The bottom floor is C — fast, strict, close to the metal. A C extension is the staircase between them.',
      bullets: [
        'Python hands arguments down the stairs',
        'C does the heavy work',
        'The result walks back up',
        'Your callers never know the difference',
      ],
      narration:
        "Picture two floors. The top floor is your Python code. The bottom floor is C. A C extension is the staircase between them.",
    },
    {
      type: 'code',
      eyebrow: '05 · First Example',
      title: 'Sum of squares',
      body: 'A simple function that sums the squares of numbers from 0 to n. Small function, huge speedup potential.',
      code: `# Python side\nresult = fast_math.sum_squares(10_000_000)\n\n/* C side */\nlong long total = 0;\nfor (long long i = 0; i < n; i++) {\n    total += i * i;\n}\nreturn total;`,
      lang: 'python / c',
      narration:
        "Here's our first example. A simple function that sums the squares of numbers. On the Python side, it looks like any other function call.",
    },
    {
      type: 'grid',
      eyebrow: '05 · Benchmarks',
      title: 'The numbers speak.',
      items: [
        { title: 'Pure Python', desc: '~900ms on 10M iterations' },
        { title: 'C Extension', desc: '~12ms — same logic, 75x faster' },
        { title: 'Zero change for callers', desc: "Your code doesn't know it's calling C" },
        { title: 'Same correctness', desc: 'Identical results, verified by tests' },
      ],
      narration:
        "Let's look at the numbers. Pure Python on ten million iterations — about nine hundred milliseconds. The C extension — around twelve milliseconds. Seventy-five times faster.",
    },
    {
      type: 'content',
      eyebrow: '06 · Under the Hood',
      title: 'The Python C API',
      body: "Python ships with a C API — a set of headers and functions that let C code speak Python's language.",
      bullets: [
        'PyArg_ParseTuple: parse incoming arguments',
        'Py_BuildValue: build return values',
        'Method table: register functions for Python import',
        'A small set of primitives — but all you need',
      ],
      narration:
        "Now let's peek under the hood. Python ships with a C API — a set of headers and functions that let C code speak Python's language.",
    },
    {
      type: 'content',
      eyebrow: '07 · Workflow',
      title: 'Four steps, every time.',
      bullets: [
        'Write your C file with the logic',
        'Declare a method table and module definition',
        'Compile with setuptools into a shared library',
        'Import in Python, just like any other module',
      ],
      body: 'Learn the rhythm once, and every future extension follows the same beat.',
      narration:
        "The workflow has four steps, and they're the same every time. Write, declare, compile, import.",
    },
    {
      type: 'content',
      eyebrow: '08 · Key Insight',
      title: 'Surgery, not a rewrite.',
      body: 'You are NOT rewriting your application in C. You are surgically replacing the 1-2% of code that runs 90% of the time.',
      bullets: [
        'Profile first — find the hotspot',
        'Extract just that function',
        'Leave everything else in Python',
        'This is how real teams ship performance',
      ],
      narration:
        "Here's the insight. You are not rewriting your application in C. You are surgically replacing the one or two percent of code that runs ninety percent of the time.",
    },
    {
      type: 'content',
      eyebrow: '09 · Ecosystem',
      title: "They're everywhere.",
      body: "C extensions aren't exotic — they're everywhere you already use.",
      bullets: [
        'NumPy, pandas, Pillow, lxml, cryptography',
        'Parts of the standard library',
        'Every numpy.dot call crosses the staircase',
        "You've been using C extensions for years",
      ],
      narration:
        "C extensions aren't some exotic corner of the ecosystem — they're everywhere you already use. NumPy, pandas, Pillow, lxml — all backed by C.",
    },
    {
      type: 'grid',
      eyebrow: '10 · Trade-offs',
      title: 'Nothing comes free.',
      items: [
        { title: 'Complexity', desc: 'You now maintain two languages.' },
        {
          title: 'Memory',
          desc: "Python's GC doesn't know about your C allocations — manage reference counts yourself.",
        },
        {
          title: 'Debugging',
          desc: "A segfault in C takes down the whole Python process, and the traceback won't help.",
        },
      ],
      narration:
        'Nothing comes free. C extensions bring three real costs: complexity, memory management, and debugging.',
    },
    {
      type: 'content',
      eyebrow: '11 · Pitfalls',
      title: 'Common mistakes to avoid.',
      bullets: [
        'Forgetting Py_INCREF / Py_DECREF — silent memory leaks',
        'Returning a borrowed reference as if you owned it',
        'Not releasing the GIL on long-running C code',
        'Skipping error checks on Python API calls',
      ],
      narration:
        'A few common mistakes to avoid. Forgetting reference counting — that causes silent memory leaks or crashes much later.',
    },
    {
      type: 'content',
      eyebrow: '12 · When NOT to use',
      title: 'When C extensions are wrong.',
      bullets: [
        "Bottleneck is I/O (disk, network, database) — C won't help",
        "You haven't profiled yet — you're guessing at what's slow",
        "The code runs once a day — a 200ms function doesn't need a C rewrite",
      ],
      narration:
        "When should you not reach for C? When your bottleneck is I/O. When you haven't profiled. And when the code runs once a day.",
    },
    {
      type: 'code',
      eyebrow: '13 · Demo',
      title: 'End-to-end mini demo',
      body: "C file, setup.py, build, import, run. That's the full loop.",
      code: `# 1. Write: fast_math.c\n# 2. Build:\n$ python setup.py build_ext --inplace\n\n# 3. Import & run:\nimport fast_math\nresult = fast_math.sum_squares(10_000_000)\nprint(f\"Result: {result}\")`,
      lang: 'terminal',
      narration:
        "Let's do a mini demo end-to-end. C file, setup.py, one command to build, one line to import. That's the full loop.",
    },
    {
      type: 'grid',
      eyebrow: '14 · Alternatives',
      title: 'Beyond the raw C API',
      items: [
        { title: 'Cython', desc: 'Python-like syntax that compiles to C. Most popular choice.' },
        { title: 'CFFI / ctypes', desc: 'Call existing C libraries without writing extension code.' },
        { title: 'PyO3', desc: 'Write extensions in Rust with memory safety.' },
        { title: 'Numba', desc: 'JIT compile Python functions with a decorator.' },
      ],
      narration:
        "The raw C API isn't your only option. Cython, CFFI, ctypes, PyO3, Numba — pick the tool that matches your team.",
    },
    {
      type: 'content',
      eyebrow: '15 · Summary',
      title: 'A scalpel, not a hammer.',
      bullets: [
        'Profile before you cut',
        'Target hotspots, not whole systems',
        'Respect the trade-offs',
        'Most of the time, use Cython or NumPy',
        'When you need raw speed and full control — now you know how',
      ],
      narration:
        "C extensions are a scalpel, not a hammer. Profile before you cut. Target hotspots. And remember that the right answer is usually a higher-level tool.",
    },
    {
      type: 'end',
      title: 'Now go make Python fast.',
      subtitle:
        "Thank you for following along. I'd love to hear about real hotspots in your own code.",
      links: [
        { label: 'PYTHON DOCS', value: 'docs.python.org/3/extending' },
        { label: 'CYTHON', value: 'cython.readthedocs.io' },
      ],
      narration: "That's the workshop. Thank you for following along.",
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Python C Extensions Workshop — Interactive Slides with Narration',
      description:
        'Learn Python C extensions through 18 interactive slides with voice narration. Covers when to use C, the Python C API, setuptools workflow, benchmarks, trade-offs, and alternatives like Cython and PyO3.',
      url: '/slides/python-c-extensions',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Python C Extensions', url: '/blog/python-c-extensions-workshop' },
        { name: 'Slides', url: '/slides/python-c-extensions' },
      ],
    });
  }
}
