"""Copy the game from ..\mahjong into play\ with the web-version tweaks. Run: python sync_play.py"""
import shutil, os, re
src = os.path.join(os.path.dirname(__file__), '..', 'mahjong'); dst = os.path.join(os.path.dirname(__file__), 'play')
os.makedirs(dst, exist_ok=True)
for f in ['index.html', 'engine.js', 'fx.js', 'faces.js', 'states.js', 'scenery.js', 'scenery2.js', 'music.js']:
    shutil.copy(os.path.join(src, f), os.path.join(dst, f))
p = os.path.join(dst, 'index.html'); s = open(p, encoding='utf-8').read()
s = s.replace('<link rel="manifest" href="manifest.json">', '')
s = s.replace('<title>Tileberry (prototype)</title>', '<title>Tileberry: play free in your browser</title>\n<link rel="icon" href="../icon.svg">')
s = s.replace('Prototype. A tile is free when', 'A tile is free when')
import re, time
s = re.sub(r'<script src="([a-z0-9]+)\.js"></script>', lambda m: '<script src="%s.js?v=%d"></script>' % (m.group(1), int(time.time())), s)
open(p, 'w', encoding='utf-8').write(s)
print('synced', len(os.listdir(dst)), 'files')
