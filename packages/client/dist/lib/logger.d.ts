declare type MESSAGES = string[];
declare type VitalsMetric = {
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
declare type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
interface LOGGER_OPTIONS {
    appId: string;
    apiUrl?: string;
    enabled?: boolean;
    clientEnabled?: boolean;
    submitEnabled?: boolean;
    fetchInstance?: Fetch;
}
export declare class Logger {
    appId: string;
    isDev: boolean;
    clientEnabled: boolean;
    submitEnabled: boolean;
    fetchInstance: Fetch;
    baseUrl: string;
    constructor(options: LOGGER_OPTIONS);
    private static print;
    private doFetch;
    private submit;
    private log;
    private sendVital;
    error: (...messages: MESSAGES) => void;
    warn: (...messages: MESSAGES) => void;
    info: (...messages: MESSAGES) => void;
    http: (...messages: MESSAGES) => void;
    verbose: (...messages: MESSAGES) => void;
    debug: (...messages: MESSAGES) => void;
    silly: (...messages: MESSAGES) => void;
    vital: (vital: VitalsMetric) => void;
}
export {};
