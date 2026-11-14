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
    roads: [rect(0, 29, 90, 2), rect(23, 14, 1, 33), rect(54, 9, 2, 42), rect(75, 15, 2, 30)],
    waters: [], bridges: [], plazas: [],
    buildings: [
      building(32, 12, 12, 8, 'Ospedale Mazzoni', '#d5d8d2', 'ospedale'),
      building(11, 36, 6, 4, 'Little Bar', '#b46c52', 'attività'),
      building(59, 36, 6, 4, 'Benzinaio', '#ddc453', 'attività'),
      building(78, 18, 7, 5, 'Pizzeria Mosè', '#bb604b', 'attività')
    ],
    labels: [],
    encounterZones: [
      zone(29, 5, 22, 21, 0.1, 'default'), zone(9, 33, 15, 12, 0.1, 'default'),
      zone(57, 33, 15, 14, 0.1, 'default'), zone(69, 15, 18, 14, 0.1, 'default')
    ],
    transitions: [
      transition(0, 29, 1, 2, 'porta_maggiore', 68, 28, 'Porta Maggiore'),
      transition(89, 29, 1, 2, 'marino_del_tronto', 3, 28, 'Via Salaria', { when: { flag: 'ventidio_visto' }, blockedText: 'Prima passa dal Teatro Ventidio Basso in centro.' })
    ],
    npcs: [
      npc(43, 26, 'Infermiere', 'La zona dell’ospedale è sempre molto frequentata.', 'orizzontale'),
      npc(62, 42, 'Benzinaio', 'Manco più li camion se fermeno qui, è tutto \'n calo.', 'fermo'),
      npc(15, 45, 'Pensionato', 'Certe bande se so\' viste pure da ste parti, tié l\'occhi aperti.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.monticelli;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest
    rect(0, 0, 90, 1, 'albero'), rect(0, 59, 90, 1, 'albero'),
    rect(0, 1, 1, 28, 'albero'), rect(0, 31, 1, 28, 'albero'),
    rect(89, 1, 1, 28, 'albero'), rect(89, 31, 1, 28, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(5, 10, 2, 1, 'albero'), rect(7, 11, 1, 2, 'albero'),
    rect(30, 45, 2, 1, 'albero'), rect(32, 47, 1, 1, 'albero'),
    rect(65, 45, 2, 1, 'albero'), rect(67, 47, 1, 1, 'albero'),
    rect(83, 5, 1, 1, 'albero'), rect(85, 7, 1, 1, 'albero')
  );
}());
