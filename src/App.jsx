// The rows, in the order they are shown.
// A sibling is another site of mine. It opens in this tab, and the row's plane carries the page
// there and back. Pages on this origin open the same way. A sibling whose page is headed with the
// row's title takes the title across too. See public/morph.js.
const LINKS = [
  { name: 'TideSurf', href: 'https://github.com/tidesurf/core' },
  { name: 'Project Yukigumo', href: 'https://yukigumo.mercuriusdream.com/', sibling: true },
  { name: 'CVE-2026-106340', href: 'https://nvd.nist.gov/vuln/detail/cve-2026-106340' },
  { name: 'Machines of Loving Export Controls', href: '/loving-controls/' },
  { name: 'CSAT-benchmark-smol', href: 'https://csat.mercuriusdream.com/', sibling: true, across: 'title' },
];

const SOCIALS = [
  { name: 'Google VRP', href: 'https://bughunters.google.com/profile/3dfc69d5-8b8a-4754-80ab-ba59a56e7295' },
  { name: 'GitHub', href: 'https://github.com/mercuriusdream' },
  { name: 'X', href: 'https://x.com/mercuriusdream' },
  { name: 'Email', href: 'mailto:mercuriusdream@mercuriusdream.com' },
];

// It points up and to the right. On the page it opens, it has turned round into the way back.
function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" data-morph-part="arrow" data-morph-turn="-45">
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

function ExternalLink({ href, children, className = '', label, sibling = false, across }) {
  const newTab = /^https?:/.test(href) && !sibling;
  return (
    <a
      href={href}
      className={className}
      aria-label={label}
      data-morph-row={sibling || href.startsWith('/') ? '' : undefined}
      data-morph-across={across}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

export default function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="stage" style={{ '--rows': LINKS.length }}>
        <div className="portrait" aria-hidden="true">
          <img src="/portrait.svg" alt="" />
        </div>

        <main className="profile" id="main">
          <section className="identity" aria-labelledby="name">
            <h1 id="name" lang="ja">
              <ruby>
                <span data-morph="name">霧雲</span>
                <rt>きりぐも</rt>
              </ruby>
            </h1>
          </section>

          <nav className="link-groups" aria-label="Personal links">
            <section className="link-group" aria-label="Projects">
              <ul className="project-list">
                {LINKS.map(link => (
                  <li key={link.href} className="project-item">
                    <ExternalLink href={link.href} className="project-link" sibling={link.sibling} across={link.across}>
                      <span className="project-name" data-morph-part="title">{link.name}</span>
                      <Arrow />
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </section>

            <section className="link-group social-group" aria-label="Social links">
              <ul className="social-list">
                {SOCIALS.map(social => (
                  <li key={social.name}>
                    <ExternalLink href={social.href} className="social-link">
                      {social.name}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </section>
          </nav>
        </main>

        <footer className="site-footer">
          <span className="account-handle">@mercuriusdream</span>
          <ExternalLink href="https://icp.gov.moe/?keyword=20260535" className="icp-link">
            <span lang="zh-CN">萌ICP备20260535号</span>
          </ExternalLink>
          <ExternalLink href="https://mizukiakiyama.com" className="egg-link" label="Smirnova Oyama is cute">
            <span className="emoji">🍥</span>
          </ExternalLink>
        </footer>
      </div>
    </div>
  );
}
