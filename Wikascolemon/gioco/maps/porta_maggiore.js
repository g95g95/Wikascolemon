(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_maggiore = {
    ...city, name: 'Porta Maggiore', baseTile: 'erba', levelRange: [2, 4], encounterTable: [
      { species: 'tifotto', minLevel: 2, maxLevel: 4, weight: 45 },
      { species: 'tamburino', minLevel: 2, maxLevel: 4, weight: 40 },
      { species: 'banconio', minLevel: 2, maxLevel: 4, weight: 15 }
    ],
    roads: [rect(0, 36, 96, 2), rect(10, 28, 2, 16), rect(34, 18, 16, 28), rect(58, 0, 2, 40)],
    waters: [rect(0, 30, 6, 14, 'water')], bridges: [rect(0, 36, 6, 2, 'bridge')],
    buildings: [
      building(8, 18, 11, 5, 'Stazione ferroviaria', '#9b6f57', 'stazione'),
      building(38, 18, 7, 5, 'Chiesa dell’Immacolata', '#c5a677', 'chiesa'),
      building(18, 29, 5, 4, 'Bar di Bobby', '#b46c52', 'attività', { door: { x: 21, y: 33 }, interior: 'bar' }),
      building(66, 21, 4, 4, 'Tabacchi', '#ddc453', 'attività', { door: { x: 69, y: 25 }, interior: 'market' }),
      building(23, 40, 4, 4, 'Casa popolare', '#a08066'),
      building(28, 40, 5, 4, 'Casa popolare', '#a08066'),
      building(40, 47, 4, 4, 'Casa', '#98785e'),
      building(65, 42, 5, 4, 'Casa colonica', '#9c7c5e'),
      building(70, 53, 5, 4, 'Casa colonica', '#9c7c5e')
    ],
    plazas: [rect(37, 30, 11, 8, 'piazza')],
    labels: [{ x: 5, y: 19, text: 'Fermata corriera' }, { x: 41, y: 34, text: 'Piazza Immacolata' }, { x: 9, y: 45, text: 'Ponte di Porta Maggiore' }],
    encounterZones: [zone(20, 6, 12, 14, 0.08, 'default'), zone(66, 8, 24, 18, 0.08, 'default'), zone(68, 48, 24, 18, 0.08, 'default')],
    transitions: [
      transition(0, 36, 1, 2, 'centro_storico', 91, 37, 'Centro Storico', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(95, 36, 1, 2, 'monticelli', 7, 39, 'Monticelli', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(58, 0, 2, 1, 'borgo_chiaro', 59, 75, 'Borgo Chiaro', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(4, 19, 1, 3, 'ripatransone', 4, 37, 'Corriera per Ripatransone', { when: { flag: 'starter_scelto' }, blockedText: 'La corriera parte dopo che hai parlato con Bobby.' })
    ],
    npcs: [
      npc(15, 41, 'Viaggiatore', 'Benvenuto ad Ascoli Piceno!', 'fermo'),
      npc(45, 49, 'Abitante', 'Da qui puoi raggiungere facilmente il centro.', 'verticale'),
      npc(6, 20, 'Cartello', 'CORRIERA PER RIPATRANSONE — partenza qui, fermata a destra della stazione.', 'fermo'),
      npc(25, 45, 'Vicino di casa', 'Sti\' palazzi so\' \'n degrado, ma è casa nostra.', 'fermo'),
      npc(32, 45, 'Ragazza di quartiere', 'Le bande de la piazza fanno soo\' rumore, nient\'artro.', 'orizzontale'),
      npc(15, 29, 'Cliente deluso', 'Er bar de Bobby è chiuso dopo la rissa... ma pé fortuna cura ancora.', 'fermo'),
      {
        x: 11, y: 30, name: 'Bobby', sprite: 'bobby', movement: 'fermo', when: { notFlag: 'intro_vista' },
        script: [
          {
            say: ['{player}, finalmente!', 'So\' n\'sacco d\'anni che nun ce vedimo, ma me servi tu.', 'Vieni al bar che te presento Steven e Elena.'],
            name: 'Bobby'
          },
          { setFlag: 'intro_vista' },
          { warp: { map: 'porta_maggiore', x: 21, y: 34, direction: 'up' } }
        ]
      },
      {
        x: 21, y: 33, name: 'Bobby', sprite: 'bobby', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
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
        x: 19, y: 33, name: 'Steven', sprite: 'steven', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [{ say: 'Er bar Callare è sempre aperto, {player}. Passa quando vôi.', name: 'Steven' }]
      },
      {
        x: 22, y: 33, name: 'Elena', sprite: 'elena', movement: 'fermo', when: { all: [{ flag: 'intro_vista' }, { notFlag: 'starter_scelto' }] },
        script: [{ say: 'All\'Happy Coffee te tengo sempre un posto, {player}.', name: 'Elena' }]
      }
    ]
  };
  const map = window.PokemonAscoliMaps.porta_maggiore;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est/nord e dal ponte/acqua a sud-ovest
    rect(0, 0, 58, 1, 'albero'), rect(60, 0, 36, 1, 'albero'), rect(0, 71, 96, 1, 'albero'),
    rect(0, 1, 1, 35, 'albero'), rect(0, 38, 1, 33, 'albero'),
    rect(95, 1, 1, 35, 'albero'), rect(95, 38, 1, 33, 'albero'),
    rect(1, 1, 57, 2, 'albero'), rect(60, 1, 35, 2, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(12, 12, 2, 1, 'albero'), rect(16, 13, 1, 2, 'albero'),
    rect(70, 30, 2, 1, 'albero'), rect(73, 32, 2, 2, 'albero'),
    rect(72, 53, 2, 2, 'albero'), rect(76, 56, 1, 2, 'albero'),
    // filari attorno alla nuova piazza, ridimensionata rispetto alla vecchia (30×27)
    rect(37, 29, 11, 1, 'albero'), rect(37, 38, 11, 1, 'albero'),
    rect(61, 10, 2, 1, 'albero'), rect(64, 12, 1, 2, 'albero'),
    rect(60, 42, 2, 1, 'albero'), rect(62, 60, 1, 2, 'albero'),
    rect(80, 63, 2, 2, 'albero'), rect(83, 40, 2, 2, 'albero')
  );
}());
