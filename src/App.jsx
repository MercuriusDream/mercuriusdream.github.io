// Work: projects, benchmarks, and advisories, in the order they are shown.
// A sibling is another site of mine. It opens in this tab, and its button's plane carries the page
// there and back. A sibling whose page is headed with the button's title takes the title across too.
// See public/morph.js.
const WORK = [
  { name: 'TideSurf', href: 'https://github.com/tidesurf/core' },
  { name: 'Project Yukigumo', href: 'https://yukigumo.mercuriusdream.com/', sibling: true },
  { name: 'CVE-2026-106340', href: 'https://nvd.nist.gov/vuln/detail/cve-2026-106340' },
  { name: 'CSAT-benchmark-smol', href: 'https://csat.mercuriusdream.com/', sibling: true, across: 'title' },
];

// Essays on this origin, newest first. Opening one morphs its row into the page and turns its
// arrow round into the way back.
const ESSAYS = [
  { name: 'You are not ensuring', href: '/you-are-not/' },
  { name: 'Machines of Loving Export Controls', href: '/loving-controls/' },
];

const SOCIALS = [
  { name: 'Google VRP', href: 'https://bughunters.google.com/profile/3dfc69d5-8b8a-4754-80ab-ba59a56e7295' },
  { name: 'GitHub', href: 'https://github.com/mercuriusdream' },
  { name: 'X', href: 'https://x.com/mercuriusdream' },
  { name: 'Email', href: 'mailto:mercuriusdream@mercuriusdream.com' },
];

// External destinations point up and right; pages opened in this tab point right.
// On an essay page, the right arrow turns 180° round into the way back.
function Arrow({ internal = false, morph = false }) {
  if (internal) {
    return (
      <svg
        className="link-arrow link-arrow-internal"
        viewBox="0 0 16 16"
        aria-hidden="true"
        data-morph-part={morph ? 'arrow' : undefined}
        data-morph-turn={morph ? '0' : undefined}
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    );
  }

  return (
    <svg className="link-arrow link-arrow-external" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  );
}

function SiteLink({ href, children, className = '', label, sibling = false, across }) {
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

      <div
        className="stage"
        style={{ '--work-rows': Math.ceil(WORK.length / 2), '--essay-rows': ESSAYS.length }}
      >
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
            <section className="link-group" aria-label="Work">
              <ul className="work-list">
                {WORK.map(item => (
                  <li key={item.href} className="work-item">
                    <SiteLink
                      href={item.href}
                      className="work-link"
                      sibling={item.sibling}
                      across={item.across}
                    >
                      <span className="work-name" data-morph-part={item.across ? 'title' : undefined}>
                        {item.name}
                      </span>
                      <Arrow internal={Boolean(item.sibling)} />
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </section>

            <section className="link-group" aria-label="Essays">
              <ul className="essay-list">
                {ESSAYS.map(essay => (
                  <li key={essay.href} className="essay-item">
                    <SiteLink href={essay.href} className="essay-link">
                      <span className="essay-title" data-morph-part="title">{essay.name}</span>
                      <Arrow internal morph />
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </section>

            <section className="link-group social-group" aria-label="Social links">
              <ul className="social-list">
                {SOCIALS.map(social => (
                  <li key={social.name}>
                    <SiteLink href={social.href} className="social-link">
                      {social.name}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </section>
          </nav>
        </main>

        <footer className="site-footer">
          <span className="account-handle">@mercuriusdream</span>
          <SiteLink href="https://icp.gov.moe/?keyword=20260535" className="icp-link">
            <span lang="zh-CN">萌ICP备20260535号</span>
          </SiteLink>
          <SiteLink href="https://mizukiakiyama.com" className="egg-link" label="Smirnova Oyama is cute">
            <span className="emoji">🍥</span>
          </SiteLink>
        </footer>
      </div>
    </div>
  );
}
