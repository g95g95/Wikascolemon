#!/usr/bin/env python
"""Ritaglia i fogli di personaggi generati (tools/sorgenti/npc-*.png) in assets/npc/<nome>.png.

Foglio sorgente: griglia 4×4 su fondo magenta, una RIGA per personaggio con quattro viste nell'ordine
fronte, retro, sinistra, destra. Foglio di gioco: 128×128, celle 32×32, righe giù / su / sinistra /
destra (come assets/player/oliver-sheet.png); i passanti non camminano, quindi le quattro colonne
ripetono la stessa posa. Genera anche cartello.png dall'oggetto «cartello» di oggetti.png, per gli
NPC che in realtà sono cartelli.

Uso: python -I tools/build-npc.py   (richiede Pillow; lanciare dopo build-oggetti.py)
"""
import os
import re
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'sorgenti')
OUT = os.path.join(HERE, '..', 'assets', 'npc')
HEIGHT = 25        # altezza del personaggio in px di gioco
FEET_Y = 27        # riga dei piedi dentro la cella 32×32

# foglio → nomi dei personaggi, una riga ciascuno
SHEETS = [
    ('npc-1.png', ['anziano', 'signora', 'ragazzo', 'infermiera']),
    ('npc-2.png', ['barista', 'gitante', 'bambina', 'vigile']),
]


def is_background(r, g, b):
    return r > 150 and b > 150 and g < 110 and abs(r - b) < 90


def cutout(cell):
    cell = cell.convert('RGBA')
    px = cell.load()
    for y in range(cell.height):
        for x in range(cell.width):
            r, g, b, _ = px[x, y]
            if is_background(r, g, b):
                px[x, y] = (0, 0, 0, 0)
    return cell.crop(cell.getbbox())


def shrink(img, height):
    width = max(1, round(img.width * height / img.height))
    img = img.convert('RGBa').resize((width, height), Image.BOX).convert('RGBA')
    alpha = img.getchannel('A').point(lambda a: 255 if a >= 128 else 0)
    rgb = img.convert('RGB').quantize(colors=20, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    return Image.merge('RGBA', (*rgb.split(), alpha))


def sheet_from(views):
    """views: 4 immagini (giù, su, sinistra, destra) → foglio 128×128."""
    sheet = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
    for row, view in enumerate(views):
        for col in range(4):
            sheet.alpha_composite(view, (col * 32 + 16 - view.width // 2, row * 32 + FEET_Y - view.height))
    return sheet


for name, characters in SHEETS:
    source = Image.open(os.path.join(SRC, name)).convert('RGB')
    cw, ch = source.width / 4, source.height / len(characters)
    for row, character in enumerate(characters):
        views = [shrink(cutout(source.crop((round(c * cw), round(row * ch), round((c + 1) * cw), round((row + 1) * ch)))), HEIGHT) for c in range(4)]
        sheet_from(views).save(os.path.join(OUT, character + '.png'))
        print('OK', character)

# cartello: stesso oggetto in tutte le direzioni
tiles = open(os.path.join(HERE, '..', 'tiles.js'), encoding='utf-8').read()
x, y, w, h = map(int, re.search(r'cartello: \[(\d+), (\d+), (\d+), (\d+)\]', tiles).groups())
sign = Image.open(os.path.join(HERE, '..', 'assets', 'tiles', 'oggetti.png')).convert('RGBA').crop((x, y, x + w, y + h))
sheet_from([sign] * 4).save(os.path.join(OUT, 'cartello.png'))
print('OK cartello')
