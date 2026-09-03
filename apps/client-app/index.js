// Order matters: the design system must be configured before expo-router
// pulls in the route tree, which eagerly requires every screen module.
import './src/unistyles';
import 'expo-router/entry';
