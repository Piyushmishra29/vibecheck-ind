'use client';
import { useCallback, useEffect, useState } from 'react';
import Reveal from './Reveal';
import useHoverPreview from './useHoverPreview';

/* Full playback never touches our server — it happens inside Instagram's
   official embed iframe, mounted only when a tile is opened.
   Hover preview is a separate, tiny thing: a 2.5s muted 360px clip
   (~90 KB) whose src is not attached until the pointer actually lands on
   the tile. preload="none" + deferred src means the page costs nothing
   extra until you hover, and a tile you never touch never downloads. */

function embedUrl(p) {
  return `https://www.instagram.com/${p.type === 'reel' ? 'reel' : 'p'}/${p.shortcode}/embed/captioned/`;
}

function Tile({ post, index, total, onOpen }) {
  const { ref: vid, playing, start, stop } = useHoverPreview(post.preview);

  return (
    <button
      className="tile"
      onClick={() => onOpen(index)}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      aria-label={`Open post ${index + 1} of ${total}${post.date ? `, ${post.date}` : ''}`}
    >
      <img src={post.poster} alt="" loading="lazy" decoding="async" />

      {post.preview && (
        <video
          ref={vid}
          className="tile__vid"
          data-on={playing ? '1' : '0'}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          poster={post.poster}
        />
      )}

      <span className="tile__idx mono">{String(index + 1).padStart(2, '0')}</span>

      <span className="tile__play" data-hide={playing ? '1' : '0'} aria-hidden="true">
        <span>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
            <path d="M12.5 7.5 0 15V0l12.5 7.5Z" fill="currentColor" />
          </svg>
        </span>
      </span>

      <span className="tile__date mono">
        <span>{post.date || ''}</span>
        <span>{post.isVideo ? 'REEL' : 'POST'}</span>
      </span>
    </button>
  );
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
            <Tile post={p} index={i} total={posts.length} onOpen={setOpen} />
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
