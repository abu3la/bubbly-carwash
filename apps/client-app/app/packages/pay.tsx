import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow, SectionLabel } from '../../src/components/Bits';
import { PayMethods } from '../../src/components/PayMethods';
import type { PayMethod } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { packageById } from '../../src/session';

export default function PayForPackage() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pkg = packageById(Number(id));
  const [method, setMethod] = useState<PayMethod['key']>('mada');
  const copy = useCopy();

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.payment} onBack={() => router.back()} />

      <View style={styles.body}>
        <View>
          <SectionLabel>{copy.booking.choosePayment}</SectionLabel>
          <PayMethods selected={method} onSelect={setMethod} />
        </View>

        <View style={styles.ledger}>
          <LedgerRow label={copy.packages.lineItem(pkg.washes)} amount={copy.common.money(pkg.price)} />
          <LedgerRow label={copy.common.totalWithVat} amount={copy.common.money(pkg.price)} strong />
        </View>

        <View style={styles.secure}>
          <ShieldCheck size={theme.scale(14)} color={theme.text.muted} strokeWidth={2} />
          <Txt variant="caption" tone="muted" style={styles.secureText}>
            {copy.packages.creditNote}
          </Txt>
        </View>

        <Button
          label={copy.booking.payAmount(copy.common.money(pkg.price))}
          size="lg"
          fullWidth
          onPress={() => router.push(`/packages/processing?id=${pkg.id}`)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  ledger: { gap: theme.spacing[2] + 1 },
  secure: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  secureText: { flexShrink: 1 },
}));
