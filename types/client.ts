import { IApp } from './app';

/**
 * Model definition for Client
 */
export interface IClient {
  id: string;
  name?: string;
  apps?: IApp[];
}
