// Build-time embed generator. For every route in src/seo.js it:
//   • composes a 1200×630 OG image on the site's open starfield (sans-serif,
//     with no card/panel treatment) and rasterizes it to dist/<route>/og.png
//     via @resvg/resvg-js (falling back to avatar.png if unavailable);
//   • injects OpenGraph + Twitter-card + canonical + oEmbed <link> meta into a
//     per-route index.html (replacing the homepage <title>/<description>);
//   • writes each route's oembed.json and derives atom.xml from writing meta.
// Routes are derived generically from src/seo.js — nothing is hardcoded per
// page. Run via `bun scripts/embeds.js` after `vite build`.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes, SITE, PROVIDER, ACCENT, SKY, INK } from '../src/seo.js';
import { writings } from '../src/docs/meta.js';

const INK2 = '#B8BCC8';
const GREY = '#6A7080';
const STAR_TINTS = ['#E8EAF0', '#4F7B86', '#76668D', '#B86A8E'];

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

const hash = text => {
  let n = 2166136261;
  for (const c of text) {
    n ^= c.charCodeAt(0);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
};

function starsFor(seedText) {
  let seed = hash(seedText);
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  return Array.from({ length: 58 }, (_, i) => {
    const x = 24 + random() * (W - 48);
    const y = 24 + random() * (H - 48);
    const near = i > 50;
    const r = near ? 1.5 + random() * 1.2 : 0.45 + random() * 0.85;
    const color = near ? STAR_TINTS[1 + Math.floor(random() * (STAR_TINTS.length - 1))] : STAR_TINTS[0];
    const opacity = near ? 0.42 + random() * 0.2 : 0.14 + random() * 0.28;
    const cross = near
      ? `<path d="M ${(x - r * 3).toFixed(1)} ${y.toFixed(1)}h ${(r * 6).toFixed(1)} M ${x.toFixed(1)} ${(y - r * 3).toFixed(1)}v ${(r * 6).toFixed(1)}" stroke="${color}" stroke-opacity="${(opacity * 0.38).toFixed(2)}" stroke-width="0.7"/>`
      : '';
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" fill-opacity="${opacity.toFixed(2)}"/>${cross}`;
  }).join('');
}

function witness(cx, cy, s) {
  const pts = [[50, 13], [82, 31.5], [82, 68.5], [50, 87], [18, 68.5], [18, 31.5]];
  let g = '';
  for (const [x, y] of pts) g += `<circle cx="${(cx + (x - 50) * s).toFixed(1)}" cy="${(cy + (y - 50) * s).toFixed(1)}" r="${(6.5 * s).toFixed(1)}" fill="${INK2}" opacity="0.92"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="${(9 * s).toFixed(1)}" fill="${INK}"/>`;
  return g;
}

function svgFor(r) {
  const hasEmblem = r.emblem === 'witness';
  const pad = 104;
  const textW = W - pad * 2 - (hasEmblem ? 280 : 0);
  // Latin-safe display title for the home image avoids Korean tofu in CI.
  const cardTitle = r.cardTitle || r.title;
  const titleSize = cardTitle.length > 46 ? 52 : cardTitle.length > 30 ? 60 : 70;
  const titleLines = wrap(cardTitle, Math.max(10, Math.floor(textW / (titleSize * 0.52)))).slice(0, 3);

  const titleTop = 244;
  const titleLh = titleSize * 1.1;
  const descTop = titleTop + (titleLines.length - 1) * titleLh + 64;
  const descLh = 40;
  const descLimit = Math.min(4, Math.max(1, Math.floor((510 - descTop) / descLh) + 1));
  const descLines = wrap(r.description, Math.max(14, Math.floor(textW / (28 * 0.52)))).slice(0, descLimit);
  const tspans = (lines, lh) => lines.map((l, i) =>
    `<tspan x="${pad}" dy="${i === 0 ? 0 : lh}">${esc(l)}</tspan>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="nebula-teal">
      <stop offset="0" stop-color="#4F7B86" stop-opacity="0.15"/>
      <stop offset="1" stop-color="#4F7B86" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nebula-violet">
      <stop offset="0" stop-color="#76668D" stop-opacity="0.11"/>
      <stop offset="1" stop-color="#76668D" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${SKY}"/>
  <ellipse cx="250" cy="250" rx="470" ry="390" fill="url(#nebula-teal)"/>
  <ellipse cx="970" cy="390" rx="430" ry="360" fill="url(#nebula-violet)"/>
  ${starsFor(`${r.title}|${r.kicker || HANDLE}`)}
  <text x="${pad}" y="112" font-family="${FONT}, sans-serif" font-size="24" font-weight="500" letter-spacing="1" fill="${GREY}">${esc(r.kicker || HANDLE)}</text>
  <path d="M ${pad} 147h 48" stroke="${ACCENT}" stroke-width="3"/>
  <text x="${pad}" y="${titleTop}" font-family="${FONT}, sans-serif" font-size="${titleSize}" font-weight="500" letter-spacing="-1" fill="${INK}">${tspans(titleLines, titleLh)}</text>
  <text x="${pad}" y="${descTop}" font-family="${FONT}, sans-serif" font-size="28" font-weight="400" fill="${INK2}">${tspans(descLines, descLh)}</text>
  <text x="${pad}" y="552" font-family="${FONT}, sans-serif" font-size="24" font-weight="500" fill="${GREY}">${esc(HANDLE)}</text>
  <text x="${W - pad}" y="552" text-anchor="end" font-family="${FONT}, sans-serif" font-size="24" font-weight="500" fill="${GREY}">mercuriusdream.com</text>
  ${hasEmblem ? witness(1008, 315, 2.25) : ''}
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

function atomFeed() {
  const ordered = [...writings].sort((a, b) => new Date(b.published) - new Date(a.published));
  const published = writing => {
    const date = new Date(writing.published);
    if (!writing.published || Number.isNaN(date.valueOf())) {
      throw new Error(`[embeds] Invalid published date for writing "${writing.slug}"`);
    }
    return date.toISOString();
  };
  const updated = ordered.length ? published(ordered[0]) : new Date(0).toISOString();
  const entries = ordered.map(writing => {
    const href = `${SITE}/writings/${writing.slug}/`;
    const date = published(writing);
    const summary = writing.blurb || writing.subtitle || writing.listTitle || writing.title;
    return `  <entry>
    <title>${esc(writing.title)}</title>
    <id>${href}</id>
    <link rel="alternate" type="text/html" href="${href}"/>
    <published>${date}</published>
    <updated>${date}</updated>
    <summary>${esc(summary)}</summary>
  </entry>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <title>MercuriusDream writings</title>
  <subtitle>tried writing things — field logs and notes.</subtitle>
  <id>${SITE}/writings/</id>
  <link rel="alternate" type="text/html" href="${SITE}/writings/"/>
  <link rel="self" type="application/atom+xml" href="${SITE}/atom.xml"/>
  <updated>${updated}</updated>
  <author>
    <name>${HANDLE}</name>
    <uri>${SITE}/</uri>
  </author>
${entries}
</feed>
`;
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

await writeFile(join(dist, 'atom.xml'), atomFeed());
console.log('[embeds] wrote dist/atom.xml');

// 404 mirrors the home card.
await writeFile(join(dist, '404.html'), await readFile(join(dist, 'index.html'), 'utf8'));
console.log('[embeds] wrote dist/404.html');