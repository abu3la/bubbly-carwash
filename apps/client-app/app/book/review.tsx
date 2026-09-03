import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { BookingTicket, Button, Card, Checkbox, Radio, Screen, Tooltip, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow, SectionLabel } from '../../src/components/Bits';
import { ADD_ONS, SERVICES, type AddOn } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';
import { useCustomerData } from '../../src/customerData';
import { useCatalogue } from '../../src/catalogue';
import { useLocale } from '@sama/ui-native';

export default function Review() {
  const router = useRouter();
  const draft = useBookingDraft();
  const { membership } = useCustomerData();
  const catalogue = useCatalogue();
  const { language } = useLocale();
  const copy = useCopy();
  const liveService = catalogue?.services.find((item) => item.key === draft.serviceKey);
  const service = {
    name: liveService?.name[language] ?? copy.services[draft.serviceKey].name,
    price: (liveService?.priceMinor ?? (SERVICES.find((item) => item.key === draft.serviceKey)?.price ?? 40) * 100) / 100,
  };
  const addOns = catalogue?.addOns.map((item) => ({
    key: item.key as AddOn['key'],
    price: item.priceMinor / 100,
    name: item.name[language],
  })) ?? ADD_ONS.map((item) => ({ ...item, name: copy.addOns[item.key] }));
  const chosenAddOns = addOns.filter((a) => draft.addOnKeys.includes(a.key));
  const sources = membership ? (['club', 'cash'] as const) : (['cash'] as const);

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.review} step={4} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        <BookingTicket
          time={draft.slot}
          meta={`${draft.day} · ${draft.vehicleLabel} · ${draft.addressLabel}`}
        />

        <View>
          <SectionLabel>{copy.booking.addOnsSection}</SectionLabel>
          <Card style={styles.addOns}>
            {addOns.map((addOn) => (
              <Checkbox
                key={addOn.key}
                label={copy.booking.addOnWithPrice(addOn.name, copy.common.money(addOn.price))}
                checked={draft.addOnKeys.includes(addOn.key)}
                onChange={() => draft.toggleAddOn(addOn.key)}
              />
            ))}
          </Card>
        </View>

        {/* One list rather than a toggle: a member can hold a club membership
            AND a package balance, and "credit or not" cannot express that. The
            list is ordered best-value-first and opens on the first entry. */}
        {sources.length > 1 ? (
          <View>
            <SectionLabel>{copy.booking.paySourceSection}</SectionLabel>
            <Card style={styles.sources}>
              {sources.map((source) => (
                <Radio
                  key={source}
                  selected={draft.source === source}
                  onPress={() => draft.setSource(source)}
                  label={
                    source === 'club' ? copy.booking.sourceClub : copy.booking.sourceCash
                  }
                />
              ))}
            </Card>
            {/* Long-press explains the rule the ledger below then shows —
                this is the moment the question comes up. */}
            <Tooltip label={copy.booking.creditCoversWashOnly}>
              <Txt variant="caption" tone="secondary" style={styles.sourceNote}>
                {draft.source === 'club' && membership
                  ? copy.booking.clubRemaining(
                    membership.plans.weekly,
                    Math.max(0, membership.plans.weekly - membership.usedThisWeek),
                  )
                  : copy.booking.cashNote}
              </Txt>
            </Tooltip>
          </View>
        ) : null}

        <View style={styles.ledger}>
          {/* A credit covers the wash, never the add-ons — the ledger says so
              rather than letting it surprise anyone at checkout. */}
          <LedgerRow
            label={
              draft.source === 'club' ? copy.booking.fromClub(service.name) : service.name
            }
            amount={
              draft.source === 'cash'
                ? copy.common.money(service.price)
                : copy.booking.oneWash
            }
          />
          {chosenAddOns.map((addOn) => (
            <LedgerRow key={addOn.key} label={addOn.name} amount={copy.common.money(addOn.price)} />
          ))}
          <LedgerRow label={copy.common.totalWithVat} amount={copy.common.money(draft.total)} strong />
        </View>

        <Button
          label={draft.total === 0 ? copy.booking.confirmBooking : copy.booking.continueToPayment}
          size="lg"
          fullWidth
          onPress={() => router.push(draft.total === 0 ? '/book/processing' : '/book/pay')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  addOns: { gap: theme.spacing[2] },
  sources: { gap: theme.spacing[3] },
  sourceNote: { marginTop: theme.spacing[2] },
  ledger: { gap: theme.spacing[2] + 1 },
}));
