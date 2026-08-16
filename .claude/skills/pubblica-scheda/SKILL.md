---
name: pubblica-scheda
description: Aggiunge una scheda Pokémon già pronta alla wiki Wikascolemon e la mette online. Copia la bozza in Wikascolemon/, aggiorna la navigazione delle schede adiacenti, index.html e README.md, poi committa e pusha (GitHub Pages). Usare quando l'utente chiede di pubblicare/aggiungere/mettere online una scheda sulla wiki.
---

# Pubblica scheda su Wikascolemon

Prende una scheda pronta (di norma una bozza in `schede _Pokemon/`) e la integra nella wiki `Wikascolemon/` (repo git, deploy automatico via GitHub Pages: https://g95g95.github.io/Wikascolemon/).

## 0. Individua la scheda e verifica che sia pronta

1. Identifica il file da pubblicare (dal prompt, o la bozza più recente in `schede _Pokemon/`). Il nome file pubblicato è il nome del Pokémon in minuscolo: `<nome>.html` (rinomina se la bozza ha suffissi tipo `_6`).
2. Ricava dal file: **numero** (`Pokédex della Laga #0NN`), **nome**, **categoria**, **tipi**, **territorio** (dall'intro/Habitat) e una frase descrittiva per la card dell'indice.
3. Controlli minimi prima di pubblicare (se falliscono, fermati e segnala — la sistemazione è compito di `crea-scheda`):
   - nessun asset esterno (immagini solo `data:` o SVG inline; se c'è un `.artph` placeholder, avvisa l'utente che uscirebbe senza artwork e chiedi conferma);
   - numero successivo all'ultimo pubblicato, senza buchi né duplicati;
   - le due `.dexnav` interne coerenti col numero.

## 1. Copia nella wiki

Copia il file in `Wikascolemon/<nome>.html`. La bozza in `schede _Pokemon/` può restare.

## 2. Aggiorna la navigazione della scheda precedente

Nella scheda `#0NN-1` (es. `segaccio.html` per la #048), nelle **due** `.dexnav` (alto e basso) sostituisci:

```html
<span class="dim">#0NN: ??? →</span>
```
con
```html
<span><a href="<nome>.html">#0NN: Nome →</a></span>
```

Aggiorna anche la sezione "Vedi anche" della scheda precedente solo se il collegamento ha senso narrativo (non obbligatorio).

## 3. Aggiorna `index.html`

Due punti da toccare, in coda a ciascuno:

1. **`.cards`** — nuova card sul modello delle esistenti:
```html
<div class="card">
  <div class="head"><div class="num">#0NN</div><div class="nm">Nome</div><div class="cat">Pokémon Categoria</div></div>
  <div class="body">
    <div class="types"><span class="type t-tipo1">Tipo1</span><span class="type t-tipo2">Tipo2</span></div>
    Frase descrittiva breve (1-2 righe).
  </div>
  <a class="go" href="nome.html">Vai alla scheda →</a>
</div>
```
2. **Indice rapido** (`.wtable`) — nuova riga con N°, Nome (link in grassetto), Categoria, Tipi (badge), Territorio.

Attenzione: `index.html` ha in `:root` **solo i colori dei tipi già usati**. Se la nuova scheda introduce un tipo nuovo per l'indice, aggiungi la variabile (`--fuoco:#F08030` ecc. — copia il valore dalle schede) e la classe `.t-<tipo>` corrispondente, replicando le eccezioni di contrasto delle schede (terra/acciaio/elettro/folletto/ghiaccio usano testo scuro senza text-shadow).

## 4. Aggiorna `README.md`

Aggiungi la riga alla tabella "Pokédex della Laga":
```
| #0NN | [Nome](nome.html) | Pokémon Categoria | Tipo1/Tipo2 | Località (zona) |
```

## 5. Deploy

Dentro `Wikascolemon/`:
```
git add <nome>.html <precedente>.html index.html README.md
git status   # verifica che ci sia SOLO quello che ti aspetti
git commit -m "Aggiunta scheda #0NN Nome"
git push
```
Prima del push mostra all'utente il riepilogo di cosa stai per pubblicare; dopo il push ricorda che GitHub Pages impiega qualche minuto e dai il link diretto: `https://g95g95.github.io/Wikascolemon/<nome>.html`.

## 6. Chiusura

- Se `schede _Pokemon/tasks/todo.md` traccia questa scheda, spunta le voci completate.
- Riepiloga: file toccati, numero assegnato, link live.
