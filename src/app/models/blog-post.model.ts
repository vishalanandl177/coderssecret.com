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
  category: string;
  coverImage: string;
  featured?: boolean;
}

export const CATEGORIES = [
  { name: 'All', slug: '' },
  { name: 'Frontend', slug: 'frontend' },
  { name: 'Backend', slug: 'backend' },
  { name: 'DevOps', slug: 'devops' },
  { name: 'Tutorials', slug: 'tutorials' },
  { name: 'Open Source', slug: 'open-source' },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '9',
    title: 'Kubernetes Operators: Build Your Own Operator Using Golang',
    slug: 'kubernetes-operators-build-your-own-with-golang',
    excerpt: 'Learn what Kubernetes Operators are, why they matter, and how to build your own custom operator from scratch using Golang and the Operator SDK.',
    category: 'devops',
    featured: true,
    content: `
      <p>Kubernetes has become the de facto standard for container orchestration, but managing complex stateful applications on Kubernetes often requires more than just Deployments and Services. That's where <strong>Kubernetes Operators</strong> come in — they encode human operational knowledge into software that extends the Kubernetes API itself.</p>

      <h2>What is a Kubernetes Operator?</h2>
      <p>A Kubernetes Operator is a method of packaging, deploying, and managing a Kubernetes application using <strong>custom resources</strong> (CRs) and <strong>custom controllers</strong>. Think of it as a robot SRE that watches your cluster and takes actions to reconcile the actual state with the desired state you've declared.</p>
      <p>The Operator pattern was introduced by CoreOS in 2016 and has since become the standard way to manage complex workloads. Popular operators include the Prometheus Operator, Cert-Manager, and the PostgreSQL Operator.</p>

      <h2>Core Concepts</h2>
      <p>Before building an operator, you need to understand these key concepts:</p>
      <ul>
        <li><strong>Custom Resource Definition (CRD):</strong> Extends the Kubernetes API with your own resource types. For example, you might define a <code>Database</code> resource with fields like <code>engine</code>, <code>version</code>, and <code>replicas</code>.</li>
        <li><strong>Controller:</strong> A loop that watches for changes to resources and takes action to move the current state toward the desired state. This is the brain of your operator.</li>
        <li><strong>Reconciliation Loop:</strong> The core logic of a controller. Every time a resource changes, the reconciler is called to ensure reality matches the spec.</li>
        <li><strong>Finalizers:</strong> Special metadata that prevent a resource from being deleted until cleanup logic has completed.</li>
      </ul>

      <h2>Setting Up Your Environment</h2>
      <p>To build an operator in Go, you'll use the <strong>Operator SDK</strong>, which provides scaffolding, code generation, and testing utilities.</p>
      <pre><code># Install the Operator SDK CLI
brew install operator-sdk

# Or download the binary directly
export ARCH=$(case $(uname -m) in x86_64) echo -n amd64 ;; aarch64) echo -n arm64 ;; esac)
export OS=$(uname | awk '{print tolower($0)}')
curl -LO https://github.com/operator-framework/operator-sdk/releases/latest/download/operator-sdk_\${OS}_\${ARCH}
chmod +x operator-sdk_\${OS}_\${ARCH}
sudo mv operator-sdk_\${OS}_\${ARCH} /usr/local/bin/operator-sdk

# Verify installation
operator-sdk version</code></pre>

      <p>You'll also need Go 1.21+, Docker, kubectl, and access to a Kubernetes cluster (minikube or kind works great for development).</p>

      <h2>Scaffolding Your Operator Project</h2>
      <p>Let's build an operator that manages a custom <code>AppService</code> resource — a simplified application deployment manager.</p>
      <pre><code># Create a new project
mkdir appservice-operator && cd appservice-operator
operator-sdk init --domain example.com --repo github.com/yourname/appservice-operator

# Create an API (CRD + Controller)
operator-sdk create api --group apps --version v1alpha1 --kind AppService --resource --controller</code></pre>
      <p>This generates the project structure with boilerplate code, including the CRD types, controller skeleton, and Makefile targets.</p>

      <h2>Defining Your Custom Resource</h2>
      <p>Edit the generated types file at <code>api/v1alpha1/appservice_types.go</code>:</p>
      <pre><code>type AppServiceSpec struct {
    // Size is the number of replicas for the deployment
    Size int32 \`json:"size"\`

    // Image is the container image to deploy
    Image string \`json:"image"\`

    // Port is the port the application listens on
    Port int32 \`json:"port,omitempty"\`
}

type AppServiceStatus struct {
    // Conditions represent the latest available observations
    Conditions []metav1.Condition \`json:"conditions,omitempty"\`

    // AvailableReplicas is the number of pods ready
    AvailableReplicas int32 \`json:"availableReplicas,omitempty"\`
}</code></pre>
      <p>After modifying the types, regenerate the manifests:</p>
      <pre><code>make generate
make manifests</code></pre>

      <h2>Implementing the Reconciliation Loop</h2>
      <p>The reconciler is where all the magic happens. Edit <code>internal/controller/appservice_controller.go</code>:</p>
      <pre><code>func (r *AppServiceReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    log := log.FromContext(ctx)

    // 1. Fetch the AppService instance
    appService := &appsv1alpha1.AppService{}
    if err := r.Get(ctx, req.NamespacedName, appService); err != nil {
        if apierrors.IsNotFound(err) {
            log.Info("AppService resource not found — probably deleted")
            return ctrl.Result{}, nil
        }
        return ctrl.Result{}, err
    }

    // 2. Check if the Deployment already exists, create if not
    deployment := &appsv1.Deployment{}
    err := r.Get(ctx, types.NamespacedName{
        Name:      appService.Name,
        Namespace: appService.Namespace,
    }, deployment)

    if err != nil && apierrors.IsNotFound(err) {
        dep := r.createDeployment(appService)
        log.Info("Creating a new Deployment", "Name", dep.Name)
        if err = r.Create(ctx, dep); err != nil {
            return ctrl.Result{}, err
        }
        return ctrl.Result{Requeue: true}, nil
    }

    // 3. Ensure the replica count matches the spec
    if *deployment.Spec.Replicas != appService.Spec.Size {
        deployment.Spec.Replicas = &appService.Spec.Size
        if err = r.Update(ctx, deployment); err != nil {
            return ctrl.Result{}, err
        }
    }

    // 4. Update status
    appService.Status.AvailableReplicas = deployment.Status.AvailableReplicas
    if err := r.Status().Update(ctx, appService); err != nil {
        return ctrl.Result{}, err
    }

    return ctrl.Result{}, nil
}</code></pre>

      <h2>Testing Your Operator</h2>
      <p>The Operator SDK generates test scaffolding using Ginkgo and envtest:</p>
      <pre><code># Run unit tests
make test

# Run the operator locally against your cluster
make install  # Install CRDs
make run      # Run the controller locally

# In another terminal, create a sample resource
kubectl apply -f config/samples/apps_v1alpha1_appservice.yaml

# Watch it work
kubectl get appservice
kubectl get deployments
kubectl get pods</code></pre>

      <h2>Deploying to Production</h2>
      <p>When you're ready to deploy the operator to a real cluster:</p>
      <pre><code># Build and push the operator image
make docker-build docker-push IMG=yourregistry/appservice-operator:v0.1.0

# Deploy to the cluster
make deploy IMG=yourregistry/appservice-operator:v0.1.0

# Verify it's running
kubectl get pods -n appservice-operator-system</code></pre>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Idempotency:</strong> Your reconciler will be called multiple times. Every operation must be safe to repeat without side effects.</li>
        <li><strong>Status Subresource:</strong> Always update status via the status subresource, not the main resource. This avoids conflicts and follows Kubernetes conventions.</li>
        <li><strong>Owner References:</strong> Set owner references on child resources so they're automatically garbage collected when the parent is deleted.</li>
        <li><strong>RBAC:</strong> Follow the principle of least privilege. Only request the permissions your operator actually needs.</li>
        <li><strong>Error Handling:</strong> Return errors from the reconciler to trigger automatic requeue with exponential backoff.</li>
        <li><strong>Finalizers:</strong> Use finalizers for cleanup logic that must run before deletion (e.g., deleting external cloud resources).</li>
        <li><strong>Observability:</strong> Add metrics, structured logging, and events to make your operator debuggable in production.</li>
      </ul>

      <p>Kubernetes Operators are one of the most powerful patterns in the cloud-native ecosystem. They let you automate complex operational tasks, enforce best practices, and build self-healing infrastructure. With Go and the Operator SDK, you have everything you need to start building production-grade operators today.</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-04',
    readTime: '15 min read',
    tags: ['Kubernetes', 'Golang', 'DevOps', 'Operators', 'Cloud Native'],
    coverImage: '',
  },
  {
    id: '8',
    title: 'Improving Python Code Performance: Practical Tips That Actually Work',
    slug: 'improving-python-code-performance',
    excerpt: 'From profiling bottlenecks to leveraging built-in optimizations, learn proven techniques to make your Python code run significantly faster.',
    category: 'backend',
    content: `
      <p>Python is loved for its readability and developer productivity, but it's often criticized for being slow. The truth is, <strong>most Python performance issues come from how the code is written</strong>, not from the language itself. With the right techniques, you can often achieve 10x-100x speedups without leaving Python.</p>

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
    `,
    author: 'Coder Secret',
    date: '2026-04-04',
    readTime: '18 min read',
    tags: ['Python', 'Performance', 'Numba', 'Cython', 'C Extensions'],
    coverImage: '',
  },
  {
    id: '7',
    title: 'M2M Authentication: Securing Service-to-Service Communication',
    slug: 'm2m-authentication-service-to-service',
    excerpt: 'A comprehensive guide to Machine-to-Machine authentication — from OAuth 2.0 Client Credentials to mTLS, JWTs, and API keys. Learn how to secure your microservices.',
    category: 'backend',
    content: `
      <p>In a microservices world, services constantly talk to each other — fetching user data, processing payments, sending notifications. But how do you ensure that only <strong>authorized services</strong> can make these calls? That's where <strong>Machine-to-Machine (M2M) authentication</strong> comes in.</p>

      <h2>What is M2M Authentication?</h2>
      <p>M2M authentication is the process of verifying the identity of a <strong>service or application</strong> (not a human user) when it communicates with another service. Unlike user authentication where someone types a password, M2M auth happens programmatically, without any human interaction.</p>
      <p>Common scenarios include:</p>
      <ul>
        <li>A backend API calling a payment gateway</li>
        <li>A cron job fetching data from an internal service</li>
        <li>A CI/CD pipeline deploying to cloud infrastructure</li>
        <li>Microservices communicating within a cluster</li>
      </ul>

      <h2>OAuth 2.0 Client Credentials Flow</h2>
      <p>The most widely adopted standard for M2M auth is the <strong>OAuth 2.0 Client Credentials Grant</strong>. Here's how it works:</p>
      <pre><code># Step 1: Service requests an access token from the auth server
curl -X POST https://auth.example.com/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id=SERVICE_A_ID" \\
  -d "client_secret=SERVICE_A_SECRET" \\
  -d "audience=https://api.example.com"

# Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read:users write:orders"
}

