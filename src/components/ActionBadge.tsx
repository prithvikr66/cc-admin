import React from 'react';
import { ActionType } from '../types/withdrawal';

interface ActionBadgeProps {
  action: ActionType;
}

const ActionBadge: React.FC<ActionBadgeProps> = ({ action }) => {
  const getActionStyles = (action: ActionType) => {
    switch (action) {
      case 'win':
        return 'bg-emerald-100 text-emerald-800';
      case 'lose':
        return 'bg-purple-100 text-purple-800';
      case 'withdraw':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionStyles(
        action
      )}`}
    >
      {action}
    </span>
  );
};

export default ActionBadge;