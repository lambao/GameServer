var io;
var gameSocket;
var hostService = require("./app/domain/service/hostService");

// Import Utility resources (logging, object inspection, etc)
var util = require("util");

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = [];

exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;

    gameSocket.emit('connected', { message: "You are connected!" });

    // Init Host service
    hostService.init(sio, socket);

    // Server Event
    gameSocket.on('addUser', addUser);
    gameSocket.on('disconnect', clientDisconnect);


    // Host Events
    gameSocket.on('createRoom', hostService.createRoom);
}

function addUser(username) {

};

function clientDisconnect(req, res) {
    util.log('A client disconnected!');
};