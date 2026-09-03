import { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MoyasarCheckout } from '../../src/components/MoyasarCheckout';
import { abandonMembership } from '../../src/api';

export default function MembershipPayment() {
  const router = useRouter();
  const { id = '', url = '' } = useLocalSearchParams<{ id?: string; url?: string }>();

  const onResult = useCallback(async (result: 'success' | 'cancel') => {
    if (result === 'success') {
      router.replace({ pathname: '/club/processing', params: { id, result } });
      return;
    }
    if (id) await abandonMembership(id).catch(() => undefined);
    router.replace('/club/review');
  }, [id, router]);

  return <MoyasarCheckout checkoutUrl={url} onResult={onResult} />;
}
