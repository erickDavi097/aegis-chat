//src/components/ChatRoom.tsx
import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { webSocketService } from '../services/websocketService';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/chatStore';
import { api } from '../services/api';

export const ChatRoom: React.FC = () => {
  const { token } = useAuthStore();
  const { viewMode, activeChannelId, activeDmId, addMessage, setChatHistory } = useChatStore();
  
  // Estado para mostrar um loading enquanto busca o histórico
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // ID atual do chat depende se estamos em DM ou Servidor/Canal
  const currentChatId = viewMode === 'DM' ? activeDmId : activeChannelId;

  useEffect(() => {
    if (!token || !currentChatId) return;

    let isMounted = true;

    const loadHistoryAndConnect = async () => {
      setIsLoadingHistory(true);
      try {
        // 1. Busca o histórico no banco de dados (Spring Boot)
        const response = await api.get(`/chats/${currentChatId}/messages?page=0&size=50`);
        const historicalMessages = response.data.content.reverse(); // Inverte para as mais velhas ficarem no topo

        if (isMounted) {
          // 2. Mapeia os dados do Backend para o formato do Frontend
          const formattedHistory = historicalMessages.map((msg: any) => ({
            id: msg.id,
            chatId: msg.chatId,
            senderProfile: {
               id: msg.senderProfileId,
               username: 'user_' + msg.senderProfileId,
               displayName: 'Usuário ' + msg.senderProfileId, // No futuro traremos o DTO completo da API
               avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
            },
            encryptedPayload: msg.encryptedPayload,
            mediaUrl: msg.mediaUrl,
            mediaType: msg.mediaType,
            fileName: msg.fileName,
            createdAt: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isTemporary: msg.isTemporary,
            isRead: true
          }));

          // Salva no Zustand
          setChatHistory(currentChatId, formattedHistory);

          // 3. Conecta ao WebSocket STOMP APÓS carregar o histórico
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
        }
      } catch (error) {
        console.error('Erro ao carregar histórico da API:', error);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    loadHistoryAndConnect();

    return () => {
      isMounted = false;
      webSocketService.disconnect();
    };
  }, [token, currentChatId]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar />
      {isLoadingHistory ? (
        <div className="flex flex-1 flex-col items-center justify-center bg-slate-950">
          <div className="h-8 w-8 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mb-4" />
          <span className="text-cyan-400 font-bold animate-pulse text-sm">Sincronizando mensagens seguras...</span>
        </div>
      ) : (
        <ChatWindow />
      )}
    </div>
  );
};