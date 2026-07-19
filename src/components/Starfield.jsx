import { useRef, useEffect } from 'react';

// ── Starfield: fixed canvas, dreamy deep-space background. Zero deps. ──

const FAR = 80, MID = 40, NEAR = 15;
const LAYERS = [
  { n: FAR,  depth: 0, rMin: 0.3, rMax: 0.9, aMin: 0.20, aMax: 0.60, twMin: 0.2, twMax: 0.5, px: 2  },
  { n: MID,  depth: 1, rMin: 0.5, rMax: 1.3, aMin: 0.30, aMax: 0.65, twMin: 0.3, twMax: 0.8, px: 8  },
  { n: NEAR, depth: 2, rMin: 0.8, rMax: 2.0, aMin: 0.40, aMax: 0.75, twMin: 0.4, twMax: 1.0, px: 20 },
];
const NEBULAE = [
  { color: '79,123,134',  alpha: 0.055, size: 0.45 },
  { color: '118,102,141', alpha: 0.045, size: 0.38 },
  { color: '184,106,142', alpha: 0.035, size: 0.32 },
];
const TINTS = ['79,123,134', '118,102,141', '184,106,142', '138,109,78'];
const WHITE = '232,234,240';

const ENTRANCE_MS = 2200;
const SMOOTH_RATE = 5.0;
const WARP_MS = 600;

const easeOutExpo = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const lerp = (a, b, t) => a + (b - a) * t;

const WINDOWS = [[0.0, 0.27], [0.36, 0.64], [0.55, 0.82]];
const layerIn = (depth, p) => {
  const [s, e] = WINDOWS[depth];
  return p <= s ? 0 : p >= e ? 1 : easeOutExpo((p - s) / (e - s));
};
const nebIn = p => (p <= 0.18 ? 0 : p >= 0.55 ? 1 : easeOutExpo((p - 0.18) / 0.37));

function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0;
    let stars = [], nebulae = [];
    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
    let hover = null;
    let entrance = 0, entranceStart = 0;
    let warp = 0, warpStart = 0;
    let raf = null, lastT = 0, time = 0;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      buildNebulae();
    }

    function buildStars() {
      stars = [];
      for (const L of LAYERS) {
        for (let i = 0; i < L.n; i++) {
          stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: L.rMin + Math.random() * (L.rMax - L.rMin),
            baseA: L.aMin + Math.random() * (L.aMax - L.aMin),
            tw: L.twMin + Math.random() * (L.twMax - L.twMin),
            phase: Math.random() * Math.PI * 2,
            depth: L.depth,
            parallax: L.px,
            tint: L.depth === 2 && Math.random() < 0.35
              ? TINTS[Math.floor(Math.random() * TINTS.length)]
              : null,
          });
        }
      }
    }

    function buildNebulae() {
      nebulae = NEBULAE.map((c, i) => ({
        bx: W * (0.2 + i * 0.3 + Math.random() * 0.1),
        by: H * (0.3 + Math.random() * 0.4),
        r: Math.max(W, H) * c.size,
        color: c.color,
        maxA: c.alpha,
        ang: Math.random() * Math.PI * 2,
        spd: 0.02 + Math.random() * 0.015,
        drift: 30 + Math.random() * 40,
      }));
    }

    function drawNebulae(nebAlpha, t) {
      if (nebAlpha <= 0) return;
      for (const n of nebulae) {
        const dx = n.bx + Math.cos(n.ang + t * n.spd) * n.drift + mouse.cx * 15;
        const dy = n.by + Math.sin(n.ang + t * n.spd) * n.drift + mouse.cy * 10;
        const g = ctx.createRadialGradient(dx, dy, 0, dx, dy, n.r);
        const a = n.maxA * nebAlpha;
        g.addColorStop(0, `rgba(${n.color},${a})`);
        g.addColorStop(0.5, `rgba(${n.color},${a * 0.4})`);
        g.addColorStop(1, `rgba(${n.color},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(dx - n.r, dy - n.r, n.r * 2, n.r * 2);
      }
    }

    function drawStars(p, t, warpP) {
      for (const s of stars) {
        const lp = layerIn(s.depth, p);
        if (lp <= 0) continue;
        const tw = 0.7 + 0.3 * Math.sin(t * s.tw + s.phase);
        let a = s.baseA * tw * lp;
        const sx = s.x + mouse.cx * s.parallax;
        const sy = s.y + mouse.cy * s.parallax;

        if (hover) {
          const d = Math.hypot(sx - hover.x, sy - hover.y);
          if (d < hover.r) a = Math.min(1, a + (1 - d / hover.r) * 0.4 * lp);
        }

        if (warpP > 0) a = Math.min(1, a + warpP * 0.25 * lp);

        const c = s.tint || WHITE;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${a})`;
        ctx.fill();

        if (s.depth === 2 && a > 0.4) {
          const gl = s.r * 3;
          ctx.strokeStyle = `rgba(${c},${a * 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sx - gl, sy); ctx.lineTo(sx + gl, sy);
          ctx.moveTo(sx, sy - gl); ctx.lineTo(sx, sy + gl);
          ctx.stroke();
        }
      }
    }

    function frame(now) {
      const dt = Math.min((now - lastT) / 1000, 0.1);
      lastT = now;
      time += dt;

      if (entrance < 1) entrance = Math.min(1, (now - entranceStart) / ENTRANCE_MS);
      if (warp > 0) warp = Math.max(0, 1 - (now - warpStart) / WARP_MS);

      const sm = 1 - Math.exp(-SMOOTH_RATE * dt);
      mouse.cx = lerp(mouse.cx, mouse.tx, sm);
      mouse.cy = lerp(mouse.cy, mouse.ty, sm);

      document.documentElement.style.setProperty('--mx', mouse.cx.toFixed(4));
      document.documentElement.style.setProperty('--my', mouse.cy.toFixed(4));

      ctx.clearRect(0, 0, W, H);
      drawNebulae(nebIn(entrance), time);
      drawStars(entrance, time, warp);

      raf = requestAnimationFrame(frame);
    }

    function staticFrame() {
      ctx.clearRect(0, 0, W, H);
      drawNebulae(1, 0);
      drawStars(1, 0, 0);
    }

    const onMove = e => {
      mouse.tx = (e.clientX / W) * 2 - 1;
      mouse.ty = (e.clientY / H) * 2 - 1;
    };
    const onOver = e => {
      const el = e.target.closest?.('[data-glow]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      hover = { x: r.left + r.width / 2, y: r.top + r.height / 2, r: 120 };
    };
    const onOut = e => { if (e.target.closest?.('[data-glow]')) hover = null; };
    const onRoute = () => {
      if (entrance > 0.5) { warpStart = performance.now(); warp = 1; }
    };
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); if (reduced) staticFrame(); }, 150);
    };

    resize();
    entranceStart = performance.now();
    lastT = entranceStart;

    if (reduced) {
      staticFrame();
    } else {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('pointerover', onOver, { passive: true });
      window.addEventListener('pointerout', onOut, { passive: true });
      window.addEventListener('starfield:route', onRoute);
      window.addEventListener('resize', onResize);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('starfield:route', onRoute);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}

export default Starfield;