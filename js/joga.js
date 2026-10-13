/* ============================================
   CROWN OF SHADOWS — joga.js v4
   Investigativo + Dragao + D20 + Mapa Grande
   ============================================ */

/* ---- LORE ---- */
const LORE = {
  intro: `O Dragao Ancestral VALDRAK dormia sob o Castelo Real ha mil anos. O Rei Aldric III, obcecado com imortalidade, abriu o Grimorio Proibido e pronunciou o Encantamento do Despertar. Valdrak acordou — corrompido, furioso, imparavel. Agora ele queima Valdoria sistematicamente, regiao por regiao. Tres herois devem investigar os fragmentos do Grimorio espalhados pelo reino para descobrir o unico feitico capaz de selar Valdrak de volta ao sono eterno.`,
  clues: [
    'Fragmento I: "O dragao teme a Chama Inversa — fogo que nasce do gelo das Montanhas Eternas."',
    'Fragmento II: "Seu coracao bate no Cristal Negro enterrado nas Ruinas de Valdor."',
    'Fragmento III: "A voz do dragao pode ser silenciada pela Harpa dos Elfos, perdida no Pantano."',
    'Fragmento IV: "Valdrak foi selado originalmente com o sangue dos Tres Guardioes — seus descendentes ainda vivem."',
    'Fragmento V: "O Grimorio completo esta no trono do castelo. Quem o ler completo pode comandar o dragao."'
  ],
  regions: {
    elden:    'Vila de Elden — Ultimo refugio. Sobreviventes guardam memorias do reino.',
    floresta: 'Floresta de Mirval — Arvores carbonizadas pelo sopro de Valdrak. Elfos se escondem.',
    ruinas:   'Ruinas de Valdor — A capital destruida. Segredos enterrados sob cinzas.',
    pantano:  'Pantano de Sombra — Aguas negras. A Harpa dos Elfos foi vista aqui.',
    montanha: 'Montanhas Eternas — Gelo eterno. A Chama Inversa nasce aqui.',
    castelo:  'Castelo Real — Valdrak dorme aqui novamente, aguardando o confronto final.'
  }
};

/* ---- HEROIS ---- */
const HERO_DATA = {
  harley: {
    id:'harley', name:'Harley', token:'H', cls:'Maga Arcana',
    lore:'"Seus olhos violeta leram o Grimorio antes de Aldric. Ela sabe o que ele nao sabia."',
    story:'Harley foi a primeira a sentir Valdrak despertar — uma dor arcana que a derrubou no meio de um ritual. Ela conhece fragmentos do Grimorio de memoria e sabe que a solucao esta espalhada pelo reino. E a unica que pode ler o Grimorio completo sem enlouquecer.',
    tags:['Maga','Investigadora','Dano Arcano'],
    hp:80, maxHp:80, mp:100, maxMp:100, atk:18, def:8, xp:0, level:1,
    ability:'Arcane Orb', abDesc:'Projétil arcano que ignora armadura.', abDmg:32, abCost:25,
    color:'#b06aff'
  },
  morgan: {
    id:'morgan', name:'Morgan', token:'M', cls:'Guerreira de Ferro',
    lore:'"Ela viu sua guarda ser queimada viva. Nao ha nada que Valdrak possa fazer que ela ja nao tenha visto."',
    story:'Morgan era capitao da Guarda Real quando Valdrak destruiu o castelo. Ela carrega a culpa de ter sobrevivido. Cada batalha e uma penitencia. Cada inimigo derrotado e um passo em direcao a redencao.',
    tags:['Guerreira','Tanque','Alto HP'],
    hp:130, maxHp:130, mp:40, maxMp:40, atk:22, def:18, xp:0, level:1,
    ability:'Golpe Devastador', abDesc:'Ignora completamente a defesa inimiga.', abDmg:42, abCost:0,
    color:'#e74c3c'
  },
  lyria: {
    id:'lyria', name:'Lyria', token:'L', cls:'Exploradora das Sombras',
    lore:'"Ela mapeou cada rota de fuga do reino. Conhece segredos que nem o rei sabia."',
    story:'Lyria e uma espia que trabalhou para o Rei Aldric. Ela sabia do Grimorio antes do ritual — foi ela quem o roubou da Academia Arcana a pedido do rei. A culpa a consome. Ela deve corrigir o que ajudou a criar.',
    tags:['Exploradora','Critico 35%','Furtividade'],
    hp:90, maxHp:90, mp:60, maxMp:60, atk:20, def:12, xp:0, level:1,
    ability:'Golpe Sombrio', abDesc:'35% chance de critico (1.5x dano).', abDmg:36, abCost:0,
    color:'#4caf50'
  }
};

/* ---- NOS DO MAPA (SVG 900x680) ---- */
const MAP_NODES = [
  { id:0,  x:450, y:620, type:'start',    region:'elden',    name:'Vila de Elden',       desc:'Ponto de partida. Sobreviventes rezam.',        difficulty:0, clue:-1 },
  { id:1,  x:320, y:560, type:'normal',   region:'elden',    name:'Estrada das Cinzas',  desc:'Pegadas de dragao marcam o caminho.',           difficulty:1, clue:-1 },
  { id:2,  x:200, y:510, type:'battle',   region:'elden',    name:'Portao Destruido',    desc:'Goblins corrompidos pelo fogo de Valdrak.',     difficulty:1, clue:-1 },
  { id:3,  x:130, y:440, type:'clue',     region:'floresta', name:'Arvore dos Elfos',    desc:'Um elfo moribundo segura um fragmento.',        difficulty:2, clue:0  },
  { id:4,  x:80,  y:370, type:'battle',   region:'floresta', name:'Floresta Carbonizada',desc:'Esqueletos de elfos animados por magia negra.',  difficulty:2, clue:-1 },
  { id:5,  x:60,  y:290, type:'trap',     region:'floresta', name:'Armadilha Rúnica',    desc:'Runas de fogo deixadas por Valdrak.',           difficulty:2, clue:-1 },
  { id:6,  x:90,  y:210, type:'heal',     region:'floresta', name:'Fonte Élfica',        desc:'Agua purificada por magia élfica antiga.',      difficulty:2, clue:-1 },
  { id:7,  x:170, y:150, type:'clue',     region:'ruinas',   name:'Biblioteca Destruida',desc:'Paginas do Grimorio entre as cinzas.',          difficulty:3, clue:1  },
  { id:8,  x:270, y:100, type:'battle',   region:'ruinas',   name:'Ruinas de Valdor',    desc:'Orcs e um Necromante guardam os segredos.',     difficulty:3, clue:-1 },
  { id:9,  x:380, y:70,  type:'treasure', region:'ruinas',   name:'Cripta do Rei Aldric',desc:'Tesouros e armaduras do rei destruido.',        difficulty:3, clue:-1 },
  { id:10, x:500, y:80,  type:'battle',   region:'ruinas',   name:'Torre do Mago',       desc:'O assistente de Aldric virou um Lich.',         difficulty:3, clue:-1 },
  { id:11, x:610, y:120, type:'clue',     region:'pantano',  name:'Ilha da Harpa',       desc:'A Harpa dos Elfos — Fragmento III encontrado.', difficulty:4, clue:2  },
  { id:12, x:700, y:180, type:'battle',   region:'pantano',  name:'Pantano de Sombra',   desc:'Troll das Sombras e Almas Perdidas.',           difficulty:4, clue:-1 },
  { id:13, x:760, y:270, type:'trap',     region:'pantano',  name:'Aguas Negras',        desc:'O pantano engole os desavisados.',              difficulty:4, clue:-1 },
  { id:14, x:780, y:370, type:'heal',     region:'pantano',  name:'Altar Submerso',      desc:'Um altar antigo ainda emana cura.',             difficulty:4, clue:-1 },
  { id:15, x:740, y:460, type:'clue',     region:'montanha', name:'Caverna do Gelo',     desc:'Cristais de gelo guardam o Fragmento IV.',     difficulty:5, clue:3  },
  { id:16, x:660, y:530, type:'battle',   region:'montanha', name:'Pico Eterno',         desc:'Gigante de Gelo e Grifo das Neves.',            difficulty:5, clue:-1 },
  { id:17, x:570, y:570, type:'treasure', region:'montanha', name:'Forja dos Anoes',     desc:'Armas forjadas para matar dragoes.',            difficulty:5, clue:-1 },
  { id:18, x:490, y:500, type:'clue',     region:'castelo',  name:'Salao dos Guardioes', desc:'Descendentes dos Tres Guardioes. Fragmento V.', difficulty:6, clue:4  },
  { id:19, x:470, y:420, type:'battle',   region:'castelo',  name:'Muralha do Castelo',  desc:'Cavaleiros corrompidos pelo fogo de Valdrak.',  difficulty:6, clue:-1 },
  { id:20, x:450, y:340, type:'boss',     region:'castelo',  name:'Trono de Valdrak',    desc:'O Dragao Ancestral aguarda. O confronto final.',difficulty:6, clue:-1 }
];

