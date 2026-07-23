// Lightweight, importable-anywhere metadata for each writing — the single
// source for titles / descriptions used by the reader AND by the build-time
// embed generator. No JSX, no React, no ?raw imports, so it loads in Bun and
// in the browser alike.

export const writings = [
  {
    slug: 'distillation-attacks',
    accent: 'var(--c-rust)',
    kicker: '2026·07·22',
    date: 'Jul 22, 2026',
    published: '2026-07-22T00:00:00Z',
    listTitle: 'distillation attacks',
    title: 'distillation attacks',
    blurb: `no`,
  },
  {
    slug: 'minus-two',
    accent: 'var(--c-grey)', // bright grey — Kimi things (mark/witness/exchange) stay blue
    kicker: '2026·07·21',
    markLabel: 'Kimi K3',
    date: 'Jul 21, 2026',
    published: '2026-07-21T00:00:00Z',
    listTitle: 'i handed the jacobian thing to kimi k3',
    title: 'i handed the jacobian thing to kimi k3',
    subtitle: `it works somehow, and no, Chinese models aren't six months behind, fyi.`,
    blurb: `Kimi K3's unedited log verifying the July 2026 Jacobian-conjecture counterexample: det ≡ −2, three points, one image. An open-weights model, cold.`,
    tweet: { url: 'https://x.com/__alpoge__/status/2079028340955197566', label: 'original tweet' },
  },
];

export const bySlug = Object.fromEntries(writings.map(w => [w.slug, w]));