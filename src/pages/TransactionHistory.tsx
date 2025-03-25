import React from 'react';
import { History, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';
import { Transaction } from '../types/transaction';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { WithdrawalRequest } from '../types/withdrawal';


interface TransactionHistoryProps {
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, withdrawals }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const getActionIcon = (action: Transaction['action']) => {
    switch (action) {
      case 'approve':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'reject':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'review':
        return <Eye className="h-5 w-5 text-blue-500" />;
    }
  };

  const getActionText = (action: Transaction['action']) => {
    switch (action) {
      case 'approve':
        return 'Approved';
      case 'reject':
        return 'Rejected';
      case 'review':
        return 'Reviewed';
    }
  };

  // Filter transactions based on wallet address
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchQuery) return true;
    
    // Get all wallet addresses involved in this transaction
    const involvedWallets = withdrawals
      .filter(w => transaction.requestIds.includes(w.id))
      .map(w => w.walletAddress.toLowerCase());
    
    return involvedWallets.some(wallet => 
      wallet.includes(searchQuery.toLowerCase())
    );
  });

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
              {filteredTransactions.length === 0 ? (
                <li className="p-8 text-center text-gray-500">
                  {transactions.length === 0 
                    ? "No transactions recorded yet"
                    : "No transactions found matching the search criteria"}
                </li>
              ) : (
                filteredTransactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                    onClick={() => {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0">
                          {getActionIcon(transaction.action)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {getActionText(transaction.action)}{' '}
                            <span className="text-gray-500">
                              {transaction.requestIds.length}{' '}
                              {transaction.requestIds.length === 1
                                ? 'request'
                                : 'requests'}{' '}
                            {transaction.action === 'approve' && (
                              <>
                                <span className="text-green-600 font-medium">
                                  ({withdrawals
                                  .filter(w => transaction.requestIds.includes(w.id))
                                  .reduce((sum, w) => sum + w.amount, 0)
                                  .toFixed(8)} SOL)
                                </span>
                                {transaction.signature && (
                                  <a
                                    href={`https://explorer.solana.com/tx/${transaction.signature}?cluster=devnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-indigo-600 hover:text-indigo-900"
                                  >
                                    View on Explorer
                                  </a>
                                )}
                              </>
                            )}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            by {transaction.performedBy}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm text-gray-500">
                          {transaction.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-500">
                          Request IDs:{' '}
                          <span className="font-mono">
                            {transaction.requestIds.join(', ')}
                          </span>
                        </p>
                        <Link
                          to={`/history/${transaction.id}`}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
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