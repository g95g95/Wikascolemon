(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.jonathan = {
    ...city, name: 'Jonathan', baseTile: 'erba', levelRange: [17, 20],
    encounterTable: [],
    roads: [
      rect(0, 36, 96, 3, 'asfalto'),
      // vialetto d'ingresso, largo una cella: passaggio obbligato dove attende Nando.
      // Un allenatore gia' sconfitto non blocca piu' il movimento (isBlocked in game.js),
      // quindi il vialetto resta percorribile dopo la sfida.
      rect(48, 33, 1, 3, 'travertino'),
      // parcheggio asfaltato davanti allo Jonathan
      rect(27, 39, 42, 13, 'asfalto'),
      // fila di auto parcheggiate (piccoli blocchi grigi "muro", senza etichetta)
      rect(29, 41, 2, 3, 'muro'), rect(32, 41, 1, 3, 'muro'), rect(35, 41, 1, 3, 'muro'),
      rect(37, 41, 2, 3, 'muro'), rect(40, 41, 1, 3, 'muro'), rect(43, 41, 1, 3, 'muro'),
      rect(63, 41, 1, 3, 'muro'), rect(65, 41, 2, 3, 'muro'), rect(68, 41, 1, 3, 'muro'),
      // vialetto verso la spiaggia a sud
      rect(13, 52, 4, 11, 'asfalto')
    ],
    waters: [rect(0, 63, 96, 9, 'mare')],
    bridges: [],
    plazas: [],
    buildings: [
      building(44, 27, 9, 6, 'Jonathan', '#5a4e9c', 'discoteca', { door: { x: 48, y: 33 }, interior: 'gym', script: [{ warp: { map: 'palestra_costa', x: 14, y: 20, direction: 'up' } }] }),
      building(33, 27, 6, 4, 'Biglietteria', '#8a6a3d', 'attività')
    ],
    labels: [{ x: 48, y: 27, text: 'Discoteca Jonathan' }, { x: 8, y: 53, text: 'Parcheggio' }],
    encounterZones: [],
    transitions: [
      transition(0, 36, 1, 3, 'costa', 115, 37, 'Spiaggia')
    ],
    npcs: [
      npc(32, 45, 'Cartello', 'PARCHEGGIO JONATHAN — ingresso discoteca a nord.', 'fermo'),
      npc(39, 35, 'Buttafuori', 'Solo il vialetto centrale porta all\'ingresso.', 'fermo'),
      npc(60, 45, 'Cliente in coda', 'Aspetto da mezzora, ma dentro se sta bene.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.jonathan;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest e dal mare a sud
    rect(0, 0, 96, 1, 'albero'),
    rect(0, 1, 1, 35, 'albero'),
    rect(95, 1, 1, 62, 'albero'),
    rect(1, 61, 94, 2, 'albero'),
    // palme sparse fra parcheggio e strada
    rect(24, 40, 1, 1, 'albero'), rect(71, 40, 1, 1, 'albero'),
    rect(20, 56, 1, 1, 'albero'), rect(75, 56, 1, 1, 'albero'),
    rect(7, 40, 1, 1, 'albero'), rect(87, 40, 1, 1, 'albero'),
    rect(7, 56, 1, 1, 'albero'), rect(87, 56, 1, 1, 'albero'),
    // siepi ai lati del vialetto d'ingresso (fra edificio e strada): costringono a passare
    // per x=72 dove attende Nando, sguardo rivolto a sud verso chi arriva dal parcheggio
    rect(40, 33, 8, 3, 'albero'), rect(49, 33, 8, 3, 'albero')
  );
}());
