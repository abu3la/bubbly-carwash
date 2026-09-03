import { useEffect, type ReactNode } from 'react';
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { LocaleProvider, ToastProvider } from '@sama/ui-native';
import { theme } from '@sama/ui-native/theme';
import { Boot } from '../src/components/Boot';
import { loadLanguage } from '../src/language';
import { CatalogueProvider } from '../src/catalogue';
import { SessionProvider, useSession } from '../src/session';
import { AuthSessionProvider, useAuthSession } from '../src/authSession';
import { CustomerDataProvider } from '../src/customerData';
import { registerFirebaseMessaging } from '../src/firebase';

SplashScreen.preventAutoHideAsync().catch(() => {
  /* already hidden on a fast reload — nothing to recover */
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  // The app renders immediately and never waits on the fonts: text shows in
  // the system face for the first frames and swaps when the family lands. A
  // font that hangs or fails can therefore never leave a blank app — the
  // splash simply stays until we know either way.
  const fontsSettled = loaded || !!error;
  useEffect(() => {
    if (fontsSettled) SplashScreen.hideAsync().catch(() => {});
  }, [fontsSettled]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthSessionProvider>
          <FirebaseRegistration />
          <CustomerDataProvider>
          <CatalogueProvider>
          <SessionProvider>
          <Localised>
            <StatusBar style="dark" />
            <AuthGate><Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.surface.page },
                // Every push is a real native slide with an interactive
                // back-swipe — the flows are navigation, not view swapping.
                animation: 'slide_from_left',
                gestureEnabled: true,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(tabs)" />
              {/* The three purchase flows are modals over the tabs, so the tab
                  you came from is still there when you close them. */}
              <Stack.Screen name="book" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="packages" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="club" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </Stack></AuthGate>
          </Localised>
          </SessionProvider>
          </CatalogueProvider>
          </CustomerDataProvider>
        </AuthSessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function FirebaseRegistration() {
  const { session } = useAuthSession();
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

function AuthGate({ children }: { children: ReactNode }) {
  const { loading, session } = useAuthSession();
  const segments = useSegments() as string[];
  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }
  const publicOnboarding = segments[0] === 'onboarding'
    && (!segments[1] || segments[1] === 'index' || segments[1] === 'phone' || segments[1] === 'otp');
  if (!session && !publicOnboarding) return <Redirect href="/onboarding/phone" />;
  return children;
}

/**
 * Feeds the design system the customer's chosen language, so every piece of
 * text aligns to it. Sits inside SessionProvider because that is where the
 * language lives, and outside the navigator so a change reaches every screen.
 */
function Localised({ children }: { children: React.ReactNode }) {
  const { language, restoreLanguage } = useSession();

  // The stored choice arrives a tick after the first frame. Until then the
  // app renders in the Arabic default rather than waiting — nothing is gated
  // on the read.
  useEffect(() => {
    void loadLanguage().then(restoreLanguage);
  }, [restoreLanguage]);

  return (
    <LocaleProvider language={language}>
      {/* Boot owns the splash and the direction root: a language change goes
          back through start-up rather than mutating the live interface. */}
      <Boot>
        <ToastProvider>{children}</ToastProvider>
      </Boot>
    </LocaleProvider>
  );
}
