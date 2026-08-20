(function () {
  const { building, rect, zone, transition, npc } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.palestra_costa = {
    width: 30, height: 22, indoor: true, name: 'Palestra della Costa', baseTile: 'pavimento', levelRange: [17, 20],
    encounterTable: [],
    roads: [
      rect(0, 0, 30, 1, 'muro'), rect(0, 0, 1, 22, 'muro'), rect(29, 0, 1, 22, 'muro'), rect(0, 21, 14, 1, 'muro'), rect(16, 21, 14, 1, 'muro'),
      // sala da ballo in fondo (y=1-7), corridoio d'ingresso largo una cella sotto (y=8-20)
      rect(14, 8, 1, 13, 'travertino'),
      // pareti che affiancano il corridoio, dalla sala fino al muro perimetrale sud
      rect(2, 8, 12, 13, 'muro'), rect(15, 8, 13, 13, 'muro'),
      // pista da ballo colorata al centro della sala
      rect(6, 3, 18, 4, 'piazza'),
      // bancone del bar sul lato ovest della sala
      rect(2, 3, 3, 4, 'muro'),
      // casse audio ai lati della pista
      rect(25, 3, 2, 2, 'muro'), rect(25, 5, 2, 2, 'muro')
    ],
    waters: [], bridges: [], plazas: [], buildings: [], labels: [{ x: 15, y: 4, text: 'Pista da ballo' }],
    encounterZones: [],
    transitions: [transition(14, 21, 2, 1, 'jonathan', 72, 50, 'Uscita', { direction: 'down' })],
    npcs: [
      npc(5, 4, 'Barista', 'Il bancone è chiuso, stiamo per la sfida.', 'fermo'),
      {
        x: 12, y: 4, name: 'Assistente', movement: 'fermo',
        when: { all: [{ flag: 'trainer:costa_riccio' }, { notFlag: 'mt_idrogetto_dato' }] },
        script: [
          { say: ['Riccio mi ha detto di darti questa, se lo battevi.', 'Complimenti, campione della costa!'], name: 'Assistente' },
          { giveItem: 'mt_idrogetto', qty: 1 },
          { setFlag: 'mt_idrogetto_dato' }
        ]
      },
      {
        x: 12, y: 4, name: 'Assistente', movement: 'fermo',
        when: { flag: 'mt_idrogetto_dato' },
        script: [{ say: 'La MT Idrogetto è già tua, portala con onore.', name: 'Assistente' }]
      }
    ]
  };
}());
