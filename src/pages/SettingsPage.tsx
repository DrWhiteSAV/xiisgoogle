import { useStore } from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Camera, Bell, Shield, Database, Folder, Smartphone, Zap, Globe, 
  LogOut, Moon, Sun, Ban, VolumeX, Clock, AlertTriangle, Trash2, 
  MessageSquare, Check, ArrowLeft
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { AvatarSelector } from '../components/AvatarSelector';
import { STOCK_AVATARS_MALE, STOCK_AVATARS_FEMALE } from '../config/constants';
import { Gender } from '../types';

export const SettingsPage = () => {
  const { xiiId } = useParams();
  const { 
    currentUser, setCurrentUser, 
    theme, setTheme, 
    themeColor, setThemeColor, 
    blurIntensity, setBlurIntensity, 
    bgBlurIntensity, setBgBlurIntensity,
    glassOpacity, setGlassOpacity,
    glassMix, setGlassMix,
    bgIcons, setBgIcons,
    bgSettings, updateBgSettings,
    logout, xiis, updateXii 
  } = useStore();
  const navigate = useNavigate();

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

  const xii = xiis.find(x => x.id === xiiId);
  const isViewingXii = !!xiiId && !!xii;
  
  const user = isViewingXii ? xii : currentUser;

  if (!user) return null;

  const handleToggleBan = () => {
    if (!xii) return;
    if (xii.isBanned) {
      updateXii(xii.id, { isBanned: false, spamReason: '' });
    } else {
      navigate(`/settings/${xii.id}/spam-report`);
    }
  };

  const availableIcons = [
    'Heart', 'HeartCrack', 'Gem', 'Dna', 'Wine', 'GlassWater', 'Gift', 'Trophy', 
    'Gamepad2', 'Guitar', 'Puzzle', 'Headphones', 'Mic', 'Smile', 'Coins', 'Lock', 
    'Ghost', 'Trash2', 'CloudRain', 'Frown', 'Skull', 'Bot', 'Gamepad', 'Star', 
    'Sparkles', 'Sun', 'Cloud', 'Snowflake', 'Zap', 'Moon', 'Flower', 'Flame', 
    'Sprout', 'Clover', 'Bug', 'PiggyBank', 'Flower2', 'Hourglass', 'Wrench', 'Music'
  ];

  const toggleIcon = (iconName: string) => {
    if (bgIcons.includes(iconName)) {
      setBgIcons(bgIcons.filter(name => name !== iconName));
    } else {
      setBgIcons([...bgIcons, iconName]);
    }
  };

  const menuItems = isViewingXii ? [
    { 
      icon: VolumeX, 
      label: xii.isMuted 
        ? (xii.gender === 'female' ? 'Писать первой' : 'Писать первым')
        : (xii.gender === 'female' ? 'Не писать первой' : 'Не писать первым'), 
      color: xii.isMuted ? 'bg-red-500' : 'bg-green-500',
      onClick: () => updateXii(xii.id, { isMuted: !xii.isMuted })
    },
    { 
      icon: Clock, 
      label: xii.muteNightSms ? 'Включить ночные СМС' : 'Отключить ночные СМС', 
      color: xii.muteNightSms ? 'bg-orange-500' : 'bg-blue-500',
      onClick: () => updateXii(xii.id, { muteNightSms: !xii.muteNightSms })
    },
    { 
      icon: Ban, 
      label: xii.isBanned ? 'Разблокировать' : 'Заблокировать (Бан)', 
      color: 'bg-red-600',
      onClick: handleToggleBan
    },
  ] : [
    { icon: Bell, label: 'Уведомления и звуки', color: 'bg-red-500' },
    { icon: Shield, label: 'Конфиденциальность', color: 'bg-gray-500' },
    { icon: Database, label: 'Данные и память', color: 'bg-blue-500' },
    { icon: Folder, label: 'Папки с чатами', color: 'bg-cyan-500' },
    { icon: Smartphone, label: 'Устройства', color: 'bg-orange-500' },
    { icon: Zap, label: 'Энергосбережение', color: 'bg-yellow-500' },
    { icon: Globe, label: 'Язык', color: 'bg-purple-500', value: 'Русский' },
  ];

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-y-auto relative">
      <div className="pb-32 md:pb-10">
        <Header 
        title={isViewingXii ? 'Профиль xiis' : 'Настройки'} 
        showBack 
        rightElement={!isViewingXii && (
          <div className="flex items-center gap-2">
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
      <div className="flex flex-col items-center border-b border-gray-200 dark:border-gray-800 pb-6 pt-6">
        <AvatarSelector 
          gender={user.gender}
          avatar={user.avatar}
          onGenderChange={(gender) => {
            if (isViewingXii && xii) {
              updateXii(xii.id, { gender });
            } else if (currentUser) {
              setCurrentUser({ ...currentUser, gender });
            }
          }}
          onAvatarChange={(avatar) => {
            if (isViewingXii && xii) {
              updateXii(xii.id, { avatar });
            } else if (currentUser) {
              setCurrentUser({ ...currentUser, avatar });
            }
          }}
        />
        {isViewingXii && xii && (
          <div className="mt-2 text-center">
            <div className="text-xs text-tg-hint font-mono">@{xii.username}</div>
            {xii.isBanned && (
              <div className="mt-2">
                <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Заблокирован</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 space-y-8">
        {isViewingXii && (
          <GlassCard title="Управление">
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
        )}
        {/* Profile Details */}
        {!isViewingXii && currentUser && (
          <GlassCard title="Личные данные">
            <div className="space-y-4">
              <Input 
                label="Имя"
                value={currentUser.firstName}
                onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
              />

              <Textarea 
                label="О себе"
                placeholder="Расскажите немного о себе..."
                className="h-24"
                value={currentUser.description || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, description: e.target.value })}
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

        {/* Theme and Icons Row (Only for current user) */}
        {!isViewingXii && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <GlassCard title="Иконки фона">
              <div className="grid grid-cols-8 gap-1 sm:gap-2">
                {availableIcons.map((iconName) => {
                  const Icon = (LucideIcons as any)[iconName];
                  const isSelected = bgIcons.includes(iconName);
                  return (
                    <div 
                      key={iconName}
                      onClick={() => toggleIcon(iconName)}
                      className={cn(
                        "aspect-square rounded-full flex items-center justify-center cursor-pointer transition-all border-2",
                        isSelected 
                          ? "shadow-sm" 
                          : "border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                      style={{ 
                        borderColor: isSelected ? themeColor : 'transparent',
                        color: themeColor
                      }}
                    >
                      {Icon && <Icon size={18} strokeWidth={isSelected ? 2.5 : 1.5} />}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-tg-hint mt-4 text-center uppercase font-bold tracking-wider">
                Выберите иконки для заполнения фона
              </p>
            </GlassCard>
          </div>
        )}

        {!isViewingXii && (
          <>
            <GlassCard title="Интенсивность размытия">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-bold text-tg-hint uppercase">Размытие блоков</span>
                    <span className="text-xs font-mono text-tg-hint">{blurIntensity}%</span>
                  </div>
                  <div className="py-4 px-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
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
                    <span className="text-xs font-mono text-tg-hint">{bgBlurIntensity}%</span>
                  </div>
                  <div className="py-4 px-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="1"
                      value={bgBlurIntensity}
                      onChange={(e) => setBgBlurIntensity(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-bold text-tg-hint uppercase">Прозрачность блоков</span>
                    <span className="text-xs font-mono text-tg-hint">{glassOpacity}%</span>
                  </div>
                  <div className="py-4 px-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="1"
                      value={glassOpacity}
                      onChange={(e) => setGlassOpacity(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-bold text-tg-hint uppercase">Насыщенность цвета</span>
                    <span className="text-xs font-mono text-tg-hint">{100 - glassMix}%</span>
                  </div>
                  <div className="py-4 px-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="1"
                      value={100 - glassMix}
                      onChange={(e) => setGlassMix(100 - parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard title="Плотность и размер иконок">
              <div className="space-y-8">
                {(Object.keys(bgSettings) as Array<keyof typeof bgSettings>).map((device) => {
                  const labels: Record<string, string> = {
                    pc: 'ПК Версия',
                    tabletPortrait: 'Планшет (Портрет)',
                    tabletLandscape: 'Планшет (Ландшафт)',
                    mobilePortrait: 'Мобильный (Портрет)',
                    mobileLandscape: 'Мобильный (Ландшафт)'
                  };
                  
                  const settings = bgSettings[device];
                  
                  return (
                    <div key={device} className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone size={16} className="text-tg-light-blue" />
                        <span className="text-xs font-bold text-tg-hint uppercase tracking-wider">{labels[device]}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[10px] font-bold text-tg-hint uppercase">Ширина (Кол-во)</span>
                            <span className="text-xs font-mono text-tg-hint">{settings.cols}</span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={settings.cols}
                            onChange={(e) => updateBgSettings(device, { cols: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[10px] font-bold text-tg-hint uppercase">Высота (Кол-во)</span>
                            <span className="text-xs font-mono text-tg-hint">{settings.rows}</span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={settings.rows}
                            onChange={(e) => updateBgSettings(device, { rows: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[10px] font-bold text-tg-hint uppercase">Мин. размер</span>
                            <span className="text-xs font-mono text-tg-hint">{settings.minSize}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="5" 
                            max="100" 
                            value={settings.minSize}
                            onChange={(e) => updateBgSettings(device, { minSize: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[10px] font-bold text-tg-hint uppercase">Макс. размер</span>
                            <span className="text-xs font-mono text-tg-hint">{settings.maxSize}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="5" 
                            max="100" 
                            value={settings.maxSize}
                            onChange={(e) => updateBgSettings(device, { maxSize: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tg-light-blue"
                          />
                        </div>
                      </div>
                      {device !== 'mobileLandscape' && <div className="h-px bg-gray-100 dark:bg-gray-800 mt-6" />}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </>
        )}

        {!isViewingXii && (
          <section>
            <Button 
              variant="danger"
              className="w-full p-4 font-bold flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Сбросить все настройки
            </Button>
          </section>
        )}
      </div>

      </div>
    </div>
  );
};
