with open('html/cadastro.html', 'rb') as f:
    raw = f.read()
text = raw.decode('utf-8', errors='replace')

# remove divisor OU + botão google inteiros
import re
# remove o bloco do divisor-or e btn-google
text = re.sub(
    r'\s*<!-- Divisor OU -->.*?</button>\s*\n',
    '\n',
    text, flags=re.DOTALL
)

# fallback: remove manualmente se regex não pegou
if 'btn-google' in text:
    start = text.find('\n      <!-- Divisor OU -->')
    if start < 0:
        start = text.find('\n      <div class="divider-or">')
    end = text.find('</button>', text.find('btn-google')) + len('</button>')
    if start > 0 and end > start:
        text = text[:start] + '\n' + text[end:]

with open('html/cadastro.html', 'wb') as f:
    f.write(text.encode('utf-8'))

print('google removed:', 'btn-google' not in text)
