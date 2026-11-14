(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.monticelli = {
    width: 97, height: 64, name: 'Monticelli', baseTile: 'erba', levelRange: [7, 10], encounterTable: [
      { species: 'pito', minLevel: 7, maxLevel: 7, weight: 45 },
      { species: 'segaccio', minLevel: 8, maxLevel: 8, weight: 30 },
      { species: 'banconio', minLevel: 7, maxLevel: 7, weight: 20 },
      { species: 'venagrox', minLevel: 10, maxLevel: 10, weight: 5 }
    ],
    roads: [rect(0, 35, 97, 4), rect(23, 8, 3, 52), rect(53, 4, 3, 57), rect(72, 11, 3, 47)],
    waters: [], bridges: [], plazas: [],
    buildings: [
      building(28, 5, 24, 16, 'Ospedale Mazzoni', '#d5d8d2', 'ospedale'),
      building(7, 42, 12, 8, 'Little Bar', '#b46c52', 'attività'),
      building(57, 42, 14, 8, 'Benzinaio', '#ddc453', 'attività'),
      building(76, 17, 14, 10, 'Pizzeria Mosè', '#bb604b', 'attività')
    ],
    labels: [],
    encounterZones: [
      zone(27, 3, 26, 27, 0.1, 'default'), zone(6, 40, 20, 18, 0.1, 'default'),
      zone(56, 40, 16, 20, 0.1, 'default'), zone(72, 11, 21, 23, 0.1, 'default')
    ],
    transitions: [
      transition(0, 35, 2, 4, 'porta_maggiore', 85, 32, 'Porta Maggiore'),
      transition(95, 35, 2, 4, 'marino_del_tronto', 6, 36, 'Via Salaria', { when: { flag: 'ventidio_visto' }, blockedText: 'Prima passa dal Teatro Ventidio Basso in centro.' })
    ],
    npcs: [
      npc(50, 31, 'Infermiere', 'La zona dell’ospedale è sempre molto frequentata.', 'orizzontale'),
      npc(65, 54, 'Benzinaio', 'Manco più li camion se fermeno qui, è tutto \'n calo.', 'fermo'),
      npc(16, 58, 'Pensionato', 'Certe bande se so\' viste pure da ste parti, tié l\'occhi aperti.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.monticelli;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest
    rect(0, 0, 97, 2, 'albero'), rect(0, 62, 97, 2, 'albero'),
    rect(0, 2, 2, 33, 'albero'), rect(0, 39, 2, 23, 'albero'),
    rect(95, 2, 2, 33, 'albero'), rect(95, 39, 2, 23, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    
    rect(27, 58, 1, 2, 'albero'), 
    rect(70, 58, 2, 2, 'albero'), 
    
  );
}());
