(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.marino_del_tronto = {
    ...wide, name: 'Marino del Tronto', baseTile: 'erba', levelRange: [4, 7],
    encounterTable: [
      { species: 'tifotto', minLevel: 4, maxLevel: 7, weight: 35 },
      { species: 'totera', minLevel: 4, maxLevel: 7, weight: 30 },
      { species: 'ciuci', minLevel: 4, maxLevel: 6, weight: 20 },
      { species: 'sorci', minLevel: 5, maxLevel: 7, weight: 15 }
    ],
    roads: [
      // Via Salaria: dritta ai bordi (colonne dei passaggi/spawn), leggera curva nel mezzo
      rect(0, 36, 27, 3, 'asfalto'),
      rect(27, 35, 13, 2, 'asfalto'),
      rect(40, 34, 20, 3, 'asfalto'),
      rect(60, 35, 13, 2, 'asfalto'),
      rect(73, 36, 47, 3, 'asfalto'),
      // sentierino ghiaia dalla strada verso il ponte e lungo la riva sud
      rect(57, 39, 2, 23, 'ghiaia'),
      rect(40, 67, 40, 1, 'ghiaia'),
      // stradina sterrata verso i capannoni a nord
      rect(20, 13, 1, 22, 'ghiaia')
    ],
    waters: [rect(0, 62, 120, 6, 'water')],
    bridges: [rect(57, 62, 2, 6, 'bridge')],
    plazas: [],
    buildings: [
      building(9, 17, 8, 6, 'Capannone agricolo', '#9c8a6f', 'edificio'),
      building(80, 15, 7, 5, 'Casolare', '#b6825f', 'edificio')
    ],
    labels: [
      { x: 3, y: 32, text: 'Percorso 1 — Via Salaria' },
      { x: 55, y: 27, text: 'Marino del Tronto' },
      { x: 52, y: 59, text: 'Fiume Tronto' }
    ],
    encounterZones: [
      zone(3, 3, 114, 29, 0.08, 'default'),
      zone(3, 41, 20, 19, 0.1, 'default'),
      zone(100, 41, 17, 19, 0.1, 'default'),
      zone(3, 69, 114, 10, 0.12, 'default')
    ],
    transitions: [
      transition(0, 36, 1, 3, 'monticelli', 115, 39, 'Monticelli'),
      transition(119, 36, 1, 3, 'oasi', 4, 37, 'Oasi')
    ],
    npcs: [
      npc(2, 34, 'Cartello', 'Percorso 1 — Via Salaria: da Monticelli all\'Oasi lungo il Tronto.', 'fermo'),
      npc(55, 29, 'Cartello', 'Marino del Tronto: campi, filari e il fiume più a sud.', 'fermo'),
      npc(13, 27, 'Contadino', 'Qui la terra è bona: se semina de tutto, granturco pure.', 'fermo'),
      npc(63, 68, 'Abitante', 'Attento a quer ponte quanno piove, che l\'acqua sale forte.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.marino_del_tronto;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi ovest/est e dal fiume a sud
    rect(0, 0, 120, 1, 'albero'),
    rect(0, 1, 1, 35, 'albero'), rect(0, 39, 1, 23, 'albero'),
    rect(119, 1, 1, 35, 'albero'), rect(119, 39, 1, 23, 'albero'),
    rect(1, 1, 118, 2, 'albero'),
    // filari a nord-ovest e nord-est (campi coltivati)
    rect(4, 5, 13, 1, 'albero'), rect(4, 7, 13, 1, 'albero'), rect(4, 9, 13, 1, 'albero'),
    rect(93, 5, 22, 1, 'albero'), rect(93, 7, 22, 1, 'albero'), rect(93, 9, 22, 1, 'albero'),
    rect(33, 4, 16, 1, 'albero'), rect(33, 6, 16, 1, 'albero'),
    // boschetti sparsi lontano da strade/edifici/npc/passaggi
    rect(107, 20, 2, 1, 'albero'), rect(109, 22, 2, 2, 'albero'),
    rect(5, 44, 2, 1, 'albero'), rect(8, 46, 1, 2, 'albero'),
    rect(100, 45, 2, 2, 'albero'), rect(103, 47, 1, 2, 'albero'),
    // filare lungo la riva nord del fiume (esclusa la zona del ponte e del sentiero)
    rect(4, 59, 49, 1, 'albero'), rect(63, 59, 52, 1, 'albero')
  );
}());
