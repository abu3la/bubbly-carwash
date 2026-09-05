import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { API_ORIGIN } from '../api';
import { FlowHeader } from './FlowHeader';

type CheckoutResult = 'success' | 'cancel';

interface MoyasarCheckoutProps {
  checkoutUrl: string;
  onResult: (result: CheckoutResult) => void;
}

function isMoyasarCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'checkout.moyasar.com';
  } catch {
    return false;
  }
}

/**
 * Keeps Moyasar's hosted checkout inside the app. Card fields and 3DS stay on
 * Moyasar/bank pages; this component only watches our own HTTPS return route.
 * The caller must still ask the API to verify the invoice before granting the
 * booking or membership.
 */
export function MoyasarCheckout({ checkoutUrl, onResult }: MoyasarCheckoutProps) {
  const { language } = useLocale();
  const ar = language === 'ar';
  const handled = useRef(false);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const trustedCheckoutUrl = isMoyasarCheckoutUrl(checkoutUrl);

  const finish = useCallback((result: CheckoutResult) => {
    if (handled.current) return;
    handled.current = true;
    onResult(result);
  }, [onResult]);

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      finish('cancel');
      return true;
    });
    return () => back.remove();
  }, [finish]);

  const inspectNavigation = useCallback((url: string) => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'bubblescarwash:') {
        finish(parsed.searchParams.get('result') === 'success' ? 'success' : 'cancel');
        return false;
      }
      if (parsed.origin === API_ORIGIN && parsed.pathname === '/payments/return') {
        finish(parsed.searchParams.get('result') === 'success' ? 'success' : 'cancel');
        return false;
      }
      return parsed.protocol === 'https:' || parsed.protocol === 'about:';
    } catch {
      return false;
    }
  }, [finish]);

  if (!trustedCheckoutUrl || failed) {
    return (
      <Screen contentStyle={styles.error}>
        <Txt variant="heading" weight="bold" center>
          {ar ? 'تعذر تحميل صفحة الدفع' : 'Could not load payment'}
        </Txt>
        <Txt variant="small" tone="secondary" center>
          {ar ? 'تحقق من اتصالك ثم أعد المحاولة. لم يتم تأكيد العملية.' : 'Check your connection and try again. Nothing has been confirmed.'}
        </Txt>
        {trustedCheckoutUrl ? (
          <Button
            label={ar ? 'إعادة المحاولة' : 'Try again'}
            fullWidth
            onPress={() => {
              handled.current = false;
              setFailed(false);
              setReloadKey((value) => value + 1);
            }}
          />
        ) : null}
        <Button label={ar ? 'إلغاء الدفع' : 'Cancel payment'} variant="ghost" fullWidth onPress={() => finish('cancel')} />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.screen}>
      <FlowHeader
        title={ar ? 'الدفع الآمن' : 'Secure payment'}
        onBack={() => finish('cancel')}
      />
      <View style={styles.browser}>
        <WebView
          key={reloadKey}
          source={{ uri: checkoutUrl }}
          originWhitelist={['https://*']}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          mixedContentMode="never"
          startInLoadingState
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={(request) => inspectNavigation(request.url)}
          onError={() => setFailed(true)}
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator />
              <Txt variant="small" tone="secondary">
                {ar ? 'نحمّل وسائل الدفع من ميسر…' : 'Loading Moyasar payment methods…'}
              </Txt>
            </View>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { paddingBottom: 0 },
  browser: {
    flex: 1,
    marginTop: theme.spacing[3],
    backgroundColor: theme.surface.card,
  },
  loading: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.surface.card,
  },
  error: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
  },
}));
