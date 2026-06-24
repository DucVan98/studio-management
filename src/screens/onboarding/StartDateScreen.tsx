import { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Button, Icon, Pill, useHaptics } from '../../components/ui';
import { OnboardingScreen, OnboardingHeading } from '../../components/onboarding';
import { onboardingActions } from '../../stores/onboarding.store';
import type { DateType } from '../../stores/onboarding.store';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WEEKDAY_FULL = [
  'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy',
];

const DATE_TYPES = [
  { key: 'love', label: 'Ngày yêu' },
  { key: 'wedding', label: 'Ngày cưới' },
  { key: 'first-meet', label: 'Lần đầu gặp' },
] as const;

type DateTypeKey = (typeof DATE_TYPES)[number]['key'];

const pad = (n: number) => String(n).padStart(2, '0');

const CELL_SPRING = { damping: 13, stiffness: 240 } as const;

/** Ô ngày trong lịch — khi chọn, nền accent "bung" ra (spring pop) + rung nhẹ. */
function DayCell({ day, selected, onSelect }: { day: number; selected: boolean; onSelect: () => void }) {
  const reduced = useReducedMotion();
  const haptics = useHaptics();
  const sel = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    sel.value = reduced ? (selected ? 1 : 0) : withSpring(selected ? 1 : 0, CELL_SPRING);
  }, [selected, reduced, sel]);

  // Nền tròn accent hiện ra (opacity) + phóng từ nhỏ → to (pop).
  const circleStyle = useAnimatedStyle(() => ({ opacity: sel.value, transform: [{ scale: sel.value }] }));

  return (
    <TouchableOpacity
      className="w-9 h-9 items-center justify-center"
      activeOpacity={0.7}
      onPress={() => {
        haptics.selection();
        onSelect();
      }}
    >
      <Animated.View className="absolute w-9 h-9 rounded-pill bg-accent" style={circleStyle} pointerEvents="none" />
      <Text className={`text-body-md ${selected ? 'text-on-accent font-bold' : 'text-text'}`}>{day}</Text>
    </TouchableOpacity>
  );
}

/** Màn 4 · Ngày bắt đầu (Figma 78:195). */
export function StartDateScreen() {
  const navigation = useNavigation();
  const today = new Date();
  const [dateType, setDateType] = useState<DateTypeKey>('love');
  const [selected, setSelected] = useState<Date>(today);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const weeks = useMemo(() => {
    const firstDay = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [view]);

  const changeMonth = (delta: number) => {
    const m = view.month + delta;
    const year = view.year + Math.floor(m / 12);
    const month = ((m % 12) + 12) % 12;
    setView({ year, month });
  };

  const isSelected = (d: number) =>
    selected.getFullYear() === view.year &&
    selected.getMonth() === view.month &&
    selected.getDate() === d;

  const typeLabel = DATE_TYPES.find((t) => t.key === dateType)!.label;

  const handleContinue = () => {
    // Map key màn hình sang DateType của store (first-meet → first_met)
    const storeTypeMap: Record<DateTypeKey, DateType> = {
      love: 'love',
      wedding: 'wedding',
      'first-meet': 'first_met',
    };
    // Persist vào store — sẽ được đọc lại khi tạo invite để gửi lên backend
    onboardingActions.saveRelationshipDate(selected);
    onboardingActions.setDateType(storeTypeMap[dateType]);
    navigation.navigate('Invite');
  };

  return (
    <OnboardingScreen showBack>
      <View className="flex-1 px-6 pt-2 pb-8">
        <OnboardingHeading
          title="Ngày bắt đầu"
          subtitle="Cột mốc để đếm từng ngày bên nhau"
        />

        {/* Loại ngày */}
        <View className="flex-row gap-2 mt-6">
          {DATE_TYPES.map((t) => (
            <Pill
              key={t.key}
              label={t.label}
              active={dateType === t.key}
              onPress={() => setDateType(t.key)}
            />
          ))}
        </View>

        {/* Ngày đã chọn */}
        <View className="flex-row items-center gap-4 bg-surface rounded-md p-4 mt-5">
          <View className="w-12 h-12 rounded-md bg-surface-alt items-center justify-center">
            <Icon name="calendar" size={26} color="#D4537E" />
          </View>
          <View>
            <Text className="font-serif text-heading-xl text-text">
              {pad(selected.getDate())} . {pad(selected.getMonth() + 1)} . {selected.getFullYear()}
            </Text>
            <Text className="text-body-sm text-text-muted mt-0.5">
              {WEEKDAY_FULL[selected.getDay()]} · {typeLabel}
            </Text>
          </View>
        </View>

        {/* Lịch */}
        <View className="bg-surface rounded-md p-4 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity onPress={() => changeMonth(-1)} hitSlop={10}>
              <Icon name="chevron-left" size="md" color="#791F1F" />
            </TouchableOpacity>
            <Text className="text-body-md font-medium text-text">
              Tháng {view.month + 1}, {view.year}
            </Text>
            <TouchableOpacity onPress={() => changeMonth(1)} hitSlop={10}>
              <Icon name="chevron-right" size="md" color="#791F1F" />
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-1">
            {WEEKDAYS.map((w) => (
              <Text key={w} className="flex-1 text-center text-body-sm text-text-muted">
                {w}
              </Text>
            ))}
          </View>

          {/* key theo tháng → lưới fade mượt mỗi khi đổi tháng */}
          <Animated.View key={`${view.year}-${view.month}`} entering={FadeIn.duration(220)}>
            {weeks.map((row, ri) => (
              <View key={ri} className="flex-row">
                {row.map((d, ci) => (
                  <View key={ci} className="flex-1 items-center py-1">
                    {d === null ? (
                      <View className="w-9 h-9" />
                    ) : (
                      <DayCell
                        day={d}
                        selected={isSelected(d)}
                        onSelect={() => setSelected(new Date(view.year, view.month, d))}
                      />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </Animated.View>
        </View>

        <View className="flex-1" />
        <Button label="Tiếp tục" fullWidth size="lg" onPress={handleContinue} />
      </View>
    </OnboardingScreen>
  );
}
