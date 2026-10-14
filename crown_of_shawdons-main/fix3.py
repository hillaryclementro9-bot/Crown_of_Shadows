import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open(r'js\opening.js', 'rb') as f:
    raw = f.read()
main = raw.decode('utf-8', errors='replace')

old = "    const dest = this._config.afterCinematic;\r\r\n    if (typeof App !== 'undefined' && App.show) {"
new = "    // Se ja tem sessao ativa (vindo do cadastro), vai direto pro board\r\r\n    const hasSession = !!sessionStorage.getItem('cos_user');\r\r\n    const dest = hasSession ? 'board' : this._config.afterCinematic;\r\r\n    if (typeof App !== 'undefined' && App.show) {"

if old in main:
    main = main.replace(old, new)
    print('opening.js: corrigido')
else:
    print('ERRO: trecho nao encontrado')
    idx = main.find('afterCinematic')
    print('afterCinematic at:', idx)
    print(repr(main[idx-10:idx+120]))

with open(r'js\opening.js', 'wb') as f:
    f.write(main.encode('utf-8'))
print('done')
