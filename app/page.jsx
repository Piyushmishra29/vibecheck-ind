import posts from '@/data/posts.json';
import ReelWall from '@/components/ReelWall';
import Reveal from '@/components/Reveal';
import Marquee from '@/components/Marquee';

const IG = 'https://www.instagram.com/vibecheck.ind/';

const PILLARS = [
  { n: '01', t: 'Connect', b: 'We put the right people in the same room. Crowds, venues, artists, brands — the introductions that turn a night into a scene.' },
  { n: '02', t: 'Curate', b: 'Not everything deserves a post. We filter the city down to what is genuinely worth showing up for, then tell you where to be.' },
  { n: '03', t: 'Create', b: 'Vertical-first, shot on the floor, cut for the feed. Street interviews, breakdowns, and the moments that only happen once.' },
];

const HIGHLIGHTS = [
  { k: 'Series 01', t: "Diwali '25", b: 'Festival season, wall to wall.' },
  { k: 'Series 02', t: 'Dawntown', b: 'After hours, before sunrise.' },
];

export default function Page() {
  return (
    <main>
      {/* ── hero ─────────────────────────────────────────────── */}
      <header className="hero wrap">
        <Reveal>
          <img className="hero__mark" src="/logo.svg" alt="VibeCheck" width="104" height="104" />
        </Reveal>

        <Reveal delay={120}>
          <h1 className="hero__title serif">
            Vibe<em>Check</em>
          </h1>
        </Reveal>

        <Reveal delay={240} className="hero__meta">
          <p className="hero__bio serif">
            We Connect, Curate and Create — follow us to know where the good vibes are.
          </p>
          <p className="mono" style={{ color: 'var(--muted)', margin: 0 }}>
            India · Est. culture desk
            <br />
            @vibecheck.ind
          </p>
        </Reveal>
      </header>

      <Marquee items={['We Connect', 'We Curate', 'We Create', 'Good Vibes Only', 'Vertical First']} />

      {/* ── stats ────────────────────────────────────────────── */}
      <section className="wrap">
        <div className="stats">
          {[
            { n: '27.1K', l: 'Followers' },
            { n: '131', l: 'Posts published' },
            { n: '9:16', l: 'Native format' },
            { n: '100%', l: 'Shot on location' },
          ].map((s, i) => (
            <Reveal key={s.l} className="stat" delay={i * 90}>
              <div className="stat__n serif">{s.n}</div>
              <div className="stat__l mono">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── the wall ─────────────────────────────────────────── */}
      <section className="sect wrap" id="work">
        <div className="sect__head">
          <Reveal>
            <h2 className="sect__title serif">The Wall</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mono" style={{ color: 'var(--muted)', margin: 0, maxWidth: '30ch' }}>
              {posts.length} posts — playing from Instagram, nothing re-hosted
            </p>
          </Reveal>
        </div>
        <ReelWall posts={posts} />
      </section>

      {/* ── pillars ──────────────────────────────────────────── */}
      <section className="sect wrap">
        <div className="sect__head">
          <Reveal>
            <h2 className="sect__title serif">What We Do</h2>
          </Reveal>
        </div>
        <div className="pillars">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} className="pillar" delay={i * 110}>
              <div className="pillar__n mono">{p.n}</div>
              <h3 className="pillar__t serif">{p.t}</h3>
              <p className="pillar__b">{p.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── highlights ───────────────────────────────────────── */}
      <section className="sect wrap">
        <div className="sect__head">
          <Reveal>
            <h2 className="sect__title serif">Series</h2>
          </Reveal>
        </div>
        <div className="hl">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.t} className="hl__item" delay={i * 120}>
              <div className="mono" style={{ color: 'var(--red)' }}>{h.k}</div>
              <h3 className="serif">{h.t}</h3>
              <p style={{ color: 'var(--paper-dim)', marginBottom: 0 }}>{h.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={['Where The Good Vibes Are', '@vibecheck.ind', 'Connect', 'Curate', 'Create']} />

      {/* ── cta ──────────────────────────────────────────────── */}
      <section className="cta wrap">
        <Reveal>
          <p className="mono" style={{ color: 'var(--muted)' }}>Everything lands here first</p>
          <a href={IG} target="_blank" rel="noopener noreferrer" className="serif">
            Follow @vibecheck.ind
          </a>
        </Reveal>
      </section>

      <footer className="foot wrap mono">
        <span>VibeCheck © {new Date().getFullYear()}</span>
        <span>We Connect, Curate and Create</span>
        <a href={IG} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
      </footer>
    </main>
  );
}
