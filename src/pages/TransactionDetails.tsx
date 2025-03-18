import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, History, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Transaction } from '../types/transaction';
import { WithdrawalRequest } from '../types/withdrawal';
import StatusBadge from '../components/StatusBadge';
import ActionBadge from '../components/ActionBadge';

interface TransactionDetailsProps {
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transactions, withdrawals }) => {
  const { id } = useParams<{ id: string }>();
  const transaction = transactions.find(t => t.id === id);
  
  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Transaction not found</h2>
          <Link
            to="/history"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  const getActionIcon = (action: Transaction['action']) => {
    switch (action) {
      case 'approve':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'reject':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'review':
        return <Eye className="h-6 w-6 text-blue-500" />;
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

  const involvedWithdrawals = withdrawals.filter(w => 
    transaction.requestIds.includes(w.id)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <History className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Transaction Details</h1>
            </div>
            <Link
              to="/history"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to History
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                {getActionIcon(transaction.action)}
                <h3 className="ml-2 text-lg leading-6 font-medium text-gray-900">
                  {getActionText(transaction.action)} {transaction.requestIds.length}{' '}
                  {transaction.requestIds.length === 1 ? 'request' : 'requests'}
                </h3>
              </div>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Performed by {transaction.performedBy}</p>
                <p className="mt-1">{transaction.timestamp.toLocaleString()}</p>
                {transaction.signature && (
                  <p className="mt-1">
                    <a
                      href={`https://explorer.solana.com/tx/${transaction.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Transaction on Solana Explorer
                    </a>
                  </p>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {involvedWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {withdrawal.walletAddress}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {withdrawal.amount.toFixed(8)} SOL
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {withdrawal.timestamp.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ActionBadge action={withdrawal.action} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={withdrawal.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;