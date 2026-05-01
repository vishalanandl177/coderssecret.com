export const CONTENT = `
      <p>Every new project faces the same question: how should services communicate? REST is the default choice, but GraphQL and gRPC exist for good reasons. Picking the wrong protocol means either over-fetching data across slow mobile connections or wrestling with complex schemas for a simple CRUD API.</p>

      <p>This guide gives you the knowledge to make the right choice for each situation, with real examples and honest tradeoffs.</p>

      <h2>REST: The Universal Standard</h2>

      <p>REST (Representational State Transfer) uses HTTP verbs and resource-based URLs. It is the most widely understood API style and the right default for most web applications.</p>

      <pre><code># REST API design for a blog platform

# Resources and endpoints:
GET    /api/posts              # List all posts
GET    /api/posts/42           # Get post by ID
POST   /api/posts              # Create a new post
PUT    /api/posts/42           # Replace entire post
PATCH  /api/posts/42           # Partial update
DELETE /api/posts/42           # Delete post

# Nested resources:
GET    /api/posts/42/comments  # Comments on post 42
POST   /api/posts/42/comments  # Add comment to post 42

# Filtering, sorting, pagination:
GET    /api/posts?status=published&sort=-created_at&page=2&limit=20</code></pre>

      <h3>REST Response Design</h3>

      <pre><code>// GET /api/posts/42
{
  "id": 42,
  "title": "Database Indexing Secrets",
  "slug": "database-indexing-secrets",
  "content": "...",
  "author": {
    "id": 1,
    "name": "Vishal Anand",
    "avatar_url": "/images/avatar.jpg"
  },
  "tags": ["database", "postgresql"],
  "created_at": "2026-04-27T10:00:00Z",
  "updated_at": "2026-04-27T12:30:00Z",
  "_links": {
    "self": "/api/posts/42",
    "comments": "/api/posts/42/comments",
    "author": "/api/users/1"
  }
}</code></pre>

      <h3>REST Best Practices</h3>

      <ul>
        <li><strong>Use nouns for resources, not verbs:</strong> <code>/api/posts</code> not <code>/api/getPosts</code></li>
        <li><strong>Use HTTP status codes correctly:</strong> 201 for created, 204 for no content, 404 for not found, 422 for validation errors</li>
        <li><strong>Use plural resource names:</strong> <code>/api/posts</code> not <code>/api/post</code></li>
        <li><strong>Support filtering and pagination</strong> on collection endpoints</li>
        <li><strong>Use HATEOAS links</strong> to help clients discover related resources</li>
        <li><strong>Version your API:</strong> <code>/api/v1/posts</code> or <code>Accept: application/vnd.api.v1+json</code></li>
      </ul>

      <h3>REST Limitations</h3>

      <ul>
        <li><strong>Over-fetching:</strong> GET /api/posts returns all fields even if you only need titles</li>
        <li><strong>Under-fetching:</strong> To show a post with author details and comments, you need 3 separate requests</li>
        <li><strong>No standard query language:</strong> Filtering syntax varies between every API</li>
      </ul>

      <h2>GraphQL: Ask for Exactly What You Need</h2>

      <p>GraphQL lets clients specify exactly which fields they want in a single request. The server returns precisely that shape &mdash; nothing more, nothing less.</p>

      <h3>Schema Definition</h3>

      <pre><code># GraphQL schema
type Post {
  id: ID!
  title: String!
  slug: String!
  content: String!
  excerpt: String
  author: User!
  comments: [Comment!]!
  tags: [String!]!
  createdAt: DateTime!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Comment {
  id: ID!
  body: String!
  author: User!
  createdAt: DateTime!
}

type Query {
  post(id: ID!): Post
  posts(status: PostStatus, limit: Int, offset: Int): [Post!]!
  user(id: ID!): User
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
}</code></pre>

      <h3>Client Queries</h3>

      <pre><code># Get exactly what the homepage needs (one request)
query HomePosts {
  posts(status: PUBLISHED, limit: 10) {
    id
    title
    slug
    excerpt
    author {
      name
      avatar_url
    }
    tags
    createdAt
  }
}

# Get a single post with comments (one request instead of three)
query PostDetail {
  post(id: "42") {
    title
    content
    author {
      name
      bio
    }
    comments {
      body
      author {
        name
      }
      createdAt
    }
  }
}</code></pre>

      <h3>GraphQL Best Practices</h3>

      <ul>
        <li><strong>Use DataLoader</strong> to batch and cache database queries (solves the N+1 problem)</li>
        <li><strong>Limit query depth and complexity</strong> to prevent abuse (malicious nested queries)</li>
        <li><strong>Use persisted queries</strong> in production to prevent arbitrary query injection</li>
        <li><strong>Paginate with cursor-based pagination</strong> (Relay-style connections) for large datasets</li>
      </ul>

      <h3>GraphQL Limitations</h3>

      <ul>
        <li><strong>Caching is harder:</strong> No URL-based caching (every request is POST to /graphql)</li>
        <li><strong>Complexity on the server:</strong> Resolver chains, N+1 queries, authorization per field</li>
        <li><strong>File uploads require workarounds:</strong> GraphQL is text-based, no native file support</li>
        <li><strong>Overkill for simple APIs:</strong> If you have 5 endpoints with fixed shapes, REST is simpler</li>
      </ul>

      <h2>gRPC: High-Performance Service Communication</h2>

      <p>gRPC uses Protocol Buffers (binary serialization) over HTTP/2. It is designed for <strong>service-to-service</strong> communication where performance and type safety matter more than human readability.</p>

      <h3>Protocol Buffer Schema</h3>

      <pre><code>// post.proto
syntax = "proto3";

package blog;

service PostService {
  rpc GetPost(GetPostRequest) returns (Post);
  rpc ListPosts(ListPostsRequest) returns (ListPostsResponse);
  rpc CreatePost(CreatePostRequest) returns (Post);
  rpc StreamUpdates(StreamRequest) returns (stream PostUpdate);
}

message Post {
  string id = 1;
  string title = 2;
  string content = 3;
  User author = 4;
  repeated string tags = 5;
  google.protobuf.Timestamp created_at = 6;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}

message GetPostRequest {
  string id = 1;
}

message ListPostsRequest {
  int32 page_size = 1;
  string page_token = 2;
  string status_filter = 3;
}</code></pre>

      <h3>Python gRPC Server</h3>

      <pre><code>import grpc
from concurrent import futures
import post_pb2
import post_pb2_grpc

class PostServicer(post_pb2_grpc.PostServiceServicer):
    def GetPost(self, request, context):
        post = db.get_post(request.id)
        if not post:
            context.abort(grpc.StatusCode.NOT_FOUND, "Post not found")

        return post_pb2.Post(
            id=post.id,
            title=post.title,
            content=post.content,
        )

    def StreamUpdates(self, request, context):
        """Server-side streaming: push updates in real-time"""
        for update in event_bus.subscribe("post_updates"):
            yield post_pb2.PostUpdate(
                post_id=update.id,
                action=update.action,
            )

server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
post_pb2_grpc.add_PostServiceServicer_to_server(PostServicer(), server)
server.add_insecure_port('[::]:50051')
server.start()</code></pre>

      <h3>gRPC Advantages</h3>

      <ul>
        <li><strong>10x faster serialization</strong> than JSON (binary Protocol Buffers)</li>
        <li><strong>HTTP/2:</strong> multiplexing, header compression, bidirectional streaming</li>
        <li><strong>Strong typing:</strong> Code generation from .proto files prevents contract mismatches</li>
        <li><strong>Streaming:</strong> Server streaming, client streaming, and bidirectional streaming built in</li>
      </ul>

      <h3>gRPC Limitations</h3>

      <ul>
        <li><strong>Not browser-friendly:</strong> Requires gRPC-Web proxy for browser clients</li>
        <li><strong>Not human-readable:</strong> Binary format makes debugging harder (use grpcurl for CLI testing)</li>
        <li><strong>Schema evolution is rigid:</strong> Adding required fields can break backward compatibility</li>
        <li><strong>Smaller ecosystem:</strong> Fewer tools, tutorials, and community resources than REST</li>
      </ul>

      <h2>Head-to-Head Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>REST</th>
            <th>GraphQL</th>
            <th>gRPC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data Format</td>
            <td>JSON (text)</td>
            <td>JSON (text)</td>
            <td>Protobuf (binary)</td>
          </tr>
          <tr>
            <td>Transport</td>
            <td>HTTP/1.1 or HTTP/2</td>
            <td>HTTP/1.1 or HTTP/2</td>
            <td>HTTP/2 only</td>
          </tr>
          <tr>
            <td>Browser Support</td>
            <td>Native</td>
            <td>Native</td>
            <td>Via gRPC-Web proxy</td>
          </tr>
          <tr>
            <td>Caching</td>
            <td>HTTP caching (CDN, browser)</td>
            <td>Complex (no URL-based cache)</td>
            <td>No HTTP caching</td>
          </tr>
          <tr>
            <td>Type Safety</td>
            <td>OpenAPI/Swagger (optional)</td>
            <td>Schema (built-in)</td>
            <td>Protobuf (built-in, strict)</td>
          </tr>
          <tr>
            <td>Streaming</td>
            <td>SSE (server only)</td>
            <td>Subscriptions (via WebSocket)</td>
            <td>Bidirectional (native)</td>
          </tr>
          <tr>
            <td>Payload Size</td>
            <td>Large (verbose JSON)</td>
            <td>Medium (only requested fields)</td>
            <td>Small (binary encoding)</td>
          </tr>
          <tr>
            <td>Learning Curve</td>
            <td>Low</td>
            <td>Medium</td>
            <td>High</td>
          </tr>
          <tr>
            <td>Best For</td>
            <td>Public APIs, web apps</td>
            <td>Mobile apps, complex UIs</td>
            <td>Microservices, internal APIs</td>
          </tr>
        </tbody>
      </table>

      <h2>API Versioning Strategies</h2>

      <pre><code># REST: URL versioning (most common)
GET /api/v1/posts
GET /api/v2/posts     # Breaking change? New version

# REST: Header versioning
GET /api/posts
Accept: application/vnd.myapi.v2+json

# GraphQL: No versioning needed!
# Deprecate fields instead of creating new versions
type Post {
  title: String!
  headline: String!  @deprecated(reason: "Use 'title' instead")
}

# gRPC: Package versioning in .proto
package blog.v1;     # Original
package blog.v2;     # Breaking changes</code></pre>

      <h2>Decision Framework</h2>

      <ul>
        <li><strong>Building a public API?</strong> &rarr; REST (universal, cacheable, well-understood)</li>
        <li><strong>Mobile app with complex data needs?</strong> &rarr; GraphQL (request exactly what you need, save bandwidth)</li>
        <li><strong>Microservices talking to each other?</strong> &rarr; gRPC (fast, typed, streaming)</li>
        <li><strong>Real-time bidirectional communication?</strong> &rarr; gRPC or WebSocket</li>
        <li><strong>Simple CRUD with 5-10 endpoints?</strong> &rarr; REST (do not over-engineer)</li>
        <li><strong>Dashboard with many data sources?</strong> &rarr; GraphQL (aggregate data from multiple services in one query)</li>
        <li><strong>Need maximum performance between services?</strong> &rarr; gRPC (binary protocol, HTTP/2 multiplexing)</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>REST is the right default</strong> for most web APIs &mdash; simple, cacheable, universally supported</li>
        <li><strong>GraphQL shines when clients have varied data needs</strong> &mdash; mobile vs. desktop, different pages needing different fields</li>
        <li><strong>gRPC is for service-to-service</strong> &mdash; when performance and type safety matter more than human readability</li>
        <li><strong>You can mix protocols:</strong> REST for public API, gRPC between microservices, GraphQL for your mobile app</li>
        <li><strong>Do not pick based on hype</strong> &mdash; pick based on your actual constraints (client diversity, performance needs, team expertise)</li>
        <li><strong>Good API design matters more than protocol choice</strong> &mdash; a well-designed REST API beats a poorly designed GraphQL API every time</li>
      </ul>

      <p>The best API is the one your consumers can understand and use efficiently. For most teams building web applications, REST gets you 90% of the way. Add GraphQL or gRPC when you have a specific problem they solve better &mdash; not because they are trendy.</p>
    `;
