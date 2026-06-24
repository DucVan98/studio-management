import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

/**
 * Bọc một item trong danh sách để nó fade + trượt lên khi xuất hiện, lệch nhau
 * theo `index` (stagger) tạo nhịp điệu thay vì hiện đồng loạt.
 *
 * Tôn trọng Reduce Motion: render thẳng không animation.
 *
 * @example
 * {items.map((it, i) => (
 *   <AnimatedListItem key={it.id} index={i}>
 *     <MemoryCard {...it} />
 *   </AnimatedListItem>
 * ))}
 */

interface AnimatedListItemProps {
  children: ReactNode;
  /** Vị trí trong danh sách — quyết định độ trễ. */
  index?: number;
  /** Độ trễ mỗi bậc (ms). Mặc định 80. */
  stagger?: number;
  /** Thời lượng animation (ms). Mặc định 420. */
  durationMs?: number;
  className?: string;
}

export function AnimatedListItem({
  children,
  index = 0,
  stagger = 80,
  durationMs = 420,
  className,
}: AnimatedListItemProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <View className={className}>{children}</View>;
  }

  return (
    <Animated.View
      className={className}
      entering={FadeInDown.delay(index * stagger).duration(durationMs)}
    >
      {children}
    </Animated.View>
  );
}
