var User = require('../models/user');
var Story = require('../models/story');
var Trip = require('../models/trip');
var config = require('../../config');
var SCK = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');
var {check, validationResult} = require('express-validator/check');

function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, SCK, {
        expiresIn: '1d'
    });

    return token;
}

module.exports = function (app, express) {
    var api = express.Router();
    var validateSignup = [
        check('email').custom(value => {
            if(value) {
                return User.findOne({email: value}).then(user => {
                    if (user) {
                        return Promise.reject('Email đã được đăng ký');
                    }
                });
            }
            return true;
        }).exists().withMessage('Bạn chưa nhập email').isEmail().withMessage('Email không hợp lệ'),
        check('phone').isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ').exists().withMessage('Bạn chưa nhập số điện thoại'),
        check('username').matches('^[a-zA-Z0-9]+$').withMessage('Tên tài khoản không hợp lệ').exists().withMessage('Bạn chưa nhập tên tài khoản'),
        check('password').isLength({min: 6 }).withMessage('Mật khẩu ít nhất có 6 ký tự').exists().withMessage('Bạn chưa nhập mật khẩu'),
        check('confirmPassword').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu nhập lại không chính xác');
            }
            return true;
        }).exists().withMessage('Bạn chưa nhập lại mật khẩu'),
    ];
    var validateLogin = [
        check('username').exists().withMessage('Bạn chưa nhập tên tài khoản'),
        check('password').exists().withMessage('Bạn chưa nhập lại mật khẩu')
    ];
    //signup
        api.post('/signup', validateSignup, (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        var user = new User(req.body);
        user.save(function (err, user) {
            if(err) {
                res.send(err);
                return;
            }
            res.json({success: true, msg: 'Tạo tài khoản thành công', user: user});
        });
    });


    //user
    api.get('/users', (req, res) => {
        User.find({}, (err, users) => {
            if(err) {
                res.send(err);
                return;
            }
            res.json(users);
        });
    });


    //login
    api.post('/login', validateLogin, function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        User.findOne({
            username: req.body.username
        }).select('password').exec(function (err, user) {
            if(err) throw err;
            if(!user) {
                res.send({msg: "User dosenot exist!"});
            } else {
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword) {
                    res.send('Invalid password!');
                } else {
                    var token = createToken(user);
                    res.json({
                        success: true,
                        msg: "Successfully login!",
                        token: token
                    });
                }
            }
        });
    });

    api.use(function (req, res, next) {
        var token = req.body.token || req.param('token') || req.header('x-access-token');

        if(token) {
            jsonwebtoken.verify(token, SCK, function (err, decoded) {
                if(err) {
                    res.status(403).send({success: false, msg: "Failed to authenticate user!"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({success: false, msg: "No Token Provided!"});
        }
    });

    api.route('/create-trip')
        .post(function (req, res) {
            var trip = new Trip(req.body);
            trip.save(function (err, trip) {
                if(err) {
                    res.send(err);
                    return;
                }
                res.json({success: true, msg: "New trip created!", trip: trip});
            });
        }).get(function (req, res) {
            Story.find({_id: req.decoded.id}, function (err, trip) {
                if(err) {
                    res.send(err);
                    return;
                }
                res.json(trip);
            });
        });

    api.get('/me', function (req, res) {
        return res.json(req.decoded);
    });

    return api;
};