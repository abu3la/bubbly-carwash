import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Droplets } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel, TickRow } from '../../src/components/Bits';
import { SERVICES } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';

export default function ChooseService() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const draft = useBookingDraft();
  const copy = useCopy();
  const selected = copy.services[draft.serviceKey];

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.chooseService} step={1} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        <View style={styles.services}>
          {SERVICES.map((option) => (
            <Card
              key={option.key}
              onPress={() => draft.setService(option.key)}
              selected={option.key === draft.serviceKey}
              variant={option.key === draft.serviceKey ? 'booking' : 'default'}
              style={styles.service}
            >
              <Droplets size={theme.scale(26)} color={theme.action.primary} strokeWidth={2} />
              <Txt variant="heading" weight="bold">
                {copy.services[option.key].name}
              </Txt>
              <Txt variant="small" tone="secondary">
                {copy.services[option.key].blurb}
              </Txt>
              <View style={styles.priceRow}>
                <Num variant="small" weight="bold">
                  {copy.common.fromPrice(option.price)}
                </Num>
                <Num variant="small" weight="medium" tone="secondary">
                  {copy.common.minutes(option.minutes)}
                </Num>
              </View>
            </Card>
          ))}
        </View>

        <View>
          <SectionLabel>{copy.booking.whatsIncluded}</SectionLabel>
          <Card style={styles.includes}>
            {selected.includes.map((line) => (
              <TickRow key={line}>{line}</TickRow>
            ))}
          </Card>
        </View>

        <Button label={copy.booking.continueBooking} size="lg" fullWidth onPress={() => router.push('/book/vehicle')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  services: { gap: theme.spacing[3] },
  service: { gap: theme.spacing[1] + 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing[4], marginTop: theme.spacing[1] },
  includes: { gap: theme.spacing[3] },
}));
