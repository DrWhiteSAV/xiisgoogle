import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Check, Users, ArrowLeft } from 'lucide-react';

export const AddParticipantsPage = () => {
  const { chatId } = useParams();
  const { xiis, chats, addParticipantToChat, themeColor } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedXiis, setSelectedXiis] = useState<string[]>([]);

  const chat = chats.find(c => c.id === chatId);

  const availableXiis = useMemo(() => {
    if (!chat) return [];
    return xiis.filter(xii => !chat.participants.includes(xii.id));
  }, [xiis, chat]);

  const filteredXiis = useMemo(() => {
    return availableXiis.filter(xii => 
      `${xii.firstName} ${xii.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      xii.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableXiis, searchQuery]);

  const toggleXii = (id: string) => {
    if (selectedXiis.includes(id)) {
      setSelectedXiis(selectedXiis.filter(xiiId => xiiId !== id));
    } else {
      setSelectedXiis([...selectedXiis, id]);
    }
  };

  const handleAdd = () => {
    if (chat && selectedXiis.length > 0) {
      selectedXiis.forEach(id => addParticipantToChat(chat.id, id));
      navigate(-1);
    }
  };

  if (!chat || chat.type !== 'group') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-lg opacity-60 mb-4">Группа не найдена</p>
        <Button onClick={() => navigate('/chats')}>Вернуться к чатам</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-hidden relative">
      <div className="p-4 flex items-center gap-3 relative z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 glass-effect rounded-full text-tg-text"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 glass-effect rounded-2xl px-4 py-2 flex justify-between items-center">
          <h2 className="text-lg font-bold truncate">Добавить участников</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full pb-32 md:pb-24">
        <GlassCard title="Выберите Xii">
          <div className="space-y-4">
            <div className="relative">
              <Input 
                placeholder="Поиск xiis..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint" size={18} />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredXiis.length > 0 ? (
                filteredXiis.map(xii => {
                  const isSelected = selectedXiis.includes(xii.id);
                  return (
                    <div 
                      key={xii.id}
                      onClick={() => toggleXii(xii.id)}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border-2",
                        isSelected 
                          ? "border-tg-light-blue bg-tg-light-blue/10" 
                          : "border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {xii.avatar.startsWith('http') ? (
                          <img src={xii.avatar} alt={xii.firstName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <img src="https://i.ibb.co/Fqzm0ckJ/xiislogo.png" alt={xii.firstName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{xii.firstName} {xii.lastName}</div>
                        <div className="text-xs text-tg-hint truncate">@{xii.username}</div>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-tg-light-blue border-tg-light-blue text-white" : "border-gray-300 dark:border-gray-600"
                      )}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-tg-hint">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Никого не нашли</p>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="absolute bottom-24 md:bottom-6 left-0 right-0 px-6 max-w-2xl mx-auto z-40 pointer-events-none">
        <div className="pointer-events-auto">
          <Button 
            onClick={handleAdd}
            disabled={selectedXiis.length === 0}
            size="lg"
            className="w-full text-white py-4 rounded-2xl font-bold shadow-xl text-lg transition-all active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: selectedXiis.length > 0 ? themeColor : undefined }}
          >
            Добавить ({selectedXiis.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
