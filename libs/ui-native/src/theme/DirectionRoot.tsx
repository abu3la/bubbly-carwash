import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useLocale } from './locale';

/**
 * Mirrors everything inside it for the active language.
 *
 * Yoga resolves `start`/`end`, row order and logical padding against the
 * nearest ancestor's `direction`, so setting it here flips the whole tree with
 * no native flag and no restart — the switch is immediate.
 *
 * Wrap modal content in one of these too: a React Native `Modal` renders into
 * its own host view, outside the app's tree, so it does not inherit this.
 */
export function DirectionRoot({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { direction } = useLocale();
  return <View style={[{ direction, flex: 1 }, style]}>{children}</View>;
}
