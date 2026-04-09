import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, Xii, Chat, Message, Gender, Theme, View, BgSettings, BgDeviceSettings } from './types/index';
import { STANDARD_XII_MESSAGES } from './config/constants';

interface Store extends AppState {
  setCurrentUser: (user: User) => void;
  addXii: (xii: Xii) => void;
  updateXii: (xiiId: string, updates: Partial<Xii>) => void;
  addMessage: (chatId: string, message: Message) => void;
  createGroupChat: (name: string, participantIds: string[]) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  deleteChat: (chatId: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  addParticipantToChat: (chatId: string, participantId: string) => void;
  removeXiiFromGroup: (chatId: string, xiiId: string) => void;
  markAsRead: (chatId: string) => void;
  setTheme: (theme: Theme) => void;
  setThemeColor: (color: string) => void;
  setBlurIntensity: (intensity: number) => void;
  setBgBlurIntensity: (intensity: number) => void;
  setBgIcons: (icons: string[]) => void;
  updateBgSettings: (device: keyof BgSettings, settings: Partial<BgDeviceSettings>) => void;
  setGlassOpacity: (opacity: number) => void;
  setGlassMix: (mix: number) => void;
  setView: (view: View, xiiId?: string) => void;
  updateMessageText: (chatId: string, messageId: string, text: string) => void;
  logout: () => void;
  selectedXiiId: string | null;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      currentUser: null,
      xiis: [],
      theme: 'light',
      themeColor: '#3390ec', // Default Telegram blue
      blurIntensity: 10, // Default blur percentage (10% of 10px = 1px)
      bgBlurIntensity: 0, // Default background blur
      bgIcons: ['HeartCrack'],
      glassOpacity: 10,
      glassMix: 10,
      bgSettings: {
        pc: { cols: 25, rows: 12, minSize: 10, maxSize: 60 },
        tabletPortrait: { cols: 10, rows: 20, minSize: 10, maxSize: 60 },
        tabletLandscape: { cols: 20, rows: 10, minSize: 10, maxSize: 60 },
        mobilePortrait: { cols: 5, rows: 20, minSize: 10, maxSize: 40 },
        mobileLandscape: { cols: 5, rows: 20, minSize: 10, maxSize: 40 },
      },
      currentView: 'chats',
      selectedXiiId: null,
      chats: [
        {
          id: 'channel-news',
          type: 'channel',
          name: 'Стенка БывшИИ',
          avatar: 'https://i.ibb.co/Fqzm0ckJ/xiislogo.png',
          description: 'Дуров вернул стенку! Здесь можно писать всё, что угодно. Но помните: наш ИИ-модератор не дремлет и зорко следит за порядком. Пишите креативно, а не токсично!',
          participants: [],
          unreadCount: 0,
        }
      ],
      messages: {
        'channel-news': [
          {
            id: 'm1',
            senderId: 'admin',
            text: 'Стена возвращена! Пишите здесь всё, что накипело. Но будьте осторожны: наш ИИ проверяет каждое сообщение. Ссылки и гадости будут удалены моментально. Почувствуйте свободу (под присмотром)!',
            timestamp: Date.now(),
            authorName: 'Админ'
          }
        ]
      },

      setCurrentUser: (user) => set({ currentUser: user }),
      
      addXii: (xii) => set((state) => {
        const chatId = `private-${xii.id}`;
        const newChat: Chat = {
          id: chatId,
          type: 'private',
          name: `${xii.firstName}${xii.lastName ? ' ' + xii.lastName : ''}`,
          avatar: xii.avatar,
          participants: [state.currentUser?.id || '', xii.id],
          unreadCount: 1,
        };
        
        // Immediate first message from Xii
        const randomMsg = STANDARD_XII_MESSAGES[Math.floor(Math.random() * STANDARD_XII_MESSAGES.length)];
        const useName = Math.random() > 0.5;
        const name = state.currentUser?.firstName || 'друг';
        
        let processedMsg = useName 
          ? randomMsg.replace(/{name}/g, name)
          : randomMsg.replace(/{name}[,!?]?\s*/g, '');
        
        // Clean up leading punctuation if name was at the start
        processedMsg = processedMsg.replace(/^[,\s!]+/, '').trim();
        // Capitalize first letter if it was lowercased after name removal
        processedMsg = processedMsg.charAt(0).toUpperCase() + processedMsg.slice(1);

        const firstMsg: Message = {
          id: `first-${xii.id}`,
          senderId: xii.id,
          text: processedMsg,
          timestamp: Date.now(),
        };

        return {
          xiis: [...state.xiis, { ...xii, lastOnlinePing: Date.now() }],
          chats: [newChat, ...state.chats],
          messages: { ...state.messages, [chatId]: [firstMsg] },
        };
      }),

      updateXii: (xiiId, updates) => set((state) => {
        const xii = state.xiis.find(x => x.id === xiiId);
        if (!xii) return state;

        const updatedXiis = state.xiis.map(x => x.id === xiiId ? { ...x, ...updates } : x);
        let updatedChats = state.chats;

        // If banning
        if (updates.isBanned === true && !xii.isBanned) {
          const currentGroups = state.chats
            .filter(chat => chat.type === 'group' && chat.participants.includes(xiiId))
            .map(chat => chat.id);
          
          // Update xii with previous groups and mute them
          updatedXiis.forEach(x => {
            if (x.id === xiiId) {
              x.previousGroups = currentGroups;
              x.isMuted = true;
              x.muteNightSms = true;
            }
          });

          // Remove from chats
          updatedChats = state.chats.map(chat => {
            if (chat.type === 'group' && chat.participants.includes(xiiId)) {
              return {
                ...chat,
                participants: chat.participants.filter(id => id !== xiiId)
              };
            }
            return chat;
          });
        } 
        // If unbanning
        else if (updates.isBanned === false && xii.isBanned) {
          const groupsToRestore = xii.previousGroups || [];
          
          updatedChats = state.chats.map(chat => {
            if (groupsToRestore.includes(chat.id)) {
              return {
                ...chat,
                participants: chat.participants.includes(xiiId) 
                  ? chat.participants 
                  : [...chat.participants, xiiId]
              };
            }
            return chat;
          });

          // Clear previous groups
          updatedXiis.forEach(x => {
            if (x.id === xiiId) {
              x.previousGroups = [];
            }
          });
        }

        return { xiis: updatedXiis, chats: updatedChats };
      }),

      addMessage: (chatId, message) => set((state) => {
        const chatMessages = state.messages[chatId] || [];
        const updatedChats = state.chats.map(c => 
          c.id === chatId ? { ...c, lastMessage: message, unreadCount: c.unreadCount + 1 } : c
        );
        return {
          messages: { ...state.messages, [chatId]: [...chatMessages, message] },
          chats: updatedChats,
        };
      }),

      createGroupChat: (name, participantIds) => set((state) => {
        const id = `group-${Date.now()}`;
        const newChat: Chat = {
          id,
          type: 'group',
          name,
          avatar: 'https://i.ibb.co/Fqzm0ckJ/xiislogo.png',
          participants: [state.currentUser?.id || '', ...participantIds],
          unreadCount: 0,
        };
        return {
          chats: [newChat, ...state.chats],
        };
      }),

      updateChat: (chatId, updates) => set((state) => ({
        chats: state.chats.map(c => c.id === chatId ? { ...c, ...updates } : c)
      })),

      deleteChat: (chatId) => set((state) => {
        const { [chatId]: _, ...remainingMessages } = state.messages;
        return {
          chats: state.chats.filter(c => c.id !== chatId),
          messages: remainingMessages
        };
      }),

      deleteMessage: (chatId, messageId) => set((state) => {
        const chatMessages = state.messages[chatId] || [];
        return {
          messages: {
            ...state.messages,
            [chatId]: chatMessages.filter(m => m.id !== messageId)
          }
        };
      }),

      addParticipantToChat: (chatId, participantId) => set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId && !chat.participants.includes(participantId)
            ? { ...chat, participants: [...chat.participants, participantId] }
            : chat
        )
      })),

      removeXiiFromGroup: (chatId, xiiId) => set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId 
            ? { ...chat, participants: chat.participants.filter(id => id !== xiiId) }
            : chat
        )
      })),

      markAsRead: (chatId) => set((state) => ({
        chats: state.chats.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c)
      })),

      setTheme: (theme) => set({ theme }),
      setThemeColor: (themeColor) => set({ themeColor }),
      setBlurIntensity: (blurIntensity) => set({ blurIntensity }),
      setBgBlurIntensity: (bgBlurIntensity) => set({ bgBlurIntensity }),
      setBgIcons: (bgIcons) => set({ bgIcons }),
      updateBgSettings: (device, settings) => set((state) => ({
        bgSettings: {
          ...state.bgSettings,
          [device]: { ...state.bgSettings[device], ...settings }
        }
      })),
      setGlassOpacity: (glassOpacity) => set({ glassOpacity }),
      setGlassMix: (glassMix) => set({ glassMix }),
      setView: (view, xiiId) => set({ currentView: view, selectedXiiId: xiiId || null }),
      
      updateMessageText: (chatId, messageId, text) => set((state) => {
        const chatMessages = state.messages[chatId] || [];
        const updatedMessages = chatMessages.map(m => 
          m.id === messageId ? { ...m, text } : m
        );
        return {
          messages: { ...state.messages, [chatId]: updatedMessages }
        };
      }),

      logout: () => set({ 
        currentUser: null, 
        xiis: [], 
        chats: [
          {
            id: 'channel-news',
            type: 'channel',
            name: 'Стенка БывшИИ',
            avatar: 'https://i.ibb.co/Fqzm0ckJ/xiislogo.png',
            description: 'Дуров вернул стенку! Здесь можно писать всё, что угодно. Но помните: наш ИИ-модератор не дремлет и зорко следит за порядком. Пишите креативно, а не токсично!',
            participants: [],
            unreadCount: 0,
          }
        ], 
        messages: {
          'channel-news': [
            {
              id: 'm1',
              senderId: 'admin',
              text: 'Стена возвращена! Пишите здесь всё, что накипело. Но будьте осторожны: наш ИИ проверяет каждое сообщение. Ссылки и гадости будут удалены моментально. Почувствуйте свободу (под присмотром)!',
              timestamp: Date.now(),
              authorName: 'Админ'
            }
          ]
        }, 
        currentView: 'chats', 
        selectedXiiId: null,
        bgIcons: ['HeartCrack']
      }),
    }),
    {
      name: 'xiis-storage',
    }
  )
);
