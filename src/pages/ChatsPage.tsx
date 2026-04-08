import { useParams, useNavigate } from 'react-router-dom';
import { ChatList, ChatWindow } from '../components/Chat';
import { useStore } from '../store';

export const ChatsPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { setView } = useStore();

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar for Desktop / List for Mobile */}
      <div className={`${chatId ? 'hidden md:flex' : 'flex'} h-full`}>
        <ChatList 
          activeChatId={chatId} 
          onSelectChat={(id) => navigate(`/chats/${id}`)} 
        />
      </div>

      {/* Chat Window */}
      <div className={`${chatId ? 'flex' : 'hidden md:flex'} flex-1 h-full`}>
        {chatId ? (
          <ChatWindow 
            chatId={chatId} 
            onBack={() => navigate('/chats')} 
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-tg-hint bg-transparent glass-effect m-2 radial-round">
            Выберите чат, чтобы начать общение
          </div>
        )}
      </div>
    </div>
  );
};
