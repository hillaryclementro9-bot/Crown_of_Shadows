/* ============================================
   CROWN OF SHADOWS — main.js
   DB está em banco/db.js (carregado antes no HTML)
   ============================================ */

/* ============================================
   APP NAVIGATION
   ============================================ */
const PROTECTED = ['heroes', 'board', 'inventory'];

const App = {
  current: 'home',

  show(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + page);
    if (el) el.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.page === page);
    });
    this.current = page;
    document.getElementById('nav-links').classList.remove('open');
    /* Ocultar nav-links no board (sidebar substitui) */
    const navLinks = document.getElementById('nav-links');
    if (page === 'board') {
      navLinks.classList.add('nav-hidden-board');
    } else {
      navLinks.classList.remove('nav-hidden-board');
    }
    if (page === 'battle')    { Game.initBoard(); }
    if (page === 'inventory') { renderInventoryPage(); }
    if (page === 'register') {
      /* Reset terms gate so user must accept again each time */
      const gate     = document.getElementById('terms-gate');
      const accepted = document.getElementById('terms-accepted');
      const btn      = document.getElementById('reg-submit-btn');
      if (gate)     gate.classList.remove('hidden');
      if (accepted) accepted.classList.add('hidden');
      if (btn)      btn.disabled = true;
    }
    if (page === 'terms') {
      const backBtn  = document.getElementById('terms-back-btn');
      const acceptBtn = document.querySelector('#page-terms .terms-btns .btn-purple');
      const ret = App._termsReturnPage || 'home';
      if (ret === 'register') {
        if (backBtn)  { backBtn.textContent = '← Voltar ao Cadastro'; backBtn.onclick = () => { App._termsReturnPage = null; App.show('register'); }; }
      } else if (ret === '_board') {
        if (backBtn)  { backBtn.textContent = '← Voltar'; backBtn.onclick = () => { App._termsReturnPage = null; App.show('board'); }; }
        if (acceptBtn){ acceptBtn.textContent = '⚔ Aceitar e Entrar'; acceptBtn.onclick = () => { App._termsReturnPage = null; App.show('board'); }; }
      } else {
        if (backBtn)  { backBtn.textContent = '← Voltar'; backBtn.onclick = () => { App._termsReturnPage = null; App.show(ret); }; }
        if (acceptBtn){ acceptBtn.textContent = '⚔ Aceitar e Jogar'; acceptBtn.onclick = () => { App._termsReturnPage = null; App.show('home'); }; }
      }
    }
    App.updatePlayerStats();
  },

  /* Called by protected nav buttons */
  showProtected(page) {
    if (!Auth.isLoggedIn()) {
      App.show('login');
      showToast('🔒 Sign in to access ' + page);
      return;
    }
    App.show(page);
  },

  /* Called by "Begin Adventure" button */
  showLogin() {
    if (Auth.isLoggedIn()) { App.show('board'); }
    else { App.show('login'); }
  },

  toggleMenu() {
    document.getElementById('nav-links').classList.toggle('open');
  },

  /* Show/hide protected nav items based on login state */
  updateNav() {
    /* Heroes/Board/Inventory removed from navbar — sidebar handles navigation */
  },

  /* Sidebar navigation (inside board page) */
  sbNav(target) {
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.toggle('sb-active', b.dataset.sb === target));
    if (target === 'board') return;
    if (target === 'battle') { App.show('battle'); Game.initBoard(); return; }
    App.show(target);
  },

  /* Open terms from inside register page, return back to register */
  showTermsFromRegister() {
    this._termsReturnPage = 'register';
    App.show('terms');
  },
  /* Location data */
  _locations: {
    castle:  { icon:'🏰', name:'Castelo Real',   tag:'Nível 5+',  desc:'A fortaleza do rei caído. Guardada por cavaleiros corrompidos e o espírito do monarca. Recompensas lendárias aguardam os corajosos.' },
    village: { icon:'🏘', name:'Vila de Elden',  tag:'Início',    desc:'A última vila habitada do reino. Aqui você pode descansar, comprar suprimentos e aceitar missões dos aldeões desesperados.' },
    ruins:   { icon:'🏚', name:'Ruínas Antigas', tag:'Nível 2+',  desc:'Restos de uma civilização esquecida. Criaturas das sombras habitam estas pedras. Relíquias poderosas estão enterradas aqui.' },
    dungeon: { icon:'⛏', name:'Masmorra',        tag:'Nível 3+',  desc:'Labirintos subterrâneos cheios de armadilhas e monstros. O Orc Senhor guarda um tesouro imenso nas profundezas.' },
    portal:  { icon:'🌀', name:'Portal Antigo',  tag:'Boss Final',desc:'O portal das trevas que rasgou o reino. O Guardião aguarda. Derrote-o para selar o portal e salvar o mundo.' }
  },

  _currentLoc: null,

  enterLocation(id) {
    const loc = this._locations[id];
    if (!loc) return;
    this._currentLoc = id;
    document.querySelectorAll('.map-loc').forEach(b => b.classList.remove('loc-selected'));
    const btn = document.getElementById('loc-' + id);
    if (btn) btn.classList.add('loc-selected');
    document.getElementById('lip-icon').textContent = loc.icon;
    document.getElementById('lip-name').textContent = loc.name;
    document.getElementById('lip-tag').textContent  = loc.tag;
    document.getElementById('lip-desc').textContent = loc.desc;
    document.getElementById('loc-info-panel').classList.remove('hidden');
  },

  closeLocPanel() {
    document.getElementById('loc-info-panel').classList.add('hidden');
    document.querySelectorAll('.map-loc').forEach(b => b.classList.remove('loc-selected'));
    this._currentLoc = null;
  },

  confirmEnterLocation() {
    const locName = this._locations[this._currentLoc || 'village']?.name || '';
    this.closeLocPanel();
    App.show('battle');
    Game.initBoard();
    Game.addLog('Entrando em: ' + locName, true);
  },

  goPlay() { window.location.href = 'html/joga.html'; },

  /* Update navbar player stats from active hero */
  updatePlayerStats() {
    const statsEl = document.getElementById('nav-player-stats');
    if (!statsEl) return;
    if (!Auth.isLoggedIn()) { statsEl.classList.add('hidden'); return; }
    statsEl.classList.remove('hidden');
    const s = Game.state;
    if (!s.chars) return;
    const hero = s.chars.find(c => c.id === s.selectedCharId) || s.chars[0];
    if (!hero) return;
    document.getElementById('nps-gold').textContent  = hero.gold;
    document.getElementById('nps-xp').textContent    = hero.xp;
    document.getElementById('nps-level').textContent = hero.level;
  }
};

