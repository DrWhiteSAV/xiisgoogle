import { Search, Menu, MoreVertical, Send, Mic, Paperclip, Smile, Share2, Reply, MessageSquare, Settings, X, Plus } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { Message, Chat, Xii } from '../types/index';
import { format } from 'date-fns';
import { generateXiiResponse } from '../services/geminiService';
import { EMOJI_LIST } from '../config/constants';
import { Header } from './ui/Header';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const ChatList = ({ onSelectChat, activeChatId }: { onSelectChat: (id: string) => void, activeChatId?: string }) => {
  const { chats, xiis, createGroupChat } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [selectedForGroup, setSelectedForGroup] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  const filteredChats = useMemo(() => {
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  const handleCreateGroup = () => {
    if (groupName && selectedForGroup.length > 0) {
      createGroupChat(groupName, selectedForGroup);
      setShowGroupCreate(false);
      setGroupName('');
      setSelectedForGroup([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent border-r border-gray-200 dark:border-gray-800 w-full md:w-80 lg:w-96 glass-effect chat-list-bg relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-tg-chat-bg opacity-10 dark:opacity-0 z-0" />
      <div className="absolute inset-0 flex items-center justify-center z-1 pointer-events-none opacity-20">
        <img src="https://i.ibb.co/8DVMSjvq/xiislogofull.png" alt="Logo" className="w-64 h-64 object-contain" />
      </div>

      <div className="p-4 flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <Menu className="text-gray-500 cursor-pointer" onClick={() => navigate('/profile')} />
          <Input 
            placeholder="Поиск" 
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Plus 
            className="text-tg-light-blue cursor-pointer hover:scale-110 transition-transform block" 
            size={24} 
            onClick={() => setShowGroupCreate(true)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto relative z-10">
        {filteredChats.map((chat) => {
          const lastMsg = chat.lastMessage;
          const xii = xiis.find(x => `private-${x.id}` === chat.id);
          const isBanned = xii?.isBanned;

          return (
            <div 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-100/10 dark:border-gray-800/10 backdrop-blur-[2px] hover:bg-white/20 dark:hover:bg-white/5",
                activeChatId === chat.id && "bg-white/30 dark:bg-white/10",
                isBanned && "opacity-60"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden shrink-0">
                {chat.avatar.startsWith('http') ? (
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-2xl">{chat.avatar}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-sm truncate flex items-center gap-2">
                    {chat.name}
                    {isBanned && <span className="text-[8px] bg-red-500 text-white px-1 rounded uppercase">Бан</span>}
                  </h4>
                  {lastMsg && <span className="text-[10px] text-tg-hint shrink-0">{format(lastMsg.timestamp, 'HH:mm')}</span>}
                </div>
                <p className="text-xs text-tg-hint truncate">
                  {lastMsg ? lastMsg.text : chat.description || 'Нет сообщений'}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="bg-tg-light-blue text-white text-[10px] rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center shrink-0">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Group Creation Modal */}
      {showGroupCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-tg-bg w-full max-w-md rounded-3xl p-6 glass-effect">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Создать группу</h2>
              <X className="cursor-pointer" onClick={() => setShowGroupCreate(false)} />
            </div>
            <Input 
              placeholder="Название группы" 
              className="mb-4"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto mb-6 space-y-2">
              {xiis.map(xii => (
                <div 
                  key={xii.id} 
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors",
                    selectedForGroup.includes(xii.id) ? "bg-tg-light-blue/20" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => {
                    if (selectedForGroup.includes(xii.id)) {
                      setSelectedForGroup(selectedForGroup.filter(id => id !== xii.id));
                    } else {
                      setSelectedForGroup([...selectedForGroup, xii.id]);
                    }
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden">
                    {xii.avatar.startsWith('http') ? (
                      <img src={xii.avatar} alt={xii.firstName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-xl">{xii.avatar}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{xii.firstName} {xii.lastName}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleCreateGroup}
              disabled={!groupName || selectedForGroup.length === 0}
              className="w-full py-3 font-bold"
            >
              Создать
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden flex justify-around p-3 border-t border-gray-200 dark:border-gray-800 bg-tg-bg">
        <div className="flex flex-col items-center gap-1 text-tg-light-blue cursor-pointer" onClick={() => navigate('/chats')}>
          <MessageSquare size={20} />
          <span className="text-[10px]">Чаты</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-tg-hint cursor-pointer" onClick={() => navigate('/profile')}>
          <Settings size={20} />
          <span className="text-[10px]">Настройки</span>
        </div>
      </div>
    </div>
  );
};

export const ChatWindow = ({ chatId, onBack }: { chatId: string, onBack?: () => void }) => {
  const { chats, messages, addMessage, currentUser, xiis, markAsRead, removeXiiFromGroup } = useStore();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [chatSearch, setChatSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  
  // New states for Reply and Share
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [sharingMessage, setSharingMessage] = useState<Message | null>(null);
  const [isForwarding, setIsForwarding] = useState(false);
  
  const chat = chats.find(c => c.id === chatId);
  const xii = xiis.find(x => `private-${x.id}` === chatId);
  const isBanned = xii?.isBanned;

  const chatMessages = useMemo(() => {
    const allMsgs = messages[chatId] || [];
    if (!chatSearch) return allMsgs;
    return allMsgs.filter(m => m.text.toLowerCase().includes(chatSearch.toLowerCase()));
  }, [messages, chatId, chatSearch]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    markAsRead(chatId);
  }, [chatId, chatMessages.length]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 15 * 20; // Approx 15 lines
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
      textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [inputText]);

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser || isBanned) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: Date.now(),
      replyToId: replyingTo?.id,
    };

    addMessage(chatId, userMsg);
    setInputText('');
    setReplyingTo(null);

    // Logic for Xii response
    if (chat?.type === 'private') {
      const xiiId = chat.participants.find(id => id !== currentUser.id);
      const xii = xiis.find(x => x.id === xiiId);
      if (xii && !xii.isBanned) {
        // Count consecutive messages from Xii
        let consecutiveXiiCount = 0;
        const allMessages = messages[chatId] || [];
        for (let i = allMessages.length - 1; i >= 0; i--) {
          if (allMessages[i].senderId === xii.id) {
            consecutiveXiiCount++;
          } else {
            break;
          }
        }

        if (consecutiveXiiCount < 3) {
          const responseText = await generateXiiResponse(xii, allMessages, inputText, currentUser);
          const xiiMsg: Message = {
            id: (Date.now() + 1).toString(),
            senderId: xii.id,
            text: responseText,
            timestamp: Date.now(),
          };
          setTimeout(() => addMessage(chatId, xiiMsg), 1000);
        }
      }
    } else if (chat?.type === 'group') {
      // Handle group chat logic (mentions, etc.)
      const mentioned = inputText.includes('@');
      if (mentioned) {
        const handle = inputText.split('@')[1]?.split(' ')[0];
        const xii = xiis.find(x => x.username === handle);
        if (xii && !xii.isBanned && currentUser) {
           const responseText = await generateXiiResponse(xii, messages[chatId] || [], inputText, currentUser);
           const xiiMsg: Message = {
            id: (Date.now() + 1).toString(),
            senderId: xii.id,
            text: responseText,
            timestamp: Date.now(),
          };
          setTimeout(() => addMessage(chatId, xiiMsg), 1500);
        }
      }
    }
  };

  const handleForward = (targetChatId: string) => {
    if (!sharingMessage || !currentUser) return;
    
    setIsForwarding(true);
    
    const forwardedMsg: Message = {
      id: `fwd-${Date.now()}`,
      senderId: currentUser.id,
      text: sharingMessage.text,
      timestamp: Date.now(),
      forwardedFromId: sharingMessage.senderId,
    };

    // Simulate process
    setTimeout(() => {
      addMessage(targetChatId, forwardedMsg);
      setIsForwarding(false);
      setSharingMessage(null);
    }, 1000);
  };

  const handleHeaderClick = () => {
    if (chat?.type === 'private') {
      const xiiId = chat.participants.find(id => id !== currentUser?.id);
      if (xiiId) {
        navigate(`/profile/${xiiId}`);
      }
    } else if (chat?.type === 'group') {
      setShowParticipants(!showParticipants);
    } else if (chat?.type === 'channel') {
      setShowChannelInfo(true);
    }
  };

  if (!chat) return <div className="flex-1 flex items-center justify-center text-gray-400">Выберите чат</div>;

  return (
    <div className="flex-1 h-full bg-transparent tg-chat-bg relative overflow-y-auto scroll-smooth" ref={scrollRef}>
      {/* Channel Info Modal */}
      {showChannelInfo && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-tg-bg w-full max-w-md rounded-[2.5rem] p-8 glass-effect shadow-2xl border border-white/20 flex flex-col items-center text-center">
            <div className="flex justify-between w-full mb-6">
              <h3 className="font-bold text-xl">О канале</h3>
              <X className="cursor-pointer" onClick={() => setShowChannelInfo(false)} />
            </div>
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl mb-6 ring-4 ring-white/20">
              <img src="https://i.ibb.co/8DVMSjvq/xiislogofull.png" alt="Channel Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{chat.name}</h2>
            <p className="text-tg-hint text-sm mb-6 leading-relaxed">
              {chat.description || 'Официальный канал БывшИИ. Все новости и обновления здесь.'}
            </p>
            <button 
              onClick={() => setShowChannelInfo(false)}
              className="w-full py-4 bg-tg-light-blue text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-tg-blue transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <Header 
        title={chat.name}
        subtitle={chat.type === 'channel' ? 'Канал' : isBanned ? 'Заблокирован' : 'в сети'}
        showBack={!!onBack}
        leftElement={
          <div 
            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden cursor-pointer" 
            onClick={handleHeaderClick}
          >
            {chat.avatar.startsWith('http') ? (
              <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-xl">{chat.avatar}</span>
            )}
          </div>
        }
        rightElement={
          <div className="flex items-center gap-4 text-gray-500">
            {showSearch ? (
              <div className="flex items-center bg-white/50 dark:bg-gray-800 rounded-full px-3 py-1 input-glass">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Поиск в чате" 
                  className="bg-transparent outline-none text-xs w-32 md:w-48"
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                />
                <X size={14} className="cursor-pointer ml-2" onClick={() => { setShowSearch(false); setChatSearch(''); }} />
              </div>
            ) : (
              <Search size={20} className="cursor-pointer" onClick={() => setShowSearch(true)} />
            )}
            <MoreVertical size={20} className="cursor-pointer" onClick={handleHeaderClick} />
          </div>
        }
      />

      {/* Participants List (for group chats) */}
      {showParticipants && chat.type === 'group' && (
        <div className="absolute top-20 right-4 w-64 bg-tg-bg rounded-3xl shadow-2xl z-20 glass-effect p-4 max-h-80 overflow-y-auto">
          <h4 className="text-sm font-bold mb-3 border-b pb-2">Участники</h4>
          <div className="space-y-3">
            {chat.participants.map(pid => {
              const p = xiis.find(x => x.id === pid) || (pid === currentUser?.id ? currentUser : null);
              if (!p) return null;
              return (
                <div key={pid} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {p.avatar.startsWith('http') ? <img src={p.avatar} className="w-full h-full object-cover" /> : <span>{p.avatar}</span>}
                    </div>
                    <span className="text-xs truncate">{p.firstName} {p.lastName}</span>
                  </div>
                  {pid !== currentUser?.id && (
                    <button 
                      onClick={() => removeXiiFromGroup(chat.id, pid)}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Удалить
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        className={cn(
          "space-y-3",
          chat.type === 'channel' ? "px-0" : "px-4",
          "pt-2 pb-2" // Padding for messages
        )}
      >
        {/* Spacer to push messages below sticky header */}
        <div className="h-2" />
        
        {chatMessages.map((msg) => {
          const isOwn = msg.senderId === currentUser?.id;
          const isChannel = chat.type === 'channel';
          const sender = xiis.find(x => x.id === msg.senderId);
          const isActive = activeMessageId === msg.id;
          
          const handleProfileClick = () => {
            if (sender) {
              navigate(`/profile/${sender.id}`);
            }
          };

          const replyToMsg = chatMessages.find(m => m.id === msg.replyToId);

          return (
            <div key={msg.id} className={cn("flex w-full items-start gap-2", (isOwn || isChannel) ? "justify-start" : "justify-start", isOwn && !isChannel && "justify-end")}>
              <div 
                onClick={() => setActiveMessageId(isActive ? null : msg.id)}
                className={cn(
                  "p-3 rounded-2xl shadow-sm relative group message-bubble transition-all duration-200",
                  isOwn ? "message-bubble-own rounded-tr-none" : "message-bubble-other rounded-tl-none",
                  isChannel ? "channel-post ml-0" : "private-chat-bubble",
                  isActive && "ring-2 ring-tg-light-blue ring-offset-2 dark:ring-offset-black"
                )}
              >
                {!isOwn && chat.type !== 'private' && (
                  <span 
                    className="text-xs font-semibold text-blue-500 block mb-1 cursor-pointer hover:underline"
                    onClick={(e) => { e.stopPropagation(); handleProfileClick(); }}
                  >
                    {sender?.firstName || msg.authorName}
                  </span>
                )}
                
                {replyToMsg && (
                  <div className="mb-2 p-2 bg-black/5 dark:bg-white/5 border-l-2 border-tg-light-blue rounded text-xs opacity-80">
                    <div className="font-bold text-[10px] text-tg-light-blue">
                      {xiis.find(x => x.id === replyToMsg.senderId)?.firstName || (replyToMsg.senderId === currentUser?.id ? 'Вы' : 'Xii')}
                    </div>
                    <div className="truncate">{replyToMsg.text}</div>
                  </div>
                )}

                {msg.forwardedFromId && (
                  <div className="text-[10px] text-tg-light-blue italic mb-1">
                    Переслано от {xiis.find(x => x.id === msg.forwardedFromId)?.firstName || 'Xii'}
                  </div>
                )}

                <p className="text-sm pr-12 whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center gap-1 absolute bottom-1 right-2">
                  <span className="text-[9px] opacity-60">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                  {isChannel && msg.authorName && (
                    <span className="text-[9px] text-tg-light-blue font-medium ml-1 cursor-pointer hover:underline">
                      @{msg.authorName.toLowerCase().replace(/\s/g, '_')}
                    </span>
                  )}
                </div>
                
                {/* Message Actions (Desktop/Private) */}
                {!isChannel && (
                  <div className={cn(
                    "absolute top-0 flex flex-col gap-1 transition-opacity duration-200",
                    (isOwn && !isChannel) ? "-left-10" : "-right-10",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }}
                      className="p-1.5 bg-tg-bg rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 glass-effect"
                    >
                      <Reply size={14}/>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSharingMessage(msg); }}
                      className="p-1.5 bg-tg-bg rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 glass-effect"
                    >
                      <Share2 size={14}/>
                    </button>
                  </div>
                )}
              </div>

              {/* Message Actions (Channel - Right side) */}
              {isChannel && (
                <div className="w-[10%] flex flex-col gap-2 pt-2 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }}
                    className="p-2 bg-white/10 rounded-full shadow-sm hover:bg-white/20 glass-effect flex items-center justify-center"
                  >
                    <Reply size={16} className="text-tg-light-blue" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSharingMessage(msg); }}
                    className="p-2 bg-white/10 rounded-full shadow-sm hover:bg-white/20 glass-effect flex items-center justify-center"
                  >
                    <Share2 size={16} className="text-tg-light-blue" />
                  </button>
                </div>
              )}
              {isChannel && <div className="w-[5%] shrink-0" />}
            </div>
          );
        })}
        {/* Spacer to push messages above sticky input */}
        <div className="h-1" />
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-24 left-4 right-4 bg-white/40 dark:bg-black/40 rounded-3xl p-6 shadow-2xl z-50 glass-effect h-[400px] overflow-y-auto border-t-2 border-tg-light-blue/30">
          <div className="flex justify-between items-center mb-6 sticky top-0 py-2 z-10">
            <h4 className="text-lg font-bold">Эмодзи</h4>
            <X size={24} className="cursor-pointer" onClick={() => setShowEmoji(false)} />
          </div>
          <div className="space-y-8">
            {EMOJI_LIST.map(cat => (
              <div key={cat.category}>
                <span className="text-[10px] text-tg-hint uppercase tracking-widest mb-4 block font-bold opacity-60">{cat.category}</span>
                <div className="grid grid-cols-7 md:grid-cols-10 gap-4">
                  {cat.icons.map(emoji => (
                    <span 
                      key={emoji} 
                      className="text-2xl cursor-pointer hover:scale-125 transition-transform text-center p-1"
                      onClick={() => {
                        setInputText(prev => prev + emoji);
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharingMessage && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-tg-bg w-full max-w-sm rounded-[2.5rem] p-6 glass-effect shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Переслать сообщение</h3>
              <X className="cursor-pointer" onClick={() => setSharingMessage(null)} />
            </div>
            
            {isForwarding ? (
              <div className="py-10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-tg-light-blue border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Пересылка...</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {chats.filter(c => c.id !== chatId).map(c => (
                  <div 
                    key={c.id}
                    onClick={() => handleForward(c.id)}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden">
                      {c.avatar.startsWith('http') ? <img src={c.avatar} className="w-full h-full object-cover" /> : <span>{c.avatar}</span>}
                    </div>
                    <span className="text-sm font-medium truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 flex flex-col gap-2 glass-effect radial-round m-2 shadow-lg sticky bottom-0 z-30">
        {replyingTo && (
          <div className="flex items-center justify-between px-4 py-2 bg-black/5 dark:bg-white/5 rounded-xl border-l-4 border-tg-light-blue">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-tg-light-blue">Ответ на сообщение</div>
              <div className="text-xs truncate opacity-70">{replyingTo.text}</div>
            </div>
            <X size={16} className="cursor-pointer opacity-50 hover:opacity-100" onClick={() => setReplyingTo(null)} />
          </div>
        )}
        
        <div className="flex items-end gap-3">
          <Paperclip className="text-gray-400 cursor-pointer hover:text-tg-light-blue transition-colors mb-2" />
          <div className="flex-1 rounded-2xl flex items-end px-4 py-2 input-glass">
            <textarea 
              ref={textareaRef}
              rows={1}
              disabled={isBanned}
              placeholder={isBanned ? "Вы заблокировали этого xiis" : "Написать сообщение..."} 
              className="bg-transparent outline-none w-full text-sm text-tg-text py-1 resize-none max-h-[300px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Smile 
              className={cn("text-gray-400 cursor-pointer ml-2 hover:text-tg-light-blue transition-colors mb-1", showEmoji && "text-tg-light-blue")} 
              onClick={() => setShowEmoji(!showEmoji)}
            />
          </div>
          {inputText.trim() ? (
            <div onClick={handleSend} className="w-10 h-10 bg-tg-light-blue rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-tg-blue transition-colors mb-1 shadow-md">
              <Send size={20} />
            </div>
          ) : (
            <div className="w-10 h-10 bg-tg-light-blue rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-tg-blue transition-colors mb-1 shadow-md">
              <Mic size={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
