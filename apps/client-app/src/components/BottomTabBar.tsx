import { View } from 'react-native';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CalendarCheck, House, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { useCopy } from '../i18n';

const ICONS = { home: House, bookings: CalendarCheck, profile: User } as const;

type TabName = keyof typeof ICONS;

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const copy = useCopy();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, i) => {
        const name = route.name as TabName;
        const Icon = ICONS[name];
        if (!Icon) return null;
        return (
          <Tab
            key={route.key}
            label={copy.tabs[name]}
            Icon={Icon}
            focused={state.index === i}
            onPress={() => {
              if (state.index !== i) navigation.navigate(route.name);
            }}
          />
        );
      })}
    </View>
  );
}

function Tab({
  label,
  Icon,
  focused,
  onPress,
}: {
  label: string;
  Icon: typeof House;
  focused: boolean;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();
  const reduced = useReducedMotion();
  const ms = reduced ? 0 : theme.duration.base;

  // The icon rises a hair and the colour crosses over — the selected tab
  // changes state, it does not sprout a marker underneath it.
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: reduced
          ? 0
          : withSpring(focused ? -2 : 0, { damping: 16, stiffness: 220, mass: 0.8 }),
      },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: withTiming(
      interpolateColor(focused ? 1 : 0, [0, 1], [theme.text.muted, theme.action.primary]),
      { duration: ms },
    ),
  }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.tab}
    >
      <Animated.View style={iconStyle}>
        <Icon
          size={theme.scale(22)}
          strokeWidth={focused ? 2.4 : 1.9}
          color={focused ? theme.action.primary : theme.text.muted}
        />
      </Animated.View>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.surface.card,
    borderTopWidth: theme.border.width,
    borderTopColor: theme.border.subtle,
  },
  tab: {
    flex: 1,
    height: theme.layout.tabBar,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[1],
  },
  label: {
    fontFamily: theme.font.semibold,
    fontSize: theme.fontSize.label,
    lineHeight: theme.scale(14),
  },
}));