/* ============================================
   AUTH
   ============================================ */
const Auth = {
  isLoggedIn() { return !!sessionStorage.getItem('cos_user'); },
  getUser()    { const u = sessionStorage.getItem('cos_user'); return u ? JSON.parse(u) : null; },
  _save(user)  { sessionStorage.setItem('cos_user', JSON.stringify(user)); },

  logout() {
    sessionStorage.removeItem('cos_user');
    Auth.renderUserBar();
    App.updatePlayerStats();
    showToast('Até logo, aventureiro! ♛');
    App.show('home');
  },

  /* ---- Login por e-mail ---- */
  async loginEmail(e) {
    e.preventDefault();
    const errEl = document.getElementById('login-err');
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass  = document.getElementById('login-pass').value;
    errEl.classList.add('hidden');

    if (!DB._db)                     { errEl.textContent = 'Banco não pronto. Recarregue a página.';    errEl.classList.remove('hidden'); return; }
    const acc = DB.findByEmail(email);
    if (!acc)                        { errEl.textContent = 'E-mail não cadastrado. Crie uma conta primeiro.'; errEl.classList.remove('hidden'); return; }
    if (acc.status === 'banned')     { errEl.textContent = 'Conta suspensa.';                           errEl.classList.remove('hidden'); return; }
    const hash = await DB.hashPass(pass);
    if (acc.password !== hash)       { errEl.textContent = 'Senha incorreta.';                         errEl.classList.remove('hidden'); return; }

    DB.touchLogin(email);
    DB.logSession(acc.id, 'email');
    Auth._save({ id: acc.id, name: acc.name, email: acc.email, provider: 'email' });
    const saved = DB.loadProgress(acc.id);
    if (saved) { try { Game.state = saved; } catch(_) { Game.initState(); } } else { Game.initState(); }
    Auth.renderUserBar();
    App.updatePlayerStats();
    showToast('Bem-vindo de volta, ' + acc.name + '! ⚔');
    App.show('board');
  },

  /* ---- Cadastro por e-mail ---- */
  async registerEmail(e) {
    e.preventDefault();
    const errEl = document.getElementById('reg-err');
    const name  = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass  = document.getElementById('reg-pass').value;
    errEl.classList.add('hidden');

    if (!DB._db)                     { errEl.textContent = 'Banco não pronto. Recarregue a página.';   errEl.classList.remove('hidden'); return; }
    if (!name)                       { errEl.textContent = 'Informe seu nome.';                        errEl.classList.remove('hidden'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { errEl.textContent = 'E-mail inválido.';          errEl.classList.remove('hidden'); return; }
    if (pass.length < 8)             { errEl.textContent = 'Senha: mínimo 8 caracteres.';              errEl.classList.remove('hidden'); return; }

    const hash   = await DB.hashPass(pass);
    const result  = DB.createAccount(name, email, hash, 'email', null);
    if (result === 'duplicate')      { errEl.textContent = 'E-mail já cadastrado. Faça login.';        errEl.classList.remove('hidden'); return; }
    if (result !== true)             { errEl.textContent = 'Erro ao criar conta. Tente novamente.';    errEl.classList.remove('hidden'); return; }

    const acc = DB.findByEmail(email);
    DB.logSession(acc.id, 'email');
    Auth._save({ id: acc.id, name: acc.name, email: acc.email, provider: 'email' });
    Game.initState();
    DB.saveProgress(acc.id, JSON.stringify(Game.state));
    Auth.renderUserBar();
    App.updatePlayerStats();
    showToast('Conta criada! Bem-vindo, ' + name + '! ⚔');
    App.show('board');
  },

  /* ---- Google Sign-In — só no login, valida e-mail + senha do banco ---- */
  googleSignIn() {
    const w = 500, h = 640;
    window.open(
      'https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&continue=https://myaccount.google.com/',
      'google_login',
      'width='+w+',height='+h+',left='+Math.round((screen.width-w)/2)+',top='+Math.round((screen.height-h)/2)
    );
    /* Modal pede e-mail + senha (mesmos do cadastro) */
    const old = document.getElementById('gm'); if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'gm';
    m.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)';
    m.innerHTML = `
      <div style="background:#160d20;border:1px solid rgba(176,106,255,0.5);border-radius:14px;padding:2rem;width:min(360px,92vw);display:flex;flex-direction:column;gap:1rem;box-shadow:0 0 50px rgba(139,63,200,0.4)">
        <div style="font-family:'Cinzel',serif;color:#b06aff;font-size:1rem;font-weight:900;text-align:center">🔐 Login com Google</div>
        <p style="color:#b09070;font-size:0.82rem;text-align:center;line-height:1.5">Conclua o login no popup e confirme seu e-mail e senha cadastrados.</p>
        <input id="gm-email" type="email"    placeholder="Seu e-mail"  style="background:rgba(0,0,0,0.5);border:1px solid rgba(139,94,60,0.5);border-radius:8px;color:#e8d5b0;padding:0.65rem 1rem;font-family:inherit;font-size:0.9rem;width:100%" />
        <input id="gm-pass"  type="password" placeholder="Sua senha"  style="background:rgba(0,0,0,0.5);border:1px solid rgba(139,94,60,0.5);border-radius:8px;color:#e8d5b0;padding:0.65rem 1rem;font-family:inherit;font-size:0.9rem;width:100%" />
        <div id="gm-err" style="color:#e74c3c;font-size:0.78rem;text-align:center;display:none"></div>
        <button onclick="Auth._confirmGoogle()" style="font-family:'Cinzel',serif;font-size:0.8rem;font-weight:700;letter-spacing:1px;color:#fff;background:linear-gradient(135deg,#8b3fc8,#3a1a5a);padding:0.75rem;border-radius:8px;border:none;cursor:pointer">✔ Confirmar e Entrar</button>
        <button onclick="document.getElementById('gm').remove()" style="background:none;border:none;color:#7a6050;font-size:0.72rem;cursor:pointer;font-family:'Cinzel',serif">✕ Cancelar</button>
      </div>`;
    document.body.appendChild(m);
  },

  async _confirmGoogle() {
    const email = (document.getElementById('gm-email').value || '').trim().toLowerCase();
    const pass  = (document.getElementById('gm-pass').value  || '');
    const errEl = document.getElementById('gm-err');
    errEl.style.display = 'none';

    if (!email || !email.includes('@')) { errEl.textContent = 'Informe um e-mail válido.'; errEl.style.display = 'block'; return; }
    if (!pass)                          { errEl.textContent = 'Informe sua senha.';         errEl.style.display = 'block'; return; }
    if (!DB._db)                        { errEl.textContent = 'Banco não pronto.';          errEl.style.display = 'block'; return; }

    const acc = DB.findByEmail(email);
    if (!acc)                           { errEl.textContent = 'E-mail não cadastrado. Crie uma conta primeiro.'; errEl.style.display = 'block'; return; }
    const hash = await DB.hashPass(pass);
    if (acc.password !== hash)          { errEl.textContent = 'Senha incorreta.';           errEl.style.display = 'block'; return; }

    document.getElementById('gm').remove();
    DB.touchLogin(email);
    DB.logSession(acc.id, 'google');
    Auth._save({ id: acc.id, name: acc.name, email: acc.email, provider: 'google' });
    const saved = DB.loadProgress(acc.id);
    if (saved) { try { Game.state = saved; } catch(_) { Game.initState(); } } else { Game.initState(); }
    Auth.renderUserBar();
    App.updatePlayerStats();
    showToast('Bem-vindo, ' + acc.name + '! ⚔');
    App.show('board');
  },

  openTermsModal() {
    document.getElementById('modal-terms').classList.remove('hidden');
  },

  closeTermsModal() {
    document.getElementById('modal-terms').classList.add('hidden');
  },

  acceptTerms() {
    document.getElementById('modal-terms').classList.add('hidden');
    document.getElementById('terms-gate').classList.add('hidden');
    document.getElementById('terms-accepted').classList.remove('hidden');
    document.getElementById('reg-submit-btn').disabled = false;
  },

  renderUserBar() {
    const bar  = document.getElementById('nav-user-bar');
    const user = Auth.getUser();
    if (bar) {
      bar.innerHTML = user
        ? '<span class="nav-user-name">♛ ' + user.name + '</span><button class="nav-logout" onclick="Auth.logout()">Sair</button>'
        : '';
    }
    /* popula user card na settings page */
    const sucName  = document.getElementById('suc-name');
    const sucEmail = document.getElementById('suc-email');
    if (sucName)  sucName.textContent  = user ? user.name  : 'Aventureiro';
    if (sucEmail) sucEmail.textContent = user ? user.email : '—';
  }
};

/* ---- TOAST ---- */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = [
      'position:fixed','bottom:2rem','left:50%','transform:translateX(-50%)',
      'background:rgba(18,9,30,0.96)','border:1px solid #c9a84c',
      'color:#f0c040',"font-family:'Cinzel',serif",'font-size:0.78rem',
      'letter-spacing:1px','padding:0.65rem 1.4rem','border-radius:30px',
      'z-index:3000','transition:opacity 0.4s',
      'box-shadow:0 0 18px rgba(240,192,64,0.3)','pointer-events:none'
    ].join(';');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.style.opacity = '0'; }, 2600);
}

