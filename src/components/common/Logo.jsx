import React from 'react';

const Logo = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Abstract Modern 'T' with a spark influence */}
      <path 
        d="M30 25C30 22.2386 32.2386 20 35 20H85C87.7614 20 90 22.2386 90 25C90 27.7614 87.7614 30 85 30H35C32.2386 30 30 27.7614 30 25Z" 
        fill="var(--primary, #FF5C00)"
      />
      <path 
        d="M45 20C45 17.2386 47.2386 15 50 15H55C57.7614 15 60 17.2386 60 20V80C60 88.2843 53.2843 95 45 95C36.7157 95 30 88.2843 30 80V40C30 37.2386 32.2386 35 35 35H40C42.7614 35 45 37.2386 45 40V20Z" 
        fill="var(--primary, #FF5C00)"
      />
      {/* Spark/Flame element */}
      <path 
        d="M75 40C75 40 85 50 85 65C85 73.2843 78.2843 80 70 80C61.7157 80 55 73.2843 55 65C55 65 55 50 65 40C68 37 72 37 75 40Z" 
        fill="#FF9C66"
        opacity="0.8"
      />
      <circle cx="70" cy="65" r="8" fill="white" opacity="0.9" />
    </svg>
  );
};

export default Logo;
