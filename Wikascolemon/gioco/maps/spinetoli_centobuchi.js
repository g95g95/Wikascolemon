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
      rect(0, 54, 180, 4, 'asfalto'),
      // rotonda/piazza a metà percorso
      rect(85, 51, 10, 10, 'piazza'),
      rect(0, 54, 85, 4, 'asfalto'), rect(95, 54, 85, 4, 'asfalto'),
      // strade secondarie che portano ai campi/capannoni
      rect(30, 58, 3, 14, 'ghiaia'), rect(60, 40, 3, 14, 'ghiaia'),
      rect(120, 58, 3, 14, 'ghiaia'), rect(150, 40, 3, 14, 'ghiaia'),

      // === campi a nord della strada, con filari di alberi come bordo ===
      // campo 1
      rect(6, 8, 22, 14, 'ghiaia'),
      rect(6, 6, 22, 2, 'albero'), rect(6, 22, 22, 2, 'albero'),
      rect(4, 8, 2, 14, 'albero'), rect(28, 8, 2, 14, 'albero'),
      // campo 2
      rect(36, 8, 20, 16, 'erba'),
      rect(36, 6, 20, 2, 'albero'), rect(36, 24, 20, 2, 'albero'),
      rect(34, 8, 2, 16, 'albero'), rect(56, 8, 2, 16, 'albero'),
      // campo 3
      rect(66, 8, 22, 14, 'ghiaia'),
      rect(66, 6, 22, 2, 'albero'), rect(66, 22, 22, 2, 'albero'),
      rect(64, 8, 2, 14, 'albero'), rect(88, 8, 2, 14, 'albero'),
      // campo 4
      rect(100, 8, 24, 16, 'erba'),
      rect(100, 6, 24, 2, 'albero'), rect(100, 24, 24, 2, 'albero'),
      rect(98, 8, 2, 16, 'albero'), rect(124, 8, 2, 16, 'albero'),
      // campo 5
      rect(134, 8, 22, 14, 'ghiaia'),
      rect(134, 6, 22, 2, 'albero'), rect(134, 22, 22, 2, 'albero'),
      rect(132, 8, 2, 14, 'albero'), rect(156, 8, 2, 14, 'albero'),
      // campo 6
      rect(160, 8, 14, 16, 'erba'),
      rect(160, 6, 14, 2, 'albero'), rect(160, 24, 14, 2, 'albero'),
      rect(158, 8, 2, 16, 'albero'), rect(174, 8, 2, 16, 'albero'),

      // filare intermedio fra le due file di campi nord
      rect(6, 30, 174, 2, 'albero'),

      // seconda fascia di campi (fra filare e strada)
      rect(10, 36, 26, 12, 'ghiaia'),
      rect(10, 34, 26, 2, 'albero'), rect(10, 48, 26, 2, 'albero'),
      rect(44, 36, 24, 12, 'erba'),
      rect(44, 34, 24, 2, 'albero'), rect(44, 48, 13, 2, 'albero'), rect(63, 48, 5, 2, 'albero'),
      rect(76, 36, 22, 4, 'ghiaia'),
      rect(76, 34, 22, 2, 'albero'),
      rect(140, 36, 34, 12, 'erba'),
      rect(140, 34, 34, 2, 'albero'), rect(140, 48, 10, 2, 'albero'), rect(153, 48, 21, 2, 'albero'),

      // === campi a sud della strada ===
      rect(6, 68, 24, 16, 'erba'),
      rect(6, 66, 24, 2, 'albero'), rect(6, 84, 24, 2, 'albero'),
      rect(4, 68, 2, 16, 'albero'), rect(32, 68, 2, 16, 'albero'),

      rect(40, 68, 22, 16, 'ghiaia'),
      rect(40, 66, 22, 2, 'albero'), rect(40, 84, 22, 2, 'albero'),
      rect(38, 68, 2, 16, 'albero'), rect(64, 68, 2, 16, 'albero'),

      rect(70, 68, 20, 16, 'erba'),
      rect(70, 66, 20, 2, 'albero'), rect(70, 84, 20, 2, 'albero'),
      rect(68, 68, 2, 16, 'albero'), rect(92, 68, 2, 16, 'albero'),

      rect(126, 68, 24, 16, 'ghiaia'),
      rect(126, 66, 24, 2, 'albero'), rect(126, 84, 24, 2, 'albero'),
      rect(124, 68, 2, 16, 'albero'), rect(152, 68, 2, 16, 'albero'),

      rect(158, 68, 16, 16, 'erba'),
      rect(158, 66, 16, 2, 'albero'), rect(158, 84, 16, 2, 'albero'),
      rect(156, 68, 2, 16, 'albero'),

      // filare basso, secondo taglio di campi sud
      rect(6, 92, 174, 2, 'albero'),
      rect(10, 98, 30, 14, 'erba'),
      rect(10, 96, 30, 2, 'albero'), rect(10, 112, 30, 2, 'albero'),
      rect(50, 98, 26, 14, 'ghiaia'),
      rect(50, 96, 26, 2, 'albero'), rect(50, 112, 26, 2, 'albero'),
      rect(90, 98, 28, 14, 'erba'),
      rect(90, 96, 28, 2, 'albero'), rect(90, 112, 28, 2, 'albero'),
      rect(134, 98, 40, 14, 'ghiaia'),
      rect(134, 96, 40, 2, 'albero'), rect(134, 112, 40, 2, 'albero')
    ],
    waters: [], bridges: [],
    plazas: [rect(85, 51, 10, 10, 'piazza')],
    buildings: [
      building(16, 40, 12, 6, 'Capannone agricolo', '#9b8a6b', 'capannone'),
      building(150, 40, 14, 6, 'Capannone Centobuchi', '#9b8a6b', 'capannone'),
      building(46, 68, 10, 8, 'Casa colonica', '#c08a5f', 'casa'),
      building(140, 76, 10, 8, 'Casa colonica', '#c08a5f', 'casa'),
      building(78, 40, 10, 8, 'Bar dello Sport', '#b46c52', 'attività', { door: { x: 83, y: 48 }, interior: 'bar' })
    ],
    labels: [
      { x: 12, y: 52, text: 'Spinetoli' },
      { x: 160, y: 52, text: 'Centobuchi' },
      { x: 84, y: 62, text: 'Rotonda della Salaria' }
    ],
    encounterZones: [
      zone(6, 6, 174, 20, 0.1, 'default'),
      zone(6, 34, 174, 16, 0.08, 'default'),
      zone(6, 66, 174, 20, 0.1, 'default'),
      zone(6, 96, 174, 16, 0.08, 'default')
    ],
    transitions: [
      transition(0, 54, 2, 4, 'castel_di_lama', 173, 55, 'Castel di Lama'),
      transition(178, 54, 2, 4, 'costa', 6, 55, 'Costa')
    ],
    npcs: [
      npc(9, 50, 'Cartello', 'Spinetoli — benvenuti nella pianura della Salaria.', 'fermo'),
      npc(163, 50, 'Cartello', 'Centobuchi.', 'fermo'),
      npc(83, 52, 'Barista', 'Al Bar dello Sport si vede sempre la partita.', 'fermo'),
      npc(24, 62, 'Contadino', 'Sti campi so\' pieni de Totera, sta\' accorto.', 'fermo'),
      npc(148, 90, 'Anziana', 'A Centobuchi se magna bbono, fidete.', 'orizzontale')
    ]
  };
}());
