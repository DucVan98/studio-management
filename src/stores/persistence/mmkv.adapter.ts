import type { ObservableParam } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

// ⚠️ QUAN TRỌNG: file này phải dùng static `import` cho mọi module @legendapp/state.
//
// Bài học từ bug treo splash (xem docs/mmkv-nitro-deadlock.md): phiên bản cũ
// lazy-load bằng `require('@legendapp/state/sync')`. Với Metro (RN 0.85+,
// package exports bật mặc định), `import` resolve ra bản ESM (index.mjs) còn
// `require()` resolve ra bản CJS (index.js) → bundle chứa HAI instance
// Legend-State. Observable tạo bởi instance ESM (các store) nhưng được
// syncObservable của instance CJS xử lý → symbol nội bộ không khớp, node graph
// bị hỏng (cycle trong chuỗi parent) → `getNodeValue` lặp vô hạn, JS thread
// treo vĩnh viễn ở splash. KHÔNG phải lỗi MMKV/Nitro.

let _plugin: ObservablePersistMMKV | null = null;

function getPlugin(): ObservablePersistMMKV {
  if (!_plugin) {
    _plugin = new ObservablePersistMMKV({ id: 'app-storage' });
  }
  return _plugin;
}

/**
 * Đăng ký một observable để persist vào MMKV. An toàn ở top-level module —
 * MMKV v4 khởi tạo đồng bộ qua Nitro hoạt động bình thường trên New Architecture.
 */
export function configurePersistence<T>(
  observable$: ObservableParam<T>,
  key: string,
): void {
  syncObservable(observable$, { persist: { name: key, plugin: getPlugin() } });
}
