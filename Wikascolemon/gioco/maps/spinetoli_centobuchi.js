(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.spinetoli_centobuchi = {
    width: 91, height: 62, name: 'Spinetoli e Centobuchi', baseTile: 'erba', levelRange: [12, 16],
    encounterTable: [
      { species: 'totera', minLevel: 12, maxLevel: 16, weight: 30 },
      { species: 'pefna', minLevel: 12, maxLevel: 16, weight: 25 },
      { species: 'peto', minLevel: 13, maxLevel: 16, weight: 15 },
      { species: 'cignalo', minLevel: 12, maxLevel: 16, weight: 15 },
      { species: 'tifotto', minLevel: 12, maxLevel: 15, weight: 15 }
    ],
    roads: [
      // strada principale (Salaria) sulle righe fisse
      rect(0, 22, 91, 4, 'asfalto'),
      // rotonda/piazza a metà percorso
      rect(51, 19, 4, 10, 'piazza'),
      rect(0, 22, 51, 4, 'asfalto'), rect(55, 22, 36, 4, 'asfalto'),
      // strade secondarie che portano ai campi/capannoni
      rect(24, 26, 3, 14, 'ghiaia'), rect(40, 8, 3, 14, 'ghiaia'),
      rect(56, 26, 3, 14, 'ghiaia'), rect(70, 8, 3, 14, 'ghiaia'),

      // === campi a nord della strada, con filari di alberi come bordo ===
      // campo 1
      rect(4, 2, 18, 1, 'ghiaia'),
      
      rect(3, 2, 1, 1, 'albero'), rect(22, 2, 2, 1, 'albero'),
      // campo 2
      rect(27, 2, 11, 1, 'erba'),
      
      rect(38, 2, 1, 1, 'albero'),
      // campo 3
      rect(43, 2, 11, 1, 'ghiaia'),
      
      rect(54, 2, 1, 1, 'albero'),
      // campo 4
      rect(55, 2, 4, 1, 'erba'),
      
      
      // campo 5
      rect(59, 2, 17, 1, 'ghiaia'),
      
      rect(76, 2, 2, 1, 'albero'),
      // campo 6
      rect(80, 2, 7, 1, 'erba'),
      
      rect(78, 2, 2, 1, 'albero'), rect(87, 2, 1, 1, 'albero'),

      // filare intermedio fra le due file di campi nord
      

      // seconda fascia di campi (fra filare e strada)
      rect(8, 4, 19, 12, 'ghiaia'),
      rect(8, 16, 19, 2, 'albero'),
      rect(27, 4, 16, 12, 'erba'),
      rect(27, 16, 12, 2, 'albero'), 
      rect(43, 4, 12, 4, 'ghiaia'),
      
      rect(60, 4, 27, 12, 'erba'),
      rect(60, 16, 10, 2, 'albero'), rect(73, 16, 14, 2, 'albero'),

      // === campi a sud della strada ===
      rect(4, 36, 20, 16, 'erba'),
      rect(4, 34, 20, 2, 'albero'), rect(4, 52, 20, 2, 'albero'),
      rect(3, 36, 1, 16, 'albero'), rect(26, 36, 1, 16, 'albero'),

      rect(27, 36, 15, 16, 'ghiaia'),
      rect(27, 34, 15, 2, 'albero'), rect(27, 52, 15, 2, 'albero'),
      

      rect(43, 36, 12, 16, 'erba'),
      rect(43, 34, 12, 2, 'albero'), rect(43, 52, 12, 2, 'albero'),
      

      rect(59, 36, 11, 16, 'ghiaia'),
      rect(59, 34, 11, 2, 'albero'), rect(59, 52, 11, 2, 'albero'),
      rect(72, 36, 2, 16, 'albero'),

      rect(78, 36, 9, 16, 'erba'),
      rect(78, 34, 9, 2, 'albero'), rect(78, 52, 9, 2, 'albero'),
      rect(76, 36, 2, 16, 'albero'),

      // filare basso, secondo taglio di campi sud
      
      rect(8, 58, 19, 2, 'erba'),
      
      rect(32, 58, 11, 2, 'ghiaia'),
      
      
      
      rect(59, 58, 28, 2, 'ghiaia'),
      
    ],
    waters: [], bridges: [],
    plazas: [rect(51, 19, 4, 10, 'piazza')],
    buildings: [
      building(10, 8, 12, 6, 'Capannone agricolo', '#9b8a6b', 'capannone'),
      building(70, 8, 14, 6, 'Capannone Centobuchi', '#9b8a6b', 'capannone'),
      building(28, 36, 10, 8, 'Casa colonica', '#c08a5f', 'casa'),
      building(60, 44, 10, 8, 'Casa colonica', '#c08a5f', 'casa'),
      building(44, 8, 10, 8, 'Bar dello Sport', '#b46c52', 'attività', { door: { x: 49, y: 16 }, interior: 'bar' })
    ],
    labels: [
      { x: 9, y: 20, text: 'Spinetoli' },
      { x: 80, y: 20, text: 'Centobuchi' },
      { x: 50, y: 30, text: 'Rotonda della Salaria' }
    ],
    encounterZones: [
      zone(4, 2, 87, 1, 0.1, 'default'),
      zone(4, 4, 87, 14, 0.08, 'default'),
      zone(4, 34, 87, 20, 0.1, 'default'),
      zone(4, 58, 87, 2, 0.08, 'default')
    ],
    transitions: [
      transition(0, 22, 2, 4, 'castel_di_lama', 105, 43, 'Castel di Lama'),
      transition(89, 22, 2, 4, 'costa', 4, 37, 'Costa')
    ],
    npcs: [
      npc(7, 18, 'Cartello', 'Spinetoli — benvenuti nella pianura della Salaria.', 'fermo'),
      npc(83, 18, 'Cartello', 'Centobuchi.', 'fermo'),
      npc(49, 20, 'Barista', 'Al Bar dello Sport si vede sempre la partita.', 'fermo'),
      npc(18, 30, 'Contadino', 'Sti campi so\' pieni de Totera, sta\' accorto.', 'fermo'),
      npc(68, 56, 'Anziana', 'A Centobuchi se magna bbono, fidete.', 'orizzontale')
    ]
  };
}());
