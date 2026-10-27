// Voz IA com cadeia de fallback:
//   1) arquivo .mp3 em assets/voz/ (tocado via Web Audio, com efeito de persona)
//   2) speechSynthesis em pt-BR
//   3) só legenda (nada toca)
// Retorna Promise que resolve ao fim da fala OU após limite de segurança.

import { getCtx, getMaster } from './audio.js';

const FALAS = {
  V1:  { texto: 'Olá.',                                                persona: 'distorcida', arquivo: 'assets/voz/v01.mp3' },
  V2:  { texto: 'Eu já sei quem você é.',                              persona: 'distorcida', arquivo: 'assets/voz/v02.mp3' },
  V3:  { texto: 'Agora...',                                            persona: 'distorcida', arquivo: 'assets/voz/v03.mp3' },
  V4:  { texto: 'Calma.',                                              persona: 'limpa',      arquivo: 'assets/voz/v04.mp3' },
  V5:  { texto: 'Seu celular não foi hackeado.',                       persona: 'limpa',      arquivo: 'assets/voz/v05.mp3' },
  V6:  { texto: 'Nada foi copiado. Nada saiu daqui.',                  persona: 'limpa',      arquivo: 'assets/voz/v06.mp3' },
  V7:  { texto: 'A voz que te assustou é a mesma que fala agora.',     persona: 'limpa',      arquivo: 'assets/voz/v07.mp3' },
  V8:  { texto: 'Ela foi gerada por uma máquina.',                     persona: 'limpa',      arquivo: 'assets/voz/v08.mp3' },
  V9:  { texto: 'Agora imagine essa voz igual à de alguém que você ama.', persona: 'limpa',   arquivo: 'assets/voz/v09.mp3' },
  V10: { texto: 'Antes de acreditar, pergunte.',                       persona: 'limpa',      arquivo: 'assets/voz/v10.mp3' },
  V11: { texto: 'A IA não é a vilã.',                                  persona: 'limpa',      arquivo: 'assets/voz/v11.mp3' },
  V12: { texto: 'Mas também não é sua amiga.',                         persona: 'limpa',      arquivo: 'assets/voz/v12.mp3' },
  V13: { texto: 'Quem decide o que é verdade é você.',                 persona: 'limpa',      arquivo: 'assets/voz/v13.mp3' },
  V14: { texto: 'Esta voz também é de máquina. Duvide dela também.',   persona: 'limpa',      arquivo: 'assets/voz/v14.mp3' },
};

const buffers = {};
let vozesProntas = false;

if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => { vozesProntas = true; };
  speechSynthesis.getVoices();
}

// Tenta baixar e decodificar os mp3. Se o primeiro não existir, desiste.
export async function carregarArquivos() {
  const ac = getCtx();
  if (!ac) return;
  try {
    const teste = await fetch(FALAS.V1.arquivo, { method: 'HEAD' });
    if (!teste.ok) return;   // sem arquivos: fica no fallback de síntese
  } catch { return; }

  for (const id in FALAS) {
    try {
      const res = await fetch(FALAS[id].arquivo);
      if (!res.ok) continue;
      const arr = await res.arrayBuffer();
      buffers[id] = await ac.decodeAudioData(arr);
    } catch { /* ignora arquivo individual com problema */ }
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function mostrarLegenda(t) {
  const el = document.getElementById('legenda');
  if (el) el.textContent = t;
}

export function falar(id) {
  const f = FALAS[id];
  if (!f) return Promise.resolve();
  mostrarLegenda(f.texto);

  let p;
  if (buffers[id] && getCtx())        p = tocarBuffer(id, f.persona);
  else if ('speechSynthesis' in window) p = sintetizar(f);
  else                                 p = Promise.resolve();

  // Limite de segurança: nunca trava a timeline mesmo se onend não disparar
  const limite = Math.min(6000, f.texto.length * 80 + 600);
  return Promise.race([p, sleep(limite)]);
}

export function cancelar() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

// ── Implementação: arquivo via Web Audio ──
function tocarBuffer(id, persona) {
  return new Promise(resolve => {
    const ac = getCtx();
    const master = getMaster();
    if (!ac || !master) return resolve();

    const src = ac.createBufferSource();
    src.buffer = buffers[id];

    if (persona === 'distorcida') {
      src.playbackRate.value = 0.85;
      const shaper = ac.createWaveShaper();
      shaper.curve = curva(20);
      const bp = ac.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1200;
      bp.Q.value = 0.7;
      const delay = ac.createDelay();
      delay.delayTime.value = 0.04;
      const fb = ac.createGain();
      fb.gain.value = 0.22;

      src.connect(shaper);
      shaper.connect(bp);
      bp.connect(master);
      bp.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(master);
    } else {
      // Limpa: compressor leve para nivelar
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -18;
      src.connect(comp).connect(master);
    }

    src.onended = () => resolve();
    src.start();
  });
}

// ── Implementação: speechSynthesis ──
function sintetizar(f) {
  return new Promise(resolve => {
    const vozes = speechSynthesis.getVoices();
    const pt = vozes.find(v => v.lang && v.lang.toLowerCase().startsWith('pt'));
    if (!pt) return resolve();  // sem voz pt: só legenda

    const u = new SpeechSynthesisUtterance(f.texto);
    u.lang   = 'pt-BR';
    u.voice  = pt;
    u.rate   = f.persona === 'distorcida' ? 0.8 : 0.95;
    u.pitch  = f.persona === 'distorcida' ? 0.5 : 1;
    u.onend  = resolve;
    u.onerror = resolve;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  });
}

// Curva de distorção (tanh) para o WaveShaper
function curva(k) {
  const n = 44100;
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    c[i] = Math.tanh(x * k) / Math.tanh(k);
  }
  return c;
}