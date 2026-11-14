(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.castel_di_lama = {
    width: 110, height: 83, name: 'Castel di Lama', baseTile: 'erba', levelRange: [9, 12],
    encounterTable: [
      { species: 'totera', minLevel: 9, maxLevel: 12, weight: 45 },
      { species: 'zanzi', minLevel: 9, maxLevel: 12, weight: 35 },
      { species: 'caita', minLevel: 11, maxLevel: 12, weight: 10 },
      { species: 'tifotto', minLevel: 9, maxLevel: 11, weight: 10 }
    ],
    roads: [
      // Salaria (fascia obbligata, non toccare)
      rect(0, 42, 110, 4, 'asfalto'),
      // stradina della palestra (già nello scheletro)
      rect(50, 38, 3, 4),
      // strada principale nord-sud che sale dalla Salaria alla piazza del paese
      rect(38, 13, 4, 29),
      // piazza con fontana
      rect(33, 2, 12, 17, 'piazza'),
      // vicoli laterali della piazza verso bar e tabacchi
      rect(21, 9, 12, 3), rect(45, 9, 17, 3),
      // strada verso il campo sportivo, a sud della Salaria
      rect(83, 46, 4, 24), rect(63, 68, 40, 3, 'ghiaia')
    ],
    waters: [], bridges: [],
    plazas: [rect(33, 2, 12, 17, 'piazza')],
    buildings: [
      building(45, 28, 12, 10, 'Free Spirit (palestra)', '#8e6bb0', 'palestra', { door: { x: 51, y: 38 }, interior: 'gym', script: [{ warp: { map: 'palestra_castel_di_lama', x: 11, y: 18, direction: 'up' } }] }),
      building(11, 5, 10, 8, 'Bar Centrale', '#b46c52', 'attività', { door: { x: 16, y: 13 }, interior: 'bar' }),
      building(53, 3, 8, 7, 'Tabacchi', '#ddc453', 'attività', { door: { x: 56, y: 10 }, interior: 'market' }),
      building(7, 22, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(21, 54, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(34, 54, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(11, 72, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(63, 48, 40, 20, 'Campo sportivo', '#6f9b52', 'campo')
    ],
    labels: [
      { x: 33, y: 2, text: 'Piazza della Fontana' },
      { x: 4, y: 38, text: 'Castel di Lama' },
      { x: 62, y: 44, text: 'Campo sportivo' }
    ],
    encounterZones: [
      zone(2, 15, 17, 25, 0.08, 'default'), zone(57, 13, 22, 27, 0.08, 'default'),
      zone(2, 48, 60, 33, 0.08, 'default'), zone(104, 48, 4, 33, 0.1, 'default')
    ],
    transitions: [
      transition(0, 42, 2, 4, 'maltignano', 70, 37, 'Maltignano'),
      transition(108, 42, 2, 4, 'spinetoli_centobuchi', 4, 23, 'Spinetoli', { when: { badge: 1 }, blockedText: 'Senza la Medaglia Spirito non si passa.' })
    ],
    npcs: [
      npc(48, 39, 'Cartello', 'Castel di Lama — qui c\'era il Free Spirit', 'fermo'),
      npc(15, 16, 'Anziano', ['Ah, il Free Spirit... quello sì che era un bar.', 'Mo\' è \'na palestra, boh, so\' cose che càpeno.'], 'fermo'),
      npc(34, 19, 'Passante', 'A Castel de Lama se magna bono, fidete.', 'orizzontale'),
      npc(31, 58, 'Ragazza', 'Il campo sportivo la sera è pieno de gente.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.castel_di_lama;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est
    rect(0, 0, 110, 2, 'albero'), rect(0, 81, 110, 2, 'albero'),
    rect(0, 2, 2, 40, 'albero'), rect(0, 45, 2, 36, 'albero'),
    rect(108, 2, 2, 40, 'albero'), rect(108, 45, 2, 36, 'albero'),
    // boschetti/filari nelle zone verdi lontane da strade/edifici/npc/passaggi
    
    rect(103, 5, 1, 2, 'albero'), 
    
    rect(61, 78, 1, 2, 'albero'), 
    rect(103, 78, 1, 2, 'albero'), 
  );
}());
