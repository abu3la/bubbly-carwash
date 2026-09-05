import { Stack } from 'expo-router';
import { theme } from '@bubbles/ui-native/theme';

/** Six steps, each a real route — so back always means "the previous step". */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.surface.page },
        animation: 'slide_from_left',
      }}
    />
  );
}
