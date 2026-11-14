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
      rect(0, 27, 90, 2, 'asfalto'),
      // stradina della palestra (già nello scheletro)
      rect(44, 25, 2, 2),
      // strada principale nord-sud che sale dalla Salaria alla piazza del paese
      rect(32, 10, 2, 17),
      // piazza con fontana
      rect(25, 4, 17, 11, 'piazza'),
      // vicoli laterali della piazza verso bar e tabacchi
      rect(15, 8, 10, 2), rect(42, 8, 9, 2),
      // strada verso il campo sportivo, a sud della Salaria
      rect(70, 29, 2, 12), rect(60, 40, 20, 1, 'ghiaia')
    ],
    waters: [], bridges: [],
    plazas: [rect(25, 4, 17, 11, 'piazza')],
    buildings: [
      building(42, 20, 6, 5, 'Free Spirit (palestra)', '#8e6bb0', 'palestra', { door: { x: 45, y: 25 }, interior: 'gym', script: [{ warp: { map: 'palestra_castel_di_lama', x: 11, y: 18, direction: 'up' } }] }),
      building(10, 6, 5, 4, 'Bar Centrale', '#b46c52', 'attività', { door: { x: 13, y: 10 }, interior: 'bar' }),
      building(46, 5, 4, 3, 'Tabacchi', '#ddc453', 'attività', { door: { x: 47, y: 8 }, interior: 'market' }),
      building(8, 17, 5, 3, 'Casa', '#c7a77a', 'casa'),
      building(15, 33, 5, 4, 'Casa', '#c7a77a', 'casa'),
      building(30, 33, 5, 4, 'Casa', '#c7a77a', 'casa'),
      building(10, 45, 4, 4, 'Casa', '#c7a77a', 'casa'),
      building(60, 30, 20, 10, 'Campo sportivo', '#6f9b52', 'campo')
    ],
    labels: [
      { x: 28, y: 2, text: 'Piazza della Fontana' },
      { x: 3, y: 25, text: 'Castel di Lama' },
      { x: 59, y: 28, text: 'Campo sportivo' }
    ],
    encounterZones: [
      zone(1, 11, 13, 15, 0.08, 'default'), zone(48, 10, 20, 16, 0.08, 'default'),
      zone(1, 30, 58, 29, 0.08, 'default'), zone(81, 30, 8, 29, 0.1, 'default')
    ],
    transitions: [
      transition(0, 27, 1, 2, 'maltignano', 68, 28, 'Maltignano'),
      transition(89, 27, 1, 2, 'spinetoli_centobuchi', 3, 28, 'Spinetoli', { when: { badge: 1 }, blockedText: 'Senza la Medaglia Spirito non si passa.' })
    ],
    npcs: [
      npc(44, 26, 'Cartello', 'Castel di Lama — qui c\'era il Free Spirit', 'fermo'),
      npc(12, 13, 'Anziano', ['Ah, il Free Spirit... quello sì che era un bar.', 'Mo\' è \'na palestra, boh, so\' cose che càpeno.'], 'fermo'),
      npc(30, 15, 'Passante', 'A Castel de Lama se magna bono, fidete.', 'orizzontale'),
      npc(20, 35, 'Ragazza', 'Il campo sportivo la sera è pieno de gente.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.castel_di_lama;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est
    rect(0, 0, 90, 1, 'albero'), rect(0, 59, 90, 1, 'albero'),
    rect(0, 1, 1, 26, 'albero'), rect(0, 29, 1, 30, 'albero'),
    rect(89, 1, 1, 26, 'albero'), rect(89, 29, 1, 30, 'albero'),
    // boschetti/filari nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(4, 4, 1, 1, 'albero'), rect(6, 5, 1, 2, 'albero'),
    rect(80, 6, 2, 1, 'albero'), rect(82, 8, 1, 1, 'albero'),
    rect(3, 50, 2, 1, 'albero'), rect(5, 52, 1, 1, 'albero'),
    rect(50, 48, 2, 1, 'albero'), rect(52, 50, 1, 1, 'albero'),
    rect(80, 48, 2, 1, 'albero'), rect(82, 50, 1, 1, 'albero')
  );
}());
