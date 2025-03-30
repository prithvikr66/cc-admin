import React, { useState } from 'react';
import { Edit2, Save, Info } from 'lucide-react';

interface Metrics {
  totalBets: number;
  totalWagered: number;
  totalLost: number;
  totalWon: number;
  houseBalance: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  pendingWithdrawalsCount: any
}

interface AdminMetricsProps {
  metrics: Metrics;
  onUpdateHouseBalance: (newBalance: number) => void;
}

const AdminMetrics: React.FC<AdminMetricsProps> = ({ metrics, onUpdateHouseBalance }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState(metrics.houseBalance.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const balance = parseFloat(newBalance);
    if (isNaN(balance)) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/admin/house-balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newBalance: balance }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update balance');
      }

      onUpdateHouseBalance(data.newBalance);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update house balance:', error);
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg relative group">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">Total Bets</h3>
            <div className="relative ml-2">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                Total number of bets placed across all games
              </div>
            </div>
          </div>
          <p className="mt-1 text-xl font-semibold">{metrics.totalBets.toFixed(3)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg relative group">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">Total Amount Wagered</h3>
            <div className="relative ml-2">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                Total amount of SOL wagered by players
              </div>
            </div>
          </div>
          <p className="mt-1 text-xl font-semibold">{metrics.totalWagered.toFixed(3)} SOL</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg relative group">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">Total Lost (by Players)</h3>
            <div className="relative ml-2">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                Total amount lost by players in SOL
              </div>
            </div>
          </div>
          <p className="mt-1 text-xl font-semibold">{metrics.totalLost.toFixed(3)} SOL</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg relative group">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">Total Won (by Players)</h3>
            <div className="relative ml-2">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                Total amount won by players in SOL
              </div>
            </div>
          </div>
          <p className="mt-1 text-xl font-semibold">{metrics.totalWon.toFixed(3)} SOL</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg relative group">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">House Balance</h3>
            <div className="relative ml-2">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                Current house balance in SOL
              </div>
            </div>
          </div>
          <div className="flex items-center mt-1">
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-24 px-2 py-1 text-xl border rounded mr-2"
                  step="0.01"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSave}
                  className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span className="text-xl font-semibold">{metrics.houseBalance > 0 ? metrics.houseBalance.toFixed(3) : 0} SOL</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg relative group">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">Total Withdrawn</h3>
            <div className="relative ml-2">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                Total amount withdrawn by players in SOL
              </div>
            </div>
          </div>
          <p className="mt-1 text-xl font-semibold">{metrics.totalWithdrawn.toFixed(3)} SOL</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg relative group">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-500">Pending Withdrawals</h3>
            <div className="relative ml-2">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                Pending withdrawal requests and total amount
              </div>
            </div>
          </div>
          <p className="mt-1 text-xl font-semibold">{metrics.pendingWithdrawals.toFixed(3)} SOL, {metrics.pendingWithdrawalsCount} Requests</p>
        </div>
      </div>
    </div>
  );
};

export default AdminMetrics; 