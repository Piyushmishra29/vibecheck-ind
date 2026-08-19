import './globals.css';
import './nav.css';
import { Instrument_Serif, Inter, Space_Mono } from 'next/font/google';
import SiteNav from './SiteNav';
import {
  SITE_URL,
  IG_URL,
  IG_HANDLE,
  BRAND,
  TAGLINE,
  TAGLINE_ALT,
  FOLLOWERS_COUNT,
  BRAND_PURPLE,
} from './site';

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = Space_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono' });

const TITLE = `${BRAND} — ${TAGLINE}`;
const DESCRIPTION =
  'VibeCheck is an Indian nightlife and culture desk. We connect, curate and create — vertical-first street interviews, venue breakdowns and crowd reactions, shot on location.';

/* SITE_URL is a placeholder until the domain is bought — see app/site.js.
   metadataBase resolves every relative URL below (canonical, OG image,
   Twitter image) against it, so nothing else needs editing later. */
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s — ${BRAND}` },
  description: DESCRIPTION,
  applicationName: BRAND,
  category: 'entertainment',
  creator: BRAND,
  publisher: BRAND,
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: BRAND,
    title: TITLE,
    description: TAGLINE_ALT + '.',
    url: '/',
    locale: 'en_IN',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${BRAND} — ${TAGLINE}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: TAGLINE_ALT + '.',
    images: ['/og.png'],
  },
};

export const viewport = { themeColor: BRAND_PURPLE, colorScheme: 'dark' };

/* ══════════════════════════════════════════════════════════════════════
   JSON-LD
   One @graph, three nodes, cross-referenced by @id so crawlers resolve
   the brand once: Organization (who), WebSite (what this is), ProfilePage
   (what this page is — a brand profile whose subject is the Organization).

   Every value is verified against the public Instagram profile. There is
   deliberately NO FAQPage node: most FAQ answers on the page are
   placeholders, and emitting placeholder copy as structured data would
   publish invented statements to search engines. Add it once the real
   answers are written.                                                  */
function jsonLd() {
  const org = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: BRAND,
    alternateName: IG_HANDLE,
    url: `${SITE_URL}/`,
    slogan: TAGLINE,
    description: DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/brand/logo-square-purple.png`,
      caption: BRAND,
    },
    image: { '@id': `${SITE_URL}/#logo` },
    areaServed: { '@type': 'Country', name: 'India' },
    /* VibeCheck is a brand of Top Marketing Solutions. Stated as an
       ownership relation so a crawler resolves the two as one group rather
       than as unrelated companies. No url/@id for the parent until its own
       domain is confirmed — a wrong one is worse than none. */
    parentOrganization: {
      '@type': 'Organization',
      name: 'Top Marketing Solutions',
    },
    knowsAbout: ['Nightlife', 'Music venues', 'Short-form video', 'Street interviews', 'Indian club culture'],
    sameAs: [IG_URL],
    /* Real follower count, as Instagram itself reports it. Google's
       ProfilePage guidance hangs interactionStatistic off the profile
       subject, not the page. This is the ONLY figure in the document —
       every number rendered on the page is a placeholder and is kept out
       of structured data on purpose. */
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/FollowAction',
      userInteractionCount: FOLLOWERS_COUNT,
    },
  };

  const site = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: BRAND,
    description: DESCRIPTION,
    inLanguage: 'en-IN',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  const page = {
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    mainEntity: { '@id': `${SITE_URL}/#organization` },
    primaryImageOfPage: { '@id': `${SITE_URL}/#logo` },
  };

  return { '@context': 'https://schema.org', '@graph': [org, site, page] };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteNav />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
      </body>
    </html>
  );
}
