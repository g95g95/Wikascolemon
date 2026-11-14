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
      rect(0, 36, 120, 3, 'asfalto'),
      // rotonda/piazza a metà percorso
      rect(57, 34, 6, 7, 'piazza'),
      rect(0, 36, 57, 3, 'asfalto'), rect(63, 36, 57, 3, 'asfalto'),
      // strade secondarie che portano ai campi/capannoni
      rect(20, 39, 2, 9, 'ghiaia'), rect(40, 27, 2, 9, 'ghiaia'),
      rect(80, 39, 2, 9, 'ghiaia'), rect(100, 27, 2, 9, 'ghiaia'),

      // === campi a nord della strada, con filari di alberi come bordo ===
      // campo 1
      rect(4, 5, 15, 10, 'ghiaia'),
      rect(4, 4, 15, 1, 'albero'), rect(4, 15, 15, 1, 'albero'),
      rect(3, 5, 1, 10, 'albero'), rect(19, 5, 1, 10, 'albero'),
      // campo 2
      rect(24, 5, 13, 11, 'erba'),
      rect(24, 4, 13, 1, 'albero'), rect(24, 16, 13, 1, 'albero'),
      rect(23, 5, 1, 11, 'albero'), rect(37, 5, 2, 11, 'albero'),
      // campo 3
      rect(44, 5, 15, 10, 'ghiaia'),
      rect(44, 4, 15, 1, 'albero'), rect(44, 15, 15, 1, 'albero'),
      rect(43, 5, 1, 10, 'albero'), rect(59, 5, 1, 10, 'albero'),
      // campo 4
      rect(67, 5, 16, 11, 'erba'),
      rect(67, 4, 16, 1, 'albero'), rect(67, 16, 16, 1, 'albero'),
      rect(65, 5, 2, 11, 'albero'), rect(83, 5, 1, 11, 'albero'),
      // campo 5
      rect(89, 5, 15, 10, 'ghiaia'),
      rect(89, 4, 15, 1, 'albero'), rect(89, 15, 15, 1, 'albero'),
      rect(88, 5, 1, 10, 'albero'), rect(104, 5, 1, 10, 'albero'),
      // campo 6
      rect(107, 5, 9, 11, 'erba'),
      rect(107, 4, 9, 1, 'albero'), rect(107, 16, 9, 1, 'albero'),
      rect(105, 5, 2, 11, 'albero'), rect(116, 5, 1, 11, 'albero'),

      // filare intermedio fra le due file di campi nord
      rect(4, 20, 116, 1, 'albero'),

      // seconda fascia di campi (fra filare e strada)
      rect(7, 24, 17, 8, 'ghiaia'),
      rect(7, 23, 17, 1, 'albero'), rect(7, 32, 17, 1, 'albero'),
      rect(29, 24, 16, 8, 'erba'),
      rect(29, 23, 16, 1, 'albero'), rect(29, 32, 9, 1, 'albero'), rect(42, 32, 3, 1, 'albero'),
      rect(51, 24, 14, 3, 'ghiaia'),
      rect(51, 23, 14, 1, 'albero'),
      rect(93, 24, 23, 8, 'erba'),
      rect(93, 23, 23, 1, 'albero'), rect(93, 32, 7, 1, 'albero'), rect(102, 32, 14, 1, 'albero'),

      // === campi a sud della strada ===
      rect(4, 45, 16, 11, 'erba'),
      rect(4, 44, 16, 1, 'albero'), rect(4, 56, 16, 1, 'albero'),
      rect(3, 45, 1, 11, 'albero'), rect(21, 45, 2, 11, 'albero'),

      rect(27, 45, 14, 11, 'ghiaia'),
      rect(27, 44, 14, 1, 'albero'), rect(27, 56, 14, 1, 'albero'),
      rect(25, 45, 2, 11, 'albero'), rect(43, 45, 1, 11, 'albero'),

      rect(47, 45, 13, 11, 'erba'),
      rect(47, 44, 13, 1, 'albero'), rect(47, 56, 13, 1, 'albero'),
      rect(45, 45, 2, 11, 'albero'), rect(61, 45, 2, 11, 'albero'),

      rect(84, 45, 16, 11, 'ghiaia'),
      rect(84, 44, 16, 1, 'albero'), rect(84, 56, 16, 1, 'albero'),
      rect(83, 45, 1, 11, 'albero'), rect(101, 45, 2, 11, 'albero'),

      rect(105, 45, 11, 11, 'erba'),
      rect(105, 44, 11, 1, 'albero'), rect(105, 56, 11, 1, 'albero'),
      rect(104, 45, 1, 11, 'albero'),

      // filare basso, secondo taglio di campi sud
      rect(4, 61, 116, 2, 'albero'),
      rect(7, 65, 20, 10, 'erba'),
      rect(7, 64, 20, 1, 'albero'), rect(7, 75, 20, 1, 'albero'),
      rect(33, 65, 18, 10, 'ghiaia'),
      rect(33, 64, 18, 1, 'albero'), rect(33, 75, 18, 1, 'albero'),
      rect(60, 65, 19, 10, 'erba'),
      rect(60, 64, 19, 1, 'albero'), rect(60, 75, 19, 1, 'albero'),
      rect(89, 65, 27, 10, 'ghiaia'),
      rect(89, 64, 27, 1, 'albero'), rect(89, 75, 27, 1, 'albero')
    ],
    waters: [], bridges: [],
    plazas: [rect(57, 34, 6, 7, 'piazza')],
    buildings: [
      building(11, 27, 8, 4, 'Capannone agricolo', '#9b8a6b', 'capannone'),
      building(100, 27, 9, 4, 'Capannone Centobuchi', '#9b8a6b', 'capannone'),
      building(31, 45, 6, 6, 'Casa colonica', '#c08a5f', 'casa'),
      building(93, 51, 7, 5, 'Casa colonica', '#c08a5f', 'casa'),
      building(52, 27, 7, 5, 'Bar dello Sport', '#b46c52', 'attività', { door: { x: 55, y: 32 }, interior: 'bar' })
    ],
    labels: [
      { x: 8, y: 35, text: 'Spinetoli' },
      { x: 107, y: 35, text: 'Centobuchi' },
      { x: 56, y: 41, text: 'Rotonda della Salaria' }
    ],
    encounterZones: [
      zone(4, 4, 116, 13, 0.1, 'default'),
      zone(4, 23, 116, 10, 0.08, 'default'),
      zone(4, 44, 116, 13, 0.1, 'default'),
      zone(4, 64, 116, 11, 0.08, 'default')
    ],
    transitions: [
      transition(0, 36, 1, 3, 'castel_di_lama', 115, 37, 'Castel di Lama'),
      transition(119, 36, 1, 3, 'costa', 4, 37, 'Costa')
    ],
    npcs: [
      npc(6, 33, 'Cartello', 'Spinetoli — benvenuti nella pianura della Salaria.', 'fermo'),
      npc(109, 33, 'Cartello', 'Centobuchi.', 'fermo'),
      npc(55, 35, 'Barista', 'Al Bar dello Sport si vede sempre la partita.', 'fermo'),
      npc(16, 41, 'Contadino', 'Sti campi so\' pieni de Totera, sta\' accorto.', 'fermo'),
      npc(99, 60, 'Anziana', 'A Centobuchi se magna bbono, fidete.', 'orizzontale')
    ]
  };
}());
