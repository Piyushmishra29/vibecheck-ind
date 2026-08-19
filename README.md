# VibeCheck

Site for **VibeCheck** — [@vibecheck.ind](https://www.instagram.com/vibecheck.ind/) — a culture and
nightlife media desk in India. *We Connect, Curate and Create.*

One long page, dark editorial, brand purple. The work is vertical video, so the site is built around
a wall of 9:16 films that play on hover and open into Instagram's own player.

Next.js 15 App Router, static export, three dependencies, no CSS framework, no animation library.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3030
npm run build    # static export → out/
npx serve out    # preview the real build
```

The build is fully static — `out/` can be dropped on any host with no server, no Node runtime and no
build step at the edge.

**Parallel builds.** `next.config.mjs` reads `NEXT_DIST_DIR`, so more than one build can run at once
without clobbering a shared `.next`:

```bash
NEXT_DIST_DIR=.next-mine npx next build
```

This exists because running `next build` while `next dev` is live corrupts the shared cache and the
dev server starts returning `500 MODULE_NOT_FOUND`. If that happens: `rm -rf .next` and restart.

---

## The idea: nothing is re-hosted

Full-length video never touches this server. The site holds three things per post:

| | Size | Where it plays |
|---|---|---|
| Poster (WebP, 9:16) | ~23 KB | The grid tile |
| Hover preview (2.5s, muted, 360px, h264) | ~77 KB | On hover, in place |
| The actual film | 0 bytes | Instagram's official embed iframe |

So the archive stays live — edit or delete a post on Instagram and the site follows — and the page
costs nothing for video until someone interacts.

**Preview clips are the one exception, and they are lazy.** The `<video>` ships with
`preload="none"` and **no `src` attribute at all**. Nothing is fetched until a pointer settles on a
tile for 130ms. Verified: **0** preview requests on page load, **1** after hovering one tile, **0**
from sweeping the pointer across six tiles.

That 130ms hover-intent delay matters — without it, dragging the pointer across the wall to reach
one tile pulled every clip it crossed (measured at 254 KB for a single intended hover).

---

## Page architecture

| # | Section | Notes |
|---|---|---|
| — | Masthead | Invisible over the hero, settles onto a hairline that doubles as reading progress. Collapses to a numbered index panel under 860px |
| 1 | Hero | Animated logo, headline, one CTA, trust line. Deliberately under `100svh` so the wall below peeks |
| 2 | Mosaic | Auto-scrolling wall of stills. Pauses on hover; each cell plays its own preview |
| 3 | The brief | Thesis statement + the figure row |
| 4 | The archive | 12 tiles, hover to play, click for the Instagram embed |
| 5 | Voices | Testimonials on the purple slab |
| 6 | Series | Runs into the slab above with no seam |
| 7 | FAQs | Accordion, first item open |
| 8 | Contact | Closing card over a still, radial vignette |
| — | Footer | Four columns |

The structural device doing most of the work is the **heading lockup**: an eyebrow pill, a 1px
vertical rule, and a left-aligned two-line heading, with the whole assembly centred as a unit. The
line breaks are hard `<br>`s, so every heading silhouette is designed rather than reflowed. It
repeats at every section.

Colour does the sectioning — dark ground, one uninterrupted purple slab across Voices and Series,
back to dark. No dividers anywhere.

---

## The animated logo

`components/Logo.jsx` inlines the SVG rather than using `<img src>`, because the three groups
(`#vc-v`, `#vc-sparkle`, `#vc-word`) have to be animated independently.

**Intro**, once on mount, ~1.7s: the V rises and wipe-reveals upward from its vertex; the nine
wordmark letters stagger up through the baseline 52ms apart; the sparkle lands last with a
quarter-turn.

**Hover**: the star does a half-turn with a slight swell. Half, not quarter — the star is four-point
symmetric, so 180° lands exactly where it started and the beat replays cleanly. The standalone mark
(footer, masthead) also scales slightly. Fine pointers only, so a tap can't strand the star
mid-spin.

Two things worth knowing if you touch this file:

- **The letter paths are not in visual order.** potrace emitted them as C, C, V, I, B, E, H, E, K. A
  naive `:nth-child` stagger pops them in scrambled order — each letter carries a `--i` custom
  property with its measured left-to-right index instead.
- **The coordinate space is flipped.** `.vcl__v`, `.vcl__sparkle` and `.vcl__letter` sit inside a
  potrace group transformed by `scale(0.1, -0.1)`, so in their local space 1px = 0.1 viewBox units
  and a *negative* translateY moves an element *down* on screen.

Exports: `Logo` (full lockup) and `LogoMark` (V + sparkle only).

---

## What is real and what is not

**Read this before the site goes anywhere public.**

Real, verified from the account:

- 27.1K followers, 131 posts, 88 following
- The taglines: *"We Connect, Curate and Create"* / *"Follow us to know where the good vibes are"*
- Series names: **Diwali '25**, **Dawntown**
- The 12 posts, their posters and their dates

Invented placeholders, all marked in source comments:

- `CHIPS` — all three mosaic figures (`4.2M`, `+38%`, `11.4%`)
- `FIGURES` — the 2nd and 3rd (the 1st, 27.1K, is real)
- `VOICES` — all four testimonials: stat, quote and attribution. The word "Placeholder" is left
  visible in each role line on purpose
- FAQ answers 2–5
- `SITE_URL` in `app/site.js`

The figures are deliberately odd and decimal rather than round, because specific numbers read as
measurement and round ones read as marketing. That makes them *more* convincing, which is exactly
why they must be replaced rather than shipped.

There is deliberately **no FAQPage JSON-LD**. Emitting placeholder answers as structured data would
publish invented statements to search engines as fact. Add that node once the answers are real.

---

## Adding posts

`data/posts.json` drives the wall and the mosaic. One entry per post:

```json
{
  "shortcode": "DbdMZBehRLJ",
  "type": "reel",
  "isVideo": true,
  "date": "July 31, 2026",
  "poster": "/posters/DbdMZBehRLJ.webp",
  "preview": "/previews/DbdMZBehRLJ.mp4",
  "caption": ""
}
```

`shortcode` is the segment after `/reel/` or `/p/` in the post URL. `preview` may be `null` — those
tiles simply never mount a `<video>` and stay posters, no broken state.

**Only 12 of 131 posts are here.** Instagram exposes exactly 12 to a logged-out visitor, which is
the ceiling for any scraper. To fill the rest, export the account's data (Meta's *Download Your
Information* includes every permalink) and extend this file — the grid scales as-is.

