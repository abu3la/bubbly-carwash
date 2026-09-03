import { Stack } from 'expo-router';
import { theme } from '@sama/ui-native/theme';
import { ClubDraftProvider } from '../../src/clubDraft';

export default function ClubLayout() {
  return (
    <ClubDraftProvider><Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.surface.page },
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen name="processing" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="payment" options={{ gestureEnabled: false, animation: 'fade' }} />
    </Stack></ClubDraftProvider>
  );
}
