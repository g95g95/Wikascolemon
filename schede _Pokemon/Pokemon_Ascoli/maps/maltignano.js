(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.maltignano = {
    ...tall, name: 'Maltignano', baseTile: 'erba', levelRange: [7, 10],
    encounterTable: [
      { species: 'cignalo', minLevel: 7, maxLevel: 10, weight: 35 },
      { species: 'pefna', minLevel: 7, maxLevel: 10, weight: 30 },
      { species: 'sorci', minLevel: 7, maxLevel: 9, weight: 20 },
      { species: 'zanzi', minLevel: 8, maxLevel: 10, weight: 15 }
    ],
    roads: [
      // base ovest/est sulla fascia obbligata (righe 54-57), da cui parte la salita
      rect(0, 27, 15, 2, 'asfalto'), rect(57, 27, 15, 2, 'asfalto'),
      // salita a tornanti: tratto verticale iniziale (dalla base ovest) + tornante 1 (verso est)
      rect(11, 21, 1, 8, 'pendio'), rect(11, 21, 13, 2, 'pendio'),
      // verticale sale dal tornante 1, tornante 2 (verso ovest)
      rect(23, 15, 1, 8, 'pendio'), rect(12, 15, 12, 2, 'pendio'),
      // verticale sale dal tornante 2, tornante 3 (verso est, porta al pianoro)
      rect(12, 9, 2, 8, 'pendio'), rect(12, 9, 17, 2, 'pendio'),
      // pianoro del paese
      rect(9, 3, 21, 8, 'travertino'), rect(14, 4, 10, 5, 'piazza'),
      // discesa est dal pianoro verso la base est
      rect(45, 3, 2, 8, 'pendio'), rect(45, 9, 14, 2, 'pendio'),
      rect(57, 9, 2, 20, 'pendio'),
      // muri fra i tornanti (separano i tratti orizzontali/verticali adiacenti, salita obbligata)
      rect(12, 23, 30, 4, 'albero'), rect(0, 21, 11, 6, 'albero'),
      rect(24, 17, 22, 4, 'albero'), rect(11, 17, 1, 4, 'albero'),
      rect(14, 11, 31, 4, 'albero'), rect(0, 9, 12, 12, 'albero'),
      rect(0, 3, 9, 6, 'albero'), rect(30, 3, 15, 6, 'albero'),
      rect(47, 9, 10, 20, 'albero')
    ],
    waters: [], bridges: [],
    plazas: [],
    buildings: [
      building(15, 5, 4, 3, 'Chiesa di Maltignano', '#c5a677', 'chiesa'),
      building(22, 5, 4, 3, 'Bar della Salita', '#b46c52', 'attività', { door: { x: 24, y: 8 }, interior: 'bar' })
    ],
    labels: [{ x: 28, y: 8, text: 'Maltignano — la salita record' }],
    encounterZones: [
      zone(11, 23, 1, 4, 0.1, 'default'), zone(0, 21, 11, 2, 0.1, 'default'),
      zone(23, 17, 1, 4, 0.1, 'default'), zone(24, 17, 3, 4, 0.1, 'default'),
      zone(12, 11, 2, 4, 0.1, 'default'), zone(14, 11, 3, 4, 0.1, 'default'),
      zone(1, 30, 10, 28, 0.08, 'default'), zone(61, 30, 10, 28, 0.08, 'default')
    ],
    transitions: [
      transition(0, 27, 1, 2, 'oasi', 68, 28, 'Oasi'),
      transition(71, 27, 1, 2, 'castel_di_lama', 3, 28, 'Castel di Lama')
    ],
    npcs: [
      npc(29, 8, 'Cartello', 'Maltignano — la salita record', 'fermo'),
      npc(17, 8, 'Anziano', 'Ogne vòrda che sarto sti tornanti me pare de fa\' er Giro d\'Italia.', 'fermo'),
      npc(25, 8, 'Ragazza del bar', 'Se te reggi le gambe doppo la salita, entra che offro io.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.maltignano;
  map.roads.push(
    // cornice di alberi sui bordi nord/sud (interrotta dalla salita/pianoro/discesa)
    rect(0, 0, 72, 1, 'albero'), rect(0, 59, 72, 1, 'albero'),
    // boschetti sparsi nei prati ampi a sud, lontani da strade/npc/allenatori/passaggi
    rect(5, 35, 2, 1, 'albero'), rect(8, 37, 1, 1, 'albero'),
    rect(30, 35, 2, 1, 'albero'), rect(33, 37, 1, 1, 'albero'),
    rect(60, 35, 2, 1, 'albero'), rect(63, 37, 1, 1, 'albero')
  );
}());
