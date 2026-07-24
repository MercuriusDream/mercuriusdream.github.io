import { Fragment, useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { KaomojiIcon } from './components/Icons';
import Starfield from './components/Starfield';
import { useNavTransition } from './hooks/useNavTransition';
import { seoFor } from './seo';

// Route-level code splitting: the homepage stays in the entry chunk; the
// writings reader (and its vendored transcripts) load only when visited.
const Logos = lazy(() => import('./pages/Logos'));
const Writings = lazy(() => import('./pages/Writings'));
const Document = lazy(() => import('./pages/Document'));

const LOVE_LINKS = [
  { label: 'Zhilin Yang', href: 'https://kimiyoung.github.io/', accent: '#B8634A' },
  { label: 'Thebes', href: 'https://vgel.me', accent: '#6F7D63' },
  { label: 'Ghostfail', href: 'https://ghost.fail', accent: '#76668D' },
  { label: 'SaltyAom', href: 'https://saltyaom.com', accent: '#B86A8E' },
];

const MADE_LINKS = [
  { label: 'TideSurf', href: 'https://github.com/tidesurf/core', accent: '#4F7B86' },
  { label: 'Agent-Estate', href: 'https://github.com/MercuriusDream/agent-estate', accent: '#B8BCC8' },
  { label: 'Project Logos', to: '/logos', accent: '#B8634A' },
];

const CUTE_LINKS = [
  {
    label: 'Smirnova Oyama',
    href: 'https://mizukiakiyama.com',
    accent: '#F7A8B8',
    className: 'cute-link',
  },
];

const SOCIAL_LINKS = [
  { label: 'github', href: 'https://github.com/mercuriusdream', accent: '#4F7B86' },
  { label: 'x', href: 'https://x.com/mercuriusdream', accent: '#6F7D63' },
  { label: 'vrp', href: 'https://bughunters.google.com/profile/3dfc69d5-8b8a-4754-80ab-ba59a56e7295', accent: '#76668D' },
  { label: 'email', href: 'mailto:mercuriusdream@mercuriusdream.com', accent: '#B8634A' },
];

const delay = ms => ({ '--reveal-delay': `${ms}ms` });

const linkSep = (i, n) =>
  i === 0 ? '' : i === n - 1 ? (n === 2 ? ' and ' : ', and ') : ', ';

function HighlightLink({ link }) {
  const navTo = useNavTransition();
  const style = { '--link-accent': link.accent, ...link.style };
  const className = `inline-link${link.className ? ` ${link.className}` : ''}`;

  if (link.to) {
    return (
      <Link
        to={link.to}
        className={className}
        data-glow
        style={style}
        onClick={e => { e.preventDefault(); navTo(link.to); }}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-glow
      style={style}
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

function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'day' ? 'day' : 'dark');
  const toggle = () => {
    const next = theme === 'day' ? 'dark' : 'day';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', next === 'day' ? '#E8ECF4' : '#060912');
    window.dispatchEvent(new Event('theme:change'));
    setTheme(next);
  };
  return (
    <button type="button" onClick={toggle} className="footer-btn" data-glow
      style={{ ...delay(2300), '--btn-color': theme === 'day' ? '#1A88FF' : '#D89478' }}
      aria-label={theme === 'day' ? 'Switch to night sky' : 'Switch to day sky'}>
      {theme === 'day' ? 'night' : 'day'}
    </button>
  );
}

function SocialsMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <div className={`socials-menu${open ? ' is-open' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        className="footer-btn socials-trigger"
        data-glow
        style={{ '--btn-color': '#4F7B86' }}
        aria-expanded={open}
        aria-controls="landing-social-links"
        onClick={() => setOpen(value => !value)}
      >
        socials
      </button>
      <nav
        id="landing-social-links"
        className="socials-drawer"
        aria-label="Social links"
        aria-hidden={!open}
      >
        {SOCIAL_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="footer-btn socials-link"
            data-glow
            tabIndex={open ? undefined : -1}
            style={{ '--btn-color': link.accent }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
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
            <InlineLinkList links={CUTE_LINKS} /> is cute
          </p>
        </div>

        <footer className="site-footer reveal" style={delay(1600)}>
          <div className="footer-links">
            <SocialsMenu />
            <Link
              to="/writings"
              className="footer-btn"
              data-glow
              style={{ ...delay(2200), '--btn-color': '#B8BCC8' }}
              onClick={e => { e.preventDefault(); navTo('/writings'); }}
            >
              writings
            </Link>
            <ThemeToggle />
          </div>
          <div className="footer-icp">
            <a href="https://icp.gov.moe/?keyword=20260535" target="_blank" rel="noopener noreferrer" className="footer-btn" data-glow style={{ '--btn-color': '#6D5A66' }}>萌ICP备20260535号</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seg = seoFor(pathname);
    document.title = seg.title;
    const d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', seg.description);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RouteTitle />
      <Starfield />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logos" element={<Logos />} />
          <Route path="/writings" element={<Writings />} />
          <Route path="/writings/:slug" element={<Document />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;