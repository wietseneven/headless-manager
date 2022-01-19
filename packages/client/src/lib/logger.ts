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

type VitalData = VitalsMetric & {
  origin?: string;
  pathname?: string;
}

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
  labelUrl: string;

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
    this.labelUrl = options.apiUrl || 'http://localhost:1337';
    const globalFetch = (typeof window !== 'undefined') ? fetch : global.fetch;
    this.fetchInstance = options.fetchInstance || globalFetch;
  }

  private static print(level: LOG_LEVEL, label: string, ...messages: MESSAGES | unknown[]) {
    switch (level) {
      case 'info':
        console.info(`%c Info [${label}]:`, 'background: blue; color: white;', ...messages);
        break;
      case 'warn':
        console.warn(`%c Warning [${label}]:`, 'background: orange; color: white;', ...messages);
        break;
      case 'error':
        console.error(`%c Error: [${label}]`, 'background: red; color: white;', ...messages);
        break;
      case 'debug':
      default:
        console.log(`%c ${level} [${label}]:`, 'background: green; color: white;', ...messages);
    }
  }

  private doFetch = async (route: 'messages' | 'vitals', body: any) => {
    const url = `${this.labelUrl}/api/${route}`;
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
      if (this.isDev) Logger.print('error', 'doFetch', e);
    }
  }

  private submit(level: LOG_LEVEL, label: string, ...messages: MESSAGES) {
    const data = {
      level,
      label,
      message: messages.join(', '),
    };
    this.doFetch('messages', data);
  }

  private log(level: LOG_LEVEL, label: string, ...messages: MESSAGES) {
    if (this.clientEnabled) Logger.print(level, label, ...messages);
    if (this.submitEnabled) this.submit(level, label, ...messages);
  }

  private sendVital(vital: VitalData) {
    if (!this.submitEnabled) return;
    const data = {
      nextId: vital.id,
      startTime: vital.startTime,
      value: vital.value,
      label: vital.label,
      name: vital.name,
      pathname: vital.pathname,
      origin: vital.origin,
    }
    this.doFetch('vitals', data);
  }

  error = (label: string, ...messages: MESSAGES) => this.log('error', label, ...messages);
  warn = (label: string, ...messages: MESSAGES) => this.log('warn', label, ...messages);
  info = (label: string, ...messages: MESSAGES) => this.log('info', label, ...messages);
  http = (label: string, ...messages: MESSAGES) => this.log('http', label, ...messages);
  verbose = (label: string, ...messages: MESSAGES) => this.log('verbose', label, ...messages);
  debug = (label: string, ...messages: MESSAGES) => this.log('debug', label, ...messages);
  silly = (label: string, ...messages: MESSAGES) => this.log('silly', label, ...messages);

  vital = (vital: VitalData) => this.sendVital(vital);
}
