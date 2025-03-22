import React, { useState } from 'react';
import { Edit2, Save } from 'lucide-react';

interface Metrics {
  totalBets: number;
  totalWagered: number;
  totalLost: number;
  totalWon: number;
  houseBalance: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
}

interface AdminMetricsProps {
  metrics: Metrics;
  onUpdateHouseBalance: (newBalance: number) => void;
}

const AdminMetrics: React.FC<AdminMetricsProps> = ({ metrics, onUpdateHouseBalance }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState(metrics.houseBalance.toString());

  const handleSave = () => {
    const balance = parseFloat(newBalance);
    if (!isNaN(balance)) {
      onUpdateHouseBalance(balance);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Bets</h3>
          <p className="mt-1 text-xl font-semibold">{metrics.totalBets.toFixed(3)}</p>
          <p className="text-xs text-gray-500">Number of bets placed across all games</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Amount Wagered</h3>
          <p className="mt-1 text-xl font-semibold">{metrics.totalWagered.toFixed(3)} SOL</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Lost (by Players)</h3>
          <p className="mt-1 text-xl font-semibold">{metrics.totalLost.toFixed(3)} SOL</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Won (by Players)</h3>
          <p className="mt-1 text-xl font-semibold">{metrics.totalWon.toFixed(3)} SOL</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">House Balance</h3>
          <div className="flex items-center mt-1">
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-24 px-2 py-1 text-xl border rounded mr-2"
                  step="0.01"
                />
                <button
                  onClick={handleSave}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Save className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span className="text-xl font-semibold">{metrics.houseBalance} SOL</span>
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

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Withdrawn</h3>
          <p className="mt-1 text-xl font-semibold">{metrics.totalWithdrawn.toFixed(3)} SOL</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Pending Withdrawals</h3>
          <p className="mt-1 text-xl font-semibold">{metrics.pendingWithdrawals.toFixed(3)} SOL</p>
        </div>
      </div>
    </div>
  );
};

export default AdminMetrics; 