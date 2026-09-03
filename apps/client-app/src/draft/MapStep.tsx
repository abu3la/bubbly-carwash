import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import Constants from 'expo-constants';
import { LocateFixed, MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Badge, Button, IconButton, Input, Txt, useLocale, useToast } from '@sama/ui-native';
import { useCopy } from '../../src/i18n';
import { FALLBACK, currentPosition, describe, search, type Place } from '../../src/places';
import {
  autocompletePlaces,
  fetchAvailability,
  fetchGooglePlace,
  type PlaceSuggestion,
} from '../../src/api';

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
const MAPS_CONFIG = Constants.expoConfig?.extra as
  | { googleMapsIosConfigured?: boolean; googleMapsAndroidConfigured?: boolean }
  | undefined;
const HAS_NATIVE_GOOGLE_MAPS = Platform.OS === 'ios'
  ? Boolean(MAPS_CONFIG?.googleMapsIosConfigured)
  : Boolean(MAPS_CONFIG?.googleMapsAndroidConfigured);

type Coverage = 'checking' | 'covered' | 'outside' | 'error';

/** The next date on which a team can operate, expressed in Riyadh time. */
function nextOperatingDate() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const date = new Date(Date.UTC(Number(value.year), Number(value.month) - 1, Number(value.day)));
  if (date.getUTCDay() === 5) date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function MapStep() {
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const copy = useCopy();
  const toast = useToast();
  const map = useRef<MapView>(null);

  const [place, setPlace] = useState<Place | null>(null);
  const [busy, setBusy] = useState(true);
  const [coverage, setCoverage] = useState<Coverage>('checking');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [locating, setLocating] = useState(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inspection = useRef(0);
  const suggestionRequest = useRef(0);
  const acceptedQuery = useRef<string | null>(null);

  const inspect = useCallback(async (lat: number, lng: number) => {
    const request = ++inspection.current;
    setBusy(true);
    setCoverage('checking');

    const [nextPlace, availability] = await Promise.allSettled([
      describe(lat, lng),
      fetchAvailability(lat, lng, nextOperatingDate()),
    ]);
    if (request !== inspection.current) return;

    setPlace(nextPlace.status === 'fulfilled'
      ? nextPlace.value
      : { lat, lng, line: '', district: '', city: '' });
    setCoverage(availability.status === 'rejected'
      ? 'error'
      : availability.value.covered
        ? 'covered'
        : 'outside');
    setBusy(false);
  }, []);

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
      await inspect(pos.lat, pos.lng);
    })();
    return () => {
      inspection.current += 1;
      if (settle.current) clearTimeout(settle.current);
    };
  }, [inspect]);

  // Suggestions are intentionally delayed: a request on every keystroke is
  // noisy for the customer and needlessly billable. Results are Saudi-only in
  // the Worker, and the current pin biases them towards the nearby district.
  useEffect(() => {
    const value = query.trim();
    const request = ++suggestionRequest.current;
    if (value.length < 3 || value === acceptedQuery.current) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      autocompletePlaces(value, place ?? FALLBACK, language)
        .then((result) => {
          if (request === suggestionRequest.current) {
            setSuggestions(result.suggestions.slice(0, 5));
          }
        })
        .catch(() => {
          if (request === suggestionRequest.current) setSuggestions([]);
        });
    }, 280);
    return () => {
      clearTimeout(timer);
      suggestionRequest.current += 1;
    };
  }, [language, place, query]);

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
      await inspect(r.latitude, r.longitude);
    }, 400);
  };

  const chooseSuggestion = async (suggestion: PlaceSuggestion) => {
    const selectedQuery = suggestion.main || suggestion.text;
    acceptedQuery.current = selectedQuery;
    setQuery(selectedQuery);
    setSuggestions([]);
    try {
      const { place: hit } = await fetchGooglePlace(suggestion.id, language);
      map.current?.animateToRegion(
        { latitude: hit.lat, longitude: hit.lng, latitudeDelta: SPAN, longitudeDelta: SPAN },
        600,
      );
    } catch {
      const hit = await search(suggestion.text);
      if (hit) {
        map.current?.animateToRegion(
          { latitude: hit.lat, longitude: hit.lng, latitudeDelta: SPAN, longitudeDelta: SPAN },
          600,
        );
      }
    }
  };

  const runSearch = async () => {
    if (suggestions[0]) {
      await chooseSuggestion(suggestions[0]);
      return;
    }
    const hit = await search(query);
    if (!hit) return;
    map.current?.animateToRegion(
      { latitude: hit.lat, longitude: hit.lng, latitudeDelta: SPAN, longitudeDelta: SPAN },
      600,
    );
  };

  const goToCurrentLocation = async () => {
    setLocating(true);
    const position = await currentPosition();
    setLocating(false);
    if (!position) {
      toast.show(copy.onboarding.currentLocationUnavailable);
      return;
    }
    map.current?.animateToRegion(
      {
        latitude: position.lat,
        longitude: position.lng,
        latitudeDelta: SPAN,
        longitudeDelta: SPAN,
      },
      600,
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.map}>
        <MapView
          ref={map}
          provider={HAS_NATIVE_GOOGLE_MAPS ? PROVIDER_GOOGLE : undefined}
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
            onChangeText={(value) => {
              acceptedQuery.current = null;
              setQuery(value);
            }}
            onSubmitEditing={runSearch}
            returnKeyType="search"
            placeholder={copy.onboarding.searchPlaceholder}
          />
          {suggestions.length ? (
            <View accessibilityRole="menu" style={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <Pressable
                  key={suggestion.id}
                  accessibilityRole="button"
                  accessibilityLabel={suggestion.text}
                  onPress={() => chooseSuggestion(suggestion)}
                  style={({ pressed }) => styles.suggestion(pressed)}
                >
                  <Txt variant="small" weight="semibold" numberOfLines={1}>
                    {suggestion.main}
                  </Txt>
                  {suggestion.secondary ? (
                    <Txt variant="caption" tone="secondary" numberOfLines={1}>
                      {suggestion.secondary}
                    </Txt>
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
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

        <IconButton
          label={copy.onboarding.useCurrentLocation}
          size="lg"
          disabled={locating}
          onPress={goToCurrentLocation}
          style={styles.locate}
        >
          {locating ? (
            <ActivityIndicator size="small" color={theme.action.primary} />
          ) : (
            <LocateFixed size={theme.scale(22)} color={theme.action.primary} strokeWidth={2.2} />
          )}
        </IconButton>
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
          <Badge tone={coverage === 'covered' ? 'violet' : coverage === 'outside' ? 'guava' : 'ice'}>
            {coverage === 'covered'
              ? copy.onboarding.servedHere
              : coverage === 'outside'
                ? copy.onboarding.outsideArea
                : coverage === 'error'
                  ? copy.onboarding.areaCheckFailed
                  : copy.onboarding.checkingArea}
          </Badge>
        </View>

        <Button
          label={copy.onboarding.confirmLocation}
          size="lg"
          fullWidth
          disabled={busy || !place || coverage !== 'covered'}
          onPress={() =>
            router.push({
              pathname: '/onboarding/address',
              params: {
                lat: String(place!.lat),
                lng: String(place!.lng),
                line: place!.line,
                district: place!.district,
                city: place!.city,
                ...(returnTo ? { returnTo } : {}),
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
    gap: theme.spacing[2],
    zIndex: 2,
  },
  suggestions: {
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    backgroundColor: theme.surface.card,
    borderWidth: theme.border.width,
    borderColor: theme.border.subtle,
    overflow: 'hidden',
  },
  suggestion: (pressed: boolean) => ({
    minHeight: theme.scale(52),
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    backgroundColor: pressed ? theme.surface.bookingSoft : theme.surface.card,
  }),
  // Anchored so the pin's point — not its box — sits on the map's centre.
  pin: {
    position: 'absolute',
    top: '50%',
    start: '50%',
    marginStart: -theme.scale(22),
    marginTop: -theme.scale(44),
  },
  locate: {
    position: 'absolute',
    end: theme.spacing[5],
    bottom: theme.spacing[4],
    zIndex: 2,
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
