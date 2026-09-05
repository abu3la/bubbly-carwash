import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Reveal, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { useCopy } from '../../src/i18n';

export default function Permission() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const copy = useCopy();
  const { language } = useLocale();
  const openMap = () => router.push('/onboarding/map');
  const chooseOnMap = () => router.push({ pathname: '/onboarding/map', params: { skipCurrent: '1' } });

  return (
    <Screen scroll contentStyle={styles.screen}>
      <View style={styles.stage}>
        {/* The mark stands bare. A glyph parked on a tinted disc is the
            component-kit default, and the container adds nothing the icon's own
            weight and colour cannot carry. */}
        <Reveal>
          <MapPin size={theme.scale(64)} color={theme.action.primary} strokeWidth={1.6} />
        </Reveal>
        <Reveal delay={90} style={styles.copy}>
          <Txt variant="title" weight="bold" center>
            {copy.onboarding.locationTitle}
          </Txt>
          <Txt variant="body" tone="secondary" center style={styles.blurb}>
            {copy.onboarding.locationBlurb}
          </Txt>
        </Reveal>
      </View>

      <View style={styles.actions}>
        <Button label={copy.onboarding.allowLocation} size="lg" fullWidth onPress={openMap} />
        <Button
          label={copy.onboarding.enterManually}
          variant="ghost"
          fullWidth
          onPress={chooseOnMap}
        />
        <Button label={language === 'ar' ? 'استعرض الباقات' : 'Browse packages'} variant="ghost" fullWidth onPress={() => router.replace('/club')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { padding: theme.spacing[6], justifyContent: 'space-between' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[5] },
  copy: { alignItems: 'center', gap: theme.spacing[2] },
  blurb: { maxWidth: theme.scale(290) },
  actions: { gap: theme.spacing[2] },
}));
