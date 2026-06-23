import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconCursor,
  IconClaude,
  IconOpenAI,
  IconZhipu,
  IconKimi,
  IconFireworks,
} from '../components/Icons';

const revealDelay = (ms) => ({ '--reveal-delay': `${ms}ms` });

const DOTS = [
  'var(--c-teal)',
  'var(--c-green)',
  'var(--c-violet)',
  'var(--c-rose)',
  'var(--c-gold)',
  'var(--c-rust)',
];

// λόγος — the root sits behind the name, each letter a soft hue from the palette.
const GREEK = [
  { ch: 'λ', color: 'var(--c-teal)' },
  { ch: 'ό', color: 'var(--c-green)' },
  { ch: 'γ', color: 'var(--c-violet)' },
  { ch: 'ο', color: 'var(--c-rose)' },
  { ch: 'ς', color: 'var(--c-rust)' },
];

// Built on — generally available models, bare marks each in its own colour.
const MODELS = [
  { label: 'Composer', Icon: IconCursor, color: 'var(--c-teal)' },
  { label: 'Fireworks', Icon: IconFireworks, color: 'var(--c-rose)' },
  { label: 'GLM', Icon: IconZhipu, color: 'var(--c-violet)' },
  { label: 'GPT', Icon: IconOpenAI, color: 'var(--c-green)' },
  { label: 'KIMI', Icon: IconKimi, color: 'var(--c-gold)' },
  { label: 'Opus', Icon: IconClaude, color: 'var(--c-rust)' },
];

// Soft colour highlight — same pill the home page uses on its links.
function HL({ color, children }) {
  return (
    <span className="logos-hl" style={{ '--hl': color }}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pop-up diagrams. Flat dots only — no stroke, no gradient, no shadow. They
// say just enough: many go down to uneven depths; many findings winnow to one.
// ---------------------------------------------------------------------------

// Evenly spaced x positions across [a, b].
const xs = (n, a, b) =>
  Array.from({ length: n }, (_, i) => (n === 1 ? (a + b) / 2 : a + (i * (b - a)) / (n - 1)));

// Agents — a descending fan. They launch from one point and dive to uneven
// depths; the larger dots are the few that surface with a find (the small dot
// trailing above each). A faint sector marks the cone of descent.
const DIVE_RAYS = 9;
const DIVE_DEPTH = [3, 4, 5, 5, 6, 5, 5, 4, 3];
const DIVE_KEEP = new Set([2, 4, 6]);

function buildDive() {
  const apex = { x: 160, y: 32 };
  const half = 40;
  const base = 30;
  const step = 22;
  const out = [];
  for (let i = 0; i < DIVE_RAYS; i++) {
    const t = (i / (DIVE_RAYS - 1)) * 2 - 1;
    const ang = (t * half * Math.PI) / 180;
    const sin = Math.sin(ang);
    const cos = Math.cos(ang);
    const n = DIVE_DEPTH[i];
    const color = DOTS[i % DOTS.length];
    for (let j = 0; j < n; j++) {
      const r = base + j * step;
      const x = apex.x + sin * r;
      const y = apex.y + cos * r;
      const last = j === n - 1;
      const keep = last && DIVE_KEEP.has(i);
      // Dots taper smaller with depth (receding); keepers are the heavy finds.
      const rad = keep ? 6 : Math.max(2.4, 3.6 - j * 0.22);
      // Gradual cascade: deeper dots later, edges trail the centre.
      const delay = 150 + j * 95 + Math.abs(t) * 110;
      // Each dot launches from the apex and travels out to its place.
      out.push({ x, y, r: rad, c: color, k: `a${i}-${j}`, d: delay, dx: apex.x - x, dy: apex.y - y });
    }
  }
  return out;
}
const DIVE_DOTS = buildDive();

function AgentsArt() {
  return (
    <svg className="logos-art" viewBox="0 0 320 210" aria-hidden="true">
      {DIVE_DOTS.map((d) => (
        <circle
          key={d.k}
          className="logos-dot"
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={d.c}
          style={{ '--dx': `${d.dx}px`, '--dy': `${d.dy}px`, animationDelay: `${d.d}ms` }}
        />
      ))}
    </svg>
  );
}

// Methodologies — a funnel. Many findings enter; each stage admits fewer; one
// record holds at the point. A faint funnel body sits behind the winnowing.
// Stages narrow and the survivors grow heavier as fewer pass each filter.
const METHOD_STAGES = [
  { n: 9, y: 46, r: 2.8, x0: 62, x1: 258, shift: 0 },
  { n: 9, y: 66, r: 2.9, x0: 70, x1: 250, shift: 3 },
  { n: 6, y: 112, r: 3.6, x0: 98, x1: 222, shift: 1 },
  { n: 4, y: 150, r: 4.4, x0: 132, x1: 188, shift: 2 },
];

function MethodsArt() {
  return (
    <svg className="logos-art" viewBox="0 0 320 210" aria-hidden="true">
      {METHOD_STAGES.map((s, si) =>
        xs(s.n, s.x0, s.x1).map((x, i) => (
          <circle
            key={`s${si}-${i}`}
            className="logos-dot"
            cx={x}
            cy={s.y}
            r={s.r}
            fill={DOTS[(i + s.shift) % DOTS.length]}
            style={{ '--dy': `${-(28 + si * 12)}px`, animationDelay: `${si * 150 + i * 28}ms` }}
          />
        )),
      )}
      <circle
        className="logos-dot"
        cx="160"
        cy="182"
        r="8"
        fill="var(--ink)"
        style={{ '--dy': '-80px', animationDelay: '760ms' }}
      />
    </svg>
  );
}

const POPS = {
  agents: {
    title: 'Agents',
    Art: AgentsArt,
    caption: 'Many go down, to uneven depths. Few return with anything worth keeping.',
  },
  methodologies: {
    title: 'Methodologies',
    Art: MethodsArt,
    caption: 'Many findings, one that holds. Nothing leaves on a single voice.',
  },
};

function MethodDialog({ data, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const { title, caption, Art } = data;
  return (
    <div className="logos-modal" onMouseDown={onClose}>
      <div
        className="logos-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logos-modal-title"
        aria-describedby="logos-modal-caption"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="logos-modal-head">
          <h2 id="logos-modal-title" className="logos-modal-title">{title}</h2>
          <button ref={closeRef} type="button" className="logos-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <Art />
        <p id="logos-modal-caption" className="logos-modal-caption">{caption}</p>
      </div>
    </div>
  );
}

// The witnesses mark: one record at the centre, ringed by the models that watch
// it. Flat fills, every palette hue, no gradient or shadow — the house style.
const WITNESSES = [
  { x: 50, y: 13, c: 'var(--c-teal)' },
  { x: 82, y: 31.5, c: 'var(--c-green)' },
  { x: 82, y: 68.5, c: 'var(--c-violet)' },
  { x: 50, y: 87, c: 'var(--c-rose)' },
  { x: 18, y: 68.5, c: 'var(--c-gold)' },
  { x: 18, y: 31.5, c: 'var(--c-rust)' },
];

function WitnessMark() {
  return (
    <svg className="logos-emblem" viewBox="0 0 100 100" aria-hidden="true">
      {WITNESSES.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="6.5" fill={d.c} />
      ))}
      <circle cx="50" cy="50" r="9" fill="var(--ink)" />
    </svg>
  );
}

function BackLink() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        document.documentElement.classList.add('vt-ready');
        navigate('/', { viewTransition: true });
      }}
      className="logos-back"
      aria-label="Back to home"
    >
      ← back
    </button>
  );
}

