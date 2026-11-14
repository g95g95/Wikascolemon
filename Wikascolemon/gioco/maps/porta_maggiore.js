(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_maggiore = {
    width: 90, height: 66, name: 'Porta Maggiore', baseTile: 'erba', levelRange: [2, 4], encounterTable: [
      { species: 'tifotto', minLevel: 2, maxLevel: 4, weight: 45 },
      { species: 'tamburino', minLevel: 2, maxLevel: 4, weight: 40 },
      { species: 'banconio', minLevel: 2, maxLevel: 4, weight: 15 }
    ],
    roads: [rect(0, 31, 90, 3), rect(13, 19, 3, 24), rect(49, 7, 13, 39), rect(63, 0, 3, 37)],
    waters: [rect(0, 22, 7, 21, 'water')], bridges: [rect(0, 31, 7, 3, 'bridge')],
    buildings: [
      building(10, 7, 16, 8, 'Stazione ferroviaria', '#9b6f57', 'stazione'),
      building(50, 7, 10, 8, 'Chiesa dell’Immacolata', '#c5a677', 'chiesa'),
      building(25, 20, 8, 6, 'Bar di Bobby', '#b46c52', 'attività', { door: { x: 29, y: 26 }, interior: 'bar' }),
      building(70, 11, 6, 6, 'Tabacchi', '#ddc453', 'attività', { door: { x: 74, y: 17 }, interior: 'market' }),
      building(32, 37, 7, 6, 'Casa popolare', '#a08066'),
      building(40, 37, 8, 6, 'Casa popolare', '#a08066'),
      building(53, 47, 6, 6, 'Casa', '#98785e'),
      building(68, 40, 8, 6, 'Casa colonica', '#9c7c5e'),
      building(76, 56, 7, 6, 'Casa colonica', '#9c7c5e')
    ],
    plazas: [rect(49, 22, 13, 12, 'piazza')],
    labels: [{ x: 5, y: 8, text: 'Fermata corriera' }, { x: 55, y: 28, text: 'Piazza Immacolata' }, { x: 11, y: 44, text: 'Ponte di Porta Maggiore' }],
    encounterZones: [zone(28, 3, 18, 7, 0.08, 'default'), zone(70, 6, 14, 13, 0.08, 'default'), zone(73, 49, 14, 15, 0.08, 'default')],
    transitions: [
      transition(0, 31, 2, 3, 'centro_storico', 93, 49, 'Centro Storico', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(88, 31, 2, 3, 'monticelli', 4, 35, 'Monticelli', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(63, 0, 3, 2, 'borgo_chiaro', 58, 59, 'Borgo Chiaro', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(4, 9, 2, 4, 'ripatransone', 5, 40, 'Corriera per Ripatransone', { when: { flag: 'starter_scelto' }, blockedText: 'La corriera parte dopo che hai parlato con Bobby.' })
    ],
    npcs: [
      npc(20, 38, 'Viaggiatore', 'Benvenuto ad Ascoli Piceno!', 'fermo'),
      npc(60, 50, 'Abitante', 'Da qui puoi raggiungere facilmente il centro.', 'verticale'),
      npc(7, 10, 'Cartello', 'CORRIERA PER RIPATRANSONE — partenza qui, fermata a destra della stazione.', 'fermo'),
      npc(35, 44, 'Vicino di casa', 'Sti\' palazzi so\' \'n degrado, ma è casa nostra.', 'fermo'),
      npc(46, 45, 'Ragazza di quartiere', 'Le bande de la piazza fanno soo\' rumore, nient\'artro.', 'orizzontale'),
      npc(21, 21, 'Cliente deluso', 'Er bar de Bobby è chiuso dopo la rissa... ma pé fortuna cura ancora.', 'fermo'),
      {
        x: 14, y: 22, name: 'Bobby', sprite: 'bobby', movement: 'fermo', when: { notFlag: 'intro_vista' },
        script: [
          {
            say: ['{player}, finalmente!', 'So\' n\'sacco d\'anni che nun ce vedimo, ma me servi tu.', 'Vieni al bar che te presento Steven e Elena.'],
            name: 'Bobby'
          },
          { setFlag: 'intro_vista' },
          { warp: { map: 'porta_maggiore', x: 29, y: 28, direction: 'up' } }
        ]
      },
      {
        x: 29, y: 27, name: 'Bobby', sprite: 'bobby', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [
          { say: ['Ehò, uagliò! Vieni, vieni, che te presento chi conta veramente da ste parti.'], name: 'Bobby' },
          {
            say: [
              'Io so\' Steven, tengo er bar Callare ar centro storico.',
              'Da ste parti i bar so\' comme dei centri pé i pokémon: se cura, se ripo\'sa, se riparte.',
              'Nel Piceno ce so\' otto palestre, ma so\' \'n mano a pochi — e pure la lega ormai è \'n affare privato, mica pé la gente.'
            ],
            name: 'Steven'
          },
          {
            say: [
              'E io so\' Elena, dell\'Happy Coffee a Campo Parignano.',
              'Er degrado s\'è magnato \'sta valle: umani e pokémon che se fanno la guerra, bande, misteri che nun se chiariscono mai.',
              'Bobby vo\' riaprì er su\' bar, e nnoialtri difendemo i nostri. Ma serve uno de fiducia che conosce bbene \'sto territorio.'
            ],
            name: 'Elena'
          },
          { say: ['Pé questo t\'ho chiamato, {player}. Tocca a tté sfidà le otto palestre e rimette\' a posto \'l Piceno.'], name: 'Bobby' },
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
                  { say: 'Bravo, statte accorto pé le grotte!', name: 'Bobby' }
                ]
              },
              {
                text: 'Rio Castellano',
                then: [
                  { giveMonster: { species: 'tuffito', level: 5 } },
                  { setFlag: 'starter_scelto' },
                  { setFlag: 'starter_tuffito' },
                  { giveItem: 'ball', qty: 5 },
                  { say: 'Bravo, mo\' vai a mmojatte \'n compagnia!', name: 'Bobby' }
                ]
              },
              {
                text: 'Ripatransone',
                then: [
                  { giveMonster: { species: 'puledrotto', level: 5 } },
                  { setFlag: 'starter_scelto' },
                  { setFlag: 'starter_puledrotto' },
                  { giveItem: 'ball', qty: 5 },
                  { say: 'Bravo, e mo\' famme vedé che sai fa\'!', name: 'Bobby' }
                ]
              }
            ]
          }
        ]
      },
      {
        x: 27, y: 27, name: 'Steven', sprite: 'steven', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [{ say: 'Er bar Callare è sempre aperto, {player}. Passa quando vôi.', name: 'Steven' }]
      },
      {
        x: 31, y: 27, name: 'Elena', sprite: 'elena', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [{ say: 'All\'Happy Coffee te tengo sempre un posto, {player}.', name: 'Elena' }]
      }
    ]
  };
  const map = window.PokemonAscoliMaps.porta_maggiore;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est/nord e dal ponte/acqua a sud-ovest
    rect(0, 0, 63, 2, 'albero'), rect(66, 0, 24, 2, 'albero'), rect(0, 64, 90, 2, 'albero'),
    rect(0, 2, 2, 29, 'albero'), rect(0, 34, 2, 30, 'albero'),
    rect(88, 2, 2, 29, 'albero'), rect(88, 34, 2, 30, 'albero'),
    rect(2, 2, 61, 1, 'albero'), rect(66, 2, 22, 1, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    
    rect(76, 22, 3, 2, 'albero'), rect(81, 25, 2, 3, 'albero'),
    rect(79, 56, 3, 2, 'albero'), 
    // filari attorno alla nuova piazza, ridimensionata rispetto alla vecchia (30×27)
    rect(49, 20, 13, 2, 'albero'), rect(49, 34, 13, 2, 'albero'),
    
    rect(66, 40, 1, 2, 'albero'), 
    
  );
}());
