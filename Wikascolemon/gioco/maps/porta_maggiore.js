(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_maggiore = {
    ...city, name: 'Porta Maggiore', baseTile: 'erba', levelRange: [2, 4], encounterTable: [
      { species: 'tifotto', minLevel: 2, maxLevel: 4, weight: 45 },
      { species: 'tamburino', minLevel: 2, maxLevel: 4, weight: 40 },
      { species: 'banconio', minLevel: 2, maxLevel: 4, weight: 15 }
    ],
    roads: [rect(0, 27, 72, 2), rect(8, 21, 1, 12), rect(26, 14, 12, 21), rect(44, 0, 1, 30)],
    waters: [rect(0, 23, 5, 10, 'water')], bridges: [rect(0, 27, 5, 2, 'bridge')],
    buildings: [
      building(6, 14, 8, 3, 'Stazione ferroviaria', '#9b6f57', 'stazione'),
      building(29, 14, 5, 3, 'Chiesa dell’Immacolata', '#c5a677', 'chiesa'),
      building(14, 22, 3, 3, 'Bar di Bobby', '#b46c52', 'attività', { door: { x: 16, y: 25 }, interior: 'bar' }),
      building(50, 16, 3, 3, 'Tabacchi', '#ddc453', 'attività', { door: { x: 52, y: 19 }, interior: 'market' }),
      building(17, 30, 3, 3, 'Casa popolare', '#a08066'),
      building(21, 30, 4, 3, 'Casa popolare', '#a08066'),
      building(30, 35, 3, 3, 'Casa', '#98785e'),
      building(49, 32, 4, 3, 'Casa colonica', '#9c7c5e'),
      building(53, 40, 3, 3, 'Casa colonica', '#9c7c5e')
    ],
    plazas: [rect(28, 23, 8, 6, 'piazza')],
    labels: [{ x: 4, y: 14, text: 'Fermata corriera' }, { x: 31, y: 26, text: 'Piazza Immacolata' }, { x: 7, y: 34, text: 'Ponte di Porta Maggiore' }],
    encounterZones: [zone(15, 5, 9, 10, 0.08, 'default'), zone(50, 6, 18, 14, 0.08, 'default'), zone(51, 36, 18, 14, 0.08, 'default')],
    transitions: [
      transition(0, 27, 1, 2, 'centro_storico', 68, 28, 'Centro Storico', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(71, 27, 1, 2, 'monticelli', 5, 29, 'Monticelli', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(44, 0, 1, 1, 'borgo_chiaro', 44, 56, 'Borgo Chiaro', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(3, 14, 1, 3, 'ripatransone', 3, 28, 'Corriera per Ripatransone', { when: { flag: 'starter_scelto' }, blockedText: 'La corriera parte dopo che hai parlato con Bobby.' })
    ],
    npcs: [
      npc(11, 31, 'Viaggiatore', 'Benvenuto ad Ascoli Piceno!', 'fermo'),
      npc(34, 37, 'Abitante', 'Da qui puoi raggiungere facilmente il centro.', 'verticale'),
      npc(5, 15, 'Cartello', 'CORRIERA PER RIPATRANSONE — partenza qui, fermata a destra della stazione.', 'fermo'),
      npc(19, 34, 'Vicino di casa', 'Sti\' palazzi so\' \'n degrado, ma è casa nostra.', 'fermo'),
      npc(24, 34, 'Ragazza di quartiere', 'Le bande de la piazza fanno soo\' rumore, nient\'artro.', 'orizzontale'),
      npc(11, 22, 'Cliente deluso', 'Er bar de Bobby è chiuso dopo la rissa... ma pé fortuna cura ancora.', 'fermo'),
      {
        x: 8, y: 23, name: 'Bobby', sprite: 'bobby', movement: 'fermo', when: { notFlag: 'intro_vista' },
        script: [
          {
            say: ['{player}, finalmente!', 'So\' n\'sacco d\'anni che nun ce vedimo, ma me servi tu.', 'Vieni al bar che te presento Steven e Elena.'],
            name: 'Bobby'
          },
          { setFlag: 'intro_vista' },
          { warp: { map: 'porta_maggiore', x: 16, y: 26, direction: 'up' } }
        ]
      },
      {
        x: 16, y: 25, name: 'Bobby', sprite: 'bobby', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
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
        x: 14, y: 25, name: 'Steven', sprite: 'steven', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [{ say: 'Er bar Callare è sempre aperto, {player}. Passa quando vôi.', name: 'Steven' }]
      },
      {
        x: 17, y: 25, name: 'Elena', sprite: 'elena', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [{ say: 'All\'Happy Coffee te tengo sempre un posto, {player}.', name: 'Elena' }]
      }
    ]
  };
  const map = window.PokemonAscoliMaps.porta_maggiore;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est/nord e dal ponte/acqua a sud-ovest
    rect(0, 0, 44, 1, 'albero'), rect(45, 0, 27, 1, 'albero'), rect(0, 53, 72, 1, 'albero'),
    rect(0, 1, 1, 26, 'albero'), rect(0, 29, 1, 24, 'albero'),
    rect(71, 1, 1, 26, 'albero'), rect(71, 29, 1, 24, 'albero'),
    rect(1, 1, 43, 1, 'albero'), rect(45, 1, 26, 1, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(9, 9, 2, 1, 'albero'), rect(12, 10, 1, 1, 'albero'),
    rect(53, 23, 1, 1, 'albero'), rect(55, 24, 1, 2, 'albero'),
    rect(54, 40, 2, 1, 'albero'), rect(57, 42, 1, 2, 'albero'),
    // filari attorno alla nuova piazza, ridimensionata rispetto alla vecchia (30×27)
    rect(28, 22, 8, 1, 'albero'), rect(28, 29, 8, 1, 'albero'),
    rect(46, 8, 1, 1, 'albero'), rect(48, 9, 1, 2, 'albero'),
    rect(45, 32, 2, 1, 'albero'), rect(47, 45, 1, 2, 'albero'),
    rect(60, 47, 2, 2, 'albero'), rect(62, 30, 2, 2, 'albero')
  );
}());
