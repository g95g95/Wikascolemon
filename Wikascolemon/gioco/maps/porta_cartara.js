(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_cartara = {
    ...wide, name: 'Porta Cartara', baseTile: 'erba', levelRange: [6, 7], encounterTable: [
      { species: 'tuffito', minLevel: 6, maxLevel: 6, weight: 65 },
      { species: 'pito', minLevel: 7, maxLevel: 7, weight: 30 },
      { species: 'basilino', minLevel: 7, maxLevel: 7, weight: 5 }
    ],
    roads: [rect(70, 0, 4, 120), rect(0, 33, 180, 3), rect(0, 84, 180, 3)],
    waters: [rect(0, 48, 180, 24, 'water')], bridges: [rect(70, 45, 4, 30, 'bridge')],
    buildings: [building(84, 12, 20, 10, 'Porta Cartara', '#a97a5d', 'porta')], plazas: [],
    labels: [{ x: 91, y: 64, text: 'RIO CASTELLANO' }],
    encounterZones: [zone(0, 39, 180, 9, 0.12, 'default'), zone(0, 72, 180, 9, 0.12, 'default')],
    transitions: [transition(70, 0, 4, 2, 'centro_storico', 73, 100, 'Centro Storico')],
    npcs: [npc(91, 91, 'Pescatore', 'I Tuffito si muovono in gruppo lungo il Rio Castellano.', 'fermo')]
  };
  const map = window.PokemonAscoliMaps.porta_cartara;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a nord
    rect(0, 0, 70, 2, 'albero'), rect(74, 0, 106, 2, 'albero'),
    rect(0, 118, 180, 2, 'albero'),
    rect(0, 2, 2, 116, 'albero'), rect(178, 2, 2, 116, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(10, 15, 3, 2, 'albero'), rect(14, 18, 2, 3, 'albero'),
    rect(140, 15, 3, 2, 'albero'), rect(144, 18, 2, 3, 'albero'),
    rect(10, 95, 3, 2, 'albero'), rect(14, 98, 2, 3, 'albero'),
    rect(140, 95, 3, 2, 'albero'), rect(144, 98, 2, 3, 'albero')
  );
}());
