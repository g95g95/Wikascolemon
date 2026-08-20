(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.maltignano = {
    ...tall, name: 'Maltignano', baseTile: 'erba', levelRange: [7, 10],
    encounterTable: [
      { species: 'cignalo', minLevel: 7, maxLevel: 10, weight: 35 },
      { species: 'pefna', minLevel: 7, maxLevel: 10, weight: 30 },
      { species: 'tifotto', minLevel: 7, maxLevel: 9, weight: 20 },
      { species: 'anicino', minLevel: 8, maxLevel: 10, weight: 15 }
    ],
    roads: [
      // base ovest/est sulla fascia obbligata (righe 54-57), da cui parte la salita
      rect(0, 54, 30, 4, 'asfalto'), rect(114, 54, 30, 4, 'asfalto'),
      // salita a tornanti: tratto verticale iniziale (dalla base ovest) + tornante 1 (verso est)
      rect(21, 42, 3, 16, 'pendio'), rect(21, 42, 27, 3, 'pendio'),
      // verticale sale dal tornante 1, tornante 2 (verso ovest)
      rect(45, 30, 3, 16, 'pendio'), rect(24, 30, 24, 3, 'pendio'),
      // verticale sale dal tornante 2, tornante 3 (verso est, porta al pianoro)
      rect(24, 18, 3, 16, 'pendio'), rect(24, 18, 33, 3, 'pendio'),
      // pianoro del paese
      rect(18, 6, 42, 15, 'travertino'), rect(28, 8, 20, 10, 'piazza'),
      // discesa est dal pianoro verso la base est
      rect(90, 6, 3, 16, 'pendio'), rect(90, 18, 27, 3, 'pendio'),
      rect(114, 18, 3, 39, 'pendio'),
      // muri fra i tornanti (separano i tratti orizzontali/verticali adiacenti, salita obbligata)
      rect(24, 45, 60, 9, 'albero'), rect(0, 42, 21, 12, 'albero'),
      rect(48, 33, 44, 9, 'albero'), rect(21, 33, 3, 9, 'albero'),
      rect(27, 21, 63, 9, 'albero'), rect(0, 18, 24, 24, 'albero'),
      rect(0, 6, 18, 12, 'albero'), rect(60, 6, 30, 12, 'albero'),
      rect(93, 18, 21, 39, 'albero')
    ],
    waters: [], bridges: [],
    plazas: [],
    buildings: [
      building(30, 9, 8, 6, 'Chiesa di Maltignano', '#c5a677', 'chiesa'),
      building(44, 10, 8, 5, 'Bar della Salita', '#b46c52', 'attività', { door: { x: 48, y: 15 }, interior: 'bar' })
    ],
    labels: [{ x: 55, y: 16, text: 'Maltignano — la salita record' }],
    encounterZones: [
      zone(21, 45, 3, 9, 0.1, 'default'), zone(0, 42, 21, 3, 0.1, 'default'),
      zone(45, 33, 3, 9, 0.1, 'default'), zone(48, 33, 6, 9, 0.1, 'default'),
      zone(24, 21, 3, 9, 0.1, 'default'), zone(27, 21, 6, 9, 0.1, 'default'),
      zone(2, 60, 20, 55, 0.08, 'default'), zone(122, 60, 20, 55, 0.08, 'default')
    ],
    transitions: [
      transition(0, 54, 2, 4, 'oasi', 137, 55, 'Oasi'),
      transition(142, 54, 2, 4, 'castel_di_lama', 6, 55, 'Castel di Lama')
    ],
    npcs: [
      npc(58, 17, 'Cartello', 'Maltignano — la salita record', 'fermo'),
      npc(35, 17, 'Anziano', 'Ogne vòrda che sarto sti tornanti me pare de fa\' er Giro d\'Italia.', 'fermo'),
      npc(50, 17, 'Ragazza del bar', 'Se te reggi le gambe doppo la salita, entra che offro io.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.maltignano;
  map.roads.push(
    // cornice di alberi sui bordi nord/sud (interrotta dalla salita/pianoro/discesa)
    rect(0, 0, 144, 2, 'albero'), rect(0, 118, 144, 2, 'albero'),
    // boschetti sparsi nei prati ampi a sud, lontani da strade/npc/allenatori/passaggi
    rect(10, 70, 3, 2, 'albero'), rect(16, 74, 2, 3, 'albero'),
    rect(60, 70, 3, 2, 'albero'), rect(66, 74, 2, 3, 'albero'),
    rect(120, 70, 3, 2, 'albero'), rect(126, 74, 2, 3, 'albero')
  );
}());
