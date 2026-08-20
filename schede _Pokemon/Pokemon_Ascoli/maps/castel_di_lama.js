(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: passaggi fissi (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.castel_di_lama = {
    ...wide, name: 'Castel di Lama', baseTile: 'erba', levelRange: [9, 12],
    encounterTable: [{ species: 'totera', minLevel: 9, maxLevel: 12, weight: 45 }, { species: 'anicino', minLevel: 9, maxLevel: 12, weight: 35 }, { species: 'caita', minLevel: 11, maxLevel: 12, weight: 10 }, { species: 'tifotto', minLevel: 9, maxLevel: 11, weight: 10 }],
    roads: [rect(0, 54, 180, 4, 'asfalto'), rect(89, 50, 3, 4)],
    waters: [], bridges: [], plazas: [],
    buildings: [building(84, 40, 12, 10, 'Free Spirit (palestra)', '#8e6bb0', 'palestra', { door: { x: 90, y: 50 }, interior: 'gym', script: [{ warp: { map: 'palestra_castel_di_lama', x: 11, y: 18, direction: 'up' } }] })],
    labels: [],
    encounterZones: [zone(2, 2, 176, 50, 0.08, 'default'), zone(2, 60, 176, 58, 0.08, 'default')],
    transitions: [
      transition(0, 54, 2, 4, 'maltignano', 137, 55, 'Maltignano'),
      transition(178, 54, 2, 4, 'spinetoli_centobuchi', 6, 55, 'Spinetoli', { when: { badge: 1 }, blockedText: 'Senza la Medaglia Spirito non si passa.' })
    ],
    npcs: []
  };
}());
