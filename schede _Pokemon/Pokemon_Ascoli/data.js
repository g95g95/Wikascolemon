(function () {
  const move = (name, type, category, power, accuracy, effect = null) => ({
    name, type, category, power, accuracy, effect
  });

  const moves = {
    azione: move('Azione', 'Normale', 'Fisico', 40, 100),
    ruggito: move('Ruggito', 'Normale', 'Stato', 0, 100, { target: 'enemy', stat: 'attack', stages: -1 }),
    crescita: move('Crescita', 'Normale', 'Stato', 0, 100, { target: 'self', stat: 'spAttack', stages: 1 }),
    fogliame: move('Fogliame', 'Erba', 'Fisico', 40, 100),
    fogliamagica: move('Fogliamagica', 'Erba', 'Speciale', 60, 100),
    sonnifero: move('Sonnifero', 'Erba', 'Stato', 0, 75, { target: 'enemy', stat: 'speed', stages: -1 }),
    braciere: move('Braciere', 'Fuoco', 'Speciale', 40, 100),
    bruciapelo: move('Bruciapelo', 'Normale', 'Fisico', 40, 100),
    nitrocarica: move('Nitrocarica', 'Fuoco', 'Fisico', 50, 100, { target: 'self', stat: 'speed', stages: 1 }),
    pestone: move('Pestone', 'Normale', 'Fisico', 65, 100),
    bolla: move('Bolla', 'Acqua', 'Speciale', 40, 100),
    fortificazione: move('Fortificazione', 'Normale', 'Stato', 0, 100, { target: 'self', stat: 'defense', stages: 1 }),
    presa: move('Presa', 'Normale', 'Fisico', 55, 100),
    idrogetto: move('Idrogetto', 'Acqua', 'Fisico', 40, 100),
    turbosabbia: move('Turbosabbia', 'Terra', 'Stato', 0, 100, { target: 'enemy', stat: 'defense', stages: -1 }),
    sassata: move('Sassata', 'Roccia', 'Fisico', 50, 90),
    bottintesta: move('Bottintesta', 'Normale', 'Fisico', 70, 100),
    fangosberla: move('Fangosberla', 'Terra', 'Speciale', 20, 100),
    velenospina: move('Velenospina', 'Veleno', 'Fisico', 15, 100),
    assorbicorno: move('Assorbicorno', 'Erba', 'Fisico', 75, 100, { drain: 0.5 }),
    frustata: move('Frustata', 'Erba', 'Fisico', 45, 100),
    fendente: move('Fendente', 'Normale', 'Fisico', 50, 95),
    difesaferrea: move('Difesaferrea', 'Acciaio', 'Stato', 0, 100, { target: 'self', stat: 'defense', stages: 2 }),
    sberla: move('Sberla', 'Normale', 'Fisico', 60, 85),
    risatasana: move('Risata Sana', 'Normale', 'Stato', 0, 100, { target: 'self', stat: 'spDefense', stages: 1 }),
    ferrartigli: move('Ferrartigli', 'Acciaio', 'Fisico', 50, 95),
    battiterra: move('Battiterra', 'Terra', 'Fisico', 60, 100),
    solopiombo: move('Solo Piombo', 'Acciaio', 'Fisico', 80, 100),
    colpocoda: move('Colpocoda', 'Normale', 'Stato', 0, 100, { target: 'enemy', stat: 'defense', stages: -1 }),
    sgomento: move('Sgomento', 'Spettro', 'Fisico', 30, 100),
    ascolto: move('Ascolto', 'Psico', 'Stato', 0, 100, { target: 'self', stat: 'spDefense', stages: 1 }),
    ombranotturna: move('Ombra Notturna', 'Spettro', 'Speciale', 55, 100),
    neropulsar: move('Neropulsar', 'Buio', 'Speciale', 80, 100),
    vigorcolpo: move('Vigorcolpo', 'Lotta', 'Fisico', 75, 100),
    incantavoce: move('Incantavoce', 'Folletto', 'Speciale', 40, 100),
    geoforza: move('Geoforza', 'Terra', 'Speciale', 90, 100)
  };

  const species = {
    basilino: {
      number: 1, name: 'Basilino', types: ['Erba'], base: [50, 40, 60, 65, 55, 40], catchRate: 120,
      learnset: [[1, 'azione'], [1, 'crescita'], [5, 'fogliame'], [9, 'sonnifero'], [13, 'fogliamagica']],
      evolution: { level: 17, into: 'turibasil' }, wiki: '../basilino.html'
    },
    turibasil: {
      number: 2, name: 'Turibasil', types: ['Erba'], base: [65, 50, 80, 85, 75, 50], catchRate: 60,
      learnset: [[1, 'azione'], [1, 'crescita'], [1, 'fogliame'], [9, 'sonnifero'], [13, 'fogliamagica']],
      evolution: { level: 36, into: 'vescovasil', location: 'campo_parignano' }, wiki: '../turibasil.html'
    },
    vescovasil: {
      number: 3, name: 'Vescovasil', types: ['Erba', 'Terra'], base: [80, 65, 105, 110, 100, 70], catchRate: 30,
      learnset: [[1, 'geoforza'], [1, 'azione'], [1, 'fogliame'], [1, 'sonnifero'], [13, 'fogliamagica']], wiki: '../vescovasil.html'
    },
    puledrotto: {
      number: 4, name: 'Puledrotto', types: ['Fuoco'], base: [45, 60, 40, 45, 40, 80], catchRate: 120,
      learnset: [[1, 'azione'], [1, 'ruggito'], [5, 'braciere'], [9, 'bruciapelo'], [13, 'nitrocarica'], [18, 'pestone']],
      evolution: { level: 17, into: 'cavalbrace' }, wiki: '../puledrotto.html'
    },
    cavalbrace: {
      number: 5, name: 'Cavalbrace', types: ['Fuoco'], base: [60, 80, 55, 60, 55, 95], catchRate: 60,
      learnset: [[1, 'azione'], [1, 'ruggito'], [1, 'braciere'], [9, 'bruciapelo'], [13, 'nitrocarica'], [20, 'pestone']],
      evolution: { level: 36, into: 'fuocavallo' }, wiki: '../cavalbrace.html'
    },
    fuocavallo: {
      number: 6, name: 'Fuocavallo', types: ['Fuoco', 'Folletto'], base: [70, 110, 70, 85, 70, 125], catchRate: 30,
      learnset: [[1, 'incantavoce'], [1, 'azione'], [1, 'braciere'], [1, 'bruciapelo'], [13, 'nitrocarica'], [20, 'pestone']], wiki: '../fuocavallo.html'
    },
    tuffito: {
      number: 7, name: 'Tuffito', types: ['Acqua'], base: [60, 65, 60, 35, 50, 40], catchRate: 120,
      learnset: [[1, 'azione'], [1, 'bolla'], [5, 'fortificazione'], [9, 'presa'], [13, 'idrogetto']],
      evolution: { level: 17, into: 'brasero' }, wiki: '../tuffito.html'
    },
    brasero: {
      number: 8, name: 'Brasero', types: ['Acqua'], base: [80, 85, 80, 45, 65, 50], catchRate: 60,
      learnset: [[1, 'azione'], [1, 'bolla'], [1, 'fortificazione'], [9, 'presa'], [13, 'idrogetto'], [20, 'braciere']],
      evolution: { level: 36, into: 'compadrone' }, wiki: '../brasero.html'
    },
    compadrone: {
      number: 9, name: 'Compadrone', types: ['Acqua', 'Lotta'], base: [100, 115, 95, 55, 85, 80], catchRate: 30,
      learnset: [[1, 'vigorcolpo'], [1, 'azione'], [1, 'idrogetto'], [1, 'presa'], [20, 'braciere']], wiki: '../compadrone.html'
    },
    pito: {
      number: 44, name: 'Pito', types: ['Roccia', 'Normale'], base: [42, 64, 60, 28, 40, 44], catchRate: 180,
      learnset: [[1, 'azione'], [1, 'ruggito'], [5, 'turbosabbia'], [9, 'sassata'], [17, 'bottintesta']],
      evolution: { level: 21, into: 'pozza', wet: true }, wiki: '../pito.html'
    },
    pozza: {
      number: 45, name: 'Pozza', types: ['Roccia', 'Veleno'], base: [72, 94, 90, 44, 62, 30], catchRate: 90,
      learnset: [[1, 'fangosberla'], [1, 'azione'], [1, 'velenospina'], [9, 'sassata'], [17, 'bottintesta']],
      evolution: { item: 'acquasanta', into: 'umito' }, wiki: '../pozza.html'
    },
    umito: {
      number: 46, name: 'Umito', types: ['Roccia', 'Erba'], base: [84, 102, 96, 52, 74, 111], catchRate: 30,
      learnset: [[1, 'assorbicorno'], [1, 'azione'], [9, 'sassata'], [21, 'fogliame']], wiki: '../umito.html'
    },
    segaccio: {
      number: 47, name: 'Segaccio', types: ['Erba', 'Acciaio'], base: [85, 125, 95, 40, 65, 55], catchRate: 80,
      learnset: [[1, 'azione'], [1, 'ruggito'], [6, 'frustata'], [11, 'fendente'], [16, 'difesaferrea']], wiki: '../segaccio_6.html'
    },
    banconio: {
      number: 10, name: 'Banconio', types: ['Normale'], base: [110, 85, 100, 40, 90, 40], catchRate: 100,
      learnset: [[1, 'azione'], [1, 'ruggito'], [7, 'sberla'], [12, 'fortificazione'], [17, 'risatasana']], wiki: '../banconio.html'
    },
    venagrox: {
      number: 48, name: 'Venagrox', types: ['Acciaio', 'Terra'], base: [125, 145, 135, 55, 80, 30], catchRate: 25,
      learnset: [[1, 'ruggito'], [1, 'ferrartigli'], [7, 'battiterra'], [18, 'solopiombo']], wiki: '../venagrox.html'
    },
    ciccharizard: {
      number: 49, name: 'Ciccharizard', types: ['Buio', 'Spettro'], base: [90, 70, 85, 115, 120, 60], catchRate: 35,
      learnset: [[1, 'colpocoda'], [1, 'sgomento'], [7, 'ascolto'], [13, 'ombranotturna'], [25, 'neropulsar']], wiki: '../ciccharizard.html'
    }
  };

  const building = (x, y, w, h, name, color = '#bd805d', kind = 'edificio') => ({ x, y, w, h, name, color, kind });
  const rect = (x, y, w, h, type = 'road') => ({ x, y, w, h, type });
  const zone = (x, y, w, h, rate, table) => ({ x, y, w, h, rate, table });
  const transition = (x, y, w, h, to, spawnX, spawnY, label) => ({ x, y, w, h, to, spawnX, spawnY, label });
  const npc = (x, y, name, dialogue, movement = 'fermo') => ({ x, y, name, dialogue, movement });
  const common = { width: 256, height: 160 };

  const maps = {
    centro_storico: {
      ...common, name: 'Centro Storico', baseTile: 'travertino', encounterTable: [
        { species: 'banconio', minLevel: 4, maxLevel: 4, weight: 55 },
        { species: 'basilino', minLevel: 5, maxLevel: 5, weight: 35 },
        { species: 'ciccharizard', minLevel: 8, maxLevel: 8, weight: 10 }
      ],
      roads: [rect(0, 72, 256, 18), rect(118, 0, 22, 160), rect(20, 30, 170, 18), rect(58, 112, 90, 18)],
      waters: [], bridges: [],
      buildings: [
        building(68, 52, 42, 17, 'Palazzo dei Capitani', '#b89068', 'monumento'),
        building(24, 17, 45, 20, 'Teatro Ventidio Basso', '#a8755f', 'teatro'),
        building(150, 94, 52, 30, 'Cattedrale di Sant’Emidio', '#c09b70', 'chiesa'),
        building(207, 102, 15, 15, 'Battistero', '#c7a77d', 'chiesa')
      ],
      plazas: [rect(62, 68, 58, 28, 'piazza'), rect(142, 88, 86, 44, 'piazza')],
      labels: [{ x: 78, y: 82, text: 'Piazza del Popolo' }, { x: 160, y: 110, text: 'Piazza Arringo' }],
      encounterZones: [zone(10, 20, 226, 120, 0.035, 'default')],
      transitions: [
        transition(254, 76, 2, 10, 'porta_maggiore', 3, 80, 'Ponte di Porta Maggiore'),
        transition(124, 0, 12, 2, 'campo_parignano', 130, 157, 'Ponte Nuovo'),
        transition(0, 36, 2, 12, 'borgo_solesta', 252, 42, 'Porta Solestà'),
        transition(80, 158, 12, 2, 'porta_cartara', 86, 3, 'Porta Cartara')
      ],
      npcs: [
        npc(84, 99, 'Cittadino', 'Piazza del Popolo è il salotto della città.', 'orizzontale'),
        npc(186, 135, 'Visitatrice', 'Il travertino cambia colore con la luce.', 'fermo')
      ]
    },
    porta_maggiore: {
      ...common, name: 'Porta Maggiore', baseTile: 'erba', encounterTable: [
        { species: 'pito', minLevel: 4, maxLevel: 4, weight: 55 },
        { species: 'basilino', minLevel: 5, maxLevel: 5, weight: 35 },
        { species: 'banconio', minLevel: 6, maxLevel: 6, weight: 10 }
      ],
      roads: [rect(0, 74, 256, 18), rect(24, 60, 18, 32), rect(88, 40, 42, 70), rect(144, 0, 18, 92)],
      waters: [rect(0, 64, 14, 36, 'water')], bridges: [rect(0, 75, 18, 16, 'bridge')],
      buildings: [
        building(17, 43, 38, 20, 'Stazione ferroviaria', '#9b6f57', 'stazione'),
        building(96, 42, 26, 18, 'Chiesa dell’Immacolata', '#c5a677', 'chiesa')
      ],
      plazas: [rect(82, 62, 54, 42, 'piazza')],
      labels: [{ x: 91, y: 82, text: 'Piazza Immacolata' }, { x: 17, y: 87, text: 'Ponte di Porta Maggiore' }],
      encounterZones: [zone(54, 18, 28, 34, 0.08, 'default'), zone(168, 20, 66, 40, 0.08, 'default'), zone(178, 104, 62, 42, 0.08, 'default')],
      transitions: [
        transition(0, 76, 2, 10, 'centro_storico', 252, 80, 'Centro Storico'),
        transition(254, 76, 2, 10, 'monticelli', 3, 80, 'Monticelli'),
        transition(146, 0, 14, 2, 'borgo_chiaro', 150, 157, 'Borgo Chiaro')
      ],
      npcs: [
        npc(36, 92, 'Viaggiatore', 'Benvenuto ad Ascoli Piceno!', 'fermo'),
        npc(112, 108, 'Abitante', 'Da qui puoi raggiungere facilmente il centro.', 'verticale')
      ]
    },
    monticelli: {
      ...common, name: 'Monticelli', baseTile: 'erba', encounterTable: [
        { species: 'pito', minLevel: 7, maxLevel: 7, weight: 45 },
        { species: 'segaccio', minLevel: 8, maxLevel: 8, weight: 30 },
        { species: 'banconio', minLevel: 7, maxLevel: 7, weight: 20 },
        { species: 'venagrox', minLevel: 10, maxLevel: 10, weight: 5 }
      ],
      roads: [rect(0, 74, 256, 20), rect(64, 40, 18, 84), rect(150, 28, 18, 112), rect(208, 42, 18, 80)],
      waters: [], bridges: [], plazas: [],
      buildings: [
        building(96, 34, 55, 38, 'Ospedale Mazzoni', '#d5d8d2', 'ospedale'),
        building(50, 96, 28, 18, 'Little Bar', '#b46c52', 'attività'),
        building(168, 96, 30, 20, 'Benzinaio', '#ddc453', 'attività'),
        building(208, 52, 34, 22, 'Pizzeria Mosè', '#bb604b', 'attività')
      ],
      labels: [],
      encounterZones: [
        zone(86, 24, 76, 58, 0.1, 'default'), zone(40, 86, 48, 38, 0.1, 'default'),
        zone(158, 86, 50, 40, 0.1, 'default'), zone(198, 42, 54, 42, 0.1, 'default')
      ],
      transitions: [transition(0, 76, 2, 10, 'porta_maggiore', 252, 80, 'Porta Maggiore')],
      npcs: [npc(122, 82, 'Infermiere', 'La zona dell’ospedale è sempre molto frequentata.', 'orizzontale')]
    },
    campo_parignano: {
      ...common, name: 'Campo Parignano', baseTile: 'erba', encounterTable: [
        { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 50 },
        { species: 'pito', minLevel: 7, maxLevel: 7, weight: 40 },
        { species: 'banconio', minLevel: 8, maxLevel: 8, weight: 10 }
      ],
      roads: [rect(0, 72, 256, 18), rect(122, 0, 20, 160), rect(178, 18, 18, 82)],
      waters: [rect(0, 146, 256, 12, 'water')], bridges: [rect(122, 142, 20, 18, 'bridge')], plazas: [],
      buildings: [
        building(86, 52, 42, 24, 'Cinema Odeon', '#a6654f', 'cinema'),
        building(139, 48, 28, 30, 'Chiesa del Sacro Cuore', '#c1a179', 'chiesa'),
        building(198, 18, 37, 26, 'Sant’Emidio alle Grotte', '#8f785f', 'monumento')
      ],
      labels: [{ x: 198, y: 48, text: 'Area delle Grotte' }],
      encounterZones: [zone(74, 40, 106, 54, 0.09, 'default'), zone(186, 8, 60, 48, 0.02, 'default')],
      transitions: [
        transition(124, 158, 14, 2, 'centro_storico', 130, 3, 'Ponte Nuovo'),
        transition(0, 74, 2, 12, 'borgo_solesta', 252, 82, 'Borgo Solestà'),
        transition(254, 74, 2, 12, 'borgo_chiaro', 3, 80, 'Borgo Chiaro')
      ],
      npcs: [npc(114, 96, 'Spettatore', 'All’Odeon c’è sempre qualche locandina nuova.', 'fermo')]
    },
    borgo_chiaro: {
      ...common, name: 'Borgo Chiaro', baseTile: 'erba', encounterTable: [
        { species: 'pito', minLevel: 8, maxLevel: 8, weight: 50 },
        { species: 'puledrotto', minLevel: 8, maxLevel: 8, weight: 30 },
        { species: 'segaccio', minLevel: 9, maxLevel: 9, weight: 20 }
      ],
      roads: [rect(0, 74, 256, 18), rect(142, 0, 18, 160), rect(54, 0, 18, 90)], waters: [], bridges: [], plazas: [],
      buildings: [building(82, 38, 104, 62, 'Stadio Cino e Lillo Del Duca', '#a7a9a4', 'stadio')],
      labels: [{ x: 107, y: 66, text: 'STADIO' }],
      encounterZones: [zone(68, 24, 132, 92, 0.1, 'default')],
      transitions: [
        transition(0, 76, 2, 10, 'campo_parignano', 252, 80, 'Campo Parignano'),
        transition(56, 0, 14, 2, 'borgo_solesta', 202, 157, 'Borgo Solestà'),
        transition(144, 158, 16, 2, 'porta_maggiore', 152, 3, 'Porta Maggiore')
      ],
      npcs: [npc(123, 112, 'Tifoso', 'Lo stadio è il cuore di Borgo Chiaro.', 'orizzontale')]
    },
    borgo_solesta: {
      ...common, name: 'Borgo Solestà', baseTile: 'erba', encounterTable: [
        { species: 'pito', minLevel: 6, maxLevel: 6, weight: 50 },
        { species: 'segaccio', minLevel: 7, maxLevel: 7, weight: 30 },
        { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 20 }
      ],
      roads: [rect(0, 72, 256, 18), rect(92, 30, 18, 112), rect(190, 70, 18, 90)],
      waters: [rect(234, 0, 14, 160, 'water')], bridges: [rect(228, 34, 28, 18, 'bridge'), rect(228, 74, 28, 18, 'bridge')],
      buildings: [
        building(18, 42, 60, 24, 'Borgo residenziale', '#b67859', 'quartiere'),
        building(34, 104, 48, 26, 'Area sportiva', '#7eaa68', 'sport'),
        building(145, 20, 52, 28, 'Margine collinare', '#77985c', 'collina')
      ],
      plazas: [], labels: [{ x: 216, y: 44, text: 'Ponte Romano' }, { x: 206, y: 58, text: 'Porta Solestà' }],
      encounterZones: [zone(20, 94, 78, 50, 0.1, 'default'), zone(132, 8, 78, 52, 0.08, 'default')],
      transitions: [
        transition(254, 36, 2, 12, 'centro_storico', 3, 42, 'Ponte Romano'),
        transition(254, 76, 2, 12, 'campo_parignano', 3, 80, 'Campo Parignano'),
        transition(194, 158, 16, 2, 'borgo_chiaro', 62, 3, 'Borgo Chiaro')
      ],
      npcs: [npc(63, 86, 'Residente', 'Il ponte romano conduce dritto al centro.', 'verticale')]
    },
    porta_cartara: {
      ...common, name: 'Porta Cartara', baseTile: 'erba', encounterTable: [
        { species: 'tuffito', minLevel: 6, maxLevel: 6, weight: 65 },
        { species: 'pito', minLevel: 7, maxLevel: 7, weight: 30 },
        { species: 'basilino', minLevel: 7, maxLevel: 7, weight: 5 }
      ],
      roads: [rect(78, 0, 20, 160), rect(0, 42, 256, 16), rect(0, 104, 256, 16)],
      waters: [rect(0, 66, 256, 34, 'water')], bridges: [rect(78, 62, 20, 42, 'bridge')],
      buildings: [building(110, 22, 48, 24, 'Porta Cartara', '#a97a5d', 'porta')], plazas: [],
      labels: [{ x: 104, y: 82, text: 'RIO CASTELLANO' }],
      encounterZones: [zone(0, 54, 256, 12, 0.12, 'default'), zone(0, 100, 256, 14, 0.12, 'default')],
      transitions: [transition(80, 0, 16, 2, 'centro_storico', 86, 156, 'Centro Storico')],
      npcs: [npc(111, 112, 'Pescatore', 'I Tuffito si muovono in gruppo lungo il Rio Castellano.', 'fermo')]
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

  window.PokemonAscoliData = {
    version: 1,
    title: 'Pokémon Ascoli',
    tileSize: 16,
    viewport: { width: 240, height: 160 },
    moves,
    species,
    maps,
    typeChart,
    starters: ['basilino', 'puledrotto', 'tuffito'],
    start: { map: 'porta_maggiore', x: 34, y: 66, direction: 'down' },
    respawn: { map: 'porta_maggiore', x: 34, y: 66, direction: 'down' },
    initialItems: { ball: 10, potion: 5, acquasanta: 0 }
  };
}());
