//src/components/MediaAttachment.tsx
import React from 'react';
import { FileText, Image as ImageIcon, Download } from 'lucide-react';

interface MediaAttachmentProps {
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  fileSize?: string;
}

export const MediaAttachment: React.FC<MediaAttachmentProps> = ({
  mediaUrl,
  mediaType = 'IMAGE',
  fileName = 'Anexo-Criptografado',
  fileSize,
}) => {
  if (!mediaUrl) return null;

  const isImage = 
    mediaType.startsWith('image/') || 
    mediaType === 'IMAGE' || 
    Boolean(mediaUrl?.match(/\.(jpeg|jpg|png|gif|webp)$/i));
  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 p-2 max-w-sm">
      {isImage ? (
        <div className="relative group">
          <img
            src={mediaUrl}
            alt={fileName}
            className="w-full max-h-60 object-cover rounded-lg border border-slate-800/80"
          />
          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-400 truncate max-w-[200px]">{fileName}</span>
            <a
              href={mediaUrl}
              download={fileName}
              className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-semibold"
            >
              <Download className="h-3.5 w-3.5" /> Baixar
            </a>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg">
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{fileName}</p>
              {fileSize && <p className="text-[10px] text-slate-500">{fileSize}</p>}
            </div>
          </div>
          <a
            href={mediaUrl}
            download={fileName}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
};