# Step 2: Service uses the token to call the target API
curl -X GET https://api.example.com/users \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."</code></pre>
      <p>The target API validates the JWT token by checking the signature, expiration, audience, and scopes — all without calling the auth server again.</p>

      <h2>Implementing Client Credentials in Python</h2>
      <pre><code>import requests
from functools import lru_cache
from datetime import datetime, timedelta

class M2MClient:
    def __init__(self, client_id, client_secret, token_url, audience):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = token_url
        self.audience = audience
        self._token = None
        self._token_expiry = None

    def get_token(self):
        """Get a valid access token, refreshing if expired."""
        if self._token and self._token_expiry > datetime.utcnow():
            return self._token

        response = requests.post(self.token_url, data={
            'grant_type': 'client_credentials',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'audience': self.audience,
        })
        response.raise_for_status()
        data = response.json()

        self._token = data['access_token']
        self._token_expiry = (
            datetime.utcnow()
            + timedelta(seconds=data['expires_in'] - 30)
        )
        return self._token

    def request(self, method, url, **kwargs):
        """Make an authenticated HTTP request."""
        headers = kwargs.pop('headers', {})
        headers['Authorization'] = f'Bearer {self.get_token()}'
        return requests.request(method, url, headers=headers, **kwargs)

# Usage
client = M2MClient(
    client_id='svc-order-processor',
    client_secret='your-secret-here',
    token_url='https://auth.example.com/oauth/token',
    audience='https://api.example.com',
)
users = client.request('GET', 'https://api.example.com/users').json()</code></pre>

      <h2>Mutual TLS (mTLS)</h2>
      <p>For the highest level of security, especially within a service mesh, <strong>mutual TLS</strong> provides two-way certificate-based authentication:</p>
      <pre><code># Both client and server present certificates
