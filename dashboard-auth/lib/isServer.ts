// Method 1: Check if window is undefined
export const isServer = typeof window === 'undefined';

// Method 2: Check if document is undefined
export const isServerByDocument = typeof document === 'undefined';

// Method 3: Check if we're in browser environment
export const isBrowser = typeof window !== 'undefined';

// Method 4: More comprehensive check
export const getEnvironment = () => {
  if (typeof window === 'undefined') {
    return 'server';
  }
  return 'client';
};

// Method 5: React-specific check
export const isSSR = () => {
  return typeof window === 'undefined' || !window.document;
};

// Global logger utility
export const logEnvironment = (context?: string) => {
  const env = isServer ? 'SERVER' : 'CLIENT';
  const message = context ? `[${env}] ${context}` : `[${env}] Environment detected`;
  console.log(message);
};

// Auto-initialize global logging
logEnvironment('Application initialized');