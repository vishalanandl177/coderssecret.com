export const CONTENT = `
      <p>Contributing to open source is the fastest way to level up as a developer. You read production code, get feedback from experienced maintainers, and build a public portfolio. But most developers never start because the process feels intimidating. This guide makes your first contribution painless.</p>

      <h2>Step 1: Find a Beginner-Friendly Issue</h2>

      <p>Do not start with Linux kernel patches. Look for issues explicitly labeled for newcomers:</p>

      <ul>
        <li><strong>good first issue</strong> &mdash; the standard GitHub label for beginner tasks</li>
        <li><strong>help wanted</strong> &mdash; maintainers actively seeking contributors</li>
        <li><strong>documentation</strong> &mdash; docs fixes are the easiest entry point</li>
        <li><strong>bug</strong> (with clear reproduction steps) &mdash; bounded scope, clear success criteria</li>
      </ul>

      <h3>Where to Search</h3>

      <pre><code># GitHub search for beginner issues in Python projects
https://github.com/search?q=label%3A%22good+first+issue%22+language%3APython+state%3Aopen

# Filter by language, stars, and recent activity
https://github.com/search?q=label%3A%22good+first+issue%22+language%3ATypeScript+stars%3A>100

# Curated lists:
# - goodfirstissue.dev
# - firsttimersonly.com
# - up-for-grabs.net</code></pre>

      <h3>Picking the Right Issue</h3>

      <ul>
        <li><strong>Read the issue completely</strong> including all comments &mdash; someone may already be working on it</li>
        <li><strong>Check if it is assigned</strong> &mdash; if someone claimed it 3 months ago with no PR, comment asking if it is still being worked on</li>
        <li><strong>Prefer issues with clear acceptance criteria</strong> &mdash; &ldquo;Fix typo in README&rdquo; is better than &ldquo;Improve performance&rdquo;</li>
        <li><strong>Comment before starting:</strong> &ldquo;I&rsquo;d like to work on this. Is this still available?&rdquo;</li>
      </ul>

      <h2>Step 2: Fork and Clone</h2>

      <pre><code># 1. Fork the repository on GitHub (click the "Fork" button)

# 2. Clone YOUR fork (not the original)
git clone https://github.com/YOUR-USERNAME/project-name.git
cd project-name

# 3. Add the original repo as "upstream" remote
git remote add upstream https://github.com/ORIGINAL-OWNER/project-name.git

# 4. Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/project-name.git (your fork)
# upstream  https://github.com/ORIGINAL-OWNER/project-name.git (original)

# 5. Create a feature branch (never work on main!)
git checkout -b fix/typo-in-readme</code></pre>

      <h2>Step 3: Set Up the Development Environment</h2>

      <pre><code># Read the contributing guide FIRST
# Look for: CONTRIBUTING.md, .github/CONTRIBUTING.md, or docs/contributing.md

# Common setup patterns:

# Python project
python -m venv venv
source venv/bin/activate
pip install -e ".[dev]"    # Install with dev dependencies
pytest                      # Run tests to verify setup

# Node.js project
npm install
npm test

# Run linters/formatters before changing anything
# This ensures your PR only contains YOUR changes, not reformatting</code></pre>

      <h2>Step 4: Make Your Changes</h2>

      <ul>
        <li><strong>Make the smallest possible change</strong> that solves the issue. Do not refactor surrounding code.</li>
        <li><strong>Follow the project&rsquo;s code style</strong> &mdash; look at existing code and match it exactly (indentation, naming, imports).</li>
        <li><strong>Add tests if the project has tests</strong> &mdash; a PR with tests is much more likely to be merged.</li>
        <li><strong>Run the full test suite locally</strong> before pushing.</li>
      </ul>

      <pre><code># After making changes:

# Run tests
pytest                        # Python
npm test                      # Node.js

# Run linters
ruff check .                  # Python
eslint .                      # JavaScript/TypeScript

# Run formatters
ruff format .                 # Python
prettier --write .            # JavaScript/TypeScript</code></pre>

      <h2>Step 5: Commit with Good Messages</h2>

      <pre><code># Follow Conventional Commits (most projects prefer this)
git add specific-file.py      # Stage specific files, not "git add ."

# Good commit messages:
git commit -m "fix: correct typo in installation docs"
git commit -m "feat: add support for Python 3.12"
git commit -m "docs: update API reference for v2 endpoints"
git commit -m "test: add unit tests for user validation"

# Bad commit messages:
git commit -m "fix stuff"
git commit -m "update"
git commit -m "WIP"

# Conventions:
# fix:    Bug fix
# feat:   New feature
# docs:   Documentation only
# test:   Adding or fixing tests
# chore:  Maintenance (dependencies, CI config)
# refactor: Code change that neither fixes a bug nor adds a feature</code></pre>

      <h2>Step 6: Push and Create Pull Request</h2>

      <pre><code># Keep your branch up to date with upstream
git fetch upstream
git rebase upstream/main      # Rebase YOUR changes on top of latest main

# Push to YOUR fork
git push origin fix/typo-in-readme</code></pre>

      <h3>Writing a Good PR Description</h3>

      <pre><code># PR Title: fix: correct installation command in README

## What
Fixed the pip install command in the README that referenced
the old package name.

## Why
The package was renamed from "old-name" to "new-name" in v2.0
but the README still referenced the old name, causing installation
failures for new users. Fixes #123.

## How
- Updated the install command in README.md
- Updated the import example to match the new package name

## Testing
- Verified the new command installs successfully
- Ran existing test suite: all passing</code></pre>

      <h2>Step 7: Respond to Review Feedback</h2>

      <p>Maintainer reviews are normal and expected. Most PRs get feedback. This is not criticism &mdash; it is collaboration.</p>

      <ul>
        <li><strong>Respond to every comment</strong> &mdash; even if just &ldquo;Good point, fixed!&rdquo;</li>
        <li><strong>Push fixes as new commits</strong> (do not force-push unless asked). This makes it easy for reviewers to see what changed.</li>
        <li><strong>Ask questions if feedback is unclear</strong> &mdash; &ldquo;Could you clarify what you mean by X?&rdquo;</li>
        <li><strong>Do not take rejection personally</strong> &mdash; sometimes a PR does not fit the project&rsquo;s direction. That is okay.</li>
        <li><strong>Be patient</strong> &mdash; maintainers are volunteers. It may take days or weeks to review your PR.</li>
      </ul>

      <pre><code># After receiving review feedback:

# Make the requested changes
git add updated-file.py
git commit -m "fix: address review feedback - use constant instead of magic number"

# Push to the same branch (PR updates automatically)
git push origin fix/typo-in-readme

# If maintainer asks you to squash commits:
git rebase -i upstream/main
# Mark commits as "squash" to combine them
git push --force-with-lease origin fix/typo-in-readme</code></pre>

      <h2>Types of Contributions</h2>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Difficulty</th>
            <th>Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fix typos in docs</td>
            <td>Easiest</td>
            <td>Low but builds confidence</td>
          </tr>
          <tr>
            <td>Improve error messages</td>
            <td>Easy</td>
            <td>High for user experience</td>
          </tr>
          <tr>
            <td>Add missing tests</td>
            <td>Medium</td>
            <td>High for project reliability</td>
          </tr>
          <tr>
            <td>Fix reported bugs</td>
            <td>Medium</td>
            <td>High</td>
          </tr>
          <tr>
            <td>Add new features</td>
            <td>Hard</td>
            <td>Very high (discuss first!)</td>
          </tr>
          <tr>
            <td>Improve performance</td>
            <td>Hard</td>
            <td>High (needs benchmarks)</td>
          </tr>
          <tr>
            <td>Review other PRs</td>
            <td>Medium</td>
            <td>Very high for maintainers</td>
          </tr>
          <tr>
            <td>Answer issues/discussions</td>
            <td>Easy</td>
            <td>High for community</td>
          </tr>
        </tbody>
      </table>

      <h2>Etiquette Rules</h2>

      <ul>
        <li><strong>Read CONTRIBUTING.md before anything else</strong> &mdash; every project has different expectations</li>
        <li><strong>Do not open a PR without an issue</strong> unless it is a trivial fix (typo, broken link)</li>
        <li><strong>One PR per issue</strong> &mdash; do not bundle unrelated changes</li>
        <li><strong>Do not @-mention maintainers asking for review</strong> &mdash; they will see your PR</li>
        <li><strong>Be kind in all interactions</strong> &mdash; open source runs on goodwill</li>
        <li><strong>Give credit</strong> &mdash; if someone helped you in the issue, mention them in the PR</li>
        <li><strong>Follow up</strong> &mdash; if CI fails on your PR, fix it. Do not leave broken PRs open.</li>
      </ul>

      <h2>Building a Contribution Habit</h2>

      <ol>
        <li><strong>Start with docs/typo fixes</strong> in projects you use daily &mdash; you already know the product</li>
        <li><strong>Move to bug fixes</strong> where you have experienced the bug yourself</li>
        <li><strong>Progress to tests</strong> &mdash; reading test code teaches you the codebase faster than reading source code</li>
        <li><strong>Eventually tackle features</strong> &mdash; by now you understand the project&rsquo;s patterns and conventions</li>
        <li><strong>Become a regular contributor</strong> &mdash; consistent small contributions matter more than one big PR</li>
      </ol>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Your first PR should be small</strong> &mdash; a typo fix or docs improvement is a perfectly valid contribution</li>
        <li><strong>Always read CONTRIBUTING.md first</strong> &mdash; projects have specific expectations for branches, commits, and testing</li>
        <li><strong>Comment on the issue before starting work</strong> &mdash; avoid duplicating effort</li>
        <li><strong>Never work on the main branch</strong> &mdash; always create a feature branch</li>
        <li><strong>Write descriptive PR titles and descriptions</strong> &mdash; reference the issue number</li>
        <li><strong>Review feedback is normal, not personal</strong> &mdash; respond thoughtfully and push fixes</li>
        <li><strong>Consistency beats size</strong> &mdash; regular small contributions build your reputation and skills faster than one large PR</li>
      </ul>

      <p>The open source community is full of people who started exactly where you are now &mdash; nervous about their first PR. Every maintainer remembers their first contribution. The hardest part is not the code. It is clicking &ldquo;Create Pull Request.&rdquo; Once you do it once, it becomes routine. Start today.</p>
    `;