/* ---- CONTACT FORM ---- */
function submitForm(e) {
  e.preventDefault();
  document.getElementById('form-ok').classList.remove('hidden');
  e.target.reset();
  setTimeout(() => document.getElementById('form-ok').classList.add('hidden'), 4000);
}

/* ---- CLOSE MODAL ON BACKDROP ---- */
document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
});

/* ---- HERO SELECT ---- */
let selectedHero = 'harley';

function selectHero(id) {
  selectedHero = id;
  Game.state.selectedCharId = id;
  Game.saveGame();
  document.querySelectorAll('.btn-select').forEach(b => b.classList.remove('active-sel'));
  const btn = document.getElementById('sel-' + id);
  if (btn) btn.classList.add('active-sel');
  const names = { harley: 'Harley', morgan: 'Morgan', lyria: 'Lyria' };
  showToast(names[id] + ' selected as active hero!');
}

/* ============================================
   GAME DATA
   ============================================ */
const CHAR_DEFAULTS = [
  { id:'harley', name:'Harley', class:'Mage',    token:'🧙', hp:80,  maxHp:80,  mana:100, maxMana:100, attack:18, defense:8,  movement:3, level:1, xp:0, gold:50, ability:'Arcane Orb',     abilityCost:25, abilityDmg:30, row:0, col:0 },
  { id:'morgan', name:'Morgan', class:'Warrior', token:'⚔',  hp:130, maxHp:130, mana:40,  maxMana:40,  attack:22, defense:18, movement:3, level:1, xp:0, gold:50, ability:'Powerful Strike', abilityCost:0,  abilityDmg:40, row:0, col:1 },
  { id:'lyria',  name:'Lyria',  class:'Rogue',   token:'🗡',  hp:90,  maxHp:90,  mana:60,  maxMana:60,  attack:20, defense:12, movement:4, level:1, xp:0, gold:50, ability:'Shadow Attack',   abilityCost:0,  abilityDmg:35, row:0, col:2 }
];

