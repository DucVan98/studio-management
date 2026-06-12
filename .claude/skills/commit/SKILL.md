---
name: commit
description: Commit các thay đổi đang có theo chuẩn Conventional Commits v1.0.0 (https://www.conventionalcommits.org/en/v1.0.0/). Dùng khi user muốn commit code, tạo commit message, hoặc gõ /commit.
---

# Commit theo Conventional Commits v1.0.0

Commit các thay đổi trong working tree với message đúng spec https://www.conventionalcommits.org/en/v1.0.0/#specification.

## Quy trình

1. Chạy song song: `git status`, `git diff` (cả staged và unstaged), `git log --oneline -10` để nắm thay đổi và style commit gần đây.
2. Nếu chưa chạy trong session này: chạy `pnpm typecheck` và `pnpm lint:check`. Nếu fail → báo lỗi và DỪNG, không commit code hỏng (trừ khi user yêu cầu rõ là cứ commit).
3. Phân tích diff: nếu các thay đổi thuộc **nhiều mối quan tâm không liên quan nhau** (vd vừa thêm feature vừa sửa config không liên quan), đề xuất tách thành nhiều commit và stage từng nhóm bằng `git add <paths>`. Một commit = một thay đổi logic.
4. Soạn message theo format dưới, commit, rồi chạy `git status` xác nhận sạch.
5. KHÔNG push trừ khi user yêu cầu.

## Format message (BẮT BUỘC theo spec)

```
<type>(<scope>)?: <description>

[body]

[footer(s)]
```

Luật từ spec v1.0.0:

- **type**: bắt buộc, là danh từ viết thường. Dùng các type sau:
  - `feat` — thêm tính năng mới (tương ứng MINOR trong SemVer)
  - `fix` — sửa bug (tương ứng PATCH)
  - `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **scope**: tuỳ chọn, danh từ trong ngoặc tròn mô tả vùng code. Scope hay dùng trong repo này: `domain`, `data`, `http`, `di`, `nav`, `ui`, `screens`, `store`, `i18n`, `deps`, `config`. Xem `git log` để nhất quán.
- **description**: bắt buộc, ngay sau `: ` (hai chấm + space), viết **tiếng Việt** (theo style repo), ngắn gọn, không viết hoa chữ đầu kiểu câu, không chấm cuối. Toàn bộ dòng đầu ≤ 72 ký tự.
- **body**: tuỳ chọn, cách dòng đầu đúng 1 dòng trống, dùng khi cần giải thích *vì sao* thay đổi. Diff đã nói *cái gì* rồi — đừng liệt kê lại file.
- **BREAKING CHANGE** (tương ứng MAJOR): nếu thay đổi phá vỡ API/behavior, BẮT BUỘC đánh dấu bằng một trong hai cách (hoặc cả hai):
  - thêm `!` ngay trước `:` — vd `feat(http)!: đổi chữ ký HttpClient.request`
  - footer `BREAKING CHANGE: <mô tả>` (viết hoa, theo sau là `: `)
- **footer**: format `Token: value` hoặc `Token #value`; token dùng `-` thay space (vd `Reviewed-by`), ngoại lệ duy nhất là `BREAKING CHANGE`. Refs issue dạng `Refs: #123`.

Luôn kết thúc message bằng footer:

```
Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
```

## Ví dụ đúng

```
feat(memories): thêm usecase tạo memory kèm upload ảnh
```

```
fix(store)!: đổi key persist của settingsStore sang v2

Key cũ chứa dữ liệu sai schema từ bản SDK 53, đọc lại sẽ crash.

BREAKING CHANGE: settings đã lưu của user sẽ bị reset về mặc định.
```

## Cấm

- Commit message chung chung (`update code`, `fix bug`, `wip`).
- Gộp nhiều mối quan tâm không liên quan vào một commit.
- `git add -A` mù quáng khi có file lạ trong `git status` — chỉ stage file thuộc thay đổi đang commit, hỏi user nếu có file không rõ nguồn gốc.
- `git push`, `git commit --amend`, hay sửa lịch sử khi không được yêu cầu.