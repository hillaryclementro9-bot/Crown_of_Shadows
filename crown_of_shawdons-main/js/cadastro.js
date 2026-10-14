/* ============================================
   CROWN OF SHADOWS — cadastro.js
   ============================================ */

function togglePass(id, btn) {
  const inp = document.getElementById(id);
  if (!inp) return;
  if (inp.type === 'password') { inp.type = 'text';     btn.textContent = '🙈'; }
  else                         { inp.type = 'password'; btn.textContent = '👁'; }
}

function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}
function clearErrs() {
  ['err-name','err-email','err-pass','err-pass2','err-terms','err-form']
    .forEach(id => setErr(id, ''));
}

async function hashPass(pass) {
  if (window.crypto && crypto.subtle) {
    const buf  = new TextEncoder().encode(pass);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
  let h = 0;
  for (let i = 0; i < pass.length; i++) h = (Math.imul(31, h) + pass.charCodeAt(i)) | 0;
  return h.toString(16);
}

function getAccounts() {
  try { return JSON.parse(localStorage.getItem('cos_accounts') || '[]'); } catch { return []; }
}
function saveAccounts(arr) {
  localStorage.setItem('cos_accounts', JSON.stringify(arr));
}

function validate() {
  clearErrs();
  let ok = true;
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  const terms = document.getElementById('reg-terms').checked;

  if (!name)  { setErr('err-name',  '⚔ Informe seu nome de aventureiro.'); ok = false; }
  if (!email) { setErr('err-email', '⚔ Informe seu e-mail.'); ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('err-email', '⚔ Formato de e-mail inválido.'); ok = false; }
  if (!pass)             { setErr('err-pass',  '⚔ Crie uma senha.'); ok = false; }
  else if (pass.length < 8) { setErr('err-pass', '⚔ A senha deve ter no mínimo 8 caracteres.'); ok = false; }
  if (!pass2)            { setErr('err-pass2', '⚔ Confirme sua senha.'); ok = false; }
  else if (pass !== pass2) { setErr('err-pass2', '⚔ As senhas não coincidem.'); ok = false; }
  if (!terms) { setErr('err-terms', '⚔ Você precisa aceitar os Termos de Uso.'); ok = false; }
  return ok;
}

document.getElementById('form-cadastro').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!validate()) return;

  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pass  = document.getElementById('reg-pass').value;

  const accounts = getAccounts();
  if (accounts.find(a => a.email === email)) {
    setErr('err-form', '⚔ Este e-mail já está cadastrado. Faça login.');
    return;
  }

  const hash   = await hashPass(pass);
  const newAcc = { id: Date.now().toString(), name, email, password: hash, provider: 'email', createdAt: new Date().toISOString() };
  accounts.push(newAcc);
  saveAccounts(accounts);

  sessionStorage.setItem('cos_user', JSON.stringify({ id: newAcc.id, name, email, provider: 'email' }));

  const okEl = document.getElementById('form-ok');
  okEl.classList.remove('hidden');
  this.style.opacity = '0.4';
  this.style.pointerEvents = 'none';

  setTimeout(() => { window.location.href = '../index.html'; }, 1500);
});

/* ── Google Sign-In — só pede e-mail e senha, sem popup externo ── */
const CadastroAuth = {
  googleSignIn() {
    const old = document.getElementById('gm-cad');
    if (old) old.remove();

    const m = document.createElement('div');
    m.id = 'gm-cad';
    m.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)';
    m.innerHTML = `
      <div style="background:#0a0604;border:1px solid rgba(201,168,76,0.4);border-radius:4px;padding:2rem;width:min(360px,92vw);display:flex;flex-direction:column;gap:1rem;box-shadow:0 0 50px rgba(122,0,0,0.4)">
        <div style="font-family:'Cinzel',serif;color:#c9a84c;font-size:1rem;font-weight:900;text-align:center">⚔ Cadastro com Google</div>
        <p style="color:#a08060;font-size:0.85rem;text-align:center;line-height:1.5">Preencha seus dados para criar a conta.</p>
        <input id="gm-cad-name"  type="text"     placeholder="Nome de aventureiro"   style="background:rgba(0,0,0,0.6);border:1px solid rgba(106,80,64,0.5);border-radius:4px;color:#e8d5b0;padding:0.65rem 1rem;font-family:inherit;font-size:0.9rem;width:100%;outline:none" />
        <input id="gm-cad-email" type="email"    placeholder="Seu e-mail"             style="background:rgba(0,0,0,0.6);border:1px solid rgba(106,80,64,0.5);border-radius:4px;color:#e8d5b0;padding:0.65rem 1rem;font-family:inherit;font-size:0.9rem;width:100%;outline:none" />
        <input id="gm-cad-pass"  type="password" placeholder="Crie uma senha (mín. 8)" style="background:rgba(0,0,0,0.6);border:1px solid rgba(106,80,64,0.5);border-radius:4px;color:#e8d5b0;padding:0.65rem 1rem;font-family:inherit;font-size:0.9rem;width:100%;outline:none" />
        <div id="gm-cad-err" style="color:#c0392b;font-size:0.75rem;text-align:center;display:none"></div>
        <button onclick="CadastroAuth._confirm()" style="font-family:'Cinzel',serif;font-size:0.8rem;font-weight:700;letter-spacing:1px;color:#e8d5b0;background:linear-gradient(135deg,#7a0000,#4a0000);padding:0.75rem;border-radius:4px;border:1px solid #8b6914;cursor:pointer">⚔ Criar Conta</button>
        <button onclick="document.getElementById('gm-cad').remove()" style="background:none;border:none;color:#6a5040;font-size:0.72rem;cursor:pointer;font-family:'Cinzel',serif">← Cancelar</button>
      </div>`;
    document.body.appendChild(m);
    setTimeout(() => { const el = document.getElementById('gm-cad-name'); if(el) el.focus(); }, 100);
  },

  async _confirm() {
    const name  = (document.getElementById('gm-cad-name').value  || '').trim();
    const email = (document.getElementById('gm-cad-email').value || '').trim().toLowerCase();
    const pass  = (document.getElementById('gm-cad-pass').value  || '');
    const errEl = document.getElementById('gm-cad-err');
    errEl.style.display = 'none';

    if (!name)                          { errEl.textContent = '⚔ Informe seu nome.';           errEl.style.display = 'block'; return; }
    if (!email || !email.includes('@')) { errEl.textContent = '⚔ E-mail inválido.';            errEl.style.display = 'block'; return; }
    if (pass.length < 8)                { errEl.textContent = '⚔ Senha: mínimo 8 caracteres.'; errEl.style.display = 'block'; return; }

    const accounts = getAccounts();
    if (accounts.find(a => a.email === email)) {
      errEl.textContent = '⚔ E-mail já cadastrado. Faça login.';
      errEl.style.display = 'block';
      return;
    }

    const hash   = await hashPass(pass);
    const newAcc = { id: Date.now().toString(), name, email, password: hash, provider: 'google', createdAt: new Date().toISOString() };
    accounts.push(newAcc);
    saveAccounts(accounts);
    sessionStorage.setItem('cos_user', JSON.stringify({ id: newAcc.id, name, email, provider: 'google' }));

    document.getElementById('gm-cad').remove();
    setTimeout(() => { window.location.href = '../index.html'; }, 300);
  }
};
