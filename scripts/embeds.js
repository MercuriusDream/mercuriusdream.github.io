// Build-time embed generator. For every route in src/seo.js it:
//   • composes a 1200×630 OG card (bright-grey accent, no gold) and rasterizes
//     it to dist/<route>/og.png via @resvg/resvg-js (graceful fallback to the
//     shared avatar.png if the rasterizer is unavailable);
//   • injects OpenGraph + Twitter-card + canonical + oEmbed <link> meta into a
//     per-route index.html (replacing the homepage <title>/<description>);
//   • writes a per-route oembed.json.
// Routes are derived generically from src/seo.js — nothing is hardcoded per
// page. Run via `bun scripts/embeds.js` after `vite build`.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes, SITE, PROVIDER, ACCENT, SKY, INK } from '../src/seo.js';

const INK2 = '#B8BCC8'; // bright grey — the embed accent (no gold)
const GREY = '#6A7080';
const SKY2 = '#0A0F1F'; // the article panel colour from the site

// The site's own display face, vendored so cards look like the site, not like
// a system-font fallback. Weights match global.css (body 400, headings 500).
const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'fonts');
const FONT_FILES = ['ZalandoSans-400.ttf', 'ZalandoSans-500.ttf'].map(f => join(FONT_DIR, f));
const FONT = 'Zalando Sans';
const HANDLE = '@mercuriusdream';

let Resvg = null;
try {
  ({ Resvg } = await import('@resvg/resvg-js'));
} catch (e) {
  console.warn('[embeds] @resvg/resvg-js unavailable — OG images fall back to /avatar.png:', e.message);
}

const W = 1200, H = 630;
const dist = 'dist';

