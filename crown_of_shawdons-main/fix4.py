import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ══════════════════════════════════════════════════════════════
# 1. cadastro.html — remove campo data de nascimento
# ══════════════════════════════════════════════════════════════
with open(r'html\cadastro.html', 'rb') as f:
    html = f.read().decode('utf-8', errors='replace')

old_birth_html = '''        <!-- Data de nascimento -->\r\n        <div class="field-wrap">\r\n          <div class="input-wrap">\r\n            <span class="inp-icon">&#128197;</span>\r\n            <input type="date" id="reg-birth" />\r\n          </div>\r\n          <div class="field-err" id="err-birth"></div>\r\n        </div>\r\n\r\n        <!-- Termos -->'''

new_birth_html = '''        <!-- Termos -->'''

if old_birth_html in html:
    html = html.replace(old_birth_html, new_birth_html)
    print('cadastro.html: campo data removido')
else:
    print('AVISO: campo data nao encontrado no html')

with open(r'html\cadastro.html', 'wb') as f:
    f.write(html.encode('utf-8'))

# ══════════════════════════════════════════════════════════════
# 2. cadastro.js — remove validacao de data de nascimento
# ══════════════════════════════════════════════════════════════
with open(r'js\cadastro.js', 'r', encoding='utf-8') as f:
    cad = f.read()

# remove 'err-birth' da lista de clearErrs
cad = cad.replace(
    "['err-name','err-email','err-pass','err-pass2','err-birth','err-terms','err-form']",
    "['err-name','err-email','err-pass','err-pass2','err-terms','err-form']"
)

# remove leitura e validacao do campo birth
old_birth_val = '''  const birth = document.getElementById('reg-birth').value;\n  const terms = document.getElementById('reg-terms').checked;\n\n  if (!name)  { setErr('err-name',  '⚔ Informe seu nome de aventureiro.'); ok = false; }\n  if (!email) { setErr('err-email', '⚔ Informe seu e-mail.'); ok = false; }\n  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { setErr('err-email', '⚔ Formato de e-mail inválido.'); ok = false; }\n  if (!pass)             { setErr('err-pass',  '⚔ Crie uma senha.'); ok = false; }\n  else if (pass.length < 8) { setErr('err-pass', '⚔ A senha deve ter no mínimo 8 caracteres.'); ok = false; }\n  if (!pass2)            { setErr('err-pass2', '⚔ Confirme sua senha.'); ok = false; }\n  else if (pass !== pass2) { setErr('err-pass2', '⚔ As senhas não coincidem.'); ok = false; }\n  if (!birth) { setErr('err-birth', '⚔ Informe sua data de nascimento.'); ok = false; }\n  else {\n    const age = Math.floor((Date.now() - new Date(birth)) / (365.25 * 24 * 3600 * 1000));\n    if (age < 13) { setErr('err-birth', '⚔ Você precisa ter pelo menos 13 anos.'); ok = false; }\n  }\n  if (!terms) { setErr('err-terms', '⚔ Você precisa aceitar os Termos de Uso.'); ok = false; }'''

new_birth_val = '''  const terms = document.getElementById('reg-terms').checked;\n\n  if (!name)  { setErr('err-name',  '⚔ Informe seu nome de aventureiro.'); ok = false; }\n  if (!email) { setErr('err-email', '⚔ Informe seu e-mail.'); ok = false; }\n  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { setErr('err-email', '⚔ Formato de e-mail inválido.'); ok = false; }\n  if (!pass)             { setErr('err-pass',  '⚔ Crie uma senha.'); ok = false; }\n  else if (pass.length < 8) { setErr('err-pass', '⚔ A senha deve ter no mínimo 8 caracteres.'); ok = false; }\n  if (!pass2)            { setErr('err-pass2', '⚔ Confirme sua senha.'); ok = false; }\n  else if (pass !== pass2) { setErr('err-pass2', '⚔ As senhas não coincidem.'); ok = false; }\n  if (!terms) { setErr('err-terms', '⚔ Você precisa aceitar os Termos de Uso.'); ok = false; }'''

if old_birth_val in cad:
    cad = cad.replace(old_birth_val, new_birth_val)
    print('cadastro.js: validacao data removida')
else:
    print('AVISO: validacao data nao encontrada no js')

with open(r'js\cadastro.js', 'w', encoding='utf-8') as f:
    f.write(cad)

# ══════════════════════════════════════════════════════════════
# 3. main.js — conta admin hillary rodrigues + fix google modal
# ══════════════════════════════════════════════════════════════
with open(r'js\main.js', 'rb') as f:
    raw = f.read()
main = raw.decode('utf-8', errors='replace')

# 3a. loginEmail — adiciona bypass admin antes da checagem de senha
old_login_hash = "    if (!acc) { errEl.textContent = '⚔ E-mail não cadastrado. Crie uma conta.'; errEl.style.display = 'block'; return; }\n\n    // hash SHA-256\n    let hash = '';\n    try {\n      const buf = new TextEncoder().encode(pass);\n      const h   = await crypto.subtle.digest('SHA-256', buf);\n      hash = Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('');\n    } catch(_) {}\n\n    if (acc.password !== hash) { errEl.textContent = '⚔ Senha incorreta.'; errEl.style.display = 'block'; return; }"

