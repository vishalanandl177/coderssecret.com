import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Scenario {
  title: string;
  situation: string;
  symptoms: string[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

@Component({
  selector: 'app-devops-scenario',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/games" class="hover:text-foreground transition-colors">Games</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">DevOps Scenario</li>
          </ol>
        </nav>

        <div class="text-center mb-8">
          <div class="text-5xl mb-4">🚨</div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">DevOps Scenario Simulator</h1>
          <p class="text-muted-foreground">Production incidents. You're on call. What's your next move?</p>
        </div>

        @if (!gameEnded()) {
          <div class="rounded-2xl border border-orange-500/30 bg-card p-6 md:p-8 mb-6">
            <div class="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Incident {{ currentIndex() + 1 }} of {{ scenarios.length }}</span>
              <span>Score: <strong class="text-foreground">{{ score() }}</strong></span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden mb-6">
              <div class="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                   [style.width.%]="((currentIndex() + 1) / scenarios.length) * 100"></div>
            </div>

            <div class="inline-flex items-center gap-2 rounded-full bg-red-500/10 text-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Incident
            </div>
            <h2 class="text-xl font-extrabold mb-3">{{ currentScenario().title }}</h2>
            <p class="text-muted-foreground mb-4 leading-relaxed">{{ currentScenario().situation }}</p>

            <div class="bg-muted rounded-lg p-4 mb-6">
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Symptoms</p>
              <ul class="space-y-1 text-sm font-mono">
                @for (s of currentScenario().symptoms; track s) {
                  <li class="flex items-start gap-2">
                    <span class="text-red-500 mt-0.5">▸</span>
                    <span>{{ s }}</span>
                  </li>
                }
              </ul>
            </div>

            <p class="font-semibold mb-3">What do you do first?</p>
            <div class="space-y-2">
              @for (option of currentScenario().options; track $index; let i = $index) {
                <button (click)="selectAnswer(i)"
                        [disabled]="answered()"
                        [class]="getOptionClass(i)"
                        class="w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 text-sm">
                  <span class="inline-block w-6 h-6 rounded mr-3 text-xs font-bold text-center leading-6 bg-muted">{{ ['A','B','C','D'][i] }}</span>
                  {{ option }}
                </button>
              }
            </div>

            @if (answered()) {
              <div class="mt-6 p-4 rounded-lg"
                   [class]="selectedIndex() === currentScenario().correctIndex ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'">
                <p class="font-semibold mb-2">
                  @if (selectedIndex() === currentScenario().correctIndex) {
                    ✓ Solid call, SRE!
                  } @else {
                    ✗ The right move: <strong>{{ currentScenario().options[currentScenario().correctIndex] }}</strong>
                  }
                </p>
                <p class="text-sm text-muted-foreground leading-relaxed">{{ currentScenario().explanation }}</p>
              </div>
              <button (click)="next()"
                      class="w-full mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]">
                @if (currentIndex() < scenarios.length - 1) {
                  Next Incident →
                } @else {
                  See Results
                }
              </button>
            }
          </div>
        } @else {
          <div class="rounded-2xl border border-border/60 bg-card p-8 md:p-12 text-center">
            <div class="text-6xl mb-4">{{ finalEmoji() }}</div>
            <h2 class="text-3xl font-extrabold tracking-tight mb-2">{{ finalMessage() }}</h2>
            <p class="text-xl text-muted-foreground mb-8">
              You resolved <strong class="text-foreground">{{ score() }} / {{ scenarios.length }}</strong> incidents
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <button (click)="restart()"
                      class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                Play Again
              </button>
              <a routerLink="/games"
                 class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:shadow-md">
                Try Other Games
              </a>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class DevopsScenarioComponent {
  private seo = inject(SeoService);

  scenarios: Scenario[] = [
    {
      title: 'Kubernetes Pod CrashLoopBackOff',
      situation: 'A production web service pod keeps crashing and restarting. Users are seeing 502 errors.',
      symptoms: [
        'kubectl get pods shows Status: CrashLoopBackOff',
        'Restart count increasing every 30 seconds',
        'Deployment was working 1 hour ago',
        'No recent deployments in the last 6 hours',
      ],
      options: [
        'Delete the pod and hope it restarts fresh',
        'kubectl logs --previous to see why it crashed',
        'Roll back to the previous version immediately',
        'Scale the deployment to 0 and back up',
      ],
      correctIndex: 1,
      explanation: 'Always check logs first. `kubectl logs <pod> --previous` shows output from the crashed container. Without knowing WHY, any fix is a guess. Logs reveal: OOMKilled, missing config, dependency down, etc.',
    },
    {
      title: '500 Errors Spike at 3 AM',
      situation: 'PagerDuty alert: your API is returning 500 errors on 30% of requests. Logs show database timeouts.',
      symptoms: [
        'Request latency p99 up from 100ms to 30s',
        'Database CPU at 100%',
        'Connection pool exhausted',
        'Traffic is normal for this time of day',
      ],
      options: [
        'Increase database CPU immediately',
        'Check slow query log for recent changes',
        'Restart all app servers',
        'Block all incoming traffic',
      ],
      correctIndex: 1,
      explanation: 'High DB CPU + normal traffic = bad query, not load. Check `pg_stat_activity` (Postgres) or slow query log. Usually a missing index or a new deployment adding a Cartesian join. Fix: add index or kill the offending query.',
    },
    {
      title: 'TLS Certificate Expired',
      situation: 'Customers reporting "connection is not secure" warnings. Your main domain cert just expired.',
      symptoms: [
        'HTTPS requests failing with NET::ERR_CERT_DATE_INVALID',
        'Let\'s Encrypt certbot last renewal failed 60 days ago',
        'Disk usage at 99% on the cert renewal server',
        'Cron job logs show "no space left on device"',
      ],
      options: [
        'Manually renew the cert via certbot',
        'Free disk space first, then run certbot',
        'Switch to a different CA immediately',
        'Disable HTTPS temporarily',
      ],
      correctIndex: 1,
      explanation: 'Root cause first. Full disk = certbot can\'t write. Fix disk space (truncate old logs, remove old backups), THEN renew. Setting up alerts for disk usage and cert expiry prevents this repeat.',
    },
    {
      title: 'Deployment Rolled Out, Now Nothing Works',
      situation: 'You pushed a new deployment 5 minutes ago. Now all requests are failing with 404s.',
      symptoms: [
        'New pods are Running (not CrashLoopBackOff)',
        'Health checks passing',
        'Routes returning 404 that worked before',
        'No error logs in the app',
      ],
      options: [
        'Check if a config change modified the route prefix',
        'Rollback first, debug after',
        'Delete all pods to force recreation',
        'Check DNS resolution',
      ],
      correctIndex: 1,
      explanation: 'In production, ALWAYS rollback first when something breaks. Investigate the bad deploy after users are restored. Rollback is seconds; debugging can take hours. Later you\'ll find the config changed /api to /v2.',
    },
    {
      title: 'Memory Leak in Node.js Service',
      situation: 'A Node.js service runs fine for ~24 hours, then OOMs. Restarts fix it, but it happens daily.',
      symptoms: [
        'Memory usage grows linearly over time',
        'GC runs more frequently as memory grows',
        'Event loop lag increases before crash',
        'Started happening after last week\'s deploy',
      ],
      options: [
        'Add more memory to the pods',
        'Restart the service every 6 hours via cron',
        'Take a heap snapshot with node --inspect, find the leak',
        'Switch to another Node.js version',
      ],
      correctIndex: 2,
      explanation: 'Bigger memory = delays the crash. Restart cron hides the bug. Heap snapshots reveal what\'s retained: usually closures holding large objects, event listeners not removed, or unbounded caches. Fix the leak, not the symptom.',
    },
    {
      title: 'Slow CI Pipeline',
      situation: 'Your CI pipeline takes 25 minutes. Developers are complaining about lost productivity.',
      symptoms: [
        'Every PR takes 25 min to get feedback',
        'Docker build step alone takes 10 min',
        'Tests run sequentially',
        'No build cache being used',
      ],
      options: [
        'Buy faster CI runners',
        'Parallelize tests + enable Docker BuildKit cache',
        'Run tests only on main branch',
        'Reduce test coverage',
      ],
      correctIndex: 1,
      explanation: 'Low-hanging fruit: BuildKit layer caching cuts Docker builds from 10min to 30s. Test parallelization (pytest-xdist, jest --parallel) can quarter runtime. Don\'t throw money at it until you\'ve optimized.',
    },
  ];

  currentIndex = signal(0);
  selectedIndex = signal<number | null>(null);
  answered = signal(false);
  score = signal(0);
  gameEnded = signal(false);

  currentScenario = computed(() => this.scenarios[this.currentIndex()]);

  finalEmoji = computed(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) return '🏆';
    if (pct >= 0.75) return '👨‍💻';
    if (pct >= 0.5) return '🔧';
    return '📟';
  });

  finalMessage = computed(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) return 'SRE Champion!';
    if (pct >= 0.75) return 'Production-Ready!';
    if (pct >= 0.5) return 'Good Instincts!';
    return 'More Practice Needed';
  });

  constructor() {
    this.seo.update({
      title: 'DevOps Scenario Simulator — Production Incident Game',
      description: 'Practice production incident response. Kubernetes crashes, database outages, TLS expiry, memory leaks — what would you do? Interactive SRE training game.',
      url: '/games/devops-scenario',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Games', url: '/games' },
        { name: 'DevOps Scenario', url: '/games/devops-scenario' },
      ],
    });
  }

  selectAnswer(idx: number) {
    if (this.answered()) return;
    this.selectedIndex.set(idx);
    this.answered.set(true);
    if (idx === this.currentScenario().correctIndex) {
      this.score.update(s => s + 1);
    }
  }

  getOptionClass(idx: number): string {
    if (!this.answered()) {
      return 'border-border hover:border-primary hover:bg-accent cursor-pointer';
    }
    if (idx === this.currentScenario().correctIndex) {
      return 'border-green-500 bg-green-500/10 text-foreground';
    }
    if (idx === this.selectedIndex()) {
      return 'border-red-500 bg-red-500/10 text-foreground';
    }
    return 'border-border opacity-50';
  }

  next() {
    if (this.currentIndex() < this.scenarios.length - 1) {
      this.currentIndex.update(i => i + 1);
      this.selectedIndex.set(null);
      this.answered.set(false);
    } else {
      this.gameEnded.set(true);
    }
  }

  restart() {
    this.currentIndex.set(0);
    this.selectedIndex.set(null);
    this.answered.set(false);
    this.score.set(0);
    this.gameEnded.set(false);
  }
}
