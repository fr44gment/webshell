import express from 'express';
import { Log } from '../Log/Log';

export default class HttpStatus {
    private _log : Log;

    private static readonly _STATUS = {
        'OK': 200,
        'CREATED': 201,
        'ACCEPTED': 202,

        'BAD_REQUEST': 400,
        'UNAUTHORIZED': 401,
        'FORBIDDEN': 403,
        'CONFLICT': 409,
        'UNPROCESSABLE_ENTITY': 422,

        'INTERNAL_SERVER_ERROR': 500,
    };


    public static code(response : express.Response, status : string) : void {
        response.status((HttpStatus._STATUS as any)[status]);
    };
};