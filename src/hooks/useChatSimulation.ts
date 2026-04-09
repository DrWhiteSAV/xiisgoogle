import { useEffect } from 'react';
import { useStore } from '../store';
import { Message } from '../types/index';
import { generateXiiResponse } from '../services/geminiService';
import { STANDARD_XII_MESSAGES } from '../config/constants';

export const useChatSimulation = () => {
  const { currentUser, xiis, addMessage, messages, updateXii } = useStore();

  useEffect(() => {
    if (!currentUser || xiis.length === 0) return;

    const getAvailableXiisForNightSms = () => {
      // Timezone +03 check
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const moscowTime = new Date(utc + (3600000 * 3));
      const hour = moscowTime.getHours();
      
      // Night is after 22:00
      const isNight = hour >= 22 || hour < 6;
      
      return xiis.filter(x => {
        if (x.isBanned) return false;
        if (x.isMuted) return false;
        if (x.muteNightSms && isNight) return false;
        return isNight; // Only for night SMS logic
      });
    };

    // 1. Online ping when app starts (once per session/entry)
    const sendOnlinePing = async () => {
      const now = Date.now();
      const available = xiis.filter(x => {
        if (x.isBanned) return false;
        if (x.isMuted) return false;
        // Check if we already pinged in this "session" (e.g. last 1 hour)
        // or if it's a fresh entry
        return !x.lastOnlinePing || (now - x.lastOnlinePing > 3600000);
      });

      if (available.length === 0) return;

      const randomXii = available[Math.floor(Math.random() * available.length)];
      const chatId = `private-${randomXii.id}`;
      
      const randomMsg = STANDARD_XII_MESSAGES[Math.floor(Math.random() * STANDARD_XII_MESSAGES.length)];
      const useName = Math.random() > 0.5;
      const name = currentUser.firstName || 'друг';
      
      let processedMsg = useName 
        ? randomMsg.replace(/{name}/g, name)
        : randomMsg.replace(/{name}[,!?]?\s*/g, '');
      
      // Clean up leading punctuation if name was at the start
      processedMsg = processedMsg.replace(/^[,\s!]+/, '').trim();
      // Capitalize first letter if it was lowercased after name removal
      processedMsg = processedMsg.charAt(0).toUpperCase() + processedMsg.slice(1);
      
      const xiiMsg: Message = {
        id: `online-${Date.now()}`,
        senderId: randomXii.id,
        text: processedMsg,
        timestamp: Date.now(),
      };
      
      addMessage(chatId, xiiMsg);
      updateXii(randomXii.id, { lastOnlinePing: Date.now() });
    };
    
    // Small delay to feel natural
    const timeout = setTimeout(sendOnlinePing, 5000);

    // 2. Night SMS logic (check every 15 mins)
    const interval = setInterval(() => {
      const nightXiis = getAvailableXiisForNightSms();
      if (nightXiis.length === 0) return;

      // Check if user has entered in the last 24 hours
      // Since we don't have a "lastEntry" field, we can assume if this hook is running, 
      // the user IS currently in the app. 
      // The requirement says: "check if there was an entry during the day, if not, send".
      // This is tricky because if they ARE in the app, the hook is running.
      // Let's interpret as: if it's night and they haven't received a night SMS yet today.
      
      const randomXii = nightXiis[Math.floor(Math.random() * nightXiis.length)];
      const chatId = `private-${randomXii.id}`;
      const chatMessages = messages[chatId] || [];
      
      // Check if last message was recent (e.g. last 12 hours)
      const lastMsg = chatMessages[chatMessages.length - 1];
      const twelveHours = 12 * 60 * 60 * 1000;
      
      if (!lastMsg || (Date.now() - lastMsg.timestamp > twelveHours)) {
        const sendXiiMsg = async () => {
          const responseText = await generateXiiResponse(randomXii, chatMessages, "Спишь?", currentUser, xiis);
          const xiiMsg: Message = {
            id: `night-${Date.now()}`,
            senderId: randomXii.id,
            text: responseText,
            timestamp: Date.now(),
          };
          addMessage(chatId, xiiMsg);
        };
        sendXiiMsg();
      }
    }, 900000); // 15 mins

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [currentUser, xiis, addMessage, messages, updateXii]);
};
