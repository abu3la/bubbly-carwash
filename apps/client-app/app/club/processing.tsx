import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Processing } from '../../src/components/Processing';
import { planById, useSession } from '../../src/session';
import type { Plan } from '../../src/content';
import { useCopy } from '../../src/i18n';

const SETTLE_MS = 1500;

export default function ProcessingClub() {
  const router = useRouter();
  const { plan: planId } = useLocalSearchParams<{ plan: Plan['id'] }>();
  const session = useSession();
  const copy = useCopy();

  useEffect(() => {
    const timer = setTimeout(() => {
      session.joinClub(planById(planId));
      router.replace('/club/dashboard');
    }, SETTLE_MS);
    return () => clearTimeout(timer);
    // Deliberately runs once — re-running would charge twice.
  }, []);

  return <Processing title={copy.club.processing} sub={copy.club.processingSub} />;
}
