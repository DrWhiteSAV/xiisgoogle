import { useState } from 'react';
import { useStore } from '../store';
import { Gender } from '../types/index';
import { BackgroundPattern } from './BackgroundPattern';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Sun, Moon, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'motion/react';

export const Onboarding = () => {
  const { setCurrentUser, theme, setTheme, themeColor, setThemeColor } = useStore();
  const [firstName, setFirstName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);

  const themeColors = [
    { name: 'Синий', value: '#3390ec' },
    { name: 'Розовый', value: '#ff4081' },
    { name: 'Зеленый', value: '#4caf50' },
    { name: 'Серый', value: '#8e8e93' },
    { name: 'Фиолетовый', value: '#9c27b0' },
    { name: 'Красный', value: '#f44336' },
  ];

  const canStart = firstName.trim() && gender !== null;

  const handleStart = () => {
    if (!firstName || !gender) return;
    setCurrentUser({
      id: 'user-1',
      firstName,
      lastName: '',
      username: firstName.toLowerCase(),
      gender,
      avatar: gender === 'male' ? '👨' : '👩',
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-transparent z-50 flex flex-col items-center justify-start py-8 px-6 text-center overflow-y-auto">
      <BackgroundPattern />
      
      <div className="mb-8 relative shrink-0">
        <motion.img 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src="https://i.ibb.co/8DVMSjvq/xiislogofull.png" 
          alt="Logo" 
          className="w-48 h-48 rounded-[2.5rem] object-contain logo-glow relative z-10" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-tg-light-blue/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
      </div>
      
      <p className="mb-6 max-w-xs text-sm font-bold" style={{ color: themeColor }}>Ваш персональный симулятор общения с виртуальными бывшими.</p>
      
      <div className="w-full max-w-sm space-y-4 pb-10">
        <GlassCard>
          <div className="space-y-4">
            <Input 
              label="Как вас зовут?"
              placeholder="Имя"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            
            <div className="space-y-1 w-full text-left">
              <label className="text-[10px] font-bold uppercase ml-1" style={{ color: 'var(--theme-color)' }}>
                Ваш пол
              </label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setGender('male')}
                  className={cn(
                    "theme-button py-4 rounded-2xl",
                    gender === 'male' && "active"
                  )}
                >
                  Мужчина
                </button>
                <button 
                  onClick={() => setGender('female')}
                  className={cn(
                    "theme-button py-4 rounded-2xl",
                    gender === 'female' && "active"
                  )}
                >
                  Женщина
                </button>
              </div>
            </div>

            <div className="space-y-1 w-full text-left">
              <label className="text-[10px] font-bold uppercase ml-1" style={{ color: 'var(--theme-color)' }}>
                О себе (необязательно)
              </label>
              <textarea
                placeholder="Расскажите немного о себе..."
                className="w-full p-3 rounded-xl outline-none border-2 border-transparent focus:border-tg-light-blue text-tg-text input-glass transition-all resize-none h-24 text-sm"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Настройки темы">
          <div className="space-y-6">
            <div className="flex gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={cn(
                  "theme-button",
                  theme === 'light' && "active"
                )}
              >
                <Sun size={18} />
                Дневная
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={cn(
                  "theme-button",
                  theme === 'dark' && "active"
                )}
              >
                <Moon size={18} />
                Ночная
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {themeColors.map((color) => (
                <div 
                  key={color.value}
                  onClick={() => setThemeColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full cursor-pointer transition-all border-2 flex items-center justify-center",
                    themeColor === color.value 
                      ? "border-white dark:border-gray-700 scale-110 shadow-lg" 
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                  style={{ backgroundColor: color.value }}
                >
                  {themeColor === color.value && <Check size={14} className="text-white" />}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {canStart && (
          <Button 
            onClick={handleStart}
            size="lg"
            style={{ backgroundColor: themeColor }}
            className="w-full text-white py-5 rounded-2xl font-black text-xl mt-6 shadow-xl"
          >
            Начать общение
          </Button>
        )}
      </div>
    </div>
  );
};
