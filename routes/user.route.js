const express = require('express');
const router = express.Router();
const authorize = require('middleware/authorize');
const validateRequest = require('middleware/validate-request');
const Joi = require('joi');
const userController = require('controllers/user.controller');

router.get('/', authorize(), userController.getAll);
router.get('/current', authorize(), userController.getCurrent);
router.get('/:id', authorize(), userController.getById);
router.put('/:id', authorize(), updateSchema, userController.update);
router.delete('/:id', authorize(), userController._delete);

function updateSchema(req, res, next) {
    const schema = Joi.object({
        first_name: Joi.string().empty(''),
        last_name: Joi.string().empty(''),
        email: Joi.string().email(),
        password: Joi.string().min(6).empty('')
    });

    validateRequest(req, res, next, schema);
}

function profileSchema(req, res, next) {
    const schema = Joi.object({
        // image : Joi.string(),
    });

    validateRequest(req, res, next, schema);
}

module.exports = router;

