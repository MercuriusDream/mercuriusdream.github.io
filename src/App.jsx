import { Fragment, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { KaomojiIcon } from './components/Icons';
import Logos from './pages/Logos.jsx';

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

const THEME_MODES = ['light', 'dark'];
const revealDelay = (ms) => ({ '--reveal-delay': `${ms}ms` });

function getStoredThemeMode() {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function linkSeparator(index, total) {
  if (index === 0) return '';
  if (index === total - 1) return total === 2 ? ' and ' : ', and ';
  return ', ';
}

function HighlightLink({ link }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-link"
      style={{ '--link-accent': link.accent }}
    >
      {link.label}
    </a>
  );
}

function InlineLinkList({ links }) {
  return links.map((link, index) => (
    <Fragment key={link.label}>
      {linkSeparator(index, links.length)}
      <HighlightLink link={link} />
    </Fragment>
  ));
}

function HomePage() {
  const [themeMode, setThemeMode] = useState(getStoredThemeMode);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const [announcement, setAnnouncement] = useState('');
  const [mojiPoked, setMojiPoked] = useState(false);
  const activeTheme = themeMode === 'system' ? systemTheme : themeMode;

  function pokeMoji() {
    setMojiPoked(true);
    setTimeout(() => setMojiPoked(false), 350);
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light');
    handleChange();
    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', activeTheme);
    if (themeMode === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', themeMode);
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    const paper = getComputedStyle(root).getPropertyValue('--paper').trim();
    if (meta && paper) meta.setAttribute('content', paper);
    const message = themeMode === 'system'
      ? `Following system theme (${activeTheme})`
      : `Switched to ${themeMode} theme`;
    setAnnouncement(message);
  }, [themeMode, activeTheme]);

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <main id="main" className="onepage">
        <header className="hero-title reveal-hero" style={revealDelay(0)}>
          <h1 className="hero-headline" aria-label="마라향 안개구름, Schedule II">
            <KaomojiIcon className={`hero-moji ${mojiPoked ? 'poked' : ''}`} aria-hidden="true" blink={mojiPoked} onClick={pokeMoji} />
            <span lang="ko">마라향 안개구름</span>
            <span className="hero-cii reveal" aria-hidden="true" style={revealDelay(100)}>CII</span>
          </h1>
          <p className="hero-handle reveal" style={revealDelay(60)}>@mercuriusdream</p>
        </header>

        <div className="hero-row reveal" style={revealDelay(90)}>
          <p className="made-line">
            Made <InlineLinkList links={MADE_LINKS} />
          </p>
          <p className="hero-bio">
            People I admire: <InlineLinkList links={LOVE_LINKS} />
          </p>
        </div>

        <div className="hero-row reveal" style={revealDelay(120)}>
          <p className="made-line">
            Also runs {' '}
            <Link
              to="/logos"
              className="inline-link"
              style={{ '--link-accent': '#B8634A' }}
              viewTransition
              onClick={() => document.documentElement.classList.add('vt-ready')}
            >
              Project Logos
            </Link>
            , open defensive cybersecurity for the web.
          </p>
        </div>

        <footer className="site-footer reveal" style={revealDelay(180)}>
          <div className="footer-links">
            <a href="https://github.com/mercuriusdream" target="_blank" rel="noopener noreferrer" className="footer-btn reveal" style={{ ...revealDelay(200), '--btn-color': '#4F7B86' }}>
              github
            </a>
            <a href="https://x.com/mercuriusdream" target="_blank" rel="noopener noreferrer" className="footer-btn reveal" style={{ ...revealDelay(260), '--btn-color': '#6F7D63' }}>
              x
            </a>
            <a
              href="https://bughunters.google.com/profile/3dfc69d5-8b8a-4754-80ab-ba59a56e7295"
              target="_blank" rel="noopener noreferrer"
              className="footer-btn reveal"
              style={{ ...revealDelay(320), '--btn-color': '#76668D' }}
            >
              vrp
            </a>
            <a href="mailto:mercuriusdream@mercuriusdream.com" className="footer-btn reveal" style={{ ...revealDelay(380), '--btn-color': '#B8634A' }}>
              email
            </a>
          </div>

          <div className="theme-selector" role="group" aria-label="Theme mode">
            {THEME_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => { if (themeMode !== mode) setThemeMode(mode); }}
                className={`theme-btn ${themeMode === mode ? 'active' : ''}`}
                aria-pressed={themeMode === mode}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
          <div className="footer-icp">
            <a href="https://icp.gov.moe/?keyword=20260535" target="_blank" rel="noopener noreferrer">萌ICP备20260535号</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logos" element={<Logos />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
