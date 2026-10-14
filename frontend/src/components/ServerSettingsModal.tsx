//src/components/ServerSettingsModal.tsx
import React, { useState } from 'react';
import { useChatStore, type Role } from '../store/chatStore';
import { Shield, ShieldAlert, Palette, Trash2, Plus, X, Folder, Hash, Volume2, Check } from 'lucide-react';

interface ServerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
}

export const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({ isOpen, onClose, groupId }) => {
  const { groups, updateGroupDetails, addRoleToGroup, removeRoleFromGroup, deleteFolderFromGroup, deleteChannelFromFolder } = useChatStore();
  const group = groups.find((g) => g.id === groupId);

  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'structure'>('overview');

  // Estados de Visão Geral
  const [serverName, setServerName] = useState(group?.name || '');
  const [serverIcon, setServerIcon] = useState(group?.iconUrl || '');

  // Estados para Novo Cargo
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#3b82f6');

  if (!isOpen || !group) return null;

  const handleSaveOverview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;
    updateGroupDetails(groupId, serverName, serverIcon);
    alert('Informações do Servidor atualizadas!');
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: newRoleName,
      color: newRoleColor,
      permissions: ['SEND_MESSAGES', 'CONNECT_VOICE'],
    };

    addRoleToGroup(groupId, newRole);
    setNewRoleName('');
    setNewRoleColor('#3b82f6');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 flex flex-col overflow-hidden max-h-[85vh]">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
            <Shield className="h-5 w-5" /> Configurações do Servidor: {group.name}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo em Abas */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Menu Lateral de Abas */}
          <div className="w-56 border-r border-slate-800 bg-slate-950/40 p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Palette className="h-4 w-4" /> Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                activeTab === 'roles'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <ShieldAlert className="h-4 w-4" /> Cargos & Permissões
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                activeTab === 'structure'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Folder className="h-4 w-4" /> Pastas & Canais
            </button>
          </div>

          {/* Painel da Aba Ativa */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* ABA 1: VISÃO GERAL */}
            {activeTab === 'overview' && (
              <form onSubmit={handleSaveOverview} className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Perfil do Servidor</h4>
                  <p className="text-xs text-slate-400">Personalize a identidade visual do grupo.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Nome do Servidor</label>
                    <input
                      type="text"
                      required
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">URL do Ícone / Avatar</label>
                    <input
                      type="url"
                      value={serverIcon}
                      onChange={(e) => setServerIcon(e.target.value)}
                      placeholder="https://exemplo.com/icone.png"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-5 py-2.5 text-xs font-bold transition-colors shadow-lg shadow-cyan-900/20"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            )}

            {/* ABA 2: CARGOS & PERMISSÕES */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Gestão de Cargos (`Roles`)</h4>
                  <p className="text-xs text-slate-400">Crie cargos com cores personalizadas para identificar os membros.</p>
                </div>

                {/* Form para Criar Novo Cargo */}
                <form onSubmit={handleAddRole} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h5 className="text-xs font-bold text-cyan-400 uppercase">Criar Novo Cargo</h5>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Moderador, Artista, VIP"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <input
                      type="color"
                      value={newRoleColor}
                      onChange={(e) => setNewRoleColor(e.target.value)}
                      className="h-9 w-12 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer p-1"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Adicionar
                    </button>
                  </div>
                </form>

                {/* Lista de Cargos Existentes */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Cargos Existentes ({group.roles.length})</p>
                  <div className="space-y-2">
                    {group.roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-4 w-4 rounded-full border border-white/20"
                            style={{ backgroundColor: role.color }}
                          />
                          <span className="text-xs font-bold text-white">{role.name}</span>
                        </div>

                        {role.id !== 'admin' && (
                          <button
                            onClick={() => removeRoleFromGroup(groupId, role.id)}
                            title="Remover Cargo"
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: PASTAS & CANAIS */}
            {activeTab === 'structure' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Estrutura de Pastas & Canais</h4>
                  <p className="text-xs text-slate-400">Gerencie e exclua pastas e sub-canais do servidor.</p>
                </div>

                <div className="space-y-4">
                  {group.folders.map((folder) => (
                    <div key={folder.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                          <Folder className="h-4 w-4" /> {folder.name}
                        </span>
                        <button
                          onClick={() => deleteFolderFromGroup(groupId, folder.id)}
                          title="Excluir Pasta"
                          className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Excluir Pasta
                        </button>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {folder.channels.map((ch) => (
                          <div key={ch.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/60 text-xs">
                            <span className="flex items-center gap-2 text-slate-300">
                              {ch.type === 'TEXT' ? <Hash className="h-3.5 w-3.5 text-cyan-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
                              {ch.name}
                            </span>
                            <button
                              onClick={() => deleteChannelFromFolder(groupId, folder.id, ch.id)}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold transition-colors shadow-lg shadow-cyan-900/20"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};