import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Gender, Xii } from '../types/index';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { AvatarSelector } from '../components/AvatarSelector';
import { STOCK_AVATARS_FEMALE } from '../config/constants';
import { VolumeX, Clock } from 'lucide-react';

const transliterate = (text: string) => {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text.toLowerCase().split('').map(char => map[char] || char).join('').replace(/[^a-z0-9]/g, '');
};

export const CreateXii = () => {
  const { currentUser, addXii, themeColor } = useStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [personality, setPersonality] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [avatar, setAvatar] = useState(STOCK_AVATARS_FEMALE[0]);
  
  // Management fields
  const [isMuted, setIsMuted] = useState(false);
  const [muteNightSms, setMuteNightSms] = useState(false);
  
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

  const handleCreate = () => {
    if (!firstName || !currentUser) return;

    const username = transliterate(firstName);

    const newXii: Xii = {
      id: `xii-${Date.now()}`,
      firstName,
      lastName: lastName || undefined,
      username: username || `xii_${Date.now()}`,
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
      isMuted,
      muteNightSms,
    };

    addXii(newXii);
    navigate('/chats');
  };

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-y-auto">
      <Header title="Создать xiis" showBack />
      
      <div className="p-6 space-y-8 max-w-2xl mx-auto w-full pb-32 md:pb-20">
        <GlassCard>
          <AvatarSelector 
            gender={gender}
            avatar={avatar}
            onGenderChange={setGender}
            onAvatarChange={setAvatar}
          />
        </GlassCard>

        <GlassCard title="Управление">
          <div className="space-y-1">
            <div 
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-4 py-3 selection-highlight cursor-pointer rounded-xl px-2"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0", isMuted ? 'bg-red-500' : 'bg-green-500')}>
                <VolumeX size={18} />
              </div>
              <div className="flex-1 text-sm font-medium">
                {isMuted 
                  ? (gender === 'female' ? 'Писать первой' : 'Писать первым')
                  : (gender === 'female' ? 'Не писать первой' : 'Не писать первым')}
              </div>
            </div>
            <div 
              onClick={() => setMuteNightSms(!muteNightSms)}
              className="flex items-center gap-4 py-3 selection-highlight cursor-pointer rounded-xl px-2"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0", muteNightSms ? 'bg-orange-500' : 'bg-blue-500')}>
                <Clock size={18} />
              </div>
              <div className="flex-1 text-sm font-medium">
                {muteNightSms ? 'Включить ночные СМС' : 'Отключить ночные СМС'}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard title="Основное">
            <div className="space-y-4">
              <Input 
                label="Имя (обязательно)"
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
