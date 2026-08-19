import posts from '@/data/posts.json';
import ReelWall from '@/components/ReelWall';
import Reveal from '@/components/Reveal';
import Mosaic from '@/components/Mosaic';
import Accordion from '@/components/Accordion';
import Logo, { LogoMark } from '@/components/Logo';
import { IG_URL, IG_HANDLE, FOLLOWERS_LABEL, POST_COUNT } from './site';

const IG = IG_URL;
const P = posts.map((p) => p.poster);

/* ══════════════════════════════════════════════════════════════════════
   WHAT IS REAL AND WHAT IS NOT

   REAL — checkable against the public Instagram profile:
     · 27.1K followers, 131 posts            (FOLLOWERS_LABEL, POST_COUNT)
     · "We Connect, Curate and Create"
     · "Follow us to know where the good vibes are"
     · series: Diwali '25, Dawntown

   PLACEHOLDER — invented, must not ship as fact:
     · CHIPS + two of the three FIGURES  (see the comments on each)
     · every VOICES entry: the stat, the quote and the attribution
     · most FAQ answers (the ones whose copy says "Placeholder answer")

   Placeholders are kept deliberately odd and decimal so they read as
   measurements once swapped, and every one of them is flagged in a
   comment here. Nothing invented is emitted into the JSON-LD in
   app/layout.jsx.
   ══════════════════════════════════════════════════════════════════════ */

/* PLACEHOLDER — all three. Rendered as chips over the scrolling mosaic. */
const CHIPS = [
  { n: '4.2M', l: 'Monthly\nviews' },
  { n: '+38%', l: 'Follower growth\nper quarter' },
  { n: '11.4%', l: 'Average\nengagement' },
];

/* First figure is REAL (Instagram's own follower count). The second and
   third are PLACEHOLDER — swap both for real analytics before launch. */
const FIGURES = [
  { n: FOLLOWERS_LABEL, l: 'Community on Instagram' }, // real
  { n: '4.2M', l: 'Monthly video views' }, //             PLACEHOLDER
  { n: '11.4%', l: 'Engagement rate' }, //                PLACEHOLDER
];

/* PLACEHOLDER, all four — stat, quote and attribution alike. The word
   "Placeholder" is left visible in the role line on purpose, so nobody
   can mistake these for client testimonials on a staging link. */
const VOICES = [
  { n: '+26%', sl: 'Door numbers\non the night', q: 'They shot one reel at our launch and we watched the queue double before midnight.', who: 'Venue Partner', role: 'Placeholder · Bengaluru', poster: P[4] },
  { n: '3.1M', sl: 'Views on a\nsingle cut', q: 'The street interview format travels. People send it to each other.', who: 'Artist', role: 'Placeholder · Mumbai', poster: null },
  { n: '11%', sl: 'Ticket sales\nfrom one post', q: 'Cheaper than the ad spend, and it did not feel like an ad.', who: 'Festival Team', role: 'Placeholder · Goa', poster: null },
  { n: '7.9%', sl: 'Follower lift\nin a week', q: 'We got tagged by people who were not even there. That is the whole point.', who: 'Brand Manager', role: 'Placeholder · Delhi', poster: P[9] },
];

/* Diwali '25 and Dawntown are REAL series names off the profile.
   Breakdown is a recurring caption format rather than a confirmed series
   title — confirm the name with the client or drop the third badge. */
const SERIES = [
  { k: 'Series 01', t: "Diwali '25" },
  { k: 'Series 02', t: 'Dawntown' },
  { k: 'Series 03', t: 'Breakdown' },
];

/* Answers 1, 6 and 7 are REAL — drawn from the account itself.

   Answers 2-5 are GENERIC DRAFTS. They no longer announce themselves as
   placeholders, which makes them more dangerous than the old stub copy,
   not less: they read as settled policy. They are deliberately written
   without specifics nobody has confirmed — no city list, no price, no
   lead time in days, no named packages — so nothing here can be wrong on
   a matter of fact. But they still describe how the business behaves.
   CONFIRM ALL FOUR BEFORE LAUNCH.

   This is also why there is still no FAQPage JSON-LD: publishing these as
   structured data would hand unverified statements to search engines as
   fact. Add that node once the answers are the client's own words. */
const FAQ = [
  { q: 'What kind of content do you make?', a: 'Vertical-first short form — street interviews, venue breakdowns, crowd reactions and event coverage. Everything is shot on location and cut for the feed.' },
  { q: 'Which cities do you cover?', a: 'We are based in India and go where the night is worth documenting. Travelling for a booking is possible — send the date and the location and we will tell you straight away whether we can be there.' },
  { q: 'Can brands work with you?', a: 'Yes. Brand work usually takes one of three shapes: we turn up to something you are already running, we build a format around what you are launching, or you take over one of our recurring series. Tell us who you are trying to reach and we will come back with a scope.' },
  { q: 'How far ahead should we book?', a: 'More notice means a better plan, but short form moves quickly and so do we. If the date is close, ask anyway — you will get a yes or a no the same day rather than be left waiting.' },
  { q: 'Do you cover private events?', a: 'Yes, on the understanding that private means private. We agree beforehand what can be published and what cannot, anyone who would rather not be filmed simply is not, and nothing goes out without that being checked first.' },
  { q: 'How do you decide what to feature?', a: 'We curate rather than cover everything. If it is worth showing up for, it makes the feed.' },
  { q: 'How do I get in touch?', a: `Message ${IG_HANDLE} on Instagram. It is the shortest route to us and it reaches the people who actually hold the camera.` },
];

