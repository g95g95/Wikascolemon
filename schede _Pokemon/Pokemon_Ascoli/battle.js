(function () {
  'use strict';

  // Modulo puro: nessun DOM, nessun Math.random() diretto (rng iniettabile, default Math.random).

  let injectedSpecies = null;
  let injectedMoves = null;

  function configure(catalogs) {
    if (!catalogs) return;
    if (catalogs.species) injectedSpecies = catalogs.species;
    if (catalogs.moves) injectedMoves = catalogs.moves;
  }

  function speciesCatalog() {
    return injectedSpecies || (typeof window !== 'undefined' && window.PokemonAscoliSpecies) || {};
  }

  function movesCatalog() {
    return injectedMoves || (typeof window !== 'undefined' && window.PokemonAscoliMoves) || {};
  }

  function rand(rng) {
    return (rng || Math.random)();
  }

  // --- Tabella tipi Gen 6+ completa (18 tipi, nomi italiani) ---
  const typeChart = {
    Normale: { Roccia: 0.5, Spettro: 0, Acciaio: 0.5 },
    Fuoco: { Fuoco: 0.5, Acqua: 0.5, Erba: 2, Ghiaccio: 2, Coleottero: 2, Roccia: 0.5, Drago: 0.5, Acciaio: 2 },
    Acqua: { Fuoco: 2, Acqua: 0.5, Erba: 0.5, Terra: 2, Roccia: 2, Drago: 0.5 },
    Elettro: { Acqua: 2, Elettro: 0.5, Erba: 0.5, Terra: 0, Volante: 2, Drago: 0.5 },
    Erba: { Fuoco: 0.5, Acqua: 2, Erba: 0.5, Veleno: 0.5, Terra: 2, Volante: 0.5, Coleottero: 0.5, Roccia: 2, Drago: 0.5, Acciaio: 0.5 },
    Ghiaccio: { Fuoco: 0.5, Acqua: 0.5, Erba: 2, Ghiaccio: 0.5, Terra: 2, Volante: 2, Drago: 2, Acciaio: 0.5 },
    Lotta: { Normale: 2, Ghiaccio: 2, Veleno: 0.5, Volante: 0.5, Psico: 0.5, Coleottero: 0.5, Roccia: 2, Spettro: 0, Buio: 2, Acciaio: 2, Folletto: 0.5 },
    Veleno: { Erba: 2, Veleno: 0.5, Terra: 0.5, Roccia: 0.5, Spettro: 0.5, Acciaio: 0, Folletto: 2 },
    Terra: { Fuoco: 2, Elettro: 2, Erba: 0.5, Veleno: 2, Volante: 0, Coleottero: 0.5, Roccia: 2, Acciaio: 2 },
    Volante: { Elettro: 0.5, Erba: 2, Lotta: 2, Coleottero: 2, Roccia: 0.5, Acciaio: 0.5 },
    Psico: { Lotta: 2, Veleno: 2, Psico: 0.5, Buio: 0, Acciaio: 0.5 },
    Coleottero: { Fuoco: 0.5, Erba: 2, Lotta: 0.5, Veleno: 0.5, Volante: 0.5, Psico: 2, Spettro: 0.5, Buio: 2, Acciaio: 0.5, Folletto: 0.5 },
    Roccia: { Fuoco: 2, Ghiaccio: 2, Lotta: 0.5, Terra: 0.5, Volante: 2, Coleottero: 2, Acciaio: 0.5 },
    Spettro: { Normale: 0, Psico: 2, Spettro: 2, Buio: 0.5 },
    Drago: { Drago: 2, Acciaio: 0.5, Folletto: 0 },
    Buio: { Lotta: 0.5, Psico: 2, Spettro: 2, Buio: 0.5, Folletto: 0.5 },
    Acciaio: { Fuoco: 0.5, Acqua: 0.5, Elettro: 0.5, Ghiaccio: 2, Roccia: 2, Acciaio: 0.5, Folletto: 2 },
    Folletto: { Fuoco: 0.5, Lotta: 2, Veleno: 0.5, Drago: 2, Buio: 2, Acciaio: 0.5 }
  };

  function typeMultiplier(moveType, targetTypes) {
    return targetTypes.reduce((value, targetType) => value * ((typeChart[moveType] || {})[targetType] ?? 1), 1);
  }

  // --- Statistiche (formula attuale del gioco, senza IV/EV) ---
  function calculateStats(speciesId, level) {
    const species = speciesCatalog()[speciesId];
    const [hp, attack, defense, spAttack, spDefense, speed] = species.base;
    const scale = value => Math.floor((2 * value * level) / 100) + 5;
    return {
      hp: Math.floor((2 * hp * level) / 100) + level + 10,
      attack: scale(attack), defense: scale(defense), spAttack: scale(spAttack),
      spDefense: scale(spDefense), speed: scale(speed)
    };
  }

  function movesFor(speciesId, level) {
    const species = speciesCatalog()[speciesId];
    return species.learnset
      .filter(([learnLevel]) => learnLevel <= level)
      .map(([, moveId]) => moveId)
      .slice(-4);
  }

  function makeMoveSlot(moveId) {
    const known = movesCatalog()[moveId];
    const maxPp = known ? known.pp : 20;
    return { id: moveId, pp: maxPp, maxPp };
  }

  function createMonster(speciesId, level, options) {
    const opts = options || {};
    const stats = calculateStats(speciesId, level);
    const species = speciesCatalog()[speciesId];
    const moveIds = opts.moves && opts.moves.length ? opts.moves : movesFor(speciesId, level);
    const finalIds = moveIds.length ? moveIds : [species.learnset[0][1]];
    return {
      uid: `${speciesId}-${Date.now()}-${(rand(opts.rng)).toString(16).slice(2)}`,
      species: speciesId,
      level,
      exp: 0,
      hp: stats.hp,
      stats,
      moves: finalIds.map(makeMoveSlot),
      status: null,
      sleepTurns: 0
    };
  }

  function hydrateMonster(monster) {
    const species = speciesCatalog()[monster.species];
    if (!species) return monster;
    const stats = calculateStats(monster.species, monster.level);
    let moves;
    if (Array.isArray(monster.moves) && monster.moves.length && typeof monster.moves[0] === 'string') {
      moves = monster.moves.map(makeMoveSlot);
    } else if (Array.isArray(monster.moves) && monster.moves.length) {
      moves = monster.moves.map(slot => ({
        id: slot.id,
        pp: Number.isFinite(slot.pp) ? slot.pp : (movesCatalog()[slot.id] || {}).pp || 20,
        maxPp: slot.maxPp || (movesCatalog()[slot.id] || {}).pp || 20
      }));
    } else {
      moves = movesFor(monster.species, monster.level).map(makeMoveSlot);
    }
    return {
      ...monster,
      uid: monster.uid || `${monster.species}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      stats,
      hp: Math.min(Number.isFinite(monster.hp) ? monster.hp : stats.hp, stats.hp),
      moves,
      status: monster.status || null,
      sleepTurns: monster.sleepTurns || 0
    };
  }

  // --- Esperienza / livelli / evoluzione ---
  function expGain(defeated, options) {
    const opts = options || {};
    const species = speciesCatalog()[defeated.species];
    const participants = opts.participants || 1;
    const base = Math.floor((species.expYield * defeated.level / 7) / participants);
    return Math.floor(base * (opts.trainer ? 1.5 : 1));
  }

  function expToNext(monster) {
    // Curva "medio-veloce" (n^3) per tutti, per ora.
    return Math.pow(monster.level + 1, 3);
  }

  function currentExpFloor(monster) {
    return Math.pow(monster.level, 3);
  }

  function learnMove(monster, moveId, replaceIndex) {
    const slot = makeMoveSlot(moveId);
    if (replaceIndex === null || replaceIndex === undefined) {
      if (monster.moves.length < 4) {
        monster.moves.push(slot);
        return true;
      }
      return false;
    }
    if (replaceIndex >= 0 && replaceIndex < monster.moves.length) {
      monster.moves[replaceIndex] = slot;
      return true;
    }
    return false;
  }

  function gainExperience(monster, amount, ctx) {
    const context = ctx || {};
    monster.exp = (monster.exp || 0) + amount;
    let levelsGained = 0;
    const learned = [];
    let evolvedInto = null;
    while (monster.exp >= currentExpFloor({ level: monster.level + 1 })) {
      const oldMax = monster.stats.hp;
      monster.level += 1;
      levelsGained += 1;
      monster.stats = calculateStats(monster.species, monster.level);
      monster.hp += monster.stats.hp - oldMax;
      const species = speciesCatalog()[monster.species];
      const newMoves = species.learnset.filter(([lvl]) => lvl === monster.level).map(([, moveId]) => moveId);
      newMoves.forEach(moveId => {
        if (monster.moves.some(m => m.id === moveId)) return;
        if (monster.moves.length < 4) {
          monster.moves.push(makeMoveSlot(moveId));
        } else {
          learned.push(moveId);
        }
      });
      const evolution = species.evolution;
      if (evolution && evolution.level && monster.level >= evolution.level) {
        const locationOk = !evolution.location || (context.map === evolution.location);
        const itemOk = !evolution.item || (context.hasItem && context.hasItem(evolution.item));
        if (locationOk && itemOk) {
          monster.species = evolution.into;
          monster.stats = calculateStats(monster.species, monster.level);
          monster.hp = monster.stats.hp;
          evolvedInto = monster.species;
        }
      }
    }
    return { levelsGained, learned, evolvedInto };
  }

  // --- Ordine di turno ---
  function effectiveSpeed(monster, stages) {
    const mult = stageMultiplier(stages ? stages.speed : 0);
    const base = monster.stats.speed * mult;
    return monster.status === 'par' ? base / 2 : base;
  }

  function stageMultiplier(stage) {
    return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
  }

  function actionPriority(action) {
    if (!action || action.type !== 'move') return 0;
    const known = movesCatalog()[action.moveId];
    return known ? (known.priority || 0) : 0;
  }

  function turnOrder(a, actionA, b, actionB, rng) {
    const priorityA = actionPriority(actionA);
    const priorityB = actionPriority(actionB);
    if (priorityA !== priorityB) return priorityA > priorityB ? ['player', 'enemy'] : ['enemy', 'player'];
    const speedA = effectiveSpeed(a.monster, a.stages);
    const speedB = effectiveSpeed(b.monster, b.stages);
    if (speedA !== speedB) return speedA > speedB ? ['player', 'enemy'] : ['enemy', 'player'];
    return rand(rng) < 0.5 ? ['player', 'enemy'] : ['enemy', 'player'];
  }

  // --- Mossa struggle interna ---
  const STRUGGLE = { name: 'Lotta Disperata', type: 'Normale', category: 'Fisico', power: 50, accuracy: null, pp: 1, priority: 0, effect: { kind: 'recoil', ratio: 0.25 }, description: 'Colpo disperato quando non restano PP.' };

  function moveDef(moveId) {
    if (moveId === 'struggle') return STRUGGLE;
    return movesCatalog()[moveId];
  }

  // --- Esecuzione mossa ---
  function preMoveStatusCheck(attacker, attackerName, rng) {
    const events = [];
    if (attacker.flinched) {
      attacker.flinched = false;
      events.push({ type: 'text', text: `${attackerName} ha esitato e non può muoversi!` });
      return { canMove: false, events };
    }
    if (attacker.status === 'slp') {
      if (attacker.sleepTurns > 0) {
        attacker.sleepTurns -= 1;
        if (attacker.sleepTurns <= 0) {
          attacker.status = null;
          events.push({ type: 'text', text: `${attackerName} si è svegliato!` });
          return { canMove: true, events };
        }
        events.push({ type: 'text', text: `${attackerName} dorme profondamente.` });
        return { canMove: false, events };
      }
      attacker.status = null;
    }
    if (attacker.status === 'frz') {
      if (rand(rng) < 0.2) {
        attacker.status = null;
        events.push({ type: 'text', text: `${attackerName} si è scongelato!` });
      } else {
        events.push({ type: 'text', text: `${attackerName} è congelato e non può muoversi!` });
        return { canMove: false, events };
      }
    }
    if (attacker.status === 'par') {
      if (rand(rng) < 0.25) {
        events.push({ type: 'text', text: `${attackerName} è paralizzato e non riesce a muoversi!` });
        return { canMove: false, events };
      }
    }
    return { canMove: true, events };
  }

  function statusImmune(status, targetTypes) {
    if (status === 'psn' && (targetTypes.includes('Veleno') || targetTypes.includes('Acciaio'))) return true;
    if (status === 'brn' && targetTypes.includes('Fuoco')) return true;
    if (status === 'par' && targetTypes.includes('Elettro')) return true;
    if (status === 'frz' && targetTypes.includes('Ghiaccio')) return true;
    return false;
  }

  const statMessages = {
    up: (name, statName) => `${name} ${statName} è aumentato!`,
    upMax: (name) => `${name} non può aumentare ulteriormente!`,
    down: (name, statName) => `${name} ${statName} è diminuito!`,
    downMax: (name) => `${name} non può diminuire ulteriormente!`
  };

  const statNamesIt = {
    attack: 'Attacco', defense: 'Difesa', spAttack: 'Attacco Speciale',
    spDefense: 'Difesa Speciale', speed: 'Velocità', accuracy: 'Precisione'
  };

  const statusNamesIt = { psn: 'avvelenato', par: 'paralizzato', brn: 'scottato', slp: 'addormentato', frz: 'congelato' };

  function executeMove(attacker, defender, moveId, stagesA, stagesB, options) {
    const opts = options || {};
    const rng = opts.rng;
    const known = moveDef(moveId);
    const attackerSpecies = speciesCatalog()[attacker.species];
    const defenderSpecies = speciesCatalog()[defender.species];
    const attackerName = attackerSpecies.name;
    const defenderName = defenderSpecies.name;
    const events = [];

    const preCheck = preMoveStatusCheck(attacker, attackerName, rng);
    events.push(...preCheck.events);
    if (!preCheck.canMove) {
      return { events };
    }

    const slot = attacker.moves.find(m => m.id === moveId);
    if (slot && slot.pp > 0) slot.pp -= 1;

    events.push({ type: 'text', text: `${attackerName} usa ${known.name}!` });

    // precisione
    if (known.accuracy !== null) {
      const accuracyStageMult = stageMultiplier(stagesA.accuracy || 0);
      const evasionStageMult = stageMultiplier(stagesB.evasion || 0);
      const finalAccuracy = known.accuracy * accuracyStageMult / evasionStageMult;
      if (rand(rng) * 100 >= finalAccuracy) {
        events.push({ type: 'text', text: `${attackerName} ha fallito il colpo!` });
        return { events };
      }
    }

    const effect = known.effect;

    // mosse di stato pure (nessuna power)
    if (!known.power) {
      applyNonDamagingEffect(known, effect, attacker, defender, attackerName, defenderName, stagesA, stagesB, events, rng);
      return { events };
    }

    // mossa con danno (fisico/speciale), eventuali effetti secondari gestiti dopo
    const physical = known.category === 'Fisico';
    const attackStatKey = physical ? 'attack' : 'spAttack';
    const defenseStatKey = physical ? 'defense' : 'spDefense';

    const effectivenessMult = typeMultiplier(known.type, defenderSpecies.types);
    if (effectivenessMult === 0) {
      events.push({ type: 'text', text: 'Non ha alcun effetto...' });
      return { events };
    }

    const hits = effect && effect.kind === 'multi' ? multiHitCount(effect, rng) : 1;
    let totalDamage = 0;
    let lastCrit = false;
    let lastEffectiveness = effectivenessMult;

    for (let i = 0; i < hits; i += 1) {
      if (defender.hp <= 0) break;
      if (defender.protected) {
        events.push({ type: 'text', text: `${defenderName} si è protetto!` });
        break;
      }
      const crit = rand(rng) < 1 / 16;
      const attackerAtkStage = crit ? Math.max(0, stagesA[attackStatKey] || 0) : (stagesA[attackStatKey] || 0);
      const defenderDefStage = crit ? Math.min(0, stagesB[defenseStatKey] || 0) : (stagesB[defenseStatKey] || 0);
      const attackValue = attacker.stats[attackStatKey] * stageMultiplier(attackerAtkStage);
      const defenseValue = Math.max(1, defender.stats[defenseStatKey] * stageMultiplier(defenderDefStage));
      const stab = attackerSpecies.types.includes(known.type) ? 1.5 : 1;
      const randomFactor = 0.85 + rand(rng) * 0.15;
      const critMult = crit ? 2 : 1;
      let damage = Math.max(1, Math.floor(((((2 * attacker.level / 5) + 2) * known.power * attackValue / defenseValue) / 50 + 2) * stab * effectivenessMult * randomFactor * critMult));
      defender.hp = Math.max(0, defender.hp - damage);
      totalDamage += damage;
      lastCrit = crit;
      lastEffectiveness = effectivenessMult;
      events.push({ type: 'damage', target: 'defender', amount: damage, effectiveness: effectivenessMult, crit });
      if (defender.hp <= 0) {
        events.push({ type: 'faint', target: 'defender' });
        break;
      }
    }

    if (hits > 1) {
      events.push({ type: 'text', text: `Colpito ${hits} volte!` });
    }
    if (lastCrit) events.push({ type: 'text', text: 'Brutto colpo!' });
    if (lastEffectiveness > 1) events.push({ type: 'text', text: 'È superefficace!' });
    if (lastEffectiveness > 0 && lastEffectiveness < 1) events.push({ type: 'text', text: 'Non è molto efficace...' });

    // effetti secondari su danno
    if (effect) {
      if (effect.kind === 'drain' && totalDamage > 0) {
        const healAmount = Math.max(1, Math.floor(totalDamage * effect.ratio));
        attacker.hp = Math.min(attacker.stats.hp, attacker.hp + healAmount);
        events.push({ type: 'text', text: `${attackerName} ha assorbito energia!` });
      }
      if (effect.kind === 'status' && defender.hp > 0) {
        maybeApplyStatus(effect, defender, defenderName, events, rng);
      }
      if (effect.kind === 'flinch' && defender.hp > 0) {
        if (rand(rng) * 100 < effect.chance) {
          defender.flinched = true;
        }
      }
      if (effect.kind === 'custom') {
        events.push({ type: 'text', text: `${known.name} ha un effetto speciale!` });
      }
    }
    if (effect && effect.kind === 'recoil' && totalDamage > 0) {
      const recoilAmount = Math.max(1, Math.floor(totalDamage * effect.ratio));
      attacker.hp = Math.max(0, attacker.hp - recoilAmount);
      events.push({ type: 'text', text: `${attackerName} è esausto per il contraccolpo!` });
      if (attacker.hp <= 0) events.push({ type: 'faint', target: 'attacker' });
    }

    return { events };
  }

  function multiHitCount(effect, rng) {
    // 2-3 colpi 37.5% ciascuno, 4-5 colpi 12.5% ciascuno (distribuzione Gen standard), semplificata qui.
    const r = rand(rng);
    const min = effect.min || 2;
    const max = effect.max || 5;
    if (min === max) return min;
    if (r < 0.375) return min;
    if (r < 0.75) return min + 1;
    if (r < 0.875) return Math.min(max, min + 2);
    return max;
  }

  function applyNonDamagingEffect(known, effect, attacker, defender, attackerName, defenderName, stagesA, stagesB, events, rng) {
    if (!effect) return;
    switch (effect.kind) {
      case 'stat': {
        const target = effect.target === 'self' ? attacker : defender;
        const targetName = effect.target === 'self' ? attackerName : defenderName;
        const stages = effect.target === 'self' ? stagesA : stagesB;
        if (rand(rng) * 100 >= (effect.chance ?? 100)) return;
        const current = stages[effect.stat] || 0;
        const next = Math.max(-6, Math.min(6, current + effect.stages));
        if (next === current) {
          events.push({ type: 'text', text: effect.stages > 0 ? statMessages.upMax(targetName) : statMessages.downMax(targetName) });
        } else {
          stages[effect.stat] = next;
          const statName = statNamesIt[effect.stat] || effect.stat;
          events.push({ type: 'text', text: effect.stages > 0 ? statMessages.up(targetName, statName) : statMessages.down(targetName, statName) });
        }
        break;
      }
      case 'status': {
        maybeApplyStatus(effect, defender, defenderName, events, rng);
        break;
      }
      case 'heal': {
        const healAmount = Math.max(1, Math.floor(attacker.stats.hp * effect.ratio));
        attacker.hp = Math.min(attacker.stats.hp, attacker.hp + healAmount);
        events.push({ type: 'text', text: `${attackerName} recupera PS!` });
        break;
      }
      case 'protect': {
        attacker.protected = true;
        events.push({ type: 'text', text: `${attackerName} si protegge!` });
        break;
      }
      case 'custom': {
        events.push({ type: 'text', text: `${known.name} ha un effetto speciale!` });
        break;
      }
      default:
        break;
    }
  }

  function maybeApplyStatus(effect, target, targetName, events, rng) {
    if (target.status) {
      events.push({ type: 'text', text: `${targetName} ha già uno stato alterato!` });
      return;
    }
    const targetSpecies = speciesCatalog()[target.species];
    if (statusImmune(effect.status, targetSpecies.types)) {
      events.push({ type: 'text', text: `Non ha effetto su ${targetName}.` });
      return;
    }
    if (rand(rng) * 100 >= (effect.chance ?? 100)) return;
    target.status = effect.status;
    if (effect.status === 'slp') target.sleepTurns = 1 + Math.floor(rand(rng) * 3);
    events.push({ type: 'status', target: targetName, status: effect.status, text: `${targetName} è ora ${statusNamesIt[effect.status]}!` });
  }

  function endOfTurn(monster) {
    const events = [];
    const species = speciesCatalog()[monster.species];
    const name = species ? species.name : monster.species;
    if (monster.hp > 0 && (monster.status === 'psn' || monster.status === 'brn')) {
      const damage = Math.max(1, Math.floor(monster.stats.hp / 8));
      monster.hp = Math.max(0, monster.hp - damage);
      const label = monster.status === 'psn' ? 'veleno' : 'scottatura';
      events.push({ type: 'damage', target: 'self', amount: damage, cause: monster.status });
      events.push({ type: 'text', text: `${name} soffre per ${label}!` });
      if (monster.hp <= 0) events.push({ type: 'faint', target: 'self' });
    }
    monster.flinched = false;
    monster.protected = false;
    return events;
  }

  // --- IA ---
  function estimateDamageScore(attacker, defender, moveId) {
    const known = moveDef(moveId);
    if (!known || !known.power) return -1;
    const attackerSpecies = speciesCatalog()[attacker.species];
    const defenderSpecies = speciesCatalog()[defender.species];
    const stab = attackerSpecies.types.includes(known.type) ? 1.5 : 1;
    const effectiveness = typeMultiplier(known.type, defenderSpecies.types);
    const accuracy = known.accuracy === null ? 100 : known.accuracy;
    return known.power * stab * effectiveness * (accuracy / 100);
  }

  function chooseMove(attacker, defender, options) {
    const opts = options || {};
    const rng = opts.rng;
    const usable = attacker.moves.filter(m => m.pp > 0);
    if (!usable.length) return null;

    const turnsFought = attacker.turnsFought || 0;
    if (turnsFought === 0 && defender.hp === defender.stats.hp && !defender.status) {
      const statusMoves = usable.filter(m => {
        const known = moveDef(m.id);
        return known && !known.power && known.effect;
      });
      if (statusMoves.length && rand(rng) < 0.25) {
        return statusMoves[Math.floor(rand(rng) * statusMoves.length)].id;
      }
    }

    const scored = usable.map(m => ({ id: m.id, score: estimateDamageScore(attacker, defender, m.id) }))
      .filter(entry => entry.score >= 0);

    if (!scored.length) {
      return usable[Math.floor(rand(rng) * usable.length)].id;
    }

    scored.sort((a, b) => b.score - a.score);
    if (scored.length > 1 && rand(rng) < 0.2) {
      const rest = scored.slice(1);
      return rest[Math.floor(rand(rng) * rest.length)].id;
    }
    return scored[0].id;
  }

  // --- Cattura ---
  const ballBonus = { ball: 1 };

  function catchChance(wild, ballId) {
    const species = speciesCatalog()[wild.species];
    const bonus = ballBonus[ballId] ?? 1;
    const a = (3 * wild.stats.hp - 2 * wild.hp) * species.catchRate * bonus / (3 * wild.stats.hp);
    let statusMult = 1;
    if (wild.status === 'slp' || wild.status === 'frz') statusMult = 2;
    else if (wild.status === 'psn' || wild.status === 'par' || wild.status === 'brn') statusMult = 1.5;
    return Math.max(1, Math.min(255, Math.floor(a * statusMult)));
  }

  function shakeProbability(catchValue) {
    return 65536 / Math.pow((255 / catchValue), 0.1875);
  }

  function attemptCatch(wild, ballId, rng) {
    const catchValue = catchChance(wild, ballId);
    if (catchValue >= 255) return { caught: true, shakes: 4 };
    const probability = shakeProbability(catchValue);
    let shakes = 0;
    for (let i = 0; i < 4; i += 1) {
      if (rand(rng) * 65536 >= probability) {
        return { caught: false, shakes };
      }
      shakes += 1;
    }
    return { caught: true, shakes: 4 };
  }

  function canRun(player, enemy, attempts, rng) {
    const playerSpeed = player.stats ? player.stats.speed : player;
    const enemySpeed = enemy.stats ? enemy.stats.speed : enemy;
    if (playerSpeed >= enemySpeed) return true;
    const odds = Math.min(255, Math.floor((playerSpeed * 32) / Math.max(1, Math.floor(enemySpeed / 4))) + 30 * (attempts || 0));
    if (odds >= 255) return true;
    return Math.floor(rand(rng) * 256) < odds;
  }

  function freshStages() {
    return { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
  }

  const api = {
    configure,
    createMonster, calculateStats, movesFor, hydrateMonster,
    expToNext, expGain, gainExperience, learnMove,
    typeMultiplier, typeChart,
    chooseMove, turnOrder, executeMove, endOfTurn,
    catchChance, attemptCatch, canRun,
    freshStages
  };

  if (typeof window !== 'undefined') window.PokemonAscoliBattle = api;
  if (typeof module !== 'undefined') module.exports = api;
}());
