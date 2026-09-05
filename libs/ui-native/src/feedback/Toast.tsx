import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { SlideOutDown } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import type { BeatKey } from '@bubbles/design-tokens';
import { Reveal } from '../primitives/Reveal';
import { Txt } from '../primitives/Text';

interface ToastMessage {
  id: number;
  text: string;
  /** Colours the leading dot with the matching beat colour. */
  tone?: BeatKey;
}

interface ToastApi {
  show: (text: string, tone?: BeatKey) => void;
}

const ToastContext = createContext<ToastApi | null>(null);
const DISMISS_MS = 2600;

/** Mount once, above the navigator, so any screen can raise a toast. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  const show = useCallback((text: string, tone?: BeatKey) => {
    if (timer.current) clearTimeout(timer.current);
    seq.current += 1;
    setToast({ id: seq.current, text, tone });
    timer.current = setTimeout(() => setToast(null), DISMISS_MS);
  }, []);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <View style={styles.host} pointerEvents="box-none">
        {toast ? (
          <Reveal key={toast.id} exiting={SlideOutDown.duration(180)} distance={20} style={styles.toast}>
            {toast.tone ? <View style={styles.dot(toast.tone)} /> : null}
            <Txt variant="small" weight="medium" tone="inverse">
              {toast.text}
            </Txt>
          </Reveal>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside <ToastProvider>');
  return api;
}

const styles = StyleSheet.create((theme, rt) => ({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: theme.layout.tabBar + rt.insets.bottom + theme.spacing[3],
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2] + 2,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.scale(18),
    backgroundColor: theme.surface.dark,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    boxShadow: theme.shadow.float,
  },
  dot: (tone: BeatKey) => ({
    width: theme.scale(10),
    height: theme.scale(10),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.beat[tone],
  }),
}));
