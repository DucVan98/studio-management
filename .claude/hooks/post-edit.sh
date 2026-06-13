#!/usr/bin/env bash
# Hook PostToolUse: sau khi Claude sửa file .ts/.tsx → eslint --fix + typecheck.
# Đọc payload JSON từ stdin để lấy đường dẫn file vừa sửa.
input=$(cat)
file=$(printf '%s' "$input" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);process.stdout.write((j.tool_input&&j.tool_input.file_path)||'')}catch(e){process.stdout.write('')}})")

case "$file" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;   # chỉ xử lý file TS
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# Dùng binary trong node_modules để không phụ thuộc pnpm/nvm có trên PATH của hook shell.
BIN="$PWD/node_modules/.bin"
ESLINT="$BIN/eslint"
TSC="$BIN/tsc"
[ -x "$ESLINT" ] || ESLINT="npx --no-install eslint"
[ -x "$TSC" ] || TSC="npx --no-install tsc"

# 1) Lint + auto-fix riêng file vừa sửa (nhanh)
$ESLINT --fix "$file" >/dev/null 2>&1

# 2) Typecheck toàn dự án (tsc không check chính xác từng file lẻ)
out=$($TSC --noEmit 2>&1)
if [ $? -ne 0 ]; then
  {
    echo "❌ Typecheck thất bại sau khi sửa $file. Sửa các lỗi sau trước khi tiếp tục:"
    printf '%s\n' "$out" | head -40
  } >&2
  exit 2   # exit 2 → Claude Code đưa stderr trở lại cho Claude như feedback chặn
fi

exit 0
