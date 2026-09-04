// Picks the storage adapter from the environment.
//   STORAGE=drive  → Google Drive (needs service-account creds + folder id)
//   STORAGE=file   → local JSON file (default; zero setup)
import { createFileStore } from './file.js';

export async function createStore() {
  const kind = (process.env.STORAGE || 'file').toLowerCase();
  if (kind === 'drive') {
    try {
      const { createDriveStore } = await import('./drive.js');
      const store = await createDriveStore();
      console.log('[storage] Google Drive adapter active');
      return store;
    } catch (err) {
      console.error('[storage] Drive adapter failed, falling back to file:', err.message);
    }
  }
  console.log('[storage] Local file adapter active (server/data/state.json)');
  return createFileStore();
}
