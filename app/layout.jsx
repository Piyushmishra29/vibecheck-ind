import './globals.css';
import { Instrument_Serif, Inter, Space_Mono } from 'next/font/google';

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-mono' });

export const metadata = {
  title: 'VibeCheck — We Connect, Curate and Create',
  description:
    'VibeCheck is a culture and nightlife media brand. We connect, curate and create — follow us to know where the good vibes are.',
  openGraph: {
    title: 'VibeCheck — We Connect, Curate and Create',
    description: 'Follow us to know where the good vibes are.',
    url: 'https://www.instagram.com/vibecheck.ind/',
    siteName: 'VibeCheck',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'VibeCheck' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeCheck — We Connect, Curate and Create',
    description: 'Follow us to know where the good vibes are.',
    images: ['/og.png'],
  },
};

export const viewport = { themeColor: '#7a257c' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
