import type { Metadata } from 'next';
import { DM_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import UtmTracker from '@/components/UtmTracker';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Noblecare4u — Thoughtful care, right at home',
  description: 'Noblecare4u provides thoughtful elder care, nursing and physiotherapy services at home.',
  openGraph: {
    title: 'Noblecare4u — Thoughtful care, right at home',
    description: 'Thoughtful elder care, nursing and physiotherapy services delivered at home.',
    siteName: 'Noblecare4u',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noblecare4u — Thoughtful care, right at home',
    description: 'Thoughtful elder care, nursing and physiotherapy services delivered at home.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${newsreader.variable}`}>
      <body>
        <UtmTracker />
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
