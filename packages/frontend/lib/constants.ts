export const API_KEY = process.env.API_KEY || '';
export const JWT_COOKIE_KEY = process.env.JWT_COOKIE_KEY || 'hm-token';
export const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY || '';

const protectedConstants = [API_KEY];
if (typeof window !== 'undefined') {
  const filteredConstants = protectedConstants.filter((c) => c);
  if (filteredConstants.length) throw new Error('Protected variables exposed!');
}
