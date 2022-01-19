export const API_KEY = process.env.API_KEY || '';
export const JWT_COOKIE_KEY = process.env.JWT_COOKIE_KEY || 'hm-token';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';
export const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY || '';
export const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
export const LOGGER_API_URL = process.env.NEXT_PUBLIC_LOGGER_API_URL || '';

const protectedConstants = [API_KEY];
if (typeof window !== 'undefined') {
  const filteredConstants = protectedConstants.filter((c) => c);
  if (filteredConstants.length) throw new Error('Protected variables exposed!');
}
