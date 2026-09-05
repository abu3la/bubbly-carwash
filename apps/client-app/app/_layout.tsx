import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
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
import { LocaleProvider, ToastProvider } from '@bubbles/ui-native';
import { theme } from '@bubbles/ui-native/theme';
import { Boot } from '../src/components/Boot';
import { loadLanguage } from '../src/language';
import { CatalogueProvider } from '../src/catalogue';
import { SessionProvider, useSession } from '../src/session';
import { AuthSessionProvider, useAuthSession } from '../src/authSession';
import { BookingDraftProvider, useBookingDraft } from '../src/bookingDraft';
import { ClubDraftProvider, useClubDraft } from '../src/clubDraft';
import { CustomerDataProvider, useCustomerData } from '../src/customerData';
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
            <AuthGate><PurchaseDrafts><Stack
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
            </Stack></PurchaseDrafts></AuthGate>
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
  const router = useRouter();
  const navigation = useRootNavigationState();
  const restoring = useRef(true);
  const publicOnboarding = segments[0] === 'onboarding'
    && (!segments[1] || segments[1] === 'index' || segments[1] === 'phone' || segments[1] === 'otp');
  useEffect(() => {
    if (loading || !navigation?.key) return;
    const restored = restoring.current;
    restoring.current = false;
    if (!session && !publicOnboarding) router.replace('/onboarding');
    // The index route may reach onboarding while disk storage is loading.
    // Restore an existing customer without interrupting a fresh OTP flow.
    else if (restored && session && publicOnboarding) router.replace('/(tabs)/home');
  }, [loading, navigation?.key, publicOnboarding, router, session]);
  const blocked = loading || (!session && !publicOnboarding);
  return <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }} accessibilityElementsHidden={blocked} importantForAccessibility={blocked ? 'no-hide-descendants' : 'auto'}>{children}</View>
    {blocked ? <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface.page }}><ActivityIndicator /></View> : null}
  </View>;
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

/** Keep an in-progress purchase while the customer adds a car or villa in onboarding. */
function PurchaseDrafts({ children }: { children: ReactNode }) {
  const { membership } = useCustomerData();
  return <BookingDraftProvider sources={membership ? ['club', 'cash'] : ['cash']}>
    <ClubDraftProvider><ResetPurchaseDrafts />{children}</ClubDraftProvider>
  </BookingDraftProvider>;
}

/** Clear account-owned drafts without remounting their navigator. */
function ResetPurchaseDrafts() {
  const { session } = useAuthSession();
  const { reset: resetBooking } = useBookingDraft();
  const { reset: resetClub } = useClubDraft();
  const previousUser = useRef(session?.userId);
  useLayoutEffect(() => {
    if (previousUser.current === session?.userId) return;
    previousUser.current = session?.userId;
    resetBooking();
    resetClub();
  }, [resetBooking, resetClub, session?.userId]);
  return null;
}
