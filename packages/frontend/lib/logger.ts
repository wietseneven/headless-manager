import Logger from 'headless-manager-client';
import { APP_KEY } from './constants';

const logger = new Logger({
  appId: APP_KEY,
  submitEnabled: true,
});

export default logger;
