(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.castel_di_lama = {
    ...wide, name: 'Castel di Lama', baseTile: 'erba', levelRange: [9, 12],
    encounterTable: [
      { species: 'totera', minLevel: 9, maxLevel: 12, weight: 45 },
      { species: 'zanzi', minLevel: 9, maxLevel: 12, weight: 35 },
      { species: 'caita', minLevel: 11, maxLevel: 12, weight: 10 },
      { species: 'tifotto', minLevel: 9, maxLevel: 11, weight: 10 }
    ],
    roads: [
      // Salaria (fascia obbligata, non toccare)
      rect(0, 36, 120, 3, 'asfalto'),
      // stradina della palestra (già nello scheletro)
      rect(59, 33, 2, 3),
      // strada principale nord-sud che sale dalla Salaria alla piazza del paese
      rect(43, 13, 2, 23),
      // piazza con fontana
      rect(33, 5, 23, 15, 'piazza'),
      // vicoli laterali della piazza verso bar e tabacchi
      rect(20, 11, 13, 2), rect(56, 11, 12, 2),
      // strada verso il campo sportivo, a sud della Salaria
      rect(93, 39, 3, 16), rect(80, 53, 27, 2, 'ghiaia')
    ],
    waters: [], bridges: [],
    plazas: [rect(33, 5, 23, 15, 'piazza')],
    buildings: [
      building(56, 27, 8, 6, 'Free Spirit (palestra)', '#8e6bb0', 'palestra', { door: { x: 60, y: 33 }, interior: 'gym', script: [{ warp: { map: 'palestra_castel_di_lama', x: 11, y: 18, direction: 'up' } }] }),
      building(13, 8, 7, 5, 'Bar Centrale', '#b46c52', 'attività', { door: { x: 17, y: 13 }, interior: 'bar' }),
      building(61, 7, 6, 4, 'Tabacchi', '#ddc453', 'attività', { door: { x: 63, y: 11 }, interior: 'market' }),
      building(11, 23, 6, 4, 'Casa', '#c7a77a', 'casa'),
      building(20, 44, 6, 5, 'Casa', '#c7a77a', 'casa'),
      building(40, 44, 6, 5, 'Casa', '#c7a77a', 'casa'),
      building(13, 60, 6, 5, 'Casa', '#c7a77a', 'casa'),
      building(80, 40, 27, 13, 'Campo sportivo', '#6f9b52', 'campo')
    ],
    labels: [
      { x: 37, y: 3, text: 'Piazza della Fontana' },
      { x: 4, y: 33, text: 'Castel di Lama' },
      { x: 79, y: 37, text: 'Campo sportivo' }
    ],
    encounterZones: [
      zone(1, 15, 18, 20, 0.08, 'default'), zone(64, 13, 27, 22, 0.08, 'default'),
      zone(1, 40, 78, 39, 0.08, 'default'), zone(108, 40, 11, 39, 0.1, 'default')
    ],
    transitions: [
      transition(0, 36, 1, 3, 'maltignano', 91, 37, 'Maltignano'),
      transition(119, 36, 1, 3, 'spinetoli_centobuchi', 4, 37, 'Spinetoli', { when: { badge: 1 }, blockedText: 'Senza la Medaglia Spirito non si passa.' })
    ],
    npcs: [
      npc(58, 34, 'Cartello', 'Castel di Lama — qui c\'era il Free Spirit', 'fermo'),
      npc(16, 17, 'Anziano', ['Ah, il Free Spirit... quello sì che era un bar.', 'Mo\' è \'na palestra, boh, so\' cose che càpeno.'], 'fermo'),
      npc(40, 20, 'Passante', 'A Castel de Lama se magna bono, fidete.', 'orizzontale'),
      npc(27, 47, 'Ragazza', 'Il campo sportivo la sera è pieno de gente.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.castel_di_lama;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est
    rect(0, 0, 120, 1, 'albero'), rect(0, 79, 120, 1, 'albero'),
    rect(0, 1, 1, 35, 'albero'), rect(0, 38, 1, 41, 'albero'),
    rect(119, 1, 1, 35, 'albero'), rect(119, 38, 1, 41, 'albero'),
    // boschetti/filari nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(5, 5, 2, 2, 'albero'), rect(8, 7, 1, 2, 'albero'),
    rect(107, 8, 2, 1, 'albero'), rect(109, 10, 2, 2, 'albero'),
    rect(4, 67, 2, 1, 'albero'), rect(7, 69, 1, 2, 'albero'),
    rect(67, 64, 2, 1, 'albero'), rect(69, 66, 2, 2, 'albero'),
    rect(107, 64, 2, 1, 'albero'), rect(109, 66, 2, 2, 'albero')
  );
}());
