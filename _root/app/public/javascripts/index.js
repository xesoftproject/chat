(function ($) {
    console.log("index started")
    var roomID = '666'; //from jwt
    var username = 'theKiller'; //choose at login stage by the user
    var socket = io(document.location.origin + '/xesoft_chat');
    console.log(`document.location.origin: ${document.location.origin}`)
    var start = new Date();
    var jwtStr = 'eyJraWQiOiJucmNod0ZQNzZaNXdJMzJrbXVwOW80UHozaHQxbit0OXlpMER3RUhWWXhZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzOGMyNTEyOC1jNzFkLTQ2NWItYjFiMi1jMjMxYTExMmQ0M2MiLCJhdWQiOiI2dmxpZ3RxdW84OGZndWo3ZTVkc3I2bWxtaiIsImV2ZW50X2lkIjoiMmI1YzlhNzYtZTcwOC00MWYwLWE4Y2ItNDFhYWViM2JhMzU2IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MTAyOTg5MjQsInByb2ZpbGUiOiJnaW9jYXRvcmUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9CT3I2SWFCeEMiLCJuaWNrbmFtZSI6ImtpbGxlciIsImNvZ25pdG86dXNlcm5hbWUiOiJkYXJpby5icmFtYmlsbGFAZmluY29uc2dyb3VwLmNvbSIsImV4cCI6MTYxMDMwMjUyNCwiaWF0IjoxNjEwMjk4OTI0LCJlbWFpbCI6ImRhcmlvLmJyYW1iaWxsYUBmaW5jb25zZ3JvdXAuY29tIn0.R5kuIh2yonpkliUnnmR5xsqM7dqoyPFVRYeMX2NvWB-qtkM4yHt2dnkMxAJu6J7eLx4-AuY_yF0qqjsAqsakmsBJnIdV8Vq0bZOAxjmaPqUVT9pWwnwf4pZbklKcQQn3hPUL2Vri9n1XAXJwG5IIhkKhbGD5LBGXigXQUfQj0KnxptvFAoZgN40cnHiEdSWWi7pxqZYJLnKTWv_EjS0_WI8gneGlFEbjTS0sTOC60m8fktNupMbAtLsnffh3FpmdV2nRNLsIpJm-fE8ICsshHSNz3toEXxHllKApFU5n4goCaNFrL48G72njowqs2kiCo8qeOtFBwz3dU_0xpuIQIQ';

    socket.on('connect', function () {
        console.log("connecting")
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
