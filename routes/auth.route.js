const express = require('express');
const router = express.Router();
const validateRequest = require('middleware/validate-request');
const Joi = require('joi');
const authController = require('controllers/auth.controller');


router.post('/register', registerSchema, authController.register);
router.post('/login', authenticateSchema, authController.authenticate);
router.post('/forgot-password', forgotSchema, authController.forgotPassword);
router.post('/otp-verification', otpSchema, authController.otpVerification);
router.post('/reset-password', resetPasswordSchema, authController.resetPassword);

function registerSchema(req, res, next) {
    
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required()
    });

    validateRequest(req, res, next, schema);
};

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().min(3).required().email(),
        password: Joi.string().required()
    });

    validateRequest(req, res, next, schema);
}

function forgotSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().min(3).required().email(),
    });

    validateRequest(req, res, next, schema);
}

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().min(3).required().email(),
        password: Joi.string().required(),
        confirm_password: Joi.any().valid(Joi.ref('password')).required(),
        otp: Joi.number().empty('')

    });

    validateRequest(req, res, next, schema);
}

function otpSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().min(3).required().email(),
        otp: Joi.number().required()

    });

    validateRequest(req, res, next, schema);
}

module.exports = router;

