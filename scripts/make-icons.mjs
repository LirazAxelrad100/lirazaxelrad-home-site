// Generates the site's favicons: a thin cream ring on a solid orange circle.
//
//   node scripts/make-icons.mjs public
//
// Writes public/favicon.svg, public/favicon.ico (16/32/48) and
// public/apple-touch-icon.png (180). Output is deterministic — re-running
// produces byte-identical files, so it is safe to run any time.
//
// Everything is drawn and encoded here (PNG via zlib, ICO container by hand)
// because this machine has no ImageMagick/rsvg, and because hand-copying
// base64 of a binary is an easy way to write a silently corrupt file.
//
// Two deliberate choices, both explained in CLAUDE.md:
//  - the ring sits on a SOLID ground, never transparent: pale yellow on a
//    light tab bar is invisible, and a favicon can't control its backdrop.
//  - stroke width is optically hinted per size: the intended thin stroke is
//    sub-pixel at 16px and would dissolve into a solid dot, so small raster
//    sizes get a proportionally thicker ring. The SVG always gets the thin one.
import zlib from "node:zlib";
import fs from "node:fs";

const ACCENT = [187, 77, 0];    // #bb4d00  site accent
const YELLOW = [254, 243, 199]; // #fef3c7  site panel yellow

// --- PNG encoding ---------------------------------------------------------
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // colour type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let p = 0;
  for (let y = 0; y < height; y++) {
    raw[p++] = 0; // filter: none
    rgba.copy(raw, p, y * width * 4, (y + 1) * width * 4);
    p += width * 4;
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- drawing (4x supersampled for clean edges) ----------------------------
function render(S, shape, strokeFactor) {
  const SS = 4, N = S * SS;
  const out = Buffer.alloc(S * S * 4);
  const cx = N / 2, cy = N / 2;
  const sw = strokeFactor * N;
  const ringR = N / 2 - sw / 2 - 0.10 * N;
  const inner = ringR - sw / 2, outer = ringR + sw / 2;
  const bgR = N / 2;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x * SS + sx + 0.5, py = y * SS + sy + 0.5;
          const d = Math.hypot(px - cx, py - cy);
          let col = null;
          if (d >= inner && d <= outer) col = YELLOW;
          else if (shape === "square" || d <= bgR) col = ACCENT;
          if (col) { r += col[0]; g += col[1]; b += col[2]; a += 255; }
        }
      }
      const n = SS * SS, i = (y * S + x) * 4;
      // un-premultiply so edge pixels keep full colour with partial alpha
      if (a > 0) {
        out[i] = Math.round(r / (a / 255));
        out[i + 1] = Math.round(g / (a / 255));
        out[i + 2] = Math.round(b / (a / 255));
      }
      out[i + 3] = Math.round(a / n);
    }
  }
  return encodePNG(S, S, out);
}

// --- ICO container wrapping a PNG ----------------------------------------
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size;
    e[1] = size >= 256 ? 0 : size;
    e[2] = 0; e[3] = 0;
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += buf.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

const out = process.argv[2];
const THIN = 0.045; // the intended look, used wherever there is room to render it

// Small raster sizes need a thicker stroke or the ring dissolves into a solid
// dot — a 0.045 stroke is 0.7px at 16px. Optical hinting, not a design change.
fs.writeFileSync(`${out}/favicon.ico`, ico([
  { size: 16, buf: render(16, "circle", 0.10) },
  { size: 32, buf: render(32, "circle", 0.07) },
  { size: 48, buf: render(48, "circle", 0.055) },
]));
fs.writeFileSync(`${out}/apple-touch-icon.png`, render(180, "square", THIN));

// SVG is resolution-independent, so it always gets the thin stroke.
const r = 32 - (THIN * 64) / 2 - 6.4;
fs.writeFileSync(
  `${out}/favicon.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Liraz Axelrad">\n` +
    `  <circle cx="32" cy="32" r="32" fill="#bb4d00"/>\n` +
    `  <circle cx="32" cy="32" r="${r.toFixed(2)}" fill="none" stroke="#fef3c7" stroke-width="${(THIN * 64).toFixed(2)}"/>\n` +
    `</svg>\n`
);
console.log("favicon.ico       ", fs.statSync(`${out}/favicon.ico`).size, "bytes (16/32/48, hinted)");
console.log("apple-touch-icon  ", fs.statSync(`${out}/apple-touch-icon.png`).size, "bytes (180 square, thin)");
console.log("favicon.svg       ", fs.statSync(`${out}/favicon.svg`).size, "bytes (vector, thin)");
