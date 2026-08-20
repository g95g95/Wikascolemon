(function () {
  const { building, rect, zone, transition, npc } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  // SCHELETRO predisposto dall'orchestratore: uscita fissa (vedi Trama/consegna_mappe.md), il resto va disegnato.
  window.PokemonAscoliMaps.palestra_castel_di_lama = {
    width: 24, height: 20, indoor: true, name: 'Palestra di Castel di Lama', baseTile: 'pavimento', levelRange: [1, 1],
    encounterTable: [],
    roads: [rect(0, 0, 24, 1, 'muro'), rect(0, 0, 1, 20, 'muro'), rect(23, 0, 1, 20, 'muro'), rect(0, 19, 11, 1, 'muro'), rect(13, 19, 11, 1, 'muro')],
    waters: [], bridges: [], plazas: [], buildings: [], labels: [], encounterZones: [],
    transitions: [transition(11, 19, 2, 1, 'castel_di_lama', 90, 50, 'Uscita', { direction: 'down' })],
    npcs: []
  };
}());
