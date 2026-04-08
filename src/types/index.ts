export type Gender = 'male' | 'female';
export type Theme = 'light' | 'dark';
export type View = 'chats' | 'profile' | 'settings' | 'create-xii' | 'chat-settings';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  avatar: string; // emoji or image url
  description?: string;
  city?: string;
  birthDate?: string;
  job?: string;
  hobbies?: string;
}

export interface Xii extends User {
  isXii: true;
  personality: string;
  past?: string;
  breakupReason?: string;
  relatives?: string;
  friends?: string;
  habits?: string;
  isMuted?: boolean;
  isBanned?: boolean;
  muteDuringDay?: boolean;
  spamReason?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isVoice?: boolean;
  replyToId?: string;
  forwardedFromId?: string;
  authorName?: string; // For channel posts
}

export interface Chat {
  id: string;
  type: 'private' | 'group' | 'channel';
  name: string;
  avatar: string;
  description?: string;
  participants: string[]; // user ids
  lastMessage?: Message;
  unreadCount: number;
}

export interface AppState {
  currentUser: User | null;
  xiis: Xii[];
  chats: Chat[];
  messages: Record<string, Message[]>; // chatId -> messages
  theme: Theme;
  themeColor: string;
  blurIntensity: number;
  bgBlurIntensity: number;
  bgIcons: string[];
  currentView: View;
}
