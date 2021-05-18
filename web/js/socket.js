const jwtStr = localStorage.getItem("xejwt");
let roomID = document.getElementById("roomID").getAttribute("data-roomID") == "chat" ? "partita_TODO" : document.getElementById("roomID").getAttribute("data-roomID");
const socket = io(document.location.origin + '/xesoft_chat');

const socket_onload = function socket_onload(){
    console.log("index started")
    
    console.log(`document.location.origin: ${document.location.origin}`)
    var start = new Date();

    console.log("xejwt: " + jwtStr);

    socket.on('connect', function () {
        console.log("connecting")
        var index = socket.io.engine.upgrade ? 1 : 0;
        console.log('Connection established in ' + (new Date() - start) + 'msec. ' +
            'SocketID: ' + socket.id + '. ' +
            'You are using ' + socket.io.engine.transports[index] + '.');
        socket.emit('join', {room: roomID, jwt: jwtStr});
    });

    socket.on('message', function (data) {
        console.log("message: " + data);
        $('#message-room > ul').append('<li>' + "received msg on room: " + roomID + " - username: " + data.username + " - msg: " + data.message + " - creationDate: " + data.creationDate + " - nickname: " + data.nickname + ' -</li>');
    });

    socket.on('room-manager', function (message) {
        console.log("room-manager: " + message);
        $('#message-room > ul').append('<li>' + message + '</li>');
    });

    /*socket.on('room-users-list', function (message) {
        console.log("room-users-list: " + message.users);
        // $('#message-room > ul').append('<li>' + message + '</li>');
    });*/

    $('#roomID').click(function () {
        var message = $('#message').val();
        console.log("clik submit msg: " + message);

        if (message.length > 0) {
            console.log("emitting roomID: " + roomID);
            socket.emit('room-manager', {
                room: roomID,
                message: message,
                jwt: jwtStr,
                msgType: "chat"
            });
        }
    });

    $('#room-users-list').click(function () {
        console.log("click room-users-list");
        socket.emit('room-users-list', {
            room: roomID,
            jwt: jwtStr,
            msgType: "command"
        });
        // $.get( document.location.origin + "/room/users?room="+roomID, function(data) {
        //     console.log( "success"+data );
        // })
    });

    socket.on('connect_failed', function () {
        document.write("Sorry, there seems to be an issue with the connection!");
    })

    socket.on('reconnecting', function () {
        document.write("Trying to reconnecting.....");
    })

    socket.on('reconnected', function () {
        document.write("Now you are connected again.");
    })

    socket.on('errorMsg', function (data) {
        $('#message-room > ul').append('<li>' + "received ERROR msg on room: " + roomID + " - descriptipn: " + data.description + ' -</li>');
        console.log("Error: " + data);
    })
}

export {roomID,jwtStr,socket,socket_onload}