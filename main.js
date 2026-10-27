// ─────────────────────────────────────────────────────────────────────────────
// PROJETO 3001 — main.js
// Orquestrador: registra handlers dos 8 estados, liga o portão, o botão sair,
// a visibilidade da aba, os easter eggs do console e o executarCueAto1 com
// os micro-momentos de tensão (blackout, notificação falsa, cursor morto).
// ─────────────────────────────────────────────────────────────────────────────

import { enviar, ctx, aoEntrar, aoSair } from './estado.js';
import { criar as criarTimeline } from './timeline.js';
import { ATO1, ATO2, FINAL } from './roteiro.js';
import { ler as lerDispositivo, hora } from './dispositivo.js';
import * as audio from './audio.js';
import * as voz from './voz.js';
import * as efeitos from './efeitos.js';
import { montarChecklist, limparTimer } from './checklist.js';

// ─────────────────────────────────────────────────────────────────────────────
// Easter eggs (Grok) — visíveis só para quem abre o DevTools
// ─────────────────────────────────────────────────────────────────────────────
console.log(
  '%cPROJETO 3001',
  'color:#00aaff;font-size:22px;font-weight:bold;font-family:monospace'
);
console.log(
  '%cVocê abriu o console. Parabéns. Você é o tipo de pessoa que ainda acredita que controla a máquina.',
  'color:#0a84ff;font-family:monospace'
);
console.warn(
  'Atenção: esta experiência foi projetada para fazer você sentir algo. A maioria dos usuários de IA já perdeu essa capacidade.'
);
/*
  Enquanto você lê isso, quantas abas de IA estão abertas no fundo?
  Quantas respostas você aceitou sem questionar hoje?
*/
console.log(
  '%cPROJETO 3001',
  'color:#00aaff;font-weight:bold',
  '— A verdadeira invasão não é no sistema. É na sua capacidade de pensar sem intermediário.'
);
console.log(
  '%cSe você chegou até aqui, ainda tem curiosidade. A maioria já pediu para a IA resumir a experiência inteira.',
  'color:#3a4a5c;font-style:italic;font-family:monospace'
);

