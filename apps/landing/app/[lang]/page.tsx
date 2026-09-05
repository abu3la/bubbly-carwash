import { notFound } from 'next/navigation';
import { LandingPage } from '../../components/LandingPage';
import { strings } from '../../components/strings';

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') return {};
  return {
    title: strings[lang].seo.title,
    description: strings[lang].seo.description,
    openGraph: { title: strings[lang].seo.title, description: strings[lang].seo.description },
  };
}
export default async function LocalizedHome({ params, searchParams }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const query = await searchParams;
  // Local review states only; they do not alter the API or stored data.
  const preview =
    process.env.NODE_ENV === 'development' || process.env.BUBBLES_DESIGN_PREVIEW === '1'
      ? query.preview
      : undefined;
  return (
    <LandingPage
      initialLang={lang}
      pricingState={
        preview === 'pricing-error' ? 'error' : preview === 'pricing-loading' ? 'loading' : 'live'
      }
      slotsDemo={preview === 'slots-none' ? 'none' : 'available'}
    />
  );
}
