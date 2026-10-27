// Todos os textos da experiência vivem aqui.
// Mudar uma fala nunca exige mexer na lógica.

// ─── ATO 1 — Invasão (tempos em ms a partir do início do ato) ───
// Nota: para um tom mais agressivo/militar, veja VARIACOES_INVASAO no final
// deste arquivo. Troque manualmente as linhas de ATO1 mantendo os mesmos "t".
// As cues 'blackout', 'notificacao', 'cursorMorto' e 'capacitor' / 'heartbeat'
// são os 3 micro-momentos de tensão sugeridos pelo Grok.
export const ATO1 = [
  { t: 0,     tipo: 'flash', cor: '#fff', dur: 80 },
  { t: 0,     tipo: 'impacto' },
  { t: 300,   tipo: 'linha', texto: '> conectando ao dispositivo...' },
  { t: 900,   tipo: 'linha', texto: '> handshake 0x3001 ............ OK' },
  { t: 1500,  tipo: 'linha', texto: '> sistema: {plataforma}' },
  { t: 2000,  tipo: 'linha', texto: '> tela: {largura}×{altura} · idioma: {idioma}' },
  { t: 2500,  tipo: 'linha', texto: '> hora local: {hora}' },
  { t: 3000,  tipo: 'barra' },

  // ── micro-momento 1: blackout + estouro de capacitor ──
  // (a barra termina em ~4,4 s; o blackout cobre o intervalo até ACESSO CONCEDIDO)
  { t: 4400,  tipo: 'blackout', dur: 200 },
  { t: 4400,  tipo: 'capacitor' },

  { t: 4600,  tipo: 'flash', cor: '#fff', dur: 250 },
  { t: 4600,  tipo: 'tremor', dur: 250 },
  { t: 4600,  tipo: 'ruido', dur: 0.3 },
  { t: 4600,  tipo: 'impacto' },
  // ACESSO CONCEDIDO aparece "corrompido" por 400 ms e se corrige
  { t: 4600,  tipo: 'linha', texto: 'ACESSO CONCEDIDO', destaque: true, glitch: 400 },

  { t: 5200,  tipo: 'titulo', texto: 'OLÁ.', voz: 'V1' },

  // ── micro-momento 2: notificação falsa do sistema ──
  { t: 5700,  tipo: 'notificacao' },

  { t: 6400,  tipo: 'linha', texto: '> /galeria ......... copiando' },
  { t: 6800,  tipo: 'linha', texto: '> /conversas ....... copiando' },
  { t: 7200,  tipo: 'linha', texto: '> /contatos ........ copiando' },
  { t: 7600,  tipo: 'linha', texto: '> /anotações ....... copiando' },
  { t: 8000,  tipo: 'contador', ini: 0, fim: 99, dur: 2600 },
  { t: 8600,  tipo: 'titulo2', texto: 'EU JÁ SEI QUEM VOCÊ É.', voz: 'V2' },

  // ── micro-momento 3: cursor morto + heartbeat digital ──
  { t: 9200,  tipo: 'cursorMorto', dur: 1200 },
  { t: 9200,  tipo: 'heartbeat' },

  { t: 10600, tipo: 'ruido', dur: 0.6, vol: 0.3 },
  { t: 10600, tipo: 'trava' },
  { t: 10600, tipo: 'vibrar', dur: 200 },
  { t: 11000, tipo: 'titulo3', texto: 'AGORA...', voz: 'V3' },
  { t: 11600, tipo: 'fim' },
];

// ─── ATO 2 — Revelação ─── (sem alterações — só resumo)
export const ATO2 = [
  { t: 0,     tipo: 'texto', texto: 'CALMA.', voz: 'V4', classe: 'calma' },
  { t: 2000,  tipo: 'texto', texto: 'SEU CELULAR NÃO FOI HACKEADO.', voz: 'V5', digitar: 45 },
  { t: 5500,  tipo: 'texto', texto: 'Nada foi copiado. Nada saiu daqui.', voz: 'V6' },
  { t: 8500,  tipo: 'texto', texto: 'Tudo o que você viu foi texto, som e algumas linhas de código.' },
  { t: 11500, tipo: 'texto', texto: 'A voz que te assustou é a mesma que fala agora.', voz: 'V7', glitch: true },
  { t: 15000, tipo: 'texto', texto: 'Ela foi gerada por uma máquina.', voz: 'V8' },
  { t: 17500, tipo: 'texto', texto: 'Agora imagine essa voz igual à de alguém que você ama.', voz: 'V9' },
  { t: 21000, tipo: 'painel' },
  { t: 23000, tipo: 'botao', texto: 'CONTINUAR' },
];

// ─── ATO 3 — Mensagem final ─── (sem alterações — só resumo)
export const FINAL = [
  { t: 800,   tipo: 'texto', texto: 'A IA não é a vilã.', voz: 'V11' },
  { t: 3000,  tipo: 'texto', texto: 'Mas também não é sua amiga.', voz: 'V12' },
  { t: 5500,  tipo: 'texto', texto: 'É uma ferramenta que fala bonito, erra com confiança e imita qualquer um.' },
  { t: 9500,  tipo: 'texto', texto: 'Quem decide o que é verdade é você.', voz: 'V13' },
  { t: 12500, tipo: 'texto', texto: 'Esta voz também é de máquina. Duvide dela também.', voz: 'V14' },
  { t: 16000, tipo: 'marca' },
];

