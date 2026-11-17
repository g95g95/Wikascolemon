(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.spinetoli_centobuchi = {
    width: 78, height: 56, name: 'Spinetoli e Centobuchi', baseTile: 'erba', levelRange: [12, 16],
    encounterTable: [
      { species: 'totera', minLevel: 12, maxLevel: 16, weight: 30 },
      { species: 'pefna', minLevel: 12, maxLevel: 16, weight: 25 },
      { species: 'peto', minLevel: 13, maxLevel: 16, weight: 15 },
      { species: 'cignalo', minLevel: 12, maxLevel: 16, weight: 15 },
      { species: 'tifotto', minLevel: 12, maxLevel: 15, weight: 15 }
    ],
    roads: [
      // strada principale (Salaria) sulle righe fisse
      rect(0, 20, 78, 4, 'asfalto'),
      // rotonda/piazza a metà percorso
      rect(42, 17, 4, 10, 'piazza'),
      rect(0, 20, 42, 4, 'asfalto'), rect(46, 20, 32, 4, 'asfalto'),
      // strade secondarie che portano ai campi/capannoni
      rect(17, 24, 3, 14, 'ghiaia'), rect(31, 7, 3, 13, 'ghiaia'),
      rect(47, 24, 3, 14, 'ghiaia'), rect(61, 7, 3, 13, 'ghiaia'),

      // === campi a nord della strada, con filari di alberi come bordo ===
      // campo 1
      rect(2, 2, 15, 1, 'ghiaia'),
      
      
      // campo 2
      rect(20, 2, 11, 1, 'erba'),
      
      
      // campo 3
      rect(34, 2, 11, 1, 'ghiaia'),
      
      rect(45, 2, 1, 1, 'albero'),
      // campo 4
      rect(46, 2, 4, 1, 'erba'),
      
      
      // campo 5
      rect(50, 2, 17, 1, 'ghiaia'),
      
      rect(67, 2, 2, 1, 'albero'),
      // campo 6
      rect(71, 2, 5, 1, 'erba'),
      
      rect(69, 2, 2, 1, 'albero'), 

      // filare intermedio fra le due file di campi nord
      

      // seconda fascia di campi (fra filare e strada)
      rect(4, 3, 16, 12, 'ghiaia'),
      rect(4, 15, 16, 1, 'albero'),
      rect(20, 3, 14, 12, 'erba'),
      rect(20, 15, 11, 1, 'albero'), 
      rect(34, 3, 12, 4, 'ghiaia'),
      
      rect(51, 3, 25, 12, 'erba'),
      rect(51, 15, 10, 1, 'albero'), rect(64, 15, 12, 1, 'albero'),

      // === campi a sud della strada ===
      rect(2, 34, 15, 16, 'erba'),
      rect(2, 32, 15, 2, 'albero'), rect(2, 50, 15, 1, 'albero'),
      rect(19, 34, 1, 16, 'albero'),

      rect(20, 34, 13, 16, 'ghiaia'),
      rect(20, 32, 13, 2, 'albero'), rect(20, 50, 13, 1, 'albero'),
      

      rect(34, 34, 12, 16, 'erba'),
      rect(34, 32, 12, 2, 'albero'), rect(34, 50, 12, 1, 'albero'),
      

      rect(50, 34, 11, 16, 'ghiaia'),
      rect(50, 32, 11, 2, 'albero'), rect(50, 50, 11, 1, 'albero'),
      rect(63, 34, 2, 16, 'albero'),

      rect(69, 34, 7, 16, 'erba'),
      rect(69, 32, 7, 2, 'albero'), rect(69, 50, 7, 1, 'albero'),
      rect(67, 34, 2, 16, 'albero'),

      // filare basso, secondo taglio di campi sud
      
      rect(4, 52, 16, 2, 'erba'),
      
      rect(25, 52, 9, 2, 'ghiaia'),
      
      
      
      rect(50, 52, 26, 2, 'ghiaia'),
      
    ],
    waters: [], bridges: [],
    plazas: [rect(42, 17, 4, 10, 'piazza')],
    buildings: [
      building(5, 7, 12, 6, 'Capannone agricolo', '#9b8a6b', 'capannone'),
      building(61, 7, 14, 6, 'Capannone Centobuchi', '#9b8a6b', 'capannone'),
      building(21, 34, 10, 8, 'Casa colonica', '#c08a5f', 'casa'),
      building(51, 42, 10, 8, 'Casa colonica', '#c08a5f', 'casa'),
      building(35, 7, 10, 8, 'Bar dello Sport', '#b46c52', 'attività', { door: { x: 40, y: 15 }, interior: 'bar' })
    ],
    labels: [
      { x: 4, y: 18, text: 'Spinetoli' },
      { x: 71, y: 18, text: 'Centobuchi' },
      { x: 41, y: 28, text: 'Rotonda della Salaria' }
    ],
    encounterZones: [
      zone(2, 2, 76, 1, 0.1, 'default'),
      zone(2, 3, 76, 13, 0.08, 'default'),
      zone(2, 32, 76, 19, 0.1, 'default'),
      zone(2, 52, 76, 2, 0.08, 'default')
    ],
    transitions: [
      transition(0, 20, 2, 4, 'castel_di_lama', 96, 36, 'Castel di Lama'),
      transition(76, 20, 2, 4, 'costa', 2, 32, 'Costa')
    ],
    npcs: [
      npc(3, 16, 'Cartello', 'Spinetoli — benvenuti nella pianura della Salaria.', 'fermo'),
      npc(74, 16, 'Cartello', 'Centobuchi.', 'fermo'),
      npc(40, 18, 'Barista', 'Al Bar dello Sport si vede sempre la partita.', 'fermo'),
      npc(13, 28, 'Contadino', '\'Sti cambe è piene de Totera, statte accorte.', 'fermo'),
      npc(59, 51, 'Anziana', 'A Centobuchi se magna bbé, fìdete.', 'orizzontale')
    ]
  };
}());
