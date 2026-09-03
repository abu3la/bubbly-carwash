import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** `page` is the cloud ground; `card` is white; `dark` is the ink ground. */
  ground?: 'page' | 'card' | 'dark';
  /** Clears the status bar. Off for screens that bleed under it (the map). */
  safeTop?: boolean;
  /** Extra bottom room so a fixed bar or tab bar never covers the last row. */
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll = false,
  ground = 'page',
  safeTop = true,
  bottomInset = 0,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  // The insets are applied *after* contentStyle and added to whatever padding
  // the screen asked for, so a screen setting its own paddingTop can never
  // silently swallow the status bar.
  const flat = StyleSheet.flatten(contentStyle) ?? {};
  const pad = {
    paddingTop: (safeTop ? insets.top : 0) + Number(flat.paddingTop ?? 0),
    paddingBottom: bottomInset + insets.bottom + Number(flat.paddingBottom ?? 0),
  };

  if (!scroll) return <View style={[styles.root(ground), contentStyle, pad]}>{children}</View>;

  return (
    <Animated.ScrollView
      style={styles.root(ground)}
      contentContainerStyle={[styles.content, contentStyle, pad]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: (ground: 'page' | 'card' | 'dark') => ({
    flex: 1,
    backgroundColor: {
      page: theme.surface.page,
      card: theme.surface.card,
      dark: theme.surface.dark,
    }[ground],
  }),
  content: { flexGrow: 1 },
}));
