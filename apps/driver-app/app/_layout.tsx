import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
import { DirectionRoot, LocaleProvider, ToastProvider } from '@bubbles/ui-native';
import { theme } from '@bubbles/ui-native/theme';
import { SessionProvider, useSession } from '../src/session';
import { registerFirebaseMessaging } from '../src/firebase';

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
                <FirebaseRegistration />
                <StatusBar style="dark" />
                <DriverAuthGate>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: theme.surface.page },
                      animation: 'slide_from_left',
                    }}
                  />
                </DriverAuthGate>
              </SessionProvider>
            </ToastProvider>
          </DirectionRoot>
        </LocaleProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function DriverAuthGate({ children }: { children: ReactNode }) {
  const { ready, session } = useSession();
  const segments = useSegments() as string[];
  const router = useRouter();
  const navigation = useRootNavigationState();
  const signInScreen = segments.length === 0 || segments[0] === 'index';
  useEffect(() => {
    if (ready && navigation?.key && !session && !signInScreen) router.replace('/');
  }, [navigation?.key, ready, router, session, signInScreen]);
  const blocked = !ready || (!session && !signInScreen);
  return <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }} accessibilityElementsHidden={blocked} importantForAccessibility={blocked ? 'no-hide-descendants' : 'auto'}>{children}</View>
    {blocked ? <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface.page }}><ActivityIndicator /></View> : null}
  </View>;
}

function FirebaseRegistration() {
  const { session } = useSession();
  const router = useRouter();
  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | null = null;
    if (session) void registerFirebaseMessaging((route) => router.push(route as never))
      .then((listener) => {
        if (disposed) listener?.();
        else unsubscribe = listener;
      })
      .catch((error) => console.warn('[fcm] registration failed', error));
    return () => { disposed = true; unsubscribe?.(); };
  }, [router, session]);
  return null;
}
