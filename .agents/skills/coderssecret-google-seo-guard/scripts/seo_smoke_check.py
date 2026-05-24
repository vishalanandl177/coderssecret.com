#!/usr/bin/env python3
"""
CodersSecret SEO smoke checker.

Scans built/static HTML files for common SEO regressions:
- missing title / meta description
- missing or invalid canonical
- accidental noindex on public pages
- H1 count issues
- invalid JSON-LD
- non-crawlable or empty links
- image alt problems
- missing html lang / viewport
- robots.txt blocking everything
- sitemap.xml missing basic structure

This is a smoke check, not a full SEO audit. It does not replace:
- Google Search Console
- Rich Results Test
- URL Inspection
- Lighthouse/PageSpeed
- human content review
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse


@dataclass
class Tag:
    name: str
    attrs: Dict[str, str]
    text: str = ""


@dataclass
class PageData:
    path: Path
    title: str = ""
    meta_description: str = ""
    canonical: List[str] = field(default_factory=list)
    robots: List[str] = field(default_factory=list)
    h1_texts: List[str] = field(default_factory=list)
    h_tags: List[Tuple[str, str]] = field(default_factory=list)
    json_ld: List[str] = field(default_factory=list)
    anchors: List[Dict[str, str]] = field(default_factory=list)
    images: List[Dict[str, str]] = field(default_factory=list)
    html_lang: str = ""
    viewport: str = ""
    og: Dict[str, str] = field(default_factory=dict)
    twitter: Dict[str, str] = field(default_factory=dict)


class SEOHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.data = PageData(path=Path(""))
        self._capture: Optional[str] = None
        self._buffer: List[str] = []
        self._script_type: Optional[str] = None
        self._current_anchor: Optional[Dict[str, str]] = None
        self._current_heading: Optional[str] = None

    @staticmethod
    def attrs_to_dict(attrs: List[Tuple[str, Optional[str]]]) -> Dict[str, str]:
        return {k.lower(): (v or "") for k, v in attrs}

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        tag = tag.lower()
        a = self.attrs_to_dict(attrs)

        if tag == "html":
            self.data.html_lang = a.get("lang", "")

        if tag == "title":
            self._capture = "title"
            self._buffer = []

        if tag == "meta":
            name = a.get("name", "").lower()
            prop = a.get("property", "").lower()
            content = a.get("content", "")
            if name == "description":
                self.data.meta_description = content.strip()
            elif name == "robots":
                self.data.robots.append(content.strip().lower())
            elif name == "viewport":
                self.data.viewport = content.strip()
            elif name.startswith("twitter:"):
                self.data.twitter[name] = content.strip()
            if prop.startswith("og:"):
                self.data.og[prop] = content.strip()

        if tag == "link":
            rel = a.get("rel", "").lower()
            if "canonical" in rel.split():
                href = a.get("href", "").strip()
                if href:
                    self.data.canonical.append(href)

        if tag == "script":
            self._script_type = a.get("type", "").lower()
            if self._script_type == "application/ld+json":
                self._capture = "jsonld"
                self._buffer = []

        if tag == "a":
            self._current_anchor = dict(a)
            self._current_anchor["_text"] = ""

        if tag == "img":
            self.data.images.append(dict(a))

        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self._current_heading = tag
            self._capture = "heading"
            self._buffer = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()

        if self._capture == "title" and tag == "title":
            self.data.title = " ".join("".join(self._buffer).split())
            self._capture = None
            self._buffer = []

        if self._capture == "jsonld" and tag == "script":
            self.data.json_ld.append("".join(self._buffer).strip())
            self._capture = None
            self._buffer = []
            self._script_type = None

        if self._capture == "heading" and self._current_heading and tag == self._current_heading:
            text = " ".join("".join(self._buffer).split())
            self.data.h_tags.append((self._current_heading, text))
            if self._current_heading == "h1":
                self.data.h1_texts.append(text)
            self._capture = None
            self._buffer = []
            self._current_heading = None

        if tag == "a" and self._current_anchor is not None:
            self._current_anchor["_text"] = " ".join(self._current_anchor.get("_text", "").split())
            self.data.anchors.append(self._current_anchor)
            self._current_anchor = None

    def handle_data(self, data: str) -> None:
        if self._capture:
            self._buffer.append(data)
        if self._current_anchor is not None:
            self._current_anchor["_text"] = self._current_anchor.get("_text", "") + data


@dataclass
class Finding:
    severity: str  # ERROR or WARN
    path: str
    message: str


def parse_html(path: Path) -> PageData:
    parser = SEOHTMLParser()
    parser.data.path = path
    try:
        parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
    except Exception as exc:
        data = PageData(path=path)
        data.title = f"__PARSE_ERROR__ {exc}"
        return data
    parser.close()
    parser.data.path = path
    return parser.data


def is_probably_public_html(path: Path) -> bool:
    lower = str(path).lower()
    if any(part in lower for part in ["/admin/", "/preview/", "/draft", "/_next/", "/assets/", "/static/"]):
        return False
    return path.suffix.lower() == ".html"


def rel_path(path: Path, root: Path) -> str:
    try:
        return "/" + str(path.relative_to(root)).replace(os.sep, "/")
    except ValueError:
        return str(path)


def has_noindex(robots_values: List[str]) -> bool:
    return any("noindex" in value for value in robots_values)


def check_page(data: PageData, root: Path, site: str) -> List[Finding]:
    findings: List[Finding] = []
    p = rel_path(data.path, root)

    def error(msg: str) -> None:
        findings.append(Finding("ERROR", p, msg))

    def warn(msg: str) -> None:
        findings.append(Finding("WARN", p, msg))

    if data.title.startswith("__PARSE_ERROR__"):
        error(data.title)
        return findings

    if not data.html_lang:
        warn("Missing <html lang> attribute.")

    if not data.viewport:
        warn("Missing meta viewport.")

    if not data.title:
        error("Missing <title>.")
    elif len(data.title) < 8:
        warn(f"Title looks too short: {data.title!r}.")
    elif len(data.title) > 70:
        warn(f"Title may be too long ({len(data.title)} chars). Google has no fixed limit, but check readability.")

    if not data.meta_description:
        error("Missing meta description.")
    elif len(data.meta_description) < 40:
        warn("Meta description looks too short.")
    elif len(data.meta_description) > 180:
        warn("Meta description may be too long. Google may truncate snippets; check readability.")

    if len(data.canonical) == 0:
        error("Missing canonical link.")
    elif len(data.canonical) > 1:
        error(f"Multiple canonical links found: {data.canonical}")
    else:
        canonical = data.canonical[0]
        parsed = urlparse(canonical)
        if not parsed.scheme or not parsed.netloc:
            error(f"Canonical must be absolute: {canonical}")
        elif site and not canonical.startswith(site):
            warn(f"Canonical does not start with expected site {site}: {canonical}")
        if parsed.scheme != "https":
            error(f"Canonical should use HTTPS: {canonical}")

    if has_noindex(data.robots):
        warn("Page has noindex. Confirm this route is intentionally not indexable.")

    if len(data.h1_texts) == 0:
        error("Missing H1.")
    elif len(data.h1_texts) > 1:
        error(f"Multiple H1 elements found: {data.h1_texts}")
    elif not data.h1_texts[0].strip():
        error("Empty H1.")

    # Heading order warnings
    previous_level = 0
    for tag, text in data.h_tags:
        level = int(tag[1])
        if previous_level and level > previous_level + 1:
            warn(f"Heading level jumps from H{previous_level} to H{level}: {text!r}")
        previous_level = level

    # JSON-LD parsing
    for idx, raw in enumerate(data.json_ld, start=1):
        if not raw:
            warn(f"Empty JSON-LD block #{idx}.")
            continue
        try:
            json.loads(raw)
        except json.JSONDecodeError as exc:
            error(f"Invalid JSON-LD block #{idx}: {exc}")

    # Links
    for a in data.anchors:
        href = a.get("href", "").strip()
        text = a.get("_text", "").strip()
        role = a.get("role", "").lower()
        aria_label = a.get("aria-label", "").strip()
        if not href and role != "button":
            error(f"Anchor without href. Text={text!r}")
        if href.lower().startswith("javascript:"):
            error(f"JavaScript href is not crawlable: {text!r}")
        if href == "#":
            warn(f"Placeholder link href '#': {text!r}")
        if not text and not aria_label and not a.get("title", "").strip():
            warn(f"Link has no visible text or accessible label. href={href!r}")
        target = a.get("target", "").lower()
        rel = a.get("rel", "").lower()
        if target == "_blank" and "noopener" not in rel:
            warn(f"target=_blank link missing rel=noopener. href={href!r}")

    # Images
    for img in data.images:
        alt_present = "alt" in img
        role = img.get("role", "").lower()
        aria_hidden = img.get("aria-hidden", "").lower()
        src = img.get("src", "") or img.get("data-src", "")
        if not alt_present and role not in {"presentation", "none"} and aria_hidden != "true":
            warn(f"Image missing alt attribute. src={src!r}")
        if not img.get("width") and not img.get("height") and not img.get("style"):
            warn(f"Image may lack dimensions/aspect ratio, check CLS. src={src!r}")

    # Social metadata warnings, not hard blockers
    if "og:title" not in data.og:
        warn("Missing og:title.")
    if "og:description" not in data.og:
        warn("Missing og:description.")
    if "og:url" not in data.og:
        warn("Missing og:url.")
    if "og:type" not in data.og:
        warn("Missing og:type.")

    return findings


def check_robots(root: Path) -> List[Finding]:
    findings: List[Finding] = []
    robots = root / "robots.txt"
    if not robots.exists():
        findings.append(Finding("WARN", "/robots.txt", "robots.txt not found in scanned output."))
        return findings

    text = robots.read_text(encoding="utf-8", errors="ignore")
    normalized = "\n".join(line.strip() for line in text.splitlines() if line.strip() and not line.strip().startswith("#"))
    if re.search(r"(?im)^user-agent:\s*\*\s*\n\s*disallow:\s*/\s*$", normalized):
        findings.append(Finding("ERROR", "/robots.txt", "robots.txt appears to disallow the entire site."))
    if "sitemap:" not in text.lower():
        findings.append(Finding("WARN", "/robots.txt", "robots.txt does not reference a sitemap."))
    return findings


def check_sitemap(root: Path, site: str) -> List[Finding]:
    findings: List[Finding] = []
    sitemap = root / "sitemap.xml"
    if not sitemap.exists():
        findings.append(Finding("WARN", "/sitemap.xml", "sitemap.xml not found in scanned output."))
        return findings

    text = sitemap.read_text(encoding="utf-8", errors="ignore")
    if "<urlset" not in text and "<sitemapindex" not in text:
        findings.append(Finding("ERROR", "/sitemap.xml", "sitemap.xml does not look like a urlset or sitemapindex."))
    if site and site not in text:
        findings.append(Finding("WARN", "/sitemap.xml", f"sitemap.xml does not include expected site host {site}."))
    if "localhost" in text or "127.0.0.1" in text:
        findings.append(Finding("ERROR", "/sitemap.xml", "sitemap.xml contains localhost URLs."))
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="CodersSecret SEO smoke checker")
    parser.add_argument("root", help="Static build/output directory to scan")
    parser.add_argument("--site", default="https://coderssecret.com", help="Expected site origin")
    parser.add_argument("--fail-on-warn", action="store_true", help="Exit non-zero on warnings too")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        print(f"ERROR: root does not exist: {root}", file=sys.stderr)
        return 2

    findings: List[Finding] = []
    html_files = [p for p in root.rglob("*.html") if is_probably_public_html(p)]

    if not html_files:
        print(f"WARN: no public HTML files found under {root}")

    for path in sorted(html_files):
        data = parse_html(path)
        findings.extend(check_page(data, root, args.site.rstrip("/")))

    findings.extend(check_robots(root))
    findings.extend(check_sitemap(root, args.site.rstrip("/")))

    errors = [f for f in findings if f.severity == "ERROR"]
    warns = [f for f in findings if f.severity == "WARN"]

    for f in findings:
        print(f"{f.severity}: {f.path}: {f.message}")

    print()
    print(f"Scanned HTML files: {len(html_files)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warns)}")

    if errors or (args.fail_on_warn and warns):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
