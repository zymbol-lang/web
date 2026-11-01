#!/usr/bin/env bash
# All five gates for one manual, from anywhere.
#   gates.sh XX            e.g. gates.sh bn
#   gates.sh XX --fix      run the two auto-fixers first, then report
set -u
# This script lives in the manuals directory, so that is where it resolves to. It used
# to append /../data/manuals/v009 as if it lived in web/scripts/, which made it fail
# from every directory including its own.
D="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
code="${1:?usage: gates.sh <lang-code> [--fix]}"
f="$D/manual_$code.md"
[ -f "$f" ] || { echo "no existe $f"; exit 2; }

if [ "${2:-}" = "--fix" ]; then
  python3 "$D/fix_api_names.py" "$f"
  python3 "$D/fix_claims.py"    "$f"
  python3 "$D/fix_comments.py"  "$f"
  echo
fi

printf 'A  estructura  '; ( cd "$D" && python3 manual_compare.py "manual_$code.md" 2>&1 \
  | grep -cE 'DIFF|MISMATCH|MISSING' | sed 's/^/no-OK: /' )
printf 'B  sintaxis    '; python3 "$D/gate_b.py"        "$f" 2>&1 | tail -1 | sed 's/.*md: //'
printf 'C  salidas     '; python3 "$D/verify_claims.py" "$f" 2>&1 | tail -1 | sed 's/.*md: //'
printf 'D  residuos    '; python3 "$D/gate_d.py"        "$f" 2>&1 | tail -1 | sed 's/.*md: //'
printf 'E  módulos     '; python3 "$D/gate_e.py"        "$f" 2>&1 | tail -1 | sed 's/.*md: //'
printf 'F  comentarios '; python3 "$D/gate_f.py"        "$f" 2>&1 | tail -1 | sed 's/.*md: //'
