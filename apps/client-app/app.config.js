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
const GOOGLE_MAPS_IOS_KEY = process.env.GOOGLE_MAPS_IOS_KEY ?? '';
const GOOGLE_MAPS_ANDROID_KEY = process.env.GOOGLE_MAPS_ANDROID_KEY ?? '';
const fs = require('node:fs');
const path = require('node:path');
const FIREBASE_IOS_FILE = process.env.FIREBASE_IOS_CONFIG_FILE ?? path.join(__dirname, 'firebase/GoogleService-Info.plist');
const FIREBASE_ANDROID_FILE = process.env.FIREBASE_ANDROID_CONFIG_FILE ?? path.join(__dirname, 'firebase/google-services.json');
const FIREBASE_CONFIGURED = fs.existsSync(FIREBASE_IOS_FILE) && fs.existsSync(FIREBASE_ANDROID_FILE);

export default {
  expo: {
    ...{
      "name": "BubblesCarWash",
      "slug": "bubblescarwash-client",
      "scheme": "bubblescarwash",
      "version": "0.0.1",
      "orientation": "portrait",
      "userInterfaceStyle": "automatic",
      "newArchEnabled": true,
      "plugins": [
            "expo-router",
            "expo-font",
            "expo-video",
            "react-native-edge-to-edge",
            [
                  "expo-location",
                  {
                        "locationAlwaysAndWhenInUsePermission": "نستخدم موقعك لتحديد مكان سيارتك وعرض المواعيد المتاحة في منطقتك."
                  }
            ],
            "./plugins/with-google-maps-init-first",
            ...(FIREBASE_CONFIGURED ? ["@react-native-firebase/app", "@react-native-firebase/messaging"] : [])
      ]
    },
    ios: {
      ...{
        "bundleIdentifier": "com.bubblescarwash.client",
        "supportsTablet": false,
        "infoPlist": {
                "NSLocationWhenInUseUsageDescription": "نستخدم موقعك لتحديد مكان سيارتك وعرض المواعيد المتاحة في منطقتك."
        }
      },
      config: { googleMapsApiKey: GOOGLE_MAPS_IOS_KEY },
      ...(FIREBASE_CONFIGURED ? { googleServicesFile: FIREBASE_IOS_FILE } : {}),
    },
    android: {
      ...{
        "package": "com.bubblescarwash.client"
      },
      config: { googleMaps: { apiKey: GOOGLE_MAPS_ANDROID_KEY } },
      ...(FIREBASE_CONFIGURED ? { googleServicesFile: FIREBASE_ANDROID_FILE } : {}),
    },
    extra: {
      googleMapsIosConfigured: Boolean(GOOGLE_MAPS_IOS_KEY),
      googleMapsAndroidConfigured: Boolean(GOOGLE_MAPS_ANDROID_KEY),
      firebaseConfigured: FIREBASE_CONFIGURED,
    },
  },
};
