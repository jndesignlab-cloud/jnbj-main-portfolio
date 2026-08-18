#!/usr/bin/env python3
"""Generate static Studio Notes pages from a Google Sheets CSV export.

Usage:
  python generate_blog.py blog-posts.csv
  python generate_blog.py "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"

Run this script from the website root. It regenerates:
- insights.html
- insights/<slug>/index.html
- sitemap.xml

The CSV must use the same columns as blog-posts.csv.
This script uses only Python's standard library.
"""
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import quote
from datetime import datetime
import csv
import html
import io
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parent
BASE_URL = "https://madebydesignlab.com"
VERSION = "3.5.0"
REQUIRED_COLUMNS = [
    "title", "slug", "category", "excerpt", "meta_title", "meta_description",
    "published_date", "reading_time", "featured", "status", "cover_image", "body"
]

BOOT_SCRIPT = '''<script>
    (function () {
      const savedTheme = "blue";
      const validThemes = ["dark", "blue", "light"];
      document.documentElement.dataset.theme = validThemes.includes(savedTheme) ? savedTheme : "blue";
    })();
  </script>'''

THEME_DOCK = '''<div class="theme-dock" aria-label="Portfolio appearance">
    <div class="theme-switcher" role="group" aria-label="Choose website theme">
      <button type="button" data-theme-choice="dark" aria-label="Use Dark Mode" title="Dark Mode"><span class="theme-swatch theme-swatch-dark"></span><span>Dark</span></button>
      <button type="button" data-theme-choice="blue" aria-label="Use Blue Mode" title="Blue Mode"><span class="theme-swatch theme-swatch-blue"></span><span>Blue</span></button>
      <button type="button" data-theme-choice="light" aria-label="Use Light Mode" title="Light Mode"><span class="theme-swatch theme-swatch-light"></span><span>Light</span></button>
    </div>
  </div>'''


def read_source(source: str):
    if source.startswith(("http://", "https://")):
        data = urlopen(source, timeout=30).read().decode("utf-8-sig")
        return list(csv.DictReader(io.StringIO(data)))
    with open(source, encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def validate(rows):
    if not rows:
        raise SystemExit("No blog rows found.")
    missing = [column for column in REQUIRED_COLUMNS if column not in rows[0]]
    if missing:
        raise SystemExit("Missing columns: " + ", ".join(missing))

    published = []
    for row in rows:
        if row.get("status", "").strip().lower() != "published":
            continue
        slug = row.get("slug", "").strip()
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
            raise SystemExit(f"Invalid slug: {slug!r}")
        published.append({key: (value or "").strip() for key, value in row.items()})

    published.sort(key=lambda item: item["published_date"], reverse=True)
    return published


def format_date(value: str) -> str:
    parsed = datetime.strptime(value, "%Y-%m-%d")
    return parsed.strftime("%B %d, %Y").replace(" 0", " ")


def inline_markup(text: str) -> str:
    escaped = html.escape(text, quote=False)
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"\[(.+?)\]\((https?://[^)]+|[^)]+)\)", r'<a href="\2">\1</a>', escaped)
    return escaped


def markdown_to_html(markdown: str) -> str:
    lines = markdown.splitlines()
    blocks = []
    paragraph = []
    in_list = False

    def flush_paragraph():
        nonlocal paragraph
        if paragraph:
            blocks.append(f"<p>{inline_markup(' '.join(paragraph))}</p>")
            paragraph = []

    def close_list():
        nonlocal in_list
        if in_list:
            blocks.append("</ul>")
            in_list = False

    for raw in lines:
        line = raw.strip()
        if not line:
            flush_paragraph()
            close_list()
            continue
        if line.startswith("### "):
            flush_paragraph(); close_list()
            blocks.append(f"<h3>{inline_markup(line[4:])}</h3>")
        elif line.startswith("## "):
            flush_paragraph(); close_list()
            blocks.append(f"<h2>{inline_markup(line[3:])}</h2>")
        elif line.startswith("- "):
            flush_paragraph()
            if not in_list:
                blocks.append("<ul>")
                in_list = True
            blocks.append(f"<li>{inline_markup(line[2:])}</li>")
        else:
            close_list()
            paragraph.append(line)

    flush_paragraph()
    close_list()
    return "\n".join(blocks)


