import { useEffect, useRef, memo, useCallback, useState } from 'react';
import { ChevronDown, Github, Mail, X } from 'lucide-react';

const LandingLogo = memo(function LandingLogo() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const [linksVisible, setLinksVisible] = useState(false);

  const loadLogo = useCallback(async () => {
    try {
      const res = await fetch('logo.svg');
      const text = await res.text();
      if (!logoRef.current) return;

      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(text, 'image/svg+xml');
      const originalSvg = svgDoc.querySelector('svg');
      if (!originalSvg) return;

      // Clone the entire SVG preserving structure
      const svg = originalSvg.cloneNode(true);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.overflow = 'visible';

      // Insert into DOM first so getTotalLength works
      logoRef.current.innerHTML = '';
      logoRef.current.appendChild(svg);

      // Add drawing animation
      const styleTag = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleTag.textContent = `
        @keyframes drawStroke {
          to { stroke-dashoffset: 0; }
        }
        .draw-path {
          animation: drawStroke 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `;
      svg.prepend(styleTag);

      // Inject Monet gradient definitions into the SVG
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

      // Stroke gradient — diagonal sweep of Monet colors
      const strokeGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      strokeGrad.setAttribute('id', 'monet-stroke');
      strokeGrad.setAttribute('x1', '0%');
      strokeGrad.setAttribute('y1', '0%');
      strokeGrad.setAttribute('x2', '100%');
      strokeGrad.setAttribute('y2', '100%');
      // Repeat palette 3x for a multi-stripe chalk effect
      const palette = ['#E8C490', '#D4A07A', '#B0A8C0', '#8EAFC4'];
      const repeats = 3;
      const totalStops = palette.length * repeats;
      for (let r = 0; r < repeats; r++) {
        palette.forEach((color, i) => {
          const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          const idx = r * palette.length + i;
          stop.setAttribute('offset', `${(idx / (totalStops - 1)) * 100}%`);
          stop.setAttribute('stop-color', color);
          stop.setAttribute('stop-opacity', '0.85');
          strokeGrad.appendChild(stop);
        });
      }
      defs.appendChild(strokeGrad);

      // Fill gradient — softer version
      const fillGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      fillGrad.setAttribute('id', 'monet-fill');
      fillGrad.setAttribute('x1', '100%');
      fillGrad.setAttribute('y1', '0%');
      fillGrad.setAttribute('x2', '0%');
      fillGrad.setAttribute('y2', '100%');
      const fillPalette = ['#D6BA8E', '#D4A07A', '#B0A8C0', '#8EAFC4'];
      for (let r = 0; r < 3; r++) {
        fillPalette.forEach((color, i) => {
          const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          const idx = r * fillPalette.length + i;
          stop.setAttribute('offset', `${(idx / (fillPalette.length * 3 - 1)) * 100}%`);
          stop.setAttribute('stop-color', color);
          stop.setAttribute('stop-opacity', '0.18');
          fillGrad.appendChild(stop);
        });
      }
      defs.appendChild(fillGrad);
      svg.prepend(defs);

      // Apply gradients to all geometry
      const paths = svg.querySelectorAll('path, circle, line, polyline, polygon');
      paths.forEach((p, i) => {
        const currentFill = p.getAttribute('fill');
        const hasFill = currentFill && currentFill !== 'none' && currentFill !== 'transparent';

        if (hasFill) {
          p.setAttribute('fill', 'url(#monet-fill)');
        }

        p.setAttribute('stroke', 'url(#monet-stroke)');
        p.setAttribute('stroke-width', '1');
        p.style.removeProperty('color');

        try {
          const len = p.getTotalLength?.();
          if (len) {
            p.style.strokeDasharray = len;
            p.style.strokeDashoffset = len;
            p.classList.add('draw-path');
            p.style.animationDelay = `${0.3 + (i * 0.15)}s`;
          }
        } catch (e) {
          // Some elements don't support getTotalLength
        }
      });

      // Outer circle: distinct lavender ring
      const circle = svg.querySelector('circle');
      if (circle) {
        circle.setAttribute('stroke', 'url(#monet-stroke)');
        circle.setAttribute('stroke-width', '1.5');
        circle.setAttribute('fill', 'rgba(143, 177, 204, 0.04)');
      }
    } catch (err) {
      console.error('Logo error:', err);
    }
  }, []);

  useEffect(() => { loadLogo(); }, [loadLogo]);

  useEffect(() => {
    const timer = setTimeout(() => setLinksVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="landing-container">
      <div
        ref={logoRef}
        className="logo-backdrop"
      />

      <div className="hero-name">
        <h1 className="brand-name">MercuriusDream</h1>
        <div className={`social-links-hero ${linksVisible ? 'visible' : ''}`}>
          <a href="https://github.com/mercuriusdream" target="_blank" rel="noopener noreferrer" className="social-link-hero">
            <Github size={18} />
          </a>
          <a href="https://x.com/mercuriusdream" target="_blank" rel="noopener noreferrer" className="social-link-hero">
            <X size={18} />
          </a>
          <a href="mailto:mercuriusdream@mercuriusdream.com" className="social-link-hero">
            <Mail size={18} />
          </a>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <ChevronDown size={20} />
      </div>
    </div>
  );
});

export default LandingLogo;
