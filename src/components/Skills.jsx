import { useRef, useContext } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

function IntegratedTerminalText() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="integrated-terminal-text animate-reveal is-visible" style={{ transitionDelay: '0.4s' }}>
      <div className="terminal-last-login">
        Last login: 2006. 07. 10. on MercuriusDream
      </div>
      <div className="terminal-prompt-line">
        <span className="terminal-user">Arona@Schale</span>
        <span className="terminal-path"> ~ %</span>
        <span className="terminal-command"> cat manifesto.txt</span>
      </div>
      <div className="terminal-output-text">
        {t.about.manifesto}
      </div>
      <div className="terminal-prompt-line next">
        <span className="terminal-user">Arona@Schale</span>
        <span className="terminal-path"> ~ %</span>
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useContext(LanguageContext);
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="skills-section editorial-bg">
      {/* The Undercurrent Manifesto Background */}
      <div className="skills-manifesto-undercurrent">
        {t.about.manifesto}
      </div>

      <div className="editorial-grid">
        <div className="expertise-content-wrapper">
          <a
            href="https://blog.mercuriusdream.com"
            className="editorial-project-link animate-reveal is-visible"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="project-header-row">
              <h3 className="project-title-huge">
                <span style={{ opacity: 0.5, fontSize: '0.6em', fontStyle: 'italic', display: 'block', marginBottom: '0.2em' }}>Engineering Blog</span>
                Write to be read
              </h3>
              <ArrowUpRight className="project-arrow" size={32} strokeWidth={1} />
            </div>
            <div className="project-meta-row">
              <span className="project-desc">Deep dives into compiler design, vulnerability research, and systems architecture.</span>
            </div>
          </a>

          <IntegratedTerminalText />
        </div>
      </div>
    </section>
  );
}
