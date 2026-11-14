(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.costa = {
    width: 131, height: 71, name: 'Costa', baseTile: 'erba', levelRange: [15, 19],
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
      rect(2, 2, 127, 4, 'asfalto'),
      // strada principale (passaggi fissi, righe 54-57), largo 4
      rect(0, 36, 131, 4, 'asfalto'),
      // via di collegamento fra lungomare e porto/strada principale
      rect(71, 6, 4, 30, 'asfalto'),
      // piazzale del porto
      rect(57, 40, 22, 6, 'asfalto'),
      // scogli lungo la riva (devono precedere la sabbia sotto: terrainAt prende il primo match)
      rect(8, 66, 2, 2, 'muro'), rect(44, 67, 3, 2, 'muro'), rect(92, 66, 2, 2, 'muro'), rect(123, 67, 3, 2, 'muro'),
      // spiaggia (sabbia), dal fondo del porto fino alla riva del mare
      rect(2, 55, 127, 14, 'sabbia')
    ],
    waters: [
      // mare a sud, dalla riga 96 fino al bordo inferiore
      rect(0, 69, 131, 2, 'mare'),
      // insenatura del porto, davanti al Ristoro
      rect(57, 46, 21, 14, 'mare')
    ],
    bridges: [
      // molo che si protende dal porto verso il mare aperto
      rect(66, 46, 4, 14, 'bridge')
    ],
    plazas: [rect(57, 40, 22, 6, 'piazza')],
    buildings: [
      building(26, 7, 8, 5, 'Bagni Sirena', '#d9a94f', 'stabilimento'),
      building(44, 7, 8, 5, 'Bagni Nettuno', '#d9a94f', 'stabilimento'),
      building(79, 7, 8, 5, 'Bagni Conero', '#d9a94f', 'stabilimento'),
      building(92, 7, 8, 5, 'Bagni Adriatico', '#d9a94f', 'stabilimento'),
      building(58, 24, 12, 9, 'Ristoro al Porto', '#b46c52', 'attività', { door: { x: 64, y: 33 }, interior: 'bar' }),
      building(16, 47, 8, 6, 'Chiosco Sirenetta', '#c98f57', 'attività'),
      building(104, 47, 8, 6, 'Noleggio Pedalò', '#c98f57', 'attività')
    ],
    labels: [
      { x: 3, y: 2, text: 'Lungomare' },
      { x: 57, y: 37, text: 'Porto' },
      { x: 3, y: 58, text: 'Spiaggia libera' },
      { x: 113, y: 33, text: '→ Jonathan' }
    ],
    encounterZones: [
      // sabbia
      zone(2, 55, 127, 14, 0.08, 'default'),
      // scogli e riva (fascia più vicina al mare)
      zone(2, 66, 127, 3, 0.12, 'default')
    ],
    transitions: [
      transition(0, 36, 2, 4, 'spinetoli_centobuchi', 86, 23, 'Spinetoli'),
      transition(129, 36, 2, 4, 'jonathan', 5, 30, 'Jonathan')
    ],
    npcs: [
      npc(7, 4, 'Cartello', 'LUNGOMARE DI SAN BENEDETTO — passeggiata fra le palme.', 'fermo'),
      npc(4, 56, 'Cartello', 'SPIAGGIA LIBERA — accesso gratuito, portate l\'ombrellone.', 'fermo'),
      npc(121, 38, 'Cartello', '→ JONATHAN — la discoteca sulla spiaggia, poco più a est.', 'fermo'),
      npc(36, 9, 'Bagnino di salvataggio', 'D\'estate quaggiù è tutto un via vai, ma l\'acqua è \'na bellezza.', 'orizzontale'),
      npc(89, 9, 'Ragazza col gelato', 'Se\' vinuto pé la spiaggia o pé lo Jonathan la sera?', 'fermo'),
      npc(26, 49, 'Pescatore del porto', 'Stammatina ho ripreso le reti, ma li pesci moderni so\' furbi.', 'fermo'),
      // Ivo e Teo, "i congressisti": prima del flag, script lungo con dialogo alternato
      {
        x: 54, y: 62, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
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
        x: 55, y: 62, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
        dialogue: 'Aspetta che parla prima Ivo, dai.'
      },
      // dopo il flag: coppia gemella, battuta di commiato
      {
        x: 54, y: 62, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'Noi se retiramo davero, stavolta. Bona fortuna co\' Riccio.'
      },
      {
        x: 55, y: 62, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'E salutace er congresso, se ce passi.'
      }
    ]
  };
  const map = window.PokemonAscoliMaps.costa;
  map.roads.push(
    // palme lungo il lungomare, a intervalli regolari sopra e sotto la strada
    
    
    rect(4, 6, 2, 2, 'albero'), rect(14, 6, 2, 2, 'albero'), rect(54, 6, 2, 2, 'albero'), 
    rect(104, 6, 2, 2, 'albero'), rect(115, 6, 2, 2, 'albero'),
    // scogli (muro) sparsi fra il lungomare e la strada principale, e lungo la riva
    rect(10, 14, 3, 2, 'muro'), rect(41, 18, 2, 3, 'muro'), rect(75, 16, 3, 2, 'muro'), rect(101, 20, 2, 3, 'muro'),
    rect(113, 14, 3, 2, 'muro'),
    // boschetti/vegetazione fra le due strade, lontano da edifici e passaggi
    rect(16, 22, 3, 1, 'albero'), 
    rect(104, 22, 3, 1, 'albero'), 
    rect(36, 23, 3, 1, 'albero'), rect(113, 26, 3, 2, 'albero'),
    // cornice di alberi sui bordi, interrotta ai passaggi (righe 54-57) e dal mare/spiaggia a sud
    rect(0, 0, 131, 2, 'albero'),
    rect(0, 2, 2, 34, 'albero'), rect(0, 40, 2, 29, 'albero'),
    rect(129, 2, 2, 34, 'albero'), rect(129, 40, 2, 29, 'albero')
  );
}());
