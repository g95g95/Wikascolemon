// Playthrough e2e completo: stazione -> intro -> Bobby (starter Basilino) -> Nando 1 -> Ventidio
// (flag) -> Monticelli -> catena Salaria fino a Castel di Lama (blocco medaglia) -> palestra 1
// (allievi, Hills, medaglia, MT) -> Spinetoli -> Costa (Ivo e Teo) -> Jonathan (Nando 3, Bro x3,
// Riccio, medaglia 2, titoli di coda, MT).
// Livelli forzati (L30 prima di Hills, L45 prima di Riccio) per la velocità: la squadra parte dal
// vero starter regalato da Bobby, poi le statistiche vengono ricalcolate senza macinare esperienza.
//
// Nota su walkUntilBattle: un allenatore con sight>0 puo' intercettare il giocatore a meta' di un
// walkTo (checkTrainerSight scatta a ogni cella percorsa in game.js), quindi non si puo' assumere
// che il cammino pianificato da BFS arrivi sempre a destinazione: va sempre gestito il caso "si e'
// aperta una battaglia prima del previsto".
import assert from 'node:assert/strict';
import {
  openGame, newGame, getSave, walkTo, walkUntilBattle, autoBattle,
  forceTeamLevel, advanceDialogue, chooseDialogueOption, screenshot
} from './helpers.mjs';

const startedAt = Date.now();
const log = (...args) => console.log(`[+${((Date.now() - startedAt) / 1000).toFixed(1)}s]`, ...args);

function fail(step, message, extra) {
  const err = new Error(`[${step}] ${message}${extra ? ' | ' + JSON.stringify(extra) : ''}`);
  err.step = step;
  throw err;
}

// Dopo la vittoria startTrainerEncounter (game.js) gestisce piu' say() consecutivi senza mai
// chiamare closeDialogue(): #dialogueScreen.hidden resta false per tutto il flusso post-battaglia
// (prima/dopo/medaglia/crediti), quindi non e' un segnale affidabile di "dialogo chiuso" qui - lo
// e' invece per i dialoghi normali (runScript), dove closeDialogue() viene chiamata a fine script.
// Si preme Invio un numero fisso di volte e ci si ferma appena stopWhen(save) e' vero (di norma il
// flag trainer:<id>, o il badge per i capipalestra), esattamente come verificato manualmente
// durante la flottiglia D (vedi verify-05-trainers.mjs): non ci si affida mai a dialogueHidden qui.
async function drainPostBattleDialogue(page, stopWhen, { maxPresses = 18 } = {}) {
  for (let i = 0; i < maxPresses; i++) {
    const save = await getSave(page);
    if (stopWhen(save)) { await page.waitForTimeout(200); return getSave(page); }
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
  }
  return getSave(page);
}

// walkTo che, se un allenatore qualunque intercetta il giocatore lungo la strada, lo combatte
// (prima mossa), chiude i dialoghi post-lotta e riprende verso lo stesso bersaglio.
async function walkToFighting(page, x, y, { maxFights = 4 } = {}) {
  for (let i = 0; i <= maxFights; i++) {
    const r = await walkTo(page, x, y);
    if (r.ok || r.reason !== 'trainer-battle') return r;
    const before = await getSave(page);
    const known = Object.keys(before.flags).filter(f => f.startsWith('trainer:'));
    for (let k = 0; k < 20; k++) { // dialogo "before" dell'allenatore, poi parte la lotta
      if (await page.evaluate(() => !document.getElementById('battleScreen').hidden)) break;
      await page.keyboard.press('Enter'); await page.waitForTimeout(250);
    }
    await autoBattle(page, { maxTurns: 80 });
    await drainPostBattleDialogue(page, save => Object.keys(save.flags).filter(f => f.startsWith('trainer:')).length > known.length);
    await page.waitForTimeout(300);
    const cur = await getSave(page);
    if (cur.team.length) await forceTeamLevel(page, Math.max(...cur.team.map(m => m.level))); // cura
  }
  return walkTo(page, x, y);
}

