(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_cartara = {
    ...wide, name: 'Porta Cartara', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'tuffito', minLevel: 5, maxLevel: 6, weight: 50 },
      { species: 'soldatino', minLevel: 5, maxLevel: 7, weight: 20 },
      { species: 'cavedi', minLevel: 5, maxLevel: 7, weight: 15 },
      { species: 'tamburino', minLevel: 6, maxLevel: 7, weight: 15 }
    ],
    roads: [rect(47, 0, 2, 80), rect(0, 22, 120, 2), rect(0, 56, 120, 2)],
    waters: [rect(0, 32, 120, 16, 'water')], bridges: [rect(47, 30, 2, 20, 'bridge')],
    buildings: [building(56, 8, 13, 7, 'Porta Cartara', '#a97a5d', 'porta')], plazas: [],
    labels: [{ x: 61, y: 43, text: 'RIO CASTELLANO' }],
    encounterZones: [zone(0, 26, 120, 6, 0.12, 'default'), zone(0, 48, 120, 6, 0.12, 'default')],
    transitions: [transition(47, 0, 2, 1, 'centro_storico', 49, 67, 'Centro Storico')],
    npcs: [
      npc(61, 61, 'Pescatore', 'I Tuffito si muovono in gruppo lungo il Rio Castellano.', 'fermo'),
      npc(40, 30, 'Cartello', 'Rio Castellano: qui Bobby diede il primo Tuffito a chi sceglieva l’acqua.', 'fermo'),
      npc(30, 57, 'Lavandaia', 'Da ragazza si veniva qui a lavà li panni, mo\' nemmanco più.', 'fermo'),
      npc(80, 23, 'Passante', 'Con l’acqua alta certe volte il fiume s\'ariprenne tutto.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.porta_cartara;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a nord
    rect(0, 0, 47, 1, 'albero'), rect(49, 0, 71, 1, 'albero'),
    rect(0, 79, 120, 1, 'albero'),
    rect(0, 1, 1, 78, 'albero'), rect(119, 1, 1, 78, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(7, 10, 2, 1, 'albero'), rect(9, 12, 2, 2, 'albero'),
    rect(93, 10, 2, 1, 'albero'), rect(96, 12, 1, 2, 'albero'),
    rect(7, 63, 2, 2, 'albero'), rect(9, 65, 2, 2, 'albero'),
    rect(93, 63, 2, 2, 'albero'), rect(96, 65, 1, 2, 'albero')
  );
}());
