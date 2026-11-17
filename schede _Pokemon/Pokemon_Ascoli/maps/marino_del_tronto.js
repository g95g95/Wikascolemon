(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.marino_del_tronto = {
    width: 74, height: 48, name: 'Marino del Tronto', baseTile: 'erba', levelRange: [4, 7],
    encounterTable: [
      { species: 'tifotto', minLevel: 4, maxLevel: 7, weight: 35 },
      { species: 'totera', minLevel: 4, maxLevel: 7, weight: 30 },
      { species: 'ciuci', minLevel: 4, maxLevel: 6, weight: 20 },
      { species: 'sorci', minLevel: 5, maxLevel: 7, weight: 15 }
    ],
    roads: [
      // Via Salaria: dritta ai bordi (colonne dei passaggi/spawn), leggera curva nel mezzo
      rect(0, 29, 28, 4, 'asfalto'),
      rect(28, 27, 6, 4, 'asfalto'),
      rect(34, 26, 8, 4, 'asfalto'),
      rect(42, 27, 10, 4, 'asfalto'),
      rect(52, 29, 22, 4, 'asfalto'),
      // sentierino ghiaia dalla strada verso il ponte e lungo la riva sud
      rect(38, 33, 3, 4, 'ghiaia'),
      rect(34, 41, 20, 2, 'ghiaia'),
      // stradina sterrata verso i capannoni a nord
      rect(22, 5, 2, 22, 'ghiaia')
    ],
    waters: [rect(0, 37, 74, 6, 'water')],
    bridges: [rect(38, 37, 3, 6, 'bridge')],
    plazas: [],
    buildings: [
      building(9, 9, 12, 8, 'Capannone agricolo', '#9c8a6f', 'edificio'),
      building(54, 5, 10, 8, 'Casolare', '#b6825f', 'edificio')
    ],
    labels: [
      { x: 4, y: 25, text: 'Percorso 1 — Via Salaria' },
      { x: 36, y: 20, text: 'Marino del Tronto' },
      { x: 35, y: 36, text: 'Fiume Tronto' }
    ],
    encounterZones: [
      zone(4, 3, 67, 22, 0.08, 'default'),
      zone(4, 34, 21, 2, 0.1, 'default'),
      zone(66, 34, 5, 2, 0.1, 'default'),
      zone(4, 44, 67, 2, 0.12, 'default')
    ],
    transitions: [
      transition(0, 29, 2, 4, 'monticelli', 83, 30, 'Monticelli'),
      transition(72, 29, 2, 4, 'oasi', 4, 25, 'Oasi')
    ],
    npcs: [
      npc(3, 26, 'Cartello', 'Percorso 1 — Via Salaria: da Monticelli all\'Oasi lungo il Tronto.', 'fermo'),
      npc(36, 23, 'Cartello', 'Marino del Tronto: campi, filari e il fiume più a sud.', 'fermo'),
      npc(15, 20, 'Contadino', 'Ècche la terra è bbona: se semena de tutte, pure lu granturche.', 'fermo'),
      npc(43, 43, 'Abitante', 'Statte attende a \'llu ponde quanne piove, che l\'acqua sùve forte.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.marino_del_tronto;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi ovest/est e dal fiume a sud
    rect(0, 0, 74, 2, 'albero'),
    rect(0, 2, 2, 27, 'albero'), rect(0, 33, 2, 4, 'albero'),
    rect(72, 2, 2, 27, 'albero'), rect(72, 33, 2, 4, 'albero'),
    rect(2, 2, 70, 1, 'albero'),
    // filari a nord-ovest e nord-est (campi coltivati)
    rect(5, 3, 16, 1, 'albero'), 
    rect(65, 3, 4, 1, 'albero'), 
    
    // boschetti sparsi lontano da strade/edifici/npc/passaggi
    rect(67, 13, 1, 2, 'albero'), 
    rect(8, 34, 1, 1, 'albero'),
    
    // filare lungo la riva nord del fiume (esclusa la zona del ponte e del sentiero)
    
  );
}());
