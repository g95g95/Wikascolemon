(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.monticelli = {
    ...wide, name: 'Monticelli', baseTile: 'erba', levelRange: [7, 10], encounterTable: [
      { species: 'pito', minLevel: 7, maxLevel: 7, weight: 45 },
      { species: 'segaccio', minLevel: 8, maxLevel: 8, weight: 30 },
      { species: 'banconio', minLevel: 7, maxLevel: 7, weight: 20 },
      { species: 'venagrox', minLevel: 10, maxLevel: 10, weight: 5 }
    ],
    roads: [rect(0, 39, 120, 2), rect(30, 18, 2, 44), rect(72, 12, 2, 56), rect(100, 20, 2, 40)],
    waters: [], bridges: [], plazas: [],
    buildings: [
      building(42, 16, 16, 11, 'Ospedale Mazzoni', '#d5d8d2', 'ospedale'),
      building(14, 48, 8, 5, 'Little Bar', '#b46c52', 'attività'),
      building(78, 48, 9, 5, 'Benzinaio', '#ddc453', 'attività'),
      building(104, 24, 9, 7, 'Pizzeria Mosè', '#bb604b', 'attività')
    ],
    labels: [],
    encounterZones: [
      zone(38, 6, 30, 28, 0.1, 'default'), zone(12, 44, 20, 16, 0.1, 'default'),
      zone(76, 44, 20, 18, 0.1, 'default'), zone(92, 20, 24, 18, 0.1, 'default')
    ],
    transitions: [
      transition(0, 39, 1, 2, 'porta_maggiore', 91, 37, 'Porta Maggiore'),
      transition(119, 39, 1, 2, 'marino_del_tronto', 4, 37, 'Via Salaria', { when: { flag: 'ventidio_visto' }, blockedText: 'Prima passa dal Teatro Ventidio Basso in centro.' })
    ],
    npcs: [
      npc(57, 35, 'Infermiere', 'La zona dell’ospedale è sempre molto frequentata.', 'orizzontale'),
      npc(83, 56, 'Benzinaio', 'Manco più li camion se fermeno qui, è tutto \'n calo.', 'fermo'),
      npc(20, 60, 'Pensionato', 'Certe bande se so\' viste pure da ste parti, tié l\'occhi aperti.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.monticelli;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest
    rect(0, 0, 120, 1, 'albero'), rect(0, 79, 120, 1, 'albero'),
    rect(0, 1, 1, 38, 'albero'), rect(0, 41, 1, 38, 'albero'),
    rect(119, 1, 1, 38, 'albero'), rect(119, 41, 1, 38, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(7, 13, 2, 2, 'albero'), rect(9, 15, 2, 2, 'albero'),
    rect(40, 60, 2, 1, 'albero'), rect(43, 62, 1, 2, 'albero'),
    rect(87, 60, 2, 1, 'albero'), rect(89, 62, 2, 2, 'albero'),
    rect(110, 7, 2, 1, 'albero'), rect(113, 9, 1, 2, 'albero')
  );
}());
