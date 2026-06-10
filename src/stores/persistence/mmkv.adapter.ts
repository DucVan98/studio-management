import { MMKV } from 'react-native-mmkv';
import type { ObservableParam } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

// ── Global MMKV instance ──────────────────────────────────────────────────────
export const storage = new MMKV({ id: 'app-storage' });

// Plugin dùng chung — Legend-State v3 sync API
const mmkvPlugin = new ObservablePersistMMKV({ id: 'app-storage' });

/**
 * Persist một Legend-State observable vào MMKV (Legend-State v3).
 *
 * @example
 * configurePersistence(authStore$, 'auth');
 */
export function configurePersistence<T>(
  observable$: ObservableParam<T>,
  key: string,
): void {
  syncObservable(observable$, {
    persist: {
      name: key,
      plugin: mmkvPlugin,
    },
  });
}
