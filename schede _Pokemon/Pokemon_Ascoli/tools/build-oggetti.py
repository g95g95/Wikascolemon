#!/usr/bin/env python
"""Ritaglia i fogli generati (tools/sorgenti/*.png) e monta assets/tiles/oggetti.png.

Ogni foglio è una griglia di celle su fondo magenta, un oggetto per cella. Per ogni oggetto:
scontorno dal magenta, ritaglio, riduzione alla misura di gioco (celle da 16 px), alfa netto e
palette ridotta. Le posizioni nel foglio finale sono stampate a fine esecuzione e vanno tenute
allineate con la costante OBJECTS di game.js.

Uso: python -I tools/build-oggetti.py   (richiede Pillow)
"""
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'sorgenti')
OUT = os.path.join(HERE, '..', 'assets', 'tiles', 'oggetti.png')

# foglio, griglia, e per ogni cella (riga, colonna): nome, larghezza e altezza massime in px di gioco.
# texture=True: la cella è piena da bordo a bordo e va ridotta così com'è (niente scontorno).
SHEETS = [
    ('oggetti-1.png', 4, 4, [
        (0, 0, 'albero', 32, 32, False), (0, 1, 'cespuglio', 16, 16, False),
        (0, 2, 'masso', 16, 16, False), (0, 3, 'fiori', 16, 16, False),
        (1, 0, 'porta', 16, 24, False), (1, 1, 'porta_negozio', 24, 24, False),
        (1, 2, 'porta_chiesa', 24, 28, False), (1, 3, 'finestra', 24, 16, False),
        (2, 0, 'vetrina', 32, 24, False), (2, 1, 'tetto', 32, 32, True),
        (2, 2, 'muro_pietra', 32, 32, True), (2, 3, 'muro_mattoni', 32, 32, True),
        (3, 0, 'lampione', 16, 32, False), (3, 1, 'panchina', 32, 24, False),
        (3, 2, 'cartello', 24, 24, False), (3, 3, 'fontana', 32, 32, False),
    ]),
]


def is_background(r, g, b):
    return r > 150 and b > 150 and g < 110 and abs(r - b) < 90


def cutout(cell):
    """RGBA con alfa 0 sul magenta (anche quello sfumato lungo i contorni)."""
    cell = cell.convert('RGBA')
    px = cell.load()
    for y in range(cell.height):
        for x in range(cell.width):
            r, g, b, _ = px[x, y]
            if is_background(r, g, b):
                px[x, y] = (0, 0, 0, 0)
    return cell


def shrink(img, width, height):
    """Riduce con media pesata sull'alfa, poi rende l'alfa netto e limita i colori."""
    img = img.convert('RGBa').resize((width, height), Image.BOX).convert('RGBA')
    alpha = img.getchannel('A').point(lambda a: 255 if a >= 128 else 0)
    rgb = img.convert('RGB').quantize(colors=24, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    out = Image.merge('RGBA', (*rgb.split(), alpha))
    return out


placed = []
for name, rows, cols, cells in SHEETS:
    sheet = Image.open(os.path.join(SRC, name)).convert('RGB')
    cw, ch = sheet.width / cols, sheet.height / rows
    for row, col, key, max_w, max_h, texture in cells:
        cell = sheet.crop((round(col * cw), round(row * ch), round((col + 1) * cw), round((row + 1) * ch)))
        if texture:
            inset = round(cw * .03)
            piece = cell.crop((inset, inset, cell.width - inset, cell.height - inset)).resize((max_w, max_h), Image.BOX)
            piece = piece.quantize(colors=16, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGBA')
        else:
            cut = cutout(cell)
            cut = cut.crop(cut.getbbox())
            scale = min(max_w / cut.width, max_h / cut.height)
            piece = shrink(cut, max(1, round(cut.width * scale)), max(1, round(cut.height * scale)))
        placed.append((key, piece))

# impacchettamento semplice a scaffali su un foglio largo 256
WIDTH = 256
x = y = shelf = 0
positions = {}
for key, piece in placed:
    if x + piece.width > WIDTH:
        x, y, shelf = 0, y + shelf, 0
    positions[key] = (x, y, piece.width, piece.height)
    x += piece.width
    shelf = max(shelf, piece.height)
atlas = Image.new('RGBA', (WIDTH, y + shelf), (0, 0, 0, 0))
for key, piece in placed:
    atlas.paste(piece, positions[key][:2])
atlas.save(OUT)
print('OK', os.path.normpath(OUT), atlas.size)
print('const OBJECTS = {')
for key, rect in positions.items():
    print(f"    {key}: [{', '.join(str(v) for v in rect)}],")
print('};')