const TOTAL_CELLS = MAP_NODES.length;

const MAP_PATHS = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],
  [10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[19,20]
];

/* regioes */
const REGION_COLORS = {
  elden:    { fill:'rgba(76,175,80,0.10)',   stroke:'rgba(76,175,80,0.35)',   label:'#4caf50',  name:'Vila de Elden' },
  floresta: { fill:'rgba(27,94,32,0.13)',    stroke:'rgba(27,94,32,0.45)',    label:'#2e7d32',  name:'Floresta de Mirval' },
  ruinas:   { fill:'rgba(196,135,74,0.10)',  stroke:'rgba(196,135,74,0.35)', label:'#c4874a',  name:'Ruinas de Valdor' },
  pantano:  { fill:'rgba(41,98,180,0.10)',   stroke:'rgba(41,98,180,0.35)',  label:'#5c9aff',  name:'Pantano de Sombra' },
  montanha: { fill:'rgba(180,200,220,0.08)', stroke:'rgba(180,200,220,0.3)', label:'#b0c8dc',  name:'Montanhas Eternas' },
  castelo:  { fill:'rgba(139,63,200,0.13)',  stroke:'rgba(139,63,200,0.45)', label:'#b06aff',  name:'Castelo Real' }
};

/* dificuldade: estrelas e cor */
const DIFF_STYLE = [
  { stars:0, color:'#4caf50', label:'Seguro' },
  { stars:1, color:'#8bc34a', label:'Facil' },
  { stars:2, color:'#ffc107', label:'Medio' },
  { stars:3, color:'#ff9800', label:'Dificil' },
  { stars:4, color:'#f44336', label:'Perigoso' },
  { stars:5, color:'#e91e63', label:'Mortal' },
  { stars:6, color:'#9c27b0', label:'Lendario' }
];

const NODE_STYLE = {
  start:    { fill:'#1a3a1a', stroke:'#4caf50',  r:14, symbol:'S' },
  normal:   { fill:'#1e1028', stroke:'rgba(176,106,255,0.3)', r:9, symbol:'' },
  battle:   { fill:'#3a0a0a', stroke:'#e74c3c',  r:12, symbol:'!' },
  treasure: { fill:'#3a2a00', stroke:'#ffd700',  r:12, symbol:'T' },
  heal:     { fill:'#0a2a0a', stroke:'#4caf50',  r:12, symbol:'+' },
  trap:     { fill:'#0a1a3a', stroke:'#5c9aff',  r:12, symbol:'X' },
  clue:     { fill:'#2a1a00', stroke:'#ffc107',  r:13, symbol:'?' },
  boss:     { fill:'#1a0030', stroke:'#ff4444',  r:18, symbol:'D' }
};

/* ---- INIMIGOS por regiao e dificuldade ---- */
function spawnEnemy(nodeId) {
  const node = MAP_NODES[nodeId];
  const pools = {
    elden:    [{ name:'Goblin Corrompido',   hp:30,  maxHp:30,  atk:8,  def:3,  xp:25 },
               { name:'Cao de Fogo',         hp:25,  maxHp:25,  atk:10, def:2,  xp:20 }],
    floresta: [{ name:'Esqueleto Elfico',    hp:45,  maxHp:45,  atk:12, def:5,  xp:40 },
               { name:'Espectro Carbonizado',hp:38,  maxHp:38,  atk:14, def:4,  xp:35 }],
    ruinas:   [{ name:'Orc Saqueador',       hp:65,  maxHp:65,  atk:15, def:9,  xp:55 },
               { name:'Lich Assistente',     hp:50,  maxHp:50,  atk:18, def:7,  xp:60 }],
    pantano:  [{ name:'Troll das Sombras',   hp:80,  maxHp:80,  atk:17, def:12, xp:70 },
               { name:'Alma Perdida',        hp:55,  maxHp:55,  atk:20, def:8,  xp:65 }],
    montanha: [{ name:'Gigante de Gelo',     hp:95,  maxHp:95,  atk:18, def:15, xp:85 },
               { name:'Grifo das Neves',     hp:85,  maxHp:85,  atk:21, def:13, xp:80 }],
    castelo:  [{ name:'Cavaleiro Corrompido',hp:90,  maxHp:90,  atk:22, def:16, xp:90 },
               { name:'Guardiao de Valdrak', hp:110, maxHp:110, atk:24, def:18, xp:100}]
  };
  const pool = pools[node.region] || pools.elden;
  return JSON.parse(JSON.stringify(pool[Math.floor(Math.random() * pool.length)]));
}

/* boss Valdrak — 3 fases */
function spawnValdrak(cluesFound) {
  const bonus = cluesFound * 15;
  return {
    name:'VALDRAK, O DRAGAO ANCESTRAL',
    phase:1, maxPhase:3,
    hp:200 - bonus, maxHp:200 - bonus,
    atk:28, def:20, xp:500,
    weakened: cluesFound >= 4,
    desc: cluesFound >= 4
      ? 'Valdrak esta enfraquecido pelas pistas que voce coletou!'
      : 'Valdrak esta em pleno poder. A batalha sera brutal.'
  };
}

/* ---- TESOUROS ---- */
const TREASURE_POOL = [
  { name:'Pocao de Vida',      effect:'hp',  value:40, desc:'Restaura 40 HP.' },
  { name:'Elixir de Mana',     effect:'mp',  value:35, desc:'Restaura 35 MP.' },
  { name:'Escudo de Valdor',   effect:'def', value:4,  desc:'+4 DEF permanente.' },
  { name:'Lâmina Rúnica',      effect:'atk', value:3,  desc:'+3 ATK permanente.' },
  { name:'Grimorio Parcial',   effect:'xp',  value:80, desc:'+80 XP.' },
  { name:'Armadura do Dragao', effect:'def', value:6,  desc:'+6 DEF permanente.' }
];

