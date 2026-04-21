import { Component, inject, signal, computed, ElementRef, viewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Challenge {
  task: string;
  acceptedAnswers: string[];
  hint: string;
}

@Component({
  selector: 'app-linux-challenge',
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
            <li class="text-foreground font-medium" aria-current="page">Linux Challenge</li>
          </ol>
        </nav>

        <div class="text-center mb-8">
          <div class="text-5xl mb-4">🐧</div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Linux Command Challenge</h1>
          <p class="text-muted-foreground">Type the right command. Multiple valid answers accepted.</p>
        </div>

        @if (!gameEnded()) {
          <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-8 mb-6" [class.correct-flash]="flashCorrect()" [class.wrong-shake]="flashWrong()">
            <div class="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Challenge {{ currentIndex() + 1 }} of {{ challenges.length }}</span>
              <div class="flex items-center gap-3">
                @if (streak() >= 2) {
                  <span class="streak-fire text-orange-500 font-bold text-xs">🔥 {{ streak() }} streak!</span>
                }
                <span [class.score-pop]="flashCorrect()">Score: <strong class="text-foreground">{{ score() }}</strong></span>
              </div>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden mb-6">
              <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                   [style.width.%]="((currentIndex() + 1) / challenges.length) * 100"></div>
            </div>

            <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Your Task</p>
            <p class="text-lg font-semibold mb-6 leading-relaxed">{{ currentChallenge().task }}</p>

            <div class="bg-black rounded-lg p-4 font-mono text-sm mb-4">
              <div class="flex items-center gap-2">
                <span class="text-green-400">user@prod:~$</span>
                <input #input
                       [value]="userAnswer()"
                       (input)="onInput($event)"
                       (keydown.enter)="submit()"
                       [disabled]="answered()"
                       class="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500"
                       placeholder="type your command..."
                       spellcheck="false"
                       autocapitalize="off"
                       autocorrect="off" />
              </div>
            </div>

            @if (!answered()) {
              <div class="flex gap-2">
                <button (click)="submit()"
                        [disabled]="!userAnswer().trim()"
                        class="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit
                </button>
                <button (click)="showHint.set(!showHint())"
                        class="rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent">
                  {{ showHint() ? 'Hide' : 'Hint' }} 💡
                </button>
                <button (click)="skip()"
                        class="rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-accent">
                  Skip
                </button>
              </div>
              @if (showHint()) {
                <div class="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-muted-foreground">
                  💡 {{ currentChallenge().hint }}
                </div>
              }
            }

            @if (answered()) {
              <div class="p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
                   [class]="isCorrect() ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'">
                <p class="font-semibold mb-2">
                  @if (isCorrect()) {
                    ✓ Correct! @if (streak() >= 3) { <span class="text-orange-500">🔥 On fire!</span> }
                  } @else {
                    ✗ Not quite. Valid answers include:
                  }
                </p>
                <div class="space-y-1 font-mono text-sm">
                  @for (ans of currentChallenge().acceptedAnswers; track ans) {
                    <code class="block bg-black/50 px-2 py-1 rounded text-green-400">{{ ans }}</code>
                  }
                </div>
              </div>
              <button (click)="next()"
                      class="w-full mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                @if (currentIndex() < challenges.length - 1) {
                  Next Challenge →
                } @else {
                  See Results
                }
              </button>
            }
          </div>
        } @else {
          <div class="rounded-2xl border border-border/60 bg-card p-8 md:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div class="text-6xl mb-4">{{ finalEmoji() }}</div>
            <h2 class="text-3xl font-extrabold tracking-tight mb-2">{{ finalMessage() }}</h2>
            <p class="text-xl text-muted-foreground mb-4">
              You got <strong class="text-foreground">{{ score() }} / {{ challenges.length }}</strong> commands right
            </p>
            @if (maxStreak() >= 2) {
              <p class="text-sm text-orange-500 font-semibold mb-6">🔥 Best streak: {{ maxStreak() }} in a row</p>
            }
            <div class="h-3 bg-muted rounded-full overflow-hidden max-w-xs mx-auto mb-8">
              <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 xp-bar-fill rounded-full" [style.width.%]="(score() / challenges.length) * 100"></div>
            </div>
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
export class LinuxChallengeComponent implements AfterViewInit {
  private seo = inject(SeoService);
  inputRef = viewChild<ElementRef<HTMLInputElement>>('input');

  challenges: Challenge[] = [
    {
      task: 'List all files (including hidden) in the current directory with detailed info.',
      acceptedAnswers: ['ls -la', 'ls -al', 'ls -lha', 'ls -ahl', 'ls -laF'],
      hint: 'The flag for hidden files is -a, and for long format is -l.',
    },
    {
      task: 'Find all files modified in the last 24 hours under /var/log.',
      acceptedAnswers: ['find /var/log -mtime -1', 'find /var/log -mtime 0', 'find /var/log -type f -mtime -1'],
      hint: 'Use find with the -mtime flag. -1 means "less than 1 day ago".',
    },
    {
      task: 'Show the 20 largest files in /home sorted by size.',
      acceptedAnswers: [
        'du -ah /home | sort -hr | head -20',
        'find /home -type f -exec du -h {} + | sort -hr | head -20',
        'du -ah /home | sort -rh | head -n 20',
      ],
      hint: 'Combine du to get sizes, sort -h for human-readable, and head to limit output.',
    },
    {
      task: 'Count how many lines contain the word "error" in server.log (case-insensitive).',
      acceptedAnswers: ['grep -ic error server.log', 'grep -i error server.log | wc -l', 'grep -c -i error server.log'],
      hint: 'grep has -i for case-insensitive and -c for count.',
    },
    {
      task: 'Kill the process listening on port 8080.',
      acceptedAnswers: [
        'fuser -k 8080/tcp',
        'kill $(lsof -t -i:8080)',
        'kill -9 $(lsof -t -i:8080)',
      ],
      hint: 'lsof -i :PORT finds the process; -t flag returns just the PID.',
    },
    {
      task: 'Make the file deploy.sh executable for the owner only.',
      acceptedAnswers: ['chmod u+x deploy.sh', 'chmod 700 deploy.sh', 'chmod 0700 deploy.sh'],
      hint: 'chmod u+x adds execute permission for the owner (u = user).',
    },
    {
      task: 'Show real-time disk I/O stats (updating every second).',
      acceptedAnswers: ['iostat 1', 'iostat -x 1', 'iostat -xz 1'],
      hint: 'iostat is in the sysstat package. Pass a number for update interval in seconds.',
    },
    {
      task: 'Replace all occurrences of "localhost" with "prod-db" in config.yml (edit in place).',
      acceptedAnswers: [
        `sed -i 's/localhost/prod-db/g' config.yml`,
        `sed -i "s/localhost/prod-db/g" config.yml`,
        `sed -i.bak 's/localhost/prod-db/g' config.yml`,
      ],
      hint: 'sed -i edits in place. The substitute pattern is s/old/new/g.',
    },
    {
      task: 'Show the current memory usage in human-readable format.',
      acceptedAnswers: ['free -h', 'free -mh', 'free --human'],
      hint: 'The command is free, and -h makes it human-readable.',
    },
    {
      task: 'Watch the output of "kubectl get pods" updating every 2 seconds.',
      acceptedAnswers: ['watch kubectl get pods', 'watch -n 2 kubectl get pods', 'watch -n2 kubectl get pods'],
      hint: 'The watch command does this — default interval is 2 seconds.',
    },
    {
      task: 'Show the 5 largest directories under /var sorted by size.',
      acceptedAnswers: [
        'du -sh /var/*/ | sort -hr | head -5',
        'du -sh /var/* | sort -rh | head -5',
        'du -h --max-depth=1 /var | sort -hr | head -5',
      ],
      hint: 'du -sh gives human-readable sizes. sort -h sorts human numbers. head limits output.',
    },
    {
      task: 'Find all processes listening on port 443.',
      acceptedAnswers: [
        'ss -tlnp | grep 443',
        'lsof -i :443',
        'netstat -tlnp | grep 443',
      ],
      hint: 'ss is the modern replacement for netstat. -t for TCP, -l for listening, -n for numeric, -p for process.',
    },
    {
      task: 'Tail the last 50 lines of /var/log/syslog and follow new entries.',
      acceptedAnswers: [
        'tail -50f /var/log/syslog',
        'tail -n 50 -f /var/log/syslog',
        'tail -f -n 50 /var/log/syslog',
      ],
      hint: 'tail -n sets line count. -f follows new entries as they are written.',
    },
  
  ];

  currentIndex = signal(0);
  userAnswer = signal('');
  answered = signal(false);
  score = signal(0);
  streak = signal(0);
  maxStreak = signal(0);
  gameEnded = signal(false);
  showHint = signal(false);
  isCorrect = signal(false);

  currentChallenge = computed(() => this.challenges[this.currentIndex()]);

  finalEmoji = computed(() => {
    const pct = this.score() / this.challenges.length;
    if (pct === 1) return '🏆';
    if (pct >= 0.75) return '🐧';
    if (pct >= 0.5) return '👍';
    return '📖';
  });

  finalMessage = computed(() => {
    const pct = this.score() / this.challenges.length;
    if (pct === 1) return 'Shell Master!';
    if (pct >= 0.75) return 'Power User!';
    if (pct >= 0.5) return 'Getting There!';
    return 'Hit the man pages!';
  });

  constructor() {
    this.seo.update({
      title: 'Linux Command Challenge — Test Your Shell Skills',
      description: 'Interactive Linux command-line challenges. Find files, kill processes, manage permissions, and more. Practice real sysadmin tasks.',
      url: '/games/linux-challenge',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Games', url: '/games' },
        { name: 'Linux Challenge', url: '/games/linux-challenge' },
      ],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.inputRef()?.nativeElement.focus(), 100);
  }

  onInput(event: Event) {
    this.userAnswer.set((event.target as HTMLInputElement).value);
  }

  flashCorrect = signal(false);
  flashWrong = signal(false);

  submit() {
    if (!this.userAnswer().trim()) return;
    const input = this.userAnswer().trim().replace(/\s+/g, ' ');
    const correct = this.currentChallenge().acceptedAnswers.some(
      ans => ans.trim().replace(/\s+/g, ' ').toLowerCase() === input.toLowerCase()
    );
    this.isCorrect.set(correct);
    this.answered.set(true);
    if (correct) {
      this.score.update(s => s + 1);
      this.streak.update(s => s + 1);
      if (this.streak() > this.maxStreak()) this.maxStreak.set(this.streak());
      this.flashCorrect.set(true);
      setTimeout(() => this.flashCorrect.set(false), 800);
    } else {
      this.streak.set(0);
      this.flashWrong.set(true);
      setTimeout(() => this.flashWrong.set(false), 400);
    }
  }

  skip() {
    this.isCorrect.set(false);
    this.answered.set(true);
  }

  next() {
    if (this.currentIndex() < this.challenges.length - 1) {
      this.currentIndex.update(i => i + 1);
      this.userAnswer.set('');
      this.answered.set(false);
      this.showHint.set(false);
      this.isCorrect.set(false);
      setTimeout(() => this.inputRef()?.nativeElement.focus(), 50);
    } else {
      this.gameEnded.set(true);
    }
  }

  restart() {
    this.currentIndex.set(0);
    this.userAnswer.set('');
    this.answered.set(false);
    this.score.set(0);
    this.streak.set(0);
    this.maxStreak.set(0);
    this.gameEnded.set(false);
    this.showHint.set(false);
    this.isCorrect.set(false);
    setTimeout(() => this.inputRef()?.nativeElement.focus(), 50);
  }
}
