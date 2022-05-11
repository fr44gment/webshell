import express from 'express';
import { Log } from '../Log/Log.js';

interface Dictionary<TValue> { [id : string]: TValue; };

interface HttpHeaderConfiguration {
    'log' : Log;
    'setHeaders' ?: Dictionary<string>;
    'removeHeaders' ?: Array<string>;
};

export default class HttpHeader {
    private _log : Log;
    private _setHeaders : Dictionary<string> = { };
    private _removeHeaders : Array<string> = [
        'X-Powered-By',
    ];

    private static readonly DEFAULT_HEADER_LOOKUP : Dictionary<string> = {
        'Referrer-Policy': 'no-referrer',

        'X-XSS-Protection': '1; mode=block',

        'Strict-Transport-Security': 'max-age=31536000; preload',

        'X-Frame-Options': 'SAMEORIGIN',

        'X-Content-Type-Options': 'nosniff',

        // 'Content-Security-Policy': `default-src 'none'; `
        //     + `script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com http://bat.bing.com https://bat.bing.com; `
        //     + `style-src 'self' http://bat.bing.com https://bat.bing.com 'unsafe-inline'; `
        //     + `img-src 'self' https://www.googletagmanager.com https://www.google-analytics.com http://bat.bing.com https://bat.bing.com; `
        //     + `font-src 'self'; `
        //     + `connect-src 'self' https://www.google-analytics.com; `
        //     + `frame-src 'self' https://snazzymaps.com https://www.googletagmanager.com;`
        //     + `manifest-src 'self';`,

        // 'Permissions-Policy': 'accelerometer=(), '
        //     + 'ambient-light-sensor=(), '
        //     + 'autoplay=(), '
        //     + 'battery=(), '
        //     + 'camera=(), '
        //     + 'cross-origin-isolated=(), '
        //     + 'display-capture=(), '
        //     + 'document-domain=(), '
        //     + 'encrypted-media=(), '
        //     + 'execution-while-not-rendered=(self), '
        //     + 'execution-while-out-of-viewport=(self), '
        //     + 'fullscreen=(self), '
        //     + 'geolocation=(), '
        //     + 'gyroscope=(), '
        //     + 'magnetometer=(), '
        //     + 'microphone=(), '
        //     + 'midi=(), '
        //     + 'navigation-override=(self), '
        //     + 'payment=(), '
        //     + 'picture-in-picture=(), '
        //     + 'publickey-credentials-get=(), '
        //     + 'screen-wake-lock=(), '
        //     + 'sync-xhr=(), '
        //     + 'usb=(), '
        //     + 'web-share=(), '
        //     + 'xr-spatial-tracking=()',

            // https://developers.google.com/web/updates/2018/09/reportingapi
    };

    public constructor(configuration : HttpHeaderConfiguration) {
        this._log = configuration.log;

        if (configuration.setHeaders) this._setHeaders = configuration.setHeaders;
        if (configuration.removeHeaders) this._removeHeaders = configuration.removeHeaders;

        this._log.trace('HttpHeader initialised.');
    };

    public set(headerKey : string, headerValue : string) : void {
        this._setHeaders[headerKey] = headerValue;

        this._removeHeaders = this._removeHeaders.filter(header => header !== headerKey);
    };

    public remove(headerKey : string) : void {
        if (!(this._removeHeaders.includes(headerKey))) this._removeHeaders.push(headerKey);

        delete this._setHeaders[headerKey];
    };

    public apply = (request : express.Request, response : express.Response, next : express.NextFunction) : void => {
        const headers = Object.assign({ }, HttpHeader.DEFAULT_HEADER_LOOKUP, this._setHeaders);

        Object.entries(headers).forEach(headerPair => response.header(headerPair[0], headerPair[1]));

        this._removeHeaders.forEach(headerKey => response.removeHeader(headerKey));

        next();
    };
};