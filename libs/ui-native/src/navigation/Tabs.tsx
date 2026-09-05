import { useState } from 'react';
import { Pressable, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from 'react-native-reanimated';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Txt } from '../primitives/Text';

interface TabsProps {
  tabs: string[];
  value: string;
  onChange: (tab: string) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * A segmented pill. The white indicator slides between tabs instead of
 * appearing under each one, so switching reads as one object moving.
 */
export function Tabs({ tabs, value, onChange, style }: TabsProps) {
  const { theme } = useUnistyles();
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);

  const index = Math.max(0, tabs.indexOf(value));
  const inset = theme.scale(3);
  const cell = Math.max(0, width - inset * 2) / Math.max(tabs.length, 1);

  const indicator = useAnimatedStyle(() => ({
    width: cell,
    // `start` is mirrored by the layout engine, so the indicator travels the
    // right way in Arabic without any manual sign flipping.
    transform: [{ translateX: 0 }],
    start: withTiming(inset + cell * index, { duration: reduced ? 0 : theme.duration.base }),
  }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.tray, style]}
    >
      {width > 0 ? <Animated.View style={[styles.indicator, indicator]} /> : null}
      {tabs.map((tab) => {
        const on = tab === value;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(tab)}
            style={styles.tab}
          >
            <Txt variant="small" weight="semibold" tone={on ? 'primary' : 'muted'}>
              {tab}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  tray: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: theme.palette.ink06,
    borderRadius: theme.radius.pill,
    borderCurve: 'continuous',
    padding: theme.scale(3),
  },
  indicator: {
    position: 'absolute',
    top: theme.scale(3),
    bottom: theme.scale(3),
    backgroundColor: theme.surface.card,
    borderRadius: theme.radius.pill,
    borderCurve: 'continuous',
    boxShadow: theme.shadow.tab,
  },
  tab: {
    flex: 1,
    minHeight: theme.scale(44),
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
