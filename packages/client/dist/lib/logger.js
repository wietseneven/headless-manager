"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(options) {
        this.doFetch = (route, body) => __awaiter(this, void 0, void 0, function* () {
            const url = `${this.labelUrl}/api/${route}`;
            const data = Object.assign(Object.assign({}, body), { app: this.appId, createdAt: new Date() });
            try {
                if (typeof navigator !== 'undefined' && (navigator === null || navigator === void 0 ? void 0 : navigator.sendBeacon)) {
                    navigator.sendBeacon(url, JSON.stringify({ data }));
                }
                else {
                    let isAxios = false;
                    if ("Axios" in this.fetchInstance) {
                        isAxios = !!this.fetchInstance.Axios;
                    }
                    if (isAxios && "post" in this.fetchInstance) {
                        yield this.fetchInstance.post(url, { data });
                    }
                    else {
                        yield this.fetchInstance(url, {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({ data }),
                        });
                    }
                }
            }
            catch (e) {
                if (this.isDev)
                    Logger.print('error', 'doFetch', e);
            }
        });
        this.error = (label, ...messages) => this.log('error', label, ...messages);
        this.warn = (label, ...messages) => this.log('warn', label, ...messages);
        this.info = (label, ...messages) => this.log('info', label, ...messages);
        this.http = (label, ...messages) => this.log('http', label, ...messages);
        this.verbose = (label, ...messages) => this.log('verbose', label, ...messages);
        this.debug = (label, ...messages) => this.log('debug', label, ...messages);
        this.silly = (label, ...messages) => this.log('silly', label, ...messages);
        this.vital = (vital) => this.sendVital(vital);
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
        const globalFetch = (typeof window !== 'undefined' && typeof fetch !== 'undefined') ? fetch : global.fetch;
        this.fetchInstance = options.fetchInstance || globalFetch;
    }
    static print(level, label, ...messages) {
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
    submit(level, label, ...messages) {
        const data = {
            level,
            label,
            message: messages.join(', '),
        };
        this.doFetch('messages', data);
    }
    log(level, label, ...messages) {
        if (this.clientEnabled)
            Logger.print(level, label, ...messages);
        if (this.submitEnabled)
            this.submit(level, label, ...messages);
    }
    sendVital(vital) {
        if (!this.submitEnabled)
            return;
        const data = {
            nextId: vital.id,
            startTime: vital.startTime,
            value: vital.value,
            label: vital.label,
            name: vital.name,
            pathname: vital.pathname,
            origin: vital.origin,
        };
        this.doFetch('vitals', data);
    }
}
exports.Logger = Logger;
