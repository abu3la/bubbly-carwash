import { Redirect, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Card, Num, Screen, Txt, useLocale } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { useCopy } from '../../src/i18n';
import { useCustomerData } from '../../src/customerData';
import { useCatalogue } from '../../src/catalogue';
import { useClubDraft } from '../../src/clubDraft';

const FALLBACK_PLANS = [
  { id: 'basic', name: { ar: 'أساسي', en: 'Basic' }, serviceKey: 'exterior' as const, priceMinor: 19900, credits: 2, weekly: 2, roll: 0, best: false },
  { id: 'basic-3', name: { ar: 'أساسي', en: 'Basic' }, serviceKey: 'exterior' as const, priceMinor: 26900, credits: 3, weekly: 3, roll: 0, best: false },
  { id: 'plus', name: { ar: 'سوبر ووش', en: 'Super Wash' }, serviceKey: 'full' as const, priceMinor: 29900, credits: 2, weekly: 2, roll: 0, best: false },
  { id: 'plus-3', name: { ar: 'سوبر ووش', en: 'Super Wash' }, serviceKey: 'full' as const, priceMinor: 39900, credits: 3, weekly: 3, roll: 0, best: true },
];

export default function ClubPlans() {
  const router = useRouter();
  const { language } = useLocale();
  const copy = useCopy();
  const catalogue = useCatalogue();
  const { membership } = useCustomerData();
  const draft = useClubDraft();
  if (membership) return <Redirect href="/club/dashboard" />;
  const plans = catalogue?.plans ?? FALLBACK_PLANS;
  const families = [
    { key: 'basic', title: ar(language) ? 'أساسي' : 'Basic', plans: plans.filter((plan) => plan.id === 'basic' || plan.id === 'basic-3') },
    { key: 'plus', title: ar(language) ? 'سوبر ووش' : 'Super Wash', plans: plans.filter((plan) => plan.id === 'plus' || plan.id === 'plus-3') },
  ];

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.club.title} onBack={() => router.back()} />
      <View style={styles.body}>
        <Txt variant="small" tone="secondary">
          {language === 'ar' ? 'اختر عدد غسلاتك الأسبوعية. الموعد الذي يمر لا يتحول إلى رصيد ولا ينتقل لأسبوع آخر.' : 'Choose your weekly washes. A missed appointment does not become credit or roll into another week.'}
        </Txt>
        {families.map((family) => (
          <Card key={family.key} style={styles.plan}>
            <View style={styles.planHeading}>
              <Txt variant="heading" weight="bold">{family.title}</Txt>
              <Txt variant="small" tone="secondary">
                {language === 'ar'
                  ? `${family.plans[0]?.serviceKey === 'full' ? 'غسيل داخلي وخارجي' : 'غسيل خارجي'} · اختر غسلتين أو 3 أسبوعيًا.`
                  : `${family.plans[0]?.serviceKey === 'full' ? 'Inside and outside' : 'Exterior wash'} · choose two or three weekly.`}
              </Txt>
            </View>
            <View style={styles.options}>
              {family.plans.sort((a, b) => a.weekly - b.weekly).map((plan) => (
                <Pressable
                  key={plan.id}
                  accessibilityRole="button"
                  onPress={() => {
                    draft.reset();
                    draft.setPlanId(plan.id);
                    router.push('/club/schedule');
                  }}
                  style={({ pressed }) => styles.option(pressed)}
                >
                  <Txt variant="body" weight="semibold">
                    {language === 'ar' ? `${plan.weekly} غسلات أسبوعيًا` : `${plan.weekly} washes weekly`}
                  </Txt>
                  <View style={styles.price}>
                    <Num variant="body" weight="bold">{copy.common.money(plan.priceMinor / 100)}</Num>
                    <Txt variant="caption" tone="muted">{copy.common.monthly}</Txt>
                  </View>
                </Pressable>
              ))}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  plan: { minHeight: theme.scale(184), gap: theme.spacing[4] },
  planHeading: { minHeight: theme.scale(64), gap: theme.spacing[1] },
  options: { gap: theme.spacing[2] },
  option: (pressed: boolean) => ({
    minHeight: theme.scale(58),
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
    borderRadius: theme.radius.sm,
    backgroundColor: pressed ? theme.surface.booking : theme.surface.bookingSoft,
  }),
  price: { minWidth: theme.scale(94), alignItems: 'flex-end' },
}));

function ar(language: string) {
  return language === 'ar';
}
