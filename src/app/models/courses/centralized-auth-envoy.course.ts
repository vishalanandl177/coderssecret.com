import type { Course, CourseModule } from '../course.model';

interface EnvoyAuthModuleSeed {
  number: number;
  title: string;
  slug: string;
  subtitle: string;
  duration: string;
  diagramLabels: [string, string, string, string];
  objectives: string[];
  content: string;
  labTitle: string;
  labObjective: string;
  labSteps: string[];
  keyTakeaways: string[];
  productionNotes: string[];
  commonMistakes: string[];
  securityRisks: string[];
  designTradeoffs: { option: string; pros: string[]; cons: string[] }[];
  glossary: { term: string; definition: string }[];
  beforeAfter?: { before: string[]; after: string[] };
}

const CENTRAL_AUTH_INSTRUCTOR = {
  name: 'Vishal Anand',
  title: 'Senior Product Engineer & Tech Lead',
  bio: 'Creator of CodersSecret and author of production-focused courses on security, Kubernetes, distributed systems, AI infrastructure, and data platforms. Vishal teaches with concrete architecture diagrams, small examples, and operational tradeoffs.',
  github: 'https://github.com/vishalanandl177',
  achievements: [
    'Builds and explains production engineering systems through practical CodersSecret courses',
    'Writes about backend architecture, DevOps, security, Kubernetes, AI infrastructure, and data engineering',
    'Focuses on beginner-friendly explanations that still include production failure modes',
    'Created free learning paths with diagrams, labs, and operational checklists',
  ],
};

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function codeBlock(code: string): string {
  return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
}

function envoyAuthDiagram(title: string, labels: [string, string, string, string]): string {
  const [client, envoy, auth, product] = labels.map(escapeHtml);

  return `
    <svg viewBox="0 0 920 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(title)} flow diagram">
      <defs>
        <linearGradient id="authPanel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#211F26"/>
          <stop offset="100%" stop-color="#12312F"/>
        </linearGradient>
        <marker id="authArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#6FF7F5"/>
        </marker>
      </defs>
      <rect width="920" height="360" rx="28" fill="url(#authPanel)"/>
      <rect x="34" y="34" width="852" height="292" rx="24" fill="none" stroke="#CAC4D0" stroke-opacity="0.42"/>

      <text x="460" y="70" text-anchor="middle" fill="#E6E0E9" font-size="24" font-weight="800">${escapeHtml(title)}</text>
      <text x="460" y="98" text-anchor="middle" fill="#CAC4D0" font-size="13">A central Envoy edge checks identity before traffic reaches product services.</text>

      <rect x="78" y="150" width="150" height="82" rx="24" fill="#EADDFF" stroke="#D0BCFF"/>
      <text x="153" y="182" text-anchor="middle" fill="#4B287B" font-size="15" font-weight="800">${client}</text>
      <text x="153" y="205" text-anchor="middle" fill="#4B287B" font-size="11">browser or service</text>

      <rect x="294" y="132" width="154" height="118" rx="28" fill="#006A6A" stroke="#6FF7F5"/>
      <text x="371" y="178" text-anchor="middle" fill="#E5FFFF" font-size="18" font-weight="900">${envoy}</text>
      <text x="371" y="204" text-anchor="middle" fill="#C9FFFF" font-size="11">enforcement point</text>

      <rect x="512" y="132" width="154" height="118" rx="28" fill="#3D3346" stroke="#EADDFF"/>
      <text x="589" y="171" text-anchor="middle" fill="#F5ECFF" font-size="16" font-weight="900">${auth}</text>
      <text x="589" y="196" text-anchor="middle" fill="#CAC4D0" font-size="11">IdP or policy service</text>
      <text x="589" y="214" text-anchor="middle" fill="#CAC4D0" font-size="11">when needed</text>

      <rect x="724" y="150" width="150" height="82" rx="24" fill="#FFD8E4" stroke="#EFB8C8"/>
      <text x="799" y="182" text-anchor="middle" fill="#633B48" font-size="15" font-weight="800">${product}</text>
      <text x="799" y="205" text-anchor="middle" fill="#633B48" font-size="11">Kubernetes app</text>

      <path d="M228 191 H286" stroke="#6FF7F5" stroke-width="4" marker-end="url(#authArrow)"/>
      <path d="M448 191 H504" stroke="#6FF7F5" stroke-width="4" marker-end="url(#authArrow)"/>
      <path d="M666 191 H716" stroke="#6FF7F5" stroke-width="4" marker-end="url(#authArrow)"/>
      <path d="M589 132 C589 90 371 90 371 132" fill="none" stroke="#D0BCFF" stroke-width="3" stroke-dasharray="8 8"/>

      <rect x="142" y="272" width="636" height="34" rx="17" fill="#141218" stroke="#49454F"/>
      <text x="460" y="294" text-anchor="middle" fill="#E6E0E9" font-size="12" font-weight="700">Authenticate once, validate every request, authorize before forwarding.</text>
    </svg>
  `;
}

function envoyAuthModule(seed: EnvoyAuthModuleSeed): CourseModule {
  return {
    number: seed.number,
    title: seed.title,
    slug: seed.slug,
    subtitle: seed.subtitle,
    duration: seed.duration,
    objectives: seed.objectives,
    content: seed.content,
    svgDiagram: envoyAuthDiagram(seed.title, seed.diagramLabels),
    labs: [
      {
        title: seed.labTitle,
        objective: seed.labObjective,
        steps: seed.labSteps,
        duration: seed.number <= 3 ? '35-45 minutes' : seed.number <= 6 ? '45-60 minutes' : '60-90 minutes',
        difficulty: seed.number <= 3 ? 'Beginner' : seed.number <= 6 ? 'Beginner to Intermediate' : 'Production grade',
        expectedOutput: 'A small architecture diagram, Envoy YAML snippet, or decision checklist you can explain in plain English.',
      },
    ],
    keyTakeaways: seed.keyTakeaways,
    whyThisMatters: seed.subtitle,
    productionNotes: seed.productionNotes,
    commonMistakes: seed.commonMistakes,
    securityRisks: seed.securityRisks,
    designTradeoffs: seed.designTradeoffs,
    glossary: seed.glossary,
    beforeAfter: seed.beforeAfter,
    realWorldUseCases: [
      'A Kubernetes platform with many internal products that should share one login and one enforcement layer',
      'Developer portals, data tools, admin consoles, APIs, and service-to-service calls protected at the edge',
      'Migration from product-specific auth logic to centralized policy checks without rewriting every product first',
    ],
    thinkLikeAnEngineer: [
      'Which identity is making the request: a human, a service, or a federated cloud principal?',
      'Which check belongs at Envoy, and which check must remain inside the product domain model?',
      'What happens when the identity provider, JWKS endpoint, or auth service is slow or unavailable?',
    ],
    operationalStory: 'A platform team starts with five Kubernetes products: a dashboard UI, a data explorer, an admin console, a job API, and an internal reporting service. Each product implements auth differently. The course moves that system toward a central Envoy enforcement layer that validates tokens, calls an auth service when needed, and forwards only trusted identity context to products.',
    careerRelevance: 'Centralized authentication and authorization is common in platform engineering, security engineering, DevOps, API gateway, data platform, and internal developer platform work. The course teaches the vocabulary and decisions needed to discuss this architecture with product teams and security teams.',
  };
}

