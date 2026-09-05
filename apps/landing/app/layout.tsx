import { headers } from 'next/headers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { strings } from '../components/strings';
import './globals.css';

export const metadata: Metadata = {
  title: strings.ar.seo.title,
  description: strings.ar.seo.description,
  robots: { index: false, follow: false },
  icons: { icon: '/brand/bubblescarwash-logo.svg' },
};
export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = (await headers()).get('x-bubbles-language') === 'en' ? 'en' : 'ar';
  return (
    <html lang={lang} dir={strings[lang].dir} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
