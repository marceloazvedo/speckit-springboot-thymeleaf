#!/usr/bin/env bash
# Cria a estrutura de uma nova feature SDD.
# Uso: ./.specify/scripts/create-feature.sh <nome-do-dominio>
set -euo pipefail

name="${1:?informe o nome do domínio, ex.: user}"
root="$(cd "$(dirname "$0")/../.." && pwd)"

# Descobre o próximo número (001, 002, ...)
last=$(find "$root/specs" -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' \
  | sed -E 's@.*/([0-9]{3})-.*@\1@' | sort -n | tail -1 || true)
next=$(printf '%03d' $(( 10#${last:-0} + 1 )))
dir="$root/specs/${next}-${name}"

mkdir -p "$dir"
cp "$root/.specify/templates/spec-template.md"  "$dir/spec.md"
cp "$root/.specify/templates/plan-template.md"  "$dir/plan.md"
cp "$root/.specify/templates/tasks-template.md" "$dir/tasks.md"

echo "Feature criada em: specs/${next}-${name}"
