import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';

import { Log } from '../Log/Log';

interface HttpServerConfiguration {
    'log' : Log;
    'express' : express.Express;
    'productionFlag' ?: boolean;
    'redirectFlag' ?: boolean;
    'ipAddress' : string;
    'hostname' : string;
    'portHttp' ?: number;
    'portHttps' ?: number;
    'sslCertificatePath' ?: string;
    'sslPrivateKeyPath' ?: string;
    'sslCertificateAuthorityPath' ?: string;
};

interface ErrnoException extends Error {
    'errno' ?: string;
    'code' ?: string;
    'path' ?: string;
    'syscall' ?: string;
    'stack' ?: string;
};

/**
 * HttpServer v2.0.1
 */
export default class HttpServer {
    private _express : express.Express;
    private _log : Log;

    private _server : http.Server | https.Server;
    private _serverRedirect : http.Server;

    private _productionFlag = false;
    private _redirectFlag = true;

    private _httpsOptions : https.ServerOptions;
    private _sslCertificatePath : string;
    private _sslPrivateKeyPath : string;
    private _sslCertificateAuthorityPath : string;

    private _portHttp = 80;
    private _portHttps = 443;

    private _ipAddress : string;
    private _hostname : string;

    public constructor(configuration : HttpServerConfiguration) {
        this._express = configuration.express;
        this._log = configuration.log;

        if (configuration.productionFlag != null)
            this._productionFlag = configuration.productionFlag;

        if (!(configuration.productionFlag)) this._redirectFlag = false;

        else if (configuration.redirectFlag != null)
            this._redirectFlag = configuration.redirectFlag;

        if (configuration.sslCertificatePath) 
            this._sslCertificatePath = configuration.sslCertificatePath;

        if (configuration.sslPrivateKeyPath) 
            this._sslPrivateKeyPath = configuration.sslPrivateKeyPath;

        if (configuration.sslCertificateAuthorityPath) 
            this._sslCertificateAuthorityPath = configuration.sslCertificateAuthorityPath;

        if (configuration.portHttp) this._portHttp = configuration.portHttp;
        if (configuration.portHttps) this._portHttps = configuration.portHttps;

        this._ipAddress = configuration.ipAddress;
        this._hostname = configuration.hostname;

        this._initialise();
    };

    private _initialise() : void {
        if (this._productionFlag) {
            this._express.set('port', this._portHttps);

            try {
                this._httpsOptions = {
                    'cert': fs.readFileSync(this._sslCertificatePath),
                    'key': fs.readFileSync(this._sslPrivateKeyPath),
                    'ca': fs.readFileSync(this._sslCertificateAuthorityPath),
                };

            } catch(error) {
                this._log.fatal('Unable to load SSL certificate files.');
            }

            this._server = https.createServer(this._httpsOptions, this._express);
            this._server.listen(this._portHttps, this._ipAddress);

            this._server.on('listening', () => this._log.trace(
                `HTTPS server started listening on ${this._ipAddress}:${this._portHttps}.`
            ));
        }

        else {
            this._express.set('port', this._portHttp);
            this._server = http.createServer(this._express);
            this._server.listen(this._portHttp);

            this._server.on('listening', () => this._log.trace(
                `HTTP server started listening on ${this._ipAddress}:${this._portHttp}.`
            ));
        }

        if (this._redirectFlag) {
            this._serverRedirect = http.createServer((request, response) => {
                response.writeHead(301, { 'Location': `https://${this._hostname}${request.url}` });
                response.end();
            });

            this._serverRedirect.listen(this._portHttp);

            this._serverRedirect.on('listening', () => this._log.trace(
                `Redirect HTTP server started listening on ${this._ipAddress}:${this._portHttp}.`
            ));

            this._serverRedirect.on('error', error => this._errorCallback(error));
        }

        this._server.on('error', (error) => this._errorCallback(error));

        this._log.trace('HttpServer initialised.');
    };

    private _errorCallback(error : ErrnoException) : void {
        if (error.code === 'EACCES')
            this._log.fatal(
                `Ports ${this._portHttp} and/or ${this._portHttps} requires elevated privileges.`
            );

        else if (error.code === 'EADDRINUSE')
            this._log.fatal(
                `Ports ${this._portHttp} and/or ${this._portHttps} are already in use.`
            );

        else this._log.fatal(error.toString());
    };
};