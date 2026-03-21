import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({ 
    children, 
    variant = 'primary', 
    className 
}) => {
    const variants = {
        primary: 'bg-orange-50 text-orange-600 border-orange-100',
        success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        warning: 'bg-amber-50 text-amber-600 border-amber-100',
        danger: 'bg-red-50 text-red-600 border-red-100',
        info: 'bg-blue-50 text-blue-600 border-blue-100',
        secondary: 'bg-slate-50 text-slate-600 border-slate-100',
    };

    return (
        <span className={twMerge(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors select-none',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

export default Badge;