const envoyListenerConfig = codeBlock(`
static_resources:
  listeners:
  - name: product_edge
    address:
      socket_address:
        address: 0.0.0.0
        port_value: 8080
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: product_edge
          route_config:
            name: product_routes
            virtual_hosts:
            - name: products
              domains: ["*"]
              routes:
              - match: { prefix: "/dashboard" }
                route: { cluster: dashboard_service }
              - match: { prefix: "/data" }
                route: { cluster: data_explorer_service }
          http_filters:
          - name: envoy.filters.http.router
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
  clusters:
  - name: dashboard_service
    connect_timeout: 1s
    type: STRICT_DNS
    load_assignment:
      cluster_name: dashboard_service
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              socket_address: { address: dashboard.default.svc.cluster.local, port_value: 8080 }
`);

const envoyJwtConfig = codeBlock(`
http_filters:
- name: envoy.filters.http.jwt_authn
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.jwt_authn.v3.JwtAuthentication
    providers:
      platform_idp:
        issuer: https://login.example.com
        audiences:
        - product-platform
        remote_jwks:
          http_uri:
            uri: https://login.example.com/.well-known/jwks.json
            cluster: platform_idp_jwks
            timeout: 2s
          cache_duration: 300s
        forward: true
        payload_in_metadata: verified_jwt
    rules:
    - match: { prefix: "/api/" }
      requires:
        provider_name: platform_idp
- name: envoy.filters.http.router
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
`);

const envoyExtAuthzConfig = codeBlock(`
http_filters:
- name: envoy.filters.http.ext_authz
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.ext_authz.v3.ExtAuthz
    transport_api_version: V3
    grpc_service:
      envoy_grpc:
        cluster_name: central_authz_service
      timeout: 250ms
    include_peer_certificate: true
    failure_mode_allow: false
- name: envoy.filters.http.router
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

clusters:
- name: central_authz_service
  type: STRICT_DNS
  connect_timeout: 500ms
  http2_protocol_options: {}
  load_assignment:
    cluster_name: central_authz_service
    endpoints:
    - lb_endpoints:
      - endpoint:
          address:
            socket_address:
              address: authz.platform.svc.cluster.local
              port_value: 9000
`);

const envoyHeaderConfig = codeBlock(`
request_headers_to_add:
- header:
    key: x-platform-user
    value: "%DYNAMIC_METADATA(envoy.filters.http.jwt_authn:verified_jwt.sub)%"
  append_action: OVERWRITE_IF_EXISTS_OR_ADD
- header:
    key: x-platform-tenant
    value: "%DYNAMIC_METADATA(envoy.filters.http.jwt_authn:verified_jwt.tenant)%"
  append_action: OVERWRITE_IF_EXISTS_OR_ADD
request_headers_to_remove:
- authorization
- cookie
`);

const envoyResilienceConfig = codeBlock(`
clusters:
- name: central_authz_service
  type: STRICT_DNS
  connect_timeout: 300ms
  circuit_breakers:
    thresholds:
    - priority: DEFAULT
      max_connections: 500
      max_pending_requests: 1000
      max_requests: 2000
  outlier_detection:
    consecutive_5xx: 5
    interval: 5s
    base_ejection_time: 30s
  load_assignment:
    cluster_name: central_authz_service
    endpoints:
    - lb_endpoints:
      - endpoint:
          address:
            socket_address:
              address: authz.platform.svc.cluster.local
              port_value: 9000
`);

