import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma NavBar component – custom floating pill tab bar với center FAB
 *
 * Layout (từ Figma):
 *   – Pill-shaped bar (bg-surface, shadow, rounded-pill)
 *   – 4 tabs: Home | Memories | [FAB] | Explore | Profile
 *   – Center FAB: 64×64 circle bg-accent, protrudes above bar
 *
 * Usage với Expo Router – pass vào tabBar prop:
 * @example
 * <Tabs tabBar={(props) => <NavBar {...props} />}>
 *   ...
 * </Tabs>
 */

export type TabKey = 'home' | 'memories' | 'explore' | 'profile';

interface TabItem {
  key: TabKey;
  label: string;
  icon: IconName;
}

const TABS: TabItem[] = [
  { key: 'home',      label: 'Trang chủ', icon: 'home' },
  { key: 'memories',  label: 'Ký ức',     icon: 'image' },
  { key: 'explore',   label: 'Khám phá',  icon: 'compass' },
  { key: 'profile',   label: 'Hồ sơ',     icon: 'user' },
];

interface NavBarProps {
  /** Active tab key */
  activeTab?: TabKey;
  /** Called when a tab is pressed */
  onTabPress?: (tab: TabKey) => void;
  /** Called when center FAB is pressed */
  onFabPress?: () => void;
  // Expo Router BottomTabBarProps (optional wiring)
  state?: BottomTabBarProps['state'];
  navigation?: BottomTabBarProps['navigation'];
}

const FAB_SIZE  = 64;
const BAR_HEIGHT = 64;
const FAB_OVERLAP = 20; // how much FAB sits above the bar

export function NavBar({ activeTab, onTabPress, onFabPress, state, navigation }: NavBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom || (Platform.OS === 'ios' ? 16 : 8);

  // Resolve active tab from Expo Router state if provided
  const resolvedActive: TabKey | undefined = activeTab ?? (
    state ? (TABS[state.index < 2 ? state.index : state.index + 1]?.key) : undefined
  );

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
      style={{ paddingBottom: bottomPad }}
      className="absolute bottom-0 left-0 right-0 items-center"
    >
      {/* FAB – positioned above bar */}
      <View
        style={{
          position: 'absolute',
          top: -(FAB_SIZE / 2 - FAB_OVERLAP),
          zIndex: 10,
          width: FAB_SIZE,
          height: FAB_SIZE,
        }}
      >
        {/* Glow ring */}
        <View
          style={{
            position: 'absolute',
            width: FAB_SIZE + 32,
            height: FAB_SIZE + 32,
            borderRadius: (FAB_SIZE + 32) / 2,
            top: -16, left: -16,
            backgroundColor: 'rgba(212,83,126,0.2)',
          }}
        />
        <TouchableOpacity
          onPress={onFabPress}
          activeOpacity={0.85}
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_SIZE / 2,
          }}
          className="bg-accent items-center justify-center shadow-xl"
        >
          <Icon name="plus" size="lg" color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Pill bar */}
      <View
        className="flex-row items-center bg-surface rounded-pill shadow-lg mx-4"
        style={{ height: BAR_HEIGHT, marginTop: FAB_SIZE / 2 - FAB_OVERLAP }}
      >
        {/* Left tabs */}
        {leftTabs.map((tab, i) => (
          <TabButton
            key={tab.key}
            tab={tab}
            active={resolvedActive === tab.key}
            onPress={() => handleTabPress(tab.key, i)}
          />
        ))}

        {/* Center spacer (FAB area) */}
        <View style={{ width: FAB_SIZE + 16 }} />

        {/* Right tabs */}
        {rightTabs.map((tab, i) => (
          <TabButton
            key={tab.key}
            tab={tab}
            active={resolvedActive === tab.key}
            onPress={() => handleTabPress(tab.key, i + 2)}
          />
        ))}
      </View>
    </View>
  );
}

// ── Internal TabButton ────────────────────────────────────────────────────────

function TabButton({
  tab,
  active,
  onPress,
}: { tab: TabItem; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="flex-1 items-center justify-center gap-0.5 py-1"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon
        name={tab.icon}
        size="md"
        color={active ? 'var(--color-accent)' : 'var(--color-text-muted)'}
      />
      <Text
        className={[
          'text-label',
          active ? 'font-semibold text-accent' : 'font-regular text-text-muted',
        ].join(' ')}
        numberOfLines={1}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}
