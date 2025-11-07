import React from 'react';

interface MessageTicksProps {
  status: 'sent' | 'delivered' | 'read';
}

const MessageTicks: React.FC<MessageTicksProps> = ({ status }) => {
  const getTickColor = () => {
    switch (status) {
      case 'sent':
        return 'text-gray-400';
      case 'delivered':
        return 'text-gray-300';
      case 'read':
        return 'text-blue-300';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`flex items-center mt-1 ${getTickColor()}`}>
      {status === 'sent' && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>
      )}
      {status === 'delivered' && (
        <div className="flex">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="-mr-1">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        </div>
      )}
      {status === 'read' && (
        <div className="flex text-blue-300">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="-mr-1">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default MessageTicks;