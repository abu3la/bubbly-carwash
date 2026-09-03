import { Stack } from 'expo-router';
import { theme } from '@sama/ui-native/theme';
import { BookingDraftProvider } from '../../src/bookingDraft';
import { useSession } from '../../src/session';

export default function BookLayout() {
  const { sources } = useSession();

  return (
    // The draft lives above the steps, so going back never loses a choice.
    <BookingDraftProvider sources={sources}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.surface.page },
          animation: 'slide_from_left',
        }}
      >
        {/* Processing must not be swipeable — a payment is in flight. */}
        <Stack.Screen name="processing" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="done" options={{ gestureEnabled: false, animation: 'fade' }} />
      </Stack>
    </BookingDraftProvider>
  );
}
