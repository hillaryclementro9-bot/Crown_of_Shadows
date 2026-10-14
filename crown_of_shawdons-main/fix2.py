import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open(r'js\main.js', 'rb') as f:
    raw = f.read()
main = raw.decode('utf-8', errors='replace')

old = "    const hash = await DB.hashPass(pass);\r\r\n    if (acc.password !== hash)          { errEl.textContent = 'Senha incorreta.';           errEl.style.display = 'block'; return; }"
new = "    const _hbuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pass));\r\r\n    const hash = Array.from(new Uint8Array(_hbuf)).map(b=>b.toString(16).padStart(2,'0')).join('');\r\r\n    if (acc.password !== hash)          { errEl.textContent = 'Senha incorreta.';           errEl.style.display = 'block'; return; }"

if old in main:
    main = main.replace(old, new)
    print('_confirmGoogle hash: corrigido')
else:
    print('ERRO: trecho nao encontrado')
    # mostra contexto
    idx = main.find('DB.hashPass(pass);\r\r\n    if (acc.password')
    print('idx:', idx)
    if idx != -1:
        print(repr(main[idx-20:idx+200]))

with open(r'js\main.js', 'wb') as f:
    f.write(main.encode('utf-8'))
print('done')
