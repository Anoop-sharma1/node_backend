const userService = require('../services/user.service');
const response = require('../helper/response');
const bcrypt = require('bcryptjs');

async function getAll(req, res, next) {
    try {
        const users = await db.User.findAll();

        if (!users) return response.notExist(res, "Users not found !");

        return response.success(res, users);
    } catch (err) {
        next(err)
    }

}

function getCurrent(req, res, next) {
    try {
        return response.success(res, req.user);
    } catch (err) {
        next(err)
    }
}

async function getById(req, res, next) {

    try {

        const user = await userService.getUser(req.params.id);

        if (!user) return response.notExist(res, "User not found !");

        return response.success(res, user);
    } catch (err) {
        next(err);
    }

}

async function update(req, res, next) {

    try {
        const user = await userService.getUser(req.params.id);
    
        // validate
        const emailChanged = req.body.email && user.email !== req.body.email;
    
        if (emailChanged && await db.User.findOne({ where: { email: req.body.email } })) {
            response.alreadyExist(res, req.body.email);
        }
    
        // hash password if it was entered
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
    
        // copy req.body to user and save
        Object.assign(user, req.body);

        const updatedUser = await user.save();
        
        return response.success(res, userService.omitPassword(updatedUser.get()));
        
    } catch (err) {
        next(err);
    }
        
}

async function _delete(req, res, next) {

    try {
        const user = await userService.getUser(req.params.id, res);

        if (!user) return response.notExist(res, "User not found !");

        if (await user.destroy()) {
            response.success(res, {}, 'User deleted successfully !')
        }

    } catch (err) {
        next(err);
    }

}

function profile(req, res, next) {
    userService.profile(req, res)
        .then((user) => response.success(res, user))
        .catch(next);
}

module.exports = {
    getAll,
    getCurrent,
    getById,
    update,
    _delete,
    profile,
};