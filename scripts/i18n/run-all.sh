#!/usr/bin/env bash
# 一键体检 + 修复 i18n phrases 字典
#
# 使用：
#   bash scripts/i18n/run-all.sh audit        # 只体检
#   bash scripts/i18n/run-all.sh gen          # 生成 zh/en 的 phrases 字段
#   bash scripts/i18n/run-all.sh apply        # 把 translation-pack 写进 8 国
#   bash scripts/i18n/run-all.sh all          # 上述全部
set -e

ROOT=$(cd "$(dirname "$0")/../.." && pwd)
cd "$ROOT"

cmd=${1:-audit}
case $cmd in
  audit)
    node scripts/i18n/audit.js
    ;;
  gen)
    node scripts/i18n/gen-phrases.js
    node scripts/i18n/gen-en-phrases.js
    ;;
  apply)
    node scripts/i18n/apply-translations.js
    ;;
  all)
    node scripts/i18n/audit.js
    node scripts/i18n/gen-phrases.js
    node scripts/i18n/gen-en-phrases.js
    node scripts/i18n/apply-translations.js
    node scripts/i18n/audit.js
    ;;
  *)
    echo "用法: $0 {audit|gen|apply|all}"
    exit 1
    ;;
esac