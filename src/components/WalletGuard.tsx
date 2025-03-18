import React from 'react';
import { usePhantomWallet } from '../contexts/PhantomWallet';
import { Wallet } from 'lucide-react';

interface WalletGuardProps {
  children: React.ReactNode;
}

const WalletGuard: React.FC<WalletGuardProps> = ({ children }) => {
  const { connected, connect } = usePhantomWallet();

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <Wallet className="h-16 w-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your Phantom wallet to access the withdrawal management system.
            </p>
            <button
              onClick={connect}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Connect Phantom Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WalletGuard