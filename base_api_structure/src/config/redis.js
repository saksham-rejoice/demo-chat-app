import Queue from "bull";

const REDIS_URL = "redis://default:dKoAuDZOa5SGVevdqutroqPb3vbFGlhX@redis-12737.crce206.ap-south-1-1.ec2.cloud.redislabs.com:12737";

export const loggerQueue = new Queue("logger queue", REDIS_URL);

// Test Redis connection
loggerQueue.on('ready', () => {
  console.log('Logger queue is ready and connected to Redis');
});

loggerQueue.on('error', (error) => {
  console.error('Logger queue error:', error);
});