import requests

response = requests.get(
    'https://internal-api.example.com/data',
    cert=('/path/to/client.crt', '/path/to/client.key'),
    verify='/path/to/ca-bundle.crt'
)</code></pre>
      <p>With mTLS, both parties verify each other's identity using X.509 certificates. Service meshes like <strong>Istio</strong> and <strong>Linkerd</strong> automate mTLS between all services in your cluster — zero code changes required.</p>

      <h2>API Keys</h2>
      <p>API keys are the simplest form of M2M auth. They're easy to implement but come with trade-offs:</p>
      <pre><code># Simple but limited
curl -X GET https://api.example.com/data \\
  -H "X-API-Key: sk_live_abc123def456"</code></pre>
      <ul>
        <li><strong>Pros:</strong> Simple to implement, easy to rotate, low overhead.</li>
        <li><strong>Cons:</strong> No built-in expiration, no scoping, no standard validation mechanism, easy to leak.</li>
      </ul>
      <p>API keys work well for simple integrations but should be combined with other measures (IP allowlisting, rate limiting) for production use.</p>

      <h2>JWT Validation on the Receiving End</h2>
      <p>When your service receives a JWT from another service, validate it properly:</p>
      <pre><code>import jwt
from jwt import PyJWKClient

# Fetch the public key from the auth server's JWKS endpoint
jwks_client = PyJWKClient("https://auth.example.com/.well-known/jwks.json")

