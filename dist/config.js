import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
export const ENVIRONMENT = {
    'PRODUCTION': (process.env.PRODUCTION === 'true'),
    'SERVER_VERBOSITY': process.env.SERVER_VERBOSITY,
    'SSL_CERTIFICATE_PATH': process.env.SSL_CERTIFICATE_PATH,
    'SSL_PRIVATE_KEY_PATH': process.env.SSL_PRIVATE_KEY_PATH,
    'SSL_CERTIFICATE_AUTHORITY_PATH': process.env.SSL_CERTIFICATE_AUTHORITY_PATH,
};
export const SERVER = {
    'PORT_HTTP': 80,
    'PORT_HTTPS': 443,
    'HOSTNAME': (ENVIRONMENT.PRODUCTION) ? '0.0.0.0' : '0.0.0.0',
    'IP_ADDRESS': '0.0.0.0',
    'VIEW_ENGINE': 'ejs',
};
export const DIRECTORY = {
    'PUBLIC': path.join(path.resolve(), 'public'),
    'ROUTE': path.join(path.resolve(), 'src', 'server', 'route'),
    'VIEW': path.join(path.resolve(), 'src', 'client', 'view'),
};
export const ROUTE = {
    'OUTPUT': `/output-hyegs`,
};
export const LOGGING = {
    'MIN_LOG_VERBOSITY': 'TRACE',
    'PRIMARY_TEXT': 'RISK-RT00-00-INTE00',
    'PRIMARY_TEXT_FORMAT_SYMBOL': 'FG_TEMP',
};
