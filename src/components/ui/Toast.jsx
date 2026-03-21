import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Button from './Button';

const Toast = ({ 
    message, 
    type = 'success', 
    isVisible, 
    onClose 
}) => {
    const icons = {
        success: <CheckCircle className="text-emerald-500" size={20} />,
        error: <XCircle className="text-red-500" size={20} />,
        warning: <AlertCircle className="text-amber-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    const variants = {
        success: 'border-emerald-100 bg-emerald-50/50',
        error: 'border-red-100 bg-red-50/50',
        warning: 'border-amber-100 bg-amber-50/50',
        info: 'border-blue-100 bg-blue-50/50',
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4"
                >
                    <div className={twMerge(
                        "flex items-center gap-3 p-4 rounded-2xl border bg-white/80 backdrop-blur-md shadow-xl",
                        variants[type]
                    )}>
                        <div className="flex-shrink-0">{icons[type]}</div>
                        <p className="flex-1 text-sm font-semibold text-slate-900">{message}</p>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 -mr-1" 
                            onClick={onClose}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
