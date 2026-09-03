import { useState } from 'react';
import { View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Badge, BeatIcon, Button, Card, Dialog, Num, Screen, Txt, useToast } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow, SectionLabel } from '../../src/components/Bits';
import { CUSTOMER } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';

export default function ClubDashboard() {
  const router = useRouter();
  const session = useSession();
  const toast = useToast();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const copy = useCopy();
  const { club } = session;

  if (!club) return <Redirect href="/club" />;

  const usedThisWeek = 0;

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.club.title} onBack={() => router.back()} />

      <View style={styles.body}>
        {/* The membership card: the one dark surface in the flow. */}
        <Card variant="dark" style={styles.card}>
          <View style={styles.cardTop}>
            <Txt variant="caption" weight="bold" style={styles.gold}>
              {copy.club.title} · {copy.plans[club.planId]}
            </Txt>
            <BeatIcon size="sm" active={3} />
          </View>

          <View style={styles.member}>
            <Txt variant="caption" tone="inverseSoft">
              {copy.club.member}
            </Txt>
            <View style={styles.memberName}>
              <Txt variant="heading" weight="bold" tone="inverse">
                {copy.customerName}
              </Txt>
              <Num variant="small" tone="inverseSoft">
                · {CUSTOMER.memberNo}
              </Num>
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Txt variant="caption" tone="inverseSoft" style={styles.renews}>
              {copy.club.renewsLine(copy.renewalDate, copy.common.money(club.price))}
            </Txt>
            <Badge tone="yellow">{copy.club.creditsAvailable(club.credits)}</Badge>
          </View>
        </Card>

        <Card style={styles.usage}>
          <SectionLabel>{copy.club.usageThisWeek}</SectionLabel>
          <View style={styles.meterRow}>
            <View style={styles.meterTrack}>
              <View style={styles.meterFill(usedThisWeek / club.weekly)} />
            </View>
            <Num variant="small" weight="bold">
              {copy.club.usageOf(usedThisWeek, club.weekly)}
            </Num>
          </View>

          <View style={styles.ledger}>
            <LedgerRow label={copy.club.cycleCredits} amount={copy.club.washesCount(club.credits)} />
            <LedgerRow label={copy.club.rolledOver} amount="0" muted />
            <LedgerRow label={copy.club.preferredSlot} amount={copy.club.preferredSlotValue} muted />
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            label={copy.club.bookFromClub}
            size="lg"
            fullWidth
            onPress={() => router.replace('/book/service')}
          />
          <Button
            label={copy.club.pause}
            variant="secondary"
            fullWidth
            onPress={() => toast.show(copy.club.paused, 'verified')}
          />
          <Button label={copy.club.cancelSubscription} variant="ghost" fullWidth onPress={() => setConfirmCancel(true)} />
        </View>
      </View>

      <Dialog
        open={confirmCancel}
        title={copy.club.cancelTitle}
        body={copy.club.cancelBody(club.credits, copy.renewalDate)}
        onClose={() => setConfirmCancel(false)}
        actions={
          <>
            <Button label={copy.club.keep} variant="secondary" onPress={() => setConfirmCancel(false)} />
            <Button
              label={copy.club.confirmCancel}
              onPress={() => {
                session.leaveClub();
                setConfirmCancel(false);
                toast.show(copy.club.cancelled, 'washed');
                router.replace('/(tabs)/home');
              }}
            />
          </>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[4] },
  card: { padding: theme.spacing[5] + 2, gap: theme.spacing[5] },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing[3] },
  gold: { color: theme.palette.yellow },
  member: { gap: 2 },
  memberName: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing[2], flexWrap: 'wrap' },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: theme.spacing[3] },
  renews: { flexShrink: 1 },
  usage: { gap: theme.spacing[3] },
  meterRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  meterTrack: {
    flex: 1,
    height: theme.scale(10),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.surface.bookingSoft,
    overflow: 'hidden',
  },
  // Width-driven with a rounded track, so the cap never changes shape.
  meterFill: (ratio: number) => ({
    width: `${Math.min(100, Math.max(0, ratio * 100))}%`,
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.action.primary,
  }),
  ledger: { gap: theme.spacing[2] },
  actions: { gap: theme.spacing[2] },
}));
