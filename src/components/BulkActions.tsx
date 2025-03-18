import React from 'react';
import { Check, X, Eye } from 'lucide-react';
import { BulkAction } from '../types/withdrawal';

interface BulkActionsProps {
  selectedCount: number;
  isProcessing: boolean;
  onAction: (action: BulkAction) => void;
  disabled: boolean;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, isProcessing, onAction, disabled }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </span>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onAction('approve')}
          disabled={disabled || isProcessing}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="h-4 w-4 mr-1.5" />
          {isProcessing ? 'Processing...' : 'Approve'}
        </button>
        <button
          onClick={() => onAction('reject')}
          disabled={disabled || isProcessing}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-4 w-4 mr-1.5" />
          Reject
        </button>
        <button
          onClick={() => onAction('review')}
          disabled={disabled || isProcessing}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye className="h-4 w-4 mr-1.5" />
          Review
        </button>
      </div>
    </div>
  );
};

export default BulkActions;