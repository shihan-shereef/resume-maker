import React, { useState } from 'react';
import { Bell, User, Settings, LogOut, Menu, X, Home, Clock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const DashboardLayout = ({ children, user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const navItems = [
        { label: 'Overview', icon: <Home size={20} />, active: true },
        { label: 'Activity', icon: <Clock size={20} /> },
        { label: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 fixed h-full z-30">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold">R</div>
                    <span className="text-xl font-extrabold tracking-tight">Resume<span className="text-[var(--primary)]">Flow</span></span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                                item.active 
                                ? 'bg-orange-50 text-[var(--primary)]' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-100">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500" leftIcon={<LogOut size={20} />}>
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="lg:hidden" 
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </Button>
                        <h2 className="text-lg font-bold lg:hidden">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="relative">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="relative h-10 w-10 bg-slate-50 rounded-full"
                                onClick={() => setIsNotificationsOpen(true)}
                            >
                                <Bell size={20} className="text-slate-600" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-slate-200">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold leading-none">{user?.name || 'User'}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{user?.role || 'Free'}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-orange-200">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full flex-1">
                    {children}
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-[101] shadow-2xl lg:hidden p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xl font-extrabold">Resume<span className="text-[var(--primary)]">Flow</span></span>
                                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                    <X size={22} />
                                </Button>
                            </div>
                            {/* Mobile Nav Content */}
                            <nav className="flex-1 space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.label}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold ${
                                            item.active 
                                            ? 'bg-orange-50 text-[var(--primary)]' 
                                            : 'text-slate-500'
                                        }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
