import { useStore } from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Info, Users, Share2, MoreVertical } from 'lucide-react';
import { BackgroundPattern } from '../components/BackgroundPattern';
import { cn } from '../lib/utils';

export const ChannelInfoPage = () => {
  const { chatId } = useParams();
  const { chats, themeColor } = useStore();
  const navigate = useNavigate();

  const chat = chats.find(c => c.id === chatId);

  if (!chat) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-transparent text-tg-text overflow-hidden relative">
      <BackgroundPattern />
      
      {/* Floating Header Blocks */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center gap-2 z-40 pointer-events-none">
        <div 
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full glass-effect flex items-center justify-center shrink-0 pointer-events-auto cursor-pointer shadow-lg hover:scale-105 transition-transform active:scale-95"
        >
          <ArrowLeft size={20} className="text-tg-hint" />
        </div>
        <div className="flex-1 glass-effect rounded-2xl px-4 py-2 shadow-lg pointer-events-auto min-w-0 flex items-center h-11">
          <div className="text-sm font-bold truncate">Информация о канале</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-20 pb-10 px-4 space-y-4">
        {/* Profile Card */}
        <div className="glass-effect rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-xl">
          <div className="w-64 h-64 rounded-full flex items-center justify-center text-5xl mb-6 overflow-hidden">
            {chat.avatar && chat.avatar.startsWith('http') ? (
              <img src={chat.avatar} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <img src="https://i.ibb.co/Fqzm0ckJ/xiislogo.png" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{chat.id === 'channel-news' ? 'Стенка БывшИИ' : chat.name}</h1>
          <div className="text-tg-light-blue font-medium text-sm mb-6">
            {chat.type === 'channel' ? 'Стенка' : 'Группа'} • {chat.participants.length || 1234} подписчиков
          </div>
          
          <div className="flex gap-4 w-full">
            <button className="flex-1 py-3 glass-effect rounded-2xl flex flex-col items-center gap-1 hover:bg-white/10 transition-colors">
              <Bell size={20} className="text-tg-light-blue" />
              <span className="text-[10px] font-medium">Уведомления</span>
            </button>
            <button className="flex-1 py-3 glass-effect rounded-2xl flex flex-col items-center gap-1 hover:bg-white/10 transition-colors">
              <Share2 size={20} className="text-tg-light-blue" />
              <span className="text-[10px] font-medium">Поделиться</span>
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="glass-effect rounded-[2rem] overflow-hidden shadow-lg">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <Info size={18} className="text-tg-hint" />
              <span className="text-sm font-bold">Описание</span>
            </div>
            <p className="text-sm text-tg-hint leading-relaxed">
              {chat.id === 'channel-news' 
                ? 'Дуров вернул стенку! Здесь можно писать всё, что угодно. Но помните: наш ИИ-модератор не дремлет и зорко следит за порядком. Пишите креативно, а не токсично!'
                : (chat.description || 'Официальный канал. Здесь публикуются самые свежие новости и обновления.')}
            </p>
          </div>
          
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-tg-hint" />
              <span className="text-sm font-bold">Подписчики</span>
            </div>
            <span className="text-sm text-tg-light-blue font-medium">{chat.participants.length || 1234}</span>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-tg-hint" />
              <span className="text-sm font-bold">Безопасность</span>
            </div>
            <span className="text-xs text-green-500 font-medium">Проверено</span>
          </div>
        </div>

        {/* Media Section Placeholder */}
        <div className="glass-effect rounded-[2rem] p-5 shadow-lg">
          <h3 className="text-sm font-bold mb-4">Медиа, ссылки и файлы</h3>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square rounded-xl bg-black/10 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="w-full py-4 bg-tg-light-blue text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-tg-blue transition-colors"
        >
          Вернуться к чату
        </button>
      </div>
    </div>
  );
};
