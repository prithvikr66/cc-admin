import React, { createContext, useContext, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

interface PhantomWalletContextType {
  connected: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const ALLOWED_WALLETS:any = new Set([
  "FWCKtei68aH2prbA46zC5L7PYzCaGGtP8DXvPMiaUwSh", 
  "9PGES9BV6Sb6HjReYQM1gNGGeE3N1aQhiigAioxZ44gK",
]);

const PhantomWalletContext = createContext<PhantomWalletContextType>({
  connected: false,
  publicKey: null,
  connect: async () => {},
  disconnect: async () => {},
});

export const usePhantomWallet = () => useContext(PhantomWalletContext);

interface PhantomProvider {
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
  isPhantom?: boolean;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export const PhantomWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.solana?.isPhantom) {
          // @ts-ignore
          const response = await window.solana.connect({ onlyIfTrusted: true });
          setPublicKey(response.publicKey);
          setConnected(true);
        }
      } catch (error) {
        // Handle connection error
      }
    };

    window.solana?.on('connect', (publicKey: PublicKey) => {
      setPublicKey(publicKey);
      setConnected(true);
    });

    window.solana?.on('disconnect', () => {
      setPublicKey(null);
      setConnected(false);
    });

    checkConnection();
  }, []);

  const connect = async () => {
    try {
      if (!window.solana) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await window.solana.connect();
      setPublicKey(response.publicKey);
      setConnected(true);
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
    }
  };

  const disconnect = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
        setPublicKey(null);
        setConnected(false);
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
    }
  };

  useEffect(() => {
    if (publicKey) {
      if (!ALLOWED_WALLETS.has(publicKey.toBase58())) {
        alert("Unauthorized wallet!");
        disconnect();
      }
    }
  }, [publicKey, disconnect]);

  return (
    <PhantomWalletContext.Provider value={{ connected, publicKey, connect, disconnect }}>
      {children}
    </PhantomWalletContext.Provider>
  );
};