import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow, SectionLabel } from '../../src/components/Bits';
import { PayMethods } from '../../src/components/PayMethods';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';

export default function Pay() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const draft = useBookingDraft();
  const copy = useCopy();

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.payment} step={5} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        <View>
          <SectionLabel>{copy.booking.choosePayment}</SectionLabel>
          <PayMethods selected={draft.method} onSelect={draft.setMethod} />
        </View>

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
  secure: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  secureText: { flexShrink: 1 },
}));
