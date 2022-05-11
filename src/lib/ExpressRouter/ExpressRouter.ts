import express from 'express';
import { Log } from '../Log/Log.js';

interface ExpressRouterConfiguration {
    'log' : Log;
};

interface IndexableRouter extends express.Router {
    [key : string] : any;
};

export default class ExpressRouter {
    private static _log : Log;

    public static initialise(configuration : ExpressRouterConfiguration) : void {
        ExpressRouter._log = configuration.log;

        ExpressRouter._log.trace('ExpressRouter initialised.');
    };

    public static route(
        method : string,
        parameter1 : Array<() => void> | express.RequestHandler,
        parameter2 ?: express.RequestHandler
    ) : express.Router {
        const wrapperFunction = async (
            request : express.Request,
            response : express.Response,
            next : express.NextFunction
        ) => {
            ExpressRouter._preRoute(request, response);

            if (parameter2 == null) (parameter1 as express.RequestHandler)(request, response, next);

            else parameter2(request, response, next);

            ExpressRouter._postRoute(request, response);
        }

        const router = express.Router();

        if (parameter2 == null) (router as IndexableRouter)[method]('/', wrapperFunction);

        else (router as IndexableRouter)[method]('/', parameter1, wrapperFunction);

        return router;
    };

    private static _preRoute(request : express.Request, response : express.Response) : void {
        ExpressRouter._log.httpRequest(request);
    };

    private static _postRoute(request : express.Request, response : express.Response) : void {

    };
};

// export default class ExpressRouter {
//     private static _log : Log;

//     public static initialise(configuration : ExpressRouterConfiguration) {
//         ExpressRouter._log = configuration.log;

//         ExpressRouter._log.trace('ExpressRouter initialised.');
//     };

//     public static get(
//         middleware : Array<() => void>,
//         callback : express.RequestHandler
//     ) : express.Router {
//         const wrapperFunction = async (
//             request : express.Request, 
//             response : express.Response, 
//             next : express.NextFunction
//         ) => {
//             ExpressRouter._preRoute(request, response);

//             callback(request, response, next);

//             ExpressRouter._postRoute(request, response);
//         };

//         const router = express.Router();

//         router.get('/', middleware, wrapperFunction);

//         return router;
//     };
    
//     public static post(
//         middleware : Array<() => void>,
//         callback : express.RequestHandler
//     ) : express.Router {
//         const wrapperFunction = async (
//             request : express.Request, 
//             response : express.Response, 
//             next : express.NextFunction
//         ) => {
//             ExpressRouter._preRoute(request, response);

//             callback(request, response, next);

//             ExpressRouter._postRoute(request, response);
//         };

//         const router = express.Router();

//         router.post('/', middleware, wrapperFunction);

//         return router;
//     };

//     public static put(
//         middleware : Array<() => void>,
//         callback : express.RequestHandler
//     ) : express.Router {
//         const wrapperFunction = async (
//             request : express.Request,
//             response : express.Response,
//             next : express.NextFunction
//         ) => {
//             ExpressRouter._preRoute(request, response);

//             callback(request, response, next);

//             ExpressRouter._postRoute(request, response);
//         };

//         const router = express.Router();

//         router.put('/', middleware, wrapperFunction);

//         return router;
//     };

//     private static _preRoute(request : express.Request, response : express.Response) : void {
//         ExpressRouter._log.httpRequest(request);
//     };

//     private static _postRoute(request : express.Request, response : express.Response) : void {

//     };
    
// };