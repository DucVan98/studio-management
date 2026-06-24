import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { AnimatedCounter } from './AnimatedCounter';

/**
 * Figma CountdownCard — couple app signature widget
 *
 * variant=together  → đếm lên từ ngày bắt đầu ("Ngày bên nhau")
 * variant=countdown → đếm ngược đến ngày kỷ niệm/sự kiện
 */

type CountdownVariant = 'together' | 'countdown';

interface CountdownCardProps {
  variant?: CountdownVariant;
  startDate?: Date;
  targetDate?: Date;
  label?: string;
  icon?: IconName;
  onPress?: () => void;
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function CountdownCard({
  variant = 'together',
  startDate,
  targetDate,
  label,
  icon = 'heart',
  onPress,
}: CountdownCardProps) {
  const now = new Date();
  let days = 0;
  let subtitle = '';

  if (variant === 'together' && startDate) {
    days = daysBetween(startDate, now);
    subtitle = `Kể từ ${startDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  } else if (variant === 'countdown' && targetDate) {
    days = daysBetween(now, targetDate);
    subtitle = targetDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const displayLabel = label ?? (variant === 'together' ? 'Ngày bên nhau' : 'Còn lại');

  return (
    <TouchableOpacity className="bg-accent rounded-lg px-5 py-5 overflow-hidden" onPress={onPress} activeOpacity={0.85}>
      {/* Decorative circles */}
      <View className="absolute rounded-full bg-white/10" style={{ width: 140, height: 140, top: -40, right: -30 }} pointerEvents="none" />
      <View className="absolute rounded-full bg-white/5"  style={{ width: 90,  height: 90,  bottom: -20, right: 40 }} pointerEvents="none" />

      <View className="flex-row items-center gap-2 mb-3">
        <View className="w-7 h-7 rounded-full bg-white/20 items-center justify-center">
          <Icon name={icon} size="xs" color="#FFFFFF" />
        </View>
        <Text className="text-body-sm font-semibold text-on-accent/80">{displayLabel}</Text>
      </View>

      {/* Số ngày chạy tăng dần khi card xuất hiện (signature animation). */}
      <AnimatedCounter
        value={days}
        className="text-display-lg font-bold text-on-accent leading-none mb-1"
      />
      <Text className="text-body-sm font-medium text-on-accent/70">ngày</Text>

      {subtitle ? (
        <Text className="text-label text-on-accent/60 mt-3">{subtitle}</Text>
      ) : null}
    </TouchableOpacity>
  );
}