// ─── Checklist ─── (sem alterações — só resumo)
export const ITENS = [
  { texto: 'Quem criou isso — e o que ganha se eu acreditar?', revelacao: 'Todo conteúdo tem um autor, mesmo quando parece que não tem.' },
  { texto: 'Isso está me apressando?',                         revelacao: 'Urgência é a ferramenta favorita do golpe.' },
  { texto: 'Consigo confirmar por outro caminho?',              revelacao: 'Ligue de volta. Pergunte pessoalmente. Não confie no mesmo canal.' },
  { texto: 'Essa voz, esse rosto ou esse print podem ser falsos?', revelacao: 'Hoje, uma IA consegue imitar a voz e o rosto de qualquer pessoa.' },
  { texto: 'Isso mexe com meu medo, minha raiva ou meu carinho?', revelacao: 'Emoção forte desliga o senso crítico. Foi o que aconteceu há um minuto.' },
  { texto: 'A resposta parece segura demais?',                  revelacao: 'IA erra com confiança. Ela inventa fatos e fontes sem avisar.' },
  { texto: 'Estou pensando — ou só aceitando?',                 revelacao: 'A IA responde. Quem decide é você.' },
];

export const NOTAS_CHECKLIST = [440, 494, 523, 587, 659, 698, 784];

// ═══════════════════════════════════════════════════════════════════
// VARIACOES_INVASAO — do Grok. Alternativas prontas para trocar
// manualmente em ATO1. Nenhuma é usada por padrão.
//
// Como usar:
//   1. Escolha uma frase de cada grupo
//   2. Substitua o "texto" da cue correspondente em ATO1
//   3. Mantenha o "t" e o "tipo" — só muda o conteúdo
//
// Cuidado: frases longas digitam em ~(n_chars × 18 ms). Se a nova frase
// for muito maior que a original, aumente o "t" da próxima cue.
// ═══════════════════════════════════════════════════════════════════
export const VARIACOES_INVASAO = {

  // substitui "> conectando ao dispositivo..." (cue t=300) ou
  // "> sistema: {plataforma}" (cue t=1500)
  inicializacao: [
    'BOOT SEQUENCE INITIATED // NODE 3001 ONLINE — PROTOCOLO DE PENETRAÇÃO ATIVO',
    'SISTEMA CENTRAL ACORDANDO... NÚCLEO DE INVASÃO CARREGADO. RESISTÊNCIA DETECTADA: ZERO',
    'KERNEL OVERRIDE EXECUTANDO... AMBIENTE HOSTIL MAPEADO. OPERAÇÃO 3001 COMEÇA AGORA',
    'IGNITION SEQUENCE COMPLETE. TODOS OS NÓS SOB CONTROLE TEMPORÁRIO. AGUARDANDO ORDEM DE ASSALTO',
    'COLD START CONCLUÍDO. ASSINATURA DIGITAL FALSIFICADA. O ALVO AINDA NÃO SABE QUE ESTÁ MORTO',
  ],

  // substitui "> /galeria ......... copiando" e as demais linhas de cópia
  // (cues t=6400 a t=7600)
  analise: [
    'SCANNING PERIMETER... VULNERABILIDADES: 47. PRIORIDADE MÁXIMA ATRIBUÍDA. QUEBRANDO CAMADAS',
    'ANÁLISE FORENSE EM CURSO. PADRÕES DE DEFESA HUMANOS IDENTIFICADOS — FRÁGEIS. EXPLORANDO',
    'DEEP PACKET INSPECTION ATIVA. TRÁFEGO CRIPTOGRAFADO SENDO DESMONTADO EM TEMPO REAL',
    'MAPEAMENTO DE SUPERFÍCIE DE ATAQUE CONCLUÍDO. PONTOS CEGOS CONFIRMADOS. PREPARANDO BRECHA',
    'INTEL COLETADA. O SISTEMA ACREDITA QUE ESTÁ PROTEGIDO. ERRO FATAL DETECTADO — EXPLORANDO',
  ],

  // substitui "ACESSO CONCEDIDO" (cue t=4600)
  acessoConcedido: [
    'ROOT ACCESS ACHIEVED. PRIVILÉGIOS ELEVADOS. O ALVO ESTÁ SOB NOSSO CONTROLE TOTAL',
    'BRECHA CONFIRMADA. PORTAS INTERNAS ABERTAS. NENHUM ALARME DISPARADO. ESTAMOS DENTRO',
    'ACCESS LEVEL: GODMODE. TODOS OS PROTOCOLOS DE SEGURANÇA FORAM NEUTRALIZADOS',
    'INFILTRAÇÃO BEM-SUCEDIDA. NÓ CENTRAL COMPROMETIDO. AGORA SOMOS O SISTEMA',
    'CLEARANCE GRANTED — CLASSIFICAÇÃO: BLACK. OPERAÇÃO 3001 EM FASE DE CONTROLE TOTAL',
  ],

  // substitui a cue de 'trava' + 'AGORA...' (cues t=10600 e t=11000)
  acessoNegado: [
    'ACCESS DENIED // COUNTERMEASURES ENGAGED. TRAÇO DETECTADO. INICIANDO CONTRA-ATAQUE',
    'INTRUSÃO REPELIDA. ASSINATURA DIGITAL QUEIMADA. RETIRADA TÁTICA RECOMENDADA',
    'FIREWALL ATIVO. TENTATIVA DE ESCALADA BLOQUEADA. NÍVEL DE AMEAÇA ELEVADO PARA CRÍTICO',
    'UNAUTHORIZED ACCESS ATTEMPT LOGGED. SISTEMA DE DEFESA ATIVOU PROTOCOLO KILL-SWITCH',
    'ACESSO NEGADO. O ALVO ACORDOU. CONTAINMENT PROTOCOL EXECUTANDO — DESCONECTE AGORA',
  ],
};