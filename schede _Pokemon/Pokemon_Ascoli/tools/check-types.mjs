// check-types.mjs — ricalcola la tabella «Resistenze e vulnerabilità» di ogni scheda
// dalla type chart ufficiale (Gen 6+) e segnala le caselle che non tornano.
//   node tools/check-types.mjs                 → tutte le schede pubblicate in Wikascolemon/
//   node tools/check-types.mjs a.html b.html   → solo quelle
// Le schede senza riga «Danno normale» sono ammesse: una casella assente vale 1×.
// Eccezioni note (non sono errori): Anisetta, Pretalien e Vescovasil elencano la Terra
// anche a 0× «con Levitazione»; Quintanaro mostra la tabella della forma Acciaio/Folletto.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const T=['normale','fuoco','acqua','elettro','erba','ghiaccio','lotta','veleno','terra','volante','psico','coleot','roccia','spettro','drago','buio','acciaio','folletto'];
// attacker -> {defender: mult}
const C={
 normale:{roccia:.5,acciaio:.5,spettro:0},
 fuoco:{fuoco:.5,acqua:.5,erba:2,ghiaccio:2,coleot:2,roccia:.5,drago:.5,acciaio:2},
 acqua:{fuoco:2,acqua:.5,erba:.5,terra:2,roccia:2,drago:.5},
 elettro:{acqua:2,elettro:.5,erba:.5,terra:0,volante:2,drago:.5},
 erba:{fuoco:.5,acqua:2,erba:.5,veleno:.5,terra:2,volante:.5,coleot:.5,roccia:2,drago:.5,acciaio:.5},
 ghiaccio:{fuoco:.5,acqua:.5,erba:2,ghiaccio:.5,terra:2,volante:2,drago:2,acciaio:.5},
 lotta:{normale:2,ghiaccio:2,veleno:.5,volante:.5,psico:.5,coleot:.5,roccia:2,spettro:0,buio:2,acciaio:2,folletto:.5},
 veleno:{erba:2,veleno:.5,terra:.5,roccia:.5,spettro:.5,acciaio:0,folletto:2},
 terra:{fuoco:2,elettro:2,erba:.5,veleno:2,volante:0,coleot:.5,roccia:2,acciaio:2},
 volante:{elettro:.5,erba:2,lotta:2,coleot:2,roccia:.5,acciaio:.5},
 psico:{lotta:2,veleno:2,psico:.5,buio:0,acciaio:.5},
 coleot:{fuoco:.5,erba:2,lotta:.5,veleno:.5,volante:.5,psico:2,spettro:.5,buio:2,acciaio:.5,folletto:.5},
 roccia:{fuoco:2,ghiaccio:2,lotta:.5,terra:.5,volante:2,coleot:2,acciaio:.5},
 spettro:{normale:0,psico:2,spettro:2,buio:.5},
 drago:{drago:2,acciaio:.5,folletto:0},
 buio:{lotta:.5,psico:2,spettro:2,buio:.5,folletto:.5},
 acciaio:{fuoco:.5,acqua:.5,elettro:.5,ghiaccio:2,roccia:2,acciaio:.5,folletto:2},
 folletto:{fuoco:.5,lotta:2,veleno:.5,drago:2,buio:2,acciaio:.5},
};
const mult=(a,d)=>C[a]?.[d]??1;
const WIKI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../Wikascolemon");
const files = process.argv.length > 2 ? process.argv.slice(2)
  : fs.readdirSync(WIKI).filter(f => f.endsWith(".html") && !/^(index|brief_)/.test(f)).map(f => path.join(WIKI, f));
const ECCEZIONI = new Set(['anisetta.html', 'pretalien.html', 'vescovasil.html', 'quintanaro.html']);
let bad = 0;
for (const f of files) {
  if (process.argv.length <= 2 && ECCEZIONI.has(path.basename(f))) continue;
  const h=fs.readFileSync(f,'utf8');
  const types=[...h.match(/<tr><th>Tipo<\/th><td>(.*?)<\/td>/)[1].matchAll(/t-([a-z]+)/g)].map(m=>m[1]);
  const box=h.match(/<div class="effbox">([\s\S]*?)<h3/)[1];
  const rows={};
  for (const m of box.matchAll(/<div class="efflabel">([^<]+)<\/div><div class="effcells">([\s\S]*?)<\/div><\/div>/g)) {
    const cells=[...m[2].matchAll(/t-([a-z]+)">[^<]*<\/span>(?:<span class="effx">([^<]*)<\/span>)?/g)];
    for (const c of cells) rows[c[1]]=(m[1]==='Danno normale')?'1':(c[2]||'?').replace('×','');
  }
  const errs=[];
  for (const a of T) {
    let e=1; for (const d of types) e*=mult(a,d);
    const exp=e===0?'0':e===.25?'¼':e===.5?'½':e===1?'1':e===2?'2':'4';
    const got=rows[a]??'1';
    if (got!==exp) errs.push(`${a}: scheda ${got}, atteso ${exp}`);
  }
  if (errs.length) { bad++; console.log(path.basename(f), types.join('/'), '\n  ✗ ' + errs.join('\n  ✗ ')); }
}
console.log(`${files.length} schede controllate, ${bad} con caselle da rivedere`);
