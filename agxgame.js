common_utils = require("./app/util/utils")   //utils
hostService = require("./app/domain/service/hostService")
playerService = require("./app/domain/service/playerService")

var io;
var gameSocket;

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    hostService.init(sio, socket);
    playerService.init(sio, socket);
    // Host Events
    gameSocket.on('hostCreateNewGame', hostService.hostCreateNewGame);
    gameSocket.on('hostRoomFull', hostService.hostPrepareGame);
    gameSocket.on('hostCountdownFinished', hostService.hostStartGame);
    gameSocket.on('hostNextRound', hostService.hostNextRound);

    // Player Events
    gameSocket.on('playerJoinGame', playerService.playerJoinGame);
    gameSocket.on('playerAnswer', playerService.playerAnswer);
    gameSocket.on('playerRestart', playerService.playerRestart);
}