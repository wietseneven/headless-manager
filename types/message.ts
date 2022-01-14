import { IApp } from './app';

/**
 * Model definition for Message
 */
export interface IMessage {
  id: string;
  level: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
  message?: string;
  app?: IApp;
  ip?: string;
  label?: string;
}
