import React from 'react';
import { WithdrawalRequest, BulkAction } from '../types/withdrawal';
import StatusBadge from './StatusBadge';
import ActionBadge from './ActionBadge';
import Pagination from './Pagination';
import BulkActions from './BulkActions';

interface WithdrawalTableProps {
  requests: WithdrawalRequest[];
  isProcessing: boolean;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onBulkAction?: (action: BulkAction, ids: string[]) => void;
}

const WithdrawalTable: React.FC<WithdrawalTableProps> = ({
  requests,
  isProcessing,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  onBulkAction,
}) => {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(paginatedRequests.map(r => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleBulkAction = (action: BulkAction) => {
    onBulkAction?.(action, Array.from(selectedRows));
    setSelectedRows(new Set()); // Clear selection after action
  };

  // Reset selection when page changes
  React.useEffect(() => {
    setSelectedRows(new Set());
  }, [currentPage, itemsPerPage]);

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200">
        <BulkActions
          selectedCount={selectedRows.size}
          isProcessing={isProcessing}
          onAction={handleBulkAction}
          disabled={selectedRows.size === 0}
        />
      </div>
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={paginatedRequests.length > 0 && selectedRows.size === paginatedRequests.length}
                onChange={handleSelectAll}
              />
            </th>
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
          {paginatedRequests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap w-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedRows.has(request.id)}
                  onChange={() => handleSelectRow(request.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {request.walletAddress}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.amount.toFixed(8)} SOL
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.timestamp.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ActionBadge action={request.action} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={request.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={requests.length}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};

export default WithdrawalTable;