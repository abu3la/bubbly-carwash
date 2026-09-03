import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, Button, Reveal, Screen, Tag, Txt } from '@sama/ui-native';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';

export default function Welcome() {
  const router = useRouter();
  const session = useSession();
  const copy = useCopy();

  const skip = () => {
    session.completeOnboarding();
    router.replace('/(tabs)/home');
  };

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.stage}>
        {/* The brand mark introduces itself by doing the thing it does. */}
        <Reveal>
          <BeatIcon size="lg" animate active={3} />
        </Reveal>

        <Reveal delay={80} style={styles.wordmark}>
          <Txt variant="display" weight="bold" tone="action" center>
            {copy.brand.name}
          </Txt>
          <Txt variant="body" weight="semibold" tone="muted" center>
            {copy.brand.latin}
          </Txt>
        </Reveal>

        <Reveal delay={160} style={styles.copy}>
          <Txt variant="title" weight="bold" center>
            {copy.brand.tagline}
          </Txt>
          <Txt variant="body" tone="secondary" center style={styles.blurb}>
            {copy.onboarding.blurb}
          </Txt>
        </Reveal>

        {/* No booking exists yet at this point, so the restart costs nothing
            and needs no confirmation. */}
        <Reveal delay={240} style={styles.langs}>
          <Tag selected={session.language === 'ar'} onPress={() => session.setLanguage('ar')}>
            {copy.onboarding.languageArabic}
          </Tag>
          <Tag selected={session.language === 'en'} onPress={() => session.setLanguage('en')}>
            {copy.onboarding.languageEnglish}
          </Tag>
        </Reveal>
      </View>

      <View style={styles.actions}>
        <Button label={copy.onboarding.start} size="lg" fullWidth onPress={() => router.push('/onboarding/phone')} />
        <Button label={copy.onboarding.skip} variant="ghost" size="md" fullWidth onPress={skip} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { padding: theme.spacing[6], justifyContent: 'space-between' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[4] },
  wordmark: { alignItems: 'center', gap: 2 },
  copy: { alignItems: 'center', gap: theme.spacing[2] },
  blurb: { maxWidth: theme.scale(280) },
  langs: { flexDirection: 'row', gap: theme.spacing[2], marginTop: theme.spacing[2] },
  actions: { gap: theme.spacing[2] },
}));
