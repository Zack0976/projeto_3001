// Monta o Ato 3, marca itens, conta 0/7, dispara FINAL ao completar.

import { enviar, ctx } from './estado.js';
import { ITENS, NOTAS_CHECKLIST } from './roteiro.js';
import * as audio from './audio.js';
import * as efeitos from './efeitos.js';

let timerOcioso = null;

export function montarChecklist() {
  const el = document.getElementById('checklist');
  el.innerHTML = '';
  el.scrollTop = 0;
  ctx.marcados = new Set();

  const topo = document.createElement('div');
  topo.className = 'topo';
  topo.innerHTML = `<h2>ANTES DE ACREDITAR, PERGUNTE:</h2>
                    <span id="contador">0/7 VERIFICADO</span>`;
  el.appendChild(topo);

  ITENS.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'item';
    btn.dataset.i = i;
    btn.innerHTML = `<span class="marca">[ ]</span>${item.texto}`;
    btn.addEventListener('click', () => marcar(i, btn));
    el.appendChild(btn);
  });

  const verFinal = document.createElement('button');
  verFinal.className = 'ver-final oculto';
  verFinal.textContent = 'ver mensagem final →';
  verFinal.addEventListener('click', () => enviar('verFinal'));
  el.appendChild(verFinal);

  // Timer de 25s de inatividade
  armarTimerOcioso();
}

function armarTimerOcioso() {
  if (timerOcioso) clearTimeout(timerOcioso);
  timerOcioso = setTimeout(() => {
    if (ctx.estado === 'CRITICA' && ctx.marcados.size < 7) {
      document.querySelector('#checklist .ver-final')?.classList.remove('oculto');
    }
  }, 25000);
}

async function marcar(i, btn) {
  if (ctx.estado !== 'CRITICA') return;
  if (ctx.marcados.has(i)) return;

  ctx.marcados.add(i);
  armarTimerOcioso();          // cada toque reseta o timer de 25s

  btn.classList.add('marcado');
  btn.disabled = true;
  btn.style.pointerEvents = 'none';
  btn.querySelector('.marca').textContent = '[✓]';

  const rev = document.createElement('span');
  rev.className = 'revelacao';
  btn.appendChild(rev);
  await efeitos.digitar(rev, ITENS[i].revelacao, 25);

  audio.beep(NOTAS_CHECKLIST[i] || 440, 0.08, 0.15);

  const cont = document.getElementById('contador');
  if (cont) cont.textContent = `${ctx.marcados.size}/7 VERIFICADO`;

  if (ctx.marcados.size === 7) {
    setTimeout(() => {
      if (ctx.estado === 'CRITICA') enviar('completo');
    }, 900);
  }
}

export function limparTimer() {
  if (timerOcioso) { clearTimeout(timerOcioso); timerOcioso = null; }
}