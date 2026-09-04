// Google Drive storage adapter (no incremental cost — included with Google
// Workspace). A service account reads/writes a single state.json inside a
// shared NS StaffOps Drive folder. Drive's own version history gives a free
// audit trail. This mirrors the PRD's data layer.
//
// Requires (see .env.example):
//   GOOGLE_APPLICATION_CREDENTIALS = path to the service-account JSON key
//   GDRIVE_FOLDER_ID               = id of the shared NS StaffOps folder
//                                    (share that folder with the service
//                                     account's client_email as Editor)
//
// googleapis is imported lazily so the server still boots without it when
// the file adapter is in use.
const STATE_NAME = 'state.json';
const EMPTY = { requirements: [], vendors: [], candidates: [], activity: [] };

export async function createDriveStore() {
  const { google } = await import('googleapis');
  const auth = new google.auth.GoogleAuth({ scopes: ['https://www.googleapis.com/auth/drive'] });
  const drive = google.drive({ version: 'v3', auth });
  const folderId = process.env.GDRIVE_FOLDER_ID;
  if (!folderId) throw new Error('GDRIVE_FOLDER_ID is not set');

  let fileId = null;
  async function ensureFile() {
    if (fileId) return fileId;
    const q = `name='${STATE_NAME}' and '${folderId}' in parents and trashed=false`;
    const list = await drive.files.list({ q, fields: 'files(id)', spaces: 'drive' });
    if (list.data.files && list.data.files.length) {
      fileId = list.data.files[0].id;
    } else {
      const created = await drive.files.create({
        requestBody: { name: STATE_NAME, parents: [folderId], mimeType: 'application/json' },
        media: { mimeType: 'application/json', body: JSON.stringify(EMPTY, null, 2) },
        fields: 'id',
      });
      fileId = created.data.id;
    }
    return fileId;
  }

  return {
    kind: 'drive',
    async getState() {
      const id = await ensureFile();
      const res = await drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'json' });
      return res.data && res.data.requirements ? res.data : EMPTY;
    },
    async putState(state) {
      const id = await ensureFile();
      await drive.files.update({ fileId: id, media: { mimeType: 'application/json', body: JSON.stringify(state, null, 2) } });
      return true;
    },
    async putFile({ name, mime, buffer }) {
      const { Readable } = await import('node:stream');
      const created = await drive.files.create({
        requestBody: { name, parents: [folderId] },
        media: { mimeType: mime || 'application/octet-stream', body: Readable.from(buffer) },
        fields: 'id',
      });
      return created.data.id;
    },
    async getFile(id) {
      try {
        const meta = await drive.files.get({ fileId: id, fields: 'name,mimeType' });
        const media = await drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'arraybuffer' });
        return { name: meta.data.name, mime: meta.data.mimeType, buffer: Buffer.from(media.data) };
      } catch {
        return null;
      }
    },
  };
}
