import { useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, Button, Input, Num, Screen, Txt } from '@sama/ui-native';
import { ApiError, requestOtp, toE164, verifyOtp } from '../src/api';
import { useSession } from '../src/session';
import { copy } from '../src/copy';

const NATIONAL_DIGITS = 9;
const CODE_DIGITS = 6;

export default function SignIn() {
  const { session, ready, setSession } = useSession();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nothing is rendered until we know — see SessionProvider.
  if (!ready) return <View style={styles.blank} />;
  if (session) return <Redirect href="/jobs" />;

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setError(copy.errors[e instanceof ApiError ? e.code : 'unknown']);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.head}>
        <BeatIcon size="lg" active={3} />
        <Txt variant="display" weight="bold" tone="action">
          {copy.brand}
        </Txt>
        <Txt variant="small" tone="muted">
          {copy.role}
        </Txt>
      </View>

      <View style={styles.form}>
        <Txt variant="title" weight="bold">
          {copy.signInTitle}
        </Txt>
        <Txt variant="small" tone="secondary">
          {sent ? `${copy.codeSentTo} ${toE164(phone)}` : copy.signInSub}
        </Txt>

        {!sent ? (
          <>
            {/* The dial code leads in both directions — it is part of the
                number sent to the API, not decoration. */}
            <View style={styles.phoneRow}>
              <View style={styles.dial}>
                <Num variant="body" weight="semibold">
                  +966
                </Num>
              </View>
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder={copy.phonePlaceholder}
                keyboardType="phone-pad"
                maxLength={12}
                ltr
                containerStyle={styles.field}
              />
            </View>
            <Button
              label={busy ? copy.sending : copy.sendCode}
              size="lg"
              fullWidth
              disabled={busy || phone.replace(/\D/g, '').length !== NATIONAL_DIGITS}
              onPress={() => run(async () => {
                await requestOtp(toE164(phone));
                setSent(true);
              })}
            />
          </>
        ) : (
          <>
            <Input
              value={code}
              onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, CODE_DIGITS))}
              placeholder="000000"
              keyboardType="number-pad"
              ltr
            />
            <Button
              label={busy ? copy.verifying : copy.verify}
              size="lg"
              fullWidth
              disabled={busy || code.length < CODE_DIGITS}
              onPress={() => run(async () => {
                setSession(await verifyOtp(toE164(phone), code));
              })}
            />
            <Button
              label={copy.changeNumber}
              variant="ghost"
              fullWidth
              onPress={() => { setSent(false); setCode(''); setError(null); }}
            />
          </>
        )}

        {error ? (
          <Txt variant="small" tone="danger" center>
            {error}
          </Txt>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  blank: { flex: 1, backgroundColor: theme.surface.page },
  screen: { padding: theme.spacing[6], justifyContent: 'center', gap: theme.spacing[8] },
  head: { alignItems: 'center', gap: theme.spacing[2] },
  form: { gap: theme.spacing[3] },
  phoneRow: { flexDirection: 'row', gap: theme.spacing[2], direction: 'ltr' },
  dial: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    backgroundColor: theme.surface.card,
    borderWidth: theme.border.width,
    borderColor: theme.border.subtle,
  },
  field: { flex: 1 },
}));