/* ---- NARRACAO ---- */
const MASTER_LINES = {
  start:    h => `Bem-vindo a Valdoria em chamas, ${h}. Valdrak, o Dragao Ancestral, foi despertado pelo Rei Aldric e agora queima o reino sistematicamente. Sua missao: coletar os 5 Fragmentos do Grimorio espalhados pelo mapa e usar o conhecimento para selar o dragao. Role o dado D20 e inicie sua investigacao.`,
  move:     (h,n,node) => `${h} avanca ${n} passo${n>1?'s':''} e chega a ${node.name}. ${node.desc}`,
  clue:     (h,c,i) => `PISTA ENCONTRADA! ${h} descobre o Fragmento ${i+1} do Grimorio: "${c}" Este conhecimento e vital para enfrentar Valdrak.`,
  normal:   h => `${h} atravessa o caminho. As marcas de garras de dragao no chao sao recentes. Valdrak passou por aqui.`,
  battle:   (h,e,region) => `Em ${region}, ${h} e atacado por ${e}! Uma criatura corrompida pelo fogo de Valdrak. Lute ou fuja!`,
  boss:     (h,clues) => clues >= 4
    ? `${h} enfrenta VALDRAK! Com ${clues} fragmentos do Grimorio, voce conhece suas fraquezas. O dragao esta enfraquecido — mas ainda e mortal!`
    : `${h} enfrenta VALDRAK sem conhecimento suficiente! Apenas ${clues} de 5 fragmentos coletados. Esta batalha sera quase impossivel!`,
  treasure: (h,node) => `${h} encontra ${node.name}! Um tesouro entre as ruinas do reino destruido.`,
  heal:     (h,v,node) => `${h} encontra ${node.name}. Magia antiga restaura ${v} HP. Continue — Valdrak nao espera.`,
  trap:     (h,v,node) => `ARMADILHA! ${node.name} — fogo residual de Valdrak. ${h} sofre ${v} de dano.`,
  attack:   (h,e,d,roll) => roll===20 ? `CRITICO LENDARIO! (d20=20) ${h} desfere um golpe perfeito em ${e}, causando ${d} de dano! Os deuses da guerra testemunham!` : roll===1 ? `FALHA CRITICA! (d20=1) ${h} tropeça e se machuca. O inimigo aproveita!` : `${h} ataca ${e} — ${d} de dano. (d20=${roll})`,
  miss:     h => `${h} erra o ataque! A lamina corta o ar. Concentre-se.`,
  ability:  (h,ab,d) => `${h} desencadeia ${ab}! ${d} de dano devastador!`,
  enemyAtk: (e,h,d) => `${e} ataca ${h} com furia, causando ${d} de dano!`,
  bossAtk:  (h,d,phase) => phase===3 ? `VALDRAK SOPRA FOGO NEGRO! ${h} sofre ${d} de dano catastrofico! O dragao esta em furia total!` : `Valdrak ataca ${h} com suas garras, causando ${d} de dano!`,
  victory:  (h,e) => `${h} derrota ${e}! A criatura se dissolve. O caminho continua.`,
  bossWin:  h => `${h} SELOU VALDRAK! Com o conhecimento do Grimorio, o feitico de selamento foi pronunciado. O dragao rugiu pela ultima vez e afundou de volta ao sono eterno. Valdoria esta salva! As cronicas cantarao seu nome por mil anos!`,
  flee_ok:  h => `${h} recua com agilidade. Sabedoria supera bravura.`,
  flee_fail:h => `A fuga falha! ${h} nao consegue escapar. O inimigo bloqueia o caminho.`,
  levelup:  (h,lv) => `NIVEL ${lv}! ${h} sente o poder de Valdoria fluir por suas veias! Atributos aumentaram.`,
  dead:     h => `${h} cai em batalha. Valdrak continua queimando o reino. Que os deuses acolham sua alma.`,
  turn:     h => `Vez de ${h}. Role o D20 e escreva seu capitulo nesta saga.`,
  region:   (h,r) => `${h} entra em ${LORE.regions[r] || r}.`
};

/* ============================================
   SELECT
   ============================================ */
