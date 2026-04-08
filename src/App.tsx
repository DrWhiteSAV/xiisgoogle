import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store';
import { Onboarding } from './components/Onboarding';
import { ChatsPage } from './pages/ChatsPage';
import { CreateXii } from './pages/CreateXiiPage';
import { Profile } from './pages/ProfilePage';
import { ChatSettings } from './pages/ChatSettingsPage';
import { BackgroundPattern } from './components/BackgroundPattern';
import { Plus, Settings, Users, MessageSquare, Moon, Sun } from 'lucide-react';
import { useChatSimulation } from './hooks/useChatSimulation';
import { cn } from './lib/utils';

export default function App() {
  const { currentUser, theme, setTheme, themeColor, blurIntensity, bgBlurIntensity } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

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
    document.documentElement.style.setProperty('--blur-intensity', `${blurIntensity}px`);
    document.documentElement.style.setProperty('--bg-blur-intensity', `${bgBlurIntensity}px`);
  }, [themeColor, blurIntensity, bgBlurIntensity]);

  if (!currentUser) {
    return <Onboarding />;
  }

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-transparent text-tg-text">
      <BackgroundPattern />
      
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <div className="w-20 bg-tg-blue flex flex-col items-center py-6 gap-8 text-white z-50">
          <img 
            src="https://i.ibb.co/Fqzm0ckJ/xiislogo.png" 
            alt="Mini Logo" 
            className="w-10 h-10 rounded-lg cursor-pointer" 
            referrerPolicy="no-referrer"
            onClick={() => navigate('/chats')}
          />
          <div 
            className={cn("p-2 rounded-xl cursor-pointer transition-all", currentPath === '/chats' ? "bg-white/20" : "opacity-70 hover:opacity-100")}
            onClick={() => navigate('/chats')}
          >
            <MessageSquare size={24} />
          </div>
          <div 
            className={cn("p-2 rounded-xl cursor-pointer transition-all", currentPath === '/createxiis' ? "bg-white/20" : "opacity-70 hover:opacity-100")}
            onClick={() => navigate('/createxiis')}
          >
            <Plus size={24} />
          </div>
          <div className="opacity-70 hover:opacity-100 cursor-pointer p-2"><Users size={24} /></div>
          
          <div className="mt-auto flex flex-col items-center gap-6">
            <div 
              className="cursor-pointer opacity-70 hover:opacity-100 p-2"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <div 
              className={cn("p-2 rounded-xl cursor-pointer transition-all", currentPath === '/profile' ? "bg-white/20" : "opacity-70 hover:opacity-100")}
              onClick={() => navigate('/profile')}
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:xiiId" element={<Profile />} />
          <Route path="/chatsettings" element={<ChatSettings />} />
          <Route path="/createxiis" element={<CreateXii />} />
          <Route path="*" element={<Navigate to="/chats" replace />} />
        </Routes>

        {/* Mobile Bottom Navbar */}
        {isMobile && !location.pathname.includes('/chats/') && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-30">
            <div className="flex items-center gap-4 p-2 glass-effect radial-round shadow-2xl">
              <div 
                onClick={() => navigate('/chats')}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  currentPath === '/chats' ? "bg-tg-light-blue text-white shadow-lg" : "opacity-60"
                )}
              >
                <MessageSquare size={24} />
              </div>
              <div 
                onClick={() => navigate('/createxiis')}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  currentPath === '/createxiis' ? "bg-tg-light-blue text-white shadow-lg" : "opacity-60"
                )}
              >
                <Plus size={24} />
              </div>
              <div 
                onClick={() => navigate('/profile')}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  currentPath === '/profile' ? "bg-tg-light-blue text-white shadow-lg" : "opacity-60"
                )}
              >
                <Settings size={24} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
