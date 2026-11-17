(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.maltignano = {
    width: 57, height: 50, name: 'Maltignano', baseTile: 'erba', levelRange: [7, 10],
    encounterTable: [
      { species: 'cignalo', minLevel: 7, maxLevel: 10, weight: 35 },
      { species: 'pefna', minLevel: 7, maxLevel: 10, weight: 30 },
      { species: 'sorci', minLevel: 7, maxLevel: 9, weight: 20 },
      { species: 'zanzi', minLevel: 8, maxLevel: 10, weight: 15 }
    ],
    roads: [
      // base ovest/est sulla fascia obbligata (righe 54-57), da cui parte la salita
      rect(0, 32, 14, 4, 'asfalto'), rect(49, 32, 8, 4, 'asfalto'),
      // salita a tornanti: tratto verticale iniziale (dalla base ovest) + tornante 1 (verso est)
      rect(5, 26, 3, 10, 'pendio'), rect(5, 26, 27, 3, 'pendio'),
      // verticale sale dal tornante 1, tornante 2 (verso ovest)
      rect(29, 20, 3, 9, 'pendio'), rect(8, 20, 24, 3, 'pendio'),
      // verticale sale dal tornante 2, tornante 3 (verso est, porta al pianoro)
      rect(8, 14, 3, 9, 'pendio'), rect(8, 14, 33, 3, 'pendio'),
      // pianoro del paese
      rect(5, 4, 38, 13, 'travertino'), rect(12, 4, 20, 10, 'piazza'),
      // discesa est dal pianoro verso la base est
      rect(45, 4, 3, 13, 'pendio'), rect(45, 14, 7, 3, 'pendio'),
      rect(49, 14, 3, 21, 'pendio'),
      // muri fra i tornanti (separano i tratti orizzontali/verticali adiacenti, salita obbligata)
      rect(8, 29, 37, 3, 'albero'), rect(0, 26, 5, 6, 'albero'),
      rect(32, 23, 15, 3, 'albero'), rect(5, 23, 3, 3, 'albero'),
      rect(11, 17, 34, 3, 'albero'), rect(0, 14, 8, 12, 'albero'),
      rect(0, 4, 5, 10, 'albero'), rect(43, 4, 2, 10, 'albero'),
      rect(48, 14, 1, 21, 'albero')
    ],
    waters: [], bridges: [],
    plazas: [],
    buildings: [
      building(14, 5, 8, 6, 'Chiesa di Maltignano', '#c5a677', 'chiesa'),
      building(28, 6, 8, 5, 'Bar della Salita', '#b46c52', 'attività', { door: { x: 32, y: 11 }, interior: 'bar' })
    ],
    labels: [{ x: 39, y: 12, text: 'Maltignano — la salita record' }],
    encounterZones: [
      zone(5, 29, 3, 3, 0.1, 'default'), zone(0, 26, 5, 3, 0.1, 'default'),
      zone(29, 23, 3, 3, 0.1, 'default'), zone(32, 23, 6, 3, 0.1, 'default'),
      zone(8, 17, 3, 3, 0.1, 'default'), zone(11, 17, 6, 3, 0.1, 'default'),
      zone(2, 37, 4, 10, 0.08, 'default'), zone(52, 37, 3, 10, 0.08, 'default')
    ],
    transitions: [
      transition(0, 32, 2, 4, 'oasi', 55, 25, 'Oasi'),
      transition(55, 32, 2, 4, 'castel_di_lama', 2, 36, 'Castel di Lama')
    ],
    npcs: [
      npc(42, 13, 'Cartello', 'Maltignano — la salita record', 'fermo'),
      npc(19, 13, 'Anziano', 'Ogne vodda che sùve \'sti tornande me pare de fà lu Giro d\'Italia.', 'fermo'),
      npc(34, 13, 'Ragazza del bar', 'Se te regge li gambe dapuó la sùveta, viénne dendre che offre i\'.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.maltignano;
  map.roads.push(
    // cornice di alberi sui bordi nord/sud (interrotta dalla salita/pianoro/discesa)
    rect(0, 0, 57, 2, 'albero'), rect(0, 48, 57, 2, 'albero'),
    // boschetti sparsi nei prati ampi a sud, lontani da strade/npc/allenatori/passaggi
    
    
    
  );
}());
