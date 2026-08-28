---
name: crea-scheda
description: Crea una nuova scheda Pokémon per Wikascolemon (bozza in "schede _Pokemon/"), clonando il template delle schede esistenti. Gestisce sia il caso con immagine fornita (incorporata in base64) sia senza immagine (placeholder tratteggiato in attesa dell'artwork). Usare quando l'utente chiede di creare/inventare/scrivere una nuova scheda Pokémon, o quando fornisce l'immagine per una scheda già creata con placeholder.
---

# Crea scheda Pokémon (Wikascolemon)

Crea una **bozza** di scheda in `schede _Pokemon/` (NON in `Wikascolemon/` — la pubblicazione è compito della skill `pubblica-scheda`).

## 0. Raccogli i dati

Dal prompt dell'utente servono almeno: **nome**, **concept/personaggio**, **luogo del Piceno** di riferimento. Se mancano, chiedi. Tutto il resto (tipi, categoria, statistiche, mosse, lore) puoi inventarlo tu in modo coerente col concept — proponi e procedi, l'utente correggerà.

Determina il **numero di Pokédex**. Il dex è **uno solo — il Pokédex del Piceno** — e la numerazione è *semantica*, non progressiva: alcuni blocchi sono riservati dal brief di progetto (`brief_piceno.html`) e non vanno occupati.

| Blocco | Destinazione |
|---|---|
| #001-#003 | Linea starter Erba: Basilino, Turibasil, Vescovasil ✅ |
| #004-#006 | Linea starter Fuoco: Puledrotto, Cavalbrace, Fuocavallo ✅ |
| #007-#009 | Linea starter Acqua: Tuffito, Brasero, Compadrone ✅ |
| #010-#014 | Banconio · Bree → Felignoto · Carpentrap · Spesurde ✅ |
| #015-#016 | Anicino → Anisetta ✅ |
| #017-#020 | Tamburino → Sbandiera → Quintanaro · Moro ✅ |
| #021-#023 | Tifotto → Sciarpone → Capultrà ✅ |
| #024-#026 | Soldatino → Batterino → Dehor ✅ |
| #027-#029 | Traffichiex → Forox · Notaiax ✅ |
| #030 | Maranzino ✅ |
| #031-#033 | Lettino → Ombrellone → Salvatorre ✅ |
| #034-#036 | Bagnetto → Coperto → Mixaro ✅ *(placeholder artwork)* |
| #037-#043 | Cozzetta → Scoglieràx · Alghetta → Mucillax · Pef'na → Ca'ità · Totera *(bozze)* |
| #044 | Cerqua — evoluzione di Totera ✅ |
| #045-#050 | Pito, Pozza, Umito, Segaccio, Venagrox, Ciccharizard ✅ |
| #051-#053 | Cignalò → Bracignale · Caciara ✅ |
| #054 | Trecaciare ✅ — evoluzione di Caciara, le capanne di pietra della Montagna dei Fiori |
| #055 | Pətò ✅ |
| #056-#057 | Vlurde · Moccolo ✅ — coppia di carnevale, esclusive di versione |
| #058 | Ciammarica ✅ |
| #059-#060 | Retrabbiə → Sammarò ✅ |
| #061-#068 | Ciucì → Ciuciòne · Sorcì → Sorcione · Zanzì → Zanzarax · Cavedì → Cavedòne ✅ — linee dei primi percorsi della Salaria |
| #069 | Bovfint ✅ — il bove finto di Offida, stessa festa di Vlurde #056 |
| #070-#071 | Frizzantina → Spumadiva ✅ — la spuma di Folignano, evoluzione per scambio e ritorno |
| #072 | Vecciandò ✅ — il calabrone del contado, l'ammazzasomari |
| #073 | Spettornado ✅ — il Tornado del 2014, spettro di fumo sulle colline di Monterocco |
| #074-#076 | Livetta → Liva → Ascolana ✅ — l'oliva ascolana in tre stadi: cruda, ripiena, fritta |
| #077 | Cremino ✅ — la crema fritta del fritto misto, primo Drago del dex |
| #078-#079 | Svedde → 'Ngenò ✅ — lo svelto di Pedaso che in città diventa sapientone |
| #080 | Pantafeca ✅ — la pantafica, il peso sul petto delle notti picene |
| #081 | Bettaccə ✅ — la rana dei fossi, un gracidare diverso per ogni paese |
| #082-#083 | Traguardo → Gionata ✅ — la linea del Gabbiano di San Benedetto |
| #084-#086 | Palombare → Lisciano → Idra ✅ — la linea dei Tre Versanti (colle San Giacomo) |
| #087-#089 | Calancolo → Tufone → Travertorre ✅ — la linea della terra picena: argilla, tufo, travertino |
| #090 | Farò ✅ — il faro del porto di San Benedetto, due lampi ogni dieci secondi |
| #091 | Ndandalusə ✅ — il dondolone dei paesi, evolve tra il 28 e il 40 quando gli pare |
| #092 | Sarchiapà ✅ — il personaggio che non c'è, bucherellato dove i racconti non combaciano |
| #093-#143 | Libero |
| #144-#146 | Fatella → Ancella → Sibilla ✅ — la linea del Monte Sibilla, pseudo-leggendaria (600) |
| #147 | Chirocefalo ✅ — il crostaceo glaciale del Lago di Pilato, accanto ai leggendari senza esserlo |
| **#148** | **Picchio ✅ — leggendario della partenza, coppia con Gommapiuma #149.**|
| **#149** | **Gommapiuma ✅ — leggendario del riposo, coppia con il Picchio #148.**|
| **#150** | **Pretalien ✅ — chiude il Pokédex.** Numero finale: non superarlo e non riassegnarlo. |

⚠️ **Prima di assegnare un numero, fai `git fetch origin` e leggi i numeri da `origin/main`.** Sul dex lavorano più agenti in parallelo, e la tabella qui sopra è una copia locale che invecchia: è già successo **due volte** che una linea nuova nascesse su numeri occupati poche ore prima (Maranzino contro Traffichiex, e la linea della spiaggia contro Forox/Notaiax/Maranzino). La verità sono i file pubblicati, non questa tabella.

Regola: scansiona i file in `Wikascolemon/` e `schede _Pokemon/`, e assegna il **primo numero libero coerente col concept** (una linea starter va nel suo blocco riservato; una specie qualsiasi prende il primo libero da #091 in su). Non assegnare mai "il più alto + 1" senza guardare la tabella. La navigazione `.dexnav` tollera i buchi: il vicino mancante si scrive `<span class="dim">#0NN: ???</span>`.

## 1. Clona il template

Usa come base strutturale la scheda pubblicata più recente (attualmente `Wikascolemon/segaccio.html`; `schede _Pokemon/venagrox.html` mostra la variante con `<img>` JPEG incorporati). **Copia il CSS integralmente** e cambia solo:

- `--accent1` / `--accent2` in `:root` — coppia di colori identitaria della pagina (derivata dai tipi del Pokémon; segaccio usa `#5aa63e`/`#8f8fae` per Erba/Acciaio).
- I `<symbol>` in `<defs>`: crea un `impronta-<nome>` (SVG semplice, fill `#54595d`, viewBox `0 0 40 40`) ed eventuali icone tematiche.

I colori dei 18 tipi sono già tutti in `:root` (`--roccia`, `--erba`, ecc.) con le classi `.t-<tipo>` — non toccarli.

## 2. Anatomia della pagina (ordine obbligatorio)

Tutte le sezioni vanno presenti, nello stesso ordine delle schede esistenti:

1. `<title>NOME - Pokédex del Piceno</title>`, `lang="it"`, charset UTF-8
2. `.sitenotice` — link a `index.html`, identico alle altre schede
3. `.dexnav` (in alto): `← #0NN-1: Precedente` · `#0NN Nome` · `#0NN+1: ??? →` (il successivo resta `??? ` con classe `dim` finché non esiste)
4. `<h1>Nome</h1>`
5. `.infobox` (float destro):
   - `.head`: `.num` ("Pokédex del Piceno #0NN"), `.name`, `.cat` ("Pokémon <Categoria>")
   - `.art`: artwork (vedi §3) + `.capt` ("Artwork di NOME")
   - `.lang`: nomi EN e JA (con katakana + romaji)
   - `table` con le righe, in quest'ordine: Tipo, Abilità (prima/seconda/*speciale*), Sesso, Altezza, Peso, Tasso di cattura, Uovo (gruppo + cicli), Pokédex regionali, Tasso di allevamento, Esperienza base ceduta, Punti base ceduti, Colore Pokédex, Impronta (`<svg><use href="#impronta-..."/></svg>`), Affetto di base
6. `<p class="intro">` — "**Nome** è un Pokémon di tipo … di **Luogo**…" + paragrafo su evoluzione/origine
7. `.toc` — indice con anchor identici agli `id` delle sezioni
8. `<h2 id="Biologia">` con `<h3>`: Fisionomia (+ `<h4>Differenze tra i sessi</h4>`), Comportamento, Habitat, Dieta
9. `<h2 id="Dati_di_gioco">` con `<h3>`:
   - `id="Resistenze"` — `.effbox` con righe Debolezze / Danno normale / Resistenze / Immunità (badge `.type` + moltiplicatore `.effx`). **Calcola le efficacie reali** dalla type chart per la combinazione di tipi. Segue un `.notabene` di commento.
   - `id="Evoluzioni"` — `.evochain` con `.evocard` (artwork piccolo + nome + tipi) e `.evoarrow`; se specie singola, una sola card + `.notabene` "non si evolve".
   - `id="Statistiche"` — `.statbars`: 6 `.statrow` (classi `s-ps s-att s-dif s-asp s-dsp s-vel`) + riga Totale. **Larghezza barra = round(valore/150·100)%**. Segue `.notabene` di lettura competitiva.
   - `id="Mosse"` — `<h4>Aumentando di livello</h4>` e `<h4>Tramite MT/DT (selezione)</h4>`, tabelle `.wtable` con colonne Lv./Mossa/Tipo/Cat./Pot./Prec./PP; classe `.stab` sulle mosse col bonus di tipo; una **mossa esclusiva in grassetto** con nota `<small>` che spiega STAB ed effetto della mossa.
   - `id="Voci"` — `.dexentries`: 2 voci Pokédex (`<span class="ver">Versione Tronto</span>` e `Versione Laga`), corsive, tono da Pokédex.
10. Una `<h2>` **sezione tematica libera** legata al lore (es. "Sconfinamenti a Polesio") con `.itembox` — opzionale ma gradita.
11. `<h2 id="Curiosita">` — `<ul>` di curiosità + `<h3>Origine</h3>` (riferimenti reali al territorio piceno) + `<h4>Origine del nome</h4>` (etimologia IT + JA).
12. `<h2 id="Lingue">` — `.wtable` Lingua/Nome/Origine (Giapponese, Inglese, Francese, Spagnolo, Tedesco).
13. `<h2>Vedi anche</h2>` — link alle schede correlate (relativi, es. `pito.html`).
14. `.dexnav` (in basso, identica a quella in alto).
15. `.cats` — "**Categorie:** Pokémon · Pokémon della regione Piceno · Pokémon di tipo X · …" coerenti con la scheda.
16. `.footer` — nota fan-made + riferimento alle località reali citate.

## 3. Artwork: con o senza immagine

### Caso A — immagine fornita
1. Se serve, ridimensiona/converti in JPEG con PowerShell (System.Drawing) o strumento disponibile: un'immagine "art" (~800px lato lungo, qualità ~80) e una "thumb" (~240px) per l'evocard. Obiettivo: pagina finale sotto ~300 KB.
2. Codifica in base64: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("path"))` (scrivi l'output su file nella scratchpad, poi inseriscilo).
3. Incorpora: `<img src="data:image/jpeg;base64,..." alt="Artwork di NOME">` dentro `.infobox .art` e la thumb dentro `.evocard`. **Mai** riferimenti a file esterni: la pagina deve restare autosufficiente.

### Caso B — nessuna immagine (in attesa)
Nella `.infobox .art` usa il placeholder già previsto dal CSS:
```html
<div class="artph">Artwork di NOME<br>in arrivo</div>
```
e lo stesso nella `.evocard` (un `<div class="artph">` ridotto o un SVG segnaposto semplice). Segnala all'utente che la scheda è pronta ma in attesa dell'artwork.

### Caso C — arriva l'immagine per una scheda con placeholder
Individua la scheda (bozza o già pubblicata), sostituisci i `.artph` con gli `<img>` base64 come nel caso A, senza toccare altro. Se la scheda è già pubblicata, ricordati che serve un nuovo deploy (skill `pubblica-scheda` o commit diretto).

## 4. Verifica prima di consegnare

- La pagina si apre da sola: nessun `src`/`href` verso asset esterni (solo link relativi ad altre pagine locali e anchor).
- Encoding UTF-8, accenti corretti.
- Anchor del TOC = `id` delle sezioni.
- Larghezze barre statistiche coerenti con i valori; totale = somma.
- Efficacie tipo corrette per la combinazione di tipi.
- Le due `.dexnav` (alto/basso) identiche e con numeri giusti.
- Stile identico alle altre schede (confronto visivo del CSS, non riscritto).

Alla fine ricorda all'utente: per metterla online usare `/pubblica-scheda`.
