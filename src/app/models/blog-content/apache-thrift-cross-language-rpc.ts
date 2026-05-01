export const CONTENT = `
      <p>Before gRPC existed, Facebook needed a way for their services — written in Python, C++, Java, PHP, and Erlang — to talk to each other efficiently. They built <strong>Apache Thrift</strong>, an RPC framework that generates client and server code in <strong>28+ languages</strong> from a single interface definition. Thrift has been battle-tested at Facebook scale (billions of RPC calls per second) and remains a strong choice for heterogeneous microservice architectures.</p>

      <h2>What is Apache Thrift?</h2>
      <p>Thrift is a <strong>cross-language RPC framework</strong> with three key components:</p>
      <ul>
        <li><strong>Interface Definition Language (IDL):</strong> A .thrift file that defines your data types and services — like a .proto file for gRPC.</li>
        <li><strong>Code Generator:</strong> Generates client/server stubs in your target language(s) from the IDL.</li>
        <li><strong>Runtime Library:</strong> Handles serialization (multiple protocols), transport (sockets, HTTP, memory), and server models (threaded, non-blocking, forked).</li>
      </ul>

      <!-- Thrift Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Thrift Architecture — Pluggable Layers</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Your Code (Service Handlers)<span class="layer-item-sub">Business logic — implement the generated service interface</span></div>
          <div class="layer-item" style="background:#7c3aed">Generated Code (Processor)<span class="layer-item-sub">Auto-generated from .thrift file — routes calls to your handlers</span></div>
          <div class="layer-item" style="background:#f97316">Protocol (Serialization)<span class="layer-item-sub">Binary, Compact, JSON, or custom — how data is encoded on the wire</span></div>
          <div class="layer-item" style="background:#22c55e">Transport (I/O)<span class="layer-item-sub">Socket, HTTP, framed, buffered, in-memory — how bytes are moved</span></div>
          <div class="layer-item" style="background:#ef4444">Server (Concurrency Model)<span class="layer-item-sub">Simple, threaded, non-blocking, forked — how requests are handled</span></div>
        </div>
      </div>

      <h2>Step 1: Define Your Service (.thrift)</h2>
      <pre><code>// user_service.thrift
namespace py user_service
namespace java com.example.users
namespace go users

// Enums
enum Department {
  UNKNOWN = 0,
  ENGINEERING = 1,
  MARKETING = 2,
  SALES = 3,
}

// Custom exception
exception UserNotFoundException {
  1: string message,
  2: string user_id,
}

// Data structures
struct User {
  1: required string id,
  2: required string name,
  3: required string email,
  4: optional i32 age,
  5: Department department = Department.UNKNOWN,
  6: list&lt;string&gt; roles,
  7: map&lt;string, string&gt; metadata,
}

struct CreateUserRequest {
  1: required string name,
  2: required string email,
  3: optional i32 age,
  4: Department department,
}

struct ListUsersResponse {
  1: list&lt;User&gt; users,
  2: i32 total_count,
}

// Service definition
service UserService {
  User getUser(1: string id) throws (1: UserNotFoundException e),
  User createUser(1: CreateUserRequest request),
  ListUsersResponse listUsers(1: i32 limit, 2: i32 offset),
  void deleteUser(1: string id) throws (1: UserNotFoundException e),
  bool ping(),
}</code></pre>

      <h2>Step 2: Generate Code</h2>
      <pre><code># Install Thrift compiler
# macOS:
brew install thrift

# Ubuntu:
sudo apt install thrift-compiler

# Generate Python code
thrift --gen py user_service.thrift
# Creates: gen-py/user_service/UserService.py, ttypes.py, constants.py

# Generate Java code
thrift --gen java user_service.thrift
# Creates: gen-java/com/example/users/UserService.java, User.java, etc.

# Generate Go code
thrift --gen go user_service.thrift

# Generate C++ code
thrift --gen cpp user_service.thrift

# Generate multiple languages at once
thrift --gen py --gen java --gen go user_service.thrift</code></pre>

      <h2>Step 3: Implement the Server (Python)</h2>
      <pre><code># pip install thrift
import uuid
from thrift.transport import TSocket, TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

# Import generated code
from gen_py.user_service import UserService
from gen_py.user_service.ttypes import (
    User, CreateUserRequest, ListUsersResponse,
    UserNotFoundException, Department,
)

# In-memory database
users_db = {}

class UserServiceHandler:
    def ping(self):
        return True

    def getUser(self, id):
        if id not in users_db:
            raise UserNotFoundException(
                message=f"User {id} not found",
                user_id=id,
            )
        return users_db[id]

    def createUser(self, request):
        user_id = str(uuid.uuid4())
        user = User(
            id=user_id,
            name=request.name,
            email=request.email,
            age=request.age,
            department=request.department or Department.UNKNOWN,
            roles=[],
            metadata={},
        )
        users_db[user_id] = user
        return user

    def listUsers(self, limit, offset):
        all_users = list(users_db.values())
        page = all_users[offset:offset + limit]
        return ListUsersResponse(
            users=page,
            total_count=len(all_users),
        )

    def deleteUser(self, id):
        if id not in users_db:
            raise UserNotFoundException(
                message=f"User {id} not found",
                user_id=id,
            )
        del users_db[id]

# Create and start the server
handler = UserServiceHandler()
processor = UserService.Processor(handler)
transport = TSocket.TServerSocket(host="127.0.0.1", port=9090)
tfactory = TTransport.TBufferedTransportFactory()
pfactory = TBinaryProtocol.TBinaryProtocolFactory()

server = TServer.TThreadedServer(processor, transport, tfactory, pfactory)
print("Thrift server running on port 9090")
server.serve()</code></pre>

      <h2>Step 4: Use the Client</h2>
      <pre><code>from thrift.transport import TSocket, TTransport
from thrift.protocol import TBinaryProtocol
from gen_py.user_service import UserService
from gen_py.user_service.ttypes import CreateUserRequest, Department

# Connect to the server
transport = TSocket.TSocket("localhost", 9090)
transport = TTransport.TBufferedTransport(transport)
protocol = TBinaryProtocol.TBinaryProtocol(transport)
client = UserService.Client(protocol)

transport.open()

# Ping
print(f"Server alive: {client.ping()}")  # True

# Create a user
user = client.createUser(CreateUserRequest(
    name="Alice",
    email="alice@example.com",
    age=30,
    department=Department.ENGINEERING,
))
print(f"Created: {user.id} - {user.name}")

# Get user
fetched = client.getUser(user.id)
print(f"Fetched: {fetched.name}, {fetched.email}")

# List users
response = client.listUsers(limit=10, offset=0)
print(f"Total users: {response.total_count}")
for u in response.users:
    print(f"  - {u.name} ({u.email})")

# Handle errors
try:
    client.getUser("nonexistent-id")
except Exception as e:
    print(f"Error: {e}")  # UserNotFoundException

transport.close()</code></pre>

      <h2>Thrift vs gRPC — Which Should You Choose?</h2>

      <!-- Thrift vs gRPC -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Thrift vs gRPC Comparison</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Feature</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">Apache Thrift</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff;border-radius:0 0.4rem 0 0">gRPC</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Origin</td><td style="padding:0.5rem;text-align:center;color:#f97316;font-weight:700">Facebook (2007)</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Google (2015)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Language support</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">28+ languages</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">12+ languages</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Transport</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Pluggable (TCP, HTTP, memory)</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">HTTP/2 only</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Serialization</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Pluggable (Binary, Compact, JSON)</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">Protobuf only</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Streaming</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Not built-in</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">4 types (unary, server, client, bidi)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Ecosystem</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">Mature but smaller</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Large, growing rapidly (CNCF)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Server models</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Simple, threaded, non-blocking, forked</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">Async (language-dependent)</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Best for</td><td style="padding:0.5rem;text-align:center;color:#f97316;font-weight:700">Polyglot envs, custom transports</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Cloud-native, Kubernetes, streaming</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>When to Choose Thrift</h2>
      <ul>
        <li><strong>28+ language support:</strong> If your stack includes niche languages (Erlang, Haskell, OCaml, Perl, D, Lua), Thrift has better coverage than gRPC.</li>
        <li><strong>Pluggable transports:</strong> Need to run over raw TCP sockets, shared memory, or custom transports? Thrift's transport layer is swappable.</li>
        <li><strong>Multiple serialization formats:</strong> Choose Binary (fastest), Compact (smallest), or JSON (debuggable) per-service.</li>
        <li><strong>Existing Thrift infrastructure:</strong> Many companies (Facebook/Meta, Evernote, Cassandra) already use Thrift — stick with what works.</li>
      </ul>

      <h2>When to Choose gRPC Instead</h2>
      <ul>
        <li><strong>Streaming is needed:</strong> gRPC's bidirectional streaming is built-in. Thrift requires workarounds.</li>
        <li><strong>Cloud-native/Kubernetes:</strong> gRPC has first-class support in Envoy, Istio, and most service meshes.</li>
        <li><strong>Larger ecosystem:</strong> More tutorials, more tools, more community support in 2026.</li>
        <li><strong>Starting fresh:</strong> If you're building a new system, gRPC is the safer bet for long-term ecosystem support.</li>
      </ul>

      <p>Apache Thrift remains a powerful, production-proven RPC framework. Its pluggable architecture and unmatched language support make it ideal for heterogeneous environments. If you're already in the Thrift ecosystem or need extreme flexibility in transport and serialization, Thrift is an excellent choice. For greenfield projects, evaluate both Thrift and gRPC against your specific needs — you can't go wrong with either.</p>
    `;
