"""Sprite di battaglia PROVVISORIO ricavato dall'artwork della wiki (64×64, 15 colori + trasparente).

Uso: python tools/sprite-da-artwork.py <id> [<id> ...]
Scrive assets/battle/<id>-front.png e <id>-back.png (uguali: il retro vero va disegnato).
Serve quando una specie non ha sprite o ha quello sbagliato; non sostituisce uno sprite fatto a mano.
"""
import base64, io, re, sys
from pathlib import Path
from PIL import Image, ImageDraw

GIOCO = Path(__file__).resolve().parent.parent
WIKI = GIOCO.parent.parent / 'Wikascolemon'
LATO = 64


def artwork(species_id):
    testo = (WIKI / f'{species_id}.html').read_text(encoding='utf-8')
    dati = re.search(r'<img src="data:image/[a-z]+;base64,([^"]+)"', testo).group(1)
    return Image.open(io.BytesIO(base64.b64decode(dati))).convert('RGB')


def senza_sfondo(immagine):
    """Toglie lo sfondo chiaro partendo dal bordo: il bianco DENTRO la figura resta."""
    chiave = (255, 0, 255)
    largo, alto = immagine.size
    bordo = [(x, y) for x in range(0, largo, 4) for y in (0, alto - 1)] + [(x, y) for y in range(0, alto, 4) for x in (0, largo - 1)]
    for punto in bordo:
        if min(immagine.getpixel(punto)) > 225:
            ImageDraw.floodfill(immagine, punto, chiave, thresh=40)
    rgba = immagine.convert('RGBA')
    rgba.putdata([(0, 0, 0, 0) if p[:3] == chiave else p for p in rgba.getdata()])
    return rgba.crop(rgba.getbbox())


def sprite(species_id):
    figura = senza_sfondo(artwork(species_id))
    scala = (LATO - 2) / max(figura.size)
    figura = figura.resize((max(1, round(figura.width * scala)), max(1, round(figura.height * scala))), Image.LANCZOS)
    alfa = figura.getchannel('A').point(lambda a: 255 if a > 127 else 0)
    colori = figura.convert('RGB').quantize(15, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGBA')
    colori.putalpha(alfa)
    quadro = Image.new('RGBA', (LATO, LATO), (0, 0, 0, 0))
    quadro.alpha_composite(colori, ((LATO - colori.width) // 2, LATO - 1 - colori.height))
    return quadro


for species_id in sys.argv[1:]:
    immagine = sprite(species_id)
    for lato in ('front', 'back'):
        immagine.save(GIOCO / 'assets' / 'battle' / f'{species_id}-{lato}.png')
    print(species_id, 'fatto')
