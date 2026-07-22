import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavTransition } from '../hooks/useNavTransition';
import { IconShare, IconCheck } from '../components/Icons';
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

// ── Tiny markdown-ish renderer ────────────────────────────────────────────
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
function Fold({ label, tone, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`tx-fold tx-fold--${tone}${open ? ' is-open' : ''}`}>
      <button type="button" className="tx-summary" aria-expanded={open}
        onClick={() => setOpen(o => !o)}>
        <span className="tx-chev" aria-hidden="true" />
        <span className="tx-label">{label}</span>
      </button>
      <div className="tx-fold-body"><div className="tx-fold-body-inner">{children}</div></div>
    </div>
  );
}

function Search({ query, results }) {
  return (
    <Fold label="Web search" tone="search">
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
    </Fold>
  );
}

function LangSwitch({ lang, setLang, place }) {
  return (
    <div className={`doc-lang doc-lang--${place}`} role="group" aria-label="Language">
      <button type="button" data-glow className={`doc-lang-btn${lang === 'en' ? ' is-on' : ''}`}
        aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
      <button type="button" data-glow className={`doc-lang-btn${lang === 'ko' ? ' is-on' : ''}`}
        aria-pressed={lang === 'ko'} onClick={() => setLang('ko')}>한국어</button>
    </div>
  );
}

function renderIntro(intro, tweet) {
  if (!tweet || !intro.includes('{tweet}')) return intro;
  const [a, b] = intro.split('{tweet}');
  return <>{a}<a className="doc-tweet" href={tweet.url} target="_blank" rel="noopener noreferrer" data-glow>{tweet.label} ↗</a>{b}</>;
}

function Segment({ seg, doc, lang, searchIndex }) {
  if (seg.t === 'think') {
    return <Fold label="Thinking" tone="think"><pre className="tx-think-body">{seg.text}</pre></Fold>;
  }
  if (seg.t === 'py') {
    return (
      <Fold label="Code" tone="code">
        <pre className="tx-code">{seg.code}</pre>
        {seg.out && <pre className="tx-out">{seg.out}</pre>}
      </Fold>
    );
  }
  if (seg.t === 'search') {
    return <Search query={seg.query} results={doc.searchResults?.[searchIndex] || []} />;
  }
  const tr = doc.translations?.find(t => seg.text.trimStart().startsWith(t.key));
  const showEn = lang === 'en' && tr;
  return <div className="tx-prose" lang={showEn ? 'en' : 'ko'}><Prose text={showEn ? tr.en : seg.text} /></div>;
}

function BackLink() {
  const navTo = useNavTransition();
  return (
    <button onClick={() => navTo('/writings')} className="doc-back" data-glow aria-label="Back to writings">
      ← back
    </button>
  );
}

function ShareButton({ doc }) {
  const [copied, setCopied] = useState(false);
  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: doc.title, text: doc.blurb || doc.subtitle || doc.title, url });
        return;
      } catch (e) {
        if (e?.name === 'AbortError') return; // user dismissed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* no clipboard access — nothing to do */ }
  };
  return (
    <button type="button" onClick={onShare}
      className={`doc-share${copied ? ' is-copied' : ''}`} data-glow
      aria-label={copied ? 'Link copied' : 'Share this writing'}>
      {copied ? <IconCheck /> : <IconShare />}
    </button>
  );
}

function Document() {
  const { slug } = useParams();
  const doc = docs[slug];
  const navTo = useNavTransition();
  const segs = useMemo(() => (doc?.transcript ? parse(doc.transcript) : []), [doc]);
  const [lang, setLang] = useState('en');

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
  const bilingual = doc.translations?.length > 0;
  let searchIndex = 0;

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <main id="main" className="doc-scroll" style={{ '--doc-accent': doc.accent || 'var(--c-teal)' }}>
        <article className="doc doc-article">
          {bilingual && <LangSwitch lang={lang} setLang={setLang} place="top" />}

          <header className="doc-head">
            <p className="doc-kicker reveal-hero" style={delay(680)}>
              <span className="doc-kicker-meta">
                <button type="button" className="doc-kicker-home" data-glow onClick={() => navTo('/')}>mercuriusdream</button>
                <span aria-hidden="true">·</span>
                {doc.kicker}
                {Mark && <> <span aria-hidden="true">·</span> <span className="doc-mark" aria-hidden="true"><Mark /></span> {doc.markLabel}</>}
              </span>
              <ShareButton doc={doc} />
            </p>
            <h1 className="doc-title reveal-hero" style={delay(760)}>{doc.title}</h1>
            {doc.subtitle && <p className="doc-subtitle reveal" style={delay(840)}>{doc.subtitle}</p>}
            {doc.intro && <p className="doc-intro reveal" style={delay(920)}>{renderIntro(doc.intro, doc.tweet)}</p>}
          </header>

          {doc.image && (
            <figure className="doc-figure reveal" style={delay(1020)}>
              <img src={doc.image.src} alt={doc.image.alt} loading="lazy" />
            </figure>
          )}

          {doc.transcript && (
          <div className="tx reveal" style={delay(1020)}>
            {segs.map((seg, i) => {
              const si = seg.t === 'search' ? searchIndex++ : 0;
              return <Segment key={i} seg={seg} doc={doc} lang={lang} searchIndex={si} />;
            })}
          </div>
          )}

          {doc.exchange?.length > 0 && (
            <div className="doc-exchange reveal">
              {doc.exchange.map((m, i) => (
                <div className="doc-exchange-line" key={i}>
                  <span className="doc-exchange-role">{m.role}</span>
                  <span className="doc-exchange-msg">{m.text}</span>
                </div>
              ))}
            </div>
          )}

          {doc.sources?.length > 0 && (
            <div className="doc-sources reveal">
              <span className="doc-src-label">sources</span>
              <ol className="doc-src-list">
                {doc.sources.map(s => (
                  <li key={s.href} className="doc-src-item">
                    <a href={s.href} target="_blank" rel="noopener noreferrer"
                      className="inline-link" data-glow style={{ '--link-accent': s.c }}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <footer className="doc-foot reveal"><BackLink /></footer>

          {bilingual && <LangSwitch lang={lang} setLang={setLang} place="bot" />}
        </article>
      </main>
    </div>
  );
}

export default Document;