const ENEMY_DEFAULTS = [
  { id:'e1', name:'Goblin',   token:'👺', hp:30,  maxHp:30,  attack:8,  defense:4,  range:1, xp:20, gold:10, row:3, col:5  },
  { id:'e2', name:'Goblin',   token:'👺', hp:30,  maxHp:30,  attack:8,  defense:4,  range:1, xp:20, gold:10, row:5, col:10 },
  { id:'e3', name:'Skeleton', token:'💀', hp:40,  maxHp:40,  attack:10, defense:6,  range:1, xp:25, gold:12, row:6, col:7  },
  { id:'e4', name:'Orc',      token:'👹', hp:60,  maxHp:60,  attack:14, defense:10, range:1, xp:35, gold:18, row:8, col:4  },
  { id:'e5', name:'Guardian', token:'🔮', hp:100, maxHp:100, attack:18, defense:14, range:2, xp:80, gold:50, row:9, col:12 }
];

const MAP = [
  [0,0,0,1,0,0,0,0,0,1,0,0,0,0],
  [0,1,0,0,0,1,0,0,1,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,0,0,0,1,0,0,0,1,0,0,0],
  [0,0,0,1,0,0,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,1,0,0,0,1,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,3]
];
const COLS = 14, ROWS = 10;

/* ============================================
   GAME OBJECT
   ============================================ */
const Game = {
  state: {
    selectedCharId: 'harley',
    chars: null, enemies: [], chests: [], inventory: [],
    turn: 0, turnOrder: ['harley','morgan','lyria','enemies'],
    selectedBoardChar: null, movedThisTurn: false, attackedThisTurn: false,
    stats: { defeated:0, treasures:0, relics:0 },
    quests: {
      main:    { done:false },
      defeat3: { count:0, done:false },
      ruins:   { done:false },
      treasure:{ done:false },
      castle:  { done:false }
    }
  },

  initState() {
    this.state.chars   = JSON.parse(JSON.stringify(CHAR_DEFAULTS));
    this.state.enemies = JSON.parse(JSON.stringify(ENEMY_DEFAULTS));
    this.state.chests  = [
      { id:'c1', row:2, col:6,  opened:false },
      { id:'c2', row:4, col:11, opened:false },
      { id:'c3', row:7, col:2,  opened:false }
    ];
    this.state.inventory = [
      { id:'hp1', name:'Health Potion', icon:'🧪', type:'consumable', effect:'hp',   value:30, qty:2 },
      { id:'mp1', name:'Mana Potion',   icon:'✨', type:'consumable', effect:'mana', value:25, qty:1 }
    ];
    this.state.turn = 0;
    this.state.selectedBoardChar = null;
    this.state.movedThisTurn = false;
    this.state.attackedThisTurn = false;
    this.state.stats = { defeated:0, treasures:0, relics:0 };
    this.state.quests = {
      main:    { done:false },
      defeat3: { count:0, done:false },
      ruins:   { done:false },
      treasure:{ done:false },
      castle:  { done:false }
    };
  },

  saveGame() {
    localStorage.setItem('cos_game', JSON.stringify(this.state));
    const user = Auth.getUser();
    if (user && user.id && DB._db) {
      DB.saveProgress(user.id, JSON.stringify(this.state));
    }
  },

  loadGame() {
    const s = localStorage.getItem('cos_game');
    if (s) { try { this.state = JSON.parse(s); } catch(e) { this.initState(); } }
    else { this.initState(); }
  },

  newAdventure() { this.initState(); this.saveGame(); App.show('board'); this.addLog('New adventure started!', true); },
  continueGame() { App.show('board'); },

  playAgain() {
    document.getElementById('modal-victory').classList.add('hidden');
    document.getElementById('modal-defeat').classList.add('hidden');
    this.initState(); this.saveGame(); this.initBoard();
  }
};

/* ---- BOARD INIT & RENDER ---- */
Game.initBoard = function() {
  if (!this.state.chars) this.loadGame();
  const board = document.getElementById('game-board');
  if (!board) return;
  const ts = this._tileSize();
  board.style.gridTemplateColumns = `repeat(${COLS},${ts}px)`;
  board.style.gridTemplateRows    = `repeat(${ROWS},${ts}px)`;
  board.style.width  = (COLS * ts) + 'px';
  board.style.height = (ROWS * ts) + 'px';
  this.renderBoard();
  this.renderSidePanels();
  this._updateTurnUI();
  App.updatePlayerStats();
};

Game._tileSize = function() {
  const w = window.innerWidth, h = window.innerHeight;
  const sideW = w > 1024 ? 420 : w > 700 ? 210 : 0;
  const availW = Math.floor((w - sideW - 40) / COLS);
  const availH = Math.floor((h - 160) / ROWS);
  return Math.max(30, Math.min(54, availW, availH));
};

Game.renderBoard = function() {
  const board = document.getElementById('game-board');
  if (!board || !this.state.chars) return;
  board.innerHTML = '';
  const s = this.state;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.row = r; tile.dataset.col = c;
      const type = MAP[r][c];
      if (type === 1) { tile.classList.add('obstacle'); tile.innerHTML = '<span class="tile-tok">🪨</span>'; }
      else if (type === 3) { tile.innerHTML = '<span class="tile-tok">🌀</span>'; }
      const chest = s.chests.find(ch => ch.row===r && ch.col===c && !ch.opened);
      if (chest) tile.innerHTML = '<span class="tile-tok">📦</span>';
      const enemy = s.enemies.find(e => e.row===r && e.col===c);
      if (enemy) tile.innerHTML = `<span class="tile-tok">${enemy.token}</span>`;
      const char = s.chars.find(ch => ch.row===r && ch.col===c && ch.hp>0);
      if (char) {
        const isSel = s.selectedBoardChar === char.id;
        tile.innerHTML = `<span class="tile-tok char-tok ${isSel?'sel-tok':''}">${char.token}</span>`;
        if (isSel) tile.classList.add('selected-tile');
      }
      tile.addEventListener('click', () => this.onTileClick(r, c));
      tile.addEventListener('touchend', e => { e.preventDefault(); this.onTileClick(r, c); }, { passive:false });
      board.appendChild(tile);
    }
  }
};

