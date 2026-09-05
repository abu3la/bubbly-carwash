import { useEffect, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, DirectionRoot, Txt, useLocale } from '@bubbles/ui-native';
import { useCopy } from '../i18n';

/** How long the splash holds while the tree is rebuilt. */
const BOOT_MS = 550;

/**
 * The app's own start-up screen, and the single place direction is decided.
 *
 * A language change routes back through here rather than mutating the running
 * interface: the splash covers the switch, the tree below is remounted with a
 * fresh key, and it comes back up in the new direction from its first frame.
 * That is what a restart would have given us — iOS will not let an app
 * relaunch itself, and `Updates.reloadAsync()` reloads the JS bundle without
 * re-reading the native RTL flag, so this is the honest equivalent.
 *
 * Session state deliberately lives *above* this component, so a language
 * switch does not throw away a booking in progress.
 */
export function Boot({ children }: { children: ReactNode }) {
  const { language } = useLocale();
  const [booting, setBooting] = useState(true);
  const [generation, setGeneration] = useState(0);
  const shown = useRef(language);

  useEffect(() => {
    // First mount, and every language change after it.
    const changed = shown.current !== language;
    shown.current = language;
    if (changed) setBooting(true);

    const timer = setTimeout(() => {
      setGeneration((n) => n + 1);
      setBooting(false);
    }, BOOT_MS);
    return () => clearTimeout(timer);
  }, [language]);

  if (booting) return <Splash />;

  // The key remounts everything below, so no screen carries a stale direction
  // into the new language.
  return <DirectionRoot key={`${language}-${generation}`}>{children}</DirectionRoot>;
}

function Splash() {
  const copy = useCopy();

  return (
    <DirectionRoot>
      <View style={styles.splash}>
        <BeatIcon size="lg" animate active={3} />
        <View style={styles.wordmark}>
          <Txt variant="display" weight="bold" tone="action" center>
            {copy.brand.name}
          </Txt>
          <Txt variant="body" weight="semibold" tone="muted" center>
            {copy.brand.latin}
          </Txt>
        </View>
      </View>
    </DirectionRoot>
  );
}

const styles = StyleSheet.create((theme) => ({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[5],
    backgroundColor: theme.surface.page,
  },
  wordmark: { alignItems: 'center', gap: 2 },
}));
