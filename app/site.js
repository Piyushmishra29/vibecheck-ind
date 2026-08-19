/* ══════════════════════════════════════════════════════════════════════
   SITE CONSTANTS — the one place a real domain gets wired in.

   This single line drives metadataBase, the canonical URL, the OG/Twitter
   image URLs, robots.txt, sitemap.xml and every @id in the JSON-LD graph.
   No other file hardcodes a host.

   The live domain. Verified against DNS: registered, active, nameservers
   atlas/hyperion.dns-parking.com (Hostinger), apex A -> 2.57.91.91 and www
   a CNAME onto the apex.

   Canonical is the APEX, deliberately — www already CNAMEs to it, so the
   apex is the address that actually exists and everything should point at
   one host. If the server ever serves both, redirect www -> apex rather
   than letting the two compete in search.                                  */
export const SITE_URL = 'https://vibecheckind.com';

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
