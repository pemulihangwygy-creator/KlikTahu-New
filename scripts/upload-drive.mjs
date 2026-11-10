#!/usr/bin/env node
/**
 * Uploads finished renders + metadata + posters to a Drive folder, then prints
 * a small report. Needs DRIVE_FOLDER_ID, GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN
 * or the OAuth access token in DRIVE_ACCESS_TOKEN. Nothing is written to Git.
 *
 * Uses the documented Drive v3 REST API:
 *   POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
 */
import {readFileSync, existsSync, statSync} from 'node:fs';
import {basename, join} from 'node:path';

const root = process.cwd();
const api = 'https://www.googleapis.com/drive/v3';
const uploadApi = 'https://www.googleapis.com/upload/drive/v3';

const need = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`missing env ${k}`);
  return v;
};

const getToken = async () => {
  if (process.env.DRIVE_ACCESS_TOKEN) return process.env.DRIVE_ACCESS_TOKEN;
  const body = new URLSearchParams({
    client_id: need('GOOGLE_CLIENT_ID'),
    client_secret: need('GOOGLE_CLIENT_SECRET'),
    refresh_token: need('GOOGLE_REFRESH_TOKEN'),
    grant_type: 'refresh_token',
  });
  const r = await fetch('https://oauth2.googleapis.com/token', {method: 'POST', body});
  if (!r.ok) throw new Error('oauth failed ' + r.status + ' ' + (await r.text()));
  return (await r.json()).access_token;
};

const folderId = need('DRIVE_FOLDER_ID');
const token = await getToken();

/** upload ONE file into a parent folder (multipart) */
const upload = async (parent, path, name = basename(path), mime) => {
  const data = readFileSync(path);
  const boundary = 'kliktahu' + Math.random().toString(16).slice(2);
  const meta = JSON.stringify({name, parents: [parent]});
  const parts = [
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n`,
    `--${boundary}\r\nContent-Type: ${mime}\r\n\r\n`,
  ];
  const head = Buffer.from(parts.join(''), 'utf8');
  const tail = Buffer.from(`\r\n--${boundary}--`, 'utf8');
  const payload = Buffer.concat([head, data, tail]);
  const r = await fetch(
    `${uploadApi}/files?uploadType=multipart&fields=id,name,size,webViewLink&supportsAllDrives=true`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': String(payload.length),
      },
      body: payload,
    },
  );
  if (!r.ok) throw new Error(`upload ${name} failed: ${r.status} ${await r.text()}`);
  return r.json();
};

const ensureFolder = async (name, parent) => {
  const q = encodeURIComponent(
    `name = '${name.replace(/'/g, "\\'")}' and '${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
  );
  const r = await fetch(`${api}/files?q=${q}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  const j = await r.json();
  if (j.files?.length) return j.files[0].id;
  const c = await fetch(`${api}/files?fields=id,name&supportsAllDrives=true`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({name, mimeType: 'application/vnd.google-apps.folder', parents: [parent]}),
  });
  if (!c.ok) throw new Error('mkdir failed ' + c.status + ' ' + (await c.text()));
  return (await c.json()).id;
};

const MIME = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

const plan = JSON.parse(readFileSync(join(root, 'scripts', 'upload-plan.json'), 'utf8'));
const report = [];
for (const [folder, files] of Object.entries(plan)) {
  const id = await ensureFolder(folder, folderId);
  for (const rel of files) {
    const p = join(root, rel);
    if (!existsSync(p)) {
      report.push(`missing ${rel}`);
      continue;
    }
    const size = statSync(p).size;
    const t0 = Date.now();
    const res = await upload(id, p, basename(p), MIME[rel.slice(rel.lastIndexOf('.'))] ?? 'application/octet-stream');
    report.push(`${folder}/${res.name} ${(size / 1048576).toFixed(1)}MB in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
}
console.log(report.join('\n'));