def validate_m2m_token(token):
    """Validate an incoming M2M JWT token."""
    signing_key = jwks_client.get_signing_key_from_jwt(token)

    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        audience="https://api.example.com",
        issuer="https://auth.example.com/",
    )

    # Check scopes
    required_scope = "read:users"
    token_scopes = payload.get("scope", "").split()
    if required_scope not in token_scopes:
        raise PermissionError(f"Missing required scope: {required_scope}")

    return payload</code></pre>

      <h2>Choosing the Right Approach</h2>
      <ul>
        <li><strong>OAuth 2.0 Client Credentials:</strong> Best for most M2M scenarios. Industry standard, supports scopes, works across trust boundaries.</li>
        <li><strong>mTLS:</strong> Best for service mesh / zero-trust networks. Strongest security, but more complex to manage certificates.</li>
        <li><strong>API Keys:</strong> Best for simple, low-risk integrations. Quick to implement, but limited security features.</li>
        <li><strong>Service Accounts + RBAC:</strong> Best for Kubernetes-native services. Use Kubernetes service account tokens with RBAC policies.</li>
      </ul>

      <p>In practice, many organizations use a combination — mTLS for transport security within the mesh, plus JWT-based authorization for fine-grained access control. The key is to never let services talk to each other without authentication, no matter how "internal" the network feels.</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-03',
    readTime: '11 min read',
    tags: ['Authentication', 'Security', 'OAuth', 'Microservices', 'Python'],
    coverImage: '',
  },
  {
    id: '6',
    title: 'SSO Demystified: A Practical Guide to SAML and OIDC',
    slug: 'sso-saml-oidc-practical-guide',
    excerpt: 'Understand how Single Sign-On works under the hood. Compare SAML and OpenID Connect, learn the authentication flows, and know when to use each protocol.',
    category: 'backend',
    content: `
      <p>Single Sign-On (SSO) lets users log in once and access multiple applications without re-entering credentials. If you've ever clicked "Sign in with Google" or logged into your company's dashboard and had access to Slack, Jira, and Gmail automatically — that's SSO in action. Two protocols dominate the SSO landscape: <strong>SAML 2.0</strong> and <strong>OpenID Connect (OIDC)</strong>.</p>

      <h2>How SSO Works (The Big Picture)</h2>
      <p>Regardless of the protocol, SSO follows a common pattern:</p>
      <ul>
        <li><strong>Identity Provider (IdP):</strong> The central authority that authenticates users (e.g., Okta, Azure AD, Auth0, Google Workspace).</li>
        <li><strong>Service Provider (SP) / Relying Party (RP):</strong> The application the user wants to access (your app).</li>
        <li><strong>Trust Relationship:</strong> The SP and IdP have a pre-configured trust — they've exchanged certificates or secrets ahead of time.</li>
      </ul>
      <p>The user visits your app, gets redirected to the IdP, authenticates, and gets sent back with proof of identity. Your app trusts this proof because it trusts the IdP.</p>

      <h2>SAML 2.0 — The Enterprise Veteran</h2>
      <p>SAML (Security Assertion Markup Language) has been the backbone of enterprise SSO since 2005. It uses XML-based assertions passed between the IdP and SP.</p>

      <h2>SAML Authentication Flow</h2>
      <pre><code>1. User visits https://app.example.com (Service Provider)
2. SP generates a SAML AuthnRequest (XML)
3. User's browser is redirected to the IdP with the AuthnRequest
4. IdP authenticates the user (login page, MFA, etc.)
5. IdP generates a SAML Response containing an Assertion
   - The Assertion includes: user identity, attributes, conditions
   - The entire Response is digitally signed with IdP's private key
6. User's browser POSTs the SAML Response back to the SP's ACS URL
7. SP validates the signature, checks conditions, extracts user info
8. SP creates a session — user is logged in</code></pre>

      <h2>SAML Response Structure</h2>
      <pre><code>&lt;saml2p:Response&gt;
  &lt;saml2:Assertion&gt;
    &lt;saml2:Issuer&gt;https://idp.example.com&lt;/saml2:Issuer&gt;
    &lt;ds:Signature&gt;...digital signature...&lt;/ds:Signature&gt;
    &lt;saml2:Subject&gt;
      &lt;saml2:NameID&gt;user@example.com&lt;/saml2:NameID&gt;
    &lt;/saml2:Subject&gt;
    &lt;saml2:Conditions NotBefore="..." NotOnOrAfter="..."&gt;
      &lt;saml2:AudienceRestriction&gt;
        &lt;saml2:Audience&gt;https://app.example.com&lt;/saml2:Audience&gt;
      &lt;/saml2:AudienceRestriction&gt;
    &lt;/saml2:Conditions&gt;
    &lt;saml2:AttributeStatement&gt;
      &lt;saml2:Attribute Name="email"&gt;
        &lt;saml2:AttributeValue&gt;user@example.com&lt;/saml2:AttributeValue&gt;
      &lt;/saml2:Attribute&gt;
      &lt;saml2:Attribute Name="role"&gt;
        &lt;saml2:AttributeValue&gt;admin&lt;/saml2:AttributeValue&gt;
      &lt;/saml2:Attribute&gt;
    &lt;/saml2:AttributeStatement&gt;
  &lt;/saml2:Assertion&gt;
&lt;/saml2p:Response&gt;</code></pre>

      <h2>Implementing SAML SP in Python</h2>
      <pre><code># Using python3-saml
from onelogin.saml2.auth import OneLogin_Saml2_Auth

def saml_login(request):
    auth = OneLogin_Saml2_Auth(request, custom_base_path=settings.SAML_FOLDER)
    return redirect(auth.login())

def saml_acs(request):
    """Assertion Consumer Service — receives the SAML Response"""
    auth = OneLogin_Saml2_Auth(request, custom_base_path=settings.SAML_FOLDER)
    auth.process_response()
    errors = auth.get_errors()

    if not errors:
        user_data = {
            'email': auth.get_nameid(),
            'attributes': auth.get_attributes(),
            'session_index': auth.get_session_index(),
        }
        # Create/update user and establish session
        create_session(user_data)
        return redirect('/dashboard')
    else:
        return HttpResponse(f'SAML Error: {errors}', status=400)</code></pre>

      <h2>OpenID Connect (OIDC) — The Modern Standard</h2>
      <p>OIDC is built on top of OAuth 2.0 and uses JSON/JWT instead of XML. It was designed in 2014 as a simpler, more developer-friendly alternative to SAML.</p>

      <h2>OIDC Authorization Code Flow</h2>
      <pre><code>1. User visits https://app.example.com
2. App redirects to IdP's authorization endpoint:
   GET https://idp.example.com/authorize?
     response_type=code
     &client_id=YOUR_CLIENT_ID
     &redirect_uri=https://app.example.com/callback
     &scope=openid profile email
     &state=random_csrf_token
     &nonce=random_nonce

3. User authenticates at the IdP
4. IdP redirects back with an authorization code:
   GET https://app.example.com/callback?code=AUTH_CODE&state=random_csrf_token

5. App exchanges the code for tokens (server-to-server):
   POST https://idp.example.com/token
   {
     "grant_type": "authorization_code",
     "code": "AUTH_CODE",
     "redirect_uri": "https://app.example.com/callback",
     "client_id": "YOUR_CLIENT_ID",
     "client_secret": "YOUR_CLIENT_SECRET"
   }

6. IdP returns tokens:
   {
     "access_token": "eyJ...",
     "id_token": "eyJ...",      // Contains user identity
     "refresh_token": "eyJ...",
     "token_type": "Bearer",
     "expires_in": 3600
   }

7. App validates the id_token JWT and extracts user info</code></pre>

      <h2>The ID Token</h2>
      <p>The key differentiator of OIDC is the <strong>ID Token</strong> — a JWT containing the authenticated user's identity:</p>
      <pre><code>// Decoded ID Token payload
{
  "iss": "https://idp.example.com",
  "sub": "user-uuid-12345",
  "aud": "YOUR_CLIENT_ID",
  "exp": 1712345678,
  "iat": 1712342078,
  "nonce": "random_nonce",
  "email": "user@example.com",
  "name": "Jane Developer",
  "picture": "https://example.com/photo.jpg",
  "email_verified": true
}</code></pre>

      <h2>SAML vs OIDC — When to Use Which</h2>
      <ul>
        <li><strong>Use SAML when:</strong> Integrating with enterprise IdPs (Okta, Azure AD, ADFS), legacy systems require it, or your customers' IT teams expect SAML support. Most enterprise B2B SaaS products need SAML.</li>
        <li><strong>Use OIDC when:</strong> Building modern web/mobile apps, using social login (Google, GitHub, Apple), building consumer-facing products, or when you want simpler implementation with JWTs.</li>
        <li><strong>Support both when:</strong> Building a B2B SaaS product that serves both enterprise and smaller customers. Most identity platforms (Auth0, Okta) can act as a bridge, accepting SAML from enterprise IdPs and exposing OIDC to your app.</li>
      </ul>

      <h2>Key Differences at a Glance</h2>
      <pre><code>Feature              SAML 2.0              OIDC
──────────────────   ──────────────────    ──────────────────
Data Format          XML                   JSON / JWT
Transport            HTTP POST/Redirect    HTTP GET/POST
Token Type           XML Assertion         JWT (ID Token)
Year Introduced      2005                  2014
Best For             Enterprise SSO        Modern apps, mobile
Complexity           High                  Medium
Mobile Support       Poor                  Excellent
Discovery            Manual config         .well-known endpoint
Standard Body        OASIS                 OpenID Foundation</code></pre>

      <h2>Security Best Practices for Both</h2>
      <ul>
        <li><strong>Always validate signatures:</strong> Never trust assertions or tokens without verifying the cryptographic signature.</li>
        <li><strong>Check timestamps:</strong> Validate <code>NotBefore</code>, <code>NotOnOrAfter</code> (SAML) and <code>exp</code>, <code>iat</code> (OIDC) to prevent replay attacks.</li>
        <li><strong>Verify audience:</strong> Ensure the assertion/token was intended for your application.</li>
        <li><strong>Use HTTPS everywhere:</strong> Tokens and assertions must only travel over TLS.</li>
        <li><strong>Implement proper session management:</strong> Support single logout (SLO) and session timeouts.</li>
        <li><strong>Store secrets securely:</strong> Client secrets and private keys belong in vaults, not config files.</li>
      </ul>

      <p>SSO is no longer optional for serious applications. Whether you choose SAML, OIDC, or both, understanding these protocols deeply will help you build secure, user-friendly authentication that scales with your product.</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-03',
    readTime: '14 min read',
    tags: ['SSO', 'SAML', 'OIDC', 'Authentication', 'Security'],
    coverImage: '',
  },
  {
    id: '5',
    title: 'Cron Jobs Explained: The Complete Guide with Real-World Examples',
    slug: 'cron-jobs-complete-guide-with-examples',
    excerpt: 'Everything you need to know about cron jobs — from basic syntax to advanced scheduling patterns. Packed with practical examples anyone can follow.',
    category: 'devops',
    content: `
      <p>If you've ever wanted your computer to automatically run a task — like backing up a database every night, sending a report every Monday, or clearing temp files every hour — <strong>cron jobs</strong> are how you do it. Cron is one of the most powerful and widely-used scheduling tools in the Linux/Unix world, and once you understand it, you'll wonder how you ever lived without it.</p>

      <h2>What is a Cron Job?</h2>
      <p>A <strong>cron job</strong> is a scheduled task that runs automatically at specified times or intervals on Unix-based systems (Linux, macOS). The word "cron" comes from the Greek word <em>chronos</em>, meaning time. The cron daemon (<code>crond</code>) runs in the background and checks every minute if there's a job to execute.</p>
      <p>You define cron jobs in a file called the <strong>crontab</strong> (cron table). Each line in the crontab represents one scheduled task.</p>

      <h2>The Cron Syntax — 5 Fields</h2>
      <p>Every cron expression has exactly <strong>5 time fields</strong> followed by the command to run:</p>
      <pre><code>┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 7, where 0 and 7 = Sunday)
