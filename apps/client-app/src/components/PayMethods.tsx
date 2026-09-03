import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Card, Num, Radio, Txt } from '@sama/ui-native';
import { PAY_METHODS, type PayMethod } from '../content';
import { useCopy } from '../i18n';

interface PayMethodsProps {
  selected: PayMethod['key'];
  onSelect: (key: PayMethod['key']) => void;
}

/** Radio cards. One tap target per card, not a bare radio dot. */
export function PayMethods({ selected, onSelect }: PayMethodsProps) {
  const copy = useCopy();

  return (
    <View style={styles.list}>
      {PAY_METHODS.map((method) => (
        <Card
          key={method.key}
          onPress={() => onSelect(method.key)}
          selected={method.key === selected}
          style={styles.card}
        >
          <Radio selected={method.key === selected} onPress={() => onSelect(method.key)} />
          <View style={styles.text}>
            <Txt variant="body" weight="semibold">
              {copy.payMethods[method.key].label}
            </Txt>
          </View>
          <Num variant="small" tone="muted">
            {copy.payMethods[method.key].detail}
          </Num>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  list: { gap: theme.spacing[3] },
  card: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  text: { flex: 1 },
}));
