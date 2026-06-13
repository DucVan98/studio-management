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

Khi commit: dùng skill `/commit` — message theo Conventional Commits v1.0.0, mô tả tiếng Việt.

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
6. **Thư viện bên thứ 3 phải được bọc qua adapter/service riêng** — xem mục dưới.

## Bọc thư viện bên thứ 3 (BẮT BUỘC)

Mục tiêu: khi cần đổi sang thư viện khác, chỉ sửa **một file adapter**, không phải sửa rải rác khắp codebase.

Luật:

1. **KHÔNG import trực tiếp** thư viện bên thứ 3 (storage, analytics, notifications, image picker, camera, IAP, crash reporting, date lib…) trong screen, component, usecase, store hay query hook.
2. Mỗi thư viện phải có **một module/service bọc lại** trong `src/services/` (hoặc `src/http/`, `src/stores/persistence/` tuỳ loại):
   - Định nghĩa **interface riêng của app** (vd `ISecureStorage`, `IAnalytics`) — API đặt theo nhu cầu của app, KHÔNG sao chép nguyên API của thư viện.
   - Impl gọi thư viện thật, đặt tên theo thư viện (vd `ExpoSecureTokenStorage`, `MMKVStorageAdapter`) — đây là **file duy nhất** được import thư viện đó.
   - Đăng ký qua `DIContainer.ts` (hoặc export instance từ service module); nơi dùng chỉ phụ thuộc interface.
3. Lỗi của thư viện không được lọt ra ngoài adapter ở dạng thô — map sang `AppError` hoặc kiểu lỗi của app.

Ví dụ đã có sẵn trong repo — làm theo các file này:

- `src/http/HttpClient.ts` — bọc fetch, cấm dùng axios/fetch trực tiếp.
- `src/services/SecureTokenStorage.ts` — bọc expo-secure-store.
- `src/services/mmkv.adapter.ts`, `src/stores/persistence/` — bọc MMKV.

Ngoại lệ (KHÔNG cần bọc): React/React Native core, Expo runtime cơ bản, React Navigation, NativeWind, TanStack Query, Legend-State, i18next — đây là framework/nền tảng của app, đã được quy ước cách dùng ở các mục khác. Khi phân vân, hỏi lại trước khi import trực tiếp.

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

**Icon**: TOÀN BỘ icon phải là SVG render qua `react-native-svg`, dùng component `Icon` (`src/components/ui/Icon.tsx`) với path data trong `iconPaths.tsx`. KHÔNG dùng `@expo/vector-icons` hay icon font khác. Thêm icon mới: export SVG từ Figma (viewBox 24x24, stroke-based, strokeWidth 2) hoặc copy path từ Feather, thêm vào `IconName` + `ICON_PATHS`.

**Screen** (`src/screens/<area>/`): bọc `SafeAreaView className="flex-1 bg-bg"`, text người dùng thấy phải qua `t('...')` (cả `en` và `vi`).

**Thông báo & xác nhận — KHÔNG dùng `Alert` của React Native/OS**. Dùng 2 component sau từ `src/components/ui/`:

| Tình huống | Component | Ví dụ |
|---|---|---|
| Lỗi validation, lỗi API, thông báo thành công/info | `<Alert type="error\|warning\|success\|info" title="..." message="..." />` | Lỗi đăng nhập, gửi form thành công |
| Hỏi xác nhận hành động (có thể huỷ) | `<ConfirmModal ... confirmVariant="primary\|danger" />` | Xoá dữ liệu, đăng xuất |

Luật cụ thể:
- **`Alert`** hiển thị inline trong màn hình (thêm vào JSX, dùng `useState` để ẩn/hiện). Không dùng toast overlay phức tạp — đặt ngay dưới heading hoặc gần form.
- **`ConfirmModal`** dùng khi action có hậu quả (xoá, đăng xuất, huỷ kết nối). Dùng `confirmVariant="danger"` nếu action là destructive.
- `Alert` của `react-native` bị **cấm** trong màn hình — eslint rule `no-restricted-imports` sẽ được thêm vào sau.

## Quy tắc chung

- Comment viết bằng **tiếng Việt** (theo style hiện có trong repo).
- TypeScript `strict` — không dùng `any`; ưu tiên `unknown` + type guard. Import type dùng `import type`.
- Mọi chuỗi hiển thị phải có ở CẢ `src/i18n/locales/en.ts` và `vi.ts`.
- Sau khi sửa code: chạy `pnpm typecheck` và `pnpm lint`. (Hook tự chạy, nhưng vẫn kiểm tra kết quả.)

### ESLint tự động chặn (xem `eslint.config.js`)

Một phần luật đã được máy enforce, vi phạm sẽ **fail lint** ngay:

- **Luật phụ thuộc layer** qua `import/no-restricted-paths`: `domain` không import được `data/http/queries/stores/screens/...`; `data` không import được presentation. Usecase không import được impl `Http*Repository`.
- `@typescript-eslint/no-explicit-any` = error (miễn trừ `src/stores/persistence/**`).
- `@typescript-eslint/consistent-type-imports` = error (autofix — hook tự sửa).
- `eqeqeq`; cảnh báo `max-lines-per-function`/`max-params`/`complexity` để nhắc SRP (không chặn build).

Những gì máy KHÔNG bắt được (SOLID sâu, đặt tên, trừu tượng hoá, i18n đủ 2 ngôn ngữ) → dùng subagent `architecture-guard` hoặc lệnh `/review-arch`.
- Hiện chưa có test — khi thêm logic vào usecase, viết unit test cho usecase đó (`*.test.ts`, mock repository interface).
- API contract đầy đủ ở `everly-api-spec.md` — tham chiếu file này khi thêm endpoint.

## Khi thêm một feature mới (vertical slice)

Theo thứ tự: entity → repository interface → usecase → datasource interface + impl → repository impl + mapper → đăng ký DI → query hook + key → dùng trong screen → i18n → typecheck/lint. Có thể dùng `/new-feature` để Claude làm theo đúng chuỗi này.
