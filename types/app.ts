import { IClient } from './client';
import { IMessage } from './message';
import { IVital } from './vital';

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
  vitals?: IVital[];
}
