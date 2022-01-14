"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const axios_1 = __importDefault(require("axios"));
class Logger {
    constructor(options) {
        this.error = (...messages) => this.log('error', ...messages);
        this.warn = (...messages) => this.log('warn', ...messages);
        this.info = (...messages) => this.log('info', ...messages);
        this.http = (...messages) => this.log('http', ...messages);
        this.verbose = (...messages) => this.log('verbose', ...messages);
        this.debug = (...messages) => this.log('debug', ...messages);
        this.silly = (...messages) => this.log('silly', ...messages);
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
        this.fetchInstance = axios_1.default.create({
            baseURL: options.apiUrl || 'http://localhost:1337',
            headers: {
                'content-type': 'application/json',
                'x-app-key': options.appId,
            }
        });
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
        this.fetchInstance.post(`/api/messages`, {
            data: {
                level,
                message: messages.join(', '),
            }
        });
    }
    log(level, ...messages) {
        if (this.clientEnabled)
            Logger.print(level, ...messages);
        if (this.submitEnabled)
            this.submit(level, ...messages);
    }
}
exports.Logger = Logger;
