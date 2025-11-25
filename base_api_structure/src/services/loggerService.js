import { loggerQueue } from "../config/redis.js";
import Logger from "../models/Logger.js";

console.log('Logger service initialized');

// Queue processor - process one job at a time
loggerQueue.process(1, async (job) => {
  try {
    console.log('Processing log job:', job.id, job.data);
    const { level, message, userId, action, metadata, ip, userAgent } = job.data;
    
    // Validate required fields
    if (!level || !message) {
      throw new Error('Level and message are required fields');
    }
    
    const log = new Logger({
      level,
      message,
      userId: userId || null,
      action: action || null,
      metadata: metadata || {},
      ip: ip || null,
      userAgent: userAgent || null
    });
    
    const savedLog = await log.save();
    console.log('Log saved successfully:', savedLog._id);
    return savedLog;
  } catch (error) {
    console.error('Error processing log job:', error);
    throw error;
  }
});

// Error handling
loggerQueue.on('failed', (job, err) => {
  console.error('Log job failed:', job.id, err.message);
});

loggerQueue.on('completed', (job) => {
  console.log('Log job completed:', job.id);
});

// Logger function to add jobs to queue
export const addLog = async (logData) => {
  try {
    console.log('Adding log to queue:', logData);
    const job = await loggerQueue.add(logData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false
    });
    console.log('Log job added:', job.id);
    return job;
  } catch (error) {
    console.error('Error adding log to queue:', error);
    throw error;
  }
};

// Helper functions with proper field mapping
export const logInfo = (message, data = {}) => {
  const { userId, action, ip, userAgent, ...metadata } = data;
  return addLog({ 
    level: "info", 
    message, 
    userId, 
    action, 
    metadata, 
    ip, 
    userAgent 
  });
};

export const logWarn = (message, data = {}) => {
  const { userId, action, ip, userAgent, ...metadata } = data;
  return addLog({ 
    level: "warn", 
    message, 
    userId, 
    action, 
    metadata, 
    ip, 
    userAgent 
  });
};

export const logError = (message, data = {}) => {
  const { userId, action, ip, userAgent, ...metadata } = data;
  return addLog({ 
    level: "error", 
    message, 
    userId, 
    action, 
    metadata, 
    ip, 
    userAgent 
  });
};

export const logDebug = (message, data = {}) => {
  const { userId, action, ip, userAgent, ...metadata } = data;
  return addLog({ 
    level: "debug", 
    message, 
    userId, 
    action, 
    metadata, 
    ip, 
    userAgent 
  });
};

// Error logging helper
export const logCatchError = (error, context = {}) => {
  const { userId, action, ip, userAgent, ...metadata } = context;
  return logError(`Error: ${error.message}`, {
    userId,
    action,
    ip,
    userAgent,
    metadata: {
      stack: error.stack,
      ...metadata
    }
  });
};