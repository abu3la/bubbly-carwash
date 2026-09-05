import { Stack } from 'expo-router';
import { theme } from '@bubbles/ui-native/theme';

export default function ClubLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.surface.page },
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen name="processing" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="payment" options={{ gestureEnabled: false, animation: 'fade' }} />
    </Stack>
  );
}
