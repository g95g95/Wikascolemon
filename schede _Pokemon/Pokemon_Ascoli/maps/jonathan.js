(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: passaggi fissi (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.jonathan = {
    ...city, name: 'Jonathan', baseTile: 'erba', levelRange: [17, 20],
    encounterTable: [],
    roads: [rect(0, 54, 144, 4, 'asfalto'), rect(71, 50, 3, 4)],
    waters: [], bridges: [], plazas: [],
    buildings: [building(66, 40, 14, 10, 'Jonathan', '#5a4e9c', 'discoteca', { door: { x: 72, y: 50 }, interior: 'gym', script: [{ warp: { map: 'palestra_costa', x: 14, y: 20, direction: 'up' } }] })],
    labels: [],
    encounterZones: [],
    transitions: [
      transition(0, 54, 2, 4, 'costa', 173, 55, 'Spiaggia')
    ],
    npcs: []
  };
}());
