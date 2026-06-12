---
description: Tạo một feature mới hoàn chỉnh theo Clean Architecture (vertical slice)
argument-hint: <tên feature> (vd "wishlist", "gift")
---

Tạo một feature mới tên **$ARGUMENTS** cho app Everly, đi xuyên đủ các tầng theo Clean Architecture. Đọc CLAUDE.md để nắm luật phụ thuộc trước khi bắt đầu.

Tham chiếu `everly-api-spec.md` để lấy đúng endpoint, request/response shape.

Làm theo đúng thứ tự, mỗi bước bám pattern của feature đã có gần nhất (vd `couple` hoặc `milestone`):

1. **Entity** — `src/domain/entities/<Feature>.entity.ts`, export thêm trong `entities/index.ts`. Type thuần, không phụ thuộc hạ tầng.
2. **Repository interface** — `src/domain/repositories/I<Feature>Repository.ts`. Method theo nhu cầu nghiệp vụ, trả về entity.
3. **Use case(s)** — `src/domain/usecases/<feature>/XxxUseCase.ts`, mỗi action 1 file, `implements UseCase<I,O>`, nhận interface repo qua constructor, validate input ném `AppError(..., 'validation')`.
4. **Datasource** — interface `I<Feature>DataSource.ts` + impl `Http<Feature>DataSource.ts` trong `src/data/datasources/`, gọi qua HttpClient có sẵn.
5. **Mapper** — `src/data/mappers/` map DTO (`data/types/api.types.ts`) → entity.
6. **Repository impl** — `src/data/repositories/Http<Feature>Repository.ts` implements interface domain, dùng datasource + mapper, map lỗi HTTP→AppError.
7. **Đăng ký DI** — thêm vào `src/di/DIContainer.ts`: datasource, repository, từng usecase, kèm getter `getXxxUseCase()`.
8. **Query keys** — thêm nhánh `<feature>` vào `src/queries/keys.ts` (convention `[domain, scope?, params?]`).
9. **Query hooks** — `src/queries/hooks/<feature>.queries.ts` dùng `createQuery`/`createParamQuery`/`createMutation`, khai báo `invalidates`/`onSuccess` hợp lý.
10. **i18n** — thêm chuỗi vào CẢ `src/i18n/locales/en.ts` và `vi.ts`.
11. Chạy `pnpm typecheck` và `pnpm lint`, sửa hết lỗi.

Trước khi viết code, in ra kế hoạch ngắn (các file sẽ tạo + method) rồi mới làm. Không tạo screen trừ khi tôi yêu cầu — dừng ở tầng query hook.