// ─────────────────────────────────────────────────────────────────────────────
// Detecção de preferência por menos efeitos
// ─────────────────────────────────────────────────────────────────────────────
const prefereReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefereReduzido) {
  ctx.efeitos = 'reduzido';
  efeitos.setReduzido(true);
  document.body.classList.add('reduzido');
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilitários
// ─────────────────────────────────────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const timeline = criarTimeline();

// ─────────────────────────────────────────────────────────────────────────────
// ATO 0 — Portão
// ─────────────────────────────────────────────────────────────────────────────
function renderPortao() {
  const el = $('#portao');
  const visitado = sessionStorage.getItem('p3001_invadido') === '1';
  const rotulo = visitado ? 'CONTINUAR' : 'INICIAR';

  el.innerHTML = `
    <h1>PROJETO 3001<span class="cursor">_</span></h1>
    <p class="sub">uma experiência imersiva</p>
    <p class="dica">≈ 2 min · melhor com fone de ouvido</p>
    <button class="iniciar" id="btn-iniciar">[ ${rotulo} ]</button>
    <button class="sem-efeitos" id="btn-sem">iniciar sem efeitos</button>
    <p class="aviso">Contém luzes piscantes e efeitos de glitch.</p>
  `;

  $('#btn-iniciar').addEventListener('click', () => iniciar(false));
  $('#btn-sem').addEventListener('click', () => iniciar(true));
}

async function iniciar(semEfeitos) {
  // 1) desbloqueia áudio no gesto
  audio.iniciar();
  audio.resume();

  // 2) destrava speechSynthesis no iPhone
  if ('speechSynthesis' in window) {
    try {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      speechSynthesis.speak(u);
    } catch {}
  }

  // 3) modo sem efeitos
  if (semEfeitos) {
    ctx.efeitos = 'reduzido';
    efeitos.setReduzido(true);
    document.body.classList.add('reduzido');
  }

  // 4) baixa arquivos de voz (não bloqueia)
  voz.carregarArquivos();

  // 5) lê dados do aparelho (só no navegador)
  ctx.dispositivo = lerDispositivo();

  // 6) entra no estado correto
  const visitado = sessionStorage.getItem('p3001_invadido') === '1';
  enviar(visitado ? 'continuar' : 'iniciar');
}

// ─────────────────────────────────────────────────────────────────────────────
// ATO 1 — Invasão
// ─────────────────────────────────────────────────────────────────────────────
function entrarInvasao() {
  const term = $('#terminal');
  const linhas = term.querySelector('#linhas');
  linhas.innerHTML = '';
  $('#barra').classList.remove('ativa');
  $('#barra-fill').style.width = '0%';
  $('#contador').classList.remove('ativa', 'travado');
  $('#contador').textContent = '';
  $('#titulo').innerHTML = '';

  const d = ctx.dispositivo;
  const horaStr = hora();

  // Interpola variáveis do dispositivo nos textos
  const cues = ATO1.map((c) => {
    if (!c.texto) return c;
    return {
      ...c,
      texto: c.texto
        .replace('{plataforma}', d.plataforma)
        .replace('{largura}', d.largura)
        .replace('{altura}', d.altura)
        .replace('{idioma}', d.idioma)
        .replace('{hora}', horaStr),
    };
  });

  timeline.play(cues, executarCueAto1, () => {
    audio.pararTudo();
    enviar('fim');
  });
}

async function executarCueAto1(c) {
  switch (c.tipo) {
    // ── efeitos básicos ──
    case 'flash':
      efeitos.flash(c.cor, c.dur);
      break;
    case 'tremor':
      efeitos.tremer(c.dur);
      break;
    case 'vibrar':
      efeitos.vibrar(c.dur);
      break;
    case 'impacto':
      audio.impacto();
      break;
    case 'ruido':
      audio.ruido(c.dur, c.vol ?? 0.2);
      break;

    // ── micro-momentos de tensão (Grok) ──
    case 'capacitor':
      audio.capacitorEstouro();
      break;
    case 'heartbeat':
      audio.heartbeatDigital();
      break;
    case 'blackout':
      efeitos.microBlackout(c.dur ?? 200);
      break;
    case 'notificacao':
      efeitos.notificacaoFalsa();
      break;
    case 'cursorMorto':
      efeitos.cursorMorto(c.dur ?? 1200);
      break;

    // ── linhas do terminal (com glitch opcional pós-blackout) ──
    case 'linha': {
      const div = document.createElement('div');
      div.className = 'linha' + (c.destaque ? ' destaque' : '');
      $('#linhas').appendChild(div);
      audio.beep(1200, 0.04);

      if (c.glitch) {
        // aparece "corrompido" por c.glitch ms e se corrige
        div.textContent = c.texto;
        div.classList.add('glitch');
        setTimeout(() => div.classList.remove('glitch'), c.glitch);
      } else {
        await efeitos.digitar(div, c.texto, 18);
      }
      break;
    }

    // ── barra de progresso ──
    case 'barra': {
      $('#barra').classList.add('ativa');
      audio.drone(60, 120, 1.4);
      await animarBarra(1400);
      break;
    }

    // ── contador TRANSFERINDO 00% → 99% ──
    case 'contador': {
      $('#contador').classList.add('ativa');
      await animarContador(c);
      break;
    }

    case 'trava':
      $('#contador').classList.add('travado');
      break;

    // ── títulos gigantes ──
    case 'titulo':
    case 'titulo2':
    case 'titulo3': {
      const div = document.createElement('div');
      div.className = 'gigante';
      div.textContent = c.texto;
      $('#titulo').innerHTML = '';
      $('#titulo').appendChild(div);
      efeitos.glitch(div, 300);
      if (c.voz) voz.falar(c.voz); // não aguarda: Ato 1 é fixo em 11,6s
      break;
    }

    case 'fim':
      // tratado no callback onEnd da timeline
      break;
  }
}

function animarBarra(duracao) {
  return new Promise((res) => {
    const fill = $('#barra-fill');
    const t0 = performance.now();
    function step() {
      const t = Math.min(1, (performance.now() - t0) / duracao);
      fill.style.width = t * 100 + '%';
      if (t < 1) requestAnimationFrame(step);
      else res();
    }
    requestAnimationFrame(step);
  });
}

function animarContador(c) {
  return new Promise((res) => {
    const el = $('#contador');
    const t0 = performance.now();
    function step() {
      const t = Math.min(1, (performance.now() - t0) / c.dur);
      const v = Math.floor(c.ini + (c.fim - c.ini) * t);
      el.textContent = `TRANSFERINDO ${String(v).padStart(2, '0')}%`;
      if (t < 1) requestAnimationFrame(step);
      else res();
    }
    requestAnimationFrame(step);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CORTE — 1,9 s de silêncio total
// ─────────────────────────────────────────────────────────────────────────────
function entrarCorte() {
  voz.cancelar();
  audio.pararTudo();
  $('#titulo').innerHTML = '';
  $('#terminal #linhas').innerHTML = '';
  setTimeout(() => enviar('fim'), 1900);
}

// ─────────────────────────────────────────────────────────────────────────────
// ATO 2 — Revelação
// ─────────────────────────────────────────────────────────────────────────────
async function entrarRevelacao() {
  sessionStorage.setItem('p3001_invadido', '1');

  const el = $('#revelacao');
  el.innerHTML = '<div class="conteudo"></div>';
  const cont = el.querySelector('.conteudo');

  let calmaEl = null;

  await sequenciarComVoz(ATO2, async (c) => {
    switch (c.tipo) {
      case 'texto': {
        // se havia CALMA anterior e agora vem outra linha, faz CALMA subir e sumir
        if (calmaEl && c.texto !== 'CALMA.') {
          calmaEl.classList.add('sai');
          calmaEl = null;
        }

        const p = document.createElement('p');
        p.className = 'linha' + (c.classe ? ' ' + c.classe : '');
        cont.appendChild(p);
        if (c.classe === 'calma') calmaEl = p;

        if (c.digitar) await efeitos.digitar(p, c.texto, c.digitar);
        else p.textContent = c.texto;

        if (c.glitch) efeitos.glitch(p, 300);

        if (c.voz) {
          await voz.falar(c.voz);
          return { vozFim: true };
        }
        break;
      }

      case 'painel': {
        const d = ctx.dispositivo;
        const painel = document.createElement('div');
        painel.className = 'painel';
        painel.innerHTML = `
          <h3>O QUE ESTA PÁGINA SABIA SOBRE VOCÊ</h3>
          <pre>sistema ...... ${d.plataforma}
tela ......... ${d.largura}×${d.altura}
idioma ....... ${d.idioma}
hora ......... ${hora().slice(0, 5)}</pre>
          <div class="nota">Seu navegador entrega isso a qualquer site, sem pedir permissão. Nada disso foi enviado.</div>
        `;
        el.appendChild(painel);
        break;
      }

      case 'botao': {
        const btn = document.createElement('button');
        btn.className = 'continuar';
        btn.textContent = `[ ${c.texto} ]`;
        btn.addEventListener('click', () => enviar('continuar'));
        el.appendChild(btn);
        break;
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ATO 3 — Crítica
// ─────────────────────────────────────────────────────────────────────────────
function entrarCritica() {
  montarChecklist();
  voz.falar('V10'); // "Antes de acreditar, pergunte."
}

// ─────────────────────────────────────────────────────────────────────────────
// ATO 3 — Mensagem final
// ─────────────────────────────────────────────────────────────────────────────
async function entrarFinal() {
  limparTimer();
  $('#checklist').innerHTML = '';

  const el = $('#final');
  el.innerHTML = '';

  await sequenciarComVoz(FINAL, async (c) => {
    if (c.tipo === 'texto') {
      const p = document.createElement('p');
      p.className = 'linha';
      p.textContent = c.texto;
      el.appendChild(p);
      if (c.voz) {
        await voz.falar(c.voz);
        return { vozFim: true };
      }
    } else if (c.tipo === 'marca') {
      const m = document.createElement('div');
      m.className = 'marca-final';
      m.innerHTML = `PROJETO 3001<span class="sub">pense antes de acreditar</span>`;
      el.appendChild(m);
      efeitos.glitch(m, 400);
    }
  });

  const btn = document.createElement('button');
  btn.className = 'rever';
  btn.textContent = '[ VER DE NOVO ]';
  btn.addEventListener('click', () => enviar('rever'));
  el.appendChild(btn);

  enviar('fim'); // passa para FIM (mantém botão visível; permite "rever")
}

// ─────────────────────────────────────────────────────────────────────────────
// Sequenciador com espera por voz
// ─────────────────────────────────────────────────────────────────────────────
async function sequenciarComVoz(cues, executor) {
  let bloqueadoAte = 0;
  const t0 = performance.now();
  for (const c of cues) {
    const alvo = Math.max(t0 + c.t, bloqueadoAte);
    const esperar = alvo - performance.now();
    if (esperar > 0) await sleep(esperar);
    const r = await executor(c);
    if (r && r.vozFim) bloqueadoAte = performance.now() + 400;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Registro de estados
// ─────────────────────────────────────────────────────────────────────────────
aoEntrar('PORTAO', renderPortao);
aoEntrar('INVASAO', entrarInvasao);
aoEntrar('CORTE', entrarCorte);
aoEntrar('REVELACAO', entrarRevelacao);
aoEntrar('CRITICA', entrarCritica);
aoEntrar('FINAL', entrarFinal);
aoEntrar('FIM', () => {
  /* botão "ver de novo" já foi anexado */
});
aoEntrar('PAUSADO', () => {
  timeline.pause();
  voz.cancelar();
  audio.suspend();
});

aoSair('INVASAO', () => {
  timeline.stop();
  voz.cancelar();
  audio.pararTudo();
  sessionStorage.setItem('p3001_invadido', '1');
  $('#titulo').innerHTML = '';
});

aoSair('CRITICA', () => limparTimer());
aoSair('FINAL', () => limparTimer());

// ─────────────────────────────────────────────────────────────────────────────
// Botão sair (só visível no Ato 1 via CSS)
// ─────────────────────────────────────────────────────────────────────────────
$('#sair').addEventListener('click', () => enviar('sair'));

// ─────────────────────────────────────────────────────────────────────────────
// Visibilidade da aba
//   INVASÃO some → pula direto para Revelação (ninguém fica preso no susto)
//   Demais atos → suspende áudio; retoma ao voltar
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (ctx.estado === 'INVASAO') {
      enviar('sair'); // INVASAO → CORTE → REVELACAO
    } else {
      audio.suspend();
      voz.cancelar();
    }
  } else {
    audio.resume();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Inicia a máquina
// ─────────────────────────────────────────────────────────────────────────────
enviar('pronto');