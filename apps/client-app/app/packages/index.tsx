import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Badge, Card, Num, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { Stagger } from '../../src/components/Bits';
import { PACKAGES } from '../../src/content';
import { useCatalogue } from '../../src/catalogue';
import { useCopy } from '../../src/i18n';

export default function PackageList() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const copy = useCopy();
  const live = useCatalogue();

  // Server prices when they have arrived, the bundled list until then. The
  // shapes differ — the API speaks halalas, `content.ts` speaks riyals — so
  // they are normalised to one shape here rather than at every use.
  const packages = live
    ? live.packages.map((p) => ({
        id: p.id,
        washes: p.washes,
        price: p.priceMinor / 100,
        per: p.perMinor / 100,
        save: `${p.savePct}%`,
        best: p.best,
      }))
    : PACKAGES;

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.packages.title} onBack={() => router.back()} />

      <View style={styles.body}>
        <Txt variant="small" tone="secondary">
          {copy.packages.blurb}
        </Txt>

        {packages.map((pkg, i) => (
          <Stagger key={pkg.id} index={i}>
            <Card
              onPress={() => router.push(`/packages/${pkg.id}`)}
              selected={pkg.best}
              style={styles.row}
            >
              {/* The wash count is the thing you are buying, so it leads. */}
              <View style={styles.count}>
                <Num variant="title" weight="bold">
                  {pkg.washes}
                </Num>
                <Txt variant="label" weight="semibold" tone="muted">
                  {copy.packages.washes}
                </Txt>
              </View>

              <View style={styles.text}>
                <View style={styles.priceLine}>
                  <Num variant="body" weight="bold">
                    {copy.common.money(pkg.price)}
                  </Num>
                  {pkg.best ? <Badge tone="yellow">{copy.packages.bestValue}</Badge> : null}
                </View>
                {/* The saving is a figure, so it sits in `Num` rather than inside
                    the sentence: a percent sign left in Arabic prose resolves to
                    the paragraph's direction and jumps to the wrong side of its
                    digits ("توفير %12"). */}
                <View style={styles.meta}>
                  <Txt variant="caption" tone="secondary">
                    {copy.packages.perWash(pkg.per)}
                  </Txt>
                  <Txt variant="caption" tone="secondary">
                    {copy.packages.saveLabel}
                  </Txt>
                  <Num variant="caption" weight="semibold" tone="secondary">
                    {pkg.save}
                  </Num>
                </View>
              </View>

              <ChevronLeft size={theme.scale(18)} color={theme.text.muted} strokeWidth={2} />
            </Card>
          </Stagger>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] + 2 },
  count: { width: theme.scale(52), alignItems: 'center' },
  text: { flex: 1, gap: 2 },
  priceLine: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2], flexWrap: 'wrap' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 1, flexWrap: 'wrap' },
}));
