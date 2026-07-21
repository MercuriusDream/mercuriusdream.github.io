// Per-route unfurl metadata — the single place the build-time embed generator
// and the runtime document.title both read from. Bright-grey accent (not gold),
// honest copy (no "systems engineer" slop).

import { bySlug } from './docs/meta';

export const SITE = 'https://mercuriusdream.com';
export const HANDLE = '@mercuriusdream';
export const PROVIDER = 'MercuriusDream';

// Embed accent: bright grey on the deep sky. No gold.
export const ACCENT = '#B8BCC8';
export const SKY = '#060912';
export const INK = '#E8EAF0';

const staticRoutes = {
  '/': {
    title: '마라향 안개구름',
    description:
      'Runs Project Logos — open defensive cybersecurity, kept open and run on generally available models. Made TideSurf and Agent-Estate.',
    kicker: `${HANDLE}`,
  },
  '/logos': {
    title: 'Project Logos',
    description:
      'Open defensive cybersecurity for the web, kept open and run on generally available models. Structured reason over brute force; over KRW 10,000,000 in bounty.',
    kicker: `${HANDLE} · logos`,
    emblem: 'witness',
  },
  '/writings': {
    title: 'Writings',
    description: 'tried writing things — field logs and notes.',
    kicker: `${HANDLE} · writings`,
  },
};

const docRoutes = Object.fromEntries(
  Object.values(bySlug).map(d => [
    `/writings/${d.slug}`,
    {
      title: d.title,
      description: d.blurb || d.subtitle,
      kicker: `${HANDLE} · ${d.kicker || 'writing'}`,
    },
  ])
);

export const routes = { ...staticRoutes, ...docRoutes };

export function seoFor(path) {
  return routes[path] || staticRoutes['/'];
}