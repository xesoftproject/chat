(function ($) {
    console.log("index started")
    var roomID = '666'; //from jwt
    var username = 'theKiller'; //choose at login stage by the user
    var socket = io(document.location.origin + '/xesoft');
    console.log(`document.location.origin: ${document.location.origin}`)
    var start = new Date();
    //jwt retrieved from cognito
    var jwtStr = 'eyJraWQiOiJaMlh6enRJdFo4XC9RYU5YXC8zUEs2MmxzRE1oaGRrOUZCeUsrYll1QTZwTUE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJhNGE5YTg2NC00MDU0LTRlNTYtOTgyYS00MTE0NzI3MjQzMTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOmV2ZW50SWQiOiIxNDgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9TOFVYU3lGTEkiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2luZW1hMDAyOTgzIiwiY3VzdG9tOmluc3RhbmNlSWQiOiJ2aXJ0dWFsY2luZW1hIiwiY3VzdG9tOmV2ZW50TmFtZSI6ImRhcmlvIiwiY3VzdG9tOmJvdW5kYXJ5SWQiOiJOdW92byBUZXN0IiwiYXVkIjoiNWE2ZWUyaG1jdWMycTkzZGZkZW82bGc2c2QiLCJldmVudF9pZCI6ImMzY2NkOGU5LWFlOWYtNDlhNy04ZDk5LTg5NTZmNjRkNDQ0NyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjA1ODU5NDY1LCJuYW1lIjoiY2luZW1hMDAyOTgzIiwiZXhwIjoxNjA1ODYzMDY1LCJpYXQiOjE2MDU4NTk0NjUsImVtYWlsIjoidGVzdGNvZ25pdG9AeW9wbWFpbC5jb20ifQ.qXbFi4f9T3SOSdcb6KK6r0SaYn-v9ZPhGINLlFodqruDBFFBDOHjICY4OxGSE9FxRufN6nuKam_GPJpZZlwK-c_JamGQtHs_ZD3j6TPit71wb5KERoXfXMkEajmQAe0fJlYNdA_3wOfoYYIcpKmvDqCSuvUMb9mybwQfsbMYFXjhQuRa3vKPeiA2CkbF7HotTPBobkPaeuP0hRzvnQW56PvTcf5imo2w6_cc5TU7YWx8jK_l667oyldHqI0eDn_ZDW5eG1CfJ-pFWflo921EX9Ue1X_ND1Mx57DHRw7kfR9oCuUqAE2Oy1oIJh_iSTtEqPhXvdHwopPyAfSCVKvJjw';

    socket.on('connect', function () {
        var index = socket.io.engine.upgrade ? 1 : 0;
        console.log('Connection established in ' + (new Date() - start) + 'msec. ' +
            'SocketID: ' + socket.id + '. ' +
            'You are using ' + socket.io.engine.transports[index] + '.');
        socket.emit('join', {room: roomID, jwt: jwtStr});
    });

    socket.on('message', function (data) {
        $('#message-room > ul').append('<li>' + "received msg on room: " + roomID + " - nickname: " + data.nickname + " - msg: " + data.message + " - creationDate: " + data.creationDate + " - username: " + data.username + ' -</li>');
    });

    socket.on('room-manager', function (message) {
        $('#message-room > ul').append('<li>' + message + '</li>');
    });

    $('#roomID').click(function () {
        var message = $('#message').val();

        if (message.length > 0) {
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
