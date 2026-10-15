//src/components/ChatWindow.tsx
import React, { useState, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/useAuthStore';
import { webSocketService } from '../services/websocketService';
import { api } from '../services/api'; 
import { E2EHelper } from '../services/cryptoService'; // <-- Importando o Helper E2EE
import { ExpandableText } from './ExpandableText';
import { MediaAttachment } from './MediaAttachment';
import { VoiceChannelGrid } from './VoiceChannelGrid';
import { MediaGalleryDrawer } from './MediaGalleryDrawer';
import { MessageSearchDrawer } from './MessageSearchDrawer';
import { Image, Search, Send, Lock, Paperclip, Clock, Flame, Hash, Volume2, CheckCheck, X, MessageSquare, Loader2 } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const { viewMode, activeDmId, directChats, groups, activeGroupId, activeChannelId, messages, addMessage } = useChatStore();
  const user = useAuthStore((state) => state.user);

  const [inputText, setInputText] = useState('');
  const [isTemporary, setIsTemporary] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);

  const activeDm = directChats.find(d => d.id === activeDmId);
  const activeGroup = groups.find(g => g.id === activeGroupId);
  const activeChannel = activeGroup?.folders.flatMap(f => f.channels).find(c => c.id === activeChannelId);

  const isReady = viewMode === 'DM' ? !!activeDm : !!activeChannel;
  const currentChatId = viewMode === 'DM' ? activeDmId : activeChannelId;

  if (viewMode === 'SERVER' && activeChannel?.type === 'VOICE') {
    return <VoiceChannelGrid channelName={activeChannel.name} />;
  }

  if (!isReady || !currentChatId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-950 text-slate-500 p-6 text-center">
        <Lock className="h-12 w-12 text-slate-700 mb-3" />
        <p className="text-sm">Selecione uma conversa direta ou canal na barra lateral para iniciar a comunicação E2EE.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    setIsUploading(true);

    try {
      let finalMediaUrl = undefined;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await api.post('/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalMediaUrl = response.data.url; 
      }

      const senderProfile = {
        id: user?.id || 1, // ID logado
        username: user?.username || 'user',
        displayName: user?.displayName || 'Usuário',
        avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      };

      // --- A MÁGICA DA CRIPTOGRAFIA COMEÇA AQUI ---
      let encryptedText = '[Anexo]';
      if (inputText.trim()) {
        // Para testes, vamos tentar buscar a chave do usuário 1 (supondo que ele é o destinatário)
        // No futuro, isso será dinâmico pegando o ID do contato selecionado
        const recipientProfileId = 3; 
        
        try {
            const recipientKey = await E2EHelper.fetchRecipientPublicKey(recipientProfileId);
            if (recipientKey) {
                encryptedText = await E2EHelper.encryptForRecipient(inputText, recipientKey);
                console.log("Texto Original:", inputText);
                console.log("Texto Cifrado E2EE:", encryptedText);
            } else {
                // Fallback se não achar a chave (para não travar seu teste agora)
                encryptedText = `[Sem Chave] ${inputText}`;
            }
        } catch (e) {
            console.error("Erro E2EE:", e);
            encryptedText = `[Erro E2EE] ${inputText}`;
        }
      }

      // Payload que vai para o SERVIDOR (com o texto totalmente bagunçado)
      const serverPayload = {
        channelId: currentChatId,
        senderProfileId: senderProfile.id,
        encryptedPayload: encryptedText, 
        mediaUrl: finalMediaUrl,
        mediaType: selectedFile?.type?.startsWith('image/') ? ('image' as const) : ('file' as const),
        fileName: selectedFile?.name,
        isTemporary,
      };

      webSocketService.sendMessage(currentChatId, serverPayload);

      // Payload que vai para a INTERFACE local (com o texto limpo para você conseguir ler)
      addMessage({
        chatId: currentChatId,
        senderProfile,
        encryptedPayload: inputText || 'Anexo enviado.', // Texto limpo!
        mediaUrl: serverPayload.mediaUrl,
        mediaType: serverPayload.mediaType,
        fileName: selectedFile?.name,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      });

      setInputText('');
      removeSelectedFile();

    } catch (error) {
      console.error("Falha ao enviar:", error);
      alert("Houve um erro ao enviar. Verifique a conexão.");
    } finally {
      setIsUploading(false);
    }
  };

  const chatMessages = messages.filter((m) => m.chatId === currentChatId);
  const currentUserId = user?.id || 1;

  return (
    <div className="relative flex flex-1 flex-col bg-slate-950 overflow-hidden">
      {/* Topo do Chat */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/40 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {viewMode === 'DM' ? (
              <MessageSquare className="h-5 w-5" />
            ) : activeChannel?.type === 'TEXT' ? (
              <Hash className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              {viewMode === 'DM' ? activeDm?.customNickname || activeDm?.recipientName : `#${activeChannel?.name}`}
            </h2>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              ● Criptografia Ponta a Ponta (Zero-Knowledge)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => { setIsSearchDrawerOpen(true); setIsMediaDrawerOpen(false); }} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button onClick={() => { setIsMediaDrawerOpen(true); setIsSearchDrawerOpen(false); }} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <Image className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Histórico de Mensagens */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-600 text-sm">
            Nenhuma mensagem neste chat. Seja o primeiro a enviar!
          </div>
        ) : (
          chatMessages.map((msg, index) => {
            const isMe = msg.senderProfile.id === currentUserId;

            return (
              <div key={index} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <img
                  src={msg.senderProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                  alt={msg.senderProfile.displayName}
                  className="h-8 w-8 rounded-xl object-cover border border-slate-800"
                />

                <div className={`flex flex-col space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs font-semibold text-cyan-400">
                      {isMe ? 'Você' : msg.senderProfile.displayName}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.createdAt}</span>
                    {msg.isTemporary && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        <Flame className="h-3 w-3" /> Temporária
                      </span>
                    )}
                  </div>

                  <div className={`max-w-xl rounded-2xl border px-4 py-3 text-sm text-slate-200 shadow-md ${
                      msg.isTemporary ? 'bg-amber-950/30 border-amber-500/40' : isMe ? 'bg-cyan-950/40 border-cyan-800/60 rounded-tr-none' : 'bg-slate-900 border-slate-800 rounded-tl-none'
                    }`}
                  >
                    <ExpandableText text={msg.encryptedPayload} maxLength={200} />
                    <MediaAttachment mediaUrl={msg.mediaUrl} mediaType={msg.mediaType} fileName={msg.fileName} />
                    
                    {isMe && (
                      <div className="flex justify-end mt-1 text-cyan-400">
                        <CheckCheck className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={handleSend} className="border-t border-slate-800 bg-slate-900/50 p-4 flex flex-col gap-2">
        {isTemporary && (
          <div className="flex items-center justify-between text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
            <span className="flex items-center gap-1.5"><Flame className="h-3.5 w-3.5" /> Modo Temporário Ativo</span>
            <button type="button" onClick={() => setIsTemporary(false)} className="underline font-semibold">Desativar</button>
          </div>
        )}

        {selectedFile && (
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300">
            <div className="flex items-center gap-3 truncate">
              {filePreviewUrl ? <img src={filePreviewUrl} alt="Preview" className="h-10 w-10 object-cover rounded-lg opacity-80" /> : <Paperclip className="h-5 w-5 text-cyan-400" />}
              <span className="truncate font-semibold">{selectedFile.name}</span>
            </div>
            <button type="button" onClick={removeSelectedFile} disabled={isUploading} className="text-slate-400 hover:text-red-400 disabled:opacity-50"><X className="h-4 w-4" /></button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} disabled={isUploading} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className={`transition ${selectedFile ? 'text-cyan-400' : 'text-slate-400 hover:text-white'} disabled:opacity-50`}><Paperclip className="h-5 w-5" /></button>
          <button type="button" onClick={() => setIsTemporary(!isTemporary)} disabled={isUploading} className={`transition ${isTemporary ? 'text-amber-400' : 'text-slate-400 hover:text-white'} disabled:opacity-50`}><Clock className="h-5 w-5" /></button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isUploading}
            placeholder={isUploading ? 'Enviando arquivo...' : `Enviar mensagem...`}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button type="submit" disabled={isUploading || (!inputText.trim() && !selectedFile)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-600 text-slate-950 hover:bg-cyan-500 shadow-lg disabled:opacity-50 transition">
            {isUploading ? <Loader2 className="h-5 w-5 font-bold animate-spin" /> : <Send className="h-5 w-5 font-bold" />}
          </button>
        </div>
      </form>

      <MediaGalleryDrawer isOpen={isMediaDrawerOpen} onClose={() => setIsMediaDrawerOpen(false)} chatId={currentChatId} />
      <MessageSearchDrawer isOpen={isSearchDrawerOpen} onClose={() => setIsSearchDrawerOpen(false)} chatId={currentChatId} />
    </div>
  );
};