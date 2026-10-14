//src/service/websocketService.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  private stompClient: Client | null = null;

  /**
   * Conecta ao endpoint WebSocket do AegisChat (/ws-aegis) com autenticação JWT
   */
  connect(token: string, onConnected: () => void, onError: (error: any) => void) {
    const socket = new SockJS('http://localhost:8080/ws-aegis');

    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        // Descomente caso queira depurar os frames STOMP no console do navegador
        // console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Successfully connected to AegisChat WebSocket STOMP broker.');
        onConnected();
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        onError(frame);
      },
    });

    this.stompClient.activate();
  }

  /**
   * Inscreve-se em um tópico de chat específico para receber mensagens em tempo real (ex: /topic/chat/100)
   */
  subscribeToChat(chatId: number, callback: (message: any) => void) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('Cannot subscribe: STOMP client is not connected.');
      return null;
    }

    return this.stompClient.subscribe(`/topic/chat/${chatId}`, (sdkEvent) => {
      try {
        const message = JSON.parse(sdkEvent.body);
        callback(message);
      } catch (err) {
        console.error('Error parsing incoming WebSocket message body:', err);
      }
    });
  }

  /**
   * Envia uma mensagem cifrada para o servidor através do destino mapeado (@MessageMapping)
   */
  sendMessage(chatId: number, payload: {
    channelId: number;
    senderProfileId: number;
    encryptedPayload: string;
    mediaUrl?: string;
    mediaType?: string;
    mediaSizeBytes?: number;
    isTemporary?: boolean;
  }) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('Cannot send message: WebSocket is disconnected.');
      return;
    }

    this.stompClient.publish({
      destination: `/app/chat/${chatId}/send`,
      body: JSON.stringify(payload),
    });
  }

  /**
   * Encerra a conexão WebSocket com segurança
   */
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log('Disconnected from AegisChat WebSocket.');
    }
  }
}

export const webSocketService = new WebSocketService();