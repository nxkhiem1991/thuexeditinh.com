var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripSchema = new Schema({
    car: String,
    type: String,
    from: String,
    to: String,
    distance: Number,
    price: Number,
    created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Trip', tripSchema);