import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, ChevronLeft, Globe, MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt, useLocale, useToast } from '@sama/ui-native';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';
import { useAuthSession } from '../../src/authSession';
import { useCustomerData } from '../../src/customerData';

export default function Profile() {
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const router = useRouter();
  const session = useSession();
  const auth = useAuthSession();
  const { profile, vehicles, addresses, membership } = useCustomerData();
  const toast = useToast();
  const copy = useCopy();
  const ar = language === 'ar';

  const rows = [
    { icon: Car, label: copy.profile.rows.vehicles, value: `${vehicles.length}`, onPress: () => router.push('/account/vehicles') },
    { icon: MapPin, label: copy.profile.rows.addresses, value: `${addresses.length}`, onPress: () => router.push('/account/addresses') },
    { icon: Globe, label: copy.profile.rows.language, value: copy.profile.languageName, onPress: () => session.setLanguage(ar ? 'en' : 'ar') },
  ];

  return (
    <Screen scroll bottomInset={theme.spacing[6]} contentStyle={styles.page}>
      <View style={styles.identity}>
        <Txt variant="heading" weight="bold">{profile?.full_name || (ar ? 'عميل BubblesCarWash' : 'BubblesCarWash customer')}</Txt>
        <Txt variant="small" tone="secondary">
          <Num variant="small" tone="secondary">{profile?.phone || auth.session?.phone}</Num> · {copy.profile.verified}
        </Txt>
      </View>

      {membership ? (
        <Card onPress={() => router.push('/club/dashboard')} style={styles.membership}>
          <View style={styles.membershipText}>
            <Txt variant="body" weight="bold">{ar ? membership.plans.name_ar : membership.plans.name_en}</Txt>
            <Txt variant="caption" tone="secondary">
              {ar ? `${membership.plans.weekly} غسلات أسبوعيًا، بلا ترحيل` : `${membership.plans.weekly} washes weekly, no rollover`}
            </Txt>
          </View>
          <Num variant="small" weight="bold">{membership.usedThisWeek}/{membership.plans.weekly}</Num>
        </Card>
      ) : (
        <Card onPress={() => router.push('/club')} style={styles.membership}>
          <View style={styles.membershipText}>
            <Txt variant="body" weight="bold">{ar ? 'لا يوجد اشتراك نشط' : 'No active subscription'}</Txt>
            <Txt variant="caption" tone="secondary">{ar ? 'اختر غسلتين أو ثلاث غسلات أسبوعيًا' : 'Choose two or three weekly washes'}</Txt>
          </View>
        </Card>
      )}

      <Card style={styles.rows}>
        {rows.map((row, index) => {
          const Icon = row.icon;
          return (
            <Pressable key={row.label} accessibilityRole="button" onPress={row.onPress} style={styles.row(index > 0)}>
              <Icon size={theme.scale(18)} color={theme.text.secondary} strokeWidth={2} />
              <Txt variant="body" weight="semibold" style={styles.rowLabel}>{row.label}</Txt>
              <Txt variant="caption" tone="muted">{row.value}</Txt>
              <ChevronLeft size={theme.scale(16)} color={theme.text.faint} strokeWidth={2} style={ar ? undefined : styles.flip} />
            </Pressable>
          );
        })}
      </Card>

      <Button label={copy.profile.signOut} variant="ghost" fullWidth onPress={async () => {
        await auth.signOut();
        toast.show(copy.profile.signedOut, 'washed');
        router.replace('/onboarding');
      }} />
      <Txt variant="label" tone="muted" center>BubblesCarWash · {copy.brand.version}</Txt>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[4] },
  identity: { gap: theme.spacing[1], paddingVertical: theme.spacing[2] },
  membership: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  membershipText: { flex: 1, gap: 2 },
  rows: { paddingVertical: 0, paddingHorizontal: theme.spacing[4] },
  row: (bordered: boolean) => ({
    minHeight: theme.scale(58), flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3],
    borderTopWidth: bordered ? theme.border.width : 0, borderTopColor: theme.border.subtle,
  }),
  rowLabel: { flex: 1 },
  flip: { transform: [{ rotate: '180deg' }] },
}));
