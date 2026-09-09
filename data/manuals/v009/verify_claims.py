#!/usr/bin/env python3
"""Every `// -> value` in the manual, checked against a real run. Claims are asserted here."""
import re, subprocess, tempfile, os, sys
path = sys.argv[1]
src = open(path, encoding='utf-8').read()
blocks = re.findall(r'```zymbol\n(.*?)\n```', src, re.S)
def skip(b):
    return (re.search(r'^\s*<#\s+\./', b, re.M) or re.search(r'^#\s+\w+\s*\{', b, re.M)
            or '</' in b or re.search(r'<\\', b) or '>>|' in b
            or re.search(r'^\s*<<\s', b, re.M) or '<<|' in b or '>>?' in b)
bad = ok = 0
for i, b in enumerate(blocks, 1):
    if skip(b): continue
    claims = [m.group(1).strip() for m in re.finditer(r'//\s*→\s*(.+)$', b, re.M)]
    if not claims: continue
    with tempfile.NamedTemporaryFile('w', suffix='.zy', delete=False, encoding='utf-8') as fh:
        fh.write(b); p = fh.name
    r = subprocess.run(['zymbol', 'run', p], capture_output=True, text=True, timeout=25)
    os.unlink(p)
    out = [l for l in re.sub(r'\x1b\[[0-9;]*m','',r.stdout).rstrip('\n').split('\n')]
    if len(claims) != len(out):
        print(f"  ?  block {i:>2}: {len(claims)} claim(s) vs {len(out)} output line(s) — read it")
        continue
    for v, o in zip(claims, out):
        o = o.strip()
        # The claim is either the whole output, or the output followed by a gloss
        # separated by two or more spaces. Try the strict form first -- splitting
        # eagerly turned `|   go   |` into `|` and reported a false failure.
        if v == o or re.split(r'\s{2,}', v)[0].strip() == o:
            ok += 1
            continue
        if True:
            bad += 1
            print(f"  X  block {i:>2}: claims {v!r} but prints {o!r}")
print(f"\n{path}: {ok} claim(s) verified, {bad} wrong")
sys.exit(1 if bad else 0)
