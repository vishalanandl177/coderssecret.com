export const CONTENT = `
      <p>Python is loved for its readability and developer productivity, but it's often criticized for being slow. The truth is, <strong>most Python performance issues come from how the code is written</strong>, not from the language itself. With the right techniques, you can often achieve 10x-100x speedups without leaving Python.</p>

      <!-- Performance Optimization Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Python Performance Optimization Workflow</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#ef4444;--i:0"><span class="pipeline-step-icon">&#x1F50D;</span>Profile<span class="pipeline-step-sub">cProfile / line_profiler</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:1"><span class="pipeline-step-icon">&#x1F3AF;</span>Identify<span class="pipeline-step-sub">Find bottlenecks</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#a855f7;--i:2"><span class="pipeline-step-icon">&#x1F528;</span>Optimize<span class="pipeline-step-sub">Apply technique</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:3"><span class="pipeline-step-icon">&#x1F4CA;</span>Benchmark<span class="pipeline-step-sub">Measure speedup</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:4"><span class="pipeline-step-icon">&#x267B;</span>Repeat<span class="pipeline-step-sub">Next bottleneck</span></div>
        </div>
      </div>

      <h2>Profile Before You Optimize</h2>
      <p>The golden rule of optimization: <strong>never guess where the bottleneck is</strong>. Always measure first.</p>
      <pre><code>import cProfile
import pstats

def main():
    # Your application logic here
    process_data()

# Profile the entire program
cProfile.run('main()', 'output.prof')

# Analyze results
stats = pstats.Stats('output.prof')
stats.sort_stats('cumulative')
stats.print_stats(20)  # Top 20 slowest functions</code></pre>
      <p>For line-by-line profiling, use <code>line_profiler</code>:</p>
      <pre><code>pip install line_profiler

# Decorate the function you want to profile
@profile
def process_data():
    results = []
    for item in large_dataset:
        results.append(transform(item))
    return results

# Run with: kernprof -l -v your_script.py</code></pre>

      <h2>Use Built-in Functions and Data Structures</h2>
      <p>Python's built-in functions are implemented in C and are dramatically faster than pure Python equivalents.</p>
      <pre><code># SLOW: Manual loop
total = 0
for x in numbers:
    total += x

# FAST: Built-in sum (10-20x faster)
total = sum(numbers)

# SLOW: Manual filtering
result = []
for x in numbers:
    if x > 0:
        result.append(x)

# FAST: List comprehension (2-3x faster)
result = [x for x in numbers if x > 0]

# FASTEST: Generator expression for large data (memory efficient)
result = sum(x for x in numbers if x > 0)</code></pre>

      <h2>Choose the Right Data Structure</h2>
      <p>Data structure choice can make or break performance:</p>
      <pre><code># SLOW: Checking membership in a list — O(n)
if item in large_list:  # Scans every element
    pass

# FAST: Checking membership in a set — O(1)
large_set = set(large_list)
if item in large_set:  # Hash lookup, instant
    pass

# SLOW: Counting occurrences manually
counts = {}
for item in data:
    counts[item] = counts.get(item, 0) + 1

# FAST: Use collections.Counter
from collections import Counter
counts = Counter(data)

# FAST: Use defaultdict to avoid key checks
from collections import defaultdict
groups = defaultdict(list)
for item in data:
    groups[item.category].append(item)</code></pre>

      <h2>Avoid Unnecessary Work</h2>
      <p>Caching, lazy evaluation, and short-circuiting can eliminate redundant computation:</p>
      <pre><code>from functools import lru_cache

# Cache expensive function results
@lru_cache(maxsize=1024)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Without cache: fibonacci(35) takes ~5 seconds
# With cache: fibonacci(35) takes ~0.00001 seconds

# Use slots to reduce memory and speed up attribute access
class Point:
    __slots__ = ['x', 'y', 'z']
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
# 40% less memory, 20% faster attribute access vs regular class</code></pre>

      <h2>String Concatenation</h2>
      <p>String handling is a common performance trap:</p>
      <pre><code># SLOW: String concatenation in a loop — O(n^2)
result = ""
for chunk in chunks:
    result += chunk  # Creates a new string every iteration

# FAST: Join — O(n)
result = "".join(chunks)

# SLOW: Format string in a loop
lines = []
for name, score in data:
    lines.append("Name: " + name + ", Score: " + str(score))

# FAST: f-strings (fastest string formatting)
lines = [f"Name: {name}, Score: {score}" for name, score in data]</code></pre>

      <h2>Leverage NumPy for Numerical Work</h2>
      <p>For numerical computation, NumPy's vectorized operations are 50-100x faster than pure Python loops:</p>
      <pre><code>import numpy as np

# SLOW: Pure Python — ~2 seconds for 10M elements
result = [x ** 2 + 2 * x + 1 for x in range(10_000_000)]

# FAST: NumPy vectorized — ~0.03 seconds (60x faster)
arr = np.arange(10_000_000)
result = arr ** 2 + 2 * arr + 1</code></pre>

      <h2>Concurrency: asyncio, Threading, and Multiprocessing</h2>
      <p>Choose the right concurrency model for your workload:</p>
      <pre><code>import asyncio
import aiohttp

# I/O-bound: Use asyncio (network calls, file I/O)
async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(url) for url in urls]
        return await asyncio.gather(*tasks)

# CPU-bound: Use multiprocessing (data processing, calculations)
from multiprocessing import Pool

def process_chunk(chunk):
    return [heavy_computation(item) for item in chunk]

with Pool(processes=8) as pool:
    results = pool.map(process_chunk, data_chunks)</code></pre>

      <h2>Quick Wins Checklist</h2>
      <ul>
        <li><strong>Move invariants out of loops:</strong> Don't recompute values that don't change inside a loop.</li>
        <li><strong>Use local variables:</strong> Local variable lookup is faster than global. Assign frequently used globals to local names.</li>
        <li><strong>Avoid <code>*args/**kwargs</code> overhead:</strong> Use explicit parameters when you know the signature.</li>
        <li><strong>Use <code>itertools</code>:</strong> <code>chain</code>, <code>islice</code>, <code>groupby</code> — all implemented in C, all faster than hand-rolled equivalents.</li>
        <li><strong>Upgrade Python:</strong> Python 3.11 is 25% faster than 3.10. Python 3.12+ has even more improvements. Free performance just by upgrading.</li>
        <li><strong>Consider Numba, Cython, or PyPy:</strong> For true hot paths, these tools can give you C-level speed. See the sections below for details.</li>
      </ul>

      <h2>Numba — JIT Compilation for Numerical Code</h2>
      <p><strong>Numba</strong> is a just-in-time (JIT) compiler that translates Python functions into optimized machine code at runtime using LLVM. The best part? You just add a decorator — no new syntax, no separate compilation step.</p>
      <pre><code>from numba import njit
import numpy as np

# SLOW: Pure Python — ~4 seconds
def monte_carlo_pi_python(n):
    inside = 0
    for i in range(n):
        x = np.random.random()
        y = np.random.random()
        if x**2 + y**2 <= 1.0:
            inside += 1
    return 4.0 * inside / n

# FAST: Numba JIT — ~0.05 seconds (80x faster)
@njit
def monte_carlo_pi_numba(n):
    inside = 0
    for i in range(n):
        x = np.random.random()
        y = np.random.random()
        if x**2 + y**2 <= 1.0:
            inside += 1
    return 4.0 * inside / n

# First call compiles the function (small one-time cost)
# Subsequent calls run at near-C speed
result = monte_carlo_pi_numba(10_000_000)</code></pre>
      <p>Numba also supports GPU acceleration with CUDA:</p>
      <pre><code>from numba import cuda

@cuda.jit
def vector_add_gpu(a, b, result):
    idx = cuda.grid(1)
    if idx < a.size:
        result[idx] = a[idx] + b[idx]</code></pre>
      <p><strong>When to use Numba:</strong> Numerical loops, math-heavy functions, Monte Carlo simulations, array operations. It works best with NumPy arrays and scalar types. It does <em>not</em> support arbitrary Python objects, classes, or most of the standard library.</p>

      <h2>Cython — Write Python, Get C Speed</h2>
      <p><strong>Cython</strong> is a superset of Python that compiles to C extension modules. You can gradually add type annotations to existing Python code and watch the performance improve dramatically.</p>
      <pre><code># fibonacci.pyx — Cython source file

# Pure Python version (slow)
def fib_python(n):
    a, b = 0, 1
    for i in range(n):
        a, b = b, a + b
    return a

# Cython with C types (100x+ faster)
def fib_cython(int n):
    cdef long long a = 0, b = 1
    cdef int i
    for i in range(n):
        a, b = b, a + b
    return a</code></pre>
      <p>Compile it with a <code>setup.py</code>:</p>
      <pre><code>from setuptools import setup
from Cython.Build import cythonize

setup(ext_modules=cythonize("fibonacci.pyx"))</code></pre>
      <pre><code>python setup.py build_ext --inplace</code></pre>
      <p>Cython also lets you call C libraries directly and create typed memoryviews for blazing-fast array access:</p>
      <pre><code># matrix_ops.pyx
import numpy as np
cimport numpy as cnp

def matrix_multiply(cnp.ndarray[double, ndim=2] a,
                    cnp.ndarray[double, ndim=2] b):
    cdef int i, j, k
    cdef int M = a.shape[0], N = b.shape[1], K = a.shape[1]
    cdef cnp.ndarray[double, ndim=2] result = np.zeros((M, N))

    for i in range(M):
        for j in range(N):
            for k in range(K):
                result[i, j] += a[i, k] * b[k, j]
    return result</code></pre>
      <p><strong>When to use Cython:</strong> CPU-bound hot paths where you need maximum control, wrapping existing C/C++ libraries, or when you want a gradual migration path from Python to C-speed code. It's used by major projects like NumPy, pandas, and scikit-learn internally.</p>

      <h2>Python with C — ctypes, cffi, and C Extensions</h2>
      <p>Sometimes you need to call existing C code from Python, or you want to write a performance-critical function in pure C. Python offers several ways to do this.</p>

      <h2>ctypes — Call C Libraries Directly</h2>
      <p><code>ctypes</code> is part of Python's standard library. It lets you load shared libraries (.so / .dll) and call their functions with zero dependencies:</p>
      <pre><code>// fast_math.c — compile with: gcc -shared -O2 -o fast_math.so fast_math.c
#include &lt;math.h&gt;

double sum_squares(double* arr, int n) {
    double total = 0.0;
    for (int i = 0; i < n; i++) {
        total += arr[i] * arr[i];
    }
    return total;
}

int is_prime(long n) {
    if (n < 2) return 0;
    for (long i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}</code></pre>
      <pre><code># Python — using ctypes to call the C library
import ctypes
import numpy as np

# Load the shared library
lib = ctypes.CDLL('./fast_math.so')

# Define argument and return types
lib.sum_squares.argtypes = [ctypes.POINTER(ctypes.c_double), ctypes.c_int]
lib.sum_squares.restype = ctypes.c_double

lib.is_prime.argtypes = [ctypes.c_long]
lib.is_prime.restype = ctypes.c_int

# Call it
arr = np.array([1.0, 2.0, 3.0, 4.0, 5.0], dtype=np.float64)
result = lib.sum_squares(arr.ctypes.data_as(ctypes.POINTER(ctypes.c_double)), len(arr))
print(f"Sum of squares: {result}")  # 55.0

print(f"Is 997 prime? {bool(lib.is_prime(997))}")  # True</code></pre>

      <h2>cffi — A Cleaner C Interface</h2>
      <p><code>cffi</code> is a third-party library that provides a cleaner, more Pythonic way to call C code. It can parse C header declarations directly:</p>
      <pre><code>from cffi import FFI

ffi = FFI()

# Declare the C functions
ffi.cdef("""
    double sum_squares(double* arr, int n);
    int is_prime(long n);
""")

# Load the library
lib = ffi.dlopen('./fast_math.so')

# Call with native Python types
arr = ffi.new("double[]", [1.0, 2.0, 3.0, 4.0, 5.0])
result = lib.sum_squares(arr, 5)
print(result)  # 55.0</code></pre>

      <h2>CPython C Extensions — Maximum Performance</h2>
      <p>For the ultimate performance, you can write a native CPython extension module in C. This is what NumPy, pandas, and most high-performance Python libraries do internally:</p>
      <pre><code>// fast_module.c
#include &lt;Python.h&gt;

static PyObject* fast_fibonacci(PyObject* self, PyObject* args) {
    int n;
    if (!PyArg_ParseTuple(args, "i", &n))
        return NULL;

    long long a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        long long temp = b;
        b = a + b;
        a = temp;
    }
    return PyLong_FromLongLong(a);
}

static PyMethodDef methods[] = {
    {"fibonacci", fast_fibonacci, METH_VARARGS, "Fast fibonacci"},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef module = {
    PyModuleDef_HEAD_INIT, "fast_module", NULL, -1, methods
};

PyMODINIT_FUNC PyInit_fast_module(void) {
    return PyModule_Create(&module);
}</code></pre>
      <pre><code># setup.py
from setuptools import setup, Extension

setup(
    ext_modules=[Extension("fast_module", sources=["fast_module.c"])]
)

# Build: python setup.py build_ext --inplace
# Use:   from fast_module import fibonacci</code></pre>

      <!-- Speedup Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Typical Speedup vs Pure Python (hover for values)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-5 bar-gray" data-value="1x"></div><div class="bar-chart-label">Pure Python</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-15 bar-green" data-value="3x"></div><div class="bar-chart-label">Built-ins</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-25 bar-blue" data-value="5-10x"></div><div class="bar-chart-label">PyPy</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-45 bar-orange" data-value="50-100x"></div><div class="bar-chart-label">NumPy</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-55 bar-purple" data-value="50-100x"></div><div class="bar-chart-label">Numba</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-70 bar-pink" data-value="50-200x"></div><div class="bar-chart-label">Cython</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-red" data-value="100-500x"></div><div class="bar-chart-label">C Extension</div></div>
        </div>
      </div>

      <h2>Choosing the Right Tool</h2>
      <pre><code>Tool              Setup Effort   Speed Gain   Best For
────────────────  ────────────   ──────────   ──────────────────────────
Numba             Very Low       50-100x      Numerical loops, math
Cython            Medium         50-200x      Hot paths, wrapping C libs
ctypes            Low            50-100x      Calling existing C libraries
cffi              Low            50-100x      Cleaner C library interface
C Extension       High           100-500x     Maximum perf, library core
PyPy              Very Low       5-10x        General Python speedup</code></pre>
      <p><strong>Start with Numba</strong> if you're doing numerical work — it's the lowest-effort, highest-reward option. <strong>Use Cython</strong> when you need more control or are building a library. <strong>Use ctypes/cffi</strong> when you're integrating with existing C code. <strong>Write a C extension</strong> only when you're building performance-critical infrastructure that will be used millions of times.</p>

      <p>Performance optimization is a skill that compounds. Start with profiling, pick the lowest-hanging fruit, and work your way up. Most of the time, you don't need to rewrite anything in C — you just need to write better Python. But when you do need that last mile of performance, Python gives you a clear path all the way down to bare metal.</p>
    `;
