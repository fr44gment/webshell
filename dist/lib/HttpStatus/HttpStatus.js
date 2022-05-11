export default class HttpStatus {
    static code(response, status) {
        response.status(HttpStatus._STATUS[status]);
    }
    ;
}
HttpStatus._STATUS = {
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
;
