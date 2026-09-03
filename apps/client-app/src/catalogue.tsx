import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchCatalogue, type Catalogue } from './api';

/**
 * The live price list.
 *
 * Prices used to live in `content.ts`, which meant the back office could change
 * a package and the app would keep quoting the old figure until someone shipped
 * a build. This fetches the real one.
 *
 * `content.ts` is still the fallback: if the network is down the app shows the
 * prices it shipped with rather than an empty screen. They can be stale, which
 * is why anything that actually charges money is priced by the server at
 * booking time, never by whatever the app happens to be displaying.
 */
const CatalogueContext = createContext<Catalogue | null>(null);

export function CatalogueProvider({ children }: { children: ReactNode }) {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);

  useEffect(() => {
    let alive = true;
    fetchCatalogue()
      .then((c) => alive && setCatalogue(c))
      // Deliberately silent: falling back to the bundled list is a normal
      // outcome offline, not an error worth interrupting anyone over.
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return <CatalogueContext.Provider value={catalogue}>{children}</CatalogueContext.Provider>;
}

/** Null until the first fetch lands — callers fall back to bundled content. */
export function useCatalogue(): Catalogue | null {
  return useContext(CatalogueContext);
}
