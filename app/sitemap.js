import { SITE_URL } from './site';

/* Emitted as a static /sitemap.xml at build time (output: 'export').
   One route today; next.config sets trailingSlash, so the URL matches
   what the export actually serves. Add entries here as routes appear. */
export const dynamic = 'force-static';

export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
