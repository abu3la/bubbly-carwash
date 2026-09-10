import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Checkbox, Num, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow } from '../../src/components/Bits';
import { useClubDraft } from '../../src/clubDraft';
import { hasVillaAddress } from '../../src/api';
import { useCustomerData } from '../../src/customerData';
import { useCatalogue } from '../../src/catalogue';

export default function ClubReview() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { language } = useLocale();
  const draft = useClubDraft();
  const catalogue = useCatalogue();
  const { vehicles, addresses } = useCustomerData();
  const address = addresses.find((item) => item.id === draft.addressId);
  const vehicle = vehicles.find((item) => item.id === draft.vehicleId);
  const [consented, setConsented] = useState(false);
  const ar = language === 'ar';
  const plan = catalogue?.plans.find((item) => item.id === draft.planId);
  const weekly = plan?.weekly ?? (draft.planId.endsWith('-3') ? 3 : 2);
  const priceMinor = plan?.priceMinor ?? 0;
  const name = plan?.name[language] ?? (draft.planId.startsWith('basic') ? (ar ? 'أساسي' : 'Basic') : (ar ? 'سوبر ووش' : 'Super Wash'));

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={ar ? 'مراجعة الاشتراك' : 'Review subscription'} onBack={() => router.back()} />
      <View style={styles.body}>
        <Card variant="booking" style={styles.summary}>
          <Txt variant="heading" weight="bold">{name}</Txt>
          <Txt variant="small" tone="secondary">{ar ? `${weekly === 2 ? 'غسلتان' : `${weekly} غسلات`} أسبوعيًا لمدة 30 يومًا` : `${weekly} weekly washes for 30 days`}</Txt>
        </Card>
        <Card style={styles.summary}>
          <Txt variant="body" weight="semibold">{vehicle ? `${vehicle.make} ${vehicle.model} · ${vehicle.plate}` : (ar ? 'اختر السيارة' : 'Choose a vehicle')}</Txt>
          <Txt variant="small" tone="secondary">{hasVillaAddress(address) ? (ar ? `فيلا ${address!.villa_number}، شربتلي فيلج` : `Villa ${address!.villa_number}, Sharbatly Village`) : (ar ? 'تحقق من موقع الفيلا ورقمها' : 'Verify your villa location and number')}</Txt>
          <Button label={ar ? 'تعديل الجدول والعنوان' : 'Edit schedule and address'} variant="ghost" size="sm" onPress={() => router.replace('/club/schedule')} />
        </Card>
        <Card style={styles.slots}>
          <Txt variant="caption" tone="secondary">{ar ? 'مواعيدك المختارة تتكرر أسبوعيًا طوال الاشتراك.' : 'Your selected appointments repeat weekly throughout your subscription.'}</Txt>
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
          <Txt variant="caption" tone="secondary" style={styles.secureText}>{ar ? 'اختيار وسيلة الدفع في الخطوة التالية.' : 'Choose a payment method in the next step.'}</Txt>
        </View>
        <Card style={styles.consent}>
          <Checkbox label={ar ? `أوافق على اشتراك بقيمة ${priceMinor / 100} ر.س يتجدد تلقائيًا كل 30 يومًا حتى إلغاء التجديد.` : `I agree to a subscription of ${priceMinor / 100} SAR, renewing every 30 days until renewal is cancelled.`} checked={consented} onChange={setConsented} />
        </Card>
        <Button label={ar ? 'الانتقال للدفع' : 'Continue to payment'} size="lg" fullWidth disabled={!plan || !vehicle || !hasVillaAddress(address) || !consented || draft.slots.length !== weekly} onPress={() => router.push('/club/processing')} />
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
