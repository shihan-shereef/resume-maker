import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef(({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
}, ref) => {
    const variants = {
        primary: 'bg-[var(--primary)] text-white hover:opacity-90 shadow-sm active:scale-[0.98]',
        secondary: 'bg-white text-[var(--text-primary)] border border-slate-200 hover:bg-slate-50 active:scale-[0.98]',
        outline: 'bg-transparent text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white active:scale-[0.98]',
        ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-slate-100 active:scale-[0.98]',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-[0.98]',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2.5',
        icon: 'h-10 w-10 p-0 items-center justify-center',
    };

    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={twMerge(
                'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
