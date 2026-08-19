# VibeCheck — vibecheck.ind

Site for **VibeCheck** ([@vibecheck.ind](https://www.instagram.com/vibecheck.ind/)) — a culture and
nightlife media brand in India. *We Connect, Curate and Create.*

Next.js static export. Black / paper / red editorial, the reels presented as a numbered archive.

## The core idea: nothing is re-hosted

Video never touches the server. Each tile is a local 9:16 poster (~35 KB); playback happens inside
**Instagram's official embed iframe**, mounted only when a tile is opened.

- No downloading, re-encoding or re-uploading of reels
- No bandwidth cost for video, ever
- Posts stay live — edit or delete on Instagram and the site follows
- 12 posters total = **460 KB**, versus roughly 300 MB if the reels were self-hosted

## Run it

```bash
npm install
npm run dev      # http://localhost:3030
npm run build    # static export to out/
```

## Adding posts

`data/posts.json` drives the whole wall. One entry per post:

```json
{
  "shortcode": "DbdMZBehRLJ",
  "type": "reel",
  "isVideo": true,
  "date": "July 31, 2026",
  "poster": "/posters/DbdMZBehRLJ.jpg",
  "caption": ""
}
```

`shortcode` is the bit after `/reel/` or `/p/` in the post URL. Drop a matching 9:16 JPG into
`public/posters/` and it appears — no code changes.

**Currently 12 of 131 posts.** Instagram only exposes 12 to a logged-out visitor, which is all a
scraper can reach. To fill in the rest, export the full post list from the account (Meta's
*Download Your Information* includes every permalink) and the wall scales as-is.

## Logo

`public/logo.svg` is a **placeholder** — a rough trace of the serif V + sparkle. Replace that one
file with the original mark and it drops straight in. Nothing else references it.

## Brand

| | |
|---|---|
| Ink | `#050505` |
| Paper | `#f4f1ec` |
| Red | `#c00c18` |
| Muted | `#6e6e73` |
| Display | Instrument Serif |
| Body | Inter |
| Mono | Space Mono |

Palette sampled from the account's own grid — the profile mark is pure black and white, the reels
run high-contrast with a recurring red.

## Content shape (observed)

Street-interview reels, mic in hand, shot on location at night markets, festivals and venues.
Recurring formats: *What's…*, *Breakdown*, quiz cards, crowd reactions. Every post carries the
VIBECHECK watermark top-right. Series highlights: **Diwali '25**, **Dawntown**.

## Structure

```
app/          layout, page, design tokens (globals.css)
components/   ReelWall (grid + embed lightbox), Reveal, Marquee
data/         posts.json — the only file you edit to add posts
public/       logo.svg (swap me), posters/
```

## Notes

- Reveals use one `IntersectionObserver` per element, unobserved after firing — no scroll listeners
- Lightbox: Escape closes, ← → step through, body scroll locks, tiles are real `<button>`s
- `prefers-reduced-motion` disables reveals and the marquee
- Stats in the hero (27.1K followers, 131 posts) are hardcoded in `app/page.jsx` — update by hand
