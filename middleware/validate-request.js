const response = require('../helper/response');

function validateRequest(req, res , next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: false, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        response.validationError(res, error);
    } else {
        req.body = value;
        next();
    }
}

module.exports = validateRequest;