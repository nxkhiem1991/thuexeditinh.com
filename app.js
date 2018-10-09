var express  = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose =  require('mongoose');
var config = require('./config');

var app = express();

mongoose.connect(config.database, { useNewUrlParser: true }, function (err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected to DB");
    }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
   res.sendFile(__dirname + '/public/app/index.html');
});

var api = require('./app/routes/api')(app, express);
app.use('/api', api);

module.exports = app;
