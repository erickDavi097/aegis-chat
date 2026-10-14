//src/components/VoiceConnectionBar.tsx
import React from 'react';
import { useChatStore } from '../store/chatStore';
import { Volume2, Mic, MicOff, VolumeX, PhoneOff, SignalHigh } from 'lucide-react';

export const VoiceConnectionBar: React.FC = () => {
  const { 
    activeVoiceChannelId, 
    groups, 
    isSelfMuted, 
    isSelfDeafened, 
    toggleSelfMute, 
    toggleSelfDeafen, 
    leaveVoiceChannel 
  } = useChatStore();

  if (!activeVoiceChannelId) return null;

  // Busca o nome do canal ativo
  const activeVoiceChannelName = groups
    .flatMap((g) => g.folders)
    .flatMap((f) => f.channels)
    .find((c) => c.id === activeVoiceChannelId)?.name || 'Canal de Voz';

  return (
    <div className="border-t border-slate-800 bg-emerald-950/20 p-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 truncate">
          <SignalHigh className="h-4 w-4 text-emerald-400 animate-pulse" />
          <div className="truncate">
            <p className="font-bold text-emerald-400 truncate">Voz Conectada</p>
            <p className="text-[10px] text-slate-400 truncate">{activeVoiceChannelName}</p>
          </div>
        </div>

        <button
          onClick={leaveVoiceChannel}
          title="Desconectar da Voz"
          className="text-slate-400 hover:text-red-400 transition-colors p-1"
        >
          <PhoneOff className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-around bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
        <button
          onClick={toggleSelfMute}
          title={isSelfMuted ? "Ativar Microfone" : "Desativar Microfone"}
          className={`p-1.5 rounded-lg transition-colors ${
            isSelfMuted ? 'text-red-400 bg-red-500/10' : 'text-slate-300 hover:text-white'
          }`}
        >
          {isSelfMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        <button
          onClick={toggleSelfDeafen}
          title={isSelfDeafened ? "Ativar Áudio" : "Desativar Áudio"}
          className={`p-1.5 rounded-lg transition-colors ${
            isSelfDeafened ? 'text-red-400 bg-red-500/10' : 'text-slate-300 hover:text-white'
          }`}
        >
          {isSelfDeafened ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};