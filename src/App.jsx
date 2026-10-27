const PROJECTS = [
  { name: 'TideSurf', href: 'https://github.com/tidesurf/core' },
  { name: 'Agent-Estate', href: 'https://github.com/MercuriusDream/agent-estate' },
];

const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com/mercuriusdream' },
  { name: 'X', href: 'https://x.com/mercuriusdream' },
  { name: 'Google VRP', href: 'https://bughunters.google.com/profile/3dfc69d5-8b8a-4754-80ab-ba59a56e7295' },
  { name: 'Email', href: 'mailto:mercuriusdream@mercuriusdream.com' },
  { name: '🍥', href: 'https://mizukiakiyama.com', label: 'Smirnova Oyama is cute' },
];

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

function ExternalLink({ href, children, className = '', label }) {
  const isEmail = href.startsWith('mailto:');
  return (
    <a
      href={href}
      className={className}
      aria-label={label}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
    >
      {children}
    </a>
  );
}

export default function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>

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
                <li key={project.name}>
                  <ExternalLink href={project.href} className="project-link">
                    <span>{project.name}</span>
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
                  <ExternalLink href={social.href} label={social.label} className="social-link">
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
          萌ICP备20260535号
        </ExternalLink>
      </footer>
    </div>
  );
}
