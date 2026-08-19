'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Reveal from './Reveal';
import useHoverPreview from './useHoverPreview';
import ReelMeta from './ReelMeta';
import { IG_HANDLE } from '@/app/site';
import './a11y.css';

/* Full playback never touches our server — it happens inside Instagram's
   official embed iframe, mounted only when a tile is opened.
   Hover preview is a separate, tiny thing: a 2.5s muted 360px clip
   (~90 KB) whose src is not attached until the pointer actually lands on
   the tile. preload="none" + deferred src means the page costs nothing
   extra until you hover, and a tile you never touch never downloads. */

function embedUrl(p) {
  return `https://www.instagram.com/${p.type === 'reel' ? 'reel' : 'p'}/${p.shortcode}/embed/captioned/`;
}

/* Everything the browser will hand a Tab to. The iframe is in the list on
   purpose — it is the dialog's actual content. */
const FOCUSABLE =
  'a[href],area[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
  'textarea:not([disabled]),iframe,object,embed,summary,audio[controls],video[controls],' +
  '[contenteditable]:not([contenteditable="false"]),[tabindex]:not([tabindex^="-"])';

function focusables(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0
  );
}

function Tile({ post, index, total, onOpen, tileRef }) {
  const { ref: vid, playing, start, stop } = useHoverPreview(post.preview);

  return (
    <button
      ref={tileRef}
      className="tile"
      type="button"
      onClick={() => onOpen(index)}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      aria-haspopup="dialog"
      aria-label={`Open post ${index + 1} of ${total}${post.date ? `, ${post.date}` : ''}${
        post.isVideo ? ', reel' : ''
      }`}
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
          tabIndex={-1}
          poster={post.poster}
        />
      )}

      <span className="tile__idx mono" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="tile__play" data-hide={playing ? '1' : '0'} aria-hidden="true">
        <span>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
            <path d="M12.5 7.5 0 15V0l12.5 7.5Z" fill="currentColor" />
          </svg>
        </span>
      </span>

      <span className="tile__date mono" aria-hidden="true">
        <span>{post.date || ''}</span>
        <span>{post.isVideo ? 'REEL' : 'POST'}</span>
      </span>

      <ReelMeta post={post} handle={IG_HANDLE} />
    </button>
  );
}

export default function ReelWall({ posts }) {
  const [open, setOpen] = useState(null);
  const isOpen = open !== null;

  const tiles = useRef([]);
  const dialog = useRef(null);
  const lastIndex = useRef(0);

  const uid = useId();
  const titleId = `${uid}-lb-title`;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d) => setOpen((i) => (i === null ? null : (i + d + posts.length) % posts.length)),
    [posts.length]
  );

  /* ── focus management ────────────────────────────────────────────────
     open  → move focus into the dialog (it is the labelled element, so
             the reader hears which post it is)
     while → trap Tab, and pull focus back if it ever escapes. The escape
             case is real: Tab out of the last control inside a
             cross-origin iframe and the browser hands focus to whatever
             follows the iframe in the page, which is outside the modal.
     close → hand focus back to the originating tile.                   */
  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement;
    const el = dialog.current;
    if (el) el.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
        return;
      }
      if (e.key !== 'Tab') return;

      const box = dialog.current;
      if (!box) return;
      const list = focusables(box);
      if (!list.length) {
        e.preventDefault();
        box.focus({ preventScroll: true });
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      const inside = box.contains(active) && active !== box;

      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const onFocusIn = (e) => {
      const box = dialog.current;
      if (box && !box.contains(e.target)) box.focus({ preventScroll: true });
    };

    document.addEventListener('keydown', onKey, true);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('focusin', onFocusIn);
      const back = tiles.current[lastIndex.current] || opener;
      if (back && back.isConnected && typeof back.focus === 'function') {
        back.focus({ preventScroll: true });
      }
    };
  }, [isOpen, close, step]);

  /* remembers which tile the dialog is currently showing, so focus goes
     back to the tile the reader actually ended on, not the one they
     started from (they may have arrowed several posts along). */
  useEffect(() => {
    if (open === null) return;
    lastIndex.current = open;
    /* stepping remounts the iframe (its key changes). If focus was inside
       it, the removal drops focus to <body> without firing focusin — take
       it back so the trap still has something to trap. */
    const box = dialog.current;
    if (box && !box.contains(document.activeElement)) box.focus({ preventScroll: true });
  }, [open]);

  /* Scroll lock, keyed on open/closed only — stepping between posts must
     not thrash the body style (and compensate for the vanished scrollbar
     so the page underneath does not jump). */
  useEffect(() => {
    if (!isOpen) return;
    const { style } = document.body;
    const prevOverflow = style.overflow;
    const prevPad = style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    style.overflow = 'hidden';
    if (gap > 0) style.paddingRight = `${gap}px`;
    return () => {
      style.overflow = prevOverflow;
      style.paddingRight = prevPad;
    };
  }, [isOpen]);

  return (
    <>
      <div className="wall">
        {posts.map((p, i) => (
          <Reveal key={p.shortcode} delay={(i % 6) * 60}>
            <Tile
              post={p}
              index={i}
              total={posts.length}
              onOpen={setOpen}
              tileRef={(el) => {
                tiles.current[i] = el;
              }}
            />
          </Reveal>
        ))}
      </div>

      {isOpen && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          ref={dialog}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <h2 className="vh" id={titleId}>
            Instagram post {open + 1} of {posts.length}
          </h2>
          <p className="vh" aria-live="polite">
            Post {open + 1} of {posts.length}
          </p>

          <div className="lb__frame">
            <button className="lb__close" type="button" onClick={close}>
              Close <span aria-hidden="true">✕</span>
            </button>
            <button
              className="lb__nav lb__prev"
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous post"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              className="lb__nav lb__next"
              type="button"
              onClick={() => step(1)}
              aria-label="Next post"
            >
              <span aria-hidden="true">→</span>
            </button>
            <iframe
              key={posts[open].shortcode}
              src={embedUrl(posts[open])}
              title={`Instagram post ${open + 1} of ${posts.length}`}
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
