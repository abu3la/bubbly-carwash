import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel, TickRow } from '../../src/components/Bits';
import { useCopy } from '../../src/i18n';
import { packageById } from '../../src/session';

export default function PackageDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pkg = packageById(Number(id));
  const copy = useCopy();

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.packages.detailTitle(pkg.washes)} onBack={() => router.back()} />

      <View style={styles.body}>
        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Txt variant="heading" weight="bold">
              {copy.packages.exteriorWashes(pkg.washes)}
            </Txt>
            <View style={styles.saving}>
              <Txt variant="small" tone="secondary">
                {copy.packages.savingLine(pkg.per)}
              </Txt>
              <Num variant="small" weight="semibold" tone="secondary">
                {pkg.save}
              </Num>
            </View>
          </View>
          <Num variant="title" weight="bold">
            {copy.common.money(pkg.price)}
          </Num>
        </View>

        <View>
          <SectionLabel>{copy.packages.rulesSection}</SectionLabel>
          <Card style={styles.rules}>
            {copy.packages.rules.map((rule) => (
              <TickRow key={rule}>{rule}</TickRow>
            ))}
          </Card>
        </View>

        <Button
          label={copy.packages.buy(copy.common.money(pkg.price))}
          size="lg"
          fullWidth
          onPress={() => router.push(`/packages/pay?id=${pkg.id}`)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  saving: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  hero: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
    padding: theme.spacing[5],
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    backgroundColor: theme.surface.booking,
  },
  heroText: { flexShrink: 1, gap: 2 },
  rules: { gap: theme.spacing[3] },
}));
