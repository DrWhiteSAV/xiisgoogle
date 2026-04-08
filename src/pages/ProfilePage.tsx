import { useStore } from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Bell, Shield, Database, Folder, Smartphone, Zap, Globe, LogOut, Moon, Sun, Ban, VolumeX, Clock, AlertTriangle, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';

import { STOCK_AVATARS_MALE, STOCK_AVATARS_FEMALE } from '../config/constants';
import { X } from 'lucide-react';

export const Profile = () => {
  const { xiiId } = useParams();
  const { currentUser, setCurrentUser, theme, setTheme, logout, xiis, updateXii } = useStore();
  const navigate = useNavigate();
  const [showSpamModal, setShowSpamModal] = useState(false);
  const [spamReason, setSpamReason] = useState('');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const xii = xiis.find(x => x.id === xiiId);
  const isViewingXii = !!xiiId && !!xii;
  const user = isViewingXii ? xii : currentUser;

  if (!user) return null;

  const handleAvatarSelect = (url: string) => {
    if (isViewingXii && xii) {
      updateXii(xii.id, { avatar: url });
    } else if (currentUser) {
      setCurrentUser({ ...currentUser, avatar: url });
    }
    setShowAvatarSelector(false);
  };

  const handleToggleBan = () => {
    if (!xii) return;
    if (xii.isBanned) {
      updateXii(xii.id, { isBanned: false, spamReason: '' });
    } else {
      setShowSpamModal(true);
    }
  };

  const submitSpamReport = () => {
    if (!xii) return;
    updateXii(xii.id, { isBanned: true, spamReason });
    setShowSpamModal(false);
    setSpamReason('');
  };

  const menuItems = isViewingXii ? [
    { 
      icon: VolumeX, 
      label: 'Не писать первой', 
      color: xii.isMuted ? 'bg-red-500' : 'bg-green-500',
      onClick: () => updateXii(xii.id, { isMuted: !xii.isMuted })
    },
    { 
      icon: Clock, 
      label: 'Отключить днем', 
      color: xii.muteDuringDay ? 'bg-orange-500' : 'bg-blue-500',
      onClick: () => updateXii(xii.id, { muteDuringDay: !xii.muteDuringDay })
    },
    { 
      icon: Ban, 
      label: xii.isBanned ? 'Разблокировать' : 'Заблокировать (Бан)', 
      color: 'bg-red-600',
      onClick: handleToggleBan
    },
  ] : [
    { 
      icon: MessageSquare, 
      label: 'Настройки чатов', 
      color: 'bg-blue-500',
      onClick: () => navigate('/chatsettings')
    },
    { icon: Bell, label: 'Уведомления и звуки', color: 'bg-red-500' },
    { icon: Shield, label: 'Конфиденциальность', color: 'bg-gray-500' },
    { icon: Database, label: 'Данные и память', color: 'bg-blue-500' },
    { icon: Folder, label: 'Папки с чатами', color: 'bg-cyan-500' },
    { icon: Smartphone, label: 'Устройства', color: 'bg-orange-500' },
    { icon: Zap, label: 'Энергосбережение', color: 'bg-yellow-500' },
    { icon: Globe, label: 'Язык', color: 'bg-purple-500', value: 'Русский' },
  ];

  const spamReasons = [
    'Навязчивое поведение',
    'Оскорбления',
    'Слишком много сообщений',
    'Не хочу общаться',
    'Другое'
  ];

  const stockAvatars = user.gender === 'female' ? STOCK_AVATARS_FEMALE : STOCK_AVATARS_MALE;

  const themeColors = [
    { name: 'Синий', value: '#3390ec' },
    { name: 'Розовый', value: '#ff4081' },
    { name: 'Зеленый', value: '#4caf50' },
    { name: 'Серый', value: '#8e8e93' },
    { name: 'Фиолетовый', value: '#9c27b0' },
    { name: 'Красный', value: '#f44336' },
  ];

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-y-auto relative">
      <Header 
        title={isViewingXii ? 'Профиль xiis' : 'Мой профиль'} 
        showBack 
        rightElement={!isViewingXii && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
              className="text-red-500 hover:text-red-600"
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
      />

      {/* User Info Card */}
      <div className="flex flex-col items-center border-b border-gray-200 dark:border-gray-800 pb-6">
        <div className="w-full md:w-64 aspect-square md:rounded-2xl md:mt-6 md:shadow-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-7xl relative overflow-hidden shadow-2xl group">
          {user.avatar.startsWith('http') ? (
            <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            user.avatar
          )}
          <div 
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
            onClick={() => setShowAvatarSelector(true)}
          >
            <Camera className="text-white" size={48} />
          </div>
        </div>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-sm text-tg-hint">@{user.username}</p>
          {xii?.isBanned && (
            <span className="mt-2 inline-block px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Заблокирован</span>
          )}
        </div>
      </div>

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-tg-bg w-full max-w-md rounded-[2.5rem] p-6 glass-effect shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Выберите фото</h3>
              <X className="cursor-pointer" onClick={() => setShowAvatarSelector(false)} />
            </div>
            <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
              {stockAvatars.map((url, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleAvatarSelect(url)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:ring-4 ring-tg-light-blue transition-all shadow-md"
                >
                  <img src={url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Details (for User or Xii) */}
      <div className="p-4 space-y-6">
        {!isViewingXii && currentUser && (
          <GlassCard title="Личные данные">
            <div className="space-y-4">
              <Input 
                label="Имя"
                value={currentUser.firstName}
                onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
              />
              <Input 
                label="Фамилия"
                value={currentUser.lastName}
                onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
              />
            </div>
          </GlassCard>
        )}

        {isViewingXii && (
          <GlassCard title="Анкета">
            <div className="space-y-4">
              <Input 
                label="Имя"
                value={xii.firstName}
                onChange={(e) => updateXii(xii.id, { firstName: e.target.value })}
              />
              <Input 
                label="Фамилия"
                value={xii.lastName}
                onChange={(e) => updateXii(xii.id, { lastName: e.target.value })}
              />
              <Textarea 
                label="Характер"
                className="min-h-[80px]"
                value={xii.personality}
                onChange={(e) => updateXii(xii.id, { personality: e.target.value })}
              />
              <Textarea 
                label="Прошлое"
                className="min-h-[80px]"
                value={xii.past || ''}
                onChange={(e) => updateXii(xii.id, { past: e.target.value })}
              />
              <Textarea 
                label="Причина расставания"
                className="min-h-[80px]"
                value={xii.breakupReason || ''}
                onChange={(e) => updateXii(xii.id, { breakupReason: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Город"
                  value={xii.city || ''}
                  onChange={(e) => updateXii(xii.id, { city: e.target.value })}
                />
                <Input 
                  label="Дата рождения"
                  value={xii.birthDate || ''}
                  onChange={(e) => updateXii(xii.id, { birthDate: e.target.value })}
                />
              </div>
              <Input 
                label="Место работы"
                value={xii.job || ''}
                onChange={(e) => updateXii(xii.id, { job: e.target.value })}
              />
              <Input 
                label="Хобби"
                value={xii.hobbies || ''}
                onChange={(e) => updateXii(xii.id, { hobbies: e.target.value })}
              />
              <Input 
                label="Родственники"
                value={xii.relatives || ''}
                onChange={(e) => updateXii(xii.id, { relatives: e.target.value })}
              />
              <Input 
                label="Друзья"
                value={xii.friends || ''}
                onChange={(e) => updateXii(xii.id, { friends: e.target.value })}
              />
              <Input 
                label="Привычки"
                value={xii.habits || ''}
                onChange={(e) => updateXii(xii.id, { habits: e.target.value })}
              />
            </div>
          </GlassCard>
        )}

        {/* Settings List */}
        <GlassCard title={isViewingXii ? 'Управление' : 'Настройки'}>
          <div className="space-y-1">
            {menuItems.map((item, idx) => (
              <div 
                key={idx}
                onClick={item.onClick}
                className="flex items-center gap-4 py-3 selection-highlight cursor-pointer rounded-xl px-2"
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0", item.color)}>
                  <item.icon size={18} />
                </div>
                <div className="flex-1 text-sm font-medium">{item.label}</div>
                {item.value && <div className="text-sm text-tg-hint">{item.value}</div>}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Spam Report Modal */}
      {showSpamModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-tg-bg w-full max-w-md rounded-[2.5rem] p-8 glass-effect shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6 text-red-500">
              <AlertTriangle size={32} />
              <h2 className="text-2xl font-bold">Жалоба на спам</h2>
            </div>
            <p className="text-sm text-tg-hint mb-6">Пожалуйста, укажите причину, по которой вы хотите отключить этого xiis. Это поможет нам улучшить алгоритмы.</p>
            
            <div className="space-y-3 mb-8">
              {spamReasons.map(reason => (
                <div 
                  key={reason}
                  onClick={() => setSpamReason(reason)}
                  className={cn(
                    "p-4 rounded-2xl cursor-pointer border-2 transition-all",
                    spamReason === reason 
                      ? "border-tg-light-blue bg-tg-light-blue/10 text-tg-light-blue" 
                      : "border-transparent bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <span className="text-sm font-medium">{reason}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button 
                variant="secondary"
                onClick={() => setShowSpamModal(false)}
                className="flex-1 py-4 rounded-2xl font-bold"
              >
                Отмена
              </Button>
              <Button 
                variant="primary"
                onClick={submitSpamReport}
                disabled={!spamReason}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-500/30 hover:bg-red-600"
              >
                Заблокировать
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