/* ---- TILE CLICK ---- */
Game.onTileClick = function(r, c) {
  const s = this.state;
  const curId = s.turnOrder[s.turn % s.turnOrder.length];
  if (curId === 'enemies') return;

  const char = s.chars.find(ch => ch.row===r && ch.col===c && ch.hp>0);
  if (char && char.id === curId) {
    s.selectedBoardChar = char.id;
    this._updateCharInfo(char);
    this.renderBoard();
    this._highlightReachable(char);
    this.addLog(char.name + ' selected.');
    return;
  }

  const enemy = s.enemies.find(e => e.row===r && e.col===c);
  if (enemy && s.selectedBoardChar) {
    const sel = s.chars.find(ch => ch.id===s.selectedBoardChar);
    if (sel && sel.id===curId && !s.attackedThisTurn) {
      const dist = Math.abs(sel.row-r) + Math.abs(sel.col-c);
      if (dist <= 1) { this._doAttack(sel, enemy, false); return; }
      else { this.addLog(enemy.name + ' is out of range.'); return; }
    }
  }

  if (s.selectedBoardChar && !s.movedThisTurn) {
    const sel = s.chars.find(ch => ch.id===s.selectedBoardChar);
    if (sel && sel.id===curId) {
      if (this._canMoveTo(sel, r, c)) { this.moveCharacter(sel, r, c); }
      else if (MAP[r][c] !== 1) { this.addLog('Cannot reach that tile.'); }
    }
  }
};

Game.moveCharacter = function(char, r, c) {
  const s = this.state;
  const oldR = char.row, oldC = char.col;
  char.row = r; char.col = c;
  s.movedThisTurn = true;

  const chest = s.chests.find(ch => ch.row===r && ch.col===c && !ch.opened);
  if (chest) {
    chest.opened = true;
    const loot = this._chestLoot();
    this.addLog('📦 ' + char.name + ' found: ' + loot.name, true);
    this._addItem(loot);
    s.stats.treasures++;
    if (!s.quests.treasure.done) { s.quests.treasure.done = true; this.addLog('📜 Quest: Found the Lost Treasure!', true); }
  }

  if (MAP[r][c] === 3) {
    if (!s.enemies.find(e => e.id==='e5')) { this.saveGame(); this._showVictory(); return; }
    else { this.addLog('The portal is sealed. Defeat the Guardian first!'); }
  }

  if (r >= 6 && c >= 8 && !s.quests.ruins.done)  { s.quests.ruins.done = true;  this.addLog('📜 Quest: Explored the Ancient Ruins!', true); }
  if (r <= 2 && c >= 11 && !s.quests.castle.done) { s.quests.castle.done = true; this.addLog('📜 Quest: Reached the Royal Castle!', true); }

  this.addLog(char.name + ' moved ' + (Math.abs(r-oldR)+Math.abs(c-oldC)) + ' tile(s).');
  this.renderBoard();
  this._updateCharInfo(char);
  this.renderSidePanels();
  this.saveGame();
};

Game._canMoveTo = function(char, r, c) {
  if (MAP[r][c] === 1) return false;
  if (this.state.enemies.find(e => e.row===r && e.col===c)) return false;
  if (this.state.chars.find(ch => ch.row===r && ch.col===c && ch.hp>0 && ch.id!==char.id)) return false;
  return Math.abs(char.row-r) + Math.abs(char.col-c) <= char.movement;
};

Game._highlightReachable = function(char) {
  document.querySelectorAll('.tile').forEach(tile => {
    const r = +tile.dataset.row, c = +tile.dataset.col;
    tile.classList.remove('reachable', 'attack-range');
    if (this._canMoveTo(char, r, c)) tile.classList.add('reachable');
    const enemy = this.state.enemies.find(e => e.row===r && e.col===c);
    if (enemy && Math.abs(char.row-r)+Math.abs(char.col-c) <= 1) tile.classList.add('attack-range');
  });
};

/* ---- D20 & COMBAT ---- */
Game.rollD20 = function() {
  const roll = Math.floor(Math.random() * 20) + 1;
  const el = document.getElementById('d20-box');
  el.classList.remove('hidden');
  let cls = '', label = '';
  if (roll === 20)     { cls = 'd20-crit'; label = '⚡ CRITICAL!'; }
  else if (roll === 1) { cls = 'd20-fail'; label = '💀 FAILURE!'; }
  else label = roll >= 15 ? 'Good roll!' : roll >= 8 ? 'Average.' : 'Poor roll.';
  el.innerHTML = `<span class="${cls}">🎲 ${roll}</span> — ${label}`;

  const s = this.state;
  const curId = s.turnOrder[s.turn % s.turnOrder.length];
  const char = s.chars && s.chars.find(ch => ch.id===curId);
  if (char) {
    this.addLog(char.name + ' rolled ' + roll + ' on the D20.');
    if (!s.attackedThisTurn) {
      const near = s.enemies.find(e => Math.abs(e.row-char.row)+Math.abs(e.col-char.col) <= 1);
      if (near) this._doAttack(char, near, false, roll);
    }
  }
};

Game._doAttack = function(char, enemy, isAbility, forcedRoll) {
  const roll = forcedRoll !== undefined ? forcedRoll : Math.floor(Math.random() * 20) + 1;
  this.state.attackedThisTurn = true;
  const bonus = isAbility ? char.abilityDmg : char.attack;
  const hit = roll !== 1 && (roll === 20 || (roll + Math.floor(bonus/3)) > enemy.defense);
  if (!hit) { this.addLog(char.name + ' missed ' + enemy.name + '! (rolled ' + roll + ')'); this.renderBoard(); return; }
  let dmg = Math.max(1, bonus - enemy.defense + Math.floor(roll/4));
  if (roll === 20) dmg = Math.floor(dmg * 1.5);
  if (char.id === 'lyria' && Math.random() < 0.3) { dmg = Math.floor(dmg * 1.4); this.addLog('💥 Critical hit!', true); }
  enemy.hp = Math.max(0, enemy.hp - dmg);
  this.addLog(char.name + ' hit ' + enemy.name + ' for ' + dmg + ' dmg. (' + enemy.hp + '/' + enemy.maxHp + ' HP)');
  if (enemy.hp <= 0) this._enemyDefeated(char, enemy);
  this.renderBoard();
  this._updateCharInfo(char);
  this.renderSidePanels();
  this.saveGame();
  App.updatePlayerStats();
};

