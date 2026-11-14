(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.maltignano = {
    width: 76, height: 64, name: 'Maltignano', baseTile: 'erba', levelRange: [7, 10],
    encounterTable: [
      { species: 'cignalo', minLevel: 7, maxLevel: 10, weight: 35 },
      { species: 'pefna', minLevel: 7, maxLevel: 10, weight: 30 },
      { species: 'sorci', minLevel: 7, maxLevel: 9, weight: 20 },
      { species: 'zanzi', minLevel: 8, maxLevel: 10, weight: 15 }
    ],
    roads: [
      // base ovest/est sulla fascia obbligata (righe 54-57), da cui parte la salita
      rect(0, 36, 19, 4, 'asfalto'), rect(62, 36, 14, 4, 'asfalto'),
      // salita a tornanti: tratto verticale iniziale (dalla base ovest) + tornante 1 (verso est)
      rect(10, 29, 3, 11, 'pendio'), rect(10, 29, 27, 3, 'pendio'),
      // verticale sale dal tornante 1, tornante 2 (verso ovest)
      rect(34, 22, 3, 10, 'pendio'), rect(13, 22, 24, 3, 'pendio'),
      // verticale sale dal tornante 2, tornante 3 (verso est, porta al pianoro)
      rect(13, 15, 3, 10, 'pendio'), rect(13, 15, 33, 3, 'pendio'),
      // pianoro del paese
      rect(9, 4, 40, 14, 'travertino'), rect(17, 5, 20, 10, 'piazza'),
      // discesa est dal pianoro verso la base est
      rect(55, 4, 3, 14, 'pendio'), rect(55, 15, 10, 3, 'pendio'),
      rect(62, 15, 3, 24, 'pendio'),
      // muri fra i tornanti (separano i tratti orizzontali/verticali adiacenti, salita obbligata)
      rect(13, 32, 41, 4, 'albero'), rect(0, 29, 10, 7, 'albero'),
      rect(37, 25, 20, 4, 'albero'), rect(10, 25, 3, 4, 'albero'),
      rect(16, 18, 39, 4, 'albero'), rect(0, 15, 13, 14, 'albero'),
      rect(0, 4, 9, 11, 'albero'), rect(49, 4, 6, 11, 'albero'),
      rect(58, 15, 4, 24, 'albero')
    ],
    waters: [], bridges: [],
    plazas: [],
    buildings: [
      building(19, 6, 8, 6, 'Chiesa di Maltignano', '#c5a677', 'chiesa'),
      building(33, 7, 8, 5, 'Bar della Salita', '#b46c52', 'attività', { door: { x: 37, y: 12 }, interior: 'bar' })
    ],
    labels: [{ x: 44, y: 13, text: 'Maltignano — la salita record' }],
    encounterZones: [
      zone(10, 32, 3, 4, 0.1, 'default'), zone(0, 29, 10, 3, 0.1, 'default'),
      zone(34, 25, 3, 4, 0.1, 'default'), zone(37, 25, 6, 4, 0.1, 'default'),
      zone(13, 18, 3, 4, 0.1, 'default'), zone(16, 18, 6, 4, 0.1, 'default'),
      zone(2, 41, 9, 20, 0.08, 'default'), zone(66, 41, 8, 20, 0.08, 'default')
    ],
    transitions: [
      transition(0, 36, 2, 4, 'oasi', 70, 30, 'Oasi'),
      transition(74, 36, 2, 4, 'castel_di_lama', 4, 43, 'Castel di Lama')
    ],
    npcs: [
      npc(47, 14, 'Cartello', 'Maltignano — la salita record', 'fermo'),
      npc(24, 14, 'Anziano', 'Ogne vòrda che sarto sti tornanti me pare de fa\' er Giro d\'Italia.', 'fermo'),
      npc(39, 14, 'Ragazza del bar', 'Se te reggi le gambe doppo la salita, entra che offro io.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.maltignano;
  map.roads.push(
    // cornice di alberi sui bordi nord/sud (interrotta dalla salita/pianoro/discesa)
    rect(0, 0, 76, 2, 'albero'), rect(0, 62, 76, 2, 'albero'),
    // boschetti sparsi nei prati ampi a sud, lontani da strade/npc/allenatori/passaggi
    rect(7, 45, 1, 1, 'albero'), 
    rect(49, 45, 1, 1, 'albero'), rect(50, 46, 1, 1, 'albero'),
    
  );
}());
