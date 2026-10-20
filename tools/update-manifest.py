#!/usr/bin/env python3
"""Build content/manifest.json from chapter folders and existing translation files."""
from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
chapters=[]
for directory in (root/'content'/'chapters').iterdir():
    if not directory.is_dir() or not (directory/'meta.json').exists():
        continue
    meta=json.loads((directory/'meta.json').read_text(encoding='utf-8'))
    files={lang:f'content/chapters/{directory.name}/{lang}.md' for lang in ('hu','en','zh') if (directory/f'{lang}.md').is_file()}
    if files:
        chapters.append({**meta,'files':files})
chapters.sort(key=lambda c:(c.get('order',999),c['id']))
out=root/'content'/'manifest.json'
out.write_text(json.dumps({'chapters':chapters},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Updated {out}: {len(chapters)} chapters')
