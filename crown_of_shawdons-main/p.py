import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open('js/main.js', 'rb') as f:
    raw = f.read()
text = raw.decode('utf-8', errors='replace')

i = text.find('async loginEmail')
print('=== loginEmail ===')
print(text[i:i+900])
print()
i2 = text.rfind('const _origShow')
print('=== App.show wrapper ===')
print(text[i2:i2+400])
