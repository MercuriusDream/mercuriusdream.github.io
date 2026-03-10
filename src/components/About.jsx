import { useEffect, useRef, useContext, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const InteractiveKeyword = ({ word, details }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="interactive-keyword"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <strong>{word}</strong>
      {isHovered && (
        <span className="floating-details">
          <span className="details-list">{details.join(', ')}</span>
        </span>
      )}
    </span>
  );
};

export default function About() {
  const { t } = useContext(LanguageContext);
  const contentRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const skillData = {
    '{instructions}': { label: t.about.instructions, items: ['C/C++', 'Python', 'JavaScript/TypeScript', 'Assembly'] },
    '{languages}': { label: t.about.languages, items: ['한국어', 'English', '日本語'] },
    '{llm}': { label: t.about.llm, items: ['LLM Prompt Engineering', 'AI Red Teaming', 'Model Evaluation'] },
    '{specialty}': { label: t.about.specialty, items: ['Reverse Engineering', 'Network Analysis', 'Blackbox Analysis'] }
  };

  const renderIntroWithInteractions = () => {
    let text = t.about.intro;

    // Initial static replacements for demographic info
    text = text.replace('{location}', `<strong>${t.about.location}</strong>`)
      .replace('{university}', `<strong>${t.about.university}</strong>`)
      .replace('{major}', `<strong>${t.about.major}</strong>`);

    // Split by placeholders to inject InteractiveKeyword components
    const parts = text.split(/({instructions}|{languages}|{llm}|{specialty})/);

    return parts.map((part, i) => {
      if (skillData[part]) {
        return (
          <InteractiveKeyword
            key={i}
            word={skillData[part].label}
            details={skillData[part].items}
          />
        );
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return (
    <section className="about-section editorial-bg">
      <div className="editorial-grid">
        <div ref={contentRef} className="about-body">
          <div className={`about-stats integrated animate-reveal ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
            <p className="about-intro-integrated">
              {renderIntroWithInteractions()}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
