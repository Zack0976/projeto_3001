// Máquina de estados central.
// Estados: BOOT → PORTAO → INVASAO → CORTE → REVELACAO → CRITICA → FINAL → FIM
// PAUSADO fica reservado para quando a aba oculta (ver main.js).

const T = {
  BOOT:      { pronto: 'PORTAO' },
  PORTAO:    { iniciar: 'INVASAO', continuar: 'REVELACAO' },
  INVASAO:   { fim: 'CORTE', sair: 'CORTE', oculta: 'PAUSADO' },
  CORTE:     { fim: 'REVELACAO' },
  REVELACAO: { continuar: 'CRITICA', oculta: 'PAUSADO' },
  CRITICA:   { completo: 'FINAL', verFinal: 'FINAL', oculta: 'PAUSADO' },
  FINAL:     { fim: 'FIM', rever: 'INVASAO', oculta: 'PAUSADO' },
  FIM:       { rever: 'INVASAO' },
  PAUSADO:   { visivel: null },
};

export const ctx = {
  estado: 'BOOT',
  retorno: null,
  retomar: false,
  efeitos: 'normal',
  vozModo: 'texto',
  marcados: new Set(),
  dispositivo: null,
};

const entrar = {};
const sair   = {};

export function aoEntrar(estado, fn) { entrar[estado] = fn; }
export function aoSair(estado, fn)   { sair[estado] = fn; }

export function enviar(evento, dados) {
  const de = ctx.estado;
  if (!T[de] || !(evento in T[de])) return;

  let para = T[de][evento];

  if (evento === 'oculta') {
    ctx.retorno = de === 'INVASAO' ? 'REVELACAO' : de;
    ctx.retomar = de !== 'INVASAO';
  }
  if (para === null) para = ctx.retorno;

  sair[de]?.(evento);
  ctx.estado = para;
  document.body.dataset.estado = para;
  try { sessionStorage.setItem('p3001_estado', para); } catch {}
  entrar[para]?.(evento, dados);
}