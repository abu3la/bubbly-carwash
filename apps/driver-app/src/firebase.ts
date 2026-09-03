import Constants from 'expo-constants';
import { PermissionsAndroid, Platform } from 'react-native';
import { registerPushToken } from './api';

/** Register the native FCM token only in builds carrying Firebase config. */
export async function registerFirebaseMessaging(onOpen?: (route: string) => void) {
  if (!Constants.expoConfig?.extra?.firebaseConfigured || Platform.OS === 'web') return null;
  const {
    getInitialNotification, getMessaging, getToken, onNotificationOpenedApp,
    onTokenRefresh, registerDeviceForRemoteMessages, requestPermission, AuthorizationStatus,
  } = await import('@react-native-firebase/messaging');
  const messaging = getMessaging();
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) return null;
  }
  await registerDeviceForRemoteMessages(messaging);
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
  const initial = await getInitialNotification(messaging);
  if (initial) setTimeout(() => open(initial), 0);
  return () => { stopRefresh(); stopOpen(); };
}
