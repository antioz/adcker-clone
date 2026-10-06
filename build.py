"""Собирает index.html из сохранённой разметки adcker.com (source-adcker.html):
без прелоадера, без футера, видео и фото заменены на assets/img/photo-*.jpg."""
import re, pathlib
here = pathlib.Path(__file__).parent
h = (here / 'source-adcker.html').read_text()

body = h[h.find('<body'):h.find('</body>')]
body = re.sub(r'<script.*?</script>', '', body, flags=re.S)

def div_end(s, marker):
    """Индекс сразу после </div>, закрывающего <div ...marker...>."""
    i = s.rfind('<div', 0, s.find(marker)); depth = 0
    for t in re.finditer(r'<(/?)div\b', s[i:]):
        depth += -1 if t.group(1) else 1
        if depth == 0:
            return i + t.start() + s[i + t.start():].find('>') + 1

def cut_div(s, marker):
    """Вырезает <div ...marker...>...</div> целиком, считая вложенность."""
    i = s.find(marker); i = s.rfind('<div', 0, i)
    depth, j = 0, i
    for t in re.finditer(r'<(/?)div\b', s[i:]):
        depth += -1 if t.group(1) else 1
        if depth == 0:
            j = i + s[i + t.start():].find('>') + t.start() + 1; break
    return s[:i] + s[j:]

body = cut_div(body, 'js-preloader ')
body = cut_div(body, 'fixed -z-[9999] invisible')
body = cut_div(body, 'js-footer-bar ')
body = body.replace('aria-hidden="" style="display: none;"', '')

# --- тексты ---
for a, b in [('> The Art</div>', '> Говорил я</div>'), ('> of</div>', '> вам</div>'),
             ('> Hacking</div>', '> Не прислу-</div>'), ('> We’re built for</div>', '> а вы как всегда</div>'),
             ('> Social</div>', '> шались</div>'), ('> Showreel</div>', '> Antiosov</div>')]:
    assert a in body, a
    body = body.replace(a, b)
# логотип adcker (svg) -> текст Antiosov
i = body.find('aria-label="Adcker"'); j = body.find('</a>', i)
logo = re.sub(r'<svg.*?</svg>', 'Antiosov', body[i:j], flags=re.S)
body = body[:i] + logo.replace('Adcker', 'Antiosov') + body[j:]
body = body.replace('max-w-[70px] [&_path]:fill-white', '[&_path]:fill-white')
# блок For Beauty / Fashion / Wellness — убран
i = body.find('<h2 class="flex flex-col gap-y-2 justify-center items-center py-[15px] overflow-hidden">')
body = body[:i] + body[body.find('</h2>', i) + 5:]
a = 'In a world where everyone is trying to do everything, we choose to specialize in the beauty, fashion, and wellness industries.'
assert a in body
body = body.replace(a, 'Все, что может быть посчитано и алгоритмизировано, будет алгоритмизировано и посчитано — не там ищете.')
# «More about us» -> «ко мне», на канал «Да, Антиосов»
i = body.find('<a href="https://adcker.com/about/" class="body-link'); j = body.find('</a>', i)
link = body[i:j].replace('https://adcker.com/about/', 'https://t.me/antiosov').replace('target=""', 'target="_blank" rel="noopener"')
assert link.count('More about us') == 2
body = body[:i] + link.replace('More about us', 'ко мне') + body[j:]
# дисклеймер внизу
DISCLAIMER = ('<p class="disclaimer">Я не пытаюсь украсть у вас ваш дизайн, это просто исследовательский эксперимент. '
              'Оригинал — <a href="https://adcker.com/" target="_blank" rel="noopener">adcker.com</a></p>')
i = div_end(body, 'js-blocks '); body = body[:i] + DISCLAIMER + body[i:]

FAKE = ('<div class="{cls} fake-video">'
        '<img src="assets/img/photo-1.jpg" alt=""><img src="assets/img/photo-2.jpg" alt=""></div>')
def video(m):
    cls = re.search(r'class="([^"]*)"', m.group(0)).group(1)
    return FAKE.format(cls=cls)
body = re.sub(r'<video[^>]*></video>', video, body)

n = [0]
def img(m):
    n[0] += 1
    return re.sub(r'src="[^"]*"', f'src="assets/img/photo-{2 - n[0] % 2}.jpg"', m.group(0))
body = re.sub(r'<img [^>]*b-cdn[^>]*>', img, body)

page = f'''<!doctype html><html lang="ru" class="overflow-x-hidden is-device-desktop" style="background-color:#EFEDEA;opacity:0;transition:opacity .3s">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width">
<title>Antiosov — Говорил я вам</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@700&family=Inter:wght@500;600&family=Noto+Serif+Display:wdth,wght@62.5..100,300..700&display=block">
<link rel="stylesheet" href="assets/site.css"><link rel="stylesheet" href="assets/clone.css">
</head>
{body}
<script src="assets/vendor.js"></script><script src="assets/clone.js"></script>
</body></html>'''
(here / 'index.html').write_text(page)

# --- CSS: платные шрифты adcker -> свободные с кириллицей ---
css = (here / 'source-adcker.css').read_text()
css = re.sub(r'@import url\("https://fonts.googleapis.com/css2\?family=Kumbh[^;]*;', '', css)
css = re.sub(r'@font-face\{font-family:(psl|psr|nhm);[^}]*\}', '', css)
for a, b in [('Kumbh Sans,sans-serif', 'Jost,sans-serif'), ('nhm,sans-serif', 'Inter,sans-serif'),
             ('psl,serif', '"Noto Serif Display",serif'), ('psr,serif', '"Noto Serif Display",serif')]:
    css = css.replace(a, b)
(here / 'assets' / 'site.css').write_text(css)
print('imgs', n[0], 'videos', page.count('fake-video'), 'len', len(page))
