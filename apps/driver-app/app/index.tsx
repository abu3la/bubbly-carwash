import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, Button, Input, Num, Screen, Txt } from '@bubbles/ui-native';
import { ApiError, normalizePhoneDigits, requestOtp, toE164, verifyOtp } from '../src/api';
import { useSession } from '../src/session';
import { copy } from '../src/copy';

const LIVE_CODE_DIGITS = 6;

export default function SignIn() {
  const { session, ready, setSession } = useSession();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [developmentCode, setDevelopmentCode] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requiredDigits = developmentCode?.length ?? LIVE_CODE_DIGITS;

  // Storage is quick but asynchronous. Keep an honest loading state on screen
  // rather than flashing sign-in or leaving a blank white view.
  if (!ready) return <View style={styles.loading}><ActivityIndicator /></View>;
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
    <Screen scroll contentStyle={styles.screen}>
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
            <Txt variant="small" weight="semibold">رقم الجوال</Txt>
            {/* The dial code leads in both directions — it is part of the
                number sent to the API, not decoration. */}
            <View style={styles.phoneRow}>
              <View style={styles.dial}>
                <Num variant="body" weight="semibold">
                  +966
                </Num>
              </View>
              <Input
                accessibilityLabel="رقم الجوال"
                value={phone}
                onChangeText={setPhone}
                placeholder={copy.phonePlaceholder}
                keyboardType="phone-pad"
                maxLength={16}
                ltr
                containerStyle={styles.field}
              />
            </View>
            <Button
              label={busy ? copy.sending : copy.sendCode}
              size="lg"
              fullWidth
              disabled={busy || !/^\+9665\d{8}$/.test(toE164(phone))}
              onPress={() => run(async () => {
                const result = await requestOtp(toE164(phone));
                setDevelopmentCode(result.developmentCode);
                setSent(true);
              })}
            />
          </>
        ) : (
          <>
            <Input
              label="رمز التحقق"
              value={code}
              onChangeText={(v) => setCode(normalizePhoneDigits(v).slice(0, requiredDigits))}
              placeholder={developmentCode ?? '000000'}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              maxLength={requiredDigits}
              ltr
            />
            {developmentCode ? (
              <Txt variant="small" weight="semibold" tone="action" center>
                {copy.developmentCode(developmentCode)}
              </Txt>
            ) : null}
            <Button
              label={busy ? copy.verifying : copy.verify}
              size="lg"
              fullWidth
              disabled={busy || code.length < requiredDigits}
              onPress={() => run(async () => {
                setSession(await verifyOtp(toE164(phone), code));
              })}
            />
            <Button
              label={copy.changeNumber}
              variant="ghost"
              fullWidth
              disabled={busy}
              onPress={() => { setSent(false); setCode(''); setDevelopmentCode(undefined); setError(null); }}
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
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface.page },
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
