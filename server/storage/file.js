// Local-file storage adapter. Zero setup, zero cost — the default.
// State lives in one JSON file; uploaded résumés live under files/.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'state.json');
const FILES_DIR = path.join(DATA_DIR, 'files');

const EMPTY = { requirements: [], vendors: [], candidates: [], activity: [] };

export function createFileStore() {
  return {
    kind: 'file',
    async getState() {
      try {
        return JSON.parse(await fs.readFile(FILE, 'utf8'));
      } catch {
        return EMPTY;
      }
    },
    async putState(state) {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(state, null, 2), 'utf8');
      return true;
    },
    async putFile({ name, mime, buffer }) {
      await fs.mkdir(FILES_DIR, { recursive: true });
      const id = crypto.randomUUID();
      await fs.writeFile(path.join(FILES_DIR, id + '.bin'), buffer);
      await fs.writeFile(path.join(FILES_DIR, id + '.json'), JSON.stringify({ name, mime }), 'utf8');
      return id;
    },
    async getFile(id) {
      try {
        const meta = JSON.parse(await fs.readFile(path.join(FILES_DIR, id + '.json'), 'utf8'));
        const buffer = await fs.readFile(path.join(FILES_DIR, id + '.bin'));
        return { name: meta.name, mime: meta.mime, buffer };
      } catch {
        return null;
      }
    },
  };
}
