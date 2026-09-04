// Backend helpers. Active only when VITE_API=1 (Express + storage adapter).
export const API_ON = import.meta.env.VITE_API === '1' || import.meta.env.VITE_API === 'true';

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result || '');
      resolve(s.slice(s.indexOf(',') + 1)); // strip the data: URL prefix
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

// Uploads a résumé to the backend; returns its storage id. Null when API is
// off or the upload fails (caller falls back to filename-only).
export async function uploadFile(file: File): Promise<{ id: string; name: string } | null> {
  if (!API_ON) return null;
  try {
    const dataBase64 = await toBase64(file);
    const res = await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, mime: file.type || 'application/octet-stream', dataBase64 }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { id: string; name: string };
  } catch {
    return null;
  }
}

export const fileUrl = (id: string) => `/api/files/${id}`;
