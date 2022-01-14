import Logger from '../../client';
import { APP_KEY } from './constants';

const logger = new Logger({
  appId: APP_KEY,
  submitEnabled: true,
});

export default logger;
