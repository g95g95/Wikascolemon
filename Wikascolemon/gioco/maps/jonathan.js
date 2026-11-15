(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.jonathan = {
    width: 61, height: 43, name: 'Jonathan', baseTile: 'erba', levelRange: [17, 20],
    encounterTable: [],
    roads: [
      rect(0, 19, 61, 4, 'asfalto'),
      // vialetto d'ingresso, largo una cella: passaggio obbligato dove attende Nando.
      // Un allenatore gia' sconfitto non blocca piu' il movimento (isBlocked in game.js),
      // quindi il vialetto resta percorribile dopo la sfida.
      rect(38, 15, 1, 4, 'travertino'),
      // parcheggio asfaltato davanti allo Jonathan
      rect(12, 23, 45, 9, 'asfalto'),
      // fila di auto parcheggiate (piccoli blocchi grigi "muro", senza etichetta)
      rect(12, 25, 2, 4, 'muro'), rect(15, 25, 2, 4, 'muro'), rect(19, 25, 2, 4, 'muro'),
      rect(23, 25, 2, 4, 'muro'), rect(27, 25, 2, 4, 'muro'), rect(30, 25, 2, 4, 'muro'),
      rect(49, 25, 2, 4, 'muro'), rect(52, 25, 2, 4, 'muro'), rect(55, 25, 2, 4, 'muro'),
      // vialetto verso la spiaggia a sud
      rect(5, 32, 6, 5, 'asfalto')
    ],
    waters: [rect(0, 37, 61, 6, 'mare')],
    bridges: [],
    plazas: [],
    buildings: [
      building(32, 5, 14, 10, 'Jonathan', '#5a4e9c', 'discoteca', { door: { x: 38, y: 15 }, interior: 'gym', script: [{ warp: { map: 'palestra_costa', x: 14, y: 20, direction: 'up' } }] }),
      building(17, 5, 8, 6, 'Biglietteria', '#8a6a3d', 'attività')
    ],
    labels: [{ x: 38, y: 6, text: 'Discoteca Jonathan' }, { x: 5, y: 33, text: 'Parcheggio' }],
    encounterZones: [],
    transitions: [
      transition(0, 19, 2, 4, 'costa', 109, 32, 'Spiaggia')
    ],
    npcs: [
      npc(15, 30, 'Cartello', 'PARCHEGGIO JONATHAN — ingresso discoteca a nord.', 'fermo'),
      npc(25, 17, 'Buttafuori', 'Solo il vialetto centrale porta all\'ingresso.', 'fermo'),
      npc(47, 30, 'Cliente in coda', 'Aspetto da mezzora, ma dentro se sta bene.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.jonathan;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest e dal mare a sud
    rect(0, 0, 61, 2, 'albero'),
    rect(0, 2, 2, 17, 'albero'),
    rect(59, 2, 2, 35, 'albero'),
    
    // palme sparse fra parcheggio e strada
    
    rect(57, 34, 1, 1, 'albero'),
    
    
    // siepi ai lati del vialetto d'ingresso (fra edificio e strada): costringono a passare
    // per x=72 dove attende Nando, sguardo rivolto a sud verso chi arriva dal parcheggio
    rect(27, 15, 11, 4, 'albero'), rect(39, 15, 8, 4, 'albero')
  );
}());
