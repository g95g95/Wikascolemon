(function () {
  const { building, rect, zone, transition, npc } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.palestra_castel_di_lama = {
    width: 24, height: 20, indoor: true, name: 'Palestra di Castel di Lama', baseTile: 'pavimento', levelRange: [10, 12],
    encounterTable: [],
    roads: [
      rect(0, 0, 24, 1, 'muro'), rect(0, 0, 1, 20, 'muro'), rect(23, 0, 1, 20, 'muro'), rect(0, 19, 11, 1, 'muro'), rect(13, 19, 11, 1, 'muro'),
      // sale laterali (statue/bancone), corridoio centrale a x=11-12 libero da y=2 a y=18
      rect(3, 5, 5, 4, 'muro'), rect(16, 5, 5, 4, 'muro'),
      rect(3, 11, 5, 4, 'muro'), rect(16, 11, 5, 4, 'muro')
    ],
    waters: [], bridges: [], plazas: [], buildings: [],
    labels: [{ x: 2, y: 2, text: 'Free Spirit' }],
    encounterZones: [],
    transitions: [transition(11, 19, 2, 1, 'castel_di_lama', 90, 50, 'Uscita', { direction: 'down' })],
    npcs: [
      { x: 6, y: 17, name: 'Guida', dialogue: ['I Pokémon di tipo Veleno indeboliscono chi li tocca a lungo.', 'Punta su mosse Psico o Terra, qui dentro rendono meglio.'], movement: 'fermo' },
      {
        x: 15, y: 3, name: 'Assistente', movement: 'fermo', when: { flag: 'trainer:castel_di_lama_hills' },
        script: [
          { if: { item: 'mt_velenospina' },
            then: [{ say: 'Complimenti ancora per la Medaglia Spirito!', name: 'Assistente' }],
            else: [
              { say: 'Ecco la MT Velenospina, premio della Medaglia Spirito.', name: 'Assistente' },
              { giveItem: 'mt_velenospina', qty: 1 }
            ]
          }
        ]
      }
    ]
  };
  // Gli allievi e Hills sono allenatori (vedi trainers/palestra_castel_di_lama.js), non npc.
}());
