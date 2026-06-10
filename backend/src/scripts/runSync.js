/**
 * PRODE-3: Script CLI de sincronización
 * T-Shirt: S
 */
import { db } from './config/db.js';
import { syncService } from './services/syncService.js';

async function main() {
  await db.connect();
  const result = await syncService.runFullSync();
  console.log(JSON.stringify(result, null, 2));
  await db.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await db.disconnect();
  process.exit(1);
});