To make a poster and preview for a new post:

```bash
# poster: 9:16, WebP
magick source.jpg -quality 72 -define webp:method=6 public/posters/<shortcode>.webp

# preview: 2.5s, muted, 360px wide, bitrate-capped
ffmpeg -ss 2 -t 2.5 -i source.mp4 -an \
  -vf "scale=360:-2:flags=lanczos,fps=24" \
  -c:v libx264 -preset veryslow -crf 34 -maxrate 250k -bufsize 500k \
  -movflags +faststart public/previews/<shortcode>.mp4
```

The `-maxrate` cap matters. With crf alone, busy footage ran at ~450 kbps against ~230 kbps for
everything else and produced clips twice the size.

**Previews are frozen snapshots.** Re-edit a reel on Instagram and the embed updates but the hover
preview will not — regenerate it.

---

## Brand

Assets supplied by the client, kept in `public/brand/`. The brand colour is measured from the logo
lockup itself, not guessed.

| Token | Value | Use |
|---|---|---|
| `--accent` | `#7a257c` | The brand purple. A **fill** that carries white |
| `--accent-lit` | `#b788b8` | Accent **text** on dark |
| `--accent-mid` | `#924d94` | Borders, non-text UI |
| `--accent-pale` | `#d4b9d5` | Quiet emphasis |
| `--accent-deep` | `#3d123e` | The slab; washes only |
| `--ink` / `--ink-2` | `#050505` / `#100b12` | Ground, raised surface |
| `--paper` / `--paper-dim` | `#f4f1ec` / `#c9c5bd` | Type |
| `--muted` | `#a49bab` | Dimmed labels |

**Why the purple splits by role:** `#7a257c` on the near-black ground is only **2.31:1** — it fails
even the large-text bar. So the brand purple stays a fill with white on top, exactly as the logo
lockup uses it, and a measured tint from the same files carries type at 7.01:1. Every pairing is
computed and tabled in `app/globals.css`.

