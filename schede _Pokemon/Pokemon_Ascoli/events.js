(function () {
  'use strict';

  function check(condition, save) {
    if (condition === null || condition === undefined) return true;
    if ('flag' in condition) return !!(save.flags && save.flags[condition.flag]);
    if ('notFlag' in condition) return !(save.flags && save.flags[condition.notFlag]);
    if ('badge' in condition) return Array.isArray(save.badges) && save.badges.includes(condition.badge);
    if ('item' in condition) return !!(save.items && save.items[condition.item] > 0);
    if ('money' in condition) return (save.money || 0) >= condition.money;
    if ('all' in condition) return condition.all.every(function (c) { return check(c, save); });
    if ('any' in condition) return condition.any.some(function (c) { return check(c, save); });
    if ('not' in condition) return !check(condition.not, save);
    console.warn('PokemonAscoliEvents.check: condizione sconosciuta', condition);
    return false;
  }

  function trainerFlag(id) {
    return 'trainer:' + id;
  }

  function visibleNpcs(map, save) {
    return (map.npcs || []).filter(function (npc) { return check(npc.when, save); });
  }

  function canUseTransition(transition, save) {
    return check(transition.when, save);
  }

  function npcScript(npc) {
    if (npc.script) return npc.script;
    return [{ say: npc.dialogue, name: npc.name || null }];
  }

  async function callHost(host, method) {
    var args = Array.prototype.slice.call(arguments, 2);
    if (typeof host[method] !== 'function') {
      console.warn('PokemonAscoliEvents: host non implementa ' + method);
      return undefined;
    }
    return host[method].apply(host, args);
  }

  function ensureFlags(save) {
    if (!save.flags) save.flags = {};
    return save.flags;
  }

  function ensureItems(save) {
    if (!save.items) save.items = {};
    return save.items;
  }

  function ensureBadges(save) {
    if (!save.badges) save.badges = [];
    return save.badges;
  }

  function createRunner(host) {
    var queue = Promise.resolve();
    var pending = 0;

    async function runStep(step) {
      var save = host.save;

      if ('say' in step) {
        var pages = Array.isArray(step.say) ? step.say : [step.say];
        var name = 'name' in step ? step.name : null;
        for (var i = 0; i < pages.length; i++) {
          await callHost(host, 'say', name, pages[i]);
        }
        return;
      }

      if ('choice' in step) {
        var texts = step.options.map(function (o) { return o.text; });
        var index = await callHost(host, 'choice', step.choice, texts);
        var option = step.options[index];
        if (option && option.then) await runScript(option.then);
        return;
      }

      if ('if' in step) {
        if (check(step.if, save)) {
          if (step.then) await runScript(step.then);
        } else {
          if (step.else) await runScript(step.else);
        }
        return;
      }

      if ('setFlag' in step) {
        ensureFlags(save)[step.setFlag] = true;
        return;
      }

      if ('clearFlag' in step) {
        ensureFlags(save)[step.clearFlag] = false;
        return;
      }

      if ('giveItem' in step) {
        var items = ensureItems(save);
        var qty = 'qty' in step ? step.qty : 1;
        items[step.giveItem] = (items[step.giveItem] || 0) + qty;
        return;
      }

      if ('takeItem' in step) {
        var itemsT = ensureItems(save);
        var qtyT = 'qty' in step ? step.qty : 1;
        itemsT[step.takeItem] = Math.max(0, (itemsT[step.takeItem] || 0) - qtyT);
        return;
      }

      if ('giveMoney' in step) {
        save.money = (save.money || 0) + step.giveMoney;
        return;
      }

      if ('takeMoney' in step) {
        save.money = Math.max(0, (save.money || 0) - step.takeMoney);
        return;
      }

      if ('badge' in step) {
        var badges = ensureBadges(save);
        if (!badges.includes(step.badge)) {
          badges.push(step.badge);
          badges.sort(function (a, b) { return a - b; });
        }
        return;
      }

      if ('heal' in step) {
        await callHost(host, 'heal');
        return;
      }

      if ('shop' in step) {
        await callHost(host, 'shop', step.shop);
        return;
      }

      if ('battleTrainer' in step) {
        var result = await callHost(host, 'battleTrainer', step.battleTrainer);
        if (result === 'win') {
          ensureFlags(save)[trainerFlag(step.battleTrainer)] = true;
          if (step.onWin) await runScript(step.onWin);
        } else if (result === 'lose') {
          if (step.onLose) await runScript(step.onLose);
        }
        return;
      }

      if ('wildBattle' in step) {
        var wildResult = await callHost(host, 'wildBattle', step.wildBattle);
        if (wildResult === 'caught') {
          if (step.onCatch) await runScript(step.onCatch);
        } else {
          if (step.onOther) await runScript(step.onOther);
        }
        return;
      }

      if ('giveMonster' in step) {
        await callHost(host, 'giveMonster', step.giveMonster);
        return;
      }

      if ('warp' in step) {
        await callHost(host, 'warp', step.warp);
        return;
      }

      if ('toast' in step) {
        await callHost(host, 'toast', step.toast);
        return;
      }

      console.warn('PokemonAscoliEvents: passo sconosciuto', step);
    }

    async function runScript(script) {
      for (var i = 0; i < script.length; i++) {
        await runStep(script[i]);
      }
    }

    function run(script) {
      pending++;
      var task = queue.then(async function () {
        try {
          await runScript(script);
        } finally {
          pending--;
        }
      });
      queue = task.catch(function () {});
      return task;
    }

    return {
      run: run,
      get running() { return pending > 0; }
    };
  }

  var KNOWN_STEP_KEYS = [
    'say', 'choice', 'if', 'setFlag', 'clearFlag', 'giveItem', 'takeItem',
    'giveMoney', 'takeMoney', 'badge', 'heal', 'shop', 'battleTrainer',
    'wildBattle', 'giveMonster', 'warp', 'toast'
  ];

  function validateStep(step, errors, pathLabel) {
    if (!step || typeof step !== 'object') {
      errors.push(pathLabel + ': passo non valido (non è un oggetto)');
      return;
    }
    var key = KNOWN_STEP_KEYS.find(function (k) { return k in step; });
    if (!key) {
      errors.push(pathLabel + ': passo con chiave sconosciuta (' + Object.keys(step).join(',') + ')');
      return;
    }
    if (key === 'choice') {
      if (!Array.isArray(step.options) || !step.options.length) {
        errors.push(pathLabel + ': choice senza options');
        return;
      }
      step.options.forEach(function (option, index) {
        if (option && option.then) validateScript(option.then, errors, pathLabel + '.choice[' + index + ']');
      });
    }
    if (key === 'if') {
      if (step.then) validateScript(step.then, errors, pathLabel + '.then');
      if (step.else) validateScript(step.else, errors, pathLabel + '.else');
    }
    if (key === 'battleTrainer') {
      if (step.onWin) validateScript(step.onWin, errors, pathLabel + '.onWin');
      if (step.onLose) validateScript(step.onLose, errors, pathLabel + '.onLose');
    }
    if (key === 'wildBattle') {
      if (step.onCatch) validateScript(step.onCatch, errors, pathLabel + '.onCatch');
      if (step.onOther) validateScript(step.onOther, errors, pathLabel + '.onOther');
    }
  }

  function validateScript(script, errors, pathLabel) {
    errors = errors || [];
    pathLabel = pathLabel || 'script';
    if (!Array.isArray(script)) {
      errors.push(pathLabel + ': non è un array');
      return errors;
    }
    script.forEach(function (step, index) {
      validateStep(step, errors, pathLabel + '[' + index + ']');
    });
    return errors;
  }

  var api = {
    check: check,
    createRunner: createRunner,
    visibleNpcs: visibleNpcs,
    canUseTransition: canUseTransition,
    npcScript: npcScript,
    validateScript: validateScript,
    flagKeys: { trainerFlag: trainerFlag }
  };

  window.PokemonAscoliEvents = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
