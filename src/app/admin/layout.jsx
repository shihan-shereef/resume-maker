import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    BarChart3, 
    Database, 
    Settings, 
    LogOut, 
    Search, 
    Bell,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Activity,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';

const AdminLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { label: 'Overview', icon: <LayoutDashboard size={20} />, active: true },
        { label: 'User Management', icon: <Users size={20} /> },
        { label: 'Analytics', icon: <BarChart3 size={20} /> },
        { label: 'Content Control', icon: <Database size={20} /> },
        { label: 'System Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[#f1f2f6] flex text-slate-900 font-sans antialiased">
            {/* Sidebar Desktop */}
            <aside 
                className={`hidden lg:flex flex-col bg-[#1e293b] text-slate-400 fixed h-full z-50 transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                <div className={`p-6 flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && <span className="text-white font-black text-xl tracking-tighter">ADMIN<span className="text-orange-500">PRO</span></span>}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                item.active 
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                : 'hover:bg-slate-800 hover:text-slate-200'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {!isCollapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
                        <LogOut size={20} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                {/* Admin Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="lg:hidden" 
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <Menu size={22} />
                        </Button>
                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl w-64 border border-slate-200/50">
                            <Search size={16} className="text-slate-400" />
                            <input className="bg-transparent border-none text-xs font-bold w-full focus:ring-0" placeholder="Search system..." />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="text-slate-500 relative">
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-500">
                                <HelpCircle size={18} />
                            </Button>
                        </div>
                        <div className="h-8 w-px bg-slate-200 mx-1" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-slate-900 leading-none">Admin Shereef</p>
                                <p className="text-[10px] font-bold text-orange-500 uppercase mt-1 tracking-widest">Global Admin</p>
                            </div>
                            <div className="w-9 h-9 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center font-black text-[10px] text-slate-600">
                                AS
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed inset-y-0 left-0 w-80 bg-[#1e293b] z-[101] shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-8 flex items-center justify-between">
                                <span className="text-white font-black text-2xl">ADMIN<span className="text-orange-400">PRO</span></span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)} className="text-slate-400">
                                    <X size={26} />
                                </Button>
                            </div>
                            <nav className="flex-1 px-6 space-y-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.label}
                                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                                            item.active ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-800'
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

export default AdminLayout;
