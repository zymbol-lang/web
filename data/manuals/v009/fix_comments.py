#!/usr/bin/env python3
"""Rewrite wrong `// value` comments with what the block actually computes.

    fix_comments.py manual_XX.md [manual_en.md]

Gate F (gate_f.py) reports them; this fixes them, exactly as fix_claims.py does for the
`// ->` annotations. Which comments are claims is decided by the English manual, not by
looking at the words: see gate_f.py.

The value is written in the digit script the block itself uses -- a manual that writes
`s$[१..६]` writes `// ११`, and the run says `12`, so `१२` is what belongs there. This
mirrors what the manuals already do for every other value comment; only the `// ->`
annotations are ASCII, because those are what the program prints.

Quoting is kept: a comment reading `// "Hello"` keeps its quotes, and so does the gloss
some lines carry after two spaces.
"""
import re
import sys
from pathlib import Path

from gate_f import ASSIGN, BLOCK_BASES, DIGITS, MARK, agree, probe, run, skip

TO_SCRIPT = {b: {str(d): chr(b + d) for d in range(10)} for b in BLOCK_BASES if b != 0x0030}


def block_script(block):
    """The digit script this block writes its own literals in, or None for ASCII."""
    for base, table in TO_SCRIPT.items():
        if any(c in block for c in table.values()):
            return table
    return None


def claim_lines(block):
    """Line indices of the top-level annotated assignments, in probe() order."""
    idx = []
    for i, line in enumerate(block.split('\n')):
        if line[:1].isspace():
            continue
        m = ASSIGN.match(line)
        if not m:
            continue
        name = m.group(1).strip()
        if not name or ' ' in name.rstrip('+-') or '(' in name:
            continue
        idx.append(i)
    return idx


def oracle(ref_path):
    """{(block, nth): True} for the positions English proves are value claims."""
    src = Path(ref_path).read_text(encoding='utf-8')
    good = set()
    for i, b in enumerate(re.findall(r'```zymbol\n(.*?)\n```', src, re.S), 1):
        if skip(b):
            continue
        code, claims = probe(b)
        if not claims:
            continue
        got = [l[len(MARK):] for l in run(code).split('\n') if l.startswith(MARK)]
        if len(got) != len(claims):
            continue
        for k, (c, g) in enumerate(zip(claims, got)):
            if agree(c, g):
                good.add((i, k))
    return good


def fix(path, ref_path):
    good = oracle(ref_path)
    src = Path(path).read_text(encoding='utf-8')
    n, fixed = [0], [0]

    def one(m):
        n[0] += 1
        i, b = n[0], m.group(1)
        if skip(b):
            return m.group(0)
        code, claims = probe(b)
        if not claims:
            return m.group(0)
        got = [l[len(MARK):] for l in run(code).split('\n') if l.startswith(MARK)]
        if len(got) != len(claims):
            return m.group(0)
        lines, idx, table = b.split('\n'), claim_lines(b), block_script(b)
        for k, (claim, value) in enumerate(zip(claims, got)):
            if (i, k) not in good or agree(claim, value):
                continue
            head, _, tail = lines[idx[k]].rpartition('//')
            body = re.split(r'\s{2,}', claim.strip(), maxsplit=1)
            gloss = f"  {body[1]}" if len(body) > 1 else ''
            quote = body[0][0] if len(body[0]) > 1 and body[0][0] == body[0][-1] \
                and body[0][0] in '"\'' else ''
            v = ''.join(table.get(c, c) for c in value) if table else value
            lines[idx[k]] = f"{head}// {quote}{v}{quote}{gloss}"
            fixed[0] += 1
        return "```zymbol\n" + "\n".join(lines) + "\n```"

    out = re.sub(r'```zymbol\n(.*?)\n```', one, src, flags=re.S)
    Path(path).write_text(out, encoding='utf-8')
    print(f"{path}: {fixed[0]} comment(s) corrected from the real run")
    return 0


if __name__ == '__main__':
    if not 2 <= len(sys.argv) <= 3:
        print(__doc__)
        sys.exit(2)
    ref = sys.argv[2] if len(sys.argv) == 3 else str(Path(sys.argv[1]).parent / 'manual_en.md')
    sys.exit(fix(sys.argv[1], ref))
