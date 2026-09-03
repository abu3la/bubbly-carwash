import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { DirectionRoot, LocaleProvider, ToastProvider } from '@sama/ui-native';
import { theme } from '@sama/ui-native/theme';
import { SessionProvider } from '../src/session';

export default function RootLayout() {
  // Fonts are loaded but never gated on: a technician standing beside a car
  // must not stare at a blank screen because a webfont is slow. The system
  // face renders first and is replaced when the real one arrives.
  useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Arabic only, so the direction is fixed rather than chosen. */}
        <LocaleProvider language="ar">
          <DirectionRoot>
            <ToastProvider>
              <SessionProvider>
                <StatusBar style="dark" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.surface.page },
                    animation: 'slide_from_left',
                  }}
                />
              </SessionProvider>
            </ToastProvider>
          </DirectionRoot>
        </LocaleProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
