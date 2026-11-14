#!/usr/bin/env python
"""Genera l'atlante PROVVISORIO dei tile (assets/tiles/tileset.png), disegnato in codice.

Serve a far girare il motore a tileset in attesa dell'atlante definitivo: chi lo sostituisce deve
rispettare la stessa griglia (celle 16x16, 16 colonne) e le stesse posizioni, elencate in TILES
dentro game.js. Grafica originale, nessun asset di terzi.

Uso: python tools/build-tileset.py   (richiede Pillow)
"""
import os
import random
from PIL import Image

T = 16
COLS, ROWS = 16, 4
random.seed(7)
atlas = Image.new('RGBA', (COLS * T, ROWS * T), (0, 0, 0, 0))


def rgb(h):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 255)


G_LIGHT, G_MID, G_DARK, G_DEEP = rgb('#8fd868'), rgb('#74c454'), rgb('#58a840'), rgb('#3c8030')
TALL, TALL_DARK, TALL_LIGHT = rgb('#4c9c3c'), rgb('#2c6c2c'), rgb('#84d060')
PATH, PATH_DARK, PATH_LIGHT = rgb('#e4cc94'), rgb('#c8ac70'), rgb('#f0deb0')
SAND, SAND_DARK, SAND_LIGHT = rgb('#f0e0a4'), rgb('#d8c484'), rgb('#fbf0c8')
W_MID, W_LIGHT, W_DARK, W_FOAM = rgb('#5c9ce8'), rgb('#90c4f8'), rgb('#4480d0'), rgb('#e0f0ff')
SEA, SEA_LIGHT, SEA_DARK = rgb('#3c84c8'), rgb('#70b0e8'), rgb('#2c68a8')
CLEAR = (0, 0, 0, 0)


def tile(fill=CLEAR):
    return Image.new('RGBA', (T, T), fill)


def put(img, x, y, color):
    if 0 <= x < T and 0 <= y < T:
        img.putpixel((x, y), color)


def speckle(img, color, count, w=1, h=1):
    for _ in range(count):
        x, y = random.randrange(T), random.randrange(T)
        for dx in range(w):
            for dy in range(h):
                put(img, x + dx, y + dy, color)


def place(img, col, row):
    atlas.paste(img, (col * T, row * T))


def grass(tufts=0, flower=False):
    img = tile(G_MID)
    speckle(img, G_LIGHT, 7)
    speckle(img, G_DARK, 4)
    for _ in range(tufts):
        x, y = random.randrange(2, 12), random.randrange(4, 13)
        for dx, dy in ((0, 0), (1, -1), (2, 0), (1, 1)):
            put(img, x + dx, y + dy, G_DARK)
        put(img, x + 1, y, G_LIGHT)
    if flower:
        for cx, cy, c in ((4, 5, rgb('#f8f8f0')), (11, 10, rgb('#f8d048'))):
            for dx, dy in ((0, -1), (-1, 0), (1, 0), (0, 1)):
                put(img, cx + dx, cy + dy, c)
            put(img, cx, cy, rgb('#e86048'))
    return img


def tall_grass(front=False):
    """Ciuffi d'erba alta. front=True: solo la metà bassa, da disegnare sopra i piedi."""
    img = tile(CLEAR if front else G_MID)
    for by in (7, 15):
        if front and by == 7:
            continue
        for bx in range(0, T, 4):
            off = 2 if by == 7 else 0
            x = (bx + off) % T
            for i, (dx, hgt) in enumerate(((0, 5), (1, 7), (2, 6), (3, 4))):
                for k in range(hgt):
                    c = TALL_LIGHT if (i == 1 and k >= hgt - 2) else (TALL_DARK if i in (0, 3) or k == 0 else TALL)
                    put(img, (x + dx) % T, by - k, c)
    return img


def path(base=PATH, dark=PATH_DARK, light=PATH_LIGHT, pebbles=5):
    img = tile(base)
    speckle(img, dark, pebbles, 2, 1)
    speckle(img, light, pebbles)
    return img


