(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: passaggi fissi (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.maltignano = {
    ...tall, name: 'Maltignano', baseTile: 'erba', levelRange: [7, 10],
    encounterTable: [{ species: 'cignalo', minLevel: 7, maxLevel: 10, weight: 35 }, { species: 'pefna', minLevel: 7, maxLevel: 10, weight: 30 }, { species: 'tifotto', minLevel: 7, maxLevel: 9, weight: 20 }, { species: 'anicino', minLevel: 8, maxLevel: 10, weight: 15 }],
    roads: [rect(0, 54, 144, 4, 'asfalto')],
    waters: [], bridges: [], plazas: [],
    buildings: [],
    labels: [],
    encounterZones: [zone(2, 2, 140, 50, 0.08, 'default'), zone(2, 60, 140, 58, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 4, 'oasi', 137, 55, 'Oasi'),
      transition(142, 54, 2, 4, 'castel_di_lama', 6, 55, 'Castel di Lama')
    ],
    npcs: []
  };
}());