│ │ │ │ │
* * * * * command_to_run</code></pre>
      <p>The <code>*</code> (asterisk) means <strong>"every"</strong> — so <code>* * * * *</code> means "every minute of every hour of every day of every month on every day of the week."</p>

      <h2>Special Characters</h2>
      <p>Before we dive into examples, here are the special characters you'll use:</p>
      <ul>
        <li><code>*</code> — Every possible value (wildcard)</li>
        <li><code>,</code> — List separator (e.g., <code>1,3,5</code> means 1 and 3 and 5)</li>
        <li><code>-</code> — Range (e.g., <code>1-5</code> means 1 through 5)</li>
        <li><code>/</code> — Step value (e.g., <code>*/10</code> means every 10th unit)</li>
      </ul>

      <h2>Basic Examples — Getting Started</h2>

      <p><strong>Example 1: Run every minute</strong></p>
      <pre><code>* * * * * /home/user/scripts/check-health.sh</code></pre>
      <p>This runs <code>check-health.sh</code> every single minute, 24/7. Useful for monitoring scripts.</p>

      <p><strong>Example 2: Run every hour (at minute 0)</strong></p>
      <pre><code>0 * * * * /home/user/scripts/sync-data.sh</code></pre>
      <p>Runs at the top of every hour: 1:00, 2:00, 3:00, etc.</p>

      <p><strong>Example 3: Run once a day at midnight</strong></p>
      <pre><code>0 0 * * * /home/user/scripts/daily-backup.sh</code></pre>
      <p>Runs at exactly 00:00 (midnight) every day. Perfect for nightly backups.</p>

      <p><strong>Example 4: Run once a day at 2:30 AM</strong></p>
      <pre><code>30 2 * * * /home/user/scripts/cleanup.sh</code></pre>
      <p>Runs at 2:30 AM every day. Great for maintenance tasks during low-traffic hours.</p>

      <h2>Weekly &amp; Monthly Examples</h2>

      <p><strong>Example 5: Run every Monday at 9:00 AM</strong></p>
      <pre><code>0 9 * * 1 /home/user/scripts/weekly-report.sh</code></pre>
      <p>Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday. This sends your weekly report every Monday morning.</p>

      <p><strong>Example 6: Run every weekday (Mon-Fri) at 8:00 AM</strong></p>
      <pre><code>0 8 * * 1-5 /home/user/scripts/morning-alerts.sh</code></pre>
      <p>The <code>1-5</code> range covers Monday through Friday. No weekend noise.</p>

      <p><strong>Example 7: Run on the 1st of every month at midnight</strong></p>
      <pre><code>0 0 1 * * /home/user/scripts/monthly-invoice.sh</code></pre>
      <p>Runs at midnight on the 1st day of each month. Ideal for monthly billing, reports, or cleanup.</p>

      <p><strong>Example 8: Run on the 1st and 15th of every month</strong></p>
      <pre><code>0 0 1,15 * * /home/user/scripts/bimonthly-task.sh</code></pre>
      <p>The comma lets you specify multiple days. This runs twice a month — on the 1st and 15th.</p>

      <h2>Interval Examples — Every N Minutes/Hours</h2>

      <p><strong>Example 9: Run every 5 minutes</strong></p>
      <pre><code>*/5 * * * * /home/user/scripts/check-queue.sh</code></pre>
      <p>The <code>*/5</code> means "every 5th minute." Runs at :00, :05, :10, :15, etc.</p>

      <p><strong>Example 10: Run every 15 minutes</strong></p>
      <pre><code>*/15 * * * * /home/user/scripts/poll-api.sh</code></pre>
      <p>Runs at :00, :15, :30, :45 of every hour.</p>

      <p><strong>Example 11: Run every 2 hours</strong></p>
      <pre><code>0 */2 * * * /home/user/scripts/cache-refresh.sh</code></pre>
      <p>Runs at 00:00, 02:00, 04:00, 06:00, etc. Note the <code>0</code> in the minute field — without it, the job would run every minute during those hours!</p>

      <p><strong>Example 12: Run every 30 minutes during business hours (9 AM - 6 PM)</strong></p>
      <pre><code>*/30 9-18 * * * /home/user/scripts/business-check.sh</code></pre>
      <p>Combines a step value (<code>*/30</code>) with an hour range (<code>9-18</code>). Only runs during working hours.</p>

      <h2>Specific Time Examples</h2>

      <p><strong>Example 13: Run at 6:00 AM and 6:00 PM every day</strong></p>
      <pre><code>0 6,18 * * * /home/user/scripts/twice-daily.sh</code></pre>
      <p>The comma in the hour field gives you two specific times.</p>

      <p><strong>Example 14: Run every Sunday at 11:30 PM</strong></p>
      <pre><code>30 23 * * 0 /home/user/scripts/weekly-cleanup.sh</code></pre>
      <p>End-of-week cleanup right before Monday begins.</p>

      <p><strong>Example 15: Run at 3:15 AM on the first Monday of each month</strong></p>
      <pre><code>15 3 1-7 * 1 /home/user/scripts/first-monday.sh</code></pre>
      <p>This is a clever trick: it targets days 1-7 (first week of the month) AND Mondays. The job only fires when both conditions overlap — the first Monday.</p>

      <h2>Real-World Use Cases</h2>

      <p><strong>Example 16: Database backup every night at 3 AM</strong></p>
      <pre><code>0 3 * * * pg_dump mydb > /backups/mydb_$(date +\\%Y\\%m\\%d).sql 2>&1</code></pre>
      <p>Creates a dated backup file like <code>mydb_20260403.sql</code>. The <code>\\%</code> escaping is needed in crontab because <code>%</code> has a special meaning (newline).</p>

      <p><strong>Example 17: Clear log files older than 7 days</strong></p>
      <pre><code>0 4 * * * find /var/log/myapp -name "*.log" -mtime +7 -delete</code></pre>
      <p>Runs at 4 AM daily and removes log files older than 7 days. Keeps your disk from filling up.</p>

      <p><strong>Example 18: Restart a service every 6 hours</strong></p>
      <pre><code>0 */6 * * * systemctl restart myapp.service</code></pre>
      <p>Restarts at midnight, 6 AM, noon, and 6 PM. Useful for apps with memory leaks you haven't fixed yet.</p>

      <p><strong>Example 19: Send a disk space alert if usage exceeds 90%</strong></p>
      <pre><code>*/30 * * * * df -h / | awk 'NR==2 {if ($5+0 > 90) print "DISK ALERT: " $5 " used"}' | mail -s "Disk Alert" admin@example.com</code></pre>
      <p>Checks every 30 minutes and emails an alert if the root partition is over 90% full.</p>

      <p><strong>Example 20: Pull latest code and restart app (simple CI/CD)</strong></p>
      <pre><code>*/10 * * * * cd /var/www/myapp && git pull origin main && systemctl restart myapp</code></pre>
      <p>A simple (but effective) deploy pipeline that checks for new code every 10 minutes.</p>

      <h2>Shortcut Strings</h2>
      <p>Most cron implementations support these convenient shortcuts:</p>
      <ul>
        <li><code>@reboot</code> — Run once at startup</li>
        <li><code>@yearly</code> or <code>@annually</code> — Same as <code>0 0 1 1 *</code> (Jan 1st, midnight)</li>
        <li><code>@monthly</code> — Same as <code>0 0 1 * *</code> (1st of month, midnight)</li>
        <li><code>@weekly</code> — Same as <code>0 0 * * 0</code> (Sunday, midnight)</li>
        <li><code>@daily</code> or <code>@midnight</code> — Same as <code>0 0 * * *</code></li>
        <li><code>@hourly</code> — Same as <code>0 * * * *</code></li>
      </ul>

      <p><strong>Example 21: Run a script at system boot</strong></p>
      <pre><code>@reboot /home/user/scripts/start-services.sh</code></pre>
      <p>Perfect for starting background processes after a server reboot.</p>

      <h2>Managing Cron Jobs</h2>
      <p>Here are the essential commands for working with crontab:</p>
      <pre><code># Edit your crontab
