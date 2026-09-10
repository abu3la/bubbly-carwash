// Explicit development entry; never substitutes authentication in the real app.
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium, IBMPlexSansArabic_600SemiBold, IBMPlexSansArabic_700Bold } from '@expo-google-fonts/ibm-plex-sans-arabic';
import { Button, DirectionRoot, LocaleProvider, Screen } from '@bubbles/ui-native';
import { MoyasarCheckout } from './components/MoyasarCheckout';
function CheckoutPreview() {
  useFonts({ IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium, IBMPlexSansArabic_600SemiBold, IBMPlexSansArabic_700Bold });
  const [open, setOpen] = useState(true);
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><LocaleProvider language="ar"><DirectionRoot><StatusBar style="dark" />
    {open ? <MoyasarCheckout checkoutUrl="http://localhost:4189/" onResult={() => setOpen(false)} /> : <Screen><Button label="معاينة الدفع" onPress={() => setOpen(true)} /></Screen>}
  </DirectionRoot></LocaleProvider></SafeAreaProvider></GestureHandlerRootView>;
}
registerRootComponent(CheckoutPreview);
