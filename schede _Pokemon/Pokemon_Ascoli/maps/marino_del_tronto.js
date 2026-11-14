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
      rect(0, 27, 20, 2, 'asfalto'),
      rect(20, 26, 10, 2, 'asfalto'),
      rect(30, 26, 15, 2, 'asfalto'),
      rect(45, 26, 10, 2, 'asfalto'),
      rect(55, 27, 35, 2, 'asfalto'),
      // sentierino ghiaia dalla strada verso il ponte e lungo la riva sud
      rect(43, 29, 1, 18, 'ghiaia'),
      rect(30, 50, 30, 1, 'ghiaia'),
      // stradina sterrata verso i capannoni a nord
      rect(15, 10, 1, 16, 'ghiaia')
    ],
    waters: [rect(0, 47, 90, 4, 'water')],
    bridges: [rect(43, 47, 1, 4, 'bridge')],
    plazas: [],
    buildings: [
      building(7, 13, 6, 4, 'Capannone agricolo', '#9c8a6f', 'edificio'),
      building(60, 11, 5, 4, 'Casolare', '#b6825f', 'edificio')
    ],
    labels: [
      { x: 2, y: 24, text: 'Percorso 1 — Via Salaria' },
      { x: 41, y: 20, text: 'Marino del Tronto' },
      { x: 39, y: 44, text: 'Fiume Tronto' }
    ],
    encounterZones: [
      zone(2, 2, 86, 22, 0.08, 'default'),
      zone(2, 31, 15, 14, 0.1, 'default'),
      zone(75, 31, 13, 14, 0.1, 'default'),
      zone(2, 52, 86, 7, 0.12, 'default')
    ],
    transitions: [
      transition(0, 27, 1, 2, 'monticelli', 86, 29, 'Monticelli'),
      transition(89, 27, 1, 2, 'oasi', 3, 28, 'Oasi')
    ],
    npcs: [
      npc(2, 26, 'Cartello', 'Percorso 1 — Via Salaria: da Monticelli all\'Oasi lungo il Tronto.', 'fermo'),
      npc(41, 22, 'Cartello', 'Marino del Tronto: campi, filari e il fiume più a sud.', 'fermo'),
      npc(10, 20, 'Contadino', 'Qui la terra è bona: se semina de tutto, granturco pure.', 'fermo'),
      npc(47, 51, 'Abitante', 'Attento a quer ponte quanno piove, che l\'acqua sale forte.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.marino_del_tronto;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi ovest/est e dal fiume a sud
    rect(0, 0, 90, 1, 'albero'),
    rect(0, 1, 1, 26, 'albero'), rect(0, 29, 1, 18, 'albero'),
    rect(89, 1, 1, 26, 'albero'), rect(89, 29, 1, 18, 'albero'),
    rect(1, 1, 88, 1, 'albero'),
    // filari a nord-ovest e nord-est (campi coltivati)
    rect(3, 4, 10, 1, 'albero'), rect(3, 5, 10, 1, 'albero'), rect(3, 7, 10, 1, 'albero'),
    rect(70, 4, 16, 1, 'albero'), rect(70, 5, 16, 1, 'albero'), rect(70, 7, 16, 1, 'albero'),
    rect(25, 3, 12, 1, 'albero'), rect(25, 5, 12, 1, 'albero'),
    // boschetti sparsi lontano da strade/edifici/npc/passaggi
    rect(80, 15, 2, 1, 'albero'), rect(82, 17, 1, 1, 'albero'),
    rect(4, 33, 1, 1, 'albero'), rect(6, 35, 1, 1, 'albero'),
    rect(75, 34, 2, 1, 'albero'), rect(77, 35, 1, 2, 'albero'),
    // filare lungo la riva nord del fiume (esclusa la zona del ponte e del sentiero)
    rect(3, 44, 37, 1, 'albero'), rect(47, 44, 39, 1, 'albero')
  );
}());
