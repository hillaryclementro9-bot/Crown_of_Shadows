with open('js/main.js', 'rb') as f:
    raw = f.read()
text = raw.decode('utf-8', errors='replace')

# encontra o bloco App.show no final
idx = text.rfind('const _origShow = App.show.bind(App);')
end = text.find('};', idx) + 2

print('found at:', idx, 'to', end)
print(repr(text[idx:end]))
