#!/usr/bin/env bash
# check_manual_v3.sh — validate translated manuals against the EN reference structure
# Usage: bash check_manual_v3.sh manual_fr.md [manual_de.md ...]
#        bash check_manual_v3.sh              (checks all non-en/es manuals)

DIR="$(cd "$(dirname "$0")" && pwd)"
REF="$DIR/manual_en.md"

# reference structural counts
ref_h1_lines=$(grep -n '^# ' "$REF" 2>/dev/null | cut -d: -f1 || true)
ref_h2_lines=$(grep -n '^## ' "$REF" 2>/dev/null | cut -d: -f1 || true)
ref_h3_lines=$(grep -n '^### ' "$REF" 2>/dev/null | cut -d: -f1 || true)
ref_hr_lines=$(grep -n '^---' "$REF" 2>/dev/null | cut -d: -f1 || true)
# counts for reference headers
ref_h1_count=$(echo "$ref_h1_lines" | sed '/^$/d' | wc -l)
ref_h2_count=$(echo "$ref_h2_lines" | sed '/^$/d' | wc -l)
ref_h3_count=$(echo "$ref_h3_lines" | sed '/^$/d' | wc -l)
ref_hr_count=$(echo "$ref_hr_lines" | sed '/^$/d' | wc -l)
ref_tbl=$(grep -c '^|'     "$REF")
ref_cl=$(grep -c '^- \*\*' "$REF")
ref_ver=$(grep -c '^### v' "$REF")
ref_bq=$(grep -c '^> '     "$REF")
ref_v004=$(sed -n '/^### v0\.0\.4/,/^### v0\.0\.3/p'       "$REF" | grep -c '^- \*\*')
ref_v003=$(sed -n '/^### v0\.0\.3/,/^### v0\.0\.2_01/p'    "$REF" | grep -c '^- \*\*')
ref_v002=$(sed -n '/^### v0\.0\.2 /,/^### v0\.0\.1-patch/p' "$REF" | grep -c '^- \*\*')
ref_lines=$(wc -l < "$REF")
# total lines inside ```zymbol blocks in reference
ref_code_lines=$(sed -n '/^```zymbol/,/^```/p' "$REF" | sed '1d;$d' | wc -l)

# simple language detector using common words
detect_lang() {
    local f="$1"
    local en=0 da=0
    en=$(( $(grep -oE '\b(the|and|of|to|in|is|usage|installation|disclaimer|license|example)\b' "$f" -i 2>/dev/null | wc -l) ))
    da=$(( $(grep -oE '\b(og|det|en|er|brug|introduktion|ansvarsfraskrivelse|licens|eksempel|ændring|ændringer)\b' "$f" -i 2>/dev/null | wc -l) ))
    if [ "$en" -ge "$da" ]; then echo "en"; else echo "da"; fi
}
ref_lang=$(detect_lang "$REF")

ok=0; ko=0

chk() {
    local label="$1" got="$2" want="$3" tol="${4:-0}"
    local g="${got:-0}" w="${want:-0}"
    local diff; diff=$(( g > w ? g - w : w - g ))
    tol="${tol:-0}"
    if [ "$diff" -le "$tol" ]; then
        printf "  ✓  %-42s got %-4s (exp %s)\n" "$label" "$got" "$want"
        ok=$((ok+1))
    else
        printf "  ✗  %-42s got %-4s (exp %s) ← DIFF %s\n" "$label" "$got" "$want" "$diff"
        ko=$((ko+1))
    fi
}

list_head() { printf "%s\n" "$1" | head -n "$2"; }

