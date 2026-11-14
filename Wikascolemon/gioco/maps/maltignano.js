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
      rect(0, 36, 20, 3, 'asfalto'), rect(76, 36, 20, 3, 'asfalto'),
      // salita a tornanti: tratto verticale iniziale (dalla base ovest) + tornante 1 (verso est)
      rect(14, 28, 2, 11, 'pendio'), rect(14, 28, 18, 2, 'pendio'),
      // verticale sale dal tornante 1, tornante 2 (verso ovest)
      rect(30, 20, 2, 11, 'pendio'), rect(16, 20, 16, 2, 'pendio'),
      // verticale sale dal tornante 2, tornante 3 (verso est, porta al pianoro)
      rect(16, 12, 2, 11, 'pendio'), rect(16, 12, 22, 2, 'pendio'),
      // pianoro del paese
      rect(12, 4, 28, 10, 'travertino'), rect(19, 5, 13, 7, 'piazza'),
      // discesa est dal pianoro verso la base est
      rect(60, 4, 2, 11, 'pendio'), rect(60, 12, 18, 2, 'pendio'),
      rect(76, 12, 2, 26, 'pendio'),
      // muri fra i tornanti (separano i tratti orizzontali/verticali adiacenti, salita obbligata)
      rect(16, 30, 40, 6, 'albero'), rect(0, 28, 14, 8, 'albero'),
      rect(32, 22, 29, 6, 'albero'), rect(14, 22, 2, 6, 'albero'),
      rect(18, 14, 42, 6, 'albero'), rect(0, 12, 16, 16, 'albero'),
      rect(0, 4, 12, 8, 'albero'), rect(40, 4, 20, 8, 'albero'),
      rect(62, 12, 14, 26, 'albero')
    ],
    waters: [], bridges: [],
    plazas: [],
    buildings: [
      building(20, 6, 5, 4, 'Chiesa di Maltignano', '#c5a677', 'chiesa'),
      building(29, 7, 6, 3, 'Bar della Salita', '#b46c52', 'attività', { door: { x: 32, y: 10 }, interior: 'bar' })
    ],
    labels: [{ x: 37, y: 11, text: 'Maltignano — la salita record' }],
    encounterZones: [
      zone(14, 30, 2, 6, 0.1, 'default'), zone(0, 28, 14, 2, 0.1, 'default'),
      zone(30, 22, 2, 6, 0.1, 'default'), zone(32, 22, 4, 6, 0.1, 'default'),
      zone(16, 14, 2, 6, 0.1, 'default'), zone(18, 14, 4, 6, 0.1, 'default'),
      zone(1, 40, 14, 37, 0.08, 'default'), zone(81, 40, 14, 37, 0.08, 'default')
    ],
    transitions: [
      transition(0, 36, 1, 3, 'oasi', 91, 37, 'Oasi'),
      transition(95, 36, 1, 3, 'castel_di_lama', 4, 37, 'Castel di Lama')
    ],
    npcs: [
      npc(39, 11, 'Cartello', 'Maltignano — la salita record', 'fermo'),
      npc(23, 11, 'Anziano', 'Ogne vòrda che sarto sti tornanti me pare de fa\' er Giro d\'Italia.', 'fermo'),
      npc(33, 11, 'Ragazza del bar', 'Se te reggi le gambe doppo la salita, entra che offro io.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.maltignano;
  map.roads.push(
    // cornice di alberi sui bordi nord/sud (interrotta dalla salita/pianoro/discesa)
    rect(0, 0, 96, 1, 'albero'), rect(0, 79, 96, 1, 'albero'),
    // boschetti sparsi nei prati ampi a sud, lontani da strade/npc/allenatori/passaggi
    rect(7, 47, 2, 1, 'albero'), rect(11, 49, 1, 2, 'albero'),
    rect(40, 47, 2, 1, 'albero'), rect(44, 49, 1, 2, 'albero'),
    rect(80, 47, 2, 1, 'albero'), rect(84, 49, 1, 2, 'albero')
  );
}());
