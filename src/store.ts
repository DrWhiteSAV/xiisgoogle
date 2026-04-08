import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, Xii, Chat, Message, Gender, Theme, View } from './types/index';
import { STANDARD_XII_MESSAGES } from './config/constants';

interface Store extends AppState {
  setCurrentUser: (user: User) => void;
  addXii: (xii: Xii) => void;
  updateXii: (xiiId: string, updates: Partial<Xii>) => void;
  addMessage: (chatId: string, message: Message) => void;
  createGroupChat: (name: string, participantIds: string[]) => void;
  removeXiiFromGroup: (chatId: string, xiiId: string) => void;
  markAsRead: (chatId: string) => void;
  setTheme: (theme: Theme) => void;
  setThemeColor: (color: string) => void;
  setBlurIntensity: (intensity: number) => void;
  setBgBlurIntensity: (intensity: number) => void;
  setBgIcons: (icons: string[]) => void;
  setView: (view: View, xiiId?: string) => void;
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
      blurIntensity: 10, // Default blur
      bgBlurIntensity: 2, // Default background blur
      bgIcons: ['Heart', 'MessageSquare', 'Zap', 'Star', 'Smile', 'Music', 'Camera', 'Coffee'],
      currentView: 'chats',
      selectedXiiId: null,
      chats: [
        {
          id: 'channel-news',
          type: 'channel',
          name: 'БывшИИ Новости',
          avatar: 'https://i.ibb.co/Fqzm0ckJ/xiislogo.png',
          description: 'Официальный канал БывшИИ. Все новости и обновления здесь.',
          participants: [],
          unreadCount: 0,
        }
      ],
      messages: {
        'channel-news': [
          {
            id: 'm1',
            senderId: 'admin',
            text: 'Добро пожаловать в БывшИИ! Здесь вы можете создать своих xiis и общаться с ними.',
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
          name: `${xii.firstName} ${xii.lastName}`,
          avatar: xii.avatar,
          participants: [state.currentUser?.id || '', xii.id],
          unreadCount: 1,
        };
        
        // Immediate first message from Xii
        const randomMsg = STANDARD_XII_MESSAGES[Math.floor(Math.random() * STANDARD_XII_MESSAGES.length)];
        const firstMsg: Message = {
          id: `first-${xii.id}`,
          senderId: xii.id,
          text: randomMsg,
          timestamp: Date.now(),
        };

        return {
          xiis: [...state.xiis, xii],
          chats: [newChat, ...state.chats],
          messages: { ...state.messages, [chatId]: [firstMsg] },
        };
      }),

      updateXii: (xiiId, updates) => set((state) => {
        const updatedXiis = state.xiis.map(x => x.id === xiiId ? { ...x, ...updates } : x);
        
        // If banned, remove from all group chats
        let updatedChats = state.chats;
        if (updates.isBanned) {
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
          avatar: '👥',
          participants: [state.currentUser?.id || '', ...participantIds],
          unreadCount: 0,
        };
        return {
          chats: [newChat, ...state.chats],
        };
      }),

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
      setView: (view, xiiId) => set({ currentView: view, selectedXiiId: xiiId || null }),
      logout: () => set({ 
        currentUser: null, 
        xiis: [], 
        chats: [
          {
            id: 'channel-news',
            type: 'channel',
            name: 'БывшИИ Новости',
            avatar: 'https://i.ibb.co/Fqzm0ckJ/xiislogo.png',
            description: 'Официальный канал БывшИИ. Все новости и обновления здесь.',
            participants: [],
            unreadCount: 0,
          }
        ], 
        messages: {
          'channel-news': [
            {
              id: 'm1',
              senderId: 'admin',
              text: 'Добро пожаловать в БывшИИ! Здесь вы можете создать своих xiis и общаться с ними.',
              timestamp: Date.now(),
              authorName: 'Админ'
            }
          ]
        }, 
        currentView: 'chats', 
        selectedXiiId: null 
      }),
    }),
    {
      name: 'xiis-storage',
    }
  )
);
