import Constants from 'expo-constants';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { registerPushToken, unregisterPushToken } from './api';

/** Register the native FCM token only in builds carrying Firebase config. */
export async function registerFirebaseMessaging(onOpen?: (route: string) => void) {
  if (!Constants.expoConfig?.extra?.firebaseConfigured || Platform.OS === 'web') return null;
  const {
    getInitialNotification, getMessaging, getToken, onMessage, onNotificationOpenedApp,
    onTokenRefresh, requestPermission, AuthorizationStatus,
  } = await import('@react-native-firebase/messaging');
  const messaging = getMessaging();
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) return null;
  }
  const status = await requestPermission(messaging);
  if (status !== AuthorizationStatus.AUTHORIZED && status !== AuthorizationStatus.PROVISIONAL) return null;
  const token = await getToken(messaging);
  await registerPushToken(token, Platform.OS as 'ios' | 'android');
  const stopRefresh = onTokenRefresh(messaging, (next) => {
    void registerPushToken(next, Platform.OS as 'ios' | 'android');
  });
  const open = (message: { data?: Record<string, string | object> }) => {
    const route = message.data?.route;
    if (typeof route === 'string') onOpen?.(route);
  };
  const stopOpen = onNotificationOpenedApp(messaging, open);
  const stopForeground = onMessage(messaging, (message) => {
    if (message.notification?.title || message.notification?.body) {
      Alert.alert(message.notification.title ?? 'BubblesCarWash', message.notification.body ?? '');
    }
  });
  const initial = await getInitialNotification(messaging);
  if (initial) setTimeout(() => open(initial), 0);
  return () => { stopRefresh(); stopOpen(); stopForeground(); };
}

/** Stop a signed-out device from receiving the previous driver's jobs. */
export async function unregisterFirebaseMessaging() {
  if (!Constants.expoConfig?.extra?.firebaseConfigured || Platform.OS === 'web') return;
  const { getMessaging, getToken } = await import('@react-native-firebase/messaging');
  const token = await getToken(getMessaging());
  if (token) await unregisterPushToken(token);
}
