---
name: release
description: Tạo release mới bằng release-it (bump version, sinh CHANGELOG từ Conventional Commits, tag, push, GitHub Release). Dùng khi user muốn release, bump version, tạo tag/changelog, hoặc gõ /release.
---

# Release bằng release-it

Chạy quy trình release qua `pnpm release` (release-it, config ở `.release-it.json`). release-it sẽ: bump version trong `package.json` → sinh `CHANGELOG.md` từ Conventional Commits → commit `chore(release): vX.Y.Z` → tag `vX.Y.Z` → push → tạo GitHub Release.

## Tham số

`/release [patch|minor|major|<version>] [--dry-run]`

- Không có tham số → để conventional-changelog tự suy bump từ commit (feat → minor, fix → patch, `BREAKING CHANGE`/`!` → major).
- `--dry-run` → chạy thử, không thay đổi gì.

## Quy trình

1. Kiểm tra điều kiện trước, chạy song song:
   - `git status` — working tree phải SẠCH (config có `requireCleanWorkingDir`). Nếu bẩn → báo user commit/stash trước, gợi ý `/commit`. DỪNG.
   - `git branch --show-current` — phải là `main` (config có `requireBranch`).
   - `git fetch origin && git status -sb` — nếu local lệch remote (behind) → báo user pull trước. DỪNG.
2. Xem các commit từ tag gần nhất: `git log $(git describe --tags --abbrev=0 2>/dev/null || echo HEAD)..HEAD --oneline`. Nếu không có commit mới → báo user là không có gì để release và DỪNG (trừ khi user vẫn muốn).
3. Tóm tắt cho user: version hiện tại, bump dự kiến (dựa trên type của các commit), các thay đổi chính.
4. Chạy release **không tương tác**:
   - Tự suy bump: `pnpm release --ci`
   - Bump chỉ định: `pnpm release <patch|minor|major|version> --ci`
   - Dry run: `pnpm release --ci --dry-run`

   Lưu ý: hook `before:init` tự chạy `pnpm typecheck` và `pnpm lint:check` — nếu fail thì release dừng; sửa lỗi hoặc báo user, KHÔNG bypass bằng `--no-hooks` trừ khi user yêu cầu rõ.
5. Bước GitHub Release cần token: ưu tiên `gh` CLI đã login (release-it tự dùng `GITHUB_TOKEN`; nếu thiếu, export tạm `GITHUB_TOKEN=$(gh auth token)` cho riêng lệnh release). Nếu không có token → chạy với `--no-github.release` và báo user là đã bỏ qua bước tạo GitHub Release.
6. Sau khi xong: chạy `git log --oneline -3` và `git tag --sort=-creatordate | head -3` để xác nhận, rồi báo user version mới + link GitHub Release (nếu có).

## Luật

- KHÔNG release khi working tree bẩn, khi đang ở branch khác `main`, hoặc khi typecheck/lint fail.
- KHÔNG tự ý dùng `--no-git.requireCleanWorkingDir`, `--no-hooks` hay các flag bypass khác trừ khi user yêu cầu rõ ràng.
- Đây là thao tác **push lên remote + tạo release công khai** — nếu user chỉ nói chung chung (vd "release đi"), xác nhận lại bump version dự kiến trước khi chạy bước 4 (trừ khi user đã chỉ định version rõ ràng).