'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/* Shared hover-preview behaviour for the wall tiles and the hero mosaic.
   The <video> ships with preload="none" and NO src, so a cell that is never
   hovered costs nothing. First hover attaches the source and calls load() —
   setting src alone starts no fetch under preload="none", which is the trap
   here — then play() resolves once the first frames land.

   That contract is unchanged. What is added around it:

   · a generation token, because play() is async. Hover in and straight
     back out and the old promise used to resolve AFTER stop() had already
     run, flipping `playing` back to true and leaving a paused frozen frame
     sitting over the poster with no pointer anywhere near it.
   · a mounted flag, so a promise that resolves after unmount is dropped.
   · play() may return undefined on old engines, and matchMedia can throw
     on a malformed query in a few of them; neither may take the page down.
*/
export default function useHoverPreview(src) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const gen = useRef(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const allowed = () => {
    try {
      return (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    } catch {
      return false;
    }
  };

  /* Hover intent. Without a delay, dragging the pointer across the mosaic to
     reach one cell fetched every clip it crossed — measured at 3 files /
     254KB for a single intended hover, and a sweep of the 12-tile wall would
     have pulled all 816KB. Nothing is requested until the pointer has settled
     for INTENT_MS, so passing over a cell costs nothing at all. */
  const INTENT_MS = 130;
  const timer = useRef(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  useEffect(() => clearTimer, []);

  const start = useCallback(() => {
    if (!src || !allowed()) return;
    clearTimer();
    const token = ++gen.current;
    timer.current = setTimeout(() => {
      timer.current = null;
      const v = ref.current;
      if (!v || !alive.current || gen.current !== token) return;
      if (!v.getAttribute('src')) {
        v.setAttribute('src', src);
        v.load();
      }
      const done = () => {
        if (alive.current && gen.current === token) setPlaying(true);
      };
      const p = v.play();
      if (p && typeof p.then === 'function') p.then(done, () => {});
      else done();
    }, INTENT_MS);
  }, [src]);

  const stop = useCallback(() => {
    clearTimer();
    gen.current += 1;
    setPlaying(false);
    const v = ref.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
    } catch {}
  }, []);

  return { ref, playing, start, stop };
}
