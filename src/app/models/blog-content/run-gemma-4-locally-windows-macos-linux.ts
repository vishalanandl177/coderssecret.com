export const CONTENT = `
      <p>Google's <strong>Gemma 4</strong> is one of the most capable open-weight language models available — and you can run it <strong>entirely on your own computer</strong> without any cloud API, internet connection, or subscription. Your data stays local, latency is zero, and it's completely free. This guide covers every method to get Gemma 4 running on Windows, macOS, and Linux.</p>

      <h2>Gemma 4 Model Variants</h2>
      <p>Gemma 4 comes in several sizes. Choose based on your hardware:</p>

      <!-- Model Variants -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Gemma 4 Models: Pick Your Size</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#3b82f6;color:#fff;border-radius:0.4rem 0 0 0">Model</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">Parameters</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">RAM (Q4)</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">VRAM (GPU)</th>
                <th style="text-align:left;padding:0.6rem;background:#3b82f6;color:#fff;border-radius:0 0.4rem 0 0">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#22c55e;font-weight:700">Gemma 4 1B</td><td style="padding:0.5rem;text-align:center">1 billion</td><td style="padding:0.5rem;text-align:center">~2 GB</td><td style="padding:0.5rem;text-align:center">~1 GB</td><td style="padding:0.5rem">Phones, Raspberry Pi, embedded</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#3b82f6;font-weight:700">Gemma 4 4B</td><td style="padding:0.5rem;text-align:center">4 billion</td><td style="padding:0.5rem;text-align:center">~4 GB</td><td style="padding:0.5rem;text-align:center">~3 GB</td><td style="padding:0.5rem">Laptops, coding assistant, chatbots</td></tr>
              <tr style="border-bottom:1px solid var(--border);background:var(--accent)"><td style="padding:0.5rem;color:#22c55e;font-weight:700">Gemma 4 12B &#x2B50;</td><td style="padding:0.5rem;text-align:center">12 billion</td><td style="padding:0.5rem;text-align:center">~8 GB</td><td style="padding:0.5rem;text-align:center">~8 GB</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">Best balance — most users should start here</td></tr>
              <tr><td style="padding:0.5rem;color:#7c3aed;font-weight:700">Gemma 4 27B</td><td style="padding:0.5rem;text-align:center">27 billion</td><td style="padding:0.5rem;text-align:center">~18 GB</td><td style="padding:0.5rem;text-align:center">~16 GB</td><td style="padding:0.5rem">High-quality reasoning, complex tasks</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Hardware Requirements</h2>

      <!-- Hardware -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Minimum Hardware for Each Model</div>
        <div class="vs-cards" style="grid-template-columns:1fr 1fr">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F4BB; CPU-Only (No GPU)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F9E0;</span>RAM: 8 GB min (16 GB recommended)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>CPU: Any modern x86_64 or Apple Silicon</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F422;</span>Speed: 5-15 tokens/sec (4B model)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: 1B and 4B models</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x26A1; With GPU (Recommended)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AE;</span>NVIDIA: RTX 3060+ (8 GB VRAM) or RTX 4090</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F34E;</span>Apple Silicon: M1/M2/M3/M4 (unified memory)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F680;</span>Speed: 30-80+ tokens/sec (12B model)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: 12B and 27B models</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Method 1: Ollama (Easiest — Recommended)</h2>
      <p><strong>Ollama</strong> is the simplest way to run LLMs locally. One command to install, one command to run. Works on Windows, macOS, and Linux with automatic GPU detection.</p>

      <!-- Ollama Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Ollama: Install &#x2192; Pull &#x2192; Run</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F4E5;</span>Install<span class="pipeline-step-sub">One command</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F4E6;</span>Pull Model<span class="pipeline-step-sub">Downloads weights</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x1F4AC;</span>Chat<span class="pipeline-step-sub">Start talking!</span></div>
        </div>
      </div>

      <h2>macOS</h2>
      <pre><code># Install Ollama
brew install ollama

# Or download from https://ollama.com/download/mac

# Start Ollama (runs in background)
ollama serve

# Pull and run Gemma 4 12B (recommended)
ollama run gemma4:12b

# You're now chatting with Gemma 4 locally!
# >>> What is the difference between TCP and UDP?
# TCP is a connection-oriented protocol that guarantees...

# Other model sizes:
ollama run gemma4:1b     # Smallest, fastest
ollama run gemma4:4b     # Good for laptops
ollama run gemma4:27b    # Best quality (needs 18+ GB RAM)

# Apple Silicon (M1/M2/M3/M4) automatically uses Metal GPU
# You'll see: "using Metal GPU" in the logs</code></pre>

      <h2>Linux (Ubuntu / Debian / Fedora)</h2>
      <pre><code># Install Ollama (one-liner)
curl -fsSL https://ollama.com/install.sh | sh

# Start the server
ollama serve &

# Pull and run Gemma 4
ollama run gemma4:12b

# For NVIDIA GPU acceleration:
# 1. Install NVIDIA drivers (if not already)
sudo apt install nvidia-driver-550  # Ubuntu
# 2. Ollama auto-detects CUDA GPUs — no extra config needed!

# Verify GPU is being used:
ollama ps
# NAME         SIZE    PROCESSOR
# gemma4:12b   8.1 GB  100% GPU    ← Running on GPU!</code></pre>

      <h2>Windows</h2>
      <pre><code># Option 1: Download installer
# Go to https://ollama.com/download/windows
# Run OllamaSetup.exe — installs as a system service

# Option 2: winget
winget install Ollama.Ollama

# Open PowerShell or Command Prompt:
ollama run gemma4:12b

# NVIDIA GPU: Install latest NVIDIA Game Ready drivers
# Ollama auto-detects CUDA — no manual config needed

# WSL2 (alternative): Install Ollama inside WSL2 Ubuntu
wsl
curl -fsSL https://ollama.com/install.sh | sh
ollama run gemma4:12b</code></pre>

      <h2>Using Ollama as an API</h2>
      <pre><code># Ollama exposes a local REST API on port 11434
# Compatible with OpenAI API format!

# Chat completion
curl http://localhost:11434/api/chat -d '{
  "model": "gemma4:12b",
  "messages": [
    {"role": "user", "content": "Explain Kubernetes in 3 sentences"}
  ],
  "stream": false
}'

# Use from Python (with OpenAI SDK!)
# pip install openai
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # Required but ignored by Ollama
)

response = client.chat.completions.create(
    model="gemma4:12b",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Write a Python function to reverse a linked list"},
    ],
)
print(response.choices[0].message.content)

# Works with ANY OpenAI-compatible library:
# - LangChain, LlamaIndex, AutoGen, CrewAI
# Just change base_url to http://localhost:11434/v1</code></pre>

      <h2>Method 2: llama.cpp (Maximum Performance)</h2>
      <p><strong>llama.cpp</strong> is a pure C/C++ inference engine — no Python, no frameworks, maximum speed. It supports GGUF quantized models and runs on CPU, CUDA, Metal, Vulkan, and ROCm.</p>
      <pre><code># Build llama.cpp from source

# macOS (Metal GPU support)
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j

# Linux (NVIDIA CUDA)
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j

# Linux (AMD ROCm)
cmake -B build -DGGML_HIP=ON
cmake --build build --config Release -j

# Windows (Visual Studio + CUDA)
cmake -B build -DGGML_CUDA=ON -G "Visual Studio 17 2022"
cmake --build build --config Release

# Download Gemma 4 12B in GGUF format (quantized)
# From Hugging Face: search "gemma-4-12b-GGUF"
# Common quantizations:
#   Q4_K_M  — 4-bit, best speed/quality balance (~7 GB)
#   Q5_K_M  — 5-bit, better quality (~8.5 GB)
#   Q8_0    — 8-bit, near-original quality (~12 GB)
#   F16     — Full precision (~24 GB, needs lots of RAM)

# Run interactive chat
./build/bin/llama-cli \\
  -m gemma-4-12b-Q4_K_M.gguf \\
  -ngl 99 \\                      # Offload all layers to GPU
  -c 8192 \\                      # Context window (8K tokens)
  --interactive-first \\
  -p "You are a helpful assistant."

# Run as server (OpenAI-compatible API)
./build/bin/llama-server \\
  -m gemma-4-12b-Q4_K_M.gguf \\
  -ngl 99 \\
  -c 8192 \\
  --port 8080 \\
  --host 0.0.0.0

# Now accessible at http://localhost:8080/v1/chat/completions
# Same API as OpenAI — works with any OpenAI SDK</code></pre>

      <h2>Method 3: Hugging Face Transformers (Python)</h2>
      <p>Best for developers who want programmatic control, fine-tuning, or integration with ML pipelines.</p>
      <pre><code># pip install transformers torch accelerate

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load model (downloads ~8 GB on first run)
model_name = "google/gemma-4-12b"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,    # Half precision (saves VRAM)
    device_map="auto",              # Auto GPU/CPU split
)

# Generate text
prompt = "Explain how DNS works in simple terms:"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

outputs = model.generate(
    **inputs,
    max_new_tokens=500,
    temperature=0.7,
    top_p=0.9,
    do_sample=True,
)

response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(response)

# For lower VRAM: use 4-bit quantization
# pip install bitsandbytes
from transformers import BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_quant_type="nf4",
)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto",
)
# Now runs on GPUs with only 6 GB VRAM!</code></pre>

      <h2>Understanding Quantization</h2>
      <p><strong>Quantization</strong> reduces model precision from 16-bit floats to 4-bit or 8-bit integers — dramatically reducing memory usage with minimal quality loss.</p>

      <!-- Quantization Chart -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Quantization: Memory vs Quality Trade-off (Gemma 4 12B)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-red" data-value="24 GB"></div><div class="bar-chart-label">F16 (full)</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-50 bar-purple" data-value="12 GB"></div><div class="bar-chart-label">Q8_0</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-35 bar-blue" data-value="8.5 GB"></div><div class="bar-chart-label">Q5_K_M</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-28 bar-green" data-value="7 GB"></div><div class="bar-chart-label">Q4_K_M &#x2B50;</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-20 bar-orange" data-value="5 GB"></div><div class="bar-chart-label">Q3_K_M</div></div>
        </div>
      </div>

      <h2>Practical Use Cases</h2>
      <pre><code># 1. Local coding assistant (with VS Code)
# Install "Continue" extension in VS Code
# Settings: set provider to "ollama", model to "gemma4:12b"
# Now you have GitHub Copilot — but local and free!

# 2. Private document Q&A (RAG)
# pip install langchain chromadb
from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

llm = Ollama(model="gemma4:12b")
embeddings = OllamaEmbeddings(model="gemma4:12b")

# Load your documents into a vector store
vectorstore = Chroma.from_documents(documents, embeddings)

# Ask questions about YOUR data — no cloud, no data leaks
qa = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())
answer = qa.invoke("What were last quarter's revenue numbers?")

# 3. CLI chatbot
# ollama run gemma4:12b
# Just start typing — it remembers conversation context

# 4. API backend for your app
# Run: ollama serve
# Your app calls http://localhost:11434/v1/chat/completions
# Zero latency, zero cost, complete privacy</code></pre>

      <h2>Performance Tuning</h2>
      <pre><code># Ollama environment variables for tuning:

# Use more GPU layers (faster, more VRAM)
OLLAMA_NUM_GPU=99 ollama run gemma4:12b

# Limit context window (saves memory)
ollama run gemma4:12b --ctx-size 4096

# Set number of threads (CPU inference)
OLLAMA_NUM_THREADS=8 ollama run gemma4:12b

# Keep model loaded in memory (faster subsequent requests)
OLLAMA_KEEP_ALIVE=30m ollama run gemma4:12b

# Check what's running and resource usage
ollama ps
# NAME         SIZE    PROCESSOR    UNTIL
# gemma4:12b   8.1 GB  100% GPU     30 minutes

# Benchmark your setup
ollama run gemma4:12b --verbose
# Look for: "eval rate: XX tokens/s"
# Good targets:
#   CPU only:   5-15 tok/s
#   RTX 3060:   25-40 tok/s
#   RTX 4090:   60-100 tok/s
#   M3 Max:     40-60 tok/s</code></pre>

      <h2>Method Comparison</h2>

      <!-- Method Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Which Method Should You Use?</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Method</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">Ollama</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff">llama.cpp</th>
                <th style="text-align:center;padding:0.6rem;background:#a855f7;color:#fff;border-radius:0 0.4rem 0 0">Transformers</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Ease of setup</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Easiest (1 command)</td><td style="padding:0.5rem;text-align:center;color:#f97316">Medium (compile)</td><td style="padding:0.5rem;text-align:center">Medium (pip)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Performance</td><td style="padding:0.5rem;text-align:center">Great</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Best (native C++)</td><td style="padding:0.5rem;text-align:center">Good</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">API compatibility</td><td style="padding:0.5rem;text-align:center;color:#22c55e">OpenAI-compatible</td><td style="padding:0.5rem;text-align:center;color:#22c55e">OpenAI-compatible</td><td style="padding:0.5rem;text-align:center">HF API</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Fine-tuning</td><td style="padding:0.5rem;text-align:center;color:#ef4444">No</td><td style="padding:0.5rem;text-align:center;color:#ef4444">No</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Yes (LoRA, QLoRA)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">GPU support</td><td style="padding:0.5rem;text-align:center">CUDA, Metal</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">CUDA, Metal, ROCm, Vulkan</td><td style="padding:0.5rem;text-align:center">CUDA, MPS</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Best for</td><td style="padding:0.5rem;text-align:center;color:#3b82f6;font-weight:700">Most users</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Power users</td><td style="padding:0.5rem;text-align:center;color:#a855f7;font-weight:700">ML engineers</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Troubleshooting</h2>
      <ul>
        <li><strong>"Out of memory"</strong> — Use a smaller model (4B instead of 12B) or a more aggressive quantization (Q3 instead of Q4). Close other apps to free RAM.</li>
        <li><strong>"Slow generation (2 tok/s)"</strong> — You're running on CPU. Install NVIDIA drivers (Linux/Windows) or use Apple Silicon Mac for GPU acceleration.</li>
        <li><strong>"Model not found"</strong> — Check exact model name with <code>ollama list</code>. Pull the model first: <code>ollama pull gemma4:12b</code>.</li>
        <li><strong>"CUDA out of memory"</strong> — Your GPU VRAM is too small. Use <code>Q4_K_M</code> quantization, or split between GPU + CPU with <code>-ngl 20</code> (only 20 layers on GPU).</li>
        <li><strong>"Metal not available" (macOS)</strong> — Update to macOS 13.3+ and Xcode command line tools: <code>xcode-select --install</code>.</li>
      </ul>

      <p>Running LLMs locally has never been easier. With Ollama, you're one command away from having a private, free, and fast AI assistant. Start with <code>ollama run gemma4:12b</code> — it's the best balance of quality and speed for most hardware. For maximum performance, try llama.cpp. For ML research and fine-tuning, use Hugging Face Transformers. The future of AI is local.</p>
    `;
