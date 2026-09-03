// Order matters: the design system must be configured before expo-router pulls
// in the route tree, which eagerly requires every screen module. Calling
// configureDesignSystem() inside _layout.tsx is too late — imports hoist above
// it, so the components' StyleSheet.create runs against no theme.
import './src/unistyles';
import 'expo-router/entry';
