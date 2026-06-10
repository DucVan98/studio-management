import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon, Pill } from '../../components/ui';
import { OnboardingScreen, OnboardingHeading } from '../../components/onboarding';

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
    // Ngày bắt đầu sẽ được áp dụng khi tạo couple (accept invite). Tạm chuyển tiếp.
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

          {weeks.map((row, ri) => (
            <View key={ri} className="flex-row">
              {row.map((d, ci) => (
                <View key={ci} className="flex-1 items-center py-1">
                  {d === null ? (
                    <View className="w-9 h-9" />
                  ) : (
                    <TouchableOpacity
                      onPress={() => setSelected(new Date(view.year, view.month, d))}
                      className={`w-9 h-9 rounded-pill items-center justify-center ${
                        isSelected(d) ? 'bg-accent' : ''
                      }`}
                    >
                      <Text
                        className={`text-body-md ${
                          isSelected(d) ? 'text-on-accent font-bold' : 'text-text'
                        }`}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        <View className="flex-1" />
        <Button label="Tiếp tục" fullWidth size="lg" onPress={handleContinue} />
      </View>
    </OnboardingScreen>
  );
}
