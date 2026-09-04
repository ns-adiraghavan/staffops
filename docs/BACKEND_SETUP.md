# Backend setup — shared data via Express + Google Drive

The beta runs per-browser (localStorage) with **no backend needed**. This adds
shared, server-stored data so the whole team sees the same requirements,
candidates and vendors.

## Cost

- **Google Drive + service account: no incremental cost.** It's part of Google
  Workspace (already paid for), and Drive API calls are free at NS volume.
  Drive's version history gives a free audit trail.
- The only cost is **hosting the server**: an EC2 `t3.small` is ≈ $15–18/month.
  For free testing, the same API can run as serverless functions on Vercel's
  free tier — Drive calls from there are still free.

## Two storage modes

The server picks a storage adapter from `STORAGE`:

- `STORAGE=file` (default) — writes `server/data/state.json`. Zero setup. Good
  for a single EC2 box; survives restarts. **Start here.**
- `STORAGE=drive` — reads/writes one `state.json` in a shared NS Drive folder.

Either way the frontend is identical; turn on sync with `VITE_API=1`.

## Run it locally (file mode)

```bash
cp .env.example .env        # set VITE_API=1
npm install
npm run build
npm start                   # serves the app + API on :8080, storage: file
```

Open two browsers — they now share data through the server.

Dev with hot reload: run `npm run server` in one terminal and `npm run dev` in
another (Vite proxies `/api` to the server).

## Switch to Google Drive

1. In Google Cloud (any project on the NS Workspace org), enable the **Google
   Drive API** and create a **Service Account**; download its **JSON key**.
2. In Drive, create a folder e.g. **NS StaffOps**, and **share it with the
   service account's `client_email` as Editor**.
3. Set in `.env`:
   ```
   STORAGE=drive
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   GDRIVE_FOLDER_ID=<the folder id from its URL>
   ```
4. `npm start`. On first write the server creates `state.json` in that folder.
   The team can open the folder directly in Drive as a fallback.

Open decisions from the PRD still apply: which NS account owns the folder and
the service account (recommend a shared team account, not a personal Drive),
and the app domain for vendor upload links.

## What's shared

With `VITE_API=1` everything is shared through the server:

- **Structured data** — requirements, candidates, vendors, paperwork, notes,
  activity — as `state.json` (local file or Drive).
- **Résumé/CV files** — uploaded from the vendor view or Add-candidate go to
  the backend (`POST /api/files`) and download via `GET /api/files/:id`. In
  file mode they live under `server/data/files/`; in Drive mode they're
  created in the shared folder. With the API off, the filename is captured but
  bytes stay in the browser only.
