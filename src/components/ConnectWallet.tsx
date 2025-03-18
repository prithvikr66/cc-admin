import React from 'react';
import { usePhantomWallet } from '../contexts/PhantomWallet';
import { Wallet } from 'lucide-react';

const ConnectWallet: React.FC = () => {
  const { connected, publicKey, connect, disconnect } = usePhantomWallet();

  return (
    <div className="flex items-center space-x-4">
      {connected && publicKey ? (
        <>
          <span className="text-sm text-gray-600">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
          <button
            onClick={disconnect}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connect}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Wallet className="h-5 w-5 mr-2" />
          Connect Phantom Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet