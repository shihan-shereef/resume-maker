import React from 'react';
import { twMerge } from 'tailwind-merge';

const Skeleton = ({ 
    className, 
    variant = 'rectangular',
    ...props 
}) => {
    return (
        <div
            className={twMerge(
                "animate-pulse bg-slate-200",
                variant === 'circular' ? "rounded-full" : "rounded-xl",
                className
            )}
            {...props}
        />
    );
};

export default Skeleton;
