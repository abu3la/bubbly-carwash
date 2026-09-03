import { Redirect, useRouter } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Badge, Card, Num, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel, Stagger, TickRow } from '../../src/components/Bits';
import { PLANS } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';

export default function ClubPlans() {
  const router = useRouter();
  const { club } = useSession();
  const copy = useCopy();

  // A member's entry point is their dashboard, not the sales page.
  if (club) return <Redirect href="/club/dashboard" />;

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.club.title} onBack={() => router.back()} />

      <View style={styles.body}>
        <Txt variant="small" tone="secondary">
          {copy.club.blurb}
        </Txt>

        {PLANS.map((plan, i) => (
          <Stagger key={plan.id} index={i}>
            <Card
              onPress={() => router.push(`/club/review?plan=${plan.id}`)}
              selected={plan.best}
              style={styles.plan}
            >
              <View style={styles.planTop}>
                <View style={styles.planName}>
                  <Txt variant="heading" weight="bold">
                    {copy.plans[plan.id]}
                  </Txt>
                  {plan.best ? <Badge tone="yellow">{copy.club.mostPopular}</Badge> : null}
                </View>
                <View style={styles.planPrice}>
                  <Num variant="heading" weight="bold">
                    {copy.common.money(plan.price)}
                  </Num>
                  <Txt variant="caption" tone="muted">
                    {copy.common.monthly}
                  </Txt>
                </View>
              </View>
              <Txt variant="small" tone="secondary">
                {copy.club.planLine(plan.credits, plan.weekly, plan.roll)}
              </Txt>
            </Card>
          </Stagger>
        ))}

        <View>
          <SectionLabel>{copy.club.perksSection}</SectionLabel>
          <Card style={styles.perks}>
            {copy.club.perks.map((perk) => (
              <TickRow key={perk}>{perk}</TickRow>
            ))}
          </Card>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  plan: { gap: theme.spacing[2] },
  planTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.spacing[3] },
  planName: { flexShrink: 1, gap: theme.spacing[1], flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  // The price column holds its own end edge across all three plans.
  planPrice: { alignItems: 'flex-end', flexShrink: 0 },
  perks: { gap: theme.spacing[3], marginTop: theme.spacing[2] },
}));
