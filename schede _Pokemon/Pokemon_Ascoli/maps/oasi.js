(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: passaggi fissi (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.oasi = {
    ...tall, name: 'Oasi', baseTile: 'erba', levelRange: [5, 8],
    encounterTable: [{ species: 'soldatino', minLevel: 5, maxLevel: 8, weight: 35 }, { species: 'alghetta', minLevel: 5, maxLevel: 8, weight: 30 }, { species: 'anicino', minLevel: 5, maxLevel: 7, weight: 20 }, { species: 'tamburino', minLevel: 6, maxLevel: 8, weight: 15 }],
    roads: [rect(0, 54, 144, 4, 'asfalto')],
    waters: [], bridges: [], plazas: [],
    buildings: [],
    labels: [],
    encounterZones: [zone(2, 2, 140, 50, 0.08, 'default'), zone(2, 60, 140, 58, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 4, 'marino_del_tronto', 173, 55, 'Marino del Tronto'),
      transition(142, 54, 2, 4, 'maltignano', 6, 55, 'Maltignano')
    ],
    npcs: []
  };
}());