def root_header() -> str:
    return '''<header class="site-header signal-header unified-header">
    <a href="index.html" class="brand signal-brand"><span class="brand-mark">DL</span><span><strong>Jann Nathaniel</strong><small>DesignLab Creative Studio</small></span></a>
    <nav class="nav-links signal-nav"><a href="index.html">Home</a><a href="projects.html">Projects</a><a href="services.html">Services</a><a href="insights.html" aria-current="page">Insights</a><a href="contact.html?source=insights-navigation">Contact</a></nav>
    <a href="contact.html?source=insights-header" class="signal-header-cta">Start a Project ↗</a>
  </header>'''


def article_header() -> str:
    return '''<header class="site-header signal-header unified-header">
    <a href="../../index.html" class="brand signal-brand"><span class="brand-mark">DL</span><span><strong>Jann Nathaniel</strong><small>DesignLab Creative Studio</small></span></a>
    <nav class="nav-links signal-nav"><a href="../../index.html">Home</a><a href="../../projects.html">Projects</a><a href="../../services.html">Services</a><a href="../../insights.html" aria-current="page">Insights</a><a href="../../contact.html?source=article-navigation">Contact</a></nav>
    <a href="../../contact.html?source=article-header" class="signal-header-cta">Start a Project ↗</a>
  </header>'''


def make_listing(posts):
    cards = []
    for post in posts:
        cards.append(f'''<article class="insight-card">
        <a class="insight-card-cover" href="insights/{html.escape(post['slug'])}/"><img src="{html.escape(post['cover_image'])}" alt="Cover for {html.escape(post['title'])}" loading="lazy" decoding="async"></a>
        <div class="insight-card-content"><div class="insight-meta"><span>{html.escape(post['category'])}</span><time datetime="{post['published_date']}">{format_date(post['published_date'])}</time></div><h2><a href="insights/{html.escape(post['slug'])}/">{html.escape(post['title'])}</a></h2><p>{html.escape(post['excerpt'])}</p><a class="insight-read-link" href="insights/{html.escape(post['slug'])}/">Read article <span>↗</span></a></div>
      </article>''')

    page = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Studio Notes | DesignLab Creative Studio</title><meta name="description" content="DesignLab Studio Notes: practical articles about design systems, creative workflows, Google Apps Script tools, and digital product development."><link rel="canonical" href="{BASE_URL}/insights.html"><meta property="og:type" content="website"><meta property="og:title" content="Studio Notes | DesignLab Creative Studio"><meta property="og:description" content="Practical notes on design systems, creative workflows, web tools, and digital products."><meta property="og:url" content="{BASE_URL}/insights.html"><meta property="og:image" content="{BASE_URL}/{posts[0]['cover_image'] if posts else 'profile-photo.webp'}"><meta name="twitter:card" content="summary_large_image"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="style.css?v={VERSION}">{BOOT_SCRIPT}</head>
