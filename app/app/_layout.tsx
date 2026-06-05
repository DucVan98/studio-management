import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavBar } from '../../src/components/ui';

function CustomTabBar(props: BottomTabBarProps) {
  const activeIndex = props.state.index;
  const tabKeys = ['home', 'memories', 'explore', 'profile'] as const;
  const activeTab = tabKeys[activeIndex] ?? 'home';

  return (
    <NavBar
      activeTab={activeTab}
      state={props.state}
      navigation={props.navigation}
      onFabPress={() => {
        // TODO: open create memory / add moment sheet
      }}
    />
  );
}

export default function AppLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* Route names phải khớp với folder/file trong app/app/ */}
      <Tabs.Screen name="index"          options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="memories/index" options={{ title: 'Ký ức' }} />
      <Tabs.Screen name="explore/index"  options={{ title: 'Khám phá' }} />
      <Tabs.Screen name="profile/index"  options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}
