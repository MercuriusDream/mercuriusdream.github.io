import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavTransition } from '../hooks/useNavTransition';
import {
  IconCursor, IconClaude, IconOpenAI, IconZai, IconKimi, IconFireworks,
} from '../components/Icons';

const delay = ms => ({ '--reveal-delay': `${ms}ms` });

const GREEK = [
  { ch: 'λ', color: 'var(--c-teal)' },
  { ch: 'ό', color: 'var(--c-green)' },
  { ch: 'γ', color: 'var(--c-violet)' },
  { ch: 'ο', color: 'var(--c-rose)' },
  { ch: 'ς', color: 'var(--c-rust)' },
];

const MODELS = [
  { label: 'Composer', Icon: IconCursor, color: 'var(--c-teal)' },
  { label: 'Fireworks', Icon: IconFireworks, color: 'var(--c-rose)' },
  { label: 'GLM', Icon: IconZai, color: 'var(--c-violet)', large: true },
  { label: 'GPT', Icon: IconOpenAI, color: 'var(--c-green)' },
  { label: 'KIMI', Icon: IconKimi, color: 'var(--c-gold)' },
  { label: 'Opus', Icon: IconClaude, color: 'var(--c-rust)' },
];

function HL({ color, children }) {
  return <span className="logos-hl" style={{ '--hl': color }}>{children}</span>;
}

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
    <svg className="logos-emblem" viewBox="0 0 100 100" aria-hidden="true" data-glow>
      {WITNESSES.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="6.5" fill={d.c} />)}
      <circle cx="50" cy="50" r="9" fill="var(--ink)" />
    </svg>
  );
}

function BackLink() {
  const navTo = useNavTransition();
  return (
    <button
      onClick={() => navTo('/')}
      className="logos-back"
      data-glow
      aria-label="Back to home"
    >
      ← back
    </button>
  );
}

function ArticleDialog({ onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="logos-modal" onMouseDown={onClose}>
      <div className="logos-modal-card logos-article-card" role="dialog"
        aria-modal="true" aria-labelledby="logos-article-title"
        onMouseDown={e => e.stopPropagation()}>
        <div className="logos-modal-head">
          <h2 id="logos-article-title" className="logos-modal-title">Project Logos</h2>
          <button ref={closeRef} type="button" className="logos-modal-close"
            onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="logos-article">
          <p className="logos-article-lead">
            Project Logos is an agent-driven security research workspace built
            on generally available models. The premise is that frontier AI has
            crossed a threshold in vulnerability discovery, and the capability
            to find and fix critical flaws should belong to everyone, not only
            to those behind closed doors with limited-access agreements.
          </p>
          <p>
            The thesis is <em>logos</em>, structured reason, over <em>ares</em>,
            brute force. Agents read code, map trust boundaries, and reason
            about where systems fail to do what they were designed to do. They
            spawn parallel audits across large attack surfaces, adversarial
            reviews before filing, and cross-checks on uncertain structural
            claims. The markdown files are the orchestration layer. Agents
            open the workspace and self-organize.
          </p>
          <p>
            A frontier lab recently demonstrated that a closed model could find
            thousands of zero-days in every major operating system and web
            browser. They named the initiative after a butterfly and the model
            after the Greek word <em>mythos</em>, meaning narrative. A
            narrative held by few is not yet reason. Logos is the open
            reconstruction: same security capability, same structured
            approach, running on models anyone can audit and deploy.
          </p>
          <p>
            The workspace has produced over KRW 10,000,000 in bounty across
            Google Mobile VRP, NAVER, and Bugcrowd. Findings span OAuth token
            theft, codec out-of-bounds writes, factory reset protection
            bypasses, and compositor integrity failures. The work continues in
            the open.
          </p>
        </div>
      </div>
    </div>
  );
}

function Logos() {
  const [showArticle, setShowArticle] = useState(false);
  const triggerRef = useRef(null);

  const openArticle = () => {
    triggerRef.current = document.activeElement;
    setShowArticle(true);
  };
  const closeArticle = useCallback(() => {
    setShowArticle(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <main id="main" className="logos-doc">
        <div className="logos-content">
          <header className="logos-hero reveal-hero" style={delay(800)}>
            <WitnessMark />
            <h1 className="logos-wordmark">
              <span className="logos-greek" aria-hidden="true">
                {GREEK.map(({ ch, color }, i) => (
                  <span key={i} style={{ '--g': color }}>{ch}</span>
                ))}
              </span>
              <span className="logos-name">Project Logos</span>
            </h1>

            <p className="logos-mission reveal" style={delay(1200)}>
              No one shall be left out. It is a right to defend before the intruder.
            </p>
            <p className="logos-sub reveal" style={delay(1300)}>
              Defensive cybersecurity for the web,{' '}
              <HL color="var(--c-teal)">kept open</HL> and run on{' '}
              <HL color="var(--c-violet)">generally available models</HL>.
            </p>
            <p className="logos-sub reveal" style={delay(1350)}>
              <button
                type="button"
                className="logos-hl"
                data-glow
                style={{ '--hl': 'var(--c-green)' }}
                aria-haspopup="dialog"
                aria-expanded={showArticle}
                onClick={openArticle}
              >
                Read how it works →
              </button>
            </p>
          </header>

          <section className="logos-built reveal" style={delay(1450)}>
            <div className="logos-built-row">
              <div>
                <p className="logos-built-label">Built on</p>
                <div className="logos-marks">
                  {MODELS.map(({ label, Icon, color, large }) => (
                    <span
                      key={label}
                      className={`logos-mark${large ? ' logos-mark-lg' : ''}`}
                      data-glow
                      style={{ '--mk': color }}
                      role="img"
                      aria-label={label}
                    >
                      <Icon />
                    </span>
                  ))}
                </div>
              </div>
              <p className="logos-built-stat">
                KRW <span className="logos-stat-amount">10,000,000</span> in bounty
              </p>
            </div>
          </section>

          <footer className="logos-foot reveal" style={delay(1550)}>
            <BackLink />
          </footer>
        </div>
      </main>

      {showArticle && <ArticleDialog onClose={closeArticle} />}
    </div>
  );
}

export default Logos;