---
description: Thêm một use case mới vào một feature đã có
argument-hint: <feature>/<TênUseCase> (vd "memory/ArchiveMemory")
---

Thêm use case **$ARGUMENTS** vào domain. Bám đúng pattern các usecase hiện có (vd `src/domain/usecases/couple/UpdateStartDateUseCase.ts`).

1. Tạo `src/domain/usecases/<feature>/<Name>UseCase.ts`:
   - `implements UseCase<TInput, TOutput>` với đúng 1 method `execute`.
   - Nhận `private readonly repo: I<Feature>Repository` qua constructor.
   - Validate input ngay đầu method, ném `new AppError('...', 'validation')` nếu sai.
   - Import bằng `import type` cho interface/entity.
2. Nếu repository interface chưa có method tương ứng → thêm method vào `src/domain/repositories/I<Feature>Repository.ts` và hiện thực trong `Http<Feature>Repository.ts` (gọi datasource, map qua mapper, map lỗi → AppError).
3. Đăng ký trong `src/di/DIContainer.ts` + thêm getter `get<Name>UseCase()`.
4. Nếu cần expose cho UI → thêm hook tương ứng trong `src/queries/hooks/<feature>.queries.ts`.
5. Viết unit test `<Name>UseCase.test.ts` mock repository interface (happy path + ít nhất 1 case validation lỗi).
6. `pnpm typecheck && pnpm lint`.
