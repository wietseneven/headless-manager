import qs from 'qs';
import { API_KEY, API_URL, JWT_COOKIE_KEY } from './constants';
import Cookies from 'js-cookie';
import logger from './logger';

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = '') {
  return `${API_URL}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  const jwt = Cookies.get(JWT_COOKIE_KEY);
  // Merge default and user options
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...((API_KEY || jwt) && {
        Authorization: `Bearer ${API_KEY || jwt}`,
      }),
    },
    ...options,
  };

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ''}`
  )}`;

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);
  let data;
  // Handle response
  if (!response.ok) {
    try {
      data = await response.json();
    } catch (e) {
      logger.error('fetchApi', `Failed to fetch`, requestUrl);
      throw new Error(`An error occured please try again`);
    }
    const errorMessage =
      data?.error?.message || `An error occured please try again`;
    logger.error('fetchApi', `Failed to fetch`, requestUrl, errorMessage);
    throw new Error(errorMessage);
  }
  data = await response.json();
  return data;
}
