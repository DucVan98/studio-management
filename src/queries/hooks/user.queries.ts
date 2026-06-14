import { createMutation } from '../factory';
import { authActions } from '../../stores/auth.store';

// ── Mutations ─────────────────────────────────────────────────────────────────

/**
 * Upload avatar → cập nhật avatar trong auth store ngay để UI (Home header,
 * onboarding) phản ánh ảnh mới mà không cần refetch.
 */
export const useUploadAvatar = createMutation(di => di.getUploadAvatarUseCase(), {
  onSuccess: (_queryClient, user) => {
    authActions.updateUser({ avatar: user.avatarUrl, name: user.name });
  },
});
