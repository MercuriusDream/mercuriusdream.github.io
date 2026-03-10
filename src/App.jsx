import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import LandingLogo from './components/LandingLogo';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import WatercolorCanvas from './components/WatercolorCanvas';
import { useEffect, useRef, useState } from 'react';

const SECTIONS = ['hero', 'about', 'projects', 'skills'];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const isAnimating = useRef(false);

  useEffect(() => {
    const goTo = (index) => {
      if (index < 0 || index >= SECTIONS.length) return;
      if (isAnimating.current) return;

      isAnimating.current = true;
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);

      setTimeout(() => {
        isAnimating.current = false;
      }, 600);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      if (isAnimating.current) return;
      goTo(e.deltaY > 0 ? activeIndex + 1 : activeIndex - 1);
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50 || isAnimating.current) return;
      goTo(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    };

    const handleKeyDown = (e) => {
      if (isAnimating.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex]);

  return (
    <LanguageProvider>
      <div className="app">
        <WatercolorCanvas activeIndex={activeIndex} />
        <Navigation activeIndex={activeIndex} onNavigate={(i) => {
          if (!isAnimating.current) {
            isAnimating.current = true;
            setDirection(i > activeIndex ? 1 : -1);
            setActiveIndex(i);
            setTimeout(() => { isAnimating.current = false; }, 600);
          }
        }} />

        {/* Persistent section header — number and title morph */}
        <div className={`persistent-header ${activeIndex > 0 ? 'visible' : ''}`}>
          <div className="persistent-header-inner">
            <div className="persistent-header-top">
              <div className="morph-num-wrapper">
                {['01', '02', '03'].map((num, i) => (
                  <span
                    key={num}
                    className={`morph-num ${activeIndex === i + 1 ? 'active' : ''} ${activeIndex > i + 1 ? 'above' : ''} ${activeIndex < i + 1 ? 'below' : ''}`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
            <div className="morph-label-wrapper">
              {['About', 'Projects', 'Read More'].map((label, i) => (
                <span
                  key={label}
                  className={`morph-label ${activeIndex === i + 1 ? 'active' : ''} ${activeIndex > i + 1 ? 'above' : ''} ${activeIndex < i + 1 ? 'below' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <main className="morph-viewport">
          {SECTIONS.map((id, i) => (
            <div
              key={id}
              className={`morph-section ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'above' : ''} ${i > activeIndex ? 'below' : ''}`}
            >
              {id === 'hero' && <LandingLogo />}
              {id === 'about' && <About />}
              {id === 'projects' && <Projects />}
              {id === 'skills' && <Skills />}
            </div>
          ))}
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
