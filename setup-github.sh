#!/bin/bash
# Script: setup-github.sh
# Chạy 1 lần để push Everly lên GitHub
# Usage: bash setup-github.sh

set -e

GITHUB_USERNAME="ducanh261101a"
REPO_NAME="Everly"
GITHUB_API="https://api.github.com"

echo "🚀 Bắt đầu setup GitHub repo cho Everly..."

# ── 1. Dọn dẹp lock files từ lần init trước ──────────────────────────────────
echo "🧹 Dọn lock files..."
rm -f .git/index.lock
rm -f .git/tnmlPpz 2>/dev/null || true

# ── 2. Config git ─────────────────────────────────────────────────────────────
git config user.name "Duc Anh"
git config user.email "thaianh19020208@gmail.com"
git branch -M main 2>/dev/null || true

# ── 3. Stage & commit ─────────────────────────────────────────────────────────
echo "📦 Staging files..."
git add .

echo "💬 Committing..."
git commit -m "feat: initial commit – Everly couple app

- Clean Architecture: domain/data/di layers
- NativeWind v4 + Figma design tokens (3 themes)
- Legend State v3 stores
- Custom HTTP client với interceptors
- Expo Router v5 với auth guard
- i18n: vi/en
- UI components từ Figma: Button, Pill, Badge, StatCard, ListRow,
  MemoryCard, MilestoneRow, NotificationItem, CapsuleItem, GiftCard, NavBar" \
  2>/dev/null || echo "⚠️  Không có gì mới để commit (đã commit rồi)"

# ── 4. Tạo GitHub repo qua API ────────────────────────────────────────────────
echo ""
echo "🐙 Tạo repo trên GitHub..."
echo "👉 Nhập GitHub Personal Access Token (cần quyền 'repo'):"
read -rs GITHUB_TOKEN
echo ""

CREATE_RESPONSE=$(curl -s -o /tmp/gh_response.json -w "%{http_code}" \
  -X POST "$GITHUB_API/user/repos" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"private\": true,
    \"description\": \"Everly – Couple App (React Native + Expo)\",
    \"auto_init\": false
  }")

if [ "$CREATE_RESPONSE" = "201" ]; then
  echo "✅ Repo tạo thành công!"
elif [ "$CREATE_RESPONSE" = "422" ]; then
  echo "⚠️  Repo đã tồn tại, tiếp tục push..."
else
  echo "❌ Lỗi tạo repo (HTTP $CREATE_RESPONSE):"
  cat /tmp/gh_response.json
  exit 1
fi

# ── 5. Set remote & push ──────────────────────────────────────────────────────
REMOTE_URL="https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"

git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"

echo "⬆️  Pushing lên GitHub..."
git push -u origin main

# Xóa token khỏi remote URL sau khi push xong (bảo mật)
git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "🎉 Done! Repo của bạn: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "🧹 Xóa script này sau khi dùng xong:"
echo "   rm setup-github.sh"
