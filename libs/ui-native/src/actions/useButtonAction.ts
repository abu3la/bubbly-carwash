import { useEffect, useRef, useState } from 'react';

/** Each button owns its pending action; sibling buttons do not show its spinner. */
export function useButtonAction(onPress?: () => unknown, disabled = false, loading = false) {
  const [pending, setPending] = useState(false);
  const locked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const busy = loading || pending;
  const inactive = disabled || busy || !onPress;
  const run = () => {
    if (inactive || locked.current || !onPress) return;
    locked.current = true;
    try {
      const result = onPress();
      if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
        setPending(true);
        return Promise.resolve(result).finally(() => {
          locked.current = false;
          if (mounted.current) setPending(false);
        });
      }
      locked.current = false;
    } catch (error) {
      locked.current = false;
      throw error;
    }
  };
  return { busy, inactive, run };
}
