(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: passaggi fissi (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.costa = {
    ...wide, name: 'Costa', baseTile: 'erba', levelRange: [15, 19],
    encounterTable: [{ species: 'cozzetta', minLevel: 15, maxLevel: 19, weight: 25 }, { species: 'lettino', minLevel: 15, maxLevel: 19, weight: 20 }, { species: 'alghetta', minLevel: 15, maxLevel: 18, weight: 15 }, { species: 'bagnetto', minLevel: 16, maxLevel: 19, weight: 15 }, { species: 'maranzino', minLevel: 16, maxLevel: 19, weight: 10 }, { species: 'mucillax', minLevel: 17, maxLevel: 19, weight: 10 }, { species: 'scoglierax', minLevel: 18, maxLevel: 19, weight: 5 }],
    roads: [rect(0, 54, 180, 4, 'asfalto')],
    waters: [], bridges: [], plazas: [],
    buildings: [],
    labels: [],
    encounterZones: [zone(2, 2, 176, 50, 0.08, 'default'), zone(2, 60, 176, 58, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 4, 'spinetoli_centobuchi', 173, 55, 'Spinetoli'),
      transition(178, 54, 2, 4, 'jonathan', 6, 55, 'Jonathan')
    ],
    npcs: []
  };
}());