crontab -e

# List all your cron jobs
crontab -l

# Remove all your cron jobs (use with caution!)
crontab -r

# Edit crontab for a specific user (requires root)
crontab -u username -e</code></pre>

      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li><strong>Forgetting the full path:</strong> Cron runs with a minimal environment. Always use absolute paths like <code>/usr/bin/python3</code> instead of just <code>python3</code>.</li>
        <li><strong>Not escaping %:</strong> In crontab, <code>%</code> is treated as a newline. Escape it with <code>\\%</code> when using date formats.</li>
        <li><strong>Missing output redirection:</strong> Cron emails output by default. Redirect to a file or <code>/dev/null</code> to avoid mailbox spam:</li>
      </ul>
      <pre><code># Log output to a file
0 3 * * * /scripts/backup.sh >> /var/log/backup.log 2>&1

# Discard output completely
0 3 * * * /scripts/backup.sh > /dev/null 2>&1</code></pre>
      <ul>
        <li><strong>Not setting PATH:</strong> Add a PATH variable at the top of your crontab if your scripts depend on it:</li>
      </ul>
      <pre><code>PATH=/usr/local/bin:/usr/bin:/bin
0 3 * * * backup.sh</code></pre>

      <h2>Quick Reference Cheat Sheet</h2>
      <pre><code>Expression          Description
