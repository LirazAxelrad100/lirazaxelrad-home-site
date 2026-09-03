// Generates the social-share preview cards (Open Graph images).
//
//   node scripts/make-og.mjs
//
// Writes public/og-en.png and public/og-he.png (1200x630, the size Facebook,
// LinkedIn, WhatsApp, X and iMessage all expect). Rerun after changing the
// name, tagline or the photo below; output is deterministic.
//
// Note on Hebrew: the SVG renderer sharp uses (librsvg/pango) reorders
// right-to-left text correctly on its own, but ONLY if you leave it alone --
// adding an explicit direction="rtl" attribute, or pre-reversing the string,
// produces mirrored gibberish. Right-alignment is done with text-anchor="end".

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const W = 1200;
const H = 630;
const BG = "#fffbeb";
const ACCENT = "#bb4d00";
const TEXT = "#4a4a4a";
const PHOTO = path.join(publicDir, "assets", "about-liraz.jpeg");
const PHOTO_SIZE = 340;

const LATIN_FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";
const HEBREW_FONT = "Arial Hebrew, Helvetica Neue, Arial, sans-serif";

const cards = [
  {
    file: "og-en.png",
    dir: "ltr",
    font: LATIN_FONT,
    name: "Liraz Axelrad",
    tagline: "Product Management, Meditation: Mentoring & Teaching",
    url: "lirazaxelrad.com",
  },
  {
    file: "og-he.png",
    dir: "rtl",
    font: HEBREW_FONT,
    name: "לירז אקסלרד",
    tagline: "ניהול מוצר, מדיטציה, הגירה: ליווי ותמיכה",
    url: "lirazaxelrad.com",
  },
];

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Rough average glyph width, as a fraction of the font size. Hebrew glyphs in
// these fonts are noticeably narrower than Latin ones, so they get their own.
const CHAR_WIDTH = { ltr: 0.52, rtl: 0.42 };

/** Rough word wrap, using the estimates above — good enough for two short lines. */
function wrap(text, fontSize, maxWidth, dir) {
  const perChar = fontSize * CHAR_WIDTH[dir];
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length * perChar > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function circularPhoto(size) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  return sharp(PHOTO)
    .resize(size, size, { fit: "cover", position: "top" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

function cardSvg({ dir, font, name, tagline, url }) {
  const rtl = dir === "rtl";
  // Mirrored layout: photo on the outside, text reading inward from the edge.
  const textEdge = rtl ? 700 : 540;
  const anchor = rtl ? "end" : "start";
  const maxTextWidth = rtl ? textEdge - 90 : W - 90 - textEdge;

  const nameSize = 68;
  const taglineSize = 32;
  const urlSize = 26;

  const taglineLines = wrap(tagline, taglineSize, maxTextWidth, dir);

  const nameY = 268;
  const taglineY = nameY + 62;
  const urlY = taglineY + taglineLines.length * 44 + 24;

  const taglineTspans = taglineLines
    .map((line, i) => `<tspan x="${textEdge}" dy="${i === 0 ? 0 : 44}">${escapeXml(line)}</tspan>`)
    .join("");

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="${H - 14}" width="${W}" height="14" fill="${ACCENT}"/>
  <text x="${textEdge}" y="${nameY}" text-anchor="${anchor}" font-family="${font}" font-size="${nameSize}" font-weight="600" fill="${ACCENT}">${escapeXml(name)}</text>
  <text x="${textEdge}" y="${taglineY}" text-anchor="${anchor}" font-family="${font}" font-size="${taglineSize}" fill="${TEXT}">${taglineTspans}</text>
  <text x="${textEdge}" y="${urlY}" text-anchor="${anchor}" font-family="${LATIN_FONT}" font-size="${urlSize}" fill="${ACCENT}" opacity="0.75">${escapeXml(url)}</text>
</svg>`);
}

const photo = await circularPhoto(PHOTO_SIZE);

for (const card of cards) {
  const photoLeft = card.dir === "rtl" ? W - 110 - PHOTO_SIZE : 110;
  const out = path.join(publicDir, card.file);
  await sharp(cardSvg(card))
    .composite([{ input: photo, left: photoLeft, top: Math.round((H - PHOTO_SIZE) / 2) - 7 }])
    .png()
    .toFile(out);
  console.log(`wrote ${path.relative(root, out)}`);
}
