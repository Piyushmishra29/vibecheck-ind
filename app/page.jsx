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

const PILLARS = [
  {
    t: 'Connect',
    claim: 'The introductions that turn a night into a scene.',
    p: 'We put the right people in the same room — crowds, venues, artists, brands. The city is small once you know who to ask.',
  },
  {
    t: 'Curate',
    claim: 'Not everything deserves a post.',
    p: 'We filter the city down to what is genuinely worth showing up for, then say where to be and when to get there.',
  },
  {
    t: 'Create',
    claim: 'Vertical-first, shot on the floor, cut for the feed.',
    p: 'Street interviews, breakdowns and the moments that only happen once. Cut for the format people actually watch in.',
  },
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

/* Answers 1, 6 and 7 are REAL. The rest are PLACEHOLDER and say so in
   the copy itself, so a staging link cannot pass them off as policy. */
const FAQ = [
  { q: 'What kind of content do you make?', a: 'Vertical-first short form — street interviews, venue breakdowns, crowd reactions and event coverage. Everything is shot on location and cut for the feed.' },
  { q: 'Which cities do you cover?', a: 'Placeholder answer. Add the cities you actively cover and how far you travel for a booking.' },
  { q: 'Can brands work with you?', a: 'Yes. Placeholder answer — outline the collaboration formats you offer and roughly what a package includes.' },
  { q: 'How far ahead should we book?', a: 'Placeholder answer. State your usual lead time for an event shoot.' },
  { q: 'Do you cover private events?', a: 'Placeholder answer covering private bookings, guest privacy and what you will and will not publish.' },
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
        </section>

        {/* ── 3. pillars + figure row ───────────────────────────────────── */}
        <section id="approach" aria-labelledby="h-approach" className="container band">
          <Reveal className="lock">
            <span className="pill">What we do</span>
            <span className="lock__row">
              <span className="lock__rule" />
              <h2 id="h-approach" className="lock__h">
                Three jobs, one
                <br />
                culture desk
              </h2>
            </span>
          </Reveal>

          <div className="cards">
            {PILLARS.map((p, i) => (
              <Reveal key={p.t} className="card" delay={i * 110}>
                <div className="card__body">
                  <h3 className="card__t">{p.t}</h3>
                  <p className="card__claim">{p.claim}</p>
                  <p className="card__p">{p.p}</p>
                  {/* three identical link texts would give screen readers three
                      identical "See it" targets — each gets its own label */}
                  <a
                    className="ghost"
                    href={IG}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`See ${p.t.toLowerCase()} on Instagram`}
                  >
                    See it
                  </a>
                </div>
                <div className="card__media">
                  <img src={P[i + 1]} alt="" loading="lazy" />
                </div>
              </Reveal>
            ))}
          </div>

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
            <img className="close__bg" src={P[7]} alt="" loading="lazy" />
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
            {/* build-time year — this is a static export, so it updates
                whenever the site is rebuilt */}
            <p className="mono" style={{ color: 'var(--muted)', fontSize: 12 }}>
              © {new Date().getFullYear()} VibeCheck
            </p>
          </div>
          <div>
            <h2 className="pill">Explore</h2>
            <ul>
              <li><a href="#approach">What we do</a></li>
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
