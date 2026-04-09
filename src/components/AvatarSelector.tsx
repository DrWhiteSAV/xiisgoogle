import { Gender } from '../types';
import { STOCK_AVATARS_MALE, STOCK_AVATARS_FEMALE } from '../config/constants';
import { cn } from '../lib/utils';
import { Camera, Check } from 'lucide-react';
import { useStore } from '../store';

interface AvatarSelectorProps {
  gender: Gender;
  avatar: string;
  onGenderChange: (gender: Gender) => void;
  onAvatarChange: (avatar: string) => void;
  className?: string;
}

export const AvatarSelector = ({ 
  gender, 
  avatar, 
  onGenderChange, 
  onAvatarChange,
  className 
}: AvatarSelectorProps) => {
  const avatars = gender === 'male' ? STOCK_AVATARS_MALE : STOCK_AVATARS_FEMALE;
  const { themeColor } = useStore();

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div 
        className="w-48 h-48 rounded-3xl flex items-center justify-center relative shadow-2xl overflow-hidden glass-effect border-4"
        style={{ borderColor: `${themeColor}33` }} // 33 is ~20% opacity in hex
      >
        {avatar.startsWith('http') ? (
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="text-7xl">{avatar}</div>
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
          <Camera size={32} className="text-white" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex gap-2 p-1 rounded-xl input-glass w-[90%] sm:w-full max-w-md">
          <button 
            onClick={() => { 
              onGenderChange('male'); 
              if (!STOCK_AVATARS_MALE.includes(avatar)) {
                onAvatarChange(STOCK_AVATARS_MALE[0]);
              }
            }}
            className={cn(
              "theme-button",
              gender === 'male' && "active"
            )}
          >
            Мужчина
          </button>
          <button 
            onClick={() => { 
              onGenderChange('female'); 
              if (!STOCK_AVATARS_FEMALE.includes(avatar)) {
                onAvatarChange(STOCK_AVATARS_FEMALE[0]);
              }
            }}
            className={cn(
              "theme-button",
              gender === 'female' && "active"
            )}
          >
            Женщина
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 w-[90%] sm:w-full max-w-md">
          {avatars.map(url => (
            <div 
              key={url} 
              onClick={() => onAvatarChange(url)}
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
  );
};
