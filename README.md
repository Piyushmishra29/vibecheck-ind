# VibeCheck — vibecheck.ind

Site for **VibeCheck** ([@vibecheck.ind](https://www.instagram.com/vibecheck.ind/)) — a culture and
nightlife media brand in India. *We Connect, Curate and Create.*

Next.js 15 static export. One long editorial page, purple on near-black, the reels presented as a
numbered archive that plays on hover.

## The core idea: nothing is re-hosted

Video never touches the server. Each tile is a local 9:16 poster (~35 KB); full playback happens
inside **Instagram's official embed iframe**, mounted only when a tile is opened.

- No downloading, re-encoding or re-uploading of reels
- No bandwidth cost for full video, ever
- Posts stay live — edit or delete on Instagram and the site follows

**Hover-to-play previews** sit on top of that: a short muted clip per post in `public/previews/`
(~70–145 KB each). The `<video>` element carries `preload="none"` and no `src` at all until the
pointer or keyboard focus actually lands on the tile, so a tile you never touch never downloads.
The same hook drives the scrolling mosaic under the hero; hovering a cell pauses the scroll and
plays that cell. Disabled entirely under `@media (hover: none)`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3030
npm run build    # static export to out/
```

Parallel builds: `NEXT_DIST_DIR=.next-foo npx next build` keeps the `.next` cache separate.
(`out/` is still shared, so only one build at a time can be trusted to leave it intact.)

## Page architecture

Nine blocks, in order, all in `app/page.jsx`:

| # | Section | id | What it is |
|---|---------|-----|-----------|
| 1 | Hero | `#top` | Animated logo, h1, follow CTA, two real counts |
| — | Mosaic | — | Auto-scrolling reel columns + stat chips, masked edges |
| 2 | The brief | `#brief` | Chapter opener — the thesis |
| 3 | What we do | `#approach` | Three pillar cards + a figure row |
| 4 | The archive | `#archive` | The wall — hover previews, click for the IG embed |
| 5 | Voices | `#voices` | Four testimonials on a dark slab |
| 6 | Series | `#series` | Diwali '25 / Dawntown / Breakdown badges |
| 7 | FAQs | `#faqs` | Accordion |
| 8 | Contact | `#contact` | Closing card |
| 9 | Footer | — | Lockup, sitemap columns, back to top |

### Navigation

`app/SiteNav.jsx` + `app/nav.css`. A masthead, not a menu: mark on the left, chapter list on the
right. Three behaviours and no more —

1. invisible over the hero, settles onto a blurred hairline once you leave it
2. the chapter you are reading is lit and underlined (`aria-current`)
3. the hairline doubles as a reading-progress bar

Under 860px the chapter list collapses into a numbered **index panel** — a contents page with its
own mark and close control, Escape to dismiss, focus trapped and returned, body scroll locked.
A skip-to-content link is the first tab stop on the page.

### The animated logo

`components/Logo.jsx` inlines `/public/logo.svg` rather than `<img src>`-ing it, so the three
groups (`#vc-v`, `#vc-sparkle`, `#vc-word`) can animate independently: the V wipes up through a
clip path, the sparkle lands, the wordmark letters stagger in. `<LogoMark>` is the same file
cropped to V + sparkle for the masthead and footer.

⚠️ Every path lives inside a group whose y-axis is flipped and scaled 10× — read the coordinate
warning at the top of `Logo.jsx` before touching `Logo.css`.

## What is real and what is placeholder

Real, checkable against the public profile:

- **27.1K followers, 131 posts** (`app/site.js`)
- *We Connect, Curate and Create* / *Follow us to know where the good vibes are*
- Series: **Diwali '25**, **Dawntown**

Placeholder — invented, flagged in comments at every definition in `app/page.jsx`, and **must not
ship as fact**:

- `CHIPS` — all three mosaic stat chips
- `FIGURES` — the 2nd and 3rd figures (the 1st is the real follower count)
- `VOICES` — all four: the stat, the quote and the attribution. The word "Placeholder" is left
  visible in the role line on purpose, so a staging link cannot pass them off as testimonials
- `FAQ` — answers 2–5 say "Placeholder answer" in the copy itself. Answers 1, 6 and 7 are real
- "Series 03 · Breakdown" is a recurring caption format, not a confirmed series title

Nothing invented is emitted into the structured data — see below.

## SEO / metadata

`app/layout.jsx` carries `metadataBase`, a canonical URL, OG + Twitter cards, robots directives
and a JSON-LD `@graph` with three cross-referenced nodes:

- **Organization** — name, slogan, logo, `areaServed: India`, `sameAs` → the Instagram account,
  and the real follower count as an `InteractionCounter`
- **WebSite** — published by the Organization, `inLanguage: en-IN`
- **ProfilePage** — this page, `mainEntity` → the Organization

There is deliberately **no FAQPage node**: most FAQ answers are placeholders, and emitting them as
structured data would publish invented statements to search engines. Add it once the answers are
written.

`app/robots.js` and `app/sitemap.js` emit a static `robots.txt` and `sitemap.xml` at build.

### The domain is a placeholder

There is no final domain yet. **`SITE_URL` in `app/site.js` is the only place a host is written.**
Change that one line and `metadataBase`, the canonical, the absolute OG/Twitter image URLs,
`robots.txt`, `sitemap.xml` and every `@id` in the JSON-LD follow automatically.

```js
export const SITE_URL = 'https://vibecheck.example'; // ← PLACEHOLDER
```

`public/apple-touch-icon.png` and `public/favicon.ico` are served from the root and picked up by
convention; `app/icon.png` emits the `<link rel="icon">`.

## Adding posts

`data/posts.json` drives the wall and the mosaic. One entry per post:

```json
{
  "shortcode": "DbdMZBehRLJ",
  "type": "reel",
  "isVideo": true,
  "date": "July 31, 2026",
  "poster": "/posters/DbdMZBehRLJ.jpg",
  "preview": "/previews/DbdMZBehRLJ.mp4",
  "caption": ""
}
```

`shortcode` is the bit after `/reel/` or `/p/` in the post URL. Drop a matching 9:16 JPG into
`public/posters/` (and optionally a short muted MP4 into `public/previews/`) and it appears — no
code changes.

**Currently 12 of 131 posts.** Instagram only exposes 12 to a logged-out visitor, which is all a
scraper can reach; the page says so under the wall rather than implying a full archive. To fill in
the rest, export the full post list from the account (Meta's *Download Your Information* includes
every permalink) and the wall scales as-is.

## Logo asset

`public/logo.svg` is a **placeholder trace** — a vector of the supplied PNG, split into three
animatable groups. Replace that one file with the original mark and it drops straight in.
`components/Logo.jsx` inlines a faithful copy of the same markup, so both need swapping together.

## Brand

Real brand assets supplied by the client, in `public/brand/`. The brand colour is **purple
`#7a257c`** — taken from the logo lockup background, not guessed.

| | |
|---|---|
| Brand purple | `#7a257c` |
| Ink | `#050505` |
| Paper | `#f4f1ec` |
| Tints | `#8c428e` `#924d94` `#b788b8` `#cdaece` `#e6d5e6` |
| Display | Instrument Serif |
| Body | Inter |
| Mono | Space Mono |

The mark is a white serif **V** with a four-point sparkle, wordmark VIBECHECK below in a spaced
serif. Source files: stacked and horizontal lockups in white and black, plus the purple square.
Favicon, apple-touch-icon and `og.png` are generated from these.

`app/globals.css` carries a computed WCAG table at the top. The short version: `#7a257c` is a
**fill** colour that carries white; on the near-black ground it manages only 2.31:1, so text uses
the lighter tints. Do not paint body copy in raw brand purple.

## Content shape (observed)

Street-interview reels, mic in hand, shot on location at night markets, festivals and venues.
Recurring formats: *What's…*, *Breakdown*, quiz cards, crowd reactions. Every post carries the
VIBECHECK watermark top-right.

## Structure

```
app/
  layout.jsx     metadata, JSON-LD, fonts, skip link, nav mount
  page.jsx       the nine sections
  site.js        SITE_URL placeholder + verified brand facts
  SiteNav.jsx    masthead + mobile index panel
  nav.css        nav / skip-link / structural CSS
  globals.css    design tokens + everything else
  robots.js      → /robots.txt
  sitemap.js     → /sitemap.xml
components/      ReelWall, Mosaic, Logo, Accordion, Reveal, Marquee, useHoverPreview
data/            posts.json — the only file you edit to add posts
public/          logo.svg (swap me), posters/, previews/, brand/
```

`components/Marquee.jsx` is currently unused — kept because the text marquee may come back.

## Accessibility notes

- One `h1`; no heading levels skipped; every `<section>` is labelled by its own heading
- `<footer>` sits outside `<main>`, so it is a real `contentinfo` landmark
- Skip link is the first tab stop and moves focus to `<main>`
- Reveals use one `IntersectionObserver` per element, unobserved after firing — no scroll listeners
- Lightbox: Escape closes, ← → step through, body scroll locks, tiles are real `<button>`s
- `prefers-reduced-motion` disables reveals, the marquee, the mosaic and the nav transitions
- Testimonial quotes are `<blockquote>` inside `<figure>` with a `<figcaption>` attribution
