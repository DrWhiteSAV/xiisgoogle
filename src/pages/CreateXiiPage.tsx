import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Gender, Xii } from '../types/index';
import { Camera, Check } from 'lucide-react';
import { STOCK_AVATARS_MALE, STOCK_AVATARS_FEMALE } from '../config/constants';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';

export const CreateXii = () => {
  const { currentUser, addXii } = useStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [personality, setPersonality] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [avatar, setAvatar] = useState(STOCK_AVATARS_FEMALE[0]);
  
  // New fields
  const [past, setPast] = useState('');
  const [breakupReason, setBreakupReason] = useState('');
  const [job, setJob] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [relatives, setRelatives] = useState('');
  const [friends, setFriends] = useState('');
  const [habits, setHabits] = useState('');

  const avatars = gender === 'male' ? STOCK_AVATARS_MALE : STOCK_AVATARS_FEMALE;

  const handleCreate = () => {
    if (!firstName || !lastName || !currentUser) return;

    const newXii: Xii = {
      id: `xii-${Date.now()}`,
      firstName,
      lastName,
      username: `${firstName.toLowerCase()}_xiis`,
      gender,
      avatar,
      isXii: true,
      personality: personality || 'Обычная бывшая/бывший со сложным характером.',
      past,
      breakupReason,
      job,
      city,
      birthDate,
      hobbies,
      relatives,
      friends,
      habits,
    };

    addXii(newXii);
    navigate('/chats');
  };

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-y-auto">
      <Header title="Создать xiis" showBack />
      
      <div className="p-6 space-y-8 max-w-2xl mx-auto w-full pb-20">
        <GlassCard>
          <div className="flex flex-col items-center gap-6">
            <div className="w-48 h-48 rounded-3xl flex items-center justify-center relative shadow-2xl overflow-hidden glass-effect ring-4 ring-white/20">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={32} className="text-white" />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex gap-2 p-1 rounded-xl input-glass w-full max-w-md">
                <button 
                  onClick={() => { setGender('male'); setAvatar(STOCK_AVATARS_MALE[0]); }}
                  className={cn(
                    "theme-button",
                    gender === 'male' && "active"
                  )}
                >
                  Мужчина
                </button>
                <button 
                  onClick={() => { setGender('female'); setAvatar(STOCK_AVATARS_FEMALE[0]); }}
                  className={cn(
                    "theme-button",
                    gender === 'female' && "active"
                  )}
                >
                  Женщина
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 w-full max-w-md">
                {avatars.map(url => (
                  <div 
                    key={url} 
                    onClick={() => setAvatar(url)}
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden cursor-pointer relative border-2 transition-all hover:scale-105",
                      avatar === url ? "border-tg-light-blue scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={url} alt="Stock" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {avatar === url && (
                      <div className="absolute inset-0 bg-tg-light-blue/20 flex items-center justify-center">
                        <Check size={16} className="text-white bg-tg-light-blue rounded-full p-0.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard title="Основное">
            <div className="space-y-4">
              <Input 
                label="Имя"
                placeholder="Введите имя"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <Input 
                label="Фамилия"
                placeholder="Введите фамилию"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
              <Textarea 
                label="Характер"
                placeholder="Например: ревнивая, веселая, обидчивая..."
                className="h-24"
                value={personality}
                onChange={e => setPersonality(e.target.value)}
              />
            </div>
          </GlassCard>

          <GlassCard title="Детали (необязательно)">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Город"
                  placeholder="Москва"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
                <Input 
                  label="Дата рождения"
                  placeholder="01.01.1995"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                />
              </div>
              <Input 
                label="Место работы"
                placeholder="Дизайнер в Яндексе"
                value={job}
                onChange={e => setJob(e.target.value)}
              />
              <Input 
                label="Хобби"
                placeholder="Танцы, йога, чтение"
                value={hobbies}
                onChange={e => setHobbies(e.target.value)}
              />
            </div>
          </GlassCard>
        </div>

        <GlassCard title="История отношений">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textarea 
              label="Наше прошлое"
              placeholder="Как вы познакомились, яркие моменты..."
              className="h-24"
              value={past}
              onChange={e => setPast(e.target.value)}
            />
            <Textarea 
              label="Причина расставания"
              placeholder="Почему всё закончилось?"
              className="h-24"
              value={breakupReason}
              onChange={e => setBreakupReason(e.target.value)}
            />
          </div>
        </GlassCard>

        <GlassCard title="Окружение">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              label="Родственники"
              placeholder="Строгая мама, брат..."
              value={relatives}
              onChange={e => setRelatives(e.target.value)}
            />
            <Input 
              label="Друзья"
              placeholder="Лучшая подруга Катя..."
              value={friends}
              onChange={e => setFriends(e.target.value)}
            />
            <Input 
              label="Привычки"
              placeholder="Курит, любит кофе..."
              value={habits}
              onChange={e => setHabits(e.target.value)}
            />
          </div>
        </GlassCard>

        <Button 
          onClick={handleCreate}
          size="lg"
          className="w-full text-white py-4 rounded-2xl font-bold shadow-lg text-lg"
          style={{ backgroundColor: currentUser ? useStore.getState().themeColor : undefined }}
        >
          Создать xiis
        </Button>
      </div>
    </div>
  );
};
