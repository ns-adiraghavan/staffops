// Thin static file server for EC2.
//
// After `npm run build`, this serves the production bundle in dist/ and
// falls back to index.html for client-side routing. Run behind nginx or
// a process manager (pm2) in production. See README for the full flow.
//
// This is intentionally minimal. When the Phase-1 backend lands (Express
// API + Google Drive storage per the PRD), add the API routes here and
// point the frontend store at them — see src/data/store.ts.

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 8080;

const app = express();

// Basic health check for load balancers / uptime monitors.
app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'ns-staffops' }));

// Static assets (hashed filenames get long cache; index.html stays fresh).
app.use(
  express.static(dist, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
    },
  })
);

// SPA fallback — every non-asset route returns the app shell.
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));

app.listen(port, () => {
  console.log(`NS StaffOps running on http://0.0.0.0:${port}`);
});
