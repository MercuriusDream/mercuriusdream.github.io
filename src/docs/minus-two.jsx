import { IconKimi } from '../components/Icons';
import transcript from './kimi-jacobian.txt?raw';

// A one-to-one render of Kimi K3's raw log verifying the July 2026 Jacobian
// counterexample. The transcript is vendored verbatim (my private notes to the
// model redacted). English translations for the Korean segments are matched
// onto the prose by prefix at render time.

const doc = {
  slug: 'minus-two',
  accent: 'var(--c-gold)',
  kicker: 'field log · 2026·07·21',
  mark: IconKimi,
  markLabel: 'Kimi K3',

  // /writings index card
  date: 'Jul 21, 2026',
  listTitle: 'i handed the jacobian thing to kimi k3',
  blurb: `Kimi K3's unedited log verifying the July 2026 Jacobian-conjecture counterexample — det ≡ −2, three points, one image. An open-weights model, cold.`,

  title: 'i handed the jacobian thing to kimi k3',
  subtitle: `it works somehow — and no, Chinese models aren't six months behind, fyi.`,

  intro: `The map below is Levent Alpöge's counterexample to the Jacobian conjecture, posted mid–World-Cup-final. I pasted it into Kimi K3 — an open-weights model I can run myself — told it nothing, and asked it to find the mistake. It didn't find one; it verified the thing. What follows is K3's log, one-to-one: my private notes to it are redacted, and the Korean parts are translated underneath.`,

  tweet: { url: 'https://x.com/__alpoge__/status/2079028340955197566', label: '@__alpoge__ — the original tweet' },

  transcript,

  // English translations for the Korean prose, matched by prefix.
  translations: [
    { key: '이거...', en: `Hm — this is actually worth checking seriously. That the three points map to the same point I can confirm by hand; the crux is whether the Jacobian determinant is really the constant −2. Let me crack it open symbolically.` },
    { key: '흥미롭네요', en: `Interesting — on the first symbolic pass, the determinant came out as a literal constant −2. If that's right it's an enormous deal, so let me verify it independently a second way and machine-check the three substitutions too.` },
    { key: '두 번 독립 검증', en: `Both independent checks — symbolic expansion + cofactor expansion, plus six random rational points — give the determinant as **exactly the constant −2**, and exact rational arithmetic confirms all three points land on (−1/4, 0, 0). This isn't "looks right," it's fully machine-verified. Now let me dig into whether this example is in the literature and how it's built.` },
    { key: '이 사례, 수치', en: `Once I finish the numerical check I think I can wrap this up. Last thing: let me confirm how the fiber size varies from point to point — i.e. that the map is genuinely non-injective.` },
    { key: '수치해법이 수렴', en: `The numerical solver won't converge (bad random start points). Let me count the fibers algebraically from the structure instead — eliminate z, then solve the (x, y) system.` },
    { key: '검증 끝났어요', en:
`Verification done. Bottom line: **every claim here is true, and the logic holds.** This isn't "seems plausible" — it's confirmed by exact symbolic computation.

## What I checked

**1. det JF ≡ −2 (constant).** Expanding symbolically two independent ways (direct Jacobian expansion + cofactor expansion), every term cancels and only −2 is left. Substituting 11 random rational points gives −2 every time.

**2. The fiber over (−1/4, 0, 0) is exactly those three points.** A Gröbner-basis solve returns exactly (0, 0, −1/4), (1, −3/2, 13/2), (−1, 3/2, 13/2). The (±1, ∓3/2, 13/2) pair isn't a coincidence: the map has a ℤ/2 symmetry, F(−x, −y, z) = (F₁, −F₂, −F₃), so once one point lands on (F₁, 0, 0) its twin follows automatically.

**3. Generic fibers also have 3 points.** Solving arbitrary targets like (1,2,3) and (2,−1,1) algebraically gives exactly 3 preimages each; over (0,0,0) there is just one. So det is a nonzero constant everywhere (étale) yet the map is generically 3-to-1, with fiber size jumping between 1 and 3 — colliding head-on with Bass–Connell–Wright ("injective ⟺ invertible ⟺ proper" for Keller maps).

**4. Why the determinant is constant (structure).** Writing F = f(x,y) + z·g(x,y) with g = (u³, 3xu², −x³) (u = 1+xy), the vector g lies on the cone B³ + 27CA² = 0, so g·(g_x × g_y) = 0 and the z² term of det vanishes; the rest cancels too. On the surface {F₃ = 0}, (F₁, F₂) = (u(u+1)/x², 2(2u+1)/x), which makes the 3-point fiber transparent: u = −1/2 (i.e. xy = −3/2) gives F₂ = 0, and x² = 1 gives F₁ = −1/4.

## So the conclusion

Exactly as claimed: det JF is a nonzero constant but the map isn't injective, so **this is a genuine counterexample to the Jacobian conjecture in dimension 3**, and multiplying by the identity gives counterexamples in every dimension n ≥ 3. An 87-year-old problem (Keller, 1939); the plane case (n = 2) stays open even with this.

To be honest, though — I couldn't find this example anywhere in the literature, and the Jacobian conjecture is still treated as open for all n ≥ 2. This field has a reputation as a graveyard of false proofs and false counterexamples, and those usually die instantly under exactly this kind of machine check. This one survived. Fittingly, van den Essen once argued — pointing to Markus–Yamabe, true for n = 2 but false for n ≥ 3 — that JC might be false at least in higher dimensions; if this holds, that hunch was right.

The computation is completely elementary, so there's no room for a hidden gap. The next steps aren't math, they're procedure: re-run it in an independent CAS (Magma, Singular, Macaulay2, Mathematica) — ten lines; get it in front of polynomial-maps experts (Jelonek, van den Essen, Rusek); and if it survives, arXiv — this is front-page math news, not just a paper.

One thing I'm curious about: where did this come from? If you built it yourself, that's a very big deal; if you saw it somewhere, we should track down the source together.` },
  ],

  sources: [
    { label: 'the original tweet (@__alpoge__)', href: 'https://x.com/__alpoge__/status/2079028340955197566', c: 'var(--c-gold)' },
    { label: 'the counterexample, explained', href: 'https://jacobianfun.org/jacobian-explained', c: 'var(--c-teal)' },
    { label: 'ForkLog — Fable 5 finds it', href: 'https://forklog.com/en/anthropics-claude-fable-5-finds-counterexample-to-1939-jacobian-conjecture/', c: 'var(--c-violet)' },
  ],
};

export default doc;
