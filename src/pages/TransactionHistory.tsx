import React from 'react';
import { History, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';
import { Transaction } from '../types/transaction';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { WithdrawalRequest } from '../types/withdrawal';
import axios from 'axios';

interface HistoryTransaction {
  id: string;
  wallet_address: string;
  amount: number;
  transaction_type: string;
  status: string;
  signature: string | null;
  created_at: string;
  updated_at: string;
  notes: string;
  error_message: string | null;
}

interface TransactionGroup {
  signed_at: string;
  status: string;
  transactions: HistoryTransaction[];
}

interface HistoryResponse {
  groups: TransactionGroup[];
}

const TransactionHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [historyData, setHistoryData] = React.useState<TransactionGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get<HistoryResponse>(`${import.meta.env.VITE_BACKEND_URI}/api/admin/history`);
        setHistoryData(response.data.groups);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transaction history');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Filter transactions based on wallet address
  const filteredGroups = historyData.filter(group => {
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
        <div className="text-red-600">{error}</div>
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

         

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul role="list" className="divide-y divide-gray-200">
              {filteredGroups.length === 0 ? (
                <li className="p-8 text-center text-gray-500">
                  No transactions found matching the search criteria
                </li>
              ) : (
                filteredGroups.map((group) => (
                  <li key={group.signed_at} className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {group.status === 'approved' ? 'Approved on' : 'Rejected on'} {new Date(group.signed_at).toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Signed by Admin {/* Hardcoded for now */}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {group.transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {tx.amount} SOL to {tx.wallet_address}
                              </p>
                              <p className="text-sm text-gray-500">
                                Status: {tx.status}
                              </p>
                              {tx.notes && (
                                <p className="text-sm text-gray-500">{tx.notes}</p>
                              )}
                            </div>
                            {tx.signature && (
                              <a
                                href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-900"
                              >
                                View on Explorer
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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