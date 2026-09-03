const fs = require('node:fs');
const path = require('node:path');
const base = require('./app.json');

const iosFile = process.env.FIREBASE_IOS_CONFIG_FILE ?? path.join(__dirname, 'firebase/GoogleService-Info.plist');
const androidFile = process.env.FIREBASE_ANDROID_CONFIG_FILE ?? path.join(__dirname, 'firebase/google-services.json');
const configured = fs.existsSync(iosFile) && fs.existsSync(androidFile);

export default {
  expo: {
    ...base.expo,
    plugins: [
      ...base.expo.plugins,
      ...(configured ? ['@react-native-firebase/app', '@react-native-firebase/messaging'] : []),
    ],
    ios: { ...base.expo.ios, ...(configured ? { googleServicesFile: iosFile } : {}) },
    android: { ...base.expo.android, ...(configured ? { googleServicesFile: androidFile } : {}) },
    extra: { ...base.expo.extra, firebaseConfigured: configured },
  },
};
