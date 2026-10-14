//src/store/useAuthStore.ts
import { create } from 'zustand';
import { CryptoService } from '../services/cryptoService';

interface UserProfile {
  id: number;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  statusMessage?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  publicKeyBase64: string | null;
  isInitializingKeys: boolean;
  
  setAuthData: (token: string, user: UserProfile) => void;
  logout: () => void;
  initUserKeys: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('aegis_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('aegis_token'),
  publicKeyBase64: null,
  isInitializingKeys: false,

  setAuthData: (token: string, user: UserProfile) => {
    localStorage.setItem('aegis_token', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    localStorage.removeItem('aegis_token');
    await CryptoService.clearLocalKeys();
    set({ token: null, user: null, isAuthenticated: false, publicKeyBase64: null });
  },

  initUserKeys: async () => {
    set({ isInitializingKeys: true });
    try {
      // 1. Tenta carregar chave privada existente no IndexedDB
      let privateKey = await CryptoService.loadPrivateKeyFromIndexedDB();
      let publicKeyBase64: string;

      if (!privateKey) {
        // 2. Se não existir, gera um novo par de chaves E2EE
        const keyPair = await CryptoService.generateIdentityKeyPair();
        privateKey = keyPair.privateKey;
        publicKeyBase64 = await CryptoService.exportPublicKeyToBase64(keyPair.publicKey);

        // 3. Salva a chave privada com segurança no IndexedDB
        await CryptoService.savePrivateKeyToIndexedDB(privateKey);
        console.log('New E2EE keys generated and stored in IndexedDB.');
      } else {
        // Se já existe a chave privada, derivamos ou registramos novamente se necessário
        // (Em arquiteturas completas Signal-like, regeneramos a pública a partir da privada se suportado)
        const exportedPub = await window.crypto.subtle.exportKey("spki", (await CryptoService.generateIdentityKeyPair()).publicKey);
        publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPub)));
        console.log('Existing E2EE private key successfully loaded from IndexedDB.');
      }
      
      set({ publicKeyBase64, isInitializingKeys: false });
    } catch (error) {
      console.error('Error initializing client-side encryption keys:', error);
      set({ isInitializingKeys: false });
    }
  },
}));