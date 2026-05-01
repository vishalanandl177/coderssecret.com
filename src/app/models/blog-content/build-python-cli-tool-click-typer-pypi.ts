export const CONTENT = `
      <p>The Python ecosystem has thousands of CLI tools. Most of them die at the &ldquo;it works on my machine&rdquo; stage. The gap between a working script and a tool people actually install and use is: proper argument parsing, helpful error messages, colored output, documentation, packaging, and distribution. This guide bridges that gap.</p>

      <h2>Choosing Your Framework: Click vs Typer</h2>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Click</th>
            <th>Typer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Syntax</td>
            <td>Decorators (@click.command)</td>
            <td>Type hints (def cmd(name: str))</td>
          </tr>
          <tr>
            <td>Learning Curve</td>
            <td>Medium</td>
            <td>Low (if you know type hints)</td>
          </tr>
          <tr>
            <td>Auto-generated help</td>
            <td>Yes</td>
            <td>Yes (better formatting)</td>
          </tr>
          <tr>
            <td>Shell completions</td>
            <td>Plugin required</td>
            <td>Built-in</td>
          </tr>
          <tr>
            <td>Built on</td>
            <td>Standalone</td>
            <td>Click (wrapper)</td>
          </tr>
          <tr>
            <td>Community</td>
            <td>Larger, mature</td>
            <td>Growing fast</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Recommendation:</strong> Use Typer for new projects. It requires less code, generates better help text, and leverages Python type hints you are already writing.</p>

      <h2>Project Structure</h2>

      <pre><code>my-cli-tool/
  src/
    my_cli_tool/
      __init__.py       # Version string
      cli.py            # CLI entry point
      commands/
        __init__.py
        init.py         # 'init' subcommand
        analyze.py      # 'analyze' subcommand
        deploy.py       # 'deploy' subcommand
      core/
        __init__.py
        config.py       # Configuration management
        utils.py        # Shared utilities
  tests/
    test_cli.py
    test_commands.py
  pyproject.toml        # Package metadata and build config
  README.md
  LICENSE</code></pre>

      <h2>Building the CLI with Typer</h2>

      <pre><code># src/my_cli_tool/cli.py
import typer
from typing import Optional
from pathlib import Path
from rich.console import Console
from rich.table import Table

app = typer.Typer(
    name="mytool",
    help="A developer productivity tool for project management.",
    add_completion=True,
)
console = Console()

@app.command()
def init(
    name: str = typer.Argument(..., help="Project name"),
    template: str = typer.Option(
        "default", "--template", "-t",
        help="Project template to use"
    ),
    directory: Path = typer.Option(
        ".", "--dir", "-d",
        help="Target directory"
    ),
    force: bool = typer.Option(
        False, "--force", "-f",
        help="Overwrite existing files"
    ),
):
    """Initialize a new project with the given name and template."""
    target = directory / name

    if target.exists() and not force:
        console.print(f"[red]Error:[/red] Directory '{target}' already exists. Use --force to overwrite.")
        raise typer.Exit(code=1)

    target.mkdir(parents=True, exist_ok=True)
    console.print(f"[green]Created project '{name}' in {target}[/green]")


@app.command()
def analyze(
    path: Path = typer.Argument(".", help="Path to analyze"),
    format: str = typer.Option(
        "table", "--format", "-f",
        help="Output format: table, json, csv"
    ),
    verbose: bool = typer.Option(False, "--verbose", "-v"),
):
    """Analyze a project directory and show statistics."""
    if not path.exists():
        console.print(f"[red]Error:[/red] Path '{path}' does not exist.")
        raise typer.Exit(code=1)

    # Count files by extension
    stats = {}
    for file in path.rglob("*"):
        if file.is_file() and not any(p.startswith('.') for p in file.parts):
            ext = file.suffix or "(no extension)"
            stats[ext] = stats.get(ext, 0) + 1

    if format == "table":
        table = Table(title=f"File Analysis: {path}")
        table.add_column("Extension", style="cyan")
        table.add_column("Count", justify="right", style="green")

        for ext, count in sorted(stats.items(), key=lambda x: -x[1]):
            table.add_row(ext, str(count))

        console.print(table)
    elif format == "json":
        import json
        console.print(json.dumps(stats, indent=2))


@app.command()
def version():
    """Show the current version."""
    from my_cli_tool import __version__
    console.print(f"mytool v{__version__}")


if __name__ == "__main__":
    app()</code></pre>

      <h2>Adding Rich Output</h2>

      <pre><code>from rich.progress import track, Progress
from rich.panel import Panel
from rich.syntax import Syntax
import time

@app.command()
def deploy(
    environment: str = typer.Argument(..., help="Target environment"),
    dry_run: bool = typer.Option(False, "--dry-run", help="Show what would happen"),
):
    """Deploy the project to the specified environment."""
    steps = [
        ("Running tests", 2),
        ("Building artifacts", 3),
        ("Uploading to registry", 2),
        ("Deploying to cluster", 4),
        ("Running health checks", 1),
    ]

    if dry_run:
        console.print(Panel(
            "\\n".join(f"  [cyan]{step}[/cyan]" for step, _ in steps),
            title="Dry Run - Steps",
            border_style="yellow",
        ))
        return

    with Progress() as progress:
        task = progress.add_task(f"Deploying to {environment}...", total=len(steps))

        for step_name, duration in steps:
            progress.update(task, description=step_name)
            time.sleep(duration * 0.1)  # Simulated work
            progress.advance(task)

    console.print(f"[green]Deployed to {environment} successfully![/green]")</code></pre>

      <h2>Configuration Management</h2>

      <pre><code># src/my_cli_tool/core/config.py
import json
from pathlib import Path
from dataclasses import dataclass, asdict

CONFIG_DIR = Path.home() / ".config" / "mytool"
CONFIG_FILE = CONFIG_DIR / "config.json"

@dataclass
class Config:
    default_template: str = "default"
    auto_format: bool = True
    editor: str = "vim"
    registry_url: str = "https://registry.example.com"

    @classmethod
    def load(cls) -> "Config":
        if CONFIG_FILE.exists():
            data = json.loads(CONFIG_FILE.read_text())
            return cls(**data)
        return cls()

    def save(self):
        CONFIG_DIR.mkdir(parents=True, exist_ok=True)
        CONFIG_FILE.write_text(json.dumps(asdict(self), indent=2))

# CLI command for configuration
@app.command()
def config(
    key: str = typer.Argument(None, help="Config key to get/set"),
    value: str = typer.Argument(None, help="Value to set"),
    list_all: bool = typer.Option(False, "--list", "-l", help="List all config"),
):
    """Get or set configuration values."""
    cfg = Config.load()

    if list_all or key is None:
        for k, v in asdict(cfg).items():
            console.print(f"  [cyan]{k}[/cyan] = {v}")
        return

    if value is None:
        console.print(f"  {key} = {getattr(cfg, key, 'NOT SET')}")
    else:
        setattr(cfg, key, value)
        cfg.save()
        console.print(f"  [green]Set {key} = {value}[/green]")</code></pre>

      <h2>Packaging with pyproject.toml</h2>

      <pre><code># pyproject.toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "my-cli-tool"
version = "1.0.0"
description = "A developer productivity tool for project management"
readme = "README.md"
license = {text = "MIT"}
requires-python = ">=3.10"
authors = [
    {name = "Vishal Anand", email = "vishal@example.com"},
]
classifiers = [
    "Development Status :: 4 - Beta",
    "Environment :: Console",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
]
dependencies = [
    "typer>=0.9.0",
    "rich>=13.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "pytest-cov",
    "ruff",
]

[project.scripts]
mytool = "my_cli_tool.cli:app"

[project.urls]
Homepage = "https://github.com/username/my-cli-tool"
Repository = "https://github.com/username/my-cli-tool"
Issues = "https://github.com/username/my-cli-tool/issues"</code></pre>

      <h2>Testing CLI Commands</h2>

      <pre><code># tests/test_cli.py
from typer.testing import CliRunner
from my_cli_tool.cli import app

runner = CliRunner()

def test_version():
    result = runner.invoke(app, ["version"])
    assert result.exit_code == 0
    assert "mytool v" in result.stdout

def test_init_creates_directory(tmp_path):
    result = runner.invoke(app, ["init", "myproject", "--dir", str(tmp_path)])
    assert result.exit_code == 0
    assert (tmp_path / "myproject").exists()

def test_init_fails_if_exists(tmp_path):
    (tmp_path / "myproject").mkdir()
    result = runner.invoke(app, ["init", "myproject", "--dir", str(tmp_path)])
    assert result.exit_code == 1
    assert "already exists" in result.stdout

def test_init_force_overwrites(tmp_path):
    (tmp_path / "myproject").mkdir()
    result = runner.invoke(app, ["init", "myproject", "--dir", str(tmp_path), "--force"])
    assert result.exit_code == 0

def test_analyze_nonexistent_path():
    result = runner.invoke(app, ["analyze", "/nonexistent/path"])
    assert result.exit_code == 1
    assert "does not exist" in result.stdout

def test_analyze_json_format(tmp_path):
    (tmp_path / "test.py").write_text("print('hello')")
    (tmp_path / "test.js").write_text("console.log('hello')")
    result = runner.invoke(app, ["analyze", str(tmp_path), "--format", "json"])
    assert result.exit_code == 0
    assert ".py" in result.stdout</code></pre>

      <h2>Publishing to PyPI</h2>

      <pre><code># Build the package
pip install build
python -m build
# Creates dist/my_cli_tool-1.0.0.tar.gz and dist/my_cli_tool-1.0.0-py3-none-any.whl

# Upload to PyPI (requires PyPI account + API token)
pip install twine
twine upload dist/*

# Users can now install with:
pip install my-cli-tool
mytool --help</code></pre>

      <h2>CI/CD with GitHub Actions</h2>

      <pre><code># .github/workflows/release.yml
name: Release

on:
  push:
    tags: ['v*']

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.10', '3.11', '3.12']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
      - run: pip install -e ".[dev]"
      - run: pytest --cov

  publish:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      id-token: write   # Required for trusted publishing
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install build
      - run: python -m build
      - uses: pypa/gh-action-pypi-publish@release/v1</code></pre>

      <h2>Shell Completions</h2>

      <pre><code># Typer generates shell completions automatically

# Install for bash:
mytool --install-completion bash

# Install for zsh:
mytool --install-completion zsh

# Install for fish:
mytool --install-completion fish

# Users get tab completion for commands, options, and arguments:
# mytool an[TAB] -> mytool analyze
# mytool analyze --f[TAB] -> mytool analyze --format</code></pre>

      <h2>Distribution Checklist</h2>

      <ul>
        <li><strong>README with install instructions</strong> and usage examples (pip install + basic commands)</li>
        <li><strong>LICENSE file</strong> (MIT for maximum adoption)</li>
        <li><strong>CHANGELOG.md</strong> with versioned release notes</li>
        <li><strong>Helpful error messages</strong> with actionable suggestions (not just stack traces)</li>
        <li><strong>--help on every command</strong> with examples (Typer generates this from docstrings)</li>
        <li><strong>Shell completions</strong> (built into Typer)</li>
        <li><strong>Colored output</strong> for readability (Rich library)</li>
        <li><strong>Exit codes:</strong> 0 for success, 1 for user error, 2 for system error</li>
        <li><strong>CI pipeline:</strong> Test on multiple Python versions, auto-publish on tag</li>
        <li><strong>Trusted publishing on PyPI</strong> (no API tokens needed with GitHub Actions OIDC)</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Use Typer for modern CLIs</strong> &mdash; type hints for argument parsing, automatic help generation, built-in completions</li>
        <li><strong>Use Rich for output</strong> &mdash; tables, progress bars, colored text, panels make CLIs professional</li>
        <li><strong>Test with CliRunner</strong> &mdash; test CLI commands like functions, assert on exit codes and output</li>
        <li><strong>Use pyproject.toml</strong> for packaging &mdash; it replaces setup.py, setup.cfg, and MANIFEST.in</li>
        <li><strong>Publish with trusted publishing</strong> &mdash; GitHub Actions OIDC to PyPI, no API tokens to manage</li>
        <li><strong>Error messages should be actionable</strong> &mdash; tell users what went wrong AND how to fix it</li>
        <li><strong>Ship shell completions</strong> &mdash; they dramatically improve the user experience</li>
      </ul>

      <p>The difference between a script and a tool is polish. Argument parsing, error handling, colored output, documentation, and distribution turn your 50-line script into something that gets starred on GitHub and installed by thousands. The tools exist &mdash; Typer, Rich, pyproject.toml, GitHub Actions &mdash; use them.</p>
    `;
