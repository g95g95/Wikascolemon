#!/usr/bin/env python
"""Riallinea i fogli dei personaggi (assets/npc/*.png) alla griglia 4×4 di celle 32×32.

Alcuni fogli vecchi hanno le righe a passo diverso da 32 pixel: una vista sborda nella cella di
quella accanto e in gioco compare un pezzo di cappello sotto i piedi (il DJ sulla costa). Per ogni
foglio: trova le quattro fasce orizzontali in cui stanno gli sprite e rimette ogni vista nella sua
cella con i piedi sulla stessa riga.

I fogli già a posto restano identici: si può rilanciare quando si vuole.
Uso: python -I tools/allinea-npc.py [nome ...]   (senza nomi: tutti; richiede Pillow)
"""
import os
import sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
NPC = os.path.join(HERE, '..', 'assets', 'npc')
FEET_Y = 29   # riga dei piedi dentro la cella 32×32 (la stessa di tools/build-npc.py)


def bands(profile):
    """Tratti consecutivi non vuoti di `profile`, come coppie (inizio, fine esclusa)."""
    found, start = [], None
    for index, value in enumerate(list(profile) + [0]):
        if value and start is None:
            start = index
        if not value and start is not None:
            found.append((start, index))
            start = None
    return found


def sprite_rows(alpha, width, height):
    """Le fasce degli sprite: i tratti alti almeno 10 righe, più eventuali scarpe staccate subito sotto."""
    rows = []
    for top, bottom in bands([sum(1 for x in range(width) if alpha.getpixel((x, y))) for y in range(height)]):
        if bottom - top >= 10:
            rows.append((top, bottom))
        elif rows and bottom - top >= 3 and top - rows[-1][1] <= 4:
            rows[-1] = (rows[-1][0], bottom)   # scarpe staccate dal corpo
        # il resto (una o due righe isolate) sono briciole del ritaglio: via
    return rows


def realign(path):
    sheet = Image.open(path).convert('RGBA')
    rows = sprite_rows(sheet.getchannel('A'), sheet.width, sheet.height)
    if len(rows) != 4:
        return f'saltato: {len(rows)} fasce invece di 4'
    out = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
    for row, (top, bottom) in enumerate(rows):
        # solo in verticale: ogni vista resta nella sua colonna, alla stessa distanza dal bordo
        for col in range(4):
            sprite = sheet.crop((col * 32, top, col * 32 + 32, bottom))
            box = sprite.getbbox()
            if box:
                out.alpha_composite(sprite.crop((0, box[1], 32, box[3])), (col * 32, row * 32 + FEET_Y - (box[3] - box[1])))
    changed = out.tobytes() != sheet.tobytes() or sheet.size != out.size
    if changed:
        out.save(path)
    return 'riallineato' if changed else 'invariato'


names = sys.argv[1:] or sorted(name[:-4] for name in os.listdir(NPC) if name.endswith('.png'))
for name in names:
    print(name.ljust(16), realign(os.path.join(NPC, name + '.png')))
