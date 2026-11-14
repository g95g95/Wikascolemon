(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.marino_del_tronto = {
    width: 96, height: 63, name: 'Marino del Tronto', baseTile: 'erba', levelRange: [4, 7],
    encounterTable: [
      { species: 'tifotto', minLevel: 4, maxLevel: 7, weight: 35 },
      { species: 'totera', minLevel: 4, maxLevel: 7, weight: 30 },
      { species: 'ciuci', minLevel: 4, maxLevel: 6, weight: 20 },
      { species: 'sorci', minLevel: 5, maxLevel: 7, weight: 15 }
    ],
    roads: [
      // Via Salaria: dritta ai bordi (colonne dei passaggi/spawn), leggera curva nel mezzo
      rect(0, 35, 32, 4, 'asfalto'),
      rect(32, 33, 8, 4, 'asfalto'),
      rect(40, 32, 13, 4, 'asfalto'),
      rect(53, 33, 13, 4, 'asfalto'),
      rect(66, 35, 30, 4, 'asfalto'),
      // sentierino ghiaia dalla strada verso il ponte e lungo la riva sud
      rect(49, 39, 3, 9, 'ghiaia'),
      rect(40, 53, 29, 2, 'ghiaia'),
      // stradina sterrata verso i capannoni a nord
      rect(25, 7, 2, 26, 'ghiaia')
    ],
    waters: [rect(0, 48, 96, 7, 'water')],
    bridges: [rect(49, 48, 3, 7, 'bridge')],
    plazas: [],
    buildings: [
      building(11, 12, 12, 8, 'Capannone agricolo', '#9c8a6f', 'edificio'),
      building(69, 8, 10, 8, 'Casolare', '#b6825f', 'edificio')
    ],
    labels: [
      { x: 4, y: 31, text: 'Percorso 1 — Via Salaria' },
      { x: 46, y: 24, text: 'Marino del Tronto' },
      { x: 44, y: 46, text: 'Fiume Tronto' }
    ],
    encounterZones: [
      zone(4, 3, 89, 28, 0.08, 'default'),
      zone(4, 41, 24, 6, 0.1, 'default'),
      zone(84, 41, 9, 6, 0.1, 'default'),
      zone(4, 57, 89, 4, 0.12, 'default')
    ],
    transitions: [
      transition(0, 35, 2, 4, 'monticelli', 92, 36, 'Monticelli'),
      transition(94, 35, 2, 4, 'oasi', 5, 30, 'Oasi')
    ],
    npcs: [
      npc(3, 32, 'Cartello', 'Percorso 1 — Via Salaria: da Monticelli all\'Oasi lungo il Tronto.', 'fermo'),
      npc(46, 28, 'Cartello', 'Marino del Tronto: campi, filari e il fiume più a sud.', 'fermo'),
      npc(17, 24, 'Contadino', 'Qui la terra è bona: se semina de tutto, granturco pure.', 'fermo'),
      npc(55, 55, 'Abitante', 'Attento a quer ponte quanno piove, che l\'acqua sale forte.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.marino_del_tronto;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi ovest/est e dal fiume a sud
    rect(0, 0, 96, 2, 'albero'),
    rect(0, 2, 2, 33, 'albero'), rect(0, 39, 2, 9, 'albero'),
    rect(94, 2, 2, 33, 'albero'), rect(94, 39, 2, 9, 'albero'),
    rect(2, 2, 92, 1, 'albero'),
    // filari a nord-ovest e nord-est (campi coltivati)
    rect(6, 4, 17, 1, 'albero'), 
    rect(82, 4, 7, 1, 'albero'), 
    
    // boschetti sparsi lontano da strade/edifici/npc/passaggi
    rect(86, 16, 1, 2, 'albero'), rect(87, 19, 1, 3, 'albero'),
    rect(10, 42, 1, 1, 'albero'),
    
    // filare lungo la riva nord del fiume (esclusa la zona del ponte e del sentiero)
    
  );
}());
