import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Camera, UserPlus, UserMinus, Trash2, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const GroupInfoPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { chats, xiis, currentUser, updateChat, deleteChat, addParticipantToChat, removeXiiFromGroup } = useStore();
  
  const chat = useStore(state => state.chats.find(c => c.id === chatId));
  
  const [name, setName] = useState(chat?.name || '');
  const [avatar, setAvatar] = useState(chat?.avatar || 'https://i.ibb.co/Fqzm0ckJ/xiislogo.png');
  const [description, setDescription] = useState(chat?.description || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!chat || chat.type !== 'group') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-lg opacity-60 mb-4">Группа не найдена</p>
        <Button onClick={() => navigate('/chats')}>Вернуться к чатам</Button>
      </div>
    );
  }

  const participants = chat.participants.map(id => {
    if (id === currentUser?.id) return { id, firstName: 'Вы', avatar: currentUser.avatar || '👤' };
    return xiis.find(x => x.id === id) || { id, firstName: 'Xii', avatar: '👤' };
  });

  const handleSave = () => {
    updateChat(chat.id, { name, avatar, description });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу? Все сообщения будут удалены.')) {
      deleteChat(chat.id);
      navigate('/chats');
    }
  };

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
        <div className="flex-1 glass-effect rounded-2xl px-4 py-2 flex justify-between items-center">
          <h2 className="text-lg font-bold truncate">Настройки группы</h2>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-full transition-colors">
                  <Save size={20} />
                </button>
                <button onClick={() => setIsEditing(false)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="text-tg-light-blue text-sm font-medium">
                Изм.
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6 relative z-20">
        {/* Profile Info */}
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full glass-effect flex items-center justify-center text-4xl overflow-hidden border-4 border-white/10 shadow-2xl">
              {avatar.startsWith('http') ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                avatar
              )}
            </div>
            {isEditing && (
              <div 
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  const newAvatar = window.prompt('Введите URL аватарки:', avatar);
                  if (newAvatar) setAvatar(newAvatar);
                }}
              >
                <Camera className="text-white" size={32} />
              </div>
            )}
          </div>

          <div className="w-full space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Название группы"
                  className="text-center font-bold text-xl"
                />
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Описание группы"
                  className="w-full glass-effect rounded-2xl p-4 text-sm outline-none resize-none h-24 border border-white/10"
                />
              </div>
            ) : (
              <div className="text-center">
                <h1 className="text-2xl font-bold">{chat.name}</h1>
                <p className="text-sm opacity-60 mt-2">{chat.description || 'Нет описания'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Participants Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-60">Участники ({chat.participants.length})</h3>
            <button 
              onClick={() => navigate(`/chats/${chat.id}/add-participants`)}
              className="flex items-center gap-1 text-xs font-bold text-tg-light-blue hover:underline"
            >
              <UserPlus size={14} />
              Добавить
            </button>
          </div>

          <div className="space-y-2">
            {participants.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 glass-effect rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-lg overflow-hidden shrink-0">
                  {p.avatar.startsWith('http') ? (
                    <img src={p.avatar} alt={p.firstName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    p.avatar
                  )}
                </div>
                <div className="flex-1 font-medium truncate">{p.firstName}</div>
                {p.id !== currentUser?.id && (
                  <button 
                    onClick={() => removeXiiFromGroup(chat.id, p.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <UserMinus size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6">
          <button 
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 p-4 glass-effect rounded-2xl text-red-500 font-bold border border-red-500/20 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={20} />
            Удалить группу
          </button>
        </div>
      </div>

    </div>
  );
};
