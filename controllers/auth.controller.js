const config = require('config.json');
const userService = require('../services/user.service');
const response = require('../helper/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailHelper = require('../helper/email-sender');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function register(req, res, next) {

    try {
        // validate
        if (await db.User.findOne({ where: { email: req.body.email } })) {
            return response.alreadyExist(res, req.body.email);
        }

        // password password
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // save user
        const user = await db.User.create(req.body);

        return response.success(res, userService.omitPassword(user.get()), 'User regitered successfully !');
    } catch (err) {
        next(err);
    }

}

async function authenticate(req, res, next) {

    try {
        const { email, password } = req.body;

        const user = await db.User.scope('withPassword').findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password)))
            return response.incorrect(res, 'Email or Password is incorrect !');

        // authentication successful
        const token = jwt.sign({ sub: user.id_user }, config.secret, { expiresIn: '7d' });

        return response.success(res, { ...userService.omitPassword(user.get()), token });
    } catch (err) {
        next(err);
    }

}

async function forgotPassword(req, res, next) {

    try {
        const user = await userService.getUserByEmail(req.body.email);

        if (!user) return response.notExist(res, "User not found !");

        await db.UserOtp.update({
            used: 1
        },
            {
                where: {
                    user_id: user.id_user
                }
            });

        let otp = Math.floor(100000 + Math.random() * 900000);

        //token expires after one hour
        let expireDate = new Date(new Date().getTime() + (60 * 60 * 1000))

        const userOtp = await db.UserOtp.create({
            user_id: user.id_user,
            expiration: expireDate,
            otp: otp,
            used: 0
        });

        // sendEmail
        await mailHelper.otpVerification({
            to: req.body.email,
            subject: 'forgot password',
            text: 'To reset your password, your otp is ' + userOtp.otp
        })

        return response.success(res, {}, "Otp send on email successfully ! ");
    } catch (err) {
        next(err);
    }

}

async function otpVerification(req, res, next) {

    try {
        const user = await userService.getUserByEmail(req.body.email, res);
        if (!user) return response.notExist(res, "User not found !");

        await db.UserOtp.destroy({
            where: {
                expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
            }
        });

        var userOtp = await db.UserOtp.findOne({
            where: {
                user_id: user.id_user,
                expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
                otp: req.body.otp,
                used: 0
            }
        });

        if (userOtp == null) {
            return response.incorrect(res, "Otp is incorrect or expired !");
        }

        await db.UserOtp.update({
            is_verified: 1
        },
            {
                where: {
                    user_id: user.id_user,
                    used: 0
                }
            });

        return response.success(res, {}, "Otp verified successfully !");

    } catch (err) {
        next(err);
    }
}

async function resetPassword(req, res, next) {
    try {
        const user = await userService.getUserByEmail(req.body.email, res);
        if (!user) return response.notExist(res, "User not found !");

        let userOtp = await db.UserOtp.findOne({
            where: {
                user_id: user.id_user,
                expiration: { [Op.gt]: Sequelize.fn('CURDATE') },
                used: 0,
                is_verified: 1
            }
        });

        if (userOtp == null) {
            return response.incorrect(res, "Otp is expired retry the forgot password again!");
        }

        await db.UserOtp.update({
            used: 1
        },
            {
                where: {
                    user_id: user.id_user
                }
            });

        let newPassword = await bcrypt.hash(req.body.password, 10);

        await db.User.update({
            password: newPassword,
        },
            {
                where: {
                    email: req.body.email
                }
            });

        return response.success(res, {}, "Password reset. Please login with your new password.");
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    authenticate,
    forgotPassword,
    otpVerification,
    resetPassword
};