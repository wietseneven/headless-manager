import { AxiosInstance } from 'axios';
declare type MESSAGES = string[];
interface LOGGER_OPTIONS {
    appId: string;
    apiUrl?: string;
    enabled?: boolean;
    clientEnabled?: boolean;
    submitEnabled?: boolean;
}
export declare class Logger {
    isDev: boolean;
    clientEnabled: boolean;
    submitEnabled: boolean;
    fetchInstance: AxiosInstance;
    constructor(options: LOGGER_OPTIONS);
    private static print;
    private submit;
    private log;
    error: (...messages: MESSAGES) => void;
    warn: (...messages: MESSAGES) => void;
    info: (...messages: MESSAGES) => void;
    http: (...messages: MESSAGES) => void;
    verbose: (...messages: MESSAGES) => void;
    debug: (...messages: MESSAGES) => void;
    silly: (...messages: MESSAGES) => void;
}
export {};
