//src/services/cryptoService.ts
const DB_NAME = 'AegisChatCryptoDB';
const STORE_NAME = 'keys';
const PRIVATE_KEY_ID = 'user_private_identity_key';
import { api } from "./api";

export const CryptoService = {
  // 1. Usa ECDH (Curva Elíptica) no lugar de RSA - Padrão Ouro para Chats
  async generateIdentityKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256", // Curva P-256
      },
      true, 
      ["deriveKey", "deriveBits"]
    );
  },

  async exportPublicKeyToBase64(publicKey: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("spki", publicKey);
    const binary = String.fromCharCode(...new Uint8Array(exported));
    return btoa(binary);
  },

  // Nova função: Importar a chave pública do amiguinho (que virá do Backend em Base64)
  async importPublicKeyFromBase64(base64Key: string): Promise<CryptoKey> {
    const binary = atob(base64Key);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return await window.crypto.subtle.importKey(
      "spki",
      bytes,
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );
  },

  // Nova função mágica: Junta a minha Privada com a Pública do destinatário para criar a Chave AES
  async deriveSharedSecret(myPrivateKey: CryptoKey, theirPublicKey: CryptoKey): Promise<CryptoKey> {
    return await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: theirPublicKey,
      },
      myPrivateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      false, // Não queremos que essa chave AES vaze de jeito nenhum
      ["encrypt", "decrypt"]
    );
  },

  // --- SEU CÓDIGO DE INDEXED_DB PERFEITO FICA INTACTO ABAIXO ---

  async savePrivateKeyToIndexedDB(privateKey: CryptoKey): Promise<void> {
    const jwk = await window.crypto.subtle.exportKey("jwk", privateKey);
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(jwk, PRIVATE_KEY_ID);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async loadPrivateKeyFromIndexedDB(): Promise<CryptoKey | null> {
    try {
      const db = await this.openDB();
      const jwk = await new Promise<JsonWebKey | null>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(PRIVATE_KEY_ID);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });

      if (!jwk) return null;

      return await window.crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "ECDH", namedCurve: "P-256" }, // Atualizado para ECDH
        true,
        ["deriveKey", "deriveBits"]
      );
    } catch (error) {
      console.error('Error loading private key from IndexedDB:', error);
      return null;
    }
  },

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  },

  async clearLocalKeys(): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(PRIVATE_KEY_ID);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('Error clearing keys:', e);
    }
  },

  // Suas funções de encriptação ficam idênticas! Elas vão receber a chave que o deriveSharedSecret criar!
  async encryptMessage(secretKey: CryptoKey, plainText: string): Promise<{ cipherText: string; iv: string }> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(plainText);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      secretKey,
      encodedData
    );

    return {
      cipherText: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
      iv: btoa(String.fromCharCode(...iv)),
    };
  },

  async decryptMessage(secretKey: CryptoKey, cipherTextBase64: string, ivBase64: string): Promise<string> {
    const decoder = new TextDecoder();
    const cipherBytes = Uint8Array.from(atob(cipherTextBase64), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      secretKey,
      cipherBytes
    );

    return decoder.decode(decryptedBuffer);
  }
};

// Adicione isso no seu CryptoService ou em um arquivo de helpers E2EE

export const E2EHelper = {
  // Pega a chave pública de um usuário lá do nosso Backend
  async fetchRecipientPublicKey(recipientProfileId: number): Promise<CryptoKey | null> {
    try {
      const response = await api.get(`/keys/${recipientProfileId}`);
      const base64Key = response.data.publicIdentityKey;
      return await CryptoService.importPublicKeyFromBase64(base64Key);
    } catch (error) {
      console.error("Erro ao buscar chave do destinatário", error);
      return null;
    }
  },

  // Criptografa o texto e retorna no formato: "IV_BASE64.TEXTO_CIFRADO_BASE64"
  async encryptForRecipient(text: string, recipientPublicKey: CryptoKey): Promise<string> {
    const myPrivateKey = await CryptoService.loadPrivateKeyFromIndexedDB();
    if (!myPrivateKey) throw new Error("Chave privada não encontrada no IndexedDB");

    // A Mágica: Deriva a chave secreta AES única entre você e o destinatário
    const sharedSecret = await CryptoService.deriveSharedSecret(myPrivateKey, recipientPublicKey);
    
    // Criptografa o texto
    const { cipherText, iv } = await CryptoService.encryptMessage(sharedSecret, text);
    
    // Junta tudo para caber na coluna encrypted_payload do banco
    return `${iv}.${cipherText}`;
  },

  // Descriptografa a mensagem que veio no formato "IV_BASE64.TEXTO_CIFRADO_BASE64"
  async decryptFromSender(encryptedPayload: string, senderPublicKey: CryptoKey): Promise<string> {
    if (!encryptedPayload.includes('.')) {
      return encryptedPayload; // Provavelmente é uma mensagem antiga/mockada
    }

    const [iv, cipherText] = encryptedPayload.split('.');
    
    const myPrivateKey = await CryptoService.loadPrivateKeyFromIndexedDB();
    if (!myPrivateKey) throw new Error("Chave privada não encontrada");

    const sharedSecret = await CryptoService.deriveSharedSecret(myPrivateKey, senderPublicKey);
    
    return await CryptoService.decryptMessage(sharedSecret, cipherText, iv);
  }
};