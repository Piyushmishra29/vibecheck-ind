/* Auto-scrolling wall of 9:16 stills with figure chips dropped in.
   Track is duplicated exactly once and translated -50%, so the loop is
   seamless. Edges are masked and it pauses on hover — both fixes on the
   reference, which hard-cuts at the viewport and never pauses. */
export default function Mosaic({ posters, figures }) {
  const cols = [
    { cells: [{ img: posters[0] }, { img: posters[1] }] },
    { cells: [{ img: posters[2] }, { fig: figures[0] , img: posters[3] }] },
    { cells: [{ img: posters[4] }] },
    { cells: [{ fig: figures[1], img: posters[5] }, { img: posters[6] }] },
    { cells: [{ img: posters[7] }] },
    { cells: [{ img: posters[8] }, { fig: figures[2], img: posters[9] }] },
  ];

  const run = (key) => (
    <>
      {cols.map((c, i) => (
        <div className="mosaic__col" key={`${key}-${i}`}>
          {c.cells.map((cell, j) => (
            <div className="mosaic__cell" key={j}>
              <img src={cell.img} alt="" loading="lazy" decoding="async" />
              {cell.fig && (
                <div className="chip">
                  <div className="chip__n">{cell.fig.n}</div>
                  <div className="chip__l">{cell.fig.l}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div className="mosaic" aria-hidden="true">
      <div className="mosaic__track">
        {run('a')}
        {run('b')}
      </div>
    </div>
  );
}
