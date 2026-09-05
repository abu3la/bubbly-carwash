import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, Button, Num, Screen, Txt } from '@bubbles/ui-native';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';

/** Three useful introductions. Navigation responds to a choice; content never waits on a reveal. */
export default function Welcome() {
  const router = useRouter();
  const session = useSession();
  const copy = useCopy();
  const ar = session.language === 'ar';
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const pages = ar ? [
    { title: 'غسيلك عند بيتك', body: 'نبدأ في شربتلي فيلج، جدة. حدّد موقعك وأدخل رقم الفيلا لنتحقق من التغطية.', label: 'مكان الغسيل', detail: 'شربتلي فيلج', note: 'الموقع + رقم الفيلا', action: 'تعرّف على الباقات' },
    { title: 'باقة تناسب أسبوعك', body: 'اختر الغسيل الخارجي أو الداخلي والخارجي، وعدد مواعيدك الأسبوعية. تظهر الأسعار قبل الدفع.', label: 'الباقات الشهرية', detail: '30 يومًا', note: 'المواعيد تتكرر كل أسبوع', action: 'كيف أتابع الغسلة؟' },
    { title: 'تابع كل غسلة', body: 'اعرف وقت وصول الفريق، وتابع الغسيل وصور التوثيق من صفحة حجوزاتك.', label: 'حالة الغسيل', detail: 'وصل. غسل. تأكد.', note: 'تحديثات مرتبطة بحجزك', action: 'ابدأ اشتراكك' },
  ] : [
    { title: 'Your wash, at home', body: 'Starting in Sharbatly Village, Jeddah. Choose your location and enter your villa number to check coverage.', label: 'Where we wash', detail: 'Sharbatly Village', note: 'Location + villa number', action: 'Explore monthly packages' },
    { title: 'A plan for your week', body: 'Choose exterior or interior and exterior washing, then your weekly appointments. See the price before paying.', label: 'Monthly packages', detail: '30 days', note: 'Appointments repeat every week', action: 'How do I follow my wash?' },
    { title: 'Follow every wash', body: 'See when your team arrives, follow the wash and view its photos in your bookings.', label: 'Wash progress', detail: 'Arrived. Washed. Verified.', note: 'Updates from your booking', action: 'Start your subscription' },
  ];
  const page = pages[step];
  const marker = useAnimatedStyle(() => ({ width: withTiming(`${((step + 1) / pages.length) * 100}%`, { duration: reduced ? 0 : 240 }) }));

  return (
    <Screen scroll contentStyle={styles.screen}>
      <View style={styles.top}>
        <Txt variant="bodyLg" weight="bold">BubblesCarWash</Txt>
        <Pressable accessibilityRole="button" accessibilityLabel={ar ? 'Switch to English' : 'التبديل إلى العربية'} onPress={() => session.setLanguage(ar ? 'en' : 'ar')} style={({ pressed }) => [styles.language, pressed && styles.pressed]}>
          <Txt variant="small" weight="semibold">{ar ? 'English' : 'العربية'}</Txt>
        </Pressable>
      </View>
      <View style={styles.stage}>
        <View style={styles.artifact}>
          <View style={styles.artifactTop}>
            <Txt variant="body" weight="semibold" tone="inverseSoft">{page.label}</Txt>
            <Num variant="small" tone="inverseSoft">{step + 1} / 3</Num>
          </View>
          <View style={styles.mark}><BeatIcon size="lg" animate active={step === 0 ? 1 : step === 1 ? 2 : 3} /></View>
          <Txt variant="heading" weight="bold" tone="inverse" center>{page.detail}</Txt>
          <Txt variant="small" tone="inverseSoft" center>{page.note}</Txt>
        </View>
        <View accessibilityLiveRegion="polite" style={styles.copy}>
          <Txt variant="title" weight="bold">{page.title}</Txt>
          <Txt variant="body" tone="secondary">{page.body}</Txt>
        </View>
      </View>
      <View style={styles.actions}>
        <View style={styles.track}><Animated.View style={[styles.progress, marker]} /></View>
        <Button label={page.action} size="lg" fullWidth onPress={() => step < 2 ? setStep(step + 1) : router.push({ pathname: '/onboarding/phone', params: { intent: 'subscription' } })} />
        <View style={styles.bottom}>
          {step > 0 ? <Button label={copy.common.back} variant="ghost" size="sm" onPress={() => setStep(step - 1)} /> : <View />}
          <Button label={ar ? 'لدي حساب' : 'I have an account'} variant="ghost" size="sm" onPress={() => router.push('/onboarding/phone')} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { paddingHorizontal: theme.spacing[5], paddingVertical: theme.spacing[4], gap: theme.spacing[5] },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing[2] },
  language: { minHeight: theme.scale(44), paddingHorizontal: theme.spacing[2], justifyContent: 'center', borderRadius: theme.radius.sm },
  pressed: { backgroundColor: theme.surface.bookingSoft },
  stage: { flex: 1, justifyContent: 'center', gap: theme.spacing[5] },
  artifact: { padding: theme.spacing[5], paddingBottom: theme.spacing[6], gap: theme.spacing[3], borderRadius: theme.radius.lg, borderCurve: 'continuous', backgroundColor: theme.surface.dark },
  artifactTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing[3] },
  mark: { minHeight: theme.scale(110), alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing[4] },
  copy: { gap: theme.spacing[2], minHeight: theme.scale(140) },
  actions: { gap: theme.spacing[3] },
  track: { height: theme.scale(4), borderRadius: theme.radius.pill, backgroundColor: theme.surface.bookingSoft },
  progress: { height: '100%', borderRadius: theme.radius.pill, backgroundColor: theme.action.primary },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing[2] },
}));
