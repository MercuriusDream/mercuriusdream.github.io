import { useEffect, useRef, useContext, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export default function Projects() {
  const { t } = useContext(LanguageContext);
  const sectionRef = useRef(null);
  const projectsRef = useRef([]);
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleItems(prev => new Set([...prev, entry.target.id || entry.target.dataset.id]));
        }
      });
    }, observerOptions);

    projectsRef.current.forEach(proj => {
      if (proj) observer.observe(proj);
    });

    return () => observer.disconnect();
  }, [t.projects.items]);

  const projects = [
    { key: 'vibrowser' },
    { key: 'convert_everything' },
    { key: 'c99' }
  ];

  return (
    <section ref={sectionRef} className="projects-section editorial-bg">
      <div className="editorial-grid">
      <div className="projects-list">
        {projects.map((project, index) => {
          const data = t.projects.items[project.key];
          const itemId = `project-${project.key}`;
          const isVisible = visibleItems.has(itemId);

          return (
            <a
              key={project.key}
              href={data?.link}
              target="_blank"
              rel="noopener noreferrer"
              id={itemId}
              data-id={itemId}
              ref={el => projectsRef.current[index] = el}
              className={`editorial-project-link has-svg animate-reveal ${isVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="project-content-col">
                <div className="project-header-row">
                  <div className="project-title-group">
                    <div className="project-svg-container">
                      {/* Minimal Abstract SVGs based on index */}
                      {index === 0 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="minimal-svg">
                          <path d="M4 12 L20 12 M12 4 L12 20 M6 6 L18 18" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="minimal-svg">
                          <circle cx="12" cy="12" r="8" />
                          <path d="M12 4 L12 20" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="minimal-svg">
                          <path d="M4 20 L20 4 M4 4 L20 20" />
                        </svg>
                      )}
                    </div>
                    <h3 className="project-title-huge">{data?.title}</h3>
                  </div>
                  <ArrowUpRight className="project-arrow" size={40} strokeWidth={1} />
                </div>
                <div className="project-meta-row">
                  <span className="project-desc-mono">{data?.description}</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      </div>
    </section>
  );
}
