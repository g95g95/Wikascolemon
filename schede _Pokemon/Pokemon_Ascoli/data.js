(function () {
  const moves = window.PokemonAscoliMoves;
  const species = window.PokemonAscoliSpecies;

  const building = (x, y, w, h, name, color = '#bd805d', kind = 'edificio') => ({ x, y, w, h, name, color, kind });
  const rect = (x, y, w, h, type = 'road') => ({ x, y, w, h, type });
  const zone = (x, y, w, h, rate, table) => ({ x, y, w, h, rate, table });
  const transition = (x, y, w, h, to, spawnX, spawnY, label) => ({ x, y, w, h, to, spawnX, spawnY, label });
  const npc = (x, y, name, dialogue, movement = 'fermo') => ({ x, y, name, dialogue, movement });
  const city = { width: 48, height: 36 };
  const wide = { width: 60, height: 40 };
  const tall = { width: 48, height: 40 };

  const maps = {
    centro_storico: {
      ...city, name: 'Centro Storico', baseTile: 'travertino', encounterTable: [
        { species: 'banconio', minLevel: 4, maxLevel: 4, weight: 55 },
        { species: 'basilino', minLevel: 5, maxLevel: 5, weight: 35 },
        { species: 'ciccharizard', minLevel: 8, maxLevel: 8, weight: 10 }
      ],
      roads: [rect(0, 17, 48, 3), rect(22, 0, 4, 36), rect(0, 7, 36, 2), rect(10, 26, 18, 2)],
      waters: [], bridges: [],
      buildings: [
        building(13, 10, 8, 4, 'Palazzo dei Capitani', '#b89068', 'monumento'),
        building(4, 2, 9, 4, 'Teatro Ventidio Basso', '#a8755f', 'teatro'),
        building(29, 22, 10, 6, 'Cattedrale di Sant’Emidio', '#c09b70', 'chiesa'),
        building(40, 23, 3, 3, 'Battistero', '#c7a77d', 'chiesa')
      ],
      plazas: [rect(12, 14, 10, 7, 'piazza'), rect(27, 20, 18, 10, 'piazza')],
      labels: [{ x: 17, y: 16, text: 'Piazza del Popolo' }, { x: 33, y: 21, text: 'Piazza Arringo' }],
      encounterZones: [zone(2, 4, 44, 28, 0.035, 'default')],
      transitions: [
        transition(46, 17, 2, 3, 'porta_maggiore', 3, 18, 'Ponte di Porta Maggiore'),
        transition(22, 0, 4, 2, 'campo_parignano', 24, 37, 'Ponte Nuovo'),
        transition(0, 7, 2, 2, 'borgo_solesta', 44, 8, 'Porta Solestà'),
        transition(22, 34, 4, 2, 'porta_cartara', 24, 3, 'Porta Cartara')
      ],
      npcs: [
        npc(16, 19, 'Cittadino', 'Piazza del Popolo è il salotto della città.', 'orizzontale'),
        npc(36, 29, 'Visitatrice', 'Il travertino cambia colore con la luce.', 'fermo')
      ]
    },
    porta_maggiore: {
      ...city, name: 'Porta Maggiore', baseTile: 'erba', encounterTable: [
        { species: 'pito', minLevel: 4, maxLevel: 4, weight: 55 },
        { species: 'basilino', minLevel: 5, maxLevel: 5, weight: 35 },
        { species: 'banconio', minLevel: 6, maxLevel: 6, weight: 10 }
      ],
      roads: [rect(0, 17, 48, 3), rect(4, 14, 3, 8), rect(17, 9, 8, 14), rect(28, 0, 3, 20)],
      waters: [rect(0, 15, 3, 7, 'water')], bridges: [rect(0, 17, 4, 3, 'bridge')],
      buildings: [
        building(4, 9, 8, 4, 'Stazione ferroviaria', '#9b6f57', 'stazione'),
        building(19, 9, 5, 4, 'Chiesa dell’Immacolata', '#c5a677', 'chiesa')
      ],
      plazas: [rect(16, 13, 10, 9, 'piazza')],
      labels: [{ x: 21, y: 15, text: 'Piazza Immacolata' }, { x: 4, y: 22, text: 'Ponte di Porta Maggiore' }],
      encounterZones: [zone(10, 3, 6, 7, 0.08, 'default'), zone(33, 4, 12, 9, 0.08, 'default'), zone(34, 24, 12, 9, 0.08, 'default')],
      transitions: [
        transition(0, 17, 2, 3, 'centro_storico', 45, 18, 'Centro Storico'),
        transition(46, 17, 2, 3, 'monticelli', 3, 19, 'Monticelli'),
        transition(28, 0, 3, 2, 'borgo_chiaro', 29, 37, 'Borgo Chiaro')
      ],
      npcs: [
        npc(7, 20, 'Viaggiatore', 'Benvenuto ad Ascoli Piceno!', 'fermo'),
        npc(22, 24, 'Abitante', 'Da qui puoi raggiungere facilmente il centro.', 'verticale')
      ]
    },
    monticelli: {
      ...wide, name: 'Monticelli', baseTile: 'erba', encounterTable: [
        { species: 'pito', minLevel: 7, maxLevel: 7, weight: 45 },
        { species: 'segaccio', minLevel: 8, maxLevel: 8, weight: 30 },
        { species: 'banconio', minLevel: 7, maxLevel: 7, weight: 20 },
        { species: 'venagrox', minLevel: 10, maxLevel: 10, weight: 5 }
      ],
      roads: [rect(0, 18, 60, 4), rect(14, 9, 3, 22), rect(35, 6, 3, 28), rect(49, 10, 3, 20)],
      waters: [], bridges: [], plazas: [],
      buildings: [
        building(21, 8, 12, 8, 'Ospedale Mazzoni', '#d5d8d2', 'ospedale'),
        building(7, 24, 6, 4, 'Little Bar', '#b46c52', 'attività'),
        building(39, 24, 7, 4, 'Benzinaio', '#ddc453', 'attività'),
        building(52, 12, 7, 5, 'Pizzeria Mosè', '#bb604b', 'attività')
      ],
      labels: [],
      encounterZones: [
        zone(19, 3, 15, 14, 0.1, 'default'), zone(6, 22, 10, 8, 0.1, 'default'),
        zone(38, 22, 10, 9, 0.1, 'default'), zone(46, 10, 12, 9, 0.1, 'default')
      ],
      transitions: [transition(0, 18, 2, 4, 'porta_maggiore', 45, 18, 'Porta Maggiore')],
      npcs: [npc(28, 17, 'Infermiere', 'La zona dell’ospedale è sempre molto frequentata.', 'orizzontale')]
    },
    campo_parignano: {
      ...tall, name: 'Campo Parignano', baseTile: 'erba', encounterTable: [
        { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 50 },
        { species: 'pito', minLevel: 7, maxLevel: 7, weight: 40 },
        { species: 'banconio', minLevel: 8, maxLevel: 8, weight: 10 }
      ],
      roads: [rect(0, 17, 48, 3), rect(22, 0, 4, 40), rect(34, 4, 3, 16)],
      waters: [rect(0, 35, 48, 3, 'water')], bridges: [rect(22, 34, 4, 6, 'bridge')], plazas: [],
      buildings: [
        building(16, 11, 6, 4, 'Cinema Odeon', '#a6654f', 'cinema'),
        building(26, 10, 5, 5, 'Chiesa del Sacro Cuore', '#c1a179', 'chiesa'),
        building(38, 4, 7, 5, 'Sant’Emidio alle Grotte', '#8f785f', 'monumento')
      ],
      labels: [{ x: 41, y: 11, text: 'Area delle Grotte' }],
      encounterZones: [zone(14, 9, 20, 8, 0.09, 'default'), zone(37, 2, 10, 10, 0.02, 'default')],
      transitions: [
        transition(22, 38, 4, 2, 'centro_storico', 24, 3, 'Ponte Nuovo'),
        transition(0, 17, 2, 3, 'borgo_solesta', 45, 18, 'Borgo Solestà'),
        transition(46, 17, 2, 3, 'borgo_chiaro', 3, 18, 'Borgo Chiaro')
      ],
      npcs: [npc(20, 20, 'Spettatore', 'All’Odeon c’è sempre qualche locandina nuova.', 'fermo')]
    },
    borgo_chiaro: {
      ...tall, name: 'Borgo Chiaro', baseTile: 'erba', encounterTable: [
        { species: 'pito', minLevel: 8, maxLevel: 8, weight: 50 },
        { species: 'puledrotto', minLevel: 8, maxLevel: 8, weight: 30 },
        { species: 'segaccio', minLevel: 9, maxLevel: 9, weight: 20 }
      ],
      roads: [rect(0, 17, 48, 3), rect(28, 0, 3, 40), rect(10, 0, 3, 20)], waters: [], bridges: [], plazas: [],
      buildings: [building(15, 6, 12, 8, 'Stadio Cino e Lillo Del Duca', '#a7a9a4', 'stadio')],
      labels: [{ x: 21, y: 16, text: 'STADIO' }],
      encounterZones: [zone(13, 3, 20, 12, 0.1, 'default')],
      transitions: [
        transition(0, 17, 2, 3, 'campo_parignano', 45, 18, 'Campo Parignano'),
        transition(10, 0, 3, 2, 'borgo_solesta', 40, 37, 'Borgo Solestà'),
        transition(28, 38, 3, 2, 'porta_maggiore', 29, 3, 'Porta Maggiore')
      ],
      npcs: [npc(24, 21, 'Tifoso', 'Lo stadio è il cuore di Borgo Chiaro.', 'orizzontale')]
    },
    borgo_solesta: {
      ...tall, name: 'Borgo Solestà', baseTile: 'erba', encounterTable: [
        { species: 'pito', minLevel: 6, maxLevel: 6, weight: 50 },
        { species: 'segaccio', minLevel: 7, maxLevel: 7, weight: 30 },
        { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 20 }
      ],
      roads: [rect(0, 17, 48, 3), rect(17, 7, 3, 28), rect(39, 16, 3, 24), rect(30, 8, 18, 2)],
      waters: [rect(43, 0, 3, 40, 'water')], bridges: [rect(41, 8, 7, 2, 'bridge'), rect(41, 17, 7, 3, 'bridge')],
      buildings: [
        building(3, 9, 11, 5, 'Borgo residenziale', '#b67859', 'quartiere'),
        building(5, 23, 9, 6, 'Area sportiva', '#7eaa68', 'sport'),
        building(27, 3, 10, 5, 'Margine collinare', '#77985c', 'collina')
      ],
      plazas: [], labels: [{ x: 41, y: 7, text: 'Ponte Romano' }, { x: 38, y: 12, text: 'Porta Solestà' }],
      encounterZones: [zone(3, 21, 15, 12, 0.1, 'default'), zone(24, 2, 15, 10, 0.08, 'default')],
      transitions: [
        transition(46, 8, 2, 2, 'centro_storico', 3, 8, 'Ponte Romano'),
        transition(46, 17, 2, 3, 'campo_parignano', 3, 18, 'Campo Parignano'),
        transition(39, 38, 3, 2, 'borgo_chiaro', 11, 3, 'Borgo Chiaro')
      ],
      npcs: [npc(12, 20, 'Residente', 'Il ponte romano conduce dritto al centro.', 'verticale')]
    },
    porta_cartara: {
      ...wide, name: 'Porta Cartara', baseTile: 'erba', encounterTable: [
        { species: 'tuffito', minLevel: 6, maxLevel: 6, weight: 65 },
        { species: 'pito', minLevel: 7, maxLevel: 7, weight: 30 },
        { species: 'basilino', minLevel: 7, maxLevel: 7, weight: 5 }
      ],
      roads: [rect(22, 0, 4, 40), rect(0, 10, 60, 3), rect(0, 27, 60, 3)],
      waters: [rect(0, 16, 60, 8, 'water')], bridges: [rect(22, 15, 4, 10, 'bridge')],
      buildings: [building(28, 4, 10, 5, 'Porta Cartara', '#a97a5d', 'porta')], plazas: [],
      labels: [{ x: 30, y: 21, text: 'RIO CASTELLANO' }],
      encounterZones: [zone(0, 13, 60, 3, 0.12, 'default'), zone(0, 24, 60, 3, 0.12, 'default')],
      transitions: [transition(22, 0, 4, 2, 'centro_storico', 24, 33, 'Centro Storico')],
      npcs: [npc(30, 30, 'Pescatore', 'I Tuffito si muovono in gruppo lungo il Rio Castellano.', 'fermo')]
    }
  };

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
    acquasanta: { name: 'Acquasanta', price: null, battle: false }
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
    start: { map: 'porta_maggiore', x: 5, y: 15, direction: 'down' },
    respawn: { map: 'porta_maggiore', x: 5, y: 15, direction: 'down' },
    initialItems: { ball: 5, potion: 2, antidote: 0, repel: 0, acquasanta: 0 }
  };
  if (typeof module !== 'undefined') module.exports = window.PokemonAscoliData;
}());