new_login_hash = "    // ── conta admin: entra sem senha ──\n    const ADMIN_EMAIL = 'hillaryrodrigues@admin.cos';\n    const ADMIN_NAME  = 'Hillary Rodrigues';\n    if (email === ADMIN_EMAIL || (acc && acc.role === 'admin')) {\n      if (!acc) acc = { id: 'admin', name: ADMIN_NAME, email: ADMIN_EMAIL, provider: 'admin', role: 'admin' };\n      Auth._save({ id: acc.id, name: acc.name, email: acc.email, provider: 'admin', role: 'admin' });\n      try { Game.initState(); } catch(_) {}\n      Auth.renderUserBar();\n      App.updatePlayerStats();\n      showToast('Bem-vinda, ' + acc.name + '! 👑 Admin');\n      App.show('board');\n      return;\n    }\n\n    if (!acc) { errEl.textContent = '⚔ E-mail não cadastrado. Crie uma conta.'; errEl.style.display = 'block'; return; }\n\n    // hash SHA-256\n    let hash = '';\n    try {\n      const buf = new TextEncoder().encode(pass);\n      const h   = await crypto.subtle.digest('SHA-256', buf);\n      hash = Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('');\n    } catch(_) {}\n\n    if (acc.password !== hash) { errEl.textContent = '⚔ Senha incorreta.'; errEl.style.display = 'block'; return; }"

if old_login_hash in main:
    main = main.replace(old_login_hash, new_login_hash)
    print('main.js: admin bypass adicionado no loginEmail')
else:
    print('AVISO: bloco loginEmail nao encontrado')

# 3b. _confirmGoogle — adiciona bypass admin + garante busca no array localStorage
old_gm_check = "    if (!email || !email.includes('@')) { errEl.textContent = 'Informe um e-mail válido.'; errEl.style.display = 'block'; return; }\r\r\n    if (!pass)                          { errEl.textContent = 'Informe sua senha.';         errEl.style.display = 'block'; return; }\r\r\n    if (!DB._db)                        { errEl.textContent = 'Banco não pronto.';          errEl.style.display = 'block'; return; }\r\r\n\r\r\n    const acc = DB.findByEmail(email);\r\r\n    if (!acc)                           { errEl.textContent = 'E-mail não cadastrado. Crie uma conta primeiro.'; errEl.style.display = 'block'; return; }\r\r\n    const _hbuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pass));\r\r\n    const hash = Array.from(new Uint8Array(_hbuf)).map(b=>b.toString(16).padStart(2,'0')).join('');\r\r\n    if (acc.password !== hash)          { errEl.textContent = 'Senha incorreta.';           errEl.style.display = 'block'; return; }"

new_gm_check = "    if (!email || !email.includes('@')) { errEl.textContent = 'Informe um e-mail válido.'; errEl.style.display = 'block'; return; }\r\r\n    if (!pass)                          { errEl.textContent = 'Informe sua senha.';         errEl.style.display = 'block'; return; }\r\r\n\r\r\n    // admin bypass\r\r\n    if (email === 'hillaryrodrigues@admin.cos') {\r\r\n      document.getElementById('gm').remove();\r\r\n      Auth._save({ id: 'admin', name: 'Hillary Rodrigues', email, provider: 'admin', role: 'admin' });\r\r\n      try { Game.initState(); } catch(_) {}\r\r\n      Auth.renderUserBar(); App.updatePlayerStats();\r\r\n      showToast('Bem-vinda, Hillary Rodrigues! 👑 Admin');\r\r\n      App.show('board'); return;\r\r\n    }\r\r\n\r\r\n    // busca conta: localStorage array primeiro, depois DB\r\r\n    let acc = null;\r\r\n    try { const _ls = JSON.parse(localStorage.getItem('cos_accounts')||'[]'); acc = _ls.find(a=>a.email===email)||null; } catch(_) {}\r\r\n    if (!acc && typeof DB !== 'undefined' && DB.findByEmail) { try { acc = DB.findByEmail(email); } catch(_) {} }\r\r\n    if (!acc)                           { errEl.textContent = 'E-mail não cadastrado. Crie uma conta primeiro.'; errEl.style.display = 'block'; return; }\r\r\n    const _hbuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pass));\r\r\n    const hash = Array.from(new Uint8Array(_hbuf)).map(b=>b.toString(16).padStart(2,'0')).join('');\r\r\n    if (acc.password !== hash)          { errEl.textContent = 'Senha incorreta.';           errEl.style.display = 'block'; return; }"

if old_gm_check in main:
    main = main.replace(old_gm_check, new_gm_check)
    print('main.js: _confirmGoogle corrigido (admin + array lookup)')
else:
    print('AVISO: bloco _confirmGoogle nao encontrado')
    idx = main.find('Banco n')
    print('  "Banco n" at:', idx)
    print(repr(main[idx-50:idx+200]))

with open(r'js\main.js', 'wb') as f:
    f.write(main.encode('utf-8'))

print('done')
