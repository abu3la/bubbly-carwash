import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useReducedMotion, withSpring, withTiming } from 'react-native-reanimated';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Num, Screen, Txt } from '@bubbles/ui-native';
import { useCopy } from '../../src/i18n';
import { FlowHeader } from '../../src/components/FlowHeader';
import { AuthError, requestOtp, toE164, verifyOtp } from '../../src/auth';
import { useAuthSession } from '../../src/authSession';
import { fetchMe, hasVillaAddress, listAddresses, listVehicles } from '../../src/api';

const LIVE_OTP_LENGTH = 6;
const RESEND_SECONDS = 24;

export default function Otp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; developmentCode?: string; intent?: string }>();
  const { phone } = params;
  const national = phone ?? '';
  const [developmentCode, setDevelopmentCode] = useState(params.developmentCode);
  const length = developmentCode?.length ?? LIVE_OTP_LENGTH;
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<TextInput>(null);
  const copy = useCopy();
  const authSession = useAuthSession();

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const mmss = `00:${String(Math.max(0, left)).padStart(2, '0')}`;

  return (
    <Screen contentStyle={styles.screen}>
      <FlowHeader title={copy.onboarding.otpTitle} step={2} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        <View style={styles.head}>
          <Txt variant="title" weight="bold">
            {copy.onboarding.otpHeading}
          </Txt>
          <Txt variant="small" tone="secondary">
            {copy.onboarding.otpSentTo}{' '}
            <Num variant="small" weight="semibold" tone="secondary">
              {toE164(national)}
            </Num>
          </Txt>
          {developmentCode ? (
            <Txt variant="small" weight="semibold" tone="action">
              {copy.onboarding.developmentCodeHint(developmentCode)}
            </Txt>
          ) : null}
        </View>

        {/* One hidden field drives the boxes: the OS keyboard, paste and
            autofill all keep working, and the boxes are pure display. */}
        <Pressable onPress={() => input.current?.focus()} style={styles.boxes}>
          {Array.from({ length }, (_, i) => (
            <OtpBox key={i} digit={code[i]} active={i === code.length} />
          ))}
        </Pressable>
        <TextInput
          ref={input}
          value={code}
          onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, length))}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          autoFocus
          maxLength={length}
          style={styles.hidden}
        />

        <Txt variant="small" tone="muted" center>
          {left > 0 ? copy.onboarding.resendIn(mmss) : copy.onboarding.resendNow}
        </Txt>

        <View style={styles.spacer} />

        {error ? (
          <Txt variant="small" tone="danger" center>
            {error}
          </Txt>
        ) : null}

        <Button
          label={checking ? copy.common.verifying : copy.onboarding.verify}
          size="lg"
          fullWidth
          disabled={code.length < length || checking}
          onPress={async () => {
            setError(null);
            setChecking(true);
            try {
              // The real exchange. A wrong code fails here and goes no further,
              // which is the whole point of the screen.
              const verified = await verifyOtp(toE164(national), code);
              authSession.signedIn(verified);
              const [me, addresses, vehicles] = await Promise.all([
                fetchMe(), listAddresses(), listVehicles(),
              ]);
              if (!me.profile.full_name?.trim()) router.replace('/onboarding/profile');
              else if (!addresses.addresses.some(hasVillaAddress)) router.replace('/onboarding/permission');
              else if (!vehicles.vehicles.length) router.replace('/onboarding/vehicle');
              else router.replace(params.intent === 'subscription' ? '/club' : '/(tabs)/home');
            } catch (e) {
              setError(copy.authErrors[e instanceof AuthError ? e.code : 'unknown']);
              setCode('');
            } finally {
              setChecking(false);
            }
          }}
        />
        {left <= 0 ? (
          <Button
            label={copy.onboarding.resend}
            variant="ghost"
            fullWidth
            onPress={async () => {
              setError(null);
              setLeft(RESEND_SECONDS);
              try {
                const result = await requestOtp(toE164(national));
                setDevelopmentCode(result.developmentCode);
              } catch (e) {
                setError(copy.authErrors[e instanceof AuthError ? e.code : 'unknown']);
              }
            }}
          />
        ) : null}
      </View>
    </Screen>
  );
}

function OtpBox({ digit, active }: { digit?: string; active: boolean }) {
  const { theme } = useUnistyles();
  const reduced = useReducedMotion();

  // The box the cursor is on lifts and takes the violet border — the field
  // shows you where you are without a blinking caret per box.
  const boxStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(active ? theme.action.primary : theme.border.strong, {
      duration: reduced ? 0 : theme.duration.fast,
    }),
    transform: [
      { scale: reduced ? 1 : withSpring(active ? 1.04 : 1, { damping: 16, stiffness: 240, mass: 0.7 }) },
    ],
  }));

  return (
    <Animated.View style={[styles.box, boxStyle]}>
      <Num variant="title" weight="bold">
        {digit ?? ''}
      </Num>
    </Animated.View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { paddingBottom: theme.spacing[7] },
  body: { flex: 1, paddingHorizontal: theme.spacing[6], paddingTop: theme.spacing[5], gap: theme.spacing[4] },
  head: { gap: theme.spacing[1] + 2 },
  // One code, entered left to right in both languages — the same LTR island
  // as the phone row.
  boxes: {
    direction: 'ltr',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[1] + 2,
    marginTop: theme.spacing[2],
  },
  // Sized so six boxes and their gaps clear the narrowest screen we support:
  // 6 x 44 + 5 x 6 + the page's own padding still fits inside 393pt. At the
  // old 56pt the row overflowed the moment the code went from four to six.
  box: {
    width: theme.scale(44),
    height: theme.scale(54),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface.card,
    borderWidth: theme.border.width,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  spacer: { flex: 1 },
}));
