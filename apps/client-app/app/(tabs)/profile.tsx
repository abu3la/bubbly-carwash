import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  Car,
  ChevronLeft,
  CreditCard,
  FileText,
  Globe,
  MapPin,
  MessageSquare,
  Receipt,
} from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt, useToast } from '@sama/ui-native';
import { CUSTOMER } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';

const ICONS = { Car, MapPin, CreditCard, Receipt, Globe, Bell, MessageSquare, FileText };

interface Row {
  icon: keyof typeof ICONS;
  label: string;
  value?: string;
  onPress?: () => void;
}

export default function Profile() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const session = useSession();
  const toast = useToast();
  const { wallet, club } = session;
  const copy = useCopy();

  // Two languages, so the row is a straight toggle: tap it and the interface
  // switches in place. No confirmation and no restart to warn about.
  const toggleLanguage = () => {
    session.setLanguage(session.language === 'ar' ? 'en' : 'ar');
  };

  const rows: Row[] = [
    { icon: 'Car', label: copy.profile.rows.vehicles, value: copy.vehicleName },
    { icon: 'MapPin', label: copy.profile.rows.addresses, value: copy.profile.addressesValue },
    { icon: 'CreditCard', label: copy.profile.rows.cards, value: copy.profile.cardValue },
    { icon: 'Receipt', label: copy.profile.rows.invoices },
    {
      icon: 'Globe',
      label: copy.profile.rows.language,
      value: copy.profile.languageName,
      onPress: toggleLanguage,
    },
    { icon: 'Bell', label: copy.profile.rows.notifications, value: copy.profile.notificationsOn },
    { icon: 'MessageSquare', label: copy.profile.rows.support },
    { icon: 'FileText', label: copy.profile.rows.terms },
  ];

  return (
    <Screen scroll bottomInset={theme.spacing[6]} contentStyle={styles.page}>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Txt variant="heading" weight="bold" tone="action">
            {copy.customerInitial}
          </Txt>
        </View>
        <View style={styles.identityText}>
          <Txt variant="heading" weight="bold">
            {copy.customerName}
          </Txt>
          <Txt variant="small" tone="secondary">
            <Num variant="small" tone="secondary">
              {CUSTOMER.phone}
            </Num>{' '}
            · {copy.profile.verified}
          </Txt>
        </View>
      </View>

      {session.hasCredits || club ? (
        <View style={styles.summaries}>
          {session.hasCredits ? (
            <Card onPress={() => router.push('/packages')} style={styles.summary}>
              <Txt variant="label" weight="bold" tone="muted">
                {copy.profile.walletBalance}
              </Txt>
              <View style={styles.summaryValue}>
                <Num variant="heading" weight="bold">
                  {wallet.credits}
                </Num>
                <Txt variant="caption" tone="muted">
                  {copy.profile.ofTotal(wallet.total)}
                </Txt>
              </View>
              <Txt variant="label" tone="muted">
                {copy.profile.expires(copy.packageExpiry)}
              </Txt>
            </Card>
          ) : null}

          {club ? (
            <Card variant="dark" onPress={() => router.push('/club/dashboard')} style={styles.summary}>
              <Txt variant="label" weight="bold" style={styles.gold}>
                {copy.club.title} · {copy.plans[club.planId]}
              </Txt>
              <View style={styles.summaryValue}>
                <Num variant="heading" weight="bold" tone="inverse">
                  {club.credits}
                </Num>
                <Txt variant="caption" tone="inverseSoft">
                  {copy.profile.clubCredits}
                </Txt>
              </View>
              <Txt variant="label" tone="inverseSoft">
                {copy.profile.renews(copy.renewalDate)}
              </Txt>
            </Card>
          ) : null}
        </View>
      ) : (
        <Card onPress={() => router.push('/packages')} style={styles.teaser}>
          <Txt variant="body" weight="bold">
            {copy.profile.noBalanceTitle}
          </Txt>
          <Txt variant="caption" tone="secondary">
            {copy.profile.noBalanceSub(copy.common.money(139))}
          </Txt>
        </Card>
      )}

      <Card style={styles.rows}>
        {rows.map((row, i) => {
          const Icon = ICONS[row.icon];
          const Row = row.onPress ? Pressable : View;
          return (
            <Row
              key={row.label}
              accessibilityRole={row.onPress ? 'button' : undefined}
              onPress={row.onPress}
              style={styles.row(i === 0)}
            >
              <Icon size={theme.scale(18)} color={theme.text.secondary} strokeWidth={2} />
              <Txt variant="body" weight="semibold" style={styles.rowLabel}>
                {row.label}
              </Txt>
              {row.value ? (
                <Txt variant="caption" tone="muted">
                  {row.value}
                </Txt>
              ) : null}
              {/* The chevron points the way the language reads. */}
              <ChevronLeft
                size={theme.scale(16)}
                color={theme.text.faint}
                strokeWidth={2}
                style={session.language === 'ar' ? undefined : styles.flip}
              />
            </Row>
          );
        })}
      </Card>

      <Button
        label={copy.profile.signOut}
        variant="ghost"
        fullWidth
        onPress={() => {
          session.signOut();
          toast.show(copy.profile.signedOut, 'washed');
          router.replace('/onboarding');
        }}
      />

      <Txt variant="label" tone="muted" center>
        {copy.brand.version}
      </Txt>

    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[4] },
  identity: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] + 2 },
  identityText: { flex: 1, gap: 1 },
  avatar: {
    width: theme.scale(54),
    height: theme.scale(54),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.action.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaries: { flexDirection: 'row', gap: theme.spacing[2] + 2 },
  // Equal columns so the two cards match height and their numbers share a line.
  summary: { flex: 1, gap: theme.spacing[1] },
  summaryValue: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing[1] + 2 },
  gold: { color: theme.palette.yellow },
  teaser: { gap: theme.spacing[1] },
  rows: { paddingVertical: theme.spacing[1], paddingHorizontal: theme.spacing[4] },
  row: (first: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    minHeight: theme.layout.hitTarget,
    paddingVertical: theme.spacing[3],
    borderTopWidth: first ? 0 : theme.border.width,
    borderTopColor: theme.border.subtle,
  }),
  rowLabel: { flex: 1 },
  flip: { transform: [{ scaleX: -1 }] },
}));
