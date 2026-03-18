import React from 'react';

const Logo = ({ size = 'md', color = 'navy', className = '' }) => {
    const sizes = {
        sm: { fontSize: '1.2rem', dotSize: '6px' },
        md: { fontSize: '1.5rem', dotSize: '8px' },
        lg: { fontSize: '2.5rem', dotSize: '12px' },
        xl: { fontSize: '4.5rem', dotSize: '18px' }
    };

    const currentSize = sizes[size] || sizes.md;

    return (
        <div 
            className={`logo-container ${className}`}
            style={{ 
                display: 'inline-flex', 
                alignItems: 'baseline', 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: color === 'white' ? '#FFFFFF' : '#0F172A', // Dark Navy
                userSelect: 'none'
            }}
        >
            <span style={{ fontSize: currentSize.fontSize }}>Takshila</span>
            <span 
                style={{ 
                    width: currentSize.dotSize, 
                    height: currentSize.dotSize, 
                    backgroundColor: '#FF5C00', // Vibrant Orange
                    borderRadius: '50%',
                    marginLeft: '2px',
                    display: 'inline-block'
                }} 
            />
        </div>
    );
};

export default Logo;
