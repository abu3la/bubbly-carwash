import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Input, Screen, Tag, Txt, useLocale, useToast } from '@bubbles/ui-native';
import { ApiError, reportBookingIssue, type IssueCategory } from '../../src/api';
import { FlowHeader } from '../../src/components/FlowHeader';
import { useCustomerData } from '../../src/customerData';

const CATEGORIES: Array<{ key: IssueCategory; ar: string; en: string }> = [
  { key: 'wash_quality', ar: 'جودة الغسيل', en: 'Wash quality' },
  { key: 'team_late', ar: 'تأخر الفريق', en: 'Team was late' },
  { key: 'team_no_show', ar: 'لم يصل الفريق', en: 'Team did not arrive' },
  { key: 'vehicle_damage', ar: 'ضرر في السيارة', en: 'Vehicle damage' },
  { key: 'other', ar: 'أخرى', en: 'Other' },
];

export default function ReportIssue() {
  const router = useRouter();
  const { language } = useLocale();
  const { bookingId = '' } = useLocalSearchParams<{ bookingId?: string }>();
  const { refresh } = useCustomerData();
  const toast = useToast();
  const [category, setCategory] = useState<IssueCategory>('wash_quality');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const ar = language === 'ar';

  const send = async () => {
    setError('');
    try {
      await reportBookingIssue(bookingId, { category, note: note.trim() });
      toast.show(ar ? 'وصل البلاغ إلى الدعم' : 'Support received the report', 'washed');
      await refresh();
      router.back();
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : 'unknown';
      if (code === 'issueAlreadyOpen') setError(ar ? 'يوجد بلاغ قيد المراجعة لهذا الحجز.' : 'This booking already has a report under review.');
      else if (code === 'offline') setError(ar ? 'لا يوجد اتصال بالإنترنت.' : 'No internet connection.');
      else setError(ar ? 'تعذر إرسال البلاغ. يمكن إعادة المحاولة.' : 'Could not send the report. Try again.');
    }
  };

  return (
    <Screen scroll contentStyle={styles.page} header={<FlowHeader title={ar ? 'الإبلاغ عن مشكلة' : 'Report a problem'} onBack={() => router.back()} />}>
      <View style={styles.body}>
        <View style={styles.section} accessibilityRole="radiogroup">
          <Txt variant="small" weight="semibold">{ar ? 'نوع المشكلة' : 'Problem type'}</Txt>
          <View style={styles.categories}>
            {CATEGORIES.map((item) => <Tag key={item.key} selected={category === item.key} onPress={() => setCategory(item.key)}>{ar ? item.ar : item.en}</Tag>)}
          </View>
        </View>
        <Input label={ar ? 'التفاصيل' : 'Details'} placeholder={ar ? 'وصف ما حدث' : 'Describe what happened'} value={note} onChangeText={setNote} multiline maxLength={1000} textAlignVertical="top" />
        {error ? <Txt accessibilityLiveRegion="polite" variant="small" tone="danger">{error}</Txt> : null}
        <Button label={ar ? 'إرسال البلاغ' : 'Send report'} size="lg" fullWidth disabled={!note.trim()} onPress={send} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  section: { gap: theme.spacing[2] },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },
}));
