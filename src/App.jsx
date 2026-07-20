import { Fragment, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { KaomojiIcon } from './components/Icons';
import Starfield from './components/Starfield';
import { useNavTransition } from './hooks/useNavTransition';
import Logos from './pages/Logos';
import Document from './pages/Document';
import Writings from './pages/Writings';

const LOVE_LINKS = [
  { label: 'Zhilin Yang', href: 'https://kimiyoung.github.io/', accent: '#B8634A' },
  { label: 'Thebes', href: 'https://vgel.me', accent: '#6F7D63' },
  { label: 'Ghostfail', href: 'https://ghost.fail', accent: '#76668D' },
  { label: 'SaltyAom', href: 'https://saltyaom.com', accent: '#B86A8E' },
];

const MADE_LINKS = [
  { label: 'TideSurf', href: 'https://github.com/tidesurf/core', accent: '#4F7B86' },
  { label: 'Agent-Estate', href: 'https://github.com/MercuriusDream/agent-estate', accent: '#8A6D4E' },
];

const delay = ms => ({ '--reveal-delay': `${ms}ms` });

const linkSep = (i, n) =>
  i === 0 ? '' : i === n - 1 ? (n === 2 ? ' and ' : ', and ') : ', ';

function HighlightLink({ link }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-link"
      data-glow
      style={{ '--link-accent': link.accent }}
    >
      {link.label}
    </a>
  );
}

function InlineLinkList({ links }) {
  return links.map((link, i) => (
    <Fragment key={link.label}>
      {linkSep(i, links.length)}
      <HighlightLink link={link} />
    </Fragment>
  ));
}

function HomePage() {
  const navTo = useNavTransition();
  const [mojiPoked, setMojiPoked] = useState(false);
  const pokeMoji = () => {
    setMojiPoked(true);
    setTimeout(() => setMojiPoked(false), 350);
  };

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <main id="main" className="onepage">
        <header className="hero-title reveal-hero" style={delay(800)}>
          <div className="hero-parallax">
            <h1 className="hero-headline" aria-label="마라향 안개구름, Schedule II">
              <KaomojiIcon
                className={`hero-moji ${mojiPoked ? 'poked' : ''}`}
                aria-hidden="true"
                blink={mojiPoked}
                onClick={pokeMoji}
              />
              <span lang="ko">마라향 안개구름</span>
              <span className="hero-cii" aria-hidden="true">CII</span>
            </h1>
            <p className="hero-handle">@mercuriusdream</p>
          </div>
        </header>

        <div className="hero-row reveal" style={delay(1200)}>
          <p className="made-line">
            Made <InlineLinkList links={MADE_LINKS} />
          </p>
          <p className="hero-bio">
            People I admire: <InlineLinkList links={LOVE_LINKS} />
          </p>
        </div>

        <div className="hero-row reveal" style={delay(1300)}>
          <p className="made-line">
            Also runs {' '}
            <Link
              to="/logos"
              className="inline-link"
              data-glow
              style={{ '--link-accent': '#B8634A' }}
              onClick={e => { e.preventDefault(); navTo('/logos'); }}
            >
              Project Logos
            </Link>
            , open defensive cybersecurity for the web.
          </p>
        </div>

        <footer className="site-footer reveal" style={delay(1600)}>
          <div className="footer-links">
            <a href="https://github.com/mercuriusdream" target="_blank" rel="noopener noreferrer" className="footer-btn" data-glow style={{ ...delay(1800), '--btn-color': '#4F7B86' }}>
              github
            </a>
            <a href="https://x.com/mercuriusdream" target="_blank" rel="noopener noreferrer" className="footer-btn" data-glow style={{ ...delay(1900), '--btn-color': '#6F7D63' }}>
              x
            </a>
            <a
              href="https://bughunters.google.com/profile/3dfc69d5-8b8a-4754-80ab-ba59a56e7295"
              target="_blank" rel="noopener noreferrer"
              className="footer-btn" data-glow
              style={{ ...delay(2000), '--btn-color': '#76668D' }}
            >
              vrp
            </a>
            <a href="mailto:mercuriusdream@mercuriusdream.com" className="footer-btn" data-glow style={{ ...delay(2100), '--btn-color': '#B8634A' }}>
              email
            </a>
            <Link
              to="/writings"
              className="footer-btn"
              data-glow
              style={{ ...delay(2200), '--btn-color': '#8A6D4E' }}
              onClick={e => { e.preventDefault(); navTo('/writings'); }}
            >
              writings
            </Link>
          </div>
          <div className="footer-icp">
            <a href="https://icp.gov.moe/?keyword=20260535" target="_blank" rel="noopener noreferrer" className="footer-btn" data-glow style={{ '--btn-color': '#6D5A66' }}>萌ICP备20260535号</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Starfield />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logos" element={<Logos />} />
        <Route path="/writings" element={<Writings />} />
        <Route path="/writings/:slug" element={<Document />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;