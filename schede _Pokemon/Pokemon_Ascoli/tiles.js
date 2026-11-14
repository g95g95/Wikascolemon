(function () {
  'use strict';

  // Disegno della mappa a tileset, condiviso da gioco e configuratore.
  // create(ctx, { fallbackTile, onReady }) lega le funzioni di disegno a un canvas.

  function keyFor(x, y) {
    return `${x},${y}`;
  }

  function pointInRect(x, y, item) {
    return x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h;
  }

  function terrainAt(map, x, y) {
    const override = map.tileOverrides && map.tileOverrides[keyFor(x, y)];
    if (override) return override;
    if ((map.bridges || []).some(item => pointInRect(x, y, item))) return 'bridge';
    const water = (map.waters || []).find(item => pointInRect(x, y, item));
    if (water) return water.type || 'water';
    if ((map.plazas || []).some(item => pointInRect(x, y, item))) return 'piazza';
    const road = (map.roads || []).find(item => pointInRect(x, y, item));
    if (road) return road.type || 'road';
    return map.baseTile || 'erba';
  }

  // Arredo piazzabile: `map.decor = [{ x, y, kind }]`. Gli oggetti larghi occupano due celle.
  const DECOR_KINDS = {
    cespuglio: { name: 'Cespuglio', blocks: true }, masso: { name: 'Masso', blocks: true }, fiori: { name: 'Fiori', blocks: false },
    lampione: { name: 'Lampione', blocks: true }, panchina: { name: 'Panchina', blocks: true, span: 2 },
    cartello: { name: 'Cartello', blocks: true }, fontana: { name: 'Fontana', blocks: true, span: 2 }
  };

  function decorBlocks(map, x, y) {
    return (map.decor || []).some(item => {
      const kind = DECOR_KINDS[item.kind];
      return kind && kind.blocks && item.y === y && x >= item.x && x < item.x + (kind.span || 1);
    });
  }

  function create(ctx, options) {
    options = options || {};

    // ---------------------------------------------------------------------
    // Tileset: atlante 16×16 (assets/tiles/tileset.png, 16 colonne). Le posizioni qui sotto sono il
    // contratto con chi disegna l'atlante: tools/build-tileset.py genera quello provvisorio.
    // Se l'immagine non si carica, si ricade sui tile dipinti a mano di drawTile.
    // ---------------------------------------------------------------------

    const tilesetImage = new Image();
    tilesetImage.onload = () => { if (options.onReady) options.onReady(); };
    tilesetImage.src = 'assets/tiles/tileset.png';
    const TILES = {
      erba: [0, 0], erba_b: [1, 0], erba_c: [2, 0], erba_alta: [3, 0], road: [4, 0], piazza: [5, 0], travertino: [6, 0],
      asfalto: [7, 0], ghiaia: [8, 0], pavimento: [9, 0], sabbia: [10, 0], pendio: [11, 0], muro: [12, 0], binari: [13, 0],
      bridge: [14, 0], erba_alta_front: [15, 0],
      water_0: [0, 1], water_1: [1, 1], mare_0: [2, 1], mare_1: [3, 1], albero: [4, 1], albero_top: [5, 1], road_b: [6, 1], asfalto_b: [7, 1],
      // serie di bordi: 4 lati (N, E, S, O) poi 4 angoli interni (NE, SE, SO, NO)
      bordo_erba: [0, 2], riva_erba: [8, 2], riva_sabbia: [0, 3]
    };
    const GRASSY = new Set(['erba', 'pendio', 'albero']);
    const SOFT = new Set(['road', 'ghiaia', 'sabbia']);
    const WATERY = new Set(['water', 'mare']);
    const SIDES = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    const DIAGONALS = [[1, -1], [1, 1], [-1, 1], [-1, -1]];

    // Oggetti ritagliati dai fogli generati (tools/build-oggetti.py → assets/tiles/oggetti.png):
    // [x, y, larghezza, altezza] nel foglio. Tenere allineato con l'output dello script.
    const objectsImage = new Image();
    objectsImage.onload = () => { if (options.onReady) options.onReady(); };
    objectsImage.src = 'assets/tiles/oggetti.png';
    const OBJECTS = {
      albero: [0, 0, 27, 32], cespuglio: [27, 0, 16, 14], masso: [43, 0, 16, 12], fiori: [59, 0, 16, 14],
      porta: [75, 0, 16, 20], porta_negozio: [91, 0, 22, 24], porta_chiesa: [113, 0, 24, 28], finestra: [137, 0, 20, 16],
      vetrina: [157, 0, 28, 24], tetto: [185, 0, 32, 32], muro_pietra: [217, 0, 32, 32], muro_mattoni: [0, 32, 32, 32],
      lampione: [32, 32, 12, 32], panchina: [44, 32, 32, 22], cartello: [76, 32, 18, 24], fontana: [94, 32, 32, 30]
    };

    function objectsReady() {
      return objectsImage.complete && objectsImage.naturalWidth > 0;
    }

    // Disegna un oggetto con il centro della base in (baseX, baseY).
    function drawObject(name, baseX, baseY) {
      const [sx, sy, w, h] = OBJECTS[name];
      ctx.drawImage(objectsImage, sx, sy, w, h, Math.round(baseX - w / 2), Math.round(baseY - h), w, h);
    }

    // Le texture (tetto, muri) diventano pattern ripetibili, creati alla prima richiesta.
    const texturePatterns = {};
    function texturePattern(name) {
      if (!texturePatterns[name]) {
        const [sx, sy, w, h] = OBJECTS[name];
        const tile = document.createElement('canvas');
        tile.width = w;
        tile.height = h;
        tile.getContext('2d').drawImage(objectsImage, sx, sy, w, h, 0, 0, w, h);
        texturePatterns[name] = ctx.createPattern(tile, 'repeat');
      }
      return texturePatterns[name];
    }

    function fillTexture(name, x, y, width, height) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = texturePattern(name);
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    function tilesetReady() {
      return tilesetImage.complete && tilesetImage.naturalWidth > 0;
    }

    // Griglia dei terreni di una mappa, calcolata una volta sola (le mappe non cambiano in partita).
    const terrainGrids = new WeakMap();
    function terrainGrid(map) {
      let grid = terrainGrids.get(map);
      if (grid) return grid;
      const types = new Array(map.width * map.height);
      const tall = new Uint8Array(map.width * map.height);
      for (let y = 0; y < map.height; y += 1) {
        for (let x = 0; x < map.width; x += 1) {
          const type = terrainAt(map, x, y);
          types[y * map.width + x] = type;
          if (type !== 'erba') continue;
          const custom = map.encounterCells && map.encounterCells[keyFor(x, y)];
          const inZone = custom !== undefined ? custom > 0 : (map.encounterZones || []).some(item => pointInRect(x, y, item));
          if (inZone && !(map.buildings || []).some(item => pointInRect(x, y, item))) tall[y * map.width + x] = 1;
        }
      }
      grid = { types, tall, width: map.width, height: map.height };
      terrainGrids.set(map, grid);
      return grid;
    }

    function gridType(grid, x, y) {
      if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return null;
      return grid.types[y * grid.width + x];
    }

    function isTallGrass(map, x, y) {
      const grid = terrainGrid(map);
      return x >= 0 && y >= 0 && x < grid.width && y < grid.height && grid.tall[y * grid.width + x] === 1;
    }

    function blit(tile, offset, screenX, screenY) {
      ctx.drawImage(tilesetImage, (tile[0] + offset) * 16, tile[1] * 16, 16, 16, screenX, screenY, 16, 16);
    }

    // Quale serie di bordi disegnare su una cella di tipo `type` verso un vicino di tipo `other`.
    function fringeFor(type, other) {
      if (!other || other === type) return null;
      if (WATERY.has(type)) {
        if (WATERY.has(other) || other === 'bridge') return null;
        return other === 'sabbia' ? TILES.riva_sabbia : TILES.riva_erba;
      }
      if (SOFT.has(type) && GRASSY.has(other)) return TILES.bordo_erba;
      return null;
    }

    function drawGround(grid, x, y, screenX, screenY, frame) {
      const type = gridType(grid, x, y);
      const hash = ((x * 73856093) ^ (y * 19349663)) >>> 0;
      let tile = TILES[type];
      if (type === 'erba') tile = grid.tall[y * grid.width + x] ? TILES.erba_alta : [TILES.erba, TILES.erba, TILES.erba_b, TILES.erba, TILES.erba, TILES.erba_c, TILES.erba, TILES.erba_b][hash % 8];
      else if (type === 'water') tile = frame ? TILES.water_1 : TILES.water_0;
      else if (type === 'mare') tile = frame ? TILES.mare_1 : TILES.mare_0;
      else if (type === 'road' && hash % 3 === 0) tile = TILES.road_b;
      else if (type === 'asfalto' && hash % 5 === 0) tile = TILES.asfalto_b;
      else if (type === 'albero' && objectsReady()) tile = TILES.erba;
      if (!tile) { if (options.fallbackTile) options.fallbackTile(type, screenX, screenY, x, y); return; }
      blit(tile, 0, screenX, screenY);
      const sides = SIDES.map(([dx, dy]) => fringeFor(type, gridType(grid, x + dx, y + dy)));
      sides.forEach((set, index) => { if (set) blit(set, index, screenX, screenY); });
      DIAGONALS.forEach(([dx, dy], index) => {
        if (sides[index] || sides[(index + 1) % 4]) return;
        const set = fringeFor(type, gridType(grid, x + dx, y + dy));
        if (set) blit(set, 4 + index, screenX, screenY);
      });
    }

    function shade(hex, factor) {
      const value = parseInt(hex.slice(1), 16);
      const channel = shift => Math.max(0, Math.min(255, Math.round(((value >> shift) & 255) * factor)));
      return `rgb(${channel(16)},${channel(8)},${channel(0)})`;
    }

    // Edificio visto dall'alto a tre quarti: tetto a file di coppi sopra, facciata con finestre e
    // porta sotto. Provvisorio, dipinto in codice: gli edifici veri arriveranno con l'atlante.
    const FLAT_ROOF_KINDS = new Set(['ospedale', 'capannone', 'stazione', 'stabilimento', 'sport']);
    function drawHouse(item, x, y, width, height, camera) {
      const wall = /^#[0-9a-f]{6}$/i.test(item.color || '') ? item.color : '#b77958';
      const roof = FLAT_ROOF_KINDS.has(item.kind) ? '#8a9098' : '#c4623c';
      const wallHeight = (item.h >= 6 ? 3 : item.h >= 3 ? 2 : 1) * 16;
      const roofHeight = height - wallHeight;
      const wallTop = y + roofHeight;
      if (objectsReady()) {
        const flat = FLAT_ROOF_KINDS.has(item.kind);
        fillTexture(flat ? 'muro_pietra' : 'tetto', x, y, width, roofHeight);
        ctx.globalCompositeOperation = 'multiply';
        if (flat) { ctx.fillStyle = '#9aa2ac'; ctx.fillRect(x, y, width, roofHeight); }
        ctx.globalCompositeOperation = 'source-over';
        fillTexture('muro_pietra', x, wallTop, width, wallHeight);
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = .7;
        ctx.fillStyle = wall;
        ctx.fillRect(x, wallTop, width, wallHeight);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(40, 25, 15, .45)';
        ctx.fillRect(x, wallTop, width, 3); // ombra della gronda
        const shop = item.kind === 'attività';
        const doorName = item.kind === 'chiesa' ? 'porta_chiesa' : shop ? 'porta_negozio' : 'porta';
        const doorCenter = Math.round(item.door ? item.door.x * 16 - camera.x + 8 : x + width / 2);
        const base = y + height;
        const clear = OBJECTS[doorName][2] / 2 + 14;
        if (wallHeight >= 32 && item.kind !== 'chiesa') {
          // piano terra: vetrine per le attività, finestre per il resto; sopra sempre finestre
          const row = (baseY, ground) => {
            const piece = ground && shop ? 'vetrina' : 'finestra';
            for (let cx = x + 20; cx <= x + width - 20; cx += piece === 'vetrina' ? 40 : 32) {
              if (ground && Math.abs(cx - doorCenter) < clear) continue;
              drawObject(piece, cx, baseY);
            }
          };
          if (wallHeight >= 48) row(wallTop + 21, false);
          row(base - 3, true);
        }
        drawObject(doorName, doorCenter, base);
        ctx.fillStyle = '#3a2e26';
        ctx.fillRect(x - 1, y - 1, width + 2, 1);
        ctx.fillRect(x - 1, y, 1, height);
        ctx.fillRect(x + width, y, 1, height);
        ctx.fillRect(x - 1, y + height, width + 2, 1);
        return;
      }
      // tetto
      for (let row = 0; row * 4 < roofHeight; row += 1) {
        ctx.fillStyle = shade(roof, row % 2 ? .92 : 1);
        ctx.fillRect(x, y + row * 4, width, Math.min(4, roofHeight - row * 4));
        ctx.fillStyle = shade(roof, .78);
        ctx.fillRect(x, y + row * 4 + 3, width, 1);
      }
      ctx.fillStyle = shade(roof, 1.25);
      ctx.fillRect(x, y, width, 2);
      ctx.fillStyle = shade(roof, .6);
      ctx.fillRect(x, wallTop - 2, width, 2);
      // facciata
      ctx.fillStyle = wall;
      ctx.fillRect(x, wallTop, width, wallHeight);
      ctx.fillStyle = shade(wall, .78);
      ctx.fillRect(x, wallTop, width, 2);
      ctx.fillRect(x, y + height - 2, width, 2);
      const doorX = Math.round(item.door ? item.door.x * 16 - camera.x + 2 : x + width / 2 - 6);
      if (wallHeight >= 32) {
        for (let windowX = x + 8; windowX < x + width - 14; windowX += 24) {
          if (Math.abs(windowX - doorX) < 16) continue;
          ctx.fillStyle = shade(wall, .5);
          ctx.fillRect(windowX, wallTop + 7, 10, 11);
          ctx.fillStyle = '#8fc4e8';
          ctx.fillRect(windowX + 1, wallTop + 8, 8, 9);
          ctx.fillStyle = '#d8ecf8';
          ctx.fillRect(windowX + 1, wallTop + 8, 3, 3);
          ctx.fillStyle = shade(wall, .5);
          ctx.fillRect(windowX + 4, wallTop + 8, 1, 9);
        }
      }
      // porta
      const doorHeight = Math.min(18, wallHeight - 4);
      ctx.fillStyle = '#3a2a20';
      ctx.fillRect(doorX, y + height - doorHeight, 12, doorHeight);
      ctx.fillStyle = '#8a5630';
      ctx.fillRect(doorX + 1, y + height - doorHeight + 1, 10, doorHeight - 1);
      ctx.fillStyle = '#e8c860';
      ctx.fillRect(doorX + 8, y + height - Math.round(doorHeight / 2), 2, 2);
      // contorno
      ctx.fillStyle = '#3a2e26';
      ctx.fillRect(x - 1, y - 1, width + 2, 1);
      ctx.fillRect(x - 1, y, 1, height);
      ctx.fillRect(x + width, y, 1, height);
      ctx.fillRect(x - 1, y + height, width + 2, 1);
    }


    // Alberi e arredo della zona visibile, riga per riga dall'alto: chi sta più in basso copre.
    function drawStanding(map, grid, startX, startY, endX, endY, originX, originY) {
      const decorByRow = {};
      (map.decor || []).forEach(item => { (decorByRow[item.y] = decorByRow[item.y] || []).push(item); });
      for (let y = startY; y <= Math.min(map.height - 1, endY); y += 1) {
        for (let x = startX - 1; x <= endX; x += 1) {
          if (gridType(grid, x, y) !== 'albero') continue;
          if (objectsReady()) drawObject('albero', x * 16 - originX + 8, (y + 1) * 16 - originY);
          else blit(TILES.albero_top, 0, x * 16 - originX, (y - 1) * 16 - originY);
        }
        if (!objectsReady()) continue;
        (decorByRow[y] || []).forEach(item => {
          const kind = DECOR_KINDS[item.kind];
          if (kind) drawObject(item.kind, item.x * 16 - originX + (kind.span || 1) * 8, (y + 1) * 16 - originY);
        });
      }
    }

    return {
      TILES, OBJECTS, tilesetReady, objectsReady, terrainGrid, gridType, isTallGrass, blit, drawGround, drawObject, drawHouse, drawStanding
    };
  }

  const api = { create, terrainAt, decorBlocks, DECOR_KINDS };
  window.PokemonAscoliTiles = api;
  if (typeof module !== 'undefined') module.exports = api;
}());