function Logos() {
  const [openKey, setOpenKey] = useState(null);
  const triggerRef = useRef(null);

  const openPop = (key) => (e) => {
    triggerRef.current = e.currentTarget;
    setOpenKey(key);
  };
  const closePop = useCallback(() => {
    setOpenKey(null);
    triggerRef.current?.focus();
  }, []);

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <main id="main" className="logos-doc">
        <div className="logos-content">
          <header className="logos-hero reveal-hero" style={revealDelay(0)}>
            <WitnessMark />
            <h1 className="logos-wordmark">
              <span className="logos-greek" aria-hidden="true">
                {GREEK.map(({ ch, color }, i) => (
                  <span key={i} style={{ '--g': color }}>{ch}</span>
                ))}
              </span>
              <span className="logos-name">Project Logos</span>
            </h1>

            <p className="logos-mission reveal" style={revealDelay(120)}>
              No one shall be left out. It is a right to defend before the intruder.
            </p>
            <p className="logos-sub reveal" style={revealDelay(170)}>
              Defensive cybersecurity for the web,{' '}
              <HL color="var(--c-teal)">kept open</HL> and run on{' '}
              <HL color="var(--c-violet)">generally available models</HL>.
            </p>
            <p className="logos-sub reveal" style={revealDelay(215)}>
              See{' '}
              <button
                type="button"
                className="logos-hl logos-hl-btn"
                style={{ '--hl': 'var(--c-green)' }}
                aria-haspopup="dialog"
                aria-expanded={openKey === 'agents'}
                onClick={openPop('agents')}
              >
                agents
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="logos-hl logos-hl-btn"
                style={{ '--hl': 'var(--c-gold)' }}
                aria-haspopup="dialog"
                aria-expanded={openKey === 'methodologies'}
                onClick={openPop('methodologies')}
              >
                methodologies
              </button>.
            </p>
          </header>

          <section className="logos-built reveal" style={revealDelay(285)}>
            <p className="logos-built-label">Built on</p>
            <div className="logos-marks">
              {MODELS.map(({ label, Icon, color }) => (
                <span
                  key={label}
                  className="logos-mark"
                  style={{ '--mk': color }}
                  role="img"
                  aria-label={label}
                >
                  <Icon />
                </span>
              ))}
            </div>
          </section>

          <footer className="logos-foot reveal" style={revealDelay(345)}>
            <BackLink />
          </footer>
        </div>
      </main>

      {openKey && <MethodDialog data={POPS[openKey]} onClose={closePop} />}
    </div>
  );
}

export default Logos;
