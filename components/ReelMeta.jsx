/* Reel-style engagement rail for the phone film feed.

   Every figure here is REAL — read from Instagram's public profile API for
   each shortcode, not invented and not randomised. That matters: fabricated
   like counts on genuine posts are invented social proof, and the real
   numbers are better anyway (one of these reels has 1.4M views).

   Styled in the brand's own language rather than as a copy of Instagram's
   interface — it should read as "this is a reel", not as a fake Instagram. */

const fmt = (n) => {
  if (n === null || n === undefined) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
};

const Heart = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
    <path
      d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 3A11 11 0 0 1 12 20Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const Bubble = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
    <path
      d="M20 12a7.6 7.6 0 0 1-11.2 6.7L4 20l1.4-4.2A7.6 7.6 0 1 1 20 12Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const Send = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
    <path d="M21 4 3.5 10.6l6.4 2.3 2.3 6.4L21 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="m9.9 12.9 4.6-4.6" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export default function ReelMeta({ post, handle }) {
  const likes = fmt(post.likes);
  const comments = fmt(post.comments);
  const views = fmt(post.views);

  return (
    <>
      <span className="reelrail" aria-hidden="true">
        {likes !== null && (
          <span className="reelrail__i">
            <Heart />
            <b>{likes}</b>
          </span>
        )}
        {comments !== null && (
          <span className="reelrail__i">
            <Bubble />
            <b>{comments}</b>
          </span>
        )}
        <span className="reelrail__i">
          <Send />
        </span>
      </span>

      <span className="reelfoot" aria-hidden="true">
        <b>{handle}</b>
        {views !== null && <em>{views} views</em>}
      </span>
    </>
  );
}
