(function () {
  const { building, rect, zone, transition, npc } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: uscita fissa (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.palestra_costa = {
    width: 30, height: 22, indoor: true, name: 'Palestra della Costa', baseTile: 'pavimento', levelRange: [1, 1],
    encounterTable: [],
    roads: [rect(0, 0, 30, 1, 'muro'), rect(0, 0, 1, 22, 'muro'), rect(29, 0, 1, 22, 'muro'), rect(0, 21, 14, 1, 'muro'), rect(16, 21, 14, 1, 'muro')],
    waters: [], bridges: [], plazas: [], buildings: [], labels: [], encounterZones: [],
    transitions: [transition(14, 21, 2, 1, 'jonathan', 72, 50, 'Uscita', { direction: 'down' })],
    npcs: []
  };
}());
