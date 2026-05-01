export const CONTENT = `
      <p>Most developers use Git daily but treat it as a black box. They memorize commands without understanding what happens underneath. This leads to panic during rebases, confusion during merge conflicts, and fear of <code>git reflog</code>.</p>

      <p>Once you understand Git internals, everything clicks. Branches become simple. Rebases make sense. Recovery from mistakes becomes trivial. This guide takes you inside the <code>.git</code> directory and shows you exactly how Git stores and tracks your code.</p>

      <h2>Git Is a Content-Addressable Filesystem</h2>

      <p>At its core, Git is a key-value store. You give it content, it gives you back a SHA-1 hash (the key). You can retrieve the content later using that hash. Everything in Git &mdash; files, directories, commits &mdash; is stored this way.</p>

      <pre><code># Store some content and get a hash back
echo "Hello, Git" | git hash-object --stdin -w
# Output: 3fa0d1ac21b29b96ee682541d4be0b3a0a89f5af

# Retrieve it by hash
git cat-file -p 3fa0d1ac21b29b96ee682541d4be0b3a0a89f5af
# Output: Hello, Git</code></pre>

      <p>This is the fundamental operation. Everything else in Git is built on top of this content-addressable storage.</p>

      <h2>The Three Objects: Blob, Tree, Commit</h2>

      <h3>1. Blob: File Content</h3>

      <p>A blob stores the raw content of a file. It does <strong>not</strong> store the filename, permissions, or any metadata &mdash; just the bytes.</p>

      <pre><code># See what type an object is
git cat-file -t 3fa0d1a
# Output: blob

# Two files with identical content share the SAME blob
# Git automatically deduplicates at the content level</code></pre>

      <h3>2. Tree: Directory Listing</h3>

      <p>A tree represents a directory. It maps filenames to blobs (files) or other trees (subdirectories), along with file permissions.</p>

      <pre><code># View the tree of the latest commit
git cat-file -p HEAD^{tree}

# Output:
# 100644 blob a1b2c3d4...   README.md
# 100644 blob e5f6a7b8...   package.json
# 040000 tree 1a2b3c4d...   src/
# 040000 tree 5e6f7a8b...   public/

# Dive into the src/ tree
git cat-file -p 1a2b3c4d
# 100644 blob 9f8e7d6c...   main.ts
# 040000 tree abcdef12...   components/</code></pre>

      <h3>3. Commit: A Snapshot in Time</h3>

      <p>A commit points to a tree (the state of all files at that moment), one or more parent commits (history), and metadata (author, message, timestamp).</p>

      <pre><code># View a commit object
git cat-file -p HEAD

# Output:
# tree 4b825dc642cb6eb9a060e54bf899d4e239f3b764
# parent 8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b
# author Vishal Anand &lt;vishal@example.com&gt; 1714233600 +0530
# committer Vishal Anand &lt;vishal@example.com&gt; 1714233600 +0530
#
# Add user authentication module</code></pre>

      <p>The relationship looks like this:</p>

      <pre><code>Commit (SHA: abc123)
  |
  +-- tree (SHA: def456)  &larr; root directory snapshot
        |
        +-- blob (SHA: 111...)  README.md
        +-- blob (SHA: 222...)  package.json
        +-- tree (SHA: 333...)  src/
              |
              +-- blob (SHA: 444...)  main.ts</code></pre>

      <h2>Inside the .git Directory</h2>

      <pre><code>.git/
  HEAD              # Points to current branch (ref: refs/heads/main)
  config            # Repository configuration
  index             # The staging area (binary file)
  objects/          # All blobs, trees, and commits
    3f/             # First 2 chars of SHA = directory
      a0d1ac21...   # Remaining chars = filename
    pack/           # Packed objects for efficiency
  refs/
    heads/          # Branch pointers
      main          # Contains SHA of latest commit on main
      feature-x     # Contains SHA of latest commit on feature-x
    tags/           # Tag pointers
      v1.0          # Contains SHA of tagged commit
    remotes/
      origin/       # Remote tracking branches
        main</code></pre>

      <h2>Branches Are Just Pointers</h2>

      <p>A branch is literally a 41-byte file containing a SHA-1 hash. That is it. Creating a branch does not copy any code &mdash; it creates a tiny file pointing to a commit.</p>

      <pre><code># What is the "main" branch? Just a file with a hash:
cat .git/refs/heads/main
# Output: 8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b

# What is HEAD? A reference to the current branch:
cat .git/HEAD
# Output: ref: refs/heads/main

# Creating a branch = creating a file
git branch experiment
cat .git/refs/heads/experiment
# Same hash as main! Points to the same commit.

# Switching branches = changing HEAD
git checkout experiment
cat .git/HEAD
# Output: ref: refs/heads/experiment</code></pre>

      <p>This is why Git branches are &ldquo;cheap&rdquo; &mdash; they are just 41-byte files, not copies of your codebase.</p>

      <h2>The Staging Area (Index)</h2>

      <p>The index (<code>.git/index</code>) is a binary file that represents the <strong>next commit you are building</strong>. When you run <code>git add</code>, you are updating the index. When you run <code>git commit</code>, Git snapshots the index into a tree and creates a commit pointing to it.</p>

      <pre><code># View the current index
git ls-files --stage

# Output:
# 100644 a1b2c3d4... 0  README.md
# 100644 e5f6a7b8... 0  src/main.ts
# 100644 9f8e7d6c... 0  src/app.ts

# The three areas:
# Working Directory  --(git add)-->  Staging Area (Index)  --(git commit)-->  Repository
#   (your files)                      (.git/index)                            (.git/objects)</code></pre>

      <h2>How Merge Actually Works</h2>

      <pre><code># A merge creates a commit with TWO parents:

#   A --- B --- C (main)
#          \\
#           D --- E (feature)

git checkout main
git merge feature

#   A --- B --- C --- M (main)  &larr; M has parents C and E
#          \\         /
#           D --- E (feature)

# View merge commit parents:
git cat-file -p HEAD
# parent c1c2c3c4...   (from main)
# parent e1e2e3e4...   (from feature)</code></pre>

      <h2>How Rebase Actually Works</h2>

      <pre><code># Rebase REPLAYS commits on top of a new base:

# Before rebase:
#   A --- B --- C (main)
#          \\
#           D --- E (feature)

git checkout feature
git rebase main

# After rebase:
#   A --- B --- C (main)
#                \\
#                 D' --- E' (feature)

# D' and E' are NEW commits (new SHA hashes)
# They have the same changes as D and E but different parents
# The original D and E still exist in the object store
# They are just unreachable (until garbage collected)</code></pre>

      <h2>Reflog: Your Safety Net</h2>

      <p>The reflog records every time HEAD changes. Even after a hard reset or a bad rebase, your old commits are still there. The reflog is how you recover from almost any Git mistake.</p>

      <pre><code># View the reflog
git reflog

# Output:
# abc1234 HEAD@{0}: commit: Add new feature
# def5678 HEAD@{1}: rebase: moving to main
# 9ab0cde HEAD@{2}: checkout: moving from main to feature
# fgh1234 HEAD@{3}: commit: Fix the bug
# ijk5678 HEAD@{4}: reset: moving to HEAD~3  &larr; accidental reset!

# Recover from accidental reset:
git reset --hard HEAD@{4}   # Go back to before the reset

# Recover a deleted branch:
git branch recovered-branch HEAD@{2}

# Reflog entries expire after 90 days (30 for unreachable commits)
# So you have a generous recovery window</code></pre>

      <h2>Pack Files: How Git Stays Small</h2>

      <p>Storing every version of every file as a separate blob would waste enormous space. Git solves this with pack files &mdash; it stores one full copy and then deltas (differences) for similar objects.</p>

      <pre><code># Trigger packing manually
git gc

# View pack contents
git verify-pack -v .git/objects/pack/pack-*.idx | head -20

# Git automatically packs objects when:
# - Too many loose objects accumulate (~6700)
# - You run git gc
# - You push to a remote

# A 1GB repository with 10,000 commits might have:
# - Loose objects: would be 50GB+
# - Packed: stays around 1-2GB (delta compression)</code></pre>

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
            <td>Show object type (blob, tree, commit)</td>
          </tr>
          <tr>
            <td><code>git cat-file -p SHA</code></td>
            <td>Pretty-print object content</td>
          </tr>
          <tr>
            <td><code>git hash-object FILE</code></td>
            <td>Compute SHA without storing</td>
          </tr>
          <tr>
            <td><code>git ls-files --stage</code></td>
            <td>Show the staging area contents</td>
          </tr>
          <tr>
            <td><code>git rev-parse HEAD</code></td>
            <td>Resolve a reference to its SHA</td>
          </tr>
          <tr>
            <td><code>git fsck</code></td>
            <td>Verify object database integrity</td>
          </tr>
          <tr>
            <td><code>git count-objects -v</code></td>
            <td>Show storage statistics</td>
          </tr>
          <tr>
            <td><code>git reflog</code></td>
            <td>Show HEAD movement history</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Git is a content-addressable filesystem</strong> &mdash; every piece of data is identified by its SHA-1 hash</li>
        <li><strong>Three object types:</strong> blobs (file content), trees (directories), commits (snapshots + metadata)</li>
        <li><strong>Branches are just files containing a SHA hash</strong> &mdash; creating a branch is instantaneous and free</li>
        <li><strong>HEAD points to the current branch</strong>, which points to the latest commit</li>
        <li><strong>The staging area is the next commit</strong> you are building &mdash; <code>git add</code> updates it, <code>git commit</code> snapshots it</li>
        <li><strong>Rebase creates new commits</strong> (new SHAs) &mdash; the old ones still exist until garbage collection</li>
        <li><strong>Reflog is your undo history</strong> &mdash; it records every HEAD change for 90 days</li>
        <li><strong>Pack files use delta compression</strong> to keep repositories small despite storing every version</li>
      </ul>

      <p>Understanding Git internals transforms it from a scary tool into a simple one. A branch is a pointer. A commit is a snapshot. The reflog remembers everything. Once you see the data structures, Git commands stop being incantations and start being logical operations on a graph.</p>
    `;
