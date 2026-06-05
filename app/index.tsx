import { Redirect } from 'expo-router';
import { useValue } from '@legendapp/state/react';
import { authStore$ } from '../src/stores/auth.store';

/**
 * Root index – redirect dựa trên trạng thái auth.
 */
export default function Index() {
  const user = useValue(authStore$.user);
  return user ? <Redirect href="/(app)" /> : <Redirect href="/auth/login" />;
}
