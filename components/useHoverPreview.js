'use client';
import { useCallback, useRef, useState } from 'react';

/* Shared hover-preview behaviour for the wall tiles and the hero mosaic.
   The <video> ships with preload="none" and NO src, so a cell that is never
   hovered costs nothing. First hover attaches the source and calls load() —
   setting src alone starts no fetch under preload="none", which is the trap
   here — then play() resolves once the first frames land. */
export default function useHoverPreview(src) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const allowed = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const start = useCallback(() => {
    if (!src || !allowed()) return;
    const v = ref.current;
    if (!v) return;
    if (!v.getAttribute('src')) {
      v.setAttribute('src', src);
      v.load();
    }
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, [src]);

  const stop = useCallback(() => {
    const v = ref.current;
    setPlaying(false);
    if (!v) return;
    v.pause();
    try {
      v.currentTime = 0;
    } catch {}
  }, []);

  return { ref, playing, start, stop };
}
