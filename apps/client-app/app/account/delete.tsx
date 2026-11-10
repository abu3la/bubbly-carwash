import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Checkbox, Screen, Txt, useLocale, useToast } from '@bubbles/ui-native';
import { CANCELLATION_NOTICE_HOURS, cancellationOpen } from '@bubbles/utils';
import { ApiError, deleteAccount } from '../../src/api';
import { useAuthSession } from '../../src/authSession';
import { TickRow } from '../../src/components/Bits';
import { FlowHeader } from '../../src/components/FlowHeader';
import { useCustomerData } from '../../src/customerData';

export default function DeleteAccount() {
  const router = useRouter();
  const { language } = useLocale();
  const auth = useAuthSession();
  const toast = useToast();
  const { bookings, membership } = useCustomerData();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const ar = language === 'ar';
  const paidUpcoming = bookings.filter((booking) => booking.status === 'scheduled' && booking.payment_confirmed && booking.total_minor > 0);
  // Deletion follows the cancellation rule for each paid booking.
  const refundable = paidUpcoming.some((booking) => cancellationOpen(booking.scheduled_at));
  const insideNotice = paidUpcoming.some((booking) => !cancellationOpen(booking.scheduled_at));

  const remove = async () => {
    setError('');
    try {
      await deleteAccount();
      toast.show(ar ? 'تم حذف الحساب' : 'Account deleted', 'washed');
      await auth.signOut();
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : 'unknown';
      if (code === 'washInProgress') setError(ar ? 'توجد غسلة جارية. يتاح حذف الحساب بعد اكتمالها.' : 'A wash is in progress. The account can be deleted once it finishes.');
      else if (code === 'offline') setError(ar ? 'لا يوجد اتصال بالإنترنت.' : 'No internet connection.');
      else setError(ar ? 'تعذر حذف الحساب. يمكن إعادة المحاولة.' : 'Could not delete the account. Try again.');
    }
  };

  return (
    <Screen scroll contentStyle={styles.page} header={<FlowHeader title={ar ? 'حذف الحساب' : 'Delete account'} onBack={() => router.back()} />}>
      <View style={styles.body}>
        <Txt variant="body" weight="semibold">{ar ? 'يؤدي الحذف إلى:' : 'Deleting will:'}</Txt>
        <View style={styles.list}>
          <TickRow>{membership
            ? (ar ? 'إلغاء الاشتراك والمواعيد القادمة، دون استرجاع مبلغ الدورة الحالية' : 'Cancel the subscription and upcoming appointments, with no refund for the current cycle')
            : (ar ? 'إلغاء المواعيد القادمة' : 'Cancel upcoming appointments')}</TickRow>
          {refundable ? <TickRow>{ar ? 'استرجاع مبالغ الحجوزات المدفوعة القادمة تلقائيًا' : 'Refund paid upcoming bookings automatically'}</TickRow> : null}
          {insideNotice ? <TickRow>{ar ? `مراجعة الدعم لاسترجاع الحجز الذي يبدأ خلال ${CANCELLATION_NOTICE_HOURS} ساعات` : `Support reviews the refund for a booking that starts within ${CANCELLATION_NOTICE_HOURS} hours`}</TickRow> : null}
          <TickRow>{ar ? 'حذف الاسم ورقم الجوال والسيارات والعناوين وصور التوثيق' : 'Delete your name, mobile number, vehicles, addresses and wash photos'}</TickRow>
          <TickRow>{ar ? 'الاحتفاظ بسجلات الدفع حسب الأنظمة، دون بيانات التعريف' : 'Keep payment records as regulations require, without identifying details'}</TickRow>
        </View>
        <Txt variant="small" tone="secondary">{ar ? 'لا يمكن استرجاع الحساب بعد الحذف.' : 'A deleted account cannot be restored.'}</Txt>
        <Checkbox label={ar ? 'تأكيد طلب حذف الحساب' : 'I confirm the deletion request'} checked={confirmed} onChange={setConfirmed} />
        {error ? <Txt accessibilityLiveRegion="polite" variant="small" tone="danger">{error}</Txt> : null}
        <Button label={ar ? 'حذف الحساب نهائيًا' : 'Delete account permanently'} variant="dark" size="lg" fullWidth disabled={!confirmed} onPress={remove} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[4] },
  list: { gap: theme.spacing[3] },
}));
