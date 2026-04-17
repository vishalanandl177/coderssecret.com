import { Component, inject, signal, computed, ElementRef, viewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Snippet {
  language: string;
  code: string;
  source: string;
}

@Component({
  selector: 'app-typing-test',
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
            <li class="text-foreground font-medium" aria-current="page">Code Typing Speed</li>
          </ol>
        </nav>

        <div class="text-center mb-8">
          <div class="text-5xl mb-4">⚡</div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Code Typing Speed Test</h1>
          <p class="text-muted-foreground">How fast can you type real code? No backspace shortcuts.</p>
        </div>

        <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span class="inline-flex items-center rounded-full bg-purple-500/10 text-purple-500 px-3 py-1 text-xs font-bold uppercase tracking-wider mr-2">{{ currentSnippet().language }}</span>
              <span class="text-xs text-muted-foreground">{{ currentSnippet().source }}</span>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <div><span class="text-muted-foreground">Time:</span> <strong class="font-mono">{{ elapsedTime() }}s</strong></div>
              <div><span class="text-muted-foreground">WPM:</span> <strong class="font-mono text-primary">{{ wpm() }}</strong></div>
              <div><span class="text-muted-foreground">Accuracy:</span> <strong class="font-mono">{{ accuracy() }}%</strong></div>
            </div>
          </div>

          <div class="bg-muted rounded-lg p-4 md:p-6 font-mono text-sm leading-relaxed mb-4 min-h-[200px] whitespace-pre overflow-x-auto"
               (click)="focusInput()">
            @for (char of typedChars(); track $index) {
              <span [class]="char.class">{{ char.char }}</span>
            }
          </div>

          <textarea #input
                    [value]="userInput()"
                    (input)="onInput($event)"
                    (paste)="$event.preventDefault()"
                    [disabled]="finished()"
                    class="sr-only"
                    autofocus></textarea>

          @if (!started() && !finished()) {
            <p class="text-center text-sm text-muted-foreground">Click anywhere above or start typing to begin</p>
          }

          @if (finished()) {
            <div class="mt-6 p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-primary/20 text-center">
              <h2 class="text-2xl font-extrabold mb-2">{{ resultMessage() }}</h2>
              <div class="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <div class="text-3xl font-extrabold text-primary">{{ wpm() }}</div>
                  <div class="text-xs text-muted-foreground uppercase tracking-wider">Words/min</div>
                </div>
                <div>
                  <div class="text-3xl font-extrabold text-green-500">{{ accuracy() }}%</div>
                  <div class="text-xs text-muted-foreground uppercase tracking-wider">Accuracy</div>
                </div>
                <div>
                  <div class="text-3xl font-extrabold text-orange-500">{{ elapsedTime() }}s</div>
                  <div class="text-xs text-muted-foreground uppercase tracking-wider">Duration</div>
                </div>
              </div>
              <button (click)="restart()"
                      class="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                Try Another Snippet
              </button>
            </div>
          }
        </div>

        <div class="mt-6 flex justify-center">
          <a routerLink="/games"
             class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            ← All Games
          </a>
        </div>
      </div>
    </section>
  `,
})
export class TypingTestComponent implements AfterViewInit {
  private seo = inject(SeoService);
  inputRef = viewChild<ElementRef<HTMLTextAreaElement>>('input');

  snippets: Snippet[] = [
    {
      language: 'Python',
      source: 'Classic list comprehension',
      code: `numbers = [1, 2, 3, 4, 5]
squared = [n * n for n in numbers]
total = sum(squared)
print(f"Sum of squares: {total}")`,
    },
    {
      language: 'JavaScript',
      source: 'Async/await pattern',
      code: `async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}`,
    },
    {
      language: 'Go',
      source: 'HTTP handler',
      code: `func healthCheck(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    fmt.Fprintln(w, \`{"status":"ok"}\`)
}`,
    },
    {
      language: 'Rust',
      source: 'Pattern matching',
      code: `fn main() {
    let x = Some(5);
    match x {
        Some(n) if n > 0 => println!("Positive: {}", n),
        Some(0) => println!("Zero"),
        _ => println!("Other"),
    }
}`,
    },
    {
      language: 'TypeScript',
      source: 'Angular component',
      code: `@Component({
  selector: 'app-counter',
  template: '<button (click)="inc()">{{ n() }}</button>'
})
export class CounterComponent {
  n = signal(0);
  inc() { this.n.update(v => v + 1); }
}`,
    },
    {
      language: 'SQL',
      source: 'JOIN with aggregate',
      code: `SELECT u.name, COUNT(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.name
HAVING COUNT(o.id) > 5
ORDER BY orders DESC;`,
    },
  ];

  currentIndex = signal(Math.floor(Math.random() * 6));
  userInput = signal('');
  startTime = signal<number | null>(null);
  endTime = signal<number | null>(null);
  currentTime = signal(Date.now());

  currentSnippet = computed(() => this.snippets[this.currentIndex()]);
  started = computed(() => this.startTime() !== null);
  finished = computed(() => this.endTime() !== null);

  elapsedTime = computed(() => {
    const start = this.startTime();
    if (!start) return 0;
    const end = this.endTime() ?? this.currentTime();
    return Math.round((end - start) / 1000);
  });

  accuracy = computed(() => {
    const input = this.userInput();
    const target = this.currentSnippet().code;
    if (input.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === target[i]) correct++;
    }
    return Math.round((correct / input.length) * 100);
  });

  wpm = computed(() => {
    const time = this.elapsedTime();
    if (time === 0) return 0;
    // Standard: 5 chars = 1 word
    const words = this.userInput().length / 5;
    return Math.round((words / time) * 60);
  });

  typedChars = computed(() => {
    const target = this.currentSnippet().code;
    const input = this.userInput();
    const chars: { char: string; class: string }[] = [];
    for (let i = 0; i < target.length; i++) {
      const targetChar = target[i];
      let cls = 'text-muted-foreground/50';
      if (i < input.length) {
        cls = input[i] === targetChar ? 'text-green-500' : 'text-red-500 bg-red-500/20';
      } else if (i === input.length) {
        cls = 'border-l-2 border-primary animate-pulse';
      }
      chars.push({ char: targetChar, class: cls });
    }
    return chars;
  });

  resultMessage = computed(() => {
    const w = this.wpm();
    if (w >= 80) return '🏆 Lightning Fingers!';
    if (w >= 60) return '⚡ Very Fast!';
    if (w >= 40) return '👍 Good Pace!';
    return '📈 Keep Practicing!';
  });

  constructor() {
    this.seo.update({
      title: 'Code Typing Speed Test — Real Code Snippets',
      description: 'Test your typing speed with real code from Python, JavaScript, Go, Rust, TypeScript, and SQL. Measure WPM and accuracy on production code.',
      url: '/games/typing-test',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Games', url: '/games' },
        { name: 'Typing Test', url: '/games/typing-test' },
      ],
    });

    // Update timer every 100ms while typing
    setInterval(() => {
      if (this.started() && !this.finished()) {
        this.currentTime.set(Date.now());
      }
    }, 100);
  }

  ngAfterViewInit() {
    setTimeout(() => this.focusInput(), 100);
  }

  focusInput() {
    this.inputRef()?.nativeElement.focus();
  }

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    const target = this.currentSnippet().code;

    if (!this.started()) {
      this.startTime.set(Date.now());
    }

    this.userInput.set(value);

    if (value === target) {
      this.endTime.set(Date.now());
    }
  }

  restart() {
    this.currentIndex.set(Math.floor(Math.random() * this.snippets.length));
    this.userInput.set('');
    this.startTime.set(null);
    this.endTime.set(null);
    setTimeout(() => this.focusInput(), 50);
  }
}
