import { Stack } from 'expo-router';
import { theme } from '@bubbles/ui-native/theme';

export default function AccountLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.surface.page }, animation: 'slide_from_left' }} />;
}
