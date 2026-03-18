import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { PixelTrail } from '../components/ui/pixel-trail';
import { useScreenSize } from '../components/hooks/use-screen-size';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const screenSize = useScreenSize();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = isLogin
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            if (!isLogin) {
                alert("Account created successfully! Please check your email for confirmation.");
                setIsLogin(true);
                setLoading(false);
            } else {
                navigate('/portfolio');
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans flex flex-col items-center justify-center">
            {/* Background Pixel Trail */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
                <PixelTrail
                    pixelSize={screenSize.lessThan('md') ? 32 : 48}
                    fadeDuration={500}
                    delay={100}
                    pixelClassName="bg-white/10"
                />
            </div>

            {/* Top Left Logo */}
            <div className="absolute top-8 left-8 z-20">
                <Link to="/" className="text-xl font-medium tracking-tight text-white hover:text-white/80 transition-colors" style={{ textDecoration: 'none' }}>
                    TAKSHILA©
                </Link>
            </div>

            {/* Centered Login Card */}
            <div className="relative z-10 w-full max-w-[420px] p-8 md:p-12 rounded-[2rem] bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl flex flex-col items-center">
                
                {/* Loader/Icon at Top */}
                <div className="mb-8 flex justify-center w-full">
                    {loading ? (
                        <Loader2 className="animate-spin text-white/70" size={32} />
                    ) : (
                        <div className="grid grid-cols-3 gap-1.5 opacity-80">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/80"></div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-serif tracking-tight mb-2 text-white/90">Welcome to Takshila</h1>
                    <button 
                        type="button" 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none appearance-none"
                    >
                        {isLogin ? 'Begin by creating an account' : 'Already have an account? Sign in'}
                    </button>
                </div>

                {error && (
                    <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    {/* Email Input */}
                    <div className="relative group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                            className="w-full bg-[#141414] text-white px-5 py-4 rounded-2xl border border-white/5 focus:outline-none focus:border-white/20 transition-all placeholder:text-neutral-600"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            className="w-full bg-[#141414] text-white pl-5 pr-12 py-4 rounded-2xl border border-white/5 focus:outline-none focus:border-white/20 transition-all placeholder:text-neutral-600"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Terms */}
                    <div className="text-center text-[11px] text-neutral-500 leading-relaxed mt-4 mb-2">
                        By continuing, you agree to our<br />
                        <Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">Terms</Link> and <Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-medium py-4 rounded-full mt-2 hover:bg-neutral-200 transition-colors disabled:opacity-70 flex justify-center items-center"
                    >
                        {loading ? 'Processing...' : 'Continue'}
                    </button>
                </form>
            </div>
            
            <p className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 text-xs text-neutral-600 pointer-events-none z-10 flex">
               Pixel Trail © Takshila Base
            </p>
        </div>
    );
};

export default Login;
