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
            const url = `${this.baseUrl}/api/${route}`;
            const data = Object.assign(Object.assign({}, body), { app: this.appId, createdAt: new Date() });
            try {
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(url, JSON.stringify({ data }));
                }
                else {
                    yield fetch(url, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({ data }),
                    });
                }
            }
            catch (e) {
                if (this.isDev)
                    Logger.print('error', e);
            }
        });
        this.error = (...messages) => this.log('error', ...messages);
        this.warn = (...messages) => this.log('warn', ...messages);
        this.info = (...messages) => this.log('info', ...messages);
        this.http = (...messages) => this.log('http', ...messages);
        this.verbose = (...messages) => this.log('verbose', ...messages);
        this.debug = (...messages) => this.log('debug', ...messages);
        this.silly = (...messages) => this.log('silly', ...messages);
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
        this.baseUrl = options.apiUrl || 'http://localhost:1337';
        const globalFetch = (typeof window !== 'undefined') ? fetch : global.fetch;
        this.fetchInstance = options.fetchInstance || globalFetch;
    }
    static print(level, ...messages) {
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
    submit(level, ...messages) {
        const data = {
            level,
            message: messages.join(', '),
        };
        this.doFetch('messages', data);
    }
    log(level, ...messages) {
        if (this.clientEnabled)
            Logger.print(level, ...messages);
        if (this.submitEnabled)
            this.submit(level, ...messages);
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
