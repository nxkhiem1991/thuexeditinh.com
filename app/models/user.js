var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false},
    role: { type: String, default: 'user'},
    created: {type: Date, default: Date.now()}
});

userSchema.pre('save', function (next) {
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', userSchema);