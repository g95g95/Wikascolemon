(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.spinetoli_centobuchi = {
    ...wide, name: 'Spinetoli e Centobuchi', baseTile: 'erba', levelRange: [12, 16],
    encounterTable: [
      { species: 'totera', minLevel: 12, maxLevel: 16, weight: 30 },
      { species: 'pefna', minLevel: 12, maxLevel: 16, weight: 25 },
      { species: 'peto', minLevel: 13, maxLevel: 16, weight: 15 },
      { species: 'cignalo', minLevel: 12, maxLevel: 16, weight: 15 },
      { species: 'tifotto', minLevel: 12, maxLevel: 15, weight: 15 }
    ],
    roads: [
      // strada principale (Salaria) sulle righe fisse
      rect(0, 27, 90, 2, 'asfalto'),
      // rotonda/piazza a metà percorso
      rect(43, 26, 4, 5, 'piazza'),
      rect(0, 27, 43, 2, 'asfalto'), rect(47, 27, 43, 2, 'asfalto'),
      // strade secondarie che portano ai campi/capannoni
      rect(15, 29, 2, 7, 'ghiaia'), rect(30, 20, 2, 7, 'ghiaia'),
      rect(60, 29, 2, 7, 'ghiaia'), rect(75, 20, 2, 7, 'ghiaia'),

      // === campi a nord della strada, con filari di alberi come bordo ===
      // campo 1
      rect(3, 4, 11, 7, 'ghiaia'),
      rect(3, 3, 11, 1, 'albero'), rect(3, 11, 11, 1, 'albero'),
      rect(2, 4, 1, 7, 'albero'), rect(14, 4, 1, 7, 'albero'),
      // campo 2
      rect(18, 4, 10, 8, 'erba'),
      rect(18, 3, 10, 1, 'albero'), rect(18, 12, 10, 1, 'albero'),
      rect(17, 4, 1, 8, 'albero'), rect(28, 4, 1, 8, 'albero'),
      // campo 3
      rect(33, 4, 11, 7, 'ghiaia'),
      rect(33, 3, 11, 1, 'albero'), rect(33, 11, 11, 1, 'albero'),
      rect(32, 4, 1, 7, 'albero'), rect(44, 4, 1, 7, 'albero'),
      // campo 4
      rect(50, 4, 12, 8, 'erba'),
      rect(50, 3, 12, 1, 'albero'), rect(50, 12, 12, 1, 'albero'),
      rect(49, 4, 1, 8, 'albero'), rect(62, 4, 1, 8, 'albero'),
      // campo 5
      rect(67, 4, 11, 7, 'ghiaia'),
      rect(67, 3, 11, 1, 'albero'), rect(67, 11, 11, 1, 'albero'),
      rect(66, 4, 1, 7, 'albero'), rect(78, 4, 1, 7, 'albero'),
      // campo 6
      rect(80, 4, 7, 8, 'erba'),
      rect(80, 3, 7, 1, 'albero'), rect(80, 12, 7, 1, 'albero'),
      rect(79, 4, 1, 8, 'albero'), rect(87, 4, 1, 8, 'albero'),

      // filare intermedio fra le due file di campi nord
      rect(3, 15, 87, 1, 'albero'),

      // seconda fascia di campi (fra filare e strada)
      rect(5, 18, 13, 6, 'ghiaia'),
      rect(5, 17, 13, 1, 'albero'), rect(5, 24, 13, 1, 'albero'),
      rect(22, 18, 12, 6, 'erba'),
      rect(22, 17, 12, 1, 'albero'), rect(22, 24, 7, 1, 'albero'), rect(32, 24, 2, 1, 'albero'),
      rect(38, 18, 11, 2, 'ghiaia'),
      rect(38, 17, 11, 1, 'albero'),
      rect(70, 18, 17, 6, 'erba'),
      rect(70, 17, 17, 1, 'albero'), rect(70, 24, 5, 1, 'albero'), rect(77, 24, 10, 1, 'albero'),

      // === campi a sud della strada ===
      rect(3, 34, 12, 8, 'erba'),
      rect(3, 33, 12, 1, 'albero'), rect(3, 42, 12, 1, 'albero'),
      rect(2, 34, 1, 8, 'albero'), rect(16, 34, 1, 8, 'albero'),

      rect(20, 34, 11, 8, 'ghiaia'),
      rect(20, 33, 11, 1, 'albero'), rect(20, 42, 11, 1, 'albero'),
      rect(19, 34, 1, 8, 'albero'), rect(32, 34, 1, 8, 'albero'),

      rect(35, 34, 10, 8, 'erba'),
      rect(35, 33, 10, 1, 'albero'), rect(35, 42, 10, 1, 'albero'),
      rect(34, 34, 1, 8, 'albero'), rect(46, 34, 1, 8, 'albero'),

      rect(63, 34, 12, 8, 'ghiaia'),
      rect(63, 33, 12, 1, 'albero'), rect(63, 42, 12, 1, 'albero'),
      rect(62, 34, 1, 8, 'albero'), rect(76, 34, 1, 8, 'albero'),

      rect(79, 34, 8, 8, 'erba'),
      rect(79, 33, 8, 1, 'albero'), rect(79, 42, 8, 1, 'albero'),
      rect(78, 34, 1, 8, 'albero'),

      // filare basso, secondo taglio di campi sud
      rect(3, 46, 87, 1, 'albero'),
      rect(5, 49, 15, 7, 'erba'),
      rect(5, 48, 15, 1, 'albero'), rect(5, 56, 15, 1, 'albero'),
      rect(25, 49, 13, 7, 'ghiaia'),
      rect(25, 48, 13, 1, 'albero'), rect(25, 56, 13, 1, 'albero'),
      rect(45, 49, 14, 7, 'erba'),
      rect(45, 48, 14, 1, 'albero'), rect(45, 56, 14, 1, 'albero'),
      rect(67, 49, 20, 7, 'ghiaia'),
      rect(67, 48, 20, 1, 'albero'), rect(67, 56, 20, 1, 'albero')
    ],
    waters: [], bridges: [],
    plazas: [rect(43, 26, 4, 5, 'piazza')],
    buildings: [
      building(8, 20, 6, 3, 'Capannone agricolo', '#9b8a6b', 'capannone'),
      building(75, 20, 7, 3, 'Capannone Centobuchi', '#9b8a6b', 'capannone'),
      building(23, 34, 5, 4, 'Casa colonica', '#c08a5f', 'casa'),
      building(70, 38, 5, 4, 'Casa colonica', '#c08a5f', 'casa'),
      building(39, 20, 5, 4, 'Bar dello Sport', '#b46c52', 'attività', { door: { x: 41, y: 24 }, interior: 'bar' })
    ],
    labels: [
      { x: 6, y: 26, text: 'Spinetoli' },
      { x: 80, y: 26, text: 'Centobuchi' },
      { x: 42, y: 31, text: 'Rotonda della Salaria' }
    ],
    encounterZones: [
      zone(3, 3, 87, 10, 0.1, 'default'),
      zone(3, 17, 87, 8, 0.08, 'default'),
      zone(3, 33, 87, 10, 0.1, 'default'),
      zone(3, 48, 87, 8, 0.08, 'default')
    ],
    transitions: [
      transition(0, 27, 1, 2, 'castel_di_lama', 86, 28, 'Castel di Lama'),
      transition(89, 27, 1, 2, 'costa', 3, 28, 'Costa')
    ],
    npcs: [
      npc(5, 25, 'Cartello', 'Spinetoli — benvenuti nella pianura della Salaria.', 'fermo'),
      npc(82, 25, 'Cartello', 'Centobuchi.', 'fermo'),
      npc(41, 26, 'Barista', 'Al Bar dello Sport si vede sempre la partita.', 'fermo'),
      npc(12, 31, 'Contadino', 'Sti campi so\' pieni de Totera, sta\' accorto.', 'fermo'),
      npc(74, 45, 'Anziana', 'A Centobuchi se magna bbono, fidete.', 'orizzontale')
    ]
  };
}());
