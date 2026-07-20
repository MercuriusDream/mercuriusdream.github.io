import { IconKimi } from '../components/Icons';

// Redaction marker for the private notes I gave the model.
const R = () => <span className="doc-redact">[REDACTED]</span>;

// Inline content model. `say` blocks are the model's own words, verbatim from
// the run (Korean original; the English is my translation). `p` blocks are my
// own framing. Blocks with math (panel / receipt) are language-neutral.
const doc = {
  slug: 'minus-two',
  lang: 'en',
  accent: 'var(--c-gold)',
  kicker: 'field log · 2026·07·21',
  mark: IconKimi,
  markLabel: 'Kimi K3',

  // shown in the /writings index
  date: 'Jul 21, 2026',
  listTitle: 'tried proving that jacobian thing on an open-weights LLM',
  blurb: `Feeding the 87-year-old Jacobian conjecture's two-day-old counterexample, cold, to an open-weights model — det ≡ −2, three points, one image.`,

  title: {
    en: <>tried proving that jacobian thing on an open-weights LLM — <b>and yes, it works</b></>,
    ko: <>그 야코비안 걸 오픈 웨이트 LLM으로 증명해봤는데 — <b>네, 되네요</b></>,
  },

  blocks: [
    { t: 'p', tone: 'lead',
      en: `Two days ago someone knocked over a conjecture that had stood since 1939, and the whole counterexample fits on one line. I wanted to know whether it would survive on a model I can actually run myself — so I handed it, cold, to Kimi K3, an open-weights LLM, told it nothing, and asked it to find the mistake. It never found one. It proved the thing works.`,
      ko: `이틀 전에 누군가 1939년부터 버티던 추측 하나를 넘어뜨렸는데, 반례가 딱 한 줄이에요. 내가 직접 돌릴 수 있는 모델에서도 살아남는지 궁금했어요 — 그래서 오픈 웨이트 LLM인 Kimi K3한테 아무 설명 없이 맨몸으로 던져주고 "틀린 데 찾아봐"라고 했죠. 끝내 못 찾더라고요. 오히려 이게 진짜 된다는 걸 증명해줬어요.` },

    { t: 'p',
      en: `The Jacobian conjecture says: if a polynomial map F : ℂⁿ → ℂⁿ has a Jacobian determinant that is a nonzero constant, it must be invertible — a bijection with a polynomial inverse. Local rigidity forcing a global one. Trivially true in dimension one, believed in all the rest. Here is the map that breaks it, in dimension three, with u = 1 + xy:`,
      ko: `야코비안 추측은 이래요: 다항식 사상 F : ℂⁿ → ℂⁿ의 야코비안 행렬식이 0이 아닌 상수라면, 그 사상은 반드시 가역 — 다항식 역함수를 갖는 전단사 — 이어야 한다. 국소적 강성이 대역적 강성을 강제한다는 거죠. 1차원에선 자명하게 참이고, 나머지 전부에서 믿어져 왔어요. 이걸 깨는 사상이 아래예요. 3차원, u = 1 + xy:` },

    { t: 'panel', head: 'F(x, y, z) = ( F₁, F₂, F₃ ),   u = 1 + xy', rows: [
      { lbl: 'F₁', c: 'var(--c-teal)',  eq: '= u³z + y²u(4 + 3xy)' },
      { lbl: 'F₂', c: 'var(--c-green)', eq: '= y + 3xu²z + 3xy²(4 + 3xy)' },
      { lbl: 'F₃', c: 'var(--c-rose)',  eq: '= 2x − 3x²y − x³z' },
    ] },

    { t: 'receipt', tag: 'the two lines that finish it', lines: [
      'det JF ≡ −2   — a nonzero constant, at every point',
      'F(0, 0, −1/4) = F(1, −3/2, 13/2) = F(−1, 3/2, 13/2) = (−1/4, 0, 0)',
    ] },

    { t: 'p',
      en: `A bijection cannot send three distinct points to the same place. So the map satisfies the hypothesis and fails the conclusion — that is the entire disproof. Below is what the model did with it, unedited (my own private notes to it are redacted):`,
      ko: `전단사는 서로 다른 세 점을 같은 곳으로 보낼 수 없어요. 그러니 이 사상은 가정을 만족하면서 결론을 어기는 거고 — 그게 반증의 전부예요. 아래는 모델이 이걸 받고 한 일을 손대지 않고 옮긴 거예요 (제가 준 개인 메모는 가렸어요):` },

    { t: 'say',
      en: `This is actually worth checking seriously. The three points landing on one image I can confirm by hand — the real question is whether the Jacobian determinant is genuinely the constant −2. Let me crack it open symbolically.`,
      ko: `이거… 진지하게 검증해볼 가치가 있는 주장이네요. 세 점이 같은 점으로 가는 건 손으로도 확인되는데, 핵심은 야코비안 행렬식이 정말 상수 −2가 맞는지예요. 직접 기호연산으로 까봅시다.` },
    { t: 'receipt', tag: 'returned', lines: [
      'det JF  =  −2   (expanded → −2 ; factored → −2)',
      'F(0,0,−1/4)  →  (−1/4, 0, 0)',
      'F(1,−3/2,13/2)  →  (−1/4, 0, 0)',
      'F(−1,3/2,13/2)  →  (−1/4, 0, 0)',
    ] },

    { t: 'say',
      en: `Interesting — on the first pass the determinant fell straight to a literal constant −2. If that holds it is enormous, so let me verify it a second, independent way and machine-check the three substitutions too.`,
      ko: `흥미롭네요 — 첫 기호연산에서 행렬식이 문자 그대로 상수 −2로 떨어졌어요. 이게 맞다면 엄청난 일이니까, 다른 방법으로 한 번 더 독립 검증하고, 세 점 대입도 기계로 확인할게요.` },
    { t: 'receipt', tag: 'returned', lines: [
      'manual cofactor expansion  →  −2',
      'det at 6 random rational points  →  −2, every time',
      'the three points  →  (−1/4, 0, 0), exact arithmetic',
    ] },

    { t: 'say',
      en: <>Honestly, my first read was that this could not be real. A degree-seven counterexample you can verify in ten seconds — for a problem thousands of people have hammered on with computers — should have surfaced from a brute-force search decades ago. So I went looking for the trap first. <R /> But there is no escape hatch in the logic: if the determinant is a nonzero constant and three distinct points share an image, the map satisfies the hypothesis and breaks the conclusion. That simply <em>is</em> a counterexample.</>,
      ko: <>솔직히 처음엔 이게 진짜일 리 없다고 봤어요. 10초면 검증되는 7차 반례라면, 수천 명이 컴퓨터로 두들겨본 문제에서 진작 브루트포스로 튀어나왔어야 하잖아요. 그래서 함정부터 찾아 나섰죠. <R /> 근데 논리엔 빠져나갈 구멍이 없어요: 행렬식이 0이 아닌 상수이고 서로 다른 세 점이 같은 상을 가지면, 그 사상은 가정을 만족하면서 결론을 어기는 거예요. 그게 <em>바로</em> 반례죠.</> },

    { t: 'say',
      en: `The numerical solver will not converge (bad random seeds). Let me count the fibers algebraically from the structure instead — eliminate z, then solve the (x, y) system.`,
      ko: `수치해법이 수렴을 못 하네요(랜덤 시작점 문제). 대신 구조를 이용해서 대수적으로 fiber를 세어볼게요 — z를 소거하고 (x, y) 방정식으로 풀면 됩니다.` },
    { t: 'receipt', tag: 'returned', lines: [
      'fiber over (−1/4,0,0)  =  exactly {(0,0,−1/4), (1,−3/2,13/2), (−1,3/2,13/2)}',
      'generic fibers — over (1,2,3) and (2,−1,1)  →  3 preimages each',
      'fiber over (0,0,0)  →  1 preimage',
      '⇒  étale everywhere (det ≡ −2), yet generically 3-to-1 — not injective',
    ] },

    { t: 'h', en: 'So, the conclusion', ko: '그래서 결론은' },

    { t: 'list', items: [
      { en: `det JF ≡ −2 — constant, confirmed two symbolic ways and at eleven separate points.`,
        ko: `det JF ≡ −2 — 상수, 두 가지 기호 방법과 별개의 점 11곳에서 확인.` },
      { en: `The fiber over (−1/4, 0, 0) is exactly those three points.`,
        ko: `(−1/4, 0, 0)의 fiber는 정확히 그 세 점.` },
      { en: `Generic fibers hold three preimages — the map is étale but 3-to-1, so non-injective.`,
        ko: `일반 fiber는 세 개 — étale인데 3-to-1이라, 비단사.` },
      { en: `A non-injective map with a constant nonzero Jacobian is exactly what the conjecture forbids.`,
        ko: `0이 아닌 상수 야코비안을 가지면서 비단사인 사상 — 추측이 금지하던 바로 그것.` },
    ] },

    { t: 'p',
      en: `So this is a non-injective Keller map ℂ³ → ℂ³. For such maps injective ⇔ invertible, so it cannot be an automorphism — which makes it a counterexample to the Jacobian conjecture in dimension three, and hence in every dimension ≥ 3. Dimension two stays open.`,
      ko: `그래서 이건 비단사 Keller 사상 ℂ³ → ℂ³이에요. 이런 사상에선 '단사 ⇔ 가역'이라 자기동형일 수 없고, 곧 3차원(따라서 n ≥ 3 전부)에서 야코비안 추측의 반례가 됩니다. 2차원은 아직 열려 있고요.` },

    { t: 'p',
      en: `And it is real. Levent Alpöge announced this counterexample on July 19, 2026 — worked out with Akhil and Anthropic's Claude Fable 5 — barely two days before I fed it to K3. There is no peer review yet, and a model's arithmetic is only a claim. Except here the whole object is a page of SymPy anyone can run, which is precisely why an open-weights model I control could reproduce it cold, with nothing but the map.`,
      ko: `그리고 이건 진짜예요. Levent Alpöge가 2026년 7월 19일에 이 반례를 발표했고 — Akhil, 그리고 Anthropic의 Claude Fable 5와 함께 만들었대요 — 제가 K3에 던지기 딱 이틀 전이었죠. 아직 동료평가는 없고, 모델의 계산은 주장일 뿐이에요. 다만 여기선 대상 전체가 누구나 돌릴 수 있는 SymPy 한 페이지라서, 제가 직접 통제하는 오픈 웨이트 모델이 지도 한 장 없이 맨몸으로 재현할 수 있었던 거예요.` },

    { t: 'p', tone: 'close',
      en: `Eighty-seven years to find three points. Ten seconds to check them.`,
      ko: `세 점을 찾는 데 87년. 확인하는 데 10초.` },
  ],

  sources: [
    { label: 'the counterexample, explained', href: 'https://jacobianfun.org/jacobian-explained', c: 'var(--c-teal)' },
    { label: 'ForkLog — Fable 5 finds it', href: 'https://forklog.com/en/anthropics-claude-fable-5-finds-counterexample-to-1939-jacobian-conjecture/', c: 'var(--c-violet)' },
    { label: 'officechai — the announcement', href: 'https://officechai.com/ai/an-anthropic-researcher-says-fable-just-helped-him-disprove-the-85-year-old-jacobian-conjecture/', c: 'var(--c-gold)' },
  ],
};

export default doc;