──────────────────  ──────────────────────────────
* * * * *           Every minute
*/5 * * * *         Every 5 minutes
0 * * * *           Every hour
0 0 * * *           Every day at midnight
0 0 * * 0           Every Sunday at midnight
0 0 1 * *           First day of every month
0 0 1 1 *           Once a year (Jan 1st)
0 9-17 * * 1-5      Every hour, Mon-Fri, 9AM-5PM
*/10 * * * *        Every 10 minutes
0 6,18 * * *        At 6 AM and 6 PM
0 0 1,15 * *        1st and 15th of each month</code></pre>

      <p>Cron jobs are one of those tools that, once mastered, become an essential part of your DevOps toolkit. Whether you're automating backups, scheduling reports, managing deployments, or monitoring systems, cron has been doing it reliably for over 40 years — and it's not going anywhere.</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-03',
    readTime: '12 min read',
    tags: ['Linux', 'DevOps', 'Cron', 'Automation', 'Tutorial'],
    coverImage: '',
  },
  {
    id: '4',
    title: 'DRF API Logger: Effortless API Logging for Django REST Framework',
    slug: 'drf-api-logger-django-rest-framework',
    excerpt: 'Discover how DRF API Logger makes it dead simple to capture, monitor, and analyze every API call in your Django REST Framework application — with zero impact on response times.',
    category: 'backend',
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
      <p>Here's what the built-in analytics dashboard looks like:</p>
      <img src="https://raw.githubusercontent.com/vishalanandl177/DRF-API-Logger/master/graph.png" alt="DRF API Logger analytics dashboard showing API call graphs and charts" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>The log listing view gives you a detailed table of every API call with status codes, methods, and execution times:</p>
      <img src="https://raw.githubusercontent.com/vishalanandl177/DRF-API-Logger/master/lists.png" alt="DRF API Logger list view showing API call logs with status codes and methods" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>You can drill into any individual log entry to see the full request and response details:</p>
      <img src="https://raw.githubusercontent.com/vishalanandl177/DRF-API-Logger/master/details.png" alt="DRF API Logger detail view showing full request and response data for a single API call" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
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
];
