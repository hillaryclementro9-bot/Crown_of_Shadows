/* ============================================
   CROWN OF SHADOWS — banco/db.js
   Armazenamento via localStorage (sem dependência externa)
   ============================================ */

const DB = {
  _KEY: 'cos_accounts',
  _ready: true,   /* sempre pronto, sem async */

  /* compatibilidade: código antigo checa DB._db */
  get _db() { return this._ready ? true : null; },

  init() { return Promise.resolve(); },

  /* SHA-256 via Web Crypto */
  async hashPass(pass) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pass));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  _load() {
    try {
      const raw = JSON.parse(localStorage.getItem(this._KEY) || '[]');
      // suporta array (cadastro.js) e objeto legado
      if (Array.isArray(raw)) return raw;
      return Object.values(raw);
    } catch(_) { return []; }
  },

  _save(arr) {
    localStorage.setItem(this._KEY, JSON.stringify(arr));
  },

  findByEmail(email) {
    const key = email.toLowerCase().trim();
    return this._load().find(a => a.email === key) || null;
  },

  /* Retorna: true | 'duplicate' | 'error' */
  createAccount(name, email, password, provider) {
    try {
      const key  = email.toLowerCase().trim();
      const arr  = this._load();
      if (arr.find(a => a.email === key)) return 'duplicate';
      arr.push({
        id:         Date.now().toString(),
        name:       name.trim(),
        email:      key,
        password,
        provider:   provider || 'email',
        createdAt:  new Date().toISOString()
      });
      this._save(arr);
      return true;
    } catch(e) {
      console.error('DB createAccount error:', e);
      return 'error';
    }
  },

  touchLogin(email) {
    try {
      const key = email.toLowerCase().trim();
      const arr = this._load();
      const acc = arr.find(a => a.email === key);
      if (acc) { acc.last_login = new Date().toISOString(); this._save(arr); }
    } catch(_) {}
  },

  /* sessions não são necessárias sem SQL, mas mantém a assinatura */
  logSession() {},

  saveProgress(accountId, stateJson) {
    try {
      localStorage.setItem('cos_progress_' + accountId, stateJson);
    } catch(e) { console.error('DB saveProgress error:', e); }
  },

  loadProgress(accountId) {
    try {
      const s = localStorage.getItem('cos_progress_' + accountId);
      return s ? JSON.parse(s) : null;
    } catch(_) { return null; }
  },

  reset() {
    localStorage.removeItem(this._KEY);
    console.log('DB resetado.');
  }
};