Type: **Instrument Serif** (display), **Inter** (body), **Space Mono** (labels).

Instrument Serif ships weight 400 only — the display headings therefore set `font-weight: 400`
explicitly. Without that they inherit the browser's bold default and render as *synthetic* bold, a
smeared 400. That was live on ~80% of display type before it was caught.

`public/logo.svg` is a real vector trace of the supplied PNG, split into the three animatable
groups. `components/Logo.jsx` holds a faithful inline copy — **if you change one, change both.**

---

## Performance notes

Decisions here were measured, not assumed. The ones worth preserving:

- **The logo sparkle does not loop forever.** An infinite twinkle cost **2131ms of main-thread work
  per 6 seconds** and pulled scrolling from 57fps to 51fps, because Chromium cannot composite
  transform/opacity on an SVG child — every frame hit style, layout and paint. It now runs four
  beats and is parked by an IntersectionObserver whenever the mark is off-screen.
- **The hero is not gated behind a reveal.** It was, and LCP was 5.3s on Fast 3G against 0.68s
  without. Reveals are for below-the-fold content only.
- **The first mosaic posters are `eager` + `fetchpriority="high"`.** On phones one of them *is* the
  LCP element; lazy-loading it cost ~1.0s.
- **Posters are WebP** — 452 KB → 280 KB across twelve.
- **Do not resize the posters down.** They are 360×640 and already render at a ~2× upscale on
  retina. The win was format, not dimensions.
- **The mosaic marquee is free** — 12ms per 6s, zero layouts, pure compositor. Measured, and left
  alone.

First load is ~110 KB of JS, of which ~5 KB is this site's own code; the rest is React and the App
Router.

---

## Accessibility

- **The page renders without JavaScript.** Reveals ship *visible* and JS opts in to hiding them,
  with a watchdog that restores everything if the bundle never arrives. The naive version — hide in
  CSS, reveal with JS — leaves a permanently blank page when JS fails.
- Lightbox moves focus in, traps Tab (including the `focusin` case where Tab escapes the
  cross-origin iframe), and restores focus to the tile you ended on.
- The auto-scrolling mosaic has a Pause control, not just hover-pause — hover is unavailable to
  keyboard and touch users (WCAG 2.2.2).
- `prefers-reduced-motion` disables the intro, the twinkle, the hover beats, the marquee, reveals and
  hover previews.
- Tap targets are ≥44px on coarse pointers.
- 0 axe violations (wcag2a/2aa/21aa/22aa) at 390px and 1440px.

**Known limitation:** while focus is inside the Instagram embed, Escape and arrow keys are swallowed
by the iframe. It is not a keyboard trap — Tab exits and focus returns — but the shortcuts don't
reach us.

---

## Before this goes live

1. **Set the domain.** `SITE_URL` in `app/site.js` is `https://vibecheck.example`. It feeds
   `metadataBase`, canonical, OG/Twitter image URLs, `robots.txt`, `sitemap.xml` and every JSON-LD
   `@id`. Until it's real, **social previews will not render.**
2. **Replace every placeholder figure and quote.** See *What is real and what is not*.
3. **Add the remaining posts** from the account export.
4. Consider adding `FAQPage` JSON-LD once the answers are genuine.

---

## File map

```
app/
  page.jsx        every section, and the placeholder data at the top
  layout.jsx      fonts, metadata, JSON-LD
  site.js         SITE_URL — the one line to change on launch
  SiteNav.jsx     masthead + mobile index panel
  globals.css     tokens, sections, responsive pass
  nav.css         masthead only
  robots.js       emits robots.txt
  sitemap.js      emits sitemap.xml
components/
  Logo.jsx/.css   inline animated SVG; exports Logo and LogoMark
  ReelWall.jsx    the 12 tiles + the embed lightbox
  Mosaic.jsx      auto-scrolling wall + pause control
  Accordion.jsx   FAQ
  Reveal.jsx      scroll reveals, no-JS safe
  useHoverPreview.js   shared hover-to-play, with intent delay
  a11y.css        component-owned accessibility layer
data/posts.json   the only file you edit to add posts
public/
  posters/        12 WebP stills
  previews/       9 hover clips
  brand/          supplied lockups
  logo.svg        vector source for the inline logo
```
