import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Screen, Txt, useLocale } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow } from '../../src/components/Bits';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';

export default function Pay() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const draft = useBookingDraft();
  const copy = useCopy();
  const { language } = useLocale();
  const ar = language === 'ar';

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.payment} step={5} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        <Card style={styles.gateway}>
          <Txt variant="body" weight="bold">{ar ? 'الدفع عبر ميسر' : 'Payment through Moyasar'}</Txt>
          <Txt variant="small" tone="secondary">
            {ar ? 'ستظهر وسائل الدفع المتاحة فعليًا لحساب المتجر داخل التطبيق في صفحة ميسر الآمنة.' : 'The payment methods enabled for the merchant account will appear inside the app on Moyasar’s secure page.'}
          </Txt>
        </Card>

        <LedgerRow label={copy.common.totalWithVat} amount={copy.common.money(draft.total)} strong />

        <View style={styles.secure}>
          <ShieldCheck size={theme.scale(14)} color={theme.text.muted} strokeWidth={2} />
          <Txt variant="caption" tone="muted" style={styles.secureText}>
            {copy.common.securePayment}
          </Txt>
        </View>

        <Button
          label={copy.booking.payAmount(copy.common.money(draft.total))}
          size="lg"
          fullWidth
          onPress={() => router.push('/book/processing')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  gateway: { gap: theme.spacing[2] },
  secure: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  secureText: { flexShrink: 1 },
}));
