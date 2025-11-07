export const isAuthEnabled = () => {
  return process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
};