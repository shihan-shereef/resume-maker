import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = '1.5rem', withSound = false, onClick }) => {
    const playSound = () => {
        if (withSound) {
            const audio = new Audio('/splash.wav');
            audio.volume = 0.3;
            audio.play().catch(e => console.log("Sound blocked by browser", e));
        }
    };

    const handleClick = () => {
        playSound();
        if (onClick) onClick();
    };

    return (
        <motion.div
            onClick={handleClick}
            style={{
                fontSize: size,
                fontWeight: 900,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'baseline',
                cursor: onClick || withSound ? 'pointer' : 'default',
                letterSpacing: '-0.04em',
                userSelect: 'none'
            }}
            whileHover={onClick || withSound ? { scale: 1.05 } : {}}
            whileTap={onClick || withSound ? { scale: 0.95 } : {}}
        >
            Takshila
            <span style={{ 
                color: '#ff5c00', 
                fontSize: '1.2em', 
                marginLeft: '1px' 
            }}>.</span>
        </motion.div>
    );
};

export default Logo;
