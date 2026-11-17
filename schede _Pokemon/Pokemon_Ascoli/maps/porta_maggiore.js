(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_maggiore = {
    width: 79, height: 55, name: 'Porta Maggiore', baseTile: 'erba', levelRange: [2, 4], encounterTable: [
      { species: 'tifotto', minLevel: 2, maxLevel: 4, weight: 45 },
      { species: 'tamburino', minLevel: 2, maxLevel: 4, weight: 40 },
      { species: 'banconio', minLevel: 2, maxLevel: 4, weight: 15 }
    ],
    roads: [rect(0, 25, 79, 3), rect(10, 14, 3, 21), rect(45, 3, 12, 35), rect(57, 0, 3, 29)],
    waters: [rect(0, 16, 4, 19, 'water')], bridges: [rect(0, 25, 4, 3, 'bridge')],
    buildings: [
      building(7, 3, 16, 8, 'Stazione ferroviaria', '#9b6f57', 'stazione'),
      building(46, 3, 10, 8, 'Chiesa dell’Immacolata', '#c5a677', 'chiesa'),
      building(22, 14, 8, 6, 'Bar di Bobby', '#b46c52', 'attività', { door: { x: 26, y: 20 }, interior: 'bar' }),
      building(63, 7, 6, 6, 'Tabacchi', '#ddc453', 'attività', { door: { x: 67, y: 13 }, interior: 'market' }),
      building(29, 29, 7, 6, 'Casa popolare', '#a08066'),
      building(37, 29, 8, 6, 'Casa popolare', '#a08066'),
      building(49, 39, 6, 6, 'Casa', '#98785e'),
      building(61, 32, 8, 6, 'Casa colonica', '#9c7c5e'),
      building(69, 46, 7, 6, 'Casa colonica', '#9c7c5e')
    ],
    plazas: [rect(45, 16, 12, 12, 'piazza')],
    labels: [{ x: 3, y: 4, text: 'Fermata corriera' }, { x: 51, y: 22, text: 'Piazza Immacolata' }, { x: 8, y: 36, text: 'Ponte di Porta Maggiore' }],
    encounterZones: [zone(25, 2, 18, 4, 0.08, 'default'), zone(63, 3, 13, 11, 0.08, 'default'), zone(66, 41, 11, 12, 0.08, 'default')],
    transitions: [
      transition(0, 25, 2, 3, 'centro_storico', 81, 40, 'Centro Storico', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(77, 25, 2, 3, 'monticelli', 2, 29, 'Monticelli', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(57, 0, 3, 2, 'borgo_chiaro', 47, 45, 'Borgo Chiaro', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(2, 5, 2, 4, 'ripatransone', 2, 35, 'Corriera per Ripatransone', { when: { flag: 'starter_scelto' }, blockedText: 'La corriera parte dopo che hai parlato con Bobby.' })
    ],
    npcs: [
      npc(17, 30, 'Viaggiatore', 'Benvenuto ad Ascoli Piceno!', 'fermo'),
      npc(56, 42, 'Abitante', 'Da qui puoi raggiungere facilmente il centro.', 'verticale'),
      npc(4, 6, 'Cartello', 'CORRIERA PER RIPATRANSONE — partenza qui, fermata a destra della stazione.', 'fermo'),
      npc(32, 36, 'Vicino di casa', '\'Sti palazze è \'n degrade, ma è la casa nostra.', 'fermo'),
      npc(43, 37, 'Ragazza di quartiere', 'Li bande de la piazza fà sule rumore, e vasta.', 'orizzontale'),
      npc(18, 15, 'Cliente deluso', 'Lu bar de Bobby è chiuse dapuó la rissa... ma pe fortuna cura ancora.', 'fermo'),
      {
        x: 11, y: 16, name: 'Bobby', sprite: 'bobby', movement: 'fermo', when: { notFlag: 'intro_vista' },
        script: [
          {
            say: ['{player}, finalmènde!', 'È furia d\'anne che nen ce vedéme, ma tènghe bisogne de te.', 'Viénne a lu bar che te presènde Steven e Elena.'],
            name: 'Bobby'
          },
          { setFlag: 'intro_vista' },
          { warp: { map: 'porta_maggiore', x: 26, y: 22, direction: 'up' } }
        ]
      },
      {
        x: 26, y: 21, name: 'Bobby', sprite: 'bobby', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [
          { say: ['Ehó, frechì! Viénne, viénne, che te presènde chi cónda veramènde da \'sti parte.'], name: 'Bobby' },
          {
            say: [
              'I\' sò Steven, tènghe lu bar Callare a lu Centro Storico.',
              'Da \'sti parte li bar è come nu centre pe li pokémon: se cura, se riposa, se riparte.',
              '\'N Piceno c\'è otte palestre, ma è \'n mà a poche — e pure la lega mó è n\'affare private, mica pe la gende.'
            ],
            name: 'Steven'
          },
          {
            say: [
              'E i\' sò Elena, de l\'Happy Coffee a Campo Parignano.',
              'Lu degrade s\'è magnate \'sta valle: uommene e pokémon che se fà la guerra, bande, mistere che nen se chiarisce mai.',
              'Bobby vo\' riaprì lu bar suó, e nu defennéme li nuostre. Ma serve une de fiducia che conosce bbé \'stu territorie.'
            ],
            name: 'Elena'
          },
          { say: ['Pe quiste te sò chiamate, {player}. Tocca a te sfidà li otte palestre e remètte a poste lu Piceno.'], name: 'Bobby' },
          {
            choice: 'Dove vuoi iniziare?',
            options: [
              {
                text: 'Sant’Emidio alle Grotte',
                then: [
                  { giveMonster: { species: 'basilino', level: 5 } },
                  { setFlag: 'starter_scelto' },
                  { setFlag: 'starter_basilino' },
                  { giveItem: 'ball', qty: 5 },
                  { say: 'Bbrave, statte accorte pe li grotte!', name: 'Bobby' }
                ]
              },
              {
                text: 'Rio Castellano',
                then: [
                  { giveMonster: { species: 'tuffito', level: 5 } },
                  { setFlag: 'starter_scelto' },
                  { setFlag: 'starter_tuffito' },
                  { giveItem: 'ball', qty: 5 },
                  { say: 'Bbrave, mó vanne a bagnatte \'n combagnia!', name: 'Bobby' }
                ]
              },
              {
                text: 'Ripatransone',
                then: [
                  { giveMonster: { species: 'puledrotto', level: 5 } },
                  { setFlag: 'starter_scelto' },
                  { setFlag: 'starter_puledrotto' },
                  { giveItem: 'ball', qty: 5 },
                  { say: 'Bbrave, e mó fàmme vedé mùnde vale!', name: 'Bobby' }
                ]
              }
            ]
          }
        ]
      },
      {
        x: 24, y: 21, name: 'Steven', sprite: 'steven', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [{ say: 'Lu bar Callare è sèmbre aperte, {player}. Passa quanne vuò.', name: 'Steven' }]
      },
      {
        x: 28, y: 21, name: 'Elena', sprite: 'elena', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [{ say: 'A l\'Happy Coffee te tènghe sèmbre nu poste, {player}.', name: 'Elena' }]
      }
    ]
  };
  const map = window.PokemonAscoliMaps.porta_maggiore;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est/nord e dal ponte/acqua a sud-ovest
    rect(0, 0, 57, 2, 'albero'), rect(60, 0, 19, 2, 'albero'), rect(0, 53, 79, 2, 'albero'),
    rect(0, 2, 2, 23, 'albero'), rect(0, 28, 2, 25, 'albero'),
    rect(77, 2, 2, 23, 'albero'), rect(77, 28, 2, 25, 'albero'),
    
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    
    rect(69, 16, 3, 2, 'albero'), rect(74, 19, 2, 3, 'albero'),
    rect(72, 46, 3, 2, 'albero'), 
    // filari attorno alla nuova piazza, ridimensionata rispetto alla vecchia (30×27)
    rect(45, 14, 12, 2, 'albero'), rect(45, 28, 12, 1, 'albero'),
    
    
    
  );
}());
