import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store';
import { ChatsPage } from './pages/ChatsPage';
import { CreateXii } from './pages/CreateXiiPage';
import { CreateGroupPage } from './pages/CreateGroupPage';
import { SettingsPage } from './pages/SettingsPage';
import { ChannelInfoPage } from './pages/ChannelInfoPage';
import { GroupInfoPage } from './pages/GroupInfoPage';
import { AddParticipantsPage } from './pages/AddParticipantsPage';
import { ForwardPage } from './pages/ForwardPage';
import { StartPage } from './pages/StartPage';
import { SpamReportPage } from './pages/SpamReportPage';
import { BackgroundPattern } from './components/BackgroundPattern';
import { Plus, Settings, Users, MessageSquare, Moon, Sun } from 'lucide-react';
import { useChatSimulation } from './hooks/useChatSimulation';
import { cn } from './lib/utils';

export default function App() {
  const { 
    currentUser, theme, setTheme, themeColor, blurIntensity, 
    bgBlurIntensity, glassOpacity, glassMix, chats, updateChat 
  } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Migration for the Wall (Стенка)
  useEffect(() => {
    const wallChat = chats.find(c => c.id === 'channel-news');
    if (wallChat && wallChat.name !== 'Стенка БывшИИ') {
      updateChat('channel-news', {
        name: 'Стенка БывшИИ',
        description: 'Дуров вернул стенку! Здесь можно писать всё, что угодно. Но помните: наш ИИ-модератор не дремлет и зорко следит за порядком. Пишите креативно, а не токсично!'
      });
    }
  }, [chats, updateChat]);

  // Run chat simulation
  useChatSimulation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeColor);
    
    // Convert hex to rgb for semi-transparent effects
    const hex = themeColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    document.documentElement.style.setProperty('--theme-color-rgb', `${r}, ${g}, ${b}`);
    
    const blurPx = (blurIntensity / 100) * 10;
    const bgBlurPx = (bgBlurIntensity / 100) * 5;
    document.documentElement.style.setProperty('--blur-intensity', `${blurPx}px`);
    document.documentElement.style.setProperty('--bg-blur-intensity', `${bgBlurPx}px`);
    document.documentElement.style.setProperty('--glass-opacity', `${glassOpacity}%`);
    document.documentElement.style.setProperty('--glass-mix', `${glassMix}%`);
  }, [themeColor, blurIntensity, bgBlurIntensity, glassOpacity, glassMix]);

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/start" element={<StartPage />} />
        <Route path="*" element={<Navigate to="/start" replace />} />
      </Routes>
    );
  }

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent text-tg-text">
      <BackgroundPattern />
      
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <div className="w-20 bg-transparent flex flex-col items-center py-6 gap-8 text-white z-50 border-r border-white/10 backdrop-blur-md">
          <img 
            src="https://i.ibb.co/Fqzm0ckJ/xiislogo.png" 
            alt="Mini Logo" 
            className="w-10 h-10 rounded-lg cursor-pointer" 
            referrerPolicy="no-referrer"
            onClick={() => navigate('/chats')}
          />
          <div 
            className={cn(
              "p-2 rounded-xl cursor-pointer transition-all", 
              currentPath === '/chats' ? "bg-white/20 text-white" : "text-[var(--theme-color)] hover:text-white hover:bg-white/10"
            )}
            onClick={() => navigate('/chats')}
          >
            <MessageSquare size={24} />
          </div>
          <div 
            className={cn(
              "p-2 rounded-xl cursor-pointer transition-all", 
              currentPath === '/createxiis' ? "bg-white/20 text-white" : "text-[var(--theme-color)] hover:text-white hover:bg-white/10"
            )}
            onClick={() => navigate('/createxiis')}
          >
            <Plus size={24} />
          </div>
          
          <div className="mt-auto flex flex-col items-center gap-6">
            <div 
              className="cursor-pointer text-[var(--theme-color)] hover:text-white p-2 transition-colors"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <div 
              className={cn(
                "p-2 rounded-xl cursor-pointer transition-all", 
                currentPath.startsWith('/settings') ? "bg-white/20 text-white" : "text-[var(--theme-color)] hover:text-white hover:bg-white/10"
              )}
              onClick={() => navigate('/settings')}
            >
              <Settings size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <Routes>
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chats/:chatId" element={<ChatsPage />} />
          <Route path="/chats/:chatId/info" element={<ChannelInfoPage />} />
          <Route path="/chats/:chatId/group-info" element={<GroupInfoPage />} />
          <Route path="/chats/:chatId/add-participants" element={<AddParticipantsPage />} />
          <Route path="/forward" element={<ForwardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/:xiiId" element={<SettingsPage />} />
          <Route path="/settings/:xiiId/spam-report" element={<SpamReportPage />} />
          <Route path="/createxiis" element={<CreateXii />} />
          <Route path="/creategroup" element={<CreateGroupPage />} />
          <Route path="*" element={<Navigate to="/chats" replace />} />
        </Routes>

        {/* Mobile Bottom Navbar */}
        {isMobile && !location.pathname.includes('/chats/') && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-8 z-50 pointer-events-none">
            <div 
              onClick={() => navigate('/chats')}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all pointer-events-auto glass-effect",
                currentPath === '/chats' ? "text-white shadow-lg" : "text-[var(--theme-color)]"
              )}
              style={{ backgroundColor: currentPath === '/chats' ? themeColor : undefined }}
            >
              <MessageSquare size={28} />
            </div>
            <div 
              onClick={() => navigate('/settings')}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all pointer-events-auto glass-effect",
                currentPath.startsWith('/settings') ? "text-white shadow-lg" : "text-[var(--theme-color)]"
              )}
              style={{ backgroundColor: currentPath.startsWith('/settings') ? themeColor : undefined }}
            >
              <Settings size={28} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
