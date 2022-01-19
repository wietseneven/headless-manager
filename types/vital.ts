import { IApp } from './app';

/**
 * Model definition for Vital
 */
export interface IVital {
  id: string;
  nextId?: string;
  startTime?: number;
  value?: number;
  label?: string;
  name?: string;
  app?: IApp;
  origin?: string;
  pathname?: string;
}