const esc = s => s.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
const wrap = (text, maxChars) => {
  const out = []; let line = '';
  for (const w of String(text).split(/\s+/)) {
    if (w && (line + ' ' + w).trim().length > maxChars && line) { out.push(line.trim()); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line.trim());
  return out;
};

function witness(cx, cy, s) {
  const pts = [[50, 13], [82, 31.5], [82, 68.5], [50, 87], [18, 68.5], [18, 31.5]];
  let g = '';
  for (const [x, y] of pts) g += `<circle cx="${(cx + (x - 50) * s).toFixed(1)}" cy="${(cy + (y - 50) * s).toFixed(1)}" r="${(6.5 * s).toFixed(1)}" fill="${INK2}" opacity="0.92"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="${(9 * s).toFixed(1)}" fill="${INK}"/>`;
  return g;
}

function svgFor(r) {
  const hasEmblem = r.emblem === 'witness';
  const pad = 120; // inner padding of the "article panel"
  const textW = W - pad * 2 - (hasEmblem ? 330 : 0);
  // Latin-safe display title for the card (avoids Korean tofu on CI runners).
  const cardTitle = r.cardTitle || r.title;
  const titleSize = cardTitle.length > 40 ? 54 : 66;
  const titleLines = wrap(cardTitle, Math.max(10, Math.floor(textW / (titleSize * 0.52)))).slice(0, 3);
  const descLines = wrap(r.description, Math.max(14, Math.floor(textW / (29 * 0.52)))).slice(0, 4);

  const titleTop = 226;
  const titleLh = titleSize * 1.16;
  const descTop = titleTop + (titleLines.length - 1) * titleLh + 60;
  const descLh = 42;

  const tspans = (lines, lh) => lines.map((l, i) =>
    `<tspan x="${pad}" dy="${i === 0 ? 0 : lh}">${esc(l)}</tspan>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${SKY}"/>
  <rect x="56" y="56" width="${W - 112}" height="${H - 112}" fill="${SKY2}"/>
  <rect x="${pad}" y="104" width="13" height="13" fill="${INK2}"/>
  <text x="${pad + 26}" y="116" font-family="${FONT}" font-size="24" font-weight="500" letter-spacing="1" fill="${GREY}">${esc(r.kicker || HANDLE)}</text>
  <text x="${pad}" y="${titleTop}" font-family="${FONT}" font-size="${titleSize}" font-weight="500" letter-spacing="-1" fill="${INK}">${tspans(titleLines, titleLh)}</text>
  <text x="${pad}" y="${descTop}" font-family="${FONT}" font-size="28" font-weight="400" fill="${INK2}">${tspans(descLines, descLh)}</text>
  <text x="${pad}" y="534" font-family="${FONT}" font-size="24" font-weight="500" fill="${GREY}">${esc(HANDLE)}</text>
  <text x="${W - pad}" y="534" text-anchor="end" font-family="${FONT}" font-size="24" font-weight="500" fill="${GREY}">mercuriusdream.com</text>
  ${hasEmblem ? witness(1006, 315, 2.5) : ''}
</svg>`;
}

async function renderPng(r) {
  if (!Resvg) return null;
  try {
    const svg = svgFor(r);
    const png = new Resvg(svg, {
      fitTo: { mode: 'width', value: W },
      font: { fontFiles: FONT_FILES, loadSystemFonts: true, family: FONT },
    }).render().asPng();
    return Buffer.from(png);
  } catch (e) {
    console.warn(`[embeds] OG rasterize failed for "${r.title}":`, e.message);
    return null;
  }
}

function metaTags(r, path, imageHref) {
  const url = SITE + (path === '/' ? '/' : path) + (path === '/' ? '' : '/');
  const type = path === '/' ? 'website' : 'article';
  return `  <meta property="og:title" content="${esc(r.title)}"/>
  <meta property="og:description" content="${esc(r.description)}"/>
  <meta property="og:type" content="${type}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:site_name" content="${PROVIDER}"/>
  <meta property="og:image" content="${imageHref}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:alt" content="${esc(r.title)} — ${esc(r.description)}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="${HANDLE}"/>
  <meta name="twitter:title" content="${esc(r.title)}"/>
  <meta name="twitter:description" content="${esc(r.description)}"/>
  <meta name="twitter:image" content="${imageHref}"/>
  <meta name="twitter:image:alt" content="${esc(r.title)} — ${esc(r.description)}"/>
  <meta name="theme-color" content="${SKY}"/>
  <link rel="canonical" href="${url}"/>
  <link rel="alternate" type="application/json+oembed" href="${SITE}${path === '/' ? '' : path}/oembed.json" title="${esc(r.title)}"/>`;
}

function oembed(r, path, imageHref) {
  return {
    version: '1.0',
    type: 'link',
    title: r.title,
    description: r.description,
    author_name: HANDLE,
    author_url: SITE,
    provider_name: PROVIDER,
    provider_url: SITE,
    thumbnail_url: imageHref,
    thumbnail_width: 1200,
    thumbnail_height: 630,
  };
}

async function writeRoute(path, r, baseHtml) {
  const isHome = path === '/';
  const dir = isHome ? dist : join(dist, path);
  await mkdir(dir, { recursive: true });

  const png = await renderPng(r);
  const relImage = isHome ? '/og.png' : `${path}/og.png`;
  const imageHref = png ? `${SITE}${relImage}` : `${SITE}/avatar.png`;
  if (png) await writeFile(join(dir, 'og.png'), png);

  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(r.description)}"/>`);
  if (!/<meta name="description"/.test(html)) {
    html = html.replace(/<title>/, `<meta name="description" content="${esc(r.description)}"/>\n  <title>`);
  }
  html = html.replace(/<\/head>/, `${metaTags(r, path, imageHref)}\n</head>`);

  await writeFile(join(dir, 'index.html'), html);
  await writeFile(join(dir, 'oembed.json'), JSON.stringify(oembed(r, path, imageHref), null, 2));
  console.log(`[embeds] ${path} → ${dir}/index.html (+og.png, +oembed.json)`);
}

const baseHtml = await readFile(join(dist, 'index.html'), 'utf8');

// Home card: render with a Latin display title so CI fonts draw it.
const homeRoute = { ...routes['/'], cardTitle: HANDLE };

for (const path of Object.keys(routes)) {
  const r = path === '/' ? homeRoute : routes[path];
  await writeRoute(path, r, baseHtml);
}

// 404 mirrors the home card.
await writeFile(join(dist, '404.html'), await readFile(join(dist, 'index.html'), 'utf8'));
console.log('[embeds] wrote dist/404.html');