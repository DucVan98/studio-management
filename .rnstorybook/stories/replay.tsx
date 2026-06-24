import { useState } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../../src/components/ui';

/**
 * Helper cho Storybook: bọc nội dung + nút "Phát lại". Bấm nút sẽ remount
 * children (đổi key) → các animation chạy-khi-mount (count-up, ring, badge…)
 * phát lại để xem trong on-device Storybook.
 *
 * Lưu ý: file KHÔNG có đuôi `.stories.` nên không bị nạp như một story.
 */
export function Replay({ children, label = 'Phát lại' }: { children: ReactNode; label?: string }) {
  const [key, setKey] = useState(0);
  return (
    <View className="gap-4 items-center">
      <View key={key} className="items-center">
        {children}
      </View>
      <Button label={label} variant="secondary" size="sm" onPress={() => setKey(v => v + 1)} />
    </View>
  );
}
