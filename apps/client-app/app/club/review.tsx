import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Checkbox, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow, SectionLabel } from '../../src/components/Bits';
import { PayMethods } from '../../src/components/PayMethods';
import type { PayMethod, Plan } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { planById } from '../../src/session';

export default function ClubReview() {
  const router = useRouter();
  const { plan: planId } = useLocalSearchParams<{ plan: Plan['id'] }>();
  const plan = planById(planId);
  const [method, setMethod] = useState<PayMethod['key']>('mada');
  const [consented, setConsented] = useState(false);
  const copy = useCopy();

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.club.reviewTitle} onBack={() => router.back()} />

      <View style={styles.body}>
        <Card variant="booking" style={styles.summary}>
          <Txt variant="heading" weight="bold">
            {copy.plans[plan.id]}
          </Txt>
          <Txt variant="small" tone="secondary">
            {copy.club.planLine(plan.credits, plan.weekly, plan.roll)}
          </Txt>
        </Card>

        <View>
          <SectionLabel>{copy.club.paymentSection}</SectionLabel>
          <PayMethods selected={method} onSelect={setMethod} />
        </View>

        <View style={styles.ledger}>
          <LedgerRow label={copy.club.monthlyFee} amount={copy.common.money(plan.price)} />
          <LedgerRow label={copy.club.firstRenewal} amount={copy.renewalDate} muted />
          <LedgerRow label={copy.common.totalWithVat} amount={copy.common.money(plan.price)} strong />
        </View>

        {/* Recurring billing needs explicit, unticked consent — the button
            stays disabled until it is given. */}
        <Card style={styles.consent}>
          <Checkbox
            label={copy.club.consent(copy.common.money(plan.price))}
            checked={consented}
            onChange={setConsented}
          />
        </Card>

        <Button
          label={copy.club.activate}
          size="lg"
          fullWidth
          disabled={!consented}
          onPress={() => router.push(`/club/processing?plan=${plan.id}`)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  summary: { gap: theme.spacing[1] },
  ledger: { gap: theme.spacing[2] + 1 },
  consent: { backgroundColor: theme.palette.yellow100 },
}));
