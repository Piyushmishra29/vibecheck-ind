import { SITE_URL } from './site';

/* Emitted as a static /robots.txt at build time (output: 'export').
   Host comes from the placeholder constant in app/site.js. */
export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
