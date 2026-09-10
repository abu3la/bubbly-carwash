import { useState } from 'react';
import { View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Dialog, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { cancelMembership, cancelMembershipRenewal } from '../../src/api';
import { useCustomerData } from '../../src/customerData';
import { MembershipSummary } from '../../src/components/MembershipSummary';

export default function ClubDashboard() {
  const router = useRouter();
  const { language } = useLocale();
  const { membership, refresh } = useCustomerData();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const ar = language === 'ar';
  if (!membership) return <Redirect href="/club" />;

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={ar ? 'اشتراكي' : 'My subscription'} onBack={() => router.back()} />
      <View style={styles.body}>
        <MembershipSummary membership={membership} showValidity />
        {membership.renewal ? <View style={styles.renewal}>
          <Txt variant="small" tone="secondary">
            {membership.renewal.enabled
              ? (ar ? `التجديد التالي: ${new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh' }).format(new Date(membership.renewal.nextChargeAt))}` : `Next renewal: ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh' }).format(new Date(membership.renewal.nextChargeAt))}`)
              : (ar ? 'التجديد التلقائي ملغى. تستمر المواعيد حتى نهاية الفترة المدفوعة.' : 'Automatic renewal is off. Appointments continue until the paid period ends.')}
          </Txt>
          {membership.renewal.enabled ? <Button label={ar ? 'إلغاء التجديد التلقائي' : 'Cancel automatic renewal'} variant="ghost" fullWidth disabled={busy} onPress={async () => {
            setBusy(true); setError(false);
            try { await cancelMembershipRenewal(); await refresh(); }
            catch { setError(true); }
            finally { setBusy(false); }
          }} /> : null}
        </View> : null}
        {error ? <Txt variant="small" tone="danger">{ar ? 'تعذر تحديث الاشتراك. يمكن إعادة المحاولة.' : 'Could not update the subscription. Try again.'}</Txt> : null}
        <Button label={ar ? 'عرض جدول غسيلاتي' : 'View my wash schedule'} size="lg" fullWidth onPress={() => router.replace('/(tabs)/bookings')} />
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
            setBusy(true); setError(false);
            try { await cancelMembership(); await refresh(); setConfirmCancel(false); router.replace('/(tabs)/home'); }
            catch { setError(true); setConfirmCancel(false); }
            finally { setBusy(false); }
          }} />
        </>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  renewal: { gap: theme.spacing[2], padding: theme.spacing[4], backgroundColor: theme.surface.card, borderRadius: theme.radius.md },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
}));
