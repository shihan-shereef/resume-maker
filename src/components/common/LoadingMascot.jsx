import React from 'react';

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
            <div className="mascot-container">
                <div className="duck-body">
                    <div className="duck-head">
                        <div className="duck-eye"></div>
                        <div className="duck-beak"></div>
                    </div>
                    <div className="duck-wing"></div>
                    <div className="duck-feet">
                        <div className="foot left"></div>
                        <div className="foot right"></div>
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{message}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This usually takes a few seconds.</p>
            </div>

            <style>{`
                .mascot-container {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                }

                .duck-body {
                    width: 80px;
                    height: 60px;
                    background: #ffcc00;
                    border-radius: 40px 40px 20px 20px;
                    position: relative;
                    animation: float 2s ease-in-out infinite;
                }

                .duck-head {
                    width: 50px;
                    height: 50px;
                    background: #ffcc00;
                    border-radius: 50%;
                    position: absolute;
                    top: -35px;
                    right: -10px;
                }

                .duck-eye {
                    width: 6px;
                    height: 6px;
                    background: #000;
                    border-radius: 50%;
                    position: absolute;
                    top: 15px;
                    right: 15px;
                }

                .duck-beak {
                    width: 20px;
                    height: 12px;
                    background: #ff6600;
                    border-radius: 0 10px 10px 0;
                    position: absolute;
                    top: 22px;
                    right: -15px;
                }

                .duck-wing {
                    width: 40px;
                    height: 25px;
                    background: #ffcc00;
                    border: 2px solid rgba(0,0,0,0.05);
                    border-radius: 20px 20px 0 20px;
                    position: absolute;
                    top: 15px;
                    left: 10px;
                    transform-origin: left center;
                    animation: flap 0.5s ease-in-out infinite;
                }

                .duck-feet {
                    display: flex;
                    gap: 20px;
                    position: absolute;
                    bottom: -15px;
                    left: 20px;
                }

                .foot {
                    width: 20px;
                    height: 8px;
                    background: #ff6600;
                    border-radius: 10px;
                }

                .foot.left {
                    animation: walk 0.4s infinite alternate;
                }

                .foot.right {
                    animation: walk 0.4s infinite alternate-reverse;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes flap {
                    0%, 100% { transform: rotate(0); }
                    50% { transform: rotate(-20deg); }
                }

                @keyframes walk {
                    from { transform: translateX(-5px); }
                    to { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
};

export default LoadingMascot;