check_file() {
    local f="$1"
    local h1_list; h1_list=$(grep -n '^# ' "$f" 2>/dev/null | cut -d: -f1 || true)
    local h2_list; h2_list=$(grep -n '^## ' "$f" 2>/dev/null | cut -d: -f1 || true)
    local h3_list; h3_list=$(grep -n '^### ' "$f" 2>/dev/null | cut -d: -f1 || true)
    local hr_list; hr_list=$(grep -n '^---' "$f" 2>/dev/null | cut -d: -f1 || true)
    local tbl; tbl=$(grep -c '^|'    "$f")
    local cl; cl=$(grep -c '^- \*\*' "$f")
    local ver; ver=$(grep -c '^### v' "$f")
    local bq; bq=$(grep -c '^> '    "$f")
    local lines; lines=$(wc -l < "$f")
    local v004; v004=$(sed -n '/^### v0\.0\.4/,/^### v0\.0\.3/p'       "$f" | { grep -c '^- \*\*' || true; })
    local v003; v003=$(sed -n '/^### v0\.0\.3/,/^### v0\.0\.2_01/p'    "$f" | { grep -c '^- \*\*' || true; })
    local v002; v002=$(sed -n '/^### v0\.0\.2 /,/^### v0\.0\.1-patch/p' "$f" | { grep -c '^- \*\*' || true; })
    local disc_en; disc_en=$(head -10 "$f" | grep -qi "disclaimer" && echo "YES" || echo "no")
    local disc_nat; disc_nat=$(head -10 "$f" | grep -qi "aviso\|avertissement\|hinweis\|avvertenz\|advertência\|предупреж\|免责\|disclaimer\|nota\|bildirim\|uyarı\|ملاحظة\|hujjat\|সতর্কতা\|uyarı\|注意\|경고\|ข้อควรระวัง\|cảnh báo\|kumbuka\|注意事項\|ansvarsfraskrivelse\|introduktion\|eksempel" && echo "YES" || echo "no")
    local disc
    if [ "$disc_en" = "YES" ] && [ "$disc_nat" = "YES" ]; then disc="YES"; else disc="no"; fi

    # compute code block total lines inside ```zymbol
    local code_lines; code_lines=$(sed -n '/^```zymbol/,/^```/p' "$f" | sed '1d;$d' | wc -l)

    local lang; lang=$(detect_lang "$f")

    echo ""
    echo "══════════════════════════════════════════════════"
    printf "  %s (detected: %s)\n" "$(basename "$f")" "$lang"
    echo "══════════════════════════════════════════════════"

    # basic structural checks
    chk "H2 sections"                 "$(echo "$h2_list" | wc -l)"   "$ref_h2_count"   0
    chk "H3 sub-sections"             "$(echo "$h3_list" | wc -l)"   "$ref_h3_count"   0
    chk "Table rows (|)"              "$tbl"  "$ref_tbl"  2
    chk "Changelog bullets total"     "$cl"   "$ref_cl"   0
    chk "Version headers (### v)"     "$ver"  "$ref_ver"  0
    chk "Blockquotes (> )"            "$bq"   "$ref_bq"   3
    chk "Lines total"                 "$lines" "$ref_lines" 25
    chk "  v0.0.4 bullets"            "$v004" "$ref_v004" 0
    chk "  v0.0.3 bullets"            "$v003" "$ref_v003" 0
    chk "  v0.0.2 bullets"            "$v002" "$ref_v002" 0
    printf "  %-4s %-42s %s\n" "$( [ "$disc" = "YES" ] && echo "✓" || echo "✗")" "Disclaimer at start" "$disc"

    # language mismatch
    if [ "$lang" != "$ref_lang" ]; then
        echo ""
        echo "  >>> LANGUAGE MISMATCH: reference is '$ref_lang' but file is '$lang' - not the same language!"
        ko=$((ko+1))
    fi

    # compare header positions: H1/H2/H3 and horizontal rules
    echo ""
    echo "  --- Structural line-position comparison (first 5 differences shown) ---"
    compare_positions() {
        local name="$1" reflist="$2" alist="$3"
        local refcount=$(echo "$reflist" | sed '/^$/d' | wc -l)
        local acount=$(echo "$alist" | sed '/^$/d' | wc -l)
        printf "  %-20s ref:%-4s got:%-4s\n" "$name" "$refcount" "$acount"
        if [ "$refcount" -ne "$acount" ]; then
            echo "    -> COUNT DIFF"
        fi
        # show first 5 positions for each
        echo "    ref positions:"
        list_head "$reflist" 5 | sed 's/^/      /'
        echo "    got positions:"
        list_head "$alist" 5 | sed 's/^/      /'
    }

    compare_positions "H1 (# )" "$ref_h1_lines" "$h1_list"
    compare_positions "H2 (##)" "$ref_h2_lines" "$h2_list"
    compare_positions "H3 (###)" "$ref_h3_lines" "$h3_list"
    compare_positions "HR (---)" "$ref_hr_lines" "$hr_list"

    # compare code-block sizes
    echo ""
    printf '  Code examples total lines (inside ```zymbol): ref:%s  got:%s\n' "$ref_code_lines" "$code_lines"
    if [ "$ref_code_lines" -ne "$code_lines" ]; then
        echo "    -> Code examples size differs. This indicates programs/examples have different length."
        ko=$((ko+1))
    fi

    echo "  ─── PASS: $ok   FAIL: $ko ────────────────────"
}

if [ "$#" -gt 0 ]; then
    targets=("$@")
else
    targets=()
    for f in "$DIR"/manual_*.md; do
        b=$(basename "$f")
        [[ "$b" == "manual_en.md" || "$b" == "manual_es.md" ]] && continue
        targets+=("$f")
    done
fi

total_ok=0; total_ko=0
for f in "${targets[@]}"; do
    ok=0; ko=0
    check_file "$f"
    total_ok=$((total_ok + ok))
    total_ko=$((total_ko + ko))
done

echo ""
echo "══════════════════════════════════════════════════"
printf "  GRAND TOTAL   PASS: %-4s   FAIL: %s\n" "$total_ok" "$total_ko"
echo "══════════════════════════════════════════════════"
