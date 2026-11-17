(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_cartara = {
    width: 69, height: 46, name: 'Porta Cartara', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'tuffito', minLevel: 5, maxLevel: 6, weight: 50 },
      { species: 'soldatino', minLevel: 5, maxLevel: 7, weight: 20 },
      { species: 'cavedi', minLevel: 5, maxLevel: 7, weight: 15 },
      { species: 'tamburino', minLevel: 6, maxLevel: 7, weight: 15 }
    ],
    roads: [rect(23, 0, 4, 46), rect(0, 21, 69, 3), rect(0, 34, 69, 3)],
    waters: [rect(0, 29, 69, 3, 'water')], bridges: [rect(23, 27, 4, 6, 'bridge')],
    buildings: [building(31, 6, 20, 10, 'Porta Cartara', '#a97a5d', 'porta')], plazas: [],
    labels: [{ x: 38, y: 31, text: 'RIO CASTELLANO' }],
    encounterZones: [zone(0, 26, 69, 3, 0.12, 'default'), zone(0, 32, 69, 2, 0.12, 'default')],
    transitions: [transition(23, 0, 4, 2, 'centro_storico', 51, 66, 'Centro Storico')],
    npcs: [
      npc(38, 39, 'Pescatore', 'I Tuffito si muovono in gruppo lungo il Rio Castellano.', 'fermo'),
      npc(16, 27, 'Cartello', 'Rio Castellano: qui Bobby diede il primo Tuffito a chi sceglieva l’acqua.', 'fermo'),
      npc(11, 36, 'Lavandaia', 'Da frechina ècche se rellavàva li panne, mó manche più.', 'fermo'),
      npc(55, 23, 'Passante', 'Quanne l\'acqua è adda, certe vodde lu fiume se pigghja tutte.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.porta_cartara;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a nord
    rect(0, 0, 23, 2, 'albero'), rect(27, 0, 42, 2, 'albero'),
    rect(0, 44, 69, 2, 'albero'),
    rect(0, 2, 2, 42, 'albero'), rect(67, 2, 2, 42, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(4, 12, 1, 3, 'albero'),
    rect(60, 12, 1, 3, 'albero'),
    rect(4, 41, 1, 1, 'albero'),
    rect(60, 41, 1, 1, 'albero')
  );
}());
