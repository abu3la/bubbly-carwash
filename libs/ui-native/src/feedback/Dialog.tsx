import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { FadeOut } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { DirectionRoot } from '../theme/DirectionRoot';
import { Reveal } from '../primitives/Reveal';
import { Txt } from '../primitives/Text';

interface DialogProps {
  open: boolean;
  title?: string;
  body?: string;
  children?: ReactNode;
  /** Action row, aligned to the end edge. */
  actions?: ReactNode;
  onClose: () => void;
  /** Accessible name for the scrim's dismiss target. */
  dismissLabel?: string;
}

export function Dialog({ open, title, body, children, actions, onClose, dismissLabel = 'إغلاق' }: DialogProps) {
  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* A Modal renders into its own host view, outside the app tree, so it
          does not inherit the root direction and has to restate it. */}
      <DirectionRoot>
        <Reveal exiting={FadeOut.duration(120)} distance={0} style={styles.scrim}>
          <Pressable style={StyleSheet.absoluteFill} accessibilityLabel={dismissLabel} onPress={onClose} />
          <Reveal delay={40} distance={16} style={styles.dialog}>
          {title ? (
            <Txt variant="title" weight="bold" style={styles.title}>
              {title}
            </Txt>
          ) : null}
          {body ? (
            <Txt variant="body" tone="secondary">
              {body}
            </Txt>
          ) : null}
          {children}
          {actions ? <View style={styles.actions}>{actions}</View> : null}
          </Reveal>
        </Reveal>
      </DirectionRoot>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[6],
    backgroundColor: 'rgba(23,22,46,0.4)',
  },
  dialog: {
    width: '100%',
    maxWidth: theme.scale(420),
    gap: theme.spacing[2],
    padding: theme.scale(28),
    backgroundColor: theme.surface.card,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    boxShadow: theme.shadow.float,
  },
  title: { marginBottom: 0 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing[2] + 2,
    marginTop: theme.spacing[4],
  },
}));
