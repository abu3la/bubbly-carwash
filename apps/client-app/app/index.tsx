import { Redirect } from 'expo-router';
import { useAuthSession } from '../src/authSession';

/**
 * The app's front door. A declarative redirect rather than an effect that
 * calls `router.replace`: it resolves during render, so there is no window in
 * which two routes both claim to be the current screen — which is what makes
 * an imperative gate bounce between them.
 */
export default function Index() {
  const { session } = useAuthSession();
  return <Redirect href={session ? '/(tabs)/home' : '/onboarding'} />;
}
