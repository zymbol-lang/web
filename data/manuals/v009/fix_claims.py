#!/usr/bin/env python3
"""Rewrite wrong `// -> value` annotations with what the block actually prints.

    fix_claims.py manual_XX.md

Gate C (verify_claims.py) reports them; this fixes them. Only touches blocks whose
claim count matches the output line count, so the pairing is unambiguous — anything
else is left for a person.

WHY THIS EXISTS. Translating a manual into a language with its own digits produces a
predictable, systematic error: the translator "translates" the numbers too, writing
`// -> १४` where the program prints `14`. It is a reasonable-looking mistake and it is
always wrong, because an annotation is OUTPUT, not prose — Zymbol writes ASCII digits
unless the program itself switched script with `#०९#`. Measured on the Hindi manual:
22 of 23 wrong claims were exactly this.

Inside the Numeral Modes section the mode IS active, so the same run produces Devanagari
and this script writes Devanagari. Taking the value from the run rather than from a rule
is what makes it right in both places without knowing which is which.
"""
import os
import re
import subprocess
import sys
import tempfile

ZYMBOL = os.environ.get("ZYMBOL_BIN", "zymbol")


def skip(b):
    return (re.search(r'^\s*<#\s+\./', b, re.M) or re.search(r'^#\s+\S+\s*\{', b, re.M)
            or '</' in b or re.search(r'<\\', b) or '>>|' in b or '<<|' in b
            or '>>?' in b or re.search(r'^\s*<<\s', b, re.M))


def run(code):
    with tempfile.NamedTemporaryFile('w', suffix='.zy', delete=False, encoding='utf-8') as fh:
        fh.write(code)
        p = fh.name
    try:
        r = subprocess.run([ZYMBOL, 'run', p], capture_output=True, text=True, timeout=30)
        return re.sub(r'\x1b\[[0-9;]*m', '', r.stdout)
    finally:
        os.unlink(p)


def fix(path):
    src = open(path, encoding='utf-8').read()
    fixed = [0]

    def one(m):
        b = m.group(1)
        if skip(b):
            return m.group(0)
        lines = b.split('\n')
        idx = [i for i, l in enumerate(lines) if re.search(r'//\s*→', l)]
        if not idx:
            return m.group(0)
        out = run(b).rstrip('\n').split('\n')
        if len(idx) != len(out):
            return m.group(0)          # ambiguous — leave it for a human
        for i, real in zip(idx, out):
            mm = re.match(r'(.*?//\s*→\s*)(.*)$', lines[i])
            claim = mm.group(2)
            # A value can itself contain two spaces -- `|   go   |` -- so try the whole
            # claim first. Splitting eagerly turned that into `|` plus a gloss and then
            # wrote `|   go   |   go   |`. Same trap Gate C fell into; same fix.
            if claim.strip() == real.strip():
                continue
            parts = re.split(r'(\s{2,})', claim, maxsplit=1)
            gloss = ''.join(parts[1:]) if len(parts) > 1 else ''
            if parts[0].strip() != real.strip():
                lines[i] = f"{mm.group(1)}{real.strip()}{gloss}"
                fixed[0] += 1
        return "```zymbol\n" + "\n".join(lines) + "\n```"

    new = re.sub(r'```zymbol\n(.*?)\n```', one, src, flags=re.S)
    open(path, 'w', encoding='utf-8').write(new)
    print(f"{path}: {fixed[0]} annotation(s) corrected from the real run")
    return 0


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(fix(sys.argv[1]))
