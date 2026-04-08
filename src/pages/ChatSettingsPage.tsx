import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Monitor, Smartphone, Zap, Globe, Trash2, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/ui/GlassCard';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';

export const ChatSettings = () => {
  const { 
    theme, setTheme, 
    themeColor, setThemeColor, 
    blurIntensity, setBlurIntensity, 
    bgBlurIntensity, setBgBlurIntensity,
    bgIcons, setBgIcons
  } = useStore();
  const navigate = useNavigate();

  const availableIcons = [
    'Heart', 'MessageSquare', 'Zap', 'Star', 'Smile', 'Music', 'Camera', 'Coffee',
    'Ghost', 'Flame', 'Sun', 'Moon', 'Cloud', 'Umbrella', 'Anchor', 'Flag',
    'Bell', 'Gift', 'Key', 'Lock', 'Search', 'Settings', 'User', 'Users'
  ];

  const toggleIcon = (iconName: string) => {
    if (bgIcons.includes(iconName)) {
      setBgIcons(bgIcons.filter(name => name !== iconName));
    } else {
      setBgIcons([...bgIcons, iconName]);
    }
  };

  const themeColors = [
    { name: 'Синий', value: '#3390ec' },
    { name: 'Розовый', value: '#ff4081' },
    { name: 'Зеленый', value: '#4caf50' },
    { name: 'Серый', value: '#8e8e93' },
    { name: 'Фиолетовый', value: '#9c27b0' },
    { name: 'Красный', value: '#f44336' },
    { name: 'Голубой', value: '#00bcd4' },
  ];

  const themes = [
    { id: 'light', name: 'Дневная', icon: Sun },
    { id: 'dark', name: 'Ночная', icon: Moon },
  ];

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-y-auto">
      <Header title="Настройки чатов" showBack />

      <div className="p-4 space-y-8">
        {/* Theme Selection */}
        <GlassCard title="Цветовая тема">
          <div className="grid grid-cols-2 gap-3">
            {themes.map((t) => (
              <button 
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={cn(
                  "theme-button h-auto flex-col p-4",
                  theme === t.id && "active"
                )}
              >
                <t.icon size={24} />
                <span className="text-sm font-medium">{t.name}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Accent Color Selection */}
        <GlassCard title="Акцентный цвет">
          <div className="flex flex-wrap gap-3">
            {themeColors.map((color) => (
              <div 
                key={color.value}
                onClick={() => setThemeColor(color.value)}
                className={cn(
                  "w-12 h-12 rounded-full cursor-pointer transition-all border-4 flex items-center justify-center",
                  themeColor === color.value 
                    ? "border-white dark:border-gray-700 scale-110 shadow-lg" 
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
                style={{ backgroundColor: color.value }}
              >
                {themeColor === color.value && <Check size={20} className="text-white" />}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Blur Intensity Selection */}
        <GlassCard title="Интенсивность размытия">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-bold text-tg-hint uppercase">Размытие блоков</span>
                <span className="text-xs font-mono text-tg-hint">{blurIntensity}px</span>
              </div>
              <div className="p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="1"
                  value={blurIntensity}
                  onChange={(e) => setBlurIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-bold text-tg-hint uppercase">Размытие фона</span>
                <span className="text-xs font-mono text-tg-hint">{bgBlurIntensity}px</span>
              </div>
              <div className="p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="1"
                  value={bgBlurIntensity}
                  onChange={(e) => setBgBlurIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Background Icons Selection */}
        <GlassCard title="Иконки фона">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {availableIcons.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName];
              const isSelected = bgIcons.includes(iconName);
              return (
                <div 
                  key={iconName}
                  onClick={() => toggleIcon(iconName)}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all border-2",
                    isSelected 
                      ? "border-tg-light-blue bg-tg-light-blue/10 text-tg-light-blue shadow-md" 
                      : "border-transparent bg-gray-100/50 dark:bg-gray-800/50 text-tg-hint hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                  )}
                >
                  <Icon size={20} strokeWidth={isSelected ? 2.5 : 1.5} />
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-tg-hint mt-4 text-center uppercase font-bold tracking-wider">
            Выберите иконки для заполнения фона
          </p>
        </GlassCard>

        {/* Other Settings (Mock) */}
        <GlassCard title="Общие">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                  <Globe size={18} />
                </div>
                <span className="text-sm font-medium">Встроенный браузер</span>
              </div>
              <div className="w-10 h-5 bg-tg-light-blue rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center text-white">
                  <Zap size={18} />
                </div>
                <span className="text-sm font-medium">Анимации</span>
              </div>
              <div className="w-10 h-5 bg-tg-light-blue rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </GlassCard>

        <section>
          <Button 
            variant="danger"
            className="w-full p-4 font-bold flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Сбросить все настройки
          </Button>
        </section>
      </div>
    </div>
  );
};
