import { Fragment, useState, useEffect, lazy, Suspense } from 'react';
import { flushSync } from 'react-dom';
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

const MADE_LINKS = [
  { label: 'TideSurf', href: 'https://github.com/tidesurf/core', accent: '#4F7B86' },
  { label: 'Agent-Estate', href: 'https://github.com/MercuriusDream/agent-estate', accent: '#B8BCC8' },
  { label: 'Project Logos', to: '/logos', accent: '#B8634A' },
];

const WRITINGS_LINK = { label: 'Field notes', to: '/writings', accent: '#B8BCC8' };

const SOCIAL_LINKS = [
  { label: 'github', href: 'https://github.com/mercuriusdream', accent: '#4F7B86' },
  { label: 'x', href: 'https://x.com/mercuriusdream', accent: '#6F7D63' },
  { label: 'vrp', href: 'https://bughunters.google.com/profile/3dfc69d5-8b8a-4754-80ab-ba59a56e7295', accent: '#76668D' },
  { label: 'email', href: 'mailto:mercuriusdream@mercuriusdream.com', accent: '#B8634A' },
  {
    label: '🍥',
    ariaLabel: 'Smirnova Oyama is cute',
    href: 'https://mizukiakiyama.com',
    accent: '#F7A8B8',
    className: 'cute-link',
  },
];

const delay = ms => ({ '--reveal-delay': `${ms}ms` });

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
  const n = links.length;
  // Each link is glued to its trailing comma (and the final "and" to its
  // link) inside a nowrap unit, so line breaks never orphan a separator.
  return links.map((link, i) => {
    const last = i === n - 1;
    return (
      <Fragment key={link.label}>
        {i > 0 ? ' ' : ''}
        <span className="link-unit">
          {last && n > 1 ? 'and ' : ''}
          <HighlightLink link={link} />
          {last ? '' : ','}
        </span>
      </Fragment>
    );
  });
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'day' ? 'day' : 'dark');

  const applyTheme = next => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', next === 'day' ? '#E8ECF4' : '#060912');
    window.dispatchEvent(new Event('theme:change'));
  };

  const toggle = () => {
    const next = theme === 'day' ? 'dark' : 'day';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Plain swap on browsers without the View Transitions API, or when the
    // user asked for less motion.
    if (!document.startViewTransition || reduce) {
      setTheme(next);
      applyTheme(next);
      return;
    }

    // Rectangle wipe: the new sky grows out of the bottom-right corner
    // (where the toggle sits) as a button-shaped rectangle.
    const vt = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
      applyTheme(next);
    });
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: ['inset(100% 0 0 100%)', 'inset(0% 0% 0% 0%)'] },
        { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => { /* transition skipped mid-flight — fine */ });
  };

  return (
    <button type="button" onClick={toggle} className="footer-btn theme-btn" data-glow
      style={delay(2200)}
      aria-label={theme === 'day' ? 'Switch to dark sky' : 'Switch to white sky'}>
      {theme === 'day' ? 'dark' : 'white'}
    </button>
  );
}

function HomePage() {
  const [mojiPoked, setMojiPoked] = useState(false);
  const pokeMoji = () => {
    setMojiPoked(true);
    setTimeout(() => setMojiPoked(false), 350);
  };

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>

      <div className="corner-stack">
        <ThemeToggle />
        <a href="https://icp.gov.moe/?keyword=20260535" target="_blank" rel="noopener noreferrer"
          className="footer-btn icp-btn" data-glow style={delay(2100)}>
          萌ICP备20260535号
        </a>
      </div>

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
            <HighlightLink link={WRITINGS_LINK} />, if you mind
          </p>
          <p className="made-line">
            Made <InlineLinkList links={MADE_LINKS} />
          </p>
        </div>

        <footer className="site-footer reveal" style={delay(1600)}>
          <div className="footer-links">
            {SOCIAL_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className={`footer-btn${link.className ? ` ${link.className}` : ''}`}
                data-glow
                aria-label={link.ariaLabel}
                style={{ ...delay(2000 + i * 90), '--btn-color': link.accent }}
              >
                {link.label}
              </a>
            ))}
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