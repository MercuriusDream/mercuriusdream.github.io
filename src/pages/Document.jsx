import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNavTransition } from '../hooks/useNavTransition';
import docs from '../docs';
import './Document.css';

const delay = ms => ({ '--reveal-delay': `${ms}ms` });

// ── Parse a raw model transcript into typed segments ──────────────────────
const BLOCK = /<thinking>([\s\S]*?)<\/thinking>|<python>([\s\S]*?)<\/python>|<web_search>([\s\S]*?)<\/web_search>/g;
const grab = (s, tag) => {
  const m = s.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].replace(/^\n+|\n+$/g, '') : '';
};
function parse(raw) {
  const segs = [];
  let last = 0, m;
  BLOCK.lastIndex = 0;
  const pushProse = txt => { const t = txt.trim(); if (t) segs.push({ t: 'prose', text: t }); };
  while ((m = BLOCK.exec(raw))) {
    pushProse(raw.slice(last, m.index));
    if (m[1] !== undefined) segs.push({ t: 'think', text: m[1].trim() });
    else if (m[2] !== undefined) segs.push({ t: 'py', code: grab(m[2], 'code'), out: grab(m[2], 'output') });
    else segs.push({ t: 'search', query: grab(m[3], 'query').trim() });
    last = BLOCK.lastIndex;
  }
  pushProse(raw.slice(last));
  return segs;
}

// ── Tiny markdown-ish renderer: ## heading, - bullet, **bold**, paragraphs ─
function inline(s, k) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={`${k}-${i}`}>{p.slice(2, -2)}</strong>
      : p);
}
function Prose({ text }) {
  const out = [];
  let para = [], list = [];
  const flushP = () => { if (para.length) { out.push(<p key={out.length}>{inline(para.join(' '), out.length)}</p>); para = []; } };
  const flushL = () => { if (list.length) { out.push(<ul key={out.length}>{list.map((li, i) => <li key={i}>{inline(li, i)}</li>)}</ul>); list = []; } };
  for (const raw of text.split('\n')) {
    const s = raw.trim();
    if (!s) { flushP(); flushL(); }
    else if (s.startsWith('## ')) { flushP(); flushL(); out.push(<h3 key={out.length}>{s.slice(3)}</h3>); }
    else if (s.startsWith('- ')) { flushP(); list.push(s.slice(2)); }
    else { flushL(); para.push(s); }
  }
  flushP(); flushL();
  return <>{out}</>;
}

// ── Segment views ─────────────────────────────────────────────────────────
function Fold({ label, peek, open = false, children }) {
  return (
    <details className="tx-fold" open={open}>
      <summary>
        <span className="tx-chev" aria-hidden="true" />
        <span className="tx-label">{label}</span>
        {peek && <span className="tx-peek">{peek}</span>}
      </summary>
      <div className="tx-fold-body">{children}</div>
    </details>
  );
}

function Search({ query, results }) {
  return (
    <details className="tx-fold tx-search">
      <summary>
        <span className="tx-chev" aria-hidden="true" />
        <span className="tx-label">Web search</span>
        <span className="tx-peek">{query}</span>
      </summary>
      <div className="tx-fold-body">
        <p className="tx-query">{query}</p>
        <ol className="tx-results">
          {results.map((r, i) => (
            <li key={i} className="tx-res">
              {r.u
                ? <a className="tx-res-title" href={r.u} target="_blank" rel="noopener noreferrer" data-glow>{r.t} <span className="tx-res-ext" aria-hidden="true">↗</span></a>
                : <span className="tx-res-title tx-res-plain">{r.t}</span>}
              <span className="tx-res-src">{r.s}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

function Segment({ seg, doc, searchIndex }) {
  if (seg.t === 'think') {
    const peek = seg.text.replace(/\s+/g, ' ').trim().slice(0, 88);
    return <Fold label="Thinking" peek={`${peek}…`}><pre className="tx-think-body">{seg.text}</pre></Fold>;
  }
  if (seg.t === 'py') {
    return (
      <div className="tx-py">
        <Fold label="Code"><pre className="tx-code">{seg.code}</pre></Fold>
        {seg.out && <Fold label="Output" open><pre className="tx-out">{seg.out}</pre></Fold>}
      </div>
    );
  }
  if (seg.t === 'search') {
    return <Search query={seg.query} results={doc.searchResults?.[searchIndex] || []} />;
  }
  const tr = doc.translations?.find(t => seg.text.trimStart().startsWith(t.key));
  return (
    <div className="tx-say">
      <div className="tx-ko"><Prose text={seg.text} /></div>
      {tr && <div className="tx-en"><span className="tx-label">English</span><Prose text={tr.en} /></div>}
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

function Document() {
  const { slug } = useParams();
  const doc = docs[slug];
  const navTo = useNavTransition();
  const segs = useMemo(() => (doc?.transcript ? parse(doc.transcript) : []), [doc]);

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

  const Mark = doc.mark;
  let searchIndex = 0;

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <main id="main" className="doc-scroll" style={{ '--doc-accent': doc.accent || 'var(--c-teal)' }}>
        <article className="doc doc-article">
          <header className="doc-head">
            <p className="doc-kicker reveal-hero" style={delay(680)}>
              {doc.kicker}
              {Mark && <> · <span className="doc-mark" aria-hidden="true"><Mark /></span> {doc.markLabel}</>}
            </p>
            <h1 className="doc-title reveal-hero" style={delay(760)}>{doc.title}</h1>
            {doc.subtitle && <p className="doc-subtitle reveal" style={delay(840)}>{doc.subtitle}</p>}
            {doc.intro && (
              <p className="doc-intro reveal" style={delay(920)}>
                {doc.intro}
                {doc.tweet && <> <a className="doc-tweet" href={doc.tweet.url} target="_blank" rel="noopener noreferrer" data-glow>{doc.tweet.label} ↗</a></>}
              </p>
            )}
          </header>

          <div className="tx reveal" style={delay(1020)}>
            {segs.map((seg, i) => {
              const si = seg.t === 'search' ? searchIndex++ : 0;
              return <Segment key={i} seg={seg} doc={doc} searchIndex={si} />;
            })}
          </div>

          {doc.sources?.length > 0 && (
            <div className="doc-sources reveal">
              <span className="doc-src-label">sources</span>
              {doc.sources.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="inline-link" data-glow style={{ '--link-accent': s.c }}>
                  {s.label}
                </a>
              ))}
            </div>
          )}

          <footer className="doc-foot reveal"><BackLink /></footer>
        </article>
      </main>
    </div>
  );
}

export default Document;
