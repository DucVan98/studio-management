---
description: Kiểm tra tính đồng bộ giữa en.ts và vi.ts
---

Kiểm tra `src/i18n/locales/en.ts` và `src/i18n/locales/vi.ts`:

1. Liệt kê key có ở `en` nhưng thiếu ở `vi` và ngược lại.
2. Tìm key có giá trị rỗng hoặc còn nguyên placeholder.
3. Quét nhanh `src/screens/` và `src/components/` tìm chuỗi tiếng Anh/Việt hardcode trong JSX (text người dùng thấy) chưa qua `t(...)`.

Báo cáo dạng bảng. Nếu tôi xác nhận, bổ sung các key còn thiếu (giữ cùng cấu trúc lồng nhau ở cả hai file) — vi cần bản dịch tiếng Việt phù hợp, không để trùng tiếng Anh.
