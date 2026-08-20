(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_maggiore = {
    ...city, name: 'Porta Maggiore', baseTile: 'erba', levelRange: [4, 6], encounterTable: [
      { species: 'pito', minLevel: 4, maxLevel: 4, weight: 55 },
      { species: 'basilino', minLevel: 5, maxLevel: 5, weight: 35 },
      { species: 'banconio', minLevel: 6, maxLevel: 6, weight: 10 }
    ],
    roads: [rect(0, 54, 144, 3), rect(15, 42, 3, 24), rect(51, 27, 24, 42), rect(87, 0, 3, 60)],
    waters: [rect(0, 45, 9, 21, 'water')], bridges: [rect(0, 54, 9, 3, 'bridge')],
    buildings: [
      building(12, 27, 16, 8, 'Stazione ferroviaria', '#9b6f57', 'stazione'),
      building(57, 27, 10, 8, 'Chiesa dell’Immacolata', '#c5a677', 'chiesa'),
      building(27, 43, 8, 6, 'Bar di Bobby', '#b46c52', 'attività', { door: { x: 31, y: 49 }, interior: 'bar' }),
      building(99, 31, 6, 6, 'Tabacchi', '#ddc453', 'attività', { door: { x: 103, y: 37 }, interior: 'market' })
    ],
    plazas: [rect(48, 39, 30, 27, 'piazza')],
    labels: [{ x: 64, y: 46, text: 'Piazza Immacolata' }, { x: 13, y: 67, text: 'Ponte di Porta Maggiore' }],
    encounterZones: [zone(30, 9, 18, 21, 0.08, 'default'), zone(99, 12, 36, 27, 0.08, 'default'), zone(102, 72, 36, 27, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 3, 'centro_storico', 136, 55, 'Centro Storico', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(142, 54, 2, 3, 'monticelli', 10, 58, 'Monticelli', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(87, 0, 3, 2, 'borgo_chiaro', 88, 112, 'Borgo Chiaro', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' })
    ],
    npcs: [
      npc(22, 61, 'Viaggiatore', 'Benvenuto ad Ascoli Piceno!', 'fermo'),
      npc(67, 73, 'Abitante', 'Da qui puoi raggiungere facilmente il centro.', 'verticale'),
      {
        x: 31, y: 50, name: 'Bobby', movement: 'fermo', when: { notFlag: 'starter_scelto' },
        script: [
          { say: ['Ehò, uagliò! Nuovo da queste parti, eh?', 'Io so\' Bobby, tengo \'sto bar da na vita.', 'Se vuoi girà pé \'l Piceno t\'serve un compagno de viaggio.'], name: 'Bobby' },
          {
            choice: 'Dove vuoi iniziare?',
            options: [
              {
                text: 'Sant’Emidio alle Grotte',
                then: [
                  { giveMonster: { species: 'basilino', level: 5 } },
                  { setFlag: 'starter_scelto' },
                  { giveItem: 'ball', qty: 5 },
                  { say: 'Bravo, statte accorto pé le grotte!', name: 'Bobby' }
                ]
              },
              {
                text: 'Rio Castellano',
                then: [
                  { giveMonster: { species: 'tuffito', level: 5 } },
                  { setFlag: 'starter_scelto' },
                  { giveItem: 'ball', qty: 5 },
                  { say: 'Bravo, mo\' vai a mmojatte \'n compagnia!', name: 'Bobby' }
                ]
              },
              {
                text: 'Ripatransone',
                then: [
                  { giveMonster: { species: 'puledrotto', level: 5 } },
                  { setFlag: 'starter_scelto' },
                  { giveItem: 'ball', qty: 5 },
                  { say: 'Bravo, e mo\' famme vedé che sai fa\'!', name: 'Bobby' }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  const map = window.PokemonAscoliMaps.porta_maggiore;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est/nord e dal ponte/acqua a sud-ovest
    rect(0, 0, 87, 2, 'albero'), rect(90, 0, 54, 2, 'albero'), rect(0, 106, 144, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'), rect(0, 57, 2, 49, 'albero'),
    rect(142, 2, 2, 52, 'albero'), rect(142, 57, 2, 49, 'albero'),
    rect(2, 2, 85, 2, 'albero'), rect(90, 2, 52, 2, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(18, 18, 3, 2, 'albero'), rect(24, 20, 2, 3, 'albero'),
    rect(105, 45, 3, 2, 'albero'), rect(110, 48, 2, 3, 'albero'),
    rect(108, 80, 3, 2, 'albero'), rect(114, 84, 2, 3, 'albero')
  );
}());
