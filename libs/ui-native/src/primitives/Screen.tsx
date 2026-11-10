import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

type Ground = 'page' | 'card' | 'dark' | 'done' | 'attention';

interface ScreenProps {
  children: ReactNode;
  /** Fixed title/action row, outside the scrolling body. */
  header?: ReactNode;
  scroll?: boolean;
  /** `page` is cloud, `card` white, `dark` ink. `done` and `attention` tint a whole result screen. */
  ground?: Ground;
  /** Clears the status bar. Off for screens that bleed under it (the map). */
  safeTop?: boolean;
  /** Turn off when a sibling navigation bar already owns the bottom safe area. */
  safeBottom?: boolean;
  /** Extra bottom room so a fixed bar or tab bar never covers the last row. */
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  header,
  scroll = false,
  ground = 'page',
  safeTop = true,
  safeBottom = true,
  bottomInset = 0,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  // The insets are applied *after* contentStyle and added to whatever padding
  // the screen asked for, so a screen setting its own paddingTop can never
  // silently swallow the status bar.
  const flat = StyleSheet.flatten(contentStyle) ?? {};
  const pad = {
    paddingTop: (safeTop ? insets.top : 0) + Number(flat.paddingTop ?? flat.paddingVertical ?? flat.padding ?? 0),
    paddingBottom: bottomInset + (safeBottom ? insets.bottom : 0) + Number(flat.paddingBottom ?? flat.paddingVertical ?? flat.padding ?? 0),
  };

  if (header != null) {
    const headerGap = flat.rowGap ?? flat.gap ?? 0;
    const headerPadding: ViewStyle = {
      paddingTop: pad.paddingTop,
      paddingHorizontal: flat.paddingHorizontal ?? flat.padding,
      paddingLeft: flat.paddingLeft,
      paddingRight: flat.paddingRight,
      paddingStart: flat.paddingStart,
      paddingEnd: flat.paddingEnd,
      paddingBottom: typeof headerGap === 'number' ? headerGap : 0,
    };
    const bodyPadding = { ...pad, paddingTop: 0 };
    return (
      <View style={styles.root(ground)}>
        <View style={[styles.header, headerPadding]}>{header}</View>
        {scroll ? (
          <Animated.ScrollView
            style={styles.root(ground)}
            contentContainerStyle={[styles.content, contentStyle, bodyPadding]}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
            showsVerticalScrollIndicator={false}
          >
            {children}
          </Animated.ScrollView>
        ) : (
          <View style={[styles.root(ground), contentStyle, bodyPadding]}>{children}</View>
        )}
      </View>
    );
  }

  if (!scroll) return <View style={[styles.root(ground), contentStyle, pad]}>{children}</View>;

  return (
    <Animated.ScrollView
      style={styles.root(ground)}
      contentContainerStyle={[styles.content, contentStyle, pad]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: (ground: Ground) => ({
    flex: 1,
    backgroundColor: {
      page: theme.surface.page,
      card: theme.surface.card,
      dark: theme.surface.dark,
      done: theme.tone.verified,
      attention: theme.tone.attention,
    }[ground],
  }),
  header: { flexShrink: 0 },
  content: { flexGrow: 1 },
}));
