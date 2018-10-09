var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var SCK = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user.id,
        name: user.name,
        username: user.username,
    }, SCK, {
        expiresIn: '1d'
    });

    return token;
}

module.exports = function (app, express) {
    var api = express.Router();

    //signup
    api.post('/signup', function (req, res) {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        user.save(function (err) {
            if(err) {
                res.send(err);
                return;
            }

            res.json({msg: 'Created account!'});
        });
    });


    //user
    api.get('/users', function (req, res) {
        User.find({}, function (err, users) {
            if(err) {
                res.send(err);
                return;
            }
            res.json(users);
        });
    });


    //login
    api.post('/login', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('password').exec(function (err, user) {
            if(err) throw err;
            if(!user) {
                res.send({msg: "User dosenot exist!"})
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

    api.route('/')
        .post(function (req, res) {
            var story = new Story({
                creator: req.decoded.id,
                content: req.body.content
            });

            story.save(function (err) {
                if(err) {
                    res.send(err);
                    return;
                }
                res.json({msg: "New stroy created!"});
            });
        }).get(function (req, res) {
            Story.find({creator: req.decoded.id}, function (err, stories) {
                if(err) {
                    res.send(err);
                    return;
                }
                res.json(stories);
            });
        });

    api.get('/me', function (req, res) {
        return res.json(req.decoded);
    });

    return api;
};