"""Visual regression for the OpenCSG deck i18n system.

Usage:
    python3 assets/i18n/qa/qa_snap.py

Renders zh / en / ja / ar variants of slide-03 and the language menu, writes
PNGs to assets/i18n/qa/out/, and prints any console / page errors encountered.
"""
from playwright.sync_api import sync_playwright
import os, sys

OUT = os.path.join(os.path.dirname(__file__), 'out')
os.makedirs(OUT, exist_ok=True)

# Adjust if your dev server uses a different port.
BASE = os.environ.get('DECK_BASE', 'http://localhost:8765/')

LANGUAGES = ['zh', 'en', 'ja', 'ko', 'ar', 'ru', 'fr', 'de', 'es', 'pt']
SLIDES = ['slide-03', 'slide-04', 'slide-05']

errors = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={'width': 1600, 'height': 900}, device_scale_factor=2)
    page = ctx.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))

    page.goto(BASE, wait_until='networkidle')
    page.wait_for_timeout(1200)

    # Default zh snapshots
    for sid in SLIDES:
        page.evaluate(
            "(id)=>{const el=document.getElementById(id);const w=el.closest('.slide-wrap')||el;w.scrollIntoView({block:'start'});window.scrollBy(0,-1);}",
            sid,
        )
        page.wait_for_timeout(400)
        page.screenshot(path=f"{OUT}/zh-{sid}.png", full_page=False)
        print(f"  ✓ zh-{sid}.png")

    # Language menu snapshots
    for code in LANGUAGES:
        page.evaluate("(code)=>{if (window.DeckI18n) window.DeckI18n.setLang(code);}", code)
        page.wait_for_timeout(700)
        page.evaluate("document.getElementById('langCurrent').click()")
        page.wait_for_timeout(250)
        page.screenshot(path=f"{OUT}/menu-{code}.png", full_page=False)
        page.evaluate("document.body.click()")
        page.wait_for_timeout(150)
        print(f"  ✓ menu-{code}.png")

    browser.close()

print()
if errors:
    print(f"❌ {len(errors)} page errors:")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)
print("✅ All snapshots taken, no errors.")