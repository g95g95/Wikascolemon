(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: passaggi fissi (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.spinetoli_centobuchi = {
    ...wide, name: 'Spinetoli e Centobuchi', baseTile: 'erba', levelRange: [12, 16],
    encounterTable: [{ species: 'totera', minLevel: 12, maxLevel: 16, weight: 30 }, { species: 'pefna', minLevel: 12, maxLevel: 16, weight: 25 }, { species: 'peto', minLevel: 13, maxLevel: 16, weight: 15 }, { species: 'cignalo', minLevel: 12, maxLevel: 16, weight: 15 }, { species: 'tifotto', minLevel: 12, maxLevel: 15, weight: 15 }],
    roads: [rect(0, 54, 180, 4, 'asfalto')],
    waters: [], bridges: [], plazas: [],
    buildings: [],
    labels: [],
    encounterZones: [zone(2, 2, 176, 50, 0.08, 'default'), zone(2, 60, 176, 58, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 4, 'castel_di_lama', 173, 55, 'Castel di Lama'),
      transition(178, 54, 2, 4, 'costa', 6, 55, 'Costa')
    ],
    npcs: []
  };
}());
