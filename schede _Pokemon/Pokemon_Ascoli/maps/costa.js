(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.costa = {
    ...wide, name: 'Costa', baseTile: 'erba', levelRange: [15, 19],
    encounterTable: [
      { species: 'cozzetta', minLevel: 15, maxLevel: 19, weight: 25 },
      { species: 'lettino', minLevel: 15, maxLevel: 19, weight: 20 },
      { species: 'alghetta', minLevel: 15, maxLevel: 18, weight: 15 },
      { species: 'bagnetto', minLevel: 16, maxLevel: 19, weight: 15 },
      { species: 'maranzino', minLevel: 16, maxLevel: 19, weight: 10 },
      { species: 'mucillax', minLevel: 17, maxLevel: 19, weight: 10 },
      { species: 'scoglierax', minLevel: 18, maxLevel: 19, weight: 5 }
    ],
    roads: [
      // lungomare a nord (righe 6-9), largo 4
      rect(1, 4, 118, 3, 'asfalto'),
      // strada principale (passaggi fissi, righe 54-57), largo 4
      rect(0, 36, 120, 3, 'asfalto'),
      // via di collegamento fra lungomare e porto/strada principale
      rect(64, 7, 3, 29, 'asfalto'),
      // piazzale del porto
      rect(47, 39, 26, 4, 'asfalto'),
      // scogli lungo la riva (devono precedere la sabbia sotto: terrainAt prende il primo match)
      rect(7, 62, 1, 1, 'muro'), rect(33, 63, 2, 1, 'muro'), rect(87, 62, 1, 1, 'muro'), rect(113, 63, 2, 1, 'muro'),
      // spiaggia (sabbia), dal fondo del porto fino alla riva del mare
      rect(1, 52, 118, 12, 'sabbia')
    ],
    waters: [
      // mare a sud, dalla riga 96 fino al bordo inferiore
      rect(0, 64, 120, 16, 'mare'),
      // insenatura del porto, davanti al Ristoro
      rect(51, 43, 18, 13, 'mare')
    ],
    bridges: [
      // molo che si protende dal porto verso il mare aperto
      rect(59, 43, 2, 13, 'bridge')
    ],
    plazas: [rect(47, 39, 26, 4, 'piazza')],
    buildings: [
      building(20, 8, 5, 3, 'Bagni Sirena', '#d9a94f', 'stabilimento'),
      building(33, 8, 6, 3, 'Bagni Nettuno', '#d9a94f', 'stabilimento'),
      building(73, 8, 6, 3, 'Bagni Conero', '#d9a94f', 'stabilimento'),
      building(87, 8, 5, 3, 'Bagni Adriatico', '#d9a94f', 'stabilimento'),
      building(53, 28, 8, 6, 'Ristoro al Porto', '#b46c52', 'attività', { door: { x: 57, y: 34 }, interior: 'bar' }),
      building(13, 44, 6, 4, 'Chiosco Sirenetta', '#c98f57', 'attività'),
      building(100, 44, 5, 4, 'Noleggio Pedalò', '#c98f57', 'attività')
    ],
    labels: [
      { x: 2, y: 3, text: 'Lungomare' },
      { x: 47, y: 37, text: 'Porto' },
      { x: 3, y: 55, text: 'Spiaggia libera' },
      { x: 107, y: 34, text: '→ Jonathan' }
    ],
    encounterZones: [
      // sabbia
      zone(1, 52, 118, 12, 0.08, 'default'),
      // scogli e riva (fascia più vicina al mare)
      zone(1, 61, 118, 3, 0.12, 'default')
    ],
    transitions: [
      transition(0, 36, 1, 3, 'spinetoli_centobuchi', 115, 37, 'Spinetoli'),
      transition(119, 36, 1, 3, 'jonathan', 4, 37, 'Jonathan')
    ],
    npcs: [
      npc(6, 5, 'Cartello', 'LUNGOMARE DI SAN BENEDETTO — passeggiata fra le palme.', 'fermo'),
      npc(4, 53, 'Cartello', 'SPIAGGIA LIBERA — accesso gratuito, portate l\'ombrellone.', 'fermo'),
      npc(112, 37, 'Cartello', '→ JONATHAN — la discoteca sulla spiaggia, poco più a est.', 'fermo'),
      npc(27, 9, 'Bagnino di salvataggio', 'D\'estate quaggiù è tutto un via vai, ma l\'acqua è \'na bellezza.', 'orizzontale'),
      npc(80, 9, 'Ragazza col gelato', 'Se\' vinuto pé la spiaggia o pé lo Jonathan la sera?', 'fermo'),
      npc(20, 45, 'Pescatore del porto', 'Stammatina ho ripreso le reti, ma li pesci moderni so\' furbi.', 'fermo'),
      // Ivo e Teo, "i congressisti": prima del flag, script lungo con dialogo alternato
      {
        x: 40, y: 57, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
        script: [
          { say: 'Ehm... salve. Siamo solo due villeggianti, eh, niente di che.', name: 'Ivo' },
          { say: 'Sì sì, congressisti. Qui pé lu congresso. Mica pé antro.', name: 'Teo' },
          { say: 'Teo, non serve giustificasse così, mo\' ce pijeno pé matti davero.', name: 'Ivo' },
          { say: 'A dì la verità... noi s\'era \'nventati de dà \'na lezione a quer Riccio de lo Jonathan.', name: 'Teo' },
          { say: 'Sì, l\'aguato più curto de la storia. Ce s\'è visto arrivà co\' \'na fusciacca de gomma e ha detto solo "Ombrellone, avanti".', name: 'Ivo' },
          { say: 'E doppo tre minuti eravamo già stesi sulla sabbia, tutt\'e due.', name: 'Teo' },
          { say: 'Ce ha pure rimandato al congresso, testuale. "Annàtevene al congresso, va\'".', name: 'Ivo' },
          { say: 'Se vòi entrà a lo Jonathan sappi che Riccio sta llà dietro, protetto da li Bro della Security.', name: 'Teo' },
          { say: 'Fatte forte prima de provacce, uagliò. Nu\' come noi.', name: 'Ivo' },
          { setFlag: 'ivo_teo_visti' }
        ]
      },
      {
        x: 41, y: 57, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
        dialogue: 'Aspetta che parla prima Ivo, dai.'
      },
      // dopo il flag: coppia gemella, battuta di commiato
      {
        x: 40, y: 57, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'Noi se retiramo davero, stavolta. Bona fortuna co\' Riccio.'
      },
      {
        x: 41, y: 57, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'E salutace er congresso, se ce passi.'
      }
    ]
  };
  const map = window.PokemonAscoliMaps.costa;
  map.roads.push(
    // palme lungo il lungomare, a intervalli regolari sopra e sotto la strada
    rect(4, 3, 1, 1, 'albero'), rect(12, 3, 1, 1, 'albero'), rect(40, 3, 1, 1, 'albero'), rect(48, 3, 1, 1, 'albero'),
    rect(70, 3, 1, 1, 'albero'), rect(81, 3, 2, 1, 'albero'), rect(100, 3, 1, 1, 'albero'), rect(108, 3, 1, 1, 'albero'),
    rect(4, 7, 1, 2, 'albero'), rect(12, 7, 1, 2, 'albero'), rect(40, 7, 1, 2, 'albero'), rect(48, 7, 1, 2, 'albero'),
    rect(70, 7, 1, 2, 'albero'), rect(81, 7, 2, 2, 'albero'), rect(100, 7, 1, 2, 'albero'), rect(108, 7, 1, 2, 'albero'),
    // scogli (muro) sparsi fra il lungomare e la strada principale, e lungo la riva
    rect(9, 16, 2, 1, 'muro'), rect(30, 20, 1, 2, 'muro'), rect(67, 17, 2, 2, 'muro'), rect(93, 21, 2, 2, 'muro'),
    rect(107, 16, 2, 1, 'muro'),
    // boschetti/vegetazione fra le due strade, lontano da edifici e passaggi
    rect(13, 23, 2, 1, 'albero'), rect(17, 25, 1, 2, 'albero'),
    rect(100, 23, 2, 1, 'albero'), rect(103, 25, 2, 2, 'albero'),
    rect(27, 27, 2, 1, 'albero'), rect(107, 29, 2, 2, 'albero'),
    // cornice di alberi sui bordi, interrotta ai passaggi (righe 54-57) e dal mare/spiaggia a sud
    rect(0, 0, 120, 1, 'albero'),
    rect(0, 1, 1, 35, 'albero'), rect(0, 39, 1, 25, 'albero'),
    rect(119, 1, 1, 35, 'albero'), rect(119, 39, 1, 25, 'albero')
  );
}());
