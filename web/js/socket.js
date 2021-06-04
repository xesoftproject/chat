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

    socket.on('room-manager', function (message) {
        console.log("room-manager: " + message);
    });

    socket.on('connect_failed', function () {
        console.log("Sorry, there seems to be an issue with the connection!");
    })

    socket.on('reconnecting', function () {
        console.log("Trying to reconnecting.....");
    })

    socket.on('reconnected', function () {
        console.log("Now you are connected again.");
    })

    socket.on('errorMsg', function (data) {
        console.log("Error: " + data);
    })
}

export {roomID,jwtStr,socket,socket_onload}