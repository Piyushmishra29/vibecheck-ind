'use client';
import { useEffect, useState } from 'react';
import useHoverPreview from './useHoverPreview';
import './a11y.css';

/* Auto-scrolling wall of 9:16 stills with figure chips dropped in.
   The track is duplicated exactly once and translated -50%, so the loop is
   seamless. Edges are masked and it pauses on hover — both fixes on the
   reference, which hard-cuts at the viewport and never pauses.

   Hovering a cell pauses the scroll (CSS) and plays that cell's preview,
   so the wall holds still while you watch. */

function Cell({ post, fig, eager }) {
  const { ref, playing, start, stop } = useHoverPreview(post?.preview);

  return (
    <div
      className="mosaic__cell"
      onMouseEnter={start}
      onMouseLeave={stop}
      data-playing={playing ? '1' : '0'}
    >
      {/* On phones the first cells sit above the fold and one of them IS the
          LCP element — lazy-loading it cost ~1.0s of measured mobile LCP.
          Only the leading cells are eager; the rest stay lazy. */}
      <img
        src={post.poster}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding={eager ? 'sync' : 'async'}
      />
      {post.preview && (
        <video
          ref={ref}
          className="mosaic__vid"
          data-on={playing ? '1' : '0'}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      {fig && (
        <div className="chip">
          <div className="chip__n">{fig.n}</div>
          <div className="chip__l">{fig.l}</div>
        </div>
      )}
    </div>
  );
}

export default function Mosaic({ posts, figures }) {
  const [paused, setPaused] = useState(false);
  /* The pause control only exists once it can actually do something —
     the scroll is a CSS animation, so with no JS it would render as a
     button that silently does nothing. */
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);

  const cols = [
    [{ i: 0 }, { i: 1 }],
    [{ i: 2 }, { i: 3, fig: figures[0] }],
    [{ i: 4 }],
    [{ i: 5, fig: figures[1] }, { i: 6 }],
    [{ i: 7 }],
    [{ i: 8 }, { i: 9, fig: figures[2] }],
  ];

  const run = (key, hidden) =>
    cols.map((cells, ci) => (
      <div className="mosaic__col" key={`${key}-${ci}`} aria-hidden={hidden || undefined}>
        {cells.map((c, j) => (
          <Cell
            key={j}
            post={posts[c.i]}
            fig={c.fig}
            /* First two columns of the first pass only: those are what a
               phone actually shows above the fold. */
            eager={!hidden && ci < 2}
          />
        ))}
      </div>
    ));

  return (
    /* The visible content is interactive (hover plays a preview), so the
       first pass through the track stays reachable to assistive tech. The
       SECOND pass is the seam-hiding duplicate and nothing else — it is
       marked aria-hidden so a screen reader is not read the same three
       stat chips twice. It cannot be `inert`: inert kills hit-testing,
       which would silently break hover playback on half the wall.

       The pause control is a WCAG 2.2.2 requirement, not a nicety. The
       track auto-starts and runs for far longer than five seconds, and
       "pauses on hover" is a mechanism only a mouse user has. It sits
       outside .mosaic because .mosaic is overflow:hidden and edge-masked,
       so a child in that corner would be clipped and faded out. */
    <div className="mosaic-wrap">
      <div className="mosaic" data-paused={paused ? '1' : '0'}>
        <div className="mosaic__track">
          {run('a', false)}
          {run('b', true)}
        </div>
      </div>

      {live && (
      <button
        type="button"
        className="mosaic__pause"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Resume the scrolling preview' : 'Pause the scrolling preview'}
      >
        {paused ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
            <path d="M10 6 0 12V0l10 6Z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
            <path d="M0 0h3.2v12H0zM6.8 0H10v12H6.8z" fill="currentColor" />
          </svg>
        )}
        <span>{paused ? 'Play' : 'Pause'}</span>
      </button>
      )}
    </div>
  );
}
