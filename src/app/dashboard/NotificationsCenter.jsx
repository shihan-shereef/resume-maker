import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Bell, MessageSquare, AlertTriangle, Info } from 'lucide-react';
import Button from '../../components/ui/Button';

const NotificationsCenter = ({ isOpen, onClose }) => {
    const notifications = [
        { id: 1, title: 'Analysis Complete', msg: 'Your resume score increased to 92%', time: '2 mins ago', type: 'success', status: 'unread' },
        { id: 2, title: 'New Message', msg: 'Career coach sent you 3 recommendations', time: '1 hour ago', type: 'info', status: 'unread' },
        { id: 3, title: 'Security Alert', msg: 'New login from Chrome on macOS', time: '5 hours ago', type: 'warning', status: 'read' },
        { id: 4, title: 'Welcome', msg: 'Thanks for joining ResumeFlow Pro!', time: '1 day ago', type: 'success', status: 'read' },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <Check size={16} className="text-emerald-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
            case 'info': return <MessageSquare size={16} className="text-blue-500" />;
            default: return <Bell size={16} className="text-slate-400" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[150]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[151] flex flex-col border-l border-slate-100"
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Notifications</h3>
                            <div className="flex gap-2">
                                <button className="text-[10px] font-black uppercase text-[var(--primary)] hover:underline">Mark all read</button>
                                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mr-1">
                                    <X size={20} />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="divide-y divide-slate-50">
                                {notifications.map((n) => (
                                    <div key={n.id} className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer group relative ${n.status === 'unread' ? 'bg-orange-50/30' : ''}`}>
                                        {n.status === 'unread' && (
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full shadow-lg shadow-orange-300" />
                                        )}
                                        <div className="flex gap-4">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 h-fit">
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-slate-900">{n.title}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{n.time}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium leading-normal">{n.msg}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Button variant="secondary" className="w-full font-bold text-xs h-10 border-slate-200">
                                View Notification Settings
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationsCenter;
