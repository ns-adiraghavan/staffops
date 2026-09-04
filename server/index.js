// NS StaffOps server — static host + shared-state API.
//
// Serves the built SPA (dist/) and exposes a small JSON API backed by a
// storage adapter (local file by default, Google Drive when configured).
// Run: `npm run build && npm start`. In dev, run this alongside Vite —
// Vite proxies /api here (see vite.config.ts).
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createStore } from './storage/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 8080;

const app = express();
app.use(express.json({ limit: '25mb' })); // headroom for base64 résumé uploads

const store = await createStore();

// --- API ---
app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'ns-staffops', storage: store.kind }));

app.get('/api/state', async (_req, res) => {
  try {
    res.json(await store.getState());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    const s = req.body;
    if (!s || !Array.isArray(s.requirements)) return res.status(400).json({ error: 'invalid state' });
    await store.putState(s);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Files (résumés) ---
app.post('/api/files', async (req, res) => {
  try {
    const { name, mime, dataBase64 } = req.body || {};
    if (!dataBase64) return res.status(400).json({ error: 'no data' });
    const buffer = Buffer.from(dataBase64, 'base64');
    const id = await store.putFile({ name: name || 'resume', mime, buffer });
    res.json({ id, name: name || 'resume' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/files/:id', async (req, res) => {
  try {
    const f = await store.getFile(req.params.id);
    if (!f) return res.status(404).json({ error: 'not found' });
    res.setHeader('Content-Type', f.mime || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${(f.name || 'file').replace(/"/g, '')}"`);
    res.send(f.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Static SPA (only if a build exists) ---
if (fs.existsSync(dist)) {
  app.use(
    express.static(dist, {
      setHeaders(res, filePath) {
        if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    })
  );
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  console.log('[server] dist/ not found — API only (run `npm run build` for the SPA).');
}

app.listen(port, () => console.log(`NS StaffOps on http://0.0.0.0:${port} (storage: ${store.kind})`));
