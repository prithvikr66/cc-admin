import React, { useEffect, useState } from 'react';
import { History, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

// New interfaces to match backend data structure
interface Transaction {
  id: string;
  wallet_address: string;
  amount: number;
  transaction_type: string;
  status: string;
  signature: string | null;
  created_at: string;
  updated_at: string;
  fee: number | null;
  notes: string;
  error_message: string | null;
}

interface TransactionGroup {
  status: string;
  signed_at: string;
  transactions: Transaction[];
}

interface HistoryResponse {
  groups: TransactionGroup[];
}

const TransactionHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/admin/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch history data');
      }
      const data: HistoryResponse = await response.json();
      setHistoryData(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'successful':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Eye className="h-5 w-5 text-blue-500" />;
    }
  };

  // Filter groups based on wallet address
  const filteredGroups = historyData?.groups.filter(group => {
    if (!searchQuery) return true;
    return group.transactions.some(tx => 
      tx.wallet_address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
              {!filteredGroups?.length ? (
                <li className="p-8 text-center text-gray-500">
                  No transactions found matching the search criteria
                </li>
              ) : (
                filteredGroups.map((group, index) => (
                  <Link
                    key={index}
                    to={`/history/${group.transactions[0].id}`}
                    state={{ group }}
                    className="block hover:bg-gray-50"
                  >
                    <li className="p-4 flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0">
                          {getStatusIcon(group.status)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}{' '}
                            <span className="text-gray-500">
                              {group.transactions.length}{' '}
                              {group.transactions.length === 1 ? 'transaction' : 'transactions'}{' '}
                            </span>
                            {group.status === 'approved' && (
                              <span className="text-green-600 font-medium">
                                ({group.transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(3)} SOL)
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(group.signed_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </li>
                  </Link>
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