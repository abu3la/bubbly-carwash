// Imported from the theme subpath on purpose: pulling this from the package
// barrel would evaluate every component (and therefore every
// StyleSheet.create) before the theme exists.
import { configureDesignSystem } from '@bubbles/ui-native/theme';

configureDesignSystem();
