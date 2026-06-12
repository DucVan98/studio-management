---
description: Tạo một screen mới và nối vào navigation
argument-hint: <Tên> <area: app|auth|onboarding>
---

Tạo screen **$ARGUMENTS** bám pattern screen hiện có (vd `src/screens/app/HomeScreen.tsx`).

1. Tạo `src/screens/<area>/<Name>Screen.tsx`:
   - Function component, bọc `<SafeAreaView className="flex-1 bg-bg">`.
   - Style 100% bằng `className` + token thiết kế (KHÔNG dùng StyleSheet).
   - Dùng lại component trong `src/components/ui/` thay vì viết mới khi có thể.
   - Lấy dữ liệu server qua query hook (`src/queries/hooks`), state local qua `useValue(store$...)`.
   - Mọi text hiển thị qua `t('...')`.
2. Thêm route vào navigator phù hợp trong `src/navigation/` và khai báo param trong `navigation/types.ts`.
3. Thêm chuỗi i18n vào CẢ `en.ts` và `vi.ts`.
4. `pnpm typecheck && pnpm lint`.

Nếu thiếu thiết kế, hỏi tôi link Figma trước khi tự bịa layout.
