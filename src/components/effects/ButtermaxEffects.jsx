import React, { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';

const ButtermaxEffects = ({ children }) => {
    const dotRef = useRef(null);

    useEffect(() => {
        const dot = dotRef.current;
        if (!dot) return;

        const moveCursor = (e) => {
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
        };
        window.addEventListener('mousemove', moveCursor);

        const addOn = () => dot.classList.add('on');
        const removeOn = () => dot.classList.remove('on');

        const attachHover = () => {
            document.querySelectorAll('button, a, input, select, textarea, [role="button"], label').forEach(el => {
                el.addEventListener('mouseenter', addOn);
                el.addEventListener('mouseleave', removeOn);
            });
        };
        attachHover();

        // Re-attach on DOM changes (for dynamically loaded pages)
        const observer = new MutationObserver(attachHover);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            observer.disconnect();
        };
    }, []);

    return (
        <ReactLenis root>
            <div className="buttermax-wrapper">
                <div ref={dotRef} className="cursor-dot" id="global-cursor" />

                <div className="grain-overlay">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.4 }}>
                        <filter id="grain-filter">
                            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                            <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#grain-filter)" />
                    </svg>
                </div>

                {children}
            </div>
        </ReactLenis>
    );
};

export default ButtermaxEffects;
