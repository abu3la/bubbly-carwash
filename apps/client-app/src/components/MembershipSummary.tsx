import { useWindowDimensions, View } from 'react-native';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Button, Card, Num, Txt, useLocale } from '@bubbles/ui-native';
import type { RealMembership } from '../api';
import { useCopy } from '../i18n';

interface Props {
  membership: RealMembership;
  onManage?: () => void;
  showValidity?: boolean;
}

/** The saved weekly rhythm, separate from the status of any individual wash. */
export function MembershipSummary({ membership, onManage, showValidity = false }: Props) {
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const copy = useCopy().home;
  const { width, fontScale } = useWindowDimensions();
  const schedule = membership.weeklySchedule ?? [];
  const ar = language === 'ar';
  const name = ar ? membership.plans.name_ar : membership.plans.name_en;
  const columns = schedule.length > 3 ? 2 : Math.max(1, schedule.length);
  const stacked = width / fontScale < 400;
  const Arrow = ar ? ChevronLeft : ChevronRight;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <Txt variant="heading" weight="bold">{copy.planName(name)}</Txt>
          <Txt variant="small" tone="secondary">{copy.weeklyWashes(membership.plans.weekly)}</Txt>
        </View>
        <CalendarDays size={theme.scale(28)} color={theme.text.primary} strokeWidth={1.8} accessible={false} />
      </View>
      {schedule.length ? (
        <View style={styles.schedule} accessibilityLabel={copy.selectedDays}>
          {schedule.map(({ weekday, time }) => {
            const day = copy.weekdays[weekday];
            const timeLabel = new Intl.DateTimeFormat(ar ? 'ar-SA' : 'en-GB', {
              hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Riyadh',
            }).format(new Date(`2000-01-02T${time}:00+03:00`));
            return (
              <View key={`${weekday}-${time}`} style={styles.day(columns, stacked)}
                accessible accessibilityRole="text" accessibilityLabel={`${day}${ar ? '،' : ','} ${timeLabel}`}>
                <Txt variant="body" weight="bold" center={!stacked} style={styles.dayName(stacked)}>{day}</Txt>
                <Num variant="small" tone="secondary" style={styles.time}>{timeLabel}</Num>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.noSchedule}>
          <Txt variant="small" tone="secondary">{copy.scheduleUnavailable}</Txt>
        </View>
      )}
      {showValidity ? <Txt variant="small" tone="secondary" center>
        {ar ? 'ساري حتى ' : 'Active until '}
        {new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-gregory' : 'en-GB', {
          day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Riyadh',
        }).format(new Date(membership.cycle_end))}
      </Txt> : null}
      {onManage ? <Button
        label={copy.myClub}
        variant="ghost"
        size="sm"
        fullWidth
        icon={<Arrow size={theme.scale(16)} color={theme.action.primary} strokeWidth={2.2} />}
        onPress={onManage}
        style={styles.manage}
      /> : null}
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.surface.tint,
    boxShadow: undefined,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[4] },
  identity: { flex: 1, gap: theme.spacing[1] },
  schedule: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.surface.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing[1],
  },
  day: (columns: number, stacked: boolean) => ({
    width: `${stacked ? 100 : 100 / columns}%` as `${number}%`,
    flexDirection: stacked ? 'row' : 'column',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: stacked ? theme.spacing[3] : theme.spacing[1],
    gap: theme.spacing[1],
    alignItems: 'center',
    justifyContent: stacked ? 'space-between' : 'center',
  }),
  dayName: (stacked: boolean) => ({ flexShrink: 1, flex: stacked ? 1 : undefined }),
  time: { textAlign: 'center' },
  noSchedule: { paddingVertical: theme.spacing[2] },
  manage: { minHeight: theme.scale(44), paddingVertical: theme.spacing[1] },
}));
