//src/components/ChatRoom.tsx
import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { webSocketService } from '../services/websocketService';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/chatStore';

export const ChatRoom: React.FC = () => {
  const { token } = useAuthStore();
  const { viewMode, activeChannelId, activeDmId, addMessage } = useChatStore();

  // ID atual do chat depende se estamos em DM ou Servidor/Canal
  const currentChatId = viewMode === 'DM' ? activeDmId : activeChannelId;

  useEffect(() => {
    if (!token || !currentChatId) return;

    // Conecta ao WebSocket STOMP e escuta o chat ativo
    webSocketService.connect(
      token,
      () => {
        webSocketService.subscribeToChat(currentChatId, (incomingMessage) => {
          addMessage(incomingMessage);
        });
      },
      (error) => {
        console.error('WebSocket connection error:', error);
      }
    );

    return () => {
      webSocketService.disconnect();
    };
  }, [token, currentChatId]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};