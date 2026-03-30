import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        const playSplash = () => {
            const audio = new Audio('/splash.wav');
            audio.volume = 0.5;
            audio.play().catch(e => {
                console.log("Audio autoplay blocked by browser policy on initial load.", e);
                const playOnInteract = () => {
                    const interactAudio = new Audio('/splash.wav');
                    interactAudio.volume = 0.5;
                    interactAudio.play().catch(err => console.log(err));
                    ['click', 'keydown', 'touchstart'].forEach(evt => 
                        document.removeEventListener(evt, playOnInteract)
                    );
                };
                ['click', 'keydown', 'touchstart'].forEach(evt => 
                    document.addEventListener(evt, playOnInteract, { once: true })
                );
            });
        };

        // Trigger slightly after mount to ensure DOM is ready
        const audioTimer = setTimeout(playSplash, 300);

        const timer = setTimeout(() => {
            onComplete();
        }, 2500);

        return () => {
            clearTimeout(timer);
            clearTimeout(audioTimer);
        };
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            overflow: 'hidden'
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                    scale: [0.9, 1.05, 1],
                    opacity: [0, 1, 1]
                }}
                transition={{ 
                    duration: 1.5, 
                    ease: "easeOut",
                    times: [0, 0.7, 1]
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{ position: 'relative' }}>
                    {/* Styled Text Logo to match the brand image provided by the user */}
                    <motion.div
                        style={{
                            fontSize: '4.5rem',
                            fontWeight: 900,
                            color: '#0f172a',
                            fontFamily: 'Inter, sans-serif',
                            display: 'flex',
                            alignItems: 'baseline',
                            filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.2))',
                            zIndex: 1,
                            position: 'relative',
                            letterSpacing: '-2px'
                        }}
                    >
                        Takshila
                        <span style={{ color: '#ff5c00', fontSize: '1.2em', marginLeft: '4px', filter: 'drop-shadow(0 0 10px rgba(255,92,0,0.4))' }}>.</span>
                    </motion.div>
                    
                    <motion.div
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{ 
                            duration: 2.5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '-15px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '90%',
                            height: '8px',
                            background: 'rgba(0,0,0,0.04)',
                            filter: 'blur(10px)',
                            borderRadius: '50%',
                            zIndex: 0
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
