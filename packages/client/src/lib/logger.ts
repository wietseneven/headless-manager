type LOG_LEVEL = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
type MESSAGES = string[];

type VitalsMetric = {
  id: string;
  startTime: number;
  value: number;
} & ({
  label: 'web-vital';
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB';
} | {
  label: 'custom';
  name: 'Next.js-hydration' | 'Next.js-route-change-to-render' | 'Next.js-render';
});

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

interface LOGGER_OPTIONS {
  appId: string;
  apiUrl?: string;
  enabled?: boolean;
  clientEnabled?: boolean;
  submitEnabled?: boolean;
  fetchInstance?: Fetch;
}

export class Logger {
  appId: string;
  isDev: boolean;
  clientEnabled: boolean;
  submitEnabled: boolean;
  fetchInstance: Fetch;
  baseUrl: string;

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
    this.appId = options.appId;
    this.baseUrl = options.apiUrl || 'http://localhost:1337';
    const globalFetch = (typeof window !== 'undefined') ? fetch : global.fetch;
    this.fetchInstance = options.fetchInstance || globalFetch;
  }

  private static print(level: LOG_LEVEL, ...messages: MESSAGES | unknown[]) {
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

  private doFetch = async (route: 'messages' | 'vitals', body: any) => {
    const url = `${this.baseUrl}/api/${route}`;
    const data = {
      ...body,
      app: this.appId,
      createdAt: new Date(),
    }

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          url,
          JSON.stringify({ data })
        );
      } else {
        await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ data }),
        })
      }
    } catch (e) {
      if (this.isDev) Logger.print('error', e);
    }
  }

  private submit(level: LOG_LEVEL, ...messages: MESSAGES) {
    const data = {
      level,
      message: messages.join(', '),
    };
    this.doFetch('messages', data);
  }

  private log(level: LOG_LEVEL, ...messages: MESSAGES) {
    if (this.clientEnabled) Logger.print(level, ...messages);
    if (this.submitEnabled) this.submit(level, ...messages);
  }

  private sendVital(vital: VitalsMetric) {
    if (!this.submitEnabled) return;
    const data = {
      nextId: vital.id,
      startTime: vital.startTime,
      value: vital.value,
      label: vital.label,
      name: vital.name,
    }
    this.doFetch('vitals', data);
  }

  error = (...messages: MESSAGES) => this.log('error', ...messages);
  warn = (...messages: MESSAGES) => this.log('warn', ...messages);
  info = (...messages: MESSAGES) => this.log('info', ...messages);
  http = (...messages: MESSAGES) => this.log('http', ...messages);
  verbose = (...messages: MESSAGES) => this.log('verbose', ...messages);
  debug = (...messages: MESSAGES) => this.log('debug', ...messages);
  silly = (...messages: MESSAGES) => this.log('silly', ...messages);

  vital = (vital: VitalsMetric) => this.sendVital(vital);
}
