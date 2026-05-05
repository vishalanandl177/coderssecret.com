export const CONTENT = `
      <p>Most developers use Git daily but treat it as a black box. They memorize commands without understanding what happens underneath. This leads to panic during rebases, confusion during merge conflicts, and fear of <code>git reflog</code>.</p>

      <p>Once you understand Git internals, the scary commands become ordinary data-structure operations. A branch is a movable reference. A commit is an immutable object in a graph. The index is the next snapshot being prepared. The reflog is a local record of where references used to point. This guide walks through those pieces and shows how Git stores, names, moves, compresses, and recovers your code.</p>

      <h2>The Four Pieces Git Manages</h2>

      <p>The official Git data model describes four core kinds of repository data:</p>

      <ul>
        <li><strong>Objects</strong>: blobs, trees, commits, and annotated tag objects.</li>
        <li><strong>References</strong>: branches, tags, remote-tracking branches, <code>HEAD</code>, and other names that point to objects or other refs.</li>
        <li><strong>The index</strong>: the staging area, stored mostly as a flat list of paths and object IDs.</li>
        <li><strong>Reflogs</strong>: local logs that record updates to refs so you can recover earlier positions.</li>
      </ul>

      <p>Everything else Git does &mdash; branching, merging, rebasing, checkout, reset, garbage collection, fetch, push &mdash; is built on those pieces.</p>

      <h2>Git Is a Content-Addressable Filesystem</h2>

      <p>At its core, Git is a content-addressable object database. You give Git content and an object type; Git computes an object ID from the type, size, and content. In traditional repositories that ID is SHA-1. Newer repositories can be initialized with SHA-256, so it is more accurate to say <strong>object ID</strong> than to assume every repository is SHA-1 forever.</p>

      <pre><code># Store stdin as a blob object and print its object ID
echo "Hello, Git" | git hash-object --stdin -w
# Example output: 3fa0d1ac21b29b96ee682541d4be0b3a0a89f5af

# Ask Git what type that object is
git cat-file -t 3fa0d1a
# Output: blob

# Pretty-print the object's contents
git cat-file -p 3fa0d1a
# Output: Hello, Git</code></pre>

      <p>The important detail: the filename is not part of a blob's identity. Two files with identical bytes share the same blob object. The path, mode, and directory structure live in tree objects.</p>

      <h2>The Four Object Types</h2>

      <h3>1. Blob: File Content</h3>

      <p>A blob stores file content. It does <strong>not</strong> store the filename, path, permissions, timestamps, owner, or commit message. If <code>README.md</code> and <code>docs/intro.md</code> contain exactly the same bytes, Git can point both tree entries at the same blob.</p>

      <pre><code># The same content produces the same blob ID
echo "same content" | git hash-object --stdin
echo "same content" | git hash-object --stdin</code></pre>

      <h3>2. Tree: Directory Listing</h3>

      <p>A tree represents a directory. It maps names to blobs, subtrees, or submodule commits, and it stores Git's limited file modes such as regular file, executable file, symlink, directory, and gitlink.</p>

      <pre><code># View the root tree of the latest commit
git cat-file -p HEAD^{tree}

# Example:
# 100644 blob a1b2c3d4...   README.md
# 100644 blob e5f6a7b8...   package.json
# 040000 tree 1a2b3c4d...   src
# 160000 commit 9f8e7d6c... vendor/library  # submodule gitlink</code></pre>

      <h3>3. Commit: Snapshot Plus History</h3>

      <p>A commit points to a top-level tree, zero or more parent commits, author and committer metadata, and a message. A normal commit has one parent, the first commit has none, and a merge commit has two or more. Git does not store a commit as a diff; when you ask for a diff, Git compares the commit's tree with its parent tree on demand.</p>

      <pre><code>git cat-file -p HEAD

# Example:
# tree 4b825dc642cb6eb9a060e54bf899d4e239f3b764
# parent 8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b
# author Vishal Anand &lt;vishal@example.com&gt; 1714233600 +0530
# committer Vishal Anand &lt;vishal@example.com&gt; 1714233600 +0530
#
# Add user authentication module</code></pre>

      <h3>4. Annotated Tag Object: A Named Release Record</h3>

      <p>Lightweight tags are refs that point directly at an object. Annotated tags are different: they create a real <code>tag</code> object that points at another object, records the tagger and date, and stores a tag message. This is why signed release tags carry more information than a simple branch-like pointer.</p>

      <pre><code>git tag -a v1.0.0 -m "Release v1.0.0"
git cat-file -p v1.0.0

# object 750b4ead9c87ceb3ddb7a390e6c7074521797fb3
# type commit
# tag v1.0.0
# tagger Vishal Anand &lt;vishal@example.com&gt; 1714233600 +0530
#
# Release v1.0.0</code></pre>

      <svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Git object graph showing an annotated tag pointing to a commit, the commit pointing to a tree, and the tree pointing to blobs and subtrees">
        <rect width="800" height="430" fill="#0f172a" rx="12"/>
        <text x="400" y="34" text-anchor="middle" fill="#cbd5e1" font-size="16" font-weight="700">GIT OBJECT GRAPH</text>
        <defs>
          <marker id="gitObjArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8"/>
          </marker>
        </defs>

        <rect x="72" y="84" width="150" height="72" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/>
        <text x="147" y="112" text-anchor="middle" fill="#fed7aa" font-size="13" font-weight="700">tag object</text>
        <text x="147" y="135" text-anchor="middle" fill="#fdba74" font-size="11">v1.0.0 message</text>

        <rect x="310" y="82" width="180" height="78" rx="8" fill="#1e293b" stroke="#60a5fa" stroke-width="2"/>
        <text x="400" y="109" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="700">commit</text>
        <text x="400" y="130" text-anchor="middle" fill="#93c5fd" font-size="11">tree + parent(s)</text>
        <text x="400" y="148" text-anchor="middle" fill="#93c5fd" font-size="11">author + message</text>

        <rect x="578" y="82" width="150" height="78" rx="8" fill="#1e293b" stroke="#a78bfa" stroke-width="2"/>
        <text x="653" y="110" text-anchor="middle" fill="#ddd6fe" font-size="13" font-weight="700">parent commit</text>
        <text x="653" y="133" text-anchor="middle" fill="#c4b5fd" font-size="11">previous snapshot</text>

        <rect x="310" y="220" width="180" height="82" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="400" y="248" text-anchor="middle" fill="#bbf7d0" font-size="13" font-weight="700">root tree</text>
        <text x="400" y="270" text-anchor="middle" fill="#86efac" font-size="11">README.md -&gt; blob</text>
        <text x="400" y="288" text-anchor="middle" fill="#86efac" font-size="11">src -&gt; subtree</text>

        <rect x="94" y="334" width="148" height="58" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="168" y="359" text-anchor="middle" fill="#bae6fd" font-size="13" font-weight="700">blob</text>
        <text x="168" y="378" text-anchor="middle" fill="#7dd3fc" font-size="11">README bytes</text>

        <rect x="326" y="334" width="148" height="58" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="400" y="359" text-anchor="middle" fill="#bbf7d0" font-size="13" font-weight="700">subtree</text>
        <text x="400" y="378" text-anchor="middle" fill="#86efac" font-size="11">src directory</text>

        <rect x="558" y="334" width="148" height="58" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="632" y="359" text-anchor="middle" fill="#bae6fd" font-size="13" font-weight="700">blob</text>
        <text x="632" y="378" text-anchor="middle" fill="#7dd3fc" font-size="11">main.ts bytes</text>

        <line x1="222" y1="120" x2="310" y2="120" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitObjArrow)"/>
        <text x="266" y="109" text-anchor="middle" fill="#94a3b8" font-size="10">points to</text>
        <line x1="490" y1="120" x2="578" y2="120" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitObjArrow)"/>
        <text x="534" y="109" text-anchor="middle" fill="#94a3b8" font-size="10">parent</text>
        <line x1="400" y1="160" x2="400" y2="220" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitObjArrow)"/>
        <text x="426" y="194" fill="#94a3b8" font-size="10">tree</text>
        <line x1="345" y1="302" x2="205" y2="334" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitObjArrow)"/>
        <line x1="400" y1="302" x2="400" y2="334" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitObjArrow)"/>
        <line x1="455" y1="302" x2="595" y2="334" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitObjArrow)"/>
      </svg>

      <h2>Inside the .git Directory</h2>

      <p>A normal working tree has a <code>.git</code> directory at its root. Worktrees and submodules can instead have a small <code>.git</code> file that points to the real Git directory, but the layout below is the common shape:</p>

      <pre><code>.git/
  HEAD                 # symbolic ref, or direct object ID in detached HEAD
  config               # repository configuration
  index                # staging area (binary)
  objects/
    3f/a0d1ac21...      # loose object: first 2 hex chars are directory
    pack/
      pack-abc.pack     # many compressed objects
      pack-abc.idx      # offsets for random access into the pack
  refs/
    heads/main          # local branch ref
    tags/v1.0.0         # tag ref
    remotes/origin/main # remote-tracking branch
  packed-refs           # compact storage for refs that are not loose files
  logs/
    HEAD                # HEAD reflog
    refs/heads/main     # branch reflog</code></pre>

      <p>Loose objects are stored below <code>objects/</code> using the first two hex characters as the directory name. Packfiles collect many objects into compressed files with index files so Git can jump directly to a requested object.</p>

      <h2>Refs, Branches, and HEAD</h2>

      <p>A branch is a reference to the latest commit in a line of work. In a small repository it may be a plain text file under <code>.git/refs/heads/</code>, but refs can also be stored in <code>.git/packed-refs</code>. So the useful mental model is not &ldquo;a branch is always a 41-byte file&rdquo;; it is <strong>a branch is a movable name for a commit</strong>.</p>

      <pre><code># Resolve refs without depending on their storage format
git rev-parse main
git show-ref --heads

# Safely update a ref at the plumbing level
git update-ref refs/heads/experiment HEAD</code></pre>

      <p><code>HEAD</code> usually points to the current branch as a symbolic ref:</p>

      <pre><code>cat .git/HEAD
# ref: refs/heads/main</code></pre>

      <p>When you check out a commit, tag, or remote-tracking branch directly, <code>HEAD</code> can point straight at a commit object ID. That is detached HEAD state. Commits made there are real commits, but no branch name will move with them unless you create one.</p>

      <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Git HEAD and refs diagram showing symbolic HEAD pointing to a branch ref, branch refs pointing to commits, remote tracking refs, and detached HEAD">
        <rect width="800" height="360" fill="#111827" rx="12"/>
        <text x="400" y="34" text-anchor="middle" fill="#d1d5db" font-size="16" font-weight="700">HEAD, LOCAL REFS, AND DETACHED HEAD</text>
        <defs>
          <marker id="gitRefArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#9ca3af"/>
          </marker>
        </defs>

        <rect x="70" y="82" width="130" height="58" rx="8" fill="#1f2937" stroke="#f97316" stroke-width="2"/>
        <text x="135" y="106" text-anchor="middle" fill="#fed7aa" font-size="13" font-weight="700">HEAD</text>
        <text x="135" y="124" text-anchor="middle" fill="#fdba74" font-size="10">ref: refs/heads/main</text>

        <rect x="286" y="82" width="170" height="58" rx="8" fill="#1f2937" stroke="#60a5fa" stroke-width="2"/>
        <text x="371" y="106" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="700">refs/heads/main</text>
        <text x="371" y="124" text-anchor="middle" fill="#93c5fd" font-size="10">commit C3</text>

        <circle cx="585" cy="111" r="24" fill="#1f2937" stroke="#22c55e" stroke-width="2"/>
        <text x="585" y="116" text-anchor="middle" fill="#bbf7d0" font-size="12" font-weight="700">C3</text>
        <circle cx="662" cy="111" r="24" fill="#1f2937" stroke="#22c55e" stroke-width="2"/>
        <text x="662" y="116" text-anchor="middle" fill="#bbf7d0" font-size="12" font-weight="700">C2</text>
        <circle cx="735" cy="111" r="24" fill="#1f2937" stroke="#22c55e" stroke-width="2"/>
        <text x="735" y="116" text-anchor="middle" fill="#bbf7d0" font-size="12" font-weight="700">C1</text>

        <line x1="200" y1="111" x2="286" y2="111" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitRefArrow)"/>
        <line x1="456" y1="111" x2="561" y2="111" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitRefArrow)"/>
        <line x1="609" y1="111" x2="638" y2="111" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitRefArrow)"/>
        <line x1="686" y1="111" x2="711" y2="111" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitRefArrow)"/>

        <rect x="286" y="190" width="170" height="58" rx="8" fill="#1f2937" stroke="#a78bfa" stroke-width="2"/>
        <text x="371" y="214" text-anchor="middle" fill="#ddd6fe" font-size="13" font-weight="700">refs/remotes/origin/main</text>
        <text x="371" y="232" text-anchor="middle" fill="#c4b5fd" font-size="10">last fetched remote state</text>
        <line x1="456" y1="219" x2="561" y2="125" stroke="#a78bfa" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#gitRefArrow)"/>

        <rect x="70" y="264" width="130" height="58" rx="8" fill="#1f2937" stroke="#f43f5e" stroke-width="2"/>
        <text x="135" y="288" text-anchor="middle" fill="#fecdd3" font-size="13" font-weight="700">detached HEAD</text>
        <text x="135" y="306" text-anchor="middle" fill="#fda4af" font-size="10">direct commit ID</text>
        <line x1="200" y1="293" x2="561" y2="125" stroke="#f43f5e" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#gitRefArrow)"/>

        <text x="540" y="248" fill="#9ca3af" font-size="11">Remote-tracking refs move on fetch.</text>
        <text x="540" y="268" fill="#9ca3af" font-size="11">Local branch refs move on commit, merge, reset, or update-ref.</text>
        <text x="540" y="288" fill="#9ca3af" font-size="11">Detached HEAD moves directly, without a branch name.</text>
      </svg>

      <h2>The Three Trees: HEAD, Index, Working Directory</h2>

      <p>A practical way to understand <code>add</code>, <code>commit</code>, <code>restore</code>, <code>checkout</code>, and <code>reset</code> is Git's three-tree model:</p>

      <ul>
        <li><strong>HEAD</strong>: the last committed snapshot and the default parent of the next commit.</li>
        <li><strong>Index</strong>: the proposed next commit snapshot.</li>
        <li><strong>Working directory</strong>: your editable files on disk.</li>
      </ul>

      <p>The index is not literally a recursive tree on disk. It is primarily a flat list of path entries. Each normal entry has a mode, an object ID, a stage number, and a path. During conflicts the same path can appear at stages 1, 2, and 3: common ancestor, ours, and theirs.</p>

      <pre><code>git ls-files --stage

# Normal staged entries use stage 0
# 100644 a1b2c3d4... 0  README.md

# A conflicted path can have multiple stages
# 100644 1111111... 1  app.ts   # common ancestor
# 100644 2222222... 2  app.ts   # ours
# 100644 3333333... 3  app.ts   # theirs</code></pre>

      <svg viewBox="0 0 800 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Git three trees diagram showing working directory, index, and HEAD with commands that move content between them">
        <rect width="800" height="330" fill="#0f172a" rx="12"/>
        <text x="400" y="34" text-anchor="middle" fill="#cbd5e1" font-size="16" font-weight="700">THE THREE TREES</text>
        <defs>
          <marker id="gitTreeArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8"/>
          </marker>
        </defs>

        <rect x="56" y="92" width="190" height="104" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="151" y="123" text-anchor="middle" fill="#bae6fd" font-size="15" font-weight="700">Working Directory</text>
        <text x="151" y="149" text-anchor="middle" fill="#7dd3fc" font-size="11">editable files</text>
        <text x="151" y="169" text-anchor="middle" fill="#7dd3fc" font-size="11">sandbox</text>

        <rect x="305" y="92" width="190" height="104" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="400" y="123" text-anchor="middle" fill="#fde68a" font-size="15" font-weight="700">Index</text>
        <text x="400" y="149" text-anchor="middle" fill="#fcd34d" font-size="11">proposed next commit</text>
        <text x="400" y="169" text-anchor="middle" fill="#fcd34d" font-size="11">.git/index</text>

        <rect x="554" y="92" width="190" height="104" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="649" y="123" text-anchor="middle" fill="#bbf7d0" font-size="15" font-weight="700">HEAD</text>
        <text x="649" y="149" text-anchor="middle" fill="#86efac" font-size="11">last commit snapshot</text>
        <text x="649" y="169" text-anchor="middle" fill="#86efac" font-size="11">next parent</text>

        <line x1="246" y1="130" x2="305" y2="130" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitTreeArrow)"/>
        <text x="275" y="118" text-anchor="middle" fill="#cbd5e1" font-size="11">git add</text>
        <line x1="495" y1="130" x2="554" y2="130" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitTreeArrow)"/>
        <text x="524" y="118" text-anchor="middle" fill="#cbd5e1" font-size="11">git commit</text>

        <path d="M649 196 C649 250, 400 260, 151 196" fill="none" stroke="#a78bfa" stroke-width="2" marker-end="url(#gitTreeArrow)"/>
        <text x="400" y="272" text-anchor="middle" fill="#ddd6fe" font-size="11">checkout / restore writes committed or indexed content back to the working tree</text>

        <path d="M649 92 C650 62, 400 62, 400 92" fill="none" stroke="#f43f5e" stroke-width="2" marker-end="url(#gitTreeArrow)"/>
        <text x="525" y="68" text-anchor="middle" fill="#fecdd3" font-size="11">reset moves refs and may reset index/working tree</text>
      </svg>

      <h2>How a Commit Is Created</h2>

      <p>The porcelain command <code>git commit</code> hides several plumbing steps:</p>

      <ol>
        <li><code>git add</code> writes new blob objects for changed file contents and records their IDs in the index.</li>
        <li><code>git write-tree</code> turns the index into tree objects.</li>
        <li><code>git commit-tree</code> creates a commit object that points to the root tree and parent commit.</li>
        <li>The current branch ref is updated to the new commit, and the reflog records the move.</li>
      </ol>

      <pre><code># What porcelain roughly builds on:
git hash-object -w README.md
git update-index --add README.md
tree=$(git write-tree)
commit=$(echo "Add README" | git commit-tree "$tree" -p HEAD)
git update-ref refs/heads/main "$commit"</code></pre>

      <p>You normally should not create commits this way, but these commands explain what the higher-level workflow is doing.</p>

      <h2>Reachability: What Keeps Objects Alive</h2>

      <p>Git objects are immutable. Updating a branch does not edit an old commit; it moves a ref to a new commit. Objects stay protected while they are reachable from a ref, tag, remote-tracking branch, stash, or reflog. Once an object is no longer reachable from any of those places, garbage collection may eventually prune it.</p>

      <pre><code># Commits reachable from main
git rev-list main

# Objects that are not reachable from refs
git fsck --unreachable

# Expire old reflog entries and prune unreachable objects (dangerous if forced)
git gc --prune=now</code></pre>

      <p>This reachability rule is why <code>git commit --amend</code>, <code>git rebase</code>, and <code>git reset</code> feel like they rewrite history. They actually create or select different objects, then move refs.</p>

      <h2>How Merge Actually Works</h2>

      <p>A merge has two common outcomes. If the target branch is already an ancestor of the branch being merged, Git can do a <strong>fast-forward</strong>: it just moves the target branch ref forward. If both branches have new commits, Git finds the merge base and performs a three-way merge between the base, ours, and theirs. A true merge commit has two or more parents.</p>

      <pre><code># Diverged history:
#   A --- B --- C (main)
#          \\
#           D --- E (feature)

git switch main
git merge feature

# True merge:
#   A --- B --- C --- M (main)
#          \\         /
#           D --- E (feature)

git cat-file -p HEAD
# parent c1c2c3c4...   # previous main
# parent e1e2e3e4...   # feature tip</code></pre>

      <p>During a conflict, the index stores multiple staged versions for the same path. When you resolve the file and run <code>git add</code>, Git replaces those stages with a normal stage-0 entry. The final <code>git commit</code> creates the merge commit.</p>

      <svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Merge and rebase comparison diagram showing merge commit with two parents and rebase replaying commits onto a new base">
        <rect width="800" height="380" fill="#111827" rx="12"/>
        <text x="400" y="34" text-anchor="middle" fill="#d1d5db" font-size="16" font-weight="700">MERGE VS REBASE</text>
        <defs>
          <marker id="gitHistoryArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#9ca3af"/>
          </marker>
        </defs>

        <text x="70" y="72" fill="#93c5fd" font-size="13" font-weight="700">Merge keeps both lines</text>
        <circle cx="90" cy="120" r="18" fill="#1f2937" stroke="#22c55e" stroke-width="2"/><text x="90" y="125" text-anchor="middle" fill="#bbf7d0" font-size="11">A</text>
        <circle cx="170" cy="120" r="18" fill="#1f2937" stroke="#22c55e" stroke-width="2"/><text x="170" y="125" text-anchor="middle" fill="#bbf7d0" font-size="11">B</text>
        <circle cx="250" cy="120" r="18" fill="#1f2937" stroke="#60a5fa" stroke-width="2"/><text x="250" y="125" text-anchor="middle" fill="#bfdbfe" font-size="11">C</text>
        <circle cx="330" cy="120" r="18" fill="#1f2937" stroke="#60a5fa" stroke-width="2"/><text x="330" y="125" text-anchor="middle" fill="#bfdbfe" font-size="11">M</text>
        <circle cx="250" cy="200" r="18" fill="#1f2937" stroke="#f59e0b" stroke-width="2"/><text x="250" y="205" text-anchor="middle" fill="#fde68a" font-size="11">E</text>
        <circle cx="170" cy="200" r="18" fill="#1f2937" stroke="#f59e0b" stroke-width="2"/><text x="170" y="205" text-anchor="middle" fill="#fde68a" font-size="11">D</text>
        <line x1="108" y1="120" x2="152" y2="120" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="188" y1="120" x2="232" y2="120" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="268" y1="120" x2="312" y2="120" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="184" y1="132" x2="237" y2="188" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="188" y1="200" x2="232" y2="200" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="267" y1="190" x2="318" y2="132" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <text x="330" y="156" text-anchor="middle" fill="#cbd5e1" font-size="10">two parents</text>

        <text x="430" y="72" fill="#c4b5fd" font-size="13" font-weight="700">Rebase copies changes onto a new base</text>
        <circle cx="450" cy="120" r="18" fill="#1f2937" stroke="#22c55e" stroke-width="2"/><text x="450" y="125" text-anchor="middle" fill="#bbf7d0" font-size="11">A</text>
        <circle cx="530" cy="120" r="18" fill="#1f2937" stroke="#22c55e" stroke-width="2"/><text x="530" y="125" text-anchor="middle" fill="#bbf7d0" font-size="11">B</text>
        <circle cx="610" cy="120" r="18" fill="#1f2937" stroke="#60a5fa" stroke-width="2"/><text x="610" y="125" text-anchor="middle" fill="#bfdbfe" font-size="11">C</text>
        <circle cx="690" cy="120" r="18" fill="#1f2937" stroke="#a78bfa" stroke-width="2"/><text x="690" y="125" text-anchor="middle" fill="#ddd6fe" font-size="11">D'</text>
        <circle cx="750" cy="120" r="18" fill="#1f2937" stroke="#a78bfa" stroke-width="2"/><text x="750" y="125" text-anchor="middle" fill="#ddd6fe" font-size="11">E'</text>
        <circle cx="610" cy="205" r="18" fill="#1f2937" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3"/><text x="610" y="210" text-anchor="middle" fill="#fde68a" font-size="11">D</text>
        <circle cx="690" cy="205" r="18" fill="#1f2937" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3"/><text x="690" y="210" text-anchor="middle" fill="#fde68a" font-size="11">E</text>
        <line x1="468" y1="120" x2="512" y2="120" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="548" y1="120" x2="592" y2="120" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="628" y1="120" x2="672" y2="120" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="708" y1="120" x2="732" y2="120" stroke="#9ca3af" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <line x1="548" y1="132" x2="597" y2="193" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#gitHistoryArrow)"/>
        <line x1="628" y1="205" x2="672" y2="205" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#gitHistoryArrow)"/>
        <path d="M610 187 C625 160, 652 146, 680 132" fill="none" stroke="#a78bfa" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <path d="M690 187 C707 165, 724 148, 742 134" fill="none" stroke="#a78bfa" stroke-width="2" marker-end="url(#gitHistoryArrow)"/>
        <text x="635" y="250" fill="#9ca3af" font-size="11">D and E are old commits.</text>
        <text x="635" y="270" fill="#9ca3af" font-size="11">D' and E' are new commits with new IDs.</text>
      </svg>

      <h2>How Rebase Actually Works</h2>

      <p>Rebase finds the common ancestor, records the changes introduced by each commit on your branch, resets the branch to the new base, and applies those changes in order. The resulting commits usually have different parents, timestamps, and object IDs even if their patches look the same.</p>

      <pre><code># Before:
#   A --- B --- C (main)
#          \\
#           D --- E (feature)

git switch feature
git rebase main

# After:
#   A --- B --- C (main)
#                \\
#                 D' --- E' (feature)</code></pre>

      <p>The original <code>D</code> and <code>E</code> objects do not vanish immediately. They are just no longer named by the branch after it moves. The reflog normally gives you a recovery path until those entries expire and garbage collection can prune unreachable objects.</p>

      <p>That is also the reason behind the common rule: do not rebase commits other people are already using unless the team has explicitly agreed to rewrite that shared history.</p>

      <h2>Reflog: Your Local Safety Net</h2>

      <p>Reflogs record updates to refs in your local repository. <code>git reflog</code> defaults to showing the <code>HEAD</code> reflog, and <code>HEAD</code>'s reflog also records branch switches. Branches, remote-tracking branches, and other refs can have reflogs too. They are not pushed to remotes.</p>

      <pre><code># View HEAD's recent positions
git reflog

# View a specific branch reflog
git reflog main

# Example:
# abc1234 HEAD@{0}: commit: Add new feature
# def5678 HEAD@{1}: rebase: moving to main
# 9ab0cde HEAD@{2}: checkout: moving from main to feature
# fgh1234 HEAD@{3}: reset: moving to HEAD~3

# Recover from an accidental reset:
git reset --hard HEAD@{3}

# Recover by creating a new branch instead:
git branch recovered-work HEAD@{3}</code></pre>

      <p>Default expiry is commonly 90 days for reachable reflog entries and 30 days for unreachable entries, controlled by <code>gc.reflogExpire</code> and <code>gc.reflogExpireUnreachable</code>. Treat that as a recovery window, not a backup policy.</p>

      <h2>Packfiles and Garbage Collection</h2>

      <p>Git initially writes objects as loose objects. Loose objects are compressed individually and stored below <code>.git/objects</code>. Over time, Git consolidates many objects into packfiles to reduce disk usage and improve lookup performance. A packfile stores many compressed objects, often with deltas between similar objects, and an <code>.idx</code> file maps object IDs to offsets inside the pack.</p>

      <pre><code># Trigger repository housekeeping manually
git gc

# Inspect pack contents
git verify-pack -v .git/objects/pack/pack-*.idx

# See loose and packed object counts
git count-objects -v</code></pre>

      <p><code>git gc</code> also performs housekeeping around unreachable objects, packed refs, reflogs, rerere metadata, stale worktrees, and sometimes ancillary indexes such as the commit-graph. Many porcelain commands can run lightweight automatic maintenance when repository thresholds are crossed; the default loose-object threshold for <code>gc.auto</code> is approximately 6700.</p>

      <svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Git object lifecycle showing loose objects, reachable refs and reflogs, packfiles, expiration, and pruning">
        <rect width="800" height="340" fill="#0f172a" rx="12"/>
        <text x="400" y="34" text-anchor="middle" fill="#cbd5e1" font-size="16" font-weight="700">OBJECT LIFECYCLE</text>
        <defs>
          <marker id="gitLifeArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8"/>
          </marker>
        </defs>

        <rect x="54" y="96" width="130" height="72" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="119" y="123" text-anchor="middle" fill="#bae6fd" font-size="13" font-weight="700">new object</text>
        <text x="119" y="145" text-anchor="middle" fill="#7dd3fc" font-size="11">loose + zlib</text>

        <rect x="244" y="74" width="150" height="72" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="319" y="101" text-anchor="middle" fill="#bbf7d0" font-size="13" font-weight="700">reachable</text>
        <text x="319" y="123" text-anchor="middle" fill="#86efac" font-size="11">ref / tag / reflog</text>

        <rect x="244" y="188" width="150" height="72" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/>
        <text x="319" y="215" text-anchor="middle" fill="#fed7aa" font-size="13" font-weight="700">unreachable</text>
        <text x="319" y="237" text-anchor="middle" fill="#fdba74" font-size="11">no protecting name</text>

        <rect x="476" y="74" width="144" height="72" rx="8" fill="#1e293b" stroke="#a78bfa" stroke-width="2"/>
        <text x="548" y="101" text-anchor="middle" fill="#ddd6fe" font-size="13" font-weight="700">packfile</text>
        <text x="548" y="123" text-anchor="middle" fill="#c4b5fd" font-size="11">compressed + deltas</text>

        <rect x="476" y="188" width="144" height="72" rx="8" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>
        <text x="548" y="215" text-anchor="middle" fill="#fecdd3" font-size="13" font-weight="700">expired</text>
        <text x="548" y="237" text-anchor="middle" fill="#fda4af" font-size="11">reflog window ends</text>

        <rect x="682" y="188" width="78" height="72" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
        <text x="721" y="215" text-anchor="middle" fill="#fecaca" font-size="13" font-weight="700">pruned</text>
        <text x="721" y="237" text-anchor="middle" fill="#fca5a5" font-size="11">deleted</text>

        <line x1="184" y1="132" x2="244" y2="110" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitLifeArrow)"/>
        <text x="215" y="105" text-anchor="middle" fill="#cbd5e1" font-size="10">commit/tag/ref</text>
        <line x1="184" y1="140" x2="244" y2="224" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitLifeArrow)"/>
        <text x="215" y="190" text-anchor="middle" fill="#cbd5e1" font-size="10">orphaned</text>
        <line x1="394" y1="110" x2="476" y2="110" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitLifeArrow)"/>
        <text x="435" y="98" text-anchor="middle" fill="#cbd5e1" font-size="10">git gc</text>
        <line x1="394" y1="224" x2="476" y2="224" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitLifeArrow)"/>
        <text x="435" y="212" text-anchor="middle" fill="#cbd5e1" font-size="10">expire</text>
        <line x1="620" y1="224" x2="682" y2="224" stroke="#94a3b8" stroke-width="2" marker-end="url(#gitLifeArrow)"/>
        <text x="650" y="212" text-anchor="middle" fill="#cbd5e1" font-size="10">prune</text>
        <path d="M548 146 C548 170, 548 170, 548 188" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#gitLifeArrow)"/>
        <text x="642" y="166" fill="#94a3b8" font-size="10">later ref/reflog loss</text>
      </svg>

      <h2>Useful Plumbing Commands</h2>

      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>git cat-file -t SHA</code></td>
            <td>Show object type: blob, tree, commit, or tag.</td>
          </tr>
          <tr>
            <td><code>git cat-file -p SHA</code></td>
            <td>Pretty-print object contents.</td>
          </tr>
          <tr>
            <td><code>git hash-object -w FILE</code></td>
            <td>Compute an object ID and optionally write a blob.</td>
          </tr>
          <tr>
            <td><code>git update-index</code></td>
            <td>Manipulate the index at the plumbing level.</td>
          </tr>
          <tr>
            <td><code>git write-tree</code></td>
            <td>Create tree objects from the current index.</td>
          </tr>
          <tr>
            <td><code>git commit-tree</code></td>
            <td>Create a commit object from a tree and parent(s).</td>
          </tr>
          <tr>
            <td><code>git ls-files --stage</code></td>
            <td>Show index entries and conflict stages.</td>
          </tr>
          <tr>
            <td><code>git rev-parse HEAD</code></td>
            <td>Resolve a revision or ref to an object ID.</td>
          </tr>
          <tr>
            <td><code>git show-ref</code></td>
            <td>List refs and the object IDs they point to.</td>
          </tr>
          <tr>
            <td><code>git symbolic-ref HEAD</code></td>
            <td>Read or update symbolic refs such as HEAD.</td>
          </tr>
          <tr>
            <td><code>git merge-base A B</code></td>
            <td>Find the common ancestor used for a three-way merge or rebase.</td>
          </tr>
          <tr>
            <td><code>git verify-pack -v</code></td>
            <td>Inspect objects and deltas inside a pack index.</td>
          </tr>
          <tr>
            <td><code>git fsck</code></td>
            <td>Verify object database integrity and find unreachable objects.</td>
          </tr>
          <tr>
            <td><code>git reflog &lt;ref&gt;</code></td>
            <td>Show previous values of a local ref.</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Git stores immutable objects</strong>: blobs, trees, commits, and annotated tag objects.</li>
        <li><strong>Object IDs are content-derived</strong>: SHA-1 is traditional, SHA-256 repositories exist, and filenames are not part of blob identity.</li>
        <li><strong>Commits are snapshots, not diffs</strong>: Git calculates diffs by comparing trees when you ask.</li>
        <li><strong>Branches are movable refs</strong>: they may be loose files or packed refs, but conceptually they point to commits.</li>
        <li><strong>HEAD is usually symbolic</strong>: in detached HEAD it points directly to a commit instead of a branch.</li>
        <li><strong>The index is the proposed next commit</strong>: conflict stages explain why merge conflicts are more structured than they look.</li>
        <li><strong>Merge preserves topology</strong>: a true merge commit records multiple parents; a fast-forward is just a ref move.</li>
        <li><strong>Rebase creates new commits</strong>: old commits usually remain recoverable through reflogs for a while.</li>
        <li><strong>Packfiles keep Git compact</strong>: <code>git gc</code> consolidates objects, compresses similar data, and eventually prunes unreachable objects.</li>
      </ul>

      <h2>Official References Used</h2>

      <p>This article was checked against the official Git book and Git manual pages:</p>

      <ul>
        <li><a href="https://git-scm.com/docs/gitdatamodel" target="_blank" rel="noopener noreferrer">Git data model</a></li>
        <li><a href="https://git-scm.com/book/en/v2/Git-Internals-Git-Objects" target="_blank" rel="noopener noreferrer">Git Internals: Git Objects</a></li>
        <li><a href="https://git-scm.com/book/en/v2/Git-Internals-Git-References" target="_blank" rel="noopener noreferrer">Git Internals: Git References</a></li>
        <li><a href="https://git-scm.com/book/en/v2/Git-Internals-Packfiles" target="_blank" rel="noopener noreferrer">Git Internals: Packfiles</a></li>
        <li><a href="https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified" target="_blank" rel="noopener noreferrer">Git Tools: Reset Demystified</a></li>
        <li><a href="https://git-scm.com/docs/git-reflog" target="_blank" rel="noopener noreferrer">git-reflog manual</a></li>
        <li><a href="https://git-scm.com/docs/git-gc" target="_blank" rel="noopener noreferrer">git-gc manual</a></li>
      </ul>

      <p>Understanding Git internals transforms it from a scary tool into a simple one. A branch is a pointer-like ref. A commit is an immutable snapshot in a graph. The index prepares the next snapshot. The reflog remembers where local refs have been. Once you see the data structures, Git commands stop being incantations and start being logical operations on names, objects, and reachability.</p>
    `;
