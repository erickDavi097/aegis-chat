//src/components/Sidebar.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore, type ChannelFolder, type Channel } from '../store/chatStore';
import { SettingsModal } from './SettingsModal';
import { VoiceConnectionBar } from './VoiceConnectionBar';
import { ServerSettingsModal } from './ServerSettingsModal';
import { MessageSquare, Hash, Volume2, ShieldCheck, LogOut, Settings, Plus, ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const {
        viewMode,
        activeDmId,
        activeGroupId,
        activeChannelId,
        directChats,
        groups,
        setViewMode,
        setActiveDm,
        setActiveServerAndChannel,
        addGroup,
        addFolderToGroup,
        addChannelToFolder
    } = useChatStore();

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [collapsedFolders, setCollapsedFolders] = useState<Record<number, boolean>>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [modalType, setModalType] = useState<'SERVER' | 'FOLDER' | 'CHANNEL' | 'DM'>('SERVER');
    const [inputName, setInputName] = useState('');
    const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);

    const activeGroup = groups.find(g => g.id === activeGroupId);

    const toggleFolder = (folderId: number) => {
        setCollapsedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
    };

    const handleCreateAction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputName.trim()) return;

        if (modalType === 'SERVER') {
            addGroup({
                id: Date.now(),
                name: inputName,
                roles: [{ id: 'admin', name: 'Admin', color: '#3b82f6' }],
                folders: [{ id: Date.now() + 1, name: 'GERAL', channels: [{ id: Date.now() + 2, name: 'geral', type: 'TEXT' }] }],
            });
        } else if (modalType === 'FOLDER' && activeGroupId) {
            addFolderToGroup(activeGroupId, inputName.toUpperCase());
        } else if (modalType === 'CHANNEL' && activeGroupId && activeGroup?.folders[0]) {
            addChannelToFolder(activeGroupId, activeGroup.folders[0].id, {
                id: Date.now(),
                name: inputName.toLowerCase().replace(/\s+/g, '-'),
                type: 'TEXT',
            });
        }

        setInputName('');
        setShowCreateModal(false);
    };

    return (
        <>
            <div className="flex h-screen border-r border-slate-800 bg-slate-900/50">

                {/* BARRA 1: Esquerda Extrema (DMs + Servidores) */}
                <div className="flex flex-col items-center gap-3 w-16 border-r border-slate-800 bg-slate-950 py-4">

                    {/* Botão de Mensagens Diretas */}
                    <button
                        onClick={() => {
                            setViewMode('DM');
                            if (directChats[0]) setActiveDm(directChats[0].id);
                        }}
                        title="Mensagens Diretas (DMs)"
                        className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all border ${viewMode === 'DM'
                            ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <MessageSquare className="h-5 w-5" />
                    </button>

                    <div className="w-8 h-px bg-slate-800 my-1" />

                    {/* Lista de Grupos / Servidores */}
                    {groups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => {
                                setViewMode('SERVER');
                                const firstChannel = group.folders[0]?.channels[0]?.id || 0;
                                setActiveServerAndChannel(group.id, firstChannel);
                            }}
                            title={group.name}
                            className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all overflow-hidden border ${viewMode === 'SERVER' && activeGroupId === group.id
                                ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                                : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                                }`}
                        >
                            {group.iconUrl ? (
                                <img src={group.iconUrl} alt={group.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="font-bold text-xs text-cyan-400">{group.name.charAt(0)}</span>
                            )}
                        </button>
                    ))}

                    {/* Botão Criar Novo Servidor */}
                    <button
                        onClick={() => { setModalType('SERVER'); setShowCreateModal(true); }}
                        title="Criar Novo Servidor / Grupo"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 hover:bg-emerald-600 hover:text-slate-950 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                {/* BARRA 2: Painel Contextual (DMs ou Canais do Servidor Ativo) */}
                <aside className="flex h-screen w-64 flex-col justify-between bg-slate-900/30">
                    <div>
                        {/* Perfil do Usuário */}
                        <div className="flex items-center justify-between border-b border-slate-800 p-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 font-bold border border-cyan-500/30 overflow-hidden">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'
                                    )}
                                </div>
                                <div className="truncate">
                                    <h2 className="text-sm font-semibold text-white truncate">{user?.displayName || 'Usuário Aegis'}</h2>
                                    <p className="text-[11px] text-cyan-400 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> @{user?.username || 'aegisuser'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={logout} title="Sair" className="text-slate-400 hover:text-red-400 transition-colors">
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>

                        {/* CONTEÚDO QUANDO EM MENSAGENS DIRETAS (DM) */}
                        {viewMode === 'DM' && (
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mensagens Diretas</p>
                                    <button
                                        onClick={() => { setModalType('DM'); setShowCreateModal(true); }}
                                        className="text-cyan-400 hover:text-cyan-300"
                                        title="Adicionar Contato / Conversa"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    {directChats.map((dm) => (
                                        <button
                                            key={dm.id}
                                            onClick={() => setActiveDm(dm.id)}
                                            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${activeDmId === dm.id
                                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                : 'text-slate-300 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <img src={dm.recipientAvatar} alt="" className="h-7 w-7 rounded-full object-cover border border-slate-700" />
                                            <div className="text-left truncate">
                                                <p className="text-xs font-semibold truncate" style={{ color: dm.roleColor || '#ffffff' }}>
                                                    {dm.customNickname || dm.recipientName}
                                                </p>
                                                <p className="text-[10px] text-slate-500">Online Seguro</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CONTEÚDO QUANDO EM SERVIDOR/GRUPO (Com Pastas e Canais) */}
                        {viewMode === 'SERVER' && activeGroup && (
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                                    <div className="flex items-center gap-1.5 truncate">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 truncate">
                                            {activeGroup.name}
                                        </h3>
                                        <button
                                            onClick={() => setIsServerSettingsOpen(true)}
                                            title="Configurações do Servidor"
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            <Settings className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => { setModalType('FOLDER'); setShowCreateModal(true); }} title="Criar Pasta" className="text-slate-400 hover:text-white">
                                            <FolderPlus className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => { setModalType('CHANNEL'); setShowCreateModal(true); }} title="Criar Canal" className="text-slate-400 hover:text-white">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Listagem de Pastas e Canais */}
                                <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)]">
                                    {activeGroup.folders.map((folder: ChannelFolder) => {
                                        const isCollapsed = collapsedFolders[folder.id];

                                        return (
                                            <div key={folder.id} className="space-y-1">
                                                <button
                                                    onClick={() => toggleFolder(folder.id)}
                                                    className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 px-1 py-1"
                                                >
                                                    <span className="flex items-center gap-1">
                                                        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                                        {folder.name}
                                                    </span>
                                                </button>

                                                {!isCollapsed && (
                                                    <div className="space-y-0.5 pl-2">
                                                        {folder.channels.map((channel: Channel) => (
                                                            <button
                                                                key={channel.id}
                                                                onClick={() => setActiveServerAndChannel(activeGroup.id, channel.id)}
                                                                className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${activeChannelId === channel.id
                                                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                                                    }`}
                                                            >
                                                                {channel.type === 'TEXT' ? (
                                                                    <Hash className="h-3.5 w-3.5 text-cyan-500/70" />
                                                                ) : (
                                                                    <Volume2 className="h-3.5 w-3.5 text-emerald-500/70" />
                                                                )}
                                                                <span className="truncate">{channel.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <VoiceConnectionBar />
                            </div>
                        )}
                    </div>

                    {/* Rodapé da Sidebar */}
                    <div className="border-t border-slate-800 p-4 flex items-center justify-between text-slate-400 text-xs">
                        <span>AegisChat v1.0.0</span>
                        <button onClick={() => setIsSettingsModalOpen(true)} className="hover:text-white transition-colors">
                            <Settings className="h-4 w-4" />
                        </button>
                    </div>
                </aside>
            </div>

            {/* Modal Dinâmico de Criação */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
                        <h3 className="text-lg font-bold text-cyan-400 mb-4">
                            {modalType === 'SERVER' && 'Criar Novo Servidor / Grupo'}
                            {modalType === 'FOLDER' && 'Criar Nova Pasta (Categoria)'}
                            {modalType === 'CHANNEL' && 'Criar Novo Canal'}
                            {modalType === 'DM' && 'Iniciar Conversa Direta Segura'}
                        </h3>

                        <form onSubmit={handleCreateAction} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                                    {modalType === 'SERVER' && 'Nome do Servidor'}
                                    {modalType === 'FOLDER' && 'Nome da Pasta'}
                                    {modalType === 'CHANNEL' && 'Nome do Canal'}
                                    {modalType === 'DM' && 'E-mail ou Username do Contato'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={inputName}
                                    onChange={(e) => setInputName(e.target.value)}
                                    placeholder={modalType === 'CHANNEL' ? 'ex: avisos-importantes' : 'ex: Videogames'}
                                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-500 shadow-lg shadow-cyan-900/20"
                                >
                                    Criar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeGroupId && (
                <ServerSettingsModal
                    isOpen={isServerSettingsOpen}
                    onClose={() => setIsServerSettingsOpen(false)}
                    groupId={activeGroupId}
                />
            )}
        </>
    );
};