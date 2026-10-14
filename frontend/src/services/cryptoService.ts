//src/services/cryptoService.tsx
const DB_NAME = 'AegisChatCryptoDB';
const STORE_NAME = 'keys';
const PRIVATE_KEY_ID = 'user_private_identity_key';

export const CryptoService = {
  /**
   * Gera um par de chaves RSA-OAEP com extractable: true para permitir exportação local
   */
  async generateIdentityKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true, // Obrigatório true para exportar a chave privada como JWK
      ["encrypt", "decrypt"]
    );
  },

  /**
   * Converte uma CryptoKey pública para formato Base64 (para envio ao backend)
   */
  async exportPublicKeyToBase64(publicKey: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("spki", publicKey);
    const binary = String.fromCharCode(...new Uint8Array(exported));
    return btoa(binary);
  },

  /**
   * Salva a chave privada de forma segura no IndexedDB do navegador
   */
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

  /**
   * Recupera a chave privada do IndexedDB e a reimporta como CryptoKey
   */
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
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"]
      );
    } catch (error) {
      console.error('Error loading private key from IndexedDB:', error);
      return null;
    }
  },

  /**
   * Abre ou inicializa o IndexedDB local
   */
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

  /**
   * Limpa as chaves ao fazer logout
   */
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