const ENVOY_AUTH_MODULES: CourseModule[] = [
  envoyAuthModule({
    number: 1,
    title: 'Google-Style Login for Many Kubernetes Products',
    slug: 'google-style-login-kubernetes-products',
    subtitle: 'Start with the Gmail, YouTube, and Google mental model: one account, many products, consistent identity.',
    duration: '70 minutes',
    diagramLabels: ['User', 'Envoy', 'IdP', 'Products'],
    objectives: [
      'Explain centralized authentication using the explicit Google, Gmail, and YouTube example',
      'Map the same idea to Kubernetes products behind a shared Envoy edge',
      'Separate login, token validation, authorization, and product-specific permissions',
      'Decide what should be centralized and what should stay inside each product',
    ],
    content: `
      <h2>The Beginner Mental Model</h2>
      <p>When you log in to Google once, you can open Gmail, YouTube, Drive, Calendar, and other Google products without signing in again for every product. That does not mean every product has the same permissions. It means there is a shared identity system and each product can trust who you are.</p>
      <p>We want the same idea for a Kubernetes platform. A company may run a developer portal, data explorer, admin UI, reporting service, internal API, and job runner. Without a central design, every product adds its own login page, token parser, permission code, and audit format. That creates duplicate bugs and inconsistent security.</p>

      <h2>The Kubernetes Version</h2>
      <p>Put plain Envoy at the platform edge. Envoy receives traffic first, checks the request, validates what it can locally, asks a central authorization service when policy needs a decision, and only then forwards the request to the product service.</p>
      <p>The product still owns business rules such as "can this user delete this invoice?" or "can this analyst open this table?" Envoy owns the shared front-door checks: is there a valid identity, is the token from a trusted issuer, is the audience correct, is the request allowed to reach this product, and what identity context should be forwarded.</p>

      <h2>What Gets Centralized</h2>
      <ul>
        <li>Login and SSO entry points for humans.</li>
        <li>JWT validation with trusted issuers and JWKS keys.</li>
        <li>Service-token validation for machines.</li>
        <li>Basic route-level authorization such as product, tenant, environment, or role.</li>
        <li>Audit context such as user ID, service ID, request ID, tenant, and policy decision.</li>
      </ul>

      <h2>What Should Not Be Centralized Blindly</h2>
      <p>Do not move every business rule to the edge. Envoy should not know every data row, invoice state, or product-specific workflow. Centralize cross-product policy and identity enforcement. Keep domain-level authorization close to the service that owns the data.</p>

      <h2>First Architecture Sketch</h2>
      <p>Start with this simple flow: user or service sends a request, Envoy checks identity, Envoy asks an auth service when the decision is not purely local, then the product receives a trusted request with identity context.</p>
    `,
    labTitle: 'Draw the Product Map',
    labObjective: 'Create a beginner-friendly platform map with five products and one central Envoy auth entry point.',
    labSteps: [
      'List five Kubernetes products: dashboard UI, data explorer, admin console, job API, and reporting service',
      'Mark which products need browser SSO',
      'Mark which products need API access tokens',
      'Mark which products need service-to-service tokens',
      'Draw Envoy in front and label which checks happen centrally',
    ],
    keyTakeaways: [
      'The Google analogy is one login and many products, not one permission model for everything',
      'Plain Envoy is a strong central enforcement point for Kubernetes products',
      'Products still own business authorization decisions that depend on product data',
    ],
    productionNotes: [
      'Use one platform identity contract so every product receives identity context in the same shape',
      'Start with a small product set before migrating every internal application',
      'Write down which authorization checks are central and which remain product-owned',
    ],
    commonMistakes: [
      'Confusing centralized login with centralized ownership of every permission',
      'Letting each product parse identity differently',
      'Forwarding raw tokens to every product when only verified identity context is needed',
    ],
    securityRisks: [
      'One weak product-specific auth implementation can become a platform-wide entry point',
      'Inconsistent audit fields make incident response slow',
      'Over-centralized policy can accidentally grant access to data the policy service does not understand',
    ],
    designTradeoffs: [
      {
        option: 'Central Envoy enforcement',
        pros: ['Consistent identity checks', 'One place for common policy', 'Easier audit and migration'],
        cons: ['Envoy and the auth service become critical path components', 'Bad central policy can affect many products'],
      },
      {
        option: 'Each product owns all auth',
        pros: ['Simple for one product', 'Product team has full control'],
        cons: ['Duplicated logic', 'Inconsistent security', 'Harder to audit and scale across products'],
      },
    ],
    glossary: [
      { term: 'Authentication', definition: 'Proving who or what is making the request.' },
      { term: 'Authorization', definition: 'Deciding what that identity is allowed to do.' },
      { term: 'SSO', definition: 'Single sign-on; a user logs in once and can access multiple trusted products.' },
      { term: 'Envoy', definition: 'A high-performance proxy often used as an API gateway, edge proxy, or service mesh data plane.' },
    ],
    beforeAfter: {
      before: ['Every product has its own login logic', 'Audit fields differ by product', 'Security teams review five auth implementations'],
      after: ['Envoy enforces a shared identity contract', 'Products receive consistent identity context', 'Security teams review one central pattern plus product-specific permissions'],
    },
  }),
  envoyAuthModule({
    number: 2,
    title: 'Auth Vocabulary: SSO, SAML, OIDC, JWT, JWKS, and Tokens',
    slug: 'auth-vocabulary-sso-saml-oidc-jwt-jwks-tokens',
    subtitle: 'Learn the words first so the architecture stops feeling mysterious.',
    duration: '85 minutes',
    diagramLabels: ['Identity', 'Token', 'Keys', 'Policy'],
    objectives: [
      'Define SSO, SAML, OIDC, OAuth 2.0, JWT, JWKS, access tokens, and service tokens',
      'Explain the difference between authentication and authorization',
      'Understand why issuer, audience, expiry, signature, and scopes matter',
      'Know which standards are used for humans and which are used for services',
    ],
    content: `
      <h2>Authentication vs Authorization</h2>
      <p>Authentication answers: who are you? Authorization answers: what are you allowed to do? A user can be correctly authenticated and still be denied access to a product, tenant, or action.</p>

      <h2>Human Login Standards</h2>
      <table>
        <thead><tr><th>Term</th><th>Beginner definition</th><th>Where it appears</th></tr></thead>
        <tbody>
          <tr><td>SSO</td><td>One login session used across multiple products.</td><td>Google account across Gmail and YouTube; company IdP across internal apps.</td></tr>
          <tr><td>OIDC</td><td>OpenID Connect; a login layer on top of OAuth 2.0 that gives applications identity information.</td><td>Modern web and mobile login.</td></tr>
          <tr><td>SAML</td><td>An older but widely used enterprise SSO standard using signed XML assertions.</td><td>Enterprise SaaS and corporate identity providers.</td></tr>
        </tbody>
      </table>

      <h2>Token Terms</h2>
      <table>
        <thead><tr><th>Term</th><th>Meaning</th><th>Common mistake</th></tr></thead>
        <tbody>
          <tr><td>JWT</td><td>A signed JSON token containing claims such as subject, issuer, audience, expiry, and scopes.</td><td>Trusting the JSON without verifying the signature and issuer.</td></tr>
          <tr><td>JWKS</td><td>A JSON Web Key Set; public keys used to verify JWT signatures.</td><td>Not caching keys or not handling key rotation.</td></tr>
          <tr><td>Access token</td><td>A token a client presents to call an API.</td><td>Using it as a long-lived password.</td></tr>
          <tr><td>Service token</td><td>A machine identity token used by one service to call another.</td><td>Sharing one token across many services.</td></tr>
          <tr><td>Federated credential</td><td>A temporary credential issued because a trusted identity was exchanged for cloud or data-platform access.</td><td>Giving broad static credentials when short-lived scoped credentials would be safer.</td></tr>
        </tbody>
      </table>

      <h2>Claims That Matter</h2>
      <p>For production JWT validation, the minimum checks are signature, issuer, audience, expiry, and intended use. The <code>sub</code> claim names the subject. The <code>iss</code> claim names the issuer. The <code>aud</code> claim tells which application or API the token was meant for. The <code>exp</code> claim limits token lifetime.</p>

      <h2>Where Envoy Fits</h2>
      <p>Envoy can validate JWTs locally with JWKS through the JWT authn filter. Envoy can also call an external authorization service through the ext_authz filter. Full SAML and OIDC login flows usually involve an identity provider and an auth service; Envoy should be treated as the enforcement point, not the complete identity provider.</p>
    `,
    labTitle: 'Build the Auth Glossary',
    labObjective: 'Create a one-page glossary that a beginner teammate can use during design review.',
    labSteps: [
      'Write one-line definitions for SSO, SAML, OIDC, JWT, JWKS, access token, service token, and federated credential',
      'Add one example product request for each token type',
      'Mark which terms belong to human login and which belong to service calls',
      'Write one sentence explaining why authentication is not the same as authorization',
    ],
    keyTakeaways: [
      'Authentication proves identity; authorization decides permissions',
      'OIDC and SAML are login standards; JWT and JWKS are token validation building blocks',
      'Envoy can validate tokens and enforce policy, but an IdP or auth service owns login protocol details',
    ],
    productionNotes: [
      'Always document accepted issuers and audiences per route',
      'Use short token lifetimes and key rotation instead of long-lived shared secrets',
      'Keep token claims small; large tokens increase request size and can leak unnecessary data',
    ],
    commonMistakes: [
      'Treating any JWT as trusted because it is base64-looking text',
      'Accepting tokens minted for another audience',
      'Using one service token for many unrelated workloads',
    ],
    securityRisks: [
      'Missing audience validation can let a token for one product call another product',
      'Long-lived tokens are difficult to revoke after leakage',
      'Broad federated credentials can turn a small web bug into a data-platform incident',
    ],
    designTradeoffs: [
      {
        option: 'JWT validation at Envoy',
        pros: ['Fast local checks after JWKS cache is warm', 'Consistent issuer and audience checks', 'Products receive trusted identity context'],
        cons: ['Complex per-resource authorization still needs product or auth-service logic', 'Bad JWKS or issuer config can block traffic'],
      },
      {
        option: 'Opaque token introspection on every request',
        pros: ['Central revocation is easier', 'Token contents are not exposed to clients'],
        cons: ['Adds network call latency', 'Auth service availability becomes more critical'],
      },
    ],
    glossary: [
      { term: 'OIDC', definition: 'OpenID Connect, a standard login layer for identifying users.' },
      { term: 'SAML', definition: 'Security Assertion Markup Language, an enterprise SSO standard using signed assertions.' },
      { term: 'JWT', definition: 'JSON Web Token, a signed token carrying claims.' },
      { term: 'JWKS', definition: 'JSON Web Key Set, the public keys used to verify JWT signatures.' },
    ],
  }),
  envoyAuthModule({
    number: 3,
    title: 'Plain Envoy as the Central Front Door',
    slug: 'plain-envoy-central-front-door',
    subtitle: 'Route product traffic through a single Envoy edge before adding auth filters.',
    duration: '80 minutes',
    diagramLabels: ['Client', 'Envoy', 'Routes', 'Apps'],
    objectives: [
      'Read a plain Envoy listener, route, and cluster configuration',
      'Understand where HTTP filters run in the request path',
      'Map Kubernetes services to Envoy clusters',
      'Prepare a safe place to add JWT and external authorization filters',
    ],
    content: `
      <h2>Why Start Without Auth?</h2>
      <p>Before adding security filters, you need to know where traffic enters, which route matches, and which upstream service receives the request. If routing is confusing, auth debugging becomes painful.</p>

      <h2>Plain Envoy Pieces</h2>
      <ul>
        <li><strong>Listener:</strong> where Envoy accepts traffic.</li>
        <li><strong>HTTP connection manager:</strong> the HTTP processing pipeline.</li>
        <li><strong>Route:</strong> how a path such as <code>/dashboard</code> maps to a product service.</li>
        <li><strong>Cluster:</strong> the upstream service Envoy forwards to.</li>
        <li><strong>HTTP filters:</strong> the ordered checks that run before routing, such as JWT authn, ext_authz, and router.</li>
      </ul>

      <h2>Starter Envoy YAML</h2>
      <p>This is a small teaching config. It shows where product routes and filters live; a production config should be generated, reviewed, and deployed through your platform pipeline.</p>
      ${envoyListenerConfig}

      <h2>Where Auth Filters Go</h2>
      <p>Auth filters must run before the router filter. If the router runs first, the request reaches the product before identity and policy checks happen. The normal order is JWT validation, external authorization if needed, then router.</p>

      <h2>Kubernetes Deployment Shape</h2>
      <p>In Kubernetes, Envoy can run as an ingress-like edge deployment, a dedicated gateway, or part of a larger platform entry layer. This course uses a plain Envoy gateway mental model so you can understand the filters before adding a service mesh or managed gateway.</p>
    `,
    labTitle: 'Annotate the Envoy Request Path',
    labObjective: 'Label every part of a basic Envoy config and explain how a request reaches a Kubernetes product.',
    labSteps: [
      'Circle the listener port',
      'Underline the two product routes',
      'Mark the router filter as the final filter',
      'Draw dashboard.default.svc.cluster.local as an upstream Kubernetes service',
      'Write where JWT and ext_authz filters should be inserted',
    ],
    keyTakeaways: [
      'Plain Envoy routes traffic through listeners, filters, routes, and clusters',
      'Auth filters run before the router filter',
      'Understanding routing first makes auth debugging much easier',
    ],
    productionNotes: [
      'Treat Envoy config as production code with review, tests, and rollback',
      'Use generated config or templates when many products share the same auth pattern',
      'Expose per-route metrics so auth failures can be traced to the product route',
    ],
    commonMistakes: [
      'Adding auth filters after the router filter',
      'Using broad prefix routes that accidentally match sensitive admin paths',
      'Debugging auth before proving the route and cluster work',
    ],
    securityRisks: [
      'A route accidentally missing filters can bypass central auth',
      'A catch-all route can expose internal services if not reviewed',
      'Headers from the client can spoof identity if Envoy does not remove and rewrite trusted headers',
    ],
    designTradeoffs: [
      {
        option: 'One shared Envoy gateway',
        pros: ['Simple mental model', 'Consistent platform policy', 'Easy to audit central filters'],
        cons: ['Gateway config can become large', 'Requires strong ownership and change control'],
      },
      {
        option: 'Per-product Envoy gateways',
        pros: ['Product teams can ship independently', 'Smaller configs'],
        cons: ['Policy drift is easier', 'More gateways to patch and observe'],
      },
    ],
    glossary: [
      { term: 'Listener', definition: 'The network address and port where Envoy accepts incoming traffic.' },
      { term: 'Route', definition: 'An Envoy rule that maps request paths or hosts to upstream clusters.' },
      { term: 'Cluster', definition: 'An upstream service group that Envoy can send traffic to.' },
      { term: 'HTTP filter', definition: 'A processing step in Envoy that can inspect, reject, modify, or forward HTTP requests.' },
    ],
  }),
  envoyAuthModule({
    number: 4,
    title: 'JWT and JWKS Validation at Envoy',
    slug: 'jwt-jwks-validation-envoy',
    subtitle: 'Use Envoy jwt_authn to verify signed tokens before requests reach product APIs.',
    duration: '95 minutes',
    diagramLabels: ['Token', 'Envoy', 'JWKS', 'API'],
    objectives: [
      'Configure Envoy to validate JWT issuer, audience, expiry, and signature',
      'Understand remote JWKS and key rotation at a beginner level',
      'Forward verified token payload safely through dynamic metadata',
      'Know when JWT validation is enough and when ext_authz is still needed',
    ],
    content: `
      <h2>The Request Flow</h2>
      <p>A user or service sends an access token in the <code>Authorization</code> header. Envoy checks the token signature using public keys from the JWKS endpoint. Envoy also checks issuer, audience, and expiry. If the token is invalid, the request stops at the edge.</p>

      <h2>Envoy JWT Authn Example</h2>
      <p>This config validates JWTs for API routes. It is a teaching example: replace issuer, audience, cluster names, and routing with your real platform values.</p>
      ${envoyJwtConfig}

      <h2>What Envoy Can Decide Locally</h2>
      <ul>
        <li>The token is signed by a trusted key.</li>
        <li>The issuer is allowed.</li>
        <li>The token is meant for this platform or API audience.</li>
        <li>The token has not expired.</li>
      </ul>

      <h2>What Envoy Should Not Guess</h2>
      <p>JWT validation does not automatically mean the user can perform every action. If the API needs row-level, tenant-level, billing-plan, or product-object permissions, call an authorization service or let the product perform a domain-specific check.</p>

      <h2>JWKS Caching</h2>
      <p>JWKS caching keeps token verification fast. The tradeoff is key-rotation timing. Your IdP, Envoy cache duration, and emergency key revocation process must be designed together.</p>
    `,
    labTitle: 'Write a JWT Validation Checklist',
    labObjective: 'Turn JWT validation into a repeatable review checklist for every product API route.',
    labSteps: [
      'Choose an issuer value for your platform IdP',
      'Choose an audience value for product APIs',
      'List which routes require JWT validation',
      'Decide how long JWKS should be cached',
      'Write what happens when the JWT is missing, expired, or signed by an unknown key',
    ],
    keyTakeaways: [
      'Envoy can validate JWTs locally with JWKS',
      'Issuer, audience, expiry, and signature checks are non-negotiable',
      'JWT validation proves token validity, not all business permissions',
    ],
    productionNotes: [
      'Monitor JWT validation failures by route and issuer',
      'Keep JWKS cache duration short enough for practical key rotation but long enough to avoid IdP pressure',
      'Use different audiences for UI, API, and machine-to-machine tokens where possible',
    ],
    commonMistakes: [
      'Checking the signature but not the audience',
      'Accepting tokens from multiple issuers without route-level intent',
      'Forwarding the original Authorization header to products unnecessarily',
    ],
    securityRisks: [
      'Token replay is easier when tokens are long-lived',
      'A compromised signing key affects every service trusting that issuer',
      'Products that trust client-supplied identity headers can be bypassed unless Envoy strips and rewrites them',
    ],
    designTradeoffs: [
      {
        option: 'JWT verification at Envoy',
        pros: ['Low latency after key cache', 'No auth-service call for simple routes', 'Standardized edge rejection'],
        cons: ['Harder immediate revocation', 'Complex permissions still need another decision point'],
      },
      {
        option: 'Central auth service decision for every request',
        pros: ['Fine-grained revocation and policy', 'One decision engine for many token types'],
        cons: ['Extra latency', 'Auth service must scale with request volume'],
      },
    ],
    glossary: [
      { term: 'Issuer', definition: 'The identity provider or token service that created the token.' },
      { term: 'Audience', definition: 'The intended recipient or API for a token.' },
      { term: 'JWKS cache', definition: 'Envoy storage of public verification keys for a limited time.' },
      { term: 'Token replay', definition: 'Reusing a stolen valid token to make unauthorized requests.' },
    ],
  }),
  envoyAuthModule({
    number: 5,
    title: 'SSO with OIDC or SAML Through Envoy and External Auth',
    slug: 'sso-oidc-saml-envoy-external-auth',
    subtitle: 'Use Envoy as the enforcement point while an IdP and auth service handle login protocol details.',
    duration: '105 minutes',
    diagramLabels: ['Browser', 'Envoy', 'Auth Service', 'UI'],
    objectives: [
      'Explain why Envoy is not the full identity provider',
      'Design an SSO flow for browser products behind Envoy',
      'Use ext_authz to delegate login/session decisions to a central auth service',
      'Compare OIDC and SAML at the architecture level without getting lost in protocol details',
    ],
    content: `
      <h2>The Honest Architecture</h2>
      <p>Plain Envoy is the central enforcement point. It is not usually the component that completes the full browser login protocol by itself. For OIDC or SAML, a browser is redirected to an identity provider or an auth service that knows how to speak the protocol. Envoy protects product routes and delegates the decision through ext_authz.</p>

      <h2>Browser Flow</h2>
      <ol>
        <li>User opens a product such as the data explorer.</li>
        <li>Envoy sees no valid session or token.</li>
        <li>Envoy calls the central auth service with request context.</li>
        <li>The auth service starts OIDC or SAML login with the IdP.</li>
        <li>After login, the user returns with a valid session or token.</li>
        <li>Envoy allows the request and forwards trusted identity context to the product.</li>
      </ol>

      <h2>Envoy ext_authz Example</h2>
      <p>This example sends authorization decisions to a central service. That service can understand sessions, OIDC, SAML, groups, tenants, and product policy. Keep timeouts short because this service is on the request path.</p>
      ${envoyExtAuthzConfig}

      <h2>OIDC vs SAML</h2>
      <table>
        <thead><tr><th>Protocol</th><th>Best mental model</th><th>Common usage</th></tr></thead>
        <tbody>
          <tr><td>OIDC</td><td>Modern login protocol with ID tokens and discovery metadata.</td><td>Internal apps, SaaS, mobile, API platforms.</td></tr>
          <tr><td>SAML</td><td>Enterprise SSO protocol using signed assertions.</td><td>Older corporate SSO integrations and enterprise SaaS.</td></tr>
        </tbody>
      </table>

      <h2>What the Auth Service Decides</h2>
      <p>The auth service can say: allow, deny, redirect to login, or enrich the request with identity headers. It can also normalize groups from OIDC or SAML into platform roles such as viewer, operator, admin, or data-steward.</p>
    `,
    labTitle: 'Design the SSO Flow',
    labObjective: 'Describe an SSO flow for three browser products behind plain Envoy.',
    labSteps: [
      'Choose three products that need browser login',
      'Write what happens when the user has no session',
      'Write what happens after successful OIDC or SAML login',
      'Choose which identity headers products receive',
      'Write the timeout and failure behavior for the auth service call',
    ],
    keyTakeaways: [
      'Envoy enforces access; an IdP and auth service usually own OIDC or SAML protocol work',
      'ext_authz lets Envoy delegate decisions to a central service',
      'Browser SSO needs careful redirect, session, cookie, and CSRF design',
    ],
    productionNotes: [
      'Keep auth-service timeouts short and monitor p95/p99 decision latency',
      'Use secure, HttpOnly, SameSite cookies for browser sessions when cookies are used',
      'Make login redirects explicit and avoid redirect loops',
    ],
    commonMistakes: [
      'Claiming Envoy alone replaces the identity provider',
      'Failing open when the auth service is unavailable',
      'Mixing browser session cookies and API bearer tokens without clear route rules',
    ],
    securityRisks: [
      'Open redirect bugs can leak login flows',
      'Weak cookie settings can expose sessions',
      'Group-to-role mapping mistakes can grant broad product access',
    ],
    designTradeoffs: [
      {
        option: 'OIDC login through auth service',
        pros: ['Modern ecosystem', 'Good fit for APIs and UI apps', 'Works well with JWT validation'],
        cons: ['Requires careful redirect and callback handling', 'Misconfigured audiences and clients are common'],
      },
      {
        option: 'SAML login through auth service',
        pros: ['Works with many enterprise IdPs', 'Familiar for older corporate SSO'],
        cons: ['XML assertions and metadata can be harder to debug', 'Less natural for API-first systems'],
      },
    ],
    glossary: [
      { term: 'ext_authz', definition: 'Envoy external authorization filter; it asks another service whether a request should be allowed.' },
      { term: 'IdP', definition: 'Identity provider, such as a corporate login system.' },
      { term: 'Session', definition: 'A server-recognized login state, often represented by a secure browser cookie.' },
      { term: 'Redirect loop', definition: 'A broken login flow where the browser keeps bouncing between app and login service.' },
    ],
  }),
  envoyAuthModule({
    number: 6,
    title: 'Access Tokens, Service Tokens, and Federated Credentials',
    slug: 'access-service-tokens-federated-credentials',
    subtitle: 'Handle humans, services, jobs, and cloud/data-platform access without treating every token the same.',
    duration: '100 minutes',
    diagramLabels: ['Caller', 'Envoy', 'Token Type', 'Resource'],
    objectives: [
      'Compare access tokens, service tokens, and federated credentials',
      'Design route rules for UI, API, service-to-service, and data access traffic',
      'Understand how a central auth service can exchange trusted identity for scoped cloud credentials',
      'Use Lake Formation as an example of why federated data access needs explicit boundaries',
    ],
    content: `
      <h2>Different Callers Need Different Proof</h2>
      <p>A browser user opening an admin UI is not the same as a job service writing data, and neither is the same as a dashboard service reading governed tables. Central auth works best when it names the caller type and validates the right credential for that caller.</p>

      <h2>Token Decision Table</h2>
      <table>
        <thead><tr><th>Credential</th><th>Used by</th><th>Good for</th><th>Watch out for</th></tr></thead>
        <tbody>
          <tr><td>Access token</td><td>User-facing clients and APIs</td><td>Calling APIs on behalf of a user or client</td><td>Audience, scope, expiry, replay</td></tr>
          <tr><td>Service token</td><td>Workloads and jobs</td><td>Machine-to-machine calls</td><td>Sharing tokens across services</td></tr>
          <tr><td>Federated credential</td><td>Trusted service exchanging identity</td><td>Temporary cloud or data-platform access</td><td>Overbroad permissions and weak trust mapping</td></tr>
        </tbody>
      </table>

      <h2>Federated Credentials Example</h2>
      <p>Imagine a data explorer product behind Envoy. The user is authenticated through SSO. The product asks the central auth service whether the user can access a dataset. If allowed, the platform may exchange that trusted identity for a short-lived credential that can access a cloud data service. AWS Lake Formation style governed data access is a useful example: the platform should not hand every product a broad static secret. It should map identity to scoped, auditable data access.</p>

      <h2>Route-Level Policy Shape</h2>
      <ul>
        <li><code>/ui/*</code>: browser session or OIDC login required.</li>
        <li><code>/api/*</code>: JWT access token required with correct audience.</li>
        <li><code>/internal/*</code>: service token or workload identity required.</li>
        <li><code>/data/*</code>: user identity plus dataset authorization and optional federated credential exchange.</li>
      </ul>

      <h2>Do Not Treat Tokens as Passwords</h2>
      <p>Tokens should be short-lived, scoped, auditable, and rotated. A token is proof for a purpose, not a permanent identity. If every product stores the same long-lived token, central auth has not improved security.</p>
    `,
    labTitle: 'Classify Platform Routes',
    labObjective: 'Choose the right credential type for UI, API, internal service, and data-access routes.',
    labSteps: [
      'Create four route groups: UI, API, internal service, and data access',
      'Choose the credential type accepted by each route group',
      'Write issuer, audience, and expiry expectations where JWTs are used',
      'Write when a federated credential is allowed',
      'Write what audit fields must be recorded for data access',
    ],
    keyTakeaways: [
      'Human, service, and federated credentials solve different problems',
      'Data access should use scoped, auditable credentials rather than broad static secrets',
      'Central auth should make credential type explicit per route',
    ],
    productionNotes: [
      'Separate human and service issuers when possible',
      'Use separate audiences for internal APIs and data-platform access',
      'Record user, service, tenant, dataset, policy, and decision in audit logs',
    ],
    commonMistakes: [
      'Letting UI access tokens call internal service routes directly',
      'Using one broad service token for every job',
      'Issuing cloud/data credentials without binding them to a specific user, service, dataset, and purpose',
    ],
    securityRisks: [
      'Confused-deputy bugs where a product uses its own broad credentials for a user who should not have access',
      'Leaked long-lived service tokens',
      'Federated data access without audit can hide exfiltration paths',
    ],
    designTradeoffs: [
      {
        option: 'Federated temporary credentials',
        pros: ['Short-lived access', 'Better auditability', 'Reduced static secret exposure'],
        cons: ['More moving parts', 'Requires careful identity-to-permission mapping'],
      },
      {
        option: 'Static product credentials',
        pros: ['Easy to start', 'Few integration points'],
        cons: ['Broad blast radius', 'Hard revocation', 'Weak per-user audit'],
      },
    ],
    glossary: [
      { term: 'Access token', definition: 'A credential presented to call an API for a specific audience and purpose.' },
      { term: 'Service token', definition: 'A machine credential used by one service or job to call another.' },
      { term: 'Federated credential', definition: 'A temporary scoped credential issued after trusting another identity source.' },
      { term: 'Confused deputy', definition: 'A bug where a privileged service is tricked into using its authority for a caller that should not have it.' },
    ],
  }),
  envoyAuthModule({
    number: 7,
    title: 'Authorization Policy, Headers, and Product Boundaries',
    slug: 'authorization-policy-headers-product-boundaries',
    subtitle: 'Forward trusted identity context without letting products trust spoofed headers.',
    duration: '95 minutes',
    diagramLabels: ['Claims', 'Envoy', 'Headers', 'Service'],
    objectives: [
      'Design trusted identity headers after Envoy validation',
      'Remove client-supplied identity headers before forwarding',
      'Choose route-level, product-level, and data-level authorization boundaries',
      'Avoid turning Envoy policy into an unmaintainable product database',
    ],
    content: `
      <h2>The Identity Contract</h2>
      <p>After Envoy validates a token or receives an allow decision from the auth service, products need a consistent way to know who is calling. A common pattern is to remove unsafe client headers and add platform-owned headers such as user ID, service ID, tenant, roles, and request ID.</p>

      <h2>Header Hygiene Example</h2>
      <p>This example shows the idea: remove sensitive raw inputs and write verified context. Exact formatter support and metadata names depend on your Envoy version and filter configuration, so treat this as a design pattern and test it in your environment.</p>
      ${envoyHeaderConfig}

      <h2>Three Authorization Layers</h2>
      <table>
        <thead><tr><th>Layer</th><th>Example decision</th><th>Owner</th></tr></thead>
        <tbody>
          <tr><td>Route-level</td><td>Can this identity reach the data explorer product?</td><td>Envoy plus central auth service</td></tr>
          <tr><td>Product-level</td><td>Can this user edit this dashboard?</td><td>Product service</td></tr>
          <tr><td>Data-level</td><td>Can this user read this governed dataset?</td><td>Data policy service or product domain logic</td></tr>
        </tbody>
      </table>

      <h2>Why Product Boundaries Matter</h2>
      <p>Envoy sees requests and headers. It does not naturally understand every business object. If you put every permission rule in the gateway, the gateway becomes a hidden product database. Use Envoy for common gates and product services for domain-specific checks.</p>

      <h2>Audit Context</h2>
      <p>Every allowed and denied request should be traceable. At minimum, capture request ID, route, user or service identity, tenant, issuer, audience, policy name, decision, and decision latency.</p>
    `,
    labTitle: 'Design the Identity Header Contract',
    labObjective: 'Create a safe identity context contract between Envoy and product services.',
    labSteps: [
      'Choose three trusted headers products may read',
      'Choose which incoming headers Envoy must remove',
      'Write route-level decisions for three products',
      'Write one product-level decision that should stay inside a service',
      'Write the audit fields needed for allow and deny decisions',
    ],
    keyTakeaways: [
      'Products should trust only headers written by Envoy or the platform layer',
      'Envoy policy is best for shared route and identity checks',
      'Product-specific authorization should remain near the data and domain model',
    ],
    productionNotes: [
      'Sign or protect internal traffic so downstream services cannot be called directly with fake headers',
      'Document the identity header contract and version it when claims change',
      'Add integration tests that prove spoofed headers are removed',
    ],
    commonMistakes: [
      'Allowing clients to send x-user-id directly',
      'Putting every object permission in gateway config',
      'Changing identity header names without coordinating product teams',
    ],
    securityRisks: [
      'Header spoofing can bypass authorization if products trust client input',
      'Direct service access can bypass Envoy unless network policy blocks it',
      'Overly broad roles can become permanent platform admin shortcuts',
    ],
    designTradeoffs: [
      {
        option: 'Headers as identity context',
        pros: ['Simple for products', 'Works with many languages and frameworks', 'Easy to observe'],
        cons: ['Must prevent spoofing', 'Header contract changes need coordination'],
      },
      {
        option: 'Products parse tokens themselves',
        pros: ['Products can inspect full claims', 'Less header contract design'],
        cons: ['Duplicated validation logic', 'Higher risk of inconsistent issuer or audience checks'],
      },
    ],
    glossary: [
      { term: 'Identity contract', definition: 'The agreed format products use to receive verified identity context from the platform.' },
      { term: 'Header spoofing', definition: 'Sending a fake identity header directly from a client or bypass path.' },
      { term: 'Route-level authorization', definition: 'A decision about whether an identity can reach a product route.' },
      { term: 'Domain authorization', definition: 'A decision based on product-owned data and business rules.' },
    ],
  }),
  envoyAuthModule({
    number: 8,
    title: 'Production Design: Security, Performance, and Scale',
    slug: 'production-design-security-performance-scale',
    subtitle: 'Turn the pattern into a production-grade design with latency budgets, failure modes, audits, and rollout plans.',
    duration: '120 minutes',
    diagramLabels: ['Traffic', 'Envoy', 'HA Auth', 'Products'],
    objectives: [
      'Evaluate the performance cost of JWT validation and external authorization',
      'Design high availability for Envoy, JWKS, IdP, and auth services',
      'Choose fail-closed, fail-open, and degraded-mode behavior deliberately',
      'Write a production rollout checklist for centralized auth migration',
    ],
    content: `
      <h2>Performance Model</h2>
      <p>JWT validation is usually fast after JWKS keys are cached. External authorization adds a network hop on the request path. That means auth service latency becomes user-facing latency. Use short timeouts, horizontal scaling, connection reuse, circuit breakers, and careful caching where policy allows it.</p>

      <h2>Production Resilience Example</h2>
      <p>This cluster snippet shows the types of controls you should think about for the central auth service: timeouts, circuit breakers, outlier detection, and stable Kubernetes service discovery.</p>
      ${envoyResilienceConfig}

      <h2>Fail-Closed vs Fail-Open</h2>
      <p>Security-sensitive routes should usually fail closed: if Envoy cannot validate identity or ask the auth service, deny the request. Some read-only low-risk routes may have a documented degraded mode, but it must be explicit. Never let a timeout silently become broad access.</p>

      <h2>Scaling the Auth Layer</h2>
      <ul>
        <li>Run multiple Envoy replicas across nodes and zones.</li>
        <li>Run multiple auth service replicas with autoscaling and health checks.</li>
        <li>Cache JWKS and simple policy decisions carefully.</li>
        <li>Keep IdP calls out of the hot path after login when possible.</li>
        <li>Use metrics for allow rate, deny rate, error rate, decision latency, token failures, and route-level spikes.</li>
      </ul>

      <h2>Advantages</h2>
      <ul>
        <li>Consistent auth behavior across products.</li>
        <li>Better audit logs and incident response.</li>
        <li>Less duplicated token parsing and SSO code.</li>
        <li>Easier migration from static secrets to short-lived tokens and federated credentials.</li>
      </ul>

      <h2>Disadvantages</h2>
      <ul>
        <li>Central auth becomes critical path infrastructure.</li>
        <li>Bad central policy can break many products at once.</li>
        <li>Teams need clear ownership for route policy, product policy, and data policy.</li>
        <li>Performance work is required when every request asks for a decision.</li>
      </ul>

      <h2>Production Rollout Plan</h2>
      <ol>
        <li>Inventory products, routes, token types, current auth logic, and risk level.</li>
        <li>Start with one low-risk product behind Envoy in report-only or shadow mode.</li>
        <li>Enable JWT validation for API routes with explicit issuer and audience.</li>
        <li>Add ext_authz for routes that need central policy or browser SSO decisions.</li>
        <li>Strip and rewrite trusted identity headers.</li>
        <li>Add dashboards and alerts before migrating high-risk products.</li>
        <li>Document emergency rollback and key-rotation procedures.</li>
      </ol>
    `,
    labTitle: 'Write the Production Auth Design Review',
    labObjective: 'Produce a review-ready design for centralized Envoy authentication and authorization.',
    labSteps: [
      'Define route groups and token types',
      'Choose JWT validation rules and JWKS cache behavior',
      'Choose ext_authz timeout, failure mode, and scaling plan',
      'Write the identity header contract and spoofing protections',
      'Write the rollout plan, rollback plan, and audit dashboard requirements',
    ],
    keyTakeaways: [
      'Central auth improves consistency but becomes critical infrastructure',
      'JWT validation is fast; external authorization must be engineered for latency and availability',
      'Production readiness means rollout, rollback, observability, and failure behavior are designed before migration',
    ],
    productionNotes: [
      'Set an explicit latency budget for auth decisions',
      'Test IdP outage, JWKS failure, auth service 5xx, and Envoy config rollback',
      'Separate policy authoring from emergency break-glass access',
    ],
    commonMistakes: [
      'Making every request call the IdP directly',
      'Failing open on sensitive routes because it feels more available',
      'Migrating every product at once without shadow mode or route-level metrics',
    ],
    securityRisks: [
      'Auth service compromise can affect all protected products',
      'Poorly protected break-glass flows can bypass the whole design',
      'Missing audit data can turn an incident into guesswork',
    ],
    designTradeoffs: [
      {
        option: 'Fail closed by default',
        pros: ['Safer for sensitive systems', 'Clear security posture', 'Prevents timeout-based bypass'],
        cons: ['Auth outages can become product outages', 'Requires strong reliability engineering'],
      },
      {
        option: 'Selective degraded mode',
        pros: ['Can protect read-only availability', 'Useful for low-risk status pages'],
        cons: ['Easy to misuse', 'Needs explicit route classification and audit'],
      },
    ],
    glossary: [
      { term: 'Critical path', definition: 'A component that must work for user requests to complete.' },
      { term: 'Fail closed', definition: 'Deny access when the security decision cannot be made.' },
      { term: 'Circuit breaker', definition: 'A control that limits calls to an unhealthy dependency before it causes broader failure.' },
      { term: 'Shadow mode', definition: 'Running a new policy path without enforcing it yet, so teams can observe decisions safely.' },
    ],
    beforeAfter: {
      before: ['Product-specific auth logic with unknown failure modes', 'No shared audit contract', 'Static secrets and broad credentials', 'No auth latency budget'],
      after: ['Envoy-enforced identity and policy checks', 'Shared audit fields across products', 'Short-lived tokens and scoped federated credentials', 'Measured decision latency and rollback plan'],
    },
  }),
];

