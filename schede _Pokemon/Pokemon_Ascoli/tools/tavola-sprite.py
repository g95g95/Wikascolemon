"""Tavola di controllo: artwork della wiki accanto agli sprite di battaglia.

Uso: python tools/tavola-sprite.py <cartella di uscita> [id ...]
Scrive tavola-01.png, tavola-02.png… (12 specie per foglio: artwork | fronte | retro).
Senza id controlla tutte le specie che hanno uno sprite in assets/battle/.
"""
import base64, io, re, sys
from pathlib import Path
from PIL import Image, ImageDraw

GIOCO = Path(__file__).resolve().parent.parent
WIKI = GIOCO.parent.parent / 'Wikascolemon'
BATTLE = GIOCO / 'assets' / 'battle'
LATO, COLONNE, RIGHE = 150, 3, 4
CELLA_W, CELLA_H = LATO * 3 + 12, LATO + 22


def artwork(species_id):
    pagina = WIKI / f'{species_id}.html'
    if not pagina.exists():
        return None
    trovato = re.search(r'<img src="data:image/[a-z]+;base64,([^"]+)"', pagina.read_text(encoding='utf-8'))
    return Image.open(io.BytesIO(base64.b64decode(trovato.group(1)))).convert('RGBA') if trovato else None


def riquadro(immagine, ingrandisci):
    quadro = Image.new('RGBA', (LATO, LATO), (236, 236, 228, 255))
    if immagine is None:
        ImageDraw.Draw(quadro).text((LATO // 2 - 18, LATO // 2 - 5), 'MANCA', fill=(200, 0, 0))
        return quadro
    scala = min(LATO / immagine.width, LATO / immagine.height)
    misura = (max(1, round(immagine.width * scala)), max(1, round(immagine.height * scala)))
    immagine = immagine.resize(misura, Image.NEAREST if ingrandisci else Image.LANCZOS)
    quadro.alpha_composite(immagine, ((LATO - misura[0]) // 2, (LATO - misura[1]) // 2))
    return quadro


def sprite(species_id, lato):
    file = BATTLE / f'{species_id}-{lato}.png'
    return Image.open(file).convert('RGBA') if file.exists() else None


def main():
    uscita = Path(sys.argv[1])
    uscita.mkdir(parents=True, exist_ok=True)
    ids = sys.argv[2:] or sorted({f.name.rsplit('-', 1)[0] for f in BATTLE.glob('*-front.png')})
    per_foglio = COLONNE * RIGHE
    for inizio in range(0, len(ids), per_foglio):
        foglio = Image.new('RGBA', (CELLA_W * COLONNE, CELLA_H * RIGHE), (255, 255, 255, 255))
        penna = ImageDraw.Draw(foglio)
        for i, species_id in enumerate(ids[inizio:inizio + per_foglio]):
            x, y = (i % COLONNE) * CELLA_W, (i // COLONNE) * CELLA_H
            penna.text((x + 4, y + 4), f'{species_id}   (wiki | fronte | retro)', fill=(0, 0, 0))
            foglio.alpha_composite(riquadro(artwork(species_id), False), (x, y + 20))
            foglio.alpha_composite(riquadro(sprite(species_id, 'front'), True), (x + LATO + 4, y + 20))
            foglio.alpha_composite(riquadro(sprite(species_id, 'back'), True), (x + LATO * 2 + 8, y + 20))
        nome = uscita / f'tavola-{inizio // per_foglio + 1:02d}.png'
        foglio.convert('RGB').save(nome)
        print(nome)


if __name__ == '__main__':
    main()
