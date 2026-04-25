#!/usr/bin/env bash
# check_manual.sh — validate translated manuals against the EN reference structure
# Usage: bash check_manual.sh manual_fr.md [manual_de.md ...]
#        bash check_manual.sh              (checks all non-en/es manuals)

DIR="$(cd "$(dirname "$0")" && pwd)"
REF="$DIR/manual_en.md"

ref_h2=$(grep -c '^## '    "$REF")
ref_h3=$(grep -c '^### '   "$REF")
ref_tbl=$(grep -c '^|'     "$REF")
ref_cl=$(grep -c '^- \*\*' "$REF")
ref_ver=$(grep -c '^### v' "$REF")
ref_bq=$(grep -c '^> '     "$REF")
ref_v004=$(sed -n '/^### v0\.0\.4/,/^### v0\.0\.3/p'       "$REF" | grep -c '^- \*\*')
ref_v003=$(sed -n '/^### v0\.0\.3/,/^### v0\.0\.2_01/p'    "$REF" | grep -c '^- \*\*')
ref_v002=$(sed -n '/^### v0\.0\.2 /,/^### v0\.0\.1-patch/p' "$REF" | grep -c '^- \*\*')

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

check_file() {
    local f="$1"
    local h2; h2=$(grep -c '^## '    "$f")
    local h3; h3=$(grep -c '^### '   "$f")
    local tbl; tbl=$(grep -c '^|'    "$f")
    local cl; cl=$(grep -c '^- \*\*' "$f")
    local ver; ver=$(grep -c '^### v' "$f")
    local bq; bq=$(grep -c '^> '    "$f")
    local lines; lines=$(wc -l < "$f")
    local v004; v004=$(sed -n '/^### v0\.0\.4/,/^### v0\.0\.3/p'       "$f" | { grep -c '^- \*\*' || true; })
    local v003; v003=$(sed -n '/^### v0\.0\.3/,/^### v0\.0\.2_01/p'    "$f" | { grep -c '^- \*\*' || true; })
    local v002; v002=$(sed -n '/^### v0\.0\.2 /,/^### v0\.0\.1-patch/p' "$f" | { grep -c '^- \*\*' || true; })
    local disc_en; disc_en=$(head -10 "$f" | grep -qi "disclaimer" && echo "YES" || echo "no")
    local disc_nat; disc_nat=$(head -10 "$f" | grep -qi "aviso\|avertissement\|hinweis\|avvertenz\|advertência\|предупреж\|免责\|disclaimer\|nota\|bildirim\|uyarı\|ملاحظة\|hujjat\|সতর্কতা\|uyarı\|注意\|경고\|ข้อควรระวัง\|cảnh báo\|kumbuka\|注意事項" && echo "YES" || echo "no")
    local disc
    if [ "$disc_en" = "YES" ] && [ "$disc_nat" = "YES" ]; then disc="YES"; else disc="no"; fi

    echo ""
    echo "══════════════════════════════════════════════════"
    printf "  %s\n" "$(basename "$f")"
    echo "══════════════════════════════════════════════════"
    chk "H2 sections"                 "$h2"   "$ref_h2"   0
    chk "H3 sub-sections"             "$h3"   "$ref_h3"   0
    chk "Table rows (|)"              "$tbl"  "$ref_tbl"  2
    chk "Changelog bullets total"     "$cl"   "$ref_cl"   0
    chk "Version headers (### v)"     "$ver"  "$ref_ver"  0
    chk "Blockquotes (> )"            "$bq"   "$ref_bq"   3
    chk "Lines total"                 "$lines" 779        25
    chk "  v0.0.4 bullets"            "$v004" "$ref_v004" 0
    chk "  v0.0.3 bullets"            "$v003" "$ref_v003" 0
    chk "  v0.0.2 bullets"            "$v002" "$ref_v002" 0
    printf "  %-4s %-42s %s\n" "$([ "$disc" = "YES" ] && echo "✓" || echo "✗")" "Disclaimer at start" "$disc"
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
