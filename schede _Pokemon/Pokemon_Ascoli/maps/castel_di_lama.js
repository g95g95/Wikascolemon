(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.castel_di_lama = {
    width: 99, height: 72, name: 'Castel di Lama', baseTile: 'erba', levelRange: [9, 12],
    encounterTable: [
      { species: 'totera', minLevel: 9, maxLevel: 12, weight: 45 },
      { species: 'zanzi', minLevel: 9, maxLevel: 12, weight: 35 },
      { species: 'caita', minLevel: 11, maxLevel: 12, weight: 10 },
      { species: 'tifotto', minLevel: 9, maxLevel: 11, weight: 10 }
    ],
    roads: [
      // Salaria (fascia obbligata, non toccare)
      rect(0, 35, 99, 4, 'asfalto'),
      // stradina della palestra (già nello scheletro)
      rect(44, 31, 3, 4),
      // strada principale nord-sud che sale dalla Salaria alla piazza del paese
      rect(33, 12, 4, 23),
      // piazza con fontana
      rect(28, 2, 11, 12, 'piazza'),
      // vicoli laterali della piazza verso bar e tabacchi
      rect(18, 8, 10, 3), rect(39, 8, 16, 3),
      // strada verso il campo sportivo, a sud della Salaria
      rect(76, 39, 4, 22), rect(56, 59, 40, 3, 'ghiaia')
    ],
    waters: [], bridges: [],
    plazas: [rect(28, 2, 11, 12, 'piazza')],
    buildings: [
      building(39, 21, 12, 10, 'Free Spirit (palestra)', '#8e6bb0', 'palestra', { door: { x: 45, y: 31 }, interior: 'gym', script: [{ warp: { map: 'palestra_castel_di_lama', x: 11, y: 18, direction: 'up' } }] }),
      building(8, 4, 10, 8, 'Bar Centrale', '#b46c52', 'attività', { door: { x: 13, y: 12 }, interior: 'bar' }),
      building(47, 2, 8, 7, 'Tabacchi', '#ddc453', 'attività', { door: { x: 50, y: 9 }, interior: 'market' }),
      building(4, 15, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(18, 45, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(29, 45, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(8, 62, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(56, 39, 40, 20, 'Campo sportivo', '#6f9b52', 'campo')
    ],
    labels: [
      { x: 28, y: 2, text: 'Piazza della Fontana' },
      { x: 2, y: 31, text: 'Castel di Lama' },
      { x: 55, y: 37, text: 'Campo sportivo' }
    ],
    encounterZones: [
      zone(2, 13, 14, 20, 0.08, 'default'), zone(51, 12, 21, 21, 0.08, 'default'),
      zone(2, 39, 53, 31, 0.08, 'default'), zone(96, 39, 1, 31, 0.1, 'default')
    ],
    transitions: [
      transition(0, 35, 2, 4, 'maltignano', 53, 33, 'Maltignano'),
      transition(97, 35, 2, 4, 'spinetoli_centobuchi', 2, 21, 'Spinetoli', { when: { badge: 1 }, blockedText: 'Senza la Medaglia Spirito non si passa.' })
    ],
    npcs: [
      npc(42, 32, 'Cartello', 'Castel di Lama — qui c\'era il Free Spirit', 'fermo'),
      npc(12, 13, 'Anziano', ['Ah, il Free Spirit... quello sì che era un bar.', 'Mo\' è \'na palestra, boh, so\' cose che càpeno.'], 'fermo'),
      npc(29, 14, 'Passante', 'A Castel de Lama se magna bono, fidete.', 'orizzontale'),
      npc(27, 49, 'Ragazza', 'Il campo sportivo la sera è pieno de gente.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.castel_di_lama;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est
    rect(0, 0, 99, 2, 'albero'), rect(0, 70, 99, 2, 'albero'),
    rect(0, 2, 2, 33, 'albero'), rect(0, 38, 2, 32, 'albero'),
    rect(97, 2, 2, 33, 'albero'), rect(97, 38, 2, 32, 'albero'),
    // boschetti/filari nelle zone verdi lontane da strade/edifici/npc/passaggi
    
    
    
    
    
  );
}());
