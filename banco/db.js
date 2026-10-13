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
    const enc = new TextEncoder().encode(pass + '|cos_shadow_2024');
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  _load() {
    try { return JSON.parse(localStorage.getItem(this._KEY) || '{}'); } catch(_) { return {}; }
  },

  _save(data) {
    localStorage.setItem(this._KEY, JSON.stringify(data));
  },

  findByEmail(email) {
    const data = this._load();
    return data[email.toLowerCase().trim()] || null;
  },

  /* Retorna: true | 'duplicate' | 'error' */
  createAccount(name, email, password, provider) {
    try {
      const key  = email.toLowerCase().trim();
      const data = this._load();
      if (data[key]) return 'duplicate';
      data[key] = {
        id:         key,
        name:       name.trim(),
        email:      key,
        password,
        provider:   provider || 'email',
        status:     'active',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      this._save(data);
      return true;
    } catch(e) {
      console.error('DB createAccount error:', e);
      return 'error';
    }
  },

  touchLogin(email) {
    try {
      const key  = email.toLowerCase().trim();
      const data = this._load();
      if (data[key]) { data[key].last_login = new Date().toISOString(); this._save(data); }
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
