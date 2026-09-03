import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Processing } from '../../src/components/Processing';
import { packageById, useSession } from '../../src/session';
import { useCopy } from '../../src/i18n';

const SETTLE_MS = 1500;

export default function ProcessingPackage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useSession();
  const copy = useCopy();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Credits land here, so the wallet is already funded by the time the
      // success screen offers to book with them.
      session.buyPackage(packageById(Number(id)));
      router.replace(`/packages/done?id=${id}`);
    }, SETTLE_MS);
    return () => clearTimeout(timer);
    // Deliberately runs once — re-running would charge twice.
  }, []);

  return <Processing title={copy.packages.processing} sub={copy.packages.processingSub} />;
}
