// App Constant
COMMON_CONFIG = require('./app/consts/consts')

// Import the Express module
var express = require('express');

// Import Utility resources (logging, object inspection, etc)
var util = require("util");

// Import the 'path' module (packaged with Node.js)
var path = require('path');

// Create a new instance of Express
var app = express();

// Import Http
var http = require('http');

// Import Socket
var socket = require('socket.io');

// Import Routes Module
var routes = require('./config/routes');

// Import Signup Service
loginService = require("./app/domain/service/loginService")

// Import the Anagrammatix game file.
var gameserver = require('./gameserver');


// Create a simple Express application
app.configure(function () {

    // Using cookie parse for session
    app.use(express.cookieParser());

    app.use(express.session({secret: '1234567890QWERTY'}));

    // Using body parse
    app.use(express.bodyParser());

    // Turn down the logging activity
    app.use(express.logger('dev'));

    // Serve static html, js, css, and image files from the 'public' directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Set views folder
    app.set('views', path.join(__dirname, 'app/views'));

    // Set views engine
    app.set('view engine', 'jade');

    // Set routes
    app.use(app.router);

    // Homepage
    app.get('/', routes.index);

    // Game homepage
    app.get('/game', loginService.afterLogin);

    // Create room
    app.get('/creategame', routes.index)

    // Service for signup
    app.post('/signup',loginService.login);
});

// Create a Node.js based http server on port 8080
var server = http.createServer(app).listen(COMMON_CONFIG.GAME_CONFIG.GAME_PORT, function () {
    util.log('GameServer init at ' + COMMON_CONFIG.GAME_CONFIG.GAME_HOST + ":" + COMMON_CONFIG.GAME_CONFIG.GAME_PORT);
});
// var server = require('http').createServer(app).listen(8080);

// Create a Socket.IO server and attach it to the http server
var io = socket.listen(server);

// Reduce the logging output of Socket.IO
io.set('log level', 3);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    util.log('A client connected: ' +  socket.id);
//    gameserver.initGame(io, socket);
 //   socket.emit('connected', { hello: 'hello from server' });
    gameserver.initGame(io, socket);
});