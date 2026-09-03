/**
 * Expo config as code, so the Google Maps key comes from the environment
 * instead of being committed.
 *
 * An embedded Maps key is extractable from any shipped binary — that is
 * unavoidable, which is why Google's answer is *restriction* rather than
 * secrecy: lock the key to this bundle id and package name in the Cloud
 * console, so a scraped key is useless anywhere else. Keeping it out of git is
 * still worth doing; it stops the key leaking before it is ever restricted.
 */
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY ?? '';

export default {
  expo: {
    ...{
      "name": "Sama",
      "slug": "sama-client",
      "scheme": "sama",
      "version": "0.0.1",
      "orientation": "portrait",
      "userInterfaceStyle": "automatic",
      "newArchEnabled": true,
      "plugins": [
            "expo-router",
            "expo-font",
            "react-native-edge-to-edge",
            [
                  "expo-location",
                  {
                        "locationAlwaysAndWhenInUsePermission": "نستخدم موقعك لتحديد مكان سيارتك وعرض المواعيد المتاحة في منطقتك."
                  }
            ]
      ]
    },
    ios: {
      ...{
        "bundleIdentifier": "com.samacarwash.client",
        "supportsTablet": false,
        "infoPlist": {
                "NSLocationWhenInUseUsageDescription": "نستخدم موقعك لتحديد مكان سيارتك وعرض المواعيد المتاحة في منطقتك."
        }
      },
      config: { googleMapsApiKey: GOOGLE_MAPS_KEY },
    },
    android: {
      ...{
        "package": "com.samacarwash.client"
      },
      config: { googleMaps: { apiKey: GOOGLE_MAPS_KEY } },
    },
  },
};
