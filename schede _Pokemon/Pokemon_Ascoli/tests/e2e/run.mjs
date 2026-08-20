// Entry point del test e2e: se playwright-core non è installato (dipendenza opzionale), salta
// senza fallire la suite; altrimenti esegue il playthrough completo.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

try {
  require.resolve('playwright-core');
} catch {
  console.log('e2e saltato: installa playwright-core (vedi README)');
  process.exit(0);
}

await import('./playthrough.mjs');
