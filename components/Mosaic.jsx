'use client';
import useHoverPreview from './useHoverPreview';

/* Auto-scrolling wall of 9:16 stills with figure chips dropped in.
   The track is duplicated exactly once and translated -50%, so the loop is
   seamless. Edges are masked and it pauses on hover — both fixes on the
   reference, which hard-cuts at the viewport and never pauses.

   Hovering a cell pauses the scroll (CSS) and plays that cell's preview,
   so the wall holds still while you watch. */

function Cell({ post, fig }) {
  const { ref, playing, start, stop } = useHoverPreview(post?.preview);

  return (
    <div
      className="mosaic__cell"
      onMouseEnter={start}
      onMouseLeave={stop}
      data-playing={playing ? '1' : '0'}
    >
      <img src={post.poster} alt="" loading="lazy" decoding="async" />
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
  const cols = [
    [{ i: 0 }, { i: 1 }],
    [{ i: 2 }, { i: 3, fig: figures[0] }],
    [{ i: 4 }],
    [{ i: 5, fig: figures[1] }, { i: 6 }],
    [{ i: 7 }],
    [{ i: 8 }, { i: 9, fig: figures[2] }],
  ];

  const run = (key) =>
    cols.map((cells, ci) => (
      <div className="mosaic__col" key={`${key}-${ci}`}>
        {cells.map((c, j) => (
          <Cell key={j} post={posts[c.i]} fig={c.fig} />
        ))}
      </div>
    ));

  return (
    /* Decorative duplicate of the archive below, but no longer aria-hidden:
       it is now interactive, so it must stay reachable to assistive tech. */
    <div className="mosaic">
      <div className="mosaic__track">
        {run('a')}
        {run('b')}
      </div>
    </div>
  );
}
