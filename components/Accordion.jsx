'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import './a11y.css';

/* ══════════════════════════════════════════════════════════════════════
   FAQ accordion — WAI-ARIA APG accordion pattern.

   Height was previously read straight off a ref during render:

       style={{ height: isOpen ? panels.current[i]?.scrollHeight : 0 }}

   which is wrong three times over. On the first open the ref for a panel
   that has never been rendered open is either null or measured while the
   panel is still height:0, so it fell through to a hardcoded 200px and
   clipped every answer taller than that. Reading layout during render is
   also a tear waiting to happen, and the number went stale the moment the
   web font landed or the column changed width.

   Measured properly here: the CONTENT element is measured (its height is
   independent of the panel's animated height, so there is no feedback
   loop), the measurement is held in state, and a ResizeObserver keeps it
   live across font swap, reflow and every breakpoint. Before the first
   measurement the open panel renders `height:auto` — which is also what
   ships in the server HTML, so the first answer is readable with no JS.
   ══════════════════════════════════════════════════════════════════════ */

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  const [heights, setHeights] = useState(null);
  const inners = useRef([]);
  const panels = useRef([]);
  const btns = useRef([]);
  const uid = useId();

  useEffect(() => {
    const read = () => inners.current.slice(0, items.length).map((el) => (el ? el.offsetHeight : 0));
    const measure = () =>
      setHeights((prev) => {
        const next = read();
        if (prev && prev.length === next.length && next.every((h, i) => h === prev[i])) return prev;
        return next;
      });

    measure();

    try {
      if (typeof window.ResizeObserver !== 'function') throw new Error('no ResizeObserver');
      const ro = new window.ResizeObserver(measure);
      inners.current.slice(0, items.length).forEach((el) => el && ro.observe(el));
      return () => ro.disconnect();
    } catch {
      /* resize is the coarse fallback: it still catches every breakpoint,
         it just cannot see a late font swap on its own. */
      window.addEventListener('resize', measure);
      const t = setTimeout(measure, 1200);
      return () => {
        window.removeEventListener('resize', measure);
        clearTimeout(t);
      };
    }
  }, [items]);

  /* A closed panel is height:0 + overflow:hidden, which hides it from the
     eye but not from a screen reader or the tab order. aria-hidden ships
     in the HTML (so it is right even with no JS); `inert` is set as a DOM
     property because its React prop spelling differs between React 18 and
     19 — the property works on every browser that supports inert and is a
     harmless no-op on the ones that do not. */
  useEffect(() => {
    panels.current.forEach((el, i) => {
      if (el) el.inert = open !== i;
    });
  }, [open, items]);

  const onKeyDown = useCallback(
    (e, i) => {
      const last = items.length - 1;
      let to = null;
      if (e.key === 'ArrowDown') to = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowUp') to = i === 0 ? last : i - 1;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = last;
      if (to === null) return;
      e.preventDefault();
      btns.current[to]?.focus();
    },
    [items.length]
  );

  return (
    <div>
      {items.map((it, i) => {
        const isOpen = open === i;
        const measured = heights ? heights[i] : null;
        const btnId = `${uid}-b${i}`;
        const panelId = `${uid}-p${i}`;

        return (
          <div className="acc" key={it.q} data-open={isOpen ? '1' : '0'}>
            <h3 className="acc__h">
              <button
                id={btnId}
                ref={(el) => {
                  btns.current[i] = el;
                }}
                className="acc__btn"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <svg
                  className="acc__chev"
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.6" fill="none" />
                </svg>
                <span>{it.q}</span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              aria-hidden={!isOpen}
              className="acc__panel"
              ref={(el) => {
                panels.current[i] = el;
              }}
              style={{ height: isOpen ? (measured == null ? 'auto' : `${measured}px`) : 0 }}
            >
              <div
                className="acc__inner"
                ref={(el) => {
                  inners.current[i] = el;
                }}
              >
                {it.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
