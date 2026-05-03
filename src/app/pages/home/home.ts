import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

type PostCard = { id: string; title: string; slug: string; excerpt: string; category: string; date: string; readTime: string; tags: string[]; author: string; featured?: boolean; popularRank?: number; coverImage: string };
type CategoryInfo = { name: string; slug: string };

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <!-- Hero with animated gradient -->
    <section class="relative overflow-hidden">
      <!-- Animated gradient blobs -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[100px] animate-blob"></div>
        <div class="absolute top-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/15 blur-[100px] animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] left-[30%] h-[450px] w-[450px] rounded-full bg-pink-500/10 blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div class="container max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <div class="flex flex-col items-center text-center">
          <!-- Badge -->
          <a routerLink="/slides/drf-api-logger" class="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-foreground mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 hover:border-primary/60 hover:shadow-md transition-all">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="font-mono text-[10px] uppercase tracking-wider text-primary">NEW</span>
            Watch any article as narrated slides →
          </a>

          <!-- Heading -->
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Master <span class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">Cloud Native Security</span>
            <br class="hidden sm:block" />
            &amp; <span class="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">Production Engineering</span>
          </h1>

          <p class="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Practical courses, labs, and architecture guides on Kubernetes security, SPIFFE/SPIRE, workload identity, Zero Trust, DevSecOps, and API security — written by engineers, for engineers who ship.
            <span class="block mt-2 text-foreground font-medium">Read articles, or <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">watch every tutorial as narrated slides</span>.</span>
          </p>

          <!-- CTA buttons -->
          <div class="mt-10 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <a routerLink="/blog"
               class="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97]">
              Start Reading
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/slides/drf-api-logger"
               class="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-[0.97]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              Watch a Demo
            </a>
            <a routerLink="/category/tutorials"
               class="inline-flex items-center justify-center rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
              Browse Tutorials
            </a>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ totalPosts() }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Articles</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ categories().length }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Categories</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ uniqueTags() }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Topics</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">{{ totalCourseModules() }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Course Modules</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{{ totalLabs() }}+</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Hands-On Labs</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 1: Learn Cloud Native Security Through Practical Engineering -->
    <!-- ========================================================== -->
    <section class="relative py-16 md:py-24 overflow-hidden" aria-labelledby="practical-engineering-heading">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl"></div>
      </div>
      <div class="container max-w-6xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-14">
          <span class="inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-1 text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">Practical Engineering</span>
          <h2 id="practical-engineering-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Learn <span class="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">Cloud Native Security</span> Through Practical Engineering
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Understand production security systems through <strong class="text-foreground">hands-on labs</strong>, annotated <strong class="text-foreground">architecture diagrams</strong>, real infrastructure examples, and step-by-step deployments &mdash; not abstract theory or marketing copy. Every concept you learn here is built, broken, and rebuilt against the same systems used by teams running Kubernetes in production today.
          </p>
        </div>

        <!-- 3 Pillar cards (H3) -->
        <div class="grid md:grid-cols-3 gap-5 mb-10">
          <article class="rounded-2xl border border-border/60 bg-card p-7 hover:border-blue-500/40 transition-all hover:-translate-y-1">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500" aria-hidden="true"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
            </div>
            <h3 class="text-xl font-bold mb-2 tracking-tight">Hands-On Kubernetes Security Labs</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Spin up real clusters, deploy SPIRE agents, federate trust domains, write Rego policies, and break workload identity yourself. Every lab ships with manifests, troubleshooting steps, and verified outputs &mdash; so you can reproduce production behavior on a laptop.</p>
            <a routerLink="/courses/mastering-spiffe-spire" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors">
              Try the SPIFFE/SPIRE labs
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
          <article class="rounded-2xl border border-border/60 bg-card p-7 hover:border-purple-500/40 transition-all hover:-translate-y-1">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </div>
            <h3 class="text-xl font-bold mb-2 tracking-tight">Production-Grade Security Architectures</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Walk through the architecture of multi-cluster identity federation, sidecar-injected mTLS, OPA policy enforcement, and supply-chain signing flows. Each architecture is dissected layer by layer, with the trade-offs and failure modes that only show up at scale.</p>
            <a routerLink="/courses/cloud-native-security-engineering" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-500 hover:text-purple-400 transition-colors">
              Study production architectures
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
          <article class="rounded-2xl border border-border/60 bg-card p-7 hover:border-orange-500/40 transition-all hover:-translate-y-1">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h3 class="text-xl font-bold mb-2 tracking-tight">Real-World Cloud Native Threat Modeling</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Map attacks against Kubernetes API servers, sidecar containers, service mesh control planes, and the supply chain. Each threat model is grounded in real CVEs, real post-mortems, and the controls (Falco, OPA, image signing) that contain them.</p>
            <a routerLink="/courses/kubernetes-runtime-security" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors">
              Explore threat modeling
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
        </div>

        <!-- 4 H4 supporting topic tiles -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3" aria-label="Foundational security capabilities">
          <a routerLink="/glossary/falco" class="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <h4 class="text-sm font-bold mb-1 group-hover:text-primary transition-colors">Runtime Security</h4>
            <p class="text-xs text-muted-foreground leading-snug">Detect anomalous syscalls, exec, and network behavior with Falco &amp; eBPF.</p>
          </a>
          <a routerLink="/courses/cloud-native-security-engineering/containers-workload-security" class="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <h4 class="text-sm font-bold mb-1 group-hover:text-primary transition-colors">Workload Isolation</h4>
            <p class="text-xs text-muted-foreground leading-snug">PodSecurity standards, gVisor, namespace boundaries &amp; RBAC.</p>
          </a>
          <a routerLink="/glossary/workload-identity" class="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <h4 class="text-sm font-bold mb-1 group-hover:text-primary transition-colors">Identity-Aware Infrastructure</h4>
            <p class="text-xs text-muted-foreground leading-snug">SPIFFE IDs, SVIDs &amp; cryptographic workload identity for every service.</p>
          </a>
          <a routerLink="/glossary/mtls" class="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <h4 class="text-sm font-bold mb-1 group-hover:text-primary transition-colors">Secure Service Communication</h4>
            <p class="text-xs text-muted-foreground leading-snug">mTLS, SPIFFE-bootstrapped trust, and zero-config service authentication.</p>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 2: Production Courses on Kubernetes, Zero Trust & Workload Identity -->
    <!-- ========================================================== -->
    <section class="py-16 md:py-24 bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-blue-500/5 border-y border-border/40" aria-labelledby="production-courses-heading">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-block rounded-full bg-green-500/10 border border-green-500/30 px-4 py-1 text-xs font-bold text-green-500 uppercase tracking-wider mb-4">100% Free &middot; Open Curriculum</span>
          <h2 id="production-courses-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Production Courses on <span class="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Kubernetes</span>, <span class="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Zero Trust</span> &amp; <span class="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Workload Identity</span>
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Three complete, free curriculums focused on the security primitives modern infrastructure actually depends on. Each course is built around real production deployments, not toy clusters &mdash; with annotated YAML, working code, and the same diagnostic workflow you would use on a real on-call rotation.
          </p>
        </div>

        <!-- 3 Course cards (H3) -->
        <div class="grid md:grid-cols-3 gap-5 mb-10">
          <!-- Course 1: SPIFFE/SPIRE -->
          <article class="rounded-2xl border border-teal-500/30 bg-card p-7 hover:border-teal-500/60 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span class="rounded-full bg-green-500/10 border border-green-500/30 px-2 py-0.5 text-[10px] font-bold text-green-500 uppercase tracking-wider">Free</span>
              <span class="rounded-full bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 text-[10px] font-semibold text-teal-500">13 Modules</span>
              <span class="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-500">60+ Labs</span>
            </div>
            <h3 class="text-lg md:text-xl font-bold mb-2 tracking-tight">Master SPIFFE &amp; SPIRE for Workload Identity</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-5">Deploy SPIRE servers and agents on Kubernetes, attest workloads cryptographically, issue X.509 and JWT SVIDs, and federate trust across clusters and clouds. The most comprehensive free curriculum on CNCF workload identity.</p>
            <a routerLink="/courses/mastering-spiffe-spire" class="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-bold hover:gap-3 transition-all">
              Start the SPIFFE/SPIRE course
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Course 2: Kubernetes Security -->
          <article class="rounded-2xl border border-blue-500/30 bg-card p-7 hover:border-blue-500/60 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span class="rounded-full bg-green-500/10 border border-green-500/30 px-2 py-0.5 text-[10px] font-bold text-green-500 uppercase tracking-wider">Free</span>
              <span class="rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-500">17 Modules</span>
              <span class="rounded-full bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-500">Production</span>
            </div>
            <h3 class="text-lg md:text-xl font-bold mb-2 tracking-tight">Secure Kubernetes Workloads in Production</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-5">End-to-end Kubernetes security: PodSecurity standards, RBAC hardening, network policies, runtime detection with Falco, image signing with Sigstore, and the supply chain controls that catch attackers before they reach the kube-apiserver.</p>
            <a routerLink="/courses/cloud-native-security-engineering" class="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-bold hover:gap-3 transition-all">
              Open the Kubernetes track
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Course 3: Zero Trust -->
          <article class="rounded-2xl border border-purple-500/30 bg-card p-7 hover:border-purple-500/60 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span class="rounded-full bg-green-500/10 border border-green-500/30 px-2 py-0.5 text-[10px] font-bold text-green-500 uppercase tracking-wider">Free</span>
              <span class="rounded-full bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-500">Architecture</span>
              <span class="rounded-full bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 text-[10px] font-semibold text-pink-500">Zero Trust</span>
            </div>
            <h3 class="text-lg md:text-xl font-bold mb-2 tracking-tight">Build Zero Trust Cloud Native Systems</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-5">Replace network-perimeter assumptions with identity-first policy. Combine SPIFFE workload identity, mTLS-by-default service meshes, OPA authorization, and continuous verification to design distributed systems that hold up under modern threat models.</p>
            <a routerLink="/courses/zero-trust-kubernetes" class="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-bold hover:gap-3 transition-all">
              Read the Zero Trust guide
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
        </div>

        <!-- 4 H4 supporting concept tiles -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3" aria-label="Workload identity building blocks">
          <a routerLink="/glossary/mtls" class="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-teal-500/40 hover:-translate-y-0.5 transition-all">
            <h4 class="text-sm font-bold mb-1 group-hover:text-teal-500 transition-colors">mTLS</h4>
            <p class="text-xs text-muted-foreground leading-snug">Mutual TLS as the universal handshake for service-to-service trust.</p>
          </a>
          <a routerLink="/glossary/spiffe" class="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-teal-500/40 hover:-translate-y-0.5 transition-all">
            <h4 class="text-sm font-bold mb-1 group-hover:text-teal-500 transition-colors">Service Identity</h4>
            <p class="text-xs text-muted-foreground leading-snug">SPIFFE IDs that uniquely name every workload, regardless of platform.</p>
          </a>
          <a routerLink="/courses/mastering-spiffe-spire" class="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-teal-500/40 hover:-translate-y-0.5 transition-all">
            <h4 class="text-sm font-bold mb-1 group-hover:text-teal-500 transition-colors">Federation</h4>
            <p class="text-xs text-muted-foreground leading-snug">Trust bundles that span clusters, clouds &amp; organizational boundaries.</p>
          </a>
          <a routerLink="/glossary/opa" class="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-teal-500/40 hover:-translate-y-0.5 transition-all">
            <h4 class="text-sm font-bold mb-1 group-hover:text-teal-500 transition-colors">Policy Enforcement</h4>
            <p class="text-xs text-muted-foreground leading-snug">OPA / Rego for authorization, admission control &amp; compliance.</p>
          </a>
        </div>

        <div class="mt-10 text-center">
          <a routerLink="/courses" class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all duration-300">
            Browse all free courses
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 3: Cloud Native Security Topics You'll Learn -->
    <!-- ========================================================== -->
    <section class="py-16 md:py-24 animate-in fade-in duration-700" aria-labelledby="topics-heading">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-block rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1 text-xs font-bold text-purple-500 uppercase tracking-wider mb-4">Topical Coverage</span>
          <h2 id="topics-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Cloud Native Security Topics You&apos;ll Learn
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            A curated map of the security disciplines that define modern infrastructure engineering &mdash; covered in depth across courses, articles, diagrams, and labs. Each topic is taught from first principles, then connected to the production systems and CNCF projects that implement it.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Topic 1 -->
          <article class="rounded-2xl border border-border/60 bg-card p-6 hover:border-orange-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Kubernetes Security &amp; Runtime Protection</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-4">Lock down PodSecurity standards, enforce least-privilege RBAC, isolate workloads with network policies, and detect compromise in real time using Falco and eBPF. Understand the attack surface of the API server, kubelet, and etcd &mdash; then close it.</p>
            <a routerLink="/courses/kubernetes-runtime-security" class="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors">
              Explore runtime security
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Topic 2 -->
          <article class="rounded-2xl border border-border/60 bg-card p-6 hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-500" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Service Mesh, mTLS &amp; Secure Networking</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-4">Compare sidecar versus ambient meshes, bootstrap mTLS with SPIFFE-issued SVIDs, and engineer pod-to-pod authentication that survives upgrades. Trace a request from one workload to another, byte by byte, with full cryptographic context.</p>
            <a routerLink="/glossary/service-mesh" class="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-500 hover:text-cyan-400 transition-colors">
              Learn service mesh security
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Topic 3 -->
          <article class="rounded-2xl border border-border/60 bg-card p-6 hover:border-purple-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">OPA, Policy-as-Code &amp; Authorization</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-4">Express security and compliance policy as versioned Rego, evaluate it at admission time, and enforce it across Kubernetes, microservices, CI/CD, and Terraform. Replace ad-hoc YAML rules with a single, testable policy plane.</p>
            <a routerLink="/courses/cloud-native-security-engineering/policy-as-code-security" class="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-500 hover:text-purple-400 transition-colors">
              Adopt policy-as-code
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Topic 4 -->
          <article class="rounded-2xl border border-border/60 bg-card p-6 hover:border-green-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Supply Chain Security &amp; Secure CI/CD</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-4">Sign artifacts with Sigstore, generate SBOMs, verify provenance with SLSA levels, and gate deployments on cryptographic attestations. Stop dependency-confusion and build-system attacks at the pipeline, not in production.</p>
            <a routerLink="/courses/kubernetes-supply-chain-security" class="inline-flex items-center gap-1.5 text-sm font-semibold text-green-500 hover:text-green-400 transition-colors">
              Secure your supply chain
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Topic 5 -->
          <article class="rounded-2xl border border-border/60 bg-card p-6 hover:border-pink-500/40 hover:-translate-y-1 transition-all md:col-span-2 lg:col-span-1">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-pink-500" aria-hidden="true"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">API Security &amp; Machine Identity</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-4">Authenticate APIs with workload identity instead of long-lived secrets, rotate credentials cryptographically, and design machine-to-machine flows that scale to thousands of services without OAuth client soup.</p>
            <a routerLink="/courses/machine-identity-management" class="inline-flex items-center gap-1.5 text-sm font-semibold text-pink-500 hover:text-pink-400 transition-colors">
              Design machine identity
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
        </div>

        <!-- Category quick-links retained for internal linking -->
        <div class="flex flex-wrap justify-center gap-2 mt-12" aria-label="Browse by category">
          @for (cat of categories(); track cat.slug) {
            <a [routerLink]="['/category', cat.slug]"
               class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-accent">
              {{ cat.name }}
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Post — Full-width spotlight -->
    @if (featuredPost(); as fp) {
      <section class="py-16 md:py-20 animate-in fade-in duration-700">
        <div class="container max-w-6xl mx-auto px-6">
          <a [routerLink]="['/blog', fp.slug]" class="group block relative">
            <div class="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-violet-500/10 via-card to-blue-500/10 p-[1px]">
              <div class="rounded-[calc(1rem-1px)] bg-card/95 backdrop-blur-xl p-8 md:p-12 lg:p-16">
                <!-- Decorative corner elements -->
                <div class="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 text-yellow-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Featured
                  </span>
                </div>

                <div class="max-w-3xl">
                  <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                    <time class="font-mono text-xs" [attr.datetime]="fp.date">{{ fp.date }}</time>
                    <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                    <span>{{ fp.readTime }}</span>
                  </div>

                  <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] transition-colors duration-300 group-hover:text-primary">
                    {{ fp.title }}
                  </h2>

                  <p class="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    {{ fp.excerpt }}
                  </p>

                  <div class="mt-6 flex flex-wrap gap-2">
                    @for (tag of fp.tags; track tag) {
                      <span class="inline-flex items-center rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {{ tag }}
                      </span>
                    }
                  </div>

                  <div class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <span class="transition-all duration-300 group-hover:mr-1">Read the full article</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                         class="transition-transform duration-300 group-hover:translate-x-2">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>
    }

    <!-- ========================================================== -->
    <!-- SECTION 4: Beginner-Friendly Learning Paths for Modern Infrastructure Security -->
    <!-- ========================================================== -->
    <section class="py-16 md:py-24 bg-gradient-to-br from-violet-500/5 via-card to-blue-500/5 border-y border-border/40 animate-in fade-in duration-700" aria-labelledby="learning-paths-heading">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-block rounded-full bg-violet-500/10 border border-violet-500/30 px-4 py-1 text-xs font-bold text-violet-500 uppercase tracking-wider mb-4">Learning Paths</span>
          <h2 id="learning-paths-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Beginner-Friendly Learning Paths for Modern Infrastructure Security
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Start with first principles, progress to production. Whether you&apos;re new to Kubernetes or refining your cloud-native security expertise, every learning path on CodersSecret is structured around <strong class="text-foreground">visual explanations, annotated diagrams, and reproducible labs</strong> &mdash; so each concept lands before the next one builds on it.
          </p>
        </div>

        <!-- 3 H3 method cards -->
        <div class="grid md:grid-cols-3 gap-5 mb-12">
          <article class="rounded-2xl border border-border/60 bg-card p-6 hover:border-violet-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Step-by-Step Visual Explanations</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Every complex concept &mdash; from SVID rotation to admission webhooks &mdash; is broken into ordered, visual steps. No assumed prerequisites. No paragraphs of dense theory before you see a single diagram.</p>
          </article>
          <article class="rounded-2xl border border-border/60 bg-card p-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Architecture Diagrams &amp; Security Flows</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">SVG architecture diagrams showing exactly how the kube-apiserver authenticates a workload, how SPIRE issues an SVID, how an mTLS handshake completes &mdash; rendered fast, scaled crisply, designed for engineers who think in components.</p>
          </article>
          <article class="rounded-2xl border border-border/60 bg-card p-6 hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-500" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Hands-On Labs &amp; Real Deployment Examples</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Reproducible labs with full YAML, kubectl commands, expected outputs, and rollback steps. You won&apos;t just watch concepts &mdash; you&apos;ll deploy them, break them, and rebuild them on a real cluster.</p>
          </article>
        </div>

        <!-- 3 progression cards (Beginner / Intermediate / Advanced) -->
        <div class="grid md:grid-cols-3 gap-5" aria-label="Suggested learning progression">
          <a routerLink="/glossary" class="group relative overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-6 hover:border-green-500/60 hover:-translate-y-1 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="rounded-full bg-green-500/20 border border-green-500/40 px-2.5 py-0.5 text-[10px] font-bold text-green-500 uppercase tracking-wider">Beginner</span>
              <span class="text-xs text-muted-foreground font-mono">~6 hours</span>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Foundations of Cloud Native Security</h3>
            <p class="text-xs text-muted-foreground leading-relaxed mb-4">Glossary &middot; Kubernetes basics &middot; What is mTLS &middot; What is workload identity &middot; What is Zero Trust.</p>
            <ul class="space-y-1.5 text-xs text-foreground/80">
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>Cloud-native vocabulary</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>Kubernetes object model</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>TLS &amp; mTLS fundamentals</li>
            </ul>
            <div class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-green-500 group-hover:gap-2.5 transition-all">
              Start the foundations
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>

          <a routerLink="/courses/mastering-spiffe-spire" class="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-6 hover:border-blue-500/60 hover:-translate-y-1 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="rounded-full bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider">Intermediate</span>
              <span class="text-xs text-muted-foreground font-mono">~20 hours</span>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">SPIFFE/SPIRE &amp; Workload Identity</h3>
            <p class="text-xs text-muted-foreground leading-relaxed mb-4">Deploy SPIRE on Kubernetes &middot; attest workloads &middot; issue SVIDs &middot; enforce policies &middot; federate trust domains.</p>
            <ul class="space-y-1.5 text-xs text-foreground/80">
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>SPIRE server &amp; agent setup</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>X.509 &amp; JWT SVID issuance</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>Cross-cluster federation</li>
            </ul>
            <div class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 group-hover:gap-2.5 transition-all">
              Open the workload identity course
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>

          <a routerLink="/courses/cloud-native-security-engineering" class="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 hover:border-purple-500/60 hover:-translate-y-1 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 text-[10px] font-bold text-purple-500 uppercase tracking-wider">Advanced</span>
              <span class="text-xs text-muted-foreground font-mono">~40 hours</span>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Production Cloud Native Security Engineering</h3>
            <p class="text-xs text-muted-foreground leading-relaxed mb-4">Multi-cluster security &middot; supply-chain attestation &middot; runtime detection &middot; incident response &middot; capstone project.</p>
            <ul class="space-y-1.5 text-xs text-foreground/80">
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>Multi-cloud federation</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>Sigstore &amp; SLSA pipelines</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>Production capstone</li>
            </ul>
            <div class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-500 group-hover:gap-2.5 transition-all">
              Tackle the production track
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 5: Explore Cloud Native Security Architecture & Diagrams -->
    <!-- ========================================================== -->
    <section class="py-16 md:py-24 animate-in fade-in duration-700" aria-labelledby="architecture-heading">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-block rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1 text-xs font-bold text-cyan-500 uppercase tracking-wider mb-4">Architecture &amp; Diagrams</span>
          <h2 id="architecture-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Explore Cloud Native Security <span class="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Architecture &amp; Diagrams</span>
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Annotated, interactive diagrams that map the real architecture of modern infrastructure security &mdash; from how a kubelet authenticates to the API server to how SPIRE federates SVIDs across clouds. Hover any component to read what it does and why it&apos;s there.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-5">
          <!-- Diagram 1: Kubernetes Architecture -->
          <a routerLink="/cheatsheets/kubernetes" class="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-orange-500/40 hover:-translate-y-1 hover:shadow-xl transition-all">
            <div class="aspect-[16/10] bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-500/10 p-5 flex items-center justify-center">
              <svg viewBox="0 0 200 120" class="w-full h-full" aria-hidden="true">
                <defs>
                  <linearGradient id="diagK8s" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f97316" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.6"/>
                  </linearGradient>
                </defs>
                <rect x="10" y="10" width="180" height="30" rx="4" fill="url(#diagK8s)" opacity="0.3"/>
                <text x="100" y="29" text-anchor="middle" font-size="9" font-weight="700" fill="#f97316">Control Plane (apiserver, etcd, scheduler)</text>
                <rect x="10" y="50" width="55" height="55" rx="4" fill="none" stroke="#f97316" stroke-width="1.5" opacity="0.7"/>
                <text x="37" y="80" text-anchor="middle" font-size="8" font-weight="600" fill="currentColor" class="text-foreground">Node 1</text>
                <rect x="72" y="50" width="55" height="55" rx="4" fill="none" stroke="#f97316" stroke-width="1.5" opacity="0.7"/>
                <text x="100" y="80" text-anchor="middle" font-size="8" font-weight="600" fill="currentColor" class="text-foreground">Node 2</text>
                <rect x="135" y="50" width="55" height="55" rx="4" fill="none" stroke="#f97316" stroke-width="1.5" opacity="0.7"/>
                <text x="162" y="80" text-anchor="middle" font-size="8" font-weight="600" fill="currentColor" class="text-foreground">Node 3</text>
                <line x1="37" y1="50" x2="50" y2="40" stroke="#f97316" stroke-width="1" opacity="0.4"/>
                <line x1="100" y1="50" x2="100" y2="40" stroke="#f97316" stroke-width="1" opacity="0.4"/>
                <line x1="162" y1="50" x2="150" y2="40" stroke="#f97316" stroke-width="1" opacity="0.4"/>
              </svg>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold mb-2 tracking-tight group-hover:text-orange-500 transition-colors">Kubernetes Architecture Diagrams</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Control plane components, node-level security boundaries, the flow of an admission request, and where workload identity plugs in.</p>
            </div>
          </a>

          <!-- Diagram 2: SPIFFE/SPIRE Flow -->
          <a routerLink="/courses/mastering-spiffe-spire" class="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-xl transition-all">
            <div class="aspect-[16/10] bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10 p-5 flex items-center justify-center">
              <svg viewBox="0 0 200 120" class="w-full h-full" aria-hidden="true">
                <circle cx="40" cy="60" r="18" fill="none" stroke="#14b8a6" stroke-width="2"/>
                <text x="40" y="63" text-anchor="middle" font-size="8" font-weight="700" fill="#14b8a6">Workload</text>
                <circle cx="100" cy="60" r="18" fill="none" stroke="#06b6d4" stroke-width="2"/>
                <text x="100" y="58" text-anchor="middle" font-size="7" font-weight="700" fill="#06b6d4">SPIRE</text>
                <text x="100" y="68" text-anchor="middle" font-size="7" font-weight="700" fill="#06b6d4">Agent</text>
                <circle cx="160" cy="60" r="18" fill="none" stroke="#3b82f6" stroke-width="2"/>
                <text x="160" y="58" text-anchor="middle" font-size="7" font-weight="700" fill="#3b82f6">SPIRE</text>
                <text x="160" y="68" text-anchor="middle" font-size="7" font-weight="700" fill="#3b82f6">Server</text>
                <line x1="58" y1="60" x2="82" y2="60" stroke="#14b8a6" stroke-width="1.5" marker-end="url(#arrow1)"/>
                <line x1="118" y1="60" x2="142" y2="60" stroke="#06b6d4" stroke-width="1.5" marker-end="url(#arrow1)"/>
                <text x="70" y="55" text-anchor="middle" font-size="6" fill="currentColor" class="text-muted-foreground">attest</text>
                <text x="130" y="55" text-anchor="middle" font-size="6" fill="currentColor" class="text-muted-foreground">SVID</text>
                <defs>
                  <marker id="arrow1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" class="text-muted-foreground"/>
                  </marker>
                </defs>
              </svg>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold mb-2 tracking-tight group-hover:text-teal-500 transition-colors">SPIFFE/SPIRE Security Flows</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Workload attestation, SVID issuance, trust bundle exchange, and federation flows &mdash; rendered as the message-passing diagrams operators actually need.</p>
            </div>
          </a>

          <!-- Diagram 3: Zero Trust Architecture -->
          <a routerLink="/courses/zero-trust-kubernetes" class="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-xl transition-all">
            <div class="aspect-[16/10] bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-rose-500/10 p-5 flex items-center justify-center">
              <svg viewBox="0 0 200 120" class="w-full h-full" aria-hidden="true">
                <circle cx="100" cy="60" r="40" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 3"/>
                <circle cx="100" cy="60" r="22" fill="none" stroke="#ec4899" stroke-width="1.5"/>
                <text x="100" y="58" text-anchor="middle" font-size="7" font-weight="700" fill="#ec4899">Policy</text>
                <text x="100" y="68" text-anchor="middle" font-size="7" font-weight="700" fill="#ec4899">Engine</text>
                <circle cx="40" cy="30" r="10" fill="none" stroke="#a855f7" stroke-width="1.5"/>
                <text x="40" y="33" text-anchor="middle" font-size="6" font-weight="700" fill="#a855f7">Svc A</text>
                <circle cx="160" cy="30" r="10" fill="none" stroke="#a855f7" stroke-width="1.5"/>
                <text x="160" y="33" text-anchor="middle" font-size="6" font-weight="700" fill="#a855f7">Svc B</text>
                <circle cx="40" cy="100" r="10" fill="none" stroke="#a855f7" stroke-width="1.5"/>
                <text x="40" y="103" text-anchor="middle" font-size="6" font-weight="700" fill="#a855f7">Svc C</text>
                <circle cx="160" cy="100" r="10" fill="none" stroke="#a855f7" stroke-width="1.5"/>
                <text x="160" y="103" text-anchor="middle" font-size="6" font-weight="700" fill="#a855f7">Svc D</text>
                <line x1="50" y1="35" x2="80" y2="50" stroke="#a855f7" stroke-width="1" opacity="0.5"/>
                <line x1="150" y1="35" x2="120" y2="50" stroke="#a855f7" stroke-width="1" opacity="0.5"/>
                <line x1="50" y1="95" x2="80" y2="75" stroke="#a855f7" stroke-width="1" opacity="0.5"/>
                <line x1="150" y1="95" x2="120" y2="75" stroke="#a855f7" stroke-width="1" opacity="0.5"/>
              </svg>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold mb-2 tracking-tight group-hover:text-purple-500 transition-colors">Zero Trust Security Architectures</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Identity-aware proxies, policy decision/enforcement points, continuous verification flows &mdash; with concrete mappings to OPA, SPIRE, and service mesh implementations.</p>
            </div>
          </a>
        </div>

        <div class="mt-10 text-center">
          <a routerLink="/glossary" class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all duration-300">
            Browse the cloud-native glossary
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Most Popular — Ranked by traffic -->
    @if (popularPosts().length > 0) {
      <section class="py-16 animate-in fade-in duration-700">
        <div class="container max-w-6xl mx-auto px-6">
          <div class="flex items-end justify-between mb-10">
            <div>
              <h2 class="text-3xl font-extrabold tracking-tight">Most Popular</h2>
              <p class="mt-2 text-muted-foreground">Top reads from our community</p>
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            @for (post of popularPosts(); track post.id; let i = $index) {
              <article class="group">
                <a [routerLink]="['/blog', post.slug]" class="block h-full">
                  <div class="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                    <!-- Rank badge -->
                    <div class="absolute top-3 left-3 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full font-extrabold text-sm"
                         [class]="i === 0 ? 'bg-yellow-500 text-yellow-950' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-400 text-orange-950' : 'bg-muted text-muted-foreground'">
                      #{{ i + 1 }}
                    </div>
                    <!-- Top accent bar -->
                    <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         [style.background-image]="'linear-gradient(to right, transparent, ' + getCategoryColor(post.category) + ', transparent)'"></div>

                    <div class="p-6 pt-14 flex flex-col justify-between h-full">
                      <div>
                        <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                [style.background-color]="getCategoryColor(post.category) + '15'"
                                [style.color]="getCategoryColor(post.category)">
                            {{ post.category }}
                          </span>
                          <span>{{ post.readTime }}</span>
                        </div>
                        <h3 class="font-bold text-lg tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary line-clamp-2">
                          {{ post.title }}
                        </h3>
                        <p class="mt-2 text-sm text-muted-foreground line-clamp-2">{{ post.excerpt }}</p>
                      </div>
                      <div class="mt-4 flex items-center justify-between">
                        <div class="flex flex-wrap gap-1.5">
                          @for (tag of post.tags.slice(0, 2); track tag) {
                            <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {{ tag }}
                            </span>
                          }
                        </div>
                        <div class="shrink-0 ml-4 inline-flex items-center justify-center rounded-full h-8 w-8 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            }
          </div>
        </div>
      </section>
    }

    <!-- Latest Posts — Modern card grid -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Latest Articles</h2>
            <p class="mt-2 text-muted-foreground">Fresh insights and tutorials</p>
          </div>
          <a routerLink="/blog"
             class="group hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-5 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-accent hover:shadow-sm">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          @for (post of latestPosts(); track post.id; let i = $index) {
            <article class="group" [class]="i === 0 ? 'md:col-span-2' : ''">
              <a [routerLink]="['/blog', post.slug]" class="block h-full">
                <div class="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                     [class]="i === 0 ? 'md:flex md:items-stretch' : ''">
                  <!-- Color accent bar -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div class="p-6 md:p-8 flex flex-col justify-between" [class]="i === 0 ? 'md:flex-1' : ''">
                    <div>
                      <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              [style.background-color]="getCategoryColor(post.category) + '15'"
                              [style.color]="getCategoryColor(post.category)">
                          {{ post.category }}
                        </span>
                        <time class="font-mono" [attr.datetime]="post.date">{{ post.date }}</time>
                        <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <span>{{ post.readTime }}</span>
                      </div>

                      <h3 class="font-bold tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary"
                          [class]="i === 0 ? 'text-2xl md:text-3xl' : 'text-xl'">
                        {{ post.title }}
                      </h3>

                      <p class="mt-3 text-muted-foreground leading-relaxed"
                         [class]="i === 0 ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'">
                        {{ post.excerpt }}
                      </p>
                    </div>

                    <div class="mt-5 flex items-center justify-between">
                      <div class="flex flex-wrap gap-1.5">
                        @for (tag of post.tags.slice(0, i === 0 ? 4 : 2); track tag) {
                          <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {{ tag }}
                          </span>
                        }
                      </div>
                      <div class="shrink-0 ml-4 inline-flex items-center justify-center rounded-full h-8 w-8 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </article>
          }
        </div>

        <!-- Mobile view all link -->
        <div class="mt-8 text-center sm:hidden">
          <a routerLink="/blog"
             class="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl active:scale-[0.97]">
            View all articles
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Trending Tags (compact) -->
    <section class="py-12 animate-in fade-in duration-700" aria-labelledby="trending-tags-heading">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="mb-6">
          <h2 id="trending-tags-heading" class="text-2xl font-extrabold tracking-tight">Trending Topics</h2>
          <p class="mt-1 text-sm text-muted-foreground">Click any tag to find related articles &amp; tutorials.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          @for (tag of trendingTags(); track tag.name) {
            <a [routerLink]="['/blog']" [queryParams]="{tag: tag.name}"
               class="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:-translate-y-0.5"
               [style.fontSize.px]="11 + tag.count">
              <span>{{ tag.name }}</span>
              <span class="text-xs opacity-60 group-hover:opacity-100">{{ tag.count }}</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 6: Designed for Backend Engineers, Platform Engineers & DevOps Teams -->
    <!-- ========================================================== -->
    <section class="py-16 md:py-24 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 border-y border-border/40 animate-in fade-in duration-700" aria-labelledby="audience-heading">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-1 text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">For Engineers Shipping in Production</span>
          <h2 id="audience-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Designed for <span class="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Backend Engineers</span>, <span class="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Platform Engineers</span> &amp; <span class="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">DevOps Teams</span>
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            CodersSecret is built for the engineers who own production: the people writing the services, running the clusters, and on the pager when something breaks. Every course, lab, and architecture diagram is designed to be immediately useful in real systems &mdash; not just academic.
          </p>
        </div>

        <!-- 3 H3 framing headings -->
        <div class="grid md:grid-cols-3 gap-5 mb-10">
          <div class="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-blue-500/40 transition-all">
            <h3 class="text-lg font-bold mb-2 tracking-tight">Production Security for Modern Applications</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">From REST APIs and gRPC services to event-driven systems and ML pipelines &mdash; ship them with workload identity, mTLS, and policy enforcement baked in from day one.</p>
          </div>
          <div class="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-cyan-500/40 transition-all">
            <h3 class="text-lg font-bold mb-2 tracking-tight">Secure Service-to-Service Communication</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Replace shared secrets, static API keys, and trust-by-IP with cryptographic, short-lived workload identities that survive auto-scaling, restarts, and multi-cluster failover.</p>
          </div>
          <div class="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-teal-500/40 transition-all">
            <h3 class="text-lg font-bold mb-2 tracking-tight">Identity-First Cloud Native Systems</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Treat identity as the foundational primitive &mdash; ahead of network, ahead of permissions &mdash; so every authorization decision has a verifiable subject behind it.</p>
          </div>
        </div>

        <!-- 5 audience role cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3" aria-label="Built for these roles">
          <a routerLink="/category/backend" class="group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-blue-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-blue-500 transition-colors">Backend Engineers</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Build services that authenticate without secrets.</p>
          </a>
          <a routerLink="/category/devops" class="group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-orange-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-orange-500 transition-colors">DevOps Engineers</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Wire up secure CI/CD &amp; cluster automation.</p>
          </a>
          <a routerLink="/courses/cloud-native-security-engineering" class="group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-cyan-500 transition-colors">Platform Engineers</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Build internal platforms with identity built-in.</p>
          </a>
          <a routerLink="/courses/mastering-spiffe-spire" class="group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-purple-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-purple-500 transition-colors">Security Engineers</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Adopt CNCF-native controls for modern stacks.</p>
          </a>
          <a routerLink="/courses/kubernetes-runtime-security" class="group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-green-500/40 hover:-translate-y-1 transition-all">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-green-500 transition-colors">SREs</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Detect, contain, and recover from incidents.</p>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 7: Why Cloud Native Security Matters -->
    <!-- ========================================================== -->
    <section class="py-16 md:py-24 animate-in fade-in duration-700" aria-labelledby="why-matters-heading">
      <div class="container max-w-4xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="inline-block rounded-full bg-pink-500/10 border border-pink-500/30 px-4 py-1 text-xs font-bold text-pink-500 uppercase tracking-wider mb-4">Why It Matters</span>
          <h2 id="why-matters-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Why <span class="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">Cloud Native Security</span> Matters
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            The infrastructure model has changed. The security model has to change with it.
          </p>
        </div>

        <div class="space-y-10">
          <article>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-3">Traditional Security No Longer Works</h3>
            <p class="text-base text-muted-foreground leading-relaxed">
              The classic security model was built around a perimeter: a corporate network, a DMZ, a handful of servers, and a firewall in front of all of it. Cloud native infrastructure has dissolved that perimeter. Workloads spin up and down in seconds, run across clouds and clusters, talk to each other over the public internet, and frequently belong to ephemeral identities that didn&apos;t exist five minutes ago. <strong class="text-foreground">Network location is no longer a meaningful security signal</strong> &mdash; and any system still relying on &quot;trust the IP range&quot; is structurally broken in this environment.
            </p>
          </article>

          <article>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-3">The Rise of Workload Identity &amp; Zero Trust</h3>
            <p class="text-base text-muted-foreground leading-relaxed">
              The replacement for network-based trust is <a routerLink="/glossary/workload-identity" class="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">workload identity</a>: every service, container, and function gets a cryptographically verifiable identity, refreshed continuously, attested by the underlying platform. Combined with <a routerLink="/glossary/zero-trust" class="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">Zero Trust</a> principles &mdash; never trust, always verify, assume breach &mdash; this lets us build distributed systems where every authorization decision is based on who the workload <em>is</em>, not where it sits on the network. CNCF projects like <a routerLink="/glossary/spiffe" class="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">SPIFFE</a> and <a routerLink="/glossary/spire" class="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">SPIRE</a> make this practical and portable across clouds.
            </p>
          </article>

          <article>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-3">Securing Kubernetes &amp; Distributed Systems at Scale</h3>
            <p class="text-base text-muted-foreground leading-relaxed">
              Kubernetes is now the substrate that runs most modern infrastructure, which means its attack surface &mdash; the API server, kubelet, etcd, container runtime, networking, supply chain &mdash; is the attack surface of the modern software industry. Securing it requires fluency in admission control, RBAC, runtime detection, mTLS, signed artifacts, and policy-as-code. CodersSecret exists to teach those disciplines together, with the same depth that production engineering teams need to actually deploy them &mdash; not as isolated tools, but as a coherent <strong class="text-foreground">cloud native security architecture</strong>.
            </p>
          </article>
        </div>

        <div class="mt-12 flex flex-wrap justify-center gap-3">
          <a routerLink="/courses/cloud-native-security-engineering" class="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Start the Cloud Native Security course
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a routerLink="/glossary" class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-7 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all duration-300">
            Browse the glossary
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/5 via-card to-blue-500/5 p-10 md:p-16">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">Built for Engineers, by an Engineer</h2>
            <p class="mt-3 text-muted-foreground max-w-2xl mx-auto">Real production knowledge, not surface-level tutorials. Every article is written from hands-on experience and tested against real-world systems.</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{{ totalPosts() }}+</div>
              <div class="mt-2 text-sm text-muted-foreground">In-Depth Articles</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{{ avgReadTime() }}</div>
              <div class="mt-2 text-sm text-muted-foreground">Avg Read Time (min)</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">{{ uniqueTags() }}+</div>
              <div class="mt-2 text-sm text-muted-foreground">Topics Covered</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">{{ totalPosts() }}</div>
              <div class="mt-2 text-sm text-muted-foreground">Slide Tutorials</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">100%</div>
              <div class="mt-2 text-sm text-muted-foreground">Free, Open Source</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Author Teaser -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <a routerLink="/about" class="group block">
          <div class="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div class="flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white text-3xl md:text-4xl font-bold flex-shrink-0">
                V
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Written By</span>
                </div>
                <h3 class="text-2xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-primary">Vishal Anand</h3>
                <p class="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
                  Senior Product Engineer and Tech Lead with hands-on experience building production systems at scale. Writing about backend architecture, DevOps, security, Kubernetes, and the Python ecosystem &mdash; the kind of practical knowledge you only get from years on the job.
                </p>
                <div class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Learn more about CodersSecret
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                       class="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-3xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p class="mt-3 text-muted-foreground">Common questions about CodersSecret and our content</p>
        </div>

        <div class="space-y-3">
          @for (faq of faqs; track faq.q) {
            <details class="group rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
              <summary class="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 text-base font-semibold text-foreground select-none hover:bg-accent/30 transition-colors">
                <span>{{ faq.q }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="text-muted-foreground transition-transform duration-300 group-open:rotate-180 flex-shrink-0">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </summary>
              <div class="px-6 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed" [innerHTML]="faq.a"></div>
            </details>
          }
        </div>
      </div>
    </section>

    <!-- Support / Buy Me a Coffee -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-4xl mx-auto px-6">
        <div class="relative rounded-3xl overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10 p-10 md:p-16">
          <!-- Decorative background -->
          <div class="absolute inset-0 -z-10">
            <div class="absolute top-[-30%] right-[-10%] h-[300px] w-[300px] rounded-full bg-yellow-400/20 blur-[100px] animate-blob"></div>
            <div class="absolute bottom-[-20%] left-[-10%] h-[250px] w-[250px] rounded-full bg-orange-400/20 blur-[100px] animate-blob animation-delay-2000"></div>
          </div>

          <div class="text-center">
            <div class="text-6xl md:text-7xl mb-6 animate-bounce-slow">&#x2615;</div>
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Support This Blog
            </h2>
            <p class="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-2">
              CodersSecret is <strong class="text-foreground">100% free and ad-free</strong> &mdash; no paywalls, no signup walls, no tracking beyond anonymous analytics.
            </p>
            <p class="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              If these articles have helped you ship better software or land a job, consider buying me a coffee. It keeps the content coming and the servers running.
            </p>
            <a href="https://buymeacoffee.com/riptechlead" target="_blank" rel="noopener noreferrer"
               class="group inline-flex items-center gap-3 rounded-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold px-8 py-4 text-base md:text-lg shadow-xl shadow-yellow-500/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.97]">
              <span class="text-2xl">&#x2615;</span>
              Buy me a coffee
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                   class="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
            <p class="mt-6 text-sm text-muted-foreground">
              Or just share a post that helped you &mdash; that helps too. &#x1F64C;
            </p>
          </div>
        </div>
      </div>
    </section>

  `,
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);
  private readonly homeDescription = 'Free cloud native security courses and engineering guides on Kubernetes, SPIFFE/SPIRE, Zero Trust, DevSecOps, API security, labs, and diagrams.';
  featuredPost = signal<PostCard | undefined>(undefined);
  popularPosts = signal<PostCard[]>([]);
  latestPosts = signal<PostCard[]>([]);
  categories = signal<CategoryInfo[]>([]);
  totalPosts = signal(0);
  uniqueTags = signal(0);
  totalCourseModules = signal(0);
  totalLabs = signal(0);
  avgReadTime = signal(0);
  trendingTags = signal<{ name: string; count: number }[]>([]);
  private categoryCountsMap = signal<Record<string, number>>({});

  async ngOnInit() {
    // Only load blog metadata (48KB) — NOT the course model (418KB)
    const { BLOG_POSTS, CATEGORIES } = await import('../../models/blog-post.model');

    const featured = BLOG_POSTS.find(p => p.featured);
    this.featuredPost.set(featured ? this.toCard(featured) : undefined);
    this.popularPosts.set(
      BLOG_POSTS.filter(p => p.popularRank != null)
        .sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99))
        .slice(0, 6).map(p => this.toCard(p))
    );
    this.latestPosts.set(BLOG_POSTS.filter(p => !p.featured).slice(0, 4).map(p => this.toCard(p)));
    this.categories.set(CATEGORIES.filter(c => c.slug !== ''));
    this.totalPosts.set(BLOG_POSTS.length);
    this.uniqueTags.set(new Set(BLOG_POSTS.flatMap(p => p.tags)).size);
    // Course stats: hardcoded to avoid importing 418KB course model for 2 numbers
    // Update when adding/removing courses: 3 courses, 45 modules, 130+ labs
    this.totalCourseModules.set(45);
    this.totalLabs.set(130);
    this.avgReadTime.set(Math.round(
      BLOG_POSTS.reduce((sum, p) => { const m = p.readTime.match(/(\d+)/); return sum + (m ? parseInt(m[1], 10) : 0); }, 0) / Math.max(BLOG_POSTS.length, 1)
    ));

    const counts: Record<string, number> = {};
    for (const p of BLOG_POSTS) { for (const t of p.tags) counts[t] = (counts[t] || 0) + 1; }
    this.trendingTags.set(Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 20));

    const catCounts: Record<string, number> = {};
    for (const p of BLOG_POSTS) { catCounts[p.category] = (catCounts[p.category] || 0) + 1; }
    this.categoryCountsMap.set(catCounts);
  }

  private toCard(p: any): PostCard {
    return { id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, category: p.category, date: p.date, readTime: p.readTime, tags: p.tags, author: p.author, featured: p.featured, popularRank: p.popularRank, coverImage: p.coverImage };
  }

  faqs = [
    {
      q: 'What is cloud native security?',
      a: 'Cloud native security is the discipline of securing applications and infrastructure that are designed to run in dynamic, containerized, distributed environments &mdash; primarily on Kubernetes and across multiple clouds. It replaces perimeter-based controls with identity-based controls, defense-in-depth across the whole stack (image &rarr; container &rarr; pod &rarr; cluster &rarr; mesh), and policy that travels with the workload. Core building blocks include <a href="/glossary/workload-identity" class="text-primary underline">workload identity</a>, <a href="/glossary/mtls" class="text-primary underline">mTLS</a>, <a href="/glossary/opa" class="text-primary underline">OPA policy enforcement</a>, supply-chain signing, and runtime detection. Learn it end-to-end in the <a href="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering course</a>.',
    },
    {
      q: 'What is workload identity?',
      a: 'Workload identity is a cryptographically verifiable identifier that names a piece of software &mdash; a container, a Pod, a Lambda, a VM &mdash; instead of a human or an IP address. Instead of long-lived API keys or shared secrets, the workload presents a short-lived, attested credential (such as a SPIFFE SVID) that other services can verify. This eliminates secret-sprawl, makes auto-rotation trivial, and is the foundation of Zero Trust service-to-service authentication. See the <a href="/glossary/workload-identity" class="text-primary underline">workload identity glossary entry</a> for a deeper definition.',
    },
    {
      q: 'What is SPIFFE and SPIRE?',
      a: 'SPIFFE (Secure Production Identity Framework For Everyone) is a CNCF specification that defines a universal format for workload identity &mdash; the SPIFFE ID and the SVID (SPIFFE Verifiable Identity Document, in either X.509 or JWT form). SPIRE is the reference implementation: a SPIRE Server issues SVIDs after a SPIRE Agent attests the workload using node and workload selectors. Together they let services prove who they are across clusters and clouds without relying on shared secrets. The <a href="/courses/mastering-spiffe-spire" class="text-primary underline">Mastering SPIFFE &amp; SPIRE</a> course walks through deploying both on Kubernetes from scratch.',
    },
    {
      q: 'Why is Kubernetes security important?',
      a: 'Kubernetes is the substrate that runs most modern infrastructure, which makes its attack surface &mdash; the API server, kubelet, etcd, container runtime, network plugins, and the supply chain feeding all of them &mdash; the attack surface of the modern software industry. A misconfigured RBAC binding, an unsigned container image, or a privileged sidecar can all turn into full cluster compromise. Securing Kubernetes requires fluency in admission control, PodSecurity standards, network policies, runtime detection (Falco / eBPF), and policy-as-code (OPA). The <a href="/courses/kubernetes-runtime-security" class="text-primary underline">Kubernetes Runtime Security</a> guide covers the full picture.',
    },
    {
      q: 'What is Zero Trust architecture?',
      a: 'Zero Trust is a security model that drops the assumption of a trusted internal network. Instead of granting access based on network location, every request is authenticated, authorized, and encrypted &mdash; with policy decisions made at request time using the workload&apos;s identity, posture, and context. In cloud native systems this typically means SPIFFE-issued workload identity for the &quot;who,&quot; mTLS for the channel, and OPA / Rego for the &quot;what they&apos;re allowed to do.&quot; See the <a href="/glossary/zero-trust" class="text-primary underline">Zero Trust glossary entry</a> and the <a href="/courses/zero-trust-kubernetes" class="text-primary underline">Zero Trust for Kubernetes</a> guide.',
    },
    {
      q: 'How do service-to-service authentication systems work?',
      a: 'Modern service-to-service authentication replaces shared API keys with short-lived, cryptographic identities. The flow generally looks like this: (1) the workload starts up and connects to a local identity provider (e.g. SPIRE Agent); (2) the agent attests the workload using selectors such as Kubernetes namespace, service account, and image hash; (3) the workload receives an SVID (X.509 cert or JWT); (4) when calling another service it presents the SVID over mTLS or in an Authorization header; (5) the receiving service validates the SVID against the trust bundle and applies authorization policy (often OPA). The <a href="/courses/secure-service-to-service-communication" class="text-primary underline">Secure Service-to-Service Communication</a> guide walks through a full reference implementation.',
    },
    {
      q: 'Are the courses and tutorials free?',
      a: 'Yes. Every course, every module, every lab, and every article on CodersSecret is 100% free and ad-free. There&apos;s no paywall, no signup wall, and no tracking beyond anonymous analytics. The site is open source and maintained by the author.',
    },
    {
      q: 'Who writes the content?',
      a: 'All content is written by <a href="/about" class="text-primary underline">Vishal Anand</a>, a Senior Product Engineer and Tech Lead with hands-on experience building production systems at scale. Every course, lab, and architecture diagram is grounded in real engineering practice rather than textbook theory.',
    },
    {
      q: 'What is the "Watch as Slides" feature?',
      a: 'Every tutorial on CodersSecret can be watched as an auto-narrated slide presentation &mdash; like a YouTube video, but 20&times; lighter on bandwidth. Each slide focuses on the key visual, while a narrator explains the details. You can pick your preferred voice, adjust speed (0.75&times;&ndash;1.5&times;), toggle auto-advance, and read the full narrator script. Perfect for learners who prefer watching over reading or who need a distraction-free focus mode. Try the <a href="/slides/drf-api-logger" class="text-primary underline">slide demo</a>.',
    },
    {
      q: 'How do you handle privacy and tracking?',
      a: 'We use only Google Analytics for anonymous page views. No advertising cookies, no tracking pixels, no user accounts required. Comments use GitHub Discussions (only loads if you choose to comment). Read the full <a href="/privacy" class="text-primary underline">privacy policy</a>.',
    },
  ];

  constructor() {
    this.seo.update({
      title: 'CodersSecret',
      description: this.homeDescription,
      url: '/',
      jsonLd: this.faqSchema(),
    });
  }

  private faqSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': this.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a.replace(/<[^>]+>/g, ''),
        },
      })),
    };
  }

  getCategoryColor(slug: string): string {
    const colors: Record<string, string> = {
      ai: '#06b6d4',
      frontend: '#3b82f6',
      backend: '#22c55e',
      devops: '#f97316',
      tutorials: '#a855f7',
      'open-source': '#ec4899',
    };
    return colors[slug] ?? '#6b7280';
  }

  getCategoryGradient(slug: string): string {
    const gradients: Record<string, string> = {
      ai: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(6,182,212,0.02))',
      frontend: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',
      backend: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
      devops: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))',
      tutorials: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(168,85,247,0.02))',
      'open-source': 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(236,72,153,0.02))',
    };
    return gradients[slug] ?? '';
  }

  getCategoryIcon(slug: string): string {
    const icons: Record<string, string> = {
      ai: '\u{1F916}',
      frontend: '\u{1F3A8}',
      backend: '\u{2699}\u{FE0F}',
      devops: '\u{1F680}',
      tutorials: '\u{1F4DA}',
      'open-source': '\u{1F4E6}',
    };
    return icons[slug] ?? '\u{1F4C1}';
  }

  getCategoryCount(slug: string): number {
    return this.categoryCountsMap()[slug] || 0;
  }
}
