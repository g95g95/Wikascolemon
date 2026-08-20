# Pokémon Ascoli — demo statica

Aprire `index.html` direttamente nel browser. Non servono installazione, server, account o chiavi API.

- Frecce o WASD: movimento cella per cella.
- Invio, Spazio o A: interazione.
- M: menu.
- X, Esc o B: indietro.

Il gioco salva automaticamente in `localStorage`. Dal menu **Salva** è possibile esportare e importare la partita in JSON.

`configuratore.html` modifica mappe, collisioni, incontri, edifici, passaggi, NPC e tabelle dei Pokémon. Le modifiche sono locali; dopo averle salvate, ricaricare il gioco per applicarle. Il configuratore può esportare e importare il proprio JSON.

Per eseguire i controlli automatici:

```powershell
node tests/regression.mjs
```
