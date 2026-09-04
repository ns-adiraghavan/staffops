# NS StaffOps — Beta

Internal staff-augmentation platform for Netscribes. Sales raises requirements,
staffing builds rate cards, vendors submit candidates through token links, and
the team tracks the pipeline end to end. Built for the NS team and its vendor
network — clients never touch it.

This is the **beta (no AI)**: everything is template-driven and deterministic.
The AI features in the PRD (candidate ranking, AI JD drafting, MOM→skill match)
are intentionally left out; their manual equivalents ship here.

> Status: React SPA + localStorage, with a thin Express server for EC2. The
> storage layer is isolated in one file so the Phase-1 backend (Express API +
> Google Drive JSON) can drop in without touching the UI. See
> [Roadmap → backend](#swapping-in-the-real-backend).

---

## Tech stack

- **React 18 + TypeScript**, built with **Vite**
- **docx** (docx-js) for real Format A / B JD and anonymised-résumé `.docx`
- **Express** static server for production hosting on EC2
- **localStorage** for persistence today (swappable — see below)

No database, no API keys, no build-time secrets. It runs as-is.

---

## Quick start (local)

```bash
npm install
npm run dev            # Vite dev server, hot reload → http://localhost:5173
```

Production preview of the actual bundle the server ships:

```bash
npm run build          # tsc + vite build → dist/
npm start              # Express serves dist/ → http://localhost:8080
```

---

## Push to GitHub

```bash
git init
git add .
git commit -m "NS StaffOps beta"
git branch -M main
git remote add origin git@github.com:<your-org>/ns-staffops.git
git push -u origin main
```

`node_modules/` and `dist/` are gitignored — only source is committed.

---

## Deploy on EC2

Recommended: `t3.small` in `ap-south-1` (Mumbai), per the PRD.

```bash
# on the instance (Amazon Linux 2023 / Ubuntu)
sudo dnf install -y nodejs git          # or: sudo apt install -y nodejs npm git
git clone https://github.com/<your-org>/ns-staffops.git
cd ns-staffops
npm ci
npm run build
PORT=8080 node server/index.js
```

Keep it running with pm2 and front it with nginx for TLS:

```bash
npm i -g pm2
pm2 start server/index.js --name ns-staffops --update-env
pm2 save && pm2 startup
```

Example nginx reverse proxy (`staffops.ns.in` → the domain from the PRD's open
decisions):

```nginx
server {
  server_name staffops.ns.in;
  location / { proxy_pass http://127.0.0.1:8080; proxy_set_header Host $host; }
}
```

Health check for a load balancer / uptime monitor: `GET /healthz`.

---

## Project layout

```
ns-staffops/
├─ server/index.js         Express static server (dist/) + /healthz + SPA fallback
├─ index.html              Vite entry
├─ src/
│  ├─ main.tsx  App.tsx     bootstrap + screen router
│  ├─ app-context.tsx       navigation, toast, modal, cross-screen intents
│  ├─ types.ts              domain types
│  ├─ data/
│  │  ├─ seed.ts            real NS vendor list + demo requirements/candidates
│  │  └─ store.ts           ← the ONE place storage lives (localStorage today)
│  ├─ lib/
│  │  ├─ rates.ts           NS rate card + cost benchmarks
│  │  ├─ constants.ts       stages, statuses, labels, formatting
│  │  ├─ jd.ts              Format A / B .docx (follows the JD format guide)
│  │  ├─ anonymise.ts       redaction rules + NS anonymised-résumé .docx
│  │  └─ download.ts        blob download + rich-table clipboard
│  ├─ components/           Sidebar, Modal, shared UI, the three entity forms
│  └─ screens/              Dashboard, Requirements, RequirementDetail,
│                           Vendors, VendorUpload, RateCard, Generate
```

---

## What's in the beta

| Module | Status in beta |
|---|---|
| Requirements intake + status tracking | ✅ create / edit / filter, full pipeline statuses |
| Candidate lifecycle | ✅ Received → Reviewed → Shortlisted → Interview → Report → Accepted / Rejected, inline stage change, manual **fit flag** (stands in for AI ranking) |
| Vendor token upload | ✅ preview + functional submit (adds a real candidate) |
| Vendor management + tags | ✅ add / edit, per-vendor CV & shortlist counts |
| Rate card builder | ✅ 17 skill groups, auto-margin, USD/INR, internal/client view, copy-to-Word |
| JD generator | ✅ **real Format A / B `.docx`** per `ns_jd_format_guide.md` |
| Résumé anonymiser | ✅ rules-based, **operator picks which categories to strip**, outputs `.docx` in the NS template |
| Client package | ✅ manual selection → anonymised summary table, copy-to-email |
| **AI candidate ranking** | ⛔ out of beta (manual stage + fit flag instead) |
| **AI JD drafting / MOM→skill match** | ⛔ out of beta (template-fill instead) |

### A note on the anonymiser

Redaction is **regex + operator-supplied names** — a fast first pass, not a
guaranteed scrub. Always eyeball the output before it leaves the building. A
future LLM pass (PRD Phase 3) would catch the edge cases rules miss.

---

## Swapping in the real backend

Every screen reads through `useDB()` and writes through the mutation helpers in
**`src/data/store.ts`** — no component imports `localStorage` directly. To wire
the Phase-1 backend (Express API + Google Drive JSON per the PRD):

1. Add the API routes to `server/index.js` (Drive service-account credentials
   live on the EC2 host, never in the browser).
2. In `store.ts`, change the mutation helpers to call those routes and refresh
   `db` from the server response. Keep the same exported function names.

The UI does not change. CV file uploads (currently a placeholder dropzone on the
vendor page) attach to the same Drive folder structure the PRD defines.

---

*Netscribes — Internal & Confidential.*
