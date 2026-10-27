// Motor de cues com requestAnimationFrame para o Ato 1.
// play(cues, onCue, onEnd) / pause() / resume() / stop()

export function criar() {
  let cues = [], idx = 0, t0 = 0;
  let pausado = false, pausaEm = 0, rafId = null;
  let onCue = null, onEnd = null;

  function loop() {
    if (pausado) return;
    const t = performance.now() - t0;
    while (idx < cues.length && cues[idx].t <= t) {
      const c = cues[idx++];
      try { onCue?.(c); } catch (e) { console.warn('[cue]', e); }
    }
    if (idx >= cues.length) { onEnd?.(); return; }
    rafId = requestAnimationFrame(loop);
  }

  return {
    play(novos, cb, end) {
      cues = novos.slice();
      idx = 0;
      t0 = performance.now();
      pausado = false;
      onCue = cb;
      onEnd = end;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    },
    pause() {
      if (pausado) return;
      pausado = true;
      pausaEm = performance.now();
      if (rafId) cancelAnimationFrame(rafId);
    },
    resume() {
      if (!pausado) return;
      pausado = false;
      t0 += performance.now() - pausaEm;
      rafId = requestAnimationFrame(loop);
    },
    stop() {
      pausado = true;
      if (rafId) cancelAnimationFrame(rafId);
      cues = []; idx = 0;
    }
  };
}