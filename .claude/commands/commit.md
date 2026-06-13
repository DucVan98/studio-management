---
description: Tạo commit theo chuẩn Conventional Commits v1.0.0
argument-hint: "(tuỳ chọn) gợi ý scope hoặc nội dung"
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git commit:*)
---

Tạo (các) commit cho thay đổi hiện tại theo **Conventional Commits v1.0.0**. Gợi ý từ tôi (nếu có): $ARGUMENTS

## Ngữ cảnh

- Trạng thái: !`git status --short`
- Diff đã stage: !`git diff --cached --stat`
- Diff chưa stage: !`git diff --stat`
- 10 commit gần nhất (để bám style đang dùng): !`git log --oneline -10`

## Quy trình

1. Nếu chưa có gì stage, xem toàn bộ thay đổi và **nhóm theo mục đích** (đừng gộp những thay đổi không liên quan vào một commit). Nếu cần nhiều commit, stage từng nhóm bằng `git add <paths>` rồi commit lần lượt.
2. Trước khi commit, chạy `pnpm lint:check` và `pnpm typecheck`. Nếu lỗi → dừng, báo tôi, KHÔNG commit.
3. Soạn message theo định dạng:

   ```
   <type>(<scope>): <mô tả ngắn>

   [thân bài tuỳ chọn — giải thích "tại sao"]

   [footer tuỳ chọn]
   ```

## Luật Conventional Commits v1.0.0

- **type** bắt buộc, một trong: `feat` (tính năng mới → MINOR), `fix` (sửa bug → PATCH), `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **scope** tuỳ chọn, trong ngoặc đơn — dùng tên feature/tầng của repo: `auth`, `couple`, `memory`, `milestone`, `notification`, `subscription`, `http`, `di`, `i18n`, `ui`, `nav`...
- **mô tả**: dùng thì hiện tại, mệnh lệnh ("add", "thêm"), không viết hoa chữ đầu, không dấu chấm cuối, ≤ ~72 ký tự.
- **Breaking change**: thêm `!` trước dấu `:` (vd `feat(auth)!: ...`) HOẶC thêm footer `BREAKING CHANGE: <mô tả>`.
- **Footer**: dạng `Token: value` (vd `Refs: EVERLY-123`, `Reviewed-by: ...`). `BREAKING CHANGE` phải viết hoa.
- Có thể viết mô tả tiếng Việt cho nhất quán repo, nhưng `type`/`scope` luôn tiếng Anh.

## Trước khi chạy `git commit`

In ra message dự kiến (mỗi commit) cho tôi xem. Nếu rõ ràng thì commit luôn; nếu phân nhóm gây nhập nhằng thì hỏi tôi trước. KHÔNG tự `git push`. Không thêm dòng quảng cáo/đồng tác giả nào vào message trừ khi tôi yêu cầu.

## Ví dụ

- `feat(memory): thêm use case lưu trữ memory`
- `fix(http): map đúng 402 sang AppError pro_required`
- `refactor(di): tách đăng ký usecase couple ra hàm riêng`
- `feat(auth)!: đổi luồng refresh token` + footer `BREAKING CHANGE: ...`
