import express from 'express';
;
;
export default class ExpressRouter {
    static initialise(configuration) {
        ExpressRouter._log = configuration.log;
        ExpressRouter._log.trace('ExpressRouter initialised.');
    }
    ;
    static route(method, parameter1, parameter2) {
        const wrapperFunction = async (request, response, next) => {
            ExpressRouter._preRoute(request, response);
            if (parameter2 == null)
                parameter1(request, response, next);
            else
                parameter2(request, response, next);
            ExpressRouter._postRoute(request, response);
        };
        const router = express.Router();
        if (parameter2 == null)
            router[method]('/', wrapperFunction);
        else
            router[method]('/', parameter1, wrapperFunction);
        return router;
    }
    ;
    static _preRoute(request, response) {
        ExpressRouter._log.httpRequest(request);
    }
    ;
    static _postRoute(request, response) {
    }
    ;
}
;
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
