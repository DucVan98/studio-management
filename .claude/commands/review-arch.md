---
description: Soát vi phạm Clean Architecture & convention trên thay đổi hiện tại
---

Soát các thay đổi chưa commit (chạy `git diff` và `git status` để lấy danh sách file đổi). Dùng subagent `architecture-guard` nếu cần soát sâu nhiều file.

Kiểm tra và báo cáo vi phạm theo nhóm:

1. **Luật phụ thuộc**: file trong `src/domain/**` có import từ `data`, `http`, `queries`, `stores`, `screens`, hay lib hạ tầng không? (cấm). Usecase có phụ thuộc impl `Http*Repository` thay vì interface không?
2. **Xử lý lỗi**: có để lộ lỗi HTTP thô ra ngoài tầng data không? Đã map sang `AppError` với đúng `kind` chưa?
3. **Query layer**: query key có lấy từ `keys.ts` không (cấm hardcode)? Mutation có `invalidates` hợp lý không?
4. **Styling**: có dùng `StyleSheet`/inline style thay vì `className` + token không? Có hardcode màu hex thay vì token không?
5. **i18n**: text hiển thị có hardcode chuỗi không? Có mặt ở cả `en.ts` và `vi.ts` không?
6. **TS**: có `any` không? Thiếu `import type` cho type-only import?
7. **DI**: dependency mới đã đăng ký trong `DIContainer.ts` + có getter chưa?

Với mỗi vấn đề: nêu file:dòng, mức độ (chặn/nên sửa/nhỏ), và cách sửa gợi ý. Cuối cùng chạy `pnpm typecheck` và `pnpm lint:check`, báo kết quả. KHÔNG tự sửa trừ khi tôi yêu cầu.
