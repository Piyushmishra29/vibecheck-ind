/* ══════════════════════════════════════════════════════════════════════
   SITE CONSTANTS — the one place a real domain gets wired in.

   This single line drives metadataBase, the canonical URL, the OG/Twitter
   image URLs, robots.txt, sitemap.xml and every @id in the JSON-LD graph.
   No other file hardcodes a host.

   Set to the live domain. Note the canonical host includes `www` — pick one
   and redirect the other at the server, or the two will compete in search.  */
export const SITE_URL = 'https://www.vibecheck.channel';

/* Verified facts only. Everything here is checkable against the public
   Instagram profile — no invented figures live in this file. */
export const IG_URL = 'https://www.instagram.com/vibecheck.ind/';
export const IG_HANDLE = '@vibecheck.ind';
export const BRAND = 'VibeCheck';
export const TAGLINE = 'We Connect, Curate and Create';
export const TAGLINE_ALT = 'Follow us to know where the good vibes are';

/* Instagram profile counts, read off the public profile. Rounded exactly
   as Instagram displays them — 27.1K is the platform's own rounding of
   the follower count, not an estimate of ours. */
export const FOLLOWERS_LABEL = '27.1K';
export const FOLLOWERS_COUNT = 27100;
export const POST_COUNT = 131;

export const BRAND_PURPLE = '#7a257c';
