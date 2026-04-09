import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { Search, Check, Users } from 'lucide-react';

export const CreateGroupPage = () => {
  const { xiis, createGroupChat, themeColor } = useStore();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedXiis, setSelectedXiis] = useState<string[]>([]);

  const filteredXiis = useMemo(() => {
    return xiis.filter(xii => 
      `${xii.firstName} ${xii.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      xii.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [xiis, searchQuery]);

  const toggleXii = (id: string) => {
    if (selectedXiis.includes(id)) {
      setSelectedXiis(selectedXiis.filter(xiiId => xiiId !== id));
    } else {
      setSelectedXiis([...selectedXiis, id]);
    }
  };

  const handleCreate = () => {
    if (groupName && selectedXiis.length > 0) {
      createGroupChat(groupName, selectedXiis);
      navigate('/chats');
    }
  };

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-hidden relative">
      <Header title="Создать группу" showBack />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full pb-32 md:pb-24">
        <GlassCard title="Название группы">
          <Input 
            placeholder="Введите название группы"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            className="text-lg py-4"
          />
        </GlassCard>

        <GlassCard title="Выберите участников">
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

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
                          <span className="text-2xl">{xii.avatar}</span>
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
            onClick={handleCreate}
            disabled={!groupName || selectedXiis.length === 0}
            size="lg"
            className="w-full text-white py-4 rounded-2xl font-bold shadow-xl text-lg transition-all active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: groupName && selectedXiis.length > 0 ? themeColor : undefined }}
          >
            Создать группу ({selectedXiis.length})
          </Button>
        </div>
      </div>
    </div>
  );
};
