#!/usr/bin/env python3
"""Gate D: words the translator left in English.

    gate_d.py manual_XX.md

Gates A, B and C cannot see this. A is structure, B compiles code, C runs it — a
paragraph that still says "the bare `(a: 1)`" or a comment that still reads
`#(key: value)` passes all three and is still half-translated.

Measured on the first machine-translated manual (Italian, Haiku): two residues, both
in the changelog, both invisible to the other three gates.

This gate REPORTS, it does not fail the build on its own. Some target languages
legitimately share words with English (Dutch `van`, Afrikaans `is`, Tok Pisin), and
technical terms are sometimes borrowed on purpose. A human reads the list and decides.
The exit code is 1 only so a runner can notice there is something to read.
"""
import re
import sys

# Function words that almost never survive a real translation. Deliberately short:
# a long list produces noise, and noise is how a gate stops being read.
ENGLISH = {
    'the', 'and', 'with', 'from', 'that', 'which', 'when', 'there', 'these', 'this',
    'value', 'values', 'key', 'keys', 'block', 'blocks', 'mark', 'marks', 'name',
    'bare', 'empty', 'input', 'output', 'loop', 'array', 'string', 'error', 'file',
    'first', 'last', 'each', 'every', 'without', 'inside', 'instead', 'before',
}

# Never flagged: real API names, Zymbol keywords in prose, licence and URL boilerplate.
ALLOW = re.compile(
    r'std/\w+|zymbol|github|SPDX|creativecommons|LICENSE|\.zyp|GUIDE|Disclaimer'
    r'|zyp\.toml|main\.zy|CC BY-SA|AGPL|warning:|help:|error:|note:'
    r'|sqrt|exp|ln|log|pow|abs|ceil|floor|round|min|max|sin|cos|tan'
    r'|read|write|append|exists|delete|list|mkdir|decode|encode|connect|query'
    r'|now|today|parts|format|add|diff|width|pad_left|pad_right|center|truncate'
    r'|Zymbol-Lang|FizzBuzz|Fizz|Buzz|Unicode|ASCII|ODBC|IEEE|TUI|ANSI|UTF'
)


def suspicious_lines(path):
    out = []
    for n, line in enumerate(open(path, encoding='utf-8'), 1):
        if ALLOW.search(line):
            continue
        # strip inline code and fenced markers: an operator is not a word
        prose = re.sub(r'`[^`]*`', ' ', line)
        prose = re.sub(r'^\s*```.*', '', prose)
        words = {w.lower() for w in re.findall(r"[A-Za-z][a-z]+", prose)}
        hits = sorted(words & ENGLISH)
        if hits:
            out.append((n, hits, line.rstrip()))
    return out


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    path = sys.argv[1]
    rows = suspicious_lines(path)
    for n, hits, line in rows:
        print(f"  L{n:<5} {','.join(hits):<28} {line.strip()[:78]}")
    print(f"\n{path}: {len(rows)} line(s) to read — a human decides, this gate does not fail alone")
    sys.exit(1 if rows else 0)
