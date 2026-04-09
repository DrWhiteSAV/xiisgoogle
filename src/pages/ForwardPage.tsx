import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Search, ArrowLeft, Send, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Message } from '../types';

export const ForwardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chats, currentUser, addMessage } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  
  const messageToForward = location.state?.message as Message | undefined;

  const filteredChats = useMemo(() => {
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  const toggleChatSelection = (chatId: string) => {
    setSelectedChatIds(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId) 
        : [...prev, chatId]
    );
  };

  const handleForward = () => {
    if (selectedChatIds.length === 0 || !currentUser || !messageToForward) return;

    selectedChatIds.forEach(chatId => {
      const newMsg: Message = {
        id: `fwd-${Date.now()}-${Math.random()}`,
        senderId: currentUser.id,
        text: messageToForward.text,
        timestamp: Date.now(),
        forwardedFromId: messageToForward.senderId,
      };
      addMessage(chatId, newMsg);
    });

    // Navigate to the first selected chat or back to where we came from
    if (selectedChatIds.length === 1) {
      navigate(`/chats/${selectedChatIds[0]}`);
    } else {
      navigate('/chats');
    }
  };

  if (!messageToForward) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-lg opacity-60 mb-4">Сообщение не найдено</p>
        <button 
          onClick={() => navigate('/chats')}
          className="px-6 py-2 bg-tg-light-blue text-white rounded-xl"
        >
          Вернуться к чатам
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent w-full relative overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 relative z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 glass-effect rounded-full text-tg-text"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 glass-effect rounded-2xl px-4 py-2">
          <h2 className="text-lg font-bold">Переслать</h2>
          <p className="text-xs opacity-60">
            {selectedChatIds.length > 0 
              ? `Выбрано: ${selectedChatIds.length}` 
              : 'Выберите получателей'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4 relative z-20">
        <div className="relative">
          <input 
            type="text"
            placeholder="Поиск получателей..."
            className="w-full pl-10 pr-4 py-3 glass-effect rounded-2xl bg-white/10 dark:bg-black/10 outline-none border border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint" size={18} />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-24 relative z-20">
        {filteredChats.map(chat => {
          const isSelected = selectedChatIds.includes(chat.id);
          return (
            <div 
              key={chat.id}
              onClick={() => toggleChatSelection(chat.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200",
                isSelected ? "bg-tg-light-blue/20 ring-1 ring-tg-light-blue" : "glass-effect hover:bg-white/5"
              )}
            >
              <div className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-xl overflow-hidden shrink-0">
                {chat.avatar && chat.avatar.startsWith('http') ? (
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <img src="https://i.ibb.co/Fqzm0ckJ/xiislogo.png" alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{chat.name}</div>
                <div className="text-xs opacity-60 truncate">
                  {chat.type === 'channel' ? 'Канал' : chat.type === 'group' ? 'Группа' : 'Личный чат'}
                </div>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                isSelected ? "bg-tg-light-blue border-tg-light-blue" : "border-white/20"
              )}>
                {isSelected && <Check size={14} className="text-white" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Send Button */}
      {selectedChatIds.length > 0 && (
        <div className="absolute bottom-6 right-6 z-30">
          <button 
            onClick={handleForward}
            className="w-14 h-14 bg-tg-light-blue text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          >
            <Send size={24} />
          </button>
        </div>
      )}
    </div>
  );
};
