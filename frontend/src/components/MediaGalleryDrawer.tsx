//src/components/MediaGallaryDrawer.tsx
import React from 'react';
import { useChatStore } from '../store/chatStore';
import { Image, FileText, X, Download } from 'lucide-react';

interface MediaGalleryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: number;
}

export const MediaGalleryDrawer: React.FC<MediaGalleryDrawerProps> = ({ isOpen, onClose, chatId }) => {
  const { messages } = useChatStore();

  if (!isOpen) return null;

  // Filtra mensagens que possuem mídias ou arquivos do chat atual
  const chatMedia = messages.filter((m) => m.chatId === chatId && m.mediaUrl);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-20 shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Image className="h-4 w-4" /> Mídias & Arquivos Compartilhados
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMedia.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-10">Nenhuma mídia ou arquivo neste chat ainda.</p>
        ) : (
          chatMedia.map((item, idx) => (
            <div key={idx} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden p-2.5 space-y-2">
              {item.mediaType === 'image' ? (
                <div className="rounded-lg overflow-hidden h-36 bg-slate-900">
                  <img src={item.mediaUrl} alt="Mídia" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <FileText className="h-6 w-6 text-cyan-400 shrink-0" />
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-white truncate">{item.fileName || 'Documento.pdf'}</p>
                    <p className="text-[10px] text-slate-400">Enviado por {item.senderProfile.displayName}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>{item.createdAt}</span>
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:underline"
                >
                  <Download className="h-3 w-3" /> Abrir
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};