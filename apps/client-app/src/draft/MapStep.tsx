import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Polygon, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import Constants from 'expo-constants';
import { ArrowLeft, ArrowRight, LocateFixed, MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, IconButton, Input, Txt, useLocale, useToast } from '@bubbles/ui-native';
import { useCopy } from '../../src/i18n';
import { FALLBACK, currentPosition, describe, search, type Place } from '../../src/places';
import {
  autocompletePlaces,
  checkCoverage,
  type Coverage,
  type CoverageArea,
  listCoverageAreas,
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

type CheckState = 'checking' | 'ready' | 'error';

/** Verify the selected pin first, then its registered villa. */
export default function MapStep() {
  const { theme } = useUnistyles();
  const { language, isRTL } = useLocale();
  const router = useRouter();
  const { returnTo, skipCurrent } = useLocalSearchParams<{ returnTo?: string; skipCurrent?: string }>();
  const copy = useCopy();
  const toast = useToast();
  const map = useRef<MapView>(null);
  const inspectedPin = useRef<{ lat: number; lng: number } | null>(null);

  const [areas, setAreas] = useState<CoverageArea[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [busy, setBusy] = useState(true);
  const [checkState, setCheckState] = useState<CheckState>('checking');
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [villa, setVilla] = useState('');
  const [checkingVilla, setCheckingVilla] = useState(false);
  const ar = language === 'ar';
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [locating, setLocating] = useState(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inspection = useRef(0);
  const suggestionRequest = useRef(0);
  const selectionRequest = useRef(0);
  const acceptedQuery = useRef<string | null>(null);

  useEffect(() => {
    let live = true;
    listCoverageAreas().then(({ areas: result }) => {
      if (live) setAreas(result.filter((area) => area.boundary_verified && area.boundary.length >= 3));
    }).catch(() => { if (live) setAreas([]); });
    return () => { live = false; };
  }, []);

  const inspect = useCallback(async (lat: number, lng: number) => {
    const request = ++inspection.current;
    inspectedPin.current = { lat, lng };
    setBusy(true);
    setCoverage(null);
    setCheckState('checking');
    setVilla('');
    setCheckingVilla(false);

    setPlace({ lat, lng, line: '', district: '', city: '' });
    // Address labels are helpful, but an unavailable geocoder must not block a valid pin.
    void describe(lat, lng).then((nextPlace) => {
      if (request === inspection.current) setPlace(nextPlace);
    });
    try {
      const result = await checkCoverage(lat, lng);
      if (request !== inspection.current) return;
      setCoverage(result);
      setCheckState('ready');
    } catch {
      if (request === inspection.current) setCheckState('error');
    } finally {
      if (request === inspection.current) setBusy(false);
    }
  }, []);

  // Open on the customer's actual position when they allow it, on Sharbatly Village when
  // they do not. Either way the map is usable — a refused permission is a
  // normal outcome, not an error state.
  useEffect(() => {
    let live = true;
    (async () => {
      const actual = skipCurrent === '1' ? null : await currentPosition();
      if (!live) return;
      const pos = actual ?? FALLBACK;
      if (!actual && skipCurrent !== '1') toast.show(copy.onboarding.currentLocationUnavailable);
      map.current?.animateToRegion(
        { latitude: pos.lat, longitude: pos.lng, latitudeDelta: SPAN, longitudeDelta: SPAN },
        600,
      );
      await inspect(pos.lat, pos.lng);
    })();
    return () => {
      live = false;
      inspection.current += 1;
      selectionRequest.current += 1;
      if (settle.current) clearTimeout(settle.current);
    };
  }, [inspect, skipCurrent]);

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
    const previous = inspectedPin.current;
    if (previous && Math.abs(previous.lat - r.latitude) < 0.000001 && Math.abs(previous.lng - r.longitude) < 0.000001) return;
    if (settle.current) clearTimeout(settle.current);
    inspection.current += 1;
    setCoverage(null);
    setCheckState('checking');
    setBusy(true);
    settle.current = setTimeout(async () => {
      await inspect(r.latitude, r.longitude);
    }, 400);
  };

  const chooseSuggestion = async (suggestion: PlaceSuggestion) => {
    const request = ++selectionRequest.current;
    const selectedQuery = suggestion.main || suggestion.text;
    acceptedQuery.current = selectedQuery;
    setQuery(selectedQuery);
    setSuggestions([]);
    try {
      const { place: hit } = await fetchGooglePlace(suggestion.id, language);
      if (request !== selectionRequest.current) return;
      map.current?.animateToRegion(
        { latitude: hit.lat, longitude: hit.lng, latitudeDelta: SPAN, longitudeDelta: SPAN },
        600,
      );
    } catch {
      const hit = await search(suggestion.text);
      if (request !== selectionRequest.current) return;
      if (hit) {
        map.current?.animateToRegion(
          { latitude: hit.lat, longitude: hit.lng, latitudeDelta: SPAN, longitudeDelta: SPAN },
          600,
        );
      } else toast.show(ar ? 'لم نجد الموقع. حرّك الخريطة أو جرّب اسمًا آخر.' : 'Location not found. Move the map or try another name.');
    }
  };

  const runSearch = async () => {
    if (suggestions[0]) {
      await chooseSuggestion(suggestions[0]);
      return;
    }
    const hit = await search(query);
    if (!hit) { toast.show(ar ? 'لم نجد الموقع. حرّك الخريطة أو جرّب اسمًا آخر.' : 'Location not found. Move the map or try another name.'); return; }
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

  const verifyVilla = async () => {
    if (!place || !villa.trim() || busy) return;
    const request = ++inspection.current;
    setCheckingVilla(true);
    setCheckState('checking');
    try {
      const result = await checkCoverage(place.lat, place.lng, villa.trim());
      if (request !== inspection.current) return;
      setCoverage(result);
      setCheckState('ready');
    } catch {
      if (request === inspection.current) setCheckState('error');
    } finally {
      if (request === inspection.current) setCheckingVilla(false);
    }
  };
  const inArea = !!coverage?.area && coverage.status !== 'outside' && coverage.status !== 'areaUnavailable';
  const covered = coverage?.status === 'covered' && coverage.villaNumber === villa.trim().replace(/\s/g, '') && checkState === 'ready';

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
        >
          {areas.map((area) => <Polygon key={area.id}
            coordinates={area.boundary.map((point) => ({ latitude: point.lat, longitude: point.lng }))}
            fillColor={theme.action.tint} strokeColor={theme.action.primary} strokeWidth={2}
          />)}
        </MapView>

        <IconButton
          label={copy.common.back}
          variant="secondary"
          size="lg"
          onPress={() => router.back()}
          style={styles.back}
        >
          {isRTL ? (
            <ArrowRight size={theme.scale(22)} color={theme.text.primary} strokeWidth={2} />
          ) : (
            <ArrowLeft size={theme.scale(22)} color={theme.text.primary} strokeWidth={2} />
          )}
        </IconButton>

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

      <ScrollView style={styles.panelScroll} contentContainerStyle={styles.panel} keyboardShouldPersistTaps="handled">
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

        </View>

        <View accessibilityLiveRegion="polite" style={styles.status}>
          <Txt variant="body" weight="bold">{coverage?.area?.name[language] ?? (ar ? 'شربتلي فيلج، جدة' : 'Sharbatly Village, Jeddah')}</Txt>
          <Txt variant="small" tone={covered ? 'action' : 'secondary'}>
            {busy ? copy.onboarding.checkingArea
              : checkState === 'error' ? (ar ? 'تعذّر التحقق. حاول مرة أخرى.' : 'Could not check coverage. Try again.')
              : coverage?.status === 'outside' ? (ar ? 'هذا الموقع خارج نطاقنا. الخدمة متاحة في شربتلي فيلج فقط.' : 'This pin is outside our area. We currently serve Sharbatly Village only.')
              : coverage?.status === 'areaUnavailable' ? (ar ? 'الخدمة غير متاحة لهذا النطاق حاليًا. يمكنك استعراض التطبيق.' : 'This area is not available right now. You can still explore the app.')
              : covered ? (ar ? 'فيلتك ضمن التغطية. يمكنك حفظ العنوان.' : 'Your villa is covered. You can save this address.')
              : coverage?.status === 'villaUnavailable' ? (ar ? 'هذه الفيلا غير متاحة حاليًا. راجع الرقم أو جرّب لاحقًا.' : 'This villa is not available yet. Check the number or try later.')
              : (ar ? 'موقعك داخل النطاق. أدخل رقم الفيلا لنتحقق من توفر الخدمة.' : 'Your location is inside the area. Enter your villa number to check service availability.')}
          </Txt>
          {covered && coverage?.block && coverage.team ? <Txt variant="caption" tone="secondary">
            {ar ? `بلوك ${coverage.block.code} · ${coverage.team.name.ar}` : `Block ${coverage.block.code} · ${coverage.team.name.en}`}
          </Txt> : null}
        </View>
        {inArea ? <Input
          label={ar ? 'رقم الفيلا' : 'Villa number'}
          placeholder={ar ? 'الرقم كما هو على الفيلا' : 'Number shown on your villa'}
          value={villa}
          maxLength={24}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => void verifyVilla()}
          onChangeText={(value) => {
            inspection.current += 1;
            setCheckingVilla(false);
            setCheckState('ready');
            setVilla(value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).toUpperCase().replace(/\s/g, ''));
            if (coverage) setCoverage({ ...coverage, status: 'villaRequired', villaNumber: null, block: null, team: null });
          }}
        /> : null}
        {covered ? <Button
          label={copy.onboarding.confirmLocation}
          size="lg"
          fullWidth
          onPress={() => router.push({
            pathname: '/onboarding/address',
            params: {
              lat: String(place!.lat), lng: String(place!.lng),
              line: ar ? `فيلا ${coverage!.villaNumber}، شربتلي فيلج` : `Villa ${coverage!.villaNumber}, Sharbatly Village`,
              district: coverage!.area!.name[language], city: 'Jeddah',
              villaNumber: coverage!.villaNumber!, blockCode: coverage!.block?.code ?? '',
              ...(returnTo ? { returnTo } : {}),
            },
          })}
        /> : inArea ? <Button
          label={checkingVilla ? copy.common.verifying : (ar ? 'تحقق من الفيلا' : 'Check villa')}
          size="lg" fullWidth disabled={busy || checkingVilla || !villa.trim()}
          onPress={() => void verifyVilla()}
        /> : checkState === 'error' ? <Button
          label={ar ? 'إعادة التحقق' : 'Retry coverage'} size="lg" fullWidth
          onPress={() => { if (place) void inspect(place.lat, place.lng); }}
        /> : null}
        {!returnTo ? <Button label={ar ? 'متابعة دون حجز' : 'Continue without booking'} variant="ghost" fullWidth onPress={() => router.replace('/(tabs)/home')} /> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  screen: { flex: 1, backgroundColor: theme.surface.page },
  map: { flex: 1, minHeight: theme.scale(180), overflow: 'hidden' },
  panelScroll: { flexGrow: 0, maxHeight: '56%' },
  status: { gap: theme.spacing[1] },
  search: {
    position: 'absolute',
    top: rt.insets.top + theme.spacing[3],
    start: theme.spacing[5] + theme.scale(52),
    end: theme.spacing[5],
    gap: theme.spacing[2],
    zIndex: 2,
  },
  back: {
    position: 'absolute',
    top: rt.insets.top + theme.spacing[3],
    start: theme.spacing[5],
    zIndex: 3,
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
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5] + rt.insets.bottom,
    backgroundColor: theme.surface.page,
  },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[2] + 2 },
  addressText: { flex: 1, gap: 1, minHeight: theme.scale(40), justifyContent: 'center' },
}));
