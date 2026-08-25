import type { CourseOutline } from '../../course-outline';

export const CENTRALIZED_AUTH_ENVOY_OUTLINE: CourseOutline = {
  "id": "course-6",
  "title": "Centralized Authentication and Authorization with Envoy",
  "slug": "centralized-authentication-authorization-envoy",
  "subtitle": "Build a Google-style one-login platform for Kubernetes products using plain Envoy, JWT/JWKS, external authorization, SSO, service tokens, and federated credentials.",
  "excerpt": "Learn centralized authentication and authorization from beginner basics to production design. Use plain Envoy as the enforcement point for Kubernetes products, validate JWTs with JWKS, delegate SSO and policy through ext_authz, and design secure token, header, audit, and scaling patterns.",
  "description": "A beginner-to-production course for engineers who need one consistent auth layer across many Kubernetes products. You will start with the explicit Google, Gmail, and YouTube mental model, then build toward plain Envoy routing, JWT/JWKS validation, OIDC/SAML SSO delegation, service tokens, access tokens, federated credentials, authorization boundaries, and production reliability.",
  "instructor": {
    "name": "Vishal Anand",
    "title": "Senior Product Engineer & Tech Lead",
    "bio": "Creator of CodersSecret and author of production-focused courses on security, Kubernetes, distributed systems, AI infrastructure, and data platforms. Vishal teaches with concrete architecture diagrams, small examples, and operational tradeoffs.",
    "github": "https://github.com/vishalanandl177",
    "achievements": [
      "Builds and explains production engineering systems through practical CodersSecret courses",
      "Writes about backend architecture, DevOps, security, Kubernetes, AI infrastructure, and data engineering",
      "Focuses on beginner-friendly explanations that still include production failure modes",
      "Created free learning paths with diagrams, labs, and operational checklists"
    ]
  },
  "totalDuration": "12+ hours",
  "level": "Beginner to Production Grade",
  "category": "security",
  "labDelivery": "inline",
  "outcomes": [
    "A clear mental model for Google-style centralized login across many Kubernetes products",
    "A plain Envoy front-door architecture with listeners, routes, clusters, and HTTP filters",
    "JWT and JWKS validation rules for API routes with issuer, audience, expiry, and signature checks",
    "An SSO design that uses Envoy as enforcement while an IdP and auth service handle OIDC or SAML login",
    "A route strategy for access tokens, service tokens, and federated credentials such as governed data access",
    "A safe identity header contract that products can trust without accepting spoofed client headers",
    "A production checklist for latency, scaling, failure modes, audit logs, rollout, rollback, and security review"
  ],
  "tags": [
    "Envoy",
    "Authentication",
    "Authorization",
    "SSO",
    "OIDC",
    "SAML",
    "JWT",
    "JWKS",
    "OAuth 2.0",
    "Kubernetes",
    "API Gateway",
    "Access Tokens",
    "Service Tokens",
    "Federated Credentials",
    "Zero Trust",
    "Platform Engineering",
    "Security"
  ],
  "targetAudience": [
    "Backend engineers building internal products that need shared login and API access",
    "Platform engineers designing an internal developer platform on Kubernetes",
    "Security engineers reviewing centralized authentication and authorization designs",
    "DevOps engineers operating Envoy, Kubernetes gateways, and identity-aware routing",
    "Data platform engineers protecting data tools with SSO, tokens, and federated credentials",
    "Beginners who know basic HTTP and Kubernetes services but need clear auth vocabulary"
  ],
  "seoPages": [
    {
      "slug": "centralized-authentication-envoy-course",
      "title": "Centralized Authentication with Envoy Course",
      "description": "Learn centralized authentication and authorization with plain Envoy, JWT/JWKS, SSO, ext_authz, tokens, and Kubernetes product routing.",
      "ctaModule": 1,
      "content": "<h1>Centralized Authentication with Envoy Course</h1><p>This free course teaches how to design one consistent auth layer for many Kubernetes products. You will start with a Google-style mental model, then learn plain Envoy routing, JWT/JWKS validation, SSO delegation, service tokens, federated credentials, authorization boundaries, and production scaling.</p><h2>Who Should Take This Course</h2><p>Take this course if you own internal products, APIs, data tools, developer portals, or Kubernetes services that need a shared authentication and authorization architecture.</p>"
    },
    {
      "slug": "envoy-jwt-jwks-course",
      "title": "Envoy JWT and JWKS Validation Course",
      "description": "Learn how Envoy validates JWTs with JWKS, issuer, audience, expiry, and signature checks before traffic reaches product APIs.",
      "ctaModule": 4,
      "content": "<h1>Envoy JWT and JWKS Validation Course</h1><p>JWT validation at Envoy lets teams reject invalid tokens before product APIs receive traffic. This course explains issuer, audience, expiry, signature checks, remote JWKS, key rotation, route policy, and when an external authorization service is still needed.</p>"
    },
    {
      "slug": "sso-envoy-kubernetes-course",
      "title": "SSO with Envoy for Kubernetes Products",
      "description": "Understand how SSO works for Kubernetes products behind Envoy using OIDC or SAML through an IdP and external authorization service.",
      "ctaModule": 5,
      "content": "<h1>SSO with Envoy for Kubernetes Products</h1><p>Plain Envoy can be the enforcement point for browser products, while an identity provider and auth service handle OIDC or SAML login flows. This course teaches the request flow, redirect behavior, sessions, trusted identity headers, and production failure modes.</p>"
    },
    {
      "slug": "kubernetes-product-auth-architecture",
      "title": "Kubernetes Product Auth Architecture",
      "description": "Design authentication and authorization for multiple Kubernetes products using Envoy, JWT, SSO, service tokens, and federated credentials.",
      "ctaModule": 8,
      "content": "<h1>Kubernetes Product Auth Architecture</h1><p>A Kubernetes platform often has many products: dashboards, admin tools, data explorers, job APIs, and internal services. This course shows how to centralize shared auth checks at Envoy while keeping product-specific permissions close to the owning service.</p>"
    }
  ],
  "faqs": [
    {
      "question": "Is this course only about Envoy?",
      "answer": "The implementation focus is plain Envoy, but the course also explains identity providers, OIDC, SAML, JWT, JWKS, access tokens, service tokens, federated credentials, and authorization boundaries because Envoy has to work with those systems in production."
    },
    {
      "question": "Does Envoy replace the identity provider?",
      "answer": "No. Envoy is the enforcement point. For full OIDC or SAML browser login, an identity provider and often a central auth service handle protocol details. Envoy validates tokens, delegates decisions, and protects product routes."
    },
    {
      "question": "Does this include YAML examples?",
      "answer": "Yes. The course includes beginner-friendly Envoy YAML snippets for routing, JWT/JWKS validation, external authorization, identity headers, and production resilience. The snippets are teaching examples and should be adapted and tested before production use."
    },
    {
      "question": "Is this beginner friendly?",
      "answer": "Yes. The first modules explain the Google, Gmail, and YouTube style mental model, then define SSO, SAML, OIDC, JWT, JWKS, access tokens, service tokens, and federated credentials before moving into production design."
    },
    {
      "question": "What production topics are covered?",
      "answer": "The production module covers latency budgets, JWKS caching, auth service scaling, failure modes, fail-closed behavior, circuit breakers, audit fields, rollout plans, rollback, and security review."
    }
  ],
  "modules": [
    {
      "number": 1,
      "title": "Google-Style Login for Many Kubernetes Products",
      "slug": "google-style-login-kubernetes-products",
      "subtitle": "Start with the Gmail, YouTube, and Google mental model: one account, many products, consistent identity.",
      "duration": "70 minutes",
      "objectives": [
        "Explain centralized authentication using the explicit Google, Gmail, and YouTube example",
        "Map the same idea to Kubernetes products behind a shared Envoy edge",
        "Separate login, token validation, authorization, and product-specific permissions",
        "Decide what should be centralized and what should stay inside each product"
      ],
      "labs": [
        {
          "title": "Draw the Product Map"
        }
      ]
    },
    {
      "number": 2,
      "title": "Auth Vocabulary: SSO, SAML, OIDC, JWT, JWKS, and Tokens",
      "slug": "auth-vocabulary-sso-saml-oidc-jwt-jwks-tokens",
      "subtitle": "Learn the words first so the architecture stops feeling mysterious.",
      "duration": "85 minutes",
      "objectives": [
        "Define SSO, SAML, OIDC, OAuth 2.0, JWT, JWKS, access tokens, and service tokens",
        "Explain the difference between authentication and authorization",
        "Understand why issuer, audience, expiry, signature, and scopes matter",
        "Know which standards are used for humans and which are used for services"
      ],
      "labs": [
        {
          "title": "Build the Auth Glossary"
        }
      ]
    },
    {
      "number": 3,
      "title": "Plain Envoy as the Central Front Door",
      "slug": "plain-envoy-central-front-door",
      "subtitle": "Route product traffic through a single Envoy edge before adding auth filters.",
      "duration": "80 minutes",
      "objectives": [
        "Read a plain Envoy listener, route, and cluster configuration",
        "Understand where HTTP filters run in the request path",
        "Map Kubernetes services to Envoy clusters",
        "Prepare a safe place to add JWT and external authorization filters"
      ],
      "labs": [
        {
          "title": "Annotate the Envoy Request Path"
        }
      ]
    },
    {
      "number": 4,
      "title": "JWT and JWKS Validation at Envoy",
      "slug": "jwt-jwks-validation-envoy",
      "subtitle": "Use Envoy jwt_authn to verify signed tokens before requests reach product APIs.",
      "duration": "95 minutes",
      "objectives": [
        "Configure Envoy to validate JWT issuer, audience, expiry, and signature",
        "Understand remote JWKS and key rotation at a beginner level",
        "Forward verified token payload safely through dynamic metadata",
        "Know when JWT validation is enough and when ext_authz is still needed"
      ],
      "labs": [
        {
          "title": "Write a JWT Validation Checklist"
        }
      ]
    },
    {
      "number": 5,
      "title": "SSO with OIDC or SAML Through Envoy and External Auth",
      "slug": "sso-oidc-saml-envoy-external-auth",
      "subtitle": "Use Envoy as the enforcement point while an IdP and auth service handle login protocol details.",
      "duration": "105 minutes",
      "objectives": [
        "Explain why Envoy is not the full identity provider",
        "Design an SSO flow for browser products behind Envoy",
        "Use ext_authz to delegate login/session decisions to a central auth service",
        "Compare OIDC and SAML at the architecture level without getting lost in protocol details"
      ],
      "labs": [
        {
          "title": "Design the SSO Flow"
        }
      ]
    },
    {
      "number": 6,
      "title": "Access Tokens, Service Tokens, and Federated Credentials",
      "slug": "access-service-tokens-federated-credentials",
      "subtitle": "Handle humans, services, jobs, and cloud/data-platform access without treating every token the same.",
      "duration": "100 minutes",
      "objectives": [
        "Compare access tokens, service tokens, and federated credentials",
        "Design route rules for UI, API, service-to-service, and data access traffic",
        "Understand how a central auth service can exchange trusted identity for scoped cloud credentials",
        "Use Lake Formation as an example of why federated data access needs explicit boundaries"
      ],
      "labs": [
        {
          "title": "Classify Platform Routes"
        }
      ]
    },
    {
      "number": 7,
      "title": "Authorization Policy, Headers, and Product Boundaries",
      "slug": "authorization-policy-headers-product-boundaries",
      "subtitle": "Forward trusted identity context without letting products trust spoofed headers.",
      "duration": "95 minutes",
      "objectives": [
        "Design trusted identity headers after Envoy validation",
        "Remove client-supplied identity headers before forwarding",
        "Choose route-level, product-level, and data-level authorization boundaries",
        "Avoid turning Envoy policy into an unmaintainable product database"
      ],
      "labs": [
        {
          "title": "Design the Identity Header Contract"
        }
      ]
    },
    {
      "number": 8,
      "title": "Production Design: Security, Performance, and Scale",
      "slug": "production-design-security-performance-scale",
      "subtitle": "Turn the pattern into a production-grade design with latency budgets, failure modes, audits, and rollout plans.",
      "duration": "120 minutes",
      "objectives": [
        "Evaluate the performance cost of JWT validation and external authorization",
        "Design high availability for Envoy, JWKS, IdP, and auth services",
        "Choose fail-closed, fail-open, and degraded-mode behavior deliberately",
        "Write a production rollout checklist for centralized auth migration"
      ],
      "labs": [
        {
          "title": "Write the Production Auth Design Review"
        }
      ]
    }
  ]
};
