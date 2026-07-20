import { useNavTransition } from '../hooks/useNavTransition';
import { list } from '../docs';
import './Document.css';

// The /writings index: a list of writings. Each entry routes to its doc.

const delay = ms => ({ '--reveal-delay': `${ms}ms` });

function Writings() {
  const navTo = useNavTransition();

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <main id="main" className="doc-scroll">
        <div className="doc doc-index">
          <header className="doc-index-head reveal-hero" style={delay(700)}>
            <h1 className="doc-index-title">Writings</h1>
            <p className="doc-index-sub">tried writing things</p>
          </header>

          <ul className="doc-index-list">
            {list.map((d, i) => (
              <li key={d.slug}>
                <button
                  type="button"
                  className="doc-entry reveal"
                  style={{ ...delay(850 + i * 90), '--doc-accent': d.accent || 'var(--c-teal)' }}
                  data-glow
                  onClick={() => navTo(`/writings/${d.slug}`)}
                >
                  <span className="doc-entry-meta">{d.date}</span>
                  <span className="doc-entry-title">{d.listTitle}</span>
                  {d.blurb && <span className="doc-entry-blurb">{d.blurb}</span>}
                </button>
              </li>
            ))}
          </ul>

          <footer className="doc-foot reveal" style={delay(850 + list.length * 90 + 120)}>
            <button onClick={() => navTo('/')} className="doc-back" data-glow aria-label="Back to home">
              ← back
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Writings;
