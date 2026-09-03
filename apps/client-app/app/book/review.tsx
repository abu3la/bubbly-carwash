import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { BookingTicket, Button, Card, Checkbox, Radio, Screen, Tooltip, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { LedgerRow, SectionLabel } from '../../src/components/Bits';
import { ADD_ONS, SERVICES } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';
import { useSession } from '../../src/session';

/** The list price of a service, which is data rather than copy. */
const SERVICE_PRICE = (key: (typeof SERVICES)[number]['key']) =>
  (SERVICES.find((s) => s.key === key) ?? SERVICES[0]).price;

export default function Review() {
  const router = useRouter();
  const draft = useBookingDraft();
  const { wallet, club, sources } = useSession();
  const copy = useCopy();
  const service = copy.services[draft.serviceKey];
  const chosenAddOns = ADD_ONS.filter((a) => draft.addOnKeys.includes(a.key));

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.review} step={4} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        <BookingTicket
          time={draft.slot}
          meta={`${draft.day} · ${copy.vehicleName} · ${copy.addressLabel}`}
        />

        <View>
          <SectionLabel>{copy.booking.addOnsSection}</SectionLabel>
          <Card style={styles.addOns}>
            {ADD_ONS.map((addOn) => (
              <Checkbox
                key={addOn.key}
                label={copy.booking.addOnWithPrice(copy.addOns[addOn.key], copy.common.money(addOn.price))}
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
                    source === 'club'
                      ? copy.booking.sourceClub
                      : source === 'package'
                        ? copy.booking.sourcePackage
                        : copy.booking.sourceCash
                  }
                />
              ))}
            </Card>
            {/* Long-press explains the rule the ledger below then shows —
                this is the moment the question comes up. */}
            <Tooltip label={copy.booking.creditCoversWashOnly}>
              <Txt variant="caption" tone="secondary" style={styles.sourceNote}>
                {draft.source === 'club' && club
                  ? copy.booking.clubRemaining(club.credits, club.weekly - club.used)
                  : draft.source === 'package'
                    ? copy.booking.useCreditSub(wallet.credits)
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
              draft.source === 'club'
                ? copy.booking.fromClub(service.name)
                : draft.source === 'package'
                  ? copy.booking.fromPackage(service.name)
                  : service.name
            }
            amount={
              draft.source === 'cash'
                ? copy.common.money(SERVICE_PRICE(draft.serviceKey))
                : copy.booking.oneWash
            }
          />
          {chosenAddOns.map((addOn) => (
            <LedgerRow key={addOn.key} label={copy.addOns[addOn.key]} amount={copy.common.money(addOn.price)} />
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
