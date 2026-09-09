#!/usr/bin/env python3
"""Gate B for a manual: every ```zymbol block, checked against the real binary.

    gate_b.py FILE          syntax — does every block compile?
    gate_b.py --run FILE    output — do the blocks whose comments claim a value produce it?

THE VERDICT IS THE EXIT CODE OF `zymbol check`, NEVER A STRING FOUND IN STDERR.

The gate this replaces read:

    if 'parse error' in r.stderr.lower() or 'unexpected token' in r.stderr.lower():

Measured 2026-09-07 on manual_en.md (v0.0.5) with the v0.0.9 binary: 8 blocks failed and
that gate saw 0 of them. Every refusal added since is worded differently — "a dictionary is
written `#(...)`", "indexed assignment does not exist", "chained index does not exist",
"argument 1 ... must be marked '<~'". A gate that greps for two phrases passes forever.

A block is skipped only for a NAMED reason, never for containing a character. The old skip
list dropped anything matching `::`, `<#`, `#>`, `</`, `><` or starting with `# ` — 5 of 37,
and they were the module blocks, which is where v0.0.9 added E014.
"""
import os
import re
import subprocess
import sys
import tempfile

ZYMBOL = os.environ.get("ZYMBOL_BIN", "zymbol")


def skip_reason(block):
    """Why this block cannot stand alone as a file — or None if it can."""
    if re.search(r'^\s*<#\s+\./', block, re.M):
        return "imports a sibling module"
    # \w+ does NOT match Devanagari, because combining marks (category Mn) are not
    # alphanumeric: `# कैल्क {` slipped through and was reported as a broken block.
    # Any run of non-space characters is the right test for a module name here.
    if re.search(r'^#\s+\S+\s*\{', block, re.M):
        return "is a module body, not a script"
    if '</' in block:
        return "runs another script file"
    if re.search(r'<\\', block):
        return "shells out"
    return None


def needs_a_terminal(block):
    """Blocks that compile fine but cannot RUN without a tty."""
    return '>>|' in block or '<<|' in block or '>>?' in block or re.search(r'^\s*<<\s', block, re.M)


def blocks_of(path):
    src = open(path, encoding='utf-8').read()
    return re.findall(r'```zymbol\n(.*?)\n```', src, re.S)


def run_zymbol(argv, code):
    with tempfile.NamedTemporaryFile('w', suffix='.zy', delete=False, encoding='utf-8') as fh:
        fh.write(code)
        tmp = fh.name
    try:
        return subprocess.run([ZYMBOL] + argv + [tmp], capture_output=True, text=True, timeout=30)
    finally:
        os.unlink(tmp)


def gate_syntax(path):
    bad = skipped = checked = 0
    for i, b in enumerate(blocks_of(path), 1):
        why = skip_reason(b)
        if why:
            skipped += 1
            print(f"  skip  block {i:>2}: {why}")
            continue
        checked += 1
        r = run_zymbol(['check'], b)
        if r.returncode != 0:
            bad += 1
            out = re.sub(r'\x1b\[[0-9;]*m', '', r.stdout + r.stderr)
            first = next((l for l in out.split('\n') if 'error' in l.lower()), '?')
            print(f"  FAIL  block {i:>2}: {first.strip()[:96]}")
    n = len(blocks_of(path))
    print(f"\n{path}: {n} blocks — {checked} checked, {skipped} skipped, {bad} failing")
    return 1 if bad else 0


def gate_output(path):
    """Run the blocks that claim a value in a comment and show claim beside output.

    This is the half Gate B cannot do. `f = ##.42  // 42.0 (to Float)` compiles, and the
    cast is correct — but a Float prints as `42`, so the claim had been wrong for four
    versions with every syntax gate passing. The comparison is shown, not asserted: a
    comment is prose, and only a person can say whether it matches.
    """
    shown = 0
    for i, b in enumerate(blocks_of(path), 1):
        if skip_reason(b) or needs_a_terminal(b):
            continue
        claims = [c.strip() for c in re.findall(r'//\s*(?:→\s*)?([^\n]+)', b)]
        if not claims:
            continue
        r = run_zymbol(['run'], b)
        out = re.sub(r'\x1b\[[0-9;]*m', '', r.stdout).strip()
        if not out:
            continue
        shown += 1
        print(f"--- block {i} ---")
        print("   claims :", " | ".join(claims[:4]))
        print("   output :", out.replace('\n', ' / ')[:100])
    print(f"\n{shown} block(s) with value comments and output — read them, they are not asserted")
    return 0


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if a != '--run']
    if len(args) != 1:
        print(__doc__)
        sys.exit(2)
    sys.exit(gate_output(args[0]) if '--run' in sys.argv else gate_syntax(args[0]))
