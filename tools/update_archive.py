#!/usr/bin/env python3
"""Research Archive updater (structure-aware, reliable).

- Loads /tmp/research-archive/data/research.json
- Appends entries (dedupe by URL)
- Updates lastUpdated

Designed for cron usage.
"""

from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path

ARCHIVE = Path('/tmp/research-archive/data/research.json')


def load() -> dict:
    if not ARCHIVE.exists():
        raise SystemExit(f"Missing archive: {ARCHIVE}")
    return json.loads(ARCHIVE.read_text())


def save(d: dict) -> None:
    ARCHIVE.write_text(json.dumps(d, indent=2) + "\n")


def next_id(entries: list[dict]) -> int:
    return (max((e.get('id', 0) for e in entries), default=0) + 1)


def find_by_url(entries: list[dict], url: str) -> dict | None:
    u = (url or '').strip()
    if not u:
        return None
    for e in entries:
        if (e.get('url') or '').strip() == u:
            return e
    return None


def add_entry(d: dict, entry: dict, *, allow_update: bool = False) -> tuple[str, int | None]:
    entries = d.setdefault('entries', [])
    url = (entry.get('url') or '').strip()

    existing = find_by_url(entries, url) if url else None
    if existing:
        if allow_update:
            existing.update(entry)
            return ('updated', existing.get('id'))
        return ('skipped', existing.get('id'))

    eid = next_id(entries)
    entry = dict(entry)
    entry['id'] = eid
    entries.append(entry)
    d['lastUpdated'] = date.today().isoformat()
    return ('added', eid)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', help='Entry JSON (single object)', required=True)
    ap.add_argument('--allow-update', action='store_true')
    args = ap.parse_args()

    d = load()
    entry = json.loads(args.json)

    action, eid = add_entry(d, entry, allow_update=args.allow_update)
    save(d)

    print(json.dumps({'status': action, 'id': eid, 'path': str(ARCHIVE)}))


if __name__ == '__main__':
    main()
