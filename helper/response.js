const SUCCESS = 200;
const UNAUTHORIZED = 401; 
const INVALID = 403;
const INCORRECT = 422;
const NOTFOUND = 404;
const EXPIRED = 498;

function success(res, data, message = '') {
    res.status(SUCCESS).json({
        'success': true,
        'status': SUCCESS,
        'message' : message,
        'data': data,
        'error': {}
    });
}

function unAuthorized(res) {
    res.status(UNAUTHORIZED).json({
        'success': false,
        'status': UNAUTHORIZED,
        'data': {},
        'error': {
            'message' : 'Unauthorized user'
        }
    });
}

function alreadyExist(res, field) {
    res.status(INVALID).json({
        'success': false,
        'status': INVALID,
        'data': {},
        'error': {
            'message' : `${field} already exists in the system, try with different ${field}`
        }
    });
}

function validationError(res, error) {

    res.status(INVALID).json({
        'success': false,
        'status': INVALID,
        'data': {},
        'error': {
            'message' : error.details.map(x => {
                let split = x.message.split(" ")[0];
                split = split.replaceAll('"', '');
                let object = {};
                object[split] = x.message;
                return object;
            })
        }
    });
}

function incorrect(res, message) {
    res.status(INCORRECT).json({
        'success': false,
        'status': INCORRECT,
        'data': {},
        'error': {
            'message' : message
        }
    });
}

function notFound(res) {
    res.status(NOTFOUND).json({
        'success': false,
        'status': NOTFOUND,
        'data': {},
        'error': {
            'message' : 'Resource not found !'
        }
    });
}

function otpNotFound(res) {
    res.status(NOTFOUND).json({
        'success': false,
        'status': NOTFOUND,
        'data': {},
        'error': {
            'message' : 'Otp not found please retry the forget password process again !'
        }
    });
}

function expired(res, message) {
    res.status(EXPIRED).json({
        'success': false,
        'status': EXPIRED,
        'data': {},
        'error': {
            'message' : message
        }
    });
}

function notExist(res, message) {
    res.status(NOTFOUND).json({
        'success': false,
        'status': NOTFOUND,
        'data': {},
        'error': {
            'message' : message
        }
    });
}

module.exports = {
    success,
    unAuthorized,
    alreadyExist,
    validationError,
    incorrect,
    notFound,
    otpNotFound,
    expired,
    notExist
}