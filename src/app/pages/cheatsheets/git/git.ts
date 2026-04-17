import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Section {
  title: string;
  items: { cmd: string; desc: string }[];
}

@Component({
  selector: 'app-cheatsheet-git',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-5xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/cheatsheets" class="hover:text-foreground transition-colors">Cheat Sheets</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Git</li>
          </ol>
        </nav>

        <div class="flex items-center gap-4 mb-8">
          <span class="text-5xl">🔀</span>
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Git Cheat Sheet</h1>
            <p class="text-muted-foreground mt-1">Every Git command you need — from basics to advanced recovery</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          @for (section of sections; track section.title) {
            <div class="rounded-xl border border-border/60 bg-card overflow-hidden">
              <div class="px-5 py-3 bg-muted/50 border-b border-border/40">
                <h2 class="text-sm font-bold uppercase tracking-wider">{{ section.title }}</h2>
              </div>
              <div class="divide-y divide-border/40">
                @for (item of section.items; track item.cmd) {
                  <div class="px-5 py-3 flex gap-4 hover:bg-accent/30 transition-colors">
                    <code class="text-xs font-mono bg-muted px-2 py-1 rounded flex-shrink-0 max-w-[55%] overflow-x-auto whitespace-nowrap">{{ item.cmd }}</code>
                    <span class="text-xs text-muted-foreground">{{ item.desc }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="mt-8 text-center">
          <a routerLink="/cheatsheets" class="text-sm text-muted-foreground hover:text-foreground">← All Cheat Sheets</a>
          <span class="mx-3 text-muted-foreground/50">|</span>
          <a routerLink="/blog" [queryParams]="{tag:'Git'}" class="text-sm text-primary hover:underline">Read Git tutorials →</a>
        </div>
      </div>
    </section>
  `,
})
export class GitCheatsheetComponent {
  private seo = inject(SeoService);

  sections: Section[] = [
    {
        "title": "Setup & Config",
        "items": [
            {
                "cmd": "git config --global user.name \"Name\"",
                "desc": "Set name"
            },
            {
                "cmd": "git config --global user.email \"e@x.com\"",
                "desc": "Set email"
            },
            {
                "cmd": "git init",
                "desc": "Initialize new repo"
            },
            {
                "cmd": "git clone URL",
                "desc": "Clone remote repo"
            },
            {
                "cmd": "git remote -v",
                "desc": "List remotes"
            },
            {
                "cmd": "git remote add origin URL",
                "desc": "Add remote"
            }
        ]
    },
    {
        "title": "Basic Workflow",
        "items": [
            {
                "cmd": "git status",
                "desc": "Working tree status"
            },
            {
                "cmd": "git add file.txt",
                "desc": "Stage a file"
            },
            {
                "cmd": "git add .",
                "desc": "Stage all changes"
            },
            {
                "cmd": "git commit -m 'msg'",
                "desc": "Commit staged changes"
            },
            {
                "cmd": "git push origin main",
                "desc": "Push to remote"
            },
            {
                "cmd": "git pull origin main",
                "desc": "Pull latest changes"
            },
            {
                "cmd": "git fetch origin",
                "desc": "Download without merge"
            }
        ]
    },
    {
        "title": "Branching",
        "items": [
            {
                "cmd": "git branch",
                "desc": "List local branches"
            },
            {
                "cmd": "git branch -a",
                "desc": "List all branches"
            },
            {
                "cmd": "git branch feature",
                "desc": "Create branch"
            },
            {
                "cmd": "git checkout feature",
                "desc": "Switch branch"
            },
            {
                "cmd": "git checkout -b feature",
                "desc": "Create & switch"
            },
            {
                "cmd": "git switch feature",
                "desc": "Switch (modern)"
            },
            {
                "cmd": "git switch -c feature",
                "desc": "Create & switch (modern)"
            },
            {
                "cmd": "git branch -d feature",
                "desc": "Delete merged branch"
            },
            {
                "cmd": "git branch -D feature",
                "desc": "Force delete branch"
            }
        ]
    },
    {
        "title": "Merging & Rebasing",
        "items": [
            {
                "cmd": "git merge feature",
                "desc": "Merge branch into current"
            },
            {
                "cmd": "git merge --no-ff feature",
                "desc": "Merge with commit"
            },
            {
                "cmd": "git rebase main",
                "desc": "Rebase onto main"
            },
            {
                "cmd": "git rebase -i HEAD~3",
                "desc": "Interactive rebase (squash)"
            },
            {
                "cmd": "git merge --abort",
                "desc": "Abort failed merge"
            },
            {
                "cmd": "git rebase --abort",
                "desc": "Abort failed rebase"
            }
        ]
    },
    {
        "title": "Stashing",
        "items": [
            {
                "cmd": "git stash",
                "desc": "Save working changes"
            },
            {
                "cmd": "git stash pop",
                "desc": "Apply & remove stash"
            },
            {
                "cmd": "git stash apply",
                "desc": "Apply, keep stash"
            },
            {
                "cmd": "git stash list",
                "desc": "List all stashes"
            },
            {
                "cmd": "git stash drop",
                "desc": "Delete latest stash"
            },
            {
                "cmd": "git stash -u",
                "desc": "Stash including untracked"
            }
        ]
    },
    {
        "title": "Viewing History",
        "items": [
            {
                "cmd": "git log --oneline",
                "desc": "Compact log"
            },
            {
                "cmd": "git log --graph --oneline --all",
                "desc": "Visual branch graph"
            },
            {
                "cmd": "git log -p file.txt",
                "desc": "File change history"
            },
            {
                "cmd": "git diff",
                "desc": "Unstaged changes"
            },
            {
                "cmd": "git diff --staged",
                "desc": "Staged changes"
            },
            {
                "cmd": "git diff branch1..branch2",
                "desc": "Compare branches"
            },
            {
                "cmd": "git show HASH",
                "desc": "Show specific commit"
            },
            {
                "cmd": "git blame file.txt",
                "desc": "Who changed each line"
            }
        ]
    },
    {
        "title": "Undoing Things",
        "items": [
            {
                "cmd": "git checkout -- file.txt",
                "desc": "Discard file changes"
            },
            {
                "cmd": "git restore file.txt",
                "desc": "Discard (modern)"
            },
            {
                "cmd": "git reset HEAD file.txt",
                "desc": "Unstage a file"
            },
            {
                "cmd": "git reset --soft HEAD~1",
                "desc": "Undo commit, keep staged"
            },
            {
                "cmd": "git reset --hard HEAD~1",
                "desc": "Undo commit, discard all"
            },
            {
                "cmd": "git revert HASH",
                "desc": "Create undo commit"
            },
            {
                "cmd": "git reflog",
                "desc": "Recovery log (find lost commits)"
            }
        ]
    },
    {
        "title": "Cherry-Pick & Tags",
        "items": [
            {
                "cmd": "git cherry-pick HASH",
                "desc": "Apply specific commit"
            },
            {
                "cmd": "git tag v1.0",
                "desc": "Create lightweight tag"
            },
            {
                "cmd": "git tag -a v1.0 -m 'msg'",
                "desc": "Create annotated tag"
            },
            {
                "cmd": "git push origin --tags",
                "desc": "Push all tags"
            },
            {
                "cmd": "git tag -d v1.0",
                "desc": "Delete local tag"
            }
        ]
    },
    {
      title: "Worktrees",
      items: [
        { cmd: "git worktree add ../feature-wt feature", desc: "Create worktree for branch" },
        { cmd: "git worktree list", desc: "List all worktrees" },
        { cmd: "git worktree remove ../feature-wt", desc: "Remove worktree" },
        { cmd: "git worktree prune", desc: "Clean stale worktrees" },
      ],
    },
    {
      title: "Bisect (Find Bug Commits)",
      items: [
        { cmd: "git bisect start", desc: "Begin binary search" },
        { cmd: "git bisect bad", desc: "Mark current as broken" },
        { cmd: "git bisect good HASH", desc: "Mark known good commit" },
        { cmd: "git bisect run ./test.sh", desc: "Auto-bisect with script" },
        { cmd: "git bisect reset", desc: "End bisect session" },
      ],
    },
    {
      title: "Submodules",
      items: [
        { cmd: "git submodule add URL path", desc: "Add submodule" },
        { cmd: "git submodule update --init --recursive", desc: "Clone submodules" },
        { cmd: "git submodule foreach git pull", desc: "Update all submodules" },
        { cmd: "git submodule status", desc: "Show submodule commits" },
        { cmd: "git rm --cached path && rm -rf path", desc: "Remove submodule" },
      ],
    },
    {
      title: "Hooks & Automation",
      items: [
        { cmd: ".git/hooks/pre-commit", desc: "Runs before each commit" },
        { cmd: ".git/hooks/pre-push", desc: "Runs before each push" },
        { cmd: ".git/hooks/commit-msg", desc: "Validate commit message" },
        { cmd: "chmod +x .git/hooks/pre-commit", desc: "Make hook executable" },
        { cmd: "npx husky install", desc: "Husky: managed git hooks" },
        { cmd: "npx lint-staged", desc: "Run linters on staged files" },
      ],
    },
    {
      title: "Advanced Recovery",
      items: [
        { cmd: "git reflog", desc: "Full history of HEAD movements" },
        { cmd: "git fsck --lost-found", desc: "Find dangling commits" },
        { cmd: "git stash drop stash@{0}", desc: "Delete specific stash" },
        { cmd: "git checkout HASH -- file.txt", desc: "Restore file from commit" },
        { cmd: "git reset --hard ORIG_HEAD", desc: "Undo last reset/merge" },
        { cmd: "git clean -fd", desc: "Remove untracked files+dirs" },
        { cmd: "git gc --prune=now", desc: "Garbage collect objects" },
      ],
    },
    {
      title: "Interactive & Patch Mode",
      items: [
        { cmd: "git add -p", desc: "Stage hunks interactively" },
        { cmd: "git checkout -p", desc: "Discard hunks interactively" },
        { cmd: "git stash -p", desc: "Stash specific hunks" },
        { cmd: "git rebase -i HEAD~5", desc: "Squash/reorder last 5 commits" },
        { cmd: "git commit --fixup=HASH", desc: "Mark as fixup for rebase" },
        { cmd: "git rebase -i --autosquash", desc: "Auto-apply fixup commits" },
      ],
    },
  
];

  constructor() {
    this.seo.update({
      title: 'Git Cheat Sheet 2026 — Quick Reference for Developers',
      description: 'Complete Git cheat sheet: branch, merge, rebase, stash, reset, cherry-pick, log, diff, and how to undo every mistake.',
      url: '/cheatsheets/git',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Cheat Sheets', url: '/cheatsheets' },
        { name: 'Git', url: '/cheatsheets/git' },
      ],
    });
  }
}
