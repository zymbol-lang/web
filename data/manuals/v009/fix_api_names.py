#!/usr/bin/env python3
"""Restore `std/` function names that a translation translated.

    fix_api_names.py manual_XX.md [manual_en.md]

Measured on Chinese, Hindi, Arabic and French: every one of them translated the standard
library's function names, and always the same two blocks — `t::width` became `t::चौड़ाई`,
`t::عرض`, `t::largeur`; `T::format` became `T::प्रारूप`, `T::صياغة`, `T::formater`. Four
languages, four times the same fix by hand. This does it in one pass.

The library exports `width`, `format`, `sqrt` in English in every language, exactly like
the operators do. What surrounds them is translated; they are not.

HOW IT DECIDES. The English manual is the authority, block for block: the blocks are in the
same order in every translation (Gate A proves it), so for each `alias::name` call in a
translated block, the name is taken from the call at the same position in the English block.
Nothing is guessed from a word list, and a language that happens to name a variable like an
API function is not touched, because only the `::` call position is read.

The stdlib table rows are restored the same way — by position, from English.
"""
import re
import sys
from pathlib import Path

CALL = re.compile(r'(?<=::)([^\s(]+)(?=\()')
TABLE = re.compile(r'^\| `std/(\w+)` \| (.+?) \|$', re.M)


def blocks(text):
    return re.findall(r'```zymbol\n(.*?)\n```', text, re.S)


def local_aliases(text):
    """Aliases bound to a module defined in the manual itself, never to std/.

    These must NOT be touched. Restoring `c::sumar` to `c::add` from English broke seven
    manuals at once: the example module declares `#> { sumar }`, so `c::add` calls a
    function that does not exist — and Gate B never sees it, because it skips both the
    module block and the block that imports it. Gate E exists to catch that; this
    function is how the damage stops being caused in the first place.
    """
    return set(re.findall(r'<#\s+\./\S+\s*=>\s*(\S+)', text))


def fix(path, ref_path):
    src = Path(path).read_text(encoding='utf-8')
    ref = Path(ref_path).read_text(encoding='utf-8')
    skip_aliases = local_aliases(src)
    tgt_blocks, ref_blocks = blocks(src), blocks(ref)
    if len(tgt_blocks) != len(ref_blocks):
        print(f"{path}: block counts differ ({len(tgt_blocks)} vs {len(ref_blocks)}) — "
              f"run Gate A first, this needs them aligned")
        return 2

    fixed = [0]

    def one_block(i, b):
        rb = ref_blocks[i]
        ref_names = CALL.findall(rb)
        tgt_names = CALL.findall(b)
        if len(ref_names) != len(tgt_names):
            return b                       # shapes differ — leave it for a person
        k = 0

        def sub(m):
            nonlocal k
            want = ref_names[k]
            k += 1
            # the alias sits just before `::` — leave local modules alone
            before = b[:m.start()]
            alias = re.search(r'(\S+)::$', before)
            if alias and alias.group(1).lstrip('`') in skip_aliases:
                return m.group(1)
            if m.group(1) != want:
                fixed[0] += 1
                return want
            return m.group(1)
        return CALL.sub(sub, b)

    n = [0]

    def repl(m):
        i = n[0]
        n[0] += 1
        return "```zymbol\n" + one_block(i, m.group(1)) + "\n```"

    out = re.sub(r'```zymbol\n(.*?)\n```', repl, src, flags=re.S)

    # the stdlib table: same module, same row, English contents
    ref_rows = dict(TABLE.findall(ref))

    def row(m):
        mod, body = m.group(1), m.group(2)
        want = ref_rows.get(mod)
        if want and body != want:
            fixed[0] += 1
            return f"| `std/{mod}` | {want} |"
        return m.group(0)
    out = TABLE.sub(row, out)

    Path(path).write_text(out, encoding='utf-8')
    print(f"{path}: {fixed[0]} API name(s) restored from English")
    return 0


if __name__ == '__main__':
    if not 2 <= len(sys.argv) <= 3:
        print(__doc__)
        sys.exit(2)
    ref = sys.argv[2] if len(sys.argv) == 3 else str(Path(sys.argv[1]).parent / 'manual_en.md')
    sys.exit(fix(sys.argv[1], ref))
