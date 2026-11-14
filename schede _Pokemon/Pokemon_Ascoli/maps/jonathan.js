(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.jonathan = {
    width: 79, height: 56, name: 'Jonathan', baseTile: 'erba', levelRange: [17, 20],
    encounterTable: [],
    roads: [
      rect(0, 29, 79, 4, 'asfalto'),
      // vialetto d'ingresso, largo una cella: passaggio obbligato dove attende Nando.
      // Un allenatore gia' sconfitto non blocca piu' il movimento (isBlocked in game.js),
      // quindi il vialetto resta percorribile dopo la sfida.
      rect(47, 25, 1, 4, 'travertino'),
      // parcheggio asfaltato davanti allo Jonathan
      rect(19, 33, 51, 12, 'asfalto'),
      // fila di auto parcheggiate (piccoli blocchi grigi "muro", senza etichetta)
      rect(20, 35, 2, 4, 'muro'), rect(24, 35, 2, 4, 'muro'), rect(28, 35, 2, 4, 'muro'),
      rect(32, 35, 2, 4, 'muro'), rect(36, 35, 2, 4, 'muro'), rect(39, 35, 2, 4, 'muro'),
      rect(62, 35, 2, 4, 'muro'), rect(65, 35, 2, 4, 'muro'), rect(68, 35, 2, 4, 'muro'),
      // vialetto verso la spiaggia a sud
      rect(10, 45, 6, 5, 'asfalto')
    ],
    waters: [rect(0, 50, 79, 6, 'mare')],
    bridges: [],
    plazas: [],
    buildings: [
      building(41, 15, 14, 10, 'Jonathan', '#5a4e9c', 'discoteca', { door: { x: 47, y: 25 }, interior: 'gym', script: [{ warp: { map: 'palestra_costa', x: 14, y: 20, direction: 'up' } }] }),
      building(26, 15, 8, 6, 'Biglietteria', '#8a6a3d', 'attività')
    ],
    labels: [{ x: 47, y: 16, text: 'Discoteca Jonathan' }, { x: 8, y: 46, text: 'Parcheggio' }],
    encounterZones: [],
    transitions: [
      transition(0, 29, 2, 4, 'costa', 126, 37, 'Spiaggia')
    ],
    npcs: [
      npc(24, 41, 'Cartello', 'PARCHEGGIO JONATHAN — ingresso discoteca a nord.', 'fermo'),
      npc(34, 27, 'Buttafuori', 'Solo il vialetto centrale porta all\'ingresso.', 'fermo'),
      npc(59, 41, 'Cliente in coda', 'Aspetto da mezzora, ma dentro se sta bene.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.jonathan;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest e dal mare a sud
    rect(0, 0, 79, 2, 'albero'),
    rect(0, 2, 2, 27, 'albero'),
    rect(77, 2, 2, 48, 'albero'),
    
    // palme sparse fra parcheggio e strada
    rect(18, 34, 1, 1, 'albero'), rect(70, 34, 1, 1, 'albero'),
    rect(71, 47, 1, 1, 'albero'),
    
    
    // siepi ai lati del vialetto d'ingresso (fra edificio e strada): costringono a passare
    // per x=72 dove attende Nando, sguardo rivolto a sud verso chi arriva dal parcheggio
    rect(36, 25, 11, 4, 'albero'), rect(48, 25, 9, 4, 'albero')
  );
}());
