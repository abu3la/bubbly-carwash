import { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MoyasarCheckout } from '../../src/components/MoyasarCheckout';
import { cancelBooking } from '../../src/api';

export default function BookingPayment() {
  const router = useRouter();
  const { id = '', url = '' } = useLocalSearchParams<{ id?: string; url?: string }>();

  const onResult = useCallback(async (result: 'success' | 'cancel') => {
    if (result === 'success') {
      router.replace({ pathname: '/book/processing', params: { id, result } });
      return;
    }
    if (id) await cancelBooking(id).catch(() => undefined);
    router.replace('/book/review');
  }, [id, router]);

  return <MoyasarCheckout checkoutUrl={url} onResult={onResult} />;
}
