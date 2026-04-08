import { useStore } from '../store';
import * as LucideIcons from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

export const BackgroundPattern = () => {
  const { theme, themeColor, bgBlurIntensity, bgIcons } = useStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pattern = useMemo(() => {
    const { width, height } = dimensions;
    const isHorizontal = width >= height;
    
    let rows = 12;
    let cols = 25;
    let minSize = 10;
    let maxSize = 60;

    if (width >= 1024) {
      // PC Version
      cols = 25;
      rows = 12;
      minSize = 10;
      maxSize = 60;
    } else if (width >= 768) {
      // Tablet Version
      if (isHorizontal) {
        cols = 20;
        rows = 10;
      } else {
        cols = 10;
        rows = 20;
      }
      minSize = 10;
      maxSize = 60;
    } else {
      // Mobile Version
      // User requested 5x20 for both vertical and horizontal mobile
      cols = 5;
      rows = 20;
      minSize = 10;
      maxSize = 40;
    }

    const items = [];
    
    // Filter valid icons from Lucide
    const availableIcons = bgIcons.map(name => (LucideIcons as any)[name]).filter(Boolean);
    
    // Fallback if no icons selected
    const iconsToUse = availableIcons.length > 0 ? availableIcons : [LucideIcons.Heart];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const Icon = iconsToUse[Math.floor(Math.random() * iconsToUse.length)];
        const size = minSize + Math.random() * (maxSize - minSize);
        const rotation = Math.random() * 360;
        
        items.push({
          id: `${r}-${c}`,
          Icon,
          size,
          rotation,
          top: `${(r / rows) * 100 + (Math.random() * 5 - 2.5)}%`,
          left: `${(c / cols) * 100 + (Math.random() * 5 - 2.5)}%`,
        });
      }
    }
    return items;
  }, [bgIcons, dimensions]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-tg-bg">
      {/* Radial Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(circle at center, var(--bg-radial-start) 0%, var(--bg-radial-end) 100%)`
        }}
      />

      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient-0" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--icon-grad-start)" />
            <stop offset="100%" stopColor="var(--icon-grad-end)" />
          </linearGradient>
          <linearGradient id="icon-gradient-1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--icon-grad-start)" />
            <stop offset="100%" stopColor="var(--icon-grad-end)" />
          </linearGradient>
          <linearGradient id="icon-gradient-2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--icon-grad-start)" />
            <stop offset="100%" stopColor="var(--icon-grad-end)" />
          </linearGradient>
          <linearGradient id="icon-gradient-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--icon-grad-start)" />
            <stop offset="100%" stopColor="var(--icon-grad-end)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 z-1">
        {pattern.map((item, idx) => {
          const gradId = `icon-gradient-${idx % 4}`;
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: item.top,
                left: item.left,
                transform: `rotate(${item.rotation}deg) translate(-50%, -50%)`,
              }}
            >
              <item.Icon 
                size={item.size} 
                strokeWidth={1} 
                style={{ stroke: `url(#${gradId})` }}
              />
            </div>
          );
        })}
      </div>

      {/* Full screen blur overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-[var(--bg-blur-intensity)] pointer-events-none"
        style={{ backdropFilter: `blur(${bgBlurIntensity}px)` }}
      />
    </div>
  );
};
