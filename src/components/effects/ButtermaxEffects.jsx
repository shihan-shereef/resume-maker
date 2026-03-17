import React, { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';

const ButtermaxEffects = ({ children }) => {
    const cursorRef = useRef(null);
    const ringRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            // Lerp for smooth cursor movement
            cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.2;
            cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.2;

            ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
            ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${cursorPos.current.x - 10}px, ${cursorPos.current.y - 10}px, 0)`;
            }

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0)`;
            }

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <ReactLenis root>
            <div className="buttermax-wrapper">
                <div ref={cursorRef} className="magnetic-cursor desktop-only" />
                <div ref={ringRef} className="cursor-ring desktop-only" />
                
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
