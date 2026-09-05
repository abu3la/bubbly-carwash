import type { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, Reveal, Screen, Txt } from '@bubbles/ui-native';

interface SuccessScreenProps {
  title: string;
  sub: string;
  children?: ReactNode;
  /** Pinned to the bottom of the screen. */
  actions?: ReactNode;
}

/** The shared "done" beat for every purchase flow. */
export function SuccessScreen({ title, sub, children, actions }: SuccessScreenProps) {

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.top}>
        {/* The seal is the brand mark with every beat lit, which is what the
            same mark means on the tracking screen: finished. A tick dropped on
            a coloured disc would say the same thing in a component kit's voice
            rather than this product's. */}
        <Reveal style={styles.seal}>
          <BeatIcon size="xl" active={3} />
        </Reveal>

        <Reveal delay={110} style={styles.copy}>
          <Txt variant="title" weight="bold" center>
            {title}
          </Txt>
          <Txt variant="small" tone="secondary" center>
            {sub}
          </Txt>
        </Reveal>

        {children ? (
          <Reveal delay={190} style={styles.slot}>
            {children}
          </Reveal>
        ) : null}
      </View>

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { padding: theme.spacing[6], justifyContent: 'space-between' },
  top: { alignItems: 'center', gap: theme.spacing[4], paddingTop: theme.spacing[10] },
  seal: { paddingVertical: theme.spacing[4] },
  copy: { gap: theme.spacing[2], alignItems: 'center' },
  slot: { width: '100%' },
  actions: { gap: theme.spacing[2], paddingTop: theme.spacing[6] },
}));
