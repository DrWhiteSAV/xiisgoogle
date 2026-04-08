import { useState } from 'react';
import { useStore } from '../store';
import { Gender } from '../types/index';
import { BackgroundPattern } from './BackgroundPattern';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Sun, Moon, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from './ui/GlassCard';

export const Onboarding = () => {
  const { setCurrentUser, theme, setTheme, themeColor, setThemeColor } = useStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('male');

  const themeColors = [
    { name: 'Синий', value: '#3390ec' },
    { name: 'Розовый', value: '#ff4081' },
    { name: 'Зеленый', value: '#4caf50' },
    { name: 'Оранжевый', value: '#ff9800' },
    { name: 'Фиолетовый', value: '#9c27b0' },
    { name: 'Красный', value: '#f44336' },
  ];

  const canStart = firstName.trim() && lastName.trim();

  const handleStart = () => {
    if (!firstName || !lastName) return;
    setCurrentUser({
      id: 'user-1',
      firstName,
      lastName,
      username: firstName.toLowerCase(),
      gender,
      avatar: gender === 'male' ? '👨' : '👩',
    });
  };

  return (
    <div className="fixed inset-0 bg-transparent z-50 flex flex-col items-center justify-start py-8 px-6 text-center overflow-y-auto">
      <BackgroundPattern />
      
      <div className="mb-4 relative shrink-0">
        <img src="https://i.ibb.co/8DVMSjvq/xiislogofull.png" alt="Logo" className="w-24 h-24 relative z-10 rounded-2xl object-contain" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-tg-light-blue/20 blur-3xl rounded-full scale-150"></div>
      </div>
      
      <p className="text-tg-hint mb-6 max-w-xs text-sm">Ваш персональный симулятор общения с виртуальными бывшими.</p>
      
      <div className="w-full max-w-sm space-y-4 pb-10">
        <GlassCard>
          <div className="space-y-4">
            <Input 
              label="Как вас зовут?"
              placeholder="Имя"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <Input 
              label="Фамилия"
              placeholder="Фамилия"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
        </GlassCard>

        <GlassCard title="Настройки темы">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button 
                onClick={() => setTheme('light')}
                variant={theme === 'light' ? 'primary' : 'secondary'}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold",
                  theme === 'light' ? "border-tg-light-blue" : "border-transparent"
                )}
                style={theme === 'light' ? { backgroundColor: `${themeColor}1a`, color: themeColor } : {}}
              >
                <Sun size={18} />
                Дневная
              </Button>
              <Button 
                onClick={() => setTheme('dark')}
                variant={theme === 'dark' ? 'primary' : 'secondary'}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold",
                  theme === 'dark' ? "border-tg-light-blue" : "border-transparent"
                )}
                style={theme === 'dark' ? { backgroundColor: `${themeColor}1a`, color: themeColor } : {}}
              >
                <Moon size={18} />
                Ночная
              </Button>
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
        
        <GlassCard title="Ваш пол">
          <div className="flex gap-4">
            <Button 
              onClick={() => setGender('male')}
              className={cn(
                "flex-1 py-4 rounded-2xl border-2 transition-all font-bold",
                gender === 'male' 
                  ? "border-[#3390ec] bg-[#3390ec] text-white shadow-lg shadow-blue-500/20" 
                  : "border-transparent bg-gray-100 dark:bg-gray-800 text-tg-hint"
              )}
            >
              Мужчина
            </Button>
            <Button 
              onClick={() => setGender('female')}
              className={cn(
                "flex-1 py-4 rounded-2xl border-2 transition-all font-bold",
                gender === 'female' 
                  ? "border-[#ff4081] bg-[#ff4081] text-white shadow-lg shadow-pink-500/20" 
                  : "border-transparent bg-gray-100 dark:bg-gray-800 text-tg-hint"
              )}
            >
              Женщина
            </Button>
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
