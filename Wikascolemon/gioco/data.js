(function () {
  const moves = window.PokemonAscoliMoves;
  const species = window.PokemonAscoliSpecies;
  const maps = window.PokemonAscoliMaps;

  const typeChart = {
    Normale: { Roccia: 0.5, Spettro: 0, Acciaio: 0.5 },
    Fuoco: { Erba: 2, Acciaio: 2, Fuoco: 0.5, Acqua: 0.5, Roccia: 0.5 },
    Acqua: { Fuoco: 2, Terra: 2, Roccia: 2, Acqua: 0.5, Erba: 0.5 },
    Erba: { Acqua: 2, Terra: 2, Roccia: 2, Fuoco: 0.5, Erba: 0.5, Acciaio: 0.5 },
    Terra: { Fuoco: 2, Acciaio: 2, Roccia: 2, Erba: 0.5 },
    Roccia: { Fuoco: 2, Erba: 0.5, Terra: 0.5, Acciaio: 0.5 },
    Acciaio: { Roccia: 2, Acciaio: 0.5, Fuoco: 0.5, Acqua: 0.5 },
    Lotta: { Normale: 2, Roccia: 2, Acciaio: 2, Spettro: 0 },
    Veleno: { Erba: 2, Veleno: 0.5, Terra: 0.5, Roccia: 0.5, Acciaio: 0 },
    Spettro: { Spettro: 2, Normale: 0, Buio: 0.5 },
    Buio: { Spettro: 2, Buio: 0.5, Lotta: 0.5 },
    Folletto: { Buio: 2, Fuoco: 0.5, Acciaio: 0.5 },
    Psico: { Lotta: 2, Buio: 0, Acciaio: 0.5 }
  };

  const items = {
    ball: { name: 'Ball', price: 200, battle: true },
    potion: { name: 'Pozione', price: 300, battle: true },
    antidote: { name: 'Antidoto', price: 100, battle: true },
    repel: { name: 'Repellente', price: 350, battle: false },
    grattaevinci: { name: 'Grattaevinci', price: 500, battle: false },
    acquasanta: { name: 'Acquasanta', price: null, battle: false },
    botte: { name: 'Botte', price: null, battle: false },
    granaglie: { name: 'Sacco di Granaglie', price: null, battle: false },
    occhiali_finti: { name: 'Occhiali Finti', price: null, battle: false },
    ciottolo_chiaro: { name: 'Ciottolo del Chiaro', price: null, battle: false },
    pietra_gelo: { name: 'Pietra Gelo', price: null, battle: false },
    mt_velenospina: { name: 'MT Velenospina', price: null, battle: false },
    mt_idrogetto: { name: 'MT Idrogetto', price: null, battle: false }
  };

  window.PokemonAscoliData = {
    version: 2,
    title: 'Pokémon Ascoli',
    tileSize: 16,
    viewport: { width: 240, height: 160 },
    moves,
    species,
    maps,
    typeChart,
    items,
    starters: ['basilino', 'puledrotto', 'tuffito'],
    start: { map: 'porta_maggiore', x: 11, y: 17, direction: 'down' },
    respawn: { map: 'porta_maggiore', x: 11, y: 17, direction: 'down' },
    initialItems: { ball: 5, potion: 2, antidote: 0, repel: 0, acquasanta: 0 }
  };
  // Interni generici (maps/interni.js): ogni bar e ogni tabacchi senza uno script suo porta, dalla
  // porta, nella stanza condivisa del suo tipo. L'uscita di riserva della stanza è il primo edificio
  // di quel tipo; in partita si torna alla porta da cui si è entrati (save.returnSpot).
  const rooms = {
    bar: 'interno_bar', market: 'interno_tabacchi', house: 'interno_casa', church: 'interno_chiesa', hospital: 'interno_ospedale',
    cinema: 'interno_cinema', pizzeria: 'interno_pizzeria', station: 'interno_stazione', palace: 'interno_palazzo', emporium: 'interno_emporio'
  };
  // Che stanza tocca a un edificio che non ne dichiara una: la prima regola che corrisponde.
  // Lo stadio resta chiuso (sarà la sede della Lega); il teatro ha già il suo copione.
  const interiorRules = [
    [b => /^casa\b/i.test(b.name), 'house'],
    [b => /\bbar\b/i.test(b.name), 'bar'],
    [b => b.kind === 'chiesa' || /grotte/i.test(b.name), 'church'],
    [b => b.kind === 'ospedale', 'hospital'],
    [b => b.kind === 'cinema', 'cinema'],
    [b => /pizzeria/i.test(b.name), 'pizzeria'],
    [b => b.kind === 'stazione', 'station'],
    [b => /^palazzo\b/i.test(b.name), 'palace'],
    [b => /benzinaio/i.test(b.name), 'emporium']
  ];
  // Le case («Casa», «Casa popolare», «Casa dei …») sono visitabili: se non hanno una porta nei dati
  // la ricevono al centro della facciata, dove la disegna il gioco, purché la cella davanti sia libera.
  const inside = (x, y, r) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
  const freeCell = (map, x, y) => x >= 0 && y >= 0 && x < map.width && y < map.height
    && !(map.buildings || []).some(b => inside(x, y, b))
    && !(map.waters || []).some(w => inside(x, y, w) && !(map.bridges || []).some(b => inside(x, y, b)))
    && !(map.roads || []).some(r => ['albero', 'muro', 'binari'].includes(r.type) && inside(x, y, r))
    && !(map.npcs || []).some(n => n.x === x && n.y === y)
    && !(map.transitions || []).some(t => inside(x, y, t));
  Object.values(maps).forEach(map => (map.buildings || []).forEach(building => {
    if (map.indoor || building.interior || building.script) return;
    const rule = interiorRules.find(([matches]) => matches({ ...building, name: building.name || '' }));
    if (!rule) return;
    const door = building.door || { x: Math.floor(building.x + building.w / 2), y: building.y + building.h };
    if (!freeCell(map, door.x, door.y)) return;
    building.door = door;
    building.interior = rule[1];
  }));
  Object.entries(maps).forEach(([mapId, map]) => (map.buildings || []).forEach(building => {
    // le case non sono tutte uguali: tre stanze, scelte dalla posizione dell'edificio (sempre la stessa per la stessa casa)
    const houses = ['interno_casa', 'interno_casa_2', 'interno_casa_3'];
    const roomId = building.interior === 'house' ? houses[(building.x * 7 + building.y * 3) % houses.length] : rooms[building.interior];
    if (!roomId || !maps[roomId] || !building.door || building.script) return;
    building.script = [{ warp: { map: roomId, x: 7, y: 8, direction: 'up' } }];
    const exit = maps[roomId].transitions[0];
    if (!exit.spawnX) Object.assign(exit, { to: mapId, spawnX: building.door.x, spawnY: building.door.y });
  }));

  if (typeof module !== 'undefined') module.exports = window.PokemonAscoliData;
}());
