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
declare type VitalData = VitalsMetric & {
    origin?: string;
    pathname?: string;
};
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
    labelUrl: string;
    constructor(options: LOGGER_OPTIONS);
    private static print;
    private doFetch;
    private submit;
    private log;
    private sendVital;
    error: (label: string, ...messages: MESSAGES) => void;
    warn: (label: string, ...messages: MESSAGES) => void;
    info: (label: string, ...messages: MESSAGES) => void;
    http: (label: string, ...messages: MESSAGES) => void;
    verbose: (label: string, ...messages: MESSAGES) => void;
    debug: (label: string, ...messages: MESSAGES) => void;
    silly: (label: string, ...messages: MESSAGES) => void;
    vital: (vital: VitalData) => void;
}
export {};