export default function Page() {
  return (
    <>
      {/* main is the skip-link target and carries tabIndex so focus lands
          here rather than continuing from the link. */}
      <main id="main" tabIndex={-1}>
        {/* ── 1. hero — sits under 100svh on purpose, so the wall peeks.
            Top padding is up from the original 2.5rem so the fixed
            masthead never sits over the logo, even at 390px. ─────────── */}
        <section
          id="top"
          aria-labelledby="h-hero"
          className="container"
          style={{ paddingBlock: 'clamp(6rem,12vh,9rem) 40px', textAlign: 'center' }}
        >
          <Reveal>
            <Logo size="min(360px, 62vw)" className="hero-logo" />
          </Reveal>
          <Reveal delay={900}>
            <h1
              id="h-hero"
              className="serif"
              style={{ fontSize: 'var(--step-3)', margin: '2.5rem 0 1.25rem', lineHeight: 1.08 }}
            >
              We know where
              <br />
              the good vibes are
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--paper-dim)', maxWidth: 640, margin: '0 auto 2rem' }}>
              A culture desk for the night. We connect, curate and create — shot on the floor, in
              portrait, for the way people actually watch.
            </p>
            <a className="btn" href={IG} target="_blank" rel="noopener noreferrer">
              Follow the feed <span aria-hidden="true">→</span>
            </a>
            <div className="trust" style={{ borderTop: 0, marginTop: 32, paddingTop: 0 }}>
              <span className="trust__i">{FOLLOWERS_LABEL} on Instagram</span>
              <span className="trust__i">{POST_COUNT} posts published</span>
            </div>
          </Reveal>
        </section>

        {/* Auto-scrolling duplicate of the archive. Interactive (hover plays
            a preview), so it stays reachable and gets a landmark label. */}
        <section aria-label="Recent posts, scrolling preview">
          <Mosaic posts={posts} figures={CHIPS} />
        </section>

        {/* ── 2. chapter opener — the thesis ────────────────────────────── */}
        <section id="brief" aria-labelledby="h-brief" className="container opener">
          <Reveal className="opener__tick" />
          <Reveal delay={80}><span className="pill">The brief</span></Reveal>
          <Reveal delay={160}>
            <h2 id="h-brief" className="opener__h">
              A night is not an event. It is a story someone has to tell.
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="opener__p">
              Most coverage arrives late, shot wide and cut for a format nobody watches. We work the
              other way round — in the crowd, in portrait, in the moment.
            </p>
          </Reveal>

          {/* Re-homed from the removed "What we do" block, which carried this
              row underneath its cards. Only the first figure is real. */}
          <div className="figs">
            {FIGURES.map((f, i) => (
              <Reveal key={f.l} className="fig" delay={i * 100}>
                <span className="fig__bar" />
                <span>
                  <span className="fig__n">{f.n}</span>
                  <span className="fig__l">{f.l}</span>
                </span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 4. the wall ───────────────────────────────────────────────── */}
        <section id="archive" aria-labelledby="h-archive" className="container band">
          <Reveal className="lock">
            <span className="pill">The archive</span>
            <span className="lock__row">
              <span className="lock__rule" />
              <h2 id="h-archive" className="lock__h">
                The recent grid,
                <br />
                playing from source
              </h2>
            </span>
          </Reveal>
          <ReelWall posts={posts} />
          {/* keeps the wall honest: it shows what a logged-out visitor can
              reach, not the whole back catalogue */}
          <p className="wallnote">
            The {posts.length} most recent. All {POST_COUNT} live on{' '}
            <a href={IG} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            .
          </p>
        </section>

        {/* ── clients ───────────────────────────────────────────────────────
            Logo wall supplied by the client, lifted from the Top Marketing
            Solutions company profile. NOTE FOR WHOEVER MAINTAINS THIS: these
            are the parent group's accounts. VibeCheck sits inside that group,
            which is why they appear here — but if one of these brands ever
            asks, the honest answer is that the work was the group's. */}
        <section id="clients" aria-labelledby="h-clients" className="container band">
          <Reveal className="lock">
            <span className="pill">Clients</span>
            <span className="lock__row">
              <span className="lock__rule" />
              <h2 id="h-clients" className="lock__h">
                Brands we
                <br />
                work with
              </h2>
            </span>
          </Reveal>
          <Reveal className="clients">
            <img
              src="/brand/clients.webp"
              alt="Logos of brands the group has worked with, including Porsche, Meta, Paytm Insider, Tuborg and The MET"
              loading="lazy"
              decoding="async"
              width="1500"
              height="689"
            />
          </Reveal>
        </section>

        {/* ── 5. voices — dark slab begins ──────────────────────────────── */}
        <section id="voices" aria-labelledby="h-voices" className="band--dark">
          <div className="container">
            <Reveal className="lock">
              <span className="pill">Voices</span>
              <span className="lock__row">
                <span className="lock__rule" />
                <h2 id="h-voices" className="lock__h">
                  What happens after
                  <br />
                  we post
                </h2>
              </span>
            </Reveal>

            <div className="voices">
              {VOICES.map((v, i) => (
                <Reveal
                  key={v.who}
                  className={`voice${i === 0 || i === 3 ? ' voice--wide' : ''}`}
                  delay={i * 90}
                >
                  {v.poster && (
                    <div className="voice__media">
                      <img src={v.poster} alt="" loading="lazy" />
                    </div>
                  )}
                  <figure className="voice__txt" style={{ margin: 0 }}>
                    <div className="voice__stat">
                      <span className="voice__n">{v.n}</span>
                      <span className="voice__sl">{v.sl}</span>
                    </div>
                    <blockquote className="voice__q" style={{ margin: 0 }}>
                      {`“${v.q}”`}
                    </blockquote>
                    <figcaption className="voice__who">
                      {v.who} · {v.role}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. series band — same slab, no seam ───────────────────────── */}
        <section id="series" aria-labelledby="h-series" className="band--dark" style={{ paddingTop: 0 }}>
          <div className="container split">
            <Reveal className="lock" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
              <span className="pill">Series</span>
              <span className="lock__row">
                <span className="lock__rule" />
                <h2 id="h-series" className="lock__h">
                  Recurring formats,
                  <br />
                  built to return
                </h2>
              </span>
            </Reveal>
            <Reveal className="badges" delay={120}>
              {SERIES.map((b) => (
                <div className="badge" key={b.t}>
                  <div className="badge__k">{b.k}</div>
                  <div className="badge__t">{b.t}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── 7. faq ────────────────────────────────────────────────────── */}
        <section id="faqs" aria-labelledby="h-faqs" className="container band">
          <div className="faq">
            <Reveal className="lock">
              <span className="pill">FAQs</span>
              <span className="lock__row">
                <span className="lock__rule" />
                <h2 id="h-faqs" className="lock__h">
                  Before you
                  <br />
                  get in touch
                </h2>
              </span>
            </Reveal>
            <Reveal delay={100}>
              <Accordion items={FAQ} />
            </Reveal>
          </div>
        </section>

        {/* ── 8. closing card ───────────────────────────────────────────── */}
        <section id="contact" aria-labelledby="h-contact" className="container band">
          <Reveal className="close">
            {/* Top Marketing Solutions' work montage, supplied by the client.
                It runs under a heavy vignette so it reads as texture, and it
                carries the parent brand's star behind the closing line. */}
            <img
              className="close__bg"
              src="/brand/top-collage.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <h2 id="h-contact" className="close__h">
              Tell us where
              <br />
              we should be next
            </h2>
            <p style={{ color: 'var(--paper-dim)', maxWidth: 560, margin: '0 auto 2rem' }}>
              Venues, festivals, launches, brands. If it is worth showing up for, we will bring the
              camera.
            </p>
            <a className="btn" href={IG} target="_blank" rel="noopener noreferrer">
              Message us on Instagram <span aria-hidden="true">→</span>
            </a>
            <div className="trust">
              <span className="trust__i">{FOLLOWERS_LABEL} community</span>
              <span className="trust__i">{POST_COUNT} posts</span>
              <span className="trust__i">{IG_HANDLE}</span>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── 9. footer — outside <main>, so it is a real contentinfo ────── */}
      <footer className="band--dark">
        <div className="container fgrid">
          <div>
            <LogoMark size="72px" animate={false} />
            <p className="ftag">
              We Connect, Curate
              <br />
              and Create
            </p>
            <p className="parentco">
              A <strong>Top Marketing Solutions</strong> company
            </p>
            {/* build-time year — this is a static export, so it updates
                whenever the site is rebuilt */}
            <p className="mono" style={{ color: 'var(--muted)', fontSize: 12 }}>
              © {new Date().getFullYear()} VibeCheck
            </p>
          </div>
          <div>
            <h2 className="pill">Explore</h2>
            <ul>
              <li><a href="#archive">The archive</a></li>
              <li><a href="#faqs">FAQs</a></li>
              <li><a href="#top">Back to top</a></li>
            </ul>
          </div>
          <div>
            <h2 className="pill">Series</h2>
            <ul>
              <li><a href={IG} target="_blank" rel="noopener noreferrer">Diwali &apos;25</a></li>
              <li><a href={IG} target="_blank" rel="noopener noreferrer">Dawntown</a></li>
              <li><a href={IG} target="_blank" rel="noopener noreferrer">Breakdown</a></li>
            </ul>
          </div>
          <div>
            <h2 className="pill">Work with us</h2>
            <ul>
              <li><a href={IG} target="_blank" rel="noopener noreferrer">Venues</a></li>
              <li><a href={IG} target="_blank" rel="noopener noreferrer">Brands</a></li>
              <li><a href={IG} target="_blank" rel="noopener noreferrer">Festivals</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
