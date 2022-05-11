import express from 'express';
import { DIRECTORY, ENVIRONMENT, SERVER, ROUTE, LOGGING } from './config.js';

import HttpServer from './lib/HttpServer/HttpServer.js';
import HttpHeader from './lib/HttpHeader/HttpHeader.js';
import ExpressRouter from './lib/ExpressRouter/ExpressRouter.js';
import { Log } from './lib/Log/Log.js';

import outputRouter from './route/output.js';

const server = express();


new Log('main', {
    'primaryText': LOGGING.PRIMARY_TEXT,
    'primaryTextFormatSymbol': LOGGING.PRIMARY_TEXT_FORMAT_SYMBOL,
    'secondaryTextFlag': false,
    'verbosity': LOGGING.MIN_LOG_VERBOSITY,
    'instanceIdFlag': false,
});


const httpHeader = new HttpHeader({
    'log': Log.$('main'),
});

const httpServer = new HttpServer({
    'log': Log.$('main'),
    'express': server,
    'productionFlag': ENVIRONMENT.PRODUCTION,
    'redirectFlag': false,
    'ipAddress': SERVER.IP_ADDRESS,
    'hostname': SERVER.HOSTNAME,
    'portHttp': SERVER.PORT_HTTP,
});

ExpressRouter.initialise({
    'log': Log.$('main'),
});


server.use(httpHeader.apply);
server.use(express.static(DIRECTORY.PUBLIC));
server.use(express.json());
server.use(express.urlencoded({ 'extended': false }));

server.use(ROUTE.OUTPUT, outputRouter);