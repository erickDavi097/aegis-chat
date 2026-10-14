//src/components/SettingsModal.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Shield, Eye, Moon, Sun, Users, Lock, X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isDarkMode, toggleTheme }) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'privacy' | 'appearance' | 'accounts'>('privacy');

  // Estados de Privacidade (conforme sua lista original)
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [publicProfilePic, setPublicProfilePic] = useState(true);
  const [blockUnknown, setBlockUnknown] = useState(false);

  // Estados de Múltiplas Contas (simuladas)
  const [accounts, setAccounts] = useState([
    { id: 5, name: user?.displayName || 'Erick Silva', type: 'Pessoal / Família', active: true },
    { id: 8, name: 'Erick (Negócios & Dev)', type: 'Trabalho / Avanade', active: false },
  ]);

  if (!isOpen) return null;

  const switchAccount = (id: number) => {
    setAccounts(accounts.map(acc => ({ ...acc, active: acc.id === id })));
    alert('Alternado de conta com sucesso!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 flex flex-col overflow-hidden max-h-[85vh]">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
            <Shield className="h-5 w-5" /> Configurações & Privacidade do AegisChat
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo com Abas Laterais */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Navegação Lateral */}
          <div className="w-56 border-r border-slate-800 bg-slate-950/40 p-3 space-y-1">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Lock className="h-4 w-4" /> Privacidade & Segurança
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                activeTab === 'appearance'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Moon className="h-4 w-4" /> Aparência & Tema
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                activeTab === 'accounts'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" /> Gerenciar Contas
            </button>
          </div>

          {/* Conteúdo da Aba Ativa */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* ABA 1: PRIVACIDADE */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Controles de Privacidade [Ponto Chave]</h4>
                  <p className="text-xs text-slate-400">Gerencie sua exposição e blindagem de dados pessoais no AegisChat.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Confirmação de Leitura</p>
                      <p className="text-[10px] text-slate-500">Permitir que outros vejam quando você leu as mensagens.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={readReceipts}
                      onChange={(e) => setReadReceipts(e.target.checked)}
                      className="h-4 w-4 accent-cyan-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Visualização Online</p>
                      <p className="text-[10px] text-slate-500">Mostrar seu status ativo para seus contatos.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={onlineStatus}
                      onChange={(e) => setOnlineStatus(e.target.checked)}
                      className="h-4 w-4 accent-cyan-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Foto de Perfil Pública</p>
                      <p className="text-[10px] text-slate-500">Permitir que contas desconhecidas vejam sua foto.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={publicProfilePic}
                      onChange={(e) => setPublicProfilePic(e.target.checked)}
                      className="h-4 w-4 accent-cyan-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Bloquear Contas Desconhecidas</p>
                      <p className="text-[10px] text-slate-500">Impedir mensagens diretas de quem não está nos seus contatos.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={blockUnknown}
                      onChange={(e) => setBlockUnknown(e.target.checked)}
                      className="h-4 w-4 accent-cyan-500 rounded"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* ABA 2: APARÊNCIA */}
            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Aparência & Tema</h4>
                  <p className="text-xs text-slate-400">Personalize o visual visual do AegisChat para o seu conforto.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={toggleTheme}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                      !isDarkMode 
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Sun className="h-6 w-6 text-amber-400" />
                    <span className="text-xs font-semibold">Modo Claro</span>
                  </button>

                  <button
                    onClick={toggleTheme}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                      isDarkMode 
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Moon className="h-6 w-6 text-cyan-400" />
                    <span className="text-xs font-semibold">Modo Escuro</span>
                  </button>
                </div>
              </div>
            )}

            {/* ABA 3: MÚLTIPLAS CONTAS */}
            {activeTab === 'accounts' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Gerenciador de Múltiplas Contas</h4>
                  <p className="text-xs text-slate-400">Alterne entre perfis dependendo do assunto (Negócios, Família, Viagens).</p>
                </div>

                <div className="space-y-3 pt-2">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border ${
                        acc.active
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold flex items-center gap-2">
                          {acc.name} {acc.active && <span className="text-[10px] bg-cyan-500 text-slate-950 px-1.5 py-0.2 rounded font-bold">Ativa</span>}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{acc.type}</p>
                      </div>

                      {!acc.active && (
                        <button
                          onClick={() => switchAccount(acc.id)}
                          className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold transition-colors text-cyan-400"
                        >
                          Trocar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold transition-colors shadow-lg shadow-cyan-900/20"
          >
            Salvar & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};