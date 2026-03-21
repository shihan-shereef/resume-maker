import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ 
    className, 
    label, 
    error, 
    type = 'text', 
    ...props 
}, ref) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                ref={ref}
                className={twMerge(
                    "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-xs font-medium text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
