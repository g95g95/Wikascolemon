// GENERATO da tools/build-dex.mjs — non modificare a mano.
(function () {
  const api = {
  "attrito": {
    "name": "Attrito",
    "type": "Normale",
    "category": "Fisico",
    "power": 20,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "speed",
      "stages": -1,
      "chance": 10
    },
    "description": "Attrito che può ridurre la Velocità avversaria."
  },
  "frustata": {
    "name": "Frustata",
    "type": "Erba",
    "category": "Fisico",
    "power": 45,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": null,
    "description": "Un colpo di ramo scattante."
  },
  "spruzzo": {
    "name": "Spruzzo",
    "type": "Acqua",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": null,
    "description": "Un piccolo spruzzo d'acqua."
  },
  "crescita": {
    "name": "Crescita",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "spAttack",
      "stages": 1,
      "chance": 100
    },
    "description": "Fa crescere il corpo, aumentando l'Attacco Speciale."
  },
  "assorbimento": {
    "name": "Assorbimento",
    "type": "Erba",
    "category": "Speciale",
    "power": 20,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": {
      "kind": "drain",
      "ratio": 0.5
    },
    "description": "Assorbe metà del danno inflitto come cura."
  },
  "rete_di_fili": {
    "name": "Rete di fili",
    "type": "Coleot",
    "category": "Stato",
    "power": 0,
    "accuracy": 95,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "speed",
      "stages": -1,
      "chance": 100
    },
    "description": "Ragnatele appiccicose che abbassano la Velocità avversaria."
  },
  "bolla_acida": {
    "name": "Bolla Acida",
    "type": "Acqua",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "spDefense",
      "stages": -1,
      "chance": 100
    },
    "description": "Bolle acide che abbassano la Difesa Speciale avversaria."
  },
  "correntina": {
    "name": "Correntina",
    "type": "Acqua",
    "category": "Speciale",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "speed",
      "stages": -1,
      "chance": 30
    },
    "description": "infligge danno Acqua e ha probabilità aumentata di abbassare la Velocità del bersaglio di uno stadio, imitando la corrente che trascina via chi nuota controcorrente."
  },
  "azione": {
    "name": "Azione",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": null,
    "description": "Colpo semplice senza fronzoli."
  },
  "profumino": {
    "name": "Profumino",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "accuracy",
      "stages": -1,
      "chance": 100
    },
    "description": "Un profumo che confonde i sensi e abbassa la precisione avversaria."
  },
  "fogliame": {
    "name": "Fogliame",
    "type": "Erba",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": null,
    "description": "Foglie scagliate con forza."
  },
  "sonnifero": {
    "name": "Sonnifero",
    "type": "Erba",
    "category": "Stato",
    "power": 0,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "speed",
      "stages": -1,
      "chance": 75
    },
    "description": "Un profumo soporifero che spesso abbassa la Velocità."
  },
  "megassorbimento": {
    "name": "Megassorbimento",
    "type": "Erba",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "drain",
      "ratio": 0.5
    },
    "description": "Assorbe metà del danno inflitto come cura."
  },
  "foglielama": {
    "name": "Foglielama",
    "type": "Erba",
    "category": "Fisico",
    "power": 55,
    "accuracy": 95,
    "pp": 25,
    "priority": 0,
    "effect": null,
    "description": "Foglie affilate come lame."
  },
  "sintesi": {
    "name": "Sintesi",
    "type": "Erba",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "heal",
      "ratio": 0.5
    },
    "description": "Recupera PS assorbendo energia solare."
  },
  "energipalla": {
    "name": "Energipalla",
    "type": "Erba",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "spDefense",
      "stages": -1,
      "chance": 10
    },
    "description": "Una sfera di energia naturale."
  },
  "corretto": {
    "name": "Corretto",
    "type": "Erba",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "corretto"
    },
    "description": "è la sua mossa esclusiva, appresa nel momento dell'evoluzione: Anisetta si scalda da sé,"
  },
  "lecca": {
    "name": "Lecca",
    "type": "Spettro",
    "category": "Fisico",
    "power": 30,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 30
    },
    "description": "Una leccata che può paralizzare."
  },
  "confondiraggio": {
    "name": "Confondiraggio",
    "type": "Spettro",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "confuse_only"
    },
    "description": "Un raggio che confonde il bersaglio."
  },
  "aromaterapia": {
    "name": "Aromaterapia",
    "type": "Erba",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "cure_team_status"
    },
    "description": "Un profumo che cura i problemi di stato dell'intera squadra."
  },
  "palla_ombra": {
    "name": "Palla Ombra",
    "type": "Spettro",
    "category": "Speciale",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "spDefense",
      "stages": -1,
      "chance": 20
    },
    "description": "Una sfera oscura che può abbassare la Difesa Speciale."
  },
  "malocchio": {
    "name": "Malocchio",
    "type": "Spettro",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "impede_switch"
    },
    "description": "Uno sguardo che impedisce la fuga o la sostituzione."
  },
  "pistolacqua": {
    "name": "Pistolacqua",
    "type": "Acqua",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": null,
    "description": "Un getto d'acqua rapido."
  },
  "fischio": {
    "name": "Fischio",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "slp",
      "chance": 100
    },
    "description": "Un fischio ipnotico che fa addormentare."
  },
  "ripescaggio": {
    "name": "Ripescaggio",
    "type": "Acqua",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "ripescaggio"
    },
    "description": "è la sua mossa esclusiva: si tuffa e riporta a riva l'alleato in difficoltà —"
  },
  "aiuto": {
    "name": "Aiuto",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "aiuto"
    },
    "description": "Usa una mossa a caso tra quelle della squadra."
  },
  "acquagetto": {
    "name": "Acquagetto",
    "type": "Acqua",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un getto d'acqua che colpisce con forza."
  },
  "rimbombo": {
    "name": "Rimbombo",
    "type": "Normale",
    "category": "Speciale",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un boato sonoro fortissimo."
  },
  "idropulsar": {
    "name": "Idropulsar",
    "type": "Acqua",
    "category": "Speciale",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "confuse_chance"
    },
    "description": "Onde d'acqua pulsanti che possono confondere."
  },
  "vigorspinta": {
    "name": "Vigorspinta",
    "type": "Normale",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Una spinta energica."
  },
  "surf": {
    "name": "Surf",
    "type": "Acqua",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Una grande onda che travolge il bersaglio."
  },
  "ruggito": {
    "name": "Ruggito",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "roar"
    },
    "description": "Costringe il bersaglio a essere sostituito."
  },
  "sberla": {
    "name": "Sberla",
    "type": "Normale",
    "category": "Fisico",
    "power": 60,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Una sberla potente ma imprecisa."
  },
  "fortificazione": {
    "name": "Fortificazione",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "defense",
      "stages": 1,
      "chance": 100
    },
    "description": "Irrigidisce i muscoli, aumentando la Difesa."
  },
  "risata_sana": {
    "name": "Risata Sana",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "risata_sana"
    },
    "description": "ride di gusto di una cosa che ha detto lui. L'avversario resta interdetto e perde precisione; nelle lotte in doppio l'alleato guadagna Attacco, perché — non si sa come — ride anche lui."
  },
  "bottintesta": {
    "name": "Bottintesta",
    "type": "Normale",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Testata potente."
  },
  "jnen": {
    "name": "Jnèn",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "jnen"
    },
    "description": "annulla l'effetto dell'ultima mossa di stato usata dall'avversario e ne impedisce l'uso per un turno. Non la contrasta: la constata, e la questione si chiude lì."
  },
  "sgraffignata": {
    "name": "Sgraffignata",
    "type": "Buio",
    "category": "Fisico",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": null,
    "description": "Una graffiata rapida e diretta."
  },
  "riduttore": {
    "name": "Riduttore",
    "type": "Normale",
    "category": "Fisico",
    "power": 80,
    "accuracy": 75,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un colpo potente ma impreciso."
  },
  "ripresa": {
    "name": "Ripresa",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "heal",
      "ratio": 0.5
    },
    "description": "Recupera metà dei propri PS massimi."
  },
  "solito": {
    "name": "Solito",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "solito"
    },
    "description": "non serve dire cosa vuoi. Ripristina metà PS e cura i problemi di stato dell'intera squadra, ma solo la prima volta che Banconio scende in campo."
  },
  "ultrarapido": {
    "name": "Ultrarapido",
    "type": "Normale",
    "category": "Fisico",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": "Un attacco fulmineo e potentissimo."
  },
  "fogliamagica": {
    "name": "Fogliamagica",
    "type": "Erba",
    "category": "Speciale",
    "power": 60,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Foglie tagliate che non mancano quasi mai."
  },
  "paralizzante": {
    "name": "Paralizzante",
    "type": "Erba",
    "category": "Stato",
    "power": 0,
    "accuracy": 75,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 75
    },
    "description": "Polline urticante che paralizza spesso."
  },
  "stappo": {
    "name": "Stappo",
    "type": "Acqua",
    "category": "Fisico",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 1,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "è la sua mossa esclusiva: il tappo a corona parte come un proiettile —"
  },
  "cincin": {
    "name": "Cincin",
    "type": "Acqua",
    "category": "Fisico",
    "power": 20,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "multi",
      "min": 2,
      "max": 6
    },
    "description": "è la sua mossa esclusiva: i sei tappi partono"
  },
  "bollaraggio": {
    "name": "Bollaraggio",
    "type": "Acqua",
    "category": "Speciale",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un raggio di bolle pressurizzate."
  },
  "corposcontro": {
    "name": "Corposcontro",
    "type": "Normale",
    "category": "Fisico",
    "power": 85,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 30
    },
    "description": "Scontro fisico che può paralizzare."
  },
  "braciscavo": {
    "name": "Braciscavo",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 85,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "ignore_dig_like"
    },
    "description": "infligge danno Fuoco e ha probabilità aumentata di scoprire il bersaglio (annulla protezione tipo Buca), simulando la carica che disseppellisce la brace dal terreno."
  },
  "attaccatesta": {
    "name": "Attaccatesta",
    "type": "Normale",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "Testata che può far tentennare il bersaglio."
  },
  "scavare": {
    "name": "Scavare",
    "type": "Terra",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Si nasconde sottoterra e colpisce al turno successivo."
  },
  "zampata": {
    "name": "Zampata",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "brn",
      "chance": 10
    },
    "description": "Una zampata infuocata che può scottare."
  },
  "terrapicco": {
    "name": "Terrapicco",
    "type": "Terra",
    "category": "Fisico",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un colpo che fa tremare il terreno."
  },
  "zannata": {
    "name": "Zannata",
    "type": "Buio",
    "category": "Fisico",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 10
    },
    "description": "Un morso che può far tentennare."
  },
  "marchiafuoco": {
    "name": "Marchiafuoco",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 120,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": "Un marchio di fuoco potentissimo ma impreciso."
  },
  "terremoto": {
    "name": "Terremoto",
    "type": "Terra",
    "category": "Fisico",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un violento terremoto che scuote il campo."
  },
  "rip_temerario": {
    "name": "Rip. temerario",
    "type": "Normale",
    "category": "Fisico",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un attacco temerario e potentissimo."
  },
  "bolla": {
    "name": "Bolla",
    "type": "Acqua",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": null,
    "description": "Bolle scagliate con forza."
  },
  "presa": {
    "name": "Presa",
    "type": "Normale",
    "category": "Fisico",
    "power": 55,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": null,
    "description": "Una presa energica."
  },
  "idrogetto": {
    "name": "Idrogetto",
    "type": "Acqua",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un getto d'acqua pressurizzata."
  },
  "braciere": {
    "name": "Braciere",
    "type": "Fuoco",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "brn",
      "chance": 10
    },
    "description": "Fiamme che possono scottare il bersaglio."
  },
  "colpokarate": {
    "name": "Colpokarate",
    "type": "Lotta",
    "category": "Fisico",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": null,
    "description": "Un colpo secco in stile karate."
  },
  "cascata": {
    "name": "Cascata",
    "type": "Acqua",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 20
    },
    "description": "Colpisce come una cascata, può far tentennare."
  },
  "fuocopugno": {
    "name": "Fuocopugno",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "brn",
      "chance": 10
    },
    "description": "Un pugno di fuoco che può scottare."
  },
  "granchiomartello": {
    "name": "Granchiomartello",
    "type": "Acqua",
    "category": "Fisico",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un colpo di chela potente."
  },
  "fascino": {
    "name": "Fascino",
    "type": "Folletto",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "attack",
      "stages": -2,
      "chance": 100
    },
    "description": "Ammalia il bersaglio, abbassando molto il suo Attacco."
  },
  "agilita": {
    "name": "Agilità",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "speed",
      "stages": 2,
      "chance": 100
    },
    "description": "Rilassa il corpo e aumenta di molto la Velocità."
  },
  "rapidattacco": {
    "name": "Rapidattacco",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": null,
    "description": "Colpisce per primo quasi sempre."
  },
  "forza_lunare": {
    "name": "Forza Lunare",
    "type": "Folletto",
    "category": "Speciale",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un raggio di luce lunare."
  },
  "doppioteam": {
    "name": "Doppioteam",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "evasion_up"
    },
    "description": "Crea illusioni di sé stesso, aumentando l'elusione."
  },
  "bruciapelo": {
    "name": "Bruciapelo",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 10,
    "priority": 1,
    "effect": null,
    "description": "è il suo celebre starnuto-botto: agisce sempre per primo, ma solo appena sceso in campo."
  },
  "carineria": {
    "name": "Carineria",
    "type": "Folletto",
    "category": "Fisico",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "attack",
      "stages": -2,
      "chance": 100
    },
    "description": "Un'espressione carina che abbassa molto l'Attacco avversario."
  },
  "scattomatto": {
    "name": "Scattomatto",
    "type": "Normale",
    "category": "Fisico",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "scattomatto"
    },
    "description": "infligge danno e aumenta di molto la Velocità, ma nel turno successivo Bree non può agire — si è già accucciato da qualche parte."
  },
  "botto": {
    "name": "Botto",
    "type": "Normale",
    "category": "Fisico",
    "power": 20,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": null,
    "description": "Colpo secco e diretto."
  },
  "nevischio": {
    "name": "Nevischio",
    "type": "Ghiaccio",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "frz",
      "chance": 10
    },
    "description": "Nevischio gelido che può congelare."
  },
  "urlo": {
    "name": "Urlo",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "attack",
      "stages": -1,
      "chance": 100
    },
    "description": "Un urlo che abbassa l'Attacco avversario."
  },
  "cassa_toracica": {
    "name": "Cassa Toracica",
    "type": "Ghiaccio",
    "category": "Speciale",
    "power": 60,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "colpisce con un'ondata di frastuono gelato e ha una probabilità aumentata di far tentennare il bersaglio (Timore), specialmente se usata per prima nel turno."
  },
  "rimbalzello": {
    "name": "Rimbalzello",
    "type": "Normale",
    "category": "Fisico",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un colpo che rimbalza sul bersaglio."
  },
  "raggio_gelo": {
    "name": "Raggio Gelo",
    "type": "Ghiaccio",
    "category": "Speciale",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "frz",
      "chance": 10
    },
    "description": "Un raggio gelido che può congelare."
  },
  "grido_lacerante": {
    "name": "Grido Lacerante",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "spAttack",
      "stages": -2,
      "chance": 100
    },
    "description": "Un grido straziante che abbassa molto l'Attacco Speciale avversario."
  },
  "vento_ghiacciato": {
    "name": "Vento Ghiacciato",
    "type": "Ghiaccio",
    "category": "Speciale",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "speed",
      "stages": -1,
      "chance": 100
    },
    "description": "Un vento gelido che abbassa sempre la Velocità avversaria."
  },
  "frana": {
    "name": "Frana",
    "type": "Roccia",
    "category": "Fisico",
    "power": 75,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Una frana di roccia che travolge il bersaglio."
  },
  "gelo_nevoso": {
    "name": "Gelo Nevoso",
    "type": "Ghiaccio",
    "category": "Speciale",
    "power": 110,
    "accuracy": 70,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": "Una tempesta di neve gelida."
  },
  "adunanza": {
    "name": "Adunanza",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "adunanza"
    },
    "description": "per tre turni aumenta la Difesa di Ca'ità in proporzione al numero di turioni residui visibili sul suo corpo, come se il ricordo dell'unione lo rendesse ancora più solido."
  },
  "corpolento": {
    "name": "Corpolento",
    "type": "Normale",
    "category": "Fisico",
    "power": 85,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Colpisce con tutto il peso del corpo."
  },
  "ringhio": {
    "name": "Ringhio",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "attack",
      "stages": -1,
      "chance": 100
    },
    "description": "Un ringhio che intimidisce, abbassando l'Attacco avversario."
  },
  "sbadiglio": {
    "name": "Sbadiglio",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "yawn"
    },
    "description": "Un lungo sbadiglio: il bersaglio si addormenta al termine del turno successivo."
  },
  "corpomasso": {
    "name": "Corpomasso",
    "type": "Normale",
    "category": "Fisico",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "Attacco massiccio che può far tentennare."
  },
  "riposo": {
    "name": "Riposo",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "rest"
    },
    "description": "Cura completamente PS e stato, ma fa addormentare chi la usa per due turni."
  },
  "rimbalzo": {
    "name": "Rimbalzo",
    "type": "Normale",
    "category": "Fisico",
    "power": 130,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un balzo potente che colpisce con forza."
  },
  "urlorabbia": {
    "name": "Urlorabbia",
    "type": "Buio",
    "category": "Speciale",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un urlo carico di rabbia."
  },
  "assillo": {
    "name": "Assillo",
    "type": "Buio",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "attack",
      "stages": -1,
      "chance": 100
    },
    "description": "Un fastidio continuo che abbassa l'Attacco avversario."
  },
  "fintoattacco": {
    "name": "Fintoattacco",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un finto attacco che colpisce comunque."
  },
  "bolgia": {
    "name": "Bolgia",
    "type": "Buio",
    "category": "Speciale",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "bolgia"
    },
    "description": "è la sua mossa esclusiva: una mossa sonora la cui potenza"
  },
  "granfisico": {
    "name": "Granfisico",
    "type": "Lotta",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "attack",
      "stages": 1,
      "chance": 100
    },
    "description": "Rafforza il fisico, aumentando l'Attacco."
  },
  "sbigoattacco": {
    "name": "Sbigoattacco",
    "type": "Buio",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 2,
    "effect": {
      "kind": "flinch",
      "chance": 100
    },
    "description": "Colpisce sempre per primo e fa tentennare, ma solo appena sceso in campo."
  },
  "baraonda": {
    "name": "Baraonda",
    "type": "Normale",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "confuse_self_after"
    },
    "description": "Attacco potente che confonde chi lo usa nel turno successivo."
  },
  "zuffa": {
    "name": "Zuffa",
    "type": "Lotta",
    "category": "Fisico",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": "Una zuffa fortissima ma che lascia esausti."
  },
  "ipervoce": {
    "name": "Ipervoce",
    "type": "Normale",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un'onda sonora fortissima."
  },
  "ondaboato": {
    "name": "Ondaboato",
    "type": "Normale",
    "category": "Speciale",
    "power": 140,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "recharge"
    },
    "description": "Un'onda d'urto fortissima: il turno successivo occorre ricaricare."
  },
  "ripicca": {
    "name": "Ripicca",
    "type": "Buio",
    "category": "Fisico",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 1,
    "effect": null,
    "description": "Colpisce con priorità aumentata dopo un torto subito."
  },
  "difesaferrea": {
    "name": "Difesaferrea",
    "type": "Acciaio",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "defense",
      "stages": 2,
      "chance": 100
    },
    "description": "Irrigidisce il corpo, aumentando molto la Difesa."
  },
  "battuta": {
    "name": "Battuta",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 45,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "double_hit_boost"
    },
    "description": "colpisce due volte, la seconda in levare. Se il primo colpo va a segno, il secondo ha potenza raddoppiata."
  },
  "vigorcolpo": {
    "name": "Vigorcolpo",
    "type": "Lotta",
    "category": "Fisico",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un colpo pieno di vigore."
  },
  "metaltestata": {
    "name": "Metaltestata",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Una testata metallica pesante."
  },
  "rafforzatore": {
    "name": "Rafforzatore",
    "type": "Lotta",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "attack",
      "stages": 1,
      "chance": 100
    },
    "description": "Rafforza il corpo, aumentando l'Attacco."
  },
  "ponteggio": {
    "name": "Ponteggio",
    "type": "Acciaio",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "ponteggio"
    },
    "description": "monta un'impalcatura sul proprio lato del campo: per cinque turni la squadra subisce meno danni dalle mosse fisiche."
  },
  "martelcolpo": {
    "name": "Martelcolpo",
    "type": "Lotta",
    "category": "Fisico",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un colpo pesante e potente."
  },
  "incrocolpo": {
    "name": "Incrocolpo",
    "type": "Lotta",
    "category": "Fisico",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": "Colpo incrociato molto potente."
  },
  "nitrocarica": {
    "name": "Nitrocarica",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "speed",
      "stages": 1,
      "chance": 100
    },
    "description": "Una carica di fuoco che aumenta anche la propria Velocità."
  },
  "pestone": {
    "name": "Pestone",
    "type": "Normale",
    "category": "Fisico",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "Un pestone che può far tentennare."
  },
  "ruotafuoco": {
    "name": "Ruotafuoco",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "brn",
      "chance": 10
    },
    "description": "Una ruota di fuoco che può scottare."
  },
  "lanciafiamme": {
    "name": "Lanciafiamme",
    "type": "Fuoco",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "brn",
      "chance": 10
    },
    "description": "Fiamme intense che possono scottare."
  },
  "fuococarica": {
    "name": "Fuococarica",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "recoil",
      "ratio": 0.33
    },
    "description": "è la corsa a rotta di collo che anticipa la festa: potentissima, ma il contraccolpo lo ferisce."
  },
  "chicco_doro": {
    "name": "Chicco d'Oro",
    "type": "Erba",
    "category": "Fisico",
    "power": 55,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "triple_hit_spread"
    },
    "description": "lancia in sequenza tre chicchi di mais induriti, ciascuno dei quali può colpire un bersaglio diverso in doppio o in squadra — un piccolo tiro a raffica vegetale."
  },
  "ghiannata": {
    "name": "Ghiannata",
    "type": "Erba",
    "category": "Fisico",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "ghiannata"
    },
    "description": "è la sua mossa esclusiva, appresa all'evoluzione: una gragnuola di ghiande dure come legno che"
  },
  "fangobomba": {
    "name": "Fangobomba",
    "type": "Terra",
    "category": "Speciale",
    "power": 65,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "psn",
      "chance": 30
    },
    "description": "Una bomba di fango che può avvelenare."
  },
  "radicamento": {
    "name": "Radicamento",
    "type": "Erba",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "radicamento"
    },
    "description": "Mette radici, curando PS ogni turno ma impedendo la fuga."
  },
  "mazzuolegno": {
    "name": "Mazzuolegno",
    "type": "Erba",
    "category": "Fisico",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un colpo di legno pesantissimo."
  },
  "gigassorbimento": {
    "name": "Gigassorbimento",
    "type": "Erba",
    "category": "Speciale",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "drain",
      "ratio": 0.75
    },
    "description": "Assorbe gran parte del danno inflitto come cura."
  },
  "colpocoda": {
    "name": "Colpocoda",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "defense",
      "stages": -1,
      "chance": 100
    },
    "description": "Un colpo di coda che abbassa la Difesa avversaria."
  },
  "sgomento": {
    "name": "Sgomento",
    "type": "Spettro",
    "category": "Fisico",
    "power": 30,
    "accuracy": 100,
    "pp": 15,
    "priority": 1,
    "effect": null,
    "description": "Colpisce per primo con un grido spaventoso."
  },
  "ascolto": {
    "name": "Ascolto",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "heal_cure_ally"
    },
    "description": "cura confusione e metà dei PS di un alleato."
  },
  "ombra_notturna": {
    "name": "Ombra Notturna",
    "type": "Spettro",
    "category": "Speciale",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un colpo di puro tipo Spettro, danno fisso pari al livello."
  },
  "partecipazione": {
    "name": "Partecipazione",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "partecipazione"
    },
    "description": "prolunga di un turno l'ultima mossa di stato usata da un alleato."
  },
  "neropulsar": {
    "name": "Neropulsar",
    "type": "Buio",
    "category": "Speciale",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 20
    },
    "description": "Un'onda oscura che può far tentennare."
  },
  "staffetta": {
    "name": "Staffetta",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "baton_pass"
    },
    "description": "Passa il turno a un compagno mantenendo le modifiche alle statistiche."
  },
  "difesa_del_forestiero": {
    "name": "Difesa del Forestiero",
    "type": "Lotta",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "difesa_del_forestiero"
    },
    "description": "intercetta la mossa diretta al membro della squadra con meno PS e ne riduce il danno del 75%."
  },
  "calmamente": {
    "name": "Calmamente",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "spDefense",
      "stages": 1,
      "chance": 100
    },
    "description": "Si calma, aumentando la propria Difesa Speciale."
  },
  "convito_degli_antichi": {
    "name": "Convito degli Antichi",
    "type": "Spettro",
    "category": "Speciale",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": "Un attacco spettrale devastante ma impreciso."
  },
  "ululato_di_guerra": {
    "name": "Ululato di guerra",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "attack",
      "stages": 1,
      "chance": 100
    },
    "description": "Un grido di battaglia che aumenta l'Attacco."
  },
  "grugnito": {
    "name": "Grugnito",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "grugnito"
    },
    "description": "abbassa di uno stadio la Velocità di tutti gli avversari, senza infliggere danno — è il richiamo che ferma il branco prima della carica."
  },
  "rincorsa": {
    "name": "Rincorsa",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Una rincorsa che precede il colpo."
  },
  "comparanza": {
    "name": "Comparanza",
    "type": "Lotta",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "comparanza"
    },
    "description": "aumenta Attacco e Difesa di chi la usa e, nelle lotte in doppio, anche dell'alleato."
  },
  "sei_piatti": {
    "name": "Sei Piatti",
    "type": "Normale",
    "category": "Fisico",
    "power": 25,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "sei_piatti"
    },
    "description": "è la sua mossa esclusiva: colpisce"
  },
  "ultrattacco": {
    "name": "Ultrattacco",
    "type": "Normale",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un colpo violento e diretto."
  },
  "fintofinale": {
    "name": "Fintofinale",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "defense",
      "stages": -2,
      "chance": 100
    },
    "description": "Un'esibizione plateale che abbassa molto la Difesa avversaria."
  },
  "rintocco": {
    "name": "Rintocco",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": null,
    "description": "Un rintocco sonoro e diretto."
  },
  "guscio_chiuso": {
    "name": "Guscio Chiuso",
    "type": "Acqua",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "guscio_chiuso"
    },
    "description": "per un turno la conchiglia si serra completamente, aumentando di due stadi la Difesa e la Difesa Speciale, ma impedendo qualunque altra azione nello stesso turno."
  },
  "disarma": {
    "name": "Disarma",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "attack",
      "stages": -1,
      "chance": 100
    },
    "description": "Fa abbassare la guardia, riducendo l'Attacco avversario."
  },
  "idropompa_a_salve": {
    "name": "Idropompa a Salve",
    "type": "Acqua",
    "category": "Speciale",
    "power": 25,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "idropompa_a_salve"
    },
    "description": "Getti d'acqua a bassa potenza, versione depotenziata dell'Idropompa (mossa di Cozzetta)."
  },
  "vocedincanto": {
    "name": "Vocedincanto",
    "type": "Folletto",
    "category": "Speciale",
    "power": 40,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un canto incantato."
  },
  "favorino": {
    "name": "Favorino",
    "type": "Folletto",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "favorino"
    },
    "description": "è la sua mossa esclusiva: il bersaglio viene fatto"
  },
  "desiderio": {
    "name": "Desiderio",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "wish"
    },
    "description": "Cura PS al Pokémon in campo nel turno successivo."
  },
  "forzaluna": {
    "name": "Forzaluna",
    "type": "Folletto",
    "category": "Speciale",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un raggio di luce lunare."
  },
  "idropompa": {
    "name": "Idropompa",
    "type": "Acqua",
    "category": "Speciale",
    "power": 110,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": "Un potente getto d'acqua ad alta pressione."
  },
  "diceria": {
    "name": "Diceria",
    "type": "Buio",
    "category": "Speciale",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "diceria"
    },
    "description": "il danno aumenta del 50% per ogni volta che è già stata usata nella stessa lotta."
  },
  "neroshock": {
    "name": "Neroshock",
    "type": "Buio",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "Uno shock oscuro che può far tentennare."
  },
  "notteguaio": {
    "name": "Notteguaio",
    "type": "Buio",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un attacco oscuro e diretto."
  },
  "arringa": {
    "name": "Arringa",
    "type": "Psico",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "disable_like"
    },
    "description": "infligge danno e per tre turni impedisce al bersaglio di usare la stessa mossa due volte di seguito (come Tormento) — nessuno può ripetere la stessa obiezione davanti a Forox."
  },
  "confusione": {
    "name": "Confusione",
    "type": "Psico",
    "category": "Speciale",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "confuse_chance"
    },
    "description": "Un'onda psichica che può confondere il bersaglio."
  },
  "fermosguardo": {
    "name": "Fermosguardo",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "speed",
      "stages": -1,
      "chance": 100
    },
    "description": "Uno sguardo fermo che abbassa la Velocità avversaria."
  },
  "boato": {
    "name": "Boato",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "roar"
    },
    "description": "Costringe il bersaglio a essere sostituito."
  },
  "psicoraggio": {
    "name": "Psicoraggio",
    "type": "Psico",
    "category": "Speciale",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un raggio di energia psichica."
  },
  "riflesso": {
    "name": "Riflesso",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "defense",
      "stages": 1,
      "chance": 100
    },
    "description": "Crea un'immagine riflessa che aumenta la Difesa."
  },
  "comete": {
    "name": "Comete",
    "type": "Normale",
    "category": "Speciale",
    "power": 60,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Una pioggia di piccole comete."
  },
  "ipnosi": {
    "name": "Ipnosi",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": 60,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "slp",
      "chance": 100
    },
    "description": "Ipnotizza il bersaglio, addormentandolo."
  },
  "terrforza": {
    "name": "Terrforza",
    "type": "Terra",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un'esplosione di energia della terra."
  },
  "psichico": {
    "name": "Psichico",
    "type": "Psico",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "spDefense",
      "stages": -1,
      "chance": 10
    },
    "description": "Un forte attacco psichico."
  },
  "sgranocchio": {
    "name": "Sgranocchio",
    "type": "Buio",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "defense",
      "stages": -1,
      "chance": 20
    },
    "description": "Un morso che può abbassare la Difesa avversaria."
  },
  "divinazione": {
    "name": "Divinazione",
    "type": "Psico",
    "category": "Speciale",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un attacco psichico potente e preciso."
  },
  "incantavoce": {
    "name": "Incantavoce",
    "type": "Folletto",
    "category": "Speciale",
    "power": 40,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un canto incantato che colpisce con energia magica."
  },
  "girandola": {
    "name": "Girandola",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "girandola"
    },
    "description": "gira su sé stesso sparando scintille — infligge danno, aumenta la Velocità di chi la usa e nelle lotte in doppio colpisce entrambi gli avversari."
  },
  "sabbiattacco": {
    "name": "Sabbiattacco",
    "type": "Terra",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "accuracy",
      "stages": -1,
      "chance": 100
    },
    "description": "Sabbia negli occhi che abbassa la precisione avversaria."
  },
  "chiusascatto": {
    "name": "Chiusascatto",
    "type": "Terra",
    "category": "Fisico",
    "power": 65,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "è la sua mossa esclusiva: si chiude di colpo sul bersaglio come una tagliola d'alluminio, con il 30% di probabilità di farlo tentennare. Il terrore delle dita di ogni estate."
  },
  "colpodifango": {
    "name": "Colpodifango",
    "type": "Terra",
    "category": "Speciale",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "accuracy",
      "stages": -1,
      "chance": 100
    },
    "description": "Fango che può abbassare la precisione avversaria."
  },
  "fossa": {
    "name": "Fossa",
    "type": "Terra",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Colpisce da un buco nel terreno."
  },
  "tuonoshock": {
    "name": "Tuonoshock",
    "type": "Elettro",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 10
    },
    "description": "Una scarica elettrica che può paralizzare."
  },
  "passaggio": {
    "name": "Passaggio",
    "type": "Elettro",
    "category": "Speciale",
    "power": 70,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Una scossa elettrica ad ampio raggio."
  },
  "ondacarica": {
    "name": "Ondacarica",
    "type": "Elettro",
    "category": "Speciale",
    "power": 50,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 10
    },
    "description": "Un'onda elettrica che può paralizzare."
  },
  "battutina": {
    "name": "Battutina",
    "type": "Buio",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "spDefense",
      "stages": -1,
      "chance": 100
    },
    "description": "Una battuta pungente che abbassa la Difesa Speciale avversaria."
  },
  "tuonopugno": {
    "name": "Tuonopugno",
    "type": "Elettro",
    "category": "Fisico",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 10
    },
    "description": "Un pugno elettrico che può paralizzare."
  },
  "fulmine": {
    "name": "Fulmine",
    "type": "Elettro",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 10
    },
    "description": "Una scarica elettrica che può paralizzare."
  },
  "dropbeat": {
    "name": "Dropbeat",
    "type": "Elettro",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "dropbeat"
    },
    "description": "è la sua mossa esclusiva: una mossa sonora che"
  },
  "notteprofonda": {
    "name": "Notteprofonda",
    "type": "Buio",
    "category": "Speciale",
    "power": 85,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un attacco oscuro potente."
  },
  "fuocofatuo": {
    "name": "Fuocofatuo",
    "type": "Fuoco",
    "category": "Stato",
    "power": 0,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": ""
  },
  "incanto": {
    "name": "Incanto",
    "type": "Folletto",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": ""
  },
  "fora_fora": {
    "name": "Fòra Fòra",
    "type": "Folletto",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "è la sua mossa esclusiva, il grido vero della processione: una mossa"
  },
  "fiammata": {
    "name": "Fiammata",
    "type": "Fuoco",
    "category": "Speciale",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": ""
  },
  "vampata": {
    "name": "Vampata",
    "type": "Fuoco",
    "category": "Speciale",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": ""
  },
  "flagello": {
    "name": "Flagello",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "flagello"
    },
    "description": "è la sua mossa esclusiva: la potenza"
  },
  "attacco_rapido": {
    "name": "Attacco Rapido",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": null,
    "description": "Colpisce per primo quasi sempre."
  },
  "metalartiglio": {
    "name": "Metalartiglio",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 50,
    "accuracy": 95,
    "pp": 35,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "attack",
      "stages": 1,
      "chance": 10
    },
    "description": "Artigli d'acciaio che possono aumentare l'Attacco."
  },
  "ombraferoce": {
    "name": "Ombraferoce",
    "type": "Spettro",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un attacco spettrale feroce."
  },
  "testataferro": {
    "name": "Testataferro",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Una testata metallica pesante."
  },
  "contatore": {
    "name": "Contatore",
    "type": "Lotta",
    "category": "Fisico",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -5,
    "effect": {
      "kind": "custom",
      "id": "counter"
    },
    "description": "Restituisce il doppio del danno fisico subito nel turno."
  },
  "ferrotestata": {
    "name": "Ferrotestata",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 100,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "Una testata d'acciaio che può far tentennare."
  },
  "marea_rossa": {
    "name": "Marea Rossa",
    "type": "Veleno",
    "category": "Speciale",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "marea_rossa"
    },
    "description": "infligge danno Veleno e ha probabilità aumentata di avvelenare il bersaglio, con più chance di successo quanto più PS mancano a Mucillax — colpisce peggio quando è \"più concentrato\"."
  },
  "attacco_fanghiglia": {
    "name": "Attacco Fanghiglia",
    "type": "Acqua",
    "category": "Speciale",
    "power": 55,
    "accuracy": 95,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 30
    },
    "description": "Fango lanciato con forza che può paralizzare."
  },
  "disgusto": {
    "name": "Disgusto",
    "type": "Veleno",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "psn",
      "chance": 100
    },
    "description": "Provoca disgusto e avvelena il bersaglio."
  },
  "tossina": {
    "name": "Tossina",
    "type": "Veleno",
    "category": "Stato",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "psn",
      "chance": 90
    },
    "description": "Un veleno che si aggrava turno dopo turno."
  },
  "palude": {
    "name": "Palude",
    "type": "Terra",
    "category": "Speciale",
    "power": 90,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un'onda di fango e melma."
  },
  "bomba_fango": {
    "name": "Bomba Fango",
    "type": "Veleno",
    "category": "Speciale",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Una palla di fango scagliata con forza."
  },
  "morso": {
    "name": "Morso",
    "type": "Buio",
    "category": "Fisico",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "Un morso che può far tentennare."
  },
  "velenodenti": {
    "name": "Velenodenti",
    "type": "Veleno",
    "category": "Fisico",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "psn",
      "chance": 30
    },
    "description": "Un morso velenoso che può avvelenare."
  },
  "attaccalite": {
    "name": "Attaccalite",
    "type": "Buio",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "defense",
      "stages": -1,
      "chance": 100
    },
    "description": "Un attacco verbale che abbassa la Difesa avversaria."
  },
  "garanzia": {
    "name": "Garanzia",
    "type": "Buio",
    "category": "Fisico",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un colpo secco e sicuro."
  },
  "velenoshock": {
    "name": "Velenoshock",
    "type": "Veleno",
    "category": "Speciale",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "psn",
      "chance": 30
    },
    "description": "Uno shock velenoso che può avvelenare."
  },
  "black_mamba": {
    "name": "Black Mamba",
    "type": "Veleno",
    "category": "Speciale",
    "power": 120,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "black_mamba"
    },
    "description": "spara ettolitri di banconote cosparse di veleno neurotossico. Avvelena sempre gravemente il bersaglio e ha il 30% di probabilità di paralizzarlo; dopo l'uso, l'Attacco Speciale di Notaiax scende di uno stadio — le banconote, in fondo, sono finite addosso a qualcun altro."
  },
  "ombra_fresca": {
    "name": "Ombra Fresca",
    "type": "Terra",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "ombra_fresca"
    },
    "description": "è la sua mossa esclusiva: apre la cupola e crea per cinque turni una zona d'ombra sul lato alleato — i danni delle mosse speciali sono ridotti di un terzo e"
  },
  "terrempesta": {
    "name": "Terrempesta",
    "type": "Roccia",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "defense",
      "stages": -1,
      "chance": 100
    },
    "description": "Una tempesta di terra che abbassa la Difesa avversaria."
  },
  "geoforza": {
    "name": "Geoforza",
    "type": "Terra",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Energia della terra scatenata in un'esplosione."
  },
  "assorbi": {
    "name": "Assorbi",
    "type": "Erba",
    "category": "Speciale",
    "power": 20,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": {
      "kind": "drain",
      "ratio": 0.5
    },
    "description": "Assorbe metà del danno inflitto come cura."
  },
  "codaditalco": {
    "name": "Codaditalco",
    "type": "Normale",
    "category": "Fisico",
    "power": 18,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": null,
    "description": "Colpo di coda ripetuto."
  },
  "colonia": {
    "name": "Colonia",
    "type": "Erba",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "colonia"
    },
    "description": "per due turni aumenta la Difesa Speciale di tutti gli altri Pef'na presenti in squadra, come se il gruppo si stringesse per proteggersi a vicenda."
  },
  "stordiscappo": {
    "name": "Stordiscappo",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "roar"
    },
    "description": "Costringe il bersaglio a essere sostituito."
  },
  "rafficlorofilla": {
    "name": "Rafficlorofilla",
    "type": "Erba",
    "category": "Speciale",
    "power": 55,
    "accuracy": 95,
    "pp": 25,
    "priority": 0,
    "effect": null,
    "description": "Una raffica di energia clorofilliana."
  },
  "beccata": {
    "name": "Beccata",
    "type": "Volante",
    "category": "Fisico",
    "power": 35,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": null,
    "description": "Colpisce con il becco."
  },
  "stridio": {
    "name": "Stridio",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 85,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "defense",
      "stages": -2,
      "chance": 100
    },
    "description": "Uno stridio acuto che abbassa molto la Difesa avversaria."
  },
  "attacco_dala": {
    "name": "Attacco d'Ala",
    "type": "Volante",
    "category": "Fisico",
    "power": 60,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": null,
    "description": "Colpisce con le ali spiegate."
  },
  "provocazione": {
    "name": "Provocazione",
    "type": "Buio",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "taunt"
    },
    "description": "Provoca il bersaglio impedendogli di usare mosse di stato per alcuni turni."
  },
  "gloglottio": {
    "name": "Gloglottio",
    "type": "Normale",
    "category": "Speciale",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "confuse_chance"
    },
    "description": "è la sua mossa esclusiva: una raffica sonora di borbottii gorgoglianti e visibilmente offesi che può"
  },
  "facciata": {
    "name": "Facciata",
    "type": "Normale",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un attacco diretto e onesto."
  },
  "aeroassalto": {
    "name": "Aeroassalto",
    "type": "Volante",
    "category": "Fisico",
    "power": 60,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Assalto dall'alto in picchiata."
  },
  "baldeali": {
    "name": "Baldeali",
    "type": "Volante",
    "category": "Fisico",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Colpisce con potenza dopo un balzo aereo."
  },
  "turbosabbia": {
    "name": "Turbosabbia",
    "type": "Terra",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "defense",
      "stages": -1,
      "chance": 100
    },
    "description": "Sabbia scagliata con forza che abbassa la Difesa avversaria."
  },
  "sassata": {
    "name": "Sassata",
    "type": "Roccia",
    "category": "Fisico",
    "power": 50,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Un sasso scagliato con forza."
  },
  "attaccorapido": {
    "name": "Attaccorapido",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": null,
    "description": "Colpisce per primo quasi sempre."
  },
  "abbattimento": {
    "name": "Abbattimento",
    "type": "Roccia",
    "category": "Fisico",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": null,
    "description": "Colpo di roccia scagliato dall'alto."
  },
  "lucidatura": {
    "name": "Lucidatura",
    "type": "Roccia",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "defense",
      "stages": 1,
      "chance": 100
    },
    "description": "Lucida la superficie, aumentando la Difesa."
  },
  "resistenza": {
    "name": "Resistenza",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "defense",
      "stages": 1,
      "chance": 100
    },
    "description": "Aumenta la resistenza fisica."
  },
  "pietrataglio": {
    "name": "Pietrataglio",
    "type": "Roccia",
    "category": "Fisico",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 10
    },
    "description": "Una lama di roccia che può far tentennare."
  },
  "fangosberla": {
    "name": "Fangosberla",
    "type": "Terra",
    "category": "Speciale",
    "power": 20,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "accuracy",
      "stages": -1,
      "chance": 100
    },
    "description": "Uno schizzo di fango che abbassa sempre la precisione avversaria."
  },
  "velenospina": {
    "name": "Velenospina",
    "type": "Veleno",
    "category": "Fisico",
    "power": 15,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "psn",
      "chance": 30
    },
    "description": "Spine velenose che possono avvelenare."
  },
  "fanghiglia": {
    "name": "Fanghiglia",
    "type": "Acqua",
    "category": "Speciale",
    "power": 90,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "accuracy",
      "stages": -1,
      "chance": 30
    },
    "description": "Fanghiglia che può abbassare la precisione avversaria."
  },
  "velenpuntura": {
    "name": "Velenpuntura",
    "type": "Veleno",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "psn",
      "chance": 20
    },
    "description": "Una puntura velenosa che può avvelenare."
  },
  "teletrasporto": {
    "name": "Teletrasporto",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "flee"
    },
    "description": "Permette di fuggire immediatamente dalla lotta."
  },
  "cosmoforza": {
    "name": "Cosmoforza",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "defense",
      "stages": 1,
      "chance": 100
    },
    "description": "Attinge energia cosmica, aumentando Difesa e Difesa Speciale."
  },
  "involucro": {
    "name": "Involucro",
    "type": "Coleot",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "involucro"
    },
    "description": "si richiude nel bozzolo scuro: aumenta di molto Difesa e Difesa Speciale e cura i problemi di stato, ma nel turno successivo non può agire."
  },
  "ronzio": {
    "name": "Ronzio",
    "type": "Coleot",
    "category": "Speciale",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "spDefense",
      "stages": -1,
      "chance": 10
    },
    "description": "Un ronzio che può abbassare la Difesa Speciale."
  },
  "barriera": {
    "name": "Barriera",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "defense",
      "stages": 2,
      "chance": 100
    },
    "description": "Crea una barriera che aumenta di molto la Difesa."
  },
  "sfocatura": {
    "name": "Sfocatura",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "sfocatura"
    },
    "description": "aumenta di molto l'elusione; ogni volta che schiva un attacco, la mossa successiva dell'avversario perde precisione."
  },
  "tornata": {
    "name": "Tornata",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 30,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "attack",
      "stages": 1,
      "chance": 30
    },
    "description": "Un colpo d'acciaio che può aumentare l'Attacco."
  },
  "danzaspada": {
    "name": "Danzaspada",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 20,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "attack",
      "stages": 2,
      "chance": 100
    },
    "description": "Una danza di guerra che aumenta molto l'Attacco."
  },
  "doppiocolpo": {
    "name": "Doppiocolpo",
    "type": "Normale",
    "category": "Fisico",
    "power": 35,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "multi",
      "min": 2,
      "max": 2
    },
    "description": "Colpisce due volte in rapida successione."
  },
  "fischio_lungo": {
    "name": "Fischio Lungo",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 5,
    "priority": 4,
    "effect": {
      "kind": "custom",
      "id": "fischio_lungo"
    },
    "description": "è la sua mossa esclusiva: una mossa sonora ad alta priorità che protegge la squadra per un turno —"
  },
  "guardia_ampia": {
    "name": "Guardia Ampia",
    "type": "Roccia",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "protect"
    },
    "description": "Protegge la squadra dalle mosse ad area per un turno."
  },
  "turbine": {
    "name": "Turbine",
    "type": "Volante",
    "category": "Speciale",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Un vortice d'aria che colpisce il bersaglio."
  },
  "vento_di_bandiera": {
    "name": "Vento di Bandiera",
    "type": "Volante",
    "category": "Fisico",
    "power": 90,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "vento_di_bandiera"
    },
    "description": "è la mossa caratteristica della specie: il drappo aperto colpisce di taglio e può far indietreggiare l'avversario."
  },
  "posto_fisso": {
    "name": "Posto Fisso",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "posto_fisso"
    },
    "description": "è la sua mossa esclusiva: aumenta di un livello Difesa e Difesa Speciale, ma da quel momento Sciarpone"
  },
  "battipiedi": {
    "name": "Battipiedi",
    "type": "Terra",
    "category": "Fisico",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Colpo pesante sferrato con i piedi."
  },
  "pugno_di_scoglio": {
    "name": "Pugno di Scoglio",
    "type": "Roccia",
    "category": "Fisico",
    "power": 85,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "infligge danno fisico e ha probabilità aumentata di infliggere Timore, facendo scattare indietro l'avversario per un turno."
  },
  "fortezza": {
    "name": "Fortezza",
    "type": "Acciaio",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 40,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "self",
      "stat": "defense",
      "stages": 2,
      "chance": 100
    },
    "description": "Si fortifica, aumentando molto la Difesa."
  },
  "braccio_martello": {
    "name": "Braccio Martello",
    "type": "Lotta",
    "category": "Fisico",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un colpo pesantissimo sferrato con il braccio."
  },
  "colpo_vitale": {
    "name": "Colpo Vitale",
    "type": "Normale",
    "category": "Fisico",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": null,
    "description": "Colpisce nei punti vitali."
  },
  "bordata": {
    "name": "Bordata",
    "type": "Roccia",
    "category": "Fisico",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": "Colpo di roccia che lascia il bersaglio scoperto."
  },
  "fendente": {
    "name": "Fendente",
    "type": "Normale",
    "category": "Fisico",
    "power": 50,
    "accuracy": 95,
    "pp": 30,
    "priority": 0,
    "effect": null,
    "description": "Un taglio netto e preciso."
  },
  "sconfinata": {
    "name": "Sconfinata",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "sconfinata"
    },
    "description": "agisce per prima se nel turno precedente il bersaglio ha usato una mossa di stato."
  },
  "superpotere": {
    "name": "Superpotere",
    "type": "Lotta",
    "category": "Fisico",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "superpower"
    },
    "description": "Un colpo fortissimo che abbassa Attacco e Difesa di chi lo usa."
  },
  "fissita": {
    "name": "Fissità",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": {
      "kind": "status",
      "status": "par",
      "chance": 100
    },
    "description": "Immobilizza il bersaglio, paralizzandolo."
  },
  "sabbiotomba": {
    "name": "Sabbiotomba",
    "type": "Terra",
    "category": "Fisico",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "sabbiotomba"
    },
    "description": "Intrappola il bersaglio in un vortice di sabbia che infligge danno nei turni successivi."
  },
  "colpo_sordo": {
    "name": "Colpo Sordo",
    "type": "Veleno",
    "category": "Fisico",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 3,
    "effect": {
      "kind": "custom",
      "id": "colpo_sordo"
    },
    "description": "agisce sempre per prima; se il bersaglio non ha ancora agito nel turno, lo avvelena gravemente."
  },
  "ghigliottina": {
    "name": "Ghigliottina",
    "type": "Normale",
    "category": "Fisico",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "oh_ko"
    },
    "description": "Mette KO il bersaglio in un solo colpo se va a segno."
  },
  "doppiasberla": {
    "name": "Doppiasberla",
    "type": "Normale",
    "category": "Fisico",
    "power": 15,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "multi",
      "min": 2,
      "max": 2
    },
    "description": "Colpisce due volte in rapida successione."
  },
  "iperfuria": {
    "name": "Iperfuria",
    "type": "Normale",
    "category": "Fisico",
    "power": 15,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "multi",
      "min": 2,
      "max": 2
    },
    "description": "Colpisce furiosamente due volte."
  },
  "russare": {
    "name": "Russare",
    "type": "Normale",
    "category": "Speciale",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "flinch",
      "chance": 30
    },
    "description": "Un attacco sonoro usabile solo dormendo, che può far tentennare."
  },
  "differita": {
    "name": "Differita",
    "type": "Normale",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": -6,
    "effect": {
      "kind": "custom",
      "id": "differita"
    },
    "description": "è la sua mossa esclusiva: agisce"
  },
  "legapaglia": {
    "name": "Legapaglia",
    "type": "Erba",
    "category": "Speciale",
    "power": 65,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "drain",
      "ratio": 0.5
    },
    "description": "Paglia che assorbe metà del danno inflitto come cura."
  },
  "falcifoglia": {
    "name": "Falcifoglia",
    "type": "Erba",
    "category": "Speciale",
    "power": 75,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Foglie affilate come lame."
  },
  "smistamento": {
    "name": "Smistamento",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "smistamento"
    },
    "description": "rimanda in squadra il Pokémon bersaglio e lo sostituisce con un compagno scelto da chi la usa — non a caso, come Boato: è Traffichiex a decidere chi entra. Fallisce se il bersaglio è l'ultimo Pokémon in grado di lottare."
  },
  "cambiagiro": {
    "name": "Cambiagiro",
    "type": "Coleot",
    "category": "Fisico",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Attacco veloce e diretto."
  },
  "solarraggio": {
    "name": "Solarraggio",
    "type": "Erba",
    "category": "Speciale",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Accumula luce solare e colpisce con un raggio potentissimo."
  },
  "assorbicorno": {
    "name": "Assorbicorno",
    "type": "Erba",
    "category": "Fisico",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "drain",
      "ratio": 0.5
    },
    "description": "Colpisce con le corna assorbendo metà del danno."
  },
  "ferrartigli": {
    "name": "Ferrartigli",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 50,
    "accuracy": 95,
    "pp": 35,
    "priority": 0,
    "effect": {
      "kind": "stat",
      "target": "enemy",
      "stat": "defense",
      "stages": -1,
      "chance": 10
    },
    "description": "Artigli d'acciaio che possono abbassare la Difesa."
  },
  "battiterra": {
    "name": "Battiterra",
    "type": "Terra",
    "category": "Fisico",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": null,
    "description": "Colpisce il terreno per colpire il bersaglio."
  },
  "raddrizzafogna": {
    "name": "Raddrizzafogna",
    "type": "Terra",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "raddrizzafogna"
    },
    "description": "elimina trappole e campi avversi dal proprio lato."
  },
  "solo_piombo": {
    "name": "Solo Piombo",
    "type": "Acciaio",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "solo_piombo"
    },
    "description": "respinge chi attacca a contatto."
  },
  "ruspa": {
    "name": "Ruspa",
    "type": "Terra",
    "category": "Fisico",
    "power": 90,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "Un colpo che smuove la terra."
  },
  "dialettica_critica": {
    "name": "Dialettica Critica",
    "type": "Psico",
    "category": "Stato",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "clear_stats_field"
    },
    "description": "annulla modifiche alle statistiche e campi ideologici."
  },
  "filiera_corta": {
    "name": "Filiera Corta",
    "type": "Normale",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "filiera_corta"
    },
    "description": "crea una razione casuale che cura un alleato."
  },
  "armageddon": {
    "name": "Armageddon",
    "type": "Buio",
    "category": "Speciale",
    "power": 200,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "recharge"
    },
    "description": "Attacco Buio devastante: il turno successivo occorre ricaricare."
  },
  "terrasanta": {
    "name": "Terrasanta",
    "type": "Erba",
    "category": "Stato",
    "power": 0,
    "accuracy": null,
    "pp": 5,
    "priority": 0,
    "effect": {
      "kind": "custom",
      "id": "terrasanta"
    },
    "description": "per cinque turni, nessun Pokémon in campo può usare mosse di tipo Terra."
  },
  "scia_di_braci": {
    "name": "Scia di Braci",
    "type": "Fuoco",
    "category": "Fisico",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": null,
    "description": "è la sua mossa esclusiva: travolge il bersaglio in corsa e"
  },
  "verdebufera": {
    "name": "Verdebufera",
    "type": "Erba",
    "category": "Speciale",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": null,
    "description": ""
  }
};
  if (typeof window !== 'undefined') window.PokemonAscoliMoves = api;
  if (typeof module !== 'undefined') module.exports = api;
}());
