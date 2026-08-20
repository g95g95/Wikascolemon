(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_maggiore = {
    ...city, name: 'Porta Maggiore', baseTile: 'erba', levelRange: [2, 4], encounterTable: [
      { species: 'tifotto', minLevel: 2, maxLevel: 4, weight: 45 },
      { species: 'tamburino', minLevel: 2, maxLevel: 4, weight: 40 },
      { species: 'banconio', minLevel: 2, maxLevel: 4, weight: 15 }
    ],
    roads: [rect(0, 54, 144, 3), rect(15, 42, 3, 24), rect(51, 27, 24, 42), rect(87, 0, 3, 60)],
    waters: [rect(0, 45, 9, 21, 'water')], bridges: [rect(0, 54, 9, 3, 'bridge')],
    buildings: [
      building(12, 27, 16, 8, 'Stazione ferroviaria', '#9b6f57', 'stazione'),
      building(57, 27, 10, 8, 'Chiesa dell’Immacolata', '#c5a677', 'chiesa'),
      building(27, 43, 8, 6, 'Bar di Bobby', '#b46c52', 'attività', { door: { x: 31, y: 49 }, interior: 'bar' }),
      building(99, 31, 6, 6, 'Tabacchi', '#ddc453', 'attività', { door: { x: 103, y: 37 }, interior: 'market' }),
      building(34, 60, 7, 6, 'Casa popolare', '#a08066'),
      building(42, 60, 8, 6, 'Casa popolare', '#a08066'),
      building(60, 70, 6, 6, 'Casa', '#98785e'),
      building(97, 63, 8, 6, 'Casa colonica', '#9c7c5e'),
      building(105, 80, 7, 6, 'Casa colonica', '#9c7c5e')
    ],
    plazas: [rect(56, 45, 16, 12, 'piazza')],
    labels: [{ x: 7, y: 28, text: 'Fermata corriera' }, { x: 62, y: 51, text: 'Piazza Immacolata' }, { x: 13, y: 67, text: 'Ponte di Porta Maggiore' }],
    encounterZones: [zone(30, 9, 18, 21, 0.08, 'default'), zone(99, 12, 36, 27, 0.08, 'default'), zone(102, 72, 36, 27, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 3, 'centro_storico', 136, 55, 'Centro Storico', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(142, 54, 2, 3, 'monticelli', 10, 58, 'Monticelli', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(87, 0, 3, 2, 'borgo_chiaro', 88, 112, 'Borgo Chiaro', { when: { flag: 'starter_scelto' }, blockedText: 'Prima parla con Bobby al bar.' }),
      transition(6, 29, 2, 4, 'ripatransone', 6, 55, 'Corriera per Ripatransone', { when: { flag: 'starter_scelto' }, blockedText: 'La corriera parte dopo che hai parlato con Bobby.' })
    ],
    npcs: [
      npc(22, 61, 'Viaggiatore', 'Benvenuto ad Ascoli Piceno!', 'fermo'),
      npc(67, 73, 'Abitante', 'Da qui puoi raggiungere facilmente il centro.', 'verticale'),
      npc(9, 30, 'Cartello', 'CORRIERA PER RIPATRANSONE — partenza qui, fermata a destra della stazione.', 'fermo'),
      npc(37, 67, 'Vicino di casa', 'Sti\' palazzi so\' \'n degrado, ma è casa nostra.', 'fermo'),
      npc(48, 68, 'Ragazza di quartiere', 'Le bande de la piazza fanno soo\' rumore, nient\'artro.', 'orizzontale'),
      npc(23, 44, 'Cliente deluso', 'Er bar de Bobby è chiuso dopo la rissa... ma pé fortuna cura ancora.', 'fermo'),
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
    rect(108, 80, 3, 2, 'albero'), rect(114, 84, 2, 3, 'albero'),
    // filari attorno alla nuova piazza, ridimensionata rispetto alla vecchia (30×27)
    rect(56, 43, 16, 2, 'albero'), rect(56, 57, 16, 2, 'albero'),
    rect(92, 15, 3, 2, 'albero'), rect(96, 18, 2, 3, 'albero'),
    rect(90, 63, 3, 2, 'albero'), rect(93, 90, 2, 3, 'albero'),
    rect(120, 95, 3, 2, 'albero'), rect(125, 60, 2, 3, 'albero')
  );
}());
