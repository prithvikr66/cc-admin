import React from 'react';
import { WithdrawalStatus } from '../types/withdrawal';

interface StatusBadgeProps {
  status: WithdrawalStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: WithdrawalStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;