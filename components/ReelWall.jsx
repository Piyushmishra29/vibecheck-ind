'use client';
import { useCallback, useEffect, useState } from 'react';
import Reveal from './Reveal';

/* The video never touches our server. Tiles are local 9:16 posters (~35 KB each);
   playback happens inside Instagram's official embed iframe, mounted only when
   a tile is opened. Nothing is downloaded, re-encoded or re-hosted. */
function embedUrl(p) {
  const kind = p.type === 'reel' ? 'reel' : 'p';
  return `https://www.instagram.com/${kind}/${p.shortcode}/embed/captioned/`;
}

export default function ReelWall({ posts }) {
  const [open, setOpen] = useState(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d) => setOpen((i) => (i === null ? null : (i + d + posts.length) % posts.length)),
    [posts.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  return (
    <>
      <div className="wall">
        {posts.map((p, i) => (
          <Reveal key={p.shortcode} delay={(i % 6) * 60}>
            <button
              className="tile"
              onClick={() => setOpen(i)}
              aria-label={`Open post ${i + 1} of ${posts.length}${p.date ? `, ${p.date}` : ''}`}
            >
              <img src={p.poster} alt="" loading="lazy" decoding="async" />
              <span className="tile__idx mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="tile__play" aria-hidden="true">
                <span>
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                    <path d="M12.5 7.5 0 15V0l12.5 7.5Z" fill="currentColor" />
                  </svg>
                </span>
              </span>
              <span className="tile__date mono">
                <span>{p.date || ''}</span>
                <span>{p.isVideo ? 'REEL' : 'POST'}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {open !== null && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Instagram post" onClick={close}>
          <div className="lb__frame" onClick={(e) => e.stopPropagation()}>
            <button className="lb__close" onClick={close}>Close ✕</button>
            <button className="lb__nav lb__prev" onClick={() => step(-1)} aria-label="Previous">←</button>
            <button className="lb__nav lb__next" onClick={() => step(1)} aria-label="Next">→</button>
            <iframe
              key={posts[open].shortcode}
              src={embedUrl(posts[open])}
              title={`Instagram post ${posts[open].shortcode}`}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              scrolling="no"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
}
