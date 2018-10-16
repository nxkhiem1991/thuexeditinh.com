const { body } = require('express-validator/check');
const { User } = require('../models/user');

module.exports = function () {
    this.checkExistEmail = function () {
        body('email').custom(value => {
            return User.findUserByEmail(value).then(user => {
                if (user) {
                    return Promise.reject('Email đã được đăng ký');
                }
            });
        });
    };

    this.compareConfirmPassword = function () {
        body('passwordConfirmation').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu nhập lại không chính xác');
            }
        });
    };
};