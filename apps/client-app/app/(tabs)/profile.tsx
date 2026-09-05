import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, ChevronLeft, Globe, LogOut, MapPin, Pencil } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Input, Num, Screen, Txt, useLocale, useToast } from '@bubbles/ui-native';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';
import { useAuthSession } from '../../src/authSession';
import { useCustomerData } from '../../src/customerData';
import { unregisterFirebaseMessaging } from '../../src/firebase';
import { updateProfile } from '../../src/api';

export default function Profile() {
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const router = useRouter();
  const session = useSession();
  const auth = useAuthSession();
  const { profile, vehicles, addresses, membership, loading, error: loadError, refresh, applyProfile } = useCustomerData();
  const toast = useToast();
  const copy = useCopy();
  const ar = language === 'ar';
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? '');
  const [busy, setBusy] = useState<'name' | 'logout' | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { if (!editing) setName(profile?.full_name ?? ''); }, [profile?.full_name, editing]);
  const phone = profile?.phone || auth.session?.phone || '';
  const rows = [
    { icon: Car, label: copy.profile.rows.vehicles, value: String(vehicles.length), onPress: () => router.push('/account/vehicles') },
    { icon: MapPin, label: copy.profile.rows.addresses, value: String(addresses.length), onPress: () => router.push('/account/addresses') },
    { icon: Globe, label: copy.profile.rows.language, value: copy.profile.languageName, onPress: () => session.setLanguage(ar ? 'en' : 'ar') },
  ];

  const save = async () => {
    if (busy || name.trim().length < 2) return;
    setBusy('name'); setError('');
    try {
      const result = await updateProfile(name.trim(), language);
      applyProfile(result.profile);
      await refresh();
      setEditing(false);
      toast.show(ar ? 'حُفظ اسمك.' : 'Your name is saved.', 'washed');
    } catch { setError(ar ? 'تعذّر حفظ الاسم. تحقق من اتصالك وحاول مرة أخرى.' : 'Could not save your name. Check your connection and try again.'); }
    finally { setBusy(null); }
  };

  return (
    <Screen scroll bottomInset={theme.spacing[6]} contentStyle={styles.page}>
      <Txt variant="title" weight="bold">{ar ? 'ملفك الشخصي' : 'Your profile'}</Txt>
      <View style={styles.identity}>
        <Txt variant="caption" tone="secondary">{ar ? 'الاسم' : 'Name'}</Txt>
        {editing ? <View style={styles.editor}>
          <Input label={ar ? 'الاسم الكامل' : 'Full name'} value={name} onChangeText={setName} maxLength={80} autoComplete="name" autoCapitalize="words" returnKeyType="done" onSubmitEditing={() => void save()} />
          <Button label={busy === 'name' ? (ar ? 'نحفظ الاسم…' : 'Saving…') : (ar ? 'حفظ الاسم' : 'Save name')} fullWidth disabled={!!busy || name.trim().length < 2 || name.trim() === profile?.full_name} onPress={() => void save()} />
          <Button label={copy.common.cancel} variant="ghost" disabled={!!busy} fullWidth onPress={() => { setEditing(false); setError(''); }} />
        </View> : <View style={styles.nameRow}>
          <Txt variant="heading" weight="bold" style={styles.grow}>{profile?.full_name || (loading ? (ar ? 'نحمّل بياناتك…' : 'Loading your details…') : (ar ? 'أضف اسمك' : 'Add your name'))}</Txt>
          <Button label={ar ? 'تعديل' : 'Edit'} variant="ghost" size="sm" disabled={!!busy} icon={<Pencil size={18} color={theme.action.primary} />} onPress={() => setEditing(true)} />
        </View>}
        <View style={styles.phone}>
          <Txt variant="caption" tone="secondary">{ar ? 'رقم الجوال' : 'Mobile number'}</Txt>
          <Num variant="bodyLg" weight="semibold">{phone}</Num>
          <Txt variant="caption" tone="muted">{ar ? 'هذا رقم تسجيل الدخول والتحقق من حسابك.' : 'This number is used to sign in and verify your account.'}</Txt>
        </View>
      </View>
      {error ? <Txt accessibilityLiveRegion="polite" variant="small" tone="danger">{error}</Txt> : null}
      {loadError ? <Button label={ar ? 'إعادة تحميل بياناتك' : 'Reload your details'} variant="secondary" fullWidth onPress={() => void refresh()} /> : null}
      <Card variant="booking" onPress={() => router.push(membership ? '/club/dashboard' : '/club')} style={styles.membership}>
        <View style={styles.grow}>
          <Txt variant="body" weight="bold">{membership ? (ar ? membership.plans.name_ar : membership.plans.name_en) : (ar ? 'اشترك الآن' : 'Subscribe now')}</Txt>
          <Txt variant="small" tone="secondary">{membership
            ? (ar ? `${membership.plans.weekly} غسلات أسبوعيًا · دورة 30 يومًا` : `${membership.plans.weekly} washes weekly · 30-day cycle`)
            : (ar ? 'اختر نوع الغسيل وعدد المواعيد الأسبوعية.' : 'Choose the wash type and your weekly appointments.')}</Txt>
        </View>
        <ChevronLeft size={20} color={theme.text.primary} style={ar ? undefined : styles.flip} />
      </Card>
      <View style={styles.rows}>
        {rows.map((row) => {
          const Icon = row.icon;
          return <Pressable key={row.label} accessibilityRole="button" onPress={row.onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <Icon size={20} color={theme.text.secondary} strokeWidth={2} />
            <Txt variant="body" weight="semibold" style={styles.grow}>{row.label}</Txt>
            <Txt variant="small" tone="secondary">{row.value}</Txt>
            <ChevronLeft size={16} color={theme.text.secondary} style={ar ? undefined : styles.flip} />
          </Pressable>;
        })}
      </View>
      <Button label={busy === 'logout' ? (ar ? 'نسجّل خروجك…' : 'Signing out…') : copy.profile.signOut} variant="ghost" fullWidth disabled={!!busy} icon={<LogOut size={18} color={theme.action.primary} />} onPress={async () => {
        setBusy('logout'); setError('');
        try {
          await unregisterFirebaseMessaging().catch(() => undefined);
          await auth.signOut();
        } catch { setError(ar ? 'تعذّر تسجيل الخروج. حاول مرة أخرى.' : 'Could not sign out. Try again.'); setBusy(null); }
      }} />
      <Txt variant="caption" tone="muted" center>{copy.brand.version}</Txt>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  identity: { gap: theme.spacing[1], padding: theme.spacing[5], borderRadius: theme.radius.lg, backgroundColor: theme.surface.card },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  phone: { gap: theme.spacing[1], paddingTop: theme.spacing[5] },
  editor: { gap: theme.spacing[2] },
  grow: { flex: 1, gap: theme.spacing[1] },
  membership: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  rows: { gap: theme.spacing[1] },
  row: { minHeight: theme.scale(62), paddingHorizontal: theme.spacing[3], paddingVertical: theme.spacing[2], flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3], borderRadius: theme.radius.md },
  pressed: { backgroundColor: theme.surface.bookingSoft },
  flip: { transform: [{ rotate: '180deg' }] },
}));
