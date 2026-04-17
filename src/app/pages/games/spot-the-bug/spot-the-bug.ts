import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface BugQuestion {
  language: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

@Component({
  selector: 'app-spot-the-bug',
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
            <li class="text-foreground font-medium" aria-current="page">Spot the Bug</li>
          </ol>
        </nav>

        <div class="text-center mb-8">
          <div class="text-5xl mb-4">🐛</div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Spot the Bug</h1>
          <p class="text-muted-foreground">Find the bug in each code snippet. Test your code review skills.</p>
        </div>

        @if (!gameEnded()) {
          <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-8 mb-6">
            <div class="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Bug {{ currentIndex() + 1 }} of {{ questions.length }}</span>
              <span>Score: <strong class="text-foreground">{{ score() }}</strong></span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden mb-6">
              <div class="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                   [style.width.%]="((currentIndex() + 1) / questions.length) * 100"></div>
            </div>

            <div class="mb-4">
              <span class="inline-flex items-center rounded-full bg-red-500/10 text-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {{ currentQuestion().language }}
              </span>
            </div>
            <p class="font-semibold mb-3">Where's the bug?</p>
            <pre class="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono mb-6"><code>{{ currentQuestion().code }}</code></pre>

            <div class="space-y-2">
              @for (option of currentQuestion().options; track $index; let i = $index) {
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
                   [class]="selectedIndex() === currentQuestion().correctIndex ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'">
                <p class="font-semibold mb-2">
                  @if (selectedIndex() === currentQuestion().correctIndex) {
                    ✓ You caught it!
                  } @else {
                    ✗ The actual bug was: <strong>{{ currentQuestion().options[currentQuestion().correctIndex] }}</strong>
                  }
                </p>
                <p class="text-sm text-muted-foreground leading-relaxed">{{ currentQuestion().explanation }}</p>
              </div>
              <button (click)="next()"
                      class="w-full mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]">
                @if (currentIndex() < questions.length - 1) {
                  Next Bug →
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
              You caught <strong class="text-foreground">{{ score() }} / {{ questions.length }}</strong> bugs
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
export class SpotTheBugComponent {
  private seo = inject(SeoService);

  questions: BugQuestion[] = [
    {
      language: 'JavaScript',
      code: `function sum(arr) {
  let total = 0;
  for (let i = 0; i <= arr.length; i++) {
    total += arr[i];
  }
  return total;
}`,
      options: [
        'Should use `for...of` instead of `for` loop',
        'Off-by-one: `i <= arr.length` should be `i < arr.length`',
        '`let total` should be `const total`',
        'Function should use arrow syntax',
      ],
      correctIndex: 1,
      explanation: 'Classic off-by-one error. With `i <= arr.length`, the last iteration tries `arr[length]` which is undefined. Adding undefined to a number produces NaN.',
    },
    {
      language: 'Python',
      code: `def get_user_posts(user_id):
    posts = []
    for post in get_all_posts():
        if post.user_id == user_id:
            posts.append(post)
    return posts

users = [get_user_posts(u.id) for u in users]`,
      options: [
        'N+1 query problem: calling get_all_posts() once per user',
        'Syntax error in list comprehension',
        'Missing type hints',
        'Should use map() instead of list comprehension',
      ],
      correctIndex: 0,
      explanation: 'Classic N+1 query. `get_all_posts()` is called once per user, hitting the DB N times. Fix: fetch all posts once, then filter per user. Or use a JOIN.',
    },
    {
      language: 'Go',
      code: `func process(items []string) {
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func() {
            defer wg.Done()
            fmt.Println(item)
        }()
    }
    wg.Wait()
}`,
      options: [
        'Missing return statement',
        'WaitGroup not passed by pointer',
        'Loop variable capture: all goroutines share same `item`',
        'Should use channels instead',
      ],
      correctIndex: 2,
      explanation: 'The goroutine captures `item` by reference. By the time it runs, the loop has moved on. All goroutines likely print the last item. Fix: `go func(item string){...}(item)` or use Go 1.22+ which fixed this.',
    },
    {
      language: 'Python',
      code: `def add_item(item, cache={}):
    if item not in cache:
        cache[item] = expensive_compute(item)
    return cache[item]`,
      options: [
        'Missing docstring',
        'Should use @functools.lru_cache',
        'Mutable default argument `cache={}` — shared across all calls',
        'expensive_compute is undefined',
      ],
      correctIndex: 2,
      explanation: 'Mutable default arguments are evaluated once at function definition. While this "works" as an accidental cache, it\'s a footgun — state leaks across calls. Use `functools.lru_cache` properly.',
    },
    {
      language: 'JavaScript',
      code: `async function fetchAll(urls) {
  const results = [];
  for (const url of urls) {
    const data = await fetch(url).then(r => r.json());
    results.push(data);
  }
  return results;
}`,
      options: [
        'Sequential await instead of Promise.all — very slow',
        'Missing error handling',
        'Should use forEach instead of for...of',
        'Typo in parameter name',
      ],
      correctIndex: 0,
      explanation: 'Each await blocks the next. 10 URLs = 10 sequential requests. Use Promise.all(urls.map(url => fetch(url).then(r => r.json()))) to run them in parallel — often 10x faster.',
    },
    {
      language: 'SQL',
      code: `SELECT *
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.total > 100
ORDER BY u.created_at;`,
      options: [
        'SELECT * is inefficient',
        'WHERE clause on outer-joined table turns LEFT JOIN into INNER JOIN',
        'Missing index on user_id',
        'ORDER BY should come before WHERE',
      ],
      correctIndex: 1,
      explanation: 'Filtering on the right-side of a LEFT JOIN in WHERE clause eliminates rows where orders is NULL, effectively making it an INNER JOIN. Move condition to ON clause or use IS NULL.',
    },
    {
      language: 'Python',
      code: `import threading
counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1

threads = [threading.Thread(target=increment) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print(counter)`,
      options: [
        'Should use multiprocessing instead',
        'Race condition: counter += 1 is not atomic',
        'Missing daemon=True',
        'Too many threads',
      ],
      correctIndex: 1,
      explanation: '`counter += 1` is read-modify-write, not atomic. Without a Lock, threads race and some increments are lost. Final value will be unpredictable and less than 1,000,000. Use threading.Lock() around the increment.',
    },
    {
      language: 'JavaScript',
      code: `const users = [{id: 1, name: "Alice"}, {id: 2, name: "Bob"}];
const userMap = {};
users.forEach(u => userMap[u.id] == u);
console.log(userMap[1].name);`,
      options: [
        'Should use Map instead of object',
        'Typo: `==` instead of `=` — comparison, not assignment',
        'forEach should return a value',
        'Missing semicolons',
      ],
      correctIndex: 1,
      explanation: '`==` compares, `=` assigns. The comparison result is thrown away, so userMap stays empty. `userMap[1]` is undefined, and `.name` throws "Cannot read properties of undefined".',
    },
  ];

  currentIndex = signal(0);
  selectedIndex = signal<number | null>(null);
  answered = signal(false);
  score = signal(0);
  gameEnded = signal(false);

  currentQuestion = computed(() => this.questions[this.currentIndex()]);

  finalEmoji = computed(() => {
    const pct = this.score() / this.questions.length;
    if (pct === 1) return '🏆';
    if (pct >= 0.75) return '🔍';
    if (pct >= 0.5) return '👀';
    return '📖';
  });

  finalMessage = computed(() => {
    const pct = this.score() / this.questions.length;
    if (pct === 1) return 'Bug Hunter Champion!';
    if (pct >= 0.75) return 'Sharp Eye!';
    if (pct >= 0.5) return 'Good Detective!';
    return 'Keep Practicing!';
  });

  constructor() {
    this.seo.update({
      title: 'Spot the Bug — Code Review Challenge Game',
      description: 'Find bugs in real code snippets — race conditions, off-by-one errors, N+1 queries, and more. Test your code review skills.',
      url: '/games/spot-the-bug',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Games', url: '/games' },
        { name: 'Spot the Bug', url: '/games/spot-the-bug' },
      ],
    });
  }

  selectAnswer(idx: number) {
    if (this.answered()) return;
    this.selectedIndex.set(idx);
    this.answered.set(true);
    if (idx === this.currentQuestion().correctIndex) {
      this.score.update(s => s + 1);
    }
  }

  getOptionClass(idx: number): string {
    if (!this.answered()) {
      return 'border-border hover:border-primary hover:bg-accent cursor-pointer';
    }
    if (idx === this.currentQuestion().correctIndex) {
      return 'border-green-500 bg-green-500/10 text-foreground';
    }
    if (idx === this.selectedIndex()) {
      return 'border-red-500 bg-red-500/10 text-foreground';
    }
    return 'border-border opacity-50';
  }

  next() {
    if (this.currentIndex() < this.questions.length - 1) {
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
