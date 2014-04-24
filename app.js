var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var users = require('./routes/users');

//var debug = require('debug')('my-application');

var app = express();


var recordController = require ('./routes/record_controller');
var sessionController = require('./routes/session_controller.js');
//var userController = require('./routes/user_controller.js');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(partials());

//app.use('/', routes);
//app.use('/users', users);


// Routes -------------------------------------------------------------------------------------------
app.get('/',routes.index);

app.get('/record',recordController.index);
app.get('/configure', recordController.configure);
app.get('/confirm', recordController.startRecord)
app.post('/record', recordController.confirm);
app.get('/stop', recordController.stop);

app.post('/invitado', sessionController.invitado);
app.get('/login',  sessionController.new);
app.get('/register', sessionController.new);
//-----------------------------------------------------------------------------------------------------



app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



