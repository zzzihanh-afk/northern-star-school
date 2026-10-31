import React, { useState, useEffect } from 'react';

interface LogoProps {
  variant?: 'full' | 'sidebar' | 'compact' | 'horizontal' | 'icon-only' | 'print';
  className?: string;
  lightText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customLogoUrl?: string;
}

export const LogoEmblem: React.FC<{ sizeClass?: string; idSuffix?: string; customLogoUrl?: string }> = ({ 
  sizeClass = "w-12 h-12",
  idSuffix = "default",
  customLogoUrl
}) => {
  const [logoSrc, setLogoSrc] = useState<string | null>(customLogoUrl || null);

  useEffect(() => {
    if (customLogoUrl) {
      setLogoSrc(customLogoUrl);
    } else {
      const stored = localStorage.getItem('ns_custom_logo');
      if (stored) setLogoSrc(stored);
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem('ns_custom_logo');
      setLogoSrc(updated || null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logo-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logo-updated', handleStorageChange);
    };
  }, [customLogoUrl]);

  if (logoSrc) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClass}`}>
        <img
          src={logoSrc}
          alt="Institution Logo"
          className="w-full h-full object-contain drop-shadow-sm rounded-md"
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClass}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none">
        <defs>
          <linearGradient id={`starBlue-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#0E3D7D" />
            <stop offset="100%" stopColor="#061B3A" />
          </linearGradient>
          <linearGradient id={`goldGrad-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id={`bookGrad-${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>
        </defs>

        {/* Gold Accent Star (top-right) */}
        <path 
          d="M 88 18 Q 88 28 98 28 Q 88 28 88 38 Q 88 28 78 28 Q 88 28 88 18 Z" 
          fill={`url(#goldGrad-${idSuffix})`}
          filter="drop-shadow(0 1px 2px rgba(245,158,11,0.5))"
        />

        {/* Main North Star */}
        <path 
          d="M 60 4 Q 60 44 98 46 Q 60 48 60 88 Q 60 48 22 46 Q 60 44 60 4 Z" 
          fill={`url(#starBlue-${idSuffix})`} 
        />

        {/* Dynamic Curved Swooshes */}
        <path 
          d="M 38 46 C 48 34 68 30 84 38 C 72 40 50 48 44 58 Z" 
          fill="#60A5FA" 
          opacity="0.85" 
        />
        <path 
          d="M 32 46 C 44 42 62 44 76 54 C 64 54 48 56 40 64 Z" 
          fill="#93C5FD" 
          opacity="0.75" 
        />

        {/* Open Book Foundation */}
        <path 
          d="M 60 84 C 50 81 32 80 18 87 C 22 96 28 107 60 105 Z" 
          fill="#082B57" 
        />
        <path 
          d="M 60 84 C 70 81 88 80 102 87 C 98 96 92 107 60 105 Z" 
          fill="#082B57" 
        />

        {/* Left Book Page */}
        <path 
          d="M 60 80 C 50 77 34 76 22 83 C 25 90 32 101 60 100 Z" 
          fill={`url(#bookGrad-${idSuffix})`} 
          stroke="#1769E8" 
          strokeWidth="1.5" 
        />
        <path d="M 58 84 C 50 81 38 80 28 85" stroke="#1E40AF" strokeWidth="1" strokeLinecap="round" />
        <path d="M 58 88 C 50 85 38 84 29 89" stroke="#1E40AF" strokeWidth="1" strokeLinecap="round" />
        <path d="M 58 92 C 50 89 39 88 31 93" stroke="#1E40AF" strokeWidth="1" strokeLinecap="round" />

        {/* Right Book Page */}
        <path 
          d="M 60 80 C 70 77 86 76 98 83 C 95 90 88 101 60 100 Z" 
          fill={`url(#bookGrad-${idSuffix})`} 
          stroke="#1769E8" 
          strokeWidth="1.5" 
        />
        <path d="M 62 84 C 70 81 82 80 92 85" stroke="#1E40AF" strokeWidth="1" strokeLinecap="round" />
        <path d="M 62 88 C 70 85 82 84 91 89" stroke="#1E40AF" strokeWidth="1" strokeLinecap="round" />
        <path d="M 62 92 C 70 89 81 88 89 93" stroke="#1E40AF" strokeWidth="1" strokeLinecap="round" />

        {/* Gold Ribbon / Center Bookmark */}
        <polygon points="58,82 62,82 63,106 60,103 57,106" fill={`url(#goldGrad-${idSuffix})`} />
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  lightText = false,
  size = 'md',
  customLogoUrl
}) => {
  const isWhite = lightText || variant === 'sidebar';

  if (variant === 'icon-only') {
    const sizeMap = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20',
    };
    return <LogoEmblem sizeClass={sizeMap[size]} idSuffix="icon-only" customLogoUrl={customLogoUrl} />;
  }

  // Sidebar variant: matching the exact dark navy sidebar brand lockup from the reference image
  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center gap-3 px-3 py-4 select-none ${className}`}>
        <LogoEmblem sizeClass="w-10 h-10" idSuffix="sidebar" customLogoUrl={customLogoUrl} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-sm tracking-wider text-white">
              NORTHERN STAR
            </span>
          </div>
          <span className="text-[10px] tracking-widest text-slate-300 font-semibold uppercase">
            School & College
          </span>
        </div>
      </div>
    );
  }

  // Full stacked brand presentation (as featured on the reference image left hero)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <LogoEmblem sizeClass="w-24 h-24 sm:w-28 sm:h-28" idSuffix="full-brand" customLogoUrl={customLogoUrl} />
        <div className="mt-4">
          <h1 className="font-serif font-black tracking-wider text-2xl sm:text-3xl text-navy-900">
            NORTHERN STAR
          </h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <div className="h-[1px] w-8 bg-gold" />
            <h2 className="text-xs sm:text-sm tracking-[0.25em] font-semibold text-navy-800 uppercase">
              School & College
            </h2>
            <div className="h-[1px] w-8 bg-gold" />
          </div>
          <p className="mt-2 text-xs sm:text-sm italic font-medium text-slate-muted">
            Learn <span className="text-gold font-bold mx-1">•</span> Grow{' '}
            <span className="text-gold font-bold mx-1">•</span> Achieve
          </p>
        </div>
      </div>
    );
  }

  // Standard Horizontal Lockup (for Navbar & Public Headers)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <LogoEmblem sizeClass="w-10 h-10 sm:w-11 sm:h-11" idSuffix="horiz" customLogoUrl={customLogoUrl} />
      <div className="flex flex-col">
        <span
          className={`font-serif font-bold tracking-wider text-sm sm:text-base leading-tight ${
            isWhite ? 'text-white' : 'text-navy-900'
          }`}
        >
          NORTHERN STAR
        </span>
        <span
          className={`text-[10px] tracking-widest font-semibold uppercase leading-tight ${
            isWhite ? 'text-blue-200' : 'text-navy-700'
          }`}
        >
          School & College
        </span>
        <span className="text-[9px] text-gold tracking-wide italic font-medium leading-none mt-0.5 hidden sm:block">
          Learn • Grow • Achieve
        </span>
      </div>
    </div>
  );
};
