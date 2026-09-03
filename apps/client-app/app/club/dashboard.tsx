import { useState } from 'react';
import { View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Dialog, Num, Screen, Txt, useLocale } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { cancelMembership } from '../../src/api';
import { useCustomerData } from '../../src/customerData';

export default function ClubDashboard() {
  const router = useRouter();
  const { language } = useLocale();
  const { membership, refresh } = useCustomerData();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const ar = language === 'ar';
  if (!membership) return <Redirect href="/club" />;
  const remaining = Math.max(0, membership.plans.weekly - membership.usedThisWeek);
  const renewal = new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-gregory' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(membership.cycle_end));

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={ar ? 'اشتراكي' : 'My subscription'} onBack={() => router.back()} />
      <View style={styles.body}>
        <Card variant="dark" style={styles.card}>
          <Txt variant="heading" weight="bold" tone="inverse">{ar ? membership.plans.name_ar : membership.plans.name_en}</Txt>
          <Txt variant="small" tone="inverseSoft">{ar ? `${membership.plans.weekly} غسلات أسبوعيًا، بلا ترحيل` : `${membership.plans.weekly} weekly washes, no rollover`}</Txt>
          <View style={styles.usage}>
            <View>
              <Num variant="display" weight="bold" tone="inverse">{remaining}</Num>
              <Txt variant="caption" tone="inverseSoft">{ar ? 'مواعيد متاحة هذا الأسبوع' : 'appointments available this week'}</Txt>
            </View>
            <Num variant="small" tone="inverseSoft">{membership.usedThisWeek}/{membership.plans.weekly}</Num>
          </View>
        </Card>
        <Card style={styles.rules}>
          <Txt variant="body" weight="bold">{ar ? 'قاعدة الاشتراك' : 'Subscription rule'}</Txt>
          <Txt variant="small" tone="secondary">{ar ? 'كل موعد مرتبط بأسبوعه. إذا فات الموعد لا يتحول إلى رصيد ولا ينتقل للأسبوع التالي.' : 'Every appointment belongs to its week. A missed wash never becomes credit and never rolls over.'}</Txt>
          <Txt variant="caption" tone="muted">{ar ? `نهاية الدورة الحالية: ${renewal}` : `Current cycle ends: ${renewal}`}</Txt>
        </Card>
        <Button label={ar ? 'حجز غسلة من الاشتراك' : 'Book a subscription wash'} size="lg" fullWidth disabled={remaining === 0} onPress={() => router.replace('/book/service')} />
        <Button label={ar ? 'عرض مواعيدي' : 'View my appointments'} variant="secondary" fullWidth onPress={() => router.replace('/(tabs)/bookings')} />
        <Button label={ar ? 'إلغاء الاشتراك' : 'Cancel subscription'} variant="ghost" fullWidth onPress={() => setConfirmCancel(true)} />
      </View>
      <Dialog
        open={confirmCancel}
        title={ar ? 'إلغاء الاشتراك؟' : 'Cancel subscription?'}
        body={ar ? 'لن تُلغى المواعيد السابقة تلقائيًا، ولن تتمكن من إضافة مواعيد اشتراك جديدة.' : 'Existing appointments are not cancelled automatically, and you cannot add new subscription appointments.'}
        onClose={() => setConfirmCancel(false)}
        actions={<>
          <Button label={ar ? 'الاحتفاظ به' : 'Keep it'} variant="secondary" onPress={() => setConfirmCancel(false)} />
          <Button label={busy ? (ar ? 'جارٍ الإلغاء…' : 'Cancelling…') : (ar ? 'تأكيد الإلغاء' : 'Confirm cancellation')} disabled={busy} onPress={async () => {
            setBusy(true);
            try { await cancelMembership(); await refresh(); setConfirmCancel(false); router.replace('/(tabs)/home'); }
            finally { setBusy(false); }
          }} />
        </>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  card: { gap: theme.spacing[3], padding: theme.spacing[5] },
  usage: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: theme.spacing[4] },
  rules: { gap: theme.spacing[2] },
}));