Game._enemyDefeated = function(char, enemy) {
  const s = this.state;
  s.enemies = s.enemies.filter(e => e.id !== enemy.id);
  s.stats.defeated++;
  char.xp += enemy.xp; char.gold += enemy.gold;
  this.addLog(enemy.name + ' defeated! +' + enemy.xp + ' XP, +' + enemy.gold + ' Gold', true);
  if (char.xp >= char.level * 100) {
    char.level++; char.xp = 0; char.maxHp += 10; char.hp = char.maxHp; char.attack += 2; char.defense++;
    this.addLog('🌟 ' + char.name + ' reached Level ' + char.level + '!', true);
  }
  const q = s.quests.defeat3;
  if (!q.done) { q.count++; if (q.count >= 3) { q.done = true; this.addLog('📜 Quest: Defeated 3 Enemies!', true); } }
  if (enemy.id === 'e5') this.addLog('🔮 Guardian defeated! Reach the portal to win!', true);
};

/* ---- ABILITY ---- */
Game.useAbility = function() {
  const s = this.state;
  const curId = s.turnOrder[s.turn % s.turnOrder.length];
  const char = s.chars && s.chars.find(ch => ch.id===curId);
  if (!char) return this.addLog('No character active.');
  if (s.attackedThisTurn) return this.addLog('Already acted this turn.');
  let nearest = null, minD = 999;
  s.enemies.forEach(e => { const d = Math.abs(e.row-char.row)+Math.abs(e.col-char.col); if (d < minD) { minD = d; nearest = e; } });
  if (!nearest) return this.addLog('No enemies on the board.');
  if (char.id === 'harley') {
    if (char.mana < char.abilityCost) return this.addLog('Not enough mana!');
    if (minD > 4) return this.addLog('No enemy in arcane range (4 tiles).');
    char.mana -= char.abilityCost;
    this.addLog('✨ Harley casts ARCANE ORB! (-' + char.abilityCost + ' mana)', true);
    this._doAttack(char, nearest, true);
  } else if (char.id === 'morgan') {
    if (minD > 1) return this.addLog('No adjacent enemy for Powerful Strike.');
    this.addLog('⚔ Morgan uses POWERFUL STRIKE!', true);
    this._doAttack(char, nearest, true);
  } else if (char.id === 'lyria') {
    if (minD > 1) return this.addLog('No adjacent enemy for Shadow Attack.');
    this.addLog('🗡 Lyria uses SHADOW ATTACK!', true);
    this._doAttack(char, nearest, true);
  }
  this._updateCharInfo(char);
  this.saveGame();
};

/* ---- TURN SYSTEM ---- */
Game.endTurn = function() {
  const s = this.state;
  s.movedThisTurn = false; s.attackedThisTurn = false; s.selectedBoardChar = null;
  s.turn = (s.turn + 1) % s.turnOrder.length;
  let tries = 0;
  while (tries++ < 4) {
    const id = s.turnOrder[s.turn % s.turnOrder.length];
    if (id === 'enemies') break;
    const c = s.chars.find(ch => ch.id===id);
    if (c && c.hp > 0) break;
    s.turn = (s.turn + 1) % s.turnOrder.length;
  }
  this._updateTurnUI(); this.renderBoard(); this.saveGame();
  const curId = s.turnOrder[s.turn % s.turnOrder.length];
  if (curId === 'enemies') { this.addLog('--- Enemy Turn ---'); setTimeout(() => this.enemyTurn(), 600); }
  else { const c = s.chars.find(ch => ch.id===curId); if (c) this.addLog(c.name + "'s turn begins."); }
};

Game.enemyTurn = function() {
  const s = this.state;
  const live = s.chars.filter(c => c.hp > 0);
  if (!live.length) { this._showDefeat(); return; }
  s.enemies.forEach(enemy => {
    let target = null, minD = 999;
    live.forEach(p => { const d = Math.abs(p.row-enemy.row)+Math.abs(p.col-enemy.col); if (d < minD) { minD = d; target = p; } });
    if (!target) return;
    if (minD > enemy.range) {
      const dr = Math.sign(target.row-enemy.row), dc = Math.sign(target.col-enemy.col);
      const nr = enemy.row+dr, nc = enemy.col+dc;
      if (nr>=0 && nr<ROWS && nc>=0 && nc<COLS && MAP[nr][nc]!==1 &&
          !s.chars.find(ch=>ch.row===nr&&ch.col===nc&&ch.hp>0) &&
          !s.enemies.find(e=>e.id!==enemy.id&&e.row===nr&&e.col===nc)) {
        enemy.row = nr; enemy.col = nc;
        this.addLog(enemy.name + ' moves toward ' + target.name + '.');
      }
    }
    const dist = Math.abs(target.row-enemy.row)+Math.abs(target.col-enemy.col);
    if (dist <= enemy.range) {
      const roll = Math.floor(Math.random()*20)+1;
      const dmg = Math.max(1, enemy.attack - target.defense + Math.floor(roll/5));
      target.hp = Math.max(0, target.hp - dmg);
      this.addLog(enemy.name + ' attacks ' + target.name + ' for ' + dmg + ' dmg. (' + target.hp + ' HP)');
      if (target.hp <= 0) this.addLog('💀 ' + target.name + ' has fallen!', true);
    }
  });
  if (!s.chars.find(c => c.hp > 0)) { this._showDefeat(); return; }
  this.renderBoard(); this.renderSidePanels(); this.saveGame();
  s.turn = (s.turn + 1) % s.turnOrder.length;
  s.movedThisTurn = false; s.attackedThisTurn = false;
  this._updateTurnUI();
  const nextId = s.turnOrder[s.turn % s.turnOrder.length];
  const next = s.chars.find(ch => ch.id===nextId);
  if (next) this.addLog(next.name + "'s turn begins.");
};

