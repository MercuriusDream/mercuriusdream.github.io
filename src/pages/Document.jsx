import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavTransition } from '../hooks/useNavTransition';
import docs from '../docs';
import './Document.css';

// Reusable long-form reader. Content lives per-doc in ../docs as inline JS;
// this only knows how to render a doc model. Its design is Document.css.

const delay = ms => ({ '--reveal-delay': `${ms}ms` });
const TICKS = ['var(--c-teal)', 'var(--c-green)', 'var(--c-rose)', 'var(--c-gold)'];

// A bilingual value is a plain { en, ko } object; anything else (string or a
// React element) is passed through untouched.
const isEl = v => v && typeof v === 'object' && v.$$typeof;
const pick = (v, lang) => (v && typeof v === 'object' && !isEl(v) ? (v[lang] ?? v.en) : v);

function Panel({ head, rows }) {
  return (
    <div className="doc-panel">
      {head && <div className="doc-panel-head">{head}</div>}
      {rows.map(r => (
        <div className="doc-panel-row" key={r.lbl}>
          <span className="doc-panel-lbl" style={{ '--mk': r.c }}>{r.lbl}</span>
          <span className="doc-panel-eq">{r.eq}</span>
        </div>
      ))}
    </div>
  );
}

function Receipt({ tag, lines }) {
  return (
    <div className="doc-receipt">
      {tag && <span className="doc-receipt-tag">{tag}</span>}
      {lines.map((l, i) => <p key={i} className="doc-out">{l}</p>)}
    </div>
  );
}

function BackLink() {
  const navTo = useNavTransition();
  return (
    <button onClick={() => navTo('/')} className="doc-back" data-glow aria-label="Back to home">
      ← back
    </button>
  );
}

function Block({ b, L, style }) {
  switch (b.t) {
    case 'panel':   return <div className="reveal" style={style}><Panel head={b.head} rows={b.rows} /></div>;
    case 'receipt': return <div className="reveal" style={style}><Receipt tag={b.tag} lines={b.lines} /></div>;
    case 'h':       return <h2 className="doc-h reveal" style={style}>{L(b)}</h2>;
    case 'list':
      return (
        <ul className="doc-list reveal" style={style}>
          {b.items.map((it, j) => (
            <li className="doc-li" key={j}>
              <span className="doc-tick" style={{ '--k': TICKS[j % TICKS.length] }} />
              <span>{L(it)}</span>
            </li>
          ))}
        </ul>
      );
    case 'say':     return <p className="doc-say reveal" style={style}>{L(b)}</p>;
    default: {
      const tone = b.tone === 'lead' ? ' doc-p--lead' : b.tone === 'close' ? ' doc-p--close' : '';
      return <p className={`doc-p${tone} reveal`} style={style}>{L(b)}</p>;
    }
  }
}

function Document() {
  const { slug } = useParams();
  const doc = docs[slug];
  const [lang, setLang] = useState(doc?.lang || 'en');
  const navTo = useNavTransition();

  if (!doc) {
    return (
      <div className="app">
        <main id="main" className="doc-scroll">
          <div className="doc doc-404">
            <p>No writing lives at this address.</p>
            <button onClick={() => navTo('/')} className="doc-back" data-glow>← back</button>
          </div>
        </main>
      </div>
    );
  }

  const L = v => pick(v, lang);
  const bilingual = doc.title && typeof doc.title === 'object' && !isEl(doc.title) && doc.title.ko;
  const Mark = doc.mark;
  let step = 820;
  const next = () => (step += 80);

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <main id="main" className="doc-scroll" style={{ '--doc-accent': doc.accent || 'var(--c-teal)' }}>
        <article className="doc" lang={lang === 'ko' ? 'ko' : 'en'}>
          <div className="doc-top reveal-hero" style={delay(700)}>
            <p className="doc-kicker">
              {doc.kicker}
              {Mark && <> · <span className="doc-mark" aria-hidden="true"><Mark /></span> {doc.markLabel}</>}
            </p>
            {bilingual && (
              <div className="doc-lang" role="group" aria-label="Language">
                <button type="button" data-glow
                  className={`doc-lang-btn${lang === 'en' ? ' is-on' : ''}`}
                  aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
                <button type="button" data-glow
                  className={`doc-lang-btn${lang === 'ko' ? ' is-on' : ''}`}
                  aria-pressed={lang === 'ko'} onClick={() => setLang('ko')}>한국어</button>
              </div>
            )}
          </div>

          <h1 className="doc-title reveal-hero" style={delay(800)}>{L(doc.title)}</h1>

          <div className="doc-body">
            {doc.blocks.map((b, i) => <Block key={i} b={b} L={L} style={delay(next())} />)}
          </div>

          {doc.sources?.length > 0 && (
            <div className="doc-sources reveal" style={delay(next())}>
              <span className="doc-src-label">sources</span>
              {doc.sources.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="inline-link" data-glow style={{ '--link-accent': s.c }}>
                  {s.label}
                </a>
              ))}
            </div>
          )}

          <footer className="doc-foot reveal" style={delay(next())}>
            <BackLink />
          </footer>
        </article>
      </main>
    </div>
  );
}

export default Document;
