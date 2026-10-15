//src/store/chatStore.ts
import { create } from 'zustand';

export interface Channel {
  id: number;
  name: string;
  type: 'TEXT' | 'VOICE';
  allowedRoles?: string[];
}

export interface ChannelFolder {
  id: number;
  name: string;
  channels: Channel[];
}

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions?: string[];
}

export interface ServerGroup {
  id: number;
  name: string;
  iconUrl?: string;
  folders: ChannelFolder[];
  roles: Role[];
}

export interface DirectMessageChat {
  id: number;
  recipientName: string;
  recipientAvatar: string;
  customNickname?: string;
  roleColor?: string;
  unreadCount?: number;
}

export interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  statusMessage?: string;
}

export interface VoiceParticipant {
  id: number;
  displayName: string;
  avatarUrl: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  volume: number;
}

export interface Message {
  id?: number;
  chatId: number; // ID do canal ou da DM
  senderProfile: UserProfile;
  encryptedPayload: string;
  createdAt: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'file';
  fileName?: string;
  isTemporary?: string;
  isRead?: boolean; 
}

interface ChatState {
  viewMode: 'DM' | 'SERVER';
  activeDmId: number | null;
  activeGroupId: number | null;
  activeChannelId: number | null;

  activeVoiceChannelId: number | null;
  activeVoiceGroupId: number | null;
  isSelfMuted: boolean;
  isSelfDeafened: boolean;
  voiceParticipants: VoiceParticipant[];

  directChats: DirectMessageChat[];
  groups: ServerGroup[];
  messages: Message[];

  setViewMode: (mode: 'DM' | 'SERVER') => void;
  setActiveDm: (dmId: number) => void;
  setActiveServerAndChannel: (groupId: number, channelId: number) => void;

  joinVoiceChannel: (groupId: number, channelId: number) => void;
  leaveVoiceChannel: () => void;
  toggleSelfMute: () => void;
  toggleSelfDeafen: () => void;
  setParticipantVolume: (participantId: number, volume: number) => void;