<body class="signal-theme unified-page">{root_header()}<main class="insights-page section-pad"><section class="insights-hero"><div><p class="signal-kicker">Studio Notes</p><h1>Notes behind the work.</h1></div><p>Short notes on design, workflows, and useful digital tools.</p></section><section class="insights-list" aria-label="Published articles">{''.join(cards)}</section></main>{THEME_DOCK}<footer class="footer unified-footer"><p>© <span id="year"></span> Jann Nathaniel Jaravata / DesignLab Creative Studio</p><p class="footer-meta">Version <span id="siteVersion"></span> · Static SEO-ready articles</p></footer><script src="theme.js?v={VERSION}"></script><script src="navigation.js?v={VERSION}"></script><script src="insights.js?v={VERSION}"></script><script src="reveal.js?v={VERSION}"></script></body></html>'''
    (ROOT / "insights.html").write_text(page, encoding="utf-8")


def make_article(post):
    canonical = f"{BASE_URL}/insights/{post['slug']}/"
    article_dir = ROOT / "insights" / post["slug"]
    article_dir.mkdir(parents=True, exist_ok=True)
    body = markdown_to_html(post["body"])
    json_ld = html.escape("", quote=False)  # placeholder to keep formatting simple below
    structured = (
        '{"@context":"https://schema.org","@type":"BlogPosting",'
        f'"headline":{json_string(post["title"])},'
        f'"description":{json_string(post["meta_description"])},'
        f'"datePublished":"{post["published_date"]}","dateModified":"{post["published_date"]}",'
        '"author":{"@type":"Person","name":"Jann Nathaniel Jaravata"},'
        '"publisher":{"@type":"Organization","name":"DesignLab Creative Studio"},'
        f'"image":"{BASE_URL}/{post["cover_image"]}","mainEntityOfPage":"{canonical}"}}'
    )
    page = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{html.escape(post['meta_title'])}</title><meta name="description" content="{html.escape(post['meta_description'], quote=True)}"><link rel="canonical" href="{canonical}"><meta property="og:type" content="article"><meta property="og:title" content="{html.escape(post['title'], quote=True)}"><meta property="og:description" content="{html.escape(post['meta_description'], quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{BASE_URL}/{post['cover_image']}"><meta property="article:published_time" content="{post['published_date']}"><meta property="article:author" content="Jann Nathaniel Jaravata"><meta name="twitter:card" content="summary_large_image"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../../style.css?v={VERSION}">{BOOT_SCRIPT}<script type="application/ld+json">{structured}</script></head>
<body class="signal-theme unified-page">{article_header()}<main class="article-page section-pad"><a class="article-back" href="../../insights.html">← Back to Studio Notes</a><article><header class="article-hero"><div class="article-meta"><span>{html.escape(post['category'])}</span><time datetime="{post['published_date']}">{format_date(post['published_date'])}</time><span>{html.escape(post['reading_time'])}</span></div><h1>{html.escape(post['title'])}</h1><p>{html.escape(post['excerpt'])}</p></header><figure class="article-cover"><img src="../../{html.escape(post['cover_image'])}" alt="Cover for {html.escape(post['title'])}" width="1200" height="630"></figure><div class="article-layout"><aside class="article-author"><span class="article-author-label">Written by</span><strong>Jann Nathaniel Jaravata</strong><p>Graphic Designer, Creative Director, and founder of DesignLab Creative Studio.</p><a href="../../contact.html?source=article-{quote(post['slug'])}">Discuss a project ↗</a></aside><div class="article-content">{body}</div></div></article><section class="article-cta"><div><p class="signal-kicker">Build something useful</p><h2>Have a campaign or digital tool in mind?</h2></div><a class="btn btn-primary" href="../../contact.html?source=article-footer&service=General%20Inquiry">Start a Conversation</a></section></main>{THEME_DOCK}<footer class="footer unified-footer"><p>© <span id="year"></span> Jann Nathaniel Jaravata / DesignLab Creative Studio</p><p class="footer-meta">Version <span id="siteVersion"></span> · Studio Notes</p></footer><script src="../../theme.js?v={VERSION}"></script><script src="../../navigation.js?v={VERSION}"></script><script src="../../insights.js?v={VERSION}"></script><script src="../../reveal.js?v={VERSION}"></script></body></html>'''
    (article_dir / "index.html").write_text(page, encoding="utf-8")


def json_string(value: str) -> str:
    import json
    return json.dumps(value, ensure_ascii=False)


def make_sitemap(posts):
    urls = [
        f"{BASE_URL}/", f"{BASE_URL}/projects.html", f"{BASE_URL}/services.html",
        f"{BASE_URL}/contact.html", f"{BASE_URL}/insights.html"
    ] + [f"{BASE_URL}/insights/{post['slug']}/" for post in posts]
    latest = max((post["published_date"] for post in posts), default=datetime.now().strftime("%Y-%m-%d"))
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in urls:
        lines.append(f"  <url><loc>{html.escape(url)}</loc><lastmod>{latest}</lastmod></url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    source = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "blog-posts.csv")
    posts = validate(read_source(source))
    insights_dir = ROOT / "insights"
    if insights_dir.exists():
        shutil.rmtree(insights_dir)
    insights_dir.mkdir()
    make_listing(posts)
    for post in posts:
        make_article(post)
    make_sitemap(posts)
    print(f"Generated {len(posts)} static article page(s).")
    print(f"Updated: {ROOT / 'insights.html'}")
    print(f"Updated: {ROOT / 'sitemap.xml'}")


if __name__ == "__main__":
    main()
