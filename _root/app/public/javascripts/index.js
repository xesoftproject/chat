(function ($) {
    console.log("index started")
    var roomID = '666'; //from jwt
    var username = 'theKiller'; //choose at login stage by the user
    var socket = io(document.location.origin + '/xesoft_chat');
    console.log(`document.location.origin: ${document.location.origin}`)
    var start = new Date();
    var jwtStr = localStorage.getItem("xejwt");
    console.log("xejwt: "+jwtStr);
    // var jwtStr = 'eyJraWQiOiJucmNod0ZQNzZaNXdJMzJrbXVwOW80UHozaHQxbit0OXlpMER3RUhWWXhZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzOGMyNTEyOC1jNzFkLTQ2NWItYjFiMi1jMjMxYTExMmQ0M2MiLCJhdWQiOiI2dmxpZ3RxdW84OGZndWo3ZTVkc3I2bWxtaiIsImV2ZW50X2lkIjoiNGZkNjc5MzAtN2JjYS00ZjBjLTkxNDktMWZjZjNhMDkwNzg3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MTQyMzkxMDAsInByb2ZpbGUiOiJnaW9jYXRvcmUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9CT3I2SWFCeEMiLCJuaWNrbmFtZSI6ImtpbGxlciIsImNvZ25pdG86dXNlcm5hbWUiOiJkYXJpby5icmFtYmlsbGFAZmluY29uc2dyb3VwLmNvbSIsImV4cCI6MTYxNDI0MjcwMCwiaWF0IjoxNjE0MjM5MTAwLCJlbWFpbCI6ImRhcmlvLmJyYW1iaWxsYUBmaW5jb25zZ3JvdXAuY29tIn0.EfGY84O9Hx4R-hJwwO_hmlN_wD0DscfhTjMqQOz0iGSOtGDFnWewuQhQVcAeSYEF92hUHlT9Mg9oiP-6pUWh4619mDfbY0Ts3h7upTV2YpNlBODqNW2QEn0eLvUQuZalcVHoX4QFxNWqa9RuIrAPwWr86iZ018Ig7uqbFRT1mw9EBgtRDWVjXs6j_YddozZpPNX9pqx1A2hjnaIO8o2jDPwVy7zqEZRQ3yQrIG4hO4oUAVgc1W0Cs4RblC8uC_Hl9kW-llKcWcaeswupWf3g28sz5ZSOoGXD7Z1Z4EWph1mKYqQaD3ge9DL8eEBrkuBUF16Kkpe6dL_E5MOuHBMLcA';

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
