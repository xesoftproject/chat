(function ($) {
	console.log("index started")
	var socket = io(document.location.origin + '/xesoft_chat');
	console.log(`document.location.origin: ${document.location.origin}`)
	var start = new Date();
	var jwtStr = localStorage.getItem("xejwt");
	var roomID = document.getElementById("roomID").getAttribute("data-roomID");

	console.log("xejwt: " + jwtStr);

	socket.on('connect', function () {
		console.log("connecting")
		var index = socket.io.engine.upgrade ? 1 : 0;
		console.log('Connection established in ' + (new Date() - start) + 'msec. ' +
			'SocketID: ' + socket.id + '. ' +
			'You are using ' + socket.io.engine.transports[index] + '.');
		socket.emit('join', {room: roomID, jwt: jwtStr});
	});

	socket.on('history', function (data) {
		console.log("history: ");
		data.Items.forEach(function (element, index, array) {
			console.log(element);
		});
	});

	socket.on('message', function (data) {
		console.log("message: " + data);
		$('#message-room > ul').append('<li>' + "received msg,  username: " + data.username + " - msg: " + data.message + " - creationDate: " + data.creationDate + " - nickname: " + data.nickname + ' -</li>');
	});

	socket.on('room-manager', function (message) {
		console.log("room-manager: " + message);
		$('#message-room > ul').append('<li>' + message + '</li>');
	});

	socket.on('room-users-list', function (message) {
		console.log("room-users-list: " + message.users);
		// $('#message-room > ul').append('<li>' + message + '</li>');
	});

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

	$('#play_with_me_room').click(function () {
		var player = $('#player').val();
		console.log("click play_with_me_room");
		socket.emit('play_with_me_room', {
			room: roomID,
			jwt: jwtStr,
			msgType: "command",
			nickname: player,
			link: "www.ilmeteo.it"
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
		console.log("Error code: " + data.code);
		console.log("Error msg: " + data.message);
	})

	// socket.leave(roomID);

}(jQuery));
