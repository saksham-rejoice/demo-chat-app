import React from 'react';

interface MessageTicksProps {
  status: 'sent' | 'delivered' | 'read';
}

const MessageTicks: React.FC<MessageTicksProps> = ({ status }) => {
  return (
    <div className="flex items-center gap-1 mt-1 text-xs">
      {status === 'sent' && (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" className="text-white/70">
            <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          <span className="text-white/70">Sent</span>
        </>
      )}
      {status === 'delivered' && (
        <>
          <div className="flex text-white/90">
            <svg width="14" height="14" viewBox="0 0 16 16" className="-mr-1">
              <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          </div>
          <span className="text-white/90">Delivered</span>
        </>
      )}
      {status === 'read' && (
        <>
          <div className="flex text-blue-400">
            <svg width="14" height="14" viewBox="0 0 16 16" className="-mr-1">
              <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          </div>
          <span className="text-blue-400">Read</span>
        </>
      )}
    </div>
  );
};

export default MessageTicks;