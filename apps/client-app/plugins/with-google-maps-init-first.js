const { withAppDelegate } = require('@expo/config-plugins');

const MAPS_INIT = /\n?\/\/ @generated begin react-native-maps-init[^\n]*\n[\s\S]*?\/\/ @generated end react-native-maps-init\n?/;
const DID_FINISH_LAUNCHING = /(didFinishLaunchingWithOptions[\s\S]*?\) -> Bool \{\n)/;

/**
 * Expo SDK 54 inserts GMSServices.provideAPIKey immediately before the final
 * super.application call. By then Expo has already created the React Native
 * window, so the first Google map can be a blank grey surface. Google requires
 * the key before any Maps SDK object exists. Keep Expo's generated block, but
 * move it to the start of didFinishLaunchingWithOptions on every prebuild.
 */
module.exports = function withGoogleMapsInitFirst(config) {
  return withAppDelegate(config, (next) => {
    if (next.modResults.language !== 'swift') return next;

    const source = next.modResults.contents;
    const block = source.match(MAPS_INIT)?.[0]?.trim();
    if (!block) return next;

    const withoutLateInit = source.replace(MAPS_INIT, '\n');
    if (!DID_FINISH_LAUNCHING.test(withoutLateInit)) {
      throw new Error('Could not locate didFinishLaunchingWithOptions in AppDelegate.swift');
    }

    next.modResults.contents = withoutLateInit.replace(
      DID_FINISH_LAUNCHING,
      `$1${block}\n`,
    );
    return next;
  });
};
