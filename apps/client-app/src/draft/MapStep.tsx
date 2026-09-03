import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import Constants from 'expo-constants';
import { MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Badge, Button, Input, Txt } from '@sama/ui-native';
import { useCopy } from '../../src/i18n';
import { FALLBACK, currentPosition, describe, search, type Place } from '../../src/places';

/** Roughly a neighbourhood — close enough to place a car, wide enough to pan. */
const SPAN = 0.008;

/**
 * Google when a key is configured, the platform's own map when not.
 *
 * Google renders a grey rectangle without a valid key, which would break
 * onboarding outright — so the absence of a key degrades to Apple Maps on iOS
 * rather than to a broken screen. Coordinates are identical either way; what
 * Google adds is Saudi district data and an Android map at all.
 */
const HAS_GOOGLE_KEY = Boolean(
  (Constants.expoConfig?.ios as { config?: { googleMapsApiKey?: string } })?.config?.googleMapsApiKey,
);

export default function MapStep() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const copy = useCopy();
  const map = useRef<MapView>(null);

  const [place, setPlace] = useState<Place | null>(null);
  const [busy, setBusy] = useState(true);
  const [query, setQuery] = useState('');
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Open on the customer's actual position when they allow it, on Makkah when
  // they do not. Either way the map is usable — a refused permission is a
  // normal outcome, not an error state.
  useEffect(() => {
    (async () => {
      const pos = (await currentPosition()) ?? FALLBACK;
      map.current?.animateToRegion(
        { latitude: pos.lat, longitude: pos.lng, latitudeDelta: SPAN, longitudeDelta: SPAN },
        600,
      );
      setPlace(await describe(pos.lat, pos.lng));
      setBusy(false);
    })();
  }, []);

  /**
   * The pin is fixed to the centre of the screen and the map moves under it —
   * the standard ride-hailing gesture. So the address is whatever is under the
   * centre when the map stops, resolved after a pause so a long drag does not
   * fire a geocode per frame.
   */
  const onRegionChange = (r: Region) => {
    if (settle.current) clearTimeout(settle.current);
    setBusy(true);
    settle.current = setTimeout(async () => {
      setPlace(await describe(r.latitude, r.longitude));
      setBusy(false);
    }, 400);
  };

  const runSearch = async () => {
    const hit = await search(query);
    if (!hit) return;
    map.current?.animateToRegion(
      { latitude: hit.lat, longitude: hit.lng, latitudeDelta: SPAN, longitudeDelta: SPAN },
      600,
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.map}>
        <MapView
          ref={map}
          provider={HAS_GOOGLE_KEY ? PROVIDER_GOOGLE : undefined}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: FALLBACK.lat,
            longitude: FALLBACK.lng,
            latitudeDelta: SPAN,
            longitudeDelta: SPAN,
          }}
          onRegionChangeComplete={onRegionChange}
          showsUserLocation
          showsMyLocationButton={false}
          toolbarEnabled={false}
        />

        <View style={styles.search}>
          <Input
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={runSearch}
            returnKeyType="search"
            placeholder={copy.onboarding.searchPlaceholder}
          />
        </View>

        {/* Fixed to the centre: the map moves, the pin does not. */}
        <View style={styles.pin} pointerEvents="none">
          <MapPin
            size={theme.scale(44)}
            color={theme.action.primary}
            strokeWidth={2}
            fill={theme.action.tint}
          />
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.addressRow}>
          <MapPin size={theme.scale(18)} color={theme.text.primary} strokeWidth={2} />
          <View style={styles.addressText}>
            {busy ? (
              <ActivityIndicator size="small" color={theme.action.primary} />
            ) : (
              <>
                <Txt variant="body" weight="bold" numberOfLines={1}>
                  {place?.line || copy.onboarding.droppedPin}
                </Txt>
                <Txt variant="small" tone="secondary" numberOfLines={1}>
                  {[place?.district, place?.city].filter(Boolean).join('، ')}
                </Txt>
              </>
            )}
          </View>
          <Badge tone="violet">{copy.onboarding.servedHere}</Badge>
        </View>

        <Button
          label={copy.onboarding.confirmLocation}
          size="lg"
          fullWidth
          disabled={busy || !place}
          onPress={() =>
            router.push({
              pathname: '/onboarding/address',
              params: {
                lat: String(place!.lat),
                lng: String(place!.lng),
                line: place!.line,
                district: place!.district,
                city: place!.city,
              },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  screen: { flex: 1, backgroundColor: theme.surface.page },
  map: { flex: 1, overflow: 'hidden' },
  search: {
    position: 'absolute',
    top: rt.insets.top + theme.spacing[3],
    start: theme.spacing[5],
    end: theme.spacing[5],
  },
  // Anchored so the pin's point — not its box — sits on the map's centre.
  pin: {
    position: 'absolute',
    top: '50%',
    start: '50%',
    marginStart: -theme.scale(22),
    marginTop: -theme.scale(44),
  },
  panel: {
    gap: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[7] + rt.insets.bottom,
    backgroundColor: theme.surface.page,
  },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[2] + 2 },
  addressText: { flex: 1, gap: 1, minHeight: theme.scale(40), justifyContent: 'center' },
}));
