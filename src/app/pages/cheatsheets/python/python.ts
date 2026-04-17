import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Section {
  title: string;
  items: { cmd: string; desc: string }[];
}

@Component({
  selector: 'app-cheatsheet-python',
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
            <li class="text-foreground font-medium" aria-current="page">Python</li>
          </ol>
        </nav>

        <div class="flex items-center gap-4 mb-8">
          <span class="text-5xl">🐍</span>
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Python Cheat Sheet</h1>
            <p class="text-muted-foreground mt-1">Essential Python syntax and patterns — bookmark this page</p>
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
          <a routerLink="/blog" [queryParams]="{tag:'Python'}" class="text-sm text-primary hover:underline">Read Python tutorials →</a>
        </div>
      </div>
    </section>
  `,
})
export class PythonCheatsheetComponent {
  private seo = inject(SeoService);

  sections: Section[] = [
    {
      title: 'Variables & Data Types',
      items: [
        { cmd: 'x = 10', desc: 'Integer' },
        { cmd: 'pi = 3.14', desc: 'Float' },
        { cmd: 'name = "Alice"', desc: 'String' },
        { cmd: 'active = True', desc: 'Boolean' },
        { cmd: 'items = [1, 2, 3]', desc: 'List (mutable)' },
        { cmd: 'coords = (1, 2)', desc: 'Tuple (immutable)' },
        { cmd: 'unique = {1, 2, 3}', desc: 'Set (unique values)' },
        { cmd: 'user = {"name": "A"}', desc: 'Dictionary' },
        { cmd: 'type(x)', desc: 'Check type' },
        { cmd: 'isinstance(x, int)', desc: 'Type check (preferred)' },
      ],
    },
    {
      title: 'String Operations',
      items: [
        { cmd: 'f"Hello {name}"', desc: 'f-string formatting' },
        { cmd: 's.upper() / s.lower()', desc: 'Case conversion' },
        { cmd: 's.strip()', desc: 'Remove whitespace' },
        { cmd: 's.split(",")  ', desc: 'Split into list' },
        { cmd: '",".join(list)', desc: 'Join list to string' },
        { cmd: 's.replace("a","b")', desc: 'Replace substring' },
        { cmd: 's.startswith("hi")', desc: 'Check prefix' },
        { cmd: 's[1:5]', desc: 'Slice (index 1 to 4)' },
        { cmd: 's[::-1]', desc: 'Reverse string' },
        { cmd: 'len(s)', desc: 'String length' },
      ],
    },
    {
      title: 'List Operations',
      items: [
        { cmd: 'lst.append(x)', desc: 'Add to end' },
        { cmd: 'lst.insert(0, x)', desc: 'Insert at index' },
        { cmd: 'lst.pop()', desc: 'Remove & return last' },
        { cmd: 'lst.remove(x)', desc: 'Remove first occurrence' },
        { cmd: 'lst.sort()', desc: 'Sort in place' },
        { cmd: 'sorted(lst)', desc: 'Return sorted copy' },
        { cmd: 'lst[:3]', desc: 'First 3 elements' },
        { cmd: 'lst[-1]', desc: 'Last element' },
        { cmd: '[x*2 for x in lst]', desc: 'List comprehension' },
        { cmd: '[x for x in lst if x>0]', desc: 'Filtered comprehension' },
      ],
    },
    {
      title: 'Dictionary Operations',
      items: [
        { cmd: 'd["key"]', desc: 'Get value (KeyError if missing)' },
        { cmd: 'd.get("key", default)', desc: 'Get with default' },
        { cmd: 'd["key"] = value', desc: 'Set value' },
        { cmd: 'del d["key"]', desc: 'Delete key' },
        { cmd: '"key" in d', desc: 'Check key exists' },
        { cmd: 'd.keys()', desc: 'All keys' },
        { cmd: 'd.values()', desc: 'All values' },
        { cmd: 'd.items()', desc: 'Key-value pairs' },
        { cmd: 'd.update(d2)', desc: 'Merge dictionaries' },
        { cmd: '{**d1, **d2}', desc: 'Merge (Python 3.5+)' },
      ],
    },
    {
      title: 'Control Flow',
      items: [
        { cmd: 'if x > 0:', desc: 'If statement' },
        { cmd: 'elif x == 0:', desc: 'Else if' },
        { cmd: 'else:', desc: 'Else' },
        { cmd: 'for x in range(10):', desc: 'For loop' },
        { cmd: 'for i, v in enumerate(lst):', desc: 'Loop with index' },
        { cmd: 'while condition:', desc: 'While loop' },
        { cmd: 'break / continue', desc: 'Loop control' },
        { cmd: 'x if cond else y', desc: 'Ternary operator' },
        { cmd: 'match value:', desc: 'Pattern matching (3.10+)' },
      ],
    },
    {
      title: 'Functions',
      items: [
        { cmd: 'def fn(x, y=10):', desc: 'Function with default' },
        { cmd: 'def fn(*args):', desc: 'Variable positional args' },
        { cmd: 'def fn(**kwargs):', desc: 'Variable keyword args' },
        { cmd: 'lambda x: x * 2', desc: 'Anonymous function' },
        { cmd: '@decorator', desc: 'Decorator syntax' },
        { cmd: '-> int:', desc: 'Return type hint' },
        { cmd: 'return a, b', desc: 'Return tuple' },
        { cmd: 'yield x', desc: 'Generator function' },
      ],
    },
    {
      title: 'Error Handling',
      items: [
        { cmd: 'try: ... except Exception as e:', desc: 'Catch exception' },
        { cmd: 'finally:', desc: 'Always executes' },
        { cmd: 'raise ValueError("msg")', desc: 'Raise exception' },
        { cmd: 'assert x > 0, "msg"', desc: 'Assert condition' },
        { cmd: 'with open("f") as f:', desc: 'Context manager' },
      ],
    },
    {
      title: 'File I/O',
      items: [
        { cmd: 'open("f.txt", "r")', desc: 'Read mode' },
        { cmd: 'open("f.txt", "w")', desc: 'Write (overwrite)' },
        { cmd: 'open("f.txt", "a")', desc: 'Append mode' },
        { cmd: 'f.read()', desc: 'Read entire file' },
        { cmd: 'f.readlines()', desc: 'Read lines as list' },
        { cmd: 'f.write("text")', desc: 'Write string' },
        { cmd: 'json.load(f)', desc: 'Parse JSON file' },
        { cmd: 'json.dumps(obj)', desc: 'Object to JSON string' },
      ],
    },
    {
      title: 'OOP (Classes)',
      items: [
        { cmd: 'class Dog:', desc: 'Define class' },
        { cmd: 'def __init__(self):', desc: 'Constructor' },
        { cmd: 'self.name = name', desc: 'Instance variable' },
        { cmd: '@property', desc: 'Getter property' },
        { cmd: '@staticmethod', desc: 'No self/cls access' },
        { cmd: '@classmethod', desc: 'Access via cls' },
        { cmd: 'class B(A):', desc: 'Inheritance' },
        { cmd: 'super().__init__()', desc: 'Call parent constructor' },
        { cmd: '@dataclass', desc: 'Auto __init__, __repr__' },
      ],
    },
    {
      title: 'Useful Built-ins',
      items: [
        { cmd: 'map(fn, iterable)', desc: 'Apply fn to each' },
        { cmd: 'filter(fn, iterable)', desc: 'Keep if fn returns True' },
        { cmd: 'zip(a, b)', desc: 'Pair elements' },
        { cmd: 'any([True, False])', desc: 'True if any True' },
        { cmd: 'all([True, True])', desc: 'True if all True' },
        { cmd: 'sum(lst)', desc: 'Sum of numbers' },
        { cmd: 'max(lst) / min(lst)', desc: 'Max / min value' },
        { cmd: 'abs(-5)', desc: 'Absolute value' },
        { cmd: 'round(3.14, 1)', desc: 'Round to 1 decimal' },
      ],
    },
    {
      title: 'Virtual Environments',
      items: [
        { cmd: 'python -m venv venv', desc: 'Create venv' },
        { cmd: 'source venv/bin/activate', desc: 'Activate (Linux/Mac)' },
        { cmd: 'venv\\Scripts\\activate', desc: 'Activate (Windows)' },
        { cmd: 'deactivate', desc: 'Deactivate venv' },
        { cmd: 'pip install pkg', desc: 'Install package' },
        { cmd: 'pip freeze > req.txt', desc: 'Save dependencies' },
        { cmd: 'pip install -r req.txt', desc: 'Install from file' },
      ],
    },
    {
      title: 'Common Imports',
      items: [
        { cmd: 'import os, sys, json', desc: 'Standard library' },
        { cmd: 'from pathlib import Path', desc: 'Modern file paths' },
        { cmd: 'from datetime import datetime', desc: 'Date/time' },
        { cmd: 'from collections import Counter, defaultdict', desc: 'Special containers' },
        { cmd: 'from typing import List, Dict, Optional', desc: 'Type hints' },
        { cmd: 'import re', desc: 'Regular expressions' },
        { cmd: 'from functools import lru_cache', desc: 'Memoization' },
      ],
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Python Cheat Sheet 2026 — Quick Reference for Developers',
      description: 'Complete Python cheat sheet: data types, strings, lists, dicts, functions, classes, file I/O, error handling, comprehensions, decorators, and virtual environments.',
      url: '/cheatsheets/python',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Cheat Sheets', url: '/cheatsheets' },
        { name: 'Python', url: '/cheatsheets/python' },
      ],
    });
  }
}
