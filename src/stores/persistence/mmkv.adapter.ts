import type { ObservableParam } from '@legendapp/state';

// ⚠️ KHÔNG khởi tạo MMKV ở top-level.
// react-native-mmkv v4 tạo nitro HybridObject; gọi `new MMKV()` đồng bộ khi
// bundle evaluate sẽ deadlock với nitro dispatcher trên New Architecture/bridgeless
// → app treo ở màn "Downloading 100%".
// Giải pháp: xếp hàng các observable, gọi initPersistence() sau first render (App bootstrap).

 
type PendingEntry = { observable: ObservableParam<any>; key: string };

let _initialized = false;
let _plugin: object | null = null;
const _pending: PendingEntry[] = [];

 
function wireObservable(observable: ObservableParam<any>, key: string): void {
  if (!_plugin) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { syncObservable } = require('@legendapp/state/sync') as {
       
      syncObservable: (obs: ObservableParam<any>, opts: object) => void;
    };
    syncObservable(observable, { persist: { name: key, plugin: _plugin } });
  } catch {
    // no-op — app chạy với state in-memory
  }
}

/**
 * Khởi tạo MMKV persistence. Phải gọi trong App bootstrap (sau first render),
 * KHÔNG gọi ở module top-level. Idempotent — gọi nhiều lần an toàn.
 */
export function initPersistence(): void {
  if (_initialized) return;
  _initialized = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ObservablePersistMMKV } = require('@legendapp/state/persist-plugins/mmkv') as {
      ObservablePersistMMKV: new (opts: { id: string }) => object;
    };
    _plugin = new ObservablePersistMMKV({ id: 'app-storage' });
  } catch {
    _plugin = null;
  }

  for (const entry of _pending) {
    wireObservable(entry.observable, entry.key);
  }
  _pending.length = 0;
}

/**
 * Đăng ký một observable để persist vào MMKV. An toàn ở top-level module —
 * nếu chưa init thì xếp hàng và tự wire khi initPersistence() được gọi.
 */
export function configurePersistence<T>(
  observable$: ObservableParam<T>,
  key: string,
): void {
  if (_initialized) {
     
    wireObservable(observable$ as ObservableParam<any>, key);
    return;
  }
   
  _pending.push({ observable: observable$ as ObservableParam<any>, key });
}
