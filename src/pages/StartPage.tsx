import { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { AvatarSelector } from '../components/AvatarSelector';
import { Gender } from '../types';
import { STOCK_AVATARS_FEMALE } from '../config/constants';

export const StartPage = () => {
  const { setCurrentUser, theme, setTheme, themeColor, setThemeColor } = useStore();
  const navigate = useNavigate();

  const [regFirstName, setRegFirstName] = useState('');
  const [regGender, setRegGender] = useState<Gender>('female');
  const [regAvatar, setRegAvatar] = useState(STOCK_AVATARS_FEMALE[0]);
  const [regDescription, setRegDescription] = useState('');

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

  const handleStart = () => {
    if (!regFirstName || !regGender) return;
    setCurrentUser({
      id: 'user-1',
      firstName: regFirstName,
      lastName: '',
      username: regFirstName.toLowerCase(),
      gender: regGender,
      avatar: regAvatar,
      description: regDescription.trim() || undefined,
    });
    navigate('/createxiis');
  };

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-y-auto relative items-center py-8 px-6">
      <BackgroundPattern />
      <div className="flex flex-col items-center mb-8 text-center shrink-0 relative z-10">
        <div className="mb-4 relative">
          <img 
            src="https://i.ibb.co/8DVMSjvq/xiislogofull.png" 
            alt="Logo" 
            className="w-48 h-48 object-contain logo-glow relative z-10" 
            referrerPolicy="no-referrer" 
          />
        </div>
        <p className="max-w-xs text-sm font-bold uppercase tracking-wider" style={{ color: themeColor }}>
          Ваш персональный симулятор общения с виртуальными бывшими
        </p>
      </div>

      <div className="w-full max-w-md space-y-6 pb-20 relative z-10">
        <GlassCard>
          <AvatarSelector 
            gender={regGender}
            avatar={regAvatar}
            onGenderChange={setRegGender}
            onAvatarChange={setRegAvatar}
          />
        </GlassCard>

        <GlassCard title="Регистрация">
          <div className="space-y-4">
            <Input 
              label="Имя"
              placeholder="Введите ваше имя"
              value={regFirstName}
              onChange={e => setRegFirstName(e.target.value)}
            />
            
            <Textarea 
              label="О себе"
              placeholder="Расскажите немного о себе..."
              className="h-24"
              value={regDescription}
              onChange={e => setRegDescription(e.target.value)}
            />
          </div>
        </GlassCard>

        <GlassCard title="Настройки темы">
          <div className="space-y-6">
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

            <div className="flex justify-between items-center px-1">
              {themeColors.map((color) => (
                <div 
                  key={color.value}
                  onClick={() => setThemeColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full cursor-pointer transition-all border-2 flex items-center justify-center shrink-0",
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

        <Button 
          onClick={handleStart}
          disabled={!regFirstName || !regGender}
          size="lg"
          style={{ backgroundColor: themeColor }}
          className="w-full text-white py-5 rounded-2xl font-black text-xl shadow-xl disabled:opacity-50"
        >
          Начать общение
        </Button>
      </div>
    </div>
  );
};
