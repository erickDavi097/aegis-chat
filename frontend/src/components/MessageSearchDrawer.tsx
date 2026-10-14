//src/components/MessageSearchDrawer.tsx
import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { Search, X, MessageSquare } from 'lucide-react';

interface MessageSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
}

export const MessageSearchDrawer: React.FC<MessageSearchDrawerProps> = ({ isOpen, onClose, chatId }) => {
  const { messages } = useChatStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredMessages = messages.filter(
    (m) => m.chatId === chatId && m.encryptedPayload.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-20 shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Search className="h-4 w-4" /> Buscar no Chat
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Digite para pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredMessages.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-10">Nenhuma mensagem encontrada.</p>
        ) : (
          filteredMessages.map((msg, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">{msg.senderProfile.displayName}</span>
                <span className="text-[10px] text-slate-500">{msg.createdAt}</span>
              </div>
              <p className="text-xs text-slate-300 break-words">{msg.encryptedPayload}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};