import { useEffect, useRef, useState } from 'react';

const SVG_URLS = [
    '/Saint-Georges_majeur_au_crepuscule.svg',
    "/Soleil_d'hiver_à_Lavacourt.svg",
    '/The_Road_in_front_of_Saint-Simeon_Farm_in_Winter.svg',
];

// Map section indices to SVG indices (reuse SVGs for sections 3 & 4)
const SECTION_TO_SVG = [0, 1, 2, 0, 1];

const SECTION_COLORS = {
    0: '#121921',
    1: '#1a2632',
    2: '#152a24',
    3: '#251d2b',
    4: '#2b1f1f'
};

export default function WatercolorCanvas({ activeIndex = 0 }) {
    const containerRef = useRef(null);
    const [svgContents, setSvgContents] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const results = await Promise.all(
                    SVG_URLS.map(url => fetch(url).then(r => r.text()))
                );
                const parsed = results.map(text => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'image/svg+xml');
                    const svg = doc.querySelector('svg');
                    return {
                        viewBox: svg?.getAttribute('viewBox') || '0 0 1800 1270',
                        innerHTML: svg?.innerHTML || ''
                    };
                });
                setSvgContents(parsed);
            } catch (err) {
                console.error('Failed to load SVGs:', err);
            }
        };
        load();
    }, []);

    return (
        <div
            className="watercolor-canvas-container"
            ref={containerRef}
            style={{
                backgroundColor: SECTION_COLORS[activeIndex] || '#121921',
                transition: 'background-color 2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {svgContents.map((content, i) => {
                const activeSvgIndex = SECTION_TO_SVG[activeIndex];
                return (
                    <svg
                        key={i}
                        className="watercolor-svg-layer"
                        viewBox={content.viewBox}
                        preserveAspectRatio="xMidYMid slice"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: i === activeSvgIndex ? 0.6 : 0,
                            transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)',
                            mixBlendMode: 'screen'
                        }}
                        dangerouslySetInnerHTML={{ __html: content.innerHTML }}
                    />
                );
            })}
        </div>
    );
}
