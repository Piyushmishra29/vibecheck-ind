'use client';
import { useRef, useState } from 'react';

/* Height 0 <-> content, 500ms — animated on a measured pixel value so it
   actually transitions (height:auto does not). */
export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  const panels = useRef([]);

  return (
    <div>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className="acc" key={it.q} data-open={isOpen ? '1' : '0'}>
            <button
              className="acc__btn"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <svg className="acc__chev" width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
                <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.6" fill="none" />
              </svg>
              <span>{it.q}</span>
            </button>
            <div
              className="acc__panel"
              ref={(el) => (panels.current[i] = el)}
              style={{ height: isOpen ? `${panels.current[i]?.scrollHeight || 200}px` : 0 }}
            >
              <div className="acc__inner">{it.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
