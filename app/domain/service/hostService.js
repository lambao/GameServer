/* *******************************
 *                             *
 *       HOST FUNCTIONS        *
 *                             *
 ******************************* */
// Import Utility resources (logging, object inspection, etc)
var util = require("util");

var hostService = module.exports,
    io,
    gameSocket;

/**
 * Init Host Service
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
hostService.init = function(sio, socket){
    io = sio;
    gameSocket = socket;
}

/**
 * Create new room, occur when user click create game button
 */
hostService.createRoom = function() {
    // Create a unique Socket.IO Room
    var thisRoomId = ( Math.random() * 100000 ) | 0;

    // Join the Room and wait for the players
    this.join(thisRoomId.toString());

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    io.sockets.emit('newRoomCreated', {roomId: thisRoomId, mySocketId: this.id});
}