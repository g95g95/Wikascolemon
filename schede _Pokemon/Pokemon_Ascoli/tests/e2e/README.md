# Test end-to-end (opzionale)

`tests/e2e/` esegue un playthrough completo del gioco in un vero browser (Chromium/Edge headless),
dalla stazione fino ai titoli di coda. Non è richiesto per giocare né per i test unitari
(`node tests/*.mjs`, che non toccano questa cartella): è una dipendenza di sviluppo opzionale.

## Installazione

```powershell
cd "tests/e2e"
npm i -D playwright-core
```

`playwright-core` da solo non scarica un browser: serve un eseguibile Chromium o Edge già
presente sul sistema (vedi sotto). Se preferisci un Chromium dedicato, puoi scaricarlo con
`npx playwright install chromium` dopo l'`npm i` sopra.

## Eseguibile del browser

Lo script cerca, in ordine:

1. la variabile d'ambiente `CHROME_PATH` (percorso completo a `chrome.exe`/`msedge.exe`);
2. `C:/Users/pisel/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe` (Chromium
   scaricato da Playwright, se presente);
3. `C:/Program Files/Google/Chrome/Application/chrome.exe`;
4. `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`;
5. `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`;
6. `C:/Program Files/Microsoft/Edge/Application/msedge.exe`.

Se nessuno esiste, l'esecuzione si interrompe con un errore chiaro. Esempio con Edge:

```powershell
$env:CHROME_PATH = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
node run.mjs
```

## Esecuzione

Dalla cartella del gioco (`schede _Pokemon/Pokemon_Ascoli/`):

```powershell
node tests/e2e/run.mjs
```

Se `playwright-core` non è installato, lo script stampa `e2e saltato: installa playwright-core
(vedi README)` ed esce con codice 0 (non fa fallire una pipeline di test più ampia).

Con `playwright-core` installato esegue `playthrough.mjs`: crea una nuova partita, sceglie
Basilino da Bobby, sfida Nando, visita il Teatro Ventidio Basso, attraversa la Salaria fino a
Castel di Lama, batte Hills (Medaglia Spirito + MT Velenospina), prosegue fino alla Costa (Ivo e
Teo), entra allo Jonathan, batte Nando, i tre Bro della Security e Riccio (Medaglia Balneare +
MT Idrogetto + titoli di coda). Per velocizzare la lotta contro i capipalestra la squadra viene
portata a un livello alto via `forceTeamLevel` invece di macinare esperienza. Richiede meno di 10
minuti; in caso di fallimento stampa il passo in cui si è fermato e salva uno screenshot in
`tests/e2e/shots/FAIL-<passo>.png` (cartella ignorata da git).

## File

- `helpers.mjs` — apertura del gioco, navigazione BFS, lotta automatica, dialoghi, forzatura
  livello squadra, screenshot.
- `playthrough.mjs` — lo scenario completo con asserzioni (`node:assert`).
- `run.mjs` — entry point che salta se `playwright-core` manca.
- `package.json` — dipendenza di sviluppo opzionale, `node_modules/` è ignorato da git.
