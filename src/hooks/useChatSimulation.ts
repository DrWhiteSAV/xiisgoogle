import { useEffect } from 'react';
import { useStore } from '../store';
import { Message } from '../types/index';
import { generateXiiResponse } from '../services/geminiService';
import { STANDARD_XII_MESSAGES } from '../config/constants';

export const useChatSimulation = () => {
  const { currentUser, xiis, addMessage, messages } = useStore();

  useEffect(() => {
    if (!currentUser || xiis.length === 0) return;

    const getAvailableXiis = () => {
      const hour = new Date().getHours();
      const isDaytime = hour >= 9 && hour < 18;
      
      return xiis.filter(x => {
        if (x.isBanned) return false;
        if (x.isMuted) return false;
        if (x.muteDuringDay && isDaytime) return false;
        return true;
      });
    };

    // 1. "I see you're online" message when app starts
    const sendOnlinePing = async () => {
      const available = getAvailableXiis();
      if (available.length === 0) return;

      const randomXii = available[Math.floor(Math.random() * available.length)];
      const chatId = `private-${randomXii.id}`;
      
      const randomMsg = STANDARD_XII_MESSAGES[Math.floor(Math.random() * STANDARD_XII_MESSAGES.length)];
      const xiiMsg: Message = {
        id: `online-${Date.now()}`,
        senderId: randomXii.id,
        text: randomMsg,
        timestamp: Date.now(),
      };
      addMessage(chatId, xiiMsg);
    };
    
    // Small delay to feel natural
    const timeout = setTimeout(sendOnlinePing, 5000);

    // 2. Random pings
    const interval = setInterval(() => {
      const available = getAvailableXiis();
      if (available.length === 0) return;

      const randomXii = available[Math.floor(Math.random() * available.length)];
      const chatId = `private-${randomXii.id}`;
      const chatMessages = messages[chatId] || [];
      
      let consecutiveXiiCount = 0;
      for (let i = chatMessages.length - 1; i >= 0; i--) {
        if (chatMessages[i].senderId === randomXii.id) {
          consecutiveXiiCount++;
        } else {
          break;
        }
      }

      if (consecutiveXiiCount < 3) {
        const sendXiiMsg = async () => {
          const responseText = await generateXiiResponse(randomXii, chatMessages, "Почему молчишь?");
          const xiiMsg: Message = {
            id: `ping-${Date.now()}`,
            senderId: randomXii.id,
            text: responseText,
            timestamp: Date.now(),
          };
          addMessage(chatId, xiiMsg);
        };
        sendXiiMsg();
      }
    }, 45000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [currentUser, xiis, addMessage, messages]);
};
