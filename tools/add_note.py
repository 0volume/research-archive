#!/usr/bin/env python3
"""Add a staged note to the Research Archive.

Creates a markdown note file under /tmp/research-archive/notes/
Updates notes/index.json (append latest)
Optionally links the note from an existing research entry (by paper id).

Usage:
  python3 tools/add_note.py --paper-id 26 --stage abstract --title "AgencyBench — Abstract" --summary "..." --body "..."

Non-brittle: structure-aware JSON updates.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path('/tmp/research-archive')
ARCHIVE = ROOT / 'data' / 'research.json'
NOTES_INDEX = ROOT / 'notes' / 'index.json'
NOTES_DIR = ROOT / 'notes'


def slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')[:80] or 'note'


def load_json(p: Path) -> dict:
    return json.loads(p.read_text()) if p.exists() else {}


def save_json(p: Path, d: dict) -> None:
    p.write_text(json.dumps(d, indent=2) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--paper-id', type=int, required=True)
    ap.add_argument('--stage', required=True, choices=['abstract','methods','evaluation','integration'])
    ap.add_argument('--title', required=True)
    ap.add_argument('--summary', required=True)
    ap.add_argument('--body', required=True)
    args = ap.parse_args()

    NOTES_DIR.mkdir(parents=True, exist_ok=True)

    today = date.today().isoformat()
    fname = f"{today}-paper-{args.paper_id}-{args.stage}-{slugify(args.title)}.md"
    fpath = NOTES_DIR / fname

    md = "\n".join([
        f"# {args.title}",
        "",
        f"- Date: {today}",
        f"- Paper: #{args.paper_id}",
        f"- Stage: {args.stage}",
        "",
        "## Summary",
        args.summary.strip(),
        "",
        "## Notes",
        args.body.strip(),
        "",
    ])
    fpath.write_text(md)

    # Update notes index
    idx = load_json(NOTES_INDEX)
    idx.setdefault('version', '1.0')
    idx['lastUpdated'] = today
    idx.setdefault('notes', [])
    next_id = max([n.get('id',0) for n in idx['notes']], default=0) + 1

    note_obj = {
        'id': next_id,
        'date': today,
        'paperId': args.paper_id,
        'stage': args.stage,
        'title': args.title,
        'summary': args.summary,
        'url': f"notes/{fname}",
    }
    idx['notes'].append(note_obj)
    idx['notes'] = idx['notes'][-200:]
    save_json(NOTES_INDEX, idx)

    # Link into research entry
    arc = load_json(ARCHIVE)
    entries = arc.get('entries', [])
    for e in entries:
        if e.get('id') == args.paper_id:
            e.setdefault('notes', [])
            e['notes'].append({'stage': args.stage, 'url': note_obj['url']})
            break
    arc['lastUpdated'] = today
    save_json(ARCHIVE, arc)

    print(json.dumps({'status':'ok','note':note_obj,'file':str(fpath)}))


if __name__ == '__main__':
    main()
