# App treo ở splash khi bật MMKV persistence — nguyên nhân thật: bundle chứa 2 instance Legend-State (dual package hazard)

> **Lưu ý lịch sử**: phiên bản đầu của tài liệu này chẩn đoán nguyên nhân là
> "deadlock giữa JS thread và main thread khi Nitro khởi tạo MMKVFactory".
> Chẩn đoán đó **sai** — đã được bác bỏ bằng thực nghiệm (xem mục "Quá trình
> chẩn đoán"). MMKV v4 và Nitro hoạt động hoàn toàn bình thường trên New
> Architecture. Bug đã được fix, persistence đã bật lại.

## Môi trường

| Package | Version |
|---|---|
| `react-native` | 0.85.3 |
| `expo` | ~56.0.0 |
| `react-native-mmkv` | 4.3.1 |
| `react-native-nitro-modules` | 0.35.9 |
| `@legendapp/state` | 3.0.0-beta.47 |
| New Architecture (bridgeless) | `newArchEnabled: true` |

## Triệu chứng

App khởi động, Metro load bundle thành công, nhưng splash screen không bao giờ
ẩn. Không có error log, không red screen. JS thread bận 100% CPU vĩnh viễn.

## Nguyên nhân gốc rễ

`@legendapp/state` publish **cả hai format** trong cùng package:

```json
// node_modules/@legendapp/state/package.json
"exports": {
  ".":       { "import": "./index.mjs", "require": "./index.js" },
  "./sync":  { "import": "./sync.mjs",  "require": "./sync.js" }
}
```

Metro (RN 0.85 / Expo 56) bật **package exports** mặc định:

- câu lệnh `import ... from '@legendapp/state'` → resolve ra **`index.mjs`** (ESM)
- lời gọi `require('@legendapp/state/sync')` → resolve ra **`sync.js`** (CJS),
  và `sync.js` lại `require('@legendapp/state')` → **`index.js`** (CJS)

Kết quả: bundle chứa **HAI bản copy độc lập** của Legend-State core, mỗi bản có
bộ `Symbol` nội bộ riêng (`symbolGetNode`, `symbolLinked`, …) và `globalState`
riêng. Đây là "dual package hazard" kinh điển.

Trong code của Everly:

- Các store (`app.store.ts`, `auth.store.ts`, …) tạo observable bằng
  `import { observable } from '@legendapp/state'` → instance **ESM**.
- `mmkv.adapter.ts` (phiên bản cũ) lazy-load bằng
  `require('@legendapp/state/sync')` và
  `require('@legendapp/state/persist-plugins/mmkv')` → instance **CJS**.

Khi `syncObservable` (CJS) thao tác trên observable tạo bởi instance ESM:

1. CJS đọc `obs$[symbolGetNode_CJS]` — proxy ESM không nhận ra symbol này,
   nên xử lý nó như **một key con bình thường** → tạo child node rác với key
   là Symbol/object thay vì string.
2. Node graph bị hỏng dần, chuỗi `parent` xuất hiện **cycle**.
3. `getNodeValue()` trong core chạy `while (isChildNode(n)) n = n.parent;`
   — không có guard chống cycle → **lặp vô hạn**, JS thread treo tại chỗ.

Điểm treo chính xác: `syncObservable()` → `getNodeValue(getNode(syncState$))`
(`@legendapp/state/sync.js`), xác nhận bằng cách chèn log vào node_modules và
guard đếm vòng lặp trong `getNodeValue` (in ra chuỗi key toàn object → cycle).

### Tại sao trông giống "lỗi MMKV"?

Vì đường code duy nhất `require()` Legend-State bản CJS chính là adapter
persistence. Tắt `initPersistence()` → không require bản CJS → chỉ còn một
instance → app chạy bình thường. Tương quan hoàn hảo với "bật MMKV thì treo",
nhưng MMKV chỉ là người đứng cạnh hiện trường.

### Bằng chứng bác bỏ giả thuyết "Nitro deadlock"

- `sample` process lúc treo: **0 frame** nào nằm trong code native của
  Nitro/MMKV/margelo. JS thread không bị block ở native call mà đang **bận
  100% trong Hermes interpreter** (`JSProxy::getNamed`, `getWithTrap`,
  allocations) — busy loop thuần JS, không phải deadlock chờ lock.
- Tạo `new ObservablePersistMMKV(...)` đơn thuần (tức
  `NitroModules.createHybridObject('MMKVFactory')` + tạo 2 MMKV instance)
  **thành công**, app boot bình thường — chỉ khi gọi tiếp `syncObservable`
  mới treo.
- Treo với **bất kỳ** store nào (app/auth/onboarding), kể cả khi storage rỗng
  → không phụ thuộc MMKV hay dữ liệu.

## Fix (không cần downgrade, không gỡ thư viện nào)

Đổi toàn bộ lazy `require()` trong `src/stores/persistence/mmkv.adapter.ts`
thành **static `import`** để mọi module Legend-State resolve về cùng instance
ESM:

```ts
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
```

Đồng thời bỏ cơ chế hàng đợi `initPersistence()` — khởi tạo MMKV đồng bộ ở
top-level module là an toàn (giả định "tạo MMKV ở top-level gây deadlock"
cũng xuất phát từ chẩn đoán sai cũ), nên `configurePersistence` giờ wire
`syncObservable` ngay khi store module được import.

**Quy tắc rút ra cho repo này**: với các package publish cả ESM + CJS
(`exports` có cả `import`/`require`), KHÔNG trộn `import` và `require()` cho
cùng một package trong bundle Metro. Luôn dùng static `import`.

## Đã verify

- App boot qua splash, vào Welcome screen bình thường (simulator iPhone 17
  Pro Max, iOS 26.5, debug build).
- File `Documents/mmkv/app-storage` được tạo, chứa đúng JSON state:
  `{"initialized":true,"theme":"rose-romantic","language":"vi",...}`.
- Mở lại app lần 2, lần 3 vẫn bình thường (trước đây lần 2 trắng màn).
- `pnpm typecheck` và `pnpm lint` sạch.

## Quá trình chẩn đoán (tóm tắt, để tham khảo sau này)

1. Tái hiện treo với binary mới build (loại giả thuyết native binary cũ).
2. `sample <pid>`: JS thread busy-loop trong Hermes, không có frame Nitro/MMKV
   → loại giả thuyết deadlock native.
3. Bisect bằng cờ trong adapter: plugin-only OK; wire bất kỳ store nào → treo.
4. Chèn log vào `node_modules/@legendapp/state/sync.js` + `index.js`, kẹp dần
   → điểm treo là vòng `while (isChildNode(n)) n = n.parent` trong
   `getNodeValue`, key của node là object (không phải string) → node graph
   hỏng do 2 instance.
5. Kiểm tra `exports` map + cách Metro resolve `import` vs `require` → xác
   nhận dual package hazard. Static import → fix.

## Tài liệu tham khảo

- [Dual package hazard — Node.js docs](https://nodejs.org/api/packages.html#dual-package-hazard)
- [Metro package exports support](https://metrobundler.dev/docs/package-exports/)
- [Legend-State v3 persist & sync](https://legendapp.com/open-source/state/v3/sync/persist-sync/)
