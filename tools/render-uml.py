"""Render the DOT-based UML diagrams as self-contained SVGs.
Requires Graphviz (`dot` on PATH). Run from the website project root:
    python tools/render-uml.py
"""
from pathlib import Path
import subprocess, re
ROOT = Path(__file__).resolve().parent.parent
FONTS = 'ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Microsoft YaHei", "Noto Sans CJK SC", monospace'
STYLE = f'<style type="text/css">text {{ font-family: {FONTS}; }}</style>'
for dot in sorted((ROOT/'content'/'chapters').rglob('*.dot')):
    svg = dot.with_suffix('.svg')
    subprocess.run(['dot', '-Tsvg', str(dot), '-o', str(svg)], check=True)
    source=svg.read_text(encoding='utf-8')
    source, n=re.subn(r'(<svg\b[^>]*>)', lambda m:m.group(1)+'\n'+STYLE, source, count=1, flags=re.S)
    assert n == 1, dot
    svg.write_text(source, encoding='utf-8')
print('UML SVG diagrams regenerated.')
