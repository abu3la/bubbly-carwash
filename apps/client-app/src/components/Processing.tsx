import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, Reveal, Screen, Txt } from '@bubbles/ui-native';

/**
 * The payment/activation wait. The brand mark beats while the gateway works —
 * the one place the pulse means "busy" rather than "progress".
 */
export function Processing({ title, sub }: { title: string; sub: string }) {
  return (
    <Screen contentStyle={styles.screen}>
      <Reveal style={styles.stack}>
        <BeatIcon size="lg" animate active={3} />
        <View style={styles.copy}>
          <Txt variant="title" weight="bold" center>
            {title}
          </Txt>
          <Txt variant="small" tone="secondary" center>
            {sub}
          </Txt>
        </View>
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { alignItems: 'center', justifyContent: 'center', padding: theme.spacing[6] },
  stack: { alignItems: 'center', gap: theme.spacing[6] },
  copy: { gap: theme.spacing[2], alignItems: 'center' },
}));
