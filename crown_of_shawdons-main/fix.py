import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ── 1. Corrige db.js ──────────────────────────────────────────────────────────
with open(r'banco\db.js', 'r', encoding='utf-8') as f:
    db = f.read()

# hashPass sem salt (igual ao cadastro.js)
old_hash = '''  async hashPass(pass) {
    const enc = new TextEncoder().encode(pass + '|cos_shadow_2024');
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  },'''

new_hash = '''  async hashPass(pass) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pass));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  },'''

# _load/_save/_findByEmail: suporta array (cadastro.js) e objeto legado
old_load = '''  _load() {
    try { return JSON.parse(localStorage.getItem(this._KEY) || '{}'); } catch(_) { return {}; }
  },

  _save(data) {
    localStorage.setItem(this._KEY, JSON.stringify(data));
  },

  findByEmail(email) {
    const data = this._load();
    return data[email.toLowerCase().trim()] || null;
  },'''

new_load = '''  _load() {
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
  },'''

if old_hash in db:
    db = db.replace(old_hash, new_hash)
    print('hashPass: corrigido (sem salt)')
else:
    print('AVISO: hashPass nao encontrado')

if old_load in db:
    db = db.replace(old_load, new_load)
    print('_load/_save/findByEmail: corrigido (suporta array)')
else:
    print('AVISO: _load block nao encontrado')

# createAccount: salva como array
old_create = '''  createAccount(name, email, password, provider) {
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
  },'''

new_create = '''  createAccount(name, email, password, provider) {
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
  },'''

if old_create in db:
    db = db.replace(old_create, new_create)
    print('createAccount: corrigido (array)')
else:
    print('AVISO: createAccount nao encontrado')

# touchLogin: usa array
old_touch = '''  touchLogin(email) {
    try {
      const key  = email.toLowerCase().trim();
      const data = this._load();
      if (data[key]) { data[key].last_login = new Date().toISOString(); this._save(data); }
    } catch(_) {}
  },'''

new_touch = '''  touchLogin(email) {
    try {
      const key = email.toLowerCase().trim();
      const arr = this._load();
      const acc = arr.find(a => a.email === key);
      if (acc) { acc.last_login = new Date().toISOString(); this._save(arr); }
    } catch(_) {}
  },'''

if old_touch in db:
    db = db.replace(old_touch, new_touch)
    print('touchLogin: corrigido (array)')
else:
    print('AVISO: touchLogin nao encontrado')

with open(r'banco\db.js', 'w', encoding='utf-8') as f:
    f.write(db)
print('db.js salvo.')

# ── 2. Corrige _confirmGoogle em main.js ─────────────────────────────────────
with open(r'js\main.js', 'rb') as f:
    raw = f.read()
main = raw.decode('utf-8', errors='replace')

# _confirmGoogle usa DB.hashPass (com salt) — trocar por hash direto sem salt
old_gm = '    const hash = await DB.hashPass(pass);\n    if (acc.password !== hash)          { errEl.textContent = \'Senha incorreta.\';           errEl.style.display = \'block\'; return; }'
new_gm = '    const _buf = await crypto.subtle.digest(\'SHA-256\', new TextEncoder().encode(pass));\n    const hash = Array.from(new Uint8Array(_buf)).map(b=>b.toString(16).padStart(2,\'0\')).join(\'\');\n    if (acc.password !== hash)          { errEl.textContent = \'Senha incorreta.\';           errEl.style.display = \'block\'; return; }'

if old_gm in main:
    main = main.replace(old_gm, new_gm)
    print('_confirmGoogle hash: corrigido (sem salt)')
else:
    print('AVISO: _confirmGoogle hash nao encontrado — verificando...')
    idx = main.find('DB.hashPass(pass)')
    print('  DB.hashPass(pass) at:', idx)

with open(r'js\main.js', 'wb') as f:
    f.write(main.encode('utf-8'))
print('main.js salvo.')
print('done')
