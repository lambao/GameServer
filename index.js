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

// Import the Anagrammatix game file.
var agx = require('./agxgame');

// Create a simple Express application
app.configure(function () {
    // Turn down the logging activity
    app.use(express.logger('dev'));

    // Serve static html, js, css, and image files from the 'public' directory
    app.use(express.static(path.join(__dirname, 'public')));
});

// Create a Node.js based http server on port 8080
var server = require('http').createServer(app).listen(COMMON_CONFIG.GAME_CONFIG.GAME_PORT, function () {
    util.log('Game init at ' + COMMON_CONFIG.GAME_CONFIG.GAME_HOST + ":" + COMMON_CONFIG.GAME_CONFIG.GAME_PORT);
});
// var server = require('http').createServer(app).listen(8080);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// Reduce the logging output of Socket.IO
io.set('log level', 3);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    //console.log('client connected');
    agx.initGame(io, socket);
});


