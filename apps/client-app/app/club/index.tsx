import { useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { useCopy } from '../../src/i18n';
import { useCustomerData } from '../../src/customerData';
import { useCatalogueStatus } from '../../src/catalogue';
import { useClubDraft } from '../../src/clubDraft';

export default function MonthlyPackages() {
  const router = useRouter();
  const { language } = useLocale();
  const ar = language === 'ar';
  const copy = useCopy();
  const { catalogue, loading, error, reload } = useCatalogueStatus();
  const { membership, loading: customerLoading } = useCustomerData();
  const draft = useClubDraft();
  const [selectedWeekly, setSelectedWeekly] = useState(2);
  const plans = catalogue?.plans ?? [];
  const frequencies = [...new Set(plans.map((plan) => plan.weekly))].sort((a, b) => a - b);
  const weekly = frequencies.includes(selectedWeekly) ? selectedWeekly : frequencies[0];
  const choices = plans.filter((plan) => plan.weekly === weekly);
  if (membership) return <Redirect href="/club/dashboard" />;
  if (customerLoading) return <Screen contentStyle={styles.page}>
    <FlowHeader title={copy.club.title} onBack={() => router.back()} />
    <View style={styles.body}><Txt variant="body" tone="secondary">{ar ? 'نحمّل بيانات اشتراكك…' : 'Loading your subscription…'}</Txt></View>
  </Screen>;

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.club.title} onBack={() => router.back()} />
      <View style={styles.body}>
        <View style={styles.intro}>
          <Txt variant="title" weight="bold">{ar ? 'غسيل منتظم، لمدة شهر' : 'Regular washes for a month'}</Txt>
          <Txt variant="body" tone="secondary">{ar ? 'اختر عدد غسلاتك الأسبوعية، ثم نوع الغسيل. سعر الباقة يغطي دورة 30 يومًا.' : 'Choose your weekly frequency, then your wash. Each package price covers a 30-day cycle.'}</Txt>
        </View>
        {loading ? <Txt variant="small" tone="secondary">{ar ? 'نحمّل الباقات والأسعار…' : 'Loading packages and prices…'}</Txt> : null}
        {error ? <View style={styles.intro}>
          <Txt variant="small" tone="danger">{ar ? 'تعذّر تحميل الأسعار. أعد المحاولة لعرض الباقات.' : 'Prices could not be loaded. Retry to view the packages.'}</Txt>
          <Button label={ar ? 'إعادة تحميل الباقات' : 'Reload packages'} fullWidth onPress={() => void reload()} />
        </View> : null}
        {!loading && !error && !plans.length ? <Txt variant="body" tone="secondary">{ar ? 'لا توجد باقات متاحة حاليًا.' : 'No packages are available right now.'}</Txt> : null}
        {!loading && !error && plans.length ? <>
          <View style={styles.frequency}>
            {frequencies.map((count) => <Pressable key={count} accessibilityRole="radio" accessibilityState={{ selected: weekly === count }} onPress={() => setSelectedWeekly(count)} style={({ pressed }) => styles.frequencyOption(weekly === count, pressed)}>
              <Num variant="title" weight="bold" tone={weekly === count ? 'inverse' : 'primary'}>{count}</Num>
              <Txt variant="small" weight="semibold" tone={weekly === count ? 'inverseSoft' : 'secondary'}>{ar ? 'غسلات أسبوعيًا' : 'washes a week'}</Txt>
            </Pressable>)}
          </View>
          {choices.map((plan) => <Card key={plan.id} style={styles.plan}>
            <View style={styles.planTop}>
              <View style={styles.planName}>
                <Txt variant="heading" weight="bold">{plan.name[language]}</Txt>
                <Txt variant="body" tone="secondary">{plan.serviceKey === 'full' ? (ar ? 'غسيل داخلي وخارجي' : 'Interior and exterior wash') : (ar ? 'غسيل خارجي' : 'Exterior wash')}</Txt>
              </View>
              <View style={styles.price}>
                <Num variant="heading" weight="bold">{plan.priceMinor / 100}</Num>
                <Txt variant="caption" tone="secondary">{ar ? 'ر.س / 30 يومًا' : 'SAR / 30 days'}</Txt>
              </View>
            </View>
            <Txt variant="small" tone="secondary">{ar ? `${plan.weekly === 2 ? 'موعدان أسبوعيان ثابتان' : 'ثلاثة مواعيد أسبوعية ثابتة'} طوال الدورة.` : `${plan.weekly} weekly appointments repeat every 7 days during your cycle.`}</Txt>
            <Button label={ar ? `اشترك في ${plan.name.ar}` : `Subscribe to ${plan.name.en}`} fullWidth onPress={() => { draft.reset(); draft.setPlanId(plan.id); router.push('/club/schedule'); }} />
          </Card>)}
          <View style={styles.terms}>
            <Txt variant="body" weight="semibold">{ar ? 'الخدمة في شربتلي فيلج' : 'Serving Sharbatly Village'}</Txt>
            <Txt variant="small" tone="secondary">{ar ? 'نتحقق من موقعك ورقم الفيلا لتأكيد التغطية قبل اختيار مواعيدك.' : 'We check your location and villa number to confirm coverage before you choose your appointments.'}</Txt>
          </View>
        </> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[4] },
  intro: { gap: theme.spacing[2] },
  frequency: { flexDirection: 'row', gap: theme.spacing[2] },
  frequencyOption: (selected: boolean, pressed: boolean) => ({ flex: 1, minHeight: theme.scale(92), padding: theme.spacing[3], justifyContent: 'center', alignItems: 'center', gap: 2, borderRadius: theme.radius.md, backgroundColor: selected ? theme.surface.dark : pressed ? theme.surface.booking : theme.surface.bookingSoft }),
  plan: { gap: theme.spacing[4] },
  planTop: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[3] },
  planName: { flex: 1, gap: theme.spacing[1] },
  price: { alignItems: 'flex-end', gap: 2 },
  terms: { gap: theme.spacing[2], paddingVertical: theme.spacing[2] },
}));
