import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Checkbox, Num, Screen, Txt, useLocale } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow } from '../../src/components/Bits';
import { useClubDraft } from '../../src/clubDraft';
import { useCatalogue } from '../../src/catalogue';

export default function ClubReview() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { language } = useLocale();
  const draft = useClubDraft();
  const catalogue = useCatalogue();
  const [consented, setConsented] = useState(false);
  const ar = language === 'ar';
  const plan = catalogue?.plans.find((item) => item.id === draft.planId);
  const weekly = plan?.weekly ?? (draft.planId.endsWith('-3') ? 3 : 2);
  const fallbackPrices: Record<string, number> = { basic: 19900, 'basic-3': 26900, plus: 29900, 'plus-3': 39900 };
  const priceMinor = plan?.priceMinor ?? fallbackPrices[draft.planId] ?? 19900;
  const name = plan?.name[language] ?? (draft.planId.startsWith('basic') ? (ar ? 'أساسي' : 'Basic') : (ar ? 'سوبر ووش' : 'Super Wash'));

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={ar ? 'مراجعة الاشتراك' : 'Review subscription'} onBack={() => router.back()} />
      <View style={styles.body}>
        <Card variant="booking" style={styles.summary}>
          <Txt variant="heading" weight="bold">{name}</Txt>
          <Txt variant="small" tone="secondary">{ar ? `${weekly} غسلات أسبوعيًا، بلا رصيد وبلا ترحيل` : `${weekly} weekly washes, no credits and no rollover`}</Txt>
        </Card>
        <Card style={styles.slots}>
          <Txt variant="caption" tone="secondary">{ar ? 'الجدول أسبوعي ويتكرر كل 7 أيام حتى نهاية الدورة.' : 'This weekly schedule repeats every 7 days until the cycle ends.'}</Txt>
          {draft.slots.map((slot) => (
            <View key={slot.slotStart} style={styles.slotRow}>
              <Txt variant="small" weight="semibold" style={styles.slotLabel}>{slot.label}</Txt>
              <Num variant="small" tone="secondary">{slot.startsAt}–{slot.endsAt}</Num>
            </View>
          ))}
        </Card>
        <View style={styles.ledger}>
          <LedgerRow label={ar ? 'رسوم 30 يومًا' : '30-day fee'} amount={`${priceMinor / 100} ${ar ? 'ر.س' : 'SAR'}`} />
          <LedgerRow label={ar ? 'الإجمالي شامل الضريبة' : 'Total incl. VAT'} amount={`${priceMinor / 100} ${ar ? 'ر.س' : 'SAR'}`} strong />
        </View>
        <View style={styles.secure}>
          <ShieldCheck size={theme.scale(16)} color={theme.text.secondary} strokeWidth={2} />
          <Txt variant="caption" tone="secondary" style={styles.secureText}>{ar ? 'سيظهر الدفع المستضاف والآمن من ميسر داخل التطبيق. لا نخزن بيانات بطاقتك.' : 'Moyasar secure hosted checkout will appear inside the app. We do not store your card details.'}</Txt>
        </View>
        <Card style={styles.consent}>
          <Checkbox label={ar ? `أوافق على اشتراك لمدة 30 يومًا بقيمة ${priceMinor / 100} ر.س.` : `I agree to a 30-day subscription of ${priceMinor / 100} SAR.`} checked={consented} onChange={setConsented} />
        </Card>
        <Button label={ar ? 'الانتقال للدفع' : 'Continue to payment'} size="lg" fullWidth disabled={!consented || draft.slots.length !== weekly} onPress={() => router.push('/club/processing')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[4] },
  summary: { gap: theme.spacing[1] },
  slots: { gap: theme.spacing[2] },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  slotLabel: { flex: 1 },
  ledger: { gap: theme.spacing[2] },
  secure: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  secureText: { flex: 1 },
  consent: { backgroundColor: theme.palette.yellow100 },
}));
