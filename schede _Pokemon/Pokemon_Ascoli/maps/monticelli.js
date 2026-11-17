(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.monticelli = {
    width: 86, height: 50, name: 'Monticelli', baseTile: 'erba', levelRange: [7, 10], encounterTable: [
      { species: 'pito', minLevel: 7, maxLevel: 8, weight: 45 },
      { species: 'tamburino', minLevel: 7, maxLevel: 8, weight: 30 },
      { species: 'anicino', minLevel: 7, maxLevel: 8, weight: 22 },
      { species: 'banconio', minLevel: 7, maxLevel: 7, weight: 3 } // raro e al livello più basso della zona
    ],
    roads: [rect(0, 29, 86, 4), rect(18, 6, 3, 41), rect(47, 3, 3, 45), rect(65, 9, 3, 37)],
    waters: [], bridges: [], plazas: [],
    buildings: [
      building(23, 3, 24, 16, 'Ospedale Mazzoni', '#d5d8d2', 'ospedale'),
      building(4, 34, 12, 8, 'Little Bar', '#b46c52', 'attività'),
      building(51, 34, 14, 8, 'Benzinaio', '#ddc453', 'attività'),
      building(69, 15, 14, 10, 'Pizzeria Mosè', '#bb604b', 'attività')
    ],
    labels: [],
    encounterZones: [
      zone(22, 2, 25, 25, 0.1, 'default'), zone(3, 33, 18, 13, 0.1, 'default'),
      zone(50, 33, 15, 14, 0.1, 'default'), zone(65, 9, 19, 20, 0.1, 'default')
    ],
    transitions: [
      transition(0, 29, 2, 4, 'porta_maggiore', 76, 26, 'Porta Maggiore'),
      transition(84, 29, 2, 4, 'marino_del_tronto', 5, 30, 'Via Salaria', { when: { flag: 'ventidio_visto' }, blockedText: 'Prima passa dal Teatro Ventidio Basso in centro.' })
    ],
    npcs: [
      npc(45, 27, 'Infermiere', 'La zona dell’ospedale è sempre molto frequentata.', 'orizzontale'),
      npc(59, 44, 'Benzinaio', 'Manche più li camion se ferma ècche, è tutte \'n cale.', 'fermo'),
      npc(13, 46, 'Pensionato', 'Certe bande s\'è viste pure da \'ste parti, tiéne l\'occhie aperte.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.monticelli;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest
    rect(0, 0, 86, 2, 'albero'), rect(0, 48, 86, 2, 'albero'),
    rect(0, 2, 2, 27, 'albero'), rect(0, 33, 2, 15, 'albero'),
    rect(84, 2, 2, 27, 'albero'), rect(84, 33, 2, 15, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    
    rect(22, 46, 1, 1, 'albero'), 
    rect(64, 46, 1, 1, 'albero'), 
    
  );
}());
