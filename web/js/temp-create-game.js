'use strict';

import { get_username } from './cognitoclient.js';
import { PATH_GAME, QUERY_PARAMS_GAME_ID } from './constants.js';
import { start_new_game } from './moves-rest-client.js';

// io is imported from external script

const onload = async () => {
	const user_id = get_username();
	console.log('[user_id: %o]', user_id);

	if (!user_id) {
		alert('devi loggarti');
		return;
	}

	const jwtStr = localStorage.getItem('xejwt');

	document.querySelector('#username').textContent = user_id;

	const socket = io(document.location.origin + '/xesoft_chat')

	// // each socket message contains ALL users (?)
	// socket.on('room-users-list', (message) => {
	// 	if (message.username !== user_id)
	// 		return;
	//
	// 	const select = document.querySelector('select#friend');
	// 	select.setAttribute('disabled', null);
	// 	for (const nickname of message.users) {
	// 		const option = document.createElement('option');
	// 		option.setAttribute('value', nickname);
	// 		option.textContent = nickname;
	// 		select.appendChild(option);
	// 	}
	// });

	// DARIO START
	var start = new Date();
	const roomID = "partita_TODO";
	socket.on('connect', function () {
		console.log("connecting");
		var index = socket.io.engine.upgrade ? 1 : 0;
		console.log('Connection established in ' + (new Date() - start) + 'msec. ' + 'SocketID: ' + socket.id + '. ' + 'You are using ' + socket.io.engine.transports[index] + '.');
		socket.emit('join', {room: roomID, jwt: jwtStr});
	});
	socket.emit('room-users-list', {
		room: 'partita_TODO',
		jwt: jwtStr,
		msgType: "command"
	});
	$('#room-users-list').click(function () {
		console.log("click room-users-list");
		socket.emit('room-users-list', {
			room: roomID,
			jwt: jwtStr,
			msgType: "command"
		});
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
	});
	socket.on('room-users-list', function (message) {
		console.log("room-users-list: " + message.users);
		// $('#message-room > ul').append('<li>' + message + '</li>');
	});
	socket.on('message', function (data) {
		console.log("message: " + data);
		$('#message-room > ul').append('<li>' + "received msg,  username: " + data.username + " - msg: " + data.message + " - creationDate: " + data.creationDate + " - nickname: " + data.nickname + ' -</li>');
	});
	// DARIO END

	document.querySelector('#newgame').addEventListener('submit', async (e) => {
		e.preventDefault();

		const color = document.querySelector('[name=color]').value;
		const opponent = document.querySelector('[name=opponent]').value;
		const friend = document.querySelector('[name=friend]').value;
		console.log('[color: %o, opponent: %o, friend: %o]',
			color, opponent, friend);

		const white = color === 'white' ? 'human' : opponent === 'cpu' ? 'cpu' : 'human';
		const black = color === 'black' ? 'human' : opponent === 'cpu' ? 'cpu' : 'human';
		console.log('[white: %o, black: %o]', white, black);

		const game_id = await start_new_game(user_id, white, black)
		console.log('[game_id: %o]', game_id);

		const game_url = `${PATH_GAME}?${QUERY_PARAMS_GAME_ID}=${game_id}`;
		console.log('[game_url: %o]', game_url);

		socket.emit('play_with_me_room', {
			room: 'partita_TODO',
			jwt: jwtStr,
			msgType: 'command',
			nickname: friend,
			link: game_url
		});

		// window.location.assign(game_url);
	});

	// socket.on('message', (data) => {
	// 	const li = document.createElement('li');
	// 	const a = document.createElement('a');
	// 	a.setAttribute('href', data.message);
	// 	li.appendChild(document.createTextNode(`${data.nickname} ti ha invitato: `))
	// 	li.appendChild(a);
	// 	document.querySelector('ul#invitations').appendChild(li);
	// });
	
	socket.on('play_with_me_room', console.error);
};

const main = () => {
	document.addEventListener('DOMContentLoaded', onload);
};

main();