def paved(base, line, block_w=8, block_h=8, offset=True):
    img = tile(base)
    for y in range(T):
        for x in range(T):
            row = y // block_h
            shift = (block_w // 2) if (offset and row % 2) else 0
            if y % block_h == block_h - 1 or (x + shift) % block_w == block_w - 1:
                put(img, x, y, line)
    return img


def water(frame, mid=W_MID, light=W_LIGHT, dark=W_DARK):
    img = tile(mid)
    for y, x0, n in ((3, 2, 5), (8, 9, 5), (12, 1, 4)):
        for i in range(n):
            put(img, (x0 + i + frame * 4) % T, y, light)
        put(img, (x0 + n + frame * 4) % T, y + 1, dark)
        put(img, (x0 - 1 + frame * 4) % T, y + 1, dark)
    return img


def tree():
    img = Image.new('RGBA', (T, 2 * T), CLEAR)
    out, dark, mid, light = rgb('#1c4c24'), rgb('#2c7030'), rgb('#44983c'), rgb('#70c458')
    cx, cy, rx, ry = 7.5, 12.5, 7.6, 11.2
    for y in range(2 * T):
        for x in range(T):
            d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
            if d > 1:
                continue
            shade = (x - cx) / rx * .5 + (y - cy) / ry * .8
            c = light if shade < -.45 else mid if shade < .25 else dark
            if d > .8:
                c = out
            img.putpixel((x, y), c)
    # ciuffi di foglie: archetti chiari con ombra sotto
    for ax, ay in ((4, 6), (9, 4), (6, 11), (11, 10), (3, 15), (9, 16), (6, 20)):
        for dx in range(3):
            if img.getpixel((ax + dx, ay))[3]:
                img.putpixel((ax + dx, ay), light)
            if ay + 1 < 2 * T and img.getpixel((ax + dx, ay + 1))[3] and dx != 1:
                img.putpixel((ax + dx, ay + 1), dark)
    # tronco
    for y in range(23, 31):
        for x in range(6, 10):
            img.putpixel((x, y), rgb('#6c4428') if x in (6, 9) else rgb('#946038'))
    for x in range(4, 12):
        img.putpixel((x, 30), rgb('#4c8c38'))  # ombra a terra
    return img


def fringe_edge(top, outline, rim=None):
    """Bordo sul lato nord: una fascia del terreno vicino che invade la cella, con profilo ondulato."""
    img = tile()
    wave = [3, 3, 2, 2, 3, 4, 4, 3, 2, 2, 3, 3, 4, 4, 3, 2]
    for x in range(T):
        for y in range(wave[x]):
            put(img, x, y, top)
        put(img, x, wave[x], outline)
        if rim:
            put(img, x, wave[x] + 1, rim)
    return img


def fringe_corner(top, outline, rim=None):
    """Angolo interno nord-est: spicchio quando il vicino è solo in diagonale."""
    img = tile()
    for y in range(5):
        for x in range(T - 5, T):
            d = (T - 1 - x) + y
            if d < 3:
                put(img, x, y, top)
            elif d == 3:
                put(img, x, y, outline)
            elif d == 4 and rim:
                put(img, x, y, rim)
    return img


def place_fringe(col, row, top, outline, rim=None):
    edge, corner = fringe_edge(top, outline, rim), fringe_corner(top, outline, rim)
    for i, angle in enumerate((0, -90, 180, 90)):  # N, E, S, W  /  NE, SE, SW, NW
        place(edge.rotate(angle), col + i, row)
        place(corner.rotate(angle), col + 4 + i, row)


# --- riga 0: terreni ---
place(grass(), 0, 0)
place(grass(tufts=2), 1, 0)
place(grass(tufts=1, flower=True), 2, 0)
place(tall_grass(), 3, 0)
place(path(), 4, 0)
place(paved(rgb('#e0d4b4'), rgb('#bcae8c')), 5, 0)                    # piazza
place(paved(rgb('#d0c8b4'), rgb('#a89c84'), 16, 8), 6, 0)             # travertino
asfalto = tile(rgb('#58585c'))
speckle(asfalto, rgb('#68686c'), 8)
speckle(asfalto, rgb('#48484c'), 6)
place(asfalto, 7, 0)
place(path(rgb('#b8b0a0'), rgb('#989080'), rgb('#d0c8b8'), 9), 8, 0)  # ghiaia
place(paved(rgb('#e8dcc0'), rgb('#c8b898'), 8, 8, False), 9, 0)       # pavimento
place(path(SAND, SAND_DARK, SAND_LIGHT, 4), 10, 0)
pendio = grass()
for x in range(T):
    for y in (2, 7, 12):
        if (x + y) % 5 < 3:
            put(pendio, x, y + (x % 3 == 0), G_DEEP)
place(pendio, 11, 0)
place(paved(rgb('#8c8478'), rgb('#5c564c'), 8, 4), 12, 0)             # muro
binari = path(rgb('#a09888'), rgb('#807868'), rgb('#b8b0a0'), 8)
for x in (1, 6, 11):
    for y in range(T):
        put(binari, x, y, rgb('#6c5038'))
        put(binari, x + 1, y, rgb('#80603c'))
for y in (3, 12):
    for x in range(T):
        put(binari, x, y, rgb('#d8d8dc'))
        put(binari, x, y + 1, rgb('#58585c'))
place(binari, 13, 0)
bridge = tile(rgb('#b88850'))
for y in range(T):
    for x in range(T):
        if x % 4 == 3:
            put(bridge, x, y, rgb('#946838'))
        if y in (0, 15):
            put(bridge, x, y, rgb('#6c4828'))
        if y in (1, 14):
            put(bridge, x, y, rgb('#d8ac70'))
place(bridge, 14, 0)
place(tall_grass(front=True), 15, 0)

# --- riga 1: acqua, albero, varianti ---
place(water(0), 0, 1)
place(water(1), 1, 1)
place(water(0, SEA, SEA_LIGHT, SEA_DARK), 2, 1)
place(water(1, SEA, SEA_LIGHT, SEA_DARK), 3, 1)
tree_img = tree()
bottom = grass()
bottom.alpha_composite(tree_img.crop((0, T, T, 2 * T)))
place(bottom, 4, 1)
place(tree_img.crop((0, 0, T, T)), 5, 1)
place(path(), 6, 1)
asfalto_b = asfalto.copy()
for x in range(5, 11):
    put(asfalto_b, x, 7, rgb('#e8e4d0'))
    put(asfalto_b, x, 8, rgb('#e8e4d0'))
place(asfalto_b, 7, 1)

# --- righe 2-3: bordi automatici (4 lati + 4 angoli interni per serie) ---
place_fringe(0, 2, G_MID, G_DEEP)                       # erba che invade sterrato/ghiaia/sabbia
place_fringe(8, 2, G_MID, rgb('#2c5c2c'), W_FOAM)       # riva erbosa sull'acqua
place_fringe(0, 3, SAND, rgb('#b89c5c'), W_FOAM)        # battigia: sabbia sull'acqua

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'tiles')
os.makedirs(out, exist_ok=True)
atlas.save(os.path.join(out, 'tileset.png'))
print('OK', os.path.normpath(os.path.join(out, 'tileset.png')), atlas.size)
