(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.castel_di_lama = {
    ...wide, name: 'Castel di Lama', baseTile: 'erba', levelRange: [9, 12],
    encounterTable: [
      { species: 'totera', minLevel: 9, maxLevel: 12, weight: 45 },
      { species: 'anicino', minLevel: 9, maxLevel: 12, weight: 35 },
      { species: 'caita', minLevel: 11, maxLevel: 12, weight: 10 },
      { species: 'tifotto', minLevel: 9, maxLevel: 11, weight: 10 }
    ],
    roads: [
      // Salaria (fascia obbligata, non toccare)
      rect(0, 54, 180, 4, 'asfalto'),
      // stradina della palestra (già nello scheletro)
      rect(89, 50, 3, 4),
      // strada principale nord-sud che sale dalla Salaria alla piazza del paese
      rect(64, 20, 4, 34),
      // piazza con fontana
      rect(50, 8, 34, 22, 'piazza'),
      // vicoli laterali della piazza verso bar e tabacchi
      rect(30, 16, 20, 3), rect(84, 16, 18, 3),
      // strada verso il campo sportivo, a sud della Salaria
      rect(140, 58, 4, 24), rect(120, 80, 40, 3, 'ghiaia')
    ],
    waters: [], bridges: [],
    plazas: [rect(50, 8, 34, 22, 'piazza')],
    buildings: [
      building(84, 40, 12, 10, 'Free Spirit (palestra)', '#8e6bb0', 'palestra', { door: { x: 90, y: 50 }, interior: 'gym', script: [{ warp: { map: 'palestra_castel_di_lama', x: 11, y: 18, direction: 'up' } }] }),
      building(20, 12, 10, 8, 'Bar Centrale', '#b46c52', 'attività', { door: { x: 25, y: 20 }, interior: 'bar' }),
      building(92, 10, 8, 7, 'Tabacchi', '#ddc453', 'attività', { door: { x: 95, y: 17 }, interior: 'market' }),
      building(16, 34, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(30, 66, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(60, 66, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(20, 90, 9, 7, 'Casa', '#c7a77a', 'casa'),
      building(120, 60, 40, 20, 'Campo sportivo', '#6f9b52', 'campo')
    ],
    labels: [
      { x: 56, y: 4, text: 'Piazza della Fontana' },
      { x: 6, y: 50, text: 'Castel di Lama' },
      { x: 118, y: 56, text: 'Campo sportivo' }
    ],
    encounterZones: [
      zone(2, 22, 26, 30, 0.08, 'default'), zone(96, 20, 40, 32, 0.08, 'default'),
      zone(2, 60, 116, 58, 0.08, 'default'), zone(162, 60, 16, 58, 0.1, 'default')
    ],
    transitions: [
      transition(0, 54, 2, 4, 'maltignano', 137, 55, 'Maltignano'),
      transition(178, 54, 2, 4, 'spinetoli_centobuchi', 6, 55, 'Spinetoli', { when: { badge: 1 }, blockedText: 'Senza la Medaglia Spirito non si passa.' })
    ],
    npcs: [
      npc(90, 51, 'Cartello', 'Castel di Lama — qui c\'era il Free Spirit', 'fermo'),
      npc(24, 25, 'Anziano', ['Ah, il Free Spirit... quello sì che era un bar.', 'Mo\' è \'na palestra, boh, so\' cose che càpeno.'], 'fermo'),
      npc(60, 30, 'Passante', 'A Castel de Lama se magna bono, fidete.', 'orizzontale'),
      npc(40, 70, 'Ragazza', 'Il campo sportivo la sera è pieno de gente.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.castel_di_lama;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi a ovest/est
    rect(0, 0, 180, 2, 'albero'), rect(0, 118, 180, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'), rect(0, 57, 2, 61, 'albero'),
    rect(178, 2, 2, 52, 'albero'), rect(178, 57, 2, 61, 'albero'),
    // boschetti/filari nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(8, 8, 3, 2, 'albero'), rect(12, 11, 2, 3, 'albero'),
    rect(160, 12, 3, 2, 'albero'), rect(164, 15, 2, 3, 'albero'),
    rect(6, 100, 3, 2, 'albero'), rect(10, 103, 2, 3, 'albero'),
    rect(100, 96, 3, 2, 'albero'), rect(104, 99, 2, 3, 'albero'),
    rect(160, 96, 3, 2, 'albero'), rect(164, 99, 2, 3, 'albero')
  );
}());
