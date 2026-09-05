import { Stack } from 'expo-router';
import { theme } from '@bubbles/ui-native/theme';

export default function BookLayout() {

  return (
    // The draft lives above the steps, so going back never loses a choice.
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.surface.page },
          animation: 'slide_from_left',
        }}
      >
        {/* Processing must not be swipeable — a payment is in flight. */}
        <Stack.Screen name="processing" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="payment" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="done" options={{ gestureEnabled: false, animation: 'fade' }} />
      </Stack>
    </>
  );
}
