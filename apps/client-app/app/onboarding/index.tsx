import { useRef } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { useAuthSession } from '../../src/authSession';
import { useSession } from '../../src/session';
import { WelcomeExperience } from '../../src/components/WelcomeExperience';

export default function Welcome() {
  const router = useRouter();
  const { language, setLanguage } = useSession();
  const { loading, introSeen, finishIntro } = useAuthSession();
  const leaving = useRef(false);
  const ar = language === 'ar';
  const openSignIn = (subscription = false) => {
    leaving.current = true;
    finishIntro();
    router.replace({ pathname: '/onboarding/phone', params: subscription ? { intent: 'subscription' } : {} });
  };
  if (loading) return null;
  if (introSeen && !leaving.current) return <Redirect href="/onboarding/phone" />;
  return <WelcomeExperience ar={ar} onSkip={() => openSignIn()} onStart={() => openSignIn(true)} onLanguage={() => setLanguage(ar ? 'en' : 'ar')} />;
}