async function fightTrainer(page, step, trainerId, { maxTurns = 60, stopWhen } = {}) {
  const battleVisible = await page.evaluate(() => !document.getElementById('battleScreen').hidden);
  if (!battleVisible) fail(step, `battaglia con ${trainerId} non avviata`);
  await autoBattle(page, { maxTurns });
  const predicate = stopWhen || (save => !!save.flags[`trainer:${trainerId}`]);
  const save = await drainPostBattleDialogue(page, predicate);
  if (!save.flags[`trainer:${trainerId}`]) fail(step, `${trainerId} non segnato come sconfitto`, save.flags);
  return save;
}

async function main() {
  const { browser, page, errors } = await openGame();
  let currentStep = 'avvio';
  try {
    // -----------------------------------------------------------------
    currentStep = 'titolo';
    await page.fill('#playerNameInput', 'Test');
    await newGame(page);
    let save = await getSave(page);
    if (save.player.map !== 'porta_maggiore') fail(currentStep, 'partita non iniziata a porta_maggiore', save.player);
    log('nuova partita, giocatore a', JSON.stringify(save.player));

    // -----------------------------------------------------------------
    currentStep = 'intro-bobby';
    // Bobby dell'intro e' fermo a (16,45); si avvicina da sotto.
    await walkTo(page, 16, 46);
    await page.keyboard.press('ArrowUp'); await page.waitForTimeout(180);
    await page.keyboard.press('Enter'); await page.waitForTimeout(350);
    await advanceDialogue(page); // consuma le pagine dell'intro, poi setFlag + warp automatico
    await page.waitForTimeout(300);
    save = await getSave(page);
    if (!save.flags.intro_vista) fail(currentStep, 'flag intro_vista non impostato dopo il dialogo con Bobby', save.flags);
    if (save.player.x !== 31 || save.player.y !== 51) fail(currentStep, 'warp post-intro atteso a (31,51)', save.player);
    log('intro vista, giocatore warpato a', JSON.stringify(save.player));

    // -----------------------------------------------------------------
    currentStep = 'starter';
    // Il warp lascia il giocatore gia' rivolto verso Bobby (bar): basta interagire.
    await page.keyboard.press('Enter'); await page.waitForTimeout(350);
    await advanceDialogue(page, { maxPages: 8 }); // Bobby -> Steven -> Elena -> Bobby, poi la scelta
    const choiceVisible = await page.evaluate(() => !document.getElementById('dialogueChoices').hidden);
    if (!choiceVisible) fail(currentStep, 'schermata di scelta dello starter non apparsa');
    const choiceTexts = await page.$$eval('#dialogueChoices button', els => els.map(e => e.textContent));
    const basilinoIdx = choiceTexts.findIndex(t => t.includes('Sant’Emidio') || t.includes('Sant\'Emidio'));
    if (basilinoIdx === -1) fail(currentStep, 'opzione Basilino (Sant’Emidio alle Grotte) non trovata', choiceTexts);
    await chooseDialogueOption(page, basilinoIdx);
    await advanceDialogue(page, { maxPages: 4 });
    save = await getSave(page);
    if (!save.flags.starter_scelto || !save.flags.starter_basilino) fail(currentStep, 'flag starter non impostati', save.flags);
    if (!save.team.length || save.team[0].species !== 'basilino') fail(currentStep, 'Basilino non ricevuto', save.team);
    if (!(save.items.ball >= 5)) fail(currentStep, 'Ball starter non ricevute', save.items);
    log('starter Basilino ricevuto, squadra', save.team.map(m => `${m.species} L${m.level}`));

    // -----------------------------------------------------------------
    currentStep = 'nando-1';
    // Basilino L5 (solo Azione, Normale) perde deterministicamente contro il Puledrotto L5 di Nando
    // (Fuoco, Braciere e' superefficace su Erba): livello forzato per un incontro vincibile, come le
    // altre forzature di livello prima dei capipalestra.
    await forceTeamLevel(page, 20);
    // Nando aspetta a (31,55) rivolto a nord, sight 4: camminare verso sud lo intercetta a meta' strada.
    const metNando1 = await walkUntilBattle(page, 31, 60);
    if (!metNando1) fail(currentStep, 'Nando 1 non ha intercettato il giocatore lungo il percorso');
    save = await fightTrainer(page, currentStep, 'porta_maggiore_nando_puledrotto');
    log('Nando 1 sconfitto, soldi', save.money);

    // -----------------------------------------------------------------
    currentStep = 'ventidio';
    // Verso ovest fino al Centro Storico (transizione (0-1,54-56)).
    await walkToFighting(page, 1, 55);
    await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(400);
    save = await getSave(page);
    if (save.player.map !== 'centro_storico') fail(currentStep, 'transizione verso centro_storico non avvenuta', save.player);
    // Porta del Teatro Ventidio Basso a (20,14): ci si mette sotto e si guarda su.
    await walkTo(page, 20, 15);
    await page.keyboard.press('ArrowUp'); await page.waitForTimeout(200);
    await page.keyboard.press('Enter'); await page.waitForTimeout(350);
    await advanceDialogue(page, { maxPages: 8 });
    save = await getSave(page);
    if (!save.flags.ventidio_visto) fail(currentStep, 'flag ventidio_visto non impostato', save.flags);
    log('Ventidio visitato, flag impostato');

    // -----------------------------------------------------------------
    currentStep = 'monticelli';
    // Torna a porta_maggiore, poi a est verso Monticelli.
    await walkToFighting(page, 143, 55);
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
    save = await getSave(page);
    if (save.player.map !== 'porta_maggiore') fail(currentStep, 'ritorno a porta_maggiore non avvenuto', save.player);
    await walkToFighting(page, 141, 55);
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
    save = await getSave(page);
    if (save.player.map !== 'monticelli') fail(currentStep, 'transizione verso monticelli non avvenuta', save.player);
    await screenshot(page, '01-monticelli');
    log('a Monticelli', JSON.stringify(save.player));

    // Attraversa Monticelli verso est (ora sbloccato da ventidio_visto).
    await walkToFighting(page, 177, 59);
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
    save = await getSave(page);
    if (save.player.map !== 'marino_del_tronto') fail(currentStep, 'transizione verso marino_del_tronto non avvenuta', save.player);
    log('a Marino del Tronto', JSON.stringify(save.player));

    // -----------------------------------------------------------------
    currentStep = 'catena-salaria';
    // Sulla riga 55 di marino_del_tronto c'e' un allenatore fisso (x=38, sight 4): camminare verso
    // est lungo la stessa riga lo intercetta a meta' strada.
    if (!(await getSave(page)).flags['trainer:marino_del_tronto_ragazzino_1']) {
      const metMarino = await walkUntilBattle(page, 177, 55);
      if (!metMarino) fail(currentStep, "l'allenatore fisso di marino_del_tronto non ha intercettato il giocatore");
      save = await fightTrainer(page, currentStep, 'marino_del_tronto_ragazzino_1');
    }
    log('allenatore di Marino del Tronto sconfitto');

    // Dopo la lotta si e' fermi a meta' mappa: prosegue verso l'uscita est.
    let r = await walkToFighting(page, 177, 55);
    if (!r.ok) fail(currentStep, "impossibile raggiungere l'uscita est di marino_del_tronto", r);
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
    save = await getSave(page);
    if (save.player.map !== 'oasi') fail(currentStep, 'transizione marino_del_tronto -> oasi non avvenuta', save.player);
    log('attraversata marino_del_tronto -> oasi');

    const chain = [
      { from: 'oasi', exitX: 141, exitY: 55, key: 'ArrowRight', to: 'maltignano' },
      { from: 'maltignano', exitX: 141, exitY: 55, key: 'ArrowRight', to: 'castel_di_lama' }
    ];
    for (const step of chain) {
      save = await getSave(page);
      if (save.player.map !== step.from) fail(currentStep, `atteso su ${step.from}, trovato ${save.player.map}`);
      const rr = await walkToFighting(page, step.exitX, step.exitY);
      if (!rr.ok) fail(currentStep, `impossibile raggiungere l'uscita di ${step.from}`, rr);
      await page.keyboard.press(step.key); await page.waitForTimeout(400);
      save = await getSave(page);
      if (save.player.map !== step.to) fail(currentStep, `transizione ${step.from} -> ${step.to} non avvenuta`, save.player);
      log(`attraversata ${step.from} -> ${step.to}`);
    }
    await screenshot(page, '02-castel-di-lama');

    // -----------------------------------------------------------------
    currentStep = 'blocco-medaglia';
    // Il passaggio est di castel_di_lama e' bloccato senza badge 1: verificalo prima di sfidare Hills.
    await walkToFighting(page, 177, 55);
    const beforeBlock = await getSave(page);
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(350);
    const afterBlock = await getSave(page);
    if (afterBlock.player.map !== 'castel_di_lama') fail(currentStep, 'il passaggio verso spinetoli non era bloccato senza la medaglia', afterBlock.player);
    assert.equal(afterBlock.player.x, beforeBlock.player.x, 'il giocatore non doveva muoversi contro il blocco medaglia');
    log('blocco medaglia confermato: senza badge 1 non si passa a spinetoli');

    // -----------------------------------------------------------------
    currentStep = 'palestra-1';
    await forceTeamLevel(page, 30);
    // Porta della palestra Free Spirit a (90,50).
    await walkTo(page, 90, 50); // la cella-porta: Invio da sopra di essa apre l'edificio
    await page.keyboard.press('Enter'); await page.waitForTimeout(500);
    save = await getSave(page);
    if (save.player.map !== 'palestra_castel_di_lama') fail(currentStep, 'ingresso in palestra_castel_di_lama non avvenuto', save.player);
    log('entrato nella palestra di Castel di Lama');

    // Sale lungo il corridoio centrale (x=11/12), incontrando allievo, allieva, poi Hills.
    const gymGates = [
      { x: 11, y: 14, id: 'palestra_castel_di_lama_allievo_1' },
      { x: 12, y: 9, id: 'palestra_castel_di_lama_allieva_1' },
      { x: 11, y: 4, id: 'castel_di_lama_hills' }
    ];
    for (const gate of gymGates) {
      const isHills = gate.id === 'castel_di_lama_hills';
      let met = await walkUntilBattle(page, gate.x, gate.y);
      if (!met && isHills) {
        // Hills ha sight 0: lo si sfida parlandogli (e' nella cella sopra)
        await page.keyboard.press('ArrowUp'); await page.waitForTimeout(200);
        await page.keyboard.press('Enter'); await page.waitForTimeout(300);
        for (let k = 0; k < 12 && !met; k++) {
          met = await page.evaluate(() => !document.getElementById('battleScreen').hidden);
          if (!met) { await page.keyboard.press('Enter'); await page.waitForTimeout(250); }
        }
      }
      if (!met) fail(currentStep, `${gate.id} non ha intercettato il giocatore`);
      save = await fightTrainer(page, currentStep, gate.id, {
        maxTurns: 80,
        stopWhen: isHills ? (s => s.badges.includes(1)) : undefined
      });
    }
    if (!save.badges.includes(1)) fail(currentStep, 'Medaglia Spirito (badge 1) non assegnata', save.badges);
    log('Hills sconfitto, badge', JSON.stringify(save.badges));

    // Assistente vicino all'ingresso da' la MT Velenospina.
    await walkTo(page, 15, 4);
    await page.keyboard.press('ArrowUp'); await page.waitForTimeout(200);
    await page.keyboard.press('Enter'); await page.waitForTimeout(350);
    await advanceDialogue(page, { maxPages: 4 });
    save = await getSave(page);
    if (!(save.items.mt_velenospina >= 1)) fail(currentStep, 'MT Velenospina non ricevuta', save.items);
    log('MT Velenospina ricevuta');

    // Esce dalla palestra.
    await walkTo(page, 11, 18);
    await page.keyboard.press('ArrowDown'); await page.waitForTimeout(400);
    save = await getSave(page);
    if (save.player.map !== 'castel_di_lama') fail(currentStep, 'uscita dalla palestra non avvenuta', save.player);
    await screenshot(page, '03-post-hills');

    // -----------------------------------------------------------------
    currentStep = 'verso-costa';
    // Ora con badge 1 il passaggio est e' aperto: attraversa spinetoli e costa.
    const chain2 = [
      { from: 'castel_di_lama', exitX: 177, exitY: 55, key: 'ArrowRight', to: 'spinetoli_centobuchi' },
      { from: 'spinetoli_centobuchi', exitX: 177, exitY: 55, key: 'ArrowRight', to: 'costa' }
    ];
    for (const step of chain2) {
      save = await getSave(page);
      if (save.player.map !== step.from) fail(currentStep, `atteso su ${step.from}, trovato ${save.player.map}`);
      const rr = await walkToFighting(page, step.exitX, step.exitY);
      if (!rr.ok) fail(currentStep, `impossibile raggiungere l'uscita di ${step.from}`, rr);
      await page.keyboard.press(step.key); await page.waitForTimeout(400);
      save = await getSave(page);
      if (save.player.map !== step.to) fail(currentStep, `transizione ${step.from} -> ${step.to} non avvenuta`, save.player);
      log(`attraversata ${step.from} -> ${step.to}`);
    }

    // -----------------------------------------------------------------
    currentStep = 'ivo-teo';
    // Ivo e Teo (i "congressisti") sono a (60,86)/(61,86): ci si avvicina da sotto Ivo.
    await walkToFighting(page, 60, 87);
    await page.keyboard.press('ArrowUp'); await page.waitForTimeout(200);
    await page.keyboard.press('Enter'); await page.waitForTimeout(350);
    await advanceDialogue(page, { maxPages: 12 });
    save = await getSave(page);
    if (!save.flags.ivo_teo_visti) fail(currentStep, 'flag ivo_teo_visti non impostato', save.flags);
    log('Ivo e Teo incontrati, flag impostato');

    // -----------------------------------------------------------------
    currentStep = 'verso-jonathan';
    // costa_dj_1 e' fisso sulla riga 55 (x=165, sight 3): camminare verso est lo intercetta a meta' strada.
    // costa_dj_1 sta sul lungomare verso l'uscita est: se intercetta il giocatore lo si combatte
    // (walkToFighting), ma il percorso BFS puo' anche aggirarlo: non e' obbligato.

    r = await walkToFighting(page, 177, 55);
    if (!r.ok) fail(currentStep, "impossibile raggiungere l'uscita est di costa", r);
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
    save = await getSave(page);
    if (save.player.map !== 'jonathan') fail(currentStep, 'transizione verso jonathan non avvenuta', save.player);
    await screenshot(page, '04-jonathan');
    log('arrivato allo Jonathan');

    // -----------------------------------------------------------------
    currentStep = 'nando-3';
    // Nando aspetta nel vialetto d'ingresso (x=72, y=51-53 a seconda dello starter di Nando),
    // rivolto a sud, sight 4: risalendo x=72 verso la porta della discoteca (72,50) lo si intercetta.
    const metNando3 = await walkUntilBattle(page, 72, 56);
    if (!metNando3) fail(currentStep, 'Nando 3 non ha intercettato il giocatore lungo il percorso');
    save = await fightTrainer(page, currentStep, 'jonathan_nando_puledrotto');
    log('Nando 3 sconfitto');

    // -----------------------------------------------------------------
    currentStep = 'palestra-2';
    await forceTeamLevel(page, 45);
    r = await walkTo(page, 72, 50); // cella-porta della discoteca
    if (!r.ok) fail(currentStep, 'impossibile raggiungere la porta della discoteca', r);
    await page.keyboard.press('Enter'); await page.waitForTimeout(500);
    save = await getSave(page);
    if (save.player.map !== 'palestra_costa') fail(currentStep, 'ingresso in palestra_costa non avvenuto', save.player);
    log('entrato allo Jonathan (palestra)');

    // Corridoio con i tre Bro della Security (x=14, y decrescente), poi Riccio in fondo.
    const discoGates = [
      { x: 14, y: 19, id: 'jonathan_bro_security_1' },
      { x: 14, y: 14, id: 'jonathan_bro_security_2' },
      { x: 14, y: 10, id: 'jonathan_bro_security_3' },
      { x: 14, y: 6, id: 'costa_riccio' }
    ];
    for (const gate of discoGates) {
      const isRiccio = gate.id === 'costa_riccio';
      let met = await walkUntilBattle(page, gate.x, gate.y);
      if (!met && isRiccio) {
        await page.keyboard.press('ArrowUp'); await page.waitForTimeout(200);
        await page.keyboard.press('Enter'); await page.waitForTimeout(300);
        for (let k = 0; k < 12 && !met; k++) {
          met = await page.evaluate(() => !document.getElementById('battleScreen').hidden);
          if (!met) { await page.keyboard.press('Enter'); await page.waitForTimeout(250); }
        }
      }
      if (!met) fail(currentStep, `${gate.id} non ha intercettato il giocatore`);
      save = await fightTrainer(page, currentStep, gate.id, {
        maxTurns: 80,
        stopWhen: isRiccio ? (s => !!s.flags.demo_finita) : undefined
      });
    }
    if (!save.badges.includes(2)) fail(currentStep, 'Medaglia Balneare (badge 2) non assegnata', save.badges);
    if (!save.flags.demo_finita) fail(currentStep, 'flag demo_finita non impostato', save.flags);
    log('Riccio sconfitto, badge', JSON.stringify(save.badges));

    // -----------------------------------------------------------------
    currentStep = 'titoli-di-coda';
    const creditsVisible = await page.evaluate(() => !document.getElementById('creditsScreen').hidden);
    if (!creditsVisible) fail(currentStep, 'schermata dei titoli di coda non apparsa dopo il badge 2');
    await screenshot(page, '05-credits');
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    log('titoli di coda mostrati, demo_finita impostato');

    // Assistente vicino a Riccio da' la MT Idrogetto.
    await walkTo(page, 12, 5);
    await page.keyboard.press('ArrowUp'); await page.waitForTimeout(200);
    await page.keyboard.press('Enter'); await page.waitForTimeout(350);
    await advanceDialogue(page, { maxPages: 4 });
    save = await getSave(page);
    if (!(save.items.mt_idrogetto >= 1)) fail(currentStep, 'MT Idrogetto non ricevuta', save.items);
    log('MT Idrogetto ricevuta');

    await screenshot(page, '06-fine');

    // Gli errori attesi (sprite mancanti per specie non ancora disegnate, cfr. ARCHITETTURA.md) non
    // fanno fallire il playthrough: solo eventuali PAGEERROR (eccezioni JS reali) lo fanno.
    const realErrors = errors.filter(e => e.startsWith('PAGEERROR'));
    if (realErrors.length) fail('console', 'errori JS reali rilevati durante il playthrough', realErrors);

    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
    console.log(`\nPLAYTHROUGH OK in ${elapsed}s`);
    await browser.close();
  } catch (err) {
    const step = err.step || currentStep;
    try { await screenshot(page, `FAIL-${step}`); } catch { /* ignore */ }
    console.error(`\nPLAYTHROUGH FALLITO al passo "${step}": ${err.message}`);
    if (errors.length) console.error('Errori console/JS:', JSON.stringify(errors));
    await browser.close();
    process.exitCode = 1;
  }
}

await main();
