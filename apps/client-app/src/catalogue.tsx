import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchCatalogue, type Catalogue } from './api';

/**
 * The live price list.
 *
 * Prices used to live in `content.ts`, which meant the back office could change
 * a package and the app would keep quoting the old figure until someone shipped
 * a build. This fetches the real one.
 *
 * We never substitute bundled prices. If the request fails, purchase screens
 * stop and offer a retry so the amount shown always matches the server.
 */
interface CatalogueState {
  catalogue: Catalogue | null;
  loading: boolean;
  error: boolean;
  reload: () => Promise<void>;
}

const CatalogueContext = createContext<CatalogueState | null>(null);

export function CatalogueProvider({ children }: { children: ReactNode }) {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setCatalogue(await fetchCatalogue());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo(() => ({ catalogue, loading, error, reload }), [catalogue, loading, error, reload]);
  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
}

/** Null until the live catalogue is available. */
export function useCatalogue(): Catalogue | null {
  return useCatalogueStatus().catalogue;
}

export function useCatalogueStatus(): CatalogueState {
  const value = useContext(CatalogueContext);
  if (!value) throw new Error('useCatalogueStatus must be inside CatalogueProvider');
  return value;
}
