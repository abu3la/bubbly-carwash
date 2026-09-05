import { useState } from 'react';
import { View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Dialog, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { cancelMembership } from '../../src/api';
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
        {error ? <Txt variant="small" tone="danger">{ar ? 'تعذّر إلغاء الاشتراك. حاول مرة أخرى.' : 'Could not cancel the subscription. Try again.'}</Txt> : null}
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
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
}));
