import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavBar } from '../components/ui';
import type { TabKey } from '../components/ui';
import type { AppTabParamList } from './types';
import { HomeScreen } from '../screens/app/HomeScreen';
import { MemoriesScreen } from '../screens/app/MemoriesScreen';
import { ExploreScreen } from '../screens/app/ExploreScreen';
import { AppProfileScreen } from '../screens/app/AppProfileScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();

function CustomTabBar(props: BottomTabBarProps) {
  const tabKeys: TabKey[] = ['home', 'memories', 'explore', 'profile'];
  const activeTab = tabKeys[props.state.index] ?? 'home';

  return (
    <NavBar
      activeTab={activeTab}
      state={props.state}
      navigation={props.navigation}
      onFabPress={() => {
        // TODO: mở sheet tạo memory / add moment
      }}
    />
  );
}

export function AppTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Memories" component={MemoriesScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={AppProfileScreen} />
    </Tab.Navigator>
  );
}
