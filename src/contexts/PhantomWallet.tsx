import React, { createContext, useContext, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface PhantomWalletContextType {
  connected: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

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

  return (
    <PhantomWalletContext.Provider value={{ connected, publicKey, connect, disconnect }}>
      {children}
    </PhantomWalletContext.Provider>
  );
};