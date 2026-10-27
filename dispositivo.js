// Lê APENAS dados que o navegador entrega a qualquer site.
// Nada é enviado para servidor. Nenhuma permissão é solicitada.

export function ler() {
  const ua = navigator.userAgent;
  let plataforma = 'dispositivo móvel';
  if (/iPad/.test(ua) || (/Mac/.test(ua) && 'ontouchend' in document)) plataforma = 'iPad';
  else if (/iPhone|iPod/.test(ua)) plataforma = 'iPhone';
  else if (/Android/.test(ua))     plataforma = 'Android';
  else if (!/Mobi/.test(ua))       plataforma = 'computador';

  return {
    plataforma,
    largura: window.innerWidth,
    altura: window.innerHeight,
    idioma: (navigator.language || 'pt-BR'),
  };
}

export function hora() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function horaMinuto() {
  return hora().slice(0, 5);
}