import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, Button, Screen, Txt } from '@bubbles/ui-native';

interface PaymentFailureScreenProps {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
  backLabel: string;
  onBack: () => void;
}

/** Why a payment did not finish and the one sensible next step. Unlit beats: nothing was confirmed. */
export function PaymentFailureScreen({ title, body, actionLabel, onAction, backLabel, onBack }: PaymentFailureScreenProps) {
  return (
    <Screen ground="attention" contentStyle={styles.screen}>
      <View style={styles.message}>
        <BeatIcon size="lg" active={0} />
        <View style={styles.copy}>
          <Txt variant="heading" weight="bold" center>{title}</Txt>
          <Txt accessibilityLiveRegion="polite" variant="small" tone="secondary" center>{body}</Txt>
        </View>
      </View>
      <View style={styles.actions}>
        <Button label={actionLabel} size="lg" fullWidth onPress={onAction} />
        <Button label={backLabel} variant="ghost" fullWidth onPress={onBack} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { paddingHorizontal: theme.spacing[6], paddingBottom: theme.spacing[5] },
  message: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[6] },
  copy: { alignItems: 'center', gap: theme.spacing[2] },
  actions: { gap: theme.spacing[2] },
}));
