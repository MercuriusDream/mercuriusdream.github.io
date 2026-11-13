const PROJECTS = [
  {
    name: 'TideSurf',
    href: 'https://github.com/tidesurf/core',
    advisories: [
      {
        name: 'CVE-2026-106340',
        href: 'https://nvd.nist.gov/vuln/detail/cve-2026-106340',
      },
    ],
  },
];

const WRITINGS = [
  { name: 'Machines of Loving Export Controls', href: '/loving-controls/' },
];

const SOCIALS = [
  { name: 'Google VRP', href: 'https://bughunters.google.com/profile/3dfc69d5-8b8a-4754-80ab-ba59a56e7295' },
  { name: 'GitHub', href: 'https://github.com/mercuriusdream' },
  { name: 'X', href: 'https://x.com/mercuriusdream' },
  { name: 'Email', href: 'mailto:mercuriusdream@mercuriusdream.com' },
];

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

function ExternalLink({ href, children, className = '', label }) {
  const isWeb = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={className}
      aria-label={label}
      target={isWeb ? '_blank' : undefined}
      rel={isWeb ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

export default function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="stage">
        <div className="portrait" aria-hidden="true">
          <img src="/portrait.svg" alt="" />
        </div>

        <main className="profile" id="main">
          <section className="identity" aria-labelledby="name">
            <h1 id="name" lang="ja">
              <ruby>霧雲<rt>きりぐも</rt></ruby>
            </h1>
          </section>

          <nav className="link-groups" aria-label="Personal links">
            <section className="link-group" aria-label="Projects">
              <ul className="project-list">
                {PROJECTS.map(project => (
                  <li key={project.name} className="project-item">
                    <ExternalLink href={project.href} className="project-link">
                      <span className="project-name">{project.name}</span>
                      <Arrow />
                    </ExternalLink>
                    {project.advisories.map(advisory => (
                      <ExternalLink key={advisory.name} href={advisory.href} className="project-link">
                        <span className="project-name">{advisory.name}</span>
                        <Arrow />
                      </ExternalLink>
                    ))}
                  </li>
                ))}
                {WRITINGS.map(writing => (
                  <li key={writing.href} className="project-item">
                    <ExternalLink href={writing.href} className="project-link">
                      <span className="project-name">{writing.name}</span>
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
