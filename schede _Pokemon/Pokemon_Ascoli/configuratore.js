(function () {
  'use strict';

  const data = window.PokemonAscoliData;
  const canvas = document.getElementById('editorCanvas');
  const ctx = canvas.getContext('2d');
  const storageKey = 'pokemonAscoliConfigV1';
  const scale = 4;
  const ui = Object.fromEntries([
    'mapSelect', 'tileType', 'brushSize', 'collisionValue', 'encounterRate', 'cursorInfo',
    'objectName', 'objectWidth', 'objectHeight', 'objectColor', 'destinationMap', 'spawnX',
    'spawnY', 'npcDialogue', 'npcMovement', 'selectedIndex', 'updateObject', 'deleteObject',
    'objectList', 'encounterSpecies', 'minLevel', 'maxLevel', 'encounterWeight',
    'addEncounter', 'encounterList', 'exportConfig', 'importConfig', 'resetConfig', 'saveStatus'
  ].map(id => [id, document.getElementById(id)]));

  let tool = 'select';
  let config = loadConfig();
  let mapId = Object.keys(data.maps)[0];
  let painting = false;
  let draggedObject = null;
  let selection = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createDefaultConfig() {
    const maps = {};
    Object.entries(data.maps).forEach(([id, map]) => {
      maps[id] = {
        tileOverrides: {},
        collisionOverrides: {},
        encounterCells: {},
        buildings: clone(map.buildings || []),
        transitions: clone(map.transitions || []),
        npcs: clone(map.npcs || []),
        encounterZones: clone(map.encounterZones || []),
        encounterTable: clone(map.encounterTable || [])
      };
    });
    return { version: 1, updatedAt: new Date().toISOString(), maps };
  }

  function loadConfig() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return createDefaultConfig();
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1 || !parsed.maps) return createDefaultConfig();
      const defaults = createDefaultConfig();
      Object.keys(defaults.maps).forEach(id => {
        parsed.maps[id] = { ...defaults.maps[id], ...(parsed.maps[id] || {}) };
      });
      return parsed;
    } catch (_) {
      return createDefaultConfig();
    }
  }

  function saveConfig(message = 'Modifiche salvate automaticamente.') {
    config.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
      ui.saveStatus.textContent = message;
    } catch (_) {
      ui.saveStatus.textContent = 'Salvataggio locale non disponibile: esporta il JSON.';
    }
  }

  function currentBaseMap() {
    return data.maps[mapId];
  }

  function currentConfig() {
    return config.maps[mapId];
  }

  function keyFor(x, y) {
    return `${x},${y}`;
  }

  function pointInRect(x, y, item) {
    return x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h;
  }

  function colorForTile(type) {
    return {
      erba: '#6da25c', road: '#a89572', travertino: '#b8ad91', piazza: '#cdbd98',
      water: '#4389aa', bridge: '#9d754d', muro: '#5d5a50'
    }[type] || '#6da25c';
  }

  function fillScaled(item, color) {
    ctx.fillStyle = color;
    ctx.fillRect(item.x * scale, item.y * scale, item.w * scale, item.h * scale);
  }

  function draw() {
    const base = currentBaseMap();
    const custom = currentConfig();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorForTile(base.baseTile);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    (base.roads || []).forEach(item => fillScaled(item, colorForTile(item.type || 'road')));
    (base.plazas || []).forEach(item => fillScaled(item, colorForTile('piazza')));
    (base.waters || []).forEach(item => fillScaled(item, colorForTile('water')));
    (base.bridges || []).forEach(item => fillScaled(item, colorForTile('bridge')));
    (base.encounterZones || []).forEach(item => fillScaled(item, 'rgba(240,176,51,.18)'));

    Object.entries(custom.tileOverrides).forEach(([key, type]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = colorForTile(type);
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });
    Object.entries(custom.encounterCells).forEach(([key, rate]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = Number(rate) > 0 ? 'rgba(240,176,51,.82)' : 'rgba(55,55,55,.68)';
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });
    Object.entries(custom.collisionOverrides).forEach(([key, blocked]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = blocked ? 'rgba(220,60,54,.82)' : 'rgba(62,180,202,.72)';
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });

    custom.buildings.forEach((item, index) => {
      fillScaled(item, item.color || '#b77958');
      ctx.strokeStyle = selection && selection.type === 'buildings' && selection.index === index ? '#fff36b' : '#382b23';
      ctx.lineWidth = selection && selection.type === 'buildings' && selection.index === index ? 3 : 1;
      ctx.strokeRect(item.x * scale, item.y * scale, item.w * scale, item.h * scale);
      drawLabel(item.name, item.x * scale + item.w * scale / 2, item.y * scale + item.h * scale / 2);
    });
    custom.transitions.forEach((item, index) => {
      fillScaled(item, 'rgba(74,193,221,.85)');
      ctx.strokeStyle = selection && selection.type === 'transitions' && selection.index === index ? '#fff36b' : '#174d58';
      ctx.lineWidth = 2;
      ctx.strokeRect(item.x * scale, item.y * scale, item.w * scale, item.h * scale);
      drawLabel(item.label, item.x * scale + item.w * scale / 2, item.y * scale + item.h * scale / 2);
    });
    custom.npcs.forEach((item, index) => {
      ctx.fillStyle = selection && selection.type === 'npcs' && selection.index === index ? '#fff36b' : '#824d91';
      ctx.fillRect(item.x * scale - 2, item.y * scale - 2, scale + 4, scale + 4);
    });

    ctx.strokeStyle = 'rgba(18,29,22,.13)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 16 * scale) {
      ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 16 * scale) {
      ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(canvas.width, y + .5); ctx.stroke();
    }
  }

  function drawLabel(text, x, y) {
    if (!text) return;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const width = ctx.measureText(text).width + 6;
    ctx.fillStyle = 'rgba(18,27,21,.82)';
    ctx.fillRect(x - width / 2, y - 7, width, 13);
    ctx.fillStyle = '#fff2c9';
    ctx.fillText(text, x, y + 3);
  }

  function canvasPoint(event) {
    const box = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(255, Math.floor((event.clientX - box.left) / box.width * currentBaseMap().width))),
      y: Math.max(0, Math.min(159, Math.floor((event.clientY - box.top) / box.height * currentBaseMap().height)))
    };
  }

  function applyBrush(x, y) {
    const custom = currentConfig();
    const size = Number(ui.brushSize.value);
    const radius = Math.floor(size / 2);
    for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
      for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
        const cellX = x + offsetX;
        const cellY = y + offsetY;
        if (cellX < 0 || cellY < 0 || cellX >= 256 || cellY >= 160) continue;
        const key = keyFor(cellX, cellY);
        if (tool === 'tile') custom.tileOverrides[key] = ui.tileType.value;
        if (tool === 'collision') {
          if (ui.collisionValue.value === 'default') delete custom.collisionOverrides[key];
          else custom.collisionOverrides[key] = ui.collisionValue.value === 'true';
        }
        if (tool === 'encounter') custom.encounterCells[key] = Math.max(0, Math.min(1, Number(ui.encounterRate.value)));
      }
    }
    draw();
  }

  function addObject(type, x, y) {
    const custom = currentConfig();
    if (type === 'building') {
      custom.buildings.push({
        x, y,
        w: Math.max(1, Number(ui.objectWidth.value)),
        h: Math.max(1, Number(ui.objectHeight.value)),
        name: ui.objectName.value || 'Edificio',
        color: ui.objectColor.value,
        kind: 'attività'
      });
      selectObject('buildings', custom.buildings.length - 1);
    }
    if (type === 'transition') {
      custom.transitions.push({
        x, y,
        w: Math.max(1, Number(ui.objectWidth.value)),
        h: Math.max(1, Number(ui.objectHeight.value)),
        to: ui.destinationMap.value,
        spawnX: Number(ui.spawnX.value),
        spawnY: Number(ui.spawnY.value),
        label: ui.objectName.value || 'Passaggio'
      });
      selectObject('transitions', custom.transitions.length - 1);
    }
    if (type === 'npc') {
      custom.npcs.push({
        x, y,
        name: ui.objectName.value || 'NPC',
        dialogue: ui.npcDialogue.value || 'Ciao!',
        movement: ui.npcMovement.value
      });
      selectObject('npcs', custom.npcs.length - 1);
    }
    saveConfig();
    renderLists();
    draw();
  }

  function hitTest(x, y) {
    const custom = currentConfig();
    for (let index = custom.npcs.length - 1; index >= 0; index -= 1) {
      const item = custom.npcs[index];
      if (item.x === x && item.y === y) return { type: 'npcs', index };
    }
    for (const type of ['transitions', 'buildings']) {
      for (let index = custom[type].length - 1; index >= 0; index -= 1) {
        if (pointInRect(x, y, custom[type][index])) return { type, index };
      }
    }
    return null;
  }

  function selectObject(type, index) {
    selection = { type, index };
    const item = currentConfig()[type][index];
    if (!item) return;
    ui.selectedIndex.value = `${type}:${index}`;
    ui.objectName.value = item.name || item.label || '';
    ui.objectWidth.value = item.w || 1;
    ui.objectHeight.value = item.h || 1;
    ui.objectColor.value = item.color || '#b77958';
    ui.destinationMap.value = item.to || ui.destinationMap.value;
    ui.spawnX.value = item.spawnX ?? 3;
    ui.spawnY.value = item.spawnY ?? 3;
    ui.npcDialogue.value = item.dialogue || '';
    ui.npcMovement.value = item.movement || 'fermo';
    draw();
  }

  function updateSelected() {
    if (!selection) return;
    const item = currentConfig()[selection.type][selection.index];
    if (!item) return;
    if (selection.type === 'buildings') {
      item.name = ui.objectName.value;
      item.w = Math.max(1, Number(ui.objectWidth.value));
      item.h = Math.max(1, Number(ui.objectHeight.value));
      item.color = ui.objectColor.value;
    }
    if (selection.type === 'transitions') {
      item.label = ui.objectName.value;
      item.w = Math.max(1, Number(ui.objectWidth.value));
      item.h = Math.max(1, Number(ui.objectHeight.value));
      item.to = ui.destinationMap.value;
      item.spawnX = Number(ui.spawnX.value);
      item.spawnY = Number(ui.spawnY.value);
    }
    if (selection.type === 'npcs') {
      item.name = ui.objectName.value;
      item.dialogue = ui.npcDialogue.value;
      item.movement = ui.npcMovement.value;
    }
    saveConfig();
    renderLists();
    draw();
  }

  function deleteSelected() {
    if (!selection) return;
    currentConfig()[selection.type].splice(selection.index, 1);
    selection = null;
    ui.selectedIndex.value = '';
    saveConfig('Elemento eliminato.');
    renderLists();
    draw();
  }

  function renderLists() {
    const custom = currentConfig();
    const groups = [
      ['buildings', 'Edificio', item => item.name],
      ['transitions', 'Passaggio', item => item.label],
      ['npcs', 'NPC', item => item.name]
    ];
    ui.objectList.innerHTML = groups.flatMap(([type, label, name]) => custom[type].map((item, index) =>
      `<div class="object-item"><span>${label}: ${escapeHtml(name(item) || 'senza nome')}</span><button data-select-type="${type}" data-select-index="${index}" type="button">Seleziona</button></div>`
    )).join('');
    ui.objectList.querySelectorAll('[data-select-type]').forEach(button => button.addEventListener('click', () => selectObject(button.dataset.selectType, Number(button.dataset.selectIndex))));

    ui.encounterList.innerHTML = custom.encounterTable.map((entry, index) => {
      const species = data.species[entry.species];
      return `<div class="object-item"><span>${escapeHtml(species ? species.name : entry.species)} · Lv.${entry.minLevel}-${entry.maxLevel} · peso ${entry.weight}</span><button data-remove-encounter="${index}" type="button">Rimuovi</button></div>`;
    }).join('');
    ui.encounterList.querySelectorAll('[data-remove-encounter]').forEach(button => button.addEventListener('click', () => {
      custom.encounterTable.splice(Number(button.dataset.removeEncounter), 1);
      saveConfig('Specie rimossa dalla tabella.');
      renderLists();
    }));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));
  }

  function setTool(nextTool) {
    tool = nextTool;
    document.querySelectorAll('[data-tool]').forEach(button => button.classList.toggle('active', button.dataset.tool === tool));
  }

  function populateSelects() {
    Object.entries(data.maps).forEach(([id, map]) => {
      const option = new Option(map.name, id);
      ui.mapSelect.add(option);
      ui.destinationMap.add(option.cloneNode(true));
    });
    Object.entries(data.species)
      .sort(([, a], [, b]) => a.number - b.number)
      .forEach(([id, species]) => ui.encounterSpecies.add(new Option(species.name, id)));
    ui.mapSelect.value = mapId;
  }

  canvas.addEventListener('pointerdown', event => {
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const point = canvasPoint(event);
    painting = ['tile', 'collision', 'encounter'].includes(tool);
    if (painting) applyBrush(point.x, point.y);
    else if (['building', 'transition', 'npc'].includes(tool)) addObject(tool, point.x, point.y);
    else {
      const hit = hitTest(point.x, point.y);
      if (hit) {
        selectObject(hit.type, hit.index);
        draggedObject = { ...hit, offsetX: point.x - currentConfig()[hit.type][hit.index].x, offsetY: point.y - currentConfig()[hit.type][hit.index].y };
      } else {
        selection = null;
        draw();
      }
    }
  });

  canvas.addEventListener('pointermove', event => {
    const point = canvasPoint(event);
    ui.cursorInfo.textContent = `Cella: ${point.x}, ${point.y}`;
    if (painting) applyBrush(point.x, point.y);
    if (draggedObject) {
      const item = currentConfig()[draggedObject.type][draggedObject.index];
      item.x = Math.max(0, Math.min(255, point.x - draggedObject.offsetX));
      item.y = Math.max(0, Math.min(159, point.y - draggedObject.offsetY));
      draw();
    }
  });

  canvas.addEventListener('pointerup', () => {
    if (painting || draggedObject) saveConfig();
    painting = false;
    draggedObject = null;
    renderLists();
  });
  canvas.addEventListener('pointercancel', () => { painting = false; draggedObject = null; });

  document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => setTool(button.dataset.tool)));
  ui.mapSelect.addEventListener('change', () => {
    mapId = ui.mapSelect.value;
    selection = null;
    renderLists();
    draw();
  });
  ui.updateObject.addEventListener('click', updateSelected);
  ui.deleteObject.addEventListener('click', deleteSelected);
  ui.addEncounter.addEventListener('click', () => {
    const min = Math.max(1, Number(ui.minLevel.value));
    const max = Math.max(min, Number(ui.maxLevel.value));
    currentConfig().encounterTable.push({
      species: ui.encounterSpecies.value,
      minLevel: min,
      maxLevel: max,
      weight: Math.max(1, Number(ui.encounterWeight.value))
    });
    saveConfig('Specie aggiunta alla tabella.');
    renderLists();
  });
  ui.exportConfig.addEventListener('click', () => {
    saveConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pokemon-ascoli-configurazione.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });
  ui.importConfig.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed.version !== 1 || !parsed.maps) throw new Error('Formato non valido');
        config = parsed;
        Object.keys(data.maps).forEach(id => {
          if (!config.maps[id]) config.maps[id] = createDefaultConfig().maps[id];
        });
        saveConfig('Configurazione importata. Ricarica il gioco per applicarla.');
        selection = null;
        renderLists();
        draw();
      } catch (_) {
        ui.saveStatus.textContent = 'Il file selezionato non è una configurazione valida.';
      }
    };
    reader.readAsText(file);
  });
  ui.resetConfig.addEventListener('click', () => {
    if (!confirm('Ripristinare tutte le mappe e cancellare le modifiche locali?')) return;
    config = createDefaultConfig();
    selection = null;
    saveConfig('Configurazione iniziale ripristinata.');
    renderLists();
    draw();
  });

  populateSelects();
  renderLists();
  draw();
}());
