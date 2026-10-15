//src/components/AuthScreen.tsx
import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { CryptoService } from '../services/cryptoService'; // <-- Importe o serviço de criptografia

export const AuthScreen: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuthData, initUserKeys } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        // 1. Gera as chaves criptográficas ANTES de bater na API
        console.log("Gerando chaves criptográficas ECDH...");
        const keyPair = await CryptoService.generateIdentityKeyPair();

        // 2. Salva a Chave Privada em segurança no navegador (IndexedDB)
        await CryptoService.savePrivateKeyToIndexedDB(keyPair.privateKey);

        // 3. Converte a Chave Pública para Base64 para enviar ao backend
        const publicKeyBase64 = await CryptoService.exportPublicKeyToBase64(keyPair.publicKey);

        // 4. Envia o cadastro com a chave pública embutida no payload
        await api.post('/auth/register', {
          email,
          password,
          username,
          displayName,
          phoneNumber: phoneNumber || undefined,
          publicIdentityKey: publicKeyBase64, // <-- Enviando para a tabela user_keys
          publicSignedPreKey: "NA",           // <-- Placeholder para futuras assinaturas
        });
        
        alert('Cadastro realizado com sucesso! Suas chaves E2EE foram geradas. Faça login.');
        setIsRegistering(false);
      } else {
        // Fluxo de Login
        const response = await api.post('/auth/login', { email, password });
        
        const { token, user } = response.data;
        
        // Seta o AuthData real vindo do Spring Boot
        setAuthData(token, user);
        
        // Inicia a geração E2EE (ou carrega a chave privada do IndexedDB se já existir)
        await initUserKeys();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Falha na autenticação. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-wider text-cyan-400">AEGIS CHAT</h1>
          <p className="text-sm text-slate-400 mt-1">Comunicação Zero-Knowledge Criptografada</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Nome de Usuário</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="ex: erickdev"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Nome de Exibição</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="ex: Erick Silva"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-3 text-sm transition-colors shadow-lg shadow-cyan-900/20 disabled:opacity-50"
          >
            {loading ? 'Processando...' : isRegistering ? 'Criar Conta' : 'Entrar na Sessão'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-cyan-400 hover:underline"
          >
            {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Registre-se agora'}
          </button>
        </div>
      </div>
    </div>
  );
};