/* ---- UI UPDATES ---- */
Game._updateTurnUI = function() {
  const s = this.state;
  const id = s.turnOrder[s.turn % s.turnOrder.length];
  const el = document.getElementById('turn-indicator');
  if (!el) return;
  if (id === 'enemies') { el.textContent = '⚔ ENEMY TURN'; el.style.borderColor = '#e74c3c'; }
  else {
    const c = s.chars && s.chars.find(ch => ch.id===id);
    el.textContent = c ? c.name.toUpperCase() + "'S TURN" : '—';
    el.style.borderColor = 'rgba(139,63,200,0.4)';
    if (c) this._updateCharInfo(c);
  }
};

Game._updateCharInfo = function(char) {
  const el = document.getElementById('char-info');
  if (!el || !char) return;
  const hp = Math.max(0, Math.round(char.hp/char.maxHp*100));
  const mp = Math.max(0, Math.round(char.mana/char.maxMana*100));
  el.innerHTML = `
    <div class="ci-name">${char.name} <small style="color:var(--purple2);font-size:0.7rem">${char.class}</small></div>
    <div class="ci-bar-wrap">
      <div class="ci-bar-label"><span>HP</span><span>${char.hp}/${char.maxHp}</span></div>
      <div class="ci-bar"><div class="ci-bar-fill hp" style="width:${hp}%"></div></div>
    </div>
    <div class="ci-bar-wrap">
      <div class="ci-bar-label"><span>Mana</span><span>${char.mana}/${char.maxMana}</span></div>
      <div class="ci-bar"><div class="ci-bar-fill mana" style="width:${mp}%"></div></div>
    </div>
    <div style="font-size:0.68rem;color:var(--text3);margin-top:0.3rem">ATK ${char.attack} · DEF ${char.defense} · MOV ${char.movement} · Lv.${char.level}</div>`;
};

Game.addLog = function(msg, hi) {
  const el = document.getElementById('log-list');
  if (!el) return;
  const d = document.createElement('div');
  d.className = 'log-e' + (hi ? ' hi' : '');
  d.textContent = msg;
  el.insertBefore(d, el.firstChild);
  while (el.children.length > 20) el.removeChild(el.lastChild);
};

Game.renderSidePanels = function() {
  const s = this.state;
  const el = document.getElementById('enemy-list');
  if (el) {
    el.innerHTML = '';
    s.enemies.concat(ENEMY_DEFAULTS.filter(e => !s.enemies.find(x => x.id===e.id)).map(e => ({...e, hp:0}))).forEach(e => {
      const dead = e.hp <= 0 && !s.enemies.find(x=>x.id===e.id);
      const pct = s.enemies.find(x=>x.id===e.id) ? Math.round(e.hp/e.maxHp*100) : 0;
      el.innerHTML += `<div class="enemy-row ${dead?'e-dead':''}"><span class="e-tok">${e.token}</span><span style="flex:0 0 auto;font-size:0.68rem">${e.name}</span><div class="e-hp-bar"><div class="e-hp-fill" style="width:${pct}%"></div></div></div>`;
    });
  }
  const il = document.getElementById('inv-list');
  if (il) {
    il.innerHTML = '';
    if (!s.inventory.length) { il.innerHTML = '<div style="font-size:0.7rem;color:var(--text3)">Empty</div>'; }
    s.inventory.forEach((item, idx) => {
      il.innerHTML += `<div class="inv-row"><span>${item.icon} ${item.name} x${item.qty}</span>${item.type==='consumable'?`<button class="inv-use-btn" onclick="Game.useItem(${idx})">USE</button>`:''}</div>`;
    });
  }
  const ql = document.getElementById('quest-list');
  if (ql) {
    const q = s.quests;
    ql.innerHTML = [
      { key:'main',     label:'Find the Portal' },
      { key:'defeat3',  label:'Defeat 3 Enemies (' + Math.min(q.defeat3.count,3) + '/3)' },
      { key:'ruins',    label:'Explore Ruins' },
      { key:'treasure', label:'Find Treasure' },
      { key:'castle',   label:'Reach Castle' }
    ].map(qd => `<div class="quest-row ${q[qd.key].done?'done':''}">${qd.label}</div>`).join('');
  }
};

Game.useItem = function(idx) {
  const s = this.state;
  const item = s.inventory[idx];
  if (!item || item.qty <= 0) return;
  const char = s.chars.find(c => c.id===s.selectedCharId) || s.chars.find(c => c.hp>0);
  if (!char) return;
  if (item.effect === 'hp')   { char.hp   = Math.min(char.maxHp,   char.hp   + item.value); this.addLog(char.name + ' used ' + item.name + '. +' + item.value + ' HP', true); }
  if (item.effect === 'mana') { const h = s.chars.find(c=>c.id==='harley'); if(h) { h.mana = Math.min(h.maxMana, h.mana+item.value); this.addLog('Harley used ' + item.name + '. +' + item.value + ' Mana', true); } }
  item.qty--;
  if (item.qty <= 0) s.inventory.splice(idx, 1);
  this._updateCharInfo(char);
  this.renderSidePanels();
  renderInventoryPage();
  this.saveGame();
};

Game._addItem = function(item) {
  const inv = this.state.inventory;
  if (item.effect === 'gold') {
    const c = this.state.chars.find(ch => ch.id===this.state.selectedCharId);
    if (c) { c.gold += item.value; this.addLog('+' + item.value + ' Gold!', true); }
    return;
  }
  if (item.type === 'relic') { this.state.stats.relics++; inv.push({...item, id: item.id+'_'+Date.now()}); return; }
  const ex = inv.find(i => i.id===item.id);
  if (ex) ex.qty++; else inv.push({...item});
};

