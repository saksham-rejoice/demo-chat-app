import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logActivityAsync } from '../store/slices/instagramSlice';
import { ActivityLogRequest } from '../types/instagram';

const ActivityLogger: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.instagram.activityLog);

  const handleLogActivity = async (data: ActivityLogRequest) => {
    try {
      await dispatch(logActivityAsync(data)).unwrap();
      console.log('Activity logged successfully');
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  // Example usage
  const logLoginActivity = () => {
    handleLogActivity({
      type: 'LOGIN',
      metadata: { timestamp: new Date().toISOString() }
    });
  };

  const logFollowActivity = (targetUserId: string) => {
    handleLogActivity({
      type: 'FOLLOW',
      targetUser: targetUserId
    });
  };

  return (
    <div>
      <button onClick={logLoginActivity} disabled={loading}>
        {loading ? 'Logging...' : 'Log Login Activity'}
      </button>
      
      <button onClick={() => logFollowActivity('user123')} disabled={loading}>
        {loading ? 'Logging...' : 'Log Follow Activity'}
      </button>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default ActivityLogger;