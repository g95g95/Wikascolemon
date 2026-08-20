(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.jonathan = {
    ...city, name: 'Jonathan', baseTile: 'erba', levelRange: [17, 20],
    encounterTable: [],
    roads: [
      rect(0, 54, 144, 4, 'asfalto'),
      // vialetto d'ingresso, largo una cella: passaggio obbligato dove attende Nando
      rect(72, 50, 1, 4, 'travertino'),
      // parcheggio asfaltato davanti allo Jonathan
      rect(40, 58, 64, 20, 'asfalto'),
      // fila di auto parcheggiate (piccoli blocchi grigi "muro", senza etichetta)
      rect(44, 62, 2, 4, 'muro'), rect(48, 62, 2, 4, 'muro'), rect(52, 62, 2, 4, 'muro'),
      rect(56, 62, 2, 4, 'muro'), rect(60, 62, 2, 4, 'muro'), rect(64, 62, 2, 4, 'muro'),
      rect(94, 62, 2, 4, 'muro'), rect(98, 62, 2, 4, 'muro'), rect(102, 62, 2, 4, 'muro'),
      // vialetto verso la spiaggia a sud
      rect(20, 78, 6, 16, 'asfalto')
    ],
    waters: [rect(0, 94, 144, 14, 'mare')],
    bridges: [],
    plazas: [],
    buildings: [
      building(66, 40, 14, 10, 'Jonathan', '#5a4e9c', 'discoteca', { door: { x: 72, y: 50 }, interior: 'gym', script: [{ warp: { map: 'palestra_costa', x: 14, y: 20, direction: 'up' } }] }),
      building(50, 40, 8, 6, 'Biglietteria', '#8a6a3d', 'attività')
    ],
    labels: [{ x: 72, y: 41, text: 'Discoteca Jonathan' }, { x: 12, y: 79, text: 'Parcheggio' }],
    encounterZones: [],
    transitions: [
      transition(0, 54, 2, 4, 'costa', 173, 55, 'Spiaggia')
    ],
    npcs: [
      npc(48, 68, 'Cartello', 'PARCHEGGIO JONATHAN — ingresso discoteca a nord.', 'fermo'),
      npc(58, 52, 'Buttafuori', 'Solo il vialetto centrale porta all\'ingresso.', 'fermo'),
      npc(90, 68, 'Cliente in coda', 'Aspetto da mezzora, ma dentro se sta bene.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.jonathan;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a ovest e dal mare a sud
    rect(0, 0, 144, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'),
    rect(142, 2, 2, 92, 'albero'),
    rect(2, 92, 140, 2, 'albero'),
    // palme sparse fra parcheggio e strada
    rect(36, 60, 2, 2, 'albero'), rect(106, 60, 2, 2, 'albero'),
    rect(30, 84, 2, 2, 'albero'), rect(112, 84, 2, 2, 'albero'),
    rect(10, 60, 2, 2, 'albero'), rect(130, 60, 2, 2, 'albero'),
    rect(10, 84, 2, 2, 'albero'), rect(130, 84, 2, 2, 'albero'),
    // siepi ai lati del vialetto d'ingresso (fra edificio e strada): costringono a passare
    // per x=72 dove attende Nando, sguardo rivolto a sud verso chi arriva dal parcheggio
    rect(60, 50, 12, 4, 'albero'), rect(73, 50, 12, 4, 'albero')
  );
}());
