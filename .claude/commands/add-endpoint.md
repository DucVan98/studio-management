---
description: Nối một API endpoint từ everly-api-spec.md xuống tới query hook
argument-hint: <method> <path> (vd "GET /memories/stats")
---

Nối endpoint **$ARGUMENTS** xuyên các tầng. Trước hết đọc `everly-api-spec.md` tìm đúng định nghĩa endpoint (request, response, mã lỗi).

1. Thêm DTO request/response vào `src/data/types/api.types.ts` theo đúng spec.
2. Thêm method vào datasource interface `I<Feature>DataSource.ts` + impl `Http<Feature>DataSource.ts` (gọi HttpClient, không bắt lỗi ở đây).
3. Thêm mapper DTO→entity trong `src/data/mappers/` nếu cần.
4. Thêm method vào `I<Feature>Repository.ts` + impl, map các mã lỗi HTTP trong spec sang đúng `AppErrorKind`.
5. Nếu là hành động nghiệp vụ → tạo use case (xem /new-usecase) thay vì gọi repo trực tiếp từ UI.
6. Thêm query key vào `keys.ts` + hook vào `queries/hooks/<feature>.queries.ts`, set `invalidates` cho mutation.
7. `pnpm typecheck && pnpm lint`.

In ra mapping mã lỗi (HTTP status → AppErrorKind) bạn dùng để tôi review.
