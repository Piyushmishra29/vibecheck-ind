'use client';

import { useEffect, useRef, useState } from 'react';
import { LogoMark } from '@/components/Logo';
import { IG_URL, TAGLINE } from './site';

/* ══════════════════════════════════════════════════════════════════════
   SITE NAVIGATION

   The page is a single ~8-viewport read, so this is a masthead rather
   than a menu: mark on the left, chapter list on the right, and a
   hairline that fills left-to-right as you move through the piece — the
   same device a long-form magazine site uses to say "you are here".

   Three deliberate beats, no more:
     1. the bar is invisible over the hero, then settles onto a blurred
        hairline once you leave it
     2. the chapter you are reading is lit and underlined (aria-current)
     3. the hairline doubles as reading progress

   Under 860px the chapter list collapses to a numbered index panel —
   a contents page, not a hamburger drawer.
   ══════════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  { id: 'archive', n: '01', label: 'Archive' },
  { id: 'clients', n: '02', label: 'Clients' },
  { id: 'voices', n: '03', label: 'Voices' },
  { id: 'series', n: '04', label: 'Series' },
  { id: 'faqs', n: '05', label: 'FAQs' },
];

export default function SiteNav() {
  const [lifted, setLifted] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  /* Lift state + progress. One rAF-throttled passive listener; progress is
     written to a CSS custom property so React never re-renders for it. */
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setLifted(y > 24);
      barRef.current?.style.setProperty('--vnav-p', max > 0 ? String(Math.min(1, y / max)) : '0');
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* Which chapter am I in? A ~6%-tall band across the middle of the
     viewport; whichever section straddles it wins. No scroll maths. */
  useEffect(() => {
    /* Guarded: React owns <html> in the App Router, so an exception thrown
       during hydration does not merely disable the masthead — it wipes the
       whole document. Without this check, a browser lacking
       IntersectionObserver renders a blank page rather than a nav-less one. */
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        setActive(SECTIONS.find((s) => seen.has(s.id))?.id ?? '');
      },
      { rootMargin: '-44% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Index panel: Escape closes and returns focus, body scroll locks,
     and widening past the breakpoint dismisses it. */
  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia('(min-width: 861px)');
    const onWide = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onWide);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onWide);
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* The panel declares aria-modal, so focus has to actually stay in it. */
  const trap = (e) => {
    if (e.key !== 'Tab') return;
    const f = panelRef.current?.querySelectorAll('a[href], button');
    if (!f?.length) return;
    const [first, last] = [f[0], f[f.length - 1]];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <header className={`vnav${lifted ? ' is-lifted' : ''}`} ref={barRef}>
        <div className="vnav__in">
          <a className="vnav__home" href="#top" aria-label="VibeCheck, back to top">
            <LogoMark size="26px" animate={false} aria-hidden="true" focusable="false" />
          </a>

          <nav className="vnav__links" aria-label="Sections">
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a className="vnav__ig" href={IG_URL} target="_blank" rel="noopener noreferrer">
            Instagram <span aria-hidden="true">↗</span>
          </a>

          <button
            type="button"
            className="vnav__toggle"
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="vnav-index"
            onClick={() => setOpen((o) => !o)}
          >
            Index
          </button>
        </div>
      </header>

      {/* The panel sits over the masthead, so it carries its own mark and
          its own close control rather than reaching back through it. */}
      <div
        className="vidx"
        id="vnav-index"
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Section index"
        ref={panelRef}
        tabIndex={-1}
        onKeyDown={trap}
      >
        <div className="vidx__bar">
          <LogoMark size="26px" animate={false} aria-hidden="true" focusable="false" />
          <button type="button" className="vidx__close" onClick={close}>
            Close
          </button>
        </div>

        <ol className="vidx__list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                <span className="vidx__n">{s.n}</span>
                <span className="vidx__t">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>

        <a
          className="vidx__ig"
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Follow on Instagram <span aria-hidden="true">↗</span>
        </a>
        <p className="vidx__tag">{TAGLINE}</p>
      </div>
    </>
  );
}
