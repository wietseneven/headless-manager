import axios, {AxiosInstance} from 'axios';

type LOG_LEVEL = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
type MESSAGES = string[];

interface LOGGER_OPTIONS {
  appId: string;
  apiUrl?: string;
  enabled?: boolean;
  clientEnabled?: boolean;
  submitEnabled?: boolean;
}

export class Logger {
  isDev: boolean;
  clientEnabled: boolean;
  submitEnabled: boolean;
  fetchInstance: AxiosInstance;

  constructor(options: LOGGER_OPTIONS) {
    if (!options.appId && options.submitEnabled) {
      throw new Error('No appId provided!');
    }
    this.isDev = process.env.NODE_ENV !== 'production';
    this.clientEnabled = this.isDev
      ? typeof options.clientEnabled === 'boolean'
        ? options.clientEnabled
        : true
      : false;
    this.submitEnabled = options.appId && options.submitEnabled ? options.submitEnabled : false;
    this.fetchInstance = axios.create({
      baseURL: options.apiUrl || 'http://localhost:1337',
      headers: {
        'content-type': 'application/json',
        'x-app-key': options.appId,
      }
    })
  }

  private static print(level: LOG_LEVEL, ...messages: MESSAGES) {
    switch (level) {
      case 'info':
        console.info('%c Info:', 'background: blue; color: white;', ...messages);
        break;
      case 'warn':
        console.warn('%c Warning:', 'background: orange; color: white;', ...messages);
        break;
      case 'error':
        console.error('%c Error:', 'background: red; color: white;', ...messages);
        break;
      case 'debug':
      default:
        console.log(`%c ${level}:`, 'background: green; color: white;', ...messages);
    }
  }

  private submit(level: LOG_LEVEL, ...messages: MESSAGES) {
    this.fetchInstance.post(`/api/messages`, {
        data: {
          level,
          message: messages.join(', '),
        }
    })
  }

  private log(level: LOG_LEVEL, ...messages: MESSAGES) {
    if (this.clientEnabled) Logger.print(level, ...messages);
    if (this.submitEnabled) this.submit(level, ...messages);
  }

  error = (...messages: MESSAGES) => this.log('error', ...messages);
  warn = (...messages: MESSAGES) => this.log('warn', ...messages);
  info = (...messages: MESSAGES) => this.log('info', ...messages);
  http = (...messages: MESSAGES) => this.log('http', ...messages);
  verbose = (...messages: MESSAGES) => this.log('verbose', ...messages);
  debug = (...messages: MESSAGES) => this.log('debug', ...messages);
  silly = (...messages: MESSAGES) => this.log('silly', ...messages);
}
