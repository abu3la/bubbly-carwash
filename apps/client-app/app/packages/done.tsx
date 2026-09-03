import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@sama/ui-native';
import { SuccessScreen } from '../../src/components/SuccessScreen';
import { useCopy } from '../../src/i18n';
import { packageById } from '../../src/session';

export default function PackageDone() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pkg = packageById(Number(id));
  const copy = useCopy();

  return (
    <SuccessScreen
      title={copy.packages.doneTitle(pkg.washes)}
      sub={copy.packages.doneSub(copy.packageExpiry)}
      actions={
        <>
          <Button label={copy.packages.bookNow} size="lg" fullWidth onPress={() => router.replace('/book/service')} />
          <Button label={copy.common.later} variant="ghost" fullWidth onPress={() => router.replace('/(tabs)/home')} />
        </>
      }
    />
  );
}
