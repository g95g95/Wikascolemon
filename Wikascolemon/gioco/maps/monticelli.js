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
    roads: [rect(0, 58, 180, 4), rect(45, 27, 3, 66), rect(108, 18, 3, 84), rect(150, 30, 3, 60)],
    waters: [], bridges: [], plazas: [],
    buildings: [
      building(63, 24, 24, 16, 'Ospedale Mazzoni', '#d5d8d2', 'ospedale'),
      building(21, 72, 12, 8, 'Little Bar', '#b46c52', 'attività'),
      building(117, 72, 14, 8, 'Benzinaio', '#ddc453', 'attività'),
      building(156, 36, 14, 10, 'Pizzeria Mosè', '#bb604b', 'attività')
    ],
    labels: [],
    encounterZones: [
      zone(57, 9, 45, 42, 0.1, 'default'), zone(18, 66, 30, 24, 0.1, 'default'),
      zone(114, 66, 30, 27, 0.1, 'default'), zone(138, 30, 36, 27, 0.1, 'default')
    ],
    transitions: [
      transition(0, 58, 2, 4, 'porta_maggiore', 136, 55, 'Porta Maggiore'),
      transition(178, 58, 2, 4, 'marino_del_tronto', 6, 55, 'Via Salaria', { when: { flag: 'ventidio_visto' }, blockedText: 'Prima passa dal Teatro Ventidio Basso in centro.' })
    ],
    npcs: [
      npc(85, 52, 'Infermiere', 'La zona dell’ospedale è sempre molto frequentata.', 'orizzontale'),
      npc(125, 84, 'Benzinaio', 'Manco più li camion se fermeno qui, è tutto \'n calo.', 'fermo'),
      npc(30, 90, 'Pensionato', 'Certe bande se so\' viste pure da ste parti, tié l\'occhi aperti.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.monticelli;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest
    rect(0, 0, 180, 2, 'albero'), rect(0, 118, 180, 2, 'albero'),
    rect(0, 2, 2, 56, 'albero'), rect(0, 62, 2, 56, 'albero'),
    rect(178, 2, 2, 56, 'albero'), rect(178, 62, 2, 56, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(10, 20, 3, 2, 'albero'), rect(14, 23, 2, 3, 'albero'),
    rect(60, 90, 3, 2, 'albero'), rect(64, 93, 2, 3, 'albero'),
    rect(130, 90, 3, 2, 'albero'), rect(134, 93, 2, 3, 'albero'),
    rect(165, 10, 3, 2, 'albero'), rect(169, 13, 2, 3, 'albero')
  );
}());
