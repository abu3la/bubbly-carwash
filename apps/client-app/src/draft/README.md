# Google Maps location picker

`MapStep.tsx` is the real map picker: `react-native-maps` centred under a fixed
pin, `expo-location` for the device position and reverse geocoding, feeding real
coordinates into `POST /me/addresses`.

The route at `app/onboarding/map.tsx` re-exports this screen. Keeping the larger
implementation here leaves the router tree limited to route entry points.

Native setup:

1. Put `GOOGLE_MAPS_IOS_KEY` and `GOOGLE_MAPS_ANDROID_KEY` in
   `apps/client-app/.env`
2. `npx expo prebuild --clean` then `npx expo run:ios`

Places autocomplete is proxied through the authenticated Worker. Its server key
is never bundled into the app.