const Select = {
  chosen: null,
  pick(id) {
    this.chosen = id;
    document.querySelectorAll('.sel-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('selcard-' + id).classList.add('selected');
    setTimeout(() => this.showSheet(id), 180);
  },
  showSheet(id) {
    const h = HERO_DATA[id];
    document.getElementById('sheet-token').textContent = h.token;
    document.getElementById('sheet-name').textContent  = h.name;
    document.getElementById('sheet-class').textContent = h.cls;
    document.getElementById('sheet-lore').textContent  = h.lore;
    document.getElementById('sheet-story').textContent = h.story;
    document.getElementById('sheet-tags').innerHTML = h.tags.map(t => `<span class="sc-tag">${t}</span>`).join('');
    const attrs = [
      { lbl:'HP', val:h.hp, max:130, color:'var(--red2)' },
      { lbl:'MP', val:h.mp, max:100, color:'var(--purple2)' },
      { lbl:'ATK',val:h.atk,max:22,  color:'var(--bronze2)' },
      { lbl:'DEF',val:h.def,max:18,  color:'#4caf50' }
    ];
    document.getElementById('sheet-attrs').innerHTML = attrs.map(a =>
      `<div class="sheet-attr-row"><span>${a.lbl}</span><div class="sheet-attr-bar"><div class="sheet-attr-fill" style="width:${Math.round(a.val/a.max*100)}%;background:${a.color}"></div></div><span>${a.val}</span></div>`
    ).join('');
    document.getElementById('sheet-ability').innerHTML =
      `<strong>${h.ability}</strong> — ${h.abDesc}` +
      (h.abCost > 0 ? ` <em style="color:var(--text3)">(Custo: ${h.abCost} MP)</em>` : ' <em style="color:var(--text3)">(Sem custo)</em>');
    showScreen('sheet');
  },
  backToSelect() { showScreen('select'); },
  goTutorial()   { Tutorial.start(); },
  startGame()    { if (this.chosen) Joga.startWithHero(this.chosen); }
};

/* ============================================
   TUTORIAL
   ============================================ */
const TUTORIAL_STEPS = [
  { text:`Bem-vindo a <strong>Valdoria em Chamas</strong>! Sou o <strong>Mestre Valdris</strong>. O Dragao Ancestral <strong>VALDRAK</strong> foi despertado pelo Rei Aldric III ao abrir o Grimorio Proibido. Agora ele queima o reino regiao por regiao. Voce deve investigar, coletar pistas e encontrar o feitico para sela-lo.` },
  { text:`O mapa de Valdoria tem <strong>6 regioes</strong> com dificuldade crescente: Vila de Elden (facil) ate o Castelo Real (lendario). Cada regiao tem inimigos mais fortes. Nos marcados com <strong>estrelas vermelhas</strong> indicam o nivel de perigo. Planeje sua rota com cuidado.` },
  { text:`Role o <strong>dado D20</strong> a cada turno. Resultados altos sao melhores em combate. <strong>20 = Critico Lendario</strong> (dano dobrado). <strong>1 = Falha Critica</strong> (voce se machuca). O D20 tambem determina quantos passos voce avanca no mapa (1 a 6 passos).` },
  { text:`Nos do mapa tem tipos: <strong>Pista (amarelo)</strong> — fragmento do Grimorio sobre Valdrak. <strong>Batalha (vermelho)</strong> — combate obrigatorio. <strong>Tesouro (dourado)</strong> — itens. <strong>Cura (verde)</strong> — recupera HP. <strong>Armadilha (azul)</strong> — dano. <strong>Dragao (roxo)</strong> — boss final!` },
  { text:`Colete os <strong>5 Fragmentos do Grimorio</strong> espalhados pelo mapa. Cada fragmento revela uma fraqueza de Valdrak e <strong>reduz seu HP no confronto final</strong>. Com 4+ fragmentos, Valdrak fica enfraquecido. Com menos de 4, a batalha final e quase impossivel.` },
  { text:`No <strong>confronto final</strong>, Valdrak tem <strong>3 fases</strong>. Cada fase ele fica mais furioso. Use sua habilidade especial nos momentos certos. <strong>Harley</strong> e a unica que pode pronunciar o feitico de selamento — mas qualquer heroi pode chegar la. Boa sorte, aventureiro.` }
];

const Tutorial = {
  step: 0,
  start() { this.step = 0; showScreen('tutorial'); this.render(); },
  render() {
    const s = TUTORIAL_STEPS[this.step];
    const total = TUTORIAL_STEPS.length;
    document.getElementById('tut-text').innerHTML = s.text;
    document.getElementById('tut-step-label').textContent = (this.step+1) + ' / ' + total;
    document.getElementById('tut-step-fill').style.width = ((this.step+1)/total*100) + '%';
    document.getElementById('tut-prev').style.opacity = this.step === 0 ? '0.3' : '1';
    document.getElementById('tut-next').textContent = this.step === total-1 ? 'Iniciar Aventura' : 'Proximo';
  },
  next() { this.step < TUTORIAL_STEPS.length-1 ? (this.step++, this.render()) : Select.startGame(); },
  prev() { if (this.step > 0) { this.step--; this.render(); } },
  skip() { Select.startGame(); }
};

/* ============================================
   JOGA — logica principal
   ============================================ */
const Joga = {
  state: null,
  inCombat: false,
  combatEnemy: null,
  _typeTimer: null,

  startWithHero(heroId) {
    showScreen('game');
    setTimeout(() => {
      this.state = this._fresh(heroId);
      this.renderMap();
      this.renderHeroes();
      this.updateBanner();
      this._renderCluesBox();
      this.master(MASTER_LINES.start(HERO_DATA[heroId].name));
      this.log('Aventura iniciada com ' + HERO_DATA[heroId].name + '.', 'hi');
    }, 60);
  },

  _fresh(heroId) {
    return {
      hero: JSON.parse(JSON.stringify(HERO_DATA[heroId])),
      pos: 0,
      round: 1,
      rolled: false,
      clues: [],
      visitedRegions: new Set(['elden']),
      stats: { battles:0, treasures:0, heals:0, traps:0, kills:0, cluesFound:0 }
    };
  },

  /* ---- SVG MAP 900x680 ---- */
  renderMap() {
    const wrap = document.getElementById('ludo-board');
    const W = wrap.offsetWidth  || 700;
    const H = wrap.offsetHeight || 560;

    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 900 680');
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    svg.id = 'map-svg';

    /* defs */
    svg.innerHTML = `<defs>
      <radialGradient id="bgG" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1a0830"/>
        <stop offset="100%" stop-color="#04020a"/>
      </radialGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="glowS"><feGaussianBlur stdDeviation="7" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="glowR"><feGaussianBlur stdDeviation="12" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="900" height="680" fill="url(#bgG)" rx="14"/>`;

    /* grade sutil */
    const grid = document.createElementNS('http://www.w3.org/2000/svg','g');
    grid.setAttribute('opacity','0.04');
    for (let x=0;x<=900;x+=45){const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',x);l.setAttribute('y1',0);l.setAttribute('x2',x);l.setAttribute('y2',680);l.setAttribute('stroke','#b06aff');l.setAttribute('stroke-width','0.5');grid.appendChild(l);}
    for (let y=0;y<=680;y+=45){const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',0);l.setAttribute('y1',y);l.setAttribute('x2',900);l.setAttribute('y2',y);l.setAttribute('stroke','#b06aff');l.setAttribute('stroke-width','0.5');grid.appendChild(l);}
    svg.appendChild(grid);

    /* regioes — blobs de fundo */
    const regionBlobs = {
      elden:    { cx:350, cy:590, rx:160, ry:70 },
      floresta: { cx:100, cy:330, rx:110, ry:200 },
      ruinas:   { cx:370, cy:110, rx:200, ry:90 },
      pantano:  { cx:700, cy:230, rx:120, ry:160 },
      montanha: { cx:680, cy:500, rx:130, ry:110 },
      castelo:  { cx:480, cy:440, rx:100, ry:120 }
    };
    Object.entries(regionBlobs).forEach(([k,b]) => {
      const rc = REGION_COLORS[k];
      const el = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
      el.setAttribute('cx',b.cx); el.setAttribute('cy',b.cy);
      el.setAttribute('rx',b.rx); el.setAttribute('ry',b.ry);
      el.setAttribute('fill',rc.fill); el.setAttribute('stroke',rc.stroke);
      el.setAttribute('stroke-width','1'); el.setAttribute('opacity','0.9');
      svg.appendChild(el);
      /* label da regiao */
      const lt = document.createElementNS('http://www.w3.org/2000/svg','text');
      lt.setAttribute('x',b.cx); lt.setAttribute('y',b.cy - b.ry + 14);
      lt.setAttribute('text-anchor','middle');
      lt.setAttribute('font-family','Cinzel,serif');
      lt.setAttribute('font-size','8');
      lt.setAttribute('fill',rc.label);
      lt.setAttribute('opacity','0.7');
      lt.textContent = rc.name;
      svg.appendChild(lt);
    });

    /* dragao decorativo no castelo */
    const dragonG = document.createElementNS('http://www.w3.org/2000/svg','g');
    dragonG.setAttribute('opacity','0.18');
    dragonG.setAttribute('filter','url(#glow)');
    const dragonTxt = document.createElementNS('http://www.w3.org/2000/svg','text');
    dragonTxt.setAttribute('x','450'); dragonTxt.setAttribute('y','310');
    dragonTxt.setAttribute('text-anchor','middle');
    dragonTxt.setAttribute('font-size','80');
    dragonTxt.setAttribute('fill','#ff4444');
    dragonTxt.textContent = '🐉';
    const animDragon = document.createElementNS('http://www.w3.org/2000/svg','animate');
    animDragon.setAttribute('attributeName','opacity');
    animDragon.setAttribute('values','0.12;0.25;0.12');
    animDragon.setAttribute('dur','4s'); animDragon.setAttribute('repeatCount','indefinite');
    dragonG.appendChild(dragonTxt);
    dragonG.appendChild(animDragon);
    svg.appendChild(dragonG);

    /* caminhos */
    MAP_PATHS.forEach(([a,b]) => {
      const na = MAP_NODES[a], nb = MAP_NODES[b];
      const visited = this.state.pos > Math.max(a,b);
      const path = document.createElementNS('http://www.w3.org/2000/svg','line');
      path.setAttribute('x1',na.x); path.setAttribute('y1',na.y);
      path.setAttribute('x2',nb.x); path.setAttribute('y2',nb.y);
      path.setAttribute('stroke', visited ? 'rgba(176,106,255,0.7)' : 'rgba(176,106,255,0.15)');
      path.setAttribute('stroke-width', visited ? '2.5' : '1.5');
      path.setAttribute('stroke-dasharray', visited ? 'none' : '6 4');
      if (!visited) {
        const anim = document.createElementNS('http://www.w3.org/2000/svg','animate');
        anim.setAttribute('attributeName','stroke-dashoffset');
        anim.setAttribute('from','0'); anim.setAttribute('to','20');
        anim.setAttribute('dur','2s'); anim.setAttribute('repeatCount','indefinite');
        path.appendChild(anim);
      }
      svg.appendChild(path);
    });

    /* nos */
    MAP_NODES.forEach((node, i) => {
      const st = NODE_STYLE[node.type];
      const isCurrent = this.state.pos === i;
      const isVisited = this.state.pos > i;
      const isFog     = i > this.state.pos + 4;
      const diff      = DIFF_STYLE[node.difficulty] || DIFF_STYLE[0];

      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('id','node-'+i);

      /* anel pulsante no atual */
      if (isCurrent) {
        const ring = document.createElementNS('http://www.w3.org/2000/svg','circle');
        ring.setAttribute('cx',node.x); ring.setAttribute('cy',node.y);
        ring.setAttribute('r', st.r + 8);
        ring.setAttribute('fill','none');
        ring.setAttribute('stroke','#b06aff');
        ring.setAttribute('stroke-width','2');
        const a1 = document.createElementNS('http://www.w3.org/2000/svg','animate');
        a1.setAttribute('attributeName','r'); a1.setAttribute('values',(st.r+6)+';'+(st.r+12)+';'+(st.r+6));
        a1.setAttribute('dur','2s'); a1.setAttribute('repeatCount','indefinite');
        const a2 = document.createElementNS('http://www.w3.org/2000/svg','animate');
        a2.setAttribute('attributeName','opacity'); a2.setAttribute('values','1;0.3;1');
        a2.setAttribute('dur','2s'); a2.setAttribute('repeatCount','indefinite');
        ring.appendChild(a1); ring.appendChild(a2);
        g.appendChild(ring);
      }

      /* circulo principal */
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx',node.x); circle.setAttribute('cy',node.y);
      circle.setAttribute('r', st.r);
      circle.setAttribute('fill', isFog ? '#0a0510' : (isVisited ? 'rgba(139,63,200,0.25)' : st.fill));
      circle.setAttribute('stroke', isFog ? 'rgba(80,60,100,0.3)' : (isCurrent ? '#fff' : st.stroke));
      circle.setAttribute('stroke-width', isCurrent ? '2.5' : '1.5');
      if (isCurrent) circle.setAttribute('filter','url(#glowS)');
      else if (node.type === 'boss') circle.setAttribute('filter','url(#glowR)');
      g.appendChild(circle);

      /* simbolo */
      if (!isFog) {
        const sym = st.symbol || (isVisited ? 'v' : '');
        if (sym) {
          const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
          txt.setAttribute('x',node.x); txt.setAttribute('y',node.y+4);
          txt.setAttribute('text-anchor','middle');
          txt.setAttribute('font-family','Cinzel,serif');
          txt.setAttribute('font-size', node.type==='boss' ? '11' : '8');
          txt.setAttribute('font-weight','900');
          txt.setAttribute('fill', isCurrent ? '#fff' : st.stroke);
          txt.textContent = node.type==='boss' ? 'D' : sym;
          g.appendChild(txt);
        }
      }

      /* indicador de dificuldade — estrelas */
      if (!isFog && node.difficulty > 0 && node.type !== 'start') {
        const stars = Math.min(node.difficulty, 3);
        for (let s=0; s<stars; s++) {
          const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
          dot.setAttribute('cx', node.x - (stars-1)*4 + s*8);
          dot.setAttribute('cy', node.y - st.r - 5);
          dot.setAttribute('r','2.5');
          dot.setAttribute('fill', diff.color);
          dot.setAttribute('opacity','0.9');
          g.appendChild(dot);
        }
      }

      /* token do heroi */
      if (isCurrent) {
        const hc = document.createElementNS('http://www.w3.org/2000/svg','circle');
        hc.setAttribute('cx',node.x); hc.setAttribute('cy',node.y - st.r - 12);
        hc.setAttribute('r','9');
        hc.setAttribute('fill', this.state.hero.color || '#b06aff');
        hc.setAttribute('stroke','#fff'); hc.setAttribute('stroke-width','1.5');
        hc.setAttribute('filter','url(#glowS)');
        const ay = document.createElementNS('http://www.w3.org/2000/svg','animate');
        ay.setAttribute('attributeName','cy');
        ay.setAttribute('values',(node.y-st.r-12)+';'+(node.y-st.r-18)+';'+(node.y-st.r-12));
        ay.setAttribute('dur','1.8s'); ay.setAttribute('repeatCount','indefinite');
        hc.appendChild(ay);
        g.appendChild(hc);
        const ht = document.createElementNS('http://www.w3.org/2000/svg','text');
        ht.setAttribute('x',node.x); ht.setAttribute('y',node.y - st.r - 8);
        ht.setAttribute('text-anchor','middle');
        ht.setAttribute('font-family','Cinzel,serif');
        ht.setAttribute('font-size','8'); ht.setAttribute('font-weight','900');
        ht.setAttribute('fill','#fff');
        ht.textContent = this.state.hero.token;
        g.appendChild(ht);
      }

      /* label */
      if (!isFog) {
        const lbl = document.createElementNS('http://www.w3.org/2000/svg','text');
        const ly = node.y > 400 ? node.y + st.r + 13 : node.y - st.r - 8;
        lbl.setAttribute('x',node.x); lbl.setAttribute('y',ly);
        lbl.setAttribute('text-anchor','middle');
        lbl.setAttribute('font-family','Cinzel,serif');
        lbl.setAttribute('font-size', isCurrent ? '8' : '6.5');
        lbl.setAttribute('fill', isCurrent ? '#e8d5b0' : 'rgba(176,106,255,0.5)');
        lbl.setAttribute('font-weight', isCurrent ? '700' : '400');
        lbl.textContent = node.name;
        g.appendChild(lbl);
      } else {
        const fog = document.createElementNS('http://www.w3.org/2000/svg','text');
        fog.setAttribute('x',node.x); fog.setAttribute('y',node.y+4);
        fog.setAttribute('text-anchor','middle');
        fog.setAttribute('font-size','9');
        fog.setAttribute('fill','rgba(100,80,130,0.4)');
        fog.textContent = '?';
        g.appendChild(fog);
      }

      svg.appendChild(g);
    });

    /* legenda de dificuldade */
    const legG = document.createElementNS('http://www.w3.org/2000/svg','g');
    const legItems = [
      { color:'#4caf50', label:'Facil' },
      { color:'#ffc107', label:'Medio' },
      { color:'#f44336', label:'Dificil' },
      { color:'#9c27b0', label:'Lendario' }
    ];
    legItems.forEach((li,i) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('cx','12'); dot.setAttribute('cy', 14 + i*16);
      dot.setAttribute('r','4'); dot.setAttribute('fill',li.color);
      legG.appendChild(dot);
      const lt = document.createElementNS('http://www.w3.org/2000/svg','text');
      lt.setAttribute('x','22'); lt.setAttribute('y', 18 + i*16);
      lt.setAttribute('font-size','7'); lt.setAttribute('fill',li.color);
      lt.setAttribute('font-family','Cinzel,serif');
      lt.textContent = li.label;
      legG.appendChild(lt);
    });
    /* pistas coletadas */
    const clueCount = this.state.clues.length;
    const clueT = document.createElementNS('http://www.w3.org/2000/svg','text');
    clueT.setAttribute('x','12'); clueT.setAttribute('y','90');
    clueT.setAttribute('font-size','7'); clueT.setAttribute('fill','#ffc107');
    clueT.setAttribute('font-family','Cinzel,serif');
    clueT.textContent = 'Pistas: ' + clueCount + '/5';
    legG.appendChild(clueT);
    svg.appendChild(legG);

    wrap.innerHTML = '';
    wrap.appendChild(svg);
  },

  renderHeroes() {
    const h = this.state.hero;
    const list = document.getElementById('heroes-list');
    if (!list) return;
    const hpPct = Math.max(0, Math.round(h.hp / h.maxHp * 100));
    const mpPct = Math.max(0, Math.round(h.mp / h.maxMp * 100));
    const xpNext = h.level * 100;
    const xpPct  = Math.min(100, Math.round((h.xp||0) / xpNext * 100));
    const clues  = this.state.clues.length;
    list.innerHTML = `
      <div class="hero-card active-turn">
        <div class="hc-token" style="color:${h.color}">${h.token}</div>
        <div class="hc-info">
          <div class="hc-name">${h.name} <span class="hc-level">Lv.${h.level||1}</span></div>
          <div class="hc-class">${h.cls}</div>
          <div class="hc-bars">
            <div class="hc-bar-row"><span>HP</span><div class="hc-bar"><div class="hc-fill hp-fill" style="width:${hpPct}%"></div></div><span>${h.hp}/${h.maxHp}</span></div>
            <div class="hc-bar-row"><span>MP</span><div class="hc-bar"><div class="hc-fill mp-fill" style="width:${mpPct}%"></div></div><span>${h.mp}/${h.maxMp}</span></div>
          </div>
          <div class="hc-xp-row"><span>XP</span><div class="hc-xp-bar"><div class="hc-xp-fill" style="width:${xpPct}%"></div></div><span>${h.xp||0}/${xpNext}</span></div>
          <div class="hc-clues">Pistas: ${clues}/5 ${'★'.repeat(clues)}${'☆'.repeat(5-clues)}</div>
          <div class="hc-pos">Local: ${MAP_NODES[this.state.pos].name}</div>
        </div>
      </div>`;
    this._updateNavStats();
  },

  updateBanner() {
    const el = document.getElementById('turn-name');
    if (el) el.textContent = this.state.hero.name;
    const rn = document.getElementById('round-num');
    if (rn) rn.textContent = this.state.round;
    this._updateNavStats();
  },

  _updateNavStats() {
    const h = this.state.hero;
    const bar = document.getElementById('joga-nav-stats');
    if (!bar) return;
    bar.classList.remove('hidden');
    document.getElementById('jns-xp').textContent    = h.xp || 0;
    document.getElementById('jns-level').textContent = h.level || 1;
    /* ouro: 10 por kill + 5 por tesouro */
    const gold = (this.state.stats.kills * 10) + (this.state.stats.treasures * 5);
    document.getElementById('jns-gold').textContent  = gold;
  },

  master(msg) {
    const el = document.getElementById('mb-text');
    if (!el) return;
    if (this._typeTimer) clearInterval(this._typeTimer);
    el.classList.remove('typing');
    el.textContent = '';
    el.classList.add('typing');
    let i = 0;
    this._typeTimer = setInterval(() => {
      el.textContent += msg[i++];
      if (i >= msg.length) {
        clearInterval(this._typeTimer);
        this._typeTimer = null;
        setTimeout(() => el.classList.remove('typing'), 3000);
      }
    }, 16);
  },

  rollDice() {
    const s = this.state;
    if (s.rolled || this.inCombat) return;
    const btn = document.getElementById('btn-roll');
    btn.disabled = true;
    const face = document.getElementById('dice-face');
    face.classList.add('rolling');
    let ticks = 0;
    const iv = setInterval(() => {
      face.textContent = Math.floor(Math.random() * 20) + 1;
      if (++ticks >= 14) {
        clearInterval(iv);
        face.classList.remove('rolling');
        const roll = Math.floor(Math.random() * 20) + 1;
        face.textContent = roll;
        /* D20: 1-6 = 1 passo, 7-12 = 2, 13-17 = 3, 18-19 = 4, 20 = 5 */
        const steps = roll <= 6 ? 1 : roll <= 12 ? 2 : roll <= 17 ? 3 : roll <= 19 ? 4 : 5;
        document.getElementById('dice-msg').textContent = s.hero.name + ' tirou ' + roll + '! (' + steps + ' passos)';
        this.moveHero(steps, roll);
      }
    }, 70);
  },

  moveHero(steps, diceRoll) {
    const s = this.state;
    const newPos = Math.min(s.pos + steps, TOTAL_CELLS - 1);
    s.pos = newPos;
    s.rolled = true;
    const node = MAP_NODES[newPos];
    if (!s.visitedRegions.has(node.region)) {
      s.visitedRegions.add(node.region);
      setTimeout(() => this.master(MASTER_LINES.region(s.hero.name, node.region)), 700);
    } else {
      this.master(MASTER_LINES.move(s.hero.name, steps, node));
    }
    this.log(s.hero.name + ' avancou ' + steps + ' passos para ' + node.name, 'hi');
    this.renderMap();
    this.renderHeroes();
    setTimeout(() => this.showActionPanel(newPos), 700);
  },

  showActionPanel(pos) {
    const node = MAP_NODES[pos];
    const h = this.state.hero;
    const ap = document.getElementById('action-panel');
    const apInfo = document.getElementById('ap-node-info');
    const apBtns = document.getElementById('ap-btns');

    /* esconde outros paineis */
    document.getElementById('combat-panel').classList.add('hidden');
    document.getElementById('treasure-panel').classList.add('hidden');
    ap.classList.remove('hidden');

    apInfo.innerHTML = `<strong style="color:var(--purple2)">${node.name}</strong><br>${node.desc}`;

    const diff = DIFF_STYLE[node.difficulty] || DIFF_STYLE[0];
    const diffStars = node.difficulty > 0 ? ' &nbsp;<span style="color:' + diff.color + ';font-size:0.6rem">' + '★'.repeat(Math.min(node.difficulty,3)) + ' ' + diff.label + '</span>' : '';

    let btns = '';

    if (node.type === 'boss') {
      btns = `<button class="ap-btn boss" onclick="Joga._hideActionAndTrigger(${pos})">
        <span class="ap-btn-icon">🐉</span>
        <span class="ap-btn-label">Enfrentar VALDRAK<span class="ap-btn-sub">Confronto final — sem volta</span></span>
      </button>`;
    } else if (node.type === 'battle') {
      btns = `<button class="ap-btn battle" onclick="Joga._hideActionAndTrigger(${pos})">
        <span class="ap-btn-icon">⚔</span>
        <span class="ap-btn-label">Entrar em Combate${diffStars}<span class="ap-btn-sub">Lute contra o inimigo desta regiao</span></span>
      </button>
      <button class="ap-btn normal" onclick="Joga._trySneak(${pos})">
        <span class="ap-btn-icon">👁</span>
        <span class="ap-btn-label">Tentar Passar Furtivamente<span class="ap-btn-sub">40% de chance — falha inicia combate</span></span>
      </button>`;
    } else if (node.type === 'clue') {
      const alreadyHas = this.state.clues.includes(node.clue);
      btns = `<button class="ap-btn clue" onclick="Joga._hideActionAndTrigger(${pos})">
        <span class="ap-btn-icon">📜</span>
        <span class="ap-btn-label">${alreadyHas ? 'Reler Fragmento (ja coletado)' : 'Investigar e Coletar Fragmento'}<span class="ap-btn-sub">${alreadyHas ? 'Voce ja tem esta pista' : 'Fragmento do Grimorio — enfraquece Valdrak'}</span></span>
      </button>
      <button class="ap-btn normal" onclick="Joga._skipNode()">
        <span class="ap-btn-icon">→</span>
        <span class="ap-btn-label">Ignorar e Continuar<span class="ap-btn-sub">Perde a pista, avanca o turno</span></span>
      </button>`;
    } else if (node.type === 'treasure') {
      btns = `<button class="ap-btn treasure" onclick="Joga._hideActionAndTrigger(${pos})">
        <span class="ap-btn-icon">💎</span>
        <span class="ap-btn-label">Abrir Tesouro<span class="ap-btn-sub">Item aleatorio — HP, MP, ATK ou DEF</span></span>
      </button>`;
    } else if (node.type === 'heal') {
      btns = `<button class="ap-btn heal" onclick="Joga._hideActionAndTrigger(${pos})">
        <span class="ap-btn-icon">✦</span>
        <span class="ap-btn-label">Usar Fonte de Cura<span class="ap-btn-sub">Recupera 30% do HP maximo</span></span>
      </button>`;
    } else if (node.type === 'trap') {
      btns = `<button class="ap-btn trap" onclick="Joga._tryDisarmTrap(${pos})">
        <span class="ap-btn-icon">🔍</span>
        <span class="ap-btn-label">Tentar Desarmar Armadilha<span class="ap-btn-sub">50% de chance — falha causa dano duplo</span></span>
      </button>
      <button class="ap-btn normal" onclick="Joga._hideActionAndTrigger(${pos})">
        <span class="ap-btn-icon">→</span>
        <span class="ap-btn-label">Atravessar (sofre dano)<span class="ap-btn-sub">Avanca mas recebe o dano da armadilha</span></span>
      </button>`;
    } else {
      btns = `<button class="ap-btn normal" onclick="Joga._skipNode()">
        <span class="ap-btn-icon">→</span>
        <span class="ap-btn-label">Continuar Caminhando<span class="ap-btn-sub">Nada de especial aqui</span></span>
      </button>`;
    }

    apBtns.innerHTML = btns;
  },

  _hideActionAndTrigger(pos) {
    document.getElementById('action-panel').classList.add('hidden');
    this.triggerCell(pos);
  },

  _skipNode() {
    document.getElementById('action-panel').classList.add('hidden');
    this.endAction();
  },

  _trySneak(pos) {
    document.getElementById('action-panel').classList.add('hidden');
    const h = this.state.hero;
    if (Math.random() < 0.4) {
      this.master(h.name + ' passa furtivamente sem ser notado. Os inimigos nao percebem sua presenca.');
      this.log('Furtividade bem-sucedida!', 'good');
      this.endAction();
    } else {
      this.master(h.name + ' e descoberto! A furtividade falhou — combate inevitavel!');
      this.log('Furtividade falhou! Combate iniciado.', 'warn');
      this.startCombat(pos);
    }
  },

  _tryDisarmTrap(pos) {
    document.getElementById('action-panel').classList.add('hidden');
    const node = MAP_NODES[pos];
    const h = this.state.hero;
    if (Math.random() < 0.5) {
      this.master(h.name + ' desarma a armadilha com precisao. Nenhum dano sofrido!');
      this.log('Armadilha desarmada!', 'good');
      this.endAction();
    } else {
      const v = Math.floor(Math.random() * 25) + 15;
      h.hp = Math.max(0, h.hp - v);
      this.master(MASTER_LINES.trap(h.name, v, node) + ' A tentativa de desarme piorou tudo!');
      this.log('Falhou ao desarmar! -' + v + ' HP', 'warn');
      this.renderHeroes();
      if (h.hp <= 0) { this.showDefeat(); return; }
      this.endAction();
    }
  },

  triggerCell(pos) {
    const node = MAP_NODES[pos];
    const h = this.state.hero;
    if (node.type === 'boss')     { this.startBoss(); return; }
    if (node.type === 'battle')   { this.startCombat(pos); return; }
    if (node.type === 'clue')     { this.collectClue(node); return; }
    if (node.type === 'treasure') { this.openTreasure(node); return; }
    if (node.type === 'heal') {
      const v = Math.floor(h.maxHp * 0.3);
      h.hp = Math.min(h.maxHp, h.hp + v);
      this.state.stats.heals++;
      this.master(MASTER_LINES.heal(h.name, v, node));
      this.log('Recuperou ' + v + ' HP.', 'good');
      this.renderHeroes(); this.endAction(); return;
    }
    if (node.type === 'trap') {
      const v = Math.floor(Math.random() * 20) + 10;
      h.hp = Math.max(0, h.hp - v);
      this.state.stats.traps++;
      this.master(MASTER_LINES.trap(h.name, v, node));
      this.log('Armadilha! -' + v + ' HP', 'warn');
      this.renderHeroes();
      if (h.hp <= 0) { this.showDefeat(); return; }
      this.endAction(); return;
    }
    this.endAction();
  },

  collectClue(node) {
    const s = this.state;
    const clueIdx = node.clue;
    if (clueIdx >= 0 && !s.clues.includes(clueIdx)) {
      s.clues.push(clueIdx);
      s.stats.cluesFound++;
      this.master(MASTER_LINES.clue(s.hero.name, LORE.clues[clueIdx], clueIdx));
      this.log('Fragmento ' + (clueIdx+1) + ' do Grimorio coletado!', 'good');
      /* mostrar pista no painel */
      this.showCluePanel(clueIdx);
    } else {
      this.master(MASTER_LINES.normal(s.hero.name));
      this.endAction();
    }
    this.renderHeroes();
    this.renderMap();
  },

  showCluePanel(clueIdx) {
    document.getElementById('treasure-panel').classList.remove('hidden');
    document.getElementById('combat-panel').classList.add('hidden');
    document.getElementById('tp-title').textContent = 'FRAGMENTO ' + (clueIdx+1) + ' DO GRIMORIO!';
    document.getElementById('tp-content').innerHTML =
      '<div style="font-size:0.82rem;color:#ffc107;line-height:1.6;font-style:italic">' + LORE.clues[clueIdx] + '</div>' +
      '<div style="margin-top:0.5rem;font-size:0.7rem;color:var(--text3)">Pistas coletadas: ' + this.state.clues.length + '/5 — Cada pista enfraquece Valdrak!</div>';
    /* atualiza painel lateral de pistas */
    this._renderCluesBox();
  },

  _renderCluesBox() {
    const box = document.getElementById('clues-box');
    if (!box) return;
    if (this.state.clues.length === 0) {
      box.innerHTML = '<div style="font-size:0.62rem;color:var(--text3);font-style:italic">Nenhuma pista encontrada ainda.</div>';
      return;
    }
    box.innerHTML = this.state.clues.map(i =>
      `<div class="clue-item">F${i+1}: ${LORE.clues[i].substring(0,60)}...</div>`
    ).join('');
  },

  startCombat(pos) {
    this.inCombat = true;
    this.combatEnemy = spawnEnemy(pos);
    this.state.stats.battles++;
    const node = MAP_NODES[pos];
    this.master(MASTER_LINES.battle(this.state.hero.name, this.combatEnemy.name, node.region));
    this.log('Combate: ' + this.state.hero.name + ' vs ' + this.combatEnemy.name, 'warn');
    document.getElementById('action-panel').classList.add('hidden');
    this.renderCombatPanel();
    document.getElementById('btn-roll').disabled = true;
  },

  startBoss() {
    this.inCombat = true;
    const clues = this.state.clues.length;
    this.combatEnemy = spawnValdrak(clues);
    this.state.stats.battles++;
    this.master(MASTER_LINES.boss(this.state.hero.name, clues));
    this.log('CONFRONTO FINAL: ' + this.state.hero.name + ' vs VALDRAK!', 'warn');
    document.getElementById('action-panel').classList.add('hidden');
    this.renderCombatPanel(true);
    document.getElementById('btn-roll').disabled = true;
  },

  renderCombatPanel(isBoss) {
    document.getElementById('treasure-panel').classList.add('hidden');
    document.getElementById('combat-panel').classList.remove('hidden');
    const h = this.state.hero, e = this.combatEnemy;
    const bossInfo = isBoss
      ? `<div style="font-size:0.6rem;color:#ff4444;margin-top:0.2rem">${e.desc}</div>`
      : '';
    document.getElementById('cp-enemy').innerHTML =
      `<div>
        <div class="cp-enemy-name" style="${isBoss?'color:#ff4444;font-size:0.9rem':''}">${e.name}</div>
        <div style="font-size:0.6rem;color:var(--text3)">ATK ${e.atk} · DEF ${e.def} · HP ${e.hp}</div>
        ${bossInfo}
      </div>`;
    this.updateCombatBars();
    const abBtn = document.querySelector('.cp-ability');
    if (abBtn) { abBtn.disabled = h.mp < h.abCost; }
    /* esconder fuga no boss */
    const fleeBtn = document.querySelector('.cp-flee');
    if (fleeBtn) fleeBtn.style.display = isBoss ? 'none' : '';
  },

  updateCombatBars() {
    const h = this.state.hero, e = this.combatEnemy;
    const ehp = Math.max(0, Math.round(e.hp / e.maxHp * 100));
    const hhp = Math.max(0, Math.round(h.hp / h.maxHp * 100));
    document.getElementById('cp-bars').innerHTML =
      `<div class="cp-bar-row"><span>${e.name.split(',')[0]}</span><div class="cp-bar"><div class="cp-bar-fill enemy-hp" style="width:${ehp}%"></div></div><span>${e.hp}/${e.maxHp}</span></div>` +
      `<div class="cp-bar-row"><span>${h.name}</span><div class="cp-bar"><div class="cp-bar-fill hero-hp" style="width:${hhp}%"></div></div><span>${h.hp}/${h.maxHp}</span></div>`;
  },

  combatAction(action) {
    const h = this.state.hero, e = this.combatEnemy;
    const cpLog = document.getElementById('cp-log');
    const isBoss = e.name.includes('VALDRAK');

    if (action === 'flee') {
      if (Math.random() < 0.45) {
        this.state.pos = Math.max(0, this.state.pos - 2);
        this.master(MASTER_LINES.flee_ok(h.name));
        this.log(h.name + ' fugiu. Voltou 2 passos.', 'warn');
        this.endCombat(); return;
      } else {
        this.master(MASTER_LINES.flee_fail(h.name));
        this._enemyAtk(h, e, cpLog, isBoss);
        this.updateCombatBars(); this.renderHeroes();
        if (h.hp <= 0) { this.showDefeat(); } return;
      }
    }

    const roll = Math.floor(Math.random() * 20) + 1;
    let dmg = 0;

    if (action === 'attack') {
      if (roll === 1) {
        /* falha critica: heroi se machuca */
        const selfDmg = Math.floor(Math.random() * 8) + 3;
        h.hp = Math.max(0, h.hp - selfDmg);
        this.master(MASTER_LINES.attack(h.name, e.name, 0, 1));
        cpLog.textContent = 'Falha critica! -' + selfDmg + ' HP proprio.';
        this.log('Falha critica! -' + selfDmg + ' HP', 'warn');
      } else {
        dmg = Math.max(1, h.atk - e.def + Math.floor(roll / 5));
        if (roll === 20) dmg = Math.floor(dmg * 2);
        if (isBoss && e.weakened) dmg = Math.floor(dmg * 1.3);
        e.hp = Math.max(0, e.hp - dmg);
        this.master(MASTER_LINES.attack(h.name, e.name, dmg, roll));
        cpLog.textContent = h.name + ' causou ' + dmg + ' dano (d20=' + roll + ')';
        this.log(dmg + ' dano em ' + e.name, 'hi');
      }
    } else if (action === 'ability') {
      if (h.mp < h.abCost) { cpLog.textContent = 'MP insuficiente!'; return; }
      h.mp = Math.max(0, h.mp - h.abCost);
      dmg = Math.max(1, h.abDmg - Math.floor(e.def * 0.5));
      if (h.id === 'lyria' && Math.random() < 0.35) dmg = Math.floor(dmg * 1.5);
      if (isBoss && e.weakened) dmg = Math.floor(dmg * 1.3);
      e.hp = Math.max(0, e.hp - dmg);
      this.master(MASTER_LINES.ability(h.name, h.ability, dmg));
      cpLog.textContent = h.ability + '! ' + dmg + ' dano!';
      this.log(h.ability + ': ' + dmg + ' dano!', 'hi');
    }

    this.updateCombatBars(); this.renderHeroes();

    /* boss: verificar mudanca de fase */
    if (isBoss) {
      const pct = e.hp / e.maxHp;
      if (e.phase === 1 && pct <= 0.66) { e.phase = 2; e.atk += 4; this.log('VALDRAK FASE 2! Mais furioso!', 'warn'); this.master('VALDRAK ENTRA NA FASE 2! Suas garras ficam mais afiadas e seu fogo mais intenso!'); }
      else if (e.phase === 2 && pct <= 0.33) { e.phase = 3; e.atk += 6; this.log('VALDRAK FASE 3! Furia total!', 'warn'); this.master('VALDRAK FASE 3 — FURIA DO DRAGAO! O castelo treme. Este e o momento decisivo!'); }
    }

    if (e.hp <= 0) {
      const xpGain = e.xp || 50;
      h.xp = (h.xp||0) + xpGain;
      if (isBoss) { this.showVictory(); return; }
      this.master(MASTER_LINES.victory(h.name, e.name));
      this.log(e.name + ' derrotado! +' + xpGain + ' XP', 'good');
      cpLog.textContent += ' — Derrotado! +' + xpGain + ' XP';
      this.state.stats.kills++;
      if (h.xp >= h.level * 100) {
        h.level++; h.xp = 0; h.maxHp += 12; h.hp = Math.min(h.maxHp, h.hp + 12); h.atk += 2; h.def++;
        this.master(MASTER_LINES.levelup(h.name, h.level));
        this.log('NIVEL ' + h.level + '!', 'good');
      }
      this.endCombat(); return;
    }

    setTimeout(() => {
      this._enemyAtk(h, e, cpLog, isBoss);
      this.updateCombatBars(); this.renderHeroes();
      if (h.hp <= 0) this.showDefeat();
    }, 450);
  },

  _enemyAtk(h, e, cpLog, isBoss) {
    const roll = Math.floor(Math.random() * 12) + 1;
    let dmg = Math.max(1, e.atk - h.def + Math.floor(roll / 4));
    if (isBoss && e.phase === 3) dmg = Math.floor(dmg * 1.4);
    h.hp = Math.max(0, h.hp - dmg);
    if (isBoss) this.master(MASTER_LINES.bossAtk(h.name, dmg, e.phase));
    else this.master(MASTER_LINES.enemyAtk(e.name, h.name, dmg));
    if (cpLog) cpLog.textContent = e.name.split(',')[0] + ' causou ' + dmg + ' em ' + h.name;
    this.log(e.name.split(',')[0] + ' causou ' + dmg + ' dano!', 'warn');
  },

  endCombat() {
    this.inCombat = false; this.combatEnemy = null;
    document.getElementById('combat-panel').classList.add('hidden');
    this.renderMap(); this.renderHeroes();
    this.endAction();
  },

  openTreasure(node) {
    const item = TREASURE_POOL[Math.floor(Math.random() * TREASURE_POOL.length)];
    const h = this.state.hero;
    this.state.stats.treasures++;
    let msg = '';
    if (item.effect === 'hp')  { h.hp = Math.min(h.maxHp, h.hp + item.value); msg = '+' + item.value + ' HP'; }
    else if (item.effect === 'mp')  { h.mp = Math.min(h.maxMp, h.mp + item.value); msg = '+' + item.value + ' MP'; }
    else if (item.effect === 'def') { h.def += item.value; msg = '+' + item.value + ' DEF'; }
    else if (item.effect === 'atk') { h.atk += item.value; msg = '+' + item.value + ' ATK'; }
    else { h.xp = (h.xp||0) + item.value; msg = '+' + item.value + ' XP'; }
    this.master(MASTER_LINES.treasure(h.name, node));
    document.getElementById('treasure-panel').classList.remove('hidden');
    document.getElementById('combat-panel').classList.add('hidden');
    document.getElementById('tp-title').textContent = 'TESOURO!';
    document.getElementById('tp-content').innerHTML =
      '<strong>' + item.name + '</strong><br>' +
      '<span style="color:var(--text3);font-size:0.82rem">' + item.desc + '</span><br>' +
      '<span style="color:#4caf50;font-size:0.9rem;font-weight:700">' + msg + '</span>';
    this.log('Tesouro: ' + item.name + ' (' + msg + ')', 'good');
    this.renderHeroes();
  },

  closeTreasure() {
    document.getElementById('treasure-panel').classList.add('hidden');
    document.getElementById('action-panel').classList.add('hidden');
    this.endAction();
  },

  endAction() {
    this.state.rolled = false;
    this.state.round++;
    document.getElementById('round-num').textContent = this.state.round;
    document.getElementById('btn-roll').disabled = false;
    this.master(MASTER_LINES.turn(this.state.hero.name));
  },

  showVictory() {
    const s = this.state;
    this.master(MASTER_LINES.bossWin(s.hero.name));
    document.getElementById('win-msg').textContent = s.hero.name + ' selou VALDRAK! O Dragao Ancestral dorme novamente. Valdoria esta salva!';
    document.getElementById('win-stats').innerHTML =
      'Pistas coletadas: ' + s.stats.cluesFound + '/5' +
      '<br>Batalhas: ' + s.stats.battles +
      '<br>Inimigos derrotados: ' + s.stats.kills +
      '<br>Tesouros: ' + s.stats.treasures +
      '<br>Nivel final: ' + s.hero.level +
      '<br>Rodadas: ' + s.round;
    document.getElementById('modal-win').classList.remove('hidden');
  },

  showDefeat() {
    const h = this.state.hero;
    this.master(MASTER_LINES.dead(h.name));
    document.getElementById('lose-msg').textContent = h.name + ' caiu. Valdrak continua queimando Valdoria. O reino chora.';
    document.getElementById('modal-lose').classList.remove('hidden');
  },

  restart() {
    ['modal-win','modal-lose','combat-panel','treasure-panel','action-panel'].forEach(id =>
      document.getElementById(id).classList.add('hidden'));
    document.getElementById('dice-face').textContent = '?';
    document.getElementById('dice-msg').textContent = '';
    document.getElementById('log-box').innerHTML = '';
    document.getElementById('btn-roll').disabled = false;
    this.inCombat = false; this.combatEnemy = null;
    showScreen('select');
  },

  log(msg, type) {
    const box = document.getElementById('log-box');
    if (!box) return;
    const d = document.createElement('div');
    d.className = 'log-entry' + (type ? ' ' + type : '');
    d.textContent = msg;
    box.insertBefore(d, box.firstChild);
    while (box.children.length > 30) box.removeChild(box.lastChild);
  }
};

/* ---- HELPERS ---- */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => showScreen('select'));
