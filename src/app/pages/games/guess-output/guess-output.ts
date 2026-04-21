import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Question {
  language: 'Python' | 'JavaScript' | 'Go' | 'C';
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

@Component({
  selector: 'app-guess-output',
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
            <li class="text-foreground font-medium" aria-current="page">Guess the Output</li>
          </ol>
        </nav>

        <div class="text-center mb-8">
          <div class="text-5xl mb-4">🎯</div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Guess the Output</h1>
          <p class="text-muted-foreground">Can you predict what these code snippets print?</p>
        </div>

        @if (!gameEnded()) {
          <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-8 mb-6" [class.correct-flash]="flashCorrect()" [class.wrong-shake]="flashWrong()">
            <div class="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Question {{ currentIndex() + 1 }} of {{ questions.length }}</span>
              <div class="flex items-center gap-3">
                @if (streak() >= 2) {
                  <span class="streak-fire text-orange-500 font-bold text-xs">🔥 {{ streak() }} streak!</span>
                }
                <span [class.score-pop]="flashCorrect()">Score: <strong class="text-foreground">{{ score() }} / {{ currentIndex() + (answered() ? 1 : 0) }}</strong></span>
              </div>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden mb-6">
              <div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                   [style.width.%]="((currentIndex() + 1) / questions.length) * 100"></div>
            </div>

            <div class="mb-4">
              <span class="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {{ currentQuestion().language }}
              </span>
            </div>
            <p class="font-semibold mb-2">What does this code print?</p>
            <pre class="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono mb-6"><code>{{ currentQuestion().code }}</code></pre>

            <div class="space-y-2">
              @for (option of currentQuestion().options; track $index; let i = $index) {
                <button (click)="selectAnswer(i)"
                        [disabled]="answered()"
                        [class]="getOptionClass(i)"
                        class="game-option w-full text-left px-4 py-3 rounded-lg border font-mono text-sm">
                  <span class="inline-block w-6 h-6 rounded mr-3 text-xs font-bold text-center leading-6 bg-muted">{{ ['A','B','C','D'][i] }}</span>
                  {{ option }}
                </button>
              }
            </div>

            @if (answered()) {
              <div class="mt-6 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
                   [class]="selectedIndex() === currentQuestion().correctIndex ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'">
                <p class="font-semibold mb-2">
                  @if (selectedIndex() === currentQuestion().correctIndex) {
                    ✓ Correct! @if (streak() >= 3) { <span class="text-orange-500">🔥 On fire!</span> }
                  } @else {
                    ✗ Wrong. The answer is <code class="bg-muted px-2 py-0.5 rounded">{{ currentQuestion().options[currentQuestion().correctIndex] }}</code>
                  }
                </p>
                <p class="text-sm text-muted-foreground leading-relaxed">{{ currentQuestion().explanation }}</p>
              </div>
              <button (click)="next()"
                      class="w-full mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]">
                @if (currentIndex() < questions.length - 1) {
                  Next Question →
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
              You scored <strong class="text-foreground">{{ score() }} / {{ questions.length }}</strong>
            </p>
            @if (maxStreak() >= 2) {
              <p class="text-sm text-orange-500 font-semibold mb-6">🔥 Best streak: {{ maxStreak() }} in a row</p>
            }
            <div class="h-3 bg-muted rounded-full overflow-hidden max-w-xs mx-auto mb-8">
              <div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 xp-bar-fill rounded-full" [style.width.%]="(score() / questions.length) * 100"></div>
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
export class GuessOutputComponent {
  private seo = inject(SeoService);

  questions: Question[] = [
    {
      language: 'Python',
      code: `x = [1, 2, 3]
y = x
y.append(4)
print(x)`,
      options: ['[1, 2, 3]', '[1, 2, 3, 4]', '[4]', 'Error'],
      correctIndex: 1,
      explanation: 'In Python, lists are mutable. `y = x` creates a reference, not a copy. Modifying y modifies x too.',
    },
    {
      language: 'JavaScript',
      code: `console.log([] + []);
console.log([] + {});
console.log({} + []);`,
      options: ['"", "[object Object]", 0', '"", "[object Object]", "[object Object]"', '0, 0, 0', 'Error'],
      correctIndex: 1,
      explanation: 'JavaScript coerces arrays to empty strings when using +. Objects become "[object Object]". Both {} + [] lines give the same string result in console.log context.',
    },
    {
      language: 'Python',
      code: `def add(item, target=[]):
    target.append(item)
    return target

print(add(1))
print(add(2))`,
      options: ['[1] then [2]', '[1] then [1, 2]', '[1, 2] then [1, 2]', 'Error'],
      correctIndex: 1,
      explanation: 'Mutable default arguments are evaluated ONCE at function definition. The same list is reused across calls — a classic Python gotcha.',
    },
    {
      language: 'JavaScript',
      code: `const a = 0.1 + 0.2;
console.log(a === 0.3);
console.log(a);`,
      options: ['true, 0.3', 'false, 0.3', 'false, 0.30000000000000004', 'true, 0.30000000000000004'],
      correctIndex: 2,
      explanation: 'Floating-point arithmetic is imprecise in binary. 0.1 + 0.2 = 0.30000000000000004, not exactly 0.3. This is IEEE 754 behavior, not a JS bug.',
    },
    {
      language: 'Python',
      code: `a = 256
b = 256
print(a is b)
a = 257
b = 257
print(a is b)`,
      options: ['True, True', 'True, False', 'False, False', 'False, True'],
      correctIndex: 1,
      explanation: 'CPython caches small integers (-5 to 256) as singletons for performance. 256 is cached, so `is` works. 257 is not cached, so each gets a new object.',
    },
    {
      language: 'JavaScript',
      code: `for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}`,
      options: ['0, 1, 2', '3, 3, 3', '0, 0, 0', 'Error'],
      correctIndex: 1,
      explanation: 'var is function-scoped. All three setTimeout callbacks share the same i. By the time they execute, the loop has finished and i is 3. Use `let` to fix this.',
    },
    {
      language: 'Python',
      code: `print(True + True + True)
print(True == 1)
print(True is 1)`,
      options: ['3, True, True', '3, True, False', 'Error, True, False', 'TrueTrueTrue, True, True'],
      correctIndex: 1,
      explanation: 'In Python, bool is a subclass of int. True == 1 and True + True + True = 3. But `is` checks identity — True and 1 are different objects.',
    },
    {
      language: 'JavaScript',
      code: `const obj = { a: 1 };
obj.b = 2;
Object.freeze(obj);
obj.c = 3;
console.log(Object.keys(obj).length);`,
      options: ['1', '2', '3', 'Error'],
      correctIndex: 1,
      explanation: 'Object.freeze prevents adding/changing properties. obj.c = 3 fails silently in non-strict mode. The object keeps its 2 frozen properties.',
    },
    {
      language: 'Python',
      code: `x = "hello"
y = "hello"
print(x is y)
x = "hello world"
y = "hello world"
print(x is y)`,
      options: ['True, True', 'True, False', 'False, False', 'Depends on implementation'],
      correctIndex: 3,
      explanation: 'String interning is a CPython optimization. Short strings with identifier-like characters get interned. Longer strings with spaces often are not — but this is implementation-specific and should NOT be relied upon.',
    },
    {
      language: 'JavaScript',
      code: `console.log(typeof null);
console.log(typeof undefined);
console.log(typeof NaN);`,
      options: ['null, undefined, number', 'object, undefined, number', 'object, undefined, NaN', 'null, undefined, NaN'],
      correctIndex: 1,
      explanation: 'typeof null returns "object" — a 25+ year old JavaScript bug that will never be fixed for backwards compatibility. NaN is a Number type (Not-a-Number is still a number).',
    },
    {
      language: 'Python',
      code: 'print(type([]) == list)\nprint(type([]) is list)',
      options: ['True, True', 'True, False', 'False, True', 'Error'],
      correctIndex: 0,
      explanation: 'Both == and is return True when comparing types. type([]) returns <class list> which is the same object as the list builtin. This is one case where is and == agree.',
    },
    {
      language: 'JavaScript',
      code: 'console.log("b" + "a" + + "a" + "a")',
      options: ['"baaaa"', '"baNaNa"', '"ba a a"', 'Error'],
      correctIndex: 1,
      explanation: 'The + before "a" tries to convert it to a number, producing NaN. String concatenation then gives "b" + "a" + NaN + "a" = "baNaNa". A classic JS quirk.',
    },
    {
      language: 'Python',
      code: 'x = (1)\ny = (1,)\nprint(type(x).__name__, type(y).__name__)',
      options: ['tuple tuple', 'int tuple', 'int int', 'tuple int'],
      correctIndex: 1,
      explanation: 'Parentheses alone dont make a tuple — the COMMA does. (1) is just the integer 1 with parentheses. (1,) is a tuple with one element.',
    },
    {
      language: 'JavaScript',
      code: 'let a = [1, 2, 3];\nlet b = [1, 2, 3];\nconsole.log(a == b);\nconsole.log(a === b);',
      options: ['true, true', 'false, false', 'true, false', 'false, true'],
      correctIndex: 1,
      explanation: 'Arrays are objects in JavaScript. Two different arrays are two different object references. Both == and === compare references, not values. They will never be equal unless they point to the same array.',
    },
    {
      language: 'Python',
      code: 'print({True: "yes", 1: "no", 1.0: "maybe"})',
      options: ['{True: "yes", 1: "no", 1.0: "maybe"}', '{True: "maybe"}', '{1: "maybe"}', 'Error'],
      correctIndex: 1,
      explanation: 'In Python, True == 1 == 1.0, so they are the same dictionary key. The first key (True) is kept, but the value is overwritten by each subsequent assignment. Final result: {True: "maybe"}.',
    },
  
  ];

  currentIndex = signal(0);
  selectedIndex = signal<number | null>(null);
  answered = signal(false);
  score = signal(0);
  streak = signal(0);
  maxStreak = signal(0);
  gameEnded = signal(false);

  currentQuestion = computed(() => this.questions[this.currentIndex()]);

  finalEmoji = computed(() => {
    const pct = this.score() / this.questions.length;
    if (pct === 1) return '🏆';
    if (pct >= 0.8) return '🎉';
    if (pct >= 0.5) return '👍';
    return '📚';
  });

  finalMessage = computed(() => {
    const pct = this.score() / this.questions.length;
    if (pct === 1) return 'Perfect Score!';
    if (pct >= 0.8) return 'Excellent!';
    if (pct >= 0.5) return 'Not Bad!';
    return 'Keep Learning!';
  });

  constructor() {
    this.seo.update({
      title: 'Guess the Output — Python & JavaScript Code Quiz',
      description: 'Test your knowledge with tricky Python and JavaScript code snippets. Can you predict the output? 10 questions covering classic language quirks.',
      url: '/games/guess-output',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Games', url: '/games' },
        { name: 'Guess the Output', url: '/games/guess-output' },
      ],
    });
  }

  flashCorrect = signal(false);
  flashWrong = signal(false);

  selectAnswer(idx: number) {
    if (this.answered()) return;
    this.selectedIndex.set(idx);
    this.answered.set(true);
    if (idx === this.currentQuestion().correctIndex) {
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

  getOptionClass(idx: number): string {
    if (!this.answered()) {
      return 'border-border';
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
    this.streak.set(0);
    this.maxStreak.set(0);
    this.gameEnded.set(false);
  }
}
