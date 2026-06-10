# Everly — Hướng dẫn cho Claude Code

App React Native (Expo SDK 53) cho các cặp đôi: lưu memories, milestones, couple stats, notifications, subscription. Code theo **Clean Architecture** nghiêm ngặt. Đọc kỹ file này trước khi sửa code.

## Lệnh hay dùng

```bash
pnpm start          # Expo dev server
pnpm ios / android  # Build & chạy native
pnpm typecheck      # tsc --noEmit — CHẠY sau mỗi thay đổi
pnpm lint           # eslint --fix
pnpm lint:check     # eslint không sửa (dùng trong CI)
pnpm test           # jest (jest-expo)
```

> Dùng `pnpm` (KHÔNG dùng npm/yarn). Đây là pnpm workspace.

## Tech stack

- **State server**: TanStack Query v5 (qua `src/queries/`)
- **State local**: Legend-State v3 observables (`src/stores/`, persist MMKV)
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **Styling**: NativeWind v4 — chỉ dùng `className`, KHÔNG dùng `StyleSheet`. Token thiết kế đặt trong `tailwind.config.ts` (vd `bg-accent`, `text-body-md`, `rounded-pill`).
- **i18n**: i18next + react-i18next, locale `en` và `vi` (`src/i18n/locales/`)
- **HTTP**: client tự viết trong `src/http/` (KHÔNG dùng axios/fetch trực tiếp)
- **DI**: container thủ công `src/di/DIContainer.ts`
- **Alias**: `@/*` → `./src/*`. Trong `src/` đang dùng import tương đối — giữ nhất quán với file lân cận.

## Kiến trúc — luật phụ thuộc (QUAN TRỌNG NHẤT)

Phụ thuộc chỉ đi **một chiều, vào trong**. `domain` là lõi và KHÔNG được import từ tầng ngoài.

```
presentation (screens, components, navigation, queries, stores)
      │  được phép import ▼
   domain (entities, usecases, repositories[interface], errors)  ← LÕI, không phụ thuộc ai
      ▲  hiện thực hoá ▲
   data (datasources, repositories[impl], mappers, types)
      │
   http / services (hạ tầng)
```

Luật bắt buộc:

1. `src/domain/**` **không được** import từ `data`, `http`, `queries`, `stores`, `screens`, hay bất kỳ thư viện hạ tầng nào (trừ pure utils). Entity/usecase phải thuần.
2. Usecase **chỉ phụ thuộc interface** repository (`domain/repositories/I*.ts`), không phụ thuộc impl `Http*Repository`.
3. UI **không gọi datasource/HTTP trực tiếp**. Luồng đúng: `screen → query hook → usecase → repository(interface) → datasource → HttpClient`.
4. Lỗi ném ra ngoài domain phải là `AppError` (`src/domain/errors/AppError.ts`), không để lộ lỗi HTTP thô. Mapping HTTP→AppError nằm ở tầng data/http.
5. Mọi dependency mới phải đăng ký trong `DIContainer.ts` và expose qua getter `getXxxUseCase()`.

## Convention theo từng tầng

**Use case** (`src/domain/usecases/<feature>/XxxUseCase.ts`)
- `implements UseCase<TInput, TOutput>`, đúng 1 method `execute(input)`.
- Nhận interface repository qua constructor (`private readonly repo: IXxxRepository`).
- Validate input ở đây, ném `AppError(msg, 'validation')` nếu sai.

**Repository**: interface ở `domain/repositories/IXxxRepository.ts`, impl `HttpXxxRepository` ở `data/repositories/`. Impl gọi datasource và map DTO→entity qua `data/mappers/`.

**Query hook** (`src/queries/hooks/<feature>.queries.ts`)
- Dùng helper `createQuery` / `createParamQuery` / `createMutation` từ `../factory`.
- Key lấy từ `queryKeys` (`src/queries/keys.ts`) — convention `[domain, scope?, params?]`. Mutation khai báo `invalidates`/`onSuccess` để giữ cache nhất quán.
- KHÔNG hardcode query key rời rạc; thêm vào factory `keys.ts`.

**Store** (`src/stores/xxx.store.ts`): `observable<State>(...)` export tên `xxxStore$`, kèm object `xxxActions`. UI đọc bằng `useValue(store$.field)`.

**Component** (`src/components/ui/`): function component, props có interface rõ ràng, style bằng `className` + token. Map 1-1 từ Figma khi có. Export lại qua `index.ts`.

**Screen** (`src/screens/<area>/`): bọc `SafeAreaView className="flex-1 bg-bg"`, text người dùng thấy phải qua `t('...')` (cả `en` và `vi`).

## Quy tắc chung

- Comment viết bằng **tiếng Việt** (theo style hiện có trong repo).
- TypeScript `strict` — không dùng `any`; ưu tiên `unknown` + type guard. Import type dùng `import type`.
- Mọi chuỗi hiển thị phải có ở CẢ `src/i18n/locales/en.ts` và `vi.ts`.
- Sau khi sửa code: chạy `pnpm typecheck` và `pnpm lint`. (Hook tự chạy, nhưng vẫn kiểm tra kết quả.)
- Hiện chưa có test — khi thêm logic vào usecase, viết unit test cho usecase đó (`*.test.ts`, mock repository interface).
- API contract đầy đủ ở `everly-api-spec.md` — tham chiếu file này khi thêm endpoint.

## Khi thêm một feature mới (vertical slice)

Theo thứ tự: entity → repository interface → usecase → datasource interface + impl → repository impl + mapper → đăng ký DI → query hook + key → dùng trong screen → i18n → typecheck/lint. Có thể dùng `/new-feature` để Claude làm theo đúng chuỗi này.
