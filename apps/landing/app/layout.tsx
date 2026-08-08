import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bubbly — car wash at your doorstep',
  description: 'Book a wash, a Bubbly driver comes to your car. Riyadh, Jeddah, Khobar.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
