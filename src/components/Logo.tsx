import React from 'react';

const Logo = () => {
  return (
    <div className="relative h-10 w-10 flex items-center justify-center group">
      {/* Outer Box with Shadow */}
      <div className="absolute inset-0 bg-neo-black border-2 border-black transform transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
      
      {/* The Monkey SVG - Geometric/Brutalist Style */}
      <svg 
        viewBox="0 0 100 100" 
        className="relative z-10 w-8 h-8 fill-neo-pink stroke-black stroke-[4px]"
      >
        {/* Head Base */}
        <path d="M20 30 L80 30 L85 70 L15 70 Z" />
        
        {/* Ears - Sharp Geometric */}
        <path d="M10 25 L25 25 L20 45 L5 45 Z" />
        <path d="M75 25 L90 25 L95 45 L80 45 Z" />
        
        {/* Face "Cuts" / Eyes */}
        <rect x="30" y="45" width="12" height="6" className="fill-black" />
        <rect x="58" y="45" width="12" height="6" className="fill-black" />
        
        {/* Mouth Area - Sharp Cut */}
        <path d="M35 60 L65 60 L60 65 L40 65 Z" className="fill-black" />
        
        {/* Top "Neural Link" / Cut */}
        <rect x="45" y="25" width="10" height="10" className="fill-neo-yellow" />
      </svg>
      
      {/* Accent "Cut" lines outside */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-neo-green border-2 border-black" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-neo-blue border-2 border-black" />
    </div>
  );
};

export default Logo;
