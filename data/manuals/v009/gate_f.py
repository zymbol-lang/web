#!/usr/bin/env python3
"""Gate F: the `// value` comment on an assignment is a claim too.

    gate_f.py manual_XX.md [manual_en.md]

Gate C reads `// -> value`, the annotation on a `>>` line. It does not read the other
half of the manual's claims:

    len  = s$#                  // 11
    sub  = s$[1..5]             // "Hello"
    rep  = s$~~["l":"L"]        // "HeLLo WorLd"

Nothing ran those. Measured the day this gate was written: Marathi said a 10-codepoint
string was 11 long, sliced 1..6 and claimed a word that the slice cuts short, and
replaced a matra that IS in the string while claiming the string came back unchanged.
Tamil, three of three, the same. Every one of them passed Gates A-E.

HOW IT DECIDES WHICH COMMENTS ARE CLAIMS. Not by looking at them -- `// mutable
variable` is a comment and `// 11` is a claim, and no regex tells them apart in a
language it cannot read. The English manual decides: its blocks are line-for-line the
same (Gate A proves it), so a position whose English comment matches what English
prints is a value claim, and the translation must match its own run at that same
position. A descriptive comment never matches, so it is never checked -- in any
language.

Only top-level assignments are probed: injecting a print inside a loop or a function
body would change what the block does.
"""
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ZYMBOL = os.environ.get("ZYMBOL_BIN", "zymbol")
MARK = "«F»"
ASSIGN = re.compile(r'^([^\s#/][^=<>!+\-*/%^:]*?)\s*(?:=|\+=|-=|\*=|/=|%=|\^=|:=|\+\+|--)'
                    r'.*?//\s*(?!→)(.+)$')
# The 69 digit blocks Zymbol knows, generated from
# interpreter/crates/zymbol-lexer/src/digit_blocks.rs -- embedded rather than read,
# because web/ must work with no sibling repository checked out. A partial list is
# worse than none: Burmese was missing and Gate F called all 26 Burmese comments
# wrong, every one of them for the digits it could not normalise.
BLOCK_BASES = (
    0x0030, 0x0660, 0x06F0, 0x07C0, 0x0966, 0x09E6,
    0x0A66, 0x0AE6, 0x0B66, 0x0BE6, 0x0C66, 0x0CE6,
    0x0D66, 0x0DE6, 0x0E50, 0x0ED0, 0x0F20, 0x1040,
    0x1090, 0x17E0, 0x1810, 0x1946, 0x19D0, 0x1A80,
    0x1A90, 0x1B50, 0x1BB0, 0x1C40, 0x1C50, 0xA620,
    0xA8D0, 0xA900, 0xA9D0, 0xA9F0, 0xAA50, 0xABF0,
    0xF8F0, 0xFF10, 0x104A0, 0x10D30, 0x11066, 0x110F0,
    0x11136, 0x111D0, 0x112F0, 0x11450, 0x114D0, 0x11650,
    0x116C0, 0x11730, 0x118E0, 0x11950, 0x11C50, 0x11D50,
    0x11DA0, 0x11F50, 0x16A60, 0x16AC0, 0x16B50, 0x1D7CE,
    0x1D7D8, 0x1D7E2, 0x1D7EC, 0x1D7F6, 0x1E140, 0x1E2F0,
    0x1E4F0, 0x1E950, 0x1FBF0,
)
DIGITS = {chr(b + d): str(d) for b in BLOCK_BASES for d in range(10)}


def skip(b):
    return (re.search(r'^\s*<#\s+\./', b, re.M) or re.search(r'^#\s+\S+\s*\{', b, re.M)
            or '</' in b or re.search(r'<\\', b) or '>>|' in b or '<<|' in b
            or '>>?' in b or re.search(r'^\s*<<\s', b, re.M))


def digits(v):
    return ''.join(DIGITS.get(c, c) for c in v)


def agree(claim, value):
    """Does the comment state this value? Quotes are notation, digits have 69 scripts.

    A quoted claim is compared exactly once the quotes come off, because the space a
    slice grabs by copying the English bound lives right there: `s$[1..4]` on `Olá mundo`
    returns `"Olá "`, and a comment saying `"Olá"` is wrong about it.
    """
    c = re.split(r'\s{2,}', claim.strip(), maxsplit=1)[0].strip()
    quoted = len(c) > 1 and c[0] == c[-1] and c[0] in '"\''
    c = digits(c[1:-1] if quoted else c)
    v = digits(value)
    return c == (v if quoted else v.strip())


def probe(block):
    """The block with a marked print after every top-level annotated assignment."""
    out, names = [], []
    for line in block.split('\n'):
        out.append(line)
        if line[:1].isspace():
            continue                        # not top level -- inside a loop or a body
        m = ASSIGN.match(line)
        if not m:
            continue
        name = m.group(1).strip()
        if not name or ' ' in name.rstrip('+-') or '(' in name:
            continue
        names.append(m.group(2))
        out.append(f'>> "{MARK}" {name.rstrip("+-")} ¶')
    return '\n'.join(out), names


def run(code):
    with tempfile.NamedTemporaryFile('w', suffix='.zy', delete=False, encoding='utf-8') as fh:
        fh.write(code)
        p = fh.name
    try:
        r = subprocess.run([ZYMBOL, 'run', p], capture_output=True, text=True, timeout=30)
        return re.sub(r'\x1b\[[0-9;]*m', '', r.stdout)
    finally:
        os.unlink(p)


def measure(path):
    """{(block, nth claim): (claim, printed value)} for every block that runs."""
    src = Path(path).read_text(encoding='utf-8')
    seen = {}
    for i, b in enumerate(re.findall(r'```zymbol\n(.*?)\n```', src, re.S), 1):
        if skip(b):
            continue
        code, claims = probe(b)
        if not claims:
            continue
        got = [l[len(MARK):] for l in run(code).split('\n') if l.startswith(MARK)]
        if len(got) != len(claims):
            continue                        # the block did not run to the end
        for k, (c, g) in enumerate(zip(claims, got)):
            seen[(i, k)] = (c, g)
    return seen


def main(path, ref_path):
    ref, tgt = measure(ref_path), measure(path)
    bad = ok = 0
    for key, (rc, rg) in sorted(ref.items()):
        if not agree(rc, rg):
            continue                        # English says this comment is prose
        if key not in tgt:
            continue
        c, g = tgt[key]
        if agree(c, g):
            ok += 1
        else:
            bad += 1
            print(f"  X  block {key[0]:>2}: comment says {c.strip()!r} but the value is {g!r}")
    print(f"\n{path}: {ok} comment(s) verified, {bad} wrong")
    return 1 if bad else 0


if __name__ == '__main__':
    if not 2 <= len(sys.argv) <= 3:
        print(__doc__)
        sys.exit(2)
    ref = sys.argv[2] if len(sys.argv) == 3 else str(Path(sys.argv[1]).parent / 'manual_en.md')
    sys.exit(main(sys.argv[1], ref))
