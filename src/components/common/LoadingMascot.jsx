import React from 'react';

// Pixel Art Duck drawn as an SVG using crisp pixel-perfect rectangles
const PixelDuck = () => (
    <svg
        viewBox="0 0 16 16"
        width="80"
        height="80"
        style={{ imageRendering: 'pixelated' }}
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Body - golden yellow */}
        <rect x="3" y="8" width="9" height="6" fill="#FFD700" />
        <rect x="2" y="9" width="11" height="4" fill="#FFD700" />
        <rect x="4" y="13" width="7" height="1" fill="#FFC200" />

        {/* Head */}
        <rect x="7" y="4" width="5" height="5" fill="#FFD700" />
        <rect x="8" y="3" width="4" height="6" fill="#FFD700" />

        {/* Eye - black pixel */}
        <rect x="10" y="5" width="1" height="1" fill="#111" />

        {/* Beak - orange */}
        <rect x="12" y="6" width="2" height="1" fill="#FF6600" />
        <rect x="13" y="7" width="1" height="1" fill="#FF6600" />

        {/* Wing detail */}
        <rect x="4" y="9" width="5" height="3" fill="#FFC200" />
        <rect x="5" y="10" width="3" height="1" fill="#FFD700" />

        {/* Feet - orange */}
        <rect x="4" y="14" width="3" height="1" fill="#FF6600" />
        <rect x="8" y="14" width="3" height="1" fill="#FF6600" />

        {/* Hat (pixel cap) */}
        <rect x="8" y="2" width="4" height="1" fill="#1a1a2e" />
        <rect x="7" y="3" width="6" height="1" fill="#1a1a2e" />

        {/* Tail */}
        <rect x="2" y="8" width="2" height="3" fill="#FFD700" />
        <rect x="1" y="9" width="2" height="2" fill="#FFC200" />
    </svg>
);

const LoadingMascot = ({ message = "Takshila AI is thinking..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '40px',
            textAlign: 'center'
        }} className="animate-fade-in">
            <div style={{ position: 'relative', animation: 'duck-float 1.4s ease-in-out infinite' }}>
                <PixelDuck />
                {/* Pixel shadow */}
                <div style={{
                    width: '40px',
                    height: '5px',
                    background: 'rgba(0,0,0,0.12)',
                    borderRadius: '50%',
                    margin: '4px auto 0',
                    animation: 'duck-shadow 1.4s ease-in-out infinite'
                }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{message}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This usually takes a few seconds.</p>
            </div>

            <style>{`
                @keyframes duck-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes duck-shadow {
                    0%, 100% { transform: scaleX(1); opacity: 0.12; }
                    50% { transform: scaleX(0.6); opacity: 0.06; }
                }
            `}</style>
        </div>
    );
};

export default LoadingMascot;
