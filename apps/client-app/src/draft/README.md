# Not routed yet

`MapStep.tsx` is the real map picker: `react-native-maps` centred under a fixed
pin, `expo-location` for the device position and reverse geocoding, feeding real
coordinates into `POST /me/addresses`.

It lives here rather than under `app/` because expo-router bundles every file in
that tree, so an unrouted screen still gets its imports resolved — and both of
those packages are native. They are installed in `package.json` but not in the
current dev client, so importing them anywhere under `app/` red-screens the app
before onboarding can run.

To bring it back:

1. Put `GOOGLE_MAPS_KEY` in `apps/client-app/.env`
2. `npx expo prebuild --clean` then `npx expo run:ios`
3. Move this file to `app/onboarding/map.tsx`
4. Route `permission` → `map` → `address` again

Until then onboarding collects the address by hand and saves it with null
coordinates, which the schema and the API both allow.
