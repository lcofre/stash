#!/usr/bin/env node
// Generates icon-192.png and icon-512.png in /public
// Design: dark background · amber rounded square · three dark bars (list motif)
// Pure Node.js — no dependencies beyond zlib (built-in)

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BG    = [12, 11, 15];      // #0c0b0f
const AMBER = [201, 145, 62];    // #C9913E
const DARK  = [8,   7, 10];      // slightly lighter than BG for bars

// CRC-32 table
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeB = Buffer.from(type, 'ascii');
  const lenB  = Buffer.alloc(4); lenB.writeUInt32BE(data.length);
  const crcB  = Buffer.alloc(4); crcB.writeUInt32BE(crc32(Buffer.concat([typeB, data])));
  return Buffer.concat([lenB, typeB, data, crcB]);
}

function inRoundedRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = x < x0 + r ? x0 + r : x > x1 - r ? x1 - r : x;
  const cy = y < y0 + r ? y0 + r : y > y1 - r ? y1 - r : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function generatePixels(size) {
  const buf = Buffer.alloc(size * size * 3);

  // Fill with background
  for (let i = 0; i < size * size; i++) buf.set(BG, i * 3);

  const pad = Math.round(size * 0.17);    // margin from edge to amber card
  const r   = Math.round(size * 0.10);    // corner radius of amber card

  // Draw amber card
  for (let y = pad; y <= size - pad; y++) {
    for (let x = pad; x <= size - pad; x++) {
      if (inRoundedRect(x, y, pad, pad, size - pad, size - pad, r)) {
        buf.set(AMBER, (y * size + x) * 3);
      }
    }
  }

  // Draw 3 horizontal dark bars inside the amber card
  const barH    = Math.round(size * 0.074);
  const barGap  = Math.round(size * 0.046);
  const barsTotal = barH * 3 + barGap * 2;
  const barTop  = Math.round((size - barsTotal) / 2);
  const barLeft = pad + Math.round(size * 0.08);
  const barRight = size - pad - Math.round(size * 0.08);

  for (let b = 0; b < 3; b++) {
    const y0 = barTop + b * (barH + barGap);
    const y1 = y0 + barH;
    const br = Math.round(barH / 2);      // fully rounded bar ends

    for (let y = y0; y < y1; y++) {
      for (let x = barLeft; x < barRight; x++) {
        // Only paint over amber pixels
        const idx = (y * size + x) * 3;
        if (buf[idx] === AMBER[0] && buf[idx + 1] === AMBER[1] && buf[idx + 2] === AMBER[2]) {
          // Round bar ends
          const lx = x - barLeft, rx = (barRight - 1) - x;
          const ty = y - y0,     by = (y1 - 1) - y;
          const cx = lx < br ? barLeft + br : x > barRight - 1 - br ? barRight - 1 - br : x;
          const cy = ty < br ? y0 + br      : y > y1 - 1 - br      ? y1 - 1 - br       : y;
          if ((x - cx) ** 2 + (y - cy) ** 2 <= br * br) {
            buf.set(DARK, idx);
          }
        }
      }
    }
  }

  return buf;
}

function makePNG(size) {
  const pixels = generatePixels(size);

  // Scanlines: each row prefixed with filter byte 0 (None)
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    pixels.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),  // PNG signature
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.resolve(__dirname, '../public');
for (const size of [192, 512]) {
  const outPath = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, makePNG(size));
  console.log(`✓ icon-${size}.png`);
}
