import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Droplets } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel, TickRow } from '../../src/components/Bits';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';
import { useCatalogueStatus } from '../../src/catalogue';
import type { Service } from '../../src/content';
import { useCustomerData } from '../../src/customerData';

export default function ChooseService() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const draft = useBookingDraft();
  const copy = useCopy();
  const { catalogue, loading, error, reload } = useCatalogueStatus();
  const { membership } = useCustomerData();
  const { language } = useLocale();
  const selected = copy.services[draft.serviceKey];
  const services = catalogue?.services.length
    ? catalogue.services
      .filter((option) => option.key in copy.services
        && (option.key === 'exterior' || membership?.plan_id.startsWith('plus')))
      .map((option) => ({
        key: option.key as Service['key'],
        name: option.name[language],
        blurb: option.blurb[language],
        price: option.priceMinor / 100,
        minutes: option.minutes,
      }))
    : [];

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.chooseService} step={1} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        {loading ? <Txt variant="small" tone="secondary" center>{language === 'ar' ? 'جارٍ تحميل الخدمات والأسعار…' : 'Loading services and prices…'}</Txt> : null}
        {error ? <Button label={language === 'ar' ? 'إعادة تحميل الأسعار' : 'Retry prices'} variant="secondary" fullWidth onPress={() => void reload()} /> : null}
        <View style={styles.services}>
          {services.map((option) => (
            <Card
              key={option.key}
              onPress={() => draft.setService(option.key)}
              selected={option.key === draft.serviceKey}
              variant={option.key === draft.serviceKey ? 'booking' : 'default'}
              style={styles.service}
            >
              <Droplets size={theme.scale(26)} color={theme.action.primary} strokeWidth={2} />
              <Txt variant="heading" weight="bold">
                {option.name}
              </Txt>
              <Txt variant="small" tone="secondary">
                {option.blurb}
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

        <Button label={copy.booking.continueBooking} size="lg" fullWidth disabled={loading || error || services.length === 0} onPress={() => router.push('/book/vehicle')} />
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
