#!/usr/bin/env bash
# =============================================================================
# RosettaStone🪨 — Run all variants, validate greeting + FizzBuzz output
#
# Usage:
#   ./RosettaStone🪨/run.sh              # tree-walker (default)
#   ./RosettaStone🪨/run.sh --vm         # register VM
#   ./RosettaStone🪨/run.sh --both       # run both and compare
#
# Validation:
#   1. Greeting  — first non-empty line is non-empty ✓
#   2. FizzBuzz  — last 15 lines match per-language Fizz/Buzz pattern
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BIN="$ROOT/target/release/zymbol"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; RESET='\033[0m'

MODE="tree"
[[ "${1:-}" == "--vm"   ]] && MODE="vm"
[[ "${1:-}" == "--both" ]] && MODE="both"

if [[ ! -x "$BIN" ]]; then
    echo -e "${YELLOW}Building Zymbol-Lang (release)...${RESET}"
    cd "$ROOT" && cargo build --release -q
fi

# Format: "display|file|fizz|buzz"
declare -a LANGS=(
    "English               |english    |Fizz      |Buzz"
    "Español               |spanish    |Burbuja   |Zumbido"
    "Français              |french     |Bulle     |Bzz"
    "Português             |portuguese |Borbulha  |Zumbido"
    "Deutsch               |german     |Zisch     |Summ"
    "Italiano              |italian    |Frizza    |Ronza"
    "Nederlands            |dutch      |Sis       |Zoem"
    "Polski                |polish     |Szum      |Bzy"
    "Русский               |russian    |Шип       |Жуж"
    "Українська            |ukrainian  |Шип       |Дзиж"
    "Ελληνικά              |greek      |Αφρός     |Βόμβος"
    "中文（普通话）        |mandarin   |嘶嘶      |嗡嗡"
    "日本語                |japanese   |シュワ    |ブーン"
    "한국어                |korean     |쉬익      |붕붕"
    "हिन्दी                |hindi      |बुलबुला  |भनभन"
    "العربية               |arabic     |فقاعة     |طنين"
    "فارسی                 |persian    |حباب      |وزوز"
    "বাংলা                 |bengali    |বুদবুদ    |গুনগুন"
    "Türkçe                |turkish    |Cız       |Vız"
    "Tiếng Việt            |vietnamese |Xì        |Vù"
    "ภาษาไทย               |thai       |ซ่า       |หึ่ง"
    "Bahasa Indonesia      |indonesian |Desis     |Dengung"
    "Kiswahili             |swahili    |Povu      |Vuu"
    "עברית                 |hebrew     |בועה      |זמזום"
    "Română               |romanian   |Fiz       |Bâz"
    "Magyar               |hungarian  |Szisz     |Züm"
    "Čeština              |czech      |Šum       |Bzz"
    "Slovenčina           |slovak     |Pena      |Bzz"
    "Български            |bulgarian  |Съска     |Бръм"
    "Српски               |serbian    |Шиш       |Зуј"
    "Hrvatski             |croatian   |Šiš       |Zuj"
    "Lietuvių             |lithuanian |Šnypš     |Dūz"
    "Latviešu             |latvian    |Burb      |Dūc"
    "Eesti                |estonian   |Siss      |Summ"
    "Svenska              |swedish    |Fräs      |Surr"
    "Dansk                |danish     |Brus      |Surr"
    "Norsk                |norwegian  |Brus      |Surr"
    "Suomi                |finnish    |Suh       |Pörr"
    "Íslenska             |icelandic  |Freyð     |Surr"
    "اردو                 |urdu       |بلبلہ     |بھن"
    "Filipino             |tagalog    |Bula      |Ugong"
    "አማርኛ                |amharic    |ቡርቡር     |ዝምዝም"
    "Yorùbá               |yoruba     |Fọn       |Gún"
    "Hausa                |hausa      |Kumfa     |Vuvuu"
    "ਪੰਜਾਬੀ              |punjabi    |ਬੁਲਬੁਲਾ  |ਭਿਣਭਿਣ"
    "मराठी                |marathi    |बुडबुडा   |भुणभुण"
    "🌍 Emoji              |emoji      |🫧        |🐝"
)

run_file() {
    local file="$1" vm="$2"
    if [[ "$vm" == "1" ]]; then
        timeout 10 "$BIN" run --vm "$file" 2>&1 || true
    else
        timeout 10 "$BIN" run "$file" 2>&1 || true
    fi
}

build_expected() {
    local f="$1" b="$2"
    local fb="${f}${b}"
    printf "1\n2\n%s\n4\n%s\n%s\n7\n8\n%s\n%s\n11\n%s\n13\n14\n%s\n" \
        "$f" "$b" "$f" "$f" "$b" "$f" "$fb"
}

run_mode() {
    local vm="$1" label="$2"
    local pass=0 fail=0 total="${#LANGS[@]}"

    echo -e "\n${BOLD}${CYAN}=== Rosetta Stone 🪨 — FizzBuzz in ${total} Languages [${label}] ===${RESET}\n"

    for entry in "${LANGS[@]}"; do
        IFS='|' read -r display file fizz buzz <<< "$entry"
        display="${display%"${display##*[! ]}"}"  # trim trailing spaces
        file="${file// /}"
        fizz="${fizz// /}"
        buzz="${buzz// /}"

        local path="$SCRIPT_DIR/${file}.zy"
        local output greeting fizz_part expected

        output=$(run_file "$path" "$vm")
        greeting=$(echo "$output" | grep -m1 '.')        # first non-empty line
        fizz_part=$(echo "$output" | tail -n 15)
        expected=$(build_expected "$fizz" "$buzz")

        if [[ -n "$greeting" && "$fizz_part" == "$expected" ]]; then
            echo -e "  ${GREEN}✓${RESET} ${BOLD}${display}${RESET}  ${DIM}${greeting}${RESET}"
            ((pass++)) || true
        else
            echo -e "  ${RED}✗${RESET} ${BOLD}${display}${RESET}"
            [[ -z "$greeting" ]] && echo -e "    ${RED}no greeting${RESET}"
            [[ "$fizz_part" != "$expected" ]] && \
                echo -e "    ${DIM}expected: $(echo "$expected" | tr '\n' '|')${RESET}" && \
                echo -e "    ${DIM}got:      $(echo "$fizz_part" | tr '\n' '|')${RESET}"
            ((fail++)) || true
        fi
    done

    echo ""
    echo -e "  ${BOLD}Results: ${GREEN}${pass} passed${RESET}, ${RED}${fail} failed${RESET} / ${total} total"
}

if [[ "$MODE" == "both" ]]; then
    run_mode 0 "tree-walker"
    run_mode 1 "VM"
elif [[ "$MODE" == "vm" ]]; then
    run_mode 1 "VM"
else
    run_mode 0 "tree-walker"
fi

echo ""
