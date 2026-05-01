export const CONTENT = `
      <p>You've probably used Envoy without knowing it. If you've deployed to Istio, used AWS App Mesh, or run Consul Connect — Envoy was the proxy doing the actual work. It's the most important piece of infrastructure in the cloud-native world that most developers never interact with directly. Let's change that.</p>

      <h2>What is Envoy?</h2>
      <p>Envoy is a <strong>high-performance, programmable L4/L7 proxy</strong> designed for modern microservice architectures. Unlike nginx or HAProxy which are configured via static config files, Envoy is designed to be <strong>dynamically configured at runtime</strong> via APIs — no restarts needed.</p>

      <!-- Envoy vs Traditional -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Envoy vs Traditional Proxies</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">nginx / HAProxy</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C4;</span>Static config files (nginx.conf)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Reload/restart to apply changes</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Basic metrics (connections, errors)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>HTTP/1.1 primary, HTTP/2 added later</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">Envoy Proxy</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x26A1;</span>Dynamic config via xDS APIs</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Zero-downtime config updates</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Rich observability (L7 metrics, tracing, access logs)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F680;</span>HTTP/2, gRPC, WebSocket native</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Envoy's Core Concepts</h2>

      <!-- Core Concepts -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How Traffic Flows Through Envoy</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F50A;</span>Listener<span class="pipeline-step-sub">Accepts connections</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F6E0;</span>Filter Chain<span class="pipeline-step-sub">Process request</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x1F517;</span>Route<span class="pipeline-step-sub">Match destination</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x1F3AF;</span>Cluster<span class="pipeline-step-sub">Group of endpoints</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x1F4BB;</span>Endpoint<span class="pipeline-step-sub">Actual backend</span></div>
        </div>
      </div>

      <ul>
        <li><strong>Listener:</strong> A port Envoy listens on (e.g., port 8080). Accepts incoming connections.</li>
        <li><strong>Filter Chain:</strong> A pipeline of filters that process the request — TLS termination, HTTP parsing, rate limiting, auth, etc.</li>
        <li><strong>Route:</strong> Rules that match requests (by path, header, method) to a destination cluster.</li>
        <li><strong>Cluster:</strong> A named group of backend servers. Think of it like a "service" in Kubernetes.</li>
        <li><strong>Endpoint:</strong> An individual IP:port within a cluster. The actual server handling the request.</li>
      </ul>

      <pre><code># envoy.yaml — Static configuration example
static_resources:
  listeners:
    - name: http_listener
      address:
        socket_address:
          address: 0.0.0.0
          port_value: 8080
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                stat_prefix: ingress_http
                route_config:
                  name: local_route
                  virtual_hosts:
                    - name: backend
                      domains: ["*"]
                      routes:
                        # Route /api/* to the API cluster
                        - match:
                            prefix: "/api"
                          route:
                            cluster: api_service
                            timeout: 30s
                        # Route everything else to frontend
                        - match:
                            prefix: "/"
                          route:
                            cluster: frontend_service
                http_filters:
                  - name: envoy.filters.http.router
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
    - name: api_service
      type: STRICT_DNS
      load_assignment:
        cluster_name: api_service
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      address: api-backend
                      port_value: 3000

    - name: frontend_service
      type: STRICT_DNS
      load_assignment:
        cluster_name: frontend_service
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      address: frontend
                      port_value: 80</code></pre>

      <h2>What is xDS? (The Dynamic Control Plane)</h2>

      <p>The static config above works, but every change requires restarting Envoy. In production with thousands of Envoy instances, that's impossible. Enter <strong>xDS</strong> — a set of gRPC APIs that push configuration to Envoy dynamically.</p>

      <!-- xDS APIs -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">xDS Discovery Services</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:450px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">API</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">Full Name</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">What It Configures</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#3b82f6;font-weight:700">LDS</td><td style="padding:0.5rem">Listener Discovery Service</td><td style="padding:0.5rem">Which ports to listen on</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#22c55e;font-weight:700">RDS</td><td style="padding:0.5rem">Route Discovery Service</td><td style="padding:0.5rem">How to route requests (path, headers)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#f97316;font-weight:700">CDS</td><td style="padding:0.5rem">Cluster Discovery Service</td><td style="padding:0.5rem">Backend service groups</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#ef4444;font-weight:700">EDS</td><td style="padding:0.5rem">Endpoint Discovery Service</td><td style="padding:0.5rem">Individual server IPs within clusters</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#a855f7;font-weight:700">SDS</td><td style="padding:0.5rem">Secret Discovery Service</td><td style="padding:0.5rem">TLS certificates and keys</td></tr>
              <tr><td style="padding:0.5rem;color:#ec4899;font-weight:700">ADS</td><td style="padding:0.5rem">Aggregated Discovery Service</td><td style="padding:0.5rem">All of the above in one stream</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- xDS Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How xDS Works</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Envoy Proxy<span class="seq-actor-sub">(Data plane)</span></div>
            <div class="seq-actor idp">xDS Server<span class="seq-actor-sub">(Control plane)</span></div>
            <div class="seq-actor sp">Config Source<span class="seq-actor-sub">(K8s, Consul, etc.)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> Subscribe to CDS + EDS (gRPC stream)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-arrow right-23" style="--arrow-color:#7c3aed"><span class="seq-num purple">2</span> Watch for service changes</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-arrow left-23" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> New pod deployed! IP: 10.0.1.55</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">4</span> Push updated endpoints to Envoy</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#22c55e;color:#4ade80">Envoy starts routing to new pod — zero downtime!</div>
            </div>
          </div>
        </div>
      </div>

      <pre><code># Envoy bootstrap config pointing to an xDS server
# (instead of static_resources, use dynamic_resources)

dynamic_resources:
  lds_config:
    resource_api_version: V3
    api_config_source:
      api_type: GRPC
      grpc_services:
        - envoy_grpc:
            cluster_name: xds_cluster
      transport_api_version: V3

  cds_config:
    resource_api_version: V3
    api_config_source:
      api_type: GRPC
      grpc_services:
        - envoy_grpc:
            cluster_name: xds_cluster
      transport_api_version: V3

static_resources:
  clusters:
    - name: xds_cluster
      type: STRICT_DNS
      load_assignment:
        cluster_name: xds_cluster
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      address: control-plane.default.svc
                      port_value: 18000</code></pre>

      <h2>Building a Simple xDS Server (Go)</h2>

      <pre><code>// A minimal xDS control plane using go-control-plane
package main

import (
    "context"
    "log"
    "net"

    cluster "github.com/envoyproxy/go-control-plane/envoy/config/cluster/v3"
    core "github.com/envoyproxy/go-control-plane/envoy/config/core/v3"
    endpoint "github.com/envoyproxy/go-control-plane/envoy/config/endpoint/v3"
    listener "github.com/envoyproxy/go-control-plane/envoy/config/listener/v3"
    route "github.com/envoyproxy/go-control-plane/envoy/config/route/v3"
    hcm "github.com/envoyproxy/go-control-plane/envoy/extensions/filters/network/http_connection_manager/v3"
    "github.com/envoyproxy/go-control-plane/pkg/cache/v3"
    "github.com/envoyproxy/go-control-plane/pkg/server/v3"
    "google.golang.org/grpc"
    "google.golang.org/protobuf/types/known/anypb"

    discovery "github.com/envoyproxy/go-control-plane/envoy/service/discovery/v3"
)

func main() {
    // Create a snapshot cache (stores the current config)
    snapshotCache := cache.NewSnapshotCache(false, cache.IDHash{}, nil)

    // Build the configuration
    snap, _ := cache.NewSnapshot("v1",
        map[string][]cache.Resource{
            "type.googleapis.com/envoy.config.cluster.v3.Cluster": {
                makeCluster("api_service", "api-backend", 3000),
            },
        },
    )
    snapshotCache.SetSnapshot(context.Background(), "envoy-node-1", snap)

    // Start gRPC server
    grpcServer := grpc.NewServer()
    xdsServer := server.NewServer(context.Background(), snapshotCache, nil)
    discovery.RegisterAggregatedDiscoveryServiceServer(grpcServer, xdsServer)

    lis, _ := net.Listen("tcp", ":18000")
    log.Println("xDS server listening on :18000")
    grpcServer.Serve(lis)
}

// To add a new backend dynamically:
// 1. Update the snapshot with new endpoints
// 2. Call snapshotCache.SetSnapshot() with version "v2"
// 3. Envoy automatically picks up the change — no restart!</code></pre>

      <h2>Who Uses Envoy + xDS?</h2>

      <!-- Ecosystem -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Built on Envoy + xDS</div>
        <div class="hub-apps" style="max-width:600px;margin:0 auto">
          <div class="hub-app" style="animation-delay:0.1s"><span class="hub-app-icon">&#x1F578;</span>Istio<span class="hub-app-sub">Service mesh</span></div>
          <div class="hub-app" style="background:#f97316;animation-delay:0.25s"><span class="hub-app-icon">&#x1F310;</span>AWS App Mesh<span class="hub-app-sub">Managed mesh</span></div>
          <div class="hub-app" style="background:#a855f7;animation-delay:0.4s"><span class="hub-app-icon">&#x1F512;</span>Consul Connect<span class="hub-app-sub">Service mesh</span></div>
          <div class="hub-app" style="background:#ef4444;animation-delay:0.55s"><span class="hub-app-icon">&#x26A1;</span>Contour<span class="hub-app-sub">K8s ingress</span></div>
          <div class="hub-app" style="animation-delay:0.7s"><span class="hub-app-icon">&#x1F680;</span>Gloo Edge<span class="hub-app-sub">API gateway</span></div>
          <div class="hub-app" style="background:#ec4899;animation-delay:0.85s"><span class="hub-app-icon">&#x1F6E1;</span>Ambassador<span class="hub-app-sub">API gateway</span></div>
        </div>
      </div>

      <h2>When to Use Envoy</h2>
      <ul>
        <li><strong>Service mesh sidecar:</strong> Envoy runs alongside every service, handles mTLS, retries, circuit breaking, observability — transparently.</li>
        <li><strong>API gateway:</strong> Route external traffic to internal services with rate limiting, auth, and L7 routing.</li>
        <li><strong>gRPC proxy:</strong> Envoy has first-class gRPC support — load balancing, transcoding (gRPC &#x2194; HTTP/JSON), health checking.</li>
        <li><strong>Dynamic infrastructure:</strong> When backends change frequently (Kubernetes pods scaling up/down), xDS pushes updates instantly.</li>
        <li><strong>Observability backbone:</strong> Envoy emits detailed L7 metrics, distributed tracing headers (Jaeger, Zipkin), and structured access logs for every request.</li>
      </ul>

      <p>Envoy is not a replacement for nginx — it's a different tool for a different era. If you have a static website, nginx is perfect. If you have 200 microservices talking to each other with dynamic routing, mTLS, and traffic shaping — Envoy is what you need. And xDS is how you control it at scale.</p>
    `;
