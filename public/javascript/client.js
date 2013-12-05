;
jQuery(function($){
    'use strict';

    var IO = {
        /**
         * This is called when the page is displayed. It connects the Socket.IO client
         * to the Socket.IO server
         */
        init: function() {
            // Default connect to server serve this file
            IO.socket = io.connect();
            IO.bindEvents();

            // Add user
            IO.socket.emit("addUser", $('#username').text());
        },

        /**
         * While connected, Socket.IO will listen to the following events emitted
         * by the Socket.IO server, then run the appropriate function.
         */
        bindEvents : function() {
            IO.socket.on('connected', IO.onConnected );
            IO.socket.on('newRoomCreated', IO.onNewRoomCreated );
            IO.socket.on('error', IO.error );
        },

        /**
         * The client is successfully connected!
         */
        onConnected : function(data) {
            // Cache a copy of the client's socket.IO session ID on the App
            Game.mySocketId = IO.socket.socket.sessionid;
            console.log(data.message);
        },

        /**
         * A new game has been created and a random game ID has been generated.
         * @param data {{ gameId: int, mySocketId: * }}
         */
        onNewRoomCreated : function(data) {
            Game.Host.gameInit(data);
        },

        /**
         * An error has occurred.
         * @param data
         */
        error : function(data) {
            alert(data.message);
        }

    };

    var Game = {

        /**
         * Keep track of the gameId, which is identical to the ID
         * of the Socket.IO Room used for the players and host to communicate
         *
         */
        gameId: 0,

        /**
         * This is used to differentiate between 'Host' and 'Player' browsers.
         */
        myRole: '',   // 'Player' or 'Host'

        /**
         * The Socket.IO socket object identifier. This is unique for
         * each player and host. It is generated when the browser initially
         * connects to the server when the page loads for the first time.
         */
        mySocketId: '',

        /* *************************************
         *                Setup                *
         * *********************************** */

        /**
         * This runs when the page initially loads.
         */
        init: function () {
            Game.cacheElements();
            Game.bindEvents();

            // Initialize the fastclick library
            //FastClick.attach(document.body);
        },

        cacheElements: function () {
            Game.$doc = $(document);
            Game.$roomList = $('#roomlist');
//            Game.$roomList = document.getElementById("roomlist");
//            Game.$btnCreate = document.getElementById("btnCreate");
        }                        ,

        bindEvents: function() {
            //Game.$btnCreate.on('click', Game.Host.onCreateClick());
            Game.$doc.on('click', '#btnCreate', Game.Host.onCreateClick);
        },

        Host : {

            /**
             * Contains references to player data
             */
            players : [],

            /**
             * Flag to indicate if a new game is starting.
             * This is used after the first game ends, and players initiate a new game
             * without refreshing the browser windows.
             */
            isNewGame : false,

            /**
             * Keep track of the number of players that have joined the game.
             */
            numPlayersInRoom: 0,

            /**
             * The Host screen is displayed for the first time.
             * @param data{{ gameId: int, mySocketId: * }}
             */
            gameInit: function (data) {
                Game.gameId = data.gameId;
                Game.mySocketId = data.mySocketId;
                Game.myRole = 'Host';
                Game.Host.numPlayersInRoom = 0;
                Game.Host.updateRoomList(data);
                //Game.Host.displayNewGameScreen();
                // console.log("Game started with ID: " + App.gameId + ' by host: ' + App.mySocketId);
            },

            /**
             * Handler for the "Start" button on the Title Screen.
             */
            onCreateClick: function () {
                // console.log('Clicked "Create A Game"');
                IO.socket.emit('createRoom');
            },

            /**
             * Update Room list
             * @param data{{ gameId: int, mySocketId: * }}
             */
            updateRoomList: function (data) {
                console.log('updateroomlist');
                console.log(Game.$roomList);
                $('#roomlist').append('<li><a href=\'#\'>' + data.roomId + '</a></li>');
            }
        }

    };

    var RoomList = {
        roomList: [],
        roomListInit: function () {

        }

    };

    IO.init();
    Game.init();

}($));