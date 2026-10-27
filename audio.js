// Web Audio API: bipes, impacto, drone, ruído, master gain, capacitor, heartbeat.

let ac = null;
let master = null;

export function iniciar() {
  if (ac) return ac;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ac = new AC();
  master = ac.createGain();
  master.gain.value = 1;
  master.connect(ac.destination);
  return ac;
}

export function resume()  { if (ac && ac.state === 'suspended') ac.resume(); }
export function suspend() { if (ac && ac.state === 'running')   ac.suspend(); }
export function getCtx()  { return ac; }
export function getMaster(){ return master; }

export function beep(freq = 1200, dur = 0.04, vol = 0.12) {
  if (!ac || !master) return;
  const osc = ac.createOscillator();
  const g   = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(vol, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(g).connect(master);
  osc.start();
  osc.stop(ac.currentTime + dur + 0.01);
}

export function impacto() {
  if (!ac || !master) return;
  const osc = ac.createOscillator();
  const g   = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.4);
  g.gain.setValueAtTime(0.45, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.55);
  osc.connect(g).connect(master);
  osc.start();
  osc.stop(ac.currentTime + 0.6);

  const dur = 0.18;
  const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const ng = ac.createGain();
  ng.gain.setValueAtTime(0.25, ac.currentTime);
  ng.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  src.connect(ng).connect(master);
  src.start();
}

export function drone(freqIni, freqFim, dur = 1.4) {
  if (!ac || !master) return;
  const osc = ac.createOscillator();
  const g   = ac.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freqIni, ac.currentTime);
  osc.frequency.linearRampToValueAtTime(freqFim, ac.currentTime + dur);
  g.gain.setValueAtTime(0.04, ac.currentTime);
  g.gain.linearRampToValueAtTime(0.12, ac.currentTime + dur * 0.85);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(g).connect(master);
  osc.start();
  osc.stop(ac.currentTime + dur + 0.05);
}

export function ruido(dur = 0.3, vol = 0.2) {
  if (!ac || !master) return;
  const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  src.connect(g).connect(master);
  src.start();
}

export function pararTudo() {
  if (!master || !ac) return;
  const t = ac.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(0, t);
  setTimeout(() => {
    if (master && ac) master.gain.setValueAtTime(1, ac.currentTime);
  }, 150);
}

// ─── Novo (Grok) — estouro de capacitor ───
// Rajada curta de ruído agudo + click, tipo componente queimando.
export function capacitorEstouro() {
  if (!ac || !master) return;
  const dur = 0.09;
  const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const env = Math.pow(1 - i / data.length, 5);   // decaimento agressivo
    data[i] = (Math.random() * 2 - 1) * env;
  }
  const src = ac.createBufferSource();
  src.buffer = buf;
  const hp = ac.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;
  const g = ac.createGain();
  g.gain.value = 0.45;
  src.connect(hp).connect(g).connect(master);
  src.start();
}

// ─── Novo (Grok) — heartbeat digital ───
// Duas batidas graves e espaçadas, tipo pulso eletrônico.
export function heartbeatDigital() {
  if (!ac || !master) return;
  const tocarThump = (t0) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(70, t0);
    osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.18);
    g.gain.setValueAtTime(0.32, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
    osc.connect(g).connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.3);
  };
  const t = ac.currentTime;
  tocarThump(t);
  tocarThump(t + 0.35);
}