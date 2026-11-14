(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.jonathan = {
    ...city, name: 'Jonathan', baseTile: 'erba', levelRange: [17, 20],
    encounterTable: [],
    roads: [
      rect(0, 27, 72, 2, 'asfalto'),
      // vialetto d'ingresso, largo una cella: passaggio obbligato dove attende Nando.
      // Un allenatore gia' sconfitto non blocca piu' il movimento (isBlocked in game.js),
      // quindi il vialetto resta percorribile dopo la sfida.
      rect(36, 25, 1, 2, 'travertino'),
      // parcheggio asfaltato davanti allo Jonathan
      rect(20, 29, 32, 10, 'asfalto'),
      // fila di auto parcheggiate (piccoli blocchi grigi "muro", senza etichetta)
      rect(22, 31, 1, 2, 'muro'), rect(24, 31, 1, 2, 'muro'), rect(26, 31, 1, 2, 'muro'),
      rect(28, 31, 1, 2, 'muro'), rect(30, 31, 1, 2, 'muro'), rect(32, 31, 1, 2, 'muro'),
      rect(47, 31, 1, 2, 'muro'), rect(49, 31, 1, 2, 'muro'), rect(51, 31, 1, 2, 'muro'),
      // vialetto verso la spiaggia a sud
      rect(10, 39, 3, 8, 'asfalto')
    ],
    waters: [rect(0, 47, 72, 7, 'mare')],
    bridges: [],
    plazas: [],
    buildings: [
      building(33, 20, 7, 5, 'Jonathan', '#5a4e9c', 'discoteca', { door: { x: 36, y: 25 }, interior: 'gym', script: [{ warp: { map: 'palestra_costa', x: 14, y: 20, direction: 'up' } }] }),
      building(25, 20, 4, 3, 'Biglietteria', '#8a6a3d', 'attività')
    ],
    labels: [{ x: 36, y: 20, text: 'Discoteca Jonathan' }, { x: 6, y: 40, text: 'Parcheggio' }],
    encounterZones: [],
    transitions: [
      transition(0, 27, 1, 2, 'costa', 86, 28, 'Spiaggia')
    ],
    npcs: [
      npc(24, 34, 'Cartello', 'PARCHEGGIO JONATHAN — ingresso discoteca a nord.', 'fermo'),
      npc(29, 26, 'Buttafuori', 'Solo il vialetto centrale porta all\'ingresso.', 'fermo'),
      npc(45, 34, 'Cliente in coda', 'Aspetto da mezzora, ma dentro se sta bene.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.jonathan;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest e dal mare a sud
    rect(0, 0, 72, 1, 'albero'),
    rect(0, 1, 1, 26, 'albero'),
    rect(71, 1, 1, 46, 'albero'),
    rect(1, 46, 70, 1, 'albero'),
    // palme sparse fra parcheggio e strada
    rect(18, 30, 1, 1, 'albero'), rect(53, 30, 1, 1, 'albero'),
    rect(15, 42, 1, 1, 'albero'), rect(56, 42, 1, 1, 'albero'),
    rect(5, 30, 1, 1, 'albero'), rect(65, 30, 1, 1, 'albero'),
    rect(5, 42, 1, 1, 'albero'), rect(65, 42, 1, 1, 'albero'),
    // siepi ai lati del vialetto d'ingresso (fra edificio e strada): costringono a passare
    // per x=72 dove attende Nando, sguardo rivolto a sud verso chi arriva dal parcheggio
    rect(30, 25, 6, 2, 'albero'), rect(37, 25, 6, 2, 'albero')
  );
}());
