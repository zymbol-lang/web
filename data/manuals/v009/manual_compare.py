#!/usr/bin/env python3
"""
manual_compare.py
Produce side-by-side structural comparison between manual_en.md (reference) and one or more translated manuals.
Outputs header positions (#, ##, ###), horizontal rules (---) and code blocks (```zymbol ... ```)
and reports per-item status (OK / MISMATCH / MISSING).

Usage: ./manual_compare.py [target.md ...]
If no targets provided, compares all manual_*.md except manual_en.md and manual_es.md

Produces human-readable side-by-side reports and an optional --csv output.
"""

import sys
import re
from pathlib import Path
from typing import List, Tuple, Dict

REF = Path(__file__).parent / "manual_en.md"

Header = Tuple[int, str]  # (line, text)
CodeBlock = Tuple[int,int] # (start_line, end_line)


def find_header_positions(lines: List[str], pattern: str) -> List[int]:
    prog = re.compile(pattern)
    return [i+1 for i,l in enumerate(lines) if prog.match(l)]


def find_hr_positions(lines: List[str]) -> List[int]:
    return [i+1 for i,l in enumerate(lines) if l.strip() == '---']


def find_code_blocks(lines: List[str], fence: str='```zymbol') -> List[CodeBlock]:
    blocks = []
    i = 0
    n = len(lines)
    while i < n:
        if lines[i].strip().startswith(fence):
            start = i+1
            j = i+1
            while j < n and not lines[j].strip().startswith('```'):
                j += 1
            # if closing fence found
            if j < n and lines[j].strip() == '```':
                end = j+1
                blocks.append((start, end))
                i = j+1
                continue
            else:
                # unterminated block -> treat until EOF
                blocks.append((start, n))
                break
        i += 1
    return blocks


def code_block_inner_len(block: CodeBlock) -> int:
    start, end = block
    return max(0, end - start - 1)


def load(path: Path) -> List[str]:
    with path.open('r', encoding='utf-8') as f:
        return f.readlines()


def compare_positions(ref_list: List[int], tgt_list: List[int], name: str, show_n:int=5):
    rcount = len(ref_list)
    tcount = len(tgt_list)
    ok = (rcount == tcount)
    print(f"{name}: ref_count={rcount} tgt_count={tcount} -> {'OK' if ok else 'DIFF'}")
    print(f"  ref positions (first {show_n}): {','.join(map(str, ref_list[:show_n])) if ref_list else ''}")
    print(f"  tgt positions (first {show_n}): {','.join(map(str, tgt_list[:show_n])) if tgt_list else ''}")
    print()
    return ok


def compare_code_blocks(ref_blocks: List[CodeBlock], tgt_blocks: List[CodeBlock]):
    # Compare by index order (1..n)
    print("Code blocks (by index):\n  index | ref_start-ref_end(len)  | tgt_start-tgt_end(len)  | status")
    maxn = max(len(ref_blocks), len(tgt_blocks))
    for i in range(maxn):
        r = ref_blocks[i] if i < len(ref_blocks) else None
        t = tgt_blocks[i] if i < len(tgt_blocks) else None
        if r:
            rl = code_block_inner_len(r)
            rstr = f"{r[0]}-{r[1]}({rl})"
        else:
            rstr = "-"
        if t:
            tl = code_block_inner_len(t)
            tstr = f"{t[0]}-{t[1]}({tl})"
        else:
            tstr = "-"
        status = "OK"
        if r is None:
            status = "MISSING_IN_REF"
        elif t is None:
            status = "MISSING_IN_TGT"
        else:
            status = "OK" if rl == tl else "MISMATCH"
        print(f"  {i+1:>3}   | {rstr:22} | {tstr:22} | {status}")
    print()


def compare_files(ref_path: Path, tgt_path: Path):
    print("= "*20)
    print(f"Comparing REF: {ref_path.name}  VS  TGT: {tgt_path.name}")
    print("= "*20)
    ref_lines = load(ref_path)
    tgt_lines = load(tgt_path)

    # headers and HR
    ref_h1 = find_header_positions(ref_lines, r'^# ')
    ref_h2 = find_header_positions(ref_lines, r'^## ')
    ref_h3 = find_header_positions(ref_lines, r'^### ')
    ref_hr = find_hr_positions(ref_lines)

    tgt_h1 = find_header_positions(tgt_lines, r'^# ')
    tgt_h2 = find_header_positions(tgt_lines, r'^## ')
    tgt_h3 = find_header_positions(tgt_lines, r'^### ')
    tgt_hr = find_hr_positions(tgt_lines)

    # quick counts
    print(f"Reference total lines: {len(ref_lines)}")
    print(f"Target    total lines: {len(tgt_lines)}")
    print()

    compare_positions(ref_h1, tgt_h1, name="# H1")
    compare_positions(ref_h2, tgt_h2, name="## H2")
    compare_positions(ref_h3, tgt_h3, name="### H3")
    compare_positions(ref_hr, tgt_hr, name="HR ---")

    # code blocks
    ref_blocks = find_code_blocks(ref_lines, '```zymbol')
    tgt_blocks = find_code_blocks(tgt_lines, '```zymbol')
    print(f"Reference code blocks (count): {len(ref_blocks)}  total inner lines: {sum(code_block_inner_len(b) for b in ref_blocks)}")
    print(f"Target    code blocks (count): {len(tgt_blocks)}  total inner lines: {sum(code_block_inner_len(b) for b in tgt_blocks)}")
    print()
    compare_code_blocks(ref_blocks, tgt_blocks)

    # Detailed notes: list which header lines are shifted significantly (>5 lines)
    def significant_shifts(rlist, tlist, name):
        pairs = []
        for i,(rpos, tpos) in enumerate(zip(rlist, tlist)):
            if abs(rpos - tpos) > 5:
                pairs.append((i+1, rpos, tpos, tpos - rpos))
        if pairs:
            print(f"Significant shifts in {name} (index, ref_line, tgt_line, delta):")
            for p in pairs[:20]:
                print(" ", p)
            print()

    if len(ref_h2) and len(tgt_h2):
        significant_shifts(ref_h2, tgt_h2, "H2")
    if len(ref_h3) and len(tgt_h3):
        significant_shifts(ref_h3, tgt_h3, "H3")


if __name__ == '__main__':
    args = sys.argv[1:]
    if not REF.exists():
        print("Reference manual_en.md not found in same folder as script.")
        sys.exit(1)
    targets = []
    if args:
        for a in args:
            targets.append(Path(a))
    else:
        # collect manual_*.md excluding en and es
        for p in Path(__file__).parent.glob('manual_*.md'):
            if p.name in ('manual_en.md', 'manual_es.md'):
                continue
            targets.append(p)
    if not targets:
        print("No target manuals found.")
        sys.exit(1)

    for t in targets:
        if not t.exists():
            print(f"Skipping missing target: {t}")
            continue
        compare_files(REF, t)

