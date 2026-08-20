(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: passaggi fissi (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.marino_del_tronto = {
    ...wide, name: 'Marino del Tronto', baseTile: 'erba', levelRange: [4, 7],
    encounterTable: [{ species: 'tifotto', minLevel: 4, maxLevel: 7, weight: 35 }, { species: 'totera', minLevel: 4, maxLevel: 7, weight: 30 }, { species: 'tamburino', minLevel: 4, maxLevel: 6, weight: 20 }, { species: 'anicino', minLevel: 5, maxLevel: 7, weight: 15 }],
    roads: [rect(0, 54, 180, 4, 'asfalto')],
    waters: [], bridges: [], plazas: [],
    buildings: [],
    labels: [],
    encounterZones: [zone(2, 2, 176, 50, 0.08, 'default'), zone(2, 60, 176, 58, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 4, 'monticelli', 173, 59, 'Monticelli'),
      transition(178, 54, 2, 4, 'oasi', 6, 55, 'Oasi')
    ],
    npcs: []
  };
}());
