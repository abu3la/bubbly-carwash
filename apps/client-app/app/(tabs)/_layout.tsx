import { Tabs } from 'expo-router';
import { BottomTabBar } from '../../src/components/BottomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      // `tabBar` is invoked as a plain function by the navigator, so the bar
      // has to be *rendered* here as an element. Passing the component itself
      // would call it directly and its hooks would be invalid.
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false, animation: 'shift' }}
    >
      {/* Labels come from BottomTabBar, which reads the active catalogue —
          a title here would be a second, untranslated source. */}
      <Tabs.Screen name="home" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
