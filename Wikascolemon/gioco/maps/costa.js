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
      rect(1, 3, 88, 2, 'asfalto'),
      // strada principale (passaggi fissi, righe 54-57), largo 4
      rect(0, 27, 90, 2, 'asfalto'),
      // via di collegamento fra lungomare e porto/strada principale
      rect(48, 5, 2, 22, 'asfalto'),
      // piazzale del porto
      rect(35, 29, 20, 3, 'asfalto'),
      // scogli lungo la riva (devono precedere la sabbia sotto: terrainAt prende il primo match)
      rect(5, 47, 1, 1, 'muro'), rect(25, 47, 1, 1, 'muro'), rect(65, 47, 1, 1, 'muro'), rect(85, 47, 1, 1, 'muro'),
      // spiaggia (sabbia), dal fondo del porto fino alla riva del mare
      rect(1, 39, 88, 9, 'sabbia')
    ],
    waters: [
      // mare a sud, dalla riga 96 fino al bordo inferiore
      rect(0, 48, 90, 12, 'mare'),
      // insenatura del porto, davanti al Ristoro
      rect(38, 32, 14, 10, 'mare')
    ],
    bridges: [
      // molo che si protende dal porto verso il mare aperto
      rect(44, 32, 2, 10, 'bridge')
    ],
    plazas: [rect(35, 29, 20, 3, 'piazza')],
    buildings: [
      building(15, 6, 4, 2, 'Bagni Sirena', '#d9a94f', 'stabilimento'),
      building(25, 6, 4, 2, 'Bagni Nettuno', '#d9a94f', 'stabilimento'),
      building(55, 6, 4, 2, 'Bagni Conero', '#d9a94f', 'stabilimento'),
      building(65, 6, 4, 2, 'Bagni Adriatico', '#d9a94f', 'stabilimento'),
      building(40, 21, 6, 5, 'Ristoro al Porto', '#b46c52', 'attività', { door: { x: 43, y: 26 }, interior: 'bar' }),
      building(10, 33, 4, 3, 'Chiosco Sirenetta', '#c98f57', 'attività'),
      building(75, 33, 4, 3, 'Noleggio Pedalò', '#c98f57', 'attività')
    ],
    labels: [
      { x: 2, y: 2, text: 'Lungomare' },
      { x: 35, y: 28, text: 'Porto' },
      { x: 2, y: 41, text: 'Spiaggia libera' },
      { x: 80, y: 26, text: '→ Jonathan' }
    ],
    encounterZones: [
      // sabbia
      zone(1, 39, 88, 9, 0.08, 'default'),
      // scogli e riva (fascia più vicina al mare)
      zone(1, 46, 88, 2, 0.12, 'default')
    ],
    transitions: [
      transition(0, 27, 1, 2, 'spinetoli_centobuchi', 86, 28, 'Spinetoli'),
      transition(89, 27, 1, 2, 'jonathan', 3, 28, 'Jonathan')
    ],
    npcs: [
      npc(5, 4, 'Cartello', 'LUNGOMARE DI SAN BENEDETTO — passeggiata fra le palme.', 'fermo'),
      npc(3, 40, 'Cartello', 'SPIAGGIA LIBERA — accesso gratuito, portate l\'ombrellone.', 'fermo'),
      npc(84, 28, 'Cartello', '→ JONATHAN — la discoteca sulla spiaggia, poco più a est.', 'fermo'),
      npc(20, 7, 'Bagnino di salvataggio', 'D\'estate quaggiù è tutto un via vai, ma l\'acqua è \'na bellezza.', 'orizzontale'),
      npc(60, 7, 'Ragazza col gelato', 'Se\' vinuto pé la spiaggia o pé lo Jonathan la sera?', 'fermo'),
      npc(15, 34, 'Pescatore del porto', 'Stammatina ho ripreso le reti, ma li pesci moderni so\' furbi.', 'fermo'),
      // Ivo e Teo, "i congressisti": prima del flag, script lungo con dialogo alternato
      {
        x: 30, y: 43, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
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
        x: 31, y: 43, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
        dialogue: 'Aspetta che parla prima Ivo, dai.'
      },
      // dopo il flag: coppia gemella, battuta di commiato
      {
        x: 30, y: 43, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'Noi se retiramo davero, stavolta. Bona fortuna co\' Riccio.'
      },
      {
        x: 31, y: 43, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'E salutace er congresso, se ce passi.'
      }
    ]
  };
  const map = window.PokemonAscoliMaps.costa;
  map.roads.push(
    // palme lungo il lungomare, a intervalli regolari sopra e sotto la strada
    rect(3, 2, 1, 1, 'albero'), rect(9, 2, 1, 1, 'albero'), rect(30, 2, 1, 1, 'albero'), rect(36, 2, 1, 1, 'albero'),
    rect(53, 2, 1, 1, 'albero'), rect(61, 2, 1, 1, 'albero'), rect(75, 2, 1, 1, 'albero'), rect(81, 2, 1, 1, 'albero'),
    rect(3, 5, 1, 2, 'albero'), rect(9, 5, 1, 2, 'albero'), rect(30, 5, 1, 2, 'albero'), rect(36, 5, 1, 2, 'albero'),
    rect(53, 5, 1, 2, 'albero'), rect(61, 5, 1, 2, 'albero'), rect(75, 5, 1, 2, 'albero'), rect(81, 5, 1, 2, 'albero'),
    // scogli (muro) sparsi fra il lungomare e la strada principale, e lungo la riva
    rect(7, 12, 1, 1, 'muro'), rect(23, 15, 1, 2, 'muro'), rect(50, 13, 2, 1, 'muro'), rect(70, 16, 1, 1, 'muro'),
    rect(80, 12, 2, 1, 'muro'),
    // boschetti/vegetazione fra le due strade, lontano da edifici e passaggi
    rect(10, 17, 1, 1, 'albero'), rect(13, 19, 1, 1, 'albero'),
    rect(75, 17, 2, 1, 'albero'), rect(77, 19, 2, 1, 'albero'),
    rect(20, 20, 2, 1, 'albero'), rect(80, 22, 2, 1, 'albero'),
    // cornice di alberi sui bordi, interrotta ai passaggi (righe 54-57) e dal mare/spiaggia a sud
    rect(0, 0, 90, 1, 'albero'),
    rect(0, 1, 1, 26, 'albero'), rect(0, 29, 1, 19, 'albero'),
    rect(89, 1, 1, 26, 'albero'), rect(89, 29, 1, 19, 'albero')
  );
}());
