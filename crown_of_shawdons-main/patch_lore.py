import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open('index.html', 'rb') as f:
    raw = f.read()
text = raw.decode('utf-8', errors='replace')

idx = text.find('cadastro')
print('cadastro at:', idx)
if idx > 0:
    print(text[idx-80:idx+120])

# also check criar conta
idx2 = text.find('Criar conta')
print('Criar conta at:', idx2)
if idx2 > 0:
    print(text[idx2-40:idx2+80])
