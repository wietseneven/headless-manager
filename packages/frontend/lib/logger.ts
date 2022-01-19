import Logger from 'headless-manager-client';
import { APP_KEY, LOGGER_API_URL } from './constants';

const logger = new Logger({
  appId: APP_KEY,
  apiUrl: LOGGER_API_URL,
  submitEnabled: true,
});

export default logger;
