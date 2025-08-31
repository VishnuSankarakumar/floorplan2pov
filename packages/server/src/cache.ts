import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.env.DISK_CACHE_DIR || '.cache';
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

export function keyOf(prompt: string, buf: Buffer) {
  const h = crypto.createHash('sha256');
  h.update(prompt);
  h.update(buf);
  return h.digest('hex');
}

export function get(key: string): Buffer | null {
  const p = path.join(DIR, key + '.jpg');
  return fs.existsSync(p) ? fs.readFileSync(p) : null;
}

export function set(key: string, data: Buffer) {
  const p = path.join(DIR, key + '.jpg');
  fs.writeFileSync(p, data);
}