Game._chestLoot = function() {
  const pool = [
    { id:'hp_d', name:'Health Potion', icon:'🧪', type:'consumable', effect:'hp',   value:30, qty:1 },
    { id:'mp_d', name:'Mana Potion',   icon:'✨', type:'consumable', effect:'mana', value:25, qty:1 },
    { id:'relic',name:'Ancient Relic', icon:'🔮', type:'relic',      effect:'none', value:0,  qty:1 },
    { id:'coin', name:'Gold Coins',    icon:'🪙', type:'gold',       effect:'gold', value:30, qty:1 }
  ];
  return pool[Math.floor(Math.random()*pool.length)];
};

Game._showVictory = function() {
  const s = this.state;
  const xp   = s.chars.reduce((a,c)=>a+c.xp,0);
  const gold = s.chars.reduce((a,c)=>a+c.gold,0);
  document.getElementById('victory-stats').innerHTML =
    `<div>⚔ Enemies Defeated: ${s.stats.defeated}</div>
     <div>📦 Treasures Found: ${s.stats.treasures}</div>
     <div>🔮 Relics Collected: ${s.stats.relics}</div>
     <div>⭐ Total XP: ${xp}</div>
     <div>🪙 Total Gold: ${gold}</div>`;
  document.getElementById('modal-victory').classList.remove('hidden');
  s.quests.main.done = true;
};

Game._showDefeat = function() {
  document.getElementById('modal-defeat').classList.remove('hidden');
};

/* ---- INVENTORY PAGE ---- */
function renderInventoryPage() {
  const grid = document.getElementById('inv-full-grid');
  if (!grid) return;
  const inv = Game.state.inventory;
  if (!inv || !inv.length) { grid.innerHTML = '<p class="inv-empty">Your inventory is empty.</p>'; return; }
  grid.innerHTML = '';
  inv.forEach((item, idx) => {
    const d = document.createElement('div');
    d.className = 'inv-card';
    d.innerHTML = `
      <div class="inv-card-icon">${item.icon}</div>
      <div class="inv-card-name">${item.name}</div>
      <div class="inv-card-qty">Qty: ${item.qty}</div>
      ${item.type==='consumable'?`<button class="btn-gold" style="font-size:0.7rem;padding:0.4rem 0.8rem" onclick="Game.useItem(${idx})">USE</button>`:''}`;
    grid.appendChild(d);
  });
}

/* ============================================
   INIT — wait for sql.js then boot
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  DB.init();
  Game.loadGame();
  App.show('home');
  Auth.renderUserBar();
  App.updateNav();
  App.updatePlayerStats();
});

/* ============================================
   MAP BOARD — pins interativos + partículas
   ============================================ */
const MapBoard = {
  _activePin: null,

  openPin(btn) {
    /* fecha tooltip anterior */
    this.closePin();
    this._activePin = btn;
    btn.classList.add('pin-active');

    const danger = parseInt(btn.dataset.danger) || 0;
    const dangerColors = ['#4caf50','#4caf50','#ffc107','#ff9800','#f44336','#9c27b0'];
    const dangerLabels = ['Seguro','Fácil','Médio','Difícil','Mortal','Lendário'];
    const stars = '★'.repeat(Math.min(danger,5)) + '☆'.repeat(Math.max(0,5-danger));

    document.getElementById('mtt-icon').textContent  = btn.querySelector('.pin-icon').textContent;
    document.getElementById('mtt-name').textContent  = btn.dataset.name;
    document.getElementById('mtt-tag').textContent   = btn.dataset.tag;
    document.getElementById('mtt-desc').textContent  = btn.dataset.desc;
    document.getElementById('mtt-danger').innerHTML  =
      `<span style="color:${dangerColors[danger]};font-size:1rem;letter-spacing:2px">${stars}</span>` +
      `<span style="color:${dangerColors[danger]}">${dangerLabels[danger]}</span>`;

    const _pageMap = {
      'Castelo Real':       'loc-castle',
      'Vila de Elden':      'loc-village',
      'Floresta de Mirval': 'loc-forest',
      'Ruínas de Valdor':   'loc-ruins',
      'Pantano de Sombra':  'loc-swamp',
      'Montanhas Eternas':  'loc-mountains'
    };
    const _locPage = _pageMap[btn.dataset.name];
    const _mttBtn = document.getElementById('mtt-btn');
    if (_mttBtn && _locPage) {
      _mttBtn.textContent = btn.dataset.name === 'Castelo Real' ? '🏰 Ver o Castelo' : '⚔ Explorar Região';
      _mttBtn.onclick = () => { MapBoard.closePin(); App.show(_locPage); };
    }
    document.getElementById('map-tooltip').classList.remove('hidden');
  },

  closePin() {
    document.getElementById('map-tooltip').classList.add('hidden');
    if (this._activePin) {
      this._activePin.classList.remove('pin-active');
      this._activePin = null;
    }
  },

  spawnParticles() {
    const container = document.getElementById('map-particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'map-particle';
      p.style.cssText = [
        'left:'   + Math.random() * 100 + '%',
        'top:'    + (60 + Math.random() * 40) + '%',
        'width:'  + (1 + Math.random() * 2.5) + 'px',
        'height:' + (1 + Math.random() * 2.5) + 'px',
        'opacity:'+ (0.3 + Math.random() * 0.7),
        'animation-duration:' + (6 + Math.random() * 10) + 's',
        'animation-delay:'    + (Math.random() * 8) + 's',
        'background:' + (['rgba(176,106,255,0.7)','rgba(255,193,7,0.5)','rgba(255,255,255,0.4)'][Math.floor(Math.random()*3)])
      ].join(';');
      container.appendChild(p);
    }
  }
};

/* inicia partículas quando o board fica ativo */
const _origShow = App.show.bind(App);
App.show = function(page) {
  _origShow(page);
  if (page === 'board') {
    setTimeout(() => MapBoard.spawnParticles(), 200);
  }
};
