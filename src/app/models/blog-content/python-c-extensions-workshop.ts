export const CONTENT = `
      <p>Python is wonderful for productivity, but sometimes you hit a wall — a tight loop that needs to run 100x faster, a C library you need to wrap, or a data structure that doesn't exist in pure Python. That's when <strong>C extensions</strong> come in. This workshop takes you from "never written a C extension" to "shipping a production-quality module" — step by step, with code you can run at each stage.</p>

      <!-- Python/C Boundary -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Python &#x2194; C Extension Boundary</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Python Code (your_script.py)<span class="layer-item-sub">import fastutils; fastutils.fibonacci(70)</span></div>
          <div class="layer-item" style="background:#7c3aed">CPython Interpreter<span class="layer-item-sub">Converts Python objects to C types via PyArg_ParseTuple</span></div>
          <div class="layer-item" style="background:#f97316">Your C Extension (fastutils.c)<span class="layer-item-sub">Pure C computation &#x2014; no Python overhead, 100x faster</span></div>
          <div class="layer-item" style="background:#22c55e">Result returned to Python<span class="layer-item-sub">C types converted back via Py_BuildValue / PyLong_FromLong</span></div>
        </div>
      </div>

      <!-- Workshop Steps -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Workshop Roadmap</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F44B;</span>Hello<span class="pipeline-step-sub">Step 1-2</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:1"><span class="pipeline-step-icon">&#x26A1;</span>Speed<span class="pipeline-step-sub">Step 3: Fibonacci</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#a855f7;--i:2"><span class="pipeline-step-icon">&#x1F4DD;</span>Strings<span class="pipeline-step-sub">Step 4-5</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x1F4E6;</span>Types<span class="pipeline-step-sub">Step 7: IntArray</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x1F9E0;</span>Memory<span class="pipeline-step-sub">Golden Rules</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ec4899;--i:5"><span class="pipeline-step-icon">&#x1F680;</span>Ship<span class="pipeline-step-sub">Production</span></div>
        </div>
      </div>

      <h2>What You'll Build</h2>
      <p>By the end of this workshop, you'll have built <strong>fastutils</strong> — a C extension module with:</p>
      <ul>
        <li>A fast Fibonacci function (100x faster than pure Python)</li>
        <li>A fast string reversal function</li>
        <li>A custom <code>IntArray</code> type with C-level performance</li>
        <li>Proper error handling, memory management, and documentation</li>
        <li>A <code>setup.py</code> that builds and installs the module</li>
      </ul>

      <h2>Prerequisites</h2>
      <pre><code># You need: Python 3.8+, a C compiler, Python dev headers
# Ubuntu/Debian:
sudo apt install python3-dev build-essential

# macOS (Xcode command line tools):
xcode-select --install

# Verify:
python3 -c "import sysconfig; print(sysconfig.get_path('include'))"
# Should print something like: /usr/include/python3.12</code></pre>

      <h2>Step 1 — The Minimal C Extension</h2>
      <p>Let's start with the absolute simplest C extension — a module with one function:</p>
      <pre><code>// fastutils.c — Step 1: minimal module
#include &lt;Python.h&gt;

// The C function: takes Python args, returns a Python object
static PyObject* fastutils_hello(PyObject* self, PyObject* args) {
    const char* name;

    // Parse the Python argument: "s" = string
    if (!PyArg_ParseTuple(args, "s", &name))
        return NULL;  // Exception already set by PyArg_ParseTuple

    // Build a Python string and return it
    return PyUnicode_FromFormat("Hello, %s! From C.", name);
}

// Method table: maps Python function names to C functions
static PyMethodDef fastutils_methods[] = {
    {
        "hello",                    // Python function name
        fastutils_hello,            // C function pointer
        METH_VARARGS,               // Calling convention
        "hello(name) -> str\\n\\n"  // Docstring
        "Returns a greeting from C."
    },
    {NULL, NULL, 0, NULL}  // Sentinel — marks end of array
};

// Module definition
static struct PyModuleDef fastutils_module = {
    PyModuleDef_HEAD_INIT,
    "fastutils",                           // Module name
    "High-performance utility functions",  // Module docstring
    -1,                                    // Per-interpreter state size (-1 = global)
    fastutils_methods                      // Method table
};

// Module initialization function — MUST be named PyInit_<modulename>
PyMODINIT_FUNC PyInit_fastutils(void) {
    return PyModule_Create(&fastutils_module);
}</code></pre>

      <h2>Step 2 — Build and Test</h2>
      <pre><code># setup.py
from setuptools import setup, Extension

setup(
    name="fastutils",
    version="0.1.0",
    ext_modules=[
        Extension("fastutils", sources=["fastutils.c"]),
    ],
)</code></pre>
      <pre><code># Build the extension in-place
python setup.py build_ext --inplace

# Test it
python -c "import fastutils; print(fastutils.hello('World'))"
# Output: Hello, World! From C.</code></pre>
      <p>Congratulations — you've just built your first C extension. Let's make it useful.</p>

      <h2>Step 3 — Fast Fibonacci with C Types</h2>
      <p>Now let's add a function that actually demonstrates speed. The key: we do the heavy computation in C, only converting to/from Python objects at the boundary.</p>
      <pre><code>// Add to fastutils.c

static PyObject* fastutils_fibonacci(PyObject* self, PyObject* args) {
    int n;

    // "i" = int
    if (!PyArg_ParseTuple(args, "i", &n))
        return NULL;

    // Input validation — raise ValueError for bad input
    if (n < 0) {
        PyErr_SetString(PyExc_ValueError, "n must be non-negative");
        return NULL;
    }

    // Pure C computation — no Python overhead
    unsigned long long a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        unsigned long long temp = b;
        b = a + b;
        a = temp;

        // Check for overflow
        if (a > b) {
            PyErr_SetString(PyExc_OverflowError,
                "Fibonacci number too large for unsigned long long");
            return NULL;
        }
    }

    // Convert C result back to Python int
    return PyLong_FromUnsignedLongLong(a);
}</code></pre>
      <p>Add it to the method table:</p>
      <pre><code>static PyMethodDef fastutils_methods[] = {
    {"hello", fastutils_hello, METH_VARARGS,
     "hello(name) -> str\\n\\nReturns a greeting from C."},
    {"fibonacci", fastutils_fibonacci, METH_VARARGS,
     "fibonacci(n) -> int\\n\\n"
     "Returns the nth Fibonacci number. Computed in C for maximum speed."},
    {NULL, NULL, 0, NULL}
};</code></pre>
      <p>Let's benchmark it:</p>
      <pre><code>import time
import fastutils

# Pure Python fibonacci
def fib_python(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

# Benchmark
n = 70

start = time.perf_counter()
for _ in range(1_000_000):
    fib_python(n)
python_time = time.perf_counter() - start

start = time.perf_counter()
for _ in range(1_000_000):
    fastutils.fibonacci(n)
c_time = time.perf_counter() - start

print(f"Python: {python_time:.3f}s")
print(f"C ext:  {c_time:.3f}s")
print(f"Speedup: {python_time / c_time:.1f}x")
# Typical output: ~80-120x faster</code></pre>

      <h2>Step 4 — Working with Strings</h2>
      <p>Strings require careful handling in C extensions because Python strings are Unicode objects, not simple char arrays:</p>
      <pre><code>static PyObject* fastutils_reverse(PyObject* self, PyObject* args) {
    const char* input;
    Py_ssize_t length;

    // "s#" = string + length (handles embedded nulls)
    if (!PyArg_ParseTuple(args, "s#", &input, &length))
        return NULL;

    // Allocate buffer for reversed string
    char* reversed = (char*)malloc(length + 1);
    if (!reversed) {
        PyErr_NoMemory();
        return NULL;
    }

    // Reverse in C
    for (Py_ssize_t i = 0; i < length; i++) {
        reversed[i] = input[length - 1 - i];
    }
    reversed[length] = '\\0';

    // Create Python string from C string
    PyObject* result = PyUnicode_FromStringAndSize(reversed, length);

    // ALWAYS free allocated memory
    free(reversed);

    return result;  // Can be NULL if PyUnicode_FromStringAndSize failed
}</code></pre>

      <h2>Step 5 — Working with Lists</h2>
      <p>Processing Python lists from C gives you direct access to the underlying array:</p>
      <pre><code>// Sum all numbers in a list — 10-20x faster than Python's sum() for large lists
static PyObject* fastutils_fast_sum(PyObject* self, PyObject* args) {
    PyObject* list_obj;

    if (!PyArg_ParseTuple(args, "O", &list_obj))
        return NULL;

    // Type check — ensure it's actually a list
    if (!PyList_Check(list_obj)) {
        PyErr_SetString(PyExc_TypeError, "argument must be a list");
        return NULL;
    }

    Py_ssize_t size = PyList_GET_SIZE(list_obj);
    double total = 0.0;

    for (Py_ssize_t i = 0; i < size; i++) {
        PyObject* item = PyList_GET_ITEM(list_obj, i);  // Borrowed reference

        // Convert to C double
        double value = PyFloat_AsDouble(item);
        if (value == -1.0 && PyErr_Occurred()) {
            return NULL;  // Item wasn't a number
        }
        total += value;
    }

    return PyFloat_FromDouble(total);
}</code></pre>

      <h2>Step 6 — Keyword Arguments</h2>
      <p>Real-world functions need keyword arguments. Use <code>METH_VARARGS | METH_KEYWORDS</code>:</p>
      <pre><code>static PyObject* fastutils_repeat(PyObject* self, PyObject* args, PyObject* kwargs) {
    const char* text;
    int count = 2;           // Default value
    const char* separator = "";  // Default value

    static char* kwlist[] = {"text", "count", "separator", NULL};

    // "s|is" = required string, optional int, optional string
    if (!PyArg_ParseTupleAndKeywords(args, kwargs, "s|is", kwlist,
                                      &text, &count, &separator))
        return NULL;

    if (count < 0) {
        PyErr_SetString(PyExc_ValueError, "count must be non-negative");
        return NULL;
    }

    // Build the result
    PyObject* parts = PyList_New(count);
    if (!parts) return NULL;

    for (int i = 0; i < count; i++) {
        PyObject* s = PyUnicode_FromString(text);
        if (!s) {
            Py_DECREF(parts);
            return NULL;
        }
        PyList_SET_ITEM(parts, i, s);  // Steals reference
    }

    PyObject* sep = PyUnicode_FromString(separator);
    if (!sep) {
        Py_DECREF(parts);
        return NULL;
    }

    PyObject* result = PyUnicode_Join(sep, parts);
    Py_DECREF(sep);
    Py_DECREF(parts);

    return result;
}

// In the method table, use METH_VARARGS | METH_KEYWORDS:
{"repeat", (PyCFunction)fastutils_repeat, METH_VARARGS | METH_KEYWORDS,
 "repeat(text, count=2, separator='') -> str\\n\\n"
 "Repeats text count times, joined by separator."},</code></pre>
      <pre><code># Usage from Python:
fastutils.repeat("ha", count=3, separator="-")
# Returns: "ha-ha-ha"</code></pre>

      <h2>Step 7 — Custom Types (Classes in C)</h2>
      <p>This is the most powerful feature — defining a new Python type entirely in C. Let's build an <code>IntArray</code> that stores integers in a contiguous C array:</p>
      <pre><code>// IntArray type — a fast, fixed-size integer array

typedef struct {
    PyObject_HEAD          // Required Python object header
    long* data;            // C array of longs
    Py_ssize_t length;     // Array length
} IntArrayObject;

// Destructor — called when the object is garbage collected
static void IntArray_dealloc(IntArrayObject* self) {
    free(self->data);
    Py_TYPE(self)->tp_free((PyObject*)self);
}

// Constructor — __init__
static int IntArray_init(IntArrayObject* self, PyObject* args, PyObject* kwargs) {
    PyObject* iterable;
    if (!PyArg_ParseTuple(args, "O", &iterable))
        return -1;

    PyObject* iterator = PyObject_GetIter(iterable);
    if (!iterator) return -1;

    // First pass: count elements
    Py_ssize_t count = 0;
    PyObject* item;
    PyObject* items = PySequence_List(iterable);
    if (!items) {
        Py_DECREF(iterator);
        return -1;
    }
    count = PyList_GET_SIZE(items);

    // Allocate C array
    self->data = (long*)malloc(count * sizeof(long));
    if (!self->data) {
        Py_DECREF(items);
        PyErr_NoMemory();
        return -1;
    }
    self->length = count;

    // Copy data
    for (Py_ssize_t i = 0; i < count; i++) {
        item = PyList_GET_ITEM(items, i);
        self->data[i] = PyLong_AsLong(item);
        if (self->data[i] == -1 && PyErr_Occurred()) {
            Py_DECREF(items);
            free(self->data);
            self->data = NULL;
            return -1;
        }
    }

    Py_DECREF(items);
    return 0;
}

// __len__
static Py_ssize_t IntArray_length(IntArrayObject* self) {
    return self->length;
}

// __getitem__
static PyObject* IntArray_getitem(IntArrayObject* self, Py_ssize_t index) {
    if (index < 0 || index >= self->length) {
        PyErr_SetString(PyExc_IndexError, "index out of range");
        return NULL;
    }
    return PyLong_FromLong(self->data[index]);
}

// sum() method — pure C loop over the array
static PyObject* IntArray_sum(IntArrayObject* self, PyObject* Py_UNUSED(args)) {
    long long total = 0;
    for (Py_ssize_t i = 0; i < self->length; i++) {
        total += self->data[i];
    }
    return PyLong_FromLongLong(total);
}

// __repr__
static PyObject* IntArray_repr(IntArrayObject* self) {
    if (self->length == 0)
        return PyUnicode_FromString("IntArray([])");

    PyObject* parts = PyList_New(self->length);
    for (Py_ssize_t i = 0; i < self->length; i++) {
        PyList_SET_ITEM(parts, i, PyUnicode_FromFormat("%ld", self->data[i]));
    }
    PyObject* comma = PyUnicode_FromString(", ");
    PyObject* joined = PyUnicode_Join(comma, parts);
    PyObject* result = PyUnicode_FromFormat("IntArray([%U])", joined);
    Py_DECREF(parts);
    Py_DECREF(comma);
    Py_DECREF(joined);
    return result;
}</code></pre>
      <pre><code># Usage from Python:
arr = fastutils.IntArray([10, 20, 30, 40, 50])
print(len(arr))       # 5
print(arr[2])         # 30
print(arr.sum())      # 150
print(repr(arr))      # IntArray([10, 20, 30, 40, 50])</code></pre>

      <!-- Reference Counting -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">CPython Reference Counting &#x2014; The 5 Golden Rules</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">Rule 1: Py_INCREF when you keep a reference</div><div class="timeline-item-desc">Borrowed references don't own the object &#x2014; INCREF to claim ownership</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Rule 2: Return values transfer ownership</div><div class="timeline-item-desc">Don't DECREF objects you return &#x2014; the caller owns them now</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">Rule 3: DECREF everything you create</div><div class="timeline-item-desc">If you called Py*_New/From*, you must DECREF (unless returned)</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Rule 4: Check NULL after every API call</div><div class="timeline-item-desc">NULL means an exception occurred &#x2014; clean up and return NULL</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">Rule 5: Use Py_XDECREF in cleanup paths</div><div class="timeline-item-desc">Safe with NULL pointers &#x2014; simplifies error handling</div></div>
        </div>
      </div>

      <h2>Memory Management — The Golden Rules</h2>
      <p>Memory management is where most C extension bugs live. Python uses <strong>reference counting</strong> — every object has a count of how many references point to it. When the count hits zero, the object is freed.</p>
      <pre><code>// Rule 1: Py_INCREF when you keep a reference
PyObject* obj = PyList_GetItem(list, 0);  // Borrowed reference
Py_INCREF(obj);  // Now you own a reference
// ... use obj ...
Py_DECREF(obj);  // Release when done

// Rule 2: Return values transfer ownership
return PyLong_FromLong(42);  // Caller owns the reference — don't DECREF

// Rule 3: Py_DECREF everything you create (unless you return it)
PyObject* temp = PyUnicode_FromString("hello");
// ... use temp ...
Py_DECREF(temp);  // YOU created it, YOU must free it

// Rule 4: Check for NULL after every Python API call
PyObject* result = PyObject_CallFunction(func, "i", 42);
if (result == NULL) {
    // An exception occurred — clean up and return NULL
    Py_XDECREF(other_obj);  // Py_XDECREF is safe with NULL
    return NULL;
}

// Rule 5: Use Py_XDECREF for pointers that might be NULL
Py_XDECREF(maybe_null_ptr);  // Safe — does nothing if NULL</code></pre>

      <h2>Error Handling Best Practices</h2>
      <pre><code>// Pattern 1: Validate input early, fail fast
static PyObject* my_func(PyObject* self, PyObject* args) {
    int n;
    if (!PyArg_ParseTuple(args, "i", &n))
        return NULL;

    if (n <= 0) {
        PyErr_SetString(PyExc_ValueError, "n must be positive");
        return NULL;
    }

    // ... proceed with valid input ...
}

// Pattern 2: Cleanup on error with goto
static PyObject* complex_func(PyObject* self, PyObject* args) {
    PyObject* result = NULL;
    PyObject* list = NULL;
    char* buffer = NULL;

    list = PyList_New(100);
    if (!list) goto error;

    buffer = (char*)malloc(1024);
    if (!buffer) {
        PyErr_NoMemory();
        goto error;
    }

    // ... do work ...

    result = PyUnicode_FromString(buffer);
    // Fall through to cleanup

error:
    free(buffer);
    Py_XDECREF(list);
    return result;  // NULL on error, valid object on success
}

// Pattern 3: Raise custom exceptions
static PyObject* MyError;  // Module-level exception

// In PyInit_fastutils:
MyError = PyErr_NewException("fastutils.FastError", NULL, NULL);
Py_XINCREF(MyError);
PyModule_AddObject(module, "FastError", MyError);

// Usage:
PyErr_SetString(MyError, "something went wrong in C");
return NULL;</code></pre>

      <h2>PyArg_ParseTuple Format Strings</h2>
      <p>These are your bread and butter for parsing Python arguments in C:</p>
      <pre><code>Format   C Type                Python Type
──────   ──────────────────    ──────────────────
"i"      int                   int
"l"      long                  int
"L"      long long             int
"n"      Py_ssize_t            int
"f"      float                 float
"d"      double                float
"s"      const char*           str (UTF-8 encoded)
"s#"     const char*, Py_ssize_t  str + length
"O"      PyObject*             any object
"O!"     PyObject* (type-checked)  specific type
"|"      —                     marks start of optional args
"$"      —                     marks keyword-only args

// Examples:
PyArg_ParseTuple(args, "si", &name, &count)       // str + int
PyArg_ParseTuple(args, "s|id", &s, &n, &f)        // str, optional int + double
PyArg_ParseTuple(args, "O!", &PyList_Type, &list)  // must be a list</code></pre>

      <h2>Complete setup.py for Production</h2>
      <pre><code>from setuptools import setup, Extension
import sys

# Compiler flags for performance and safety
extra_compile_args = ["-O3", "-Wall", "-Wextra"]
if sys.platform != "win32":
    extra_compile_args.append("-std=c11")

setup(
    name="fastutils",
    version="1.0.0",
    description="High-performance utility functions written in C",
    author="Your Name",
    ext_modules=[
        Extension(
            "fastutils",
            sources=["fastutils.c"],
            extra_compile_args=extra_compile_args,
        ),
    ],
    python_requires=">=3.8",
)</code></pre>
      <pre><code># Development workflow:
python setup.py build_ext --inplace  # Build for development
pip install -e .                     # Install in editable mode
python -m pytest tests/              # Run tests

# Distribution:
pip install build
python -m build                      # Creates wheel + sdist
pip install twine
twine upload dist/*                  # Publish to PyPI</code></pre>

      <h2>Debugging C Extensions</h2>
      <pre><code># Compile with debug symbols
python setup.py build_ext --inplace --debug

# Run under gdb
gdb -ex run --args python -c "import fastutils; fastutils.fibonacci(10)"

# Use Valgrind for memory leak detection
valgrind --leak-check=full python -c "
import fastutils
for i in range(10000):
    fastutils.fibonacci(i % 90)
"

# Enable Python's debug allocator
PYTHONMALLOC=debug python -c "import fastutils; ..."</code></pre>

      <h2>Best Practices Checklist</h2>
      <ul>
        <li><strong>Always check return values:</strong> Every <code>Py*</code> function can return NULL. Check it. Every time.</li>
        <li><strong>Never mix <code>malloc</code>/<code>free</code> with Python allocators:</strong> Use <code>malloc</code>/<code>free</code> for C data, <code>PyMem_Malloc</code>/<code>PyMem_Free</code> for Python-tracked memory.</li>
        <li><strong>Release the GIL for long C operations:</strong> Use <code>Py_BEGIN_ALLOW_THREADS</code> / <code>Py_END_ALLOW_THREADS</code> around pure C code so other threads can run.</li>
        <li><strong>Validate all input at the boundary:</strong> Type-check, range-check, and null-check everything that comes from Python before doing C work.</li>
        <li><strong>Write docstrings for every function:</strong> Use the <code>\\n\\n</code> convention in your method table strings — <code>help()</code> will format them correctly.</li>
        <li><strong>Test with <code>pytest</code> like any other module:</strong> Your C extension is a Python module — test it with normal Python test tools.</li>
        <li><strong>Use <code>Py_XDECREF</code> in cleanup paths:</strong> It's safe with NULL pointers, making error cleanup much simpler.</li>
        <li><strong>Compile with <code>-Wall -Wextra</code>:</strong> Let the compiler catch bugs before your users do.</li>
        <li><strong>Profile before extending:</strong> Only write C extensions for proven bottlenecks. Profile first, optimize second.</li>
      </ul>

      <p>C extensions are the ultimate escape hatch when Python isn't fast enough. They're used by every major Python library — NumPy, pandas, Pillow, cryptography, uvloop — and now you know how to build them yourself. Start small, respect the reference counting rules, and you'll be writing production-grade C extensions in no time.</p>
    `;
