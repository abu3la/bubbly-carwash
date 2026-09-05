import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { CalendarDays, ClipboardCheck, UserRound } from 'lucide-react-native';
import { Txt } from '@bubbles/ui-native';

export function DriverNav({ active }: { active: 'jobs' | 'history' | 'account' }) {
  const router = useRouter();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  return <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, theme.spacing[2]) }]}>
    {([
      { key: 'jobs', label: 'المهام', Icon: CalendarDays },
      { key: 'history', label: 'السجل', Icon: ClipboardCheck },
      { key: 'account', label: 'حسابي', Icon: UserRound },
    ] as const).map(({ key, label, Icon }) => <Pressable
      key={key} accessibilityRole="tab" accessibilityState={{ selected: key === active }}
      onPress={() => { if (key !== active) router.replace(`/${key}`); }}
      style={({ pressed }) => [styles.item, { backgroundColor: pressed ? theme.surface.tint : 'transparent' }]}
    >
      <Icon size={theme.scale(22)} color={key === active ? theme.action.primary : theme.text.secondary} strokeWidth={key === active ? 2.5 : 1.8} />
      <Txt variant="small" weight={key === active ? 'bold' : 'regular'} tone={key === active ? 'action' : 'secondary'} center>{label}</Txt>
    </Pressable>)}
  </View>;
}

const styles = StyleSheet.create((theme) => ({
  nav: { flexDirection: 'row', backgroundColor: theme.surface.card, paddingTop: theme.spacing[2], paddingHorizontal: theme.spacing[4] },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[1], minHeight: theme.scale(56), borderRadius: theme.radius.md },
}));
