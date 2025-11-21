import { getCookie, deleteCookie } from './cookieUtils';

export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  localStorage.removeItem('user');
};

export const validateAndRedirect = (): void => {
  if (typeof window === 'undefined') return;
  
  const token = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');
  
  if (!token && !refreshToken) {
    clearTokens();
    window.location.href = '/login';
    return;
  }
  
  if (token && isTokenExpired(token) && !refreshToken) {
    clearTokens();
    window.location.href = '/login';
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');
  
  if (!token && !refreshToken) {
    return false;
  }
  
  if (!token || isTokenExpired(token)) {
    if (!refreshToken) {
      clearTokens();
      window.location.href = '/login';
      return false;
    }
    return true;
  }
  
  return true;
};