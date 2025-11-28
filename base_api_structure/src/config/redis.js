import Queue from "bull";

const REDIS_URL = "redis://default:pwAtbMAH1KOO2v2bh7BXrFSA75DDrdqo@redis-16587.c257.us-east-1-3.ec2.cloud.redislabs.com:16587";

export const loggerQueue = new Queue("logger queue", REDIS_URL);

// Test Redis connection
loggerQueue.on('ready', () => {
  console.log('Logger queue is ready and connected to Redis');
});

loggerQueue.on('error', (error) => {
  console.error('Logger queue error:', error);
});