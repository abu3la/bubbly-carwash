/* global __DEV__ */
// Order matters: the design system must be configured before expo-router
// pulls in the route tree, which eagerly requires every screen module.
import './src/unistyles';
if (__DEV__ && process.env.EXPO_PUBLIC_CHECKOUT_PREVIEW === '1') {
  require('./src/checkoutPreviewEntry');
} else {
  require('expo-router/entry');
}
