import React from 'react';
import { History, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';
import { Transaction } from '../types/transaction';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { WithdrawalRequest } from '../types/withdrawal';


interface TransactionHistoryProps {
  
}

const TransactionHistory: React.FC<TransactionHistoryProps> = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [completedWithdrawals, setCompletedWithdrawals] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCompletedWithdrawals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/admin/completed-withdrawals`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch completed withdrawals');
        }

        setCompletedWithdrawals(data.withdrawals);
        setError(null);
      } catch (err) {
        console.error('Error fetching completed withdrawals:', err);
        setError('Failed to load transaction history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedWithdrawals();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Eye className="h-5 w-5 text-blue-500" />;
    }
  };

  // Filter transactions based on wallet address
  const filteredWithdrawals = completedWithdrawals.filter(withdrawal => {
    if (!searchQuery) return true;
    return withdrawal.wallet_address.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <History className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Transaction History</h1>
            </div>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Withdrawals
            </Link>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by wallet address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul role="list" className="divide-y divide-gray-200">
              {filteredWithdrawals.length === 0 ? (
                <li className="p-8 text-center text-gray-500">
                  {completedWithdrawals.length === 0 
                    ? "No transactions recorded yet"
                    : "No transactions found matching the search criteria"}
                </li>
              ) : (
                filteredWithdrawals.map((withdrawal) => (
                  <li
                    key={withdrawal.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0">
                          {getStatusIcon(withdrawal.status)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {withdrawal.transaction_type.charAt(0).toUpperCase() + withdrawal.transaction_type.slice(1)}{' '}
                            <span className="text-gray-500">
                              {withdrawal.status === 'successful' && (
                                <span className="text-green-600 font-medium">
                                  ({withdrawal.amount.toFixed(3)} SOL)
                                </span>
                              )}
                              {withdrawal.signature && (
                                <a
                                  href={`https://explorer.solana.com/tx/${withdrawal.signature}?cluster=devnet`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-indigo-600 hover:text-indigo-900"
                                >
                                  View on Explorer
                                </a>
                              )}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            to {withdrawal.wallet_address}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm text-gray-500">
                          {new Date(withdrawal.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {withdrawal.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{withdrawal.notes}</p>
                      </div>
                    )}
                    {withdrawal.error_message && (
                      <div className="mt-2">
                        <p className="text-sm text-red-500">{withdrawal.error_message}</p>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;