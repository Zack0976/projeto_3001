// Efeitos visuais: digitação, glitch, tremor, flash, blackout, notificação, cursor morto.

let reduzido = false;
const flashCount = { inicio: 0, n: 0 };

export function setReduzido(v) { reduzido = v; }
export function ehReduzido()   { return reduzido; }

export function flash(cor = '#fff', dur = 80) {
  if (reduzido) return;
  const agora = performance.now();
  if (agora - flashCount.inicio > 1000) { flashCount.inicio = agora; flashCount.n = 1; }
  else { if (flashCount.n >= 3) return; flashCount.n++; }

  const el = document.createElement('div');
  el.className = 'flash';
  el.style.background = cor;
  el.style.animationDuration = dur + 'ms';
  document.querySelector('.palco').appendChild(el);
  setTimeout(() => el.remove(), dur + 60);
}

export function tremer(ms = 250) {
  if (reduzido) return;
  const p = document.querySelector('.palco');
  p.classList.add('tremor');
  setTimeout(() => p.classList.remove('tremor'), ms);
}

export function glitch(el, ms = 300) {
  if (!el) return;
  if (reduzido) {
    const antes = el.style.opacity;
    el.style.opacity = '0.6';
    setTimeout(() => { el.style.opacity = antes; }, ms);
    return;
  }
  el.classList.add('glitch');
  setTimeout(() => el.classList.remove('glitch'), ms);
}

export function vibrar(ms = 200) {
  if (reduzido) return;
  if (navigator.vibrate && /Android/i.test(navigator.userAgent)) {
    navigator.vibrate(ms);
  }
}

export function digitar(el, texto, ms = 18) {
  return new Promise(resolve => {
    if (!el) return resolve();
    if (reduzido) { el.textContent = texto; return resolve(); }
    el.textContent = '';
    const span = document.createElement('span');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '▌';
    el.appendChild(span);
    el.appendChild(cursor);
    let i = 0;
    const timer = setInterval(() => {
      if (i >= texto.length) {
        clearInterval(timer);
        setTimeout(() => cursor.remove(), 180);
        return resolve();
      }
      span.textContent += texto[i++];
    }, ms);
  });
}

// ─── Novo (Grok) — micro-momento 1: blackout curto ───
// Cobre a tela inteira de preto por "ms" e some. Deve ser combinado com
// capacitorEstouro() em audio.js para o efeito "sistema morrendo".
export function microBlackout(ms = 200) {
  if (reduzido) return;
  const palco = document.querySelector('.palco');
  const ov = document.createElement('div');
  ov.className = 'blackout';
  palco.appendChild(ov);
  setTimeout(() => ov.remove(), ms);
}

// ─── Novo (Grok) — micro-momento 2: notificação falsa do sistema ───
// Aparece no topo do palco, auto-some em ~3 s. Nenhum clique faz nada real
// — o botão só "trava" por 300 ms e a notificação desaparece.
export function notificacaoFalsa() {
  if (reduzido) return;
  const palco = document.querySelector('.palco');
  const notif = document.createElement('div');
  notif.className = 'notif-falsa';
  notif.innerHTML = `
    <div class="notif-titulo">⚠ ATUALIZAÇÃO DE SEGURANÇA CRÍTICA</div>
    <div class="notif-corpo">Instalar agora?</div>
    <div class="notif-acoes">
      <button data-acao="instalar">Instalar</button>
      <button data-acao="depois">Mais tarde</button>
    </div>
  `;
  palco.appendChild(notif);

  let fechada = false;
  const fechar = () => {
    if (fechada) return;
    fechada = true;
    notif.classList.add('saindo');
    setTimeout(() => notif.remove(), 400);
  };

  notif.addEventListener('click', (e) => {
    if (e.target.dataset.acao) {
      notif.style.opacity = '0.55';
      setTimeout(fechar, 300);
    }
  });

  setTimeout(fechar, 3000);
}

// ─── Novo (Grok) — micro-momento 3: cursor "morto" + deslocamento ───
// Esconde as linhas do terminal por "ms", mostra um cursor fantasma
// piscando no centro, e ao voltar as linhas estão com leve deslocamento.
// Deve ser combinado com heartbeatDigital() em audio.js.
export function cursorMorto(ms = 1200) {
  if (reduzido) return;
  const palco = document.querySelector('.palco');
  const linhas = document.getElementById('linhas');

  const cur = document.createElement('div');
  cur.className = 'cursor-fantasma';
  cur.textContent = '▌';
  palco.appendChild(cur);

  if (linhas) {
    linhas.style.transition = 'opacity 150ms, transform 150ms';
    linhas.style.opacity = '0.15';
  }

  setTimeout(() => {
    if (linhas) {
      linhas.style.opacity = '1';
      linhas.style.transform = 'translate(3px, 2px)';
      setTimeout(() => { linhas.style.transform = ''; }, 400);
    }
    cur.style.transform = 'translate(-50%, -50%) translate(3px, 4px)';
    cur.style.opacity = '0';
    setTimeout(() => cur.remove(), 400);
  }, ms);
}