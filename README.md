# Everly

Ứng dụng React Native (Expo SDK 56) dành cho các cặp đôi: lưu **memories**, theo dõi **milestones**, xem **couple stats**, nhận **notifications** và quản lý **subscription**. Codebase tuân thủ **Clean Architecture** nghiêm ngặt.

## Yêu cầu môi trường

- **Node.js** ≥ 22 (đang dùng v22.x)
- **pnpm** (KHÔNG dùng npm/yarn — đây là pnpm workspace)
- **Expo / EAS**: chạy native cần Xcode (iOS) hoặc Android SDK

## Bắt đầu

```bash
pnpm install          # cài dependencies
cp .env.example .env  # tạo file env (xem mục Biến môi trường)
pnpm start            # Expo dev server
```

Chạy trên thiết bị/simulator:

```bash
pnpm ios       # build & chạy iOS
pnpm android   # build & chạy Android
```

## Biến môi trường

Khai báo trong `.env` (tham chiếu `.env.example`). Các biến `EXPO_PUBLIC_*` được nhúng vào client:

| Biến | Mô tả |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL của backend API |
| `EXPO_PUBLIC_APP_ENV` | `development` / `production` (dev sẽ gửi header bỏ qua cảnh báo ngrok) |
| `EXPO_PUBLIC_STORYBOOK_ENABLED` | Bật Storybook on-device |

## Lệnh hay dùng

```bash
pnpm start          # Expo dev server
pnpm ios / android  # Build & chạy native
pnpm typecheck      # tsc --noEmit — chạy sau mỗi thay đổi
pnpm lint           # eslint --fix
pnpm lint:check     # eslint không sửa (dùng trong CI)
pnpm test           # jest (jest-expo)
pnpm storybook      # Storybook on-device
pnpm release        # release-it (bump version, changelog, tag)
```

## Tech stack

- **State server**: TanStack Query v5 (`src/queries/`)
- **State local**: Legend-State v3 observables (`src/stores/`, persist MMKV)
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **Styling**: NativeWind v4 — chỉ dùng `className` + design token trong `tailwind.config.ts`
- **i18n**: i18next + react-i18next (`en`, `vi` trong `src/i18n/locales/`)
- **HTTP**: client tự viết trong `src/http/` (không dùng axios/fetch trực tiếp)
- **DI**: container thủ công `src/di/DIContainer.ts`
- **Icon**: SVG render qua `react-native-svg` (`src/components/ui/Icon.tsx`)
- **Alias**: `@/*` → `./src/*`

## Kiến trúc — Clean Architecture

Phụ thuộc chỉ đi **một chiều, vào trong**. `domain` là lõi và không import từ tầng ngoài.

```
presentation (screens, components, navigation, queries, stores)
      │  được phép import ▼
   domain (entities, usecases, repositories[interface], errors)  ← LÕI
      ▲  hiện thực hoá ▲
   data (datasources, repositories[impl], mappers, types)
      │
   http / services (hạ tầng)
```

Luồng dữ liệu chuẩn: `screen → query hook → usecase → repository(interface) → datasource → HttpClient`.

### Cấu trúc thư mục

```
src/
├── components/   # UI components (NativeWind), Storybook stories
├── data/         # datasources, repository impl, mappers, DTO types
├── di/           # DIContainer — đăng ký & expose dependency
├── domain/       # entities, usecases, repository interfaces, errors (LÕI)
├── http/         # HttpClient bọc fetch
├── i18n/         # i18next config + locales (en, vi)
├── navigation/   # RootNavigator, AppTabs, types
├── queries/      # TanStack Query hooks, keys, factory
├── screens/      # auth · onboarding · app
├── services/     # adapter bọc thư viện bên thứ 3 (storage, splash, SSE…)
├── stores/       # Legend-State observables (persist MMKV)
└── tokens/       # design tokens (theme vars)
```

## Quy ước chính

- Thư viện bên thứ 3 phải được **bọc qua adapter** trong `src/services/` (không import trực tiếp trong screen/usecase/store).
- Lỗi ném ra ngoài domain phải là `AppError` (`src/domain/errors/AppError.ts`).
- Mọi chuỗi hiển thị phải có ở **cả** `en.ts` và `vi.ts`.
- TypeScript `strict` — không dùng `any`; comment viết tiếng Việt.
- Thông báo/xác nhận dùng `<Alert>` / `<ConfirmModal>` (`src/components/ui/`), **không** dùng `Alert` của React Native.

> Chi tiết đầy đủ về convention từng tầng và luật phụ thuộc: xem [`CLAUDE.md`](./CLAUDE.md). API contract: xem `everly-api-spec.md`.

## Quy trình commit

Theo **Conventional Commits v1.0.0**, mô tả bằng tiếng Việt. Sau khi sửa code luôn chạy `pnpm typecheck` và `pnpm lint`.