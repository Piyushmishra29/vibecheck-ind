export default function Marquee({ items }) {
  const row = (
    <span>
      {items.map((t, i) => (
        <span key={i}>
          {t}
          <i className="star" aria-hidden="true">✦</i>
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track mono">
        {row}
        {row}
      </div>
    </div>
  );
}
