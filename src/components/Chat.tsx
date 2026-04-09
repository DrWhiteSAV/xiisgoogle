import { Search, Menu, MoreVertical, Send, Mic, Paperclip, Smile, Reply, MessageSquare, Settings, X, Plus, Users, ArrowLeft } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { Message, Chat, Xii } from '../types/index';
import { format } from 'date-fns';
import { generateXiiResponse, ai } from '../services/geminiService';
import { EMOJI_LIST } from '../config/constants';
import { Header } from './ui/Header';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const ChatList = ({ onSelectChat, activeChatId }: { onSelectChat: (id: string) => void, activeChatId?: string }) => {
  const { chats, xiis, createGroupChat } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const filteredChats = useMemo(() => {
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-transparent w-full md:w-80 lg:w-96 relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-10">
        <img src="https://i.ibb.co/8DVMSjvq/xiislogofull.png" alt="Logo" className="w-64 h-64 object-contain" />
      </div>

      <div className="p-4 flex flex-col gap-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Input 
              placeholder="Поиск" 
              className="w-full pl-10 bg-white/10 dark:bg-black/10 border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint" size={18} />
          </div>
          <div className="relative">
            <Plus 
              className="text-tg-light-blue cursor-pointer hover:scale-110 transition-transform" 
              size={28} 
              onClick={() => setShowPlusMenu(!showPlusMenu)}
            />
            
            {showPlusMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl z-[100] p-2 glass-effect">
                <div 
                  className="flex items-center gap-3 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                  onClick={() => {
                    navigate('/creategroup');
                    setShowPlusMenu(false);
                  }}
                >
                  <Users size={18} className="text-tg-light-blue" />
                  <span className="text-sm font-medium">Создать группу</span>
                </div>
                <div 
                  className="flex items-center gap-3 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                  onClick={() => {
                    navigate('/createxiis');
                    setShowPlusMenu(false);
                  }}
                >
                  <Plus size={18} className="text-tg-light-blue" />
                  <span className="text-sm font-medium">Добавить xiis</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto relative z-10 pb-24 md:pb-0">
        {filteredChats.map((chat) => {
          const lastMsg = chat.lastMessage;
          const xii = xiis.find(x => `private-${x.id}` === chat.id);
          const isBanned = xii?.isBanned;

          return (
            <div 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-white/5 backdrop-blur-[1px] hover:bg-white/10 dark:hover:bg-white/5",
                activeChatId === chat.id && "bg-white/20 dark:bg-white/10",
                isBanned && "opacity-60"
              )}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shrink-0"
                style={{ backgroundColor: `rgba(var(--theme-color-rgb), 0.1)` }}
              >
                {chat.avatar && chat.avatar.startsWith('http') ? (
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <img src="https://i.ibb.co/Fqzm0ckJ/xiislogo.png" alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-sm truncate flex items-center gap-2">
                    {chat.id === 'channel-news' ? 'Стенка БывшИИ' : chat.name}
                    {xii && <span className="text-[10px] text-tg-hint font-mono">@{xii.username}</span>}
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
  
  // New states for Reply and Share
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [typingXii, setTypingXii] = useState<string | null>(null); // Name of Xii typing
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState<Record<string, string>>({});

  // Click outside to clear active message
  useEffect(() => {
    const handleClickOutside = () => setActiveMessageId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    if (lastAtSymbol !== -1) {
      const searchPart = textBeforeCursor.substring(lastAtSymbol + 1);
      if (!searchPart.includes(' ')) {
        setMentionSearch(searchPart);
        setShowMentions(true);
        return;
      }
    }
    setShowMentions(false);
  };

  const handleSelectMention = (participant: any) => {
    const cursorPosition = textareaRef.current?.selectionStart || inputText.length;
    const textBeforeCursor = inputText.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    const textBeforeAt = inputText.substring(0, lastAtSymbol);
    const textAfterMention = inputText.substring(cursorPosition);
    
    setInputText(`${textBeforeAt}@${participant.username} ${textAfterMention}`);
    setShowMentions(false);

    // "автоматический ответ на последнее сообщение"
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg) {
      setReplyingTo(lastMsg);
    }
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = lastAtSymbol + participant.username.length + 2;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser || isBanned) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: Date.now(),
      replyToId: replyingTo?.id,
    };

    const currentInput = inputText;
    const currentReplyTo = replyingTo;

    addMessage(chatId, userMsg);
    setInputText('');
    setReplyingTo(null);

    const handleXiiResponse = async (target: any, isMention: boolean = false) => {
      setTypingXii(target.firstName);
      try {
        const responseText = await generateXiiResponse(target, messages[chatId] || [], currentInput, currentUser, xiis, currentReplyTo || undefined);
        setTypingXii(null);

        let replyToName = '';
        if (isMention || currentReplyTo) {
          const replier = xiis.find(x => x.id === currentReplyTo?.senderId) || (currentReplyTo?.senderId === currentUser.id ? currentUser : null);
          replyToName = replier?.firstName || (isMention ? currentUser.firstName : '');
        }

        const xiiMsgId = (Date.now() + 1).toString();
        const xiiMsg: Message = {
          id: xiiMsgId,
          senderId: target.id,
          text: '', // Start empty for streaming
          timestamp: Date.now(),
          replyToId: currentReplyTo?.id || (isMention ? userMsg.id : undefined),
          replyToName: replyToName || undefined
        };

        addMessage(chatId, xiiMsg);
        setStreamingMessageId(xiiMsgId);
        
        // Stream the text
        let currentText = '';
        const chars = Array.from(responseText);
        for (let i = 0; i < chars.length; i++) {
          currentText += chars[i];
          setStreamingText(prev => ({ ...prev, [xiiMsgId]: currentText }));
          await new Promise(resolve => setTimeout(resolve, 50)); // 20 chars per second (1000ms / 20 = 50ms)
        }
        
        // Finalize message in store
        useStore.getState().updateMessageText(chatId, xiiMsgId, responseText);
        setStreamingMessageId(null);
        setStreamingText(prev => {
          const next = { ...prev };
          delete next[xiiMsgId];
          return next;
        });
      } catch (error) {
        setTypingXii(null);
        console.error("Xii response error:", error);
      }
    };

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
          setTimeout(() => handleXiiResponse(xii), 1000);
        }
      }
    } else if (chat?.type === 'group') {
      // Handle group chat logic (mentions, etc.)
      const mentioned = inputText.includes('@');
      let targetXii: any = null;

      if (mentioned) {
        const handle = inputText.split('@')[1]?.split(' ')[0];
        targetXii = xiis.find(x => x.username === handle);
      } else if (replyingTo) {
        // If user replies to a Xii message, that Xii should respond
        targetXii = xiis.find(x => x.id === replyingTo.senderId);
      }

      if (targetXii && !targetXii.isBanned && currentUser) {
        setTimeout(() => handleXiiResponse(targetXii, mentioned), 1500);
      }
    } else if (chat?.type === 'channel') {
      // AI Moderation for the Wall (Стенка)
      const isUnacceptable = async (text: string) => {
        // Simple link check first
        const linkRegex = /https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9]+\.[a-z]{2,}/gi;
        if (linkRegex.test(text)) return true;
        
        // AI check for unacceptable content
        const prompt = `Проанализируй это сообщение для публичной "Стенки", где может писать любой пользователь. 
        Является ли оно неприемлемым (оскорбления, спам, токсичность, мат или содержит ссылки)? 
        Сообщение: "${text}"
        Ответь ТОЛЬКО "YES" или "NO".`;
        
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
          });
          return response.text?.trim().toUpperCase() === "YES";
        } catch (e) {
          console.error("Moderation error:", e);
          return false;
        }
      };

      const checkModeration = async () => {
        if (await isUnacceptable(currentInput)) {
          // Delete the message (remove from store)
          useStore.getState().deleteMessage(chatId, userMsg.id);
        }
      };
      checkModeration();
    }
  };

  const handleHeaderClick = () => {
    if (chat?.type === 'private') {
      const xiiId = chat.participants.find(id => id !== currentUser?.id);
      if (xiiId) {
        navigate(`/settings/${xiiId}`);
      }
    } else if (chat?.type === 'group') {
      navigate(`/chats/${chat.id}/group-info`);
    } else if (chat?.type === 'channel') {
      // Navigate to channel info page instead of showing modal
      navigate(`/chats/${chat.id}/info`);
    }
  };

  if (!chat) return <div className="flex-1 flex items-center justify-center text-gray-400">Выберите чат</div>;

  return (
    <div className="flex-1 h-full w-full bg-transparent tg-chat-bg relative flex flex-col overflow-hidden">
      {/* Floating Header Blocks */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center gap-2 z-40 pointer-events-none">
        {/* Block 1: Back Arrow */}
        {onBack && (
          <div 
            onClick={onBack}
            className="w-11 h-11 rounded-full glass-effect flex items-center justify-center shrink-0 pointer-events-auto cursor-pointer shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            <ArrowLeft size={20} className="text-tg-hint" />
          </div>
        )}

        {/* Block 2: Avatar */}
        <div 
          onClick={handleHeaderClick}
          className="w-11 h-11 rounded-full glass-effect flex items-center justify-center shrink-0 pointer-events-auto cursor-pointer shadow-lg hover:scale-105 transition-transform active:scale-95 overflow-hidden"
        >
          {chat.avatar && chat.avatar.startsWith('http') ? (
            <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <img src="https://i.ibb.co/Fqzm0ckJ/xiislogo.png" alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          )}
        </div>

        {/* Block 3: Name & Subtitle */}
        <div 
          onClick={handleHeaderClick}
          className="flex-1 glass-effect rounded-2xl px-4 py-2 shadow-lg pointer-events-auto cursor-pointer min-w-0 flex flex-col justify-center h-11"
        >
          <div className="text-sm font-bold truncate leading-tight flex items-center gap-2">
            {chat.id === 'channel-news' ? 'Стенка БывшИИ' : chat.name}
            {xii && <span className="text-[10px] opacity-60 font-mono">@{xii.username}</span>}
          </div>
          <div className="text-[10px] text-tg-hint truncate leading-tight">
            {chat.type === 'channel' ? 'Стенка' : chat.type === 'group' ? 'Чат' : isBanned ? 'Заблокирован' : 'в сети'}
          </div>
        </div>

        {/* Block 4: Search */}
        <div 
          onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); }}
          className={cn(
            "w-11 h-11 rounded-full glass-effect flex items-center justify-center shrink-0 pointer-events-auto cursor-pointer shadow-lg hover:scale-105 transition-transform active:scale-95",
            showSearch && "text-tg-light-blue ring-2 ring-tg-light-blue"
          )}
        >
          <Search size={20} className={showSearch ? "text-tg-light-blue" : "text-tg-hint"} />
        </div>
      </div>

      {/* Search Bar below Header Blocks */}
      {showSearch && (
        <div className="absolute top-16 left-3 right-3 px-4 py-2 glass-effect rounded-2xl shadow-lg z-30 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Search size={16} className="text-tg-hint shrink-0" />
          <input 
            autoFocus
            type="text" 
            placeholder="Поиск в чате" 
            className="bg-transparent outline-none text-sm flex-1 py-1"
            value={chatSearch}
            onChange={(e) => setChatSearch(e.target.value)}
          />
          {chatSearch && (
            <X 
              size={16} 
              className="cursor-pointer text-tg-hint hover:text-tg-text transition-colors" 
              onClick={() => setChatSearch('')} 
            />
          )}
        </div>
      )}

      {/* Messages */}
      <div 
        ref={scrollRef}
        className={cn(
          "flex-1 w-full overflow-y-auto scroll-smooth space-y-3 px-[5px] pt-2 pb-24"
        )}
      >
        {/* Spacer to push messages below floating header blocks */}
        <div className="h-16" />
        
        {chatMessages.map((msg) => {
          const isOwn = msg.senderId === currentUser?.id;
          const isChannel = chat.type === 'channel';
          const sender = xiis.find(x => x.id === msg.senderId);
          const isActive = activeMessageId === msg.id;
          
          const handleProfileClick = () => {
            if (sender) {
              navigate(`/settings/${sender.id}`);
            }
          };

          const replyToMsg = chatMessages.find(m => m.id === msg.replyToId);

          return (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full items-start", 
                isOwn && !isChannel ? "justify-end" : "justify-start"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn(
                "flex items-end gap-[5px] w-full max-w-full",
                isOwn && !isChannel ? "flex-row-reverse" : "flex-row"
              )}>
                <div 
                  onClick={() => setActiveMessageId(isActive ? null : msg.id)}
                  className={cn(
                    "p-3 rounded-2xl shadow-sm relative group message-bubble transition-all duration-200 min-w-0",
                    isOwn ? "message-bubble-own rounded-tr-none" : "message-bubble-other rounded-tl-none",
                    isChannel ? "channel-post" : "private-chat-bubble",
                    isOwn && !isChannel ? "max-w-[85%]" : "max-w-[calc(100%-37px)]"
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
                  
                  {msg.replyToName && (
                    <div className="text-[10px] font-bold text-tg-light-blue mb-1">
                      Ответ {msg.replyToName}
                    </div>
                  )}
                  
                  {replyToMsg && (
                    <div className="mb-2 p-2 bg-black/5 dark:bg-white/5 border-l-2 border-tg-light-blue rounded text-xs opacity-80 w-full overflow-hidden min-w-0">
                      <div className="font-bold text-[10px] text-tg-light-blue truncate">
                        {xiis.find(x => x.id === replyToMsg.senderId)?.firstName || (replyToMsg.senderId === currentUser?.id ? 'Вы' : 'Xii')}
                      </div>
                      <div className="truncate w-full">{replyToMsg.text}</div>
                    </div>
                  )}

                  {msg.forwardedFromId && (
                    <div className="text-[10px] text-tg-light-blue italic mb-1">
                      Переслано от {xiis.find(x => x.id === msg.forwardedFromId)?.firstName || 'Xii'}
                    </div>
                  )}

                  <p className="text-sm pr-12 whitespace-pre-wrap break-words">
                    {streamingText[msg.id] !== undefined ? streamingText[msg.id] : msg.text}
                    {streamingMessageId === msg.id && <span className="inline-block w-1.5 h-4 ml-0.5 bg-tg-light-blue animate-pulse align-middle" />}
                  </p>
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
                </div>
                
                {/* Message Actions */}
                <div className={cn(
                  "flex flex-col gap-1 transition-opacity duration-200 shrink-0 w-8 items-center",
                  isActive ? "opacity-100" : "opacity-0"
                )}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }}
                    className="p-1.5 bg-transparent rounded-full shadow-md hover:bg-black/5 dark:hover:bg-white/5 glass-effect"
                  >
                    <Reply size={14}/>
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate('/forward', { state: { message: msg } }); 
                    }}
                    className="p-1.5 bg-transparent rounded-full shadow-md hover:bg-black/5 dark:hover:bg-white/5 glass-effect"
                  >
                    <Send size={14} className="-scale-x-100"/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingXii && (
          <div className="flex justify-start px-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="glass-effect px-4 py-2 rounded-2xl rounded-tl-none text-[11px] flex items-center gap-2 text-tg-hint shadow-lg">
              <span className="font-bold text-tg-light-blue">{typingXii}</span>
              <span>печатает</span>
              <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-tg-light-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-tg-light-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-tg-light-blue rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        
        {/* Spacer to push messages above sticky input */}
        <div className="h-1" />
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-24 left-4 right-4 rounded-3xl p-6 shadow-2xl z-50 glass-effect h-[400px] overflow-y-auto border-t-2 border-tg-light-blue/30">
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

      {/* Emoji Picker */}

      {/* Input - 3 Separate Floating Blocks */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end gap-2 z-30 pointer-events-none">
        {/* Block 1: Attachment */}
        <div className="w-11 h-11 rounded-full glass-effect flex items-center justify-center shrink-0 pointer-events-auto cursor-pointer shadow-lg hover:scale-105 transition-transform active:scale-95">
          <Paperclip className="text-tg-hint" size={20} />
        </div>

        {/* Block 2: Text Input */}
        <div className="flex-1 flex flex-col gap-1 pointer-events-auto min-w-0">
          {replyingTo && (
            <div className="flex items-center justify-between px-3 py-1.5 glass-effect rounded-t-2xl border-b-0 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex-1 min-w-0 border-l-2 border-tg-light-blue pl-2">
                <div className="text-[10px] font-bold text-tg-light-blue truncate">Ответ на сообщение</div>
                <div className="text-[10px] truncate opacity-70">{replyingTo.text}</div>
              </div>
              <X size={14} className="cursor-pointer opacity-50 hover:opacity-100 ml-2" onClick={() => setReplyingTo(null)} />
            </div>
          )}
          
          <div className={cn(
            "glass-effect flex items-end px-3 py-2 shadow-lg relative",
            replyingTo ? "rounded-b-2xl rounded-t-none" : "rounded-[1.5rem]"
          )}>
            {/* Mention List */}
            {showMentions && chat?.type === 'group' && (
              <div className="absolute bottom-full left-0 right-0 mb-2 glass-effect rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto border border-white/10 animate-in slide-in-from-bottom-2 duration-200 pointer-events-auto">
                <div className="p-2 space-y-1">
                  {chat.participants
                    .map(id => xiis.find(x => x.id === id) || (id === currentUser?.id ? currentUser : null))
                    .filter(p => p && (p.username.toLowerCase().includes(mentionSearch.toLowerCase()) || p.firstName.toLowerCase().includes(mentionSearch.toLowerCase())))
                    .map(p => p && (
                      <div 
                        key={p.id}
                        onClick={() => handleSelectMention(p)}
                        className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full glass-effect flex items-center justify-center overflow-hidden shrink-0">
                          {p.avatar.startsWith('http') ? <img src={p.avatar} className="w-full h-full object-cover" /> : <span>{p.avatar}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate">{p.firstName} {p.lastName}</div>
                          <div className="text-[10px] text-tg-hint truncate">@{p.username}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <textarea 
              ref={textareaRef}
              rows={1}
              disabled={isBanned}
              placeholder={isBanned ? "Вы заблокировали этого xiis" : "Написать сообщение..."} 
              className="bg-transparent outline-none w-full text-sm text-tg-text py-1 resize-none max-h-[200px]"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Smile 
              className={cn("text-tg-hint cursor-pointer ml-2 hover:text-tg-light-blue transition-colors mb-1 shrink-0", showEmoji && "text-tg-light-blue")} 
              onClick={() => setShowEmoji(!showEmoji)}
              size={20}
            />
          </div>
        </div>

        {/* Block 3: Send/Mic */}
        <div 
          onClick={handleSend}
          className="w-11 h-11 bg-tg-light-blue rounded-full flex items-center justify-center text-white shrink-0 pointer-events-auto cursor-pointer shadow-lg hover:bg-tg-blue transition-all active:scale-95"
        >
          {inputText.trim() ? <Send size={20} /> : <Mic size={20} />}
        </div>
      </div>
    </div>
  );
};
