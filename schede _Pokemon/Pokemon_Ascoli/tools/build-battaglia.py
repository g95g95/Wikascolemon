#!/usr/bin/env python
"""Ritaglia i fogli di sprite di battaglia generati (tools/sorgenti/battaglia-*.png) in
assets/battle/<id>-front.png e <id>-back.png (64×64, 15 colori + trasparente).

Foglio sorgente: griglia 4×4 su fondo magenta. Ogni riga ha due creature; per ciascuna, a sinistra la
vista di fronte e a destra quella di spalle. L'ordine delle creature va scritto qui sotto guardando il
foglio: il generatore non sempre rispetta quello chiesto.

Uso: python -I tools/build-battaglia.py   (richiede Pillow)
"""
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'sorgenti')
OUT = os.path.join(HERE, '..', 'assets', 'battle')
SIZE = 64

# foglio → specie nell'ordine di lettura (riga per riga, due per riga)
SHEETS = [
    ('battaglia-1.png', ['ciccharizard', 'coperto', 'cavedone', 'sbandiera', 'capultra', 'quintanaro', 'tifotto', 'sciarpone']),
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


def sprite(figure):
    scale = (SIZE - 2) / max(figure.size)
    size = (max(1, round(figure.width * scale)), max(1, round(figure.height * scale)))
    small = figure.convert('RGBa').resize(size, Image.BOX).convert('RGBA')
    alpha = small.getchannel('A').point(lambda a: 255 if a >= 128 else 0)
    rgb = small.convert('RGB').quantize(colors=15, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    small = Image.merge('RGBA', (*rgb.split(), alpha))
    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(small, ((SIZE - size[0]) // 2, SIZE - 1 - size[1]))
    return canvas


for name, species in SHEETS:
    source = Image.open(os.path.join(SRC, name)).convert('RGB')
    cw, ch = source.width / 4, source.height / 4
    for index, species_id in enumerate(species):
        row, col = index // 2, (index % 2) * 2
        for offset, side in enumerate(('front', 'back')):
            box = (round((col + offset) * cw), round(row * ch), round((col + offset + 1) * cw), round((row + 1) * ch))
            sprite(cutout(source.crop(box))).save(os.path.join(OUT, f'{species_id}-{side}.png'))
        print('OK', species_id)
