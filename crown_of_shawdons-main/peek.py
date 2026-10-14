import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open(r'js\main.js', 'rb') as f:
    raw = f.read()
main = raw.decode('utf-8', errors='replace')

start = 0
while True:
    idx = main.find('DB.hashPass', start)
    if idx == -1: break
    print(f'at {idx}:', repr(main[idx-4:idx+80]))
    start = idx + 1

# também mostra o bloco _confirmGoogle
idx2 = main.find('_confirmGoogle')
print('\n_confirmGoogle at:', idx2)
print(repr(main[idx2:idx2+600]))
