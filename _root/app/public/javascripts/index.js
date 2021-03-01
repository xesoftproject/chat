(function ($) {
    console.log("index started")
    var roomID = '666'; //from jwt
    var username = 'theKiller'; //choose at login stage by the user
    var socket = io(document.location.origin + '/xesoft_chat');
    console.log(`document.location.origin: ${document.location.origin}`)
    var start = new Date();
    var jwtStr = localStorage.getItem("xejwt");
    console.log("xejwt: "+jwtStr);

    socket.on('connect', function () {
        console.log("connecting")
        var index = socket.io.engine.upgrade ? 1 : 0;
        console.log('Connection established in ' + (new Date() - start) + 'msec. ' +
            'SocketID: ' + socket.id + '. ' +
            'You are using ' + socket.io.engine.transports[index] + '.');
        socket.emit('join', {room: roomID, jwt: jwtStr});
    });

    socket.on('message', function (data) {
        console.log("message: "+data);
        $('#message-room > ul').append('<li>' + "received msg on room: " + roomID + " - nickname: " + data.nickname + " - msg: " + data.message + " - creationDate: " + data.creationDate + " - username: " + data.username + ' -</li>');
    });

    socket.on('room-manager', function (message) {
        console.log("room-manager: "+message);
        $('#message-room > ul').append('<li>' + message + '</li>');
    });

    $('#roomID').click(function () {
        var message = $('#message').val();
        console.log("clik submit msg: "+message);

        if (message.length > 0) {
            console.log("emitting roomID: "+roomID);
            socket.emit('room-manager', {
                room: roomID,
                message: message,
                jwt: jwtStr,
                nickname: username,
                msgType: "chat"
            });
        }
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
        $('#message-room > ul').append('<li>' + "received ERROR msg on room: " + roomID + " - descriptipn: " + data.description+ ' -</li>');
        console.log("Error: " + data);
    })

    // socket.leave(roomID);

}(jQuery));
