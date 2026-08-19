'use client';
import { useEffect, useRef, useState } from 'react';
import './a11y.css';

/* ══════════════════════════════════════════════════════════════════════
   Scroll reveal — progressive enhancement, not a JS dependency.

   The old version rendered `class="reveal"` on the server and let
   globals.css hide it with opacity:0, so the entire document below the
   fold was invisible until JS ran. If the bundle was blocked, errored,
   still in flight, or the browser had no IntersectionObserver, the page
   stayed blank forever.

   Now the server HTML is visible and JS opts IN to the animation:

     1. BOOT (below) runs during HTML parse — before anything under it has
        painted — and only after it has checked IntersectionObserver and
        prefers-reduced-motion. It sets html[data-reveal-mode="js"], which
        is what a11y.css keys the hiding off. Hiding pre-paint is what
        keeps the hero's staggered entrance flash-free.
     2. Its watchdog undoes that if React never announces itself within
        2s, so a bundle that 404s degrades to a plain, visible page.
     3. On mount each element takes over. If the boot script never ran, an
        element only hides itself when it is safely off-screen, so nothing
        that the user can already see is ever yanked away.

   The boot script is rendered by exactly one Reveal — the first in the
   tree, claimed in a useState initialiser so the claim is stable across
   re-renders and identical on server and client (no hydration mismatch).
   It writes an attribute React never rendered, so hydration leaves it be.
   ══════════════════════════════════════════════════════════════════════ */

const BOOT = `(function(){var d=document.documentElement;function off(){d.removeAttribute("data-reveal-mode")}try{
if(typeof window.IntersectionObserver!=="function")return;
if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
d.setAttribute("data-reveal-mode","js");
setTimeout(function(){if(!d.hasAttribute("data-reveal-ready"))off()},2000);
}catch(e){off()}})();`;

let bootClaimed = false;

export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  const [isBoot] = useState(() => {
    if (bootClaimed) return false;
    bootClaimed = true;
    return true;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    /* tells the watchdog that React is alive */
    root.setAttribute('data-reveal-ready', '1');

    const show = () => {
      el.dataset.shown = '1';
    };

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof window.IntersectionObserver !== 'function') {
      show();
      return;
    }

    if (root.getAttribute('data-reveal-mode') !== 'js') {
      /* Boot script never ran (blocked inline script, CSP, watchdog already
         fired). The element is currently VISIBLE, so only hide it if it is
         off-screen — never flash something out from under the reader. */
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        show();
        return;
      }
      el.dataset.rv = '1';
    }

    /* Tabbing can land on a control inside a block that has not been
       revealed yet: the browser scrolls it into view, but the fade still
       has up to 900ms of delay + 900ms of duration to run, and for all of
       that time the focus ring is painted at opacity 0. Focus therefore
       reveals its own block at once, with no delay and no fade. */
    const onFocusIn = () => {
      /* A transition that is already running outranks everything in the
         cascade, inline styles included, and shortening its duration does
         not retime it. `transition:none` is what actually cancels it —
         after that the element snaps to its shown state and the focus
         ring is on screen in the same frame. */
      el.style.transition = 'none';
      el.style.transitionDelay = '0ms';
      el.style.opacity = '1';
      show();
    };
    el.addEventListener('focusin', onFocusIn);

    /* A ratio threshold can never be met by an element taller than
       1/0.12 viewports — it would stay hidden forever. Fall back to
       "any part visible" for anything tall. */
    const threshold = el.offsetHeight > window.innerHeight * 0.6 ? 0 : 0.12;

    /* A constructor that exists but throws (polyfill shims, hardened
       browsers) must not be able to leave the element hidden. */
    let io;
    try {
      io = new window.IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          if (delay && el.dataset.shown !== '1') el.style.transitionDelay = `${delay}ms`;
          show();
          io.disconnect();
        },
        { threshold, rootMargin: '0px 0px -8% 0px' }
      );
      io.observe(el);
    } catch {
      delete el.dataset.rv;
      show();
    }

    return () => {
      el.removeEventListener('focusin', onFocusIn);
      if (io) io.disconnect();
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {isBoot ? <script dangerouslySetInnerHTML={{ __html: BOOT }} /> : null}
      {children}
    </Tag>
  );
}
