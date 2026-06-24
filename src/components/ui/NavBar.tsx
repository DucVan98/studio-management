import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { useThemeColors } from '../../tokens/useThemeColors';
import { useHaptics } from './useHaptics';
import {
  NavBarBackdrop,
  BAR_HEIGHT,
  BAR_MARGIN_X,
  FAB_LIFT,
  FAB_SIZE,
  GLOW_BLEED,
  NAV_OVERHANG,
} from './NavBarBackdrop';

/**
 * Figma NavBar (161:864) – floating pill tab bar KHOÉT lõm giữa cho FAB.
 *
 * Toàn bộ phần hình (bar khoét, shadow, glow, FAB gradient) do
 * NavBarBackdrop vẽ bằng Skia trong MỘT canvas → shadow liền khối.
 * File này chỉ lo phần tương tác: 4 tab buttons + hit-area của FAB + icon.
 *
 * Usage với React Navigation – pass vào tabBar prop:
 * @example
 * <Tabs tabBar={(props) => <NavBar {...props} />}>
 *   ...
 * </Tabs>
 */

export type TabKey = 'home' | 'memories' | 'explore' | 'profile';

interface TabItem {
  key: TabKey;
  /** i18n key — render qua t() trong NavBar */
  labelKey: string;
  icon: IconName;
}

const TABS: TabItem[] = [
  { key: 'home',      labelKey: 'tabs.home',      icon: 'home' },
  { key: 'memories',  labelKey: 'tabs.memories',  icon: 'image' },
  { key: 'explore',   labelKey: 'tabs.explore',   icon: 'compass' },
  { key: 'profile',   labelKey: 'tabs.profile',   icon: 'user' },
];

interface NavBarProps {
  /** Active tab key */
  activeTab?: TabKey;
  /** Called when a tab is pressed */
  onTabPress?: (tab: TabKey) => void;
  /** Called when center FAB is pressed */
  onFabPress?: () => void;
  // React Navigation BottomTabBarProps (optional wiring)
  state?: BottomTabBarProps['state'];
  navigation?: BottomTabBarProps['navigation'];
}

/** Khoảng trống giữa bar dành cho vùng khoét (Figma spacer 72px) */
const CENTER_SPACER = 72;

export function NavBar({ activeTab, onTabPress, onFabPress, state, navigation }: NavBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom || (Platform.OS === 'ios' ? 16 : 8);

  // FAB: nhấn xuống co lại (spring) + rung medium → cảm giác bấm chắc tay.
  const haptics = useHaptics();
  const reduced = useReducedMotion();
  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  // Resolve active tab từ navigation state nếu không truyền activeTab.
  // state.routes map 1-1 với TABS (FAB không phải route).
  const resolvedActive: TabKey | undefined =
    activeTab ?? (state ? TABS[state.index]?.key : undefined);

  const handleTabPress = (tab: TabKey, routeIndex?: number) => {
    if (navigation && state && routeIndex !== undefined) {
      const route = state.routes[routeIndex];
      const event = navigation.emit({ type: 'tabPress', target: route?.key, canPreventDefault: true });
      if (!event.defaultPrevented) navigation.navigate(route?.name ?? tab);
    }
    onTabPress?.(tab);
  };

  const leftTabs  = TABS.slice(0, 2);
  const rightTabs = TABS.slice(2);

  return (
    <View
      pointerEvents="box-none"
      style={{ height: GLOW_BLEED + NAV_OVERHANG + BAR_HEIGHT + bottomPad }}
      className="absolute bottom-0 left-0 right-0"
    >
      {/* Backdrop Skia: bar khoét + shadow + glow + FAB (vẽ liền một khối) */}
      <NavBarBackdrop bottomBleed={bottomPad} />

      {/* Tab row – overlay đúng vùng bar */}
      <View
        pointerEvents="box-none"
        className="absolute flex-row items-center"
        style={{
          top: GLOW_BLEED + NAV_OVERHANG,
          left: BAR_MARGIN_X,
          right: BAR_MARGIN_X,
          height: BAR_HEIGHT,
        }}
      >
        {leftTabs.map((tab, i) => (
          <TabButton
            key={tab.key}
            tab={tab}
            active={resolvedActive === tab.key}
            onPress={() => handleTabPress(tab.key, i)}
          />
        ))}

        {/* Spacer cho vùng khoét */}
        <View pointerEvents="none" style={{ width: CENTER_SPACER }} />

        {rightTabs.map((tab, i) => (
          <TabButton
            key={tab.key}
            tab={tab}
            active={resolvedActive === tab.key}
            onPress={() => handleTabPress(tab.key, i + 2)}
          />
        ))}
      </View>

      {/* FAB hit-area – hình do backdrop vẽ, đây chỉ là vùng chạm + icon */}
      <TouchableOpacity
        onPress={() => {
          haptics.impact('medium');
          onFabPress?.();
        }}
        onPressIn={() => {
          if (!reduced) fabScale.set(withSpring(0.9, { damping: 14, stiffness: 320 }));
        }}
        onPressOut={() => {
          fabScale.set(withSpring(1, { damping: 14, stiffness: 320 }));
        }}
        activeOpacity={0.7}
        className="absolute items-center justify-center self-center"
        style={{
          top: GLOW_BLEED + NAV_OVERHANG - FAB_LIFT - FAB_SIZE / 2,
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: FAB_SIZE / 2,
        }}
      >
        <Animated.View style={fabStyle}>
          <Icon name="plus" size={28} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

// ── Internal TabButton ────────────────────────────────────────────────────────

function TabButton({
  tab,
  active,
  onPress,
}: { tab: TabItem; active: boolean; onPress: () => void }) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const haptics = useHaptics();
  const reduced = useReducedMotion();

  // Tab đang chọn: icon nảy lên to hơn một chút (spring).
  const scale = useSharedValue(active ? 1.15 : 1);
  useEffect(() => {
    scale.value = reduced ? (active ? 1.15 : 1) : withSpring(active ? 1.15 : 1, { damping: 12, stiffness: 260 });
  }, [active, reduced, scale]);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <TouchableOpacity
      className="flex-1 items-center justify-center gap-0.5 py-1"
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      activeOpacity={0.7}
    >
      {/* Màu phải là hex resolve theo theme — vector-icons không hiểu var(--*) */}
      <Animated.View style={iconStyle}>
        <Icon
          name={tab.icon}
          size="lg"
          color={active ? colors['--color-accent'] : colors['--color-text-muted']}
        />
      </Animated.View>
      <Text
        className={[
          'text-label',
          active ? 'font-semibold text-accent' : 'font-regular text-text-muted',
        ].join(' ')}
        numberOfLines={1}
      >
        {t(tab.labelKey)}
      </Text>
    </TouchableOpacity>
  );
}
