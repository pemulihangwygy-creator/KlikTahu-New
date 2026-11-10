#!/usr/bin/env node
/** Deterministic film-grain tile (512×512 grayscale PNG), no canvas dependency. */
import {writeFileSync, mkdirSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
import {join} from 'node:path';

const size = 512;
let s = 987654321;
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const raw = Buffer.alloc(size * (size + 1));
for (let y = 0; y < size; y++) {
  raw[y * (size + 1)] = 0; // filter: none
  for (let x = 0; x < size; x++) {
    const v = 118 + (rnd() - 0.5) * 70 + (rnd() > 0.995 ? 60 : 0);
    raw[y * (size + 1) + 1 + x] = Math.max(0, Math.min(255, Math.round(v)));
  }
}
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(size, 0);
ihdr.writeUInt32BE(size, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 0; // grayscale
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, {level: 9})),
  chunk('IEND', Buffer.alloc(0)),
]);
mkdirSync(join(process.cwd(), 'public', 'tex'), {recursive: true});
writeFileSync(join(process.cwd(), 'public', 'tex', 'grain.png'), png);
console.log('grain.png', (png.length / 1024).toFixed(1) + ' kB');
