import { IClient } from './client';
import { IMessage } from './message';

/**
 * Model definition for App
 */
export interface IApp {
  id: string;
  name?: string;
  uid?: string;
  messages?: IMessage[];
  client?: IClient;
  key?: string;
  channel?: string;
  fathomSiteId?: string;
  repository?: string;
}
