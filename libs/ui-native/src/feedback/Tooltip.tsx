import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { FadeOut } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { Reveal } from '../primitives/Reveal';
import { Txt } from '../primitives/Text';

interface TooltipProps {
  label: string;
  children: ReactNode;
  /** Force visible; otherwise it opens on long-press (there is no hover here). */
  open?: boolean;
}

/**
 * On a phone there is no hover, so the tooltip is bound to a long-press —
 * a real gesture rather than a state that can never fire.
 */
export function Tooltip({ label, children, open }: TooltipProps) {
  const [held, setHeld] = useState(false);
  const visible = open ?? held;

  return (
    <View style={styles.wrap}>
      {visible ? (
        <Reveal exiting={FadeOut.duration(120)} distance={4} style={styles.bubble}>
          <Txt variant="caption" weight="medium" tone="inverse" numberOfLines={1}>
            {label}
          </Txt>
        </Reveal>
      ) : null}
      <Pressable
        accessibilityLabel={label}
        onLongPress={() => setHeld(true)}
        onPressOut={() => setHeld(false)}
        delayLongPress={250}
      >
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: { alignSelf: 'flex-start' },
  bubble: {
    position: 'absolute',
    bottom: '100%',
    alignSelf: 'center',
    marginBottom: theme.spacing[2],
    paddingVertical: theme.spacing[1] + 2,
    paddingHorizontal: theme.spacing[2] + 2,
    backgroundColor: theme.surface.dark,
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    zIndex: 50,
  },
}));
