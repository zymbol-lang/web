#!/usr/bin/env python3
"""Gate E: the example module and the call that uses it must agree.

    gate_e.py manual_XX.md

THE BLIND SPOT THIS COVERS. Gate B skips a block that declares a module (it is not a
runnable script) and skips a block that imports a sibling (the sibling does not exist
beside a temp file). Both skips are correct on their own — and between them, a manual can
declare `# calc { #> { sumar } … }` and then call `c::add(5, 3)`, and every gate stays
green while the example cannot possibly run.

Found the hard way on 2026-09-09: a script meant to restore `std/` function names rewrote
the example module's call too, breaking seven manuals at once. Every gate passed. The
lesson is not "be careful with scripts" — it is that two correct skips can add up to a
hole, and a hole is worth its own gate.

The library's own names (`width`, `format`, `sqrt`, …) are English in every language and
are not what this checks; `fix_api_names.py` handles those, and deliberately leaves local
module calls alone.
"""
import re
import sys
from pathlib import Path

STDLIB = {'sqrt', 'exp', 'ln', 'log', 'pow', 'abs', 'ceil', 'floor', 'round', 'min', 'max',
          'sin', 'cos', 'tan', 'read', 'write', 'append', 'exists', 'delete', 'list',
          'mkdir', 'decode', 'decode_map', 'encode', 'get', 'post', 'post_json', 'head',
          'connect', 'exec', 'query', 'query_one', 'tx', 'commit', 'rollback', 'now',
          'today', 'parts', 'of', 'format', 'add', 'diff', 'width', 'pad_left',
          'pad_right', 'center', 'truncate', 'entero', 'rango', 'peso_f64'}


def check(path):
    t = Path(path).read_text(encoding='utf-8')

    # what the example modules export: every name in every `#> { … }` block, and the
    # public half of a rename (`internal => public`)
    exported = set()
    for body in re.findall(r'#>\s*\{([^}]*)\}', t):
        for item in body.split(','):
            item = item.strip()
            if not item:
                continue
            exported.add(item.split('=>')[-1].strip().split('::')[-1].split('.')[-1])

    # aliases bound to a LOCAL module, i.e. `<# ./name => alias` — std/ imports are not ours
    local = set(re.findall(r'<#\s+\./\S+\s*=>\s*(\S+)', t))

    bad = []
    for alias, fn in re.findall(r'(\S+)::(\S+?)\(', t):
        alias = alias.lstrip('`')
        if alias not in local:
            continue
        if fn in exported:
            continue
        why = ("it is a std/ name, so the call was probably rewritten by mistake"
               if fn in STDLIB else "no `#>` block exports it")
        bad.append((alias, fn, why))

    for alias, fn, why in bad:
        print(f"  X  {alias}::{fn}(…) — {why}")
    ok = f"{len(local)} local alias(es), exports: {', '.join(sorted(exported)) or '(none)'}"
    print(f"\n{path}: {len(bad)} incoherent call(s) — {ok}")
    return 1 if bad else 0


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(check(sys.argv[1]))
