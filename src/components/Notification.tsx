import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-white" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-white" />;
      case 'info':
        return <AlertCircle className="h-5 w-5 text-white" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'info':
        return 'bg-blue-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`${getBackgroundColor()} rounded-lg shadow-lg p-4 flex items-center space-x-3`}>
        {getIcon()}
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Notification;