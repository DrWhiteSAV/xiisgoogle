import { useStore } from '../store';
import * as LucideIcons from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

export const BackgroundPattern = () => {
  const { theme, themeColor, bgBlurIntensity, bgIcons, bgSettings } = useStore();
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
    
    let deviceSettings = bgSettings.pc;

    if (width >= 1024) {
      deviceSettings = bgSettings.pc;
    } else if (width >= 768) {
      deviceSettings = isHorizontal ? bgSettings.tabletLandscape : bgSettings.tabletPortrait;
    } else {
      deviceSettings = isHorizontal ? bgSettings.mobileLandscape : bgSettings.mobilePortrait;
    }

    const { rows, cols, minSize, maxSize } = deviceSettings;

    const items = [];
    
    // Filter to only valid Lucide icons and check if any are selected
    const iconsToUse = bgIcons.filter(name => (LucideIcons as any)[name]);
    if (iconsToUse.length === 0) return [];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const iconName = iconsToUse[Math.floor(Math.random() * iconsToUse.length)];
        const Icon = (LucideIcons as any)[iconName];
        
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
  }, [bgIcons, dimensions, bgSettings]);

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

      <div 
        className="absolute inset-0 z-1"
        style={{ 
          filter: 'blur(var(--bg-blur-intensity))',
          willChange: 'filter'
        }}
      >
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

    </div>
  );
};
