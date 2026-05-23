#!/usr/bin/env bash
# _render_batch.sh — read a fetch-batch JSON file, render a composite PNG for
# every question that has images. Output: /tmp/<display_id>_grid.png

set -euo pipefail
JSON="$1"
HERE="$(dirname "$0")"

# Use python for robust JSON parsing and URL extraction.
python3 - "$JSON" "$HERE/_render_question.sh" <<'PY'
import json, re, subprocess, sys
data = json.load(open(sys.argv[1]))
renderer = sys.argv[2]
url_re = re.compile(r'(https?://[^\s)"\'>]+\.svg)')

for q in data.get('questions', []):
    qid = q['display_id']
    def first(s):
        if not s: return '-'
        m = url_re.search(s)
        return m.group(1) if m else '-'
    qtext = q.get('question_markdown', '') or ''
    opts = q.get('options') or []
    urls = [first(qtext)]
    for i in range(4):
        urls.append(first((opts[i].get('text') if i < len(opts) else '') or ''))
    if all(u == '-' for u in urls):
        print(f"{qid}  (no images, skipping render)")
        continue
    subprocess.run(['bash', renderer, qid, *urls], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"{qid}  q={urls[0][:30]+'...' if urls[0]!='-' else '-'}  a={urls[1][:30]+'...' if urls[1]!='-' else '-'}")
PY
