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
      rect(0, 54, 40, 4, 'asfalto'),
      rect(40, 52, 20, 4, 'asfalto'),
      rect(60, 51, 30, 4, 'asfalto'),
      rect(90, 52, 20, 4, 'asfalto'),
      rect(110, 54, 70, 4, 'asfalto'),
      // sentierino ghiaia dalla strada verso il ponte e lungo la riva sud
      rect(85, 58, 3, 35, 'ghiaia'),
      rect(60, 100, 60, 2, 'ghiaia'),
      // stradina sterrata verso i capannoni a nord
      rect(30, 20, 2, 32, 'ghiaia')
    ],
    waters: [rect(0, 93, 180, 9, 'water')],
    bridges: [rect(85, 93, 3, 9, 'bridge')],
    plazas: [],
    buildings: [
      building(14, 26, 12, 8, 'Capannone agricolo', '#9c8a6f', 'edificio'),
      building(120, 22, 10, 8, 'Casolare', '#b6825f', 'edificio')
    ],
    labels: [
      { x: 4, y: 48, text: 'Percorso 1 — Via Salaria' },
      { x: 82, y: 40, text: 'Marino del Tronto' },
      { x: 78, y: 88, text: 'Fiume Tronto' }
    ],
    encounterZones: [
      zone(4, 4, 172, 44, 0.08, 'default'),
      zone(4, 62, 30, 28, 0.1, 'default'),
      zone(150, 62, 26, 28, 0.1, 'default'),
      zone(4, 104, 172, 14, 0.12, 'default')
    ],
    transitions: [
      transition(0, 54, 2, 4, 'monticelli', 173, 59, 'Monticelli'),
      transition(178, 54, 2, 4, 'oasi', 6, 55, 'Oasi')
    ],
    npcs: [
      npc(3, 51, 'Cartello', 'Percorso 1 — Via Salaria: da Monticelli all\'Oasi lungo il Tronto.', 'fermo'),
      npc(82, 44, 'Cartello', 'Marino del Tronto: campi, filari e il fiume più a sud.', 'fermo'),
      npc(20, 40, 'Contadino', 'Qui la terra è bona: se semina de tutto, granturco pure.', 'fermo'),
      npc(95, 102, 'Abitante', 'Attento a quer ponte quanno piove, che l\'acqua sale forte.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.marino_del_tronto;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi ovest/est e dal fiume a sud
    rect(0, 0, 180, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'), rect(0, 58, 2, 35, 'albero'),
    rect(178, 2, 2, 52, 'albero'), rect(178, 58, 2, 35, 'albero'),
    rect(2, 2, 176, 2, 'albero'),
    // filari a nord-ovest e nord-est (campi coltivati)
    rect(6, 8, 20, 1, 'albero'), rect(6, 11, 20, 1, 'albero'), rect(6, 14, 20, 1, 'albero'),
    rect(140, 8, 32, 1, 'albero'), rect(140, 11, 32, 1, 'albero'), rect(140, 14, 32, 1, 'albero'),
    rect(50, 6, 24, 1, 'albero'), rect(50, 9, 24, 1, 'albero'),
    // boschetti sparsi lontano da strade/edifici/npc/passaggi
    rect(160, 30, 3, 2, 'albero'), rect(164, 33, 2, 3, 'albero'),
    rect(8, 66, 3, 2, 'albero'), rect(12, 69, 2, 3, 'albero'),
    rect(150, 68, 3, 2, 'albero'), rect(154, 71, 2, 3, 'albero'),
    // filare lungo la riva nord del fiume (esclusa la zona del ponte e del sentiero)
    rect(6, 89, 74, 1, 'albero'), rect(95, 89, 78, 1, 'albero')
  );
}());
