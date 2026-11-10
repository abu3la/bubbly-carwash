import { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MoyasarCheckout, type CheckoutResult } from '../../src/components/MoyasarCheckout';

export default function BookingPayment() {
  const router = useRouter();
  const { id = '', url = '' } = useLocalSearchParams<{ id?: string; url?: string }>();

  const onResult = useCallback((result: CheckoutResult) => {
    router.replace({ pathname: '/book/processing', params: { id, result } });
  }, [id, router]);

  return <MoyasarCheckout checkoutUrl={url} onResult={onResult} />;
}