  addGroup: (group: ServerGroup) => void;
  updateGroupDetails: (groupId: number, name: string, iconUrl?: string) => void;
  addRoleToGroup: (groupId: number, role: Role) => void;
  removeRoleFromGroup: (groupId: number, roleId: string) => void;
  addFolderToGroup: (groupId: number, folderName: string) => void;
  deleteFolderFromGroup: (groupId: number, folderId: number) => void;
  addChannelToFolder: (groupId: number, folderId: number, channel: Channel) => void;
  deleteChannelFromFolder: (groupId: number, folderId: number, channelId: number) => void;
  addDirectChat: (chat: DirectMessageChat) => void;
  addMessage: (message: Message) => void;
  setChatHistory: (chatId: number, messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  viewMode: 'DM',
  activeDmId: 1,
  activeGroupId: null,
  activeChannelId: null,

  activeVoiceChannelId: null,
  activeVoiceGroupId: null,
  isSelfMuted: false,
  isSelfDeafened: false,
  voiceParticipants: [
    { id: 1, displayName: 'Erick Silva (Você)', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', isSpeaking: true, isMuted: false, isDeafened: false, volume: 100 },
    { id: 2, displayName: 'Lucas (Membro)', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', isSpeaking: false, isMuted: false, isDeafened: false, volume: 80 },
    { id: 3, displayName: 'Mariana (Design)', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isSpeaking: false, isMuted: true, isDeafened: false, volume: 90 },
  ],

  directChats: [
    { id: 1, recipientName: 'Mãe (Família)', recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', customNickname: 'Mamãe ❤️', roleColor: '#ec4899' },
    { id: 2, recipientName: 'Irmão', recipientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', customNickname: 'Dev Partner', roleColor: '#3b82f6' },
  ],

  groups: [
    {
      id: 1,
      name: 'Família & Sítio',
      iconUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=100&h=100&fit=crop',
      roles: [
        { id: 'admin', name: 'Administrador', color: '#ef4444', permissions: ['ADMIN', 'MANAGE_CHANNELS'] },
        { id: 'member', name: 'Familiar', color: '#10b981', permissions: ['SEND_MESSAGES', 'CONNECT_VOICE'] },
      ],
      folders: [
        {
          id: 10,
          name: 'GERAL',
          channels: [
            { id: 101, name: 'aviso-geral', type: 'TEXT', allowedRoles: ['admin', 'member'] },
            { id: 102, name: 'encomendas-e-fotos', type: 'TEXT', allowedRoles: ['member'] },
          ],
        },
        {
          id: 20,
          name: 'VOZ & CHAMADAS',
          channels: [
            { id: 103, name: 'Sala de Família (Voz)', type: 'VOICE', allowedRoles: ['member'] },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Videogames & Arte',
      iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop',
      roles: [
        { id: 'artist', name: 'Artista', color: '#8b5cf6', permissions: ['SEND_MESSAGES', 'ATTACH_FILES'] },
      ],
      folders: [
        {
          id: 30,
          name: 'CRIATIVIDADE',
          channels: [
            { id: 201, name: 'fan-arts', type: 'TEXT' },
            { id: 202, name: 'artes-autorais', type: 'TEXT' },
            { id: 203, name: 'Canal de Voz (Devs)', type: 'VOICE' },
          ],
        },
      ],
    },
  ],

  messages: [
    {
      id: 1,
      chatId: 1, // DM 1
      senderProfile: { id: 2, username: 'mae', displayName: 'Mamãe ❤️', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
      encryptedPayload: 'Olá querido! Conseguiu ver as fotos do sítio que mandei?',
      createdAt: '10:14',
      mediaUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop',
      mediaType: 'image'
    },
    {
      id: 2,
      chatId: 1,
      senderProfile: { id: 1, username: 'erick', displayName: 'Erick Silva', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
      encryptedPayload: 'Sim mãe! Lindas demais. Segue o relatório que terminei agora há pouco.',
      createdAt: '10:16',
      mediaUrl: 'https://exemplo.com/relatorio_sitio.pdf',
      mediaType: 'file',
      fileName: 'relatorio_sitio.pdf'
    }
  ],

  setViewMode: (mode) => set({ viewMode: mode }),

  setActiveDm: (dmId) => set({ viewMode: 'DM', activeDmId: dmId, activeGroupId: null, activeChannelId: null }),

  setActiveServerAndChannel: (groupId, channelId) => {
    const group = get().groups.find((g) => g.id === groupId);
    const channel = group?.folders.flatMap((f) => f.channels).find((c) => c.id === channelId);
    if (channel) {
      set({ viewMode: 'SERVER', activeGroupId: groupId, activeChannelId: channelId, activeDmId: null });
      if (channel.type === 'VOICE') {
        set({ activeVoiceChannelId: channelId, activeVoiceGroupId: groupId });
      }
    }
  },

  joinVoiceChannel: (groupId, channelId) => set({ activeVoiceGroupId: groupId, activeVoiceChannelId: channelId }),
  leaveVoiceChannel: () => set({ activeVoiceChannelId: null, activeVoiceGroupId: null }),
  toggleSelfMute: () => set((state) => ({ isSelfMuted: !state.isSelfMuted })),
  toggleSelfDeafen: () => set((state) => ({ isSelfDeafened: !state.isSelfDeafened, isSelfMuted: !state.isSelfDeafened ? true : state.isSelfMuted })),

  setParticipantVolume: (participantId, volume) => set((state) => ({
    voiceParticipants: state.voiceParticipants.map((p) => (p.id === participantId ? { ...p, volume } : p)),
  })),

  addGroup: (newGroup) => set((state) => ({ groups: [...state.groups, newGroup] })),

  updateGroupDetails: (groupId, name, iconUrl) => set((state) => ({
    groups: state.groups.map((g) => (g.id === groupId ? { ...g, name, iconUrl } : g)),
  })),

  addRoleToGroup: (groupId, role) => set((state) => ({
    groups: state.groups.map((g) => (g.id === groupId ? { ...g, roles: [...g.roles, role] } : g)),
  })),

  removeRoleFromGroup: (groupId, roleId) => set((state) => ({
    groups: state.groups.map((g) => (g.id === groupId ? { ...g, roles: g.roles.filter((r) => r.id !== roleId) } : g)),
  })),

  addFolderToGroup: (groupId, folderName) => set((state) => ({
    groups: state.groups.map((g) =>
      g.id === groupId
        ? { ...g, folders: [...g.folders, { id: Date.now(), name: folderName, channels: [] }] }
        : g
    ),
  })),

  deleteFolderFromGroup: (groupId, folderId) => set((state) => ({
    groups: state.groups.map((g) =>
      g.id === groupId ? { ...g, folders: g.folders.filter((f) => f.id !== folderId) } : g
    ),
  })),

  addChannelToFolder: (groupId, folderId, channel) => set((state) => ({
    groups: state.groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            folders: g.folders.map((f) => (f.id === folderId ? { ...f, channels: [...f.channels, channel] } : f)),
          }
        : g
    ),
  })),

  deleteChannelFromFolder: (groupId, folderId, channelId) => set((state) => ({
    groups: state.groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            folders: g.folders.map((f) =>
              f.id === folderId ? { ...f, channels: f.channels.filter((c) => c.id !== channelId) } : f
            ),
          }
        : g
    ),
  })),

  addDirectChat: (chat) => set((state) => ({ directChats: [...state.directChats, chat] })),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  setChatHistory: (chatId, newMessages) => set((state) => {
    // Remove mensagens antigas desse chat para não duplicar, e adiciona o histórico novo
    const otherMessages = state.messages.filter(m => m.chatId !== chatId);
    return { messages: [...otherMessages, ...newMessages] };
  }),
}));