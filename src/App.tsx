import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Connection } from '@solana/web3.js';
import { WithdrawalRequest, BulkAction } from './types/withdrawal';
import { Transaction } from './types/transaction';
import TransactionDetails from './pages/TransactionDetails';
import WithdrawalTable from './components/WithdrawalTable';
import TimeFilter, { TimeRange } from './components/TimeFilter';
import Notification from './components/Notification';
import { Wallet, AlertCircle, History, Search } from 'lucide-react';
import FilterDropdown from './components/FilterDropdown';
import TransactionHistory from './pages/TransactionHistory';
import WalletGuard from './components/WalletGuard';
import ConnectWallet from './components/ConnectWallet';
import { usePhantomWallet } from './contexts/PhantomWallet';
import { transferSOLBulk } from './services/solana';

function App() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('ytd');
  const [selectedAction] = React.useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>("pending");
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const { publicKey } = usePhantomWallet();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = React.useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize Solana connection
  const connection = new Connection('https://api.devnet.solana.com');

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Rejected' },
  ];

  const handleBulkAction = async (action: BulkAction, ids: string[]) => {
    if (action === 'approve' && publicKey) {
      const selectedRequests = withdrawalRequests.filter(w => ids.includes(w.id));

      // Check if any selected request has 'lose' action
      const hasLoseAction = selectedRequests.some(request => request.action === 'lose');
      if (hasLoseAction) {
        alert('Cannot approve requests with "lose" action. Please deselect these items.');
        return;
      }

      // Check if any selected request has an invalid status
      const hasInvalidStatus = selectedRequests.some(
        request => request.status !== 'Pending' && request.status !== 'Rejected'
      );
      

      setIsProcessing(true);
      try {
        const transfers = selectedRequests.map(request => ({
          toWallet: request.walletAddress,
          amount: request.amount
        }));

        const signatures = await transferSOLBulk(connection, publicKey, transfers);
        const signature = signatures[0];

        // Update to use the same signature for all transactions
        const completedTransactions = selectedRequests.map(request => ({
          id: request.id,
          signature: signature,
          status: 'successful',
          updated_at: new Date().toISOString()
        }));

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/admin/completed-transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactions: completedTransactions })
        });

        if (!response.ok) {
          throw new Error('Failed to update transaction status on backend');
        }

        // Record successful transaction
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);

        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          action,
          requestIds: ids,
          timestamp: new Date(),
          performedBy: publicKey.toString(),
          signature: signature,
        };
        setTransactions(prev => [newTransaction, ...prev]);

        // Refresh the withdrawal requests to show updated status
        const refreshResponse = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/admin/pending-withdrawals`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          const transformedWithdrawals = refreshData.withdrawals.map((w: any) => ({
            id: w.id,
            walletAddress: w.wallet_address,
            amount: w.amount,
            timestamp: new Date(w.created_at),
            action: w.transaction_type,
            status: w.status.charAt(0).toUpperCase() + w.status.slice(1),
          }));
          setWithdrawalRequests(transformedWithdrawals);
        }
      } catch (error) {
        console.error('Error processing transfers:', error);
        alert('Failed to process transfers. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else if (action === 'reject') {
      setIsProcessing(true);
      try {
        const selectedRequests = withdrawalRequests.filter(w => ids.includes(w.id));

        // Prepare rejected transactions data
        const rejectedTransactions = selectedRequests.map(request => ({
          id: request.id,
          signature: null,
          status: 'failed',
          updated_at: new Date().toISOString()
        }));

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/admin/completed-transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactions: rejectedTransactions })
        });

        if (!response.ok) {
          throw new Error('Failed to update transaction status on backend');
        }

        // Record rejection transaction
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          action,
          requestIds: ids,
          timestamp: new Date(),
          performedBy: publicKey ? publicKey.toString() : 'Unknown',
        };
        setTransactions(prev => [newTransaction, ...prev]);

        // Refresh the withdrawal requests
        const refreshResponse = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/admin/pending-withdrawals`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          const transformedWithdrawals = refreshData.withdrawals.map((w: any) => ({
            id: w.id,
            walletAddress: w.wallet_address,
            amount: w.amount,
            timestamp: new Date(w.created_at),
            action: w.transaction_type,
            status: w.status.charAt(0).toUpperCase() + w.status.slice(1),
          }));
          setWithdrawalRequests(transformedWithdrawals);
        }

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } catch (error) {
        console.error('Error rejecting transactions:', error);
        alert('Failed to reject transactions. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Handle other actions if needed
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        action,
        requestIds: ids,
        timestamp: new Date(),
        performedBy: publicKey ? publicKey.toString() : 'Unknown',
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const filterWithdrawals = (
    requests: WithdrawalRequest[],
    range: TimeRange,
    action: string | null,
    status: string | null,
    search: string
  ) => {
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;

    return requests.filter((request) => {
      // Time filter
      const timeDiff = now.getTime() - request.timestamp.getTime();
      const daysDiff = timeDiff / msPerDay;

      const matchesTime = (() => {
        switch (range) {
          case '24h':
            return daysDiff <= 1;
          case '3d':
            return daysDiff <= 3;
          case '7d':
            return daysDiff <= 7;
          case '30d':
            return daysDiff <= 30;
          case 'ytd':
            return request.timestamp.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      })();

      // Action filter
      const matchesAction = !action || request.action === action;

      // Status filter
      const matchesStatus = !status || request.status === status;

      // Search filter
      const matchesSearch = !search ||
        request.walletAddress.toLowerCase().includes(search.toLowerCase());

      return matchesTime && matchesAction && matchesStatus && matchesSearch;
    });
  };

  // Add useEffect to fetch data
  React.useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/admin/pending-withdrawals`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch withdrawals');
        }

        // Transform the API data to match your WithdrawalRequest type
        const transformedWithdrawals: WithdrawalRequest[] = data.withdrawals.map((w: any) => ({
          id: w.id,
          walletAddress: w.wallet_address,
          amount: w.amount,
          timestamp: new Date(w.created_at),
          action: w.transaction_type,
          status: w.status
        }));

        setWithdrawalRequests(transformedWithdrawals);
        setError(null);
      } catch (err) {
        console.error('Error fetching withdrawals:', err);
        setError('Failed to load withdrawal requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, []); // Empty dependency array means this runs once on component mount

  // Update the filterWithdrawals call to use the new state
  const filteredWithdrawals = filterWithdrawals(
    withdrawalRequests,
    timeRange,
    selectedAction,
    selectedStatus,
    searchQuery
  );

  return (
    <WalletGuard>
      <div className="min-h-screen bg-gray-100">
        {showSuccess && (
          <Notification
            message="Transactions completed successfully!"
            type="success"
          />
        )}
        {error && (
          <div className="max-w-7xl mx-auto py-3 px-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="px-4 py-6 sm:px-0">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Wallet className="h-8 w-8 text-indigo-600 mr-3" />
                          <h1 className="text-2xl font-semibold text-gray-900">Withdrawal Requests</h1>
                        </div>
                        <ConnectWallet />
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search by wallet address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <Link
                            to="/history"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <History className="h-4 w-4 mr-2" />
                            View History
                          </Link>
                          <div className="h-6 w-px bg-gray-300"></div>


                          <TimeFilter selectedRange={timeRange} onRangeChange={setTimeRange} />
                          <FilterDropdown
                            label="Status"
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            icon={<AlertCircle className="h-5 w-5" />}
                          />
                          {/* <TimeFilter selectedRange={timeRange} onRangeChange={setTimeRange} /> */}

                        </div>
                      </div>
                    </div>
                    <div className="bg-white shadow rounded-lg">
                      <WithdrawalTable
                        requests={filteredWithdrawals}
                        currentPage={currentPage}
                        isProcessing={isProcessing}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        onBulkAction={handleBulkAction}
                      />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/history"
              element={
                <TransactionHistory
                // @ts-ignores
                withdrawals={withdrawalRequests}
                transactions={transactions}
                />
              }
            />
            <Route
              path="/history/:id"
              element={
                <TransactionDetails
                // @ts-ignore
                  withdrawals={withdrawalRequests}
                  transactions={transactions}
                />
              }
            />
          </Routes>
        )}
      </div>
    </WalletGuard>
  );
}

export default App;