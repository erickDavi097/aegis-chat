//src/components/VoiceChannelGrid.tsx
import React, { useState } from 'react';
import { useChatStore, type VoiceParticipant } from '../store/chatStore';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, Settings, SignalHigh, Sliders } from 'lucide-react';

interface VoiceChannelGridProps {
  channelName: string;
}

export const VoiceChannelGrid: React.FC<VoiceChannelGridProps> = ({ channelName }) => {
  const { 
    voiceParticipants, 
    isSelfMuted, 
    isSelfDeafened, 
    toggleSelfMute, 
    toggleSelfDeafen, 
    leaveVoiceChannel,
    setParticipantVolume 
  } = useChatStore();

  const [selectedParticipant, setSelectedParticipant] = useState<VoiceParticipant | null>(null);

  return (
    <div className="flex flex-1 flex-col bg-slate-950 p-6">
      
      {/* Topo do Canal de Voz */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-emerald-400" /> {channelName}
          </h2>
          <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <SignalHigh className="h-3.5 w-3.5" /> Conectado com baixa latência (WebRTC E2EE Direct)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSelfMute}
            title={isSelfMuted ? "Ativar Microfone" : "Desativar Microfone"}
            className={`p-2.5 rounded-xl border transition-all ${
              isSelfMuted
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isSelfMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <button
            onClick={toggleSelfDeafen}
            title={isSelfDeafened ? "Ativar Áudio" : "Desativar Áudio (Deafen)"}
            className={`p-2.5 rounded-xl border transition-all ${
              isSelfDeafened
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isSelfDeafened ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            onClick={leaveVoiceChannel}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-900/20"
          >
            <PhoneOff className="h-4 w-4" /> Desconectar
          </button>
        </div>
      </div>

      {/* Grade de Participantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1 items-center">
        {voiceParticipants.map((p) => {
          const isMuted = p.id === 1 ? isSelfMuted : p.isMuted;
          const isDeafened = p.id === 1 ? isSelfDeafened : p.isDeafened;

          return (
            <div
              key={p.id}
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border transition-all ${
                p.isSpeaking && !isMuted
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-900/20'
                  : 'border-slate-800'
              }`}
            >
              {/* Avatar do Participante */}
              <div className="relative mb-3">
                <img
                  src={p.avatarUrl}
                  alt={p.displayName}
                  className={`h-20 w-20 rounded-full object-cover border-2 ${
                    p.isSpeaking && !isMuted ? 'border-emerald-400 scale-105' : 'border-slate-700'
                  } transition-all`}
                />
                
                {/* Badges de Mute / Deafen */}
                {(isMuted || isDeafened) && (
                  <div className="absolute -bottom-1 -right-1 flex gap-1">
                    {isMuted && (
                      <span className="bg-red-500 text-slate-950 p-1 rounded-full text-xs font-bold" title="Microfone desligado">
                        <MicOff className="h-3 w-3" />
                      </span>
                    )}
                    {isDeafened && (
                      <span className="bg-red-500 text-slate-950 p-1 rounded-full text-xs font-bold" title="Áudio desativado">
                        <VolumeX className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Nome do Participante */}
              <h3 className="text-sm font-semibold text-white text-center truncate max-w-[180px]">{p.displayName}</h3>

              {/* Botão de Ajuste de Volume Individual */}
              {p.id !== 1 && (
                <button
                  onClick={() => setSelectedParticipant(selectedParticipant?.id === p.id ? null : p)}
                  className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-cyan-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  <Sliders className="h-3 w-3" /> Volume ({p.volume}%)
                </button>
              )}

              {/* Popover de Volume Individual */}
              {selectedParticipant?.id === p.id && (
                <div className="absolute bottom-3 bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl z-10 w-48 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Volume do Usuário</span>
                    <span className="font-bold text-cyan-400">{p.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={p.volume}
                    onChange={(e) => setParticipantVolume(p.id, Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};