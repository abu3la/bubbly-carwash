import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Input, Num, Screen, Txt } from '@sama/ui-native';
import { useCopy } from '../../src/i18n';
import { AuthError, requestOtp, toE164 } from '../../src/auth';
import { FlowHeader } from '../../src/components/FlowHeader';

const NATIONAL_DIGITS = 9;

export default function Phone() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = useCopy();
  const digits = phone.replace(/\D/g, '');
  const ready = digits.length === NATIONAL_DIGITS;

  return (
    <Screen contentStyle={styles.screen}>
      <FlowHeader title={copy.onboarding.signInTitle} step={1} steps={4} onBack={() => router.back()} />

      <View style={styles.body}>
        <View style={styles.head}>
          <Txt variant="title" weight="bold">
            {copy.onboarding.phoneTitle}
          </Txt>
          <Txt variant="small" tone="secondary">
            {copy.onboarding.phoneSub}
          </Txt>
        </View>

        {/* The dial code leads the field in both languages, so the row's
            direction is set explicitly rather than inherited. */}
        <View style={styles.phoneRow}>
          <View style={styles.dial}>
            <Num variant="body" weight="semibold">
              +966
            </Num>
          </View>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder={copy.onboarding.phonePlaceholder}
            keyboardType="phone-pad"
            inputMode="tel"
            maxLength={12}
            ltr
            containerStyle={styles.phoneField}
          />
        </View>

        <View style={styles.spacer} />

        {error ? (
          <Txt variant="small" tone="danger" center>
            {error}
          </Txt>
        ) : null}

        <Button
          label={sending ? copy.common.sending : copy.onboarding.sendCode}
          size="lg"
          fullWidth
          disabled={!ready || sending}
          onPress={async () => {
            setError(null);
            setSending(true);
            try {
              // A real request. If it fails the customer stays on this screen
              // with the reason, rather than walking into a code entry that
              // could never succeed.
              await requestOtp(toE164(phone));
              router.push({ pathname: '/onboarding/otp', params: { phone: digits } });
            } catch (e) {
              setError(copy.authErrors[e instanceof AuthError ? e.code : 'unknown']);
            } finally {
              setSending(false);
            }
          }}
        />
        <Txt variant="caption" tone="muted">
          {copy.onboarding.terms}
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { paddingBottom: theme.spacing[7] },
  body: { flex: 1, paddingHorizontal: theme.spacing[6], paddingTop: theme.spacing[5], gap: theme.spacing[4] },
  head: { gap: theme.spacing[1] + 2 },
  // The dial code and the digits are ONE value — +966551234567 is what gets
  // sent — so this row is a left-to-right island in both languages, never a
  // mirrored pair. `direction` pins it at the node instead of leaving it to
  // inherit the page's direction, which is what made it flip.
  phoneRow: {
    direction: 'ltr',
    flexDirection: 'row',
    gap: theme.spacing[2] + 2,
    alignItems: 'flex-start',
  },
  dial: {
    height: theme.scale(44),
    justifyContent: 'center',
    paddingHorizontal: theme.scale(14),
    backgroundColor: theme.surface.card,
    borderWidth: theme.border.width,
    borderColor: theme.border.strong,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  phoneField: { flex: 1 },
  spacer: { flex: 1 },
}));
