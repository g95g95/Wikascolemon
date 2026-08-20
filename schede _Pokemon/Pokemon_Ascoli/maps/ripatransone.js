(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: passaggi fissi (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.ripatransone = {
    ...city, name: 'Ripatransone', baseTile: 'erba', levelRange: [5, 7],
    encounterTable: [{ species: 'pefna', minLevel: 5, maxLevel: 7, weight: 55 }, { species: 'tamburino', minLevel: 5, maxLevel: 7, weight: 30 }, { species: 'peto', minLevel: 6, maxLevel: 7, weight: 15 }],
    roads: [rect(0, 54, 144, 4, 'asfalto')],
    waters: [], bridges: [], plazas: [],
    buildings: [],
    labels: [],
    encounterZones: [zone(2, 2, 140, 50, 0.08, 'default'), zone(2, 60, 140, 46, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 4, 'porta_maggiore', 8, 31, 'Corriera per Ascoli')
    ],
    npcs: []
  };
}());