export const ENVOY_CENTRALIZED_AUTH_COURSE: Course = {
  id: 'course-6',
  title: 'Centralized Authentication and Authorization with Envoy',
  slug: 'centralized-authentication-authorization-envoy',
  subtitle: 'Build a Google-style one-login platform for Kubernetes products using plain Envoy, JWT/JWKS, external authorization, SSO, service tokens, and federated credentials.',
  excerpt: 'Learn centralized authentication and authorization from beginner basics to production design. Use plain Envoy as the enforcement point for Kubernetes products, validate JWTs with JWKS, delegate SSO and policy through ext_authz, and design secure token, header, audit, and scaling patterns.',
  description: 'A beginner-to-production course for engineers who need one consistent auth layer across many Kubernetes products. You will start with the explicit Google, Gmail, and YouTube mental model, then build toward plain Envoy routing, JWT/JWKS validation, OIDC/SAML SSO delegation, service tokens, access tokens, federated credentials, authorization boundaries, and production reliability.',
  instructor: CENTRAL_AUTH_INSTRUCTOR,
  totalDuration: '12+ hours',
  level: 'Beginner to Production Grade',
  category: 'security',
  labDelivery: 'inline',
  outcomes: [
    'A clear mental model for Google-style centralized login across many Kubernetes products',
    'A plain Envoy front-door architecture with listeners, routes, clusters, and HTTP filters',
    'JWT and JWKS validation rules for API routes with issuer, audience, expiry, and signature checks',
    'An SSO design that uses Envoy as enforcement while an IdP and auth service handle OIDC or SAML login',
    'A route strategy for access tokens, service tokens, and federated credentials such as governed data access',
    'A safe identity header contract that products can trust without accepting spoofed client headers',
    'A production checklist for latency, scaling, failure modes, audit logs, rollout, rollback, and security review',
  ],
  tags: ['Envoy', 'Authentication', 'Authorization', 'SSO', 'OIDC', 'SAML', 'JWT', 'JWKS', 'OAuth 2.0', 'Kubernetes', 'API Gateway', 'Access Tokens', 'Service Tokens', 'Federated Credentials', 'Zero Trust', 'Platform Engineering', 'Security'],
  targetAudience: [
    'Backend engineers building internal products that need shared login and API access',
    'Platform engineers designing an internal developer platform on Kubernetes',
    'Security engineers reviewing centralized authentication and authorization designs',
    'DevOps engineers operating Envoy, Kubernetes gateways, and identity-aware routing',
    'Data platform engineers protecting data tools with SSO, tokens, and federated credentials',
    'Beginners who know basic HTTP and Kubernetes services but need clear auth vocabulary',
  ],
  modules: ENVOY_AUTH_MODULES,
  seoPages: [
    {
      slug: 'centralized-authentication-envoy-course',
      title: 'Centralized Authentication with Envoy Course',
      description: 'Learn centralized authentication and authorization with plain Envoy, JWT/JWKS, SSO, ext_authz, tokens, and Kubernetes product routing.',
      ctaModule: 1,
      content: '<h1>Centralized Authentication with Envoy Course</h1><p>This free course teaches how to design one consistent auth layer for many Kubernetes products. You will start with a Google-style mental model, then learn plain Envoy routing, JWT/JWKS validation, SSO delegation, service tokens, federated credentials, authorization boundaries, and production scaling.</p><h2>Who Should Take This Course</h2><p>Take this course if you own internal products, APIs, data tools, developer portals, or Kubernetes services that need a shared authentication and authorization architecture.</p>',
    },
    {
      slug: 'envoy-jwt-jwks-course',
      title: 'Envoy JWT and JWKS Validation Course',
      description: 'Learn how Envoy validates JWTs with JWKS, issuer, audience, expiry, and signature checks before traffic reaches product APIs.',
      ctaModule: 4,
      content: '<h1>Envoy JWT and JWKS Validation Course</h1><p>JWT validation at Envoy lets teams reject invalid tokens before product APIs receive traffic. This course explains issuer, audience, expiry, signature checks, remote JWKS, key rotation, route policy, and when an external authorization service is still needed.</p>',
    },
    {
      slug: 'sso-envoy-kubernetes-course',
      title: 'SSO with Envoy for Kubernetes Products',
      description: 'Understand how SSO works for Kubernetes products behind Envoy using OIDC or SAML through an IdP and external authorization service.',
      ctaModule: 5,
      content: '<h1>SSO with Envoy for Kubernetes Products</h1><p>Plain Envoy can be the enforcement point for browser products, while an identity provider and auth service handle OIDC or SAML login flows. This course teaches the request flow, redirect behavior, sessions, trusted identity headers, and production failure modes.</p>',
    },
    {
      slug: 'kubernetes-product-auth-architecture',
      title: 'Kubernetes Product Auth Architecture',
      description: 'Design authentication and authorization for multiple Kubernetes products using Envoy, JWT, SSO, service tokens, and federated credentials.',
      ctaModule: 8,
      content: '<h1>Kubernetes Product Auth Architecture</h1><p>A Kubernetes platform often has many products: dashboards, admin tools, data explorers, job APIs, and internal services. This course shows how to centralize shared auth checks at Envoy while keeping product-specific permissions close to the owning service.</p>',
    },
  ],
  faqs: [
    {
      question: 'Is this course only about Envoy?',
      answer: 'The implementation focus is plain Envoy, but the course also explains identity providers, OIDC, SAML, JWT, JWKS, access tokens, service tokens, federated credentials, and authorization boundaries because Envoy has to work with those systems in production.',
    },
    {
      question: 'Does Envoy replace the identity provider?',
      answer: 'No. Envoy is the enforcement point. For full OIDC or SAML browser login, an identity provider and often a central auth service handle protocol details. Envoy validates tokens, delegates decisions, and protects product routes.',
    },
    {
      question: 'Does this include YAML examples?',
      answer: 'Yes. The course includes beginner-friendly Envoy YAML snippets for routing, JWT/JWKS validation, external authorization, identity headers, and production resilience. The snippets are teaching examples and should be adapted and tested before production use.',
    },
    {
      question: 'Is this beginner friendly?',
      answer: 'Yes. The first modules explain the Google, Gmail, and YouTube style mental model, then define SSO, SAML, OIDC, JWT, JWKS, access tokens, service tokens, and federated credentials before moving into production design.',
    },
    {
      question: 'What production topics are covered?',
      answer: 'The production module covers latency budgets, JWKS caching, auth service scaling, failure modes, fail-closed behavior, circuit breakers, audit fields, rollout plans, rollback, and security review.',
    },
  ],
};
