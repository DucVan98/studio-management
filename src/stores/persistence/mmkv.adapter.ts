import { MMKV } from 'react-native-mmkv';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import type { Observable } from '@legendapp/state';

// ── Global MMKV instance ──────────────────────────────────────────────────────
export const storage = new MMKV({ id: 'app-storage' });

// ── Configure Legend State global persistence ─────────────────────────────────
configureObservablePersistence({
  pluginLocal: ObservablePersistMMKV,
});

/**
 * Persist a Legend State observable to MMKV.
 *
 * @example
 * configurePersistence(authStore$, 'auth');
 */
export function configurePersistence<T extends object>(
  observable: Observable<T>,
  key: string,
): void {
  persistObservable(observable, {
    local: key,
  });
}
