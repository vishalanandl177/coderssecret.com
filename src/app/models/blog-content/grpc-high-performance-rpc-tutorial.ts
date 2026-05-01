export const CONTENT = `
      <p>REST has been the default for APIs for over a decade, but it wasn't designed for microservices talking to each other millions of times per second. <strong>gRPC</strong> (Google Remote Procedure Call) was built exactly for this — high-throughput, low-latency, strongly-typed communication between services. It's used by Google, Netflix, Slack, Square, and most serious microservice architectures.</p>

      <h2>What is gRPC?</h2>
      <p>gRPC is an open-source RPC (Remote Procedure Call) framework that uses <strong>HTTP/2</strong> for transport and <strong>Protocol Buffers (protobuf)</strong> for serialization. Instead of sending JSON over HTTP/1.1 like REST, gRPC sends compact binary data over multiplexed HTTP/2 connections.</p>

      <!-- gRPC vs REST -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">gRPC vs REST at a Glance</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x26A1; gRPC</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Format<span class="vs-row-value" style="color:#22c55e">Protobuf (binary)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Transport<span class="vs-row-value" style="color:#22c55e">HTTP/2 (multiplexed)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4DD;</span>Contract<span class="vs-row-value" style="color:#22c55e">Strict (.proto file)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Streaming<span class="vs-row-value" style="color:#22c55e">Bidirectional</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F680;</span>Speed<span class="vs-row-value" style="color:#22c55e">10x faster than REST</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E0;</span>Code gen<span class="vs-row-value" style="color:#22c55e">Auto-generated clients</span></div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F310; REST</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Format<span class="vs-row-value" style="color:#3b82f6">JSON (text)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Transport<span class="vs-row-value" style="color:#3b82f6">HTTP/1.1</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4DD;</span>Contract<span class="vs-row-value" style="color:#f97316">Loose (OpenAPI optional)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Streaming<span class="vs-row-value" style="color:#ef4444">Request-response only</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F680;</span>Speed<span class="vs-row-value" style="color:#3b82f6">Good for most use cases</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E0;</span>Code gen<span class="vs-row-value" style="color:#f97316">Manual or OpenAPI gen</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>How gRPC Works</h2>

      <!-- gRPC Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">gRPC Architecture</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#7c3aed;--i:0"><span class="pipeline-step-icon">&#x1F4DD;</span>.proto<span class="pipeline-step-sub">Define service</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:1"><span class="pipeline-step-icon">&#x2699;</span>protoc<span class="pipeline-step-sub">Generate code</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x1F4BB;</span>Server<span class="pipeline-step-sub">Implement handlers</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x1F4E1;</span>HTTP/2<span class="pipeline-step-sub">Binary transport</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x1F4F1;</span>Client<span class="pipeline-step-sub">Auto-generated stub</span></div>
        </div>
      </div>

      <h2>Step 1: Define Your Service (.proto)</h2>
      <p>Everything in gRPC starts with a <strong>.proto file</strong> — the contract between client and server:</p>
      <pre><code>// user_service.proto
syntax = "proto3";

package users;

// Service definition — like a REST controller
service UserService {
  // Unary RPC (request-response, like a normal REST call)
  rpc GetUser (GetUserRequest) returns (User);
  rpc CreateUser (CreateUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);

  // Server streaming (server sends multiple responses)
  rpc WatchUsers (WatchRequest) returns (stream UserEvent);

  // Client streaming (client sends multiple requests)
  rpc UploadUsers (stream CreateUserRequest) returns (UploadSummary);

  // Bidirectional streaming (both send multiple messages)
  rpc Chat (stream ChatMessage) returns (stream ChatMessage);
}

// Message definitions — like JSON schemas, but typed and compact
message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
  Department department = 5;
  repeated string roles = 6;  // Array of strings
  google.protobuf.Timestamp created_at = 7;
}

message GetUserRequest {
  string id = 1;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
  int32 age = 3;
  Department department = 4;
}

message ListUsersRequest {
  int32 page_size = 1;
  string page_token = 2;
  string filter = 3;  // e.g., "department=ENGINEERING"
}

message ListUsersResponse {
  repeated User users = 1;
  string next_page_token = 2;
  int32 total_count = 3;
}

enum Department {
  UNKNOWN = 0;
  ENGINEERING = 1;
  MARKETING = 2;
  SALES = 3;
  PRODUCT = 4;
}

message UserEvent {
  string event_type = 1;  // "created", "updated", "deleted"
  User user = 2;
}

message WatchRequest {
  repeated string departments = 1;
}

message UploadSummary {
  int32 created = 1;
  int32 failed = 2;
}

message ChatMessage {
  string sender = 1;
  string content = 2;
}</code></pre>

      <h2>Step 2: Generate Code</h2>
      <pre><code># Install protobuf compiler and gRPC plugins

# Python
pip install grpcio grpcio-tools
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. user_service.proto
# Generates: user_service_pb2.py (messages) + user_service_pb2_grpc.py (service stubs)

# Go
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
protoc --go_out=. --go-grpc_out=. user_service.proto

# Node.js / TypeScript
npm install @grpc/grpc-js @grpc/proto-loader
# Or use static code generation:
npm install grpc_tools_node_protoc_ts
grpc_tools_node_protoc --js_out=. --grpc_out=. --ts_out=. user_service.proto</code></pre>

      <h2>Step 3: Implement the Server (Python)</h2>
      <pre><code>import grpc
from concurrent import futures
import user_service_pb2 as pb2
import user_service_pb2_grpc as pb2_grpc

# In-memory database
users_db = {}

class UserServicer(pb2_grpc.UserServiceServicer):
    def GetUser(self, request, context):
        user = users_db.get(request.id)
        if not user:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(f"User {request.id} not found")
            return pb2.User()
        return user

    def CreateUser(self, request, context):
        import uuid
        user_id = str(uuid.uuid4())
        user = pb2.User(
            id=user_id,
            name=request.name,
            email=request.email,
            age=request.age,
            department=request.department,
        )
        users_db[user_id] = user
        return user

    def ListUsers(self, request, context):
        all_users = list(users_db.values())
        return pb2.ListUsersResponse(
            users=all_users,
            total_count=len(all_users),
        )

    # Server streaming — push events to the client
    def WatchUsers(self, request, context):
        import time
        while context.is_active():
            # In production, listen to a message queue
            time.sleep(1)
            yield pb2.UserEvent(
                event_type="heartbeat",
                user=pb2.User(name="system"),
            )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    pb2_grpc.add_UserServiceServicer_to_server(UserServicer(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("gRPC server running on port 50051")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()</code></pre>

      <h2>Step 4: Use the Client</h2>
      <pre><code>import grpc
import user_service_pb2 as pb2
import user_service_pb2_grpc as pb2_grpc

# Create a channel and stub (auto-generated client)
channel = grpc.insecure_channel("localhost:50051")
stub = pb2_grpc.UserServiceStub(channel)

# Create a user — feels like calling a local function!
user = stub.CreateUser(pb2.CreateUserRequest(
    name="Alice",
    email="alice@example.com",
    age=30,
    department=pb2.ENGINEERING,
))
print(f"Created user: {user.id} - {user.name}")

# Get a user
user = stub.GetUser(pb2.GetUserRequest(id=user.id))
print(f"Got user: {user.name}, {user.email}")

# List all users
response = stub.ListUsers(pb2.ListUsersRequest(page_size=10))
for u in response.users:
    print(f"  - {u.name} ({u.email})")

# Server streaming — watch for events
for event in stub.WatchUsers(pb2.WatchRequest(departments=["ENGINEERING"])):
    print(f"Event: {event.event_type} - {event.user.name}")
    break  # Stop after first event for demo</code></pre>

      <h2>The 4 Types of gRPC Communication</h2>

      <!-- Streaming Types -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">gRPC Communication Patterns</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Pattern</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">Description</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Unary</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Client sends 1 request, server returns 1 response</td><td style="padding:0.5rem 0.6rem;color:#22c55e;font-weight:600">CRUD operations, auth</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Server streaming</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Client sends 1 request, server streams N responses</td><td style="padding:0.5rem 0.6rem;color:#3b82f6;font-weight:600">Real-time feeds, logs, events</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Client streaming</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Client streams N requests, server returns 1 response</td><td style="padding:0.5rem 0.6rem;color:#f97316;font-weight:600">File upload, batch inserts</td></tr>
              <tr><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Bidirectional</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Both sides stream simultaneously</td><td style="padding:0.5rem 0.6rem;color:#ef4444;font-weight:600">Chat, multiplayer, live collab</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Performance: Why gRPC is Faster</h2>

      <!-- Performance comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Serialization Speed (1M messages, lower is better)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-gray" data-value="~3500ms"></div><div class="bar-chart-label">JSON</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-40 bar-blue" data-value="~1200ms"></div><div class="bar-chart-label">MessagePack</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-15 bar-green" data-value="~350ms"></div><div class="bar-chart-label">Protobuf</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-10 bar-purple" data-value="~200ms"></div><div class="bar-chart-label">FlatBuffers</div></div>
        </div>
      </div>

      <ul>
        <li><strong>Binary serialization:</strong> Protobuf is 3-10x smaller than JSON and 5-20x faster to serialize/deserialize.</li>
        <li><strong>HTTP/2 multiplexing:</strong> Multiple RPCs share a single TCP connection. No head-of-line blocking.</li>
        <li><strong>Header compression (HPACK):</strong> HTTP/2 compresses headers, reducing overhead for frequent calls.</li>
        <li><strong>Streaming:</strong> Long-lived connections for real-time data — no polling, no WebSocket hacks.</li>
        <li><strong>Code generation:</strong> Generated stubs are optimized for each language — no reflection, no runtime parsing.</li>
      </ul>

      <h2>Interceptors (Middleware for gRPC)</h2>
      <pre><code># gRPC interceptors work like Express middleware or Django middleware

class AuthInterceptor(grpc.ServerInterceptor):
    def intercept_service(self, continuation, handler_call_details):
        # Extract metadata (like HTTP headers)
        metadata = dict(handler_call_details.invocation_metadata)
        token = metadata.get("authorization", "")

        if not token.startswith("Bearer "):
            return grpc.unary_unary_rpc_method_handler(
                lambda req, ctx: self._unauthenticated(ctx)
            )
        # Validate token...
        return continuation(handler_call_details)

    def _unauthenticated(self, context):
        context.abort(grpc.StatusCode.UNAUTHENTICATED, "Invalid token")

class LoggingInterceptor(grpc.ServerInterceptor):
    def intercept_service(self, continuation, handler_call_details):
        method = handler_call_details.method
        print(f"gRPC call: {method}")
        return continuation(handler_call_details)

# Add interceptors to the server
server = grpc.server(
    futures.ThreadPoolExecutor(max_workers=10),
    interceptors=[AuthInterceptor(), LoggingInterceptor()],
)</code></pre>

      <h2>When to Use gRPC vs REST</h2>
      <div class="flow-diagram">
        <div class="flow-diagram-title">When to Use What</div>
        <div class="dtree">
          <div class="dtree-node question">What are you building?</div>
          <div class="dtree-branches">
            <div class="dtree-branch">
              <div class="dtree-label">Public API for 3rd parties?</div>
              <div class="dtree-connector blue"></div>
              <div class="dtree-answer oidc">REST<span class="dtree-answer-sub">Universal, browser-friendly</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Internal microservices?</div>
              <div class="dtree-connector green"></div>
              <div class="dtree-answer both">gRPC<span class="dtree-answer-sub">Fast, typed, streaming</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Real-time / streaming?</div>
              <div class="dtree-connector orange"></div>
              <div class="dtree-answer saml">gRPC<span class="dtree-answer-sub">Bidirectional streams</span></div>
            </div>
          </div>
        </div>
      </div>

      <p>gRPC isn't a replacement for REST — it's a complement. Use REST for public APIs where simplicity and browser compatibility matter. Use gRPC for internal service-to-service communication where performance, type safety, and streaming are critical. Many companies (including Google) use both: REST at the edge, gRPC between services.</p>